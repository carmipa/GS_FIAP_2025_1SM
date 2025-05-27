// Pacote: br.com.fiap.gs.gsapi.mapper
package br.com.fiap.gs.gsapi.mapper;

import br.com.fiap.gs.gsapi.dto.request.EonetEventosRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.EonetEventoResponseDTO;
import br.com.fiap.gs.gsapi.model.EonetEventos;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.BeanMapping; // Certifique-se que este import existe
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public abstract class EonetEventoMapper {

    private static final Logger logger = LoggerFactory.getLogger(EonetEventoMapper.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    // --- Mapeamento PARA Entidade ---
    // ESTE É O MÉTODO PROBLEMÁTICO (LINHA 36 no log de erro)
    @BeanMapping(ignoreByDefault = true) // <<== GARANTA QUE ESTA ANOTAÇÃO ESTÁ AQUI
    @Mapping(source = "eonetApiId", target = "eonetApiId")
    @Mapping(source = "jsonEvento", target = "jsonEvento")
    @Mapping(source = "data", target = "data")
    // As propriedades "idEonet" (PK) e "enderecosEnvolvidos" (mappedBy)
    // serão ignoradas por padrão porque ignoreByDefault=true e não há @Mapping para elas.
    public abstract EonetEventos toEonetEventos(EonetEventosRequestDTO requestDTO);

    // --- Mapeamentos PARA DTO de Resposta ---
    @Mapping(target = "idEonet", source = "idEonet")
    @Mapping(target = "eonetApiId", source = "eonetApiId")
    @Mapping(target = "data", source = "data")
    @Mapping(target = "tituloEvento", source = "jsonEvento", qualifiedByName = "jsonToTitulo")
    @Mapping(target = "linkEvento", source = "jsonEvento", qualifiedByName = "jsonToLink")
    @Mapping(target = "dataOcorrenciaOriginalEonet", source = "jsonEvento", qualifiedByName = "jsonToDataOcorrencia")
    @Mapping(target = "categoriaPrincipal", source = "jsonEvento", qualifiedByName = "jsonToCategoriaPrincipal")
    public abstract EonetEventoResponseDTO toEonetEventoResponseDTO(EonetEventos eonetEventos);

    public abstract List<EonetEventoResponseDTO> toEonetEventoResponseDTOList(List<EonetEventos> eonetEventosList);

    public abstract Set<EonetEventoResponseDTO> toEonetEventoResponseDTOSet(Set<EonetEventos> eonetEventosSet);

    // --- Métodos Auxiliares para extrair dados do JSON (mantidos como antes) ---
    @Named("jsonToTitulo")
    protected String jsonToTitulo(String jsonEvento) {
        if (jsonEvento == null || jsonEvento.isEmpty()) return null;
        try {
            JsonNode rootNode = objectMapper.readTree(jsonEvento);
            JsonNode titleNode = rootNode.path("title");
            return titleNode.isMissingNode() ? null : titleNode.asText();
        } catch (JsonProcessingException e) {
            logger.error("Erro ao parsear JSON para extrair título: {}. JSON: {}", e.getMessage(), jsonEvento.substring(0, Math.min(jsonEvento.length(), 200)));
            return null;
        }
    }

    @Named("jsonToLink")
    protected String jsonToLink(String jsonEvento) {
        if (jsonEvento == null || jsonEvento.isEmpty()) return null;
        try {
            JsonNode rootNode = objectMapper.readTree(jsonEvento);
            JsonNode linkNode = rootNode.path("link");
            if (!linkNode.isMissingNode() && StringUtils.hasText(linkNode.asText())) {
                return linkNode.asText();
            }
            JsonNode sourcesNode = rootNode.path("sources");
            if (!sourcesNode.isMissingNode() && sourcesNode.isArray() && sourcesNode.size() > 0) {
                JsonNode firstSourceUrlNode = sourcesNode.get(0).path("url");
                if (!firstSourceUrlNode.isMissingNode()) {
                    return firstSourceUrlNode.asText();
                }
            }
            return null;
        } catch (JsonProcessingException e) {
            logger.error("Erro ao parsear JSON para extrair link: {}. JSON: {}", e.getMessage(), jsonEvento.substring(0, Math.min(jsonEvento.length(), 200)));
            return null;
        }
    }

    @Named("jsonToDataOcorrencia")
    protected Instant jsonToDataOcorrencia(String jsonEvento) {
        if (jsonEvento == null || jsonEvento.isEmpty()) return null;
        try {
            JsonNode rootNode = objectMapper.readTree(jsonEvento);
            JsonNode geometriesNode = rootNode.path("geometries");
            if (!geometriesNode.isMissingNode() && geometriesNode.isArray() && geometriesNode.size() > 0) {
                JsonNode firstGeometry = geometriesNode.get(0);
                JsonNode dateNode = firstGeometry.path("date");
                if (!dateNode.isMissingNode() && StringUtils.hasText(dateNode.asText())) {
                    try {
                        return Instant.parse(dateNode.asText());
                    } catch (DateTimeParseException dtpe) {
                        logger.error("Erro ao parsear data de ocorrência do JSON: '{}'. Formato inválido. Erro: {}", dateNode.asText(), dtpe.getMessage());
                        return null;
                    }
                }
            }
            JsonNode rootDateNode = rootNode.path("date");
            if (!rootDateNode.isMissingNode() && StringUtils.hasText(rootDateNode.asText())) {
                try {
                    return Instant.parse(rootDateNode.asText());
                } catch (DateTimeParseException dtpe) {
                    logger.error("Erro ao parsear data de ocorrência (raiz) do JSON: '{}'. Formato inválido. Erro: {}", rootDateNode.asText(), dtpe.getMessage());
                    return null;
                }
            }
        } catch (JsonProcessingException e) {
            logger.error("Erro ao parsear JSON para extrair data de ocorrência: {}. JSON: {}", e.getMessage(), jsonEvento.substring(0, Math.min(jsonEvento.length(), 200)));
        }
        return null;
    }

    @Named("jsonToCategoriaPrincipal")
    protected String jsonToCategoriaPrincipal(String jsonEvento) {
        if (jsonEvento == null || jsonEvento.isEmpty()) return null;
        try {
            JsonNode rootNode = objectMapper.readTree(jsonEvento);
            JsonNode categoriesNode = rootNode.path("categories");
            if (!categoriesNode.isMissingNode() && categoriesNode.isArray() && categoriesNode.size() > 0) {
                JsonNode firstCategory = categoriesNode.get(0);
                JsonNode titleNode = firstCategory.path("title");
                return titleNode.isMissingNode() ? null : titleNode.asText();
            }
        } catch (JsonProcessingException e) {
            logger.error("Erro ao parsear JSON para extrair categoria principal: {}. JSON: {}", e.getMessage(), jsonEvento.substring(0, Math.min(jsonEvento.length(), 200)));
        }
        return null;
    }

    // Classe utilitária interna para StringUtils.hasText (ou importe o do Spring Core)
    private static class StringUtils {
        public static boolean hasText(String str) {
            return str != null && !str.trim().isEmpty();
        }
    }
}