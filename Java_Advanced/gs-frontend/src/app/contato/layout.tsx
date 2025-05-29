// src/app/contato/layout.tsx
'use client';

import React from 'react';
import 'leaflet/dist/leaflet.css'; // <-- Import Leaflet's CSS HERE

export default function ContatoLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    // This layout wraps the contact page content.
    return (
        <section className="contato-section"> {/* This class can be used for specific contact section styling if needed */}
            {children}
        </section>
    );
}