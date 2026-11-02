<?php

require 'funcoes.php';
require 'conexao.php';

$consulta = $pdo->query('SELECT id, nome, descricao, preco, foto FROM produtos ORDER BY id ASC');
$produtos = $consulta->fetchAll();

foreach ($produtos as &$produto) {
    $produto['id']    = (int) $produto['id'];
    $produto['preco'] = (float) $produto['preco'];
}
unset($produto);

responder(['sucesso' => true, 'produtos' => $produtos]);
