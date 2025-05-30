// src/lib/apiService.ts
import type {
    ClienteRequestDTO, ClienteResponseDTO,
    ContatoRequestDTO, ContatoResponseDTO,
    EnderecoRequestDTO, EnderecoResponseDTO,
    EnderecoGeoRequestDTO, GeoCoordinatesDTO,
    ViaCepResponseDTO, ApiErrorResponse, Page,
    EonetResponseDTO, NasaEonetEventDTO,
    CategoryCountDTO,
    UserAlertRequestDTO,
    AlertableEventDTO
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
            } else {
                const textError = await response.text();
                if (textError) detailedMessages.push(textError);
            }
        } catch (e) {
            console.warn("Não foi possível parsear o corpo do erro.", e);
            try {
                // Tentar ler como texto em caso de falha no parse JSON se response não foi consumida
                // Se response.json() falhou, o corpo pode ainda estar disponível para response.text()
                // Mas se response.text() já foi chamada, response.clone().text() seria necessário.
                // Para simplificar, assumimos que a primeira tentativa de leitura é a que vale.
            } catch (e2) {
                console.warn("Não foi possível ler o corpo do erro como texto.", e2);
            }
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
    if (contentType && contentType.includes("application/json")) {
        return await response.json() as T;
    } else {
        // Se for OK mas não JSON (ex: string pura do ResponseEntity<String>), tenta ler como texto.
        // Mas a tipagem genérica T pode não ser string.
        // A função triggerUserSpecificAlert que retorna Promise<string> lida com isso especificamente.
        // Aqui, mantemos o comportamento de retornar null para outros casos não-JSON.
        console.warn("Resposta OK, mas não é JSON e não é 204 (No Content):", response.status, response.statusText);
        return null as T;
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
export async function criarContatoSozinho(data: ContatoRequestDTO): Promise<ContatoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/contatos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    return handleResponse<ContatoResponseDTO>(response);
}

// --- Endereco API ---
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

// ▼▼▼ GARANTA QUE ESTA FUNÇÃO ESTEJA DEFINIDA E EXPORTADA ▼▼▼
export async function buscarEventoLocalPorEonetApiId(eonetApiId: string): Promise<EonetResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/eonet/api-id/${eonetApiId}`);
    return handleResponse<EonetResponseDTO>(response);
}
// ▲▲▲ FIM DA FUNÇÃO NECESSÁRIA ▲▲▲

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
    latitude?: number, longitude?: number, raioKm?: number, limit?: number,
    days?: number, status?: string, source?: string, startDate?: string, endDate?: string
): Promise<NasaEonetEventDTO[]> {
    const queryParamsCollector: Record<string, string> = {};
    if (latitude !== undefined) queryParamsCollector.latitude = String(latitude);
    if (longitude !== undefined) queryParamsCollector.longitude = String(longitude);
    if (raioKm !== undefined) queryParamsCollector.raioKm = String(raioKm);
    if (limit !== undefined) queryParamsCollector.limit = String(limit);
    if (startDate) queryParamsCollector.start = startDate;
    if (endDate) queryParamsCollector.end = endDate;
    if (!startDate && !endDate && days !== undefined) { queryParamsCollector.days = String(days); }
    if (status !== undefined && status !== null) { queryParamsCollector.status = status; }
    if (source !== undefined && source !== null && source.trim() !== '') { queryParamsCollector.source = source; }
    const params = new URLSearchParams(queryParamsCollector);
    const queryString = params.toString();
    console.log(`Frontend: Chamando /api/eonet/nasa/proximos com query: ${queryString}`);
    const response = await fetch(`${API_BASE_URL}/eonet/nasa/proximos${queryString ? '?' + queryString : ''}`);
    return handleResponse<NasaEonetEventDTO[]>(response);
}

// --- Stats API ---
export async function getEonetCategoryStats(days: number): Promise<CategoryCountDTO[]> {
    if (days <= 0) {
        console.warn("getEonetCategoryStats: 'days' deve ser um número positivo.");
        return [];
    }
    const response = await fetch(`${API_BASE_URL}/stats/eonet/count-by-category?days=${days}`);
    return handleResponse<CategoryCountDTO[]>(response);
}

// --- Alert API ---
export async function triggerUserSpecificAlert(data: UserAlertRequestDTO): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/alerts/trigger-user-specific-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        let errorMessage = `Falha ao disparar alerta (Status: ${response.status})`;
        try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorJson: Partial<ApiErrorResponse> = await response.json();
                let detailedMessages: string[] = [];
                if (Array.isArray(errorJson.messages) && errorJson.messages.length > 0) {
                    detailedMessages = errorJson.messages;
                } else if (errorJson.message && typeof errorJson.message === 'string') {
                    detailedMessages.push(errorJson.message);
                } else if (errorJson.error && typeof errorJson.error === 'string' && errorJson.status) {
                    detailedMessages.push(`${errorJson.error} (Status: ${errorJson.status})`);
                }
                if (detailedMessages.length > 0) {
                    errorMessage = detailedMessages.join('; ');
                } else if (errorJson.message) {
                    errorMessage = errorJson.message;
                }
            } else {
                const errorText = await response.text();
                if (errorText) errorMessage = errorText;
            }
        } catch (e) {
            console.error("Erro ao processar resposta de erro da API (triggerUserSpecificAlert):", e);
        }
        console.error("API Error (triggerUserSpecificAlert):", errorMessage);
        throw new Error(errorMessage);
    }
    return response.text();
}