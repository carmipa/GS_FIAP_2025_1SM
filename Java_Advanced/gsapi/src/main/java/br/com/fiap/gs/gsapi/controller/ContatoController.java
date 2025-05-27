// Pacote: br.com.fiap.gs.gsapi.controller
package br.com.fiap.gs.gsapi.controller;

import br.com.fiap.gs.gsapi.dto.request.ContatoRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.ContatoResponseDTO;
import br.com.fiap.gs.gsapi.exception.GlobalExceptionHandler;
import br.com.fiap.gs.gsapi.service.ContatoService;

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
@RequestMapping("/api/v1/contatos")
@Tag(name = "Contatos", description = "Endpoints para gerenciamento de informações de contato")
public class ContatoController {

    private final ContatoService contatoService;

    @Autowired
    public ContatoController(ContatoService contatoService) {
        this.contatoService = contatoService;
    }

    @Operation(
            summary = "Listar todos os contatos com paginação e filtros.",
            description = "Retorna uma lista paginada de contatos. Permite filtrar por email (parcial, case-insensitive), tipo de contato (exato, case-insensitive) e DDD (exato)."
    )
    @Parameters({
            @Parameter(name = "page", description = "Número da página (começa em 0)", in = ParameterIn.QUERY, schema = @Schema(type = "integer", defaultValue = "0")),
            @Parameter(name = "size", description = "Tamanho da página", in = ParameterIn.QUERY, schema = @Schema(type = "integer", defaultValue = "10")),
            @Parameter(name = "sort", description = "Critério de ordenação (ex: email,asc)", in = ParameterIn.QUERY, schema = @Schema(type = "string", example = "email,asc")),
            @Parameter(name = "email", description = "Filtrar por email (busca parcial, case-insensitive)", in = ParameterIn.QUERY, schema = @Schema(type = "string")),
            @Parameter(name = "tipoContato", description = "Filtrar por tipo de contato (busca exata, case-insensitive)", in = ParameterIn.QUERY, schema = @Schema(type = "string")),
            @Parameter(name = "ddd", description = "Filtrar por DDD (busca exata)", in = ParameterIn.QUERY, schema = @Schema(type = "string"))
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de contatos encontrada.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))) // Idealmente, Page<ContatoResponseDTO>
    })
    @GetMapping
    public ResponseEntity<Page<ContatoResponseDTO>> listarTodosContatos(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String tipoContato,
            @RequestParam(required = false) String ddd,
            @PageableDefault(size = 10, sort = "idContato") Pageable pageable) {
        Page<ContatoResponseDTO> contatos = contatoService.listarTodos(email, tipoContato, ddd, pageable);
        return ResponseEntity.ok(contatos);
    }

    @Operation(summary = "Buscar contato por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contato encontrado.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContatoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Contato não encontrado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ContatoResponseDTO> buscarContatoPorId(
            @Parameter(description = "ID do contato a ser buscado.", required = true, example = "1") @PathVariable Long id) {
        ContatoResponseDTO contato = contatoService.buscarPorId(id);
        return ResponseEntity.ok(contato);
    }

    @Operation(summary = "Buscar contato por Email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contato encontrado.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContatoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Contato não encontrado para o email fornecido.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @GetMapping("/email/{email}")
    public ResponseEntity<ContatoResponseDTO> buscarContatoPorEmail(
            @Parameter(description = "Email do contato a ser buscado.", required = true, example = "cliente@example.com") @PathVariable String email) {
        ContatoResponseDTO contato = contatoService.buscarPorEmail(email);
        return ResponseEntity.ok(contato);
    }

    @Operation(summary = "Criar um novo contato.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Contato criado com sucesso.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContatoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: email duplicado).", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ContatoResponseDTO> criarContato(
            @Parameter(description = "Dados do contato para criação.", required = true,
                    content = @Content(schema = @Schema(implementation = ContatoRequestDTO.class)))
            @Valid @RequestBody ContatoRequestDTO contatoRequestDTO) {
        ContatoResponseDTO contatoSalvo = contatoService.criar(contatoRequestDTO);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(contatoSalvo.getIdContato())
                .toUri();
        return ResponseEntity.created(location).body(contatoSalvo);
    }

    @Operation(summary = "Atualizar um contato existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contato atualizado com sucesso.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContatoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: email duplicado).", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class))),
            @ApiResponse(responseCode = "404", description = "Contato não encontrado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ContatoResponseDTO> atualizarContato(
            @Parameter(description = "ID do contato a ser atualizado.", required = true, example = "1") @PathVariable Long id,
            @Parameter(description = "Dados do contato para atualização.", required = true,
                    content = @Content(schema = @Schema(implementation = ContatoRequestDTO.class)))
            @Valid @RequestBody ContatoRequestDTO contatoRequestDTO) {
        ContatoResponseDTO contatoAtualizado = contatoService.atualizar(id, contatoRequestDTO);
        return ResponseEntity.ok(contatoAtualizado);
    }

    @Operation(summary = "Deletar um contato por ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Contato deletado com sucesso.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Contato não encontrado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class))),
            @ApiResponse(responseCode = "409", description = "Conflito: Contato associado a um ou mais clientes e não pode ser excluído.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarContato(
            @Parameter(description = "ID do contato a ser deletado.", required = true, example = "1") @PathVariable Long id) {
        // Semelhante ao EnderecoService, a lógica de verificação de associação com cliente
        // antes de deletar pode lançar uma exceção específica tratada pelo GlobalExceptionHandler.
        contatoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}