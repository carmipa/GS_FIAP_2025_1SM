// Pacote: br.com.fiap.gs.gsapi.repository
package br.com.fiap.gs.gsapi.repository;

import br.com.fiap.gs.gsapi.model.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // Adicionar se precisar de buscas dinâmicas para Endereco
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long>, JpaSpecificationExecutor<Endereco> { // Adicionado JpaSpecificationExecutor

    // Método para buscar um endereço pelo CEP
    List<Endereco> findByCep(String cep);

    // Método para buscar um endereço pelo CEP e número (NECESSÁRIO PARA EnderecoGeocodingService)
    Optional<Endereco> findByCepAndNumero(String cep, int numero);

    // Adicione outros métodos de busca customizados se necessário
    // Exemplo: buscar endereços por UF
    // List<Endereco> findByUf(String uf);

    // Exemplo: buscar endereços por localidade (cidade)
    // List<Endereco> findByLocalidadeIgnoreCase(String localidade);
}
