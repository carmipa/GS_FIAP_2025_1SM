# 💾 **Mastering Relational and Non-Relational Database**

<p align="center">
  <a href="https://youtu.be/M-Ia0UnPZjI" target="_blank">
    <img src="https://img.shields.io/badge/Nossa%20Apresentação-%20%E2%96%B6%EF%B8%8F-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Vídeo de Apresentação">
  </a>
</p>

Este documento detalha a estrutura, funcionalidades e exemplos de uso do banco de dados Oracle projetado para gerenciar informações de clientes, seus contatos, endereços e a associação com eventos naturais EONET.


**Bem-vindo ao GS Alerta Desastres!** Uma aplicação full-stack robusta e interativa, projetada para monitorar eventos de desastres naturais em tempo real, fornecer informações cruciais e permitir o disparo de alertas para usuários cadastrados. Este projeto foi desenvolvido com dedicação pela equipe **MetaMind** para a Global Solution 2025 (1º Semestre) da FIAP.


## 📜 Índice

- [💾 **Mastering Relational and Non-Relational Database**](#-mastering-relational-and-non-relational-database)
  - [📜 Índice](#-índice)
  - [1. Visão Geral 🌍](#1-visão-geral-)
  - [2. Estrutura do Banco de Dados 🏗️](#2-estrutura-do-banco-de-dados-️)
    - [2.1. Tabelas Principais](#21-tabelas-principais)
    - [2.2. Tabelas de Junção (Relacionamento)](#22-tabelas-de-junção-relacionamento)
    - [2.3. Sequences](#23-sequences)
    - [2.4. Triggers](#24-triggers)
    - [2.5. Constraints e Chaves](#25-constraints-e-chaves)
  - [3. Funcionalidades Implementadas (Procedures) ⚙️](#3-funcionalidades-implementadas-procedures-️)
    - [3.1. Procedures de Inserção](#31-procedures-de-inserção)
    - [3.2. Procedures de Atualização](#32-procedures-de-atualização)
    - [3.3. Procedures de Exclusão](#33-procedures-de-exclusão)
  - [4. Exemplos de Consultas Complexas (Relatórios SQL) 📊](#4-exemplos-de-consultas-complexas-relatórios-sql-)
  - [5. Blocos Anônimos com Lógica de Negócio e Cursores 👨‍💻](#5-blocos-anônimos-com-lógica-de-negócio-e-cursores-)
  - [6. 📂 **Link do Repositório:** ](#6--link-do-repositório-)
  - [7. 🎨 **Tecnologias Utilizadas:**](#7--tecnologias-utilizadas)

---

## 1. Visão Geral 🌍

O banco de dados foi desenvolvido para centralizar e gerenciar informações cruciais sobre clientes, incluindo seus dados pessoais, múltiplos contatos e endereços. Além disso, o sistema integra dados de eventos naturais provenientes do EONET (Earth Observatory Natural Event Tracker), permitindo associar esses eventos a localizações geográficas (endereços) e, potencialmente, analisar o impacto ou a proximidade desses eventos em relação aos clientes.

---

## 2. Estrutura do Banco de Dados 🏗️

O esquema do banco de dados é composto por tabelas principais para armazenar entidades distintas, tabelas de junção para gerenciar relacionamentos muitos-para-muitos, sequences para geração automática de IDs e triggers para automatizar processos.

### 2.1. Tabelas Principais

* 📄 **`GLOBAL.TB_CLIENTE3`**
    * **Descrição:** Armazena os dados cadastrais dos clientes[cite: 7].
    * **Colunas Principais:** `ID_CLIENTE` (PK, NUMBER, gerado automaticamente)[cite: 7, 38, 39], `NOME` (VARCHAR2)[cite: 7], `SOBRENOME` (VARCHAR2)[cite: 7], `DOCUMENTO` (VARCHAR2)[cite: 7], `DATA_NASCIMENTO` (VARCHAR2)[cite: 7].
    * Todas as colunas de dados são `NOT NULL`[cite: 111, 112, 113].

* 📞 **`GLOBAL.TB_CONTATO3`**
    * **Descrição:** Mantém os diversos tipos de contato associados aos clientes[cite: 8].
    * **Colunas Principais:** `ID_CONTATO` (PK, NUMBER, gerado automaticamente)[cite: 8, 39, 40], `DDD` (VARCHAR2)[cite: 8], `TELEFONE` (VARCHAR2)[cite: 8], `CELULAR` (VARCHAR2)[cite: 8], `WHATSAPP` (VARCHAR2)[cite: 8], `EMAIL` (VARCHAR2)[cite: 8], `TIPO_CONTATO` (VARCHAR2)[cite: 8].
    * Todas as colunas são `NOT NULL`[cite: 98, 99, 100, 101].

* 🏠 **`GLOBAL.TB_ENDERECO3`**
    * **Descrição:** Contém as informações detalhadas dos endereços[cite: 10].
    * **Colunas Principais:** `ID_ENDERECO` (PK, NUMBER, gerado automaticamente)[cite: 10, 40, 41], `CEP` (VARCHAR2)[cite: 10], `LOGRADOURO` (VARCHAR2)[cite: 10], `NUMERO` (NUMBER)[cite: 10], `BAIRRO` (VARCHAR2)[cite: 10], `LOCALIDADE` (VARCHAR2)[cite: 10], `UF` (VARCHAR2)[cite: 10], `COMPLEMENTO` (VARCHAR2)[cite: 10], `LATITUDE` (NUMBER)[cite: 10], `LONGITUDE` (NUMBER)[cite: 10].
    * Todas as colunas são `NOT NULL`[cite: 115, 116, 117, 118, 119, 120].

* ☄️ **`GLOBAL.TB_EONET3`**
    * **Descrição:** Armazena dados sobre eventos naturais obtidos do EONET[cite: 11].
    * **Colunas Principais:** `ID_EONET` (PK, NUMBER, gerado automaticamente)[cite: 11, 41, 42], `EONET_ID` (VARCHAR2, ID externo do evento)[cite: 11], `DATA` (TIMESTAMP WITH LOCAL TIME ZONE)[cite: 11], `JSON` (CLOB, contendo detalhes do evento)[cite: 11].
    * As colunas `ID_EONET` e `EONET_ID` são `NOT NULL`[cite: 109, 110].

### 2.2. Tabelas de Junção (Relacionamento)

Essas tabelas estabelecem relações muitos-para-muitos entre as tabelas principais.

* 🔗 **`GLOBAL.TB_CLIENTECONTATO3`**
    * **Descrição:** Associa clientes a seus múltiplos contatos (N:M)[cite: 5].
    * **Chaves:** `TB_CLIENTE3_ID_CLIENTE` (FK para `TB_CLIENTE3`)[cite: 5, 121], `TB_CONTATO3_ID_CONTATO` (FK para `TB_CONTATO3`)[cite: 5, 122]. Ambas formam a PK composta[cite: 106].

* 🔗 **`GLOBAL.TB_CLIENTEENDERECO3`**
    * **Descrição:** Associa clientes a seus múltiplos endereços (N:M)[cite: 6].
    * **Chaves:** `TB_CLIENTE3_ID_CLIENTE` (FK para `TB_CLIENTE3`)[cite: 6, 123], `TB_ENDERECO3_ID_ENDERECO` (FK para `TB_ENDERECO3`)[cite: 6, 124]. Ambas formam a PK composta[cite: 108].

* 🔗 **`GLOBAL.TB_ENDERECOEVENTOS3`**
    * **Descrição:** Associa endereços (locais) a eventos EONET (N:M)[cite: 9].
    * **Chaves:** `TB_ENDERECO3_ID_ENDERECO` (FK para `TB_ENDERECO3`)[cite: 9, 125], `TB_EONET3_ID_EONET` (FK para `TB_EONET3`)[cite: 9, 126]. Ambas formam a PK composta[cite: 104].

### 2.3. Sequences

Quatro sequences são utilizadas para gerar automaticamente os valores das chaves primárias das tabelas principais, garantindo IDs únicos:
* `GLOBAL.TB_CLIENTE3_ID_CLIENTE_SEQ` (START WITH 11) [cite: 1]
* `GLOBAL.TB_CONTATO3_ID_CONTATO_SEQ` (START WITH 11) [cite: 2]
* `GLOBAL.TB_ENDERECO3_ID_ENDERECO_SEQ` (START WITH 9) [cite: 3]
* `GLOBAL.TB_EONET3_ID_EONET_SEQ` (START WITH 6) [cite: 4]

### 2.4. Triggers

Para cada tabela principal, existe um trigger `BEFORE INSERT` que utiliza a sequence correspondente para popular a coluna de ID, caso um valor não seja explicitamente fornecido na inserção:
* `GLOBAL.TB_CLIENTE3_ID_CLIENTE_TRG` [cite: 38, 39]
* `GLOBAL.TB_CONTATO3_ID_CONTATO_TRG` [cite: 39, 40]
* `GLOBAL.TB_ENDERECO3_ID_ENDERECO_TRG` [cite: 40, 41]
* `GLOBAL.TB_EONET3_ID_EONET_TRG` [cite: 41, 42]

### 2.5. Constraints e Chaves

* **Chaves Primárias (PK):** Cada tabela possui uma chave primária para garantir a unicidade dos registros. Tabelas de junção possuem chaves primárias compostas (ex: `TB_CLIENTECONTATO3_PK`[cite: 34, 106], `TB_ENDERECO3_PK` [cite: 37, 120]).
* **Chaves Estrangeiras (FK):** Definem e mantêm a integridade referencial entre as tabelas (ex: `TB_CLIENTECONTATO3_TB_CLIENTE3_FK`[cite: 121], `TB_CLIENTEENDERECO3_TB_ENDERECO3_FK` [cite: 124]).
* **NOT NULL:** Diversas colunas são definidas como `NOT NULL` para garantir que campos essenciais sempre contenham dados (ex: `TB_CLIENTE3.NOME`[cite: 113], `TB_CONTATO3.EMAIL`[cite: 101], `TB_ENDERECO3.CEP`[cite: 116], `TB_EONET3.EONET_ID` [cite: 110]).

---

## 3. Funcionalidades Implementadas (Procedures) ⚙️

Para cada tabela do sistema, foram criadas procedures PL/SQL para encapsular as operações básicas de DML (Data Manipulation Language), promovendo reusabilidade, segurança e consistência.

### 3.1. Procedures de Inserção
* **Exemplos:** `GLOBAL.PROC_INSERT_CLIENTE`[cite: 64, 65], `GLOBAL.PROC_INSERT_CONTATO`[cite: 70, 71, 72], `GLOBAL.PROC_INSERT_ENDERECO`[cite: 73, 74, 75, 76], `GLOBAL.PROC_INSERT_EONET`[cite: 79, 80], `GLOBAL.PROC_INSERT_CLIENTECONTATO`[cite: 66, 67], `GLOBAL.PROC_INSERT_CLIENTEENDERECO`[cite: 68, 69], `GLOBAL.PROC_INSERT_ENDERECOEVENTO`[cite: 77, 78].
* **Funcionalidade:** Adicionam novos registros às tabelas. Nas tabelas principais, os IDs são automaticamente preenchidos pelas triggers se não forem fornecidos.

### 3.2. Procedures de Atualização
* **Exemplos:** `GLOBAL.PROC_UPDATE_CLIENTE`[cite: 81, 82, 83], `GLOBAL.PROC_UPDATE_CONTATO`[cite: 86, 87, 88], `GLOBAL.PROC_UPDATE_ENDERECO`[cite: 89, 90, 91, 92], `GLOBAL.PROC_UPDATE_EONET`[cite: 95, 96, 97], etc.
* **Funcionalidade:** Modificam dados de registros existentes, identificados por suas chaves primárias.

### 3.3. Procedures de Exclusão
* **Exemplos:** `GLOBAL.PROC_DELETE_CLIENTE`[cite: 43, 44, 45, 46, 47], `GLOBAL.PROC_DELETE_CONTATO`[cite: 52, 53, 54], `GLOBAL.PROC_DELETE_ENDERECO`[cite: 55, 56, 57, 58], `GLOBAL.PROC_DELETE_EONET`[cite: 61, 62, 63], etc.
* **Funcionalidade:** Removem registros. As procedures de exclusão para as tabelas principais (ex: `PROC_DELETE_CLIENTE`) também são programadas para remover registros relacionados nas tabelas de junção, a fim de manter a integridade referencial.

---

## 4. Exemplos de Consultas Complexas (Relatórios SQL) 📊

Foram desenvolvidas 5 consultas SQL complexas para extrair informações gerenciais e relatórios, demonstrando a capacidade de análise de dados do banco. Estas consultas utilizam `JOIN`s entre múltiplas tabelas, funções de agregação (`COUNT`, `AVG`, `SUM`), cláusulas `GROUP BY` e `HAVING`, subqueries e `ORDER BY`. Os relatórios incluem:
1.  **Resumo do Perfil do Cliente:** Detalha o número de contatos e endereços por cliente, e contatos principais.
2.  **Relatório de Utilização de Endereços:** Mostra quantos clientes diferentes estão associados a um mesmo endereço e a média de contatos desses clientes.
3.  **Atividade de Eventos EONET por UF:** Agrega o número de eventos e endereços afetados por UF.
4.  **Efetividade do Tipo de Contato:** Analisa quantos clientes utilizam cada tipo de contato e a média de contatos desses clientes.
5.  **Clientes Próximos a Eventos Específicos:** Identifica clientes em UFs com eventos EONET específicos e que possuem múltiplos contatos.

---

## 5. Blocos Anônimos com Lógica de Negócio e Cursores 👨‍💻

Dois blocos anônimos PL/SQL foram criados para demonstrar lógicas de negócio mais elaboradas e o uso de cursores:

* **Relatório de Clientes Altamente Conectados:**
    * Identifica clientes com mais de um contato E mais de um endereço.
    * Exibe informações detalhadas, incluindo um e-mail principal (se houver).
    * Utiliza um cursor (inicialmente implícito com `FOR ... IN ... LOOP` e depois demonstrado com `OPEN`, `FETCH`, `CLOSE` explícitos), loops `IF/ELSE` para lógica condicional na apresentação dos dados.

* **Análise de Eventos EONET por UF e Impacto em Clientes:**
    * Analisa UFs com eventos EONET e um número mínimo de clientes residentes.
    * Lista os eventos por UF e a contagem de clientes na UF.
    * Emprega cursores, loops aninhados e subqueries para coletar e apresentar os dados.

A demonstração de **cursores explícitos** (`OPEN`, `FETCH`, `CLOSE`) foi realizada adaptando o primeiro bloco anônimo, mostrando o controle manual do ciclo de vida do cursor.

---

## 6. 📂 **Link do Repositório:** [![GitHub](https://img.shields.io/badge/GitHub-Repositório-blue?style=flat-square&logo=github)](https://github.com/carmipa/GS_FIAP_2025_1SM/tree/main/Mastering_Relational_and_Non_Relational_Database)

---

## 7. 🎨 **Tecnologias Utilizadas:**
![Oracle Database](https://img.shields.io/badge/Oracle-Database-red?style=flat-square&logo=oracle)
![PL/SQL](https://img.shields.io/badge/PL%2FSQL-F80000?style=flat-square&logo=oracle)

