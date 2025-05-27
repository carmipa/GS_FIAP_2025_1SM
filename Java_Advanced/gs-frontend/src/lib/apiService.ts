// src/lib/apiService.ts
import type {
    ClienteRequestDTO, ClienteResponseDTO,
    ContatoRequestDTO, ContatoResponseDTO,
    EnderecoRequestDTO, EnderecoResponseDTO,
    NominatimResponseDTO, ViaCepResponseDTO, ApiErrorResponse, Page
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({
            message: response.statusText,
            status: response.status,
            timestamp: new Date().toISOString(),
            details: "Erro ao processar resposta do servidor."
        }));

        let errorMessage = errorData.message || response.statusText;
        if (errorData.details) {
            const detailsString = Array.isArray(errorData.details) ? errorData.details.join(', ') : errorData.details;
            errorMessage += ` Detalhes: ${detailsString}`;
        }
        console.error("API Error:", errorMessage, "Status:", response.status, "Full Error Data:", errorData);
        throw new Error(errorMessage);
    }
    // Se for um 204 No Content, não há corpo para fazer .json()
    if (response.status === 204) {
        return null as T; // Ou Promise.resolve(null) dependendo do que T pode ser
    }
    return await response.json() as T;
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
    await handleResponse<void>(response); // Espera 204 No Content
}

// --- Contato API ---
export async function listarContatos(page: number = 0, size: number = 10): Promise<Page<ContatoResponseDTO>> {
    const response = await fetch(`${API_BASE_URL}/contatos?page=${page}&size=${size}&sort=email,asc`);
    return handleResponse<Page<ContatoResponseDTO>>(response);
}

export async function buscarContatoPorId(id: number): Promise<ContatoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/contatos/${id}`);
    return handleResponse<ContatoResponseDTO>(response);
}

export async function buscarContatoPorEmail(email: string): Promise<ContatoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/contatos/email/${email}`);
    return handleResponse<ContatoResponseDTO>(response);
}

export async function criarContato(data: ContatoRequestDTO): Promise<ContatoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/contatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<ContatoResponseDTO>(response);
}

export async function atualizarContato(id: number, data: ContatoRequestDTO): Promise<ContatoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/contatos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<ContatoResponseDTO>(response);
}

export async function deletarContato(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contatos/${id}`, { method: 'DELETE' });
    await handleResponse<void>(response);
}

// --- Endereco API ---
export async function buscarEnderecoGeocodificado(cep: string, numero: string, complemento?: string): Promise<EnderecoResponseDTO> {
    let url = `${API_BASE_URL}/enderecos/geocodificar/cep/${cep.replace(/\D/g, '')}?numero=${encodeURIComponent(numero)}`;
    if (complemento) {
        url += `&complemento=${encodeURIComponent(complemento)}`;
    }
    const response = await fetch(url);
    return handleResponse<EnderecoResponseDTO>(response);
}

export async function listarEnderecos(page: number = 0, size: number = 10): Promise<Page<EnderecoResponseDTO>> {
    const response = await fetch(`${API_BASE_URL}/enderecos?page=${page}&size=${size}&sort=logradouro,asc`);
    return handleResponse<Page<EnderecoResponseDTO>>(response);
}

export async function buscarEnderecoPorId(id: number): Promise<EnderecoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/enderecos/${id}`);
    return handleResponse<EnderecoResponseDTO>(response);
}

export async function criarEndereco(data: EnderecoRequestDTO): Promise<EnderecoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/enderecos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<EnderecoResponseDTO>(response);
}

export async function atualizarEndereco(id: number, data: EnderecoRequestDTO): Promise<EnderecoResponseDTO> {
    const response = await fetch(`${API_BASE_URL}/enderecos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<EnderecoResponseDTO>(response);
}

export async function deletarEndereco(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/enderecos/${id}`, { method: 'DELETE' });
    await handleResponse<void>(response);
}