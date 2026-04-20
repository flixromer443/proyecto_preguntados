<?php
require_once("../config/config.php");
require_once '../controller/GameController.php';

$json = file_get_contents('php://input');
$data = json_decode($json);

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
$authHeader = trim(preg_replace('/\s+/', ' ', $authHeader));
$token = null;
if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $token = $matches[1];
}

if($token){
    if($data->metodo == "obtenerPreguntasAlAzar"){
       $controller = new GameController();
        echo json_encode($controller->obtenerPreguntasAlAzar($token));
    }
    if($data->metodo == "obtenerDatosPerfil"){
        $controller = new GameController();
        echo json_encode($controller->obtenerDatosPerfil($token));
    }
}





?>