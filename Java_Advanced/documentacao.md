# 🛰️ GS Alerta Desastres - Projeto MetaMind

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Global Solution FIAP](https://img.shields.io/badge/Global%20Solution-FIAP%202025-blue)](https://www.fiap.com.br/graduacao/global-solution/)

**Bem-vindo ao GS Alerta Desastres!** Uma aplicação full-stack robusta e interativa, projetada para monitorar eventos de desastres naturais em tempo real e fornecer informações cruciais para usuários cadastrados. Este projeto foi desenvolvido com dedicação pela equipe **MetaMind** para a Global Solution 2025 (1º Semestre) da FIAP.

---

## 🧭 Sumário (Navegação Interna)

- [🛰️ GS Alerta Desastres - Projeto MetaMind](#️-gs-alerta-desastres---projeto-metamind)
  - [🧭 Sumário (Navegação Interna)](#-sumário-navegação-interna)
  - [1. Sobre o Projeto](#1-sobre-o-projeto)
    - [1.1. O Problema](#11-o-problema)
    - [1.2. Nossa Solução](#12-nossa-solução)
    - [1.3. Objetivos](#13-objetivos)
  - [2. ✨ Funcionalidades Principais](#2--funcionalidades-principais)
  - [3. 🛠️ Tecnologias Utilizadas](#3-️-tecnologias-utilizadas)
    - [3.1. Backend (Java/Spring Boot)](#31-backend-javaspring-boot)
    - [3.2. Frontend (Next.js/TypeScript)](#32-frontend-nextjstypescript)
    - [3.3. Banco de Dados](#33-banco-de-dados)
  - [4. 🏗️ Arquitetura da Solução](#4-️-arquitetura-da-solução)
  - [5. 🚀 Como Executar o Projeto](#5--como-executar-o-projeto)
    - [5.1. Pré-requisitos](#51-pré-requisitos)
    - [5.2. Configuração do Backend](#52-configuração-do-backend)
    - [5.3. Configuração do Frontend](#53-configuração-do-frontend)
  - [6. 🔗 Endpoints da API](#6--endpoints-da-api)
  - [7. 🗺️ Navegação no Frontend](#7-️-navegação-no-frontend)
    - [7.1. Estrutura de Rotas](#71-estrutura-de-rotas)
    - [7.2. Layouts e Navegação Principal](#72-layouts-e-navegação-principal)
    - [7.3. Principais Seções da UI e Como Navegar](#73-principais-seções-da-ui-e-como-navegar)
  - [8. 📂 Estrutura Simplificada do Projeto](#8--estrutura-simplificada-do-projeto)
    - [8.1. Backend (`gsapi` ou similar)](#81-backend-gsapi-ou-similar)
    - [8.2. Frontend (raiz do projeto Next.js)](#82-frontend-raiz-do-projeto-nextjs)
  - [9. 🧑‍💻 Equipe MetaMind](#9--equipe-metamind)
  - [10. 🌐 Links Úteis](#10--links-úteis)
  - [11. 🤝 Como Contribuir](#11--como-contribuir)
  - [12. 📜 Licença](#12--licença)

---

## 1. Sobre o Projeto

### 1.1. O Problema

Desastres naturais representam uma ameaça crescente e constante para comunidades em todo o mundo. A falta de informação centralizada, alertas ágeis e ferramentas de fácil acesso para o público geral e para gestores de crise pode agravar os impactos desses eventos, resultando em perdas de vidas e danos materiais significativos.

### 1.2. Nossa Solução

O **GS Alerta Desastres** surge como uma resposta tecnológica a este desafio. Nossa plataforma visa:
* **Centralizar informações:** Agregando dados de eventos de desastres naturais da API EONET (Earth Observatory Natural Event Tracker) da NASA.
* **Facilitar o acesso:** Através de uma interface web intuitiva, os usuários podem se cadastrar, visualizar eventos em mapas, consultar estatísticas e (em desenvolvimentos futuros) receber alertas personalizados.
* **Promover a prevenção:** Ao disponibilizar dados históricos e atuais, buscamos auxiliar na conscientização e no planejamento para mitigação de riscos.

### 1.3. Objetivos

* Desenvolver uma aplicação full-stack funcional e escalável.
* Integrar com sucesso a API EONET da NASA para obtenção de dados sobre desastres.
* Permitir o cadastro e gerenciamento de usuários interessados nos alertas.
* Apresentar os dados de forma clara e útil, utilizando mapas interativos e gráficos estatísticos.
* Criar uma base sólida para futuras implementações, como um sistema de notificação de alertas.

---

## 2. ✨ Funcionalidades Principais

O sistema conta com um conjunto de funcionalidades robustas para atender aos seus objetivos:

* 👥 **Gerenciamento de Usuários:**
    * Permite o cadastro completo de usuários, incluindo dados pessoais, de contato e múltiplos endereços.
    * Interface administrativa para listar, visualizar detalhes, atualizar, pesquisar e remover usuários do sistema.
    * Validações de dados para garantir a integridade das informações.

* 🌋 **Painel de Desastres EONET:**
    * **Sincronização com a NASA:** Funcionalidade para buscar os eventos mais recentes ou de períodos específicos da API EONET da NASA e armazená-los localmente.
    * **Listagem de Eventos Locais:** Visualização paginada de todos os eventos de desastres que foram sincronizados e estão armazenados no banco de dados da aplicação.
    * **Busca Direta na API da NASA:** Permite consultar eventos diretamente na API EONET por critérios como proximidade geográfica (latitude, longitude, raio), intervalo de datas, status do evento e fonte.

* 🗺️ **Visualização em Mapas Interativos (Leaflet):**
    * **Mapa de Eventos Locais:** Exibe no mapa todos os eventos de desastres que estão armazenados no banco de dados local e que possuem coordenadas geográficas válidas.
    * **Mapa de Eventos Atuais/Por Data (NASA):** Exibe no mapa os resultados da busca direta na API da NASA, permitindo visualizar o evento global mais recente ou múltiplos eventos de um período específico.
    * **Pop-ups Detalhados:** Ao clicar em um marcador no mapa, um pop-up exibe informações relevantes sobre o evento (título, data, categoria).

* 📊 **Estatísticas de Desastres (Chart.js):**
    * Apresentação de dados consolidados sobre os eventos EONET armazenados localmente.
    * **Gráficos de Contagem por Categoria:** Exibe o número de eventos por tipo de desastre (ex: Incêndios Florestais, Tempestades Severas) em formato de gráfico de barras e pizza.
    * **Filtro de Período Expansivo:** Permite ao usuário selecionar o período para a análise estatística, variando de 30 dias até 50 anos, oferecendo uma visão temporal ampla.

* 📞 **Página de Contato:**
    * Apresentação da equipe de desenvolvimento (MetaMind).
    * Links para os perfis GitHub dos membros.
    * Formulário de contato (simulado) para feedback ou dúvidas.
    * Mapa interativo mostrando a localização da FIAP (campus Paulista).

---

## 3. 🛠️ Tecnologias Utilizadas

A aplicação foi desenvolvida utilizando uma arquitetura moderna e tecnologias consolidadas no mercado:

### 3.1. Backend (Java/Spring Boot)

* ☕ **Java 17+:** Linguagem de programação principal, conhecida por sua robustez, portabilidade e vasto ecossistema.
* 🍃 **Spring Boot 3+:** Framework que acelera e simplifica o desenvolvimento de aplicações Java, fornecendo configuração automática, servidor embutido e um ecossistema completo de módulos:
    * **Spring Web (MVC):** Utilizado para construir a API RESTful, definindo controllers, endpoints e tratando requisições HTTP.
    * **Spring Data JPA:** Facilita a camada de persistência, permitindo a interação com o banco de dados de forma simplificada através de repositórios e mapeamento objeto-relacional.
    * **Spring Cache (com Caffeine):** Implementado para otimizar o desempenho, armazenando em cache os resultados de consultas frequentes e reduzindo a carga no banco de dados.
* 🧊 **Hibernate:** Principal implementação da especificação JPA, responsável pelo mapeamento das entidades Java para as tabelas do banco de dados e pela execução das operações de CRUD.
* 🔄 **MapStruct:** Biblioteca de mapeamento de beans que gera código de mapeamento entre DTOs (Data Transfer Objects) e Entidades JPA de forma eficiente e em tempo de compilação, evitando boilerplate.
* 📜 **Jackson:** Utilizada para converter objetos Java em JSON e vice-versa, essencial para a comunicação em APIs REST.
* 📖 **Springdoc OpenAPI (Swagger):** Integrado para gerar automaticamente a documentação interativa da API, permitindo que os desenvolvedores e usuários explorem e testem os endpoints facilmente.
* 🌐 **RestTemplate / WebClient:** Ferramentas do Spring para realizar chamadas HTTP a serviços externos, como a API ViaCEP (consulta de CEPs), Google Geocoding API (obtenção de coordenadas) e NASA EONET API (dados de desastres).
* 📝 **Slf4j (com Logback):** Fachada de logging utilizada para registrar eventos e informações importantes da aplicação, auxiliando na depuração e monitoramento.
* ✅ **Jakarta Bean Validation:** Utilizada para aplicar validações nos dados de entrada (DTOs) e nas entidades, garantindo a integridade e consistência dos dados.
* 🤖 **Lombok:** Biblioteca que ajuda a reduzir a verbosidade do código Java através de anotações (ex: `@Getter`, `@Setter`, `@Data`, `@Builder`).

### 3.2. Frontend (Next.js/TypeScript)

* NEXT **Next.js 13+ (com App Router):** Framework React para desenvolvimento web que oferece renderização no lado do servidor (SSR), geração de sites estáticos (SSG), roteamento avançado baseado em sistema de arquivos (App Router), e otimizações de performance.
* ⚛️ **React 18+:** Biblioteca JavaScript para a construção de interfaces de usuário componentizadas, reativas e interativas.
* 🇹 **TypeScript:** Superset do JavaScript que adiciona tipagem estática, auxiliando na detecção de erros em tempo de desenvolvimento e melhorando a manutenibilidade e escalabilidade do código frontend.
* 🎨 **CSS (Puro / `globals.css`):** Utilizado para a estilização visual dos componentes e da aplicação como um todo. Estilos inline e objetos de estilo também são usados em componentes específicos.
* 🗺️ **Leaflet:** Biblioteca JavaScript open-source robusta e flexível para a criação de mapas interativos, utilizada para exibir os eventos de desastres geolocalizados.
* 📈 **Chart.js:** Biblioteca para a criação de gráficos dinâmicos e visualmente atraentes, empregada na página de estatísticas para apresentar dados sobre os desastres.
* 🖌️ **Material Icons:** Biblioteca de ícones fornecida pelo Google, utilizada para enriquecer a interface do usuário com elementos visuais intuitivos.
* 🔗 **Fetch API (via `apiService.ts`):** Utilizada para realizar as chamadas assíncronas à API backend, encapsuladas em um módulo de serviço (`apiService.ts`) para melhor organização e reutilização.

### 3.3. Banco de Dados

* 📦 **Oracle Database:** Sistema de Gerenciamento de Banco de Dados Relacional (SGBDR) robusto e amplamente utilizado no mercado, escolhido para armazenar todos os dados persistentes da aplicação, como informações de usuários, seus contatos, endereços e os eventos EONET sincronizados.

---

## 4. 🏗️ Arquitetura da Solução

O projeto segue uma arquitetura cliente-servidor desacoplada:

* **Servidor (Backend):** A API RESTful desenvolvida com Spring Boot atua como o servidor. Ele é responsável por toda a lógica de negócios, processamento de dados, interações com o banco de dados Oracle e comunicação com as APIs externas (NASA, ViaCEP, Google Geocoding). Ele expõe endpoints seguros e bem definidos para o frontend consumir.
* **Cliente (Frontend):** A aplicação desenvolvida com Next.js e React atua como o cliente. Ela consome os dados da API backend para renderizar as interfaces de usuário, permitindo que os usuários interajam com o sistema (visualizar dados, cadastrar informações, etc.). A navegação é gerenciada pelo App Router do Next.js, proporcionando uma experiência de Single Page Application (SPA).

Essa separação de responsabilidades facilita a manutenção, escalabilidade e o desenvolvimento independente de cada camada da aplicação.

---

## 5. 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto "GS Alerta Desastres" em seu ambiente local.

### 5.1. Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas e configuradas:

* ☕ **Java JDK 17** ou superior.
* 📦 **Maven 3.8+** ou **Gradle 7.5+** (o projeto utiliza Maven, conforme `pom.xml` implícito).
* NODE **Node.js v18.17+** (inclui npm; yarn também pode ser usado).
* 🗃️ Uma instância do **Oracle Database** (XE, Standard ou Enterprise) rodando e acessível.
* 🐙 **Git** para clonar o repositório.

### 5.2. Configuração do Backend

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/carmipa/GS_FIAP_2025_1SM.git](https://github.com/carmipa/GS_FIAP_2025_1SM.git)
    cd GS_FIAP_2025_1SM/gsapi # Ajuste se o nome da pasta do backend for diferente
    ```
2.  **Configure o Banco de Dados Oracle:**
    * Certifique-se de que sua instância Oracle está ativa.
    * Crie um usuário/schema dedicado para a aplicação (ex: `gs_user`) com as permissões necessárias (CONNECT, RESOURCE, CREATE VIEW, etc.).
    * Execute o script DDL fornecido no projeto (`Oracle_DDL_GS_AlertaDesastres_SCRIPT.sql`) nesse schema para criar todas as tabelas, sequences e constraints.
    * Abra o arquivo `src/main/resources/application.properties` e atualize as seguintes propriedades com os dados da sua instância Oracle:
        ```properties
        spring.datasource.url=jdbc:oracle:thin:@HOST:PORT:SERVICE_ID_OR_SID
        spring.datasource.username=SEU_USUARIO_ORACLE
        spring.datasource.password=SUA_SENHA_ORACLE
        # Outras propriedades como spring.jpa.hibernate.ddl-auto=validate (recomendado para produção após DDL)
        ```
3.  **Compile e Execute a Aplicação Backend:**
    * Utilizando Maven:
        ```bash
        mvn clean install # Opcional, para garantir um build limpo
        mvn spring-boot:run
        ```
    * A aplicação backend deverá iniciar na porta `8080` (ou a porta configurada). Você verá logs no console indicando a inicialização do Spring Boot.
    * Verifique se a aplicação iniciou corretamente acessando `http://localhost:8080` (pode dar um Whitelabel Error Page se não houver mapping para `/`, o que é normal) ou diretamente o Swagger UI.

### 5.3. Configuração do Frontend

1.  **Navegue até a pasta do frontend:**
    A partir da raiz do repositório clonado:
    ```bash
    cd ../nome-da-pasta-do-frontend # Ex: se o frontend estiver em uma pasta 'gs-alertadesastres-ui' na raiz
    # Se o frontend estiver diretamente na raiz ao lado de 'gsapi', apenas navegue para ele.
    ```
    *Baseado nos arquivos fornecidos, seu frontend está na pasta `src` dentro de uma estrutura Next.js, então o diretório raiz do frontend seria o que contém a pasta `src` e `package.json`.*

2.  **Instale as dependências do projeto:**
    ```bash
    npm install
    # OU, se você utiliza yarn:
    # yarn install
    ```
3.  **Configure a URL da API Backend:**
    * O arquivo `src/lib/apiService.ts` utiliza `process.env.NEXT_PUBLIC_API_URL` ou `http://localhost:8080/api` como padrão.
    * Se o seu backend estiver rodando em uma URL/porta diferente, crie um arquivo `.env.local` na raiz do projeto frontend com o seguinte conteúdo:
        ```env
        NEXT_PUBLIC_API_URL=http://SEU_BACKEND_HOST:PORTA/api
        ```
        Exemplo: `NEXT_PUBLIC_API_URL=http://localhost:8080/api`

4.  **Execute a Aplicação Frontend em Modo de Desenvolvimento:**
    ```bash
    npm run dev
    # OU, se você utiliza yarn:
    # yarn dev
    ```
5.  A aplicação frontend deverá iniciar na porta `3000` (ou outra porta disponível, que será indicada no console). Acesse `http://localhost:3000` no seu navegador.

---

## 6. 🔗 Endpoints da API

A API RESTful do backend é a espinha dorsal da comunicação de dados entre o frontend e o servidor.

✅ **Fonte Primária da Documentação:** A documentação mais completa, interativa e sempre atualizada dos endpoints está disponível através do **Swagger UI**. Com o backend em execução, acesse:
* [`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html)

O Swagger UI permite visualizar todos os endpoints, seus métodos HTTP (GET, POST, PUT, DELETE), parâmetros de requisição (path, query, body), e os schemas dos DTOs de requisição e resposta. Você também pode testar os endpoints diretamente pela interface do Swagger.

**Resumo dos Grupos de Endpoints:**

* **`/api/clientes` (ou `/api/usuarios`)**:
    * Funcionalidade: Gerenciamento completo (CRUD) dos dados de usuários cadastrados.
    * Exemplo: `POST /api/clientes` com `ClienteRequestDTO` no corpo para criar um novo usuário.

* **`/api/contatos`**:
    * Funcionalidade: Gerenciamento dos dados de contato associados aos usuários.
    * Exemplo: `GET /api/contatos/{id}` para buscar um contato específico.

* **`/api/enderecos`**:
    * Funcionalidade: Gerenciamento dos endereços dos usuários e serviços auxiliares de geolocalização.
    * Exemplo: `GET /api/enderecos/consultar-cep/{cep}` para obter dados de um CEP via ViaCEP. `POST /api/enderecos/calcular-coordenadas` para geocodificar um endereço.

* **`/api/eonet`**:
    * Funcionalidade: Manipulação e consulta de eventos de desastres naturais da NASA EONET.
    * Exemplo: `POST /api/eonet/nasa/sincronizar` para buscar e salvar novos eventos da NASA. `GET /api/eonet/nasa/proximos` para buscar eventos diretamente da API da NASA com filtros.

* **`/api/stats`**:
    * Funcionalidade: Fornecimento de dados estatísticos sobre os eventos de desastres.
    * Exemplo: `GET /api/stats/eonet/count-by-category?days=365` para obter a contagem de eventos por categoria no último ano.

---

## 7. 🗺️ Navegação no Frontend

A interface do usuário foi construída com Next.js e React, utilizando o **App Router** para uma navegação moderna e eficiente.

### 7.1. Estrutura de Rotas

O App Router do Next.js define as rotas com base na estrutura de pastas dentro de `src/app`. Cada pasta representa um segmento de URL, e um arquivo `page.tsx` dentro dela define o conteúdo da rota.

* `/`: Página inicial (`src/app/page.tsx`).
* `/clientes/listar`: Listagem de usuários (`src/app/clientes/listar/page.tsx`).
* `/clientes/cadastrar`: Formulário de cadastro de novo usuário (`src/app/clientes/cadastrar/page.tsx`).
* `/clientes/[id]`: Detalhes de um usuário específico (`src/app/clientes/[id]/page.tsx`).
* `/desastres`: Painel principal de desastres (`src/app/desastres/page.tsx`).
* `/desastres/mapa`: Mapa de eventos locais (`src/app/desastres/mapa/page.tsx`).
* `/desastres/mapa-atuais`: Mapa de eventos da API da NASA (`src/app/desastres/mapa-atuais/page.tsx`).
* `/desastres/estatisticas`: Estatísticas de desastres (`src/app/desastres/estatisticas/page.tsx`).
* `/contato`: Página de contato da equipe (`src/app/contato/page.tsx`).

### 7.2. Layouts e Navegação Principal

* **Layout Raiz (`src/app/layout.tsx`):** Define a estrutura HTML global, incluindo a barra de navegação principal (navbar) que é visível em todas as páginas. Esta navbar contém links para:
    * **Home (`/`)** (tanto pelo logo quanto pelo link "Home")
    * **Usuários (`/clientes/listar`)**
    * **Desastres EONET (`/desastres`)**
    * **Fale Conosco (`/contato`)**

* **Layouts de Seção:**
    * `src/app/clientes/layout.tsx`: Provê uma sub-navegação para a seção "Usuários" (Listar, Cadastrar, Buscar).
    * `src/app/desastres/layout.tsx`: Provê uma sub-navegação para a seção "Desastres EONET" (Painel, Mapas, Estatísticas).
    * `src/app/contato/layout.tsx`: Layout específico que pode incluir, por exemplo, a importação de CSS do Leaflet se o mapa só for usado lá.

* **Componente `<Link>`:** A navegação entre páginas é otimizada pelo componente `<Link>` do Next.js, que permite transições rápidas no lado do cliente sem recarregar a página inteira.

### 7.3. Principais Seções da UI e Como Navegar

1.  🏠 **Página Inicial (`/`):**
    * Ponto de partida com uma introdução ao projeto.
    * Apresenta "Cards de Funcionalidades" para acesso rápido às seções de "Gerenciar Usuários", "Painel de Desastres" e "Fale Conosco".
    * Contém links diretos para o repositório GitHub do projeto e para a página da Global Solution FIAP.

2.  👤 **Seção de Usuários (acessada por `/clientes/listar`):**
    * Use a sub-navegação para "Listar Usuários", "Cadastrar Usuário" ou "Buscar Usuário".
    * Na listagem, cada usuário possui ações para "Ver" detalhes, "Editar" ou "Deletar".

3.  🌋 **Seção de Desastres EONET (acessada por `/desastres`):**
    * **Painel EONET:** Permite listar eventos locais, iniciar a sincronização de novos dados da NASA e realizar buscas por proximidade na API da NASA.
    * **Mapa de Eventos (Locais):** Visualiza os eventos armazenados localmente em um mapa interativo.
    * **Mapa Atuais (NASA):** Busca e exibe eventos recentes ou por período diretamente da API da NASA em um mapa.
    * **Estatísticas:** Apresenta gráficos de barras e pizza sobre a frequência de eventos por categoria, com um seletor de período abrangente.

4.  📞 **Página Fale Conosco (acessada por `/contato`):**
    * Exibe informações sobre a equipe MetaMind, um formulário de contato simulado, e um mapa com a localização da FIAP Paulista.

---

## 8. 📂 Estrutura Simplificada do Projeto

Uma visão geral das principais pastas para facilitar a localização dos artefatos:

### 8.1. Backend (`gsapi` ou similar)

gsapi/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── br/com/fiap/gs/gsapi/
│   │   │       ├── GsapiApplication.java  # Ponto de entrada Spring Boot
│   │   │       ├── client/                # Clientes HTTP para APIs externas
│   │   │       ├── config/                # Configurações (App, CORS, OpenAPI)
│   │   │       ├── controller/            # API Endpoints (REST Controllers)
│   │   │       ├── dto/                   # Data Transfer Objects
│   │   │       ├── exception/             # Handlers de exceção
│   │   │       ├── mapper/                # Mappers (MapStruct)
│   │   │       ├── model/                 # Entidades JPA
│   │   │       ├── repository/            # Repositórios Spring Data JPA
│   │   │       └── service/               # Lógica de negócios
│   │   └── resources/
│   │       ├── application.properties     # Configurações da aplicação
│   │       └── Oracle_DDL_GS_AlertaDesastres_SCRIPT.sql # Script DDL do banco (deve estar aqui ou em local de fácil acesso)
├── pom.xml                            # (Se Maven) ou build.gradle (Se Gradle)

### 8.2. Frontend (raiz do projeto Next.js)

frontend-gs-alerta-desastres/ # Exemplo de nome da pasta raiz do frontend
├── public/                      # Arquivos estáticos (imagens, favicon)
├── src/
│   ├── app/                     # App Router: Define rotas e páginas
│   │   ├── layout.tsx           # Layout Raiz Global
│   │   ├── page.tsx             # Página Inicial (Home)
│   │   ├── globals.css          # Estilos Globais
│   │   ├── clientes/            # Seção de Usuários
│   │   │   ├── layout.tsx       # Layout da seção Usuários
│   │   │   ├── listar/
│   │   │   │   └── page.tsx     # Página de listagem
│   │   │   └── ...              # Outras páginas (cadastrar, [id], etc.)
│   │   ├── desastres/           # Seção de Desastres
│   │   │   ├── layout.tsx       # Layout da seção Desastres
│   │   │   └── ...
│   │   └── contato/             # Seção de Contato
│   │       └── page.tsx
│   ├── components/              # Componentes React reutilizáveis (ex: Mapas)
│   └── lib/                     # Funções utilitárias, API service, tipos
│       ├── apiService.ts        # Lógica para chamadas à API backend
│       └── types.ts             # Definições de tipos TypeScript
├── package.json                 # Dependências e scripts do projeto Node.js
├── next.config.js               # Configurações do Next.js (se houver customizações)
└── tsconfig.json                # Configurações do TypeScript


---

## 9. 🧑‍💻 Equipe MetaMind

Este projeto foi concebido e desenvolvido pela equipe MetaMind:

* **Arthur Bispo de Lima** - RM: 557568
    * 🐙 GitHub: [ArthurBispo00](https://github.com/ArthurBispo00)
* **João Paulo Moreira** - RM: 557808
    * 🐙 GitHub: [joao1015](https://github.com/joao1015)
* **Paulo André Carminati** - RM: 557881
    * 🐙 GitHub: [carmipa](https://github.com/carmipa)

---

## 10. 🌐 Links Úteis

* 🐙 **Repositório do Projeto GS Alerta Desastres:** [https://github.com/carmipa/GS_FIAP_2025_1SM](https://github.com/carmipa/GS_FIAP_2025_1SM)
* 🎓 **Página Oficial da Global Solution FIAP:** [https://www.fiap.com.br/graduacao/global-solution/](https://www.fiap.com.br/graduacao/global-solution/)

---

## 11. 🤝 Como Contribuir

Contribuições para o projeto são bem-vindas! Se você tem sugestões, correções de bugs ou novas funcionalidades que gostaria de adicionar:

1.  Faça um **Fork** deste repositório.
2.  Crie uma nova **Branch** para sua feature (`git checkout -b feature/MinhaNovaFeature`).
3.  Faça **Commit** das suas alterações (`git commit -m 'Adiciona MinhaNovaFeature'`).
4.  Faça **Push** para a Branch (`git push origin feature/MinhaNovaFeature`).
5.  Abra um **Pull Request**.

Por favor, tente manter a consistência do código e adicione testes se aplicável.

---

## 12. 📜 Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo `LICENSE.md` na raiz do repositório para mais detalhes. (Você precisará criar um arquivo `LICENSE.md` se desejar incluir o texto completo da licença).
