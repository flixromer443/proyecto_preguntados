<?php
require_once __DIR__ . '/../model/AuthModel.php';

class AuthController {

    private $AuthModel;

    public function __construct() {
        $this->AuthModel = new AuthModel();
    }

    public function iniciarSesion(){
        return $this->AuthModel->iniciarSesion();
    }

    public function registrarNuevoUsuario($data){
        return $this->AuthModel->registrarNuevoUsuario($data);
    }

    public function solicitarCambioDeContrasenia(){
        return $this->AuthModel->solicitarCambioDeContrasenia();
    }

}

?>