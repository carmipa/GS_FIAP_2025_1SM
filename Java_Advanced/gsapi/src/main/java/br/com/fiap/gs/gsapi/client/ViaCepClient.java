// Pacote: br.com.fiap.gs.gsapi.client
package br.com.fiap.gs.gsapi.client;

import br.com.fiap.gs.gsapi.dto.viacep.ViaCepResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class ViaCepClient {

    private static final Logger logger = LoggerFactory.getLogger(ViaCepClient.class);
    private final RestTemplate restTemplate;
    private static final String VIA_CEP_URL = "https://viacep.com.br/ws/{cep}/json/";

    @Autowired
    public ViaCepClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ViaCepResponseDTO buscarEnderecoPorCep(String cep) {
        if (cep == null || cep.trim().isEmpty()) {
            logger.warn("Tentativa de buscar CEP nulo ou vazio.");
            return null;
        }
        // Remove caracteres não numéricos do CEP
        String cepNumerico = cep.replaceAll("[^0-9]", "");
        if (cepNumerico.length() != 8) {
            logger.warn("CEP inválido fornecido: '{}'. CEP numérico processado: '{}'. Deve conter 8 dígitos.", cep, cepNumerico);
            return null; // Ou lançar uma exceção de argumento inválido
        }

        try {
            logger.info("Buscando endereço na API ViaCEP para o CEP: {}", cepNumerico);
            ViaCepResponseDTO response = restTemplate.getForObject(VIA_CEP_URL, ViaCepResponseDTO.class, cepNumerico);

            if (response != null && response.isErro()) {
                logger.warn("CEP {} não encontrado ou inválido na API ViaCEP (retornou erro=true).", cepNumerico);
                return null; // CEP não encontrado pela API
            }
            if (response != null && response.getCep() == null) { // Outra forma de ViaCEP indicar erro para CEPs inexistentes
                logger.warn("CEP {} não resultou em dados válidos na API ViaCEP (campos nulos).", cepNumerico);
                return null;
            }

            logger.info("Endereço encontrado para o CEP {}: {}", cepNumerico, (response != null && response.getLocalidade() != null) ? response.getLocalidade() : "N/A");
            return response;
        } catch (HttpClientErrorException e) {
            logger.error("Erro HTTP ao chamar a API ViaCEP para o CEP {}: Status {} - Resposta: {}", cepNumerico, e.getStatusCode(), e.getResponseBodyAsString(), e);
            return null;
        } catch (RestClientException e) {
            logger.error("Erro de conectividade ou outro erro do RestClient ao chamar a API ViaCEP para o CEP {}: {}", cepNumerico, e.getMessage(), e);
            return null;
        } catch (Exception e) {
            logger.error("Erro inesperado ao processar a resposta da API ViaCEP para o CEP {}: {}", cepNumerico, e.getMessage(), e);
            return null;
        }
    }
}
