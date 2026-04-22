<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../util/Constantes.php';
require_once __DIR__ . '/../util/RowMapper.php';

class PartidasDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }
    
    public function guardarPartida($data, $idUsuario){
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

    public function obtenerPartidasJugadas($idUsuario){
        try{
            $stmt = $this->pdo->prepare("SELECT fallos, aciertos, fecha_y_hora
                                         FROM partidas 
                                         WHERE id_usuario = :id_usuario");
            $stmt->execute([
                ':id_usuario' => $idUsuario,
            ]);
        
            $partidasJugadas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $partidasJugadas ? $partidasJugadas : false;
        }catch(PDOException $e){
            error_log("Error select obtenerDatosPerfil: " . $e->getMessage());
            return false;
        }
    }

   
    

}