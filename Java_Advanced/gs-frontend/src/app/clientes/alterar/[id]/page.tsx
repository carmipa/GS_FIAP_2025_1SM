// Localização: gs-frontend/src/app/clientes/alterar/[id]/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    buscarClientePorId,
    atualizarCliente,
    consultarCepPelaApi,
    calcularCoordenadasPelaApi,
    // Assumindo que você tem ou criará estas no apiService.ts:
    // buscarContatoPorId, // Se precisar carregar detalhes do contato separadamente
    // atualizarContatoSozinho,
    // buscarEnderecoPorId, // Se precisar carregar detalhes do endereço separadamente
    // atualizarEnderecoSozinho
} from '@/lib/apiService';
import type {
    ClienteRequestDTO,
    ClienteResponseDTO,
    ContatoRequestDTO,
    ContatoResponseDTO, // Para o tipo de contato carregado
    EnderecoRequestDTO,
    EnderecoResponseDTO, // Para o tipo de endereço carregado
    ViaCepResponseDTO,
    EnderecoGeoRequestDTO,
    GeoCoordinatesDTO
} from '@/lib/types';

export default function AlterarClientePage() {
    const params = useParams();
    const router = useRouter();
    const idPath = Array.isArray(params.id) ? params.id[0] : params.id;
    const clienteId = Number(idPath);

    // IDs dos contatos e endereços principais atuais do cliente
    const [currentContatoId, setCurrentContatoId] = useState<number | undefined>(undefined);
    const [currentEnderecoId, setCurrentEnderecoId] = useState<number | undefined>(undefined);

    const [clienteData, setClienteData] = useState<Omit<ClienteRequestDTO, 'contatosIds' | 'enderecosIds'>>({
        nome: '', sobrenome: '', dataNascimento: '', documento: '',
    });
    const [contatoData, setContatoData] = useState<ContatoRequestDTO>({
        ddd: '', telefone: '', celular: '', whatsapp: '', email: '', tipoContato: 'Principal'
    });
    const [enderecoData, setEnderecoData] = useState<Partial<EnderecoRequestDTO & {numero: string | number}>>({
        cep: '', numero: '', logradouro: '', bairro: '', localidade: '', uf: '', complemento: '', latitude: 0, longitude: 0
    });

    const [mensagem, setMensagem] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [buscandoCepCoords, setBuscandoCepCoords] = useState<boolean>(false);

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
                        documento: data.documento,
                    });
                    if (data.contatos && data.contatos.length > 0) {
                        const contatoPrincipal = data.contatos[0];
                        setContatoData(contatoPrincipal);
                        setCurrentContatoId(contatoPrincipal.idContato);
                    }
                    if (data.enderecos && data.enderecos.length > 0) {
                        const endPrincipal = data.enderecos[0];
                        setEnderecoData({
                            ...endPrincipal,
                            numero: String(endPrincipal.numero || ''),
                        });
                        setCurrentEnderecoId(endPrincipal.idEndereco);
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar dados do cliente para alteração:", error);
                    setErro(`Falha ao carregar dados do cliente: ${error.message}`);
                })
                .finally(() => setInitialLoading(false));
        } else {
            setErro("ID do cliente inválido ou não fornecido.");
            setInitialLoading(false);
        }
    }, [idPath, clienteId]);

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
        // ... (Lógica do handleCepBlur é idêntica à do CadastrarClientePage) ...
        // Cole a implementação do handleCepBlur da página de cadastro aqui.
        const cepLimpo = (enderecoData.cep || '').replace(/\D/g, '');
        const numeroStr = String(enderecoData.numero || '').trim();

        if (cepLimpo.length === 8) {
            setBuscandoCepCoords(true);
            setErro('');
            setMensagem('Buscando dados do CEP...');
            try {
                const viaCepDados: ViaCepResponseDTO = await consultarCepPelaApi(cepLimpo);
                setMensagem('Dados do CEP encontrados. Atualizando campos...');

                const enderecoAtualizadoViaCep = {
                    ...enderecoData,
                    logradouro: viaCepDados.logradouro || enderecoData.logradouro || '',
                    bairro: viaCepDados.bairro || enderecoData.bairro || '',
                    localidade: viaCepDados.localidade || enderecoData.localidade || '',
                    uf: viaCepDados.uf || enderecoData.uf || '',
                    cep: viaCepDados.cep || enderecoData.cep,
                    latitude: 0,
                    longitude: 0,
                };
                setEnderecoData(enderecoAtualizadoViaCep);

                if (numeroStr && numeroStr !== "0" && (viaCepDados.logradouro || enderecoAtualizadoViaCep.logradouro) ) {
                    setMensagem('Endereço preenchido. Buscando coordenadas geográficas...');
                    const geoRequestData: EnderecoGeoRequestDTO = {
                        logradouro: enderecoAtualizadoViaCep.logradouro!,
                        numero: numeroStr,
                        cidade: enderecoAtualizadoViaCep.localidade!,
                        uf: enderecoAtualizadoViaCep.uf!,
                        bairro: enderecoAtualizadoViaCep.bairro,
                        cep: cepLimpo
                    };
                    const coordenadas: GeoCoordinatesDTO = await calcularCoordenadasPelaApi(geoRequestData);
                    setEnderecoData(prev => ({
                        ...prev,
                        latitude: coordenadas.latitude || 0,
                        longitude: coordenadas.longitude || 0,
                    }));
                    setMensagem('Endereço e coordenadas carregados.');
                } else if (!numeroStr || numeroStr === "0") {
                    setErro('CEP encontrado. Informe o NÚMERO para buscar as coordenadas.');
                    setMensagem('');
                } else {
                    setMensagem('Dados do CEP carregados. Coordenadas não buscadas.');
                }
            } catch (error: any) {
                setErro(`Falha na busca do endereço: ${error.message}. Preencha manualmente.`);
                setMensagem('');
            } finally {
                setBuscandoCepCoords(false);
            }
        } else if (enderecoData.cep && cepLimpo.length !== 8) {
            setErro('CEP inválido. Deve conter 8 dígitos.');
            setMensagem('');
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isNaN(clienteId)) {
            setErro("ID do cliente inválido para atualização.");
            return;
        }

        setErro('');
        setLoadingSubmit(true);
        setMensagem('Processando atualização...');

        let contatoPrincipalId: number | undefined = currentContatoId;
        let enderecoPrincipalId: number | undefined = currentEnderecoId;

        try {
            // 1. Atualizar ou Criar Contato Principal
            if (contatoData.email && contatoData.ddd && contatoData.telefone) {
                setMensagem('Atualizando/Verificando contato...');
                // Se currentContatoId existe, atualiza. Senão, cria um novo.
                // Para simplificar, vamos assumir que se os dados de contato foram preenchidos,
                // e existe um currentContatoId, tentamos atualizar.
                // Se não há currentContatoId mas há dados, criamos um novo.
                // Esta lógica pode precisar de funções "atualizarContatoSozinho" no apiService.ts

                // SIMPLIFICAÇÃO: Assume que o contato principal é sempre atualizado se existir,
                // ou criado se não existir ID e dados foram fornecidos.
                // Uma lógica mais robusta envolveria checar se os dados do contato mudaram
                // antes de fazer uma chamada de atualização.
                // Por ora, vamos assumir que se o formulário de contato foi preenchido,
                // ele é enviado para ser criado/atualizado pelo backend (que pode ter lógica de upsert ou criar novo e desassociar antigo).
                // Para este exemplo, vamos tentar criar um novo se não houver ID, ou assumir que o backend
                // vai atualizar o existente se um ID for passado junto com o Cliente.
                // Como o backend ClienteService agora espera IDs, precisamos garantir que temos esses IDs.
                // Se o contato foi alterado e já existia, você chamaria "atualizarContatoSozinho(currentContatoId, contatoData)"
                // Se é um novo contato para o cliente (raro na alteração, a menos que esteja trocando), criaria um novo.
                // Para manter simples: se os dados do formulário de contato estão preenchidos,
                // e não temos currentContatoId, teríamos que criar um novo contato e pegar seu ID.
                // Se temos currentContatoId, assumimos que o backend atualizará o contato associado por esse ID.
                // A API atual do backend /clientes/{id} (PUT) espera contatosIds e enderecosIds.

                // TODO: Implementar a lógica de atualização/criação separada de Contato e Endereço
                // para obter os IDs corretos se eles mudaram ou são novos.
                // Por enquanto, vamos apenas passar os IDs existentes se houver,
                // ou uma lista vazia/undefined se não houver.
                // A atualização dos DADOS de contato/endereço associados precisaria de chamadas
                // separadas para PUT /api/contatos/{contatoId} e PUT /api/enderecos/{enderecoId}
                // ANTES de chamar atualizarCliente se os *dados* do contato/endereço mudaram.
                // A associação em si é feita via contatosIds/enderecosIds no ClienteRequestDTO.

                if (!(Number(enderecoData.latitude) !== 0 && Number(enderecoData.longitude) !== 0) && enderecoData.logradouro) {
                    setMensagem("Coordenadas não detectadas, tentando geocodificar antes de salvar...");
                    setBuscandoCepCoords(true);
                    const numeroEnderecoNum = parseInt(String(enderecoData.numero || "0"), 10);
                    const geoRequestData: EnderecoGeoRequestDTO = {
                        logradouro: enderecoData.logradouro || '', numero: String(numeroEnderecoNum), cidade: enderecoData.localidade || '',
                        uf: enderecoData.uf || '', bairro: enderecoData.bairro, cep: (enderecoData.cep || '').replace(/\D/g, '')
                    };
                    const coordenadas: GeoCoordinatesDTO = await calcularCoordenadasPelaApi(geoRequestData);
                    enderecoData.latitude = coordenadas.latitude || 0;
                    enderecoData.longitude = coordenadas.longitude || 0;
                    setBuscandoCepCoords(false);
                    if (enderecoData.latitude === 0 || enderecoData.longitude === 0) {
                        throw new Error("Não foi possível obter coordenadas para o endereço informado ao tentar salvar.");
                    }
                } else if (!enderecoData.logradouro || !(Number(enderecoData.latitude) !== 0 && Number(enderecoData.longitude) !== 0)) {
                    throw new Error("Dados do endereço (logradouro, lat/lon) são insuficientes ou inválidos.");
                }


            } // Fim do try inicial para contato/endereco (esta lógica precisará ser muito mais robusta)

            const clientePayload: ClienteRequestDTO = {
                ...clienteData,
                contatosIds: currentContatoId ? [currentContatoId] : [], // Passa o ID do contato existente
                enderecosIds: currentEnderecoId ? [currentEnderecoId] : [], // Passa o ID do endereço existente
            };
            // Se você editou os dados de contatoData e enderecoData no formulário,
            // você precisaria de chamadas PUT /api/contatos/{currentContatoId} e PUT /api/enderecos/{currentEnderecoId}
            // *antes* de chamar atualizarCliente. E o ClienteRequestDTO no backend precisaria ser ajustado
            // para talvez não aceitar os dados completos de contato/endereço se a associação é apenas por ID.

            // Assumindo que o ClienteRequestDTO do backend foi revertido para contatosIds/enderecosIds
            // E que o foco aqui é atualizar o Cliente e suas *associações* a Contatos/Endereços existentes.
            // Se os *dados* do Contato/Endereço principal mudaram, eles precisariam ser atualizados em chamadas separadas.

            setMensagem('Enviando atualização do cliente...');
            await atualizarCliente(clienteId, clientePayload);
            setMensagem('Cliente atualizado com sucesso! Redirecionando...');
            setTimeout(() => router.push(`/clientes/${clienteId}`), 2000);

        } catch (error: any) {
            setErro(`Falha ao atualizar cliente: ${error.message}`);
            setMensagem('');
        } finally {
            setLoadingSubmit(false);
            setBuscandoCepCoords(false);
        }
    };


    if (initialLoading) return <div className="container"><p>Carregando dados do cliente para edição...</p></div>;
    if (erro && !clienteData.nome) return <div className="container"><p className="message error">{erro}</p><Link href="/clientes/listar">Voltar para Lista</Link></div>;

    return (
        <div className="container">
            <h1 className="page-title">Alterar Cliente (ID: {idPath})</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <h2>Dados Pessoais</h2>
                {/* ... Campos para clienteData (idênticos ao de cadastro) ... */}
                <div className="form-group">
                    <label htmlFor="nome">Nome:</label>
                    <input id="nome" type="text" name="nome" value={clienteData.nome || ''} onChange={handleClienteChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="sobrenome">Sobrenome:</label>
                    <input id="sobrenome" type="text" name="sobrenome" value={clienteData.sobrenome || ''} onChange={handleClienteChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="dataNascimento">Data de Nascimento:</label>
                    <input id="dataNascimento" type="date" name="dataNascimento" value={clienteData.dataNascimento || ''} onChange={handleClienteChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="documento">Documento:</label>
                    <input id="documento" type="text" name="documento" value={clienteData.documento || ''} onChange={handleClienteChange} required />
                </div>

                <h2>Contato Principal (ID: {currentContatoId || 'Novo'})</h2>
                {/* Campos para contatoData (idênticos ao de cadastro) */}
                <div className="form-group">
                    <label htmlFor="alt-ddd">DDD:</label>
                    <input id="alt-ddd" type="text" name="ddd" value={contatoData.ddd || ''} onChange={handleContatoChange} maxLength={3} required />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-telefone">Telefone:</label>
                    <input id="alt-telefone" type="tel" name="telefone" value={contatoData.telefone || ''} onChange={handleContatoChange} maxLength={9} required />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-celular">Celular:</label>
                    <input id="alt-celular" type="tel" name="celular" value={contatoData.celular || ''} onChange={handleContatoChange} maxLength={9} />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-whatsapp">WhatsApp:</label>
                    <input id="alt-whatsapp" type="tel" name="whatsapp" value={contatoData.whatsapp || ''} onChange={handleContatoChange} maxLength={9} />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-email">Email:</label>
                    <input id="alt-email" type="email" name="email" value={contatoData.email || ''} onChange={handleContatoChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-tipoContato">Tipo Contato:</label>
                    <input id="alt-tipoContato" type="text" name="tipoContato" value={contatoData.tipoContato || ''} onChange={handleContatoChange} required />
                </div>

                <h2>Endereço Principal (ID: {currentEnderecoId || 'Novo'})</h2>
                {/* Campos para enderecoData (idênticos ao de cadastro) */}
                <div className="form-group">
                    <label htmlFor="alt-cep">CEP:</label>
                    <input id="alt-cep" type="text" name="cep" value={enderecoData.cep || ''} onChange={handleEnderecoChange} onBlur={handleCepBlur} maxLength={9} required />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-numero">Número:</label>
                    <input id="alt-numero" type="text" name="numero" value={String(enderecoData.numero || '') === '0' ? '' : String(enderecoData.numero || '')} onChange={handleEnderecoChange} onBlur={handleCepBlur} required />
                </div>
                {buscandoCepCoords && <p style={{textAlign: 'center', color: '#007bff', margin: '10px 0'}}>Buscando dados do endereço...</p>}
                <div className="form-group">
                    <label htmlFor="alt-logradouro">Logradouro:</label>
                    <input id="alt-logradouro" type="text" name="logradouro" value={enderecoData.logradouro || ''} onChange={handleEnderecoChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-bairro">Bairro:</label>
                    <input id="alt-bairro" type="text" name="bairro" value={enderecoData.bairro || ''} onChange={handleEnderecoChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-localidade">Localidade:</label>
                    <input id="alt-localidade" type="text" name="localidade" value={enderecoData.localidade || ''} onChange={handleEnderecoChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-uf">UF:</label>
                    <input id="alt-uf" type="text" name="uf" value={enderecoData.uf || ''} onChange={handleEnderecoChange} maxLength={2} required />
                </div>
                <div className="form-group">
                    <label htmlFor="alt-complemento">Complemento:</label>
                    <input id="alt-complemento" type="text" name="complemento" value={enderecoData.complemento || ''} onChange={handleEnderecoChange} />
                </div>
                { (enderecoData.latitude && enderecoData.longitude && Number(enderecoData.latitude) !== 0 && Number(enderecoData.longitude) !== 0) &&
                    <div className="form-group" style={{backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', fontSize: '0.9em'}}>
                        <p>Coordenadas Atuais: Lat: {Number(enderecoData.latitude).toFixed(7)}, Lon: {Number(enderecoData.longitude).toFixed(7)}</p>
                    </div>
                }

                <button type="submit" disabled={buscandoCepCoords || loadingSubmit || initialLoading} className="button-primary">
                    {initialLoading ? 'Carregando...' : (loadingSubmit ? 'Salvando...' : (buscandoCepCoords ? 'Aguarde...' : 'Salvar Alterações'))}
                </button>
            </form>
            {mensagem && !erro && <p className="message success" style={{marginTop: '15px'}}>{mensagem}</p>}
            {erro && <p className="message error" style={{marginTop: '15px'}}>{erro}</p>}
            <div style={{marginTop: '20px'}}>
                <Link href={`/clientes/${clienteId}`}>Cancelar e Voltar para Detalhes</Link>
                <span style={{margin: "0 10px"}}>|</span>
                <Link href="/clientes/listar">Voltar para Lista Geral</Link>
            </div>
        </div>
    );
}