<?php

require 'funcoes.php';

if (usuario_logado()) {
    responder([
        'logado' => true,
        'nome'   => $_SESSION['usuario_nome'],
        'tipo'   => $_SESSION['usuario_tipo'],
    ]);
}
responder(['logado' => false]);
