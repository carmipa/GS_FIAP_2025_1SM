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
    // CORREÇÃO: AlertableEventDTO removido pois não é usado
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
console.log(`[apiService Módulo Load] API_BASE_URL inicializada como: "${API_BASE_URL}"`);

async function handleResponse<T>(response: Response, requestUrl: string): Promise<T> {
    const timestamp = new Date().toISOString();
    console.log(`[apiService][${timestamp}] handleResponse - URL: ${requestUrl}, Status HTTP: ${response.status}, OK: ${response.ok}`);

    if (!response.ok) {
        const errorPrefix = `[apiService][${timestamp}] ERRO na API para ${requestUrl}`;
        // CORREÇÃO: Tipagem de errorPayload para Partial<ApiErrorResponse> | null
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
        } catch (e: unknown) { // Tipar erro do catch
            const parseErrorMessage = e instanceof Error ? e.message : String(e);
            console.warn(`${errorPrefix} - Falha ao parsear o corpo do erro (JSON ou Texto). Tentando ler o corpo do clone como texto. Erro original do parse:`, parseErrorMessage);
            try {
                errorTextMessage = await responseCloneForErrorParsing.text();
                console.log(`${errorPrefix} - Corpo do erro (Texto do clone após falha no parse):`, errorTextMessage);
            } catch (e2: unknown) { // Tipar erro do catch
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
    } catch (e: unknown) { // Tipar erro do catch
        const errorTimestamp = new Date().toISOString();
        const parseErrorMessage = e instanceof Error ? (e as Error).message : String(e);
        console.error(`[apiService][${errorTimestamp}] Erro CRÍTICO ao parsear resposta OK para ${requestUrl}. Isso não deveria acontecer se a API envia JSON válido. Erro:`, parseErrorMessage);
        let responseTextForDebug = "[Não foi possível ler o corpo da resposta como texto]";
        try {
            const responseClone = response.clone();
            responseTextForDebug = await responseClone.text();
        } catch { // CORREÇÃO: eDebug removido pois não é usado
            // Silencia o erro de leitura do corpo para depuração
        }
        console.error(`[apiService][${errorTimestamp}] Corpo da resposta (texto) que falhou no parse JSON para ${requestUrl}:`, responseTextForDebug.substring(0, 500) + "...");
        throw new Error(`Falha ao processar a resposta JSON da API para ${requestUrl}. Detalhes: ${parseErrorMessage}`);
    }
}

// --- Cliente API ---
export async function listarClientes(page: number = 0, size: number = 10): Promise<Page<ClienteResponseDTO>> {
    const sortBy = 'nome';
    const direction = 'asc';
    const sortParam = `${sortBy},${direction}`;
    const requestUrl = `${API_BASE_URL}/clientes?page=${page}&size=${size}&sort=${sortParam}`;

    console.log(`[apiService] listarClientes - Preparando para chamar: ${requestUrl}. Valor de API_BASE_URL usado: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl);
        return handleResponse<Page<ClienteResponseDTO>>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] listarClientes - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

export async function buscarClientePorId(id: number): Promise<ClienteResponseDTO> {
    const requestUrl = `${API_BASE_URL}/clientes/${id}`;
    console.log(`[apiService] buscarClientePorId - Preparando para chamar: ${requestUrl}. API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl);
        return handleResponse<ClienteResponseDTO>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] buscarClientePorId - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

export async function buscarClientePorDocumento(documento: string): Promise<ClienteResponseDTO> {
    const cleanedDocumento = (documento || '').replace(/\D/g, '');
    const requestUrl = `${API_BASE_URL}/clientes/documento/${cleanedDocumento}`;
    console.log(`[apiService] buscarClientePorDocumento - Preparando para chamar: ${requestUrl}. API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl);
        return handleResponse<ClienteResponseDTO>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] buscarClientePorDocumento - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

export async function criarCliente(data: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const payload = {...data, documento: (data.documento || '').replace(/\D/g, '') };
    const requestUrl = `${API_BASE_URL}/clientes`;
    console.log(`[apiService] criarCliente - Preparando para chamar: ${requestUrl}, Payload:`, payload, `API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        return handleResponse<ClienteResponseDTO>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] criarCliente - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

export async function atualizarCliente(id: number, data: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const payload = {...data, documento: (data.documento || '').replace(/\D/g, '') };
    const requestUrl = `${API_BASE_URL}/clientes/${id}`;
    console.log(`[apiService] atualizarCliente - Preparando para chamar: ${requestUrl}, Payload:`, payload, `API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        return handleResponse<ClienteResponseDTO>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] atualizarCliente - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

export async function deletarCliente(id: number): Promise<void> {
    const requestUrl = `${API_BASE_URL}/clientes/${id}`;
    console.log(`[apiService] deletarCliente - Preparando para chamar: ${requestUrl}. API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl, { method: 'DELETE' });
        await handleResponse<void>(response, requestUrl); // handleResponse retornará null para 204, que é void
    } catch (error) {
        console.error(`[apiService] deletarCliente - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

// --- Contato API ---
export async function criarContatoSozinho(data: ContatoRequestDTO): Promise<ContatoResponseDTO> {
    const requestUrl = `${API_BASE_URL}/contatos`;
    console.log(`[apiService] criarContatoSozinho - Preparando para chamar: ${requestUrl}, Payload:`, data, `API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
        return handleResponse<ContatoResponseDTO>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] criarContatoSozinho - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

// --- Endereco API ---
export async function consultarCepPelaApi(cep: string): Promise<ViaCepResponseDTO> {
    const cleanedCep = (cep || '').replace(/\D/g, '');
    const requestUrl = `${API_BASE_URL}/enderecos/consultar-cep/${cleanedCep}`;
    console.log(`[apiService] consultarCepPelaApi - Preparando para chamar: ${requestUrl}. API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl);
        return handleResponse<ViaCepResponseDTO>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] consultarCepPelaApi - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

export async function calcularCoordenadasPelaApi(data: EnderecoGeoRequestDTO): Promise<GeoCoordinatesDTO> {
    const requestUrl = `${API_BASE_URL}/enderecos/calcular-coordenadas`;
    console.log(`[apiService] calcularCoordenadasPelaApi - Preparando para chamar: ${requestUrl}, Payload:`, data, `API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
        return handleResponse<GeoCoordinatesDTO>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] calcularCoordenadasPelaApi - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

export async function criarEnderecoSozinho(data: EnderecoRequestDTO): Promise<EnderecoResponseDTO> {
    const requestUrl = `${API_BASE_URL}/enderecos`;
    console.log(`[apiService] criarEnderecoSozinho - Preparando para chamar: ${requestUrl}, Payload:`, data, `API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        });
        return handleResponse<EnderecoResponseDTO>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] criarEnderecoSozinho - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

// --- Eonet API ---
export async function listarEventosEonet(page: number = 0, size: number = 10): Promise<Page<EonetResponseDTO>> {
    const requestUrl = `${API_BASE_URL}/eonet?page=${page}&size=${size}&sort=data,desc`;
    console.log(`[apiService] listarEventosEonet - Preparando para chamar: ${requestUrl}. API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl);
        return handleResponse<Page<EonetResponseDTO>>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] listarEventosEonet - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

export async function buscarEventoLocalPorEonetApiId(eonetApiId: string): Promise<EonetResponseDTO> {
    const requestUrl = `${API_BASE_URL}/eonet/api-id/${eonetApiId}`;
    console.log(`[apiService] buscarEventoLocalPorEonetApiId - Preparando para chamar: ${requestUrl}. API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl);
        return handleResponse<EonetResponseDTO>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] buscarEventoLocalPorEonetApiId - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
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
    console.log(`[apiService] sincronizarNasaEonet - Preparando para chamar: ${requestUrl}. API_BASE_URL: "${API_BASE_URL}"`);

    try {
        const response = await fetch(requestUrl, { method: 'POST' });
        return handleResponse<EonetResponseDTO[]>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] sincronizarNasaEonet - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
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
    const requestUrl = `${API_BASE_URL}/eonet/nasa/proximos${queryString ? '?' + queryString : ''}`;
    console.log(`[apiService] buscarEventosNasaProximos - Preparando para chamar: ${requestUrl}. API_BASE_URL: "${API_BASE_URL}"`);

    try {
        const response = await fetch(requestUrl);
        return handleResponse<NasaEonetEventDTO[]>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] buscarEventosNasaProximos - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

// --- Stats API ---
export async function getEonetCategoryStats(days: number): Promise<CategoryCountDTO[]> {
    if (days <= 0) {
        console.warn("[apiService] getEonetCategoryStats: 'days' deve ser um número positivo. Retornando array vazio.");
        return [];
    }
    const requestUrl = `${API_BASE_URL}/stats/eonet/count-by-category?days=${days}`;
    console.log(`[apiService] getEonetCategoryStats - Preparando para chamar: ${requestUrl}. API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl);
        return handleResponse<CategoryCountDTO[]>(response, requestUrl);
    } catch (error) {
        console.error(`[apiService] getEonetCategoryStats - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}

// --- Alert API ---
export async function triggerUserSpecificAlert(data: UserAlertRequestDTO): Promise<string> {
    const requestUrl = `${API_BASE_URL}/alerts/trigger-user-specific-alert`;
    console.log(`[apiService] triggerUserSpecificAlert - Preparando para chamar: ${requestUrl}, Payload:`, data, `API_BASE_URL: "${API_BASE_URL}"`);
    try {
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorPrefix = `[apiService] Erro na API para ${requestUrl}`;
            let errorMessage = `Falha ao disparar alerta (Status: ${response.status})`;
            try {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorJson: Partial<ApiErrorResponse> = await response.json();
                    console.log(`${errorPrefix} - Corpo do erro (JSON):`, errorJson);
                    if (Array.isArray(errorJson.messages) && errorJson.messages.length > 0) {
                        errorMessage = errorJson.messages.join('; ');
                    } else if (errorJson.message && typeof errorJson.message === 'string') {
                        errorMessage = errorJson.message;
                    } else if (errorJson.error && typeof errorJson.error === 'string' && errorJson.status) {
                        errorMessage = `${errorJson.error} (Status: ${errorJson.status})`;
                    }
                } else {
                    const errorText = await response.text();
                    console.log(`${errorPrefix} - Corpo do erro (Texto):`, errorText);
                    if (errorText) errorMessage = errorText;
                }
            } catch (e: unknown) { // Tipar erro do catch
                const parseErrorMessage = e instanceof Error ? e.message : String(e);
                console.error(`${errorPrefix} - Erro ao processar resposta de erro da API:`, parseErrorMessage);
            }
            console.error(`[apiService] API Error (triggerUserSpecificAlert): ${errorMessage}`);
            throw new Error(errorMessage);
        }
        const successText = await response.text();
        console.log(`[apiService] triggerUserSpecificAlert - Resposta Texto OK para ${requestUrl}:`, successText);
        return successText;
    } catch (error) {
        console.error(`[apiService] triggerUserSpecificAlert - Erro CAPTURADO no fetch para ${requestUrl}:`, error instanceof Error ? error.message : error, error);
        throw error;
    }
}