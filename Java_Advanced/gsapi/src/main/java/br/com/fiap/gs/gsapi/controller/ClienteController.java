// Pacote: br.com.fiap.gs.gsapi.controller
package br.com.fiap.gs.gsapi.controller;

import br.com.fiap.gs.gsapi.dto.request.ClienteRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.ClienteResponseDTO;
import br.com.fiap.gs.gsapi.exception.GlobalExceptionHandler; // Para referência no Swagger
import br.com.fiap.gs.gsapi.service.ClienteService;
import br.com.fiap.gs.gsapi.service.search.ClienteSearchCriteria; // Para busca por parâmetros

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject; // Para agrupar parâmetros de paginação e filtro no Swagger

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/clientes")
@Tag(name = "Clientes", description = "Endpoints para gerenciamento de clientes e suas informações relacionadas.")
public class ClienteController {

    private final ClienteService clienteService;

    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @Operation(
            summary = "Listar todos os clientes com paginação, ordenação e filtros.",
            description = "Retorna uma lista paginada de clientes. Permite filtrar por nome (parcial, case-insensitive), " +
                    "documento (exato) e data de nascimento (exato, formato YYYY-MM-DD ou como definido na entidade). " +
                    "Parâmetros de paginação padrão: `page=0`, `size=10`. Parâmetro de ordenação padrão: `sort=nome,asc`."
    )
    @Parameters({
            @Parameter(name = "page", description = "Número da página (começa em 0)", in = ParameterIn.QUERY, schema = @Schema(type = "integer", defaultValue = "0")),
            @Parameter(name = "size", description = "Tamanho da página", in = ParameterIn.QUERY, schema = @Schema(type = "integer", defaultValue = "10")),
            @Parameter(name = "sort", description = "Critério de ordenação (ex: nome,asc ou nome,desc ou multiplos: nome,asc&sort=documento,desc)", in = ParameterIn.QUERY, schema = @Schema(type = "string", example = "nome,asc"))
            // Os parâmetros de ClienteSearchCriteria (nome, documento, dataNascimento) serão documentados automaticamente pelo @ParameterObject
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de clientes encontrada.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))) // Idealmente, o Swagger mostraria Page<ClienteResponseDTO>
    })
    @GetMapping
    public ResponseEntity<Page<ClienteResponseDTO>> listarTodosClientes(
            @ParameterObject @Valid ClienteSearchCriteria criteria, // Parâmetros de filtro agrupados e validados
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<ClienteResponseDTO> clientes = clienteService.listarTodos(criteria, pageable); // CORRIGIDO: Passando criteria
        return ResponseEntity.ok(clientes);
    }

    @Operation(summary = "Buscar cliente por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente encontrado.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ClienteResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Cliente não encontrado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarClientePorId(
            @Parameter(description = "ID do cliente a ser buscado.", required = true, example = "1") @PathVariable Long id) {
        ClienteResponseDTO cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(cliente);
    }

    @Operation(summary = "Criar um novo cliente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cliente criado com sucesso.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ClienteResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida devido a erro de validação ou regra de negócio (ex: documento duplicado).", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> criarCliente(
            @Parameter(description = "Dados do cliente para criação.", required = true,
                    content = @Content(schema = @Schema(implementation = ClienteRequestDTO.class)))
            @Valid @RequestBody ClienteRequestDTO clienteRequestDTO) {
        ClienteResponseDTO clienteSalvo = clienteService.criar(clienteRequestDTO);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(clienteSalvo.getIdCliente())
                .toUri();
        return ResponseEntity.created(location).body(clienteSalvo);
    }

    @Operation(summary = "Atualizar um cliente existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ClienteResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida devido a erro de validação ou regra de negócio.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class))),
            @ApiResponse(responseCode = "404", description = "Cliente não encontrado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizarCliente(
            @Parameter(description = "ID do cliente a ser atualizado.", required = true, example = "1") @PathVariable Long id,
            @Parameter(description = "Dados do cliente para atualização.", required = true,
                    content = @Content(schema = @Schema(implementation = ClienteRequestDTO.class)))
            @Valid @RequestBody ClienteRequestDTO clienteRequestDTO) {
        ClienteResponseDTO clienteAtualizado = clienteService.atualizar(id, clienteRequestDTO);
        return ResponseEntity.ok(clienteAtualizado);
    }

    @Operation(summary = "Deletar um cliente por ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cliente deletado com sucesso.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Cliente não encontrado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(
            @Parameter(description = "ID do cliente a ser deletado.", required = true, example = "1") @PathVariable Long id) {
        clienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }

}
