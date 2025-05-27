// Pacote: br.com.fiap.gs.gsapi.config
package br.com.fiap.gs.gsapi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Classe de configuração do Springdoc OpenAPI para definir as informações detalhadas da API.
 * Isso inclui título, versão, descrição, informações de contato e licença,
 * que serão exibidos na interface do Swagger UI.
 */
@Configuration
public class OpenApiConfig {

    private static final Logger log = LoggerFactory.getLogger(OpenApiConfig.class);

    // Você pode injetar valores do application.properties se precisar
    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${server.servlet.context-path:}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        log.info("🔧 Configuração personalizada do OpenAPI inicializada.");

        // Constrói a URL base do servidor dinamicamente
        String serverUrl = "http://localhost:" + serverPort + (contextPath != null ? contextPath : "");

        return new OpenAPI()
                .info(new Info()
                        .title("GS API - Alertas de Desastres Naturais") // Título da sua API
                        .version("v1.0.0") // Versão da sua API
                        .description("""
                                **API RESTful para o Global Solution FIAP 2025**

                                Esta API fornece funcionalidades para consulta de informações sobre desastres naturais
                                e gerenciamento de alertas para usuários com base em sua localização.
                                Integração com a API EONET da NASA e serviços de geolocalização.

                                **Funcionalidades Principais:**
                                - Cadastro e gerenciamento de clientes e seus endereços.
                                - Consulta de eventos de desastres naturais (via EONET).
                                - Associação de eventos de desastres a endereços de clientes.
                                - Visualização de alertas em mapas (a ser implementado no frontend).
                                """)
                        .contact(new Contact()
                                .name("Equipe GS API") // Nome da sua equipe ou seu nome
                                .email("seu-email@fiap.com.br") // Seu email de contato
                                .url("https://github.com/seu-usuario/gs-api-repo") // URL do seu projeto no GitHub
                        )
                        .license(new License()
                                .name("Apache 2.0") // Ou a licença que você escolher
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")
                        )
                )
                .servers(List.of(
                        new Server().url(serverUrl).description("Servidor Local de Desenvolvimento")
                        // Você pode adicionar outros servidores aqui (ex: homologação, produção)
                        // new Server().url("https://api.seudominio.com/gsapi").description("Servidor de Produção")
                ));
    }
}
