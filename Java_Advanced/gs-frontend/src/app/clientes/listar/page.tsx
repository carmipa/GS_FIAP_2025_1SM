// src/app/clientes/listar/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
// CORREÇÃO DO CAMINHO ABAIXO:
import { listarClientes, deletarCliente } from '@/lib/apiService';
import type { ClienteResponseDTO, Page } from '@/lib/types';

export default function ListarClientesPage() {
    const [clientesPage, setClientesPage] = useState<Page<ClienteResponseDTO> | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const fetchClientes = async (page: number) => {
        setLoading(true);
        setErro(null);
        try {
            const data = await listarClientes(page, 5);
            setClientesPage(data);
        } catch (error: any) {
            console.error("Erro ao buscar clientes:", error);
            setErro(`Falha ao carregar clientes: ${error.message || 'Erro desconhecido'}`);
            setClientesPage(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes(currentPage);
    }, [currentPage]);

    const handleDeletar = async (id: number, nome: string) => {
        if (window.confirm(`Tem certeza que deseja deletar o cliente "${nome}" (ID: ${id})?`)) {
            try {
                await deletarCliente(id);
                alert('Cliente deletado com sucesso!');
                if (clientesPage && clientesPage.content.length === 1 && currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                } else {
                    fetchClientes(currentPage);
                }
            } catch (error: any) {
                console.error("Erro ao deletar cliente:", error);
                alert(`Falha ao deletar cliente: ${error.message || 'Erro desconhecido'}`);
            }
        }
    };

    if (loading) return <div className="container"><p>Carregando clientes...</p></div>;
    if (erro && (!clientesPage || clientesPage.content.length === 0)) return <div className="container"><p className="message error">{erro}</p></div>;
    if (!clientesPage || clientesPage.content.length === 0) return <div className="container"><p>Nenhum cliente encontrado.</p><Link href="/clientes/cadastrar" className="button-primary" style={{ marginTop: '10px', display: 'inline-block' }}>Cadastrar Novo Cliente</Link></div>;

    return (
        <div className="container">
            <h1 className="page-title">Lista de Clientes</h1>
            <Link href="/clientes/cadastrar" style={{ display: 'inline-block', marginBottom: '20px', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                Cadastrar Novo Cliente
            </Link>
            {erro && <p className="message error" style={{marginBottom: '15px'}}>{erro}</p>}
            <ul className="item-list">
                {clientesPage.content.map(cliente => (
                    <li key={cliente.idCliente}>
                        <div className="info">
                            <strong>{cliente.nome} {cliente.sobrenome}</strong> (ID: {cliente.idCliente})<br />
                            <span>Documento: {cliente.documento}</span><br/>
                            {cliente.contatos && cliente.contatos.length > 0 && cliente.contatos[0].email && <span>Email: {cliente.contatos[0].email}</span>}
                        </div>
                        <div className="actions">
                            <Link href={`/clientes/${cliente.idCliente}`} className="button-secondary" style={{marginRight: '8px', textDecoration:'none'}}>Ver</Link>
                            <Link href={`/clientes/alterar/${cliente.idCliente}`} className="button-secondary" style={{marginRight: '8px', textDecoration:'none'}}>Editar</Link>
                            <Link href={`/clientes/deletar/${cliente.idCliente}`} className="button-danger" style={{textDecoration:'none'}}>Deletar</Link>
                        </div>
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={clientesPage.first || loading}>Anterior</button>
                <span>Página {clientesPage.number + 1} de {clientesPage.totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(clientesPage.totalPages - 1, p + 1))} disabled={clientesPage.last || loading}>Próxima</button>
            </div>
        </div>
    );
}