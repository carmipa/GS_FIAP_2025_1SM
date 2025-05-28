// src/app/desastres/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
// A importação de './globals.css' foi REMOVIDA daqui,
// pois já é importado no root layout (src/app/layout.tsx).

export default function DesastresLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    // Estilos para a sub-navegação, similar ao ClientesLayout
    const subNavStyle: React.CSSProperties = {
        backgroundColor: '#f8f9fa', // Cor de fundo suave
        padding: '12px 20px',
        marginBottom: '25px',
        borderRadius: '8px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    };

    const subNavLinkStyle: React.CSSProperties = {
        textDecoration: 'none',
        color: '#0056b3', // Azul escuro para links
        fontWeight: '500',
        padding: '8px 12px',
        borderRadius: '5px',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px', // Espaço entre ícone e texto
    };

    // Efeito hover para os links da sub-navegação
    const handleLinkMouseOver = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.backgroundColor = '#e9ecef'; // Um cinza claro para hover
        e.currentTarget.style.color = '#003f80'; // Azul mais escuro no hover
    };
    const handleLinkMouseOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#0056b3';
    };

    return (
        <section>
            {/* Sub-navegação para a seção de Desastres */}
            <nav style={subNavStyle}>
                <Link
                    href="/desastres"
                    style={subNavLinkStyle}
                    onMouseOver={handleLinkMouseOver}
                    onMouseOut={handleLinkMouseOut}
                >
                    <span className="material-icons-outlined">dashboard</span> Painel EONET
                </Link>
                <Link
                    href="/desastres/mapa" // Rota para uma futura página de mapa
                    style={subNavLinkStyle}
                    onMouseOver={handleLinkMouseOver}
                    onMouseOut={handleLinkMouseOut}
                >
                    <span className="material-icons-outlined">map</span> Mapa de Eventos
                </Link>
                {/* Você pode adicionar mais links aqui conforme a seção evolui, ex: Alertas */}
                {/* <Link
                    href="/desastres/alertas"
                    style={subNavLinkStyle}
                    onMouseOver={handleLinkMouseOver}
                    onMouseOut={handleLinkMouseOut}
                >
                    <span className="material-icons-outlined">notification_important</span> Meus Alertas
                </Link>
                */}
            </nav>

            <div className="container">
                {children}
            </div>
        </section>
    );
}
