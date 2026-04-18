<?php
require_once __DIR__ . '/../DAO/UsuariosDAO.php';
require_once __DIR__ . '/../DAO/DatosPersonalesDAO.php';
require_once __DIR__ . '/../DAO/EstadisticasDAO.php';
require_once __DIR__ . '/../DAO/ClasificacionesDAO.php';
require_once __DIR__ . '/../DAO/CodigosVerificacionDAO.php';
require_once __DIR__ . '/../util/Constantes.php';
require_once __DIR__ . '/../util/MessageHandler.php';
require_once __DIR__ . '/../services/MailService.php';
require_once __DIR__ . '/../services/TokenService.php';

class AuthModel {

    private $usuarioDAO;
    private $datosPersonalesDAO;
    private $estadisticasDAO;
    private $clasificacionesDAO;
    private $codigosVerificacionDAO;
    private $mailService;
    private $tokenService;
    
    public function __construct() {
        $this->usuarioDAO = new UsuariosDAO();
        $this->datosPersonalesDAO = new DatosPersonalesDAO();
        $this->estadisticasDAO = new EstadisticasDAO();
        $this->clasificacionesDAO = new ClasificacionesDAO();
        $this->codigosVerificacionDAO = new CodigosVerificacionDAO();
        $this->mailService = new MailService();
        $this->tokenService = new TokenService();
    }

    public function iniciarSesion($data){
        $datosUsuario = $this->obtenerDatosUsuario($data->credenciales);
        if($datosUsuario){
            $usuarioActivo = $this->elUsuarioSeEncuentraActivo($datosUsuario);
            return $usuarioActivo ? MessageHandler::success(202, SUCCESS_202, $this->retornarUsuarioValidadoYToken($datosUsuario))
                                  : MessageHandler::success(206, SUCCESS_206, $this->retornarUsuarioInactivo($datosUsuario));
        }else{
            return MessageHandler::error(500, ERROR_502);
        }
    }
    
    private function elUsuarioSeEncuentraActivo($datosUsuario){
        return $datosUsuario['id_estado'] == ESTADO_2;
    }

    private function obtenerDatosUsuario($credenciales){
        $contraseniaVerificada = false;
        $usuarioEncontrado = $this->usuarioDAO->obtenerUsuarioPorUsernameOCorreoElectronico($credenciales->username);
        if($usuarioEncontrado){
            $contraseniaVerificada = password_verify($credenciales->contrasenia, $usuarioEncontrado['contrasenia']);
        }
        return $usuarioEncontrado && $contraseniaVerificada ? $usuarioEncontrado : false;
    }

    private function retornarUsuarioValidadoYToken($datosUsuario){
        return[
            'usuario' => $this->filtrarDatosNecesarios($datosUsuario),
            'token' => $this->tokenService->generarToken($datosUsuario)
        ];
    }

    private function retornarUsuarioInactivo($datosUsuario){
        return[
            'id_usuario' => $datosUsuario['id'],
            'accion' => 1
        ];
    }

    private function filtrarDatosNecesarios($datosUsuario){
        return[
            'id'=> $datosUsuario['id'],
            'id_rol'=> $datosUsuario['id'],
            'id_estado'=> $datosUsuario['id_estado']
        ];
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
   

    public function validarCodigoVerificacion($data){
        $codigoValido = $this->existeCodigoDeVerificacionValido($data);
        if($codigoValido){
            return $this->activarUsuarioOHabilitarCambioContrasenia($data);
        }else{
            return MessageHandler::error(503, ERROR_503);
        }

    }

    private function existeCodigoDeVerificacionValido($data){
       return $this->codigosVerificacionDAO->existeCodigoDeVerificacion(
            $data->payload->id_usuario,
            $data->payload->codigo
        );
    }

    private function activarUsuarioOHabilitarCambioContrasenia($data){
        $retorno = null;
        $usuario = $this->usuarioDAO->obtenerUsuarioPorId($data->payload->id_usuario);
        if($usuario['id_estado'] == ESTADO_1){
            $retorno = MessageHandler::success(203, SUCCESS_203,[]);
        }elseif($usuario['id_estado'] == ESTADO_3){
            $retorno = MessageHandler::success(203, SUCCESS_204,[]);
        }

        $this->codigosVerificacionDAO->eliminarCodigoDeVerificacion($data->payload->id_usuario);
        $this->usuarioDAO->cambiarEstado($data->payload->id_usuario, ESTADO_2);        

        return $retorno;
    }


    public function reenviarCodigoVerificacion($data){
        $retorno = null;
        $usuario = $this->usuarioDAO->obtenerUsuarioPorId($data->id_usuario);
        if($usuario){
            $datosPersonales = $this->datosPersonalesDAO->obtenerDatosPersonalesPorIdUsuario($data->id_usuario);
            $mailEnviado = $this->enviarCorreoConNuevoCodigoDeVerificacion($datosPersonales, $data->id_usuario);
            $retorno = $mailEnviado ? MessageHandler::success(205, SUCCESS_205,[]) 
                                    : MessageHandler::error(503, ERROR_504);
        }else{
            $retorno = MessageHandler::error(304, ERROR_304);
        }
        return $retorno;
    }
    
    private function mapearDatosPersonalesParaReenviarCodigo($datosPersonales){
        $datosMapeados = new stdClass();
        $datosMapeados->nombre = $datosPersonales['nombre'];
        $datosMapeados->correoElectronico = $datosPersonales['correo_electronico'];
        return $datosMapeados;
    }

    private function enviarCorreoConNuevoCodigoDeVerificacion($datosPersonales, $idUsuario){
        return $this->enviarCodigoDeActivacionPorMail(
            $this->mapearDatosPersonalesParaReenviarCodigo($datosPersonales), 
            $this->generarCodigoVerificacion($idUsuario)
        );
    }
    
    public function solicitarCambioDeContrasenia($data){
        $retorno = null;
        $usuarioEncontrado = $this->obtenerUsuarioPorCorreoElectronico($data->correo_electronico);
        
        if($usuarioEncontrado){
            $payload = new stdClass();
            $payload->id_usuario = $usuarioEncontrado['id'];
         
            $retorno = $this->reenviarCodigoVerificacion($payload);
        }else{
            $retorno = MessageHandler::error(304, ERROR_304);
        }
        return $retorno;
    }

    private function obtenerUsuarioPorCorreoElectronico($correoElectronico){
        return $this->usuarioDAO->obtenerUsuarioPorUsernameOCorreoElectronico($correoElectronico);
    }

}