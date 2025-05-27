// Pacote: br.com.fiap.gs.gsapi.repository
package br.com.fiap.gs.gsapi.repository;

import br.com.fiap.gs.gsapi.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // IMPORTADO
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContatoRepository extends JpaRepository<Contato, Long>, JpaSpecificationExecutor<Contato> { // ADICIONADO

    Optional<Contato> findByEmail(String email);
}