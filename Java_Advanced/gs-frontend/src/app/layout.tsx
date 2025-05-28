// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GS Alerta Desastres",
    description: "Aplicação para monitoramento de desastres e alertas",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined"
                rel="stylesheet"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        </head>
        <body>
        <nav>
            <Link href="/" className="logo">
                <span className="material-icons-outlined" style={{ fontSize: '1.5em', marginRight: '8px' }}>api</span>
                GS Alerta Desastres
            </Link>
            <Link href="/clientes/listar">
                <span className="material-icons-outlined">group</span>
                Clientes
            </Link>
            <Link href="/desastres">
                <span className="material-icons-outlined">volcano</span>
                Desastres EONET
            </Link>
            <Link href="/contato"> {/* NOVO LINK */}
                <span className="material-icons-outlined">contact_support</span>
                Fale Conosco
            </Link>
        </nav>
        <main>
            {children}
        </main>
        <footer style={{ textAlign: 'center', padding: '20px 0', marginTop: '30px', borderTop: '1px solid #eee', fontSize: '0.9em', color: '#777' }}>
            Global Solution 2025 - FIAP &copy;
        </footer>
        </body>
        </html>
    )
}
