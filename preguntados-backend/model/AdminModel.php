<?php
require_once __DIR__ . '/../DAO/PreguntasDAO.php';
require_once __DIR__ . '/../DAO/RespuestasDAO.php';
require_once __DIR__ . '/../DAO/UsuariosDAO.php';
require_once __DIR__ . '/../DAO/DatosPersonalesDAO.php';
require_once __DIR__ . '/../DAO/PartidasDAO.php';
require_once __DIR__ . '/../DAO/ClasificacionesDAO.php';
require_once __DIR__ . '/../DAO/EstadisticasDAO.php';
require_once __DIR__ . '/../util/MessageHandler.php';
require_once __DIR__ . '/../services/MailService.php';


class AdminModel {

    private $preguntasDAO;
    private $respuestasDAO;
    private $usuarioDAO;
    private $mailService;


    public function __construct() {
        $this->respuestasDAO = new RespuestasDAO();
        $this->preguntasDAO = new PreguntasDAO();
        $this->usuarioDAO = new UsuariosDAO();
        $this->mailService = new MailService();
    }
    
    public function obtenerPreguntas(){
        $preguntas = $this->preguntasDAO->obtenerPreguntas();
        foreach ($preguntas as &$pregunta){
            $pregunta['respuestas'] = $this->respuestasDAO->obtenerRespuestasPorIdPregunta($pregunta['id']);
        }
        return $preguntas;
    }

    public function crearPregunta($data){
        $pregunta = $data->payload;
        $idPregunta = $this->preguntasDAO->guardarPregunta($pregunta);
        if($idPregunta > 0){
            foreach($pregunta->respuestas as &$respuesta){
                $this->respuestasDAO->guardarRespuestaPorIdPregunta($respuesta, $idPregunta);
            }
        }
        return $pregunta;
    }

    public function eliminarPregunta($data){
        $preguntaEliminada = $this->preguntasDAO->eliminarPregunta($data->id_pregunta);
        return $preguntaEliminada ? MessageHandler::success(212, SUCCESS_212, []) 
                                  : MessageHandler::error(511, ERROR_511);
    }

    public function obtenerUsuarios(){
        return $this->usuarioDAO->obtenerUsuarios();
    }

    public function cambiarEstadoUsuario($data) {
        $estadoCambiado = $this->usuarioDAO->cambiarEstado($data->id_usuario, $data->id_estado);
        
        $datosPerfil = $this->usuarioDAO->obtenerDatosPerfil($data->id_usuario);
        $nombre = $datosPerfil['datos_personales']['nombre'];
        $correo = $datosPerfil['datos_personales']['contacto']['correo_electronico'];
        
        $usuarioNotificado = $this->mailService->notificarCambioEstadoUsuario($nombre, $correo, $data->id_estado);
        return $estadoCambiado && $usuarioNotificado ? MessageHandler::success(213, SUCCESS_213, []) 
                                                     : MessageHandler::error(512, ERROR_512);
    }

}