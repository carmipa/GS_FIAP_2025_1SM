// src/components/LeafletMap.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css'; // Remova esta linha se o CSS do Leaflet já estiver no layout.tsx global
import L from 'leaflet';

// Correção do ícone do Leaflet
const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Usando 1.9.4 para consistência com o CSS no layout
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface LeafletMapProps {
    position: [number, number];
    zoom?: number;
    markerText?: string;
    style?: React.CSSProperties;
    className?: string; // Adicionada prop className
}

const LeafletMap: React.FC<LeafletMapProps> = ({
                                                   position,
                                                   zoom = 16, // Zoom um pouco mais próximo pode ser bom
                                                   markerText = "Localização",
                                                   style = { height: '100%', width: '100%' }, // Estilo padrão para preenchimento
                                                   className // Recebe className
                                               }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(typeof window !== 'undefined');
    }, []);

    if (!isClient) return (
        <div style={style} className={`${className || ''} flex items-center justify-center bg-slate-700/30`}>
            {/* Placeholder para SSR ou enquanto isClient é falso */}
        </div>
    );


    return (
        <MapContainer
            center={position}
            zoom={zoom}
            style={style} // Aplica o style (que inclui altura e largura 100% por padrão)
            className={className} // Aplica a className passada
            scrollWheelZoom={false} // Padrão para não interferir com scroll da página
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={defaultIcon}>
                {markerText && <Popup>{markerText}</Popup>}
            </Marker>
        </MapContainer>
    );
};

export default LeafletMap;
