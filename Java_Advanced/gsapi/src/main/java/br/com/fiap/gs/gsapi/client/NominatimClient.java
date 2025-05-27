// Pacote: br.com.fiap.gs.gsapi.client
package br.com.fiap.gs.gsapi.client;

import br.com.fiap.gs.gsapi.dto.geocoding.NominatimResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.util.retry.Retry;

import java.time.Duration;

@Component
public class NominatimClient {

    private static final Logger logger = LoggerFactory.getLogger(NominatimClient.class);
    private final WebClient webClient;

    // Configure no application.properties: app.geocoding.user-agent=SuaApp/1.0 (seu.email@example.com)
    // É OBRIGATÓRIO para Nominatim.
    @Value("${app.geocoding.user-agent:GSAPIDefaultApp/1.0 (fiap.gs@example.com)}")
    private String userAgent;

    private static final String NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

    @Autowired
    public NominatimClient(WebClient.Builder webClientBuilder) {
        // O User-Agent será definido no momento da requisição para garantir que o valor de @Value seja injetado
        this.webClient = webClientBuilder.baseUrl(NOMINATIM_BASE_URL).build();
    }

    public Flux<NominatimResponseDTO> buscarCoordenadasPorEndereco(String logradouro, String numero, String bairro, String cidade, String estado, String cep) {
        // Monta a query string de forma mais estruturada.
        // A API do Nominatim é sensível à formatação da query.
        // Usar parâmetros separados pode ser mais eficaz do que uma string única 'q'.
        logger.info("Buscando coordenadas no Nominatim para: Rua='{}', Num='{}', Bairro='{}', Cidade='{}', Estado='{}', CEP='{}'",
                logradouro, numero, bairro, cidade, estado, cep);
        logger.info("Usando User-Agent para Nominatim: {}", this.userAgent);

        return this.webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/search")
                        // Parâmetros de busca estruturada
                        .queryParam("street", (numero != null && !numero.trim().isEmpty() ? numero + " " : "") + logradouro)
                        .queryParam("city", cidade)
                        .queryParam("county", bairro) // 'county' é frequentemente usado para bairro/distrito no OSM
                        .queryParam("state", estado)
                        .queryParam("country", "Brazil")
                        .queryParam("postalcode", cep)
                        // Parâmetros de controle
                        .queryParam("format", "jsonv2") // jsonv2 é geralmente mais consistente
                        .queryParam("addressdetails", "1")
                        .queryParam("limit", "1") // Pega o resultado mais relevante
                        .build())
                .header(HttpHeaders.USER_AGENT, this.userAgent) // Adiciona o User-Agent aqui
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToFlux(NominatimResponseDTO.class)
                .timeout(Duration.ofSeconds(10)) // Timeout para a requisição
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)).maxBackoff(Duration.ofSeconds(5))
                        .filter(throwable -> throwable instanceof WebClientResponseException.TooManyRequests) // Exemplo de retry para 429
                        .doBeforeRetry(retrySignal -> logger.warn("Nominatim API rate limit atingido, tentando novamente... Tentativa {}", retrySignal.totalRetries() + 1))
                )
                .doOnError(WebClientResponseException.class, error ->
                        logger.error("Erro HTTP ao chamar Nominatim API: Status {}, Resposta: {}", error.getStatusCode(), error.getResponseBodyAsString(), error))
                .doOnError(error -> !(error instanceof WebClientResponseException), error -> // Loga outros erros
                        logger.error("Erro inesperado ao chamar Nominatim API: {}", error.getMessage(), error))
                .onErrorResume(error -> {
                    logger.warn("Falha ao buscar coordenadas no Nominatim após tentativas. Retornando vazio.");
                    return Flux.empty(); // Retorna vazio em caso de erro final para não quebrar o fluxo
                });
    }
}
