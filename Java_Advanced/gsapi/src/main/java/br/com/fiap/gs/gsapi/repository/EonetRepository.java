package br.com.fiap.gs.gsapi.repository;

import br.com.fiap.gs.gsapi.model.Eonet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EonetRepository extends JpaRepository<Eonet, Long> {

    /**
     * Busca um evento EONET pelo seu ID único da API externa.
     * @param eonetIdApi O ID do evento fornecido pela API EONET.
     * @return Um Optional contendo o evento se encontrado.
     */
    Optional<Eonet> findByEonetIdApi(String eonetIdApi);

    /**
     * Busca eventos EONET dentro de um intervalo de datas.
     * @param dataInicial Data inicial do intervalo.
     * @param dataFinal Data final do intervalo.
     * @return Uma lista de eventos EONET dentro do intervalo especificado.
     */
    List<Eonet> findByDataBetween(OffsetDateTime dataInicial, OffsetDateTime dataFinal);
}