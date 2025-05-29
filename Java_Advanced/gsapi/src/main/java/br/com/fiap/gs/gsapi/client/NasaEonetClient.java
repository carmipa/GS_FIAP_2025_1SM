// Arquivo: src/main/java/br/com/fiap/gs/gsapi/client/NasaEonetClient.java
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
import org.springframework.util.StringUtils; // Para StringUtils.hasText
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

    @Autowired
    public NasaEonetClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    // ***** MÉTODO MODIFICADO PARA INCLUIR startDate e endDate *****
    public NasaEonetApiResponseDTO getEvents(Integer limit, Integer days, String status, String source, String bbox, String startDate, String endDate) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(eonetApiUrl);

        if (limit != null && limit > 0) {
            uriBuilder.queryParam("limit", limit);
        }

        // Se startDate e endDate forem fornecidos, 'days' geralmente não é usado pela EONET.
        // A API EONET prioriza start/end se ambos 'days' e 'start'/'end' estiverem presentes.
        if (StringUtils.hasText(startDate)) {
            uriBuilder.queryParam("start", startDate);
        }
        if (StringUtils.hasText(endDate)) {
            uriBuilder.queryParam("end", endDate);
        }
        // Se start/end não forem usados, então 'days' pode ser aplicado.
        // Se start/end forem fornecidos, o parâmetro 'days' pode ser ignorado pela EONET ou causar comportamento inesperado.
        // Para ser seguro, só adicionamos 'days' se start e end não estiverem definidos.
        else if (days != null && days > 0) {
            uriBuilder.queryParam("days", days);
        }

        if (StringUtils.hasText(status)) {
            uriBuilder.queryParam("status", status);
        }
        if (StringUtils.hasText(source)) {
            uriBuilder.queryParam("source", source);
        }
        if (StringUtils.hasText(bbox)) {
            uriBuilder.queryParam("bbox", bbox);
        }

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
    // ***** FIM DA MODIFICAÇÃO *****

    public String convertEventDtoToJsonString(NasaEonetEventDTO eventDto) {
        try {
            return objectMapper.writeValueAsString(eventDto);
        } catch (Exception e) {
            logger.error("Erro ao serializar NasaEonetEventDTO para JSON String: ID {}", eventDto != null ? eventDto.getId() : "null", e);
            return "{\"error\":\"Falha ao serializar evento para JSON\"}";
        }
    }
}