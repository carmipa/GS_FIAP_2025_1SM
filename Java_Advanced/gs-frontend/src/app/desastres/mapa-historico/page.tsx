'use client';

import React, { useState, FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { buscarEventosNasaProximos } from '@/lib/apiService';
import type { NasaEonetEventDTO, NasaEonetGeometryDTO } from '@/lib/types';
import type { EventMapMarkerData } from '@/components/EonetEventMap';

const DynamicEonetEventMap = dynamic(() => import('@/components/EonetEventMap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full bg-slate-100/80 rounded-md" style={{ minHeight: '400px' }}>
            <p className="text-center text-slate-600 py-4 text-lg">Carregando mapa...</p>
        </div>
    ),
});

const getCoordinatesFromEvent = (geometry: NasaEonetGeometryDTO[] | undefined): [number, number] | null => {
    if (!geometry || geometry.length === 0) return null;
    const pointGeometry = geometry.find(geom => geom.type === "Point");
    if (pointGeometry && Array.isArray(pointGeometry.coordinates) && pointGeometry.coordinates.length === 2) {
        return [pointGeometry.coordinates[1] as number, pointGeometry.coordinates[0] as number];
    }
    const firstGeom = geometry[0];
    if (firstGeom && Array.isArray(firstGeom.coordinates)) {
        if (
            firstGeom.type === "Polygon" &&
            Array.isArray(firstGeom.coordinates[0]) &&
            Array.isArray(firstGeom.coordinates[0][0]) &&
            firstGeom.coordinates[0][0].length === 2
        ) {
            return [firstGeom.coordinates[0][0][1] as number, firstGeom.coordinates[0][0][0] as number];
        }
    }
    return null;
};

const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
        });
    } catch {
        return 'Data inválida';
    }
};

const periodOptions = [
    { label: 'Últimos 7 dias', value: 7 },
    { label: 'Últimos 30 dias', value: 30 },
    { label: 'Últimos 90 dias (3 meses)', value: 90 },
    { label: 'Últimos 180 dias (6 meses)', value: 180 },
    { label: 'Último Ano (365 dias)', value: 365 },
    { label: 'Últimos 2 Anos', value: 365 * 2 },
    { label: 'Últimos 5 Anos', value: 365 * 5 },
    { label: 'Últimos 10 Anos (Limite Real Aprox.)', value: 365 * 10 }
];

const categoriasTraduzidas = [
    { id: "", nome: "Todos os Tipos" },
    { id: "drought", nome: "Seca" },
    { id: "dustHaze", nome: "Poeira e Névoa Seca" },
    { id: "earthquakes", nome: "Terremotos" },
    { id: "floods", nome: "Inundações" },
    { id: "landslides", nome: "Deslizamentos de Terra" },
    { id: "manmade", nome: "Eventos Causados pelo Homem" },
    { id: "seaLakeIce", nome: "Gelo Marinho e de Lagos" },
    { id: "severeStorms", nome: "Tempestades Severas" },
    { id: "snow", nome: "Neve Intensa" },
    // { id: "spaceDebris", nome: "Detritos Espaciais" },
    { id: "tempExtremes", nome: "Temperaturas Extremas" },
    // { id: "tropicalCyclones", nome: "Ciclones Tropicais" },
    { id: "volcanoes", nome: "Vulcões" },
    { id: "waterColor", nome: "Alterações na Cor da Água" },
    { id: "wildfires", nome: "Incêndios Florestais" },
];

export default function MapaHistoricoPage() {
    const [markers, setMarkers] = useState<EventMapMarkerData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>("Selecione os filtros e clique em buscar para ver os eventos históricos.");

    const [selectedPeriodDays, setSelectedPeriodDays] = useState<number>(365);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [eventSearchLimit, setEventSearchLimit] = useState<number>(200);

    const initialMapCenter: [number, number] = [0, 0];
    const initialMapZoom: number = 2;

    const handleBuscarEventosHistoricos = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const categoriaNome = categoriasTraduzidas.find(c => c.id === selectedCategoryId)?.nome || 'Todos os Tipos';
        setInfoMessage(`Buscando eventos históricos (Período: ${periodOptions.find(p => p.value === selectedPeriodDays)?.label || selectedPeriodDays + ' dias'}, Categoria: ${categoriaNome})...`);
        setMarkers([]);

        try {
            // Correção: só envia categoryId se realmente for uma categoria
            const isTodosTipos = !selectedCategoryId || selectedCategoryId === '' || selectedCategoryId === 'all' || selectedCategoryId === 'todos';
            const eventos: NasaEonetEventDTO[] = await buscarEventosNasaProximos(
                undefined,
                undefined,
                undefined,
                eventSearchLimit,
                selectedPeriodDays,
                "all",
                undefined,
                undefined,
                undefined,
                isTodosTipos ? undefined : selectedCategoryId
            );

            if (!eventos || eventos.length === 0) {
                setInfoMessage("Nenhum evento histórico encontrado para os filtros selecionados.");
                setLoading(false);
                return;
            }

            const newMarkers: EventMapMarkerData[] = eventos
                .map(evento => {
                    const coords = getCoordinatesFromEvent(evento.geometry);
                    if (!coords) return null;
                    return {
                        id: evento.id,
                        position: coords,
                        popupText: `<strong>${evento.title || 'Evento EONET'}</strong><br/>Data: ${formatDate(evento.geometry?.[0]?.date)}<br/>Categoria: ${evento.categories?.map(c => c.title).join(', ') || 'N/A'}`
                    };
                })
                .filter(Boolean) as EventMapMarkerData[];

            setMarkers(newMarkers);

            setInfoMessage(
                newMarkers.length > 0
                    ? `${newMarkers.length} evento(s) histórico(s) encontrado(s).`
                    : "Eventos foram encontrados, mas nenhum possui coordenadas válidas para exibição no mapa."
            );

        } catch (err) {
            console.error("Erro ao buscar eventos históricos:", err);
            setError("Falha ao buscar eventos históricos: " + (err instanceof Error ? err.message : String(err)));
            setInfoMessage(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container_mapa_historico_page" style={{ paddingBottom: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1.8em' }}>history</span>
                Mapa Interativo de Desastres Históricos (NASA API)
            </h1>

            <form onSubmit={handleBuscarEventosHistoricos} className="form-container" style={{ maxWidth: '800px', margin: '0 auto 30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                        <label htmlFor="periodSelect" style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Período:</label>
                        <select id="periodSelect" value={selectedPeriodDays} onChange={e => setSelectedPeriodDays(Number(e.target.value))} disabled={loading} style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}}>
                            {periodOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                        <label htmlFor="categorySelect" style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Tipo de Desastre:</label>
                        <select id="categorySelect" value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} disabled={loading} style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}}>
                            {categoriasTraduzidas.map(cat => (<option key={cat.id} value={cat.id}>{cat.nome}</option>))}
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: '1 1 150px' }}>
                        <label htmlFor="eventLimitInput" style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Limite de Eventos:</label>
                        <input type="number" id="eventLimitInput" value={eventSearchLimit} min={1} max={1000} onChange={e => setEventSearchLimit(Number(e.target.value))} disabled={loading} style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}} />
                    </div>
                </div>
                <button type="submit" className="button button-primary" disabled={loading} style={{ marginTop: '20px', width: '100%', padding: '12px' }}>
                    {loading ? 'Buscando Eventos...' : 'Buscar Eventos Históricos'}
                </button>
            </form>

            {loading && <p className="message info" style={{ textAlign: 'center' }}>Buscando dados...</p>}
            {error && <p className="message error" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {infoMessage && !error && <p className="message info" style={{ textAlign: 'center', color: '#555' }}>{infoMessage}</p>}

            <div style={{ height: '70vh', marginTop: '20px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                <DynamicEonetEventMap initialCenter={initialMapCenter} initialZoom={initialMapZoom} markersData={markers} />
            </div>
        </div>
    );
}
