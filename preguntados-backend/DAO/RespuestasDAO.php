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

    public function guardarRespuestaPorIdPregunta($data, $idPregunta){
        try {
            $sql = "INSERT INTO respuestas(id_pregunta, respuesta, id_estado_respuesta)
                    VALUES(:id_pregunta, :respuesta, :id_estado_respuesta)";
        
            $stmt = $this->pdo->prepare($sql);
        
            $stmt->execute([
                ':id_pregunta' => $idPregunta,
                ':respuesta' => $data->respuesta,
                ':id_estado_respuesta' => $data->id_estado_respuesta,
            ]);
            
            return (int) $this->pdo->lastInsertId();
        } catch(PDOException $e){
            error_log("Error insert guardarRespuestaPorIdPregunta: " . $e->getMessage());
        }
    }

}