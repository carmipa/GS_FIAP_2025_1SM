// src/app/clientes/layout.tsx
import Link from 'next/link';

export default function ClientesLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const subNavStyle: React.CSSProperties = {
        backgroundColor: '#e9ecef',
        padding: '10px 20px',
        marginBottom: '20px',
        borderRadius: '4px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
    };
    const subNavLinkStyle: React.CSSProperties = {
        textDecoration: 'none',
        color: '#007bff',
        fontWeight: '500',
    };

    return (
        <section className="container">
            <nav style={subNavStyle}>
                <Link href="/clientes/listar" style={subNavLinkStyle}>Listar Clientes</Link>
                <Link href="/clientes/cadastrar" style={subNavLinkStyle}>Cadastrar Cliente</Link>
                <Link href="/clientes/buscar" style={subNavLinkStyle}>Buscar Cliente</Link>
            </nav>
            {children}
        </section>
    );
}