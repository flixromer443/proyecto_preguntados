<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../util/Constantes.php';

class EstadisticasDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }
    
    public function generarEstadisticas($idUsuario){
        try {
            $sql = "INSERT INTO estadisticas (id_tematica, id_usuario)
                    VALUES (:t1, :u),(:t2, :u),(:t3, :u),(:t4, :u),(:t5, :u),(:t6, :u)";

            $stmt = $this->pdo->prepare($sql);

            $result = $stmt->execute([
                ':t1' => TEMATICA_1,':t2' => TEMATICA_2,':t3' => TEMATICA_3,
                ':t4' => TEMATICA_4,':t5' => TEMATICA_5,':t6' => TEMATICA_6,
                ':u'  => $idUsuario
            ]);

            return $result; // true/false
        } catch(PDOException $e){
            error_log("Error generarEstadisticas " . $e->getMessage());
            return false;
        }
    }

    public function actualizarEstadisticas($data, $idTematica, $idUsuario){
        try {

           $sql = "UPDATE estadisticas
                   SET aciertos = :aciertos,
                       fallos = :fallos
                   WHERE id_usuario =  :id_usuario
                     AND id_tematica = :id_tematica";

           $stmt = $this->pdo->prepare($sql);

           return $stmt->execute([
               ':aciertos' => $data->aciertos,
               ':fallos' => $data->fallos,
               ':id_usuario' => $idUsuario,
               ':id_tematica' => $idTematica
           ]);

       } catch(PDOException $e){
           error_log("Error update actualizarEstadisticas: " . $e->getMessage());
           return false;
       }
    }


    public function obtenerEstadisticas($idUsuario){
        try{
            $stmt = $this->pdo->prepare("SELECT * FROM estadisticas 
                                         WHERE id_usuario = :id_usuario
                                         ORDER BY id_tematica ASC");
            $stmt->execute([
                ':id_usuario' => $idUsuario,
            ]);
        
            $estadisticas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $estadisticas ? $estadisticas : false;
        }catch(PDOException $e){
            error_log("Error select obtenerEstadisticas: " . $e->getMessage());
            return false;
        }
    }


}