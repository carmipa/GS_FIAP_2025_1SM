// Pacote: br.com.fiap.gs.gsapi.repository
package br.com.fiap.gs.gsapi.repository;

import br.com.fiap.gs.gsapi.model.EonetEventos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface EonetEventoRepository extends JpaRepository<EonetEventos, Long> {

    // Busca pelo ID original da API EONET (que é único)
    Optional<EonetEventos> findByEonetApiId(String eonetApiId);

    // Exemplo de busca por eventos dentro de um período de data (usando a coluna 'data' da sua tabela)
    Page<EonetEventos> findByDataBetween(Instant dataInicio, Instant dataFim, Pageable pageable);

    // Exemplo de como você poderia buscar eventos cujo JSON contenha um certo título
    // ATENÇÃO: Buscas diretas em CLOB JSON podem ser menos performáticas.
    // O ideal é ter campos extraídos e indexados para filtros comuns.
    // Esta é uma query nativa para Oracle como exemplo, pode precisar de ajustes.
    @Query(value = "SELECT * FROM gs_eonet e WHERE JSON_VALUE(e.json, '$.title') LIKE %:titulo%", nativeQuery = true)
    Page<EonetEventos> findByJsonTitleContaining(@Param("titulo") String titulo, Pageable pageable);

}
