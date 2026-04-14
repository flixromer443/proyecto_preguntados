<?php
require_once __DIR__ . '/../DAO/PreguntasDAO.php';
require_once __DIR__ . '/../DAO/RespuestasDAO.php';
require_once __DIR__ . '/../DAO/UsuariosDAO.php';
require_once __DIR__ . '/../DAO/DatosPersonalesDAO.php';
require_once __DIR__ . '/../util/Constantes.php';
require_once __DIR__ . '/../util/MessageHandler.php';
require_once __DIR__ . '/../services/MailService.php';


class AuthModel {

    private $usuarioDAO;
    private $datosPersonalesDAO;
    private $mailService;
    
    public function __construct() {
        $this->usuarioDAO = new UsuariosDAO();
        $this->datosPersonalesDAO = new DatosPersonalesDAO();
        $this->mailService = new MailService();
    }

    public function iniciarSesion(){
        
    }

    public function registrarNuevoUsuario($data){
        $usuario = $data->usuario;
        $datosPersonales = $data->datosPersonales;
        $existeUsuario = $this->existeUsuarioConMismoNombreCorreoODocumento($usuario, $datosPersonales);

        if(!$existeUsuario){
            $idUsuario = $this->crearUsuario($usuario, $datosPersonales);
            /**aca iria toda la logica del codigo de activacion */
            $codigo = random_int(100000, 999999);
            $mailEnviado = $this->enviarCodigoDeActivacionPorMail($datosPersonales, $codigo);
            
            return $this->retornarNuevoUsuarioRegistradoOHacerRollback($idUsuario, $codigo, $mailEnviado);

        }else{
            return MessageHandler::error(303,ERROR_303);
        }
    }

    private function crearUsuario($usuario, $datosPersonales){
        $idDatosPersonales = $this->datosPersonalesDAO->guardarDatosPersonales($datosPersonales); 
        $idUsuario = $this->usuarioDAO->guardarUsuario($usuario, $idDatosPersonales);
        return ($idDatosPersonales > 0 && $idUsuario > 0) ? $idUsuario : 0;
    }

    private function enviarCodigoDeActivacionPorMail($datosPersonales, $codigo){
        return $this->mailService->enviarCodigoVerificacion(
            $datosPersonales->nombre,
            $datosPersonales->correoElectronico,
            $codigo
        );
    }

    public function retornarNuevoUsuarioRegistradoOHacerRollback($idUsuario, $idCodigoVerificacion, $mailEnviado){
        $usuarioGenerado = $idUsuario > 0;
        $codigoVerificacionGenerado = $idCodigoVerificacion > 0;
        if($usuarioGenerado && $codigoVerificacionGenerado && $mailEnviado){
            return MessageHandler::success(201, SUCCESS_201,["id_usuario" => $idUsuario]);
        }else{
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