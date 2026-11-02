<?php

require 'funcoes.php';
require 'conexao.php';

exigir_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['sucesso' => false, 'mensagem' => 'Método inválido.'], 405);
}

$nome      = trim($_POST['nome'] ?? '');
$descricao = trim($_POST['descricao'] ?? '');
$preco     = str_replace(',', '.', trim($_POST['preco'] ?? ''));
if ($nome === '' || $descricao === '' || $preco === '') {
    responder(['sucesso' => false, 'mensagem' => 'Preencha nome, descrição e preço.'], 400);
}
if (!is_numeric($preco) || $preco <= 0) {
    responder(['sucesso' => false, 'mensagem' => 'Preço inválido.'], 400);
}

if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    responder(['sucesso' => false, 'mensagem' => 'Envie a foto do produto.'], 400);
}

$arquivo   = $_FILES['foto'];
$extensao  = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
$permitidas = ['jpg', 'jpeg', 'png', 'webp'];

if (!in_array($extensao, $permitidas, true) || @getimagesize($arquivo['tmp_name']) === false) {
    responder(['sucesso' => false, 'mensagem' => 'A foto precisa ser JPG, PNG ou WEBP.'], 400);
}
if ($arquivo['size'] > 2 * 1024 * 1024) {
    responder(['sucesso' => false, 'mensagem' => 'A foto pode ter no máximo 2 MB.'], 400);
}

$pasta = __DIR__ . '/fotos_produtos';
if (!is_dir($pasta)) {
    mkdir($pasta, 0755, true);
}

$nomeArquivo = uniqid('produto_', true) . '.' . $extensao;
if (!move_uploaded_file($arquivo['tmp_name'], $pasta . '/' . $nomeArquivo)) {
    responder(['sucesso' => false, 'mensagem' => 'Não foi possível salvar a foto.'], 500);
}

$insere = $pdo->prepare(
    'INSERT INTO produtos (nome, descricao, preco, foto, criado_por) VALUES (?, ?, ?, ?, ?)'
);
$insere->execute([$nome, $descricao, $preco, $nomeArquivo, $_SESSION['usuario_id']]);

responder(['sucesso' => true, 'mensagem' => 'Produto "' . $nome . '" adicionado com sucesso!']);
