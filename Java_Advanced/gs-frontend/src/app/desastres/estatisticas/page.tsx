// src/app/desastres/estatisticas/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  TooltipItem,
} from 'chart.js';
import { getEonetCategoryStats } from '@/lib/apiService';
import type { CategoryCountDTO } from '@/lib/types';

//
// 1) Registrando todos os componentes do Chart.js que vamos usar
//
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

//
//
// 2) Tipagem interna para a dataset que o Chart.js espera
//
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[]; // **CERTIFIQUE-SE** de usar array aqui
  borderColor: string[];
  borderWidth: number;
  offset?: number[]; 
}

interface ChartDataState {
  labels: string[];
  datasets: ChartDataset[];
}

// Tipo genérico para o contexto de tooltip (ajustado para diferentes gráficos)
type GeneralChartTooltipContext = TooltipItem<'pie'> | TooltipItem<'doughnut'> | TooltipItem<'polarArea'> | TooltipItem<'bar'>;

//
//
// 3) Opções de período (sem alterações)
//
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
  { label: 'Máximo Histórico (ex: 50 Anos)', value: 365 * 50 },
];

//
//
// 4) Paleta fixa de cores (suficiente para até 10 categorias, e vai reciclando
//    caso haja mais categorias do que cores definidas)
//
const fixedColors = [
  'rgba(255, 99, 132, 0.7)',    // vermelho
  'rgba(54, 162, 235, 0.7)',    // azul
  'rgba(255, 206, 86, 0.7)',    // amarelo
  'rgba(75, 192, 192, 0.7)',    // verde-água
  'rgba(153, 102, 255, 0.7)',   // roxo
  'rgba(255, 159, 64, 0.7)',    // laranja
  'rgba(199, 199, 199, 0.7)',   // cinza-claro
  'rgba(83, 102, 89, 0.7)',     // marrom-acinzentado
  'rgba(140, 160, 175, 0.7)',   // azul-pastel
  'rgba(220, 130, 80, 0.7)',    // bronzeado
];

const generateChartColors = (numColors: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(fixedColors[i % fixedColors.length]);
  }
  return colors;
};

//
//
// 5) Definição de quais abas de gráfico existem
//
type ActiveGraphTab = 'barrasVerticais' | 'barrasHorizontais' | 'pizza' | 'doughnut' | 'polarArea';

export default function EstatisticasDesastresPage() {
  // Dados brutos vindos da API: um array de { categoryTitle, count }
  const [rawStatsData, setRawStatsData] = useState<CategoryCountDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriodDays, setSelectedPeriodDays] = useState<number>(365);
  const [activeGraphTab, setActiveGraphTab] = useState<ActiveGraphTab>('barrasVerticais');

  //
  // Quando o usuário muda o período, recarrega da API
  //
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      setRawStatsData([]);

      try {
        const data: CategoryCountDTO[] = await getEonetCategoryStats(selectedPeriodDays);
        if (data && data.length > 0) {
          setRawStatsData(data);
        } else {
          const chosenLabel = periodOptions.find((p) => p.value === selectedPeriodDays)?.label || `${selectedPeriodDays} dias`;
          setError(
            `Nenhuma estatística encontrada para o período: ${chosenLabel}. Verifique se há eventos locais sincronizados.`
          );
        }
      } catch (err: unknown) {
        console.error('Erro ao buscar estatísticas:', err);
        let msg = 'Falha ao carregar estatísticas.';
        if (err instanceof Error && err.message) {
          msg = err.message;
        } else if (typeof err === 'string') {
          msg = err;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedPeriodDays]);

  //
  // 6) Montando o objeto `chartData` que o Chart.js espera
  //
  const chartData = useMemo<ChartDataState | null>(() => {
    if (!rawStatsData || rawStatsData.length === 0) return null;

    // Extrai rótulos
    const labels = rawStatsData.map((item) => item.categoryTitle);
    // Extrai quantidades
    const counts  = rawStatsData.map((item) => item.count);

    // Gera um array de cores para cada categoria
    const backgroundColors = generateChartColors(labels.length);
    // Borda um pouco mais escura (troca a opacidade)
    const borderColors = backgroundColors.map((color) => color.replace(/0\.7\)$/, '1)'));

    // Para um pequeno deslocamento nas fatias menores:
    const totalCount = counts.reduce((soma, atual) => soma + atual, 0);
    const offsets = counts.map(
      (c) => (c > 0 && totalCount > 0 && c < totalCount * 0.05 ? 20 : 0)
    );

    return {
      labels,
      datasets: [
        {
          label: 'Nº de Eventos por Categoria',
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          offset: offsets,
        },
      ],
    };
  }, [rawStatsData]);

  //
  // Título base que varia conforme o período selecionado
  //
  const baseTitle = `Eventos por Categoria (${periodOptions.find((p) => p.value === selectedPeriodDays)?.label ||
    selectedPeriodDays + ' dias'})`;

  //
  // 7) Função genérica de tooltip (usada em Pizza, Doughnut e PolarArea)
  //
  const generalTooltipCallback = (context: GeneralChartTooltipContext) => {
    const label = context.label || context.dataset.label || '';
    let value = 0;

    // Extrair corretamente o valor de acordo com o tipo de gráfico
    if (typeof context.parsed === 'number') {
      // Pie e Doughnut: "parsed" é o próprio valor
      value = context.parsed;
    } else if (context.parsed && (context.parsed as any).r !== undefined) {
      // PolarArea
      value = (context.parsed as any).r;
    } else if (context.parsed && (context.parsed as any).y !== undefined) {
      // Bar vertical (se fosse usado aqui)
      value = (context.parsed as any).y;
    } else if (context.parsed && (context.parsed as any).x !== undefined) {
      // Bar horizontal (se fosse usado aqui)
      value = (context.parsed as any).x;
    }

    // Calcula % do total
    let sum = 0;
    const ds = context.chart.data.datasets[context.datasetIndex].data as number[];
    if (Array.isArray(ds)) {
      sum = ds.reduce((a, b) => a + b, 0);
    }
    const pct = sum > 0 ? ((value / sum) * 100).toFixed(1) + '%' : '0%';

    return `${label}: ${value.toLocaleString()} (${pct})`;
  };

  //
  // 8) Opções para cada tipo de gráfico
  //
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: { display: true, text: `${baseTitle} - Escala Logarítmica`, font: { size: 16 } },
      tooltip: {
        callbacks: {
          // Tipagem correta para Bar
          label: (context: TooltipItem<'bar'>) => {
            const valor = context.parsed?.y ?? 0;
            return `${context.dataset.label || ''}: ${Number(valor).toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: 'logarithmic' as const,
        beginAtZero: false,
        min: 0.1,
        title: { display: true, text: 'Número de Eventos (Escala Logarítmica)' },
      },
      x: {
        title: { display: true, text: 'Categorias de Eventos' },
      },
    },
  };

  const horizontalBarChartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: { display: true, text: `${baseTitle} - Barras Horizontais (Escala Log)`, font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const valor = context.parsed?.x ?? 0;
            return `${context.dataset.label || ''}: ${Number(valor).toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'logarithmic' as const,
        beginAtZero: false,
        min: 0.1,
        title: { display: true, text: 'Número de Eventos (Escala Logarítmica)' },
      },
      y: {
        title: { display: true, text: 'Categorias de Eventos' },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: { display: true, text: `Distribuição ${baseTitle}`, font: { size: 16 } },
      tooltip: { callbacks: { label: generalTooltipCallback } },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: { display: true, text: `Distribuição ${baseTitle} (Rosca)`, font: { size: 16 } },
      tooltip: { callbacks: { label: generalTooltipCallback } },
    },
  };

  const polarAreaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: { display: true, text: `Comparativo ${baseTitle} (Área Polar)`, font: { size: 16 } },
      tooltip: { callbacks: { label: generalTooltipCallback } },
    },
    scales: {
      r: { beginAtZero: true },
    },
  };

  //
  // 9) Estilo inline para os botões de aba
  //
  const tabButtonStyle = (tabKey: ActiveGraphTab): React.CSSProperties => ({
    padding: '8px 16px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderBottomColor: activeGraphTab === tabKey ? '#fff' : '#ccc',
    backgroundColor: activeGraphTab === tabKey ? '#fff' : '#f3f3f3',
    fontWeight: activeGraphTab === tabKey ? 600 : 500,
    marginRight: '4px',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    color: activeGraphTab === tabKey ? '#000' : '#333',
    position: 'relative',
    bottom: '-1px',
    zIndex: activeGraphTab === tabKey ? 2 : 1,
  });

  return (
    <div className="container estatisticas-page" style={{ paddingBottom: '20px' }}>
      <h1
        className="page-title"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        <span className="material-icons-outlined" style={{ fontSize: '1.8em' }}>
          leaderboard
        </span>
        Estatísticas de Desastres EONET (Locais)
      </h1>

      {/* 10) Select de período */}
      <div className="form-container" style={{ maxWidth: '380px', margin: '0 auto 28px auto' }}>
        <div className="form-group">
          <label
            htmlFor="periodSelect"
            style={{ fontWeight: 500, display: 'block', marginBottom: '5px' }}
          >
            Selecione o Período:
          </label>
          <select
            id="periodSelect"
            value={selectedPeriodDays}
            onChange={(e) => setSelectedPeriodDays(Number(e.target.value))}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 11) Abas de navegação de gráfico */}
      <div style={{ marginBottom: '0', borderBottom: '1px solid #ccc' }}>
        <button style={tabButtonStyle('barrasVerticais')} onClick={() => setActiveGraphTab('barrasVerticais')}>
          <span
            className="material-icons-outlined"
            style={{ fontSize: '1.1em', marginRight: '4px' }}
          >
            bar_chart
          </span>
          Barras Verticais
        </button>
        <button
          style={tabButtonStyle('barrasHorizontais')}
          onClick={() => setActiveGraphTab('barrasHorizontais')}
        >
          <span
            className="material-icons-outlined"
            style={{ fontSize: '1.1em', marginRight: '4px', transform: 'rotate(90deg)' }}
          >
            bar_chart
          </span>
          Barras Horizontais
        </button>
        <button style={tabButtonStyle('pizza')} onClick={() => setActiveGraphTab('pizza')}>
          <span className="material-icons-outlined" style={{ fontSize: '1.1em', marginRight: '4px' }}>
            pie_chart
          </span>
          Pizza
        </button>
        <button style={tabButtonStyle('doughnut')} onClick={() => setActiveGraphTab('doughnut')}>
          <span
            className="material-icons-outlined"
            style={{ fontSize: '1.1em', marginRight: '4px' }}
          >
            donut_small
          </span>
          Rosca
        </button>
        <button style={tabButtonStyle('polarArea')} onClick={() => setActiveGraphTab('polarArea')}>
          <span
            className="material-icons-outlined"
            style={{ fontSize: '1.1em', marginRight: '4px' }}
          >
            flare
          </span>
          Área Polar
        </button>
      </div>

      {/* 12) Painel onde o gráfico é renderizado */}
      <div
        style={{
          border: '1px solid #ccc',
          borderTop: 'none',
          padding: '16px',
          borderRadius: '0 0 6px 6px',
          backgroundColor: '#fff',
          minHeight: '480px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        {loading && (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: '400px' }}
          >
            <p className="text-lg text-slate-600">Carregando estatísticas...</p>
          </div>
        )}

        {!loading && error && (
          <div className="message error" style={{ textAlign: 'center', padding: '20px' }}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && chartData && (
          <div
            style={{
              height: '65vh',
              minHeight: '420px',
              position: 'relative',
              marginTop: '12px',
            }}
          >
            {activeGraphTab === 'barrasVerticais' && (
              <Bar options={barChartOptions} data={chartData} />
            )}
            {activeGraphTab === 'barrasHorizontais' && (
              <Bar options={horizontalBarChartOptions} data={chartData} />
            )}
            {activeGraphTab === 'pizza' && <Pie options={pieChartOptions} data={chartData} />}
            {activeGraphTab === 'doughnut' && (
              <Doughnut options={doughnutChartOptions} data={chartData} />
            )}
            {activeGraphTab === 'polarArea' && (
              <PolarArea options={polarAreaChartOptions} data={chartData} />
            )}
          </div>
        )}

        {!loading && !error && !chartData && (
          <div
            className="message info"
            style={{ textAlign: 'center', padding: '20px' }}
          >
            <p>
              Nenhum dado disponível para este período. Certifique‐se de ter
              sincronizado eventos locais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
