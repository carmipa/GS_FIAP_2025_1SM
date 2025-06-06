// src/lib/apiService.ts
import type {
    ClienteRequestDTO, ClienteResponseDTO,
    ContatoRequestDTO, ContatoResponseDTO,
    EnderecoRequestDTO, EnderecoResponseDTO,
    EnderecoGeoRequestDTO, GeoCoordinatesDTO,
    ViaCepResponseDTO, ApiErrorResponse, Page,
    EonetResponseDTO, NasaEonetEventDTO,
    CategoryCountDTO,
    UserAlertRequestDTO
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
console.log(`[apiService Módulo Load] API_BASE_URL inicializada como: "${API_BASE_URL}"`);

async function handleResponse<T>(response: Response, requestUrl: string): Promise<T> {
    const timestamp = new Date().toISOString();
    console.log(`[apiService][${timestamp}] handleResponse - URL: ${requestUrl}, Status HTTP: ${response.status}, OK: ${response.ok}`);

    if (!response.ok) {
        const errorPrefix = `[apiService][${timestamp}] ERRO na API para ${requestUrl}`;
        let errorPayload: Partial<ApiErrorResponse> | null = null;
        let errorTextMessage: string | null = null;
        const responseCloneForErrorParsing = response.clone();

        try {
            const contentType = response.headers.get("content-type");
            console.log(`${errorPrefix} - Content-Type da resposta de erro: ${contentType}`);
            if (contentType && contentType.includes("application/json")) {
                errorPayload = await response.json() as Partial<ApiErrorResponse>;
                console.log(`${errorPrefix} - Corpo do erro (JSON parseado):`, errorPayload);
            } else {
                errorTextMessage = await response.text();
                console.log(`${errorPrefix} - Corpo do erro (Texto puro):`, errorTextMessage);
            }
        } catch (e: unknown) {
            const parseErrorMessage = e instanceof Error ? e.message : String(e);
            console.warn(`${errorPrefix} - Falha ao parsear o corpo do erro (JSON ou Texto). Tentando ler o corpo do clone como texto. Erro original do parse:`, parseErrorMessage);
            try {
                errorTextMessage = await responseCloneForErrorParsing.text();
                console.log(`${errorPrefix} - Corpo do erro (Texto do clone após falha no parse):`, errorTextMessage);
            } catch (e2: unknown) {
                const parseCloneErrorMessage = e2 instanceof Error ? e2.message : String(e2);
                console.warn(`${errorPrefix} - Falha crítica ao ler o corpo do erro como texto do clone.`, parseCloneErrorMessage);
            }
        }

        let finalErrorMessage = `Erro ${response.status}: ${response.statusText || "Falha na requisição"}`;
        if (errorPayload && typeof errorPayload.message === 'string' && errorPayload.message.trim() !== '') {
            finalErrorMessage = errorPayload.message;
        } else if (errorPayload && Array.isArray(errorPayload.messages) && errorPayload.messages.length > 0) {
            finalErrorMessage = errorPayload.messages.join('; ');
        } else if (errorPayload && typeof errorPayload.error === 'string') {
            finalErrorMessage = `${errorPayload.error} (Status: ${errorPayload.status || response.status})`;
        } else if (errorTextMessage && errorTextMessage.trim() !== '') {
            finalErrorMessage = errorTextMessage.substring(0, 300);
        }

        console.error(`[apiService][${timestamp}] DETALHES DO ERRO FINAL: Mensagem='${finalErrorMessage}', Status=${response.status}, URL=${requestUrl}. Objeto de erro (se JSON):`, errorPayload);
        throw new Error(finalErrorMessage);
    }

    if (response.status === 204) {
        console.log(`[apiService][${timestamp}] Resposta 204 (No Content) para ${requestUrl}. Retornando null.`);
        return null as T;
    }

    try {
        const contentType = response.headers.get("content-type");
        console.log(`[apiService][${timestamp}] Resposta OK para ${requestUrl}. Content-Type: ${contentType}`);
        if (contentType && contentType.includes("application/json")) {
            const jsonData = await response.json();
            const previewData = JSON.stringify(jsonData).substring(0, 300) + (JSON.stringify(jsonData).length > 300 ? "..." : "");
            console.log(`[apiService][${timestamp}] Resposta JSON OK para ${requestUrl}. Preview dos dados:`, previewData);
            return jsonData as T;
        } else {
            const textData = await response.text();
            console.log(`[apiService][${timestamp}] Resposta Texto OK para ${requestUrl}:`, textData.substring(0,300) + "...");
            return textData as unknown as T;
        }
    } catch (e: unknown) {
        const errorTimestamp = new Date().toISOString();
        const parseErrorMessage = e instanceof Error ? (e as Error).message : String(e);
        console.error(`[apiService][${errorTimestamp}] Erro CRÍTICO ao parsear resposta OK para ${requestUrl}. Isso não deveria acontecer se a API envia JSON válido. Erro:`, parseErrorMessage);
        let responseTextForDebug = "[Não foi possível ler o corpo da resposta como texto]";
        try {
            const responseClone = response.clone();
            responseTextForDebug = await responseClone.text();
        } catch {
            // Silencia o erro de leitura do corpo para depuração
        }
        console.error(`[apiService][${errorTimestamp}] Corpo da resposta (texto) que falhou no parse JSON para ${requestUrl}:`, responseTextForDebug.substring(0, 500) + "...");
        throw new Error(`Falha ao processar a resposta JSON da API para ${requestUrl}. Detalhes: ${parseErrorMessage}`);
    }
}

// ... (outras funções do Cliente, Contato e Endereco API permanecem as mesmas) ...

// --- Cliente API ---
export async function listarClientes(page: number = 0, size: number = 10): Promise<Page<ClienteResponseDTO>> {
    const sortBy = 'nome';
    const direction = 'asc';
    const sortParam = `${sortBy},${direction}`;
    const requestUrl = `${API_BASE_URL}/clientes?page=${page}&size=${size}&sort=${sortParam}`;
    return fetch(requestUrl).then(response => handleResponse<Page<ClienteResponseDTO>>(response, requestUrl));
}

export async function buscarClientePorId(id: number): Promise<ClienteResponseDTO> {
    const requestUrl = `${API_BASE_URL}/clientes/${id}`;
    return fetch(requestUrl).then(response => handleResponse<ClienteResponseDTO>(response, requestUrl));
}

export async function buscarClientePorDocumento(documento: string): Promise<ClienteResponseDTO> {
    const cleanedDocumento = (documento || '').replace(/\D/g, '');
    const requestUrl = `${API_BASE_URL}/clientes/documento/${cleanedDocumento}`;
    return fetch(requestUrl).then(response => handleResponse<ClienteResponseDTO>(response, requestUrl));
}

export async function criarCliente(data: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const payload = {...data, documento: (data.documento || '').replace(/\D/g, '') };
    const requestUrl = `${API_BASE_URL}/clientes`;
    const response = await fetch(requestUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return handleResponse<ClienteResponseDTO>(response, requestUrl);
}

export async function atualizarCliente(id: number, data: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const payload = {...data, documento: (data.documento || '').replace(/\D/g, '') };
    const requestUrl = `${API_BASE_URL}/clientes/${id}`;
    const response = await fetch(requestUrl, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return handleResponse<ClienteResponseDTO>(response, requestUrl);
}

export async function deletarCliente(id: number): Promise<void> {
    const requestUrl = `${API_BASE_URL}/clientes/${id}`;
    const response = await fetch(requestUrl, { method: 'DELETE' });
    await handleResponse<void>(response, requestUrl);
}

// --- Contato API ---
export async function criarContatoSozinho(data: ContatoRequestDTO): Promise<ContatoResponseDTO> {
    const requestUrl = `${API_BASE_URL}/contatos`;
    const response = await fetch(requestUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return handleResponse<ContatoResponseDTO>(response, requestUrl);
}

// --- Endereco API ---
export async function consultarCepPelaApi(cep: string): Promise<ViaCepResponseDTO> {
    const cleanedCep = (cep || '').replace(/\D/g, '');
    const requestUrl = `${API_BASE_URL}/enderecos/consultar-cep/${cleanedCep}`;
    return fetch(requestUrl).then(response => handleResponse<ViaCepResponseDTO>(response, requestUrl));
}

export async function calcularCoordenadasPelaApi(data: EnderecoGeoRequestDTO): Promise<GeoCoordinatesDTO> {
    const requestUrl = `${API_BASE_URL}/enderecos/calcular-coordenadas`;
    const response = await fetch(requestUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return handleResponse<GeoCoordinatesDTO>(response, requestUrl);
}

export async function criarEnderecoSozinho(data: EnderecoRequestDTO): Promise<EnderecoResponseDTO> {
    const requestUrl = `${API_BASE_URL}/enderecos`;
    const response = await fetch(requestUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return handleResponse<EnderecoResponseDTO>(response, requestUrl);
}

// --- Eonet API ---
export async function listarEventosEonet(page: number = 0, size: number = 10): Promise<Page<EonetResponseDTO>> {
    const requestUrl = `${API_BASE_URL}/eonet?page=${page}&size=${size}&sort=data,desc`;
    return fetch(requestUrl).then(response => handleResponse<Page<EonetResponseDTO>>(response, requestUrl));
}

export async function buscarEventoLocalPorEonetApiId(eonetApiId: string): Promise<EonetResponseDTO> {
    const requestUrl = `${API_BASE_URL}/eonet/api-id/${eonetApiId}`;
    return fetch(requestUrl).then(response => handleResponse<EonetResponseDTO>(response, requestUrl));
}

export async function sincronizarNasaEonet(limit?: number, days?: number, status?: string, source?: string): Promise<EonetResponseDTO[]> {
    const queryParamsCollector: Record<string, string> = {};
    if (limit !== undefined) queryParamsCollector.limit = String(limit);
    if (days !== undefined) queryParamsCollector.days = String(days);
    if (status) queryParamsCollector.status = status;
    if (source) queryParamsCollector.source = source;
    const params = new URLSearchParams(queryParamsCollector);
    const queryString = params.toString();
    const requestUrl = `${API_BASE_URL}/eonet/nasa/sincronizar${queryString ? '?' + queryString : ''}`;
    const response = await fetch(requestUrl, { method: 'POST' });
    return handleResponse<EonetResponseDTO[]>(response, requestUrl);
}

// ############# INÍCIO DA CORREÇÃO #############
export async function buscarEventosNasaProximos(
    latitude?: number, longitude?: number, raioKm?: number, limit?: number,
    days?: number, status?: string, source?: string, startDate?: string, endDate?: string,
    // 1. Adicionado o parâmetro categoryId à função
    categoryId?: string 
): Promise<NasaEonetEventDTO[]> {
    const queryParamsCollector: Record<string, string> = {};
    if (latitude !== undefined) queryParamsCollector.latitude = String(latitude);
    if (longitude !== undefined) queryParamsCollector.longitude = String(longitude);
    if (raioKm !== undefined) queryParamsCollector.raioKm = String(raioKm);
    if (limit !== undefined) queryParamsCollector.limit = String(limit);
    if (startDate) queryParamsCollector.start = startDate;
    if (endDate) queryParamsCollector.end = endDate;
    if (!startDate && !endDate && days !== undefined) { queryParamsCollector.days = String(days); }
    if (status) queryParamsCollector.status = status;
    if (source) queryParamsCollector.source = source;

    // 2. Adicionado o categoryId aos parâmetros da URL se ele for fornecido
    if (categoryId) {
        queryParamsCollector.category = categoryId;
    }

    const params = new URLSearchParams(queryParamsCollector);
    const queryString = params.toString();
    const requestUrl = `${API_BASE_URL}/eonet/nasa/proximos${queryString ? '?' + queryString : ''}`;
    console.log(`[apiService] buscarEventosNasaProximos - Preparando para chamar: ${requestUrl}`);

    try {
        const response = await fetch(requestUrl);
        return handleResponse<NasaEonetEventDTO[]>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] buscarEventosNasaProximos - Erro CAPTURADO no fetch para ${requestUrl}:`, error);
        throw error;
    }
}
// ############# FIM DA CORREÇÃO #############


// --- Stats API ---
export async function getEonetCategoryStats(days: number): Promise<CategoryCountDTO[]> {
    if (days <= 0) return [];
    const requestUrl = `${API_BASE_URL}/stats/eonet/count-by-category?days=${days}`;
    return fetch(requestUrl).then(response => handleResponse<CategoryCountDTO[]>(response, requestUrl));
}

// --- Alert API ---
export async function triggerUserSpecificAlert(data: UserAlertRequestDTO): Promise<string> {
    const requestUrl = `${API_BASE_URL}/alerts/trigger-user-specific-alert`;
    try {
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        // Simplificado para usar handleResponse para erros, ou processar sucesso.
        if (!response.ok) {
            // handleResponse lança um erro formatado, então não precisamos duplicar a lógica aqui
            return handleResponse(response, requestUrl); 
        }
        return await response.text();
    } catch (error) {
        console.error(`[apiService] triggerUserSpecificAlert - Erro CAPTURADO no fetch para ${requestUrl}:`, error);
        throw error;
    }
}