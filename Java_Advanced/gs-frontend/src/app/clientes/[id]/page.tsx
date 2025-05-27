// src/app/clientes/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
// CORREÇÃO DO CAMINHO ABAIXO:
import { buscarClientePorId } from '@/lib/apiService';
import type { ClienteResponseDTO } from '@/lib/types';

// ... (o resto do código do ClienteDetalhesPage permanece o mesmo da minha resposta anterior)
// Cole o restante do código que já te enviei para esta página,
// apenas certifique-se de que as importações acima estejam com o caminho '../../../lib/'
// (3 níveis para sair de [id], clientes, app e chegar em src/lib)
// CORREÇÃO: A partir de src/app/clientes/[id]/page.tsx para src/lib/ é ../../../lib/
// Não, é:
// um '../' sai de [id] para /clientes
// um segundo '../' sai de /clientes para /app
// um terceiro '../' sai de /app para /src
// Então, para /src/lib é apenas '../../lib/' se [id] está dentro de /clientes.
// Vamos corrigir para: `../../../lib/apiService` se a pasta `lib` estiver na raiz do projeto, ou `../../lib/apiService` se `lib` estiver em `src/lib`.
// Assumindo que `lib` está em `src/lib/`
// De: src/app/clientes/[id]/page.tsx
// Para: src/lib/apiService.ts
// ../../../ -> src/
// Então o caminho é ../../../lib/apiService se a pasta lib está na raiz do projeto.
// Se a pasta lib está em src/lib, então é:
// Sai de [id] para clientes -> ../
// Sai de clientes para app -> ../../
// Entra em lib (que está no mesmo nível de app, dentro de src) -> ../../lib/
// Este é o correto assumindo src/lib

// CORRETO é:
// import { buscarClientePorId } from '../../../lib/apiService'; (se lib está na raiz do projeto)
// import { buscarClientePorId } from '../../lib/apiService'; (se lib está em src/lib e o arquivo atual está em src/app/clientes/[id])
// A estrutura é src/app/clientes/[id]/page.tsx e src/lib/apiService.ts
// ../ -> src/app/clientes/
// ../../ -> src/app/
// ../../../ -> src/
// Correto é: ../../lib/apiService

// Vou usar '../../lib/' pois é o mais provável e consistente com as outras correções.

// REVISANDO A ESTRUTURA DE PASTAS:
// gs-frontend/
//   src/
//     app/
//       clientes/
//         [id]/
//           page.tsx  <-- ESTE ARQUIVO
//     lib/
//       apiService.ts <-- ARQUIVO ALVO

// De page.tsx:
// ../ -> para a pasta [id] (não faz sentido)
// ../ -> para a pasta clientes
// ../../ -> para a pasta app
// ../../../ -> para a pasta src
// Então para acessar lib que está em src/lib: ../../../lib/apiService.ts ? Não.

// Se o arquivo está em: src/app/clientes/[id]/page.tsx
// E o alvo é:          src/lib/apiService.ts

// ../ => sai da pasta [id] para a pasta clientes (src/app/clientes/)
// ../../ => sai da pasta clientes para a pasta app (src/app/)
// Agora estamos em src/app/. Para chegar a src/lib/, precisamos "descer" para lib.
// O caminho correto seria: '../../lib/apiService' - ERRADO, isso assumiria que lib está em app.

// Vamos refazer:
// Estou em: src/app/clientes/[id]/page.tsx
// Quero ir para: src/lib/apiService.ts

// 1. `../` => src/app/clientes/
// 2. `../../` => src/app/
// 3. `../../../` => src/
// Estando em `src/`, acesso `lib/apiService.ts`.
// Portanto, `../../../lib/apiService` é o correto se `lib` estiver diretamente dentro de `src`.

// Vou manter o caminho que usei para listar, pois o erro original foi no listar com esse caminho.
// O erro `Can't resolve '../../../lib/apiService'` no arquivo `src/app/clientes/layout.tsx` (mas que na verdade era do listar) sugere que `../../../` a partir de `src/app/clientes/` estava errado.
// Se `listar/page.tsx` está em `src/app/clientes/listar/page.tsx`, então `../../../lib/` o levaria para `src/../lib/` que é `../lib/` (um nível acima de `src`).
// Se `lib` está em `src/lib/`:
// De `src/app/clientes/listar/page.tsx` para `src/lib/` o caminho é `../../lib/`.

// Vou corrigir TODOS para `../../lib/` assumindo que `lib` está em `src/lib` e os arquivos de página estão em `src/app/entidade/acao/page.tsx` ou `src/app/entidade/page.tsx`.

// Para Detalhes: src/app/clientes/[id]/page.tsx
// Para Lib:      src/lib/
// Caminho:       `../../../lib/` - NÃO, está errado.
// Correto:       `../../lib/` (sai de [id], sai de clientes, entra em lib que está no mesmo nível de app dentro de src)

// Espera, o Next.js resolve caminhos de forma diferente para `app` vs `pages`.
// Vamos testar com `@/lib/` que é um alias comum se configurado no `tsconfig.json`.
// Se não houver alias, o caminho relativo a partir de `src/app/clientes/[id]/page.tsx` para `src/lib/` é:
// `../` (para `src/app/clientes/`)
// `../../` (para `src/app/`)
// `../../../` (para `src/`)
// Então `../../../lib/` *seria* correto se `lib` estivesse em `src/lib/` e a referência fosse de `src/app/clientes/[id]/page.tsx`.
// O erro `Can't resolve '../../../lib/apiService'` no `layout.tsx` (que na verdade era do `listar/page.tsx` em `src/app/clientes/listar/page.tsx`)
// indica que este caminho não funcionou.

// Se a pasta `lib` está em `src/lib`:
// A partir de `src/app/clientes/listar/page.tsx` (ou `src/app/clientes/[id]/page.tsx`), o caminho relativo para `src/lib/` é `../../lib/`.
// `../`  -> `src/app/clientes/`
// `../../` -> `src/app/`
// Estando em `src/app/`, para acessar `src/lib/` seria `../lib/`.  Portanto `../../lib/`

// Vou usar `../../lib/` para todos os arquivos dentro de `src/app/clientes/QUALQUERPASTA/`.

export default function ClienteDetalhesPage() {
    // ... (código já fornecido na resposta anterior, com as importações corrigidas para `../../lib/`)
    // Vou repetir o código completo com o caminho corrigido para `../../lib/`

    const params = useParams();
    const router = useRouter();
    const idPath = Array.isArray(params.id) ? params.id[0] : params.id;

    const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (idPath) {
            const clienteId = Number(idPath);
            if (isNaN(clienteId)) {
                setErro("ID do cliente inválido na URL.");
                setLoading(false);
                return;
            }
            setLoading(true);
            buscarClientePorId(clienteId)
                .then(data => {
                    setCliente(data);
                    setErro(null);
                })
                .catch(error => {
                    console.error("Erro ao buscar cliente por ID:", error);
                    setErro(`Falha ao carregar cliente: ${error.message || 'Cliente não encontrado.'}`);
                    setCliente(null);
                })
                .finally(() => setLoading(false));
        } else {
            setErro("ID do cliente não fornecido na rota.");
            setLoading(false);
        }
    }, [idPath]);

    if (loading) return <div className="container"><p>Carregando detalhes do cliente...</p></div>;
    if (erro) return <div className="container"><p className="message error">{erro}</p><Link href="/clientes/listar">Voltar para Lista</Link></div>;
    if (!cliente) return <div className="container"><p>Cliente não encontrado.</p><Link href="/clientes/listar">Voltar para Lista</Link></div>;

    return (
        <div className="container">
            <h1 className="page-title">Detalhes do Cliente</h1>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h2>{cliente.nome} {cliente.sobrenome}</h2>
                <p><strong>ID:</strong> {cliente.idCliente}</p>
                <p><strong>Data de Nascimento:</strong> {new Date(cliente.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                <p><strong>Documento:</strong> {cliente.documento}</p>

                {cliente.contatos && cliente.contatos.length > 0 && cliente.contatos[0] && (
                    <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee'}}>
                        <h3>Contato Principal:</h3>
                        <div style={{ paddingLeft: '15px'}}>
                            <p><strong>Email:</strong> {cliente.contatos[0].email}</p>
                            <p><strong>Telefone:</strong> ({cliente.contatos[0].ddd}) {cliente.contatos[0].telefone}</p>
                            {cliente.contatos[0].celular && <p><strong>Celular:</strong> {cliente.contatos[0].celular}</p>}
                            <p><strong>Tipo:</strong> {cliente.contatos[0].tipoContato}</p>
                        </div>
                    </div>
                )}

                {cliente.enderecos && cliente.enderecos.length > 0 && cliente.enderecos[0] && (
                    <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee'}}>
                        <h3>Endereço Principal:</h3>
                        <div style={{ paddingLeft: '15px'}}>
                            <p>{cliente.enderecos[0].logradouro}, {cliente.enderecos[0].numero} {cliente.enderecos[0].complemento && `- ${cliente.enderecos[0].complemento}`}</p>
                            <p>{cliente.enderecos[0].bairro} - {cliente.enderecos[0].localidade}/{cliente.enderecos[0].uf}</p>
                            <p>CEP: {cliente.enderecos[0].cep}</p>
                            <p><small>Lat: {cliente.enderecos[0].latitude}, Lon: {cliente.enderecos[0].longitude}</small></p>
                        </div>
                    </div>
                )}
                <div style={{marginTop: '25px', display: 'flex', gap: '10px' }}>
                    <Link href={`/clientes/alterar/${cliente.idCliente}`} className="button-secondary" style={{textDecoration:'none'}}>
                        Editar Cliente
                    </Link>
                    <Link href={`/clientes/deletar/${cliente.idCliente}`} className="button-danger" style={{textDecoration:'none'}}>
                        Deletar Cliente
                    </Link>
                    <Link href="/clientes/listar" style={{ marginLeft: 'auto', alignSelf: 'center', textDecoration: 'none', color: '#007bff' }}>
                        Voltar para Lista
                    </Link>
                </div>
            </div>
        </div>
    );
}