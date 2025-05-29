// src/app/desastres/mapa/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { listarEventosEonet } from '@/lib/apiService';
import type { EonetResponseDTO, NasaEonetEventDTO, NasaEonetGeometryDTO, Page } from '@/lib/types';

// Carregamento Dinâmico do Componente do Mapa
const DynamicLeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full bg-slate-700/50 rounded-md">
            <p className="text-center text-slate-300 py-4">Carregando mapa de eventos...</p>
        </div>
    ),
});

// Interface para os marcadores do mapa
interface MapMarker {
    position: [number, number]; // [latitude, longitude]
    popupText: string;
    id: string; // Usar eonetIdApi ou idEonet como chave
}

// Função auxiliar para parsear o JSON do evento de forma segura
const parseEonetEventJson = (jsonString: string): Partial<NasaEonetEventDTO> | null => {
    try {
        return JSON.parse(jsonString) as Partial<NasaEonetEventDTO>;
    } catch (error) {
        console.error("Erro ao parsear JSON do evento EONET:", error, jsonString);
        return null;
    }
};

// Função para extrair coordenadas da geometria
// Prioriza o primeiro ponto da primeira geometria
const getCoordinatesFromEvent = (geometries: NasaEonetGeometryDTO[] | undefined): [number, number] | null => {
    if (!geometries || geometries.length === 0) {
        return null;
    }
    // Tenta encontrar a primeira geometria do tipo 'Point'
    const pointGeometry = geometries.find(geom => geom.type === "Point");
    if (pointGeometry && Array.isArray(pointGeometry.coordinates) && pointGeometry.coordinates.length === 2) {
        // EONET geralmente armazena como [longitude, latitude] para Points
        return [pointGeometry.coordinates[1] as number, pointGeometry.coordinates[0] as number];
    }
    // Se não houver Point, tenta pegar as coordenadas da primeira geometria (pode ser o centro de um polígono, etc.)
    // Isso é uma simplificação e pode precisar de ajustes dependendo dos tipos de geometria
    const firstGeom = geometries[0];
    if (firstGeom && Array.isArray(firstGeom.coordinates)) {
        if (firstGeom.type === "Polygon" && Array.isArray(firstGeom.coordinates[0]) && Array.isArray(firstGeom.coordinates[0][0])) {
            // Para polígono, pega o primeiro ponto do primeiro anel
            // EONET geralmente armazena como [longitude, latitude]
            return [firstGeom.coordinates[0][0][1] as number, firstGeom.coordinates[0][0][0] as number];
        }
        // Adicione mais lógicas para outros tipos de geometria se necessário
    }
    return null;
};


export default function MapaDeEventosPage() {
    const [markers, setMarkers] = useState<MapMarker[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Posição central inicial do mapa (ex: Brasil) e zoom
    const initialMapPosition: [number, number] = [-14.235004, -51.92528]; // Centro do Brasil
    const initialMapZoom: number = 4;

    useEffect(() => {
        const fetchEventsAndCreateMarkers = async () => {
            setLoading(true);
            setError(null);
            try {
                // Buscar um número maior de eventos para o mapa, ex: 50 eventos mais recentes
                const eventosPage: Page<EonetResponseDTO> = await listarEventosEonet(0, 50);
                const newMarkers: MapMarker[] = [];

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
                    setError("Nenhum evento com coordenadas válidas encontrado para exibir no mapa.");
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
        <div className="container_mapa_eventos_page" style={{paddingBottom: '20px'}}> {/* Adicionado padding inferior */}
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1.8em' }}>public</span>
                Mapa Interativo de Eventos EONET
            </h1>

            {loading && (
                <div className="flex items-center justify-center" style={{minHeight: '400px'}}>
                    <p className="text-lg">Carregando eventos no mapa...</p>
                </div>
            )}
            {error && !loading && <p className="message error" style={{textAlign: 'center'}}>{error}</p>}

            {!loading && !error && (
                <div style={{ height: '70vh', minHeight: '500px', width: '100%', marginTop: '10px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <DynamicLeafletMap
                        position={initialMapPosition}
                        zoom={initialMapZoom}
                        // A prop 'markers' não existe no seu componente LeafletMap atual.
                        // Você precisará modificar LeafletMap.tsx para aceitar e renderizar uma lista de marcadores.
                        // Por agora, o mapa será centralizado, mas sem os marcadores de evento.
                        // markersData={markers} // Exemplo de como você passaria os dados
                    />
                    {markers.length === 0 && !loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                            <p className="text-slate-600 text-lg p-4 rounded-md bg-slate-100 shadow">Nenhum marcador de evento para exibir no mapa.</p>
                        </div>
                    )}
                </div>
            )}
            {/* Renderização dos marcadores precisa ser feita dentro do DynamicLeafletMap */}
            {/* A lógica abaixo é um exemplo de como você poderia passar os marcadores,
           MAS o componente DynamicLeafletMap precisa ser modificado para aceitar e renderizar 'markersData' */}
            {/* {!loading && !error && markers.length > 0 && (
        <div style={{ height: '70vh', minHeight: '500px', width: '100%', marginTop: '10px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <DynamicLeafletMap
                // O componente LeafletMap precisa ser atualizado para aceitar uma lista de marcadores
                // Exemplo: markersData={markers}
                // E dentro de LeafletMap, iterar sobre markersData para criar <Marker>
                position={markers[0]?.position || initialMapPosition} // Centraliza no primeiro marcador ou na posição inicial
                zoom={markers.length > 0 ? 6 : initialMapZoom}
            />
        </div>
      )}
      */}
        </div>
    );
}
