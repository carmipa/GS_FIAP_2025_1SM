// Pacote: br.com.fiap.gs.gsapi.specification
package br.com.fiap.gs.gsapi.specification;

import br.com.fiap.gs.gsapi.model.Contato;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class ContatoSpecification {

    public static Specification<Contato> comFiltros(String email, String tipoContato, String ddd) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(email)) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), "%" + email.toLowerCase() + "%"));
            }

            if (StringUtils.hasText(tipoContato)) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("tipoContato")), tipoContato.toLowerCase()));
            }

            if (StringUtils.hasText(ddd)) {
                predicates.add(criteriaBuilder.equal(root.get("ddd"), ddd));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Métodos de especificação individuais (alternativa ou complemento)
    public static Specification<Contato> emailContem(String email) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(email)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), "%" + email.toLowerCase() + "%");
        };
    }

    public static Specification<Contato> tipoContatoIgual(String tipoContato) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(tipoContato)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(criteriaBuilder.lower(root.get("tipoContato")), tipoContato.toLowerCase());
        };
    }

    public static Specification<Contato> dddIgual(String ddd) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(ddd)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("ddd"), ddd);
        };
    }
}