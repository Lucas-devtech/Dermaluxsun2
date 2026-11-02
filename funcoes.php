<?php

const CODIGO_ADMIN = 'DERMALUX-ADMIN-2025';

ini_set('display_errors', '0');

session_start();
header('Content-Type: application/json; charset=utf-8');

set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode([
        'sucesso'  => false,
        'valido'   => false,
        'mensagem' => 'Erro no servidor: ' . $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
});

function responder($dados, $status = 200) {
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

function usuario_logado() {
    return isset($_SESSION['usuario_id']);
}

function eh_admin() {
    return usuario_logado() && ($_SESSION['usuario_tipo'] ?? '') === 'admin';
}

function exigir_admin() {
    if (!eh_admin()) {
        responder(['sucesso' => false, 'mensagem' => 'Acesso restrito a administradores.'], 403);
    }
}

function iniciar_sessao_usuario($id, $nome, $tipo) {
    session_regenerate_id(true);
    $_SESSION['usuario_id']   = $id;
    $_SESSION['usuario_nome'] = $nome;
    $_SESSION['usuario_tipo'] = $tipo;
}
