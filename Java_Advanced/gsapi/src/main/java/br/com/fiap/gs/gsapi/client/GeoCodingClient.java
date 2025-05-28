package br.com.fiap.gs.gsapi.client;

import br.com.fiap.gs.gsapi.dto.response.NominatimResponseDTO; // Ajustado para o pacote 'response' anteriormente
import br.com.fiap.gs.gsapi.exception.ServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;

@Component
public class GeoCodingClient {

    private static final Logger logger = LoggerFactory.getLogger(GeoCodingClient.class);
    private final RestTemplate restTemplate;

    @Value("${nominatim.api.url:https://nominatim.openstreetmap.org/search}")
    private String nominatimApiUrl;

    @Value("${app.geocoding.user-agent:GSAPI_Fiap_Project/1.0 (seuemail@example.com)}")
    private String userAgent;

    @Autowired
    public GeoCodingClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<NominatimResponseDTO> buscarCoordenadasPorEndereco(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Query de endereço não pode ser nula ou vazia.");
        }

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(nominatimApiUrl)
                .queryParam("q", query)
                .queryParam("format", "jsonv2")
                .queryParam("addressdetails", 1)
                .queryParam("limit", 3) // Limita a 3 resultados, pegaremos o mais relevante
                .queryParam("countrycodes", "br"); // <-- ADICIONADO para restringir ao Brasil

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("User-Agent", userAgent); // Essencial para Nominatim

        HttpEntity<String> entity = new HttpEntity<>(headers);
        String url = uriBuilder.toUriString();
        logger.info("Consultando Nominatim: {}", url);

        try {
            ResponseEntity<List<NominatimResponseDTO>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<NominatimResponseDTO>>() {});

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Resposta do Nominatim para query '{}': {} resultados", query, response.getBody().size());
                return response.getBody();
            } else {
                logger.error("Erro ao consultar Nominatim para query '{}'. Status: {}", query, response.getStatusCode());
                throw new ServiceUnavailableException("Serviço Nominatim retornou status: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            logger.error("Erro HTTP ao consultar Nominatim para query '{}': {} - {}", query, e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new ServiceUnavailableException("Erro ao comunicar com o serviço Nominatim: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Erro inesperado ao consultar Nominatim para query '{}': {}", query, e.getMessage(), e);
            throw new ServiceUnavailableException("Erro inesperado ao processar consulta ao Nominatim.", e);
        }
    }
}