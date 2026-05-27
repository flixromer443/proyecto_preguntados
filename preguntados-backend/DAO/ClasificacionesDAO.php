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

    public function obtenerRanking(){
        try {
            $sql = "SELECT 
                        u.id,
                        u.username,
                        c.puntaje,
                        SUM(e.aciertos) AS total_aciertos,
                        SUM(e.fallos) AS total_fallos,
                        ROUND(
                            (SUM(e.aciertos) * 100.0) / NULLIF(SUM(e.aciertos + e.fallos), 0),
                            2
                        ) AS porcentaje_acierto
                    FROM clasificaciones c
                        INNER JOIN datos_personales d ON d.id_usuario = c.id_usuario
                        INNER JOIN usuarios u ON u.id = c.id_usuario
                        INNER JOIN estadisticas e ON e.id_usuario = c.id_usuario
                    GROUP BY c.id_usuario, u.username, c.puntaje
                    ORDER BY c.puntaje DESC
                    LIMIT 100";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();

            $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($ranking as $i => &$row) {
                $row['posicion'] = $i + 1;
            }

            return $ranking;

        } catch(PDOException $e){
            error_log("Error obtenerRanking: " . $e->getMessage());
            return false;
        }
    }




}