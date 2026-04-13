<?php
require_once("../config/config.php");
require_once '../controller/GameController.php';

$json = file_get_contents('php://input');
$data = json_decode($json);

if($data->metodo == "obtenerPreguntasAlAzar"){
    $controller = new GameController();
    echo json_encode($controller->obtenerPreguntasAlAzar());
}
?>