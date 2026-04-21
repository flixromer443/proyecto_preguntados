<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../util/Constantes.php';

class ClasificacionesDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }
    
    public function generarClasificacion($idUsuario){
        try {
            $sql = "INSERT INTO clasificaciones (id_usuario) VALUES (:id_usuario)";
            $stmt = $this->pdo->prepare($sql);
            return $stmt->execute([':id_usuario' => $idUsuario]);
        } catch(PDOException $e){
            error_log("Error insert estadisticas: " . $e->getMessage());
            return false;
        }
    }

    public function obtenerClasificacion($idUsuario){
        try{
            $stmt = $this->pdo->prepare("SELECT * FROM clasificaciones WHERE id_usuario=:id_usuario");
            $stmt->execute([
                ':id_usuario' => $idUsuario
            ]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }catch(PDOException $e){
            error_log("Error al obtener clasificacion: " . $e->getMessage());
            return false;
        }
    }

    public function actualizarPuntaje($puntaje, $idUsuario){
        $stmt = $this->pdo->prepare("UPDATE clasificaciones SET puntaje=:puntaje 
                                     WHERE id_usuario=:id_usuario");
        $stmt->execute([
            ':puntaje' => $puntaje,
            ':id_usuario' => $idUsuario
        ]);
        return $stmt->rowCount() > 0;
    }

}