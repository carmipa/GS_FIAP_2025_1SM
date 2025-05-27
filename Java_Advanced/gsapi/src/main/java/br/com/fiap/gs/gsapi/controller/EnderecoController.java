// Pacote: br.com.fiap.gs.gsapi.controller
package br.com.fiap.gs.gsapi.controller;

import br.com.fiap.gs.gsapi.dto.request.EnderecoRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.EnderecoResponseDTO;
import br.com.fiap.gs.gsapi.exception.GlobalExceptionHandler; // Para referência no Swagger
import br.com.fiap.gs.gsapi.mapper.EnderecoMapper; // Já existia
import br.com.fiap.gs.gsapi.model.Endereco; // Já existia
import br.com.fiap.gs.gsapi.service.EnderecoGeocodingService; // Já existia
import br.com.fiap.gs.gsapi.service.EnderecoService; // Novo serviço CRUD

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
import org.springdoc.core.annotations.ParameterObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/enderecos")
@Tag(name = "Endereços", description = "Endpoints para gerenciamento, consulta e geocodificação de endereços")
public class EnderecoController {

    private final EnderecoService enderecoService; // Novo serviço para CRUD
    private final EnderecoGeocodingService enderecoGeocodingService; // Mantido para o endpoint específico
    private final EnderecoMapper enderecoMapper; // Mantido para conversões se necessário aqui

    @Autowired
    public EnderecoController(EnderecoService enderecoService,
                              EnderecoGeocodingService enderecoGeocodingService,
                              EnderecoMapper enderecoMapper) {
        this.enderecoService = enderecoService;
        this.enderecoGeocodingService = enderecoGeocodingService;
        this.enderecoMapper = enderecoMapper;
    }

    @Operation(summary = "Buscar endereço completo por CEP e número (com geocodificação)",
            description = "Busca dados do endereço usando ViaCEP e tenta obter coordenadas de geolocalização (Nominatim). " +
                    "Se o endereço já existe e possui coordenadas, ele é retornado; caso contrário, é buscado, geocodificado e salvo/atualizado." +
                    "Este endpoint é ideal para 'obter ou criar dinamicamente' um endereço com geolocalização.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Endereço encontrado e geocodificado (ou criado/atualizado).",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = EnderecoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "CEP ou número inválido.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class))),
            @ApiResponse(responseCode = "404", description = "CEP não encontrado ou endereço não pôde ser geocodificado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @GetMapping("/geocodificar/cep/{cep}")
    public ResponseEntity<EnderecoResponseDTO> buscarOuCriarEnderecoGeocodificado(
            @Parameter(description = "CEP a ser consultado (apenas números ou formatado)", required = true, example = "01001000")
            @PathVariable String cep,
            @Parameter(description = "Número do endereço para geolocalização mais precisa", required = true, example = "100")
            @RequestParam String numero,
            @Parameter(description = "Complemento do endereço (opcional)", example = "Apto 101")
            @RequestParam(required = false) String complemento) {

        if (cep == null || cep.replaceAll("[^0-9]", "").length() != 8) {
            return ResponseEntity.badRequest().body(null); // Melhorar com ApiError
        }
        if (numero == null || numero.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Melhorar com ApiError
        }

        // A lógica de `obterOuCriarEnderecoCompleto` já está no EnderecoGeocodingService
        // E agora também adicionamos uma fachada no EnderecoService
        EnderecoResponseDTO enderecoCompleto = enderecoService.criarOuBuscarEnderecoGeocodificado(cep, numero, complemento);
        return ResponseEntity.ok(enderecoCompleto);
    }


    // --- Endpoints CRUD para Endereço ---

    @Operation(
            summary = "Listar todos os endereços com paginação e filtros.",
            description = "Retorna uma lista paginada de endereços. Permite filtrar por CEP (parcial), logradouro (parcial, case-insensitive) e localidade (parcial, case-insensitive)."
    )
    @Parameters({
            @Parameter(name = "page", description = "Número da página (começa em 0)", in = ParameterIn.QUERY, schema = @Schema(type = "integer", defaultValue = "0")),
            @Parameter(name = "size", description = "Tamanho da página", in = ParameterIn.QUERY, schema = @Schema(type = "integer", defaultValue = "10")),
            @Parameter(name = "sort", description = "Critério de ordenação (ex: logradouro,asc)", in = ParameterIn.QUERY, schema = @Schema(type = "string", example = "localidade,asc")),
            @Parameter(name = "cep", description = "Filtrar por CEP (busca parcial nos números)", in = ParameterIn.QUERY, schema = @Schema(type = "string")),
            @Parameter(name = "logradouro", description = "Filtrar por logradouro (busca parcial, case-insensitive)", in = ParameterIn.QUERY, schema = @Schema(type = "string")),
            @Parameter(name = "localidade", description = "Filtrar por localidade (busca parcial, case-insensitive)", in = ParameterIn.QUERY, schema = @Schema(type = "string"))
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de endereços encontrada.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))) // Idealmente, Page<EnderecoResponseDTO>
    })
    @GetMapping
    public ResponseEntity<Page<EnderecoResponseDTO>> listarTodosEnderecos(
            @RequestParam(required = false) String cep,
            @RequestParam(required = false) String logradouro,
            @RequestParam(required = false) String localidade,
            @PageableDefault(size = 10, sort = "idEndereco") Pageable pageable) {
        Page<EnderecoResponseDTO> enderecos = enderecoService.listarTodos(cep, logradouro, localidade, pageable);
        return ResponseEntity.ok(enderecos);
    }

    @Operation(summary = "Buscar endereço por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Endereço encontrado.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = EnderecoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Endereço não encontrado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<EnderecoResponseDTO> buscarEnderecoPorId(
            @Parameter(description = "ID do endereço a ser buscado.", required = true, example = "1") @PathVariable Long id) {
        EnderecoResponseDTO endereco = enderecoService.buscarPorId(id);
        return ResponseEntity.ok(endereco);
    }

    @Operation(summary = "Criar um novo endereço manualmente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Endereço criado com sucesso.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = EnderecoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<EnderecoResponseDTO> criarEndereco(
            @Parameter(description = "Dados do endereço para criação.", required = true,
                    content = @Content(schema = @Schema(implementation = EnderecoRequestDTO.class)))
            @Valid @RequestBody EnderecoRequestDTO enderecoRequestDTO) {
        EnderecoResponseDTO enderecoSalvo = enderecoService.criar(enderecoRequestDTO);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(enderecoSalvo.getIdEndereco())
                .toUri();
        return ResponseEntity.created(location).body(enderecoSalvo);
    }

    @Operation(summary = "Atualizar um endereço existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Endereço atualizado com sucesso.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = EnderecoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class))),
            @ApiResponse(responseCode = "404", description = "Endereço não encontrado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<EnderecoResponseDTO> atualizarEndereco(
            @Parameter(description = "ID do endereço a ser atualizado.", required = true, example = "1") @PathVariable Long id,
            @Parameter(description = "Dados do endereço para atualização.", required = true,
                    content = @Content(schema = @Schema(implementation = EnderecoRequestDTO.class)))
            @Valid @RequestBody EnderecoRequestDTO enderecoRequestDTO) {
        EnderecoResponseDTO enderecoAtualizado = enderecoService.atualizar(id, enderecoRequestDTO);
        return ResponseEntity.ok(enderecoAtualizado);
    }

    @Operation(summary = "Deletar um endereço por ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Endereço deletado com sucesso.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Endereço não encontrado.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class))),
            @ApiResponse(responseCode = "409", description = "Conflito: Endereço associado a um ou mais clientes e não pode ser excluído.", content = @Content(schema = @Schema(implementation = GlobalExceptionHandler.ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEndereco(
            @Parameter(description = "ID do endereço a ser deletado.", required = true, example = "1") @PathVariable Long id) {
        // A lógica de verificação de associação com cliente antes de deletar
        // pode ser colocada no EnderecoService e lançar uma exceção específica (ex: DataIntegrityViolationException ou uma customizada)
        // que o GlobalExceptionHandler poderia tratar com status 409 CONFLICT.
        // Por ora, o service tem uma lógica comentada, mas a deleção prossegue.
        enderecoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}