// src/lib/apiService.ts
import type {
    ClienteRequestDTO, ClienteResponseDTO,
    ContatoRequestDTO, ContatoResponseDTO,
    EnderecoRequestDTO, EnderecoResponseDTO,
    EnderecoGeoRequestDTO, GeoCoordinatesDTO,
    ViaCepResponseDTO, ApiErrorResponse, Page,
    EonetResponseDTO, NasaEonetEventDTO // Adicionado NasaEonetEventDTO
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function handleResponse<T>(response: Response): Promise<T> {
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

// --- Cliente API --- (Existente, sem alterações aqui)
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

// --- Contato API --- (Existente, sem alterações aqui)
export async function criarContatoSozinho(data: ContatoRequestDTO): Promise<ContatoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/contatos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    return handleResponse<ContatoResponseDTO>(response);
}

// --- Endereco API --- (Existente, sem alterações aqui)
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
    return handleResponse<EonetResponseDTO[]>(response); // Retorna os eventos que foram salvos/atualizados localmente
}

// NOVA FUNÇÃO para buscar eventos próximos da API da NASA
export async function buscarEventosNasaProximos(
    latitude: number, longitude: number, raioKm: number,
    limit?: number, days?: number, status?: string, source?: string
): Promise<NasaEonetEventDTO[]> { // Retorna diretamente os eventos da NASA
    const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        raioKm: String(raioKm),
    });
    if (limit) params.append('limit', String(limit));
    if (days) params.append('days', String(days));
    if (status) params.append('status', status);
    if (source) params.append('source', source);

    const response = await fetch(`${API_BASE_URL}/eonet/nasa/proximos?${params.toString()}`);
    return handleResponse<NasaEonetEventDTO[]>(response);
}
