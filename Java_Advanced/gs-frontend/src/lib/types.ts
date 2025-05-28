// src/lib/types.ts

// Base para paginação (Page<T>) - MANTÉM COMO ESTÁ
export interface Page<T> {
    content: T[];
    pageable: {
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // current page number
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}


// DTOs de Contato (MANTÊM COMO ESTÃO)
export interface ContatoRequestDTO {
    ddd: string;
    telefone: string;
    celular?: string;
    whatsapp?: string;
    email: string;
    tipoContato: string;
}

export interface ContatoResponseDTO extends ContatoRequestDTO {
    idContato: number;
}

// DTOs de Endereco (MANTÊM COMO ESTÃO)
export interface EnderecoRequestDTO {
    cep: string;
    numero: number;
    logradouro: string;
    bairro: string;
    localidade: string; // Cidade
    uf: string; // Estado
    complemento?: string;
    latitude: number;
    longitude: number;
}

export interface EnderecoResponseDTO extends EnderecoRequestDTO {
    idEndereco: number;
}

// DTOs de Cliente (AJUSTADO PARA USAR IDs)
export interface ClienteRequestDTO {
    nome: string;
    sobrenome: string;
    dataNascimento: string; // Formato YYYY-MM-DD (do input date) ou dd/MM/yyyy (se o backend aceitar ambos)
    documento: string;
    contatosIds?: number[];  // <--- MUDANÇA
    enderecosIds?: number[]; // <--- MUDANÇA
}

export interface ClienteResponseDTO {
    idCliente: number;
    nome: string;
    sobrenome: string;
    dataNascimento: string;
    documento: string;
    contatos?: ContatoResponseDTO[];  // Resposta pode continuar com DTOs completos
    enderecos?: EnderecoResponseDTO[];// Resposta pode continuar com DTOs completos
}

// ViaCep (MANTÉM COMO ESTÁ)
export interface ViaCepResponseDTO {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

// Nominatim (MANTÉM COMO ESTÁ, mas ajuste o nome se necessário)
export interface NominatimResultDTO { // Renomeado para clareza, já que é um item da lista
    place_id: string; // Nominatim usa string para place_id em alguns casos
    lat: string;
    lon: string;
    display_name: string;
    // Adicione outros campos se precisar, ex: type, importance
}


// Para erros da API (MANTÉM COMO ESTÁ)
export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    error?: string; // Adicionado para o formato do GlobalExceptionHandler
    message: string;
    messages?: string[]; // Para MethodArgumentNotValidException
    path?: string; // Adicionado para o formato do GlobalExceptionHandler
    details?: string[] | string; // Mantido para compatibilidade, mas 'messages' é mais específico para validação
}

// DTO para requisição de geocodificação (MANTÉM COMO ESTÁ)
export interface EnderecoGeoRequestDTO {
    logradouro: string;
    numero?: string;
    cidade: string;
    uf: string;
    bairro?: string;
    cep?: string;
}

// DTO para resposta da nossa API de geocodificação (MANTÉM COMO ESTÁ)
export interface GeoCoordinatesDTO {
    latitude: number;
    longitude: number;
    matchedAddress?: string;
}