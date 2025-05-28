// src/app/contato/layout.tsx
'use client';

import React from 'react';

export default function ContatoLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    // Este layout envolve o conteúdo da página de contato.
    // Ele não deve incluir elementos de navegação de outras seções.
    return (
        <section className="contato-section"> {/* Adicionada uma classe opcional para estilização específica da seção, se necessário */}
            {children}
        </section>
    );
}
