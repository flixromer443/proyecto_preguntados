<?php
require_once("../config/config.php");
require_once '../controller/AuthController.php';

$json = file_get_contents('php://input');
$data = json_decode($json);


if($data->metodo == "iniciarSesion"){
    $controller = new AuthController();
    echo json_encode($controller->iniciarSesion($data));
}

if($data->metodo == "registrarNuevoUsuario"){
    $controller = new AuthController();
    echo json_encode($controller->registrarNuevoUsuario($data));
}

if($data->metodo == "validarCodigoVerificacion"){
    $controller = new AuthController();
    echo json_encode($controller->validarCodigoVerificacion($data));
}

if($data->metodo == "reenviarCodigoVerificacion"){
    $controller = new AuthController();
    echo json_encode($controller->reenviarCodigoVerificacion($data));
}

if($data->metodo == "solicitarCambioDeContrasenia"){
    $controller = new AuthController();
    echo json_encode($controller->solicitarCambioDeContrasenia($data));
}
if($data->metodo == "actualizarConstrasenia"){
    $controller = new AuthController();
    echo json_encode($controller->actualizarConstrasenia($data));
}
?>