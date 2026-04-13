<?php
require_once __DIR__ . '/../DAO/PreguntasDAO.php';
require_once __DIR__ . '/../DAO/RespuestasDAO.php';

class GameModel {

    private $preguntasDAO;
    private $respuestasDAO;

    public function __construct() {
        $this->respuestasDAO = new RespuestasDAO();
        $this->preguntasDAO = new PreguntasDAO();
    }
    
    public function obtenerPreguntasAlAzar(){
        $preguntas = $this->preguntasDAO->obtenerPreguntasAlAzar();
        foreach ($preguntas as &$pregunta){
            $pregunta['respuestas'] = $this->respuestasDAO->obtenerRespuestasPorIdPregunta($pregunta['id']);
        }
        return $preguntas;
    }

}