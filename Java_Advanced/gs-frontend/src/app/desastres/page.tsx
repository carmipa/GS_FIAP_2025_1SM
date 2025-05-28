// src/app/desastres/page.tsx
'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import { listarEventosEonet, sincronizarNasaEonet, buscarEventosNasaProximos, buscarClientePorId } from '@/lib/apiService';
import type { EonetResponseDTO, Page, NasaEonetEventDTO, NasaEonetCategoryDTO, NasaEonetGeometryDTO, ClienteResponseDTO } from '@/lib/types';

const parseEonetEventJson = (jsonString: string): Partial<NasaEonetEventDTO> | null => {
    try {
        return JSON.parse(jsonString) as Partial<NasaEonetEventDTO>;
    } catch (error) {
        console.error("Erro ao parsear JSON do evento EONET:", error);
        return null;
    }
};

type TabKey = 'sincronizar' | 'buscarProximos' | 'listarLocais';

export default function DesastresPage() {
    // Estado para a aba ativa
    const [activeTab, setActiveTab] = useState<TabKey>('listarLocais');

    // Estados para listagem local
    const [eventosLocaisPage, setEventosLocaisPage] = useState<Page<EonetResponseDTO> | null>(null);
    const [erroListagemLocal, setErroListagemLocal] = useState<string | null>(null);
    const [loadingListagemLocal, setLoadingListagemLocal] = useState<boolean>(true);
    const [currentLocalPage, setCurrentLocalPage] = useState<number>(0);

    // Estados para sincronização
    const [syncParams, setSyncParams] = useState({ limit: '', days: '', status: 'open', source: '' });
    const [loadingSync, setLoadingSync] = useState<boolean>(false);
    const [syncMensagem, setSyncMensagem] = useState<string | null>(null);
    const [syncErro, setSyncErro] = useState<string | null>(null);

    // Estados para busca por proximidade
    const [proximidadeParams, setProximidadeParams] = useState({
        clienteId: '',
        latitude: '',
        longitude: '',
        raioKm: '100',
        limit: '10', days: '30', status: 'open', source: ''
    });
    const [eventosProximos, setEventosProximos] = useState<NasaEonetEventDTO[]>([]);
    const [loadingProximidade, setLoadingProximidade] = useState<boolean>(false);
    const [erroProximidade, setErroProximidade] = useState<string | null>(null);

    const clienteIdRef = useRef<HTMLInputElement>(null);
    const latitudeRef = useRef<HTMLInputElement>(null);
    const longitudeRef = useRef<HTMLInputElement>(null);
    const raioKmRef = useRef<HTMLInputElement>(null);

    const fetchEventosLocais = async (page: number) => {
        setLoadingListagemLocal(true);
        setErroListagemLocal(null);
        try {
            const data = await listarEventosEonet(page, 5);
            setEventosLocaisPage(data);
        } catch (error: any) {
            setErroListagemLocal(`Falha ao carregar eventos locais: ${error.message || 'Erro desconhecido'}`);
            setEventosLocaisPage(null);
        } finally {
            setLoadingListagemLocal(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'listarLocais') {
            fetchEventosLocais(currentLocalPage);
        }
    }, [currentLocalPage, activeTab]); // Adicionado activeTab como dependência

    const handleSyncParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSyncParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSincronizar = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingSync(true);
        setSyncMensagem("Sincronizando com a NASA EONET...");
        setSyncErro(null);
        const limitNum = syncParams.limit ? parseInt(syncParams.limit, 10) : undefined;
        const daysNum = syncParams.days ? parseInt(syncParams.days, 10) : undefined;
        try {
            const eventosSincronizados = await sincronizarNasaEonet(limitNum, daysNum, syncParams.status || undefined, syncParams.source || undefined);
            setSyncMensagem(`${eventosSincronizados.length} evento(s) processado(s) / sincronizado(s) com sucesso! A lista de eventos locais será atualizada.`);
            // Opcional: Mudar para a aba de listagem local após sincronizar
            // setActiveTab('listarLocais');
            // fetchEventosLocais(0); // Recarrega a lista da primeira página
            // setCurrentLocalPage(0); // Reseta para a primeira página
        } catch (error: any) {
            setSyncErro(`Falha na sincronização: ${error.message || 'Erro desconhecido'}`);
            setSyncMensagem(null);
        } finally {
            setLoadingSync(false);
        }
    };

    const handleProximidadeParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProximidadeParams(prev => ({ ...prev, [name]: value }));
        if (name === 'clienteId' && value === '') {
            setProximidadeParams(prev => ({ ...prev, latitude: '', longitude: ''}));
        }
    };

    const buscarCoordenadasCliente = async () => {
        if (!proximidadeParams.clienteId) {
            setErroProximidade("Informe um ID de Cliente para buscar suas coordenadas.");
            clienteIdRef.current?.focus();
            return;
        }
        setLoadingProximidade(true);
        setErroProximidade(null);
        try {
            const cliente: ClienteResponseDTO = await buscarClientePorId(Number(proximidadeParams.clienteId));
            if (cliente.enderecos && cliente.enderecos.length > 0 && cliente.enderecos[0]) {
                const enderecoPrincipal = cliente.enderecos[0];
                setProximidadeParams(prev => ({
                    ...prev,
                    latitude: String(enderecoPrincipal.latitude),
                    longitude: String(enderecoPrincipal.longitude)
                }));
                setErroProximidade(null);
            } else {
                setErroProximidade("Cliente encontrado, mas não possui endereço principal com coordenadas.");
                setProximidadeParams(prev => ({ ...prev, latitude: '', longitude: ''}));
                latitudeRef.current?.focus();
            }
        } catch (error: any) {
            setErroProximidade(`Falha ao buscar coordenadas do cliente: ${error.message}`);
            setProximidadeParams(prev => ({ ...prev, latitude: '', longitude: ''}));
        } finally {
            setLoadingProximidade(false);
        }
    };

    const handleBuscarProximidade = async (e: FormEvent) => {
        e.preventDefault();
        setErroProximidade(null);
        if (!proximidadeParams.latitude || !proximidadeParams.longitude) {
            setErroProximidade("Latitude e Longitude são obrigatórias para busca por proximidade.");
            if(!proximidadeParams.latitude) latitudeRef.current?.focus();
            else longitudeRef.current?.focus();
            return;
        }
        if (!proximidadeParams.raioKm || Number(proximidadeParams.raioKm) <=0) {
            setErroProximidade("Raio em KM é obrigatório e deve ser positivo.");
            raioKmRef.current?.focus();
            return;
        }

        setLoadingProximidade(true);
        setEventosProximos([]);
        try {
            const eventos = await buscarEventosNasaProximos(
                parseFloat(proximidadeParams.latitude),
                parseFloat(proximidadeParams.longitude),
                parseFloat(proximidadeParams.raioKm),
                proximidadeParams.limit ? parseInt(proximidadeParams.limit, 10) : undefined,
                proximidadeParams.days ? parseInt(proximidadeParams.days, 10) : undefined,
                proximidadeParams.status || undefined,
                proximidadeParams.source || undefined
            );
            setEventosProximos(eventos);
            if(eventos.length === 0){
                setErroProximidade("Nenhum evento encontrado na API da NASA para os critérios fornecidos.");
            }
        } catch (error: any) {
            setErroProximidade(`Falha ao buscar eventos próximos: ${error.message}`);
        } finally {
            setLoadingProximidade(false);
        }
    };

    const formatDate = (dateString?: string | Date): string => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('pt-BR', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
            });
        } catch (e) { return 'Data inválida'; }
    };

    const renderEventoItem = (evento: NasaEonetEventDTO | Partial<NasaEonetEventDTO>, keyPrefix: string = "prox") => {
        const dataEvento = evento?.geometry?.[0]?.date;
        return (
            <div className="client-info-section"> {/* Reutilizando classe para consistência */}
                <strong>{evento?.title || 'Título não disponível'}</strong>
                {evento?.id && <p><span className="label">ID NASA:</span> {evento.id}</p>}
                <p><span className="label">Data do Evento:</span> {formatDate(dataEvento?.toString())}</p>
                {evento?.categories && evento.categories.length > 0 && (
                    <p><span className="label">Categorias:</span> {evento.categories.map((cat: NasaEonetCategoryDTO) => cat.title).join(', ')}</p>
                )}
                {evento?.link && (
                    <p><span className="label">Fonte:</span> <a href={evento.link} target="_blank" rel="noopener noreferrer" style={{color: '#007bff'}}>Ver na NASA EONET</a></p>
                )}
                {evento?.geometry && evento.geometry.length > 0 && evento.geometry[0].coordinates && (
                    <p style={{fontSize: '0.85em', color: '#666'}}>
                        <span className="label">Coordenadas (primeira geometria):</span> {JSON.stringify(evento.geometry[0].coordinates)}
                    </p>
                )}
            </div>
        );
    };

    // Estilos para as abas
    const tabButtonStyle = (tabKey: TabKey): React.CSSProperties => ({
        padding: '10px 20px',
        cursor: 'pointer',
        border: '1px solid transparent',
        borderBottom: 'none',
        backgroundColor: activeTab === tabKey ? '#fff' : '#f0f0f0',
        fontWeight: activeTab === tabKey ? 'bold' : 'normal',
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        marginRight: '5px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: activeTab === tabKey ? '#007bff' : '#333',
        borderBottomColor: activeTab === tabKey ? '#fff' : '#ddd', // Para "conectar" com o conteúdo
        position: 'relative',
        bottom: activeTab === tabKey ? '-1px' : '0', // Para "levantar" a aba ativa
    });

    const tabContentStyle: React.CSSProperties = {
        border: '1px solid #ddd',
        padding: '20px',
        borderRadius: '0 6px 6px 6px', // Arredondar cantos exceto o superior esquerdo da primeira aba
        backgroundColor: '#fff',
    };


    return (
        <div className="container">
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1.8em' }}>public</span>
                Gerenciamento de Eventos de Desastres (EONET)
            </h1>

            {/* Navegação por Abas */}
            <div style={{ marginBottom: '0px', borderBottom: '1px solid #ddd' }}>
                <button style={tabButtonStyle('listarLocais')} onClick={() => setActiveTab('listarLocais')}>
                    <span className="material-icons-outlined">storage</span> Eventos Locais
                </button>
                <button style={tabButtonStyle('sincronizar')} onClick={() => setActiveTab('sincronizar')}>
                    <span className="material-icons-outlined">sync</span> Sincronizar NASA
                </button>
                <button style={tabButtonStyle('buscarProximos')} onClick={() => setActiveTab('buscarProximos')}>
                    <span className="material-icons-outlined">travel_explore</span> Buscar Próximos
                </button>
            </div>

            {/* Conteúdo da Aba Ativa */}
            <div style={tabContentStyle}>
                {activeTab === 'listarLocais' && (
                    <section>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0', marginBottom: '20px' }}>
                            <span className="material-icons-outlined" style={{ fontSize: '1.5em' }}>list_alt</span>
                            Eventos EONET Armazenados Localmente
                        </h2>
                        {loadingListagemLocal && !eventosLocaisPage && <p>Carregando eventos locais...</p>}
                        {erroListagemLocal && <p className="message error">{erroListagemLocal}</p>}
                        {(!eventosLocaisPage || eventosLocaisPage.content.length === 0) && !loadingListagemLocal && !erroListagemLocal && (
                            <div style={{ textAlign: 'center', padding: '30px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                <p>Nenhum evento EONET encontrado no banco de dados local.</p>
                                <p>Vá para a aba "Sincronizar NASA" para buscar novos eventos.</p>
                            </div>
                        )}
                        {eventosLocaisPage && eventosLocaisPage.content.length > 0 && (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {eventosLocaisPage.content.map(eonetResp => {
                                    const eventoDetalhes = eonetResp.json ? parseEonetEventJson(eonetResp.json) : null;
                                    return (
                                        <li key={eonetResp.idEonet} className="client-list-item" style={{marginBottom: '12px'}}>
                                            {renderEventoItem(eventoDetalhes, `local-${eonetResp.idEonet}`)}
                                            <small style={{display: 'block', textAlign:'right', color: '#888'}}>ID Local: {eonetResp.idEonet}, Data Registro Local: {formatDate(eonetResp.data?.toString())}</small>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        {eventosLocaisPage && eventosLocaisPage.totalPages > 0 && (
                            <div className="pagination-controls">
                                <button onClick={() => setCurrentLocalPage(p => Math.max(0, p - 1))} disabled={eventosLocaisPage.first || loadingListagemLocal} className="button button-secondary">
                                    <span className="material-icons-outlined">navigate_before</span> Anterior
                                </button>
                                <span>Página {eventosLocaisPage.number + 1} de {eventosLocaisPage.totalPages}</span>
                                <button onClick={() => setCurrentLocalPage(p => Math.min(eventosLocaisPage.totalPages - 1, p + 1))} disabled={eventosLocaisPage.last || loadingListagemLocal} className="button button-secondary">
                                    Próxima <span className="material-icons-outlined">navigate_next</span>
                                </button>
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'sincronizar' && (
                    <section>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0', marginBottom: '20px' }}>
                            <span className="material-icons-outlined" style={{ fontSize: '1.5em' }}>cloud_sync</span>
                            Sincronizar com NASA EONET
                        </h2>
                        <form onSubmit={handleSincronizar} className="form-container" style={{padding: '0'}}>
                            <div className="form-row">
                                <div className="form-group flex-item"><label htmlFor="syncLimit">Limite de eventos:</label><input type="number" id="syncLimit" name="limit" value={syncParams.limit} onChange={handleSyncParamChange} placeholder="Ex: 20 (opcional)" /></div>
                                <div className="form-group flex-item"><label htmlFor="syncDays">Dias anteriores:</label><input type="number" id="syncDays" name="days" value={syncParams.days} onChange={handleSyncParamChange} placeholder="Ex: 30 (opcional)" /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-item"><label htmlFor="syncStatus">Status do evento:</label><select id="syncStatus" name="status" value={syncParams.status} onChange={handleSyncParamChange}><option value="open">Abertos (open)</option><option value="closed">Fechados (closed)</option><option value="">Todos</option></select></div>
                                <div className="form-group flex-item"><label htmlFor="syncSource">Fonte do evento:</label><input type="text" id="syncSource" name="source" value={syncParams.source} onChange={handleSyncParamChange} placeholder="Ex: PDC, CEMS (opcional)" /></div>
                            </div>
                            <button type="submit" className="button button-primary" disabled={loadingSync} style={{marginTop: '10px'}}>
                                <span className="material-icons-outlined">sync</span>
                                {loadingSync ? 'Sincronizando...' : 'Iniciar Sincronização'}
                            </button>
                            {syncMensagem && <p className="message success" style={{marginTop: '10px'}}>{syncMensagem}</p>}
                            {syncErro && <p className="message error" style={{marginTop: '10px'}}>{syncErro}</p>}
                        </form>
                    </section>
                )}

                {activeTab === 'buscarProximos' && (
                    <section>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0', marginBottom: '20px' }}>
                            <span className="material-icons-outlined" style={{ fontSize: '1.5em' }}>map</span>
                            Buscar Eventos Próximos na NASA API
                        </h2>
                        <form onSubmit={handleBuscarProximidade} className="form-container" style={{padding: '0'}}>
                            <div className="form-row">
                                <div className="form-group flex-item">
                                    <label htmlFor="clienteId">ID do Cliente (p/ coords.):</label>
                                    <input type="number" id="clienteId" name="clienteId" ref={clienteIdRef} value={proximidadeParams.clienteId} onChange={handleProximidadeParamChange} placeholder="Opcional"/>
                                </div>
                                <div className="form-group flex-item" style={{alignSelf: 'flex-end'}}>
                                    <button type="button" onClick={buscarCoordenadasCliente} className="button button-secondary" disabled={loadingProximidade || !proximidadeParams.clienteId} style={{marginBottom: '1px'}}>
                                        <span className="material-icons-outlined">person_pin_circle</span> Buscar Coords
                                    </button>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-item">
                                    <label htmlFor="latitude">Latitude:</label>
                                    <input type="number" step="any" id="latitude" name="latitude" ref={latitudeRef} value={proximidadeParams.latitude} onChange={handleProximidadeParamChange} placeholder="-23.550520" required />
                                </div>
                                <div className="form-group flex-item">
                                    <label htmlFor="longitude">Longitude:</label>
                                    <input type="number" step="any" id="longitude" name="longitude" ref={longitudeRef} value={proximidadeParams.longitude} onChange={handleProximidadeParamChange} placeholder="-46.633308" required />
                                </div>
                                <div className="form-group flex-item">
                                    <label htmlFor="raioKm">Raio (km):</label>
                                    <input type="number" id="raioKm" name="raioKm" ref={raioKmRef} value={proximidadeParams.raioKm} onChange={handleProximidadeParamChange} placeholder="100" required />
                                </div>
                            </div>
                            <p style={{fontSize: '0.85em', color: '#666', margin: '5px 0 15px 0'}}>Filtros adicionais (opcionais):</p>
                            <div className="form-row">
                                <div className="form-group flex-item"><label htmlFor="proxLimit">Limite:</label><input type="number" id="proxLimit" name="limit" value={proximidadeParams.limit} onChange={handleProximidadeParamChange} placeholder="Ex: 10"/></div>
                                <div className="form-group flex-item"><label htmlFor="proxDays">Dias Anteriores:</label><input type="number" id="proxDays" name="days" value={proximidadeParams.days} onChange={handleProximidadeParamChange} placeholder="Ex: 30"/></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-item"><label htmlFor="proxStatus">Status:</label><select id="proxStatus" name="status" value={proximidadeParams.status} onChange={handleProximidadeParamChange}><option value="open">Abertos</option><option value="closed">Fechados</option><option value="">Todos</option></select></div>
                                <div className="form-group flex-item"><label htmlFor="proxSource">Fonte:</label><input type="text" id="proxSource" name="source" value={proximidadeParams.source} onChange={handleProximidadeParamChange} placeholder="Ex: PDC"/></div>
                            </div>
                            <button type="submit" className="button button-primary" disabled={loadingProximidade} style={{marginTop: '10px'}}>
                                <span className="material-icons-outlined">search</span> Buscar Eventos Próximos
                            </button>
                            {erroProximidade && <p className="message error" style={{marginTop: '10px'}}>{erroProximidade}</p>}
                        </form>

                        {loadingProximidade && <p style={{textAlign:'center', margin:'15px 0'}}>Buscando eventos próximos na API da NASA...</p>}
                        {eventosProximos.length > 0 && !loadingProximidade && (
                            <div style={{marginTop: '20px'}}>
                                <h3 style={{borderBottom: '1px solid #ccc', paddingBottom:'5px'}}>Resultados da Busca por Proximidade ({eventosProximos.length} eventos):</h3>
                                <ul style={{ listStyle: 'none', padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
                                    {eventosProximos.map((evento, index) => (
                                        <li key={`${evento.id}-${index}`} className="client-list-item" style={{backgroundColor: '#f9f9f9'}}>
                                            {renderEventoItem(evento, `prox-${index}`)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {eventosProximos.length === 0 && !loadingProximidade && !erroProximidade && proximidadeParams.latitude && proximidadeParams.longitude && (
                            <p style={{textAlign:'center', margin:'15px 0', color: '#555'}}>Nenhum evento encontrado para os critérios de proximidade informados.</p>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
