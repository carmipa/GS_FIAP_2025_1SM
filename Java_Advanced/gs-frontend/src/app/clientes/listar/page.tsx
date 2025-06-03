// src/app/clientes/listar/page.tsx
'use client'; // ESSENCIAL: Marca como Client Component para usar hooks (useState, useEffect)

import React, { useEffect, useState } from 'react'; // Importando React explicitamente
import Link from 'next/link';
import { listarClientes, deletarCliente } from '@/lib/apiService'; // Assegure que este caminho está correto
import type { ClienteResponseDTO, Page } from '@/lib/types'; // Assegure que este caminho está correto

// O nome da função DEVE começar com letra maiúscula
export default function ListarClientesPage() {
    const [clientesPage, setClientesPage] = useState<Page<ClienteResponseDTO> | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);
    
    // Estados para o modal de confirmação de deleção
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [clienteParaDeletar, setClienteParaDeletar] = useState<ClienteResponseDTO | null>(null);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    // const [debugInfo, setDebugInfo] = useState<string[]>([]); // REMOVIDO: Estado para logs no UI não é mais necessário

    const addDebugInfo = (info: string) => {
        const timestamp = new Date().toLocaleTimeString();
        // setDebugInfo(prev => [...prev, `[${timestamp}] ${info}`]); // REMOVIDO: Atualização do estado da UI não é mais necessária
        console.log(`[ListarClientesPage Debug] [${timestamp}] ${info}`); // MANTIDO: Log no console
    };

    useEffect(() => {
        addDebugInfo(`useEffect disparado. CurrentPage: ${currentPage}`);

        const fetchClientes = async (page: number) => {
            addDebugInfo(`fetchClientes - Iniciando busca para página: ${page}`);
            setLoading(true);
            setErro(null);
            try {
                const data = await listarClientes(page, 5);
                addDebugInfo(`fetchClientes - Dados recebidos para página ${page}: ${data ? `Total: ${data.totalElements}, Conteúdo: ${data.content.length} itens` : 'Nenhum dado'}`);
                setClientesPage(data);
            } catch (error: any) {
                addDebugInfo(`fetchClientes - ERRO ao buscar clientes para página ${page}: ${error.message}`);
                console.error("[ListarClientesPage] fetchClientes - Detalhes do Erro:", error, error.stack);
                setErro(`Falha ao carregar clientes (useEffect): ${error.message || 'Erro desconhecido'}`);
                setClientesPage(null);
            } finally {
                setLoading(false);
                addDebugInfo(`fetchClientes - Finalizado para página: ${page}`);
            }
        };

        fetchClientes(currentPage);
    }, [currentPage]);

    const iniciarDelecao = (cliente: ClienteResponseDTO) => {
        addDebugInfo(`iniciarDelecao - Cliente ID: ${cliente.idCliente}, Nome: ${cliente.nome}`);
        setClienteParaDeletar(cliente);
        setShowDeleteModal(true);
    };

    const confirmarDelecao = async () => {
        if (!clienteParaDeletar) return;
        addDebugInfo(`confirmarDelecao - Deletando cliente ID: ${clienteParaDeletar.idCliente}`);
        setLoadingDelete(true);
        setErro(null);
        try {
            await deletarCliente(clienteParaDeletar.idCliente);
            addDebugInfo(`confirmarDelecao - Cliente ID: ${clienteParaDeletar.idCliente} deletado com sucesso.`);
            setShowDeleteModal(false);
            setClienteParaDeletar(null);
            
            if (clientesPage && clientesPage.content.length === 1 && currentPage > 0) {
                addDebugInfo(`confirmarDelecao - Era o último item na página, voltando para página anterior: ${currentPage - 1}`);
                setCurrentPage(currentPage - 1);
            } else {
                addDebugInfo(`confirmarDelecao - Recarregando página atual: ${currentPage}`);
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
            console.error("[ListarClientesPage] confirmarDelecao - Detalhes do Erro:", error);
            setErro(`Falha ao deletar cliente: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setLoadingDelete(false);
        }
    };

    if (loading && !clientesPage && !erro) {
        return <div className="container"><p>Carregando clientes...</p></div>;
    }

    if (erro && !showDeleteModal) { // Modificado para não mostrar o erro geral se o modal de deleção estiver ativo e tiver seu próprio erro
        return (
            <div className="container">
                <p className="message error" style={{color: 'red', border: '1px solid red', padding: '10px', whiteSpace: 'pre-wrap'}}>
                    ERRO AO CARREGAR DADOS: {erro}
                </p>
                {/* Atenção: a chamada fetchClientes(currentPage) aqui pode causar um erro de escopo, 
                  pois fetchClientes é definida dentro do useEffect.
                  Considere uma estratégia diferente para "Tentar Novamente", como um reload completo
                  ou reestruturar a função fetchClientes para ser acessível aqui.
                */}
                <Link href="/clientes/listar" className="button button-secondary" onClick={() => { 
                    setErro(null); 
                    // Se fetchClientes não estiver acessível, você pode forçar o useEffect a rodar novamente
                    // mudando currentPage para si mesmo (se isso fizer sentido) ou usar window.location.reload()
                    // Ex: setCurrentPage(prev => prev); // Para tentar reativar o useEffect
                    // Ou, para uma nova busca imediata sem depender do useEffect diretamente aqui:
                    // const reloadEffect = async () => {
                    //   setLoading(true);
                    //   try {
                    //     const data = await listarClientes(currentPage, 5);
                    //     setClientesPage(data);
                    //   } catch (e: any) { setErro(e.message); }
                    //   finally { setLoading(false); }
                    // };
                    // reloadEffect();
                    // Por ora, mantendo a estrutura original, mas ciente do potencial problema de escopo:
                    // fetchClientes(currentPage); // Esta linha pode ter problemas de escopo.
                    // Para uma solução simples de recarregar, pode-se usar:
                    window.location.reload();
                }}>Tentar Novamente</Link>
                <hr/>
                {/* Área de Debug (REMOVIDA DA UI) */}
            </div>
        );
    }
    
    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Lista de Usuários</h1>
                <Link href="/clientes/cadastrar" className="button button-success">
                    <span className="material-icons-outlined">add_circle_outline</span>
                    Cadastrar Novo
                </Link>
            </div>

            {(!clientesPage || clientesPage.content.length === 0) && !loading && !erro && (
                <div style={{ textAlign: 'center', padding: '30px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                    <p>Nenhum cliente encontrado.</p> 
                </div>
            )}

            {clientesPage && clientesPage.content.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0 }}> 
                    {clientesPage.content.map(cliente => {
                        const contatoPrincipal = cliente.contatos && cliente.contatos.length > 0 ? cliente.contatos[0] : null;
                        const enderecoPrincipal = cliente.enderecos && cliente.enderecos.length > 0 ? cliente.enderecos[0] : null;
                        return (
                            <li key={cliente.idCliente} className="client-list-item">
                                <div className="client-info-section">
                                    <strong>{cliente.nome} {cliente.sobrenome} <span style={{fontSize: '0.8em', color: '#777'}}>(ID: {cliente.idCliente})</span></strong>
                                    <p><span className="label">Documento:</span> {cliente.documento}</p>
                                    {contatoPrincipal && (
                                        <>
                                            <p><span className="label"><span className="material-icons-outlined" style={{fontSize: '1em'}}>email</span> Email:</span> {contatoPrincipal.email}</p>
                                            {contatoPrincipal.whatsapp && <p><span className="label"><span className="material-icons-outlined" style={{fontSize: '1em', color: 'green'}}>chat_bubble_outline</span> WhatsApp:</span> ({contatoPrincipal.ddd}) {contatoPrincipal.whatsapp}</p>}
                                        </>
                                    )}
                                    {enderecoPrincipal && (
                                        <>
                                            <p style={{marginTop: '5px'}}>
                                                <span className="label"><span className="material-icons-outlined" style={{fontSize: '1em'}}>home</span> Endereço:</span> {enderecoPrincipal.logradouro}, {enderecoPrincipal.numero}
                                                {enderecoPrincipal.complemento && ` - ${enderecoPrincipal.complemento}`}
                                                <br />
                                                {enderecoPrincipal.bairro} - {enderecoPrincipal.localidade}/{enderecoPrincipal.uf} (CEP: {enderecoPrincipal.cep})
                                            </p>
                                            <p>
                                                <span className="label"><span className="material-icons-outlined" style={{fontSize: '1em'}}>public</span> Coordenadas:</span> Lat: {enderecoPrincipal.latitude?.toFixed(5)}, Lon: {enderecoPrincipal.longitude?.toFixed(5)}
                                            </p>
                                        </>
                                    )}
                                    {!contatoPrincipal && !enderecoPrincipal && <p><i>(Sem informações de contato ou endereço principal)</i></p>}
                                </div>
                                <div className="client-actions">
                                    <Link href={`/clientes/${cliente.idCliente}`} className="button button-secondary">
                                        <span className="material-icons-outlined">visibility</span> Ver
                                    </Link>
                                    <Link href={`/clientes/alterar/${cliente.idCliente}`} className="button button-edit">
                                        <span className="material-icons-outlined">edit</span> Editar
                                    </Link>
                                    <button onClick={() => iniciarDelecao(cliente)} className="button button-danger">
                                        <span className="material-icons-outlined">delete_outline</span> Deletar
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {clientesPage && clientesPage.totalPages > 0 && (
                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={clientesPage.first || loading}
                        className="button button-secondary"
                    >
                        <span className="material-icons-outlined">navigate_before</span>
                        Anterior
                    </button>
                    <span>Página {clientesPage.number + 1} de {clientesPage.totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(clientesPage.totalPages - 1, p + 1))}
                        disabled={clientesPage.last || loading}
                        className="button button-secondary"
                    >
                        Próxima
                        <span className="material-icons-outlined">navigate_next</span>
                    </button>
                </div>
            )}

            {showDeleteModal && clienteParaDeletar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2><span className="material-icons-outlined" style={{color: '#dc3545', fontSize:'1.5em'}}>warning_amber</span> Confirmar Deleção</h2>
                        <p>Tem certeza que deseja deletar o cliente <strong>"{clienteParaDeletar.nome} {clienteParaDeletar.sobrenome}"</strong> (ID: {clienteParaDeletar.idCliente})?</p>
                        <p style={{color: '#dc3545', fontWeight:'bold'}}>Esta ação não pode ser desfeita.</p>

                        {erro && loadingDelete === false && <p className="message error" style={{textAlign:'left'}}>{erro}</p>} {/* Exibe erro de deleção no modal */}

                        <div className="modal-actions">
                            <button onClick={confirmarDelecao} className="button button-danger" disabled={loadingDelete}>
                                {loadingDelete ? 'Deletando...' : 'Sim, Deletar'}
                            </button>
                            <button onClick={() => { setShowDeleteModal(false); setErro(null); }} className="button button-secondary" disabled={loadingDelete}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Área de Debug (REMOVIDA DA UI) */}
            {/* {process.env.NODE_ENV === 'development' && (
                 <div style={{marginTop: '30px', borderTop: '1px dashed #ccc', paddingTop: '15px'}}>
                    <h3>Log de Depuração da Página:</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '0.8em' }}>
                        {debugInfo.join('\n')} // debugInfo não existe mais
                    </pre>
                </div>
            )}
            */}
        </div>
    );
}