// src/app/desastres/estatisticas/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { getEonetCategoryStats } from '@/lib/apiService';
import type { CategoryCountDTO } from '@/lib/types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    borderWidth: number;
}

interface ChartDataState {
    labels: string[];
    datasets: ChartDataset[];
}

// Lista de opções de período expandida
const periodOptions = [
    { label: 'Últimos 30 dias', value: 30 },
    { label: 'Últimos 60 dias', value: 60 },
    { label: 'Últimos 90 dias', value: 90 },
    { label: 'Últimos 120 dias', value: 120 },
    { label: 'Últimos 180 dias (6 meses)', value: 180 },
    { label: 'Últimos 240 dias (8 meses)', value: 240 },
    { label: 'Últimos 360 dias (aprox. 1 ano)', value: 360 },
    { label: 'Último Ano (365 dias)', value: 365 },
    { label: 'Últimos 2 Anos', value: 365 * 2 },
    { label: 'Últimos 5 Anos', value: 365 * 5 },
    { label: 'Últimos 10 Anos', value: 365 * 10 },
    { label: 'Últimos 15 Anos', value: 365 * 15 },
    { label: 'Últimos 20 Anos', value: 365 * 20 },
    { label: 'Últimos 25 Anos', value: 365 * 25 },
    { label: 'Últimos 30 Anos', value: 365 * 30 },
    { label: 'Últimos 35 Anos', value: 365 * 35 },
    { label: 'Últimos 40 Anos', value: 365 * 40 },
    { label: 'Máximo Histórico (ex: 50 Anos)', value: 365 * 50 } // Representa "o máximo que a API permitir"
];

// Cores constantes para os gráficos (mantido como no seu original)
const ثابتColors = [
    'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
    'rgba(199, 199, 199, 0.7)', 'rgba(83, 102, 89, 0.7)',
    'rgba(140, 160, 175, 0.7)', 'rgba(220, 130, 80, 0.7)'
];
const generateChartColors = (numColors: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < numColors; i++) {
        colors.push(ثابتColors[i % ثابتColors.length]);
    }
    return colors;
};

type ActiveGraphTab = 'barras' | 'pizza';

export default function EstatisticasDesastresPage() {
    const [rawStatsData, setRawStatsData] = useState<CategoryCountDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriodDays, setSelectedPeriodDays] = useState<number>(365); // Padrão para "Último Ano"
    const [activeGraphTab, setActiveGraphTab] = useState<ActiveGraphTab>('barras');

    useEffect(() => {
        const fetchStats = async () => {
            if (!selectedPeriodDays) return;

            setLoading(true);
            setError(null);
            setRawStatsData([]);
            try {
                const data: CategoryCountDTO[] = await getEonetCategoryStats(selectedPeriodDays);

                if (data && data.length > 0) {
                    setRawStatsData(data);
                } else {
                    // Mensagem de erro ajustada para usar a label do período
                    const selectedLabel = periodOptions.find(p => p.value === selectedPeriodDays)?.label || `${selectedPeriodDays} dias`;
                    setError(`Nenhuma estatística de categoria encontrada para o período: ${selectedLabel}. Verifique se há eventos locais sincronizados nesse período.`);
                }
            } catch (err: any) {
                console.error("Erro ao buscar estatísticas:", err);
                setError(`Falha ao carregar estatísticas: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [selectedPeriodDays]);

    const chartData = useMemo((): ChartDataState | null => {
        if (!rawStatsData || rawStatsData.length === 0) return null;

        const labels = rawStatsData.map(item => item.categoryTitle);
        const counts = rawStatsData.map(item => item.count);
        const backgroundColors = generateChartColors(labels.length);
        const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

        return {
            labels,
            datasets: [
                {
                    label: `Nº de Eventos por Categoria`,
                    data: counts,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                },
            ],
        };
    }, [rawStatsData]);

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' as const },
            title: { display: true, text: `Eventos por Categoria (${periodOptions.find(p=>p.value === selectedPeriodDays)?.label || selectedPeriodDays + ' dias'})`, font: { size: 16 }},
            tooltip: { callbacks: { label: (context: any) => `${context.dataset.label || ''}: ${context.parsed.y}` }}
        },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 }, title: { display: true, text: 'Número de Eventos' }}, x: { title: { display: true, text: 'Categorias de Eventos' }}}
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' as const },
            title: { display: true, text: `Distribuição de Eventos por Categoria (${periodOptions.find(p=>p.value === selectedPeriodDays)?.label || selectedPeriodDays + ' dias'})`, font: { size: 16 }},
            tooltip: { callbacks: { label: (context: any) => `${context.label}: ${context.parsed}` }}
        }
    };

    const tabButtonStyle = (tabKey: ActiveGraphTab): React.CSSProperties => ({
        padding: '10px 15px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderBottom: '1px solid ' + (activeGraphTab === tabKey ? '#fff' : '#ccc'),
        backgroundColor: activeGraphTab === tabKey ? '#fff' : '#f0f0f0',
        fontWeight: activeGraphTab === tabKey ? '600' : 'normal',
        marginRight: '5px',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        position: 'relative',
        bottom: activeGraphTab === tabKey ? '-1px' : '0',
        color: activeGraphTab === tabKey ? '#0056b3' : '#333',
    });

    return (
        <div className="container estatisticas-page" style={{ paddingBottom: '20px' }}>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                <span className="material-icons-outlined" style={{ fontSize: '1.8em' }}>leaderboard</span>
                Estatísticas de Desastres EONET (Locais)
            </h1>

            <div className="form-container" style={{ maxWidth: '400px', margin: '0 auto 30px auto' }}>
                <div className="form-group">
                    <label htmlFor="periodSelect" style={{ fontWeight: '500', display: 'block', marginBottom: '5px' }}>Selecione o Período:</label>
                    <select
                        id="periodSelect"
                        value={selectedPeriodDays}
                        onChange={(e) => setSelectedPeriodDays(Number(e.target.value))}
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    >
                        {periodOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: '0px', borderBottom: '1px solid #ccc' }}>
                <button style={tabButtonStyle('barras')} onClick={() => setActiveGraphTab('barras')}>
                    <span className="material-icons-outlined" style={{fontSize: '1.2em', marginRight: '5px'}}>bar_chart</span>Gráfico de Barras
                </button>
                <button style={tabButtonStyle('pizza')} onClick={() => setActiveGraphTab('pizza')}>
                    <span className="material-icons-outlined" style={{fontSize: '1.2em', marginRight: '5px'}}>pie_chart</span>Gráfico de Pizza
                </button>
                {/* Futuramente:
                <button style={tabButtonStyle('linhas')} onClick={() => setActiveGraphTab('linhas')}>
                    <span className="material-icons-outlined" style={{fontSize: '1.2em', marginRight: '5px'}}>show_chart</span>Gráfico de Linhas
                </button>
                */}
            </div>

            <div style={{ border: '1px solid #ccc', borderTop: 'none', padding: '20px', borderRadius: '0 0 6px 6px', backgroundColor: '#fff', minHeight: '450px' }}>
                {loading && (
                    <div className="flex items-center justify-center" style={{minHeight: '400px'}}>
                        <p className="text-lg text-slate-600">Carregando estatísticas...</p>
                    </div>
                )}
                {error && !loading && (
                    <div className="message error" style={{textAlign: 'center', padding: '20px'}}>
                        <p>{error}</p>
                    </div>
                )}
                {!loading && !error && chartData && (
                    <div style={{ height: '60vh', minHeight: '400px' }}>
                        {activeGraphTab === 'barras' && <Bar options={barChartOptions as any} data={chartData} />}
                        {activeGraphTab === 'pizza' && <Pie options={pieChartOptions as any} data={chartData} />}
                        {/* Adicionar outros gráficos aqui condicionalmente */}
                    </div>
                )}
                {!loading && !error && !chartData && (
                    <div className="message info" style={{textAlign: 'center', padding: '20px'}}>
                        <p>Selecione um período para visualizar as estatísticas ou aguarde o carregamento inicial.</p>
                    </div>
                )}
            </div>
        </div>
    );
}