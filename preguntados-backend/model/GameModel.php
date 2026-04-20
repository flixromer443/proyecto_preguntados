<?php
require_once __DIR__ . '/../DAO/PreguntasDAO.php';
require_once __DIR__ . '/../DAO/RespuestasDAO.php';
require_once __DIR__ . '/../DAO/UsuariosDAO.php';
require_once __DIR__ . '/../DAO/DatosPersonalesDAO.php';
require_once __DIR__ . '/../util/MessageHandler.php';


class GameModel {

    private $preguntasDAO;
    private $respuestasDAO;
    private $usuarioDAO;
    private $datosPersonalesDAO;

    public function __construct() {
        $this->respuestasDAO = new RespuestasDAO();
        $this->preguntasDAO = new PreguntasDAO();
        $this->usuarioDAO = new UsuariosDAO();
        $this->datosPersonalesDAO = new DatosPersonalesDAO();
    }
    
    public function obtenerPreguntasAlAzar(){
        $preguntas = $this->preguntasDAO->obtenerPreguntasAlAzar();
        foreach ($preguntas as &$pregunta){
            $pregunta['respuestas'] = $this->respuestasDAO->obtenerRespuestasPorIdPregunta($pregunta['id']);
        }
        return $preguntas;
    }

    public function obtenerDatosPerfil($data){
        $datosPerfil = $this->usuarioDAO->obtenerDatosPerfil($data->sub);
        return $datosPerfil ? MessageHandler::success(208, SUCCESS_208, $datosPerfil) 
                            : MessageHandler::error(506, ERROR_506);
    }

   public function actualizarDatosPerfil($data, $decoded){
        $payload = $data->payload;

        $existeOtroUsuario = $this->usuarioDAO->existeOtroUsuarioConMismoNombreCorreoODocumento(
            $payload->datos_personales,
            $decoded->sub
        );

        if ($existeOtroUsuario) {
            return MessageHandler::error(507, ERROR_507);
        }

        $datosActualizados = $this->actualizarUsernameYDatosPersonales(
            $payload->username,
            $payload->datos_personales,
            $decoded->sub
        );

        return $datosActualizados
            ? MessageHandler::success(209, SUCCESS_209)
            : MessageHandler::error(507, ERROR_507);
    }

    private function actualizarUsernameYDatosPersonales($username, $datosPersonales, $idUsuario){
        return $this->usuarioDAO->actualizarUsername($username, $idUsuario) ||
               $this->datosPersonalesDAO->actualizarDatosPersonales($datosPersonales, $idUsuario);      
    }
}