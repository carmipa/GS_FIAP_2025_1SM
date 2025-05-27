// src/lib/types.ts

// Base para paginação (pode ser expandido)
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
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}


// DTOs de Contato
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

// DTOs de Endereco
export interface EnderecoRequestDTO {
    cep: string;
    numero: number;
    logradouro: string;
    bairro: string;
    localidade: string; // Cidade
    uf: string; // Estado
    complemento?: string;
    latitude: number; // No Java é BigDecimal, mas JSON transporta como number ou string
    longitude: number; // No Java é BigDecimal
}

export interface EnderecoResponseDTO extends EnderecoRequestDTO {
    idEndereco: number;
    // eonetEventos?: EonetEventoResponseDTO[]; // Se for usar
}

// DTOs de Cliente
export interface ClienteRequestDTO {
    nome: string;
    sobrenome: string;
    dataNascimento: string; // Formato YYYY-MM-DD
    documento: string;
    contato?: ContatoRequestDTO; // Para criar/atualizar contato principal junto
    endereco?: EnderecoRequestDTO; // Para criar/atualizar endereço principal junto
    // Se a API for atualizada para aceitar IDs:
    // contatoIds?: number[];
    // enderecoIds?: number[];
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

// ViaCep
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

// Nominatim (simplificado)
export interface NominatimResponseDTO {
    place_id: string;
    lat: string;
    lon: string;
    display_name: string;
}

// Para erros da API
export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    message: string; // Mensagem principal do erro
    details?: string[] | string; // Detalhes da validação ou outras infos
}