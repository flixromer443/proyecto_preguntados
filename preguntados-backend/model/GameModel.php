<?php
require_once __DIR__ . '/../DAO/PreguntasDAO.php';
require_once __DIR__ . '/../DAO/RespuestasDAO.php';
require_once __DIR__ . '/../DAO/UsuariosDAO.php';
require_once __DIR__ . '/../util/MessageHandler.php';


class GameModel {

    private $preguntasDAO;
    private $respuestasDAO;
    private $usuarioDAO;

    public function __construct() {
        $this->respuestasDAO = new RespuestasDAO();
        $this->preguntasDAO = new PreguntasDAO();
        $this->usuarioDAO = new UsuariosDAO();

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

}