// src/app/clientes/alterar/[id]/page.tsx
'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
// CORREÇÃO DO CAMINHO ABAIXO:
import { buscarClientePorId, atualizarCliente, buscarEnderecoGeocodificado } from '@/lib/apiService';
import type { ClienteRequestDTO, ClienteResponseDTO, ContatoRequestDTO, EnderecoRequestDTO } from '@/lib/types';

// ... (o resto do código do AlterarClientePage permanece o mesmo da minha resposta anterior)
// Cole o restante do código que já te enviei para esta página,
// apenas certifique-se de que as importações acima estejam com o caminho '../../../../lib/'
// para src/app/clientes/alterar/[id]/page.tsx -> src/lib/apiService.ts

// REVISANDO A ESTRUTURA DE PASTAS:
// gs-frontend/
//   src/
//     app/
//       clientes/
//         alterar/
//           [id]/
//             page.tsx  <-- ESTE ARQUIVO
//     lib/
//       apiService.ts <-- ARQUIVO ALVO
// ../ -> src/app/clientes/alterar/[id]/
// ../../ -> src/app/clientes/alterar/
// ../../../ -> src/app/clientes/
// ../../../../ -> src/app/
// Para chegar em src/lib => ../../../../lib/ -- ERRADO, isso sairia de src

// De:        src/app/clientes/alterar/[id]/page.tsx
// Para:      src/lib/apiService.ts
// Path real: ../../../lib/apiService

export default function AlterarClientePage() {
    const params = useParams();
    const router = useRouter();
    const idPath = Array.isArray(params.id) ? params.id[0] : params.id; // Pega o ID da rota

    const [cliente, setCliente] = useState<Partial<ClienteRequestDTO>>({
        nome: '', sobrenome: '', dataNascimento: '', documento: '',
    });
    const [contato, setContato] = useState<Partial<ContatoRequestDTO>>({
        ddd: '', telefone: '', email: '', tipoContato: 'Principal'
    });
    const [endereco, setEndereco] = useState<Partial<EnderecoRequestDTO & { numero: string }>>({ // numero como string para input
        cep: '', numero: '', logradouro: '', bairro: '', localidade: '', uf: '', complemento: '', latitude: 0, longitude: 0
    });

    const [mensagem, setMensagem] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [buscandoCep, setBuscandoCep] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);


    useEffect(() => {
        if (idPath) {
            const clienteId = Number(idPath);
            if (isNaN(clienteId)) {
                setErro("ID do cliente inválido na URL.");
                setInitialLoading(false);
                return;
            }
            setInitialLoading(true);
            buscarClientePorId(clienteId)
                .then((data: ClienteResponseDTO) => {
                    setCliente({
                        nome: data.nome,
                        sobrenome: data.sobrenome,
                        dataNascimento: data.dataNascimento,
                        documento: data.documento,
                    });
                    if (data.contatos && data.contatos.length > 0) {
                        setContato(data.contatos[0]);
                    }
                    if (data.enderecos && data.enderecos.length > 0) {
                        setEndereco({
                            ...data.enderecos[0],
                            numero: String(data.enderecos[0].numero) || '', // Convertendo para string
                            latitude: data.enderecos[0].latitude !== undefined ? Number(data.enderecos[0].latitude) : 0,
                            longitude: data.enderecos[0].longitude !== undefined ? Number(data.enderecos[0].longitude) : 0,
                        });
                    }
                    setErro(null);
                })
                .catch(error => {
                    console.error("Erro ao buscar dados do cliente:", error);
                    setErro(`Falha ao carregar dados do cliente: ${error.message}`);
                })
                .finally(() => setInitialLoading(false));
        } else {
            setErro("ID do cliente não fornecido.");
            setInitialLoading(false);
        }
    }, [idPath]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setState: Function) => {
        const { name, value } = e.target;
        setState((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleCepBlur = async () => {
        const numeroStr = String(endereco.numero).trim();
        if (endereco.cep && numeroStr && numeroStr !== "0") {
            setBuscandoCep(true);
            setErro('');
            setMensagem('Buscando CEP...');
            try {
                const cepNumerico = endereco.cep.replace(/\D/g, '');
                const dadosApi = await buscarEnderecoGeocodificado(cepNumerico, numeroStr, endereco.complemento || '');
                setEndereco((prev: any) => ({
                    ...prev,
                    logradouro: dadosApi.logradouro || '',
                    bairro: dadosApi.bairro || '',
                    localidade: dadosApi.localidade || '',
                    uf: dadosApi.uf || '',
                    latitude: parseFloat(dadosApi.latitude.toString()) || 0,
                    longitude: parseFloat(dadosApi.longitude.toString()) || 0,
                    cep: dadosApi.cep || prev.cep,
                }));
                setMensagem('Endereço atualizado pelo CEP.');
            } catch (error: any) {
                setErro(`Falha ao buscar CEP: ${error.message}`);
                setMensagem('');
            } finally {
                setBuscandoCep(false);
            }
        } else if(endereco.cep && (!numeroStr || numeroStr === "0")) {
            setErro('Informe o NÚMERO para buscar o CEP.');
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!idPath) {
            setErro("ID do cliente não encontrado para atualização.");
            return;
        }
        const clienteIdNum = Number(idPath);
        if (isNaN(clienteIdNum)) {
            setErro("ID do cliente inválido para atualização.");
            return;
        }

        setErro('');
        setLoading(true);
        setMensagem('Atualizando cliente...');

        const numeroEndereco = parseInt(String(endereco.numero), 10);
        if (isNaN(numeroEndereco) || numeroEndereco <= 0) {
            setErro("Número do endereço é inválido.");
            setLoading(false);
            setMensagem('');
            return;
        }

        const payloadEndereco: EnderecoRequestDTO = {
            cep: (endereco.cep || '').replace(/\D/g, ''),
            numero: numeroEndereco,
            logradouro: endereco.logradouro || '',
            bairro: endereco.bairro || '',
            localidade: endereco.localidade || '',
            uf: endereco.uf || '',
            complemento: endereco.complemento || '',
            latitude: Number(endereco.latitude) || 0,
            longitude: Number(endereco.longitude) || 0,
        };

        const clienteParaAtualizar: ClienteRequestDTO = {
            nome: cliente.nome || '',
            sobrenome: cliente.sobrenome || '',
            dataNascimento: cliente.dataNascimento || '',
            documento: cliente.documento || '',
            contato: contato as ContatoRequestDTO,
            endereco: payloadEndereco,
        };

        try {
            await atualizarCliente(clienteIdNum, clienteParaAtualizar);
            setMensagem('Cliente atualizado com sucesso! Redirecionando...');
            setTimeout(() => router.push(`/clientes/${clienteIdNum}`), 1500);
        } catch (error: any) {
            setErro(`Falha ao atualizar cliente: ${error.message}`);
            setMensagem('');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="container"><p>Carregando dados para edição...</p></div>;
    if (erro && !cliente.nome) return <div className="container"><p className="message error">{erro}</p> <Link href="/clientes/listar">Voltar para Lista</Link></div>;


    return (
        <div className="container">
            <h1 className="page-title">Alterar Cliente (ID: {idPath})</h1>
            <form onSubmit={handleSubmit}>
                <h2>Dados Pessoais</h2>
                <label>Nome: <input type="text" name="nome" value={cliente.nome || ''} onChange={(e) => handleChange(e, setCliente)} required /></label>
                <label>Sobrenome: <input type="text" name="sobrenome" value={cliente.sobrenome || ''} onChange={(e) => handleChange(e, setCliente)} required /></label>
                <label>Data de Nascimento: <input type="date" name="dataNascimento" value={cliente.dataNascimento || ''} onChange={(e) => handleChange(e, setCliente)} required /></label>
                <label>Documento: <input type="text" name="documento" value={cliente.documento || ''} onChange={(e) => handleChange(e, setCliente)} required /></label>

                <h2>Contato Principal</h2>
                <label>DDD: <input type="text" name="ddd" value={contato.ddd || ''} onChange={(e) => handleChange(e, setContato)} maxLength={3} required /></label>
                <label>Telefone: <input type="tel" name="telefone" value={contato.telefone || ''} onChange={(e) => handleChange(e, setContato)} maxLength={15} required /></label>
                <label>Celular: <input type="tel" name="celular" value={contato.celular || ''} onChange={(e) => handleChange(e, setContato)} maxLength={15} /></label>
                <label>WhatsApp: <input type="tel" name="whatsapp" value={contato.whatsapp || ''} onChange={(e) => handleChange(e, setContato)} maxLength={15} /></label>
                <label>Email: <input type="email" name="email" value={contato.email || ''} onChange={(e) => handleChange(e, setContato)} required /></label>
                <label>Tipo Contato: <input type="text" name="tipoContato" value={contato.tipoContato || ''} onChange={(e) => handleChange(e, setContato)} required /></label>

                <h2>Endereço Principal</h2>
                <label>CEP: <input type="text" name="cep" value={endereco.cep || ''} onChange={(e) => handleChange(e, setEndereco)} onBlur={handleCepBlur} maxLength={9} required /></label>
                <label>Número: <input type="text" name="numero" value={endereco.numero || ''} onChange={(e) => handleChange(e, setEndereco)} onBlur={handleCepBlur} required /></label>
                {buscandoCep && <p>Buscando CEP...</p>}
                <label>Logradouro: <input type="text" name="logradouro" value={endereco.logradouro || ''} onChange={(e) => handleChange(e, setEndereco)} required /></label>
                <label>Bairro: <input type="text" name="bairro" value={endereco.bairro || ''} onChange={(e) => handleChange(e, setEndereco)} required /></label>
                <label>Localidade: <input type="text" name="localidade" value={endereco.localidade || ''} onChange={(e) => handleChange(e, setEndereco)} required /></label>
                <label>UF: <input type="text" name="uf" value={endereco.uf || ''} onChange={(e) => handleChange(e, setEndereco)} maxLength={2} required /></label>
                <label>Complemento: <input type="text" name="complemento" value={endereco.complemento || ''} onChange={(e) => handleChange(e, setEndereco)} /></label>
                <label style={{display: 'none'}}>Latitude: <input type="number" step="any" name="latitude" value={endereco.latitude || 0} readOnly /></label>
                <label style={{display: 'none'}}>Longitude: <input type="number" step="any" name="longitude" value={endereco.longitude || 0} readOnly /></label>

                <button type="submit" disabled={buscandoCep || loading || initialLoading}>
                    {initialLoading ? 'Carregando...' : (loading ? 'Salvando...' : (buscandoCep ? 'Aguarde...' : 'Salvar Alterações'))}
                </button>
            </form>
            {mensagem && !erro && <p className="message success">{mensagem}</p>}
            {erro && <p className="message error">{erro}</p>}
        </div>
    );
}