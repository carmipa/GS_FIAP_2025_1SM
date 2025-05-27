// Pacote: br.com.fiap.gs.gsapi.service.search
package br.com.fiap.gs.gsapi.specification;

import br.com.fiap.gs.gsapi.model.Endereco;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class EnderecoSpecification {

    public static Specification<Endereco> cepContem(String cep) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(cep)) {
                return criteriaBuilder.conjunction(); // Sempre verdadeiro se o CEP for nulo/vazio
            }
            // Remove não numéricos para busca, caso o CEP no banco também esteja limpo.
            // Se o CEP no banco pode ter "-", a busca precisa ser exata ou o campo do banco também precisa ser tratado na query.
            String cepNumerico = cep.replaceAll("[^0-9]", "");
            return criteriaBuilder.like(root.get("cep"), "%" + cepNumerico + "%");
        };
    }

    public static Specification<Endereco> logradouroContem(String logradouro) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(logradouro)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("logradouro")), "%" + logradouro.toLowerCase() + "%");
        };
    }

    public static Specification<Endereco> localidadeContem(String localidade) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(localidade)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("localidade")), "%" + localidade.toLowerCase() + "%");
        };
    }

    // Exemplo de como combinar múltiplos critérios (não usado diretamente no service.listarTodos da forma como está,
    // mas ilustra como construir uma Specification mais complexa a partir de um objeto de critério)
    // Se você tivesse um EnderecoSearchCriteriaDTO:
    /*
    public static Specification<Endereco> fromCriteria(EnderecoSearchCriteriaDTO criteria) {
        return (root, query, criteriaBuilder) -> {
            if (criteria == null) {
                return criteriaBuilder.conjunction(); 
            }

            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(criteria.getCep())) {
                predicates.add(criteriaBuilder.like(root.get("cep"), "%" + criteria.getCep().replaceAll("[^0-9]", "") + "%"));
            }
            if (StringUtils.hasText(criteria.getLogradouro())) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("logradouro")), "%" + criteria.getLogradouro().toLowerCase() + "%"));
            }
            if (StringUtils.hasText(criteria.getLocalidade())) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("localidade")), "%" + criteria.getLocalidade().toLowerCase() + "%"));
            }
            // Adicione outros predicados para outros campos de busca

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    */
}