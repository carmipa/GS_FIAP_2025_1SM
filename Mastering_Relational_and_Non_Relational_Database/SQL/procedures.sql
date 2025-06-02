-- Procedure de Inserção (PROC_INSERT_CLIENTE)

CREATE OR REPLACE PROCEDURE GLOBAL.PROC_INSERT_CLIENTE (
    p_DATA_NASCIMENTO IN VARCHAR2,
    p_SOBRENOME IN VARCHAR2,
    p_DOCUMENTO IN VARCHAR2,
    p_NOME IN VARCHAR2
)
AS
BEGIN
    INSERT INTO GLOBAL.TB_CLIENTE3 (DATA_NASCIMENTO, SOBRENOME, DOCUMENTO, NOME)
    VALUES (p_DATA_NASCIMENTO, p_SOBRENOME, p_DOCUMENTO, p_NOME);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END PROC_INSERT_CLIENTE;
/

-- Procedure de Atualização (PROC_UPDATE_CLIENTE)

create or replace procedure global.proc_update_cliente (
   p_id_cliente      in number,
   p_data_nascimento in varchar2,
   p_sobrenome       in varchar2,
   p_documento       in varchar2,
   p_nome            in varchar2
) as
begin
   update global.tb_cliente3
      set data_nascimento = p_data_nascimento,
          sobrenome = p_sobrenome,
          documento = p_documento,
          nome = p_nome
    where id_cliente = p_id_cliente;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_update_cliente;
/

-- Procedure de Exclusão (PROC_DELETE_CLIENTE)

create or replace procedure global.proc_delete_cliente (
   p_id_cliente in number
) as
begin
    -- Antes de excluir um cliente, pode ser necessário tratar os registros relacionados
    -- nas tabelas TB_CLIENTECONTATO3 e TB_CLIENTEENDERECO3.
    -- Por simplicidade, esta procedure apenas deleta o cliente.
    -- Em um cenário real, adicione lógica para tratar Foreign Key Constraints (ON DELETE CASCADE, etc.)
    -- ou delete os registros filhos primeiro.

   delete from global.tb_clientecontato3
    where tb_cliente3_id_cliente = p_id_cliente;
   delete from global.tb_clienteendereco3
    where tb_cliente3_id_cliente = p_id_cliente;

   delete from global.tb_cliente3
    where id_cliente = p_id_cliente;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_delete_cliente;
/

-- Procedure de Inserção (PROC_INSERT_CONTATO)

create or replace procedure global.proc_insert_contato (
   p_ddd          in varchar2,
   p_telefone     in varchar2,
   p_celular      in varchar2,
   p_whatsapp     in varchar2,
   p_email        in varchar2,
   p_tipo_contato in varchar2
) as
begin
   insert into global.tb_contato3 (
      ddd,
      telefone,
      celular,
      whatsapp,
      email,
      tipo_contato
   ) values ( p_ddd,
              p_telefone,
              p_celular,
              p_whatsapp,
              p_email,
              p_tipo_contato );
   commit;
exception
   when others then
      rollback;
      raise;
end proc_insert_contato;
/

-- Procedure de Atualização (PROC_UPDATE_CONTATO)

create or replace procedure global.proc_update_contato (
   p_id_contato   in number,
   p_ddd          in varchar2,
   p_telefone     in varchar2,
   p_celular      in varchar2,
   p_whatsapp     in varchar2,
   p_email        in varchar2,
   p_tipo_contato in varchar2
) as
begin
   update global.tb_contato3
      set ddd = p_ddd,
          telefone = p_telefone,
          celular = p_celular,
          whatsapp = p_whatsapp,
          email = p_email,
          tipo_contato = p_tipo_contato
    where id_contato = p_id_contato;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_update_contato;
/

-- Procedure de Exclusão (PROC_DELETE_CONTATO)

create or replace procedure global.proc_delete_contato (
   p_id_contato in number
) as
begin
    -- Similar ao cliente, tratar registros em TB_CLIENTECONTATO3 antes.
   delete from global.tb_clientecontato3
    where tb_contato3_id_contato = p_id_contato;

   delete from global.tb_contato3
    where id_contato = p_id_contato;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_delete_contato;
/

-- Procedure de Inserção (PROC_INSERT_ENDERECO)

create or replace procedure global.proc_insert_endereco (
   p_cep         in varchar2,
   p_numero      in number,
   p_logradouro  in varchar2,
   p_bairro      in varchar2,
   p_localidade  in varchar2,
   p_uf          in varchar2,
   p_complemento in varchar2,
   p_latitude    in number,
   p_longitude   in number
) as
begin
   insert into global.tb_endereco3 (
      cep,
      numero,
      logradouro,
      bairro,
      localidade,
      uf,
      complemento,
      latitude,
      longitude
   ) values ( p_cep,
              p_numero,
              p_logradouro,
              p_bairro,
              p_localidade,
              p_uf,
              p_complemento,
              p_latitude,
              p_longitude );
   commit;
exception
   when others then
      rollback;
      raise;
end proc_insert_endereco;
/

-- Procedure de Atualização (PROC_UPDATE_ENDERECO)

create or replace procedure global.proc_update_endereco (
   p_id_endereco in number,
   p_cep         in varchar2,
   p_numero      in number,
   p_logradouro  in varchar2,
   p_bairro      in varchar2,
   p_localidade  in varchar2,
   p_uf          in varchar2,
   p_complemento in varchar2,
   p_latitude    in number,
   p_longitude   in number
) as
begin
   update global.tb_endereco3
      set cep = p_cep,
          numero = p_numero,
          logradouro = p_logradouro,
          bairro = p_bairro,
          localidade = p_localidade,
          uf = p_uf,
          complemento = p_complemento,
          latitude = p_latitude,
          longitude = p_longitude
    where id_endereco = p_id_endereco;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_update_endereco;
/

-- Procedure de Exclusão (PROC_DELETE_ENDERECO)

create or replace procedure global.proc_delete_endereco (
   p_id_endereco in number
) as
begin
    -- Similar ao cliente, tratar registros em TB_CLIENTEENDERECO3 e TB_ENDERECOEVENTOS3 antes.
   delete from global.tb_clienteendereco3
    where tb_endereco3_id_endereco = p_id_endereco;
   delete from global.tb_enderecoeventos3
    where tb_endereco3_id_endereco = p_id_endereco;

   delete from global.tb_endereco3
    where id_endereco = p_id_endereco;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_delete_endereco;
/

-- Procedure de Inserção (PROC_INSERT_EONET)

create or replace procedure global.proc_insert_eonet (
   p_json     in clob,
   p_data     in timestamp with local time zone,
   p_eonet_id in varchar2
) as
begin
   insert into global.tb_eonet3 (
      json,
      data,
      eonet_id
   ) values ( p_json,
              p_data,
              p_eonet_id );
   commit;
exception
   when others then
      rollback;
      raise;
end proc_insert_eonet;
/

-- Procedure de Atualização (PROC_UPDATE_EONET)

create or replace procedure global.proc_update_eonet (
   p_id_eonet_pk  in number, -- Renomeado para evitar conflito com a coluna ID_EONET
   p_json         in clob,
   p_data         in timestamp with local time zone,
   p_eonet_id_col in varchar2 -- Renomeado para evitar conflito com a coluna EONET_ID
) as
begin
   update global.tb_eonet3
      set json = p_json,
          data = p_data,
          eonet_id = p_eonet_id_col
    where id_eonet = p_id_eonet_pk;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_update_eonet;
/


-- Procedure de Exclusão (PROC_DELETE_EONET)

create or replace procedure global.proc_delete_eonet (
   p_id_eonet in number
) as
begin
    -- Similar ao cliente, tratar registros em TB_ENDERECOEVENTOS3 antes.
   delete from global.tb_enderecoeventos3
    where tb_eonet3_id_eonet = p_id_eonet;

   delete from global.tb_eonet3
    where id_eonet = p_id_eonet;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_delete_eonet;
/


-- Procedure de Inserção (PROC_INSERT_CLIENTECONTATO)


create or replace procedure global.proc_insert_clientecontato (
   p_id_cliente in number,
   p_id_contato in number
) as
begin
   insert into global.tb_clientecontato3 (
      tb_cliente3_id_cliente,
      tb_contato3_id_contato
   ) values ( p_id_cliente,
              p_id_contato );
   commit;
exception
   when others then
      rollback;
      raise;
end proc_insert_clientecontato;
/

-- Procedure de Atualização (PROC_UPDATE_CLIENTECONTATO)

create or replace procedure global.proc_update_clientecontato (
   p_cliente_id_atual in number,
   p_contato_id_atual in number,
   p_cliente_id_novo  in number,
   p_contato_id_novo  in number
) as
begin
   update global.tb_clientecontato3
      set tb_cliente3_id_cliente = p_cliente_id_novo,
          tb_contato3_id_contato = p_contato_id_novo
    where tb_cliente3_id_cliente = p_cliente_id_atual
      and tb_contato3_id_contato = p_contato_id_atual;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_update_clientecontato;
/

-- Procedure de Exclusão (PROC_DELETE_CLIENTECONTATO)

create or replace procedure global.proc_delete_clientecontato (
   p_id_cliente in number,
   p_id_contato in number
) as
begin
   delete from global.tb_clientecontato3
    where tb_cliente3_id_cliente = p_id_cliente
      and tb_contato3_id_contato = p_id_contato;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_delete_clientecontato;
/

-- Procedure de Inserção (PROC_INSERT_CLIENTEENDERECO)

create or replace procedure global.proc_insert_clienteendereco (
   p_id_cliente  in number,
   p_id_endereco in number
) as
begin
   insert into global.tb_clienteendereco3 (
      tb_cliente3_id_cliente,
      tb_endereco3_id_endereco
   ) values ( p_id_cliente,
              p_id_endereco );
   commit;
exception
   when others then
      rollback;
      raise;
end proc_insert_clienteendereco;
/

-- Procedure de Atualização (PROC_UPDATE_CLIENTEENDERECO)

create or replace procedure global.proc_delete_clienteendereco (
   p_id_cliente  in number,
   p_id_endereco in number
) as
begin
   delete from global.tb_clienteendereco3
    where tb_cliente3_id_cliente = p_id_cliente
      and tb_endereco3_id_endereco = p_id_endereco;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_delete_clienteendereco;
/

-- Procedure de Inserção (PROC_INSERT_ENDERECOEVENTO)

create or replace procedure global.proc_insert_enderecoevento (
   p_id_endereco in number,
   p_id_eonet    in number
) as
begin
   insert into global.tb_enderecoeventos3 (
      tb_endereco3_id_endereco,
      tb_eonet3_id_eonet
   ) values ( p_id_endereco,
              p_id_eonet );
   commit;
exception
   when others then
      rollback;
      raise;
end proc_insert_enderecoevento;
/

-- Procedure de Atualização (PROC_UPDATE_ENDERECOEVENTO)


create or replace procedure global.proc_update_enderecoevento (
   p_endereco_id_atual in number,
   p_eonet_id_atual    in number,
   p_endereco_id_novo  in number,
   p_eonet_id_novo     in number
) as
begin
   update global.tb_enderecoeventos3
      set tb_endereco3_id_endereco = p_endereco_id_novo,
          tb_eonet3_id_eonet = p_eonet_id_novo
    where tb_endereco3_id_endereco = p_endereco_id_atual
      and tb_eonet3_id_eonet = p_eonet_id_atual;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_update_enderecoevento;
/

-- Procedure de Exclusão (PROC_DELETE_ENDERECOEVENTO)

create or replace procedure global.proc_delete_enderecoevento (
   p_id_endereco in number,
   p_id_eonet    in number
) as
begin
   delete from global.tb_enderecoeventos3
    where tb_endereco3_id_endereco = p_id_endereco
      and tb_eonet3_id_eonet = p_id_eonet;
   commit;
exception
   when others then
      rollback;
      raise;
end proc_delete_enderecoevento;
/


--
   SET SERVEROUTPUT ON;

begin
   dbms_output.put_line('Iniciando inserção de dados...');

    -- Inserir 5 Novos Clientes (IDs esperados: 11, 12, 13, 14, 15)
   dbms_output.put_line('Inserindo Clientes...');
   global.proc_insert_cliente(
      '01/01/1980',
      'Silva',
      '111.222.333-44',
      'João'
   );       -- Esperado ID_CLIENTE = 11
   global.proc_insert_cliente(
      '15/05/1992',
      'Pereira',
      '222.333.444-55',
      'Maria'
   );      -- Esperado ID_CLIENTE = 12
   global.proc_insert_cliente(
      '23/11/1975',
      'Oliveira',
      '333.444.555-66',
      'Carlos'
   );     -- Esperado ID_CLIENTE = 13
   global.proc_insert_cliente(
      '07/07/1988',
      'Souza',
      '444.555.666-77',
      'Ana'
   );         -- Esperado ID_CLIENTE = 14
   global.proc_insert_cliente(
      '19/02/2000',
      'Rodrigues',
      '555.666.777-88',
      'Beatriz'
   );    -- Esperado ID_CLIENTE = 15
   dbms_output.put_line('Clientes inseridos.');

    -- Inserir 5 Novos Contatos (IDs esperados: 11, 12, 13, 14, 15)
   dbms_output.put_line('Inserindo Contatos...');
   global.proc_insert_contato(
      '011',
      '5555-1234',
      '99999-1234',
      'S',
      'joao.silva@email.com',
      'Principal'
   );    -- Esperado ID_CONTATO = 11
   global.proc_insert_contato(
      '021',
      '2222-5678',
      '98888-5678',
      'S',
      'maria.pereira@email.com',
      'Trabalho'
   ); -- Esperado ID_CONTATO = 12
   global.proc_insert_contato(
      '031',
      '3333-8765',
      '97777-8765',
      'N',
      'carlos.oliveira@email.com',
      'Pessoal'
   );-- Esperado ID_CONTATO = 13
   global.proc_insert_contato(
      '041',
      '4444-4321',
      '96666-4321',
      'S',
      'ana.souza@email.com',
      'Principal'
   );    -- Esperado ID_CONTATO = 14
   global.proc_insert_contato(
      '051',
      '7777-1122',
      '95555-1122',
      'S',
      'beatriz.rodrigues@email.com',
      'Outro'
   ); -- Esperado ID_CONTATO = 15
   dbms_output.put_line('Contatos inseridos.');

    -- Inserir 5 Novos Endereços (IDs esperados: 9, 10, 11, 12, 13)
   dbms_output.put_line('Inserindo Endereços...');
   global.proc_insert_endereco(
      '01001-000',
      100,
      'Rua Principal',
      'Centro',
      'Sao Paulo',
      'SP',
      'Apto 10',
      -23.550520,
      -46.633308
   );       -- Esperado ID_ENDERECO = 9
   global.proc_insert_endereco(
      '20000-000',
      25,
      'Av. Atlantica',
      'Copacabana',
      'Rio de Janeiro',
      'RJ',
      'Bloco B',
      -22.970722,
      -43.182365
   );    -- Esperado ID_ENDERECO = 10
   global.proc_insert_endereco(
      '30110-000',
      500,
      'Rua da Bahia',
      'Lourdes',
      'Belo Horizonte',
      'MG',
      'S/C',
      -19.936950,
      -43.935320
   );        -- Esperado ID_ENDERECO = 11
   global.proc_insert_endereco(
      '80010-010',
      1234,
      'Rua XV de Novembro',
      'Centro',
      'Curitiba',
      'PR',
      'Sala 3',
      -25.428356,
      -49.273250
   );     -- Esperado ID_ENDERECO = 12
   global.proc_insert_endereco(
      '90010-100',
      789,
      'Av. Borges de Medeiros',
      'Centro Historico',
      'Porto Alegre',
      'RS',
      'Conj 45',
      -30.034642,
      -51.226538
   ); -- Esperado ID_ENDERECO = 13
   dbms_output.put_line('Endereços inseridos.');

    -- Inserir 5 Novos Eventos EONET (IDs esperados: 6, 7, 8, 9, 10)
   dbms_output.put_line('Inserindo Eventos EONET...');
   global.proc_insert_eonet(
      '{"title": "Wildfire Alpha", "category": "wildfires"}',
      systimestamp,
      'EONET_wildfire_123'
   ); -- Esperado ID_EONET = 6
   global.proc_insert_eonet(
      '{"title": "Volcano Beta", "category": "volcanoes"}',
      systimestamp - interval '1' day,
      'EONET_volcano_456'
   ); -- Esperado ID_EONET = 7
   global.proc_insert_eonet(
      '{"title": "Iceberg Gamma", "category": "seaLakeIce"}',
      systimestamp - interval '2' day,
      'EONET_iceberg_789'
   ); -- Esperado ID_EONET = 8
   global.proc_insert_eonet(
      '{"title": "Severe Storm Delta", "category": "severeStorms"}',
      systimestamp - interval '3' day,
      'EONET_storm_101'
   ); -- Esperado ID_EONET = 9
   global.proc_insert_eonet(
      '{"title": "Flood Epsilon", "category": "floods"}',
      systimestamp - interval '4' day,
      'EONET_flood_112'
   ); -- Esperado ID_EONET = 10
   dbms_output.put_line('Eventos EONET inseridos.');
   dbms_output.put_line('--- IDs ESPERADOS PARA NOVOS REGISTROS DESTE SCRIPT ---');
   dbms_output.put_line('Novos Clientes: 11, 12, 13, 14, 15');
   dbms_output.put_line('Novos Contatos: 11, 12, 13, 14, 15');
   dbms_output.put_line('Novos Endereços: 9, 10, 11, 12, 13');
   dbms_output.put_line('Novos Eventos EONET: 6, 7, 8, 9, 10');
   dbms_output.put_line('----------------------------------------------------');

    -- Inserir Cliente-Contato (Relações para os novos registros)
   dbms_output.put_line('Inserindo Relações Cliente-Contato...');
   global.proc_insert_clientecontato(
      11,
      11
   ); -- João (novo ID 11) -> Contato 1 (novo ID 11)
   global.proc_insert_clientecontato(
      12,
      12
   ); -- Maria (nova ID 12) -> Contato 2 (novo ID 12)
   global.proc_insert_clientecontato(
      13,
      13
   ); -- Carlos (novo ID 13) -> Contato 3 (novo ID 13)
   global.proc_insert_clientecontato(
      14,
      14
   ); -- Ana (nova ID 14) -> Contato 4 (novo ID 14)
   global.proc_insert_clientecontato(
      15,
      15
   ); -- Beatriz (nova ID 15) -> Contato 5 (novo ID 15)
   global.proc_insert_clientecontato(
      11,
      12
   ); -- João (novo ID 11) -> Contato 2 (novo ID 12)
   dbms_output.put_line('Relações Cliente-Contato inseridas.');

    -- Inserir Cliente-Endereço (Relações para os novos registros)
   dbms_output.put_line('Inserindo Relações Cliente-Endereço...');
   global.proc_insert_clienteendereco(
      11,
      9
   );  -- João (novo ID 11) -> Endereço 1 (novo ID 9)
   global.proc_insert_clienteendereco(
      12,
      10
   ); -- Maria (nova ID 12) -> Endereço 2 (novo ID 10)
   global.proc_insert_clienteendereco(
      13,
      11
   ); -- Carlos (novo ID 13) -> Endereço 3 (novo ID 11)
   global.proc_insert_clienteendereco(
      14,
      12
   ); -- Ana (nova ID 14) -> Endereço 4 (novo ID 12)
   global.proc_insert_clienteendereco(
      15,
      13
   ); -- Beatriz (nova ID 15) -> Endereço 5 (novo ID 13)
   global.proc_insert_clienteendereco(
      11,
      10
   ); -- João (novo ID 11) -> Endereço 2 (novo ID 10)
   dbms_output.put_line('Relações Cliente-Endereço inseridas.');

    -- Inserir Endereço-Eventos (Relações para os novos registros)
   dbms_output.put_line('Inserindo Relações Endereço-Eventos...');
   global.proc_insert_enderecoevento(
      9,
      6
   );   -- Endereço 1 (novo ID 9) -> Evento EONET 1 (novo ID 6)
   global.proc_insert_enderecoevento(
      10,
      7
   );  -- Endereço 2 (novo ID 10) -> Evento EONET 2 (novo ID 7)
   global.proc_insert_enderecoevento(
      11,
      8
   );  -- Endereço 3 (novo ID 11) -> Evento EONET 3 (novo ID 8)
   global.proc_insert_enderecoevento(
      12,
      9
   );  -- Endereço 4 (novo ID 12) -> Evento EONET 4 (novo ID 9)
   global.proc_insert_enderecoevento(
      13,
      10
   ); -- Endereço 5 (novo ID 13) -> Evento EONET 5 (novo ID 10)
   global.proc_insert_enderecoevento(
      9,
      7
   );   -- Endereço 1 (novo ID 9) -> Evento EONET 2 (novo ID 7)
   dbms_output.put_line('Relações Endereço-Eventos inseridas.');
   dbms_output.put_line('Inserção de dados concluída.');
exception
   when others then
      dbms_output.put_line('Erro durante a inserção de dados: ' || sqlerrm);
      rollback;
end;
/