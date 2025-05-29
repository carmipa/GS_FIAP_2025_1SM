// src/app/desastres/mapa/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { listarEventosEonet } from '@/lib/apiService';
import type { EonetResponseDTO, NasaEonetEventDTO, NasaEonetGeometryDTO, Page } from '@/lib/types';
// Importar a interface de marcador do novo componente
import type { EventMapMarkerData } from '@/components/EonetEventMap';

// Carregar dinamicamente o NOVO componente de mapa
const DynamicEonetEventMap = dynamic(() => import('@/components/EonetEventMap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full bg-slate-100/80 rounded-md" style={{minHeight: '400px'}}>
            <p className="text-center text-slate-600 py-4 text-lg">Carregando mapa de eventos...</p>
        </div>
    ),
});

const parseEonetEventJson = (jsonString: string): Partial<NasaEonetEventDTO> | null => {
    try {
        return JSON.parse(jsonString) as Partial<NasaEonetEventDTO>;
    } catch (error) {
        console.error("Erro ao parsear JSON do evento EONET:", error, jsonString);
        return null;
    }
};

const getCoordinatesFromEvent = (geometries: NasaEonetGeometryDTO[] | undefined): [number, number] | null => {
    if (!geometries || geometries.length === 0) {
        return null;
    }
    const pointGeometry = geometries.find(geom => geom.type === "Point");
    if (pointGeometry && Array.isArray(pointGeometry.coordinates) && pointGeometry.coordinates.length === 2) {
        return [pointGeometry.coordinates[1] as number, pointGeometry.coordinates[0] as number];
    }
    const firstGeom = geometries[0];
    if (firstGeom && Array.isArray(firstGeom.coordinates)) {
        if (firstGeom.type === "Polygon" && Array.isArray(firstGeom.coordinates[0]) && Array.isArray(firstGeom.coordinates[0][0])) {
            return [firstGeom.coordinates[0][0][1] as number, firstGeom.coordinates[0][0][0] as number];
        }
    }
    return null;
};

export default function MapaDeEventosPage() {
    const [markers, setMarkers] = useState<EventMapMarkerData[]>([]); // Usar EventMapMarkerData
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const initialMapCenter: [number, number] = [-14.235004, -51.92528];
    const initialMapZoom: number = 4;

    useEffect(() => {
        const fetchEventsAndCreateMarkers = async () => {
            setLoading(true);
            setError(null);
            setMarkers([]);
            try {
                const eventosPage: Page<EonetResponseDTO> = await listarEventosEonet(0, 50);
                const newMarkers: EventMapMarkerData[] = [];

                if (eventosPage && eventosPage.content) {
                    for (const eventoResp of eventosPage.content) {
                        const eventoDetalhes = eventoResp.json ? parseEonetEventJson(eventoResp.json) : null;
                        if (eventoDetalhes && eventoDetalhes.geometries) {
                            const coords = getCoordinatesFromEvent(eventoDetalhes.geometries);
                            if (coords) {
                                newMarkers.push({
                                    id: eventoResp.eonetIdApi || String(eventoResp.idEonet),
                                    position: coords,
                                    popupText: `<strong>${eventoDetalhes.title || 'Evento EONET'}</strong><br/>Data: ${new Date(eventoDetalhes.geometries[0].date).toLocaleDateString('pt-BR')}<br/>Categorias: ${eventoDetalhes.categories?.map(c => c.title).join(', ') || 'N/A'}`,
                                });
                            }
                        }
                    }
                }
                setMarkers(newMarkers);
                if (newMarkers.length === 0) {
                    console.log("Nenhum evento com coordenadas válidas encontrado para exibir no mapa.");
                }
            } catch (err: any) {
                console.error("Erro ao buscar ou processar eventos para o mapa:", err);
                setError(`Falha ao carregar dados para o mapa: ${err.message || 'Erro desconhecido'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchEventsAndCreateMarkers();
    }, []);

    return (
        <div className="container_mapa_eventos_page" style={{paddingBottom: '20px'}}>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1.8em' }}>public</span>
                Mapa Interativo de Eventos EONET
            </h1>

            {loading && (
                <div className="flex items-center justify-center" style={{minHeight: '400px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>
                    <p className="text-lg text-slate-600">Carregando eventos no mapa...</p>
                </div>
            )}
            {error && !loading && (
                <div className="message error" style={{textAlign: 'center', padding: '20px', border: '1px solid #f5c6cb', borderRadius: '8px'}}>
                    <p>{error}</p>
                    <p style={{marginTop: '10px'}}>Tente sincronizar novos eventos no Painel EONET ou verifique os logs para mais detalhes.</p>
                </div>
            )}

            {!loading && !error && (
                <div style={{ height: '70vh', minHeight: '500px', width: '100%', marginTop: '10px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <DynamicEonetEventMap // Usar o novo componente dinamicamente
                        initialCenter={initialMapCenter}
                        initialZoom={initialMapZoom}
                        markersData={markers}
                    />
                    {markers.length === 0 && !loading && !error && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            textAlign: 'center',
                            zIndex: 1000
                        }}
                             className="text-slate-600 text-lg p-4 rounded-md bg-slate-100 shadow"
                        >
                            Nenhum evento com coordenadas válidas encontrado para exibir no mapa no momento.
                            <br />Tente sincronizar eventos no "Painel EONET".
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}