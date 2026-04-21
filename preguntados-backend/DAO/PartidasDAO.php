<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../util/Constantes.php';
require_once __DIR__ . '/../util/RowMapper.php';

class PartidasDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }
    
    public function guardarPartida($data, $idUsuario) : bool{
        try {
            $sql = "INSERT INTO partidas(fallos, aciertos, id_usuario)
                    VALUES(:fallos, :aciertos, :id_usuario)";
        
            $stmt = $this->pdo->prepare($sql);
        
            $stmt->execute([
                ':fallos' => $data->fallos,
                ':aciertos' => $data->aciertos,
                ':id_usuario' => $idUsuario
            ]);
            
            return (int) $this->pdo->lastInsertId();
        } catch(PDOException $e){
            error_log("Error insert usuarios: " . $e->getMessage());
        }
    }

   
    

}