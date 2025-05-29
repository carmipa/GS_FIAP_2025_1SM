// src/app/clientes/buscar/page.tsx
'use client';
import { useState, FormEvent, useRef } from 'react'; // Adicionado useRef
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BuscarClientePage() {
    const [termoBusca, setTermoBusca] = useState('');
    const [tipoBusca, setTipoBusca] = useState<'id' | 'documento'>('id'); // Removido 'email' por simplicidade, foque no ID e Documento
    const router = useRouter();

    const termoBuscaRef = useRef<HTMLInputElement>(null);

    const handleBuscar = (e: FormEvent) => {
        e.preventDefault();
        if (!termoBusca.trim()) {
            alert('Por favor, informe um termo para busca.');
            termoBuscaRef.current?.focus();
            return;
        }
        if (tipoBusca === 'id') {
            if (isNaN(Number(termoBusca))) {
                alert('Para busca por ID, por favor, informe um valor numérico.');
                termoBuscaRef.current?.focus();
                return;
            }
            router.push(`/clientes/${termoBusca}`);
        } else if (tipoBusca === 'documento') {
            // Implementação futura: router.push(`/clientes/listar?documento=${termoBusca}`);
            // Ou uma página de resultados de busca. Por agora, alerta.
            alert(`Busca por documento direcionaria para uma lista filtrada ou detalhes (ainda não implementado aqui). Buscando por documento: ${termoBusca}`);
            // Aqui você poderia chamar uma função da apiService para buscar por documento
            // e redirecionar para os detalhes se encontrado, ou para uma página de resultados.
            // Ex: buscarClientePorDocumento(termoBusca).then(cliente => router.push(`/clientes/${cliente.idCliente}`)).catch(err => alert("Cliente não encontrado"));
        }
    };

    return (
        <div className="container">
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1.8em' }}>person_search</span>
                Buscar Usuário
            </h1>
            <form onSubmit={handleBuscar} className="form-container" style={{maxWidth: '500px', margin: '0 auto'}}>
                <div className="form-group">
                    <label htmlFor="tipoBusca" style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <span className="material-icons-outlined">manage_search</span>
                        Buscar por:
                    </label>
                    <select
                        id="tipoBusca"
                        value={tipoBusca}
                        onChange={(e) => setTipoBusca(e.target.value as any)}
                        style={{padding: '10px', fontSize: '1em', borderRadius:'5px', border:'1px solid #ccc', width:'100%'}}
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
                        type={tipoBusca === 'id' ? 'number' : 'text'} // Mantém number para ID para validação do navegador
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        placeholder={tipoBusca === 'id' ? 'Digite o ID numérico' : 'Digite apenas números do documento'}
                        required
                        style={{padding: '10px', fontSize: '1em', borderRadius:'5px', border:'1px solid #ccc', width:'100%'}}
                        maxLength={tipoBusca === 'documento' ? 14 : undefined} // Limita para documento
                    />
                </div>
                <button type="submit" className="button button-primary" style={{width: '100%', padding: '12px', fontSize: '1.1em'}}>
                    <span className="material-icons-outlined">search</span>
                    Buscar
                </button>
            </form>
            <p style={{marginTop: '25px', textAlign: 'center'}}>
                Para ver todos os Usuários, acesse a <Link href="/clientes/listar" style={{color: '#007bff', textDecoration: 'underline'}}>Lista de Clientes</Link>.
            </p>
        </div>
    );
}