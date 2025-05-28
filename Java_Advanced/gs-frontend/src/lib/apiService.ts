// src/lib/apiService.ts
import type {
    ClienteRequestDTO, ClienteResponseDTO,
    ContatoRequestDTO, ContatoResponseDTO,
    EnderecoRequestDTO, EnderecoResponseDTO,
    EnderecoGeoRequestDTO, GeoCoordinatesDTO,
    NominatimResultDTO, // Nome atualizado para NominatimResultDTO
    ViaCepResponseDTO, ApiErrorResponse, Page
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorData: ApiErrorResponse;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = {
                message: response.statusText || "Erro desconhecido na resposta da API.",
                status: response.status,
                timestamp: new Date().toISOString(),
            };
        }

        let errorMessage = errorData.message || response.statusText || "Erro desconhecido";
        // Ajuste para pegar 'messages' do GlobalExceptionHandler para erros de validação
        const detailsArray = errorData.messages || (typeof errorData.details === 'string' ? [errorData.details] : errorData.details);
        if (detailsArray && detailsArray.length > 0) {
            errorMessage += `. Detalhes: ${detailsArray.join(', ')}`;
        }

        console.error("API Error:", errorMessage, "Status:", response.status, "Full Error Data:", errorData);
        throw new Error(errorMessage);
    }
    if (response.status === 204) {
        return null as T;
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json() as T;
    } else {
        // Se não for JSON, mas a resposta foi OK (ex: 200 sem corpo, o que não deveria acontecer para GETs que esperam corpo)
        // ou para DELETE que retorna 204 (já tratado)
        // Para outros casos, pode retornar o texto ou tratar como erro se JSON era esperado.
        // Aqui, vamos assumir que se não for 204 e não for JSON, algo está inesperado para GETs que esperam JSON.
        // Para chamadas que não esperam corpo JSON (além de 204), esta lógica pode precisar de ajuste.
        console.warn("Resposta não JSON recebida:", response);
        return null as T; // Ou lançar um erro se um corpo JSON era estritamente esperado.
    }
}

// --- Cliente API ---
export async function listarClientes(page: number = 0, size: number = 10): Promise<Page<ClienteResponseDTO>> {
    const response = await fetch(`${API_BASE_URL}/clientes?page=${page}&size=${size}&sort=nome,asc`);
    return handleResponse<Page<ClienteResponseDTO>>(response);
}

export async function buscarClientePorId(id: number): Promise<ClienteResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
    return handleResponse<ClienteResponseDTO>(response);
}

export async function buscarClientePorDocumento(documento: string): Promise<ClienteResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/clientes/documento/${documento}`);
    return handleResponse<ClienteResponseDTO>(response);
}

// criarCliente e atualizarCliente agora esperam ClienteRequestDTO com contatosIds e enderecosIds
export async function criarCliente(data: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<ClienteResponseDTO>(response);
}

export async function atualizarCliente(id: number, data: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<ClienteResponseDTO>(response);
}

export async function deletarCliente(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, { method: 'DELETE' });
    await handleResponse<void>(response);
}

// --- Contato API (Endpoints para criar/gerenciar contatos independentemente) ---
export async function criarContatoSozinho(data: ContatoRequestDTO): Promise<ContatoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/contatos`, { // Supondo que /api/contatos existe
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<ContatoResponseDTO>(response);
}
// Adicionar listarContatos, buscarContatoPorId, atualizarContatoSozinho, deletarContatoSozinho se necessário

// --- Endereco API ---
export async function consultarCepPelaApi(cep: string): Promise<ViaCepResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/enderecos/consultar-cep/${cep.replace(/\D/g, '')}`);
    return handleResponse<ViaCepResponseDTO>(response);
}

export async function calcularCoordenadasPelaApi(data: EnderecoGeoRequestDTO): Promise<GeoCoordinatesDTO> {
    const response = await fetch(`${API_BASE_URL}/enderecos/calcular-coordenadas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<GeoCoordinatesDTO>(response);
}

// Endpoints para criar/gerenciar endereços independentemente
export async function criarEnderecoSozinho(data: EnderecoRequestDTO): Promise<EnderecoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/enderecos`, { // Supondo que /api/enderecos (POST) existe
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<EnderecoResponseDTO>(response);
}
// Adicionar listarEnderecos, buscarEnderecoPorId, atualizarEnderecoSozinho, deletarEnderecoSozinho se necessário

// --- Eonet API (para dados locais) ---
export async function listarEventosEonet(page: number = 0, size: number = 10): Promise<Page<EonetResponseDTO>> {
    const response = await fetch(`${API_BASE_URL}/eonet?page=${page}&size=${size}&sort=data,desc`);
    return handleResponse<Page<EonetResponseDTO>>(response);
}

export async function sincronizarNasaEonet(limit?: number, days?: number, status?: string, source?: string): Promise<EonetResponseDTO[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (days) params.append('days', String(days));
    if (status) params.append('status', status);
    if (source) params.append('source', source);

    const response = await fetch(`${API_BASE_URL}/eonet/nasa/sincronizar?${params.toString()}`, {
        method: 'POST',
    });
    return handleResponse<EonetResponseDTO[]>(response);
}