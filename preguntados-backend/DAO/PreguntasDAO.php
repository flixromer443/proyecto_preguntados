<?php
require_once __DIR__ . '/Database.php';

class PreguntasDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }
    
    public function obtenerPreguntasAlAzar() : array{
        $stmt = $this->pdo->prepare("SELECT * FROM preguntas ORDER BY RAND() LIMIT 5");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPreguntas() : array{
        $stmt = $this->pdo->prepare("SELECT * FROM preguntas");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function guardarPregunta($data){
        try {
            $sql = "INSERT INTO preguntas(id_tematica, pregunta)
                    VALUES(:id_tematica, :pregunta)";
        
            $stmt = $this->pdo->prepare($sql);
        
            $stmt->execute([
                ':id_tematica' => $data->id_tematica,
                ':pregunta' => $data->pregunta
            ]);
            
            return (int) $this->pdo->lastInsertId();
        } catch(PDOException $e){
            error_log("Error guardarPregunta: " . $e->getMessage());
        }
    }

    public function eliminarPregunta($idPregunta) : bool {
        try {
            $sql = "DELETE FROM preguntas WHERE id = :id";
    
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':id' => (int) $idPregunta
            ]);
    
            return $stmt->rowCount() > 0;
    
        } catch (PDOException $e) {
            error_log("Error eliminarPregunta: " . $e->getMessage());
            return false;
        }
    }

}