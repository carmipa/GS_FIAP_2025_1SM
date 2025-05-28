// Localização: gs-frontend/src/app/clientes/cadastrar/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    criarCliente,
    consultarCepPelaApi,
    calcularCoordenadasPelaApi,
    criarContatoSozinho,
    criarEnderecoSozinho
} from '@/lib/apiService';
import type {
    ClienteRequestDTO,
    ContatoRequestDTO,
    EnderecoRequestDTO,
    ViaCepResponseDTO,
    EnderecoGeoRequestDTO,
    GeoCoordinatesDTO,
    ContatoResponseDTO,
    EnderecoResponseDTO
} from '@/lib/types';

export default function CadastrarClientePage() {
    const router = useRouter();
    const [clienteData, setClienteData] = useState<Omit<ClienteRequestDTO, 'contatosIds' | 'enderecosIds'>>({
        nome: '',
        sobrenome: '',
        dataNascimento: '',
        documento: '',
    });
    const [contatoData, setContatoData] = useState<ContatoRequestDTO>({
        ddd: '',
        telefone: '',
        celular: '',
        whatsapp: '',
        email: '',
        tipoContato: 'Principal',
    });
    const [enderecoData, setEnderecoData] = useState<Partial<EnderecoRequestDTO & {numero: string | number}>>({
        cep: '',
        numero: '',
        logradouro: '',
        bairro: '',
        localidade: '',
        uf: '',
        complemento: '',
        latitude: 0,
        longitude: 0,
    });

    const [mensagem, setMensagem] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Para o submit principal
    const [buscandoCep, setBuscandoCep] = useState<boolean>(false); // Apenas para busca de CEP
    const [buscandoCoords, setBuscandoCoords] = useState<boolean>(false); // Para busca de coordenadas

    const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClienteData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleContatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContatoData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnderecoData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCepBlur = async () => {
        const cepLimpo = (enderecoData.cep || '').replace(/\D/g, '');
        // O número não é mais usado diretamente aqui para disparar geocodificação
        // const numeroStr = String(enderecoData.numero || '').trim();

        if (cepLimpo.length === 8) {
            setBuscandoCep(true); // Apenas para busca de CEP
            setErro('');
            setMensagem('Buscando dados do CEP...');
            try {
                const viaCepDados: ViaCepResponseDTO = await consultarCepPelaApi(cepLimpo);
                setEnderecoData(prev => ({
                    ...prev,
                    logradouro: viaCepDados.logradouro || '',
                    bairro: viaCepDados.bairro || '',
                    localidade: viaCepDados.localidade || '',
                    uf: viaCepDados.uf || '',
                    cep: viaCepDados.cep || prev.cep,
                    latitude: 0,
                    longitude: 0,
                }));
                setMensagem('Dados do CEP carregados. Preencha o número e clique em "Gerar Coordenadas", se necessário.');
            } catch (error: any) {
                setErro(`Falha ao buscar CEP: ${error.message}. Preencha o endereço manualmente.`);
                setMensagem('');
            } finally {
                setBuscandoCep(false);
            }
        } else if (enderecoData.cep && cepLimpo.length !== 8) {
            setErro('CEP inválido. Deve conter 8 dígitos.');
            setMensagem('');
        }
    };

    const handleGerarCoordenadasClick = async () => {
        const cepLimpo = (enderecoData.cep || '').replace(/\D/g, '');
        const numeroStr = String(enderecoData.numero || '').trim();

        if (!enderecoData.logradouro || !numeroStr || numeroStr === "0" || !enderecoData.localidade || !enderecoData.uf) {
            setErro("Preencha Logradouro, Número, Cidade e UF para gerar coordenadas.");
            setMensagem('');
            return;
        }
        setBuscandoCoords(true);
        setErro('');
        setMensagem('Gerando coordenadas...');
        try {
            const geoRequestData: EnderecoGeoRequestDTO = {
                logradouro: enderecoData.logradouro || '',
                numero: numeroStr,
                cidade: enderecoData.localidade || '',
                uf: enderecoData.uf || '',
                bairro: enderecoData.bairro,
                cep: cepLimpo
            };
            const coordenadas: GeoCoordinatesDTO = await calcularCoordenadasPelaApi(geoRequestData);
            setEnderecoData(prev => ({
                ...prev,
                latitude: coordenadas.latitude || 0,
                longitude: coordenadas.longitude || 0,
            }));
            if ((coordenadas.latitude || 0) === 0 || (coordenadas.longitude || 0) === 0) {
                setErro("Não foi possível obter coordenadas válidas para o endereço informado. Verifique os dados.");
                setMensagem('');
            } else {
                setMensagem(`Coordenadas geradas: Lat ${Number(coordenadas.latitude).toFixed(7)}, Lon ${Number(coordenadas.longitude).toFixed(7)}`);
            }
        } catch (error: any) {
            setErro(`Falha ao gerar coordenadas: ${error.message}`);
            setMensagem('');
        } finally {
            setBuscandoCoords(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErro('');
        setLoading(true);
        setMensagem('Processando cadastro...');

        let contatoId: number | undefined = undefined;
        let enderecoId: number | undefined = undefined;

        try {
            if (contatoData.email && contatoData.ddd && contatoData.telefone) {
                setMensagem('Salvando contato...');
                const contatoSalvo = await criarContatoSozinho(contatoData);
                contatoId = contatoSalvo.idContato;
            } else {
                setMensagem('Dados de contato principal incompletos. Contato não será criado.');
            }

            setMensagem(prev => prev + ' Processando endereço...');
            const numeroEnderecoNum = parseInt(String(enderecoData.numero || "0"), 10);
            let enderecoValidoParaSalvar = false;

            if (enderecoData.logradouro && numeroEnderecoNum > 0 && enderecoData.localidade && enderecoData.uf) {
                if ((!enderecoData.latitude || enderecoData.latitude === 0 || !enderecoData.longitude || enderecoData.longitude === 0)) {
                    setErro("Latitude e Longitude são obrigatórias para o endereço. Por favor, clique em 'Gerar Coordenadas' ou verifique os dados do endereço e tente novamente.");
                    setLoading(false);
                    setMensagem('');
                    return; // Interrompe o submit
                }
                enderecoValidoParaSalvar = true;

                if (enderecoValidoParaSalvar) {
                    setMensagem(prev => prev + ' Salvando endereço...');
                    const enderecoPayload: EnderecoRequestDTO = {
                        cep: (enderecoData.cep || '').replace(/\D/g, ''),
                        numero: numeroEnderecoNum,
                        logradouro: enderecoData.logradouro || '',
                        bairro: enderecoData.bairro || '',
                        localidade: enderecoData.localidade || '',
                        uf: enderecoData.uf || '',
                        complemento: enderecoData.complemento || '',
                        latitude: Number(enderecoData.latitude) || 0,
                        longitude: Number(enderecoData.longitude) || 0,
                    };
                    const enderecoSalvo = await criarEnderecoSozinho(enderecoPayload);
                    enderecoId = enderecoSalvo.idEndereco;
                }
            } else {
                setMensagem(prev => prev + ' Dados do endereço principal incompletos. Endereço não será criado.');
            }

            setMensagem(prev => prev + ' Criando cliente...');
            const clientePayload: ClienteRequestDTO = {
                ...clienteData,
                contatosIds: contatoId ? [contatoId] : [],
                enderecosIds: enderecoId ? [enderecoId] : [],
            };

            const clienteCriado = await criarCliente(clientePayload);
            setMensagem(`Cliente "${clienteCriado.nome} ${clienteCriado.sobrenome}" (ID: ${clienteCriado.idCliente}) salvo com sucesso! Redirecionando...`);
            setClienteData({ nome: '', sobrenome: '', dataNascimento: '', documento: '' });
            setContatoData({ ddd: '', telefone: '', celular: '', whatsapp: '', email: '', tipoContato: 'Principal' });
            setEnderecoData({ cep: '', numero: '', logradouro: '', bairro: '', localidade: '', uf: '', complemento: '', latitude: 0, longitude: 0 });
            setTimeout(() => router.push(`/clientes/${clienteCriado.idCliente}`), 3000);

        } catch (error: any) {
            setErro(`Falha no cadastro: ${error.message}`);
            setMensagem('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="page-title">Cadastrar Novo Cliente</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <h2>Dados Pessoais</h2>
                <div className="form-group">
                    <label htmlFor="nome">Nome:</label>
                    <input id="nome" type="text" name="nome" value={clienteData.nome} onChange={handleClienteChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="sobrenome">Sobrenome:</label>
                    <input id="sobrenome" type="text" name="sobrenome" value={clienteData.sobrenome} onChange={handleClienteChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="dataNascimento">Data de Nascimento:</label>
                    <input id="dataNascimento" type="date" name="dataNascimento" value={clienteData.dataNascimento} onChange={handleClienteChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="documento">Documento (CPF/CNPJ):</label>
                    <input id="documento" type="text" name="documento" value={clienteData.documento} onChange={handleClienteChange} required />
                </div>

                <h2>Contato Principal</h2>
                <div className="form-group">
                    <label htmlFor="ddd">DDD:</label>
                    <input id="ddd" type="text" name="ddd" value={contatoData.ddd} onChange={handleContatoChange} maxLength={3} required />
                </div>
                <div className="form-group">
                    <label htmlFor="telefone">Telefone:</label>
                    <input id="telefone" type="tel" name="telefone" value={contatoData.telefone} onChange={handleContatoChange} maxLength={15} required />
                </div>
                <div className="form-group">
                    <label htmlFor="celular">Celular (Opcional):</label>
                    <input id="celular" type="tel" name="celular" value={contatoData.celular || ''} onChange={handleContatoChange} maxLength={15} />
                </div>
                <div className="form-group">
                    <label htmlFor="whatsapp">WhatsApp (Opcional):</label>
                    <input id="whatsapp" type="tel" name="whatsapp" value={contatoData.whatsapp || ''} onChange={handleContatoChange} maxLength={15} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" name="email" value={contatoData.email} onChange={handleContatoChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="tipoContato">Tipo Contato:</label>
                    <input id="tipoContato" type="text" name="tipoContato" value={contatoData.tipoContato} onChange={handleContatoChange} required />
                </div>

                <h2>Endereço Principal</h2>
                <div className="form-group">
                    <label htmlFor="cep">CEP:</label>
                    <input id="cep" type="text" name="cep" value={enderecoData.cep} onChange={handleEnderecoChange} onBlur={handleCepBlur} maxLength={9} placeholder="Ex: 00000-000" required />
                </div>
                <div className="form-group">
                    <label htmlFor="numero">Número:</label>
                    <input id="numero" type="text" name="numero" value={String(enderecoData.numero || '') === '0' ? '' : String(enderecoData.numero || '')} onChange={handleEnderecoChange} placeholder="Ex: 123" required />
                </div>
                {buscandoCep && <p style={{textAlign: 'center', color: '#007bff', margin: '10px 0'}}>Buscando CEP...</p>}
                <div className="form-group">
                    <label htmlFor="logradouro">Logradouro:</label>
                    <input id="logradouro" type="text" name="logradouro" value={enderecoData.logradouro} onChange={handleEnderecoChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="bairro">Bairro:</label>
                    <input id="bairro" type="text" name="bairro" value={enderecoData.bairro} onChange={handleEnderecoChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="localidade">Localidade (Cidade):</label>
                    <input id="localidade" type="text" name="localidade" value={enderecoData.localidade} onChange={handleEnderecoChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="uf">UF (Estado):</label>
                    <input id="uf" type="text" name="uf" value={enderecoData.uf} onChange={handleEnderecoChange} maxLength={2} required />
                </div>
                <div className="form-group">
                    <label htmlFor="complemento">Complemento:</label>
                    <input id="complemento" type="text" name="complemento" value={enderecoData.complemento || ''} onChange={handleEnderecoChange} />
                </div>

                <div className="form-group">
                    <button type="button" onClick={handleGerarCoordenadasClick} disabled={buscandoCoords || !enderecoData.logradouro || !enderecoData.numero} className="button-secondary" style={{marginRight: '10px'}}>
                        {buscandoCoords ? 'Gerando...' : 'Gerar Coordenadas'}
                    </button>
                    {(Number(enderecoData.latitude) !== 0 && Number(enderecoData.longitude) !== 0) ? (
                        <span style={{fontSize: '0.9em', color: '#28a745'}}>
                            Lat: {Number(enderecoData.latitude).toFixed(7)}, Lon: {Number(enderecoData.longitude).toFixed(7)} (OK)
                        </span>
                    ) : (
                        (enderecoData.logradouro && enderecoData.numero) && // Mostra apenas se houver dados para tentar gerar
                        <span style={{fontSize: '0.9em', color: '#6c757d'}}>
                            Clique em "Gerar Coordenadas".
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={buscandoCep || buscandoCoords || loading}
                    className="button-primary"
                    style={{marginTop: '20px'}}
                >
                    {/* CORREÇÃO APLICADA ABAIXO */}
                    {loading ? 'Salvando...' : (buscandoCep || buscandoCoords ? 'Aguarde...' : 'Salvar Cliente Completo')}
                </button>
            </form>
            {mensagem && !erro && <p className="message success" style={{marginTop: '15px'}}>{mensagem}</p>}
            {erro && <p className="message error" style={{marginTop: '15px'}}>{erro}</p>}
            <div style={{marginTop: '20px'}}>
                <Link href="/clientes/listar">Voltar para Lista</Link>
            </div>
        </div>
    );
}