package br.com.fiap.gs.gsapi.service;

import br.com.fiap.gs.gsapi.client.GeoCodingClient;
import br.com.fiap.gs.gsapi.client.ViaCepClient;
import br.com.fiap.gs.gsapi.dto.response.NominatimResponseDTO;
import br.com.fiap.gs.gsapi.dto.response.ViaCepResponseDTO;
import br.com.fiap.gs.gsapi.dto.request.EnderecoGeoRequestDTO;
import br.com.fiap.gs.gsapi.dto.request.EnderecoRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.EnderecoResponseDTO;
import br.com.fiap.gs.gsapi.dto.response.GeoCoordinatesDTO;
import br.com.fiap.gs.gsapi.exception.ResourceNotFoundException;
import br.com.fiap.gs.gsapi.exception.ServiceUnavailableException;
import br.com.fiap.gs.gsapi.mapper.EnderecoMapper;
import br.com.fiap.gs.gsapi.model.Endereco;
import br.com.fiap.gs.gsapi.repository.EnderecoRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map; // Para o mapa de UF para Nome do Estado

@Service
public class EnderecoService {

    private static final Logger logger = LoggerFactory.getLogger(EnderecoService.class);

    private final EnderecoRepository enderecoRepository;
    private final EnderecoMapper enderecoMapper;
    private final ViaCepClient viaCepClient;
    private final GeoCodingClient geoCodingClient;

    // Mapa simples para converter UF para nome do estado (pode ser expandido ou externalizado)
    private static final Map<String, String> UF_PARA_NOME_ESTADO = Map.ofEntries(
            Map.entry("SP", "São Paulo"),
            Map.entry("RJ", "Rio de Janeiro"),
            Map.entry("MG", "Minas Gerais")
            // Adicione outros estados conforme necessário
    );

    @Autowired
    public EnderecoService(EnderecoRepository enderecoRepository,
                           EnderecoMapper enderecoMapper,
                           ViaCepClient viaCepClient,
                           GeoCodingClient geoCodingClient) {
        this.enderecoRepository = enderecoRepository;
        this.enderecoMapper = enderecoMapper;
        this.viaCepClient = viaCepClient;
        this.geoCodingClient = geoCodingClient;
    }

    // ... (métodos listarTodos, buscarPorId, criarEndereco, atualizarEndereco, deletarEndereco, formatarCep, consultarDadosPorCep - permanecem os mesmos da última versão) ...
    @Transactional(readOnly = true)
    @Cacheable(value = "enderecos", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()")
    public Page<EnderecoResponseDTO> listarTodos(Pageable pageable) {
        Page<Endereco> enderecosPage = enderecoRepository.findAll(pageable);
        return enderecosPage.map(enderecoMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "enderecoById", key = "#id")
    public EnderecoResponseDTO buscarPorId(Long id) {
        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado com o ID: " + id));
        return enderecoMapper.toResponseDTO(endereco);
    }

    @Transactional
    @CacheEvict(value = {"enderecos", "enderecoById", "enderecosPorCep"}, allEntries = true)
    public EnderecoResponseDTO criarEndereco(EnderecoRequestDTO enderecoRequestDTO) {
        Endereco endereco = enderecoMapper.toEntity(enderecoRequestDTO);
        endereco.setCep(formatarCep(endereco.getCep()));
        if (endereco.getUf() != null) {
            endereco.setUf(endereco.getUf().toUpperCase());
        }
        if (enderecoRequestDTO.getLatitude() == null || enderecoRequestDTO.getLongitude() == null || enderecoRequestDTO.getLatitude() == 0 || enderecoRequestDTO.getLongitude() == 0) {
            throw new IllegalArgumentException("Latitude e Longitude são obrigatórias e devem ser válidas para criar um endereço.");
        }
        Endereco enderecoSalvo = enderecoRepository.save(endereco);
        return enderecoMapper.toResponseDTO(enderecoSalvo);
    }

    @Transactional
    @CachePut(value = "enderecoById", key = "#id")
    @CacheEvict(value = {"enderecos", "enderecosPorCep"}, allEntries = true)
    public EnderecoResponseDTO atualizarEndereco(Long id, EnderecoRequestDTO enderecoRequestDTO) {
        Endereco enderecoExistente = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado com o ID: " + id));
        enderecoExistente.setCep(formatarCep(enderecoRequestDTO.getCep()));
        enderecoExistente.setNumero(enderecoRequestDTO.getNumero());
        enderecoExistente.setLogradouro(enderecoRequestDTO.getLogradouro());
        enderecoExistente.setBairro(enderecoRequestDTO.getBairro());
        enderecoExistente.setLocalidade(enderecoRequestDTO.getLocalidade());
        if (enderecoRequestDTO.getUf() != null) {
            enderecoExistente.setUf(enderecoRequestDTO.getUf().toUpperCase());
        }
        enderecoExistente.setComplemento(enderecoRequestDTO.getComplemento());
        if (enderecoRequestDTO.getLatitude() == null || enderecoRequestDTO.getLongitude() == null || enderecoRequestDTO.getLatitude() == 0 || enderecoRequestDTO.getLongitude() == 0) {
            throw new IllegalArgumentException("Latitude e Longitude são obrigatórias e devem ser válidas para atualizar um endereço.");
        }
        enderecoExistente.setLatitude(enderecoRequestDTO.getLatitude());
        enderecoExistente.setLongitude(enderecoRequestDTO.getLongitude());
        Endereco enderecoAtualizado = enderecoRepository.save(enderecoExistente);
        return enderecoMapper.toResponseDTO(enderecoAtualizado);
    }

    @Transactional
    @CacheEvict(value = {"enderecos", "enderecoById", "enderecosPorCep"}, allEntries = true)
    public void deletarEndereco(Long id) {
        if (!enderecoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Endereço não encontrado com o ID: " + id);
        }
        enderecoRepository.deleteById(id);
    }

    private String formatarCep(String cep) {
        if (cep != null) {
            return cep.replaceAll("[^0-9]", "");
        }
        return null;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "viacepConsulta", key = "#cep")
    public ViaCepResponseDTO consultarDadosPorCep(String cep) {
        String cepFormatado = formatarCep(cep);
        if (cepFormatado == null || cepFormatado.length() != 8) {
            throw new IllegalArgumentException("Formato de CEP inválido. Use 8 dígitos numéricos.");
        }
        ViaCepResponseDTO viaCepData = viaCepClient.buscarEnderecoPorCep(cepFormatado);
        if (viaCepData == null || viaCepData.isErro()) {
            throw new ResourceNotFoundException("CEP " + cepFormatado + " não encontrado ou inválido.");
        }
        return viaCepData;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "geoCoordenadas", key = "#enderecoGeoRequestDTO.toString()")
    public GeoCoordinatesDTO calcularCoordenadasPorEndereco(EnderecoGeoRequestDTO enderecoGeoRequestDTO) {
        List<String> queryParts = new ArrayList<>();
        String query;
        boolean tentativaDetalhadaFeita = false;

        if (StringUtils.hasText(enderecoGeoRequestDTO.getLogradouro()) &&
                StringUtils.hasText(enderecoGeoRequestDTO.getNumero()) &&
                StringUtils.hasText(enderecoGeoRequestDTO.getCidade()) &&
                StringUtils.hasText(enderecoGeoRequestDTO.getUf())) {

            queryParts.add(enderecoGeoRequestDTO.getLogradouro());
            queryParts.add(enderecoGeoRequestDTO.getNumero());
            if (StringUtils.hasText(enderecoGeoRequestDTO.getBairro()) &&
                    (enderecoGeoRequestDTO.getLogradouro() == null || !enderecoGeoRequestDTO.getLogradouro().toLowerCase().contains(enderecoGeoRequestDTO.getBairro().toLowerCase()))) {
                queryParts.add(enderecoGeoRequestDTO.getBairro());
            }
            queryParts.add(enderecoGeoRequestDTO.getCidade());
            queryParts.add(enderecoGeoRequestDTO.getUf());
            query = String.join(", ", queryParts);
            logger.info("Tentando geocodificação detalhada para query: {}", query);
            tentativaDetalhadaFeita = true;
        } else if (StringUtils.hasText(enderecoGeoRequestDTO.getCidade()) &&
                StringUtils.hasText(enderecoGeoRequestDTO.getUf())) {
            String nomeEstado = UF_PARA_NOME_ESTADO.getOrDefault(enderecoGeoRequestDTO.getUf().toUpperCase(), enderecoGeoRequestDTO.getUf());
            queryParts.add(enderecoGeoRequestDTO.getCidade());
            queryParts.add(nomeEstado); // Usa nome do estado por extenso
            queryParts.add("Brasil");   // Adiciona país
            query = String.join(", ", queryParts);
            logger.info("Tentando geocodificação por cidade/estado/país para query: {}", query);
        } else {
            throw new IllegalArgumentException("Dados insuficientes para geocodificação. Requer (Logradouro, Número, Cidade e UF) OU (Cidade e UF).");
        }

        List<NominatimResponseDTO> nominatimResults = geoCodingClient.buscarCoordenadasPorEndereco(query);

        // Fallback para cidade/estado/país se a busca detalhada falhou e ainda não foi tentada
        if ((nominatimResults == null || nominatimResults.isEmpty()) && tentativaDetalhadaFeita &&
                StringUtils.hasText(enderecoGeoRequestDTO.getCidade()) && StringUtils.hasText(enderecoGeoRequestDTO.getUf())) {

            queryParts.clear();
            String nomeEstado = UF_PARA_NOME_ESTADO.getOrDefault(enderecoGeoRequestDTO.getUf().toUpperCase(), enderecoGeoRequestDTO.getUf());
            queryParts.add(enderecoGeoRequestDTO.getCidade());
            queryParts.add(nomeEstado);
            queryParts.add("Brasil");
            query = String.join(", ", queryParts);
            logger.info("Busca detalhada falhou. Tentando fallback por cidade/estado/país para query: {}", query);
            nominatimResults = geoCodingClient.buscarCoordenadasPorEndereco(query);
        }

        if (nominatimResults == null || nominatimResults.isEmpty()) {
            logger.warn("Nenhum resultado da geocodificação para a query final: {}", query);
            throw new ResourceNotFoundException("Não foi possível encontrar coordenadas para os dados de endereço fornecidos.");
        }

        NominatimResponseDTO bestResult = nominatimResults.get(0);
        try {
            double latitude = Double.parseDouble(bestResult.getLatitude());
            double longitude = Double.parseDouble(bestResult.getLongitude());
            logger.info("Coordenadas encontradas para query '{}': Lat={}, Lon={}, Endereço Encontrado='{}'",
                    query, latitude, longitude, bestResult.getDisplayName());
            return new GeoCoordinatesDTO(latitude, longitude, bestResult.getDisplayName());
        } catch (NumberFormatException e) {
            logger.error("Erro ao converter lat/lon do Nominatim para double: lat={}, lon={}",
                    bestResult.getLatitude(), bestResult.getLongitude(), e);
            throw new ServiceUnavailableException("Formato de coordenadas inválido retornado pelo serviço de geocodificação.");
        }
    }
}