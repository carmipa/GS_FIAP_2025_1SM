// Pacote: br.com.fiap.gs.gsapi.mapper
package br.com.fiap.gs.gsapi.mapper;

import br.com.fiap.gs.gsapi.dto.request.EnderecoRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.EnderecoResponseDTO;
import br.com.fiap.gs.gsapi.model.Endereco;
import org.mapstruct.BeanMapping; // Importar
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;
import java.util.Set;

@Mapper(
        componentModel = "spring",
        uses = {EonetEventoMapper.class},
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface EnderecoMapper {

    // --- Mapeamentos PARA DTO de Resposta ---
    // Para estes, não precisamos de ignoreByDefault, pois queremos a maioria dos campos
    EnderecoResponseDTO toEnderecoResponseDTO(Endereco endereco);
    List<EnderecoResponseDTO> toEnderecoResponseDTOList(List<Endereco> enderecos);
    Set<EnderecoResponseDTO> toEnderecoResponseDTOSet(Set<Endereco> enderecos);

    // --- Mapeamentos PARA Entidade ---
    @BeanMapping(ignoreByDefault = true) // IGNORA TODOS OS CAMPOS POR PADRÃO
    @Mapping(source = "cep", target = "cep")
    @Mapping(source = "numero", target = "numero")
    @Mapping(source = "logradouro", target = "logradouro")
    @Mapping(source = "bairro", target = "bairro")
    @Mapping(source = "localidade", target = "localidade")
    @Mapping(source = "uf", target = "uf")
    @Mapping(source = "complemento", target = "complemento")
    @Mapping(source = "latitude", target = "latitude")
    @Mapping(source = "longitude", target = "longitude")
    // idEndereco, clientes, eonetEventos serão ignorados por padrão
    // e não precisam de @Mapping(target="...", ignore=true) explícito aqui
    Endereco toEndereco(EnderecoRequestDTO enderecoRequestDTO);

    @BeanMapping(ignoreByDefault = true) // IGNORA TODOS OS CAMPOS POR PADRÃO
    @Mapping(source = "cep", target = "cep")
    @Mapping(source = "numero", target = "numero")
    @Mapping(source = "logradouro", target = "logradouro")
    @Mapping(source = "bairro", target = "bairro")
    @Mapping(source = "localidade", target = "localidade")
    @Mapping(source = "uf", target = "uf")
    @Mapping(source = "complemento", target = "complemento")
    @Mapping(source = "latitude", target = "latitude")
    @Mapping(source = "longitude", target = "longitude")
        // idEndereco, clientes, eonetEventos serão ignorados por padrão
    void updateEnderecoFromDto(EnderecoRequestDTO enderecoRequestDTO, @MappingTarget Endereco endereco);
}