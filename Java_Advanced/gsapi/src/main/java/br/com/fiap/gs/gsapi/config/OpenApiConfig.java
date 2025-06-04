// Pacote: br.com.fiap.gs.gsapi.config
package br.com.fiap.gs.gsapi.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
// import io.swagger.v3.oas.models.ExternalDocumentation; // Descomente se for usar externalDocs
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Classe de configuração do Springdoc OpenAPI para definir as informações detalhadas da API.
 */
@Configuration
public class OpenApiConfig {

    private static final Logger log = LoggerFactory.getLogger(OpenApiConfig.class);

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${server.servlet.context-path:}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        log.info("🔧 Configuração personalizada do OpenAPI inicializada.");

        String serverUrl = "http://localhost:" + serverPort + contextPath;
        log.info("🔗 URL do Servidor para Swagger UI: {}", serverUrl);

        final String SECURITY_SCHEME_NAME = "bearerAuth";
        final String CONTATO_EMAIL_EQUIPE = "rm557881@fiap.com.br"; // ✅ ATUALIZE AQUI: Email de contato principal da equipe

        return new OpenAPI()
                .info(new Info()
                        .title("GS API - Alertas de Desastres Naturais")
                        .version("v1.0.0")
                        .description(String.format("""
                                **API RESTful para o Global Solution FIAP 2025**
                                Esta API visa fornecer funcionalidades para o gerenciamento e alerta de desastres naturais,
                                utilizando dados da NASA EONET e informações de geolocalização de usuários.
                                
                                ---
                                
                                **FUNCIONALIDADES PRINCIPAIS DA API** ⚙️
                                - Cadastro e gerenciamento de clientes e seus endereços.
                                - Consulta de eventos de desastres naturais (via EONET).
                                - Sincronização de eventos da NASA para o banco de dados local.
                                - Busca de eventos próximos a coordenadas geográficas.
                                - Disparo de alertas para usuários específicos sobre eventos.
                                
                                ---
                                
                                **EQUIPE METAMIND** 👨‍💻

                                - **Paulo André Carminati** (RM: 557881) - GitHub: [carmipa](https://github.com/carmipa)
                                - **Arthur Bispo de Lima** (RM: 557568) - GitHub: [ArthurBispo00](https://github.com/ArthurBispo00)
                                - **João Paulo Moreira** (RM: 557808) - GitHub: [joao1015](https://github.com/joao1015)

                                ---
                                
                                **RECURSOS DO PROJETO** 🛠️

                                - 📦 **Repositório do projeto (API): ** GitHub: [GS_FIAP_2025_1SM](https://github.com/carmipa/GS_FIAP_2025_1SM) 
                                - 📚 **Repositório da matéria (Exemplo):** GitHub: [Java_Advanced](https://github.com/carmipa/GS_FIAP_2025_1SM/tree/main/Java_Advanced) 
                                - 🎬 **Vídeo de Apresentação:** YouTube: ** [Assistir Vídeo](https://youtu.be/j_qpO5N5fVY) 
                                - 📊 **Diagrama de Relcionamento:** Github: ** [link de acesso](https://github.com/carmipa/GS_FIAP_2025_1SM/tree/main/Java_Advanced/DIAGRAMAS) 
                                - 📝 **Documentação:** Github: ** [link de acesso](https://github.com/carmipa/GS_FIAP_2025_1SM/blob/main/Java_Advanced/README.md) 
                                

                                ---
                                **MAIS INFORMAÇÕES** 🔗

                                - 🌐 [Equipe MetaMind - Website](https://github.com/carmipa/GS_FIAP_2025_1SM/tree/main/Java_Advanced/DIAGRAMAS) 
                                - 📧 [Enviar email para Equipe MetaMind](mailto:%s)
                                - 📜 [MIT License](URL_DA_LICENCA_MIT_OU_ARQUIVO_LICENSE_NO_REPO) 
                                - 🎓 [Saiba mais sobre a Global Solution FIAP](https://www.fiap.com.br/graduacao/global-solution/)

                                ---
                                
                                """, CONTATO_EMAIL_EQUIPE)) // Formata o email no link mailto
                        .contact(new Contact()
                                .name("Equipe MetaMind GS")
                                .email(CONTATO_EMAIL_EQUIPE) // Usando a constante definida acima
                                .url("https://github.com/carmipa/GS_FIAP_2025_1SM") // Link principal do projeto ou da equipe
                        )
                        .license(new License()
                                .name("MIT License") // Alterado para MIT conforme imagem, mas confirme qual licença você usa
                                .url("https://opensource.org/licenses/MIT") // URL padrão para MIT License
                        )
                )
                .servers(List.of(
                        new Server().url(serverUrl).description("Servidor Local de Desenvolvimento")
                        // new Server().url("https://sua-api-em-producao.com" + contextPath).description("Servidor de Produção")
                ))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Insira o token JWT no formato: Bearer {seuTokenAqui}. O token pode ser obtido através do endpoint de login.")
                        )
                );
    }
}