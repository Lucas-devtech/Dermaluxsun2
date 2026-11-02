<?php

require 'funcoes.php';

$_SESSION = [];
session_destroy();
responder(['sucesso' => true]);
