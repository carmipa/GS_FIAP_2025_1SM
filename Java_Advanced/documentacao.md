# 🛰️ GS Alerta Desastres - Projeto MetaMind

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Global Solution FIAP](https://img.shields.io/badge/Global%20Solution-FIAP%202025-blue)](https://www.fiap.com.br/graduacao/global-solution/)

**Bem-vindo ao GS Alerta Desastres!** Uma aplicação full-stack robusta e interativa, projetada para monitorar eventos de desastres naturais em tempo real, fornecer informações cruciais e permitir o disparo de alertas para usuários cadastrados. Este projeto foi desenvolvido com dedicação pela equipe **MetaMind** para a Global Solution 2025 (1º Semestre) da FIAP.

---

## 🧭 Sumário (Navegação Interna)

- [🛰️ GS Alerta Desastres - Projeto MetaMind](#️-gs-alerta-desastres---projeto-metamind)
  - [🧭 Sumário (Navegação Interna)](#-sumário-navegação-interna)
  - [1. Sobre o Projeto](#1-sobre-o-projeto)
    - [1.1. O Problema](#11-o-problema)
    - [1.2. Nossa Solução](#12-nossa-solução)
    - [1.3. Objetivos](#13-objetivos)
  - [2. ✨ Funcionalidades Implementadas](#2--funcionalidades-implementadas)
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
  - [7. 🗺️ Manual de Funcionamento e Navegação no Frontend](#7-️-manual-de-funcionamento-e-navegação-no-frontend)
    - [7.1. Visão Geral da Interface](#71-visão-geral-da-interface)
    - [7.2. Página Inicial (`/`)](#72-página-inicial-)
    - [7.3. Seção de Usuários (`/clientes/...`)](#73-seção-de-usuários-clientes)
    - [7.4. Seção de Desastres EONET (`/desastres/...`)](#74-seção-de-desastres-eonet-desastres)
      - [7.4.1. Aba: Eventos Locais (Dentro do Painel EONET em `/desastres`)](#741-aba-eventos-locais-dentro-do-painel-eonet-em-desastres)
      - [7.4.2. Aba: Sincronizar NASA (Dentro do Painel EONET em `/desastres`)](#742-aba-sincronizar-nasa-dentro-do-painel-eonet-em-desastres)
      - [7.4.3. Aba: Buscar Próximos (Eventos NASA) (Dentro do Painel EONET em `/desastres`)](#743-aba-buscar-próximos-eventos-nasa-dentro-do-painel-eonet-em-desastres)
      - [7.4.4. Aba: Alertar Usuário (Dentro do Painel EONET em `/desastres`)](#744-aba-alertar-usuário-dentro-do-painel-eonet-em-desastres)
      - [7.4.5. Página: Mapa de Eventos Locais (`/desastres/mapa`)](#745-página-mapa-de-eventos-locais-desastresmapa)
      - [7.4.6. Página: Mapa Atuais/Por Data (NASA) (`/desastres/mapa-atuais`)](#746-página-mapa-atuaispor-data-nasa-desastresmapa-atuais)
      - [7.4.7. Página: Estatísticas de Desastres (`/desastres/estatisticas`)](#747-página-estatísticas-de-desastres-desastresestatisticas)
    - [7.5. Página Fale Conosco (`/contato`)](#75-página-fale-conosco-contato)
  - [8. 📂 Estrutura Simplificada do Projeto](#8--estrutura-simplificada-do-projeto)
    - [8.1. Backend (`gsapi/`)](#81-backend-gsapi)
    - [8.2. Frontend (Raiz do projeto Next.js)](#82-frontend-raiz-do-projeto-nextjs)
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
* **Facilitar o acesso:** Através de uma interface web intuitiva, os usuários podem se cadastrar, visualizar eventos em mapas e consultar estatísticas.
* **Alertas Direcionados:** Implementa um sistema para o disparo de notificações (atualmente configurado para e-mail, com infraestrutura para expansão para SMS/WhatsApp) para usuários específicos sobre eventos relevantes próximos à sua localização ou de interesse.
* **Promover a prevenção:** Ao disponibilizar dados históricos e atuais, buscamos auxiliar na conscientização e no planejamento para mitigação de riscos.

### 1.3. Objetivos
* Desenvolver uma aplicação full-stack funcional e escalável.
* Integrar com sucesso a API EONET da NASA para obtenção de dados sobre desastres.
* Permitir o cadastro e gerenciamento de **Usuários** (substituindo o termo "Clientes" para melhor clareza).
* Apresentar os dados de forma clara e útil, utilizando mapas interativos e múltiplos formatos de gráficos estatísticos.
* Implementar um sistema de alerta por e-mail que pode ser acionado tanto contextualmente (após uma busca de eventos próximos por um usuário) quanto manualmente por um administrador.

---

## 2. ✨ Funcionalidades Implementadas

O sistema evoluiu e agora conta com:

* 👥 **Gerenciamento de Usuários:** (Anteriormente "Clientes")
    * CRUD completo para usuários, incluindo dados pessoais, de contato e múltiplos endereços.
    * Busca de usuários por ID ou Documento (CPF/CNPJ) com feedback visual aprimorado e funcional.
    * Interface administrativa para listar, visualizar detalhes, atualizar, pesquisar e remover usuários do sistema.
    * Validações de dados para garantir a integridade das informações.

* 🌋 **Painel de Desastres EONET (Aba Principal `/desastres`):**
    * **Eventos Locais:** Listagem paginada de eventos EONET sincronizados no banco de dados local.
    * **Sincronizar NASA:** Formulário para buscar e salvar/atualizar eventos da API EONET da NASA no banco local, com filtros por limite, dias, status e fonte.
    * **Buscar Próximos (Eventos NASA):**
        * Formulário para buscar eventos diretamente da API EONET da NASA com base em coordenadas geográficas, ID de usuário (para obter suas coordenadas), ou por intervalo de datas.
        * **Exibição do nome do usuário:** Ao buscar coordenadas por ID, o nome do usuário correspondente é exibido na tela para confirmação.
        * **Disparo de alerta contextual:** Se um ID de usuário foi utilizado e eventos são encontrados próximos a ele, o sistema aciona o backend para enviar um alerta (atualmente por e-mail, mas a configuração do servidor SMTP precisa ser finalizada para envios reais) para esse usuário específico sobre o evento principal encontrado. Mensagens de feedback sobre o processo de alerta são exibidas.
    * **Alertar Usuário (Nova Aba):**
        * Interface dedicada para um administrador disparar manualmente um alerta por e-mail para um usuário específico sobre um evento EONET específico (que deve estar previamente sincronizado no banco local).
        * **Verificação de Dados:** Campos para inserir "ID do Usuário" e "ID do Evento EONET". Botões "Verificar Usuário" e "Verificar Evento" buscam e exibem detalhes do usuário (nome, e-mail principal) e do evento (título, data) na tela antes do envio, permitindo confirmação.
        * **Envio Controlado:** O botão "Enviar Alerta ao Usuário Verificado" só é habilitado após a verificação bem-sucedida de ambos, usuário e evento. O envio real do e-mail depende da configuração correta do servidor SMTP no backend.

* 🗺️ **Visualização em Mapas Interativos (Leaflet):**
    * **Mapa de Eventos Locais (`/desastres/mapa`):** Exibe no mapa todos os eventos EONET armazenados localmente com coordenadas válidas, ajustando automaticamente o zoom para mostrar todos os marcadores.
    * **Mapa Atuais/Por Data (NASA) (`/desastres/mapa-atuais`):** Busca e exibe no mapa o evento global mais recente da EONET ou eventos dentro de um intervalo de datas especificado pelo usuário. Exibe detalhes do evento único em foco.

* 📊 **Estatísticas de Desastres (Chart.js) (`/desastres/estatisticas`):**
    * Apresentação de dados consolidados sobre os eventos EONET armazenados localmente.
    * **Variedade de Gráficos:**
        * **Barras Verticais:** Eventos por categoria, com eixo Y em escala logarítmica para melhor visualização de dados com grandes disparidades.
        * **Barras Horizontais:** Alternativa ao vertical, também com eixo de valor em escala logarítmica.
        * **Pizza:** Distribuição percentual. Tooltips exibem contagem e porcentagem. Fatias menores que 5% do total são "explodidas" (destacadas) para melhor visibilidade.
        * **Rosca (Doughnut):** Similar ao de Pizza, com as mesmas melhorias de tooltip e destaque de fatias.
        * **Área Polar:** Apresentação radial da contagem de eventos por categoria. Tooltips com contagem e porcentagem.
    * **Filtro de Período Expansivo:** Seleção de período de 30 dias a 50 anos para análise.

* 📞 **Página de Contato (`/contato`):**
    * Apresentação da equipe MetaMind com **fotos individuais**, RMs, e-mails, links do GitHub e turmas.
    * Layout dos cards de membros da equipe aprimorado para melhor alinhamento.
    * Formulário de contato simulado.
    * Mapa interativo com a localização da FIAP.

* 🏠 **Navegação Aprimorada:**
    * Link "Home" explícito na barra de navegação principal para fácil retorno à página inicial.
    * Sub-navegação clara e funcional dentro das seções "Usuários" e "Desastres EONET".

---

## 3. 🛠️ Tecnologias Utilizadas

### 3.1. Backend (Java/Spring Boot)
* ☕ **Java 17+**
* 🍃 **Spring Boot 3+** (Spring Web, Spring Data JPA, Spring Cache, **Spring Boot Starter Mail**)
* 🧊 **Hibernate**
* 🔄 **MapStruct**
* 📜 **Jackson**
* 📖 **Springdoc OpenAPI (Swagger)**
* 🌐 **RestTemplate / WebClient**
* 📝 **Slf4j (Logback)**
* ✅ **Jakarta Bean Validation**
* 🤖 **Lombok**

### 3.2. Frontend (Next.js/TypeScript)
* NEXT **Next.js 15+ (App Router)**
* ⚛️ **React 18+**
* 🇹 **TypeScript**
* 🎨 **Tailwind CSS** (para classes utilitárias) e **CSS Global** (`globals.css` com variáveis CSS)
* 🗺️ **Leaflet** e **React-Leaflet**
* 📈 **Chart.js** e **React-Chartjs-2**
* 🖼️ **Next/Image** (para otimização de imagens)
* 🖌️ **Material Icons**, **Lucide-React Icons**, **React-Icons (Font Awesome)**
* 🔗 **Fetch API** (via `apiService.ts`)

### 3.3. Banco de Dados
* 📦 **Oracle Database**

---

## 4. 🏗️ Arquitetura da Solução
O projeto segue uma arquitetura cliente-servidor:
* **Servidor (Backend):** A API RESTful desenvolvida com Spring Boot atua como o servidor. Ele é responsável por toda a lógica de negócios, processamento de dados, interações com o banco de dados Oracle e comunicação com as APIs externas (NASA EONET, ViaCEP, Google Geocoding). Ele expõe endpoints seguros e bem definidos para o frontend consumir, incluindo um novo endpoint para o disparo de alertas específicos.
* **Cliente (Frontend):** A aplicação desenvolvida com Next.js e React atua como o cliente. Ela consome os dados da API backend para renderizar as interfaces de usuário, permitindo que os usuários interajam com o sistema. A navegação é gerenciada pelo App Router do Next.js.

---

## 5. 🚀 Como Executar o Projeto
### 5.1. Pré-requisitos
* ☕ Java JDK 17+
* 📦 Maven 3.8+
* NODE Node.js v18.17+
* 🗃️ Instância do Oracle Database configurada e acessível.
* 🐙 Git

### 5.2. Configuração do Backend
1.  Clone o repositório: `git clone https://github.com/carmipa/GS_FIAP_2025_1SM.git`
2.  Navegue para a pasta do backend: `cd GS_FIAP_2025_1SM/gsapi` (ou o nome correto da sua pasta backend).
3.  **Banco de Dados:**
    * Garanta que o Oracle esteja rodando.
    * Crie o usuário/schema e execute o script DDL (`Oracle_DDL_GS_AlertaDesastres_SCRIPT.sql`) fornecido.
    * Configure `src/main/resources/application.properties` com suas credenciais do Oracle.
    * **Para envio de e-mail (funcionalidade de alerta):** Configure as propriedades `spring.mail.*` (host, port, username, password/senha de app) para seu servidor SMTP (ex: Gmail com Senha de App, SendGrid, etc.). Sem essa configuração, a tentativa de envio de e-mail resultará em erro de autenticação no log do backend, mas a lógica da aplicação até esse ponto funcionará.
4.  **Dependências Maven:**
    * Certifique-se que a dependência `spring-boot-starter-mail` está no `pom.xml` para a funcionalidade de e-mail.
5.  Compile e execute: `mvn spring-boot:run`
    * API em `http://localhost:8080`. Swagger em `/swagger-ui.html`.

### 5.3. Configuração do Frontend
1.  Navegue para a pasta do frontend (ex: `cd ../gs-frontend`).
2.  Instale dependências: `npm install` (ou `yarn install`).
3.  **Variável de Ambiente:** Se necessário, crie `.env.local` na raiz do frontend e defina `NEXT_PUBLIC_API_URL=http://localhost:8080/api`.
4.  **Imagens da Equipe:** Coloque as fotos dos membros da equipe na pasta `public/fotos-equipe/` (ex: `paulo.jpg`, `arthur.jpg`, `joao.jpg`). Os nomes dos arquivos devem corresponder aos definidos no componente da página de contato.
5.  Execute: `npm run dev`
    * Aplicação em `http://localhost:3000`.

---

## 6. 🔗 Endpoints da API
Acesse a documentação interativa completa via **Swagger UI**:
[`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html) (com o backend rodando).

Principais grupos de endpoints:
* `/api/clientes` (ou `/api/usuarios`): Gerenciamento de usuários.
* `/api/contatos`: Gerenciamento de contatos.
* `/api/enderecos`: Gerenciamento de endereços e geolocalização.
* `/api/eonet`: Operações com eventos EONET (incluindo busca local por ID da API: `GET /api/eonet/api-id/{eonetApiId}`).
* `/api/stats`: Dados para gráficos de estatísticas.
* `/api/alerts`: Endpoints para disparo de alertas (ex: `POST /api/alerts/trigger-user-specific-alert`).

---

## 7. 🗺️ Manual de Funcionamento e Navegação no Frontend

### 7.1. Visão Geral da Interface
A aplicação possui uma barra de navegação superior persistente com links para "Home", "Usuários", "Desastres EONET" e "Fale Conosco". As seções "Usuários" e "Desastres EONET" possuem uma sub-navegação interna (geralmente em abas ou links secundários) para suas funcionalidades específicas.

### 7.2. Página Inicial (`/`)
* **Acesso:** `http://localhost:3000` ou clicando no logo/link "Home".
* **Conteúdo:** Introdução ao projeto, cards para acesso rápido a "Gerenciar Usuários", "Painel de Desastres" e "Fale Conosco". Links para o GitHub do projeto e para a página da Global Solution FIAP.

### 7.3. Seção de Usuários (`/clientes/...`)
* **Acesso:** Link "Usuários" na navbar principal.
* **Sub-Navegação:**
    * **Listar Usuários (`/clientes/listar`):** Exibe lista paginada de usuários. Ações: Ver detalhes, Editar, Deletar (com modal de confirmação).
    * **Cadastrar Usuário (`/clientes/cadastrar`):** Formulário para novos usuários.
    * **Buscar Usuário (`/clientes/buscar`):** Busca por ID ou Documento. Redireciona para detalhes se encontrado.

### 7.4. Seção de Desastres EONET (`/desastres/...`)
* **Acesso:** Link "Desastres EONET" na navbar principal. A página principal (`/desastres`) é o "Painel EONET" organizado em abas.
* **Sub-Navegação (Layout):** Links "Painel EONET", "Mapa de Eventos (Locais)", "Mapa Atuais (NASA)", "Estatísticas" levam para as respectivas páginas.

#### 7.4.1. Aba: Eventos Locais (Dentro do Painel EONET em `/desastres`)
* **Funcionalidade:** Lista eventos EONET do banco de dados local.
* **Uso:** Visualizar eventos sincronizados, com paginação.

#### 7.4.2. Aba: Sincronizar NASA (Dentro do Painel EONET em `/desastres`)
* **Funcionalidade:** Busca e salva eventos da API EONET da NASA.
* **Uso:** Preencha filtros (limite, dias, status, fonte) e clique em "Iniciar Sincronização".

#### 7.4.3. Aba: Buscar Próximos (Eventos NASA) (Dentro do Painel EONET em `/desastres`)
* **Funcionalidade:** Busca eventos na API da NASA por proximidade ou período e pode disparar alerta.
* **Uso:**
    1.  Opcional: Insira "ID do Usuário", clique "Buscar Coords". O nome do usuário e suas coordenadas (do endereço principal) serão exibidos.
    2.  Preencha/ajuste Latitude, Longitude, Raio.
    3.  Clique "Buscar Eventos Próximos".
    4.  Se um ID de usuário foi usado e eventos são achados, um alerta por e-mail é solicitado ao backend. Feedback é exibido.
    5.  Lista de eventos encontrados aparece abaixo.

#### 7.4.4. Aba: Alertar Usuário (Dentro do Painel EONET em `/desastres`)
* **Funcionalidade:** Dispara manualmente um alerta para um usuário sobre um evento EONET específico (que deve existir no banco local).
* **Uso:**
    1.  Insira "ID do Usuário a ser Alertado", clique "Verificar Usuário". Nome e e-mail do usuário são exibidos.
    2.  Insira "ID do Evento EONET", clique "Verificar Evento". Título e data do evento são exibidos. (O evento precisa estar sincronizado no banco local).
    3.  Se ambos verificados, o botão "Enviar Alerta ao Usuário Verificado" é habilitado. Clique para disparar a notificação (e-mail). Feedback da operação é exibido.

#### 7.4.5. Página: Mapa de Eventos Locais (`/desastres/mapa`)
* **Acesso:** Pela sub-navegação da seção "Desastres EONET".
* **Funcionalidade:** Mapa Leaflet com marcadores de eventos EONET locais.

#### 7.4.6. Página: Mapa Atuais/Por Data (NASA) (`/desastres/mapa-atuais`)
* **Acesso:** Pela sub-navegação da seção "Desastres EONET".
* **Funcionalidade:** Mapa Leaflet que exibe o evento global mais recente da NASA ou eventos por período. Detalhes do evento em foco são mostrados.

#### 7.4.7. Página: Estatísticas de Desastres (`/desastres/estatisticas`)
* **Acesso:** Pela sub-navegação da seção "Desastres EONET".
* **Funcionalidade:** Vários tipos de gráficos (Barras Verticais/Horizontais com escala logarítmica, Pizza, Rosca, Área Polar) mostrando contagem de eventos por categoria. Tooltips com contagem e porcentagem. Filtro de período de 30 dias a 50 anos.

### 7.5. Página Fale Conosco (`/contato`)
* **Acesso:** Link "Fale Conosco" na navbar principal.
* **Conteúdo:** Fotos e informações da equipe MetaMind, formulário de contato simulado, mapa da FIAP.

---

## 8. 📂 Estrutura Simplificada do Projeto
### 8.1. Backend (`gsapi/`)
-   `gsapi/`
    -   `src/main/java/br/com/fiap/gs/gsapi/`
        -   `GsapiApplication.java`
        -   `client/`
        -   `config/`
        -   `controller/`
            -   `alert/AlertTriggerController.java` (Novo)
        -   `dto/`
            -   `alert/` (Novo: `AlertableEventDTO.java`, `UserAlertRequestDTO.java`)
        -   `exception/`
        -   `mapper/`
        -   `model/`
        -   `repository/`
        -   `service/`
            -   `alert/UserSpecificAlertService.java` (Novo)
            -   `notification/EmailNotificationService.java` (Novo)
    -   `src/main/resources/`
        -   `application.properties`
    -   `pom.xml`

### 8.2. Frontend (Raiz do projeto Next.js)
-   `gs-frontend/` (ou nome similar)
    -   `public/`
        -   `fotos-equipe/` (para fotos dos membros)
    -   `src/`
        -   `app/`
            -   `layout.tsx`
            -   `page.tsx` (Home)
            -   `globals.css`
            -   `clientes/` (Rotas de Usuários)
            -   `desastres/`
                -   `page.tsx` (Painel EONET com 4 abas)
                -   `layout.tsx`
                -   `mapa/page.tsx`
                -   `mapa-atuais/page.tsx`
                -   `estatisticas/page.tsx`
            -   `contato/page.tsx`
        -   `components/`
        -   `lib/` (`apiService.ts`, `types.ts`)
    -   `package.json`
    -   `tailwind.config.js` (se aplicável)

---

## 9. 🧑‍💻 Equipe MetaMind
* **Arthur Bispo de Lima** - RM: 557568 (🐙 [ArthurBispo00](https://github.com/ArthurBispo00))
* **João Paulo Moreira** - RM: 557808 (🐙 [joao1015](https://github.com/joao1015))
* **Paulo André Carminati** - RM: 557881 (🐙 [carmipa](https://github.com/carmipa))

---

## 10. 🌐 Links Úteis
* 🐙 **Repositório do Projeto:** [https://github.com/carmipa/GS_FIAP_2025_1SM](https://github.com/carmipa/GS_FIAP_2025_1SM)
* 🎓 **Página Oficial da Global Solution FIAP:** [https://www.fiap.com.br/graduacao/global-solution/](https://www.fiap.com.br/graduacao/global-solution/)

---

## 11. 🤝 Como Contribuir
1.  Faça um Fork.
2.  Crie sua Branch (`git checkout -b feature/MinhaFeature`).
3.  Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`).
4.  Push (`git push origin feature/MinhaFeature`).
5.  Abra um Pull Request.

---

## 12. 📜 Licença
Licenciado sob a Licença MIT.