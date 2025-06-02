// src/app/clientes/listar/page.tsx
'use client'; // ESSENCIAL: Marca como Client Component para usar hooks (useState, useEffect)

import React, { useEffect, useState } from 'react'; // Importando React explicitamente
import Link from 'next/link';
import { listarClientes, deletarCliente } from '@/lib/apiService'; // Assegure que este caminho está correto [cite: 435]
import type { ClienteResponseDTO, Page } from '@/lib/types'; // Assegure que este caminho está correto [cite: 435]

// O nome da função DEVE começar com letra maiúscula
export default function ListarClientesPage() {
    const [clientesPage, setClientesPage] = useState<Page<ClienteResponseDTO> | null>(null); // [cite: 436]
    const [erro, setErro] = useState<string | null>(null); // [cite: 437]
    const [loading, setLoading] = useState<boolean>(true); // [cite: 437]
    const [currentPage, setCurrentPage] = useState<number>(0); // [cite: 437]
    
    // Estados para o modal de confirmação de deleção
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // [cite: 438]
    const [clienteParaDeletar, setClienteParaDeletar] = useState<ClienteResponseDTO | null>(null); // [cite: 439]
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false); // [cite: 439]
    const [debugInfo, setDebugInfo] = useState<string[]>([]); // Para logs no UI

    const addDebugInfo = (info: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugInfo(prev => [...prev, `[${timestamp}] ${info}`]);
        console.log(`[ListarClientesPage Debug] ${info}`);
    }

    useEffect(() => {
        addDebugInfo(`useEffect disparado. CurrentPage: ${currentPage}`);

        const fetchClientes = async (page: number) => {
            addDebugInfo(`fetchClientes - Iniciando busca para página: ${page}`);
            setLoading(true);
            setErro(null);
            try {
                // A API_BASE_URL e a URL da requisição já são logadas dentro de listarClientes no apiService.ts
                const data = await listarClientes(page, 5); // [cite: 441]
                addDebugInfo(`fetchClientes - Dados recebidos para página ${page}: ${data ? `Total: ${data.totalElements}, Conteúdo: ${data.content.length} itens` : 'Nenhum dado'}`);
                setClientesPage(data); // [cite: 441]
            } catch (error: any) {
                addDebugInfo(`fetchClientes - ERRO ao buscar clientes para página ${page}: ${error.message}`);
                console.error("[ListarClientesPage] fetchClientes - Detalhes do Erro:", error, error.stack); // [cite: 442]
                setErro(`Falha ao carregar clientes (useEffect): ${error.message || 'Erro desconhecido'}`); // [cite: 443]
                setClientesPage(null); // [cite: 443]
            } finally {
                setLoading(false); // [cite: 443]
                addDebugInfo(`fetchClientes - Finalizado para página: ${page}`);
            }
        };

        fetchClientes(currentPage);
    }, [currentPage]); // [cite: 444]

    const iniciarDelecao = (cliente: ClienteResponseDTO) => { // [cite: 445]
        addDebugInfo(`iniciarDelecao - Cliente ID: ${cliente.idCliente}, Nome: ${cliente.nome}`);
        setClienteParaDeletar(cliente); // [cite: 445]
        setShowDeleteModal(true); // [cite: 445]
    };

    const confirmarDelecao = async () => { // [cite: 446]
        if (!clienteParaDeletar) return;
        addDebugInfo(`confirmarDelecao - Deletando cliente ID: ${clienteParaDeletar.idCliente}`);
        setLoadingDelete(true); // [cite: 446]
        setErro(null); // [cite: 447]
        try {
            await deletarCliente(clienteParaDeletar.idCliente); // [cite: 447]
            addDebugInfo(`confirmarDelecao - Cliente ID: ${clienteParaDeletar.idCliente} deletado com sucesso.`);
            setShowDeleteModal(false); // [cite: 448]
            setClienteParaDeletar(null); // [cite: 449]
            
            // Re-fetch ou atualiza a lista local
            if (clientesPage && clientesPage.content.length === 1 && currentPage > 0) { // [cite: 449]
                addDebugInfo(`confirmarDelecao - Era o último item na página, voltando para página anterior: ${currentPage - 1}`);
                setCurrentPage(currentPage - 1); // [cite: 449]
            } else {
                addDebugInfo(`confirmarDelecao - Recarregando página atual: ${currentPage}`);
                // Chamada direta para fetchClientes para recarregar os dados
                const fetchCurrentPageAgain = async () => {
                    setLoading(true); setErro(null);
                    try {
                        const data = await listarClientes(currentPage, 5);
                        setClientesPage(data);
                    } catch (error: any) {
                        setErro(`Falha ao recarregar clientes: ${error.message || 'Erro desconhecido'}`);
                    } finally { setLoading(false); }
                };
                fetchCurrentPageAgain();
            }
        } catch (error: any) {
            addDebugInfo(`confirmarDelecao - ERRO ao deletar cliente ID: ${clienteParaDeletar.idCliente}: ${error.message}`);
            console.error("[ListarClientesPage] confirmarDelecao - Detalhes do Erro:", error); // [cite: 451]
            setErro(`Falha ao deletar cliente: ${error.message || 'Erro desconhecido'}`); // [cite: 452]
            // Considerar se o modal deve ser fechado ou não em caso de erro
        } finally {
            setLoadingDelete(false); // [cite: 453]
        }
    };

    if (loading && !clientesPage && !erro) { // Só mostra "Carregando" se não houver erro e nenhum dado anterior
        return <div className="container"><p>Carregando clientes...</p></div>; // [cite: 455]
    }

    // Renderização de erro mais proeminente se o estado 'erro' for definido
    if (erro) {
        return (
            <div className="container">
                <p className="message error" style={{color: 'red', border: '1px solid red', padding: '10px', whiteSpace: 'pre-wrap'}}>
                    ERRO AO CARREGAR DADOS: {erro}
                </p>
                <Link href="/clientes/listar" className="button button-secondary" onClick={() => { setErro(null); fetchClientes(currentPage); }}>Tentar Novamente</Link>
                <hr/>
                {/* Área de Debug (opcional, para desenvolvimento) */}
                <h3>Log de Depuração da Página:</h3>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '0.8em' }}>
                    {debugInfo.join('\n')}
                </pre>
            </div>
        );
    }
    
    return ( // [cite: 456]
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Lista de Usuários</h1>
                <Link href="/clientes/cadastrar" className="button button-success">
                    <span className="material-icons-outlined">add_circle_outline</span>
                    Cadastrar Novo
                </Link>
            </div>

            {(!clientesPage || clientesPage.content.length === 0) && !loading && ( // [cite: 457]
                <div style={{ textAlign: 'center', padding: '30px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                    <p>Nenhum cliente encontrado.</p> 
                </div>
            )}

            {clientesPage && clientesPage.content.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0 }}> 
                    {clientesPage.content.map(cliente => { // [cite: 459]
                        const contatoPrincipal = cliente.contatos && cliente.contatos.length > 0 ? cliente.contatos[0] : null; // [cite: 459]
                        const enderecoPrincipal = cliente.enderecos && cliente.enderecos.length > 0 ? cliente.enderecos[0] : null; // [cite: 460]
                        return (
                            <li key={cliente.idCliente} className="client-list-item"> {/* [cite: 461] */}
                                <div className="client-info-section">
                                    <strong>{cliente.nome} {cliente.sobrenome} <span style={{fontSize: '0.8em', color: '#777'}}>(ID: {cliente.idCliente})</span></strong> {/* [cite: 462] */}
                                    <p><span className="label">Documento:</span> {cliente.documento}</p>
                                    {contatoPrincipal && (
                                        <>
                                            <p><span className="label"><span className="material-icons-outlined" style={{fontSize: '1em'}}>email</span> Email:</span> {contatoPrincipal.email}</p> {/* [cite: 463] */}
                                            {contatoPrincipal.whatsapp && <p><span className="label"><span className="material-icons-outlined" style={{fontSize: '1em', color: 'green'}}>chat_bubble_outline</span> WhatsApp:</span> ({contatoPrincipal.ddd}) {contatoPrincipal.whatsapp}</p>} {/* [cite: 464] */}
                                        </>
                                    )}
                                    {enderecoPrincipal && (
                                        <>
                                            <p style={{marginTop: '5px'}}>
                                                <span className="label"><span className="material-icons-outlined" style={{fontSize: '1em'}}>home</span> Endereço:</span> {enderecoPrincipal.logradouro}, {enderecoPrincipal.numero} {/* [cite: 466] */}
                                                {enderecoPrincipal.complemento && ` - ${enderecoPrincipal.complemento}`} {/* [cite: 467] */}
                                                <br />
                                                {enderecoPrincipal.bairro} - {enderecoPrincipal.localidade}/{enderecoPrincipal.uf} (CEP: {enderecoPrincipal.cep}) {/* [cite: 468] */}
                                            </p>
                                            <p>
                                                <span className="label"><span className="material-icons-outlined" style={{fontSize: '1em'}}>public</span> Coordenadas:</span> Lat: {enderecoPrincipal.latitude?.toFixed(5)}, Lon: {enderecoPrincipal.longitude?.toFixed(5)} {/* [cite: 469] */}
                                            </p>
                                        </>
                                    )}
                                    {!contatoPrincipal && !enderecoPrincipal && <p><i>(Sem informações de contato ou endereço principal)</i></p>} {/* [cite: 471] */}
                                </div>
                                <div className="client-actions"> {/* [cite: 472] */}
                                    <Link href={`/clientes/${cliente.idCliente}`} className="button button-secondary">
                                        <span className="material-icons-outlined">visibility</span> Ver
                                    </Link> {/* [cite: 472] */}
                                    <Link href={`/clientes/alterar/${cliente.idCliente}`} className="button button-edit">
                                        <span className="material-icons-outlined">edit</span> Editar
                                    </Link> {/* [cite: 473] */}
                                    <button onClick={() => iniciarDelecao(cliente)} className="button button-danger">
                                        <span className="material-icons-outlined">delete_outline</span> Deletar
                                    </button> {/* [cite: 474] */}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {clientesPage && clientesPage.totalPages > 0 && (
                <div className="pagination-controls"> {/* [cite: 477] */}
                    <button
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={clientesPage.first || loading}
                        className="button button-secondary"
                    > {/* [cite: 478] */}
                        <span className="material-icons-outlined">navigate_before</span>
                        Anterior
                    </button>
                    <span>Página {clientesPage.number + 1} de {clientesPage.totalPages}</span> {/* [cite: 479] */}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(clientesPage.totalPages - 1, p + 1))}
                        disabled={clientesPage.last || loading}
                        className="button button-secondary"
                    > {/* [cite: 480] */}
                        Próxima
                        <span className="material-icons-outlined">navigate_next</span>
                    </button>
                </div>
            )}

            {showDeleteModal && clienteParaDeletar && ( // [cite: 482]
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2><span className="material-icons-outlined" style={{color: '#dc3545', fontSize:'1.5em'}}>warning_amber</span> Confirmar Deleção</h2> {/* [cite: 483] */}
                        <p>Tem certeza que deseja deletar o cliente <strong>"{clienteParaDeletar.nome} {clienteParaDeletar.sobrenome}"</strong> (ID: {clienteParaDeletar.idCliente})?</p>
                        <p style={{color: '#dc3545', fontWeight:'bold'}}>Esta ação não pode ser desfeita.</p>

                        {erro && !loadingDelete && <p className="message error" style={{textAlign:'left'}}>{erro}</p>} {/* [cite: 484] Exibe erro de deleção no modal */}

                        <div className="modal-actions"> {/* [cite: 484] */}
                            <button onClick={confirmarDelecao} className="button button-danger" disabled={loadingDelete}>
                                {loadingDelete ? 'Deletando...' : 'Sim, Deletar'} {/* [cite: 485] */}
                            </button>
                            <button onClick={() => { setShowDeleteModal(false); setErro(null); }} className="button button-secondary" disabled={loadingDelete}> {/* [cite: 486] */}
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Área de Debug (opcional, para desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && (
                 <div style={{marginTop: '30px', borderTop: '1px dashed #ccc', paddingTop: '15px'}}>
                    <h3>Log de Depuração da Página:</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '0.8em' }}>
                        {debugInfo.join('\n')}
                    </pre>
                </div>
            )}
        </div>
    );
}