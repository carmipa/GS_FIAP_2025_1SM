SET SERVEROUTPUT ON;

DECLARE
    -- 1. Declaração do Cursor Explícito
    CURSOR c_clientes_conectados IS
        SELECT
            c.ID_CLIENTE,
            c.NOME || ' ' || c.SOBRENOME AS NOME_COMPLETO,
            c.DOCUMENTO,
            COUNT(DISTINCT cc.TB_CONTATO3_ID_CONTATO) AS QTD_CONTATOS,
            COUNT(DISTINCT ce.TB_ENDERECO3_ID_ENDERECO) AS QTD_ENDERECOS,
            (SELECT ct.EMAIL
             FROM GLOBAL.TB_CONTATO3 ct
             JOIN GLOBAL.TB_CLIENTECONTATO3 cct_sub ON ct.ID_CONTATO = cct_sub.TB_CONTATO3_ID_CONTATO
             WHERE cct_sub.TB_CLIENTE3_ID_CLIENTE = c.ID_CLIENTE
               AND ct.TIPO_CONTATO = 'Principal'
               AND ROWNUM = 1) AS EMAIL_PRINCIPAL
        FROM
            GLOBAL.TB_CLIENTE3 c
        JOIN
            GLOBAL.TB_CLIENTECONTATO3 cc ON c.ID_CLIENTE = cc.TB_CLIENTE3_ID_CLIENTE
        JOIN
            GLOBAL.TB_CLIENTEENDERECO3 ce ON c.ID_CLIENTE = ce.TB_CLIENTE3_ID_CLIENTE
        GROUP BY
            c.ID_CLIENTE, c.NOME, c.SOBRENOME, c.DOCUMENTO
        HAVING
            COUNT(DISTINCT cc.TB_CONTATO3_ID_CONTATO) > 1 AND
            COUNT(DISTINCT ce.TB_ENDERECO3_ID_ENDERECO) > 1
        ORDER BY
            NOME_COMPLETO;

    -- Variáveis para armazenar os dados buscados pelo FETCH
    v_id_cliente_fetch    GLOBAL.TB_CLIENTE3.ID_CLIENTE%TYPE;
    v_nome_completo_fetch VARCHAR2(201); -- NOME(100) + ' ' + SOBRENOME(100)
    v_documento_fetch     GLOBAL.TB_CLIENTE3.DOCUMENTO%TYPE;
    v_qtd_contatos_fetch  NUMBER;
    v_qtd_enderecos_fetch NUMBER;
    v_email_principal_fetch GLOBAL.TB_CONTATO3.EMAIL%TYPE;

    v_contador_clientes   NUMBER := 0;

BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Relatório de Clientes Altamente Conectados (com Cursor Explícito) ---');
    DBMS_OUTPUT.PUT_LINE('Clientes com mais de 1 contato E mais de 1 endereço:');
    DBMS_OUTPUT.PUT_LINE('-------------------------------------------------------------------');

    -- 2. Abrir o Cursor
    OPEN c_clientes_conectados;

    -- 3. Loop para buscar dados (FETCH)
    LOOP
        -- 4. Buscar a próxima linha do cursor para dentro das variáveis
        FETCH c_clientes_conectados INTO
            v_id_cliente_fetch,
            v_nome_completo_fetch,
            v_documento_fetch,
            v_qtd_contatos_fetch,
            v_qtd_enderecos_fetch,
            v_email_principal_fetch;

        -- 5. Verificar se alguma linha foi encontrada (sair do loop se não houver mais dados)
        EXIT WHEN c_clientes_conectados%NOTFOUND;

        -- Processar os dados da linha atual
        v_contador_clientes := v_contador_clientes + 1;

        DBMS_OUTPUT.PUT_LINE('Cliente: ' || v_nome_completo_fetch);
        DBMS_OUTPUT.PUT_LINE('  Documento: ' || v_documento_fetch);
        DBMS_OUTPUT.PUT_LINE('  Quantidade de Contatos: ' || v_qtd_contatos_fetch);
        DBMS_OUTPUT.PUT_LINE('  Quantidade de Endereços: ' || v_qtd_enderecos_fetch);

        IF v_email_principal_fetch IS NOT NULL THEN
            DBMS_OUTPUT.PUT_LINE('  Email Principal: ' || v_email_principal_fetch);
        ELSE
            DBMS_OUTPUT.PUT_LINE('  Email Principal: Não informado ou não encontrado.');
        END IF;
        DBMS_OUTPUT.PUT_LINE('---');

    END LOOP;

    -- 6. Fechar o Cursor
    CLOSE c_clientes_conectados;

    IF v_contador_clientes = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Nenhum cliente atende aos critérios (mais de 1 contato E mais de 1 endereço).');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Total de clientes altamente conectados encontrados: ' || v_contador_clientes);
    END IF;
    DBMS_OUTPUT.PUT_LINE('-------------------------------------------------------------------');

EXCEPTION
    WHEN OTHERS THEN
        -- Garantir que o cursor seja fechado em caso de erro, se estiver aberto
        IF c_clientes_conectados%ISOPEN THEN
            CLOSE c_clientes_conectados;
        END IF;
        DBMS_OUTPUT.PUT_LINE('Erro ao gerar relatório de clientes: ' || SQLERRM);
END;
/