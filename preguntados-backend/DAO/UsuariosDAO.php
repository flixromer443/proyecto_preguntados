<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../util/Constantes.php';

class UsuariosDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }
    
    public function existeUsuarioConMismoNombreCorreoODocumento($username, $correoElectronico, $documento) : bool{
        try{
            $stmt = $this->pdo->prepare("SELECT EXISTS (
                                         SELECT 1 FROM usuarios u 
                                         INNER JOIN datos_personales d
                                         ON d.id_usuario = u.id
                                         WHERE u.username=:username 
                                         OR d.correo_electronico=:correo_electronico 
                                         OR d.doc_nro=:doc_nro and d.doc_tipo=:doc_tipo
                                        )");
            $stmt->execute([
                ':username' => $username,
                ':correo_electronico' => $correoElectronico,
                ':doc_nro' => $documento->numero,
                ':doc_tipo' => $documento->tipo,
            ]);
        
            return (bool) $stmt->fetchColumn();
        }catch(PDOException $e){
            error_log("Error insert o update datos_personales: " . $e->getMessage());
            return false;
        }
    }
    
    public function guardarUsuario($usuario){
        try {
            $sql = "INSERT INTO usuarios(username, contrasenia, id_rol, id_estado)
                    VALUES(:username, :contrasenia, :id_rol, :id_estado)";
        
            $stmt = $this->pdo->prepare($sql);
        
            $stmt->execute([
                ':username' => $usuario->username,
                ':contrasenia' => password_hash($usuario->contrasenia, PASSWORD_BCRYPT),
                ':id_rol' => $usuario->id_rol,
                ':id_estado' => ESTADO_1
            ]);
            
            return (int) $this->pdo->lastInsertId();
        } catch(PDOException $e){
            error_log("Error insert usuarios: " . $e->getMessage());
        }
    }

    public function eliminarUsuario($idUsuario) : bool {
        try {
            $sql = "DELETE FROM usuarios WHERE id = :id";
    
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':id' => $idUsuario
            ]);
    
            return $stmt->rowCount() > 0;
    
        } catch (PDOException $e) {
            error_log("Error eliminarUsuario: " . $e->getMessage());
            return false;
        }
    }

}