-- Gerado por Oracle SQL Developer Data Modeler 23.1.0.087.0806
--   em:        2025-05-27 08:28:08 BRT
--   site:      Oracle Database 21c
--   tipo:      Oracle Database 21c



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE gs_cliente (
    id_cliente      NUMBER NOT NULL,
    nome            VARCHAR2(100) NOT NULL,
    sobrenome       VARCHAR2(100) NOT NULL,
    data_nascimento VARCHAR2(10) NOT NULL,
    documento       VARCHAR2(18) NOT NULL
)
ORGANIZATION HEAP NOCOMPRESS
    NOCACHE
        NOPARALLEL
    NOROWDEPENDENCIES DISABLE ROW MOVEMENT;

ALTER TABLE gs_cliente
    ADD CONSTRAINT gs_cliente_pk PRIMARY KEY ( id_cliente ) NOT DEFERRABLE ENABLE VALIDATE;

CREATE TABLE gs_clientecontato (
    gs_cliente_id_cliente NUMBER NOT NULL,
    gs_contato_id_contato NUMBER NOT NULL
)
ORGANIZATION HEAP NOCOMPRESS
    NOCACHE
        NOPARALLEL
    NOROWDEPENDENCIES DISABLE ROW MOVEMENT;

ALTER TABLE gs_clientecontato
    ADD CONSTRAINT gs_clientecontato_pk PRIMARY KEY ( gs_cliente_id_cliente,
                                                      gs_contato_id_contato ) NOT DEFERRABLE ENABLE VALIDATE;

CREATE TABLE gs_clienteendereco (
    gs_cliente_id_cliente   NUMBER NOT NULL,
    gs_endereco_id_endereco NUMBER NOT NULL
)
ORGANIZATION HEAP NOCOMPRESS
    NOCACHE
        NOPARALLEL
    NOROWDEPENDENCIES DISABLE ROW MOVEMENT;

ALTER TABLE gs_clienteendereco
    ADD CONSTRAINT gs_clienteendereco_pk PRIMARY KEY ( gs_cliente_id_cliente,
                                                       gs_endereco_id_endereco ) NOT DEFERRABLE ENABLE VALIDATE;

CREATE TABLE gs_contato (
    id_contato   NUMBER NOT NULL,
    ddd          VARCHAR2(3) NOT NULL,
    telefone     VARCHAR2(15) NOT NULL,
    celular      VARCHAR2(15) NOT NULL,
    whatsapp     VARCHAR2(15) NOT NULL,
    email        VARCHAR2(255) NOT NULL,
    tipo_contato VARCHAR2(50) NOT NULL
)
ORGANIZATION HEAP NOCOMPRESS
    NOCACHE
        NOPARALLEL
    NOROWDEPENDENCIES DISABLE ROW MOVEMENT;

ALTER TABLE gs_contato
    ADD CONSTRAINT gs_contato_pk PRIMARY KEY ( id_contato ) NOT DEFERRABLE ENABLE VALIDATE;

CREATE TABLE gs_endereco (
    id_endereco NUMBER NOT NULL,
    cep         VARCHAR2(9) NOT NULL,
    numero      NUMBER(5) NOT NULL,
    logradouro  VARCHAR2(255) NOT NULL,
    bairro      VARCHAR2(255) NOT NULL,
    localidade  VARCHAR2(100) NOT NULL,
    uf          VARCHAR2(2) NOT NULL,
    complemento VARCHAR2(255) NOT NULL,
    latitude    NUMBER(10, 7) NOT NULL,
    longitude   NUMBER(10, 7) NOT NULL
)
ORGANIZATION HEAP NOCOMPRESS
    NOCACHE
        NOPARALLEL
    NOROWDEPENDENCIES DISABLE ROW MOVEMENT;

ALTER TABLE gs_endereco
    ADD CONSTRAINT gs_endereco_pk PRIMARY KEY ( id_endereco ) NOT DEFERRABLE ENABLE VALIDATE;

CREATE TABLE gs_enderecoeventos (
    gs_endereco_id_endereco NUMBER NOT NULL,
    gs_eonet_id_eonet       NUMBER NOT NULL
)
ORGANIZATION HEAP NOCOMPRESS
    NOCACHE
        NOPARALLEL
    NOROWDEPENDENCIES DISABLE ROW MOVEMENT;

ALTER TABLE gs_enderecoeventos
    ADD CONSTRAINT gs_enderecoeventos_pk PRIMARY KEY ( gs_endereco_id_endereco,
                                                       gs_eonet_id_eonet ) NOT DEFERRABLE ENABLE VALIDATE;

CREATE TABLE gs_eonet (
    id_eonet NUMBER NOT NULL,
    json     CLOB NULL,
    data     TIMESTAMP WITH LOCAL TIME ZONE NULL,
    eonet_id VARCHAR2(50) NOT NULL
)
ORGANIZATION HEAP NOCOMPRESS
    NOCACHE
        NOPARALLEL
    NOROWDEPENDENCIES DISABLE ROW MOVEMENT;

ALTER TABLE gs_eonet
    ADD CONSTRAINT gs_eonet_pk PRIMARY KEY ( id_eonet ) NOT DEFERRABLE ENABLE VALIDATE;

ALTER TABLE gs_clientecontato
    ADD CONSTRAINT gs_clientecontato_gs_cliente_fk FOREIGN KEY ( gs_cliente_id_cliente )
        REFERENCES gs_cliente ( id_cliente );

ALTER TABLE gs_clientecontato
    ADD CONSTRAINT gs_clientecontato_gs_contato_fk FOREIGN KEY ( gs_contato_id_contato )
        REFERENCES gs_contato ( id_contato );

ALTER TABLE gs_clienteendereco
    ADD CONSTRAINT gs_clienteendereco_gs_cliente_fk FOREIGN KEY ( gs_cliente_id_cliente )
        REFERENCES gs_cliente ( id_cliente );

ALTER TABLE gs_clienteendereco
    ADD CONSTRAINT gs_clienteendereco_gs_endereco_fk FOREIGN KEY ( gs_endereco_id_endereco )
        REFERENCES gs_endereco ( id_endereco );

ALTER TABLE gs_enderecoeventos
    ADD CONSTRAINT gs_enderecoeventos_gs_endereco_fk FOREIGN KEY ( gs_endereco_id_endereco )
        REFERENCES gs_endereco ( id_endereco );

ALTER TABLE gs_enderecoeventos
    ADD CONSTRAINT gs_enderecoeventos_gs_eonet_fk FOREIGN KEY ( gs_eonet_id_eonet )
        REFERENCES gs_eonet ( id_eonet );



-- Relatório do Resumo do Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                             7
-- CREATE INDEX                             0
-- ALTER TABLE                             13
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                          0
-- CREATE MATERIALIZED VIEW                 0
-- CREATE MATERIALIZED VIEW LOG             0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   0
-- WARNINGS                                 0
