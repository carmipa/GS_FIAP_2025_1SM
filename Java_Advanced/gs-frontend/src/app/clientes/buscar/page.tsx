// src/app/clientes/buscar/page.tsx
'use client';

import { useState, FormEvent, useRef, ChangeEvent } from 'react'; // Adicionado ChangeEvent
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buscarClientePorDocumento } from '@/lib/apiService'; // Importa a função da API
import type { ClienteResponseDTO } from '@/lib/types'; // Importa o tipo de resposta

export default function BuscarUsuarioPage() { // Nome da função da página atualizado
    const [termoBusca, setTermoBusca] = useState('');
    const [tipoBusca, setTipoBusca] = useState<'id' | 'documento'>('id');
    const router = useRouter();
    const termoBuscaRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);

    const handleTipoBuscaChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setTipoBusca(e.target.value as 'id' | 'documento');
        setTermoBusca(''); // Limpa o campo de busca ao trocar o tipo
        setErro(null);    // Limpa mensagens de erro anteriores
        termoBuscaRef.current?.focus(); // Foca no campo de busca
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value;
        if (tipoBusca === 'documento') {
            // Permite apenas números para documento e limita o tamanho (ex: 14 para CNPJ sem máscara)
            valor = valor.replace(/\D/g, '').slice(0, 14);
        } else if (tipoBusca === 'id') {
            // Permite apenas números para ID
            valor = valor.replace(/\D/g, '');
        }
        setTermoBusca(valor);
    };

    const handleBuscar = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        if (!termoBusca.trim()) {
            setErro('Por favor, informe um termo para busca.');
            termoBuscaRef.current?.focus();
            setLoading(false);
            return;
        }

        if (tipoBusca === 'id') {
            if (isNaN(Number(termoBusca)) || Number(termoBusca) <= 0) {
                setErro('Para busca por ID, por favor, informe um valor numérico positivo.');
                termoBuscaRef.current?.focus();
                setLoading(false);
                return;
            }
            // A navegação para ID é direta, sem chamada de API nesta página
            // O setLoading será false quando a nova página carregar ou se houver erro na navegação.
            router.push(`/clientes/${termoBusca}`);
            // Considerar não setar setLoading(false) aqui, pois a navegação já muda o estado da UI.
            // Se a navegação falhar por algum motivo (ex: rota não existe), o usuário fica na mesma página.
            // Para esse caso, uma lógica de erro de navegação poderia ser adicionada, mas é mais complexo.
        } else if (tipoBusca === 'documento') {
            const documentoLimpo = termoBusca.replace(/\D/g, ''); // Segurança extra, embora handleInputChange já faça
            if (!documentoLimpo || (documentoLimpo.length !== 11 && documentoLimpo.length !== 14)) {
                setErro('Documento (CPF/CNPJ) deve ter 11 ou 14 números.');
                termoBuscaRef.current?.focus();
                setLoading(false);
                return;
            }
            try {
                console.log(`Buscando usuário por documento: ${documentoLimpo}`);
                const usuarioEncontrado: ClienteResponseDTO = await buscarClientePorDocumento(documentoLimpo);
                if (usuarioEncontrado && usuarioEncontrado.idCliente) {
                    console.log(`Usuário encontrado: ID ${usuarioEncontrado.idCliente}, Nome: ${usuarioEncontrado.nome}`);
                    router.push(`/clientes/${usuarioEncontrado.idCliente}`);
                } else {
                    // Este caso é menos provável se a API retornar 404, pois o handleResponse deve lançar erro.
                    console.warn(`Busca por documento ${documentoLimpo} retornou sucesso mas sem dados de usuário válidos.`);
                    setErro(`Não foi possível encontrar informações para o documento ${documentoLimpo}.`);
                }
            } catch (error: any) {
                console.error(`Falha ao buscar usuário por documento ${documentoLimpo}:`, error);
                // A mensagem de erro de `apiService.ts` já é bem formatada
                setErro(error.message || `Nenhum usuário encontrado com o documento ${documentoLimpo}.`);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container">
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1.8em' }}>person_search</span>
                Buscar Usuário
            </h1>

            {erro && <p className="message error" style={{ textAlign: 'center', marginBottom: '20px' }}>{erro}</p>}

            <form onSubmit={handleBuscar} className="form-container" style={{maxWidth: '550px', margin: '0 auto'}}>
                <div className="form-group">
                    <label htmlFor="tipoBusca" style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <span className="material-icons-outlined">manage_search</span>
                        Buscar por:
                    </label>
                    <select
                        id="tipoBusca"
                        value={tipoBusca}
                        onChange={handleTipoBuscaChange}
                        // Estilos de select já definidos em globals.css
                    >
                        <option value="id">ID do Usuário</option>
                        <option value="documento">Documento (CPF/CNPJ)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="termoBusca" style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <span className="material-icons-outlined">input</span>
                        {tipoBusca === 'id' ? 'ID do Usuário:' : 'Número do Documento:'}
                    </label>
                    <input
                        id="termoBusca"
                        ref={termoBuscaRef}
                        type="text" // Mudado para text para melhor controle de formatação e input
                        value={termoBusca}
                        onChange={handleInputChange} // Usar handler customizado
                        placeholder={tipoBusca === 'id' ? 'Digite o ID numérico' : 'Digite apenas números do documento'}
                        required
                        // Estilos de input já definidos em globals.css
                        maxLength={tipoBusca === 'documento' ? 14 : undefined} // Limita para CNPJ (maior que CPF)
                    />
                </div>
                <button
                    type="submit"
                    className="button button-primary" // Usando classes de globals.css
                    style={{width: '100%', padding: '12px', fontSize: '1.1em'}}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="material-icons-outlined animate-spin" style={{marginRight: '8px'}}>sync</span>
                            Buscando...
                        </>
                    ) : (
                        <>
                            <span className="material-icons-outlined">search</span>
                            Buscar
                        </>
                    )}
                </button>
            </form>
            <p style={{marginTop: '25px', textAlign: 'center'}}>
                Para ver todos os Usuários, acesse a <Link href="/clientes/listar" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>Lista de Usuários</Link>.
            </p>
        </div>
    );
}