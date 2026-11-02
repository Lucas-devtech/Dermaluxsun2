<?php

$host    = 'localhost';
$banco   = 'dermaluxsun';
$usuario = 'root';
$senha   = '';
$port    = '3306';

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$banco;charset=utf8mb4";

    $pdo = new PDO(
        $dsn,
        $usuario,
        $senha,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'sucesso'  => false,
        'valido'   => false,
        'mensagem' => 'Não foi possível conectar ao banco de dados: ' . $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
