// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  const linkStyle: React.CSSProperties = {
    display: 'inline-block',
    margin: '10px',
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    minWidth: '150px'
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 100px)', // Ajustar altura baseado no navbar
    padding: '20px'
  };

  return (
      <div style={containerStyle} className="container">
        <h1 className="page-title">Bem-vindo ao Teste da API GS</h1>
        <p style={{textAlign: 'center', marginBottom: '30px', fontSize: '1.1em'}}>
          Utilize a barra de navegação acima ou os links abaixo para gerenciar as entidades.
        </p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/clientes/listar" style={linkStyle}>Gerenciar Clientes</Link>
          <Link href="/contatos/listar" style={linkStyle}>Gerenciar Contatos</Link>
          <Link href="/enderecos/listar" style={linkStyle}>Gerenciar Endereços</Link>
        </div>
      </div>
  );
}