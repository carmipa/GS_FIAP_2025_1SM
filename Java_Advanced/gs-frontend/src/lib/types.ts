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
    json: string; // String JSON do evento original da NASA
    data?: string | Date; // Data principal do evento ou data de registro
    eonetIdApi: string; // ID do evento na API da NASA
}

// --- NOVOS TIPOS: Estrutura para NASA EONET Events (para parsear o EonetResponseDTO.json e para a resposta de /nasa/proximos) ---
export interface NasaEonetCategoryDTO {
    id: string;
    title: string;
}

export interface NasaEonetSourceDTO {
    id: string;
    url: string;
}

// As coordenadas podem ser um array de números para um Ponto [lon, lat],
// ou um array de arrays para Polígonos e Linhas. Usamos 'any' para flexibilidade,
// mas você pode refinar isso se souber os tipos de geometria exatos que irá encontrar.
export interface NasaEonetGeometryDTO {
    magnitudeValue?: number; // Alguns eventos podem ter magnitude
    magnitudeUnit?: string;
    date: string | Date; // A API retorna como string ISO 8601
    type: "Point" | "Polygon" | string; // Pode haver outros tipos
    coordinates: any; // Ex: [lon, lat] para Point, [[[lon,lat],...]] para Polygon
    // Para polígonos, a estrutura pode ser mais aninhada. Ex: number[][][]
}

export interface NasaEonetEventDTO {
    id: string;
    title: string;
    description?: string; // Pode ser nulo ou ausente
    link: string; // Link para o evento na fonte
    categories: NasaEonetCategoryDTO[];
    sources: NasaEonetSourceDTO[];
    geometry: NasaEonetGeometryDTO[];
    closed?: string | Date | null; // Data de fechamento do evento, se aplicável
}

// (Opcional) Se a API /nasa/proximos retornar a estrutura completa da NasaEonetApiResponseDTO
// export interface NasaEonetApiResponseDTO {
//   title: string;
//   description: string;
//   link: string;
//   events: NasaEonetEventDTO[];
// }

