<?php
require_once("../config/config.php");
require_once '../controller/AdminController.php';

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
    if($data->metodo == "obtenerPreguntas"){
       $controller = new AdminController();
        echo json_encode($controller->obtenerPreguntas($token));
    }
    if($data->metodo == "crearPregunta"){
       $controller = new AdminController();
       echo json_encode($controller->crearPregunta($data, $token));
    }
    if($data->metodo == "eliminarPregunta"){
       $controller = new AdminController();
       echo json_encode($controller->eliminarPregunta($data, $token));
    }
}


?>