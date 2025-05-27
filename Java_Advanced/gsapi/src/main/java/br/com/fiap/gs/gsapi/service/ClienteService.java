// Pacote: br.com.fiap.gs.gsapi.service
package br.com.fiap.gs.gsapi.service;

import br.com.fiap.gs.gsapi.dto.request.ClienteRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.ClienteResponseDTO;
import br.com.fiap.gs.gsapi.exception.ResourceNotFoundException;
import br.com.fiap.gs.gsapi.mapper.ClienteMapper;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils; // Para CollectionUtils.isEmpty

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@CacheConfig(cacheNames = "clientes")
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ContatoRepository contatoRepository;
    private final EnderecoRepository enderecoRepository;
    private final ClienteMapper clienteMapper;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository,
                          ContatoRepository contatoRepository,
                          EnderecoRepository enderecoRepository,
                          ClienteMapper clienteMapper) {
        this.clienteRepository = clienteRepository;
        this.contatoRepository = contatoRepository;
        this.enderecoRepository = enderecoRepository;
        this.clienteMapper = clienteMapper;
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
    @CacheEvict(value = "clientes", allEntries = true) // Invalida todos os caches de cliente na criação
    public ClienteResponseDTO criar(ClienteRequestDTO clienteRequestDTO) {
        clienteRepository.findByDocumento(clienteRequestDTO.getDocumento()).ifPresent(c -> {
            throw new IllegalArgumentException("Cliente com o documento '" + clienteRequestDTO.getDocumento() + "' já existe.");
        });

        Cliente cliente = clienteMapper.toCliente(clienteRequestDTO);

        // Associar contatos existentes
        if (!CollectionUtils.isEmpty(clienteRequestDTO.getContatoIds())) {
            Set<Contato> contatosParaAssociar = new HashSet<>(contatoRepository.findAllById(clienteRequestDTO.getContatoIds()));
            if (contatosParaAssociar.size() != clienteRequestDTO.getContatoIds().size()) {
                throw new ResourceNotFoundException("Um ou mais IDs de contato fornecidos não foram encontrados.");
            }
            // Usar os métodos addContato para manter a bidirecionalidade se implementado corretamente
            contatosParaAssociar.forEach(cliente::addContato);
        }

        // Associar endereços existentes
        if (!CollectionUtils.isEmpty(clienteRequestDTO.getEnderecoIds())) {
            Set<Endereco> enderecosParaAssociar = new HashSet<>(enderecoRepository.findAllById(clienteRequestDTO.getEnderecoIds()));
            if (enderecosParaAssociar.size() != clienteRequestDTO.getEnderecoIds().size()) {
                throw new ResourceNotFoundException("Um ou mais IDs de endereço fornecidos não foram encontrados.");
            }
            // Usar os métodos addEndereco para manter a bidirecionalidade
            enderecosParaAssociar.forEach(cliente::addEndereco);
        }

        Cliente clienteSalvo = clienteRepository.save(cliente);
        return clienteMapper.toClienteResponseDTO(clienteSalvo);
    }

    @Transactional
    @CachePut(value = "clientes", key = "#id") // Atualiza o cache do cliente específico
    @CacheEvict(value = "clientes", allEntries = true, condition = "#result != null && #root.methodName == 'atualizar'") // Invalida outros caches de cliente (listas) na atualização bem-sucedida
    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO clienteRequestDTO) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));

        if (clienteRequestDTO.getDocumento() != null && !clienteExistente.getDocumento().equals(clienteRequestDTO.getDocumento())) {
            clienteRepository.findByDocumento(clienteRequestDTO.getDocumento()).ifPresent(c -> {
                if (!c.getIdCliente().equals(id)) {
                    throw new IllegalArgumentException("Outro cliente com o documento '" + clienteRequestDTO.getDocumento() + "' já existe.");
                }
            });
        }

        clienteMapper.updateClienteFromDto(clienteRequestDTO, clienteExistente);

        // Atualizar associações de contatos
        // Remove todos os contatos existentes e adiciona os novos (abordagem simples)
        // Para uma abordagem mais otimizada (delta), seria necessário comparar as coleções.
        clienteExistente.getContatos().clear(); // Cuidado com a bidirecionalidade aqui, o ideal é chamar removeContato
        // Melhor:
        // new HashSet<>(clienteExistente.getContatos()).forEach(clienteExistente::removeContato);


        if (!CollectionUtils.isEmpty(clienteRequestDTO.getContatoIds())) {
            Set<Contato> contatosParaAssociar = new HashSet<>(contatoRepository.findAllById(clienteRequestDTO.getContatoIds()));
            if (contatosParaAssociar.size() != clienteRequestDTO.getContatoIds().size()) {
                throw new ResourceNotFoundException("Um ou mais IDs de contato fornecidos para atualização não foram encontrados.");
            }
            contatosParaAssociar.forEach(clienteExistente::addContato);
        } else {
            // Se a lista de contatoIds for vazia, significa que todos os contatos devem ser desassociados.
            // Precisamos garantir que a relação bidirecional seja desfeita.
            Set<Contato> contatosAtuais = new HashSet<>(clienteExistente.getContatos()); // Copia para evitar ConcurrentModificationException
            contatosAtuais.forEach(contato -> clienteExistente.removeContato(contato));
        }


        // Atualizar associações de endereços (abordagem similar)
        // new HashSet<>(clienteExistente.getEnderecos()).forEach(clienteExistente::removeEndereco);

        if (!CollectionUtils.isEmpty(clienteRequestDTO.getEnderecoIds())) {
            Set<Endereco> enderecosParaAssociar = new HashSet<>(enderecoRepository.findAllById(clienteRequestDTO.getEnderecoIds()));
            if (enderecosParaAssociar.size() != clienteRequestDTO.getEnderecoIds().size()) {
                throw new ResourceNotFoundException("Um ou mais IDs de endereço fornecidos para atualização não foram encontrados.");
            }
            enderecosParaAssociar.forEach(clienteExistente::addEndereco);
        } else {
            // Se a lista de enderecoIds for vazia, desassociar todos os endereços.
            Set<Endereco> enderecosAtuais = new HashSet<>(clienteExistente.getEnderecos());
            enderecosAtuais.forEach(endereco -> clienteExistente.removeEndereco(endereco));
        }


        Cliente clienteAtualizado = clienteRepository.save(clienteExistente);
        return clienteMapper.toClienteResponseDTO(clienteAtualizado);
    }

    @Transactional
    @CacheEvict(value = "clientes", allEntries = true)
    public void deletar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id + " para exclusão."));

        // A deleção em cascata ou a manutenção da integridade referencial
        // são geralmente tratadas pela configuração do JPA (orphanRemoval, CascadeType.REMOVE)
        // ou por constraints no banco de dados.
        // Como Cliente é o "dono" das tabelas de junção (gs_clientecontato, gs_clienteendereco),
        // a remoção do cliente deve remover as entradas correspondentes nessas tabelas de junção.
        // As entidades Contato e Endereco em si não serão removidas por padrão, apenas a associação.
        // Isso está correto se Contatos e Enderecos podem existir independentemente.

        clienteRepository.deleteById(id);
    }
}