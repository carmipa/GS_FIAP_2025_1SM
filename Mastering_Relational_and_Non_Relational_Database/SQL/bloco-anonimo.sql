SET SERVEROUTPUT ON;

DECLARE
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

    v_nome_completo    GLOBAL.TB_CLIENTE3.NOME%TYPE;
    v_documento        GLOBAL.TB_CLIENTE3.DOCUMENTO%TYPE;
    v_qtd_contatos     NUMBER;
    v_qtd_enderecos    NUMBER;
    v_email_principal  GLOBAL.TB_CONTATO3.EMAIL%TYPE;
    v_contador_clientes NUMBER := 0;

BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Relatório de Clientes Altamente Conectados ---');
    DBMS_OUTPUT.PUT_LINE('Clientes com mais de 1 contato E mais de 1 endereço:');
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');

    FOR r_cliente IN c_clientes_conectados LOOP
        v_contador_clientes := v_contador_clientes + 1;
        v_nome_completo     := r_cliente.NOME_COMPLETO;
        v_documento         := r_cliente.DOCUMENTO;
        v_qtd_contatos      := r_cliente.QTD_CONTATOS;
        v_qtd_enderecos     := r_cliente.QTD_ENDERECOS;
        v_email_principal   := r_cliente.EMAIL_PRINCIPAL;

        DBMS_OUTPUT.PUT_LINE('Cliente: ' || v_nome_completo);
        DBMS_OUTPUT.PUT_LINE('  Documento: ' || v_documento);
        DBMS_OUTPUT.PUT_LINE('  Quantidade de Contatos: ' || v_qtd_contatos);
        DBMS_OUTPUT.PUT_LINE('  Quantidade de Endereços: ' || v_qtd_enderecos);

        IF v_email_principal IS NOT NULL THEN
            DBMS_OUTPUT.PUT_LINE('  Email Principal: ' || v_email_principal);
        ELSE
            DBMS_OUTPUT.PUT_LINE('  Email Principal: Não informado ou não encontrado.');
        END IF;
        DBMS_OUTPUT.PUT_LINE('---');
    END LOOP;

    IF v_contador_clientes = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Nenhum cliente atende aos critérios (mais de 1 contato E mais de 1 endereço).');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Total de clientes altamente conectados encontrados: ' || v_contador_clientes);
    END IF;
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Erro ao gerar relatório de clientes: ' || SQLERRM);
END;
/