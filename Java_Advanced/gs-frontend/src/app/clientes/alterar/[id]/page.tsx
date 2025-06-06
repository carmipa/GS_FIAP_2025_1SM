// src/app/clientes/alterar/[id]/page.tsx
'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    buscarClientePorId,
    atualizarCliente,
    consultarCepPelaApi,
    calcularCoordenadasPelaApi,
} from '@/lib/apiService';
import type {
    ClienteRequestDTO,
    ClienteResponseDTO,
    ContatoRequestDTO, // Ainda necessário para o tipo do estado contatoData
    EnderecoRequestDTO,
    ViaCepResponseDTO,
    EnderecoGeoRequestDTO,
    GeoCoordinatesDTO
} from '@/lib/types';

type LocalEnderecoState = Omit<Partial<EnderecoRequestDTO>, 'numero'> & { numero: string };

export default function AlterarClientePage() {
    const params = useParams();
    const router = useRouter();
    const idPath = Array.isArray(params.id) ? params.id[0] : params.id;
    const clienteId = Number(idPath);

    // Refs
    const nomeRef = useRef<HTMLInputElement>(null);
    const sobrenomeRef = useRef<HTMLInputElement>(null);
    const dataNascimentoRef = useRef<HTMLInputElement>(null);
    const documentoRef = useRef<HTMLInputElement>(null);
    const dddRef = useRef<HTMLInputElement>(null);
    const telefoneRef = useRef<HTMLInputElement>(null);
    const celularRef = useRef<HTMLInputElement>(null);
    const whatsappRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const tipoContatoRef = useRef<HTMLInputElement>(null);
    const cepRef = useRef<HTMLInputElement>(null);
    const numeroRef = useRef<HTMLInputElement>(null);
    const logradouroRef = useRef<HTMLInputElement>(null);
    const bairroRef = useRef<HTMLInputElement>(null);
    const localidadeRef = useRef<HTMLInputElement>(null);
    const ufRef = useRef<HTMLInputElement>(null);
    const latitudeRef = useRef<HTMLInputElement>(null);
    const longitudeRef = useRef<HTMLInputElement>(null);


    const [currentContatoId, setCurrentContatoId] = useState<number | undefined>(undefined);
    const [currentEnderecoId, setCurrentEnderecoId] = useState<number | undefined>(undefined);

    const [clienteData, setClienteData] = useState<Omit<ClienteRequestDTO, 'contatosIds' | 'enderecosIds'>>({
        nome: '', sobrenome: '', dataNascimento: '', documento: '',
    });
    const [contatoData, setContatoData] = useState<ContatoRequestDTO>({
        ddd: '', telefone: '', celular: '', whatsapp: '', email: '', tipoContato: 'Principal'
    });
    const [enderecoData, setEnderecoData] = useState<LocalEnderecoState>({
        cep: '', numero: '', logradouro: '', bairro: '', localidade: '', uf: '', complemento: '', latitude: 0, longitude: 0
    });

    const [mensagem, setMensagem] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [buscandoCep, setBuscandoCep] = useState<boolean>(false);
    const [buscandoCoords, setBuscandoCoords] = useState<boolean>(false);

    useEffect(() => {
        if (idPath && !isNaN(clienteId)) {
            setInitialLoading(true);
            setErro('');
            buscarClientePorId(clienteId)
                .then((data: ClienteResponseDTO) => {
                    setClienteData({
                        nome: data.nome,
                        sobrenome: data.sobrenome,
                        dataNascimento: data.dataNascimento && data.dataNascimento.includes('/') ?
                            data.dataNascimento.split('/').reverse().join('-') :
                            (data.dataNascimento || ''),
                        documento: (data.documento || '').replace(/\D/g, ''),
                    });
                    if (data.contatos && data.contatos.length > 0 && data.contatos[0]) {
                        const contatoPrincipal = data.contatos[0];
                        setContatoData({
                            ...contatoPrincipal,
                            ddd: contatoPrincipal.ddd.replace(/\D/g, ''),
                            telefone: contatoPrincipal.telefone.replace(/\D/g, ''),
                            celular: contatoPrincipal.celular?.replace(/\D/g, ''),
                            whatsapp: contatoPrincipal.whatsapp?.replace(/\D/g, '')
                        });
                        setCurrentContatoId(contatoPrincipal.idContato);
                    }
                    if (data.enderecos && data.enderecos.length > 0 && data.enderecos[0]) {
                        const endPrincipal = data.enderecos[0];
                        setEnderecoData({
                            ...endPrincipal,
                            cep: (endPrincipal.cep || '').replace(/\D/g, ''),
                            numero: String(endPrincipal.numero ?? ''),
                            latitude: endPrincipal.latitude || 0,
                            longitude: endPrincipal.longitude || 0,
                        });
                        setCurrentEnderecoId(endPrincipal.idEndereco);
                    }
                })
                .catch(fetchError => {
                    console.error("Erro ao buscar dados do cliente para alteração:", fetchError);
                    const message = fetchError instanceof Error ? fetchError.message : 'Erro desconhecido ao buscar cliente.';
                    setErro(`Falha ao carregar dados do cliente: ${message}`);
                })
                .finally(() => setInitialLoading(false));
        } else {
            setErro("ID do cliente inválido ou não fornecido.");
            setInitialLoading(false);
        }
    }, [idPath, clienteId]);

    const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "documento") {
            const cleanedValue = value.replace(/\D/g, '');
            setClienteData(prev => ({ ...prev, [name]: cleanedValue.slice(0,18) }));
        } else {
            setClienteData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleContatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'ddd' || name === 'telefone' || name === 'celular' || name === 'whatsapp') {
            let numericValue = value.replace(/\D/g, '');
            const maxLength: number =
                name === 'ddd' ? 3 :
                    name === 'telefone' ? 9 :
                        name === 'celular' ? 9 :
                            name === 'whatsapp' ? 9 :
                                15;

            if (numericValue.length > maxLength) {
                numericValue = numericValue.slice(0, maxLength);
            }
            setContatoData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setContatoData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'cep' || name === 'numero') {
            let cleanedValue = value.replace(/\D/g, '');
            const determinedMaxLength = name === 'cep' ? 8 : 5;
            if (cleanedValue.length > determinedMaxLength) {
                cleanedValue = cleanedValue.slice(0, determinedMaxLength);
            }
            setEnderecoData(prev => ({ ...prev, [name]: cleanedValue }));
        } else if (name === 'latitude' || name === 'longitude') {
            setEnderecoData(prev => ({ ...prev, [name]: value ? parseFloat(value) : 0 }));
        } else if (name === 'uf') {
            setEnderecoData(prev => ({ ...prev, [name]: value.toUpperCase().slice(0,2) }));
        }
        else {
            setEnderecoData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCepBlur = async () => {
        const cepLimpo = (enderecoData.cep || '').replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            setBuscandoCep(true); setErro('');
            setMensagem('Buscando dados do CEP...');
            try {
                const viaCepDados: ViaCepResponseDTO = await consultarCepPelaApi(cepLimpo);
                setEnderecoData(prev => ({
                    ...prev,
                    logradouro: viaCepDados.logradouro || prev.logradouro || '',
                    bairro: viaCepDados.bairro || prev.bairro || '',
                    localidade: viaCepDados.localidade || prev.localidade || '',
                    uf: viaCepDados.uf || prev.uf || '',
                    cep: viaCepDados.cep?.replace(/\D/g, '') || prev.cep || '',
                    latitude: 0,
                    longitude: 0
                }));
                setMensagem('Dados do CEP carregados. Preencha/verifique o número e clique em "Obter Coordenadas" se necessário.');
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Erro desconhecido na busca do CEP.';
                setErro(`Falha na busca do endereço: ${message}. Preencha manualmente.`);
                setMensagem('');
            } finally {
                setBuscandoCep(false);
            }
        } else if (enderecoData.cep && cepLimpo.length !== 8) {
            setErro('CEP inválido. Deve conter 8 dígitos.');
            cepRef.current?.focus();
            setMensagem('');
        }
    };

    const handleGerarCoordenadasClick = async () => {
        const numeroLimpoStr = (enderecoData.numero || '').trim().replace(/\D/g, '');
        if (!enderecoData.logradouro && !enderecoData.localidade && !enderecoData.uf) {
            setErro("Preencha pelo menos Cidade e UF, ou o endereço completo, para gerar coordenadas.");
            logradouroRef.current?.focus();
            setMensagem(''); return;
        }
        if (enderecoData.logradouro && (!numeroLimpoStr || numeroLimpoStr === "0")) {
            setErro("Se informou logradouro, por favor, informe o Número para gerar coordenadas precisas.");
            numeroRef.current?.focus();
            setMensagem(''); return;
        }
        setBuscandoCoords(true); setErro(''); setMensagem('Gerando coordenadas...');
        try {
            const geoRequestData: EnderecoGeoRequestDTO = {
                logradouro: enderecoData.logradouro || '',
                numero: parseInt(numeroLimpoStr, 10) || 0,
                cidade: enderecoData.localidade || '',
                uf: enderecoData.uf || '',
                bairro: enderecoData.bairro || '',
                cep: (enderecoData.cep || '').replace(/\D/g, '')
            };
            const coordenadas: GeoCoordinatesDTO = await calcularCoordenadasPelaApi(geoRequestData);
            setEnderecoData(prev => ({
                ...prev,
                latitude: coordenadas.latitude || 0,
                longitude: coordenadas.longitude || 0
            }));
            if (!coordenadas.latitude || !coordenadas.longitude) {
                setErro("Não foi possível obter coordenadas. Verifique os dados e tente novamente ou preencha manualmente se souber.");
                latitudeRef.current?.focus();
                setMensagem('');
            } else {
                setMensagem(`Coordenadas: Lat ${Number(coordenadas.latitude).toFixed(7)}, Lon ${Number(coordenadas.longitude).toFixed(7)}.`);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido ao gerar coordenadas.';
            setErro(`Falha ao gerar coordenadas: ${message}`);
            setMensagem('');
        } finally { setBuscandoCoords(false); }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isNaN(clienteId)) {
            setErro("ID do cliente inválido para atualização.");
            return;
        }
        setErro(''); setMensagem('');

        if (!clienteData.nome.trim()) { setErro("Nome é obrigatório."); nomeRef.current?.focus(); return; }
        if (!clienteData.sobrenome.trim()) { setErro("Sobrenome é obrigatório."); sobrenomeRef.current?.focus(); return; }
        if (!clienteData.dataNascimento) { setErro("Data de nascimento é obrigatória."); dataNascimentoRef.current?.focus(); return; }

        const cleanedDocumento = clienteData.documento.replace(/\D/g, '');
        if (!cleanedDocumento) { setErro("Documento é obrigatório."); documentoRef.current?.focus(); return; }
        if (cleanedDocumento.length < 11 || cleanedDocumento.length > 14) {
            setErro("Documento (CPF/CNPJ) deve ter 11 ou 14 números.");
            documentoRef.current?.focus(); return;
        }

        const cleanedDdd = contatoData.ddd.replace(/\D/g, '');
        const cleanedTelefone = contatoData.telefone.replace(/\D/g, '');
        const cleanedCelular = contatoData.celular?.replace(/\D/g, '') || '';
        const cleanedWhatsapp = contatoData.whatsapp?.replace(/\D/g, '') || '';

        if (!cleanedDdd) { setErro("DDD do contato é obrigatório."); dddRef.current?.focus(); return; }
        if (cleanedDdd.length < 2 || cleanedDdd.length > 3) { setErro("DDD do contato deve ter entre 2 e 3 dígitos."); dddRef.current?.focus(); return; }
        if (!cleanedTelefone) { setErro("Telefone principal do contato é obrigatório."); telefoneRef.current?.focus(); return; }
        if (cleanedTelefone.length < 8 || cleanedTelefone.length > 9) { setErro("Telefone principal deve ter entre 8 e 9 dígitos."); telefoneRef.current?.focus(); return; }
        if (cleanedCelular && (cleanedCelular.length < 8 || cleanedCelular.length > 9)) { setErro("Celular deve ter entre 8 e 9 dígitos (se preenchido)."); celularRef.current?.focus(); return; }
        if (cleanedWhatsapp && (cleanedWhatsapp.length < 8 || cleanedWhatsapp.length > 9)) { setErro("WhatsApp deve ter entre 8 e 9 dígitos (se preenchido)."); whatsappRef.current?.focus(); return; }
        if (!contatoData.email.trim()) { setErro("Email do contato é obrigatório."); emailRef.current?.focus(); return; }
        if (!contatoData.tipoContato.trim()) { setErro("Tipo de contato é obrigatório."); tipoContatoRef.current?.focus(); return; }

        const cleanedCep = (enderecoData.cep || '').replace(/\D/g, '');
        const cleanedNumero = parseInt(enderecoData.numero || '0', 10) || 0;

        if (!cleanedCep) { setErro("CEP do endereço é obrigatório."); cepRef.current?.focus(); return; }
        if (cleanedCep.length !== 8) { setErro("CEP do endereço deve ter 8 dígitos."); cepRef.current?.focus(); return; }
        if (cleanedNumero === 0) { setErro("Número do endereço é obrigatório."); numeroRef.current?.focus(); return; }
        if (!enderecoData.logradouro?.trim()) { setErro("Logradouro do endereço é obrigatório."); logradouroRef.current?.focus(); return; }
        if (!enderecoData.bairro?.trim()) { setErro("Bairro do endereço é obrigatório."); bairroRef.current?.focus(); return; }
        if (!enderecoData.localidade?.trim()) { setErro("Localidade (cidade) do endereço é obrigatória."); localidadeRef.current?.focus(); return; }
        if (!enderecoData.uf?.trim() || enderecoData.uf.trim().length !== 2) { setErro("UF do endereço é obrigatória e deve ter 2 caracteres."); ufRef.current?.focus(); return; }

        const finalLatitude = Number(enderecoData.latitude) || 0;
        const finalLongitude = Number(enderecoData.longitude) || 0;
        if (finalLatitude === 0 || finalLongitude === 0) {
            setErro("Latitude e Longitude são obrigatórias. Use 'Obter Coordenadas' ou preencha manualmente.");
            latitudeRef.current?.focus(); return;
        }

        setLoadingSubmit(true);
        setMensagem('Processando atualização...');

        const finalClienteData = {...clienteData, documento: cleanedDocumento };

        // CORREÇÃO: Removida a declaração de finalContatoDataRequest pois não estava sendo utilizada no payload
        // Se precisar enviar os dados do contato completos, eles devem ser adicionados ao clientePayload
        // ou enviados em uma chamada de API separada.
        // const finalContatoDataRequest: ContatoRequestDTO = {
        //     ...contatoData,
        //     ddd: cleanedDdd,
        //     telefone: cleanedTelefone,
        //     celular: cleanedCelular || undefined,
        //     whatsapp: cleanedWhatsapp || undefined
        // };
        // console.log('Dados do contato preparados:', finalContatoDataRequest);


        try {
            const clientePayload: ClienteRequestDTO = {
                ...finalClienteData,
                contatosIds: currentContatoId ? [currentContatoId] : [],
                enderecosIds: currentEnderecoId ? [currentEnderecoId] : [],
            };

            setMensagem('Enviando atualização do cliente...');
            await atualizarCliente(clienteId, clientePayload);
            setMensagem('Cliente atualizado com sucesso! Redirecionando...');
            setTimeout(() => router.push(`/clientes/${clienteId}`), 2000);

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar cliente.';
            setErro(message.startsWith("Falha ao atualizar cliente:") ? message : `Falha ao atualizar cliente: ${message}`);
            setMensagem('');
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (initialLoading) return <div className="container"><p>Carregando dados do cliente para edição...</p></div>;
    if (erro && !clienteData.nome) return <div className="container"><p className="message error">{erro}</p><Link href="/clientes/listar">Voltar para Lista</Link></div>;

    return (
        <div className="container">
            <h1 className="page-title">Alterar Cliente (ID: {idPath})</h1>
            <form onSubmit={handleSubmit} className="form-container" autoComplete="off">
                <fieldset className="form-section">
                    <legend className="section-title">📄 Dados Pessoais</legend>
                    <div className="form-row">
                        <div className="form-group flex-item">
                            <label htmlFor="nome">👤 Nome:</label>
                            <input id="nome" ref={nomeRef} type="text" name="nome" value={clienteData.nome || ''} onChange={handleClienteChange} />
                        </div>
                        <div className="form-group flex-item">
                            <label htmlFor="sobrenome">👤 Sobrenome:</label>
                            <input id="sobrenome" ref={sobrenomeRef} type="text" name="sobrenome" value={clienteData.sobrenome || ''} onChange={handleClienteChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group flex-item">
                            <label htmlFor="dataNascimento">🎂 Data de Nascimento:</label>
                            <input id="dataNascimento" ref={dataNascimentoRef} type="date" name="dataNascimento" value={clienteData.dataNascimento || ''} onChange={handleClienteChange} />
                        </div>
                        <div className="form-group flex-item">
                            <label htmlFor="documento">🪪 Documento:</label>
                            <input id="documento" ref={documentoRef} type="text" name="documento" value={clienteData.documento || ''} onChange={handleClienteChange} maxLength={14} placeholder="Só números CPF/CNPJ"/>
                        </div>
                    </div>
                </fieldset>

                <hr className="section-divider" />

                <fieldset className="form-section">
                    <legend className="section-title">📞 Contato Principal (ID: {currentContatoId || 'N/A'})</legend>
                    <div className="form-row">
                        <div className="form-group basis-ddd">
                            <label htmlFor="alt-ddd">DDD:</label>
                            <input id="alt-ddd" ref={dddRef} type="text" name="ddd" value={contatoData.ddd || ''} onChange={handleContatoChange} maxLength={3} placeholder="Ex: 11"/>
                        </div>
                        <div className="form-group flex-item">
                            <label htmlFor="alt-telefone">Telefone:</label>
                            <input id="alt-telefone" ref={telefoneRef} type="text" name="telefone" value={contatoData.telefone || ''} onChange={handleContatoChange} maxLength={9} placeholder="Ex: 987654321"/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group flex-item">
                            <label htmlFor="alt-celular">📱 Celular:</label>
                            <input id="alt-celular" ref={celularRef} type="text" name="celular" value={contatoData.celular || ''} onChange={handleContatoChange} maxLength={9} placeholder="Ex: 987654321"/>
                        </div>
                        <div className="form-group flex-item">
                            <label htmlFor="alt-whatsapp">🟢 WhatsApp:</label>
                            <input id="alt-whatsapp" ref={whatsappRef} type="text" name="whatsapp" value={contatoData.whatsapp || ''} onChange={handleContatoChange} maxLength={9} placeholder="Ex: 987654321"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="alt-email">📧 Email:</label>
                        <input id="alt-email" ref={emailRef} type="email" name="email" value={contatoData.email || ''} onChange={handleContatoChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="alt-tipoContato">🏷️ Tipo Contato:</label>
                        <input id="alt-tipoContato" ref={tipoContatoRef} type="text" name="tipoContato" value={contatoData.tipoContato || ''} onChange={handleContatoChange} />
                    </div>
                </fieldset>

                <hr className="section-divider" />

                <fieldset className="form-section">
                    <legend className="section-title">🏠 Endereço Principal (ID: {currentEnderecoId || 'N/A'})</legend>
                    <div className="form-row">
                        <div className="form-group basis-cep">
                            <label htmlFor="alt-cep">📍 CEP:</label>
                            <input id="alt-cep" ref={cepRef} type="text" name="cep" value={enderecoData.cep || ''} onChange={handleEnderecoChange} onBlur={handleCepBlur} maxLength={8} placeholder="00000000"/>
                        </div>
                        <div className="form-group basis-numero">
                            <label htmlFor="alt-numero">Nº:</label>
                            <input
                                id="alt-numero"
                                ref={numeroRef}
                                type="text"
                                name="numero"
                                value={enderecoData.numero ?? ''}
                                onChange={handleEnderecoChange}
                                maxLength={5}
                                placeholder="Ex: 123"
                            />
                        </div>
                        <div className="form-group flex-item">
                            <label htmlFor="alt-complemento">Compl.:</label>
                            <input id="alt-complemento" type="text" name="complemento" value={enderecoData.complemento || ''} onChange={handleEnderecoChange} />
                        </div>
                    </div>
                    {buscandoCep && <p className="message info" style={{textAlign: 'center'}}>Buscando CEP...</p>}
                    <div className="form-group">
                        <label htmlFor="alt-logradouro">Logradouro:</label>
                        <input id="alt-logradouro" ref={logradouroRef} type="text" name="logradouro" value={enderecoData.logradouro || ''} onChange={handleEnderecoChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="alt-bairro">Bairro:</label>
                        <input id="alt-bairro" ref={bairroRef} type="text" name="bairro" value={enderecoData.bairro || ''} onChange={handleEnderecoChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group grow-3">
                            <label htmlFor="alt-localidade">🏙️ Localidade:</label>
                            <input id="alt-localidade" ref={localidadeRef} type="text" name="localidade" value={enderecoData.localidade || ''} onChange={handleEnderecoChange} />
                        </div>
                        <div className="form-group basis-uf">
                            <label htmlFor="alt-uf">UF:</label>
                            <input id="alt-uf" ref={ufRef} type="text" name="uf" value={enderecoData.uf || ''} onChange={handleEnderecoChange} maxLength={2} />
                        </div>
                    </div>
                </fieldset>

                <hr className="section-divider"/>

                <fieldset className="form-section coordinate-section" style={{ textAlign: 'center' }}>
                    <legend className="section-title" style={{ marginBottom: '1rem' }}>🌐 Coordenadas Geográficas</legend>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9em' }}>
                        Após preencher o endereço (CEP, Logradouro, Número, Cidade, UF), clique abaixo para obter as coordenadas.
                        <br />Ou preencha/ajuste manualmente os campos de Latitude e Longitude.
                    </p>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={handleGerarCoordenadasClick}
                            disabled={buscandoCoords || !enderecoData.logradouro || !enderecoData.numero || !enderecoData.localidade || !enderecoData.uf}
                            className="button-secondary"
                            style={{ padding: '10px 20px' }}
                        >
                            {buscandoCoords ? 'Gerando...' : 'Obter/Atualizar Coordenadas'}
                        </button>
                        {buscandoCoords && <p className="message info" style={{ marginTop: '0.5rem' }}>Consultando serviço de geocodificação...</p>}
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-item">
                            <label htmlFor="latitude" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Latitude:</label>
                            <input id="latitude" ref={latitudeRef} type="number" step="any" name="latitude" value={String(enderecoData.latitude ?? '')} onChange={handleEnderecoChange} placeholder="Ex: -23.550520" style={{ textAlign: 'center' }}/>
                        </div>
                        <div className="form-group flex-item">
                            <label htmlFor="longitude" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Longitude:</label>
                            <input id="longitude" ref={longitudeRef} type="number" step="any" name="longitude" value={String(enderecoData.longitude ?? '')} onChange={handleEnderecoChange} placeholder="Ex: -46.633308" style={{ textAlign: 'center' }}/>
                        </div>
                    </div>

                    {(Number(enderecoData.latitude) || 0) !== 0 || (Number(enderecoData.longitude) || 0) !== 0 && !buscandoCoords && (
                        <div className="coordinates-display" style={{ marginTop: '1rem', padding: '10px', backgroundColor: '#e9f5e9', borderRadius: '4px', border: '1px solid #c8e6c9' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1b5e20' }}>
                                Coordenadas Atuais:
                                Lat: <span style={{ fontFamily: 'monospace' }}>{Number(enderecoData.latitude).toFixed(7)}</span>,
                                Lon: <span style={{ fontFamily: 'monospace' }}>{Number(enderecoData.longitude).toFixed(7)}</span>
                            </p>
                        </div>
                    )}
                    {((Number(enderecoData.latitude) || 0) === 0 && (Number(enderecoData.longitude) || 0) === 0) && (enderecoData.logradouro && enderecoData.numero.trim() && enderecoData.localidade && enderecoData.uf) && !buscandoCoords &&
                        <p className="message info" style={{marginTop: '1rem'}}>Clique em &quot;Obter/Atualizar Coordenadas&quot; ou preencha manualmente.</p>
                    }
                </fieldset>

                <hr className="section-divider"/>
                <button type="submit" disabled={buscandoCep || buscandoCoords || loadingSubmit || initialLoading} className="button-primary" style={{marginTop: '20px', width: '100%', padding: '12px', fontSize: '1.1em'}}>
                    {initialLoading ? 'Carregando...' : (loadingSubmit ? 'Salvando...' : (buscandoCep || buscandoCoords ? 'Aguarde...' : 'Salvar Alterações'))}
                </button>
            </form>
            {mensagem && !erro && <p className="message success" style={{marginTop: '15px'}}>{mensagem}</p>}
            {erro && <p className="message error" style={{marginTop: '15px'}}>{erro}</p>}
            <div style={{marginTop: '20px', marginBottom: '40px', textAlign: 'center' }}>
                <Link href={`/clientes/${clienteId}`}>Cancelar e Voltar para Detalhes</Link>
                <span style={{margin: '0 10px'}}>|</span>
                <Link href="/clientes/listar">Voltar para Lista Geral</Link>
            </div>
        </div>
    );
}