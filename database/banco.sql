CREATE DATABASE IF NOT EXISTS cidades_mais;
USE cidades_mais;

CREATE TABLE cidadao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    bairro VARCHAR(80),
    cidade VARCHAR(80),
    estado CHAR(2),
    complemento VARCHAR(100),
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prefeitura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_orgao VARCHAR(150) NOT NULL,
    secretaria VARCHAR(150),
    email_institucional VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    gestor_responsavel VARCHAR(120),
    cidade VARCHAR(80),
    estado CHAR(2),
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE problema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cidadao_id INT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    imagem_url VARCHAR(255),
    endereco VARCHAR(200) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    estado CHAR(2) NOT NULL,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    status ENUM('reportado','em andamento','concluído') NOT NULL DEFAULT 'reportado',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cidadao_id) REFERENCES cidadao(id) ON DELETE CASCADE
);

-- 6 problemas MODELO (sem dono): cada cidadão novo recebe uma cópia no cadastro
INSERT INTO problema
(cidadao_id, titulo, descricao, imagem_url, endereco, bairro, cidade, estado)
VALUES
(NULL,
 'Buraco profundo provocando acidentes no cruzamento',
 'Rua Teodoro Sampaio c/ Rodrigo Coutinho. A falta de sinalização tem causado acidentes com pedestres e motociclistas.',
 'img/buraco.png',
 'Rua Teodoro Sampaio c/ Rodrigo Coutinho',
 'Pinheiros', 'São Paulo', 'SP'),

(NULL,
 'Falta de iluminação na praça',
 'Lâmpada queimada deixa parte da praça escura durante a noite.',
 'img/pracaEscura.png',
 'Praça da Bela Vista',
 'Bela Vista', 'São Paulo', 'SP'),

(NULL,
 'Ponto irregular de entulho e descarte de móveis',
 'Descarte frequente de móveis e outros materiais em área pública.',
 'img/entulio.png',
 'Rua de Moema',
 'Moema', 'São Paulo', 'SP'),

(NULL,
 'Tampa de bueiro quebrada',
 'Estrutura danificada oferece risco para pedestres e veículos.',
 'img/boeiro.png',
 'Rua de Santana',
 'Santana', 'São Paulo', 'SP'),

(NULL,
 'Galhos secos próximos à rede elétrica',
 'Galhos secos estavam próximos à fiação e apresentavam risco para a região.',
 'img/homemAlgumaCoisa.png',
 'Rua de Vila Mariana',
 'Vila Mariana', 'São Paulo', 'SP'),

(NULL,
 'Faixa de pedestres desgastada',
 'A sinalização da faixa está apagada e dificulta a travessia no local.',
 'img/faixa.png',
 'Rua do Tatuapé',
 'Tatuapé', 'São Paulo', 'SP');