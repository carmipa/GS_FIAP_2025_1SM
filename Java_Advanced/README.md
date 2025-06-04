# 🛰️ GS Alerta Desastres - Projeto MetaMind

<p align="center">
  <a href="https://youtu.be/j_qpO5N5fVY" target="_blank">
    <img src="https://img.shields.io/badge/Nossa%20Apresentação-%20%E2%96%B6%EF%B8%8F-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Vídeo de Apresentação">
  </a>
</p>

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
    - [3.1. Backend (Java \& Spring Ecosystem)](#31-backend-java--spring-ecosystem)
    - [3.2. Frontend (Next.js \& React Ecosystem)](#32-frontend-nextjs--react-ecosystem)
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
    - [8.1. Backend (`gsapi/` - Java Spring)](#81-backend-gsapi---java-spring)
    - [8.2. Frontend (Next.js)](#82-frontend-nextjs)
  - [9. 🧑‍💻 Equipe MetaMind](#9--equipe-metamind)
  - [10. 🌐 Links Úteis](#10--links-úteis)
  - [11. 🤝 Como Contribuir](#11--como-contribuir)
  - [12. 📜 Licença](#12--licença)
    - [📂 **Link do Repositório (Java Spring):**](#-link-do-repositório-java-spring)
  - [🎨 **Tecnologias Utilizadas no Projeto (Java Spring):**](#-tecnologias-utilizadas-no-projeto-java-spring)

---

## 1. Sobre o Projeto

### 1.1. O Problema
Desastres naturais representam uma ameaça crescente e constante para comunidades em todo o mundo. A falta de informação centralizada, alertas ágeis e ferramentas de fácil acesso para o público geral e para gestores de crise pode agravar os impactos desses eventos, resultando em perdas de vidas e danos materiais significativos.

### 1.2. Nossa Solução
O **GS Alerta Desastres** surge como uma resposta tecnológica a este desafio. Nossa plataforma visa:
* **Centralizar informações:** Agregando dados de eventos de desastres naturais da API EONET (Earth Observatory Natural Event Tracker) da NASA.
* **Facilitar o acesso:** Através de uma interface web intuitiva, os usuários podem se cadastrar, visualizar eventos em mapas e consultar estatísticas.
* **Alertas Direcionados:** Implementa um sistema para o disparo de notificações (configurado para e-mail via Spring Mail, com infraestrutura para expansão) para usuários específicos sobre eventos relevantes próximos à sua localização ou de interesse.
* **Promover a prevenção:** Ao disponibilizar dados históricos e atuais, buscamos auxiliar na conscientização e no planejamento para mitigação de riscos.

### 1.3. Objetivos
* Desenvolver uma aplicação full-stack funcional e escalável com backend Java Spring e frontend Next.js.
* Integrar com sucesso a API EONET da NASA para obtenção de dados sobre desastres.
* Permitir o cadastro e gerenciamento de **Usuários**.
* Apresentar os dados de forma clara e útil, utilizando mapas interativos (Leaflet) e múltiplos formatos de gráficos estatísticos (Chart.js).
* Implementar um sistema de alerta por e-mail que pode ser acionado tanto contextualmente (após uma busca de eventos próximos por um usuário) quanto manualmente por um administrador.

---

## 2. ✨ Funcionalidades Implementadas

O sistema evoluiu e agora conta com:

* 👥 **Gerenciamento de Usuários:**
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
        * **Disparo de alerta contextual:** Se um ID de usuário foi utilizado e eventos são encontrados próximos a ele, o sistema aciona o backend para enviar um alerta por e-mail para esse usuário específico sobre o evento principal encontrado. Mensagens de feedback sobre o processo de alerta são exibidas.
    * **Alertar Usuário (Nova Aba):**
        * Interface dedicada para um administrador disparar manualmente um alerta por e-mail para um usuário específico sobre um evento EONET específico (que deve estar previamente sincronizado no banco local).
        * **Verificação de Dados:** Campos para inserir "ID do Usuário" e "ID do Evento EONET". Botões "Verificar Usuário" e "Verificar Evento" buscam e exibem detalhes do usuário (nome, e-mail principal) e do evento (título, data) na tela antes do envio, permitindo confirmação.
        * **Envio Controlado:** O botão "Enviar Alerta ao Usuário Verificado" só é habilitado após a verificação bem-sucedida de ambos, usuário e evento. O envio real do e-mail depende da configuração correta do servidor SMTP no backend.

* 🗺️ **Visualização em Mapas Interativos (Leaflet):**
    * **Mapa de Eventos Locais (`/desastres/mapa`):** Exibe no mapa todos os eventos EONET armazenados localmente com coordenadas válidas, ajustando automaticamente o zoom para mostrar todos os marcadores.
    * **Mapa Atuais/Por Data (NASA) (`/desastres/mapa-atuais`):** Busca e exibe no mapa o evento global mais recente da EONET ou eventos dentro de um intervalo de datas especificado pelo usuário. Exibe detalhes do evento único em foco.

* 📊 **Estatísticas de Desastres (Chart.js) (`/desastres/estatisticas`):**
    * Apresentação de dados consolidados sobre os eventos EONET armazenados localmente.
    * **Variedade de Gráficos:** Barras Verticais/Horizontais (com escala logarítmica), Pizza, Rosca (Doughnut), Área Polar.
    * **Filtro de Período Expansivo:** Seleção de período de 30 dias a 50 anos para análise.

* 📞 **Página de Contato (`/contato`):**
    * Apresentação da equipe MetaMind com fotos individuais, RMs, e-mails, links do GitHub e turmas.
    * Formulário de contato simulado.
    * Mapa interativo com a localização da FIAP.

* 🏠 **Navegação Aprimorada:**
    * Link "Home" explícito na barra de navegação principal.
    * Sub-navegação clara e funcional dentro das seções "Usuários" e "Desastres EONET".

---

## 3. 🛠️ Tecnologias Utilizadas

### 3.1. Backend (Java & Spring Ecosystem)
<p>
  <img src="https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17+" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.X-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot 3+" />
  <img src="https://img.shields.io/badge/Spring%20Web%20(MVC)-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring MVC" />
  <img src="https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Data JPA" />
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white" alt="Hibernate" />
  <img src="https://img.shields.io/badge/MapStruct-FF5A00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCI+PHBhdGggZmlsbD0iI2ZmNWEwMCIgZD0iTTM2LjgzLDkuMTdMMjQuMDUsMi40MWMtMC40My0wLjI0LTAuOTUtMC4yNC0xLjM4LDBMMTAuMTcsOS4xN2MtMC40MywwLjI0LTAuNjksMC43MS0wLjY5LDEuMjF2MjUuMjNjMCwwLjUsMC4yNiwAuOTcsMC42OSwxLjIxbDEyLjU4LDYuNzVjMC4yMSwwLjExLDAuNDUsMC4xNywwLjY5LDAuMTZjMC4yNCwwLDAuNDgtMC4wNSwwLjY5LTAuMTZsMTIuNTgtNi43NWMwLjQzLTAuMjMsMC42OS0wLjcxLDAuNjktMS4yMVYxMC4zOEMzNy41Miw5Ljg4LDM3LjI2LDkuNDEsMzYuODMsOS4xN3oiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjMuMzMsMTkuMDVsLTUuNjQtMy4xOGwtMi4xMywxLjM0bDcuNzcsNC41MnYxMS4xMWwxMS4zLTUuNjVWMTYuMTFsLTExLjMsNS42NFYxOS4wNXogTTI4LjM2LDExLjY5djMuMTFsNS42My0zLjE0TDMyLjg4LDExLjVsLTQuNTIsMi41M1YxMS42OXogTTIwLjkyLDExLjY5djIuNTJsLTQuNTItMi41MkwxNS4yNywxMS41bDQuNTIsMy4xNFYxMS42OXoiLz48L3N2Zz4=" alt="MapStruct" />
  <img src="https://img.shields.io/badge/Jackson-E64A19?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZmlsbD0iI0U2NEEwMCIgZD0iTTEyIDJDNi40OCA1IDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTBzMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xMiA2Yy0zLjMyIDAtNiAyLjY4LTYgNnMxLjc5IDQuNTcgNC4yNiA1LjQ5bDEuNDItMS40MmMtMS41MS0uNjYtMi42OC0yLjA3LTIuNjgtMy45N2MwLTIuNzYgMi4yNC01IDUtNWMxLjM4IDAgMi42My41NiAzLjUyIDEuNDZsMS40MS0xLjQxQzE2LjU4IDYuNzkgMTQuMzggNiAxMiA2eiIvPjwvc3ZnPg==" alt="Jackson" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger (OpenAPI)" />
  <img src="https://img.shields.io/badge/RestTemplate-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="RestTemplate" />
  <img src="https://img.shields.io/badge/SLF4J%20(Logback)-007ACC?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZmlsbD0iIzAwN0FDQyIgZD0iTTEyIDBDNS4zNzMgMCAwIDUuMzczIDAgMTJzNS4zNzMgMTIgMTIgMTIgMTItNS4zNzMgMTItMTJTMTguNjI3IDAgMTIgMHptMCAyMWMtNC45NjIgMC05LTQuMDM4LTktOXM0LjAzOC05IDktOSA5IDQuMDM4IDkgOS00LjAzOCA5LTkgOXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJtMTIgNy40Yy0uODYgMC0xLjU4LjQ3LTEuOTcgMS4xOWwtLjAyLjA0Yy0uMDkuMjEtLjE1LjgxLS4xNSAxLjAydjAuMDljMCAuMy4wMy41Ny4wOC44MWgwYy4wNC4yMS4xMi40LjIxLjU3bC4wMi4wM2MuNTcuNzUgMS4zIDEuMiAyLjExIDEuMmgwYzEuMSAwIDEuOTktLjgyIDIuMTYtMS44OWwtLjAyLS4wM2MuMDQtLjE5LjA2LS40LjA2LS42MXYtLjA3YzAtLjQ0LS4xMS0uODItLjMxLTEuMTNsLS4wMi0uMDNjLS40Mi0uNTktMS4wMi0uOTYtMS42Ni0uOTZ6bS4xMyAzLjk3aDBjLS4zMiAwLS41OS0uMTYtLjc3LS40MWwtLjAxLS4wMWMtLjA0LS4wNy0uMDctLjE1LS4wOS0uMjN2LS4wMWMtLjAyLS4wNi0uMDMtLjE0LS4wMy0uMjF2LS4wMWMwLS4wOSAwLS4xOC4wMS0uMjZsLjAxLS4wNGMwLS4wMi4wMS0uMDMuMDEtLjA0di0uMDJjLjE5LS40Ny41My0uNzguOTMtLjc4aDBjLjU0IDAgLjk4LjM2IDEuMDkuODVsLjAxLjAzYy4wNC4xLjA3LjIxLjA4LjMybDAgLjA0YzAgLjExLS4wMS4yMi0uMDMuMzNsMCAuMDJjLS4xNi42LS42MS45Ny0xLjEyLjk3eiIvPjwvc3ZnPg==" alt="SLF4J (Logback)" />
  <img src="https://img.shields.io/badge/Jakarta%20Validation-6DB33F?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJjaGVjay1jaXJjbGUiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWNoZWNrLWNpcmNsZSBmYS13LTE2IGZhLWxnIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yNTYgOEMxMTkuMCA4IDggMTE5LjAgOCAyNTZzMTExLjAgMjQ4IDI0OCAyNDggMjQ4LTExMSAyNDgtMjQ4UzM5My4wIDggMjU2IDh6bTAgNDQ4Yy0xMTAuNSAwLTIwMC04OS41LTIwMC0yMDJzODkuNS0yMDAgMjAwLTIwMCAyMDAgODkuNSAyMDAgMjAwLTg5LjIgMjAwLTIwMCAyMDB6bTE1NC44LTEyNC44bC0uMS4xYy00LjctNC43LTEyLjMtNC43LTE3IDBsLTg4LjggODguOC0zMi4zLTMyLjNjLTQuNy00LjctMTIuMy00LjctMTcgMC00LjcgNC43LTQuNyAxMi4zIDAgMTdsNDkuMyA0OS4zYy0uMS4xLjEgLjEuMi4yLjEtLjMuMy0uMy4zLS40YzQuNy00LjcgMTIuMy00LjcgMTcgMGwxMDMuOC0xMDMuOGM0LjctNC43IDQuNy0xMi4zLS4xLTE3eiIvPjwvcGF0aD48L3N2Zz4=" alt="Jakarta Validation" />
  <img src="https://img.shields.io/badge/Lombok-E0263B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjRTAyNjNCIiBkPSJNMTUuNSA5LjVsLTQuMiAyLjUgMS40IDQgNC4yLTIuNS0xLjQtNHptMTcgMGwtMS40IDQgNC4yIDIuNSAxLjQtNC00LjItMi41ek05LjIgMTguMWwxLjQgNC4xIDIuOS0xLjcgMS40LTQuMS01LjctMi41em0yOC4xIDBsMi45IDEuNyAxLjQtNC4xLTUuNyAyLjUgMS40IDQuMXpNMjQgMzBsMy41LTIuMS0xLjQtMy45LTMuNSAyLjF6TTIxLjUgMjRsMS40LTMuOSAzLjUgMi4xLTEuNCAzLjl6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTI0IDRMMTEuMiAxMS41djI1TDQgMjAuOHY2LjRsNy4yIDYuOCAxMy4xIDcuNyA2LjYtMy44IDMuNC0xLjktMy4xLTYuMkwzOC44IDI0bC0xLjgtMy4xLTguMy00LjgtNS43LTkuMXpNMTQgMTMuNWw1LjMgMy4xIDQuNy0yLjgtMTAuMi01Ljl6bTIwIDBsNC43IDIuOC0xMC4yIDUuOS0xLjgtMS4xIDcuMy00LjV6TTE2LjUgMjFsNy41IDQuMyAwLjUgNS44LTcuNS00LjQtMC41LTUuN3ptMTUgMGwwLjUgNS43LTcuNSA0LjQtMC41LTUuOCAyLjgtMS42em0tNy41IDExLjVsNC44LTIuOC0xLjQtMy45LTQuOCAyLjh6Ii8+PC9zdmc+" alt="Lombok" />
  <img src="https://img.shields.io/badge/Spring%20Mail-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Mail" />
</p>

### 3.2. Frontend (Next.js & React Ecosystem)
*(Assumindo o mesmo frontend da versão .NET para uma solução full-stack consistente)*
<p>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18+" />
  <img src="https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14+" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Global" />
  <img src="https://img.shields.io/badge/Leaflet-1EB300?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet.js" />
  <img src="https://img.shields.io/badge/React%20Leaflet-1EB300?style=for-the-badge&logo=leaflet&logoColor=white" alt="React-Leaflet" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/React%20Chartjs%202-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="React-Chartjs-2" />
  <img src="https://img.shields.io/badge/Lucide%20React-007ACC?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React Icons" />
  <img src="https://img.shields.io/badge/React%20Icons-E91E63?style=for-the-badge&logo=react-icons&logoColor=white" alt="React Icons" />
</p>

### 3.3. Banco de Dados
<p>
  <img src="https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white" alt="Oracle Database" />
</p>

---

## 4. 🏗️ Arquitetura da Solução
O projeto segue uma arquitetura cliente-servidor:
* **Servidor (Backend):** A API RESTful desenvolvida com Java Spring Boot atua como o servidor. Ele é responsável por toda a lógica de negócios, processamento de dados, interações com o banco de dados Oracle e comunicação com as APIs externas (NASA EONET, ViaCEP, Google Geocoding). Ele expõe endpoints seguros e bem definidos para o frontend consumir, incluindo um novo endpoint para o disparo de alertas específicos.
* **Cliente (Frontend):** A aplicação desenvolvida com Next.js e React atua como o cliente. Ela consome os dados da API backend para renderizar as interfaces de usuário, permitindo que os usuários interajam com o sistema. A navegação é gerenciada pelo App Router do Next.js.

---

## 5. 🚀 Como Executar o Projeto
### 5.1. Pré-requisitos
* ☕ Java JDK 17 ou superior
* 📦 Apache Maven 3.8+
* <img src="https://img.shields.io/badge/Node.js-18.17+-339933?style=flat&logo=nodedotjs" alt="Node.js" /> Node.js v18.17+ (ou a LTS mais recente)
* 🗃️ Instância do Oracle Database configurada e acessível.
* 🐙 Git

### 5.2. Configuração do Backend
1.  Clone o repositório: `git clone https://github.com/carmipa/GS_FIAP_2025_1SM.git`
2.  Navegue para a pasta do backend Java: `cd GS_FIAP_2025_1SM/Java_Advanced` (ou o caminho correto para o seu projeto Java).
3.  **Banco de Dados:**
    * Garanta que o Oracle esteja rodando.
    * Crie o usuário/schema e execute o script DDL fornecido no projeto (geralmente `Oracle_DDL_GS_AlertaDesastres_SCRIPT.sql` ou similar que você tenha adaptado para o Java).
    * Configure `src/main/resources/application.properties` com suas credenciais do Oracle (`spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`).
    * **Para envio de e-mail (funcionalidade de alerta):** Configure as propriedades `spring.mail.*` (host, port, username, password/senha de app) para seu servidor SMTP (ex: Gmail com Senha de App, SendGrid, etc.). Sem essa configuração, a tentativa de envio de e-mail resultará em erro de autenticação no log do backend.
4.  **Dependências Maven:**
    * Certifique-se que a dependência `spring-boot-starter-mail` está no `pom.xml` para a funcionalidade de e-mail.
5.  Compile e execute: `mvn spring-boot:run`
    * A API estará disponível em `http://localhost:8080` (ou a porta configurada).
    * A documentação Swagger UI estará acessível em `http://localhost:8080/swagger-ui.html`.

### 5.3. Configuração do Frontend
1.  Navegue para a pasta do frontend (ex: `cd ../frontend-gs-alertas` - ajuste o nome da pasta conforme seu projeto).
2.  Instale dependências: `npm install` (ou `yarn install`).
3.  **Variável de Ambiente:** Se necessário, crie um arquivo `.env.local` na raiz do projeto frontend e defina a URL da API do backend:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ```
4.  **Imagens da Equipe:** Coloque as fotos dos membros da equipe na pasta `public/fotos-equipe/` (ex: `paulo.jpg`, `arthur.jpg`, `joao.jpg`). Os nomes dos arquivos devem corresponder aos definidos no componente da página de contato.
5.  Execute o servidor de desenvolvimento: `npm run dev`
    * A aplicação frontend estará acessível em `http://localhost:3000` (ou a porta configurada).

---

## 6. 🔗 Endpoints da API
Acesse a documentação interativa completa via **Swagger UI** quando o backend estiver rodando:
[`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html)

Principais grupos de endpoints:
* `/api/clientes`: Gerenciamento de usuários.
* `/api/contatos`: Gerenciamento de contatos.
* `/api/enderecos`: Gerenciamento de endereços, consulta ViaCEP e geocodificação (Google/Nominatim).
* `/api/eonet`: Operações com eventos EONET (sincronização, busca local por ID da API: `GET /api/eonet/api-id/{eonetApiId}`, busca na API da NASA por proximidade ou data).
* `/api/stats`: Dados para gráficos de estatísticas de eventos EONET.
* `/api/alerts`: Endpoints para disparo de alertas para usuários (ex: `POST /api/alerts/trigger-user-specific-alert`).

---

## 7. 🗺️ Manual de Funcionamento e Navegação no Frontend

### 7.1. Visão Geral da Interface
A aplicação possui uma barra de navegação superior persistente com links para "Home", "Usuários", "Desastres EONET" e "Fale Conosco". As seções "Usuários" e "Desastres EONET" possuem uma sub-navegação interna para suas funcionalidades específicas.

### 7.2. Página Inicial (`/`)
* **Acesso:** `http://localhost:3000` ou clicando no logo/link "Home".
* **Conteúdo:** Introdução ao projeto, cards para acesso rápido a "Gerenciar Usuários", "Painel de Desastres" e "Fale Conosco". Links para o GitHub do projeto e para a página da Global Solution FIAP.

### 7.3. Seção de Usuários (`/clientes/...`)
* **Acesso:** Link "Usuários" na navbar principal.
* **Sub-Navegação:**
    * **Listar Usuários (`/clientes/listar`):** Exibe lista paginada de usuários. Ações: Ver detalhes, Editar, Deletar (com modal de confirmação).
    * **Cadastrar Usuário (`/clientes/cadastrar`):** Formulário para novos usuários, com busca de CEP e obtenção de coordenadas.
    * **Buscar Usuário (`/clientes/buscar`):** Busca por ID ou Documento. Redireciona para detalhes se encontrado.
    * **Detalhes, Alterar, Deletar:** Páginas acessadas a partir da lista ou busca.

### 7.4. Seção de Desastres EONET (`/desastres/...`)
* **Acesso:** Link "Desastres EONET" na navbar principal. A página principal (`/desastres`) é o "Painel EONET" organizado em abas.
* **Sub-Navegação (Layout):** Links "Painel EONET", "Mapa de Eventos (Locais)", "Mapa Atuais (NASA)", "Estatísticas" levam para as respectivas páginas.

#### 7.4.1. Aba: Eventos Locais (Dentro do Painel EONET em `/desastres`)
* **Funcionalidade:** Lista eventos EONET do banco de dados local.
* **Uso:** Visualizar eventos sincronizados, com paginação. O JSON de cada evento é parseado para exibir título, data e categorias.

#### 7.4.2. Aba: Sincronizar NASA (Dentro do Painel EONET em `/desastres`)
* **Funcionalidade:** Busca e salva eventos da API EONET da NASA.
* **Uso:** Preencha filtros (limite, dias, status, fonte) e clique em "Iniciar Sincronização". Feedback da operação é exibido.

#### 7.4.3. Aba: Buscar Próximos (Eventos NASA) (Dentro do Painel EONET em `/desastres`)
* **Funcionalidade:** Busca eventos na API da NASA por proximidade geográfica ou período e pode disparar alerta contextual.
* **Uso:**
    1.  Opcional: Insira "ID do Usuário", clique "Buscar Coords". O nome do usuário e suas coordenadas (do endereço principal) serão preenchidos e exibidos.
    2.  Ou preencha manualmente Latitude, Longitude e Raio (km).
    3.  Opcional: Defina filtros de data (`startDate`, `endDate`), limite, dias, status, fonte.
    4.  Clique "Buscar Eventos Próximos".
    5.  Se um ID de usuário foi utilizado na busca de coordenadas e eventos são encontrados, um alerta por e-mail é solicitado ao backend. Feedback é exibido.
    6.  Lista de eventos encontrados aparece abaixo.

#### 7.4.4. Aba: Alertar Usuário (Dentro do Painel EONET em `/desastres`)
* **Funcionalidade:** Dispara manualmente um alerta para um usuário sobre um evento EONET específico (que deve existir no banco local).
* **Uso:**
    1.  Insira "ID do Usuário a ser Alertado", clique "Verificar Usuário". Nome e e-mail do usuário são exibidos.
    2.  Insira "ID do Evento EONET" (o ID da API da NASA, ex: EONET_xxxx), clique "Verificar Evento". Título e data do evento (do banco local) são exibidos.
    3.  Se ambos verificados, o botão "Enviar Alerta ao Usuário Verificado" é habilitado. Clique para disparar a notificação por e-mail. Feedback da operação é exibido.

#### 7.4.5. Página: Mapa de Eventos Locais (`/desastres/mapa`)
* **Acesso:** Pela sub-navegação da seção "Desastres EONET".
* **Funcionalidade:** Mapa Leaflet com marcadores de eventos EONET armazenados localmente. O mapa se ajusta para mostrar todos os eventos.

#### 7.4.6. Página: Mapa Atuais/Por Data (NASA) (`/desastres/mapa-atuais`)
* **Acesso:** Pela sub-navegação da seção "Desastres EONET".
* **Funcionalidade:** Mapa Leaflet que exibe o evento global mais recente da NASA ou eventos filtrados por um intervalo de datas. Detalhes do evento em foco (se for um único resultado) são mostrados.

#### 7.4.7. Página: Estatísticas de Desastres (`/desastres/estatisticas`)
* **Acesso:** Pela sub-navegação da seção "Desastres EONET".
* **Funcionalidade:** Apresenta gráficos (Barras Verticais/Horizontais com escala logarítmica, Pizza, Rosca, Área Polar) da contagem de eventos EONET locais por categoria. Inclui um filtro de período expansivo (30 dias a 50 anos). Tooltips dos gráficos exibem contagem e porcentagem.

### 7.5. Página Fale Conosco (`/contato`)
* **Acesso:** Link "Fale Conosco" na navbar principal.
* **Conteúdo:** Fotos individuais e informações da equipe MetaMind, formulário de contato (simulado), mapa Leaflet com a localização da FIAP.

---

## 8. 📂 Estrutura Simplificada do Projeto
### 8.1. Backend (`gsapi/` - Java Spring)

gsapi/ (Java_Advanced no repositório)
└── src/
    ├── main/
    │   ├── java/
    │   │   └── br/com/fiap/gs/gsapi/
    │   │       ├── GsapiApplication.java
    │   │       ├── client/             (ViaCepClient, NasaEonetClient, GeoCodingClient)
    │   │       ├── config/             (AppConfig, CorsConfig, OpenApiConfig, SwaggerBrowserLauncher)
    │   │       ├── controller/
    │   │       │   ├── alert/AlertTriggerController.java
    │   │       │   ├── ClienteController.java
    │   │       │   ├── ContatoController.java
    │   │       │   ├── EnderecoController.java
    │   │       │   ├── EonetController.java
    │   │       │   └── StatsController.java
    │   │       ├── dto/
    │   │       │   ├── alert/          (AlertableEventDTO, UserAlertRequestDTO)
    │   │       │   ├── external/       (DTOs da NASA, Google)
    │   │       │   ├── geo/            (GeoCoordinatesDTO)
    │   │       │   ├── request/        (ClienteRequestDTO, etc.)
    │   │       │   ├── response/       (ClienteResponseDTO, etc.)
    │   │       │   └── stats/          (CategoryCountDTO, TimeCountDTO)
    │   │       ├── exception/          (GlobalExceptionHandler, Custom Exceptions)
    │   │       ├── mapper/             (Interfaces MapStruct)
    │   │       ├── model/              (Entidades JPA: Cliente, Contato, Endereco, Eonet)
    │   │       ├── repository/         (Interfaces Spring Data JPA)
    │   │       ├── service/
    │   │       │   ├── alert/UserSpecificAlertService.java
    │   │       │   ├── notification/EmailNotificationService.java
    │   │       │   ├── ClienteService.java
    │   │       │   ├── ContatoService.java
    │   │       │   ├── EnderecoService.java
    │   │       │   └── EonetService.java
    │   │       └── utils/              (GeoUtils)
    │   └── resources/
    │       ├── application.properties
    │       └── static/
    └── test/
        └── java/
└── pom.xml

### 8.2. Frontend (Next.js)
frontend-gs-alertas/ (ou nome similar)
├── public/
│   ├── fotos-equipe/
│   │   ├── arthur.jpg
│   │   ├── joao.jpg
│   │   └── paulo.jpg
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx              (Root Layout)
│   │   ├── page.tsx                (Home Page)
│   │   ├── globals.css
│   │   ├── clientes/
│   │   │   ├── [id]/page.tsx
│   │   │   ├── alterar/[id]/page.tsx
│   │   │   ├── buscar/page.tsx
│   │   │   ├── cadastrar/page.tsx
│   │   │   ├── deletar/[id]/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── listar/page.tsx
│   │   ├── desastres/
│   │   │   ├── page.tsx             (Painel EONET com abas)
│   │   │   ├── layout.tsx
│   │   │   ├── estatisticas/page.tsx
│   │   │   ├── mapa/page.tsx
│   │   │   └── mapa-atuais/page.tsx
│   │   └── contato/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── components/
│   │   ├── EonetEventMap.tsx
│   │   └── LeafletMap.tsx
│   └── lib/
│       ├── apiService.ts        (Funções de chamada à API Backend)
│       └── types.ts             (Interfaces TypeScript para DTOs)
├── package.json
├── tsconfig.json
└── next.config.mjs (ou .js)

---

## 9. 🧑‍💻 Equipe MetaMind
* **Arthur Bispo de Lima** - RM: 557568 (🐙 [ArthurBispo00](https://github.com/ArthurBispo00))
* **João Paulo Moreira** - RM: 557808 (🐙 [joao1015](https://github.com/joao1015))
* **Paulo André Carminati** - RM: 557881 (🐙 [carmipa](https://github.com/carmipa))

---

## 10. 🌐 Links Úteis
* 🐙 **Repositório Principal do Projeto (GS):** [https://github.com/carmipa/GS_FIAP_2025_1SM](https://github.com/carmipa/GS_FIAP_2025_1SM)
    * **Backend Java/Spring:** [https://github.com/carmipa/GS_FIAP_2025_1SM/tree/main/Java_Advanced](https://github.com/carmipa/GS_FIAP_2025_1SM/tree/main/Java_Advanced)
* 🎓 **Página Oficial da Global Solution FIAP:** [https://www.fiap.com.br/graduacao/global-solution/](https://www.fiap.com.br/graduacao/global-solution/)

---

## 11. 🤝 Como Contribuir
1.  Faça um Fork do repositório.
2.  Crie sua Branch de funcionalidade (`git checkout -b feature/SuaNovaFeature`).
3.  Commit suas mudanças (`git commit -m 'Adiciona funcionalidade X Y Z'`).
4.  Faça o Push para a Branch (`git push origin feature/SuaNovaFeature`).
5.  Abra um Pull Request detalhando suas alterações.

---

## 12. 📜 Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` no repositório para mais detalhes.
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https:/


### 📂 **Link do Repositório (Java Spring):**
[![GitHub](https://img.shields.io/badge/GitHub-GS%20Java%20Spring-blue?style=for-the-badge&logo=github)](https://github.com/carmipa/GS_FIAP_2025_1SM/tree/main/Java_Advanced)

---
## 🎨 **Tecnologias Utilizadas no Projeto (Java Spring):**

**Backend (Java & Spring Ecosystem):**
<p>
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Spring%20MVC-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring MVC" />
  <img src="https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Data JPA" />
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white" alt="Hibernate" />
  <img src="https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white" alt="Oracle DB" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger (OpenAPI)" />
  <img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white" alt="Maven" />
  <img src="https://img.shields.io/badge/Spring%20Cache-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Cache" />
  <img src="https://img.shields.io/badge/Jakarta%20Validation-6DB33F?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJjaGVjay1jaXJjbGUiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWNoZWNrLWNpcmNsZSBmYS13LTE2IGZhLWxnIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yNTYgOEMxMTkuMCA4IDggMTE5LjAgOCAyNTZzMTExLjAgMjQ4IDI0OCAyNDggMjQ4LTExMSAyNDgtMjQ4UzM5My4wIDggMjU2IDh6bTAgNDQ4Yy0xMTAuNSAwLTIwMC04OS41LTIwMC0yMDJzODkuNS0yMDAgMjAwLTIwMCAyMDAgODkuNSAyMDAgMjAwLTg5LjUgMjAwLTIwMCAyMDB6bTE1NC44LTEyNC44bC0uMS4xYy00LjctNC43LTEyLjMtNC43LTE3IDBsLTg4LjggODguOC0zMi4zLTMyLjNjLTQuNy00LjctMTIuMy00LjctMTcgMC00LjcgNC43LTQuNyAxMi4zIDAgMTdsNDkuMyA0OS4zYy0uMS4xLjEgLjEgLjIgLjJsLjQtLjNsLjMtLjRjNC43LTQuNyAxMi4zLTQuNyAxNyAwbDEwMy44LTEwMy44YzQuNy00LjcgNC43LTEyLjMtLjEtMTd6IiBjbGFzcz0iIj48L3BhdGg+PC9zdmc+" alt="Jakarta Validation" />
  <img src="https://img.shields.io/badge/Spring%20Mail-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Mail" />
</p>

**Frontend (Next.js & React):**
*(Assumindo o mesmo frontend do projeto .NET para uma solução full-stack consistente)*
<p>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Leaflet-1EB300?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet.js" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</p>
