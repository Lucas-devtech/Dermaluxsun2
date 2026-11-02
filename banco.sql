
CREATE DATABASE IF NOT EXISTS dermaluxsun
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE dermaluxsun;

CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(80)  NOT NULL,
  sobrenome   VARCHAR(80)  NULL,
  email       VARCHAR(120) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL,
  whatsapp    VARCHAR(30)  NULL,
  tipo        ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS produtos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(120)  NOT NULL,
  descricao   TEXT          NOT NULL,
  preco       DECIMAL(10,2) NOT NULL,
  foto        VARCHAR(255)  NOT NULL,
  criado_por  INT NULL,
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS cupons (
  codigo     VARCHAR(30) PRIMARY KEY,
  tipo       ENUM('percentual','2x1','frete') NOT NULL,
  valor      DECIMAL(5,4) NOT NULL DEFAULT 0,
  descricao  VARCHAR(160) NOT NULL,
  ativo      TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO cupons (codigo, tipo, valor, descricao) VALUES
  ('SOLAR25',    'percentual', 0.2500, '25% de desconto na primeira compra'),
  ('KIT30OFF',   'percentual', 0.3000, '30% de desconto nos kits'),
  ('BEMVINDO15', 'percentual', 0.1500, '15% de desconto de boas-vindas'),
  ('SOLAR2X1',   '2x1',        0.0000, 'Leve 2 e pague 1 em SprayGlow ou AquaShield'),
  ('FRETELIVRE', 'frete',      0.0000, 'Frete grátis em pedidos acima de R$ 99')
ON DUPLICATE KEY UPDATE descricao = VALUES(descricao);
