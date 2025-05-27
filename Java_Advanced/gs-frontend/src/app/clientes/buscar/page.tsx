// src/app/clientes/buscar/page.tsx
'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importar Link

export default function BuscarClientePage() {
    const [termoBusca, setTermoBusca] = useState('');
    const [tipoBusca, setTipoBusca] = useState<'id' | 'documento' | 'email'>('id');
    const router = useRouter();

    const handleBuscar = (e: FormEvent) => {
        e.preventDefault();
        if (!termoBusca.trim()) {
            alert('Por favor, informe um termo para busca.');
            return;
        }
        if (tipoBusca === 'id' && !isNaN(Number(termoBusca))) {
            router.push(`/clientes/${termoBusca}`); // Redireciona para a página de detalhes [id].tsx
        } else {
            alert(`Busca por ${tipoBusca} ainda não implementada aqui. Tente buscar por ID numérico.`);
        }
    };

    return (
        <div className="container">
            <h1 className="page-title">Buscar Cliente</h1>
            <form onSubmit={handleBuscar}>
                <label>
                    Buscar por:
                    <select value={tipoBusca} onChange={(e) => setTipoBusca(e.target.value as any)} style={{marginBottom: '10px'}}>
                        <option value="id">ID do Cliente</option>
                        {/* <option value="documento">Documento</option> */}
                    </select>
                </label>
                <label>
                    {tipoBusca === 'id' ? 'ID do Cliente:' : 'Termo de Busca:'}
                    <input
                        type={tipoBusca === 'id' ? 'number' : 'text'}
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        placeholder={tipoBusca === 'id' ? 'Digite o ID numérico' : 'Digite para buscar...'}
                        required
                    />
                </label>
                <button type="submit">Buscar</button>
            </form>
            <p style={{marginTop: '15px'}}>
                Para ver todos os clientes, acesse a <Link href="/clientes/listar">Lista de Clientes</Link>.
            </p>
        </div>
    );
}