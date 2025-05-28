// src/app/page.tsx
'use client';

import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  const linkStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px',
    padding: '20px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '220px',
    minHeight: '100px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    fontWeight: '500',
    fontSize: '1.1em'
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '2.5em',
    marginBottom: '10px',
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
  };
  const handleMouseOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 160px)',
    padding: '20px'
  };

  return (
      <div style={containerStyle} className="container">
        <h1 className="page-title" style={{marginBottom: '15px'}}>Bem-vindo ao Painel GS Alerta Desastres</h1>
        <p style={{textAlign: 'center', marginBottom: '40px', fontSize: '1.15em', color: '#555'}}>
          Utilize os links abaixo para gerenciar as entidades do sistema.
        </p>
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
              href="/clientes/listar"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
          >
            <span className="material-icons-outlined" style={iconStyle}>group</span>
            Gerenciar Clientes
          </Link>
          <Link
              href="/desastres"
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
          >
            <span className="material-icons-outlined" style={iconStyle}>volcano</span>
            Desastres EONET
          </Link>
          <Link
              href="/contato" // Assumindo que a página de contato está em /contato
              style={linkStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
          >
            <span className="material-icons-outlined" style={iconStyle}>contact_mail</span> {/* Ícone para Contatos */}
            Fale Conosco
          </Link>
        </div>
      </div>
  );
}
