// Pacote: br.com.fiap.gs.gsapi.service
package br.com.fiap.gs.gsapi.service;

import br.com.fiap.gs.gsapi.dto.request.EnderecoRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.EnderecoResponseDTO;
import br.com.fiap.gs.gsapi.exception.ResourceNotFoundException;
import br.com.fiap.gs.gsapi.mapper.EnderecoMapper;
import br.com.fiap.gs.gsapi.model.Endereco;
import br.com.fiap.gs.gsapi.repository.EnderecoRepository;
import br.com.fiap.gs.gsapi.specification.EnderecoSpecification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate; // IMPORTAR Predicate
import java.util.ArrayList; // IMPORTAR ArrayList
import java.util.List; // IMPORTAR List
import java.util.Optional;

@Service
@CacheConfig(cacheNames = "enderecos")
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final EnderecoMapper enderecoMapper;
    private final EnderecoGeocodingService enderecoGeocodingService;

    @Autowired
    public EnderecoService(EnderecoRepository enderecoRepository,
                           EnderecoMapper enderecoMapper,
                           EnderecoGeocodingService enderecoGeocodingService) {
        this.enderecoRepository = enderecoRepository;
        this.enderecoMapper = enderecoMapper;
        this.enderecoGeocodingService = enderecoGeocodingService;
    }

    @Transactional(readOnly = true)
    @Cacheable(key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString() + '-' + T(java.util.Objects).hashCode(#cep) + '-' + T(java.util.Objects).hashCode(#logradouro) + '-' + T(java.util.Objects).hashCode(#localidade)")
    public Page<EnderecoResponseDTO> listarTodos(String cep, String logradouro, String localidade, Pageable pageable) {
        // CORREÇÃO DO WARNING: Construção dinâmica da Specification
        Specification<Endereco> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(cep)) {
                // Assumindo que EnderecoSpecification.cepContem retorna uma Specification<Endereco>
                // Para combiná-las, precisamos convertê-las para Predicate no contexto atual.
                predicates.add(EnderecoSpecification.cepContem(cep).toPredicate(root, query, criteriaBuilder));
            }
            if (StringUtils.hasText(logradouro)) {
                predicates.add(EnderecoSpecification.logradouroContem(logradouro).toPredicate(root, query, criteriaBuilder));
            }
            if (StringUtils.hasText(localidade)) {
                predicates.add(EnderecoSpecification.localidadeContem(localidade).toPredicate(root, query, criteriaBuilder));
            }

            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction(); // Nenhum filtro, retorna tudo
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Endereco> enderecosPage = enderecoRepository.findAll(spec, pageable);
        return enderecosPage.map(enderecoMapper::toEnderecoResponseDTO);
    }

    @Transactional(readOnly = true)
    @Cacheable(key = "#id")
    public EnderecoResponseDTO buscarPorId(Long id) {
        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado com ID: " + id));
        return enderecoMapper.toEnderecoResponseDTO(endereco);
    }

    @Transactional
    @CacheEvict(cacheNames = "enderecos", allEntries = true)
    public EnderecoResponseDTO criar(EnderecoRequestDTO enderecoRequestDTO) {
        // Validação de duplicidade pode ser adicionada aqui se necessário
        // Ex:
        // Optional<Endereco> existente = enderecoRepository.findByCepAndNumero(
        //     enderecoRequestDTO.getCep().replaceAll("[^0-9]", ""),
        //     enderecoRequestDTO.getNumero()
        // );
        // if (existente.isPresent()) {
        //     throw new IllegalArgumentException("Endereço com CEP " + enderecoRequestDTO.getCep() + " e número " + enderecoRequestDTO.getNumero() + " já existe.");
        // }

        Endereco endereco = enderecoMapper.toEndereco(enderecoRequestDTO);
        Endereco enderecoSalvo = enderecoRepository.save(endereco);
        return enderecoMapper.toEnderecoResponseDTO(enderecoSalvo);
    }

    @Transactional
    public EnderecoResponseDTO criarOuBuscarEnderecoGeocodificado(String cep, String numero, String complemento) {
        Endereco endereco = enderecoGeocodingService.obterOuCriarEnderecoCompleto(cep, numero, complemento)
                .orElseThrow(() -> new ResourceNotFoundException("Não foi possível obter ou criar o endereço para CEP: " + cep + " e Número: " + numero));
        return enderecoMapper.toEnderecoResponseDTO(endereco);
    }

    @Transactional
    @CachePut(key = "#id")
    @CacheEvict(cacheNames = "enderecos", allEntries = true, condition = "#result != null")
    public EnderecoResponseDTO atualizar(Long id, EnderecoRequestDTO enderecoRequestDTO) {
        Endereco enderecoExistente = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado com ID: " + id));

        enderecoMapper.updateEnderecoFromDto(enderecoRequestDTO, enderecoExistente);

        Endereco enderecoAtualizado = enderecoRepository.save(enderecoExistente);
        return enderecoMapper.toEnderecoResponseDTO(enderecoAtualizado);
    }

    @Transactional
    @CacheEvict(cacheNames = "enderecos", allEntries = true)
    public void deletar(Long id) {
        Endereco enderecoParaDeletar = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado com ID: " + id + " para exclusão."));

        if (enderecoParaDeletar.getClientes() != null && !enderecoParaDeletar.getClientes().isEmpty()) {
            throw new DataIntegrityViolationException("Endereço está associado a um ou mais clientes e não pode ser excluído.");
        }

        if(enderecoParaDeletar.getEonetEventos() != null && !enderecoParaDeletar.getEonetEventos().isEmpty()){
            throw new DataIntegrityViolationException("Endereço está associado a um ou mais eventos EONET e não pode ser excluído.");
        }

        enderecoRepository.deleteById(id);
    }
}