<?php
require_once __DIR__ . '/../model/AuthModel.php';

class AuthController {

    private $AuthModel;

    public function __construct() {
        $this->AuthModel = new AuthModel();
    }

    public function iniciarSesion($data){
        return $this->AuthModel->iniciarSesion($data);
    }

    public function registrarNuevoUsuario($data){
        return $this->AuthModel->registrarNuevoUsuario($data);
    }



    public function validarCodigoVerificacion($data){
        return $this->AuthModel->validarCodigoVerificacion($data);
    }


    
    /*public function reenviarCodigoVerificacion($data){
        return $this->AuthModel->registrarNuevoUsuario($data);
    }*/



    /*public function solicitarCambioDeContrasenia(){
        return $this->AuthModel->solicitarCambioDeContrasenia();
    }*/

}

?>