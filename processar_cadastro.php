<?php

require 'funcoes.php';
require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['sucesso' => false, 'mensagem' => 'Método inválido.'], 405);
}

$nome      = trim($_POST['nome'] ?? '');
$sobrenome = trim($_POST['sobrenome'] ?? '');
$email     = trim($_POST['email'] ?? '');
$senha     = $_POST['senha'] ?? '';
$whatsapp  = trim($_POST['whatsapp'] ?? '');
$querAdmin = ($_POST['quer_admin'] ?? '') === '1';
$codigo    = $_POST['codigo_admin'] ?? '';

if ($nome === '' || $email === '' || $senha === '') {
    responder(['sucesso' => false, 'mensagem' => 'Preencha nome, e-mail e senha.'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(['sucesso' => false, 'mensagem' => 'E-mail inválido.'], 400);
}
if (strlen($senha) < 8) {
    responder(['sucesso' => false, 'mensagem' => 'A senha precisa ter no mínimo 8 caracteres.'], 400);
}

$tipo = 'cliente';
if ($querAdmin) {
    if (!hash_equals(CODIGO_ADMIN, $codigo)) {
        responder(['sucesso' => false, 'mensagem' => 'Código de administrador inválido.'], 403);
    }
    $tipo = 'admin';
}

$busca = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
$busca->execute([$email]);
if ($busca->fetch()) {
    responder(['sucesso' => false, 'mensagem' => 'Este e-mail já está cadastrado. Faça login.'], 409);
}

$hash = password_hash($senha, PASSWORD_DEFAULT);
$insere = $pdo->prepare(
    'INSERT INTO usuarios (nome, sobrenome, email, senha_hash, whatsapp, tipo) VALUES (?, ?, ?, ?, ?, ?)'
);
$insere->execute([$nome, $sobrenome, $email, $hash, $whatsapp, $tipo]);

iniciar_sessao_usuario($pdo->lastInsertId(), $nome, $tipo);

responder([
    'sucesso'  => true,
    'mensagem' => $tipo === 'admin'
        ? 'Conta de administrador criada! Bem-vindo(a), ' . $nome . '.'
        : 'Bem-vindo(a), ' . $nome . '! Cadastro realizado.',
    'nome' => $nome,
    'tipo' => $tipo,
]);
