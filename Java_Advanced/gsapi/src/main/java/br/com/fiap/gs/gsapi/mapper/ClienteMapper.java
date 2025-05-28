package br.com.fiap.gs.gsapi.mapper;

import br.com.fiap.gs.gsapi.dto.request.ClienteRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.ClienteResponseDTO;
import br.com.fiap.gs.gsapi.model.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {ContatoMapper.class, EnderecoMapper.class})
public interface ClienteMapper {

    ClienteMapper INSTANCE = Mappers.getMapper(ClienteMapper.class);

    // MapStruct usará ContatoMapper e EnderecoMapper para as coleções 'contatos' e 'enderecos'
    // devido à cláusula 'uses' na anotação @Mapper.
    // Os métodos toResponseDTOSet em ContatoMapper e EnderecoMapper serão encontrados e utilizados.
    ClienteResponseDTO toResponseDTO(Cliente cliente);

    @Mapping(target = "idCliente", ignore = true) // IDs são gerados pelo banco
    @Mapping(target = "contatos", ignore = true)  // Será tratado no ClienteService (busca por IDs)
    @Mapping(target = "enderecos", ignore = true) // Será tratado no ClienteService (busca por IDs)
    Cliente toEntity(ClienteRequestDTO clienteRequestDTO);
}