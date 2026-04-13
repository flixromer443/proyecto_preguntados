<?php
require_once __DIR__ . '/../DAO/PreguntasDAO.php';
require_once __DIR__ . '/../DAO/RespuestasDAO.php';
require_once __DIR__ . '/../DAO/UsuariosDAO.php';
require_once __DIR__ . '/../DAO/DatosPersonalesDAO.php';
require_once __DIR__ . '/../util/Constantes.php';
require_once __DIR__ . '/../util/MessageHandler.php';


class AuthModel {

    private $usuarioDAO;
    private $datosPersonalesDAO;

    public function __construct() {
        $this->usuarioDAO = new UsuariosDAO();
        $this->datosPersonalesDAO = new DatosPersonalesDAO();
    }

    public function iniciarSesion(){
        
    }

    public function registrarNuevoUsuario($data){
        $usuario = $data->usuario;
        $datosPersonales = $data->datosPersonales;
        $existeUsuario = $this->existeUsuarioConMismoNombreCorreoODocumento($usuario, $datosPersonales);

        if(!$existeUsuario){
            $idDatosPersonales = $this->datosPersonalesDAO->guardarDatosPersonales($datosPersonales); 
            return $this->guardarUsuario($usuario, $idDatosPersonales);

        }else{
            return MessageHandler::error(303,ERROR_303);
        }
    }

    private function guardarUsuario($usuario, $idDatosPersonales){
        if($idDatosPersonales > 0){
            $idUsuario = $this->usuarioDAO->guardarUsuario($usuario, $idDatosPersonales);
            /**TODO: aca tengo que generar el codigo de confirmacion, guardarlo
            * Y llamar a PHPMailer para que le mande un correo a la casilla registrada
            */
            return MessageHandler::success(
                201, SUCCESS_201,[
                    "id_usuario" => $idUsuario,
                    "id_datos_personales" => $idDatosPersonales
                ]);
        } else {
            return MessageHandler::error(501, ERROR_501);
        }
    }

    private function existeUsuarioConMismoNombreCorreoODocumento ($usuario, $datosPersonales){
        return $this->usuarioDAO->existeUsuarioConMismoNombreCorreoODocumento(
            $usuario->username,
            $datosPersonales->correoElectronico,
            $datosPersonales->documento
        );
    }
   


    public function solicitarCambioDeContrasenia(){

    }

}