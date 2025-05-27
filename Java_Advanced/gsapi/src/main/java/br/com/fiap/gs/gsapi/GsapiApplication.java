package br.com.fiap.gs.gsapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching; // Import para habilitar o cache
// import org.springframework.data.jpa.repository.config.EnableJpaAuditing; // Opcional: para auditoria

@SpringBootApplication
@EnableCaching // Habilita o suporte a cache do Spring
// @EnableJpaAuditing // Descomente se for usar auditoria JPA (ex: @CreatedDate, @LastModifiedDate)
public class GsapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(GsapiApplication.class, args);
	}

}
