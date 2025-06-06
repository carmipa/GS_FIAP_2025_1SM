// src/components/EonetEventMap.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícone padrão do Leaflet
const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Interface para os dados de cada marcador
export interface EventMapMarkerData {
    id: string; 
    position: [number, number]; 
    popupText: string; 
}

// Interface para as props do componente principal do mapa
export interface EonetEventMapProps { // Exportando a interface para uso externo, se necessário
    initialCenter?: [number, number];
    initialZoom?: number;
    markersData?: EventMapMarkerData[];
    mapContainerStyle?: React.CSSProperties; // Adicionado para permitir estilização do container
    className?: string; // Para classes CSS externas
}

// Subcomponente para ajustar os limites do mapa aos marcadores
const FitBoundsToMarkers: React.FC<{ markers: EventMapMarkerData[] }> = ({ markers }) => {
    const map = useMap();
    useEffect(() => {
        if (markers && markers.length > 0) {
            const markerPositions = markers.map(marker => marker.position as L.LatLngExpression);
            if (markerPositions.length > 0) {
                const bounds = L.latLngBounds(markerPositions);
                try {
                     // Tenta ajustar os limites apenas se o mapa estiver visível e com tamanho
                    if (map.getContainer().offsetWidth > 0 && map.getContainer().offsetHeight > 0) {
                        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 }); // Adiciona padding e maxZoom
                    } else {
                        // Se o mapa não tem tamanho ainda, espera um pouco e tenta de novo
                        // Isso é um workaround para casos onde o mapa pode inicializar escondido ou sem dimensões
                        setTimeout(() => {
                             if (map.getContainer().offsetWidth > 0 && map.getContainer().offsetHeight > 0) {
                                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
                             }
                        }, 200);
                    }
                } catch (e) {
                    console.warn("Não foi possível ajustar os limites do mapa (fitBounds):", e);
                }
            }
        } else if (markers && markers.length === 0 && map) {
            // Se não há marcadores, pode resetar para uma visão padrão se desejado
            // Ex: map.setView(map.options.center || [-14.235004, -51.92528], map.options.zoom || 4);
        }
    }, [map, markers]);
    return null;
};

const EonetEventMap: React.FC<EonetEventMapProps> = ({
                                                         initialCenter = [-14.235004, -51.92528],
                                                         initialZoom = 4,
                                                         markersData = [],
                                                         mapContainerStyle, // Prop para estilo do container
                                                         className
                                                     }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(typeof window !== 'undefined');
    }, []);

    // Definições dos Tile Layers
    const streetTiles = {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    };

    const satelliteTiles = {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri &mdash; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    };

    if (!isClient) {
        return (
            <div style={mapContainerStyle || { height: '100%', width: '100%', minHeight:'400px', backgroundColor: '#e0e0e0' }} className={`${className || ''} flex items-center justify-center`}>
                <p>Carregando mapa de eventos...</p>
            </div>
        );
    }

    // Se não houver marcadores, usa initialCenter e initialZoom.
    // Se houver marcadores, FitBoundsToMarkers cuidará do centro e zoom.
    // No entanto, MapContainer ainda precisa de um 'center' e 'zoom' iniciais.
    const mapKey = markersData.length > 0 ? markersData.map(m => m.id).join('_') : 'initial_map';


    return (
        <MapContainer
            key={mapKey} // Adicionar uma chave pode ajudar a forçar o remonte do mapa se os marcadores mudarem drasticamente
            center={ (markersData && markersData.length > 0 && markersData[0].position) ? markersData[0].position : initialCenter}
            zoom={ (markersData && markersData.length > 0) ? 10 : initialZoom } // Um zoom inicial se houver marcadores, será ajustado pelo FitBounds
            style={mapContainerStyle || { height: '100%', width: '100%' }}
            className={className}
            scrollWheelZoom={true}
            attributionControl={true}
        >
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Mapa de Ruas">
                    <TileLayer
                        url={streetTiles.url}
                        attribution={streetTiles.attribution}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Imagem de Satélite">
                    <TileLayer
                        url={satelliteTiles.url}
                        attribution={satelliteTiles.attribution}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            {markersData.map((marker) => (
                <Marker key={marker.id} position={marker.position} icon={defaultIcon}>
                    <Popup>
                        <div dangerouslySetInnerHTML={{ __html: marker.popupText }} />
                    </Popup>
                </Marker>
            ))}
            
            {/* FitBoundsToMarkers tentará ajustar o mapa aos marcadores.
              Se não houver marcadores, o mapa permanecerá no initialCenter/Zoom 
              ou no centro/zoom do primeiro marcador se a lógica acima em MapContainer for usada.
            */}
            <FitBoundsToMarkers markers={markersData} />
        </MapContainer>
    );
};

export default EonetEventMap;