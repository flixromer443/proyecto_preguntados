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

    if($data->metodo == "actualizarDatosPerfil"){
        $controller = new GameController();
        echo json_encode($controller->actualizarDatosPerfil($data, $token));
    }

    if($data->metodo == "eliminarCuenta"){
        $controller = new GameController();
        echo json_encode($controller->eliminarCuenta($token));
    }
    
    if($data->metodo == "guardarResultados"){
        $controller = new GameController();
        echo json_encode($controller->guardarResultados($data, $token));
    }
}





?>