<?php

require 'funcoes.php';
require 'conexao.php';

$codigo = strtoupper(trim($_GET['codigo'] ?? ''));

if ($codigo === '') {
    responder(['valido' => false, 'mensagem' => 'Digite o código do cupom.']);
}

$busca = $pdo->prepare('SELECT codigo, tipo, valor, descricao FROM cupons WHERE codigo = ? AND ativo = 1');
$busca->execute([$codigo]);
$cupom = $busca->fetch();

if (!$cupom) {
    responder(['valido' => false, 'mensagem' => 'Cupom inválido ou expirado.']);
}

responder([
    'valido' => true,
    'codigo' => $cupom['codigo'],
    'cupom'  => [
        'tipo'      => $cupom['tipo'],
        'valor'     => (float) $cupom['valor'],
        'descricao' => $cupom['descricao'],
    ],
]);
