// src/lib/apiService.ts
import type {
    ClienteRequestDTO, ClienteResponseDTO,
    ContatoRequestDTO, ContatoResponseDTO,
    EnderecoRequestDTO, EnderecoResponseDTO,
    EnderecoGeoRequestDTO, GeoCoordinatesDTO,
    ViaCepResponseDTO, ApiErrorResponse, Page,
    EonetResponseDTO, NasaEonetEventDTO,
    CategoryCountDTO // <<< Adicionar importação do novo tipo
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function handleResponse<T>(response: Response): Promise<T> {
    // ... (código da função handleResponse - sem alterações)
    if (!response.ok) {
        let errorData: Partial<ApiErrorResponse> = {
            message: `Erro ${response.status}: ${response.statusText || "Falha na requisição à API."}`,
            status: response.status,
            timestamp: new Date().toISOString(),
        };
        let detailedMessages: string[] = [];

        try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const parsedError = await response.json();
                errorData = { ...errorData, ...parsedError };

                if (Array.isArray(parsedError.messages) && parsedError.messages.length > 0) {
                    detailedMessages = parsedError.messages;
                } else if (parsedError.message && typeof parsedError.message === 'string') {
                    detailedMessages.push(parsedError.message);
                } else if (parsedError.error && typeof parsedError.error === 'string' && parsedError.status) {
                    detailedMessages.push(`${parsedError.error} (Status: ${parsedError.status})`);
                }
            }
        } catch (e) {
            console.warn("Não foi possível parsear o corpo do erro como JSON.", e);
        }

        let finalErrorMessage = errorData.message || "Erro desconhecido na API.";
        if(detailedMessages.length > 0) {
            finalErrorMessage = detailedMessages.join('; ');
        }

        console.error("API Error Details:", finalErrorMessage, "Status:", response.status, "Full Parsed Error Object:", errorData);
        throw new Error(finalErrorMessage);
    }

    if (response.status === 204) {
        return null as T;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json() as T;
    } else {
        console.warn("Resposta OK, mas não é JSON e não é 204 (No Content):", response);
        return null as T;
    }
}

// --- Cliente API ---
// ... (código das funções de Cliente API - sem alterações)
export async function listarClientes(page: number = 0, size: number = 10): Promise<Page<ClienteResponseDTO>> {
    const response = await fetch(`${API_BASE_URL}/clientes?page=${page}&size=${size}&sort=nome,asc`);
    return handleResponse<Page<ClienteResponseDTO>>(response);
}
export async function buscarClientePorId(id: number): Promise<ClienteResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
    return handleResponse<ClienteResponseDTO>(response);
}
export async function buscarClientePorDocumento(documento: string): Promise<ClienteResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/clientes/documento/${documento.replace(/\D/g, '')}`);
    return handleResponse<ClienteResponseDTO>(response);
}
export async function criarCliente(data: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const payload = {...data, documento: (data.documento || '').replace(/\D/g, '') };
    const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    return handleResponse<ClienteResponseDTO>(response);
}
export async function atualizarCliente(id: number, data: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const payload = {...data, documento: (data.documento || '').replace(/\D/g, '') };
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    return handleResponse<ClienteResponseDTO>(response);
}
export async function deletarCliente(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, { method: 'DELETE' });
    await handleResponse<void>(response);
}

// --- Contato API ---
// ... (código da função criarContatoSozinho - sem alterações)
export async function criarContatoSozinho(data: ContatoRequestDTO): Promise<ContatoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/contatos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    return handleResponse<ContatoResponseDTO>(response);
}

// --- Endereco API ---
// ... (código das funções de Endereco API - sem alterações)
export async function consultarCepPelaApi(cep: string): Promise<ViaCepResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/enderecos/consultar-cep/${cep.replace(/\D/g, '')}`);
    return handleResponse<ViaCepResponseDTO>(response);
}
export async function calcularCoordenadasPelaApi(data: EnderecoGeoRequestDTO): Promise<GeoCoordinatesDTO> {
    const response = await fetch(`${API_BASE_URL}/enderecos/calcular-coordenadas`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    return handleResponse<GeoCoordinatesDTO>(response);
}
export async function criarEnderecoSozinho(data: EnderecoRequestDTO): Promise<EnderecoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/enderecos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    return handleResponse<EnderecoResponseDTO>(response);
}


// --- Eonet API ---
// ... (código das funções listarEventosEonet e sincronizarNasaEonet - sem alterações)
export async function listarEventosEonet(page: number = 0, size: number = 10): Promise<Page<EonetResponseDTO>> {
    const response = await fetch(`${API_BASE_URL}/eonet?page=${page}&size=${size}&sort=data,desc`);
    return handleResponse<Page<EonetResponseDTO>>(response);
}

export async function sincronizarNasaEonet(limit?: number, days?: number, status?: string, source?: string): Promise<EonetResponseDTO[]> {
    const queryParamsCollector: Record<string, string> = {};
    if (limit !== undefined) queryParamsCollector.limit = String(limit);
    if (days !== undefined) queryParamsCollector.days = String(days);
    if (status) queryParamsCollector.status = status;
    if (source) queryParamsCollector.source = source;

    const params = new URLSearchParams(queryParamsCollector);
    const queryString = params.toString();

    const response = await fetch(`${API_BASE_URL}/eonet/nasa/sincronizar${queryString ? '?' + queryString : ''}`, {
        method: 'POST',
    });
    return handleResponse<EonetResponseDTO[]>(response);
}

export async function buscarEventosNasaProximos(
    latitude?: number,
    longitude?: number,
    raioKm?: number,
    limit?: number,
    days?: number,
    status?: string,
    source?: string,
    startDate?: string,
    endDate?: string
): Promise<NasaEonetEventDTO[]> {
    const queryParamsCollector: Record<string, string> = {};

    if (latitude !== undefined) queryParamsCollector.latitude = String(latitude);
    if (longitude !== undefined) queryParamsCollector.longitude = String(longitude);
    if (raioKm !== undefined) queryParamsCollector.raioKm = String(raioKm);
    if (limit !== undefined) queryParamsCollector.limit = String(limit);

    if (startDate) queryParamsCollector.start = startDate;
    if (endDate) queryParamsCollector.end = endDate;

    if (!startDate && !endDate && days !== undefined) {
        queryParamsCollector.days = String(days);
    }

    if (status !== undefined && status !== null) {
        queryParamsCollector.status = status;
    }
    if (source !== undefined && source !== null && source.trim() !== '') {
        queryParamsCollector.source = source;
    }

    const params = new URLSearchParams(queryParamsCollector);
    const queryString = params.toString();

    console.log(`Frontend: Chamando /api/eonet/nasa/proximos com query: ${queryString}`);

    const response = await fetch(`${API_BASE_URL}/eonet/nasa/proximos${queryString ? '?' + queryString : ''}`);
    return handleResponse<NasaEonetEventDTO[]>(response);
}

// ***** NOVA FUNÇÃO PARA BUSCAR ESTATÍSTICAS DE CATEGORIA *****
export async function getEonetCategoryStats(days: number): Promise<CategoryCountDTO[]> {
    if (days <= 0) {
        // Pode-se optar por lançar um erro ou retornar array vazio se 'days' for inválido
        console.warn("getEonetCategoryStats: 'days' deve ser um número positivo.");
        return []; // Ou throw new Error("'days' must be a positive number.");
    }
    const response = await fetch(`${API_BASE_URL}/stats/eonet/count-by-category?days=${days}`);
    return handleResponse<CategoryCountDTO[]>(response);
}
// ***** FIM DA NOVA FUNÇÃO *****