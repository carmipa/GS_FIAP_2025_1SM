// Pacote: br.com.fiap.gs.gsapi.service
package br.com.fiap.gs.gsapi.service;

import br.com.fiap.gs.gsapi.dto.request.ClienteRequestDTO;
import br.com.fiap.gs.gsapi.dto.request.ContatoRequestDTO;
import br.com.fiap.gs.gsapi.dto.request.EnderecoRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.ClienteResponseDTO;
import br.com.fiap.gs.gsapi.exception.ResourceNotFoundException;
import br.com.fiap.gs.gsapi.mapper.ClienteMapper;
import br.com.fiap.gs.gsapi.mapper.ContatoMapper;
import br.com.fiap.gs.gsapi.mapper.EnderecoMapper;
import br.com.fiap.gs.gsapi.model.Cliente;
import br.com.fiap.gs.gsapi.model.Contato;
import br.com.fiap.gs.gsapi.model.Endereco;
import br.com.fiap.gs.gsapi.repository.ClienteRepository;
import br.com.fiap.gs.gsapi.repository.ContatoRepository;
import br.com.fiap.gs.gsapi.repository.EnderecoRepository;
import br.com.fiap.gs.gsapi.service.search.ClienteSearchCriteria;
import br.com.fiap.gs.gsapi.specification.ClienteSpecification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException; // Para usar no deletar
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@CacheConfig(cacheNames = "clientes")
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ContatoRepository contatoRepository;
    private final EnderecoRepository enderecoRepository;
    private final ClienteMapper clienteMapper;
    private final ContatoMapper contatoMapper;
    private final EnderecoMapper enderecoMapper;
    private final EnderecoGeocodingService enderecoGeocodingService;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository,
                          ContatoRepository contatoRepository,
                          EnderecoRepository enderecoRepository,
                          ClienteMapper clienteMapper,
                          ContatoMapper contatoMapper,
                          EnderecoMapper enderecoMapper,
                          EnderecoGeocodingService enderecoGeocodingService) {
        this.clienteRepository = clienteRepository;
        this.contatoRepository = contatoRepository;
        this.enderecoRepository = enderecoRepository;
        this.clienteMapper = clienteMapper;
        this.contatoMapper = contatoMapper;
        this.enderecoMapper = enderecoMapper;
        this.enderecoGeocodingService = enderecoGeocodingService;
    }

    @Transactional(readOnly = true)
    @Cacheable(key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString() + '-' + T(java.util.Objects).hashCode(#criteria)")
    public Page<ClienteResponseDTO> listarTodos(ClienteSearchCriteria criteria, Pageable pageable) {
        Specification<Cliente> spec = ClienteSpecification.fromCriteria(criteria);
        Page<Cliente> clientesPage = clienteRepository.findAll(spec, pageable);
        return clientesPage.map(clienteMapper::toClienteResponseDTO);
    }

    @Transactional(readOnly = true)
    @Cacheable(key = "#id")
    public ClienteResponseDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));
        return clienteMapper.toClienteResponseDTO(cliente);
    }

    @Transactional
    @CacheEvict(value = "clientes", allEntries = true)
    public ClienteResponseDTO criar(ClienteRequestDTO clienteRequestDTO) {
        clienteRepository.findByDocumento(clienteRequestDTO.getDocumento()).ifPresent(c -> {
            throw new IllegalArgumentException("Cliente com o documento '" + clienteRequestDTO.getDocumento() + "' já existe.");
        });

        Cliente cliente = clienteMapper.toCliente(clienteRequestDTO);
        cliente.setContatos(new HashSet<>());
        cliente.setEnderecos(new HashSet<>());

        // Processar e criar/associar Contato Principal
        if (clienteRequestDTO.getContato() == null) {
            throw new IllegalArgumentException("Dados de contato principal são obrigatórios para criar um cliente.");
        }
        ContatoRequestDTO contatoDto = clienteRequestDTO.getContato();
        Optional<Contato> contatoExistenteOpt = contatoRepository.findByEmail(contatoDto.getEmail());
        Contato contatoParaAssociar;
        if (contatoExistenteOpt.isPresent()) {
            contatoParaAssociar = contatoExistenteOpt.get();
            contatoMapper.updateContatoFromDto(contatoDto, contatoParaAssociar); // Atualiza dados do existente
            contatoParaAssociar = contatoRepository.save(contatoParaAssociar);
        } else {
            Contato novoContato = contatoMapper.toContato(contatoDto);
            contatoParaAssociar = contatoRepository.save(novoContato);
        }
        cliente.addContato(contatoParaAssociar);

        // Processar e criar/associar Endereco Principal
        if (clienteRequestDTO.getEndereco() == null) {
            throw new IllegalArgumentException("Dados de endereço principal são obrigatórios para criar um cliente.");
        }
        EnderecoRequestDTO enderecoDto = clienteRequestDTO.getEndereco();
        Endereco enderecoParaAssociar = enderecoGeocodingService.obterOuCriarEnderecoCompleto(
                enderecoDto.getCep(),
                String.valueOf(enderecoDto.getNumero()), // Geocoding service espera String
                enderecoDto.getComplemento()
        ).orElseThrow(() -> new RuntimeException("Não foi possível processar o endereço do cliente."));

        // Se o DTO de endereço do cliente já vier com lat/lon e você confia neles,
        // pode atualizar o 'enderecoParaAssociar' aqui, APÓS o geocoding service (que pode já ter salvo).
        // Isso é útil se o frontend fornecer coordenadas mais precisas (ex: de um clique no mapa).
        boolean enderecoAtualizadoComLatLonDoDto = false;
        if (enderecoDto.getLatitude() != null && enderecoParaAssociar.getLatitude().compareTo(enderecoDto.getLatitude()) != 0) {
            enderecoParaAssociar.setLatitude(enderecoDto.getLatitude());
            enderecoAtualizadoComLatLonDoDto = true;
        }
        if (enderecoDto.getLongitude() != null && enderecoParaAssociar.getLongitude().compareTo(enderecoDto.getLongitude()) != 0) {
            enderecoParaAssociar.setLongitude(enderecoDto.getLongitude());
            enderecoAtualizadoComLatLonDoDto = true;
        }
        if (enderecoAtualizadoComLatLonDoDto) {
            enderecoParaAssociar = enderecoRepository.save(enderecoParaAssociar); // Salva as novas lat/lon
        }

        cliente.addEndereco(enderecoParaAssociar);

        Cliente clienteSalvo = clienteRepository.save(cliente);
        return clienteMapper.toClienteResponseDTO(clienteSalvo);
    }

    @Transactional
    @CachePut(value = "clientes", key = "#id")
    @CacheEvict(value = "clientes", allEntries = true, condition = "#result != null") // Removido #root.methodName para simplificar
    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO clienteRequestDTO) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));

        if (clienteRequestDTO.getDocumento() != null &&
                !clienteExistente.getDocumento().equals(clienteRequestDTO.getDocumento())) {
            clienteRepository.findByDocumento(clienteRequestDTO.getDocumento()).ifPresent(c -> {
                if (!c.getIdCliente().equals(id)) {
                    throw new IllegalArgumentException("Outro cliente com o documento '" + clienteRequestDTO.getDocumento() + "' já existe.");
                }
            });
        }

        clienteMapper.updateClienteFromDto(clienteRequestDTO, clienteExistente);

        // Atualizar Contato Principal (se fornecido no DTO)
        if (clienteRequestDTO.getContato() != null) {
            ContatoRequestDTO contatoDto = clienteRequestDTO.getContato();
            // Lógica: Remove todos os contatos associados antigos e adiciona/atualiza o novo.
            // Isso assume que um cliente tem apenas UM contato principal gerenciado por este fluxo.
            Set<Contato> contatosAtuais = new HashSet<>(clienteExistente.getContatos());
            contatosAtuais.forEach(clienteExistente::removeContato); // Garante desassociação bidirecional

            Optional<Contato> contatoExistenteNoBancoOpt = contatoRepository.findByEmail(contatoDto.getEmail());
            Contato contatoParaAssociar;
            if (contatoExistenteNoBancoOpt.isPresent()) {
                contatoParaAssociar = contatoExistenteNoBancoOpt.get();
                contatoMapper.updateContatoFromDto(contatoDto, contatoParaAssociar);
            } else {
                contatoParaAssociar = contatoMapper.toContato(contatoDto);
            }
            contatoParaAssociar = contatoRepository.save(contatoParaAssociar);
            clienteExistente.addContato(contatoParaAssociar);
        }
        // Se clienteRequestDTO.getContato() for null, a lógica de atualização pode
        // optar por manter os contatos existentes ou removê-los.
        // A lógica atual com forEach(removeContato) já os removeria se o DTO não trouxesse um novo.

        // Atualizar Endereço Principal (se fornecido no DTO)
        if (clienteRequestDTO.getEndereco() != null) {
            EnderecoRequestDTO enderecoDto = clienteRequestDTO.getEndereco();
            // Lógica: Remove todos os endereços associados antigos e adiciona/atualiza o novo.
            Set<Endereco> enderecosAtuais = new HashSet<>(clienteExistente.getEnderecos());
            enderecosAtuais.forEach(clienteExistente::removeEndereco); // Garante desassociação bidirecional

            // Usar o geocoding service para obter ou criar o endereço.
            // Isso também garante que o endereço seja persistido/atualizado no banco.
            Endereco enderecoParaAssociar = enderecoGeocodingService.obterOuCriarEnderecoCompleto(
                    enderecoDto.getCep(),
                    String.valueOf(enderecoDto.getNumero()),
                    enderecoDto.getComplemento()
            ).orElseThrow(() -> new RuntimeException("Não foi possível processar o endereço para atualização do cliente."));

            // Se o DTO tiver lat/lon e forem diferentes do que o geocoding retornou/encontrou, atualize.
            boolean enderecoAtualizadoComLatLonDoDto = false;
            if (enderecoDto.getLatitude() != null && (enderecoParaAssociar.getLatitude() == null || enderecoParaAssociar.getLatitude().compareTo(enderecoDto.getLatitude()) != 0)) {
                enderecoParaAssociar.setLatitude(enderecoDto.getLatitude());
                enderecoAtualizadoComLatLonDoDto = true;
            }
            if (enderecoDto.getLongitude() != null && (enderecoParaAssociar.getLongitude() == null || enderecoParaAssociar.getLongitude().compareTo(enderecoDto.getLongitude()) != 0 )) {
                enderecoParaAssociar.setLongitude(enderecoDto.getLongitude());
                enderecoAtualizadoComLatLonDoDto = true;
            }
            if (enderecoAtualizadoComLatLonDoDto) {
                enderecoParaAssociar = enderecoRepository.save(enderecoParaAssociar);
            }

            clienteExistente.addEndereco(enderecoParaAssociar);
        }

        Cliente clienteAtualizado = clienteRepository.save(clienteExistente);
        return clienteMapper.toClienteResponseDTO(clienteAtualizado);
    }

    @Transactional
    @CacheEvict(value = "clientes", allEntries = true)
    public void deletar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id + " para exclusão."));

        // A remoção das entradas nas tabelas de junção (gs_clientecontato, gs_clienteendereco)
        // será gerenciada pelo JPA devido à propriedade do relacionamento e CascadeType.MERGE/PERSIST.
        // As entidades Contato e Endereco em si não são deletadas em cascata do Cliente,
        // o que é geralmente o comportamento desejado.
        clienteRepository.deleteById(id);
    }
}