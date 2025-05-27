// Pacote: br.com.fiap.gs.gsapi.service.search
package br.com.fiap.gs.gsapi.specification;

import br.com.fiap.gs.gsapi.model.Cliente;
import br.com.fiap.gs.gsapi.service.search.ClienteSearchCriteria;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils; // Para StringUtils.hasText

import java.util.ArrayList;
import java.util.List;

public class ClienteSpecification {

    public static Specification<Cliente> fromCriteria(ClienteSearchCriteria criteria) {
        return (root, query, criteriaBuilder) -> {
            if (criteria == null) {
                return criteriaBuilder.conjunction(); // Retorna uma condição sempre verdadeira se não houver critérios
            }

            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(criteria.getNome())) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("nome")), "%" + criteria.getNome().toLowerCase() + "%"));
            }
            if (StringUtils.hasText(criteria.getDocumento())) {
                predicates.add(criteriaBuilder.equal(root.get("documento"), criteria.getDocumento()));
            }
            if (StringUtils.hasText(criteria.getDataNascimento())) {
                // Se dataNascimento fosse LocalDate, a comparação seria diferente
                // Ex: criteriaBuilder.equal(root.get("dataNascimento"), criteria.getDataNascimentoAsLocalDate());
                predicates.add(criteriaBuilder.equal(root.get("dataNascimento"), criteria.getDataNascimento()));
            }
            // Adicione outros predicados para outros campos de busca

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
