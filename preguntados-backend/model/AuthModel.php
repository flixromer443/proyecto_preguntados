<?php
require_once __DIR__ . '/../DAO/UsuariosDAO.php';
require_once __DIR__ . '/../DAO/DatosPersonalesDAO.php';
require_once __DIR__ . '/../DAO/EstadisticasDAO.php';
require_once __DIR__ . '/../DAO/ClasificacionesDAO.php';
require_once __DIR__ . '/../DAO/CodigosVerificacionDAO.php';
require_once __DIR__ . '/../util/Constantes.php';
require_once __DIR__ . '/../util/MessageHandler.php';
require_once __DIR__ . '/../services/MailService.php';

class AuthModel {

    private $usuarioDAO;
    private $datosPersonalesDAO;
    private $estadisticasDAO;
    private $clasificacionesDAO;
    private $codigosVerificacionDAO;
    private $mailService;
    
    public function __construct() {
        $this->usuarioDAO = new UsuariosDAO();
        $this->datosPersonalesDAO = new DatosPersonalesDAO();
        $this->estadisticasDAO = new EstadisticasDAO();
        $this->clasificacionesDAO = new ClasificacionesDAO();
        $this->mailService = new MailService();
        $this->codigosVerificacionDAO = new CodigosVerificacionDAO();
    }

    public function iniciarSesion(){
        
    }

    public function registrarNuevoUsuario($data){
        $usuario = $data->usuario;
        $datosPersonales = $data->datosPersonales;
        $existeUsuario = $this->existeUsuarioConMismoNombreCorreoODocumento($usuario, $datosPersonales);

        if(!$existeUsuario){
            $idUsuario = $this->crearUsuario($usuario, $datosPersonales);
            $clasificacionYEstadisticasGeneradas = $this->generarClasificacionYEstadisticas($idUsuario);
            $codigoVerificacion = $this->generarCodigoVerificacion($idUsuario);
            $mailEnviado = $this->enviarCodigoDeActivacionPorMail($datosPersonales, $codigoVerificacion);
            return $this->retornarNuevoUsuarioRegistradoOHacerRollback($idUsuario, $clasificacionYEstadisticasGeneradas, $codigoVerificacion, $mailEnviado);

        }else{
            return MessageHandler::error(303,ERROR_303);
        }
    }

    private function crearUsuario($usuario, $datosPersonales){
        $idUsuario = $this->usuarioDAO->guardarUsuario($usuario);
        $idDatosPersonales = $this->datosPersonalesDAO->guardarDatosPersonales($datosPersonales, $idUsuario); 
        return ($idUsuario > 0 && $idDatosPersonales > 0) ? $idUsuario : 0;
    }

    private function generarClasificacionYEstadisticas($idUsuario){
        return $this->generarClasificacion($idUsuario) && $this->generarEstadisticas($idUsuario);
    }

    private function generarClasificacion($idUsuario){
        return ($idUsuario != 0) ? $this->clasificacionesDAO->generarClasificacion($idUsuario) : false;
    }

    private function generarEstadisticas($idUsuario){
        return ($idUsuario != 0) ? $this->estadisticasDAO->generarEstadisticas($idUsuario) : false;
    }

    private function generarCodigoVerificacion($idUsuario){
        $codigo = random_int(100000, 999999);
        $codigoGenerado = $this->codigosVerificacionDAO->guardarCodigoVerificacion($idUsuario, $codigo);
        return $codigoGenerado ? $codigo : 0;
    }

    private function enviarCodigoDeActivacionPorMail($datosPersonales, $codigo){
        return $codigo != 0 ? $this->enviarCodigoActivacion($datosPersonales, $codigo) : false;
    }

    private function enviarCodigoActivacion($datosPersonales, $codigo){
        return $this->mailService->enviarCodigoVerificacion(
            $datosPersonales->nombre,
            $datosPersonales->correoElectronico,
            $codigo
        );
    }


    private function retornarNuevoUsuarioRegistradoOHacerRollback($idUsuario, $clasificacionYEstadisticasGeneradas, $codigoVerificacion, $mailEnviado){
        $usuarioGenerado = $idUsuario > 0;
        $codigoVerificacionGenerado = $codigoVerificacion > 0;
        if($usuarioGenerado && $clasificacionYEstadisticasGeneradas && $codigoVerificacionGenerado && $mailEnviado){
            return MessageHandler::success(201, SUCCESS_201,["id_usuario" => $idUsuario]);
        }else{
            $this->usuarioDAO->eliminarUsuario($idUsuario);
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