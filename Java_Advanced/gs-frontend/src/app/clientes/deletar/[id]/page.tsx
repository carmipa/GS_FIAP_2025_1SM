// src/app/clientes/deletar/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// CORREÇÃO DO CAMINHO ABAIXO:
import { buscarClientePorId, deletarCliente } from '@/lib/apiService';
import type { ClienteResponseDTO } from '@/lib/types';
import Link from 'next/link';

// ... (o resto do código do DeletarClienteConfirmPage permanece o mesmo da minha resposta anterior)
// Cole o restante do código que já te enviei para esta página,
// apenas certifique-se de que as importações acima estejam com o caminho '../../../../lib/'
// Correto: ../../../lib/

export default function DeletarClienteConfirmPage() {
    const params = useParams();
    const router = useRouter();
    const idPath = Array.isArray(params.id) ? params.id[0] : params.id;

    const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);

    useEffect(() => {
        if (idPath) {
            const clienteId = Number(idPath);
            if (isNaN(clienteId)) {
                setErro("ID do cliente inválido na URL.");
                setLoading(false);
                return;
            }
            setLoading(true);
            buscarClientePorId(clienteId)
                .then(data => {
                    setCliente(data);
                    setErro(null);
                })
                .catch(error => {
                    console.error("Erro ao buscar cliente para deleção:", error);
                    setErro(`Falha ao carregar cliente para deleção: ${error.message || 'Cliente não encontrado.'}`);
                    setCliente(null);
                })
                .finally(() => setLoading(false));
        } else {
            setErro("ID do cliente não fornecido para deleção.");
            setLoading(false);
        }
    }, [idPath]);

    const handleConfirmarDelecao = async () => {
        if (cliente) {
            setDeleting(true);
            setErro(null);
            try {
                await deletarCliente(cliente.idCliente);
                alert('Cliente deletado com sucesso!');
                router.push('/clientes/listar');
            } catch (error: any) {
                console.error("Erro ao confirmar deleção:", error);
                setErro(`Falha ao deletar cliente: ${error.message || 'Erro desconhecido.'}`);
                // alert já está na UI
                setDeleting(false);
            }
        }
    };

    if (loading) return <div className="container"><p>Carregando dados do cliente...</p></div>;
    if (erro && !cliente) return <div className="container"><p className="message error">{erro}</p><Link href="/clientes/listar">Voltar para lista</Link></div>;
    if (!cliente) return <div className="container"><p>Cliente não encontrado.</p><Link href="/clientes/listar">Voltar para lista</Link></div>;

    return (
        <div className="container">
            <h1 className="page-title">Confirmar Deleção do Cliente</h1>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                <p>Você tem certeza que deseja deletar o cliente:</p>
                <p><strong>Nome:</strong> {cliente.nome} {cliente.sobrenome}</p>
                <p><strong>Documento:</strong> {cliente.documento}</p>
                <p style={{color: 'red', fontWeight: 'bold', margin: '20px 0'}}>Esta ação não pode ser desfeita.</p>
                {erro && <p className="message error" style={{textAlign: 'left', marginBottom: '15px'}}>{erro}</p>}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button onClick={handleConfirmarDelecao} className="button-danger" disabled={deleting}>
                        {deleting ? 'Deletando...' : 'Sim, Deletar Cliente'}
                    </button>
                    <Link href={`/clientes/${cliente.idCliente}`} className="button-secondary" style={{textDecoration:'none'}}>
                        Cancelar
                    </Link>
                </div>
            </div>
        </div>
    );
}