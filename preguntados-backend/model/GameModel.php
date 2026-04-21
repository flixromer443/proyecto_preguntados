<?php
require_once __DIR__ . '/../DAO/PreguntasDAO.php';
require_once __DIR__ . '/../DAO/RespuestasDAO.php';
require_once __DIR__ . '/../DAO/UsuariosDAO.php';
require_once __DIR__ . '/../DAO/DatosPersonalesDAO.php';
require_once __DIR__ . '/../DAO/PartidasDAO.php';
require_once __DIR__ . '/../DAO/ClasificacionesDAO.php';
require_once __DIR__ . '/../DAO/EstadisticasDAO.php';
require_once __DIR__ . '/../util/MessageHandler.php';


class GameModel {

    private $preguntasDAO;
    private $respuestasDAO;
    private $usuarioDAO;
    private $datosPersonalesDAO;
    private $partidasDAO;
    private $clasificacionesDAO;
    private $estadisticasDAO;


    public function __construct() {
        $this->respuestasDAO = new RespuestasDAO();
        $this->preguntasDAO = new PreguntasDAO();
        $this->usuarioDAO = new UsuariosDAO();
        $this->datosPersonalesDAO = new DatosPersonalesDAO();
        $this->partidasDAO = new PartidasDAO();
        $this->clasificacionesDAO = new ClasificacionesDAO();
        $this->estadisticasDAO = new EstadisticasDAO();
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

    public function eliminarCuenta($decoded){
        $usuarioEliminado = $this->usuarioDAO->eliminarUsuario($decoded->sub);
        return $usuarioEliminado ? MessageHandler::success(209, SUCCESS_210)
                                 : MessageHandler::error(507, ERROR_508);
    }

    public function guardarResultados($data, $decoded){
        //grabar partida
        $idUsuario = $decoded->sub;
        $payload = $data->payload;
        $partidaGuardada = $this->partidasDAO->guardarPartida($payload, $idUsuario);
        
        //sumar aciertos en clasificaciones
        $clasificacion = $this->clasificacionesDAO->obtenerClasificacion($idUsuario);
        $nuevoPuntaje = $payload->aciertos + (int) $clasificacion['puntaje'];
        $puntajeActualizado = $this->clasificacionesDAO->actualizarPuntaje($nuevoPuntaje, $idUsuario);
        
        //grabar las estadisticas
        $estadisticasActualizadas = false;
        $estadisticas = $payload->estadisticas;
        foreach ($estadisticas as $idTematica => $estadistica) {
            $estadisticasActualizadas = $this->estadisticasDAO->actualizarEstadisticas($estadistica, $idTematica, $idUsuario);
        }

        $resultadosGuardadosExitosamente = $partidaGuardada > 0 && $puntajeActualizado && $estadisticasActualizadas;
        return $resultadosGuardadosExitosamente ? MessageHandler::success(211, SUCCESS_211)
                                                : MessageHandler::error(509, ERROR_509);
    }

    public function obtenerEstadisticas($decoded){
        $idUsuario = $decoded->sub;
        $estadisticas = $this->estadisticasDAO->obtenerEstadisticas($idUsuario);

        $response = ["estadisticas" => []];
        foreach ($estadisticas as $fila) {
            $aciertos = (int)$fila['aciertos'];
            $fallos   = (int)$fila['fallos'];
            $total    = $aciertos + $fallos;

            $porcentaje = $total > 0 ? round(($aciertos / $total) * 100, 2) : 0;

            $response["estadisticas"][] = [
                "id_tematica" => (string)$fila['id_tematica'],
                "porcentaje_acierto" => $porcentaje
            ];
        }

        return $response;
    }

    public function obtenerHistorial($decoded){
        $idUsuario = $decoded->sub;
        $partidas = $this->partidasDAO->obtenerPartidasJugadas($idUsuario);

        $response = ["partidas" => []];
        foreach ($partidas as $fila) {
            $response["partidas"][] = [
                "fallos" => (int) $fila['fallos'],
                "aciertos" => (int) $fila['aciertos'],
                "fecha_y_hora" =>  $fila['fecha_y_hora'],
            ];
        }
        return $response;
    }


}