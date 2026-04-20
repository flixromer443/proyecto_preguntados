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

}