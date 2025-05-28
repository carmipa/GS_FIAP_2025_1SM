package br.com.fiap.gs.gsapi.service;

import br.com.fiap.gs.gsapi.client.NasaEonetClient; // Import correto
import br.com.fiap.gs.gsapi.dto.external.NasaEonetApiResponseDTO; // Import do pacote correto
import br.com.fiap.gs.gsapi.dto.external.NasaEonetEventDTO; // Import do pacote correto
import br.com.fiap.gs.gsapi.dto.request.EonetRequestDTO;
import br.com.fiap.gs.gsapi.dto.response.EonetResponseDTO;
import br.com.fiap.gs.gsapi.exception.ResourceNotFoundException;
import br.com.fiap.gs.gsapi.mapper.EonetMapper;
import br.com.fiap.gs.gsapi.model.Eonet;
import br.com.fiap.gs.gsapi.repository.EonetRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EonetService {

    private static final Logger logger = LoggerFactory.getLogger(EonetService.class);

    private final EonetRepository eonetRepository;
    private final EonetMapper eonetMapper;
    private final NasaEonetClient nasaEonetClient;

    @Autowired
    public EonetService(EonetRepository eonetRepository,
                        EonetMapper eonetMapper,
                        NasaEonetClient nasaEonetClient) {
        this.eonetRepository = eonetRepository;
        this.eonetMapper = eonetMapper;
        this.nasaEonetClient = nasaEonetClient;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "eonetEventos", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()")
    public Page<EonetResponseDTO> listarTodosEventos(Pageable pageable) {
        Page<Eonet> eventosPage = eonetRepository.findAll(pageable);
        return eventosPage.map(eonetMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "eonetEventoById", key = "#id")
    public EonetResponseDTO buscarEventoPorIdInterno(Long id) {
        Eonet evento = eonetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento EONET não encontrado com o ID interno: " + id));
        return eonetMapper.toResponseDTO(evento);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "eonetEventoByApiId", key = "#eonetApiId")
    public EonetResponseDTO buscarEventoPorEonetApiId(String eonetApiId) {
        Eonet evento = eonetRepository.findByEonetIdApi(eonetApiId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento EONET não encontrado com o ID da API: " + eonetApiId));
        return eonetMapper.toResponseDTO(evento);
    }

    @Transactional
    @CacheEvict(value = {"eonetEventos", "eonetEventoById", "eonetEventoByApiId", "eonetEventosPorData"}, allEntries = true)
    public EonetResponseDTO salvarEventoManualmente(EonetRequestDTO eonetRequestDTO) {
        eonetRepository.findByEonetIdApi(eonetRequestDTO.getEonetIdApi()).ifPresent(existingEvent -> {
            throw new IllegalArgumentException("Já existe um evento EONET registrado com o API ID: " + eonetRequestDTO.getEonetIdApi());
        });

        Eonet evento = eonetMapper.toEntity(eonetRequestDTO);
        Eonet eventoSalvo = eonetRepository.save(evento);
        return eonetMapper.toResponseDTO(eventoSalvo);
    }

    @Transactional
    @CachePut(value = "eonetEventoById", key = "#idInterno")
    @CacheEvict(value = {"eonetEventos", "eonetEventoByApiId", "eonetEventosPorData"}, allEntries = true)
    public EonetResponseDTO atualizarEventoManualmente(Long idInterno, EonetRequestDTO eonetRequestDTO) {
        Eonet eventoExistente = eonetRepository.findById(idInterno)
                .orElseThrow(() -> new ResourceNotFoundException("Evento EONET não encontrado com o ID interno: " + idInterno));

        if (!eventoExistente.getEonetIdApi().equals(eonetRequestDTO.getEonetIdApi())) {
            eonetRepository.findByEonetIdApi(eonetRequestDTO.getEonetIdApi()).ifPresent(anotherEvent -> {
                if (!anotherEvent.getIdEonet().equals(idInterno)) {
                    throw new IllegalArgumentException("Já existe outro evento EONET registrado com o API ID: " + eonetRequestDTO.getEonetIdApi());
                }
            });
        }

        eventoExistente.setEonetIdApi(eonetRequestDTO.getEonetIdApi());
        eventoExistente.setJson(eonetRequestDTO.getJson());
        eventoExistente.setData(eonetRequestDTO.getData());

        Eonet eventoAtualizado = eonetRepository.save(eventoExistente);
        return eonetMapper.toResponseDTO(eventoAtualizado);
    }

    @Transactional
    @CacheEvict(value = {"eonetEventos", "eonetEventoById", "eonetEventoByApiId", "eonetEventosPorData"}, allEntries = true)
    public void deletarEvento(Long idInterno) {
        if (!eonetRepository.existsById(idInterno)) {
            throw new ResourceNotFoundException("Evento EONET não encontrado com o ID interno: " + idInterno);
        }
        eonetRepository.deleteById(idInterno);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "eonetEventosPorData", key = "#dataInicial.toString() + '-' + #dataFinal.toString()")
    public List<EonetResponseDTO> buscarEventosPorIntervaloDeData(OffsetDateTime dataInicial, OffsetDateTime dataFinal) {
        if (dataInicial == null || dataFinal == null || dataInicial.isAfter(dataFinal)) {
            throw new IllegalArgumentException("Datas inválidas para busca. Data inicial deve ser anterior à data final.");
        }
        List<Eonet> eventos = eonetRepository.findByDataBetween(dataInicial, dataFinal);
        return eventos.stream()
                .map(eonetMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = {"eonetEventos", "eonetEventoById", "eonetEventoByApiId", "eonetEventosPorData"}, allEntries = true)
    public List<EonetResponseDTO> sincronizarEventosDaNasa(Integer limit, Integer days, String status, String source) {
        logger.info("Iniciando sincronização de eventos da NASA EONET. Limite: {}, Dias: {}, Status: {}, Fonte: {}",
                limit, days, status, source);

        NasaEonetApiResponseDTO respostaDaApi = nasaEonetClient.getEvents(limit, days, status, source);
        List<EonetResponseDTO> eventosSalvosOuAtualizados = new ArrayList<>();

        if (respostaDaApi != null && respostaDaApi.getEvents() != null) {
            for (NasaEonetEventDTO eventoDtoDaApi : respostaDaApi.getEvents()) {
                if (eventoDtoDaApi.getId() == null) {
                    logger.warn("Evento da API EONET recebido sem ID, pulando: {}", eventoDtoDaApi.getTitle());
                    continue;
                }

                Eonet eventoParaSalvar = eonetRepository.findByEonetIdApi(eventoDtoDaApi.getId())
                        .orElse(new Eonet());

                eventoParaSalvar.setEonetIdApi(eventoDtoDaApi.getId());

                String eventoJsonString = nasaEonetClient.convertEventDtoToJsonString(eventoDtoDaApi);
                eventoParaSalvar.setJson(eventoJsonString);

                OffsetDateTime principalDate = eventoDtoDaApi.getPrincipalDate();
                if (principalDate == null && eventoDtoDaApi.getGeometry() != null && !eventoDtoDaApi.getGeometry().isEmpty()) {
                    principalDate = eventoDtoDaApi.getGeometry().get(0).getDate();
                }
                eventoParaSalvar.setData(principalDate);

                Eonet eonetSalvo = eonetRepository.save(eventoParaSalvar);
                eventosSalvosOuAtualizados.add(eonetMapper.toResponseDTO(eonetSalvo));
                logger.debug("Evento EONET {} salvo/atualizado no banco de dados.", eonetSalvo.getEonetIdApi());
            }
            logger.info("{} eventos da NASA EONET processados. {} salvos/atualizados.",
                    respostaDaApi.getEvents().size(), eventosSalvosOuAtualizados.size());
        } else {
            logger.warn("Nenhum evento recebido da API da NASA EONET para os parâmetros fornecidos.");
        }
        return eventosSalvosOuAtualizados;
    }
}