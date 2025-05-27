// Pacote: br.com.fiap.gs.gsapi.repository
package br.com.fiap.gs.gsapi.repository;

import br.com.fiap.gs.gsapi.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long>, JpaSpecificationExecutor<Cliente> {

    // Exemplo de busca customizada (se necessário)
    Optional<Cliente> findByDocumento(String documento);

    // JpaSpecificationExecutor já permite buscas dinâmicas com Specifications
    // JpaRepository já oferece:
    // - save, saveAll
    // - findById, findAll, findAllById
    // - delete, deleteAll, deleteById
    // - count
    // - existsById
    // - findAll(Sort sort)
    // - findAll(Pageable pageable) -> para paginação
}
