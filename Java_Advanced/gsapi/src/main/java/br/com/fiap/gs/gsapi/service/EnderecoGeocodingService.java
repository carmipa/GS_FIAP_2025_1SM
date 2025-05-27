// Pacote: br.com.fiap.gs.gsapi.service
package br.com.fiap.gs.gsapi.service;

import br.com.fiap.gs.gsapi.client.NominatimClient;
import br.com.fiap.gs.gsapi.client.ViaCepClient;
import br.com.fiap.gs.gsapi.dto.geocoding.NominatimResponseDTO;
import br.com.fiap.gs.gsapi.dto.viacep.ViaCepResponseDTO;
import br.com.fiap.gs.gsapi.model.Endereco;
import br.com.fiap.gs.gsapi.repository.EnderecoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal; // IMPORTAR
import java.util.Optional;

@Service
public class EnderecoGeocodingService {

    private static final Logger logger = LoggerFactory.getLogger(EnderecoGeocodingService.class);
    private final ViaCepClient viaCepClient;
    private final NominatimClient nominatimClient;
    private final EnderecoRepository enderecoRepository;

    @Autowired
    public EnderecoGeocodingService(ViaCepClient viaCepClient,
                                    NominatimClient nominatimClient,
                                    EnderecoRepository enderecoRepository) {
        this.viaCepClient = viaCepClient;
        this.nominatimClient = nominatimClient;
        this.enderecoRepository = enderecoRepository;
    }

    @Transactional
    public Optional<Endereco> obterOuCriarEnderecoCompleto(String cep, String numeroStr, String complemento) {
        String cepNumerico = cep.replaceAll("[^0-9]", "");
        int numeroParsed = parseNumero(numeroStr); // Parse o número uma vez

        Optional<Endereco> enderecoExistente = enderecoRepository.findByCepAndNumero(cepNumerico, numeroParsed);

        // Se já existe e TEM coordenadas, atualiza o complemento se necessário e retorna.
        if (enderecoExistente.isPresent() &&
                enderecoExistente.get().getLatitude() != null &&
                enderecoExistente.get().getLongitude() != null &&
                // Checa se as coordenadas não são zero (ou algum valor placeholder)
                !(enderecoExistente.get().getLatitude().compareTo(BigDecimal.ZERO) == 0 &&
                        enderecoExistente.get().getLongitude().compareTo(BigDecimal.ZERO) == 0)
        ) {
            logger.info("Endereço encontrado no banco com coordenadas para CEP {} e Número {}. ID: {}", cepNumerico, numeroStr, enderecoExistente.get().getIdEndereco());
            // Atualiza o complemento se mudou
            boolean modificado = false;
            if (complemento != null && !complemento.equals(enderecoExistente.get().getComplemento())) {
                enderecoExistente.get().setComplemento(complemento);
                modificado = true;
            } else if (complemento == null && enderecoExistente.get().getComplemento() != null && !enderecoExistente.get().getComplemento().isEmpty()) {
                // Se complemento veio nulo mas existia algo, define para vazio ou mantém. Aqui define para vazio.
                enderecoExistente.get().setComplemento("");
                modificado = true;
            }

            if (modificado) {
                return Optional.of(enderecoRepository.save(enderecoExistente.get()));
            }
            return enderecoExistente;
        }

        logger.info("Buscando dados no ViaCEP para CEP: {}", cepNumerico);
        ViaCepResponseDTO viaCepData = viaCepClient.buscarEnderecoPorCep(cepNumerico);
        if (viaCepData == null || (viaCepData.isErro() && viaCepData.getCep() == null) ) { // ViaCEP pode retornar erro:true ou tudo nulo
            logger.warn("Não foi possível obter dados do ViaCEP para o CEP: {}", cepNumerico);
            // Se o endereço já existia (mas sem coordenadas), e o ViaCEP falhou, o que fazer?
            // Poderíamos retornar o existente sem coordenadas, ou empty.
            // Por ora, se ViaCEP falhar e não tivermos dados base, retornamos empty.
            return enderecoExistente.isPresent() ? enderecoExistente : Optional.empty();
        }

        Endereco enderecoParaSalvar = enderecoExistente.orElseGet(Endereco::new);
        mapearViaCepParaEndereco(viaCepData, numeroParsed, complemento, enderecoParaSalvar);

        // Se já tínhamos um endereço (mesmo sem lat/lon), e o ViaCEP retornou dados,
        // e esses dados são diferentes do que já tínhamos (exceto lat/lon), atualizamos.
        // Essa lógica de "merge" pode ser complexa. Por ora, o mapearViaCepParaEndereco sobrescreve.

        // Tenta obter coordenadas do Nominatim
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("Thread interrompida enquanto esperava para chamar Nominatim.", e);
        }

        NominatimResponseDTO nominatimResponse = nominatimClient.buscarCoordenadasPorEndereco(
                enderecoParaSalvar.getLogradouro(),
                String.valueOf(enderecoParaSalvar.getNumero()),
                enderecoParaSalvar.getBairro(),
                enderecoParaSalvar.getLocalidade(),
                enderecoParaSalvar.getUf(),
                enderecoParaSalvar.getCep()
        ).blockFirst();

        if (nominatimResponse != null && nominatimResponse.getLatitude() != null && nominatimResponse.getLongitude() != null) {
            try {
                // ALTERADO para new BigDecimal(String)
                enderecoParaSalvar.setLatitude(new BigDecimal(nominatimResponse.getLatitude()));
                enderecoParaSalvar.setLongitude(new BigDecimal(nominatimResponse.getLongitude()));
                logger.info("Coordenadas obtidas do Nominatim para CEP {}: Lat={}, Lon={}", cepNumerico, enderecoParaSalvar.getLatitude(), enderecoParaSalvar.getLongitude());
            } catch (NumberFormatException e) {
                logger.error("Erro ao converter coordenadas (String) do Nominatim para BigDecimal: Lat='{}', Lon='{}'",
                        nominatimResponse.getLatitude(), nominatimResponse.getLongitude(), e);
                // Define como null ou mantém anterior se houver, ou lança erro se coordenadas são mandatórias.
                // Se o endereço já tinha lat/lon (improvável neste fluxo), não sobrescrever com nulo.
                // Se o DDL/entidade permite lat/lon nulos, pode-se setar para null aqui.
                // Como a entidade tem nullable=false, não podemos setar para null.
                // Uma opção é deixar como estava se já existia, ou usar ZERO (se fizer sentido),
                // ou propagar o erro para indicar que a geocodificação falhou.
                // Por ora, se falhar o parse, as coordenadas não serão atualizadas a partir do Nominatim.
                if (enderecoParaSalvar.getLatitude() == null) enderecoParaSalvar.setLatitude(BigDecimal.ZERO); // Placeholder se for obrigatório
                if (enderecoParaSalvar.getLongitude() == null) enderecoParaSalvar.setLongitude(BigDecimal.ZERO); // Placeholder se for obrigatório
            }
        } else {
            logger.warn("Não foi possível obter coordenadas do Nominatim para o endereço do CEP: {}. Usando ZERO como placeholder se obrigatório.", cepNumerico);
            // Se coordenadas são obrigatórias na entidade (nullable=false), precisamos setar algo.
            if (enderecoParaSalvar.getLatitude() == null) enderecoParaSalvar.setLatitude(BigDecimal.ZERO);
            if (enderecoParaSalvar.getLongitude() == null) enderecoParaSalvar.setLongitude(BigDecimal.ZERO);
        }

        // Garantir que lat/lon não sejam nulos se a entidade exige (como é o caso)
        if (enderecoParaSalvar.getLatitude() == null) {
            logger.warn("Latitude ainda é nula para CEP {}, definindo para ZERO como fallback.", cepNumerico);
            enderecoParaSalvar.setLatitude(BigDecimal.ZERO);
        }
        if (enderecoParaSalvar.getLongitude() == null) {
            logger.warn("Longitude ainda é nula para CEP {}, definindo para ZERO como fallback.", cepNumerico);
            enderecoParaSalvar.setLongitude(BigDecimal.ZERO);
        }


        try {
            Endereco enderecoSalvo = enderecoRepository.save(enderecoParaSalvar);
            return Optional.of(enderecoSalvo);
        } catch (Exception e) {
            logger.error("Erro ao salvar endereço para CEP {}: {}", cepNumerico, e.getMessage(), e);
            return Optional.empty();
        }
    }

    private void mapearViaCepParaEndereco(ViaCepResponseDTO viaCepData, int numero, String complemento, Endereco endereco) {
        if (viaCepData.getCep() != null) endereco.setCep(viaCepData.getCep().replaceAll("[^0-9]", ""));
        if (viaCepData.getLogradouro() != null) endereco.setLogradouro(viaCepData.getLogradouro()); else if (endereco.getLogradouro() == null) endereco.setLogradouro("");
        if (viaCepData.getBairro() != null) endereco.setBairro(viaCepData.getBairro()); else if (endereco.getBairro() == null) endereco.setBairro("");
        if (viaCepData.getLocalidade() != null) endereco.setLocalidade(viaCepData.getLocalidade()); else if (endereco.getLocalidade() == null) endereco.setLocalidade("");
        if (viaCepData.getUf() != null) endereco.setUf(viaCepData.getUf()); else if (endereco.getUf() == null) endereco.setUf("");

        endereco.setNumero(numero); // Número vem do parâmetro

        // Lógica para complemento
        if (complemento != null) {
            endereco.setComplemento(complemento);
        } else if (viaCepData.getComplemento() != null) {
            endereco.setComplemento(viaCepData.getComplemento());
        } else if (endereco.getComplemento() == null) { // Só define para "" se for nulo
            endereco.setComplemento("");
        }
        // Se DDL exige complemento NOT NULL, "" é uma forma de satisfazer.
    }

    private int parseNumero(String numeroStr) {
        if (numeroStr == null || numeroStr.trim().isEmpty()) {
            logger.warn("Número de endereço nulo ou vazio fornecido. Retornando 0.");
            return 0; // Ou lançar IllegalArgumentException se número for obrigatório
        }
        try {
            return Integer.parseInt(numeroStr.replaceAll("[^0-9]", ""));
        } catch (NumberFormatException e) {
            logger.warn("Número de endereço inválido fornecido: '{}'. Usando 0.", numeroStr, e);
            return 0; // Ou lançar IllegalArgumentException
        }
    }
}