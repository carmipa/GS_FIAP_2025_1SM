// Pacote: br.com.fiap.gs.gsapi.service
package br.com.fiap.gs.gsapi.service;

import br.com.fiap.gs.gsapi.dto.request.ContatoRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.ContatoResponseDTO;
import br.com.fiap.gs.gsapi.exception.ResourceNotFoundException;
import br.com.fiap.gs.gsapi.mapper.ContatoMapper;
import br.com.fiap.gs.gsapi.model.Contato;
import br.com.fiap.gs.gsapi.repository.ContatoRepository;
import br.com.fiap.gs.gsapi.specification.ContatoSpecification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException; // IMPORTADO
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils; // Para StringUtils.hasText, embora não usado diretamente nesta versão do listarTodos

@Service
@CacheConfig(cacheNames = "contatos")
public class ContatoService {

    private final ContatoRepository contatoRepository;
    private final ContatoMapper contatoMapper;

    @Autowired
    public ContatoService(ContatoRepository contatoRepository, ContatoMapper contatoMapper) {
        this.contatoRepository = contatoRepository;
        this.contatoMapper = contatoMapper;
    }

    @Transactional(readOnly = true)
    @Cacheable(key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString() + '-' + T(java.util.Objects).hashCode(#email) + '-' + T(java.util.Objects).hashCode(#tipoContato) + '-' + T(java.util.Objects).hashCode(#ddd)")
    public Page<ContatoResponseDTO> listarTodos(String email, String tipoContato, String ddd, Pageable pageable) {
        Specification<Contato> spec = ContatoSpecification.comFiltros(email, tipoContato, ddd);
        Page<Contato> contatosPage = contatoRepository.findAll(spec, pageable);
        return contatosPage.map(contatoMapper::toContatoResponseDTO);
    }

    @Transactional(readOnly = true)
    @Cacheable(key = "#id")
    public ContatoResponseDTO buscarPorId(Long id) {
        Contato contato = contatoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contato não encontrado com ID: " + id));
        return contatoMapper.toContatoResponseDTO(contato);
    }

    @Transactional(readOnly = true)
    @Cacheable(key = "'email-' + #email")
    public ContatoResponseDTO buscarPorEmail(String email) {
        Contato contato = contatoRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Contato não encontrado com Email: " + email));
        return contatoMapper.toContatoResponseDTO(contato);
    }

    @Transactional
    @CacheEvict(cacheNames = "contatos", allEntries = true)
    public ContatoResponseDTO criar(ContatoRequestDTO contatoRequestDTO) {
        contatoRepository.findByEmail(contatoRequestDTO.getEmail()).ifPresent(c -> {
            throw new IllegalArgumentException("Contato com o email '" + contatoRequestDTO.getEmail() + "' já existe.");
        });

        Contato contato = contatoMapper.toContato(contatoRequestDTO);
        Contato contatoSalvo = contatoRepository.save(contato);
        return contatoMapper.toContatoResponseDTO(contatoSalvo);
    }

    @Transactional
    @CachePut(key = "#id")
    @CacheEvict(cacheNames = "contatos", allEntries = true, condition = "#result != null")
    public ContatoResponseDTO atualizar(Long id, ContatoRequestDTO contatoRequestDTO) {
        Contato contatoExistente = contatoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contato não encontrado com ID: " + id));

        if (org.springframework.util.StringUtils.hasText(contatoRequestDTO.getEmail()) && !contatoExistente.getEmail().equalsIgnoreCase(contatoRequestDTO.getEmail())) {
            contatoRepository.findByEmail(contatoRequestDTO.getEmail()).ifPresent(c -> {
                if (!c.getIdContato().equals(id)) {
                    throw new IllegalArgumentException("Outro contato com o email '" + contatoRequestDTO.getEmail() + "' já existe.");
                }
            });
        }

        contatoMapper.updateContatoFromDto(contatoRequestDTO, contatoExistente);
        Contato contatoAtualizado = contatoRepository.save(contatoExistente);
        return contatoMapper.toContatoResponseDTO(contatoAtualizado);
    }

    @Transactional
    @CacheEvict(cacheNames = "contatos", allEntries = true)
    public void deletar(Long id) {
        Contato contatoParaDeletar = contatoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contato não encontrado com ID: " + id + " para exclusão."));

        if (contatoParaDeletar.getClientes() != null && !contatoParaDeletar.getClientes().isEmpty()) {
            throw new DataIntegrityViolationException("Contato está associado a um ou mais clientes e não pode ser excluído.");
        }
        contatoRepository.deleteById(id);
    }
}