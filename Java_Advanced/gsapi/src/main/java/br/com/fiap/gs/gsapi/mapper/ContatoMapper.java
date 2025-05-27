// Pacote: br.com.fiap.gs.gsapi.mapper
package br.com.fiap.gs.gsapi.mapper;

import br.com.fiap.gs.gsapi.dto.request.ContatoRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.ContatoResponseDTO;
import br.com.fiap.gs.gsapi.model.Contato;
import org.mapstruct.BeanMapping; // Importar
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;
import java.util.Set;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ContatoMapper {

    // --- Mapeamentos PARA DTO de Resposta ---
    ContatoResponseDTO toContatoResponseDTO(Contato contato);
    List<ContatoResponseDTO> toContatoResponseDTOList(List<Contato> contatos);
    Set<ContatoResponseDTO> toContatoResponseDTOSet(Set<Contato> contatos);

    // --- Mapeamentos PARA Entidade ---
    @BeanMapping(ignoreByDefault = true) // IGNORA TODOS OS CAMPOS POR PADRÃO
    @Mapping(source = "ddd", target = "ddd")
    @Mapping(source = "telefone", target = "telefone")
    @Mapping(source = "celular", target = "celular")
    @Mapping(source = "whatsapp", target = "whatsapp")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "tipoContato", target = "tipoContato")
    // idContato e clientes serão ignorados por padrão e não precisam de @Mapping(target="...", ignore=true)
    Contato toContato(ContatoRequestDTO contatoRequestDTO);

    @BeanMapping(ignoreByDefault = true) // IGNORA TODOS OS CAMPOS POR PADRÃO
    @Mapping(source = "ddd", target = "ddd")
    @Mapping(source = "telefone", target = "telefone")
    @Mapping(source = "celular", target = "celular")
    @Mapping(source = "whatsapp", target = "whatsapp")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "tipoContato", target = "tipoContato")
        // idContato e clientes serão ignorados por padrão
    void updateContatoFromDto(ContatoRequestDTO contatoRequestDTO, @MappingTarget Contato contato);
}