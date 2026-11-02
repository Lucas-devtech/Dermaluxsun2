<?php

require 'funcoes.php';
require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['sucesso' => false, 'mensagem' => 'Método inválido.'], 405);
}

$email      = trim($_POST['email'] ?? '');
$senha      = $_POST['senha'] ?? '';
$querAdmin  = ($_POST['entrar_admin'] ?? '') === '1';

if ($email === '' || $senha === '') {
    responder(['sucesso' => false, 'mensagem' => 'Informe e-mail e senha.'], 400);
}

$busca = $pdo->prepare('SELECT id, nome, senha_hash, tipo FROM usuarios WHERE email = ?');
$busca->execute([$email]);
$usuario = $busca->fetch();

if (!$usuario || !password_verify($senha, $usuario['senha_hash'])) {
    responder(['sucesso' => false, 'mensagem' => 'E-mail ou senha incorretos.'], 401);
}

if ($querAdmin && $usuario['tipo'] !== 'admin') {
    responder(['sucesso' => false, 'mensagem' => 'Esta conta não é de administrador.'], 403);
}

iniciar_sessao_usuario($usuario['id'], $usuario['nome'], $usuario['tipo']);

responder([
    'sucesso'  => true,
    'mensagem' => 'Bem-vindo(a) de volta, ' . $usuario['nome'] . '!',
    'nome'     => $usuario['nome'],
    'tipo'     => $usuario['tipo'],
]);
