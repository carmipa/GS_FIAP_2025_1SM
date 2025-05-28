package br.com.fiap.gs.gsapi.client;

import br.com.fiap.gs.gsapi.dto.external.NasaEonetApiResponseDTO;
import br.com.fiap.gs.gsapi.dto.external.NasaEonetEventDTO;
import br.com.fiap.gs.gsapi.exception.ServiceUnavailableException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

@Component
public class NasaEonetClient {

    private static final Logger logger = LoggerFactory.getLogger(NasaEonetClient.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${nasa.eonet.api.url:https://eonet.gsfc.nasa.gov/api/v3/events}")
    private String eonetApiUrl;

    // Se você tiver uma chave API da NASA e a EONET começar a suportá-la ou exigi-la:
    // @Value("${nasa.api.key:#{null}}") // Lê de application.properties, null se não definida
    // private String nasaApiKey;

    @Autowired
    public NasaEonetClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public NasaEonetApiResponseDTO getEvents(Integer limit, Integer days, String status, String source, String bbox) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(eonetApiUrl);

        if (limit != null && limit > 0) {
            uriBuilder.queryParam("limit", limit);
        }
        if (days != null && days > 0) {
            uriBuilder.queryParam("days", days);
        }
        if (status != null && !status.trim().isEmpty()) {
            uriBuilder.queryParam("status", status);
        }
        if (source != null && !source.trim().isEmpty()) {
            uriBuilder.queryParam("source", source);
        }
        if (bbox != null && !bbox.trim().isEmpty()) { // Adicionado parâmetro bbox
            uriBuilder.queryParam("bbox", bbox);
        }
        // Se você for usar uma chave API da NASA:
        // if (nasaApiKey != null && !nasaApiKey.trim().isEmpty()) {
        //     uriBuilder.queryParam("api_key", nasaApiKey);
        // }


        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("User-Agent", "GSAPI_Fiap_Project/1.0");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        String url = uriBuilder.toUriString();
        logger.info("Consultando NASA EONET API: {}", url);

        try {
            ResponseEntity<NasaEonetApiResponseDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    NasaEonetApiResponseDTO.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Resposta da NASA EONET API para '{}': {} eventos retornados.", url,
                        response.getBody().getEvents() != null ? response.getBody().getEvents().size() : 0);
                return response.getBody();
            } else {
                logger.error("Erro ao consultar NASA EONET API. URL: {}, Status: {}", url, response.getStatusCode());
                throw new ServiceUnavailableException("Serviço NASA EONET retornou status: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            logger.error("Erro HTTP ao consultar NASA EONET API. URL: {}, Status: {}, Body: {}", url, e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new ServiceUnavailableException("Erro ao comunicar com o serviço NASA EONET: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Erro inesperado ao consultar NASA EONET API. URL: {}: {}", url, e.getMessage(), e);
            throw new ServiceUnavailableException("Erro inesperado ao processar consulta à NASA EONET.", e);
        }
    }

    public String convertEventDtoToJsonString(NasaEonetEventDTO eventDto) {
        try {
            return objectMapper.writeValueAsString(eventDto);
        } catch (Exception e) {
            logger.error("Erro ao serializar NasaEonetEventDTO para JSON String: ID {}", eventDto != null ? eventDto.getId() : "null", e);
            return "{\"error\":\"Falha ao serializar evento para JSON\"}";
        }
    }
}
