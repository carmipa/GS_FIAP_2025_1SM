// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GS Frontend Teste",
    description: "Aplicação para testar API da GS",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
        <body>
        <nav>
            <Link href="/" className="logo">GS API Test</Link>
            <Link href="/clientes/listar">Clientes</Link>
            <Link href="/contatos/listar">Contatos</Link>
            <Link href="/enderecos/listar">Endereços</Link>
        </nav>
        <main>
            {children}
        </main>
        </body>
        </html>
    )
}