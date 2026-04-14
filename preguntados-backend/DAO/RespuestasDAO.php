<?php
require_once __DIR__ . '/Database.php';

class RespuestasDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }
    
    public function obtenerRespuestasPorIdPregunta($idPregunta){
        $stmt = $this->pdo->prepare("SELECT id, respuesta, id_estado_respuesta FROM respuestas WHERE id_pregunta = :id_pregunta");
        $stmt->execute([
            ':id_pregunta' => $idPregunta
        ]);

        return  $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}