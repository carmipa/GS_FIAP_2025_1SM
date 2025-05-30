// src/lib/types.ts

// --- Tipos para Paginação (Existente) ---
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

// --- Tipos de Contato (Existente) ---
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

// --- Tipos de Endereço (Existente) ---
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

// --- Tipos de Cliente (Existente) ---
export interface ClienteRequestDTO {
    nome: string;
    sobrenome: string;
    dataNascimento: string;
    documento: string;
    contatosIds?: number[];
    enderecosIds?: number[];
}
export interface ClienteResponseDTO {
    idCliente: number;
    nome: string;
    sobrenome: string;
    dataNascimento: string;
    documento: string;
    contatos?: ContatoResponseDTO[];
    enderecos?: EnderecoResponseDTO[];
}

// --- Tipos de API Externas e Utilitários (Existente) ---
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

export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    error?: string;
    message: string;
    messages?: string[];
    path?: string;
    details?: string[] | string;
}

export interface EnderecoGeoRequestDTO {
    logradouro: string;
    numero?: string;
    cidade: string;
    uf: string;
    bairro?: string;
    cep?: string;
}

export interface GeoCoordinatesDTO {
    latitude: number;
    longitude: number;
    matchedAddress?: string;
}

// --- Tipos para EONET (Backend Local - Existente) ---
export interface EonetResponseDTO {
    idEonet: number;
    json: string;
    data?: string | Date;
    eonetIdApi: string;
}

// --- Tipos para NASA EONET Events (Existente) ---
export interface NasaEonetCategoryDTO {
    id: string;
    title: string;
}

export interface NasaEonetSourceDTO {
    id: string;
    url: string;
}

export interface NasaEonetGeometryDTO {
    magnitudeValue?: number;
    magnitudeUnit?: string;
    date: string | Date;
    type: "Point" | "Polygon" | string;
    coordinates: any;
}

export interface NasaEonetEventDTO {
    id: string;
    title: string;
    description?: string;
    link: string;
    categories: NasaEonetCategoryDTO[];
    sources: NasaEonetSourceDTO[];
    geometry: NasaEonetGeometryDTO[];
    closed?: string | Date | null;
}

// ***** NOVA INTERFACE PARA DADOS DE ESTATÍSTICAS *****
export interface CategoryCountDTO {
    categoryTitle: string;
    count: number;
}

// Em src/lib/types.ts
export interface AlertableEventDTO {
    eventId?: string;
    title?: string;
    eventDate?: string;
    link?: string;
    description?: string;
}

export interface UserAlertRequestDTO {
    userId: number;
    eventDetails: AlertableEventDTO;
}
// ***** FIM DA NOVA INTERFACE *****