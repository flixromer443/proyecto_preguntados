<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../util/Constantes.php';

class CodigosVerificacionDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }
    
    public function guardarCodigoVerificacion($idUsuario, $codigo) : bool {
        try {
            $this->pdo->beginTransaction();

            $sqlDelete = "DELETE FROM codigos_verificacion 
                          WHERE id_usuario = :id_usuario";

            $stmtDelete = $this->pdo->prepare($sqlDelete);
            $stmtDelete->execute([
                ':id_usuario' => $idUsuario
            ]);

            $sqlInsert = "INSERT INTO codigos_verificacion (id_usuario, codigo) 
                          VALUES (:id_usuario, :codigo)";

            $stmtInsert = $this->pdo->prepare($sqlInsert);
            $stmtInsert->execute([
                ':id_usuario' => $idUsuario,
                ':codigo' => $codigo
            ]);

            $this->pdo->commit();
            return $stmtInsert->rowCount() > 0;

        } catch (PDOException $e) {
            $this->pdo->rollBack();
            error_log("Error guardarCodigoVerificacion: " . $e->getMessage());
            return false;
        }
    }
}