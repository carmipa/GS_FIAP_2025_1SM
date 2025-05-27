// Pacote: br.com.fiap.gs.gsapi.mapper
package br.com.fiap.gs.gsapi.mapper;

import br.com.fiap.gs.gsapi.dto.request.ClienteRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.ClienteResponseDTO;
import br.com.fiap.gs.gsapi.model.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;
import java.util.Set;

@Mapper(
        componentModel = "spring",
        uses = {ContatoMapper.class, EnderecoMapper.class}, // Para mapear coleções aninhadas
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE // Para atualizações parciais
)
public interface ClienteMapper {

    // --- Mapeamentos PARA DTO de Resposta ---
    // MapStruct usará ContatoMapper e EnderecoMapper para as coleções.
    ClienteResponseDTO toClienteResponseDTO(Cliente cliente);

    List<ClienteResponseDTO> toClienteResponseDTOList(List<Cliente> clientes);

    Set<ClienteResponseDTO> toClienteResponseDTOSet(Set<Cliente> clientes);

    // --- Mapeamentos PARA Entidade ---
    // IDs de contatos e endereços são tratados no serviço.
    // ClienteRequestDTO foi modificado para ter `contatoIds` e `enderecoIds`.
    // O mapeamento direto de DTOs aninhados para criação/atualização de Contato/Endereco
    // a partir do ClienteRequestDTO não está implementado aqui, e sim a associação por IDs no serviço.
    @Mapping(target = "idCliente", ignore = true)
    @Mapping(target = "contatos", ignore = true)  // Coleções gerenciadas no serviço (via contatoIds)
    @Mapping(target = "enderecos", ignore = true) // Coleções gerenciadas no serviço (via enderecoIds)
    Cliente toCliente(ClienteRequestDTO clienteRequestDTO);

    @Mapping(target = "idCliente", ignore = true)
    @Mapping(target = "contatos", ignore = true)
    @Mapping(target = "enderecos", ignore = true)
    void updateClienteFromDto(ClienteRequestDTO clienteRequestDTO, @MappingTarget Cliente cliente);
}