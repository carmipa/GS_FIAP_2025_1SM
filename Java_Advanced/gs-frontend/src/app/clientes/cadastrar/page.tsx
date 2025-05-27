// src/app/clientes/cadastrar/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// CORREÇÃO DO CAMINHO ABAIXO:
import { criarCliente, buscarEnderecoGeocodificado } from '@/lib/apiService';
import type { ClienteRequestDTO, ContatoRequestDTO, EnderecoRequestDTO } from '@/lib/types';

// ... (o resto do código do CadastrarClientePage permanece o mesmo da minha resposta anterior)
// Cole o restante do código que já te enviei para esta página,
// apenas certifique-se de que as importações acima estejam com o caminho '../../lib/'
// O conteúdo completo já foi fornecido na resposta anterior,
// o importante é ajustar a linha de importação.
// Vou colar o código completo novamente para garantir.

export default function CadastrarClientePage() {
    const router = useRouter();

    const [clienteData, setClienteData] = useState<Omit<ClienteRequestDTO, 'contato' | 'endereco'>>({
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

    const [enderecoData, setEnderecoData] = useState<EnderecoRequestDTO>({
        cep: '',
        numero: 0,
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
    const [loading, setLoading] = useState<boolean>(false);
    const [buscandoCep, setBuscandoCep] = useState<boolean>(false);

    const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClienteData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContatoData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "numero") {
            setEnderecoData((prev) => ({...prev, [name]: value }));
        } else {
            setEnderecoData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCepBlur = async () => {
        const numeroStr = String(enderecoData.numero).trim();
        if (enderecoData.cep && numeroStr && numeroStr !== "0") {
            setBuscandoCep(true);
            setErro('');
            setMensagem('Buscando CEP...');
            try {
                const cepNumerico = enderecoData.cep.replace(/\D/g, '');
                const dadosApi = await buscarEnderecoGeocodificado(cepNumerico, numeroStr, enderecoData.complemento || '');
                setEnderecoData(prev => ({
                    ...prev,
                    logradouro: dadosApi.logradouro || '',
                    bairro: dadosApi.bairro || '',
                    localidade: dadosApi.localidade || '',
                    uf: dadosApi.uf || '',
                    latitude: Number(dadosApi.latitude) || 0,
                    longitude: Number(dadosApi.longitude) || 0,
                    cep: dadosApi.cep || prev.cep,
                }));
                setMensagem('Endereço carregado. Verifique e confirme os dados.');
            } catch (error: any) {
                setErro(`Falha ao buscar CEP: ${error.message}. Por favor, preencha os dados do endereço manualmente.`);
                setMensagem('');
            } finally {
                setBuscandoCep(false);
            }
        } else if(enderecoData.cep && (!numeroStr || numeroStr === "0") ) {
            setErro('Por favor, informe o NÚMERO do endereço para prosseguir com a busca do CEP.');
            setMensagem('');
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErro('');
        setLoading(true);
        setMensagem('Salvando cliente...');

        const numeroEndereco = parseInt(String(enderecoData.numero), 10);
        if (isNaN(numeroEndereco) || numeroEndereco <= 0) {
            setErro("Número do endereço é inválido ou não foi fornecido.");
            setLoading(false);
            setMensagem('');
            return;
        }

        const payload: ClienteRequestDTO = {
            ...clienteData,
            contato: contatoData,
            endereco: {
                ...enderecoData,
                cep: enderecoData.cep.replace(/\D/g, ''),
                numero: numeroEndereco,
                latitude: Number(enderecoData.latitude) || 0,
                longitude: Number(enderecoData.longitude) || 0,
            },
        };

        try {
            const clienteSalvo = await criarCliente(payload);
            setMensagem(`Cliente "${clienteSalvo.nome} ${clienteSalvo.sobrenome}" (ID: ${clienteSalvo.idCliente}) salvo com sucesso! Redirecionando para lista...`);
            setClienteData({ nome: '', sobrenome: '', dataNascimento: '', documento: '' });
            setContatoData({ ddd: '', telefone: '', celular: '', whatsapp: '', email: '', tipoContato: 'Principal' });
            setEnderecoData({ cep: '', numero: 0, logradouro: '', bairro: '', localidade: '', uf: '', complemento: '', latitude: 0, longitude: 0 });
            setTimeout(() => router.push('/clientes/listar'), 2500);
        } catch (error: any) {
            setErro(`Falha ao salvar cliente: ${error.message}`);
            setMensagem('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">Cadastrar Novo Cliente (com Contato e Endereço)</h1>
            <form onSubmit={handleSubmit}>
                <h2>Dados Pessoais do Cliente</h2>
                <label>Nome: <input type="text" name="nome" value={clienteData.nome} onChange={handleClienteChange} required /></label>
                <label>Sobrenome: <input type="text" name="sobrenome" value={clienteData.sobrenome} onChange={handleClienteChange} required /></label>
                <label>Data de Nascimento: <input type="date" name="dataNascimento" value={clienteData.dataNascimento} onChange={handleClienteChange} required /></label>
                <label>Documento (CPF/CNPJ): <input type="text" name="documento" value={clienteData.documento} onChange={handleClienteChange} required /></label>

                <h2>Contato Principal</h2>
                <label>DDD: <input type="text" name="ddd" value={contatoData.ddd} onChange={handleContatoChange} maxLength={3} required /></label>
                <label>Telefone: <input type="tel" name="telefone" value={contatoData.telefone} onChange={handleContatoChange} maxLength={15} required /></label>
                <label>Celular (Opcional): <input type="tel" name="celular" value={contatoData.celular || ''} onChange={handleContatoChange} maxLength={15} /></label>
                <label>WhatsApp (Opcional): <input type="tel" name="whatsapp" value={contatoData.whatsapp || ''} onChange={handleContatoChange} maxLength={15} /></label>
                <label>Email: <input type="email" name="email" value={contatoData.email} onChange={handleContatoChange} required /></label>
                <label>Tipo Contato: <input type="text" name="tipoContato" value={contatoData.tipoContato} onChange={handleContatoChange} required /></label>

                <h2>Endereço Principal</h2>
                <label>CEP: <input type="text" name="cep" value={enderecoData.cep} onChange={handleEnderecoChange} onBlur={handleCepBlur} maxLength={9} placeholder="Ex: 00000-000" required /></label>
                <label>Número: <input type="text" name="numero" value={String(enderecoData.numero) === '0' ? '' : String(enderecoData.numero)} onChange={handleEnderecoChange} onBlur={handleCepBlur} placeholder="Ex: 123" required /></label>
                {buscandoCep && <p style={{textAlign: 'center', color: '#007bff'}}>Buscando CEP...</p>}
                <label>Logradouro: <input type="text" name="logradouro" value={enderecoData.logradouro} onChange={handleEnderecoChange} required /></label>
                <label>Bairro: <input type="text" name="bairro" value={enderecoData.bairro} onChange={handleEnderecoChange} required /></label>
                <label>Localidade (Cidade): <input type="text" name="localidade" value={enderecoData.localidade} onChange={handleEnderecoChange} required /></label>
                <label>UF (Estado): <input type="text" name="uf" value={enderecoData.uf} onChange={handleEnderecoChange} maxLength={2} required /></label>
                <label>Complemento: <input type="text" name="complemento" value={enderecoData.complemento || ''} onChange={handleEnderecoChange} /></label>
                <label style={{display: 'none'}}>Latitude: <input type="number" step="any" name="latitude" value={enderecoData.latitude} readOnly /></label>
                <label style={{display: 'none'}}>Longitude: <input type="number" step="any" name="longitude" value={enderecoData.longitude} readOnly /></label>

                <button type="submit" disabled={buscandoCep || loading}>
                    {loading ? 'Salvando...' : (buscandoCep ? 'Aguarde...' : 'Salvar Cliente Completo')}
                </button>
            </form>
            {mensagem && !erro && <p className="message success">{mensagem}</p>}
            {erro && <p className="message error">{erro}</p>}
        </div>
    );
}