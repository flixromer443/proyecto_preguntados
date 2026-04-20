<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../util/Constantes.php';
require_once __DIR__ . '/../util/RowMapper.php';

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
    
    public function existeOtroUsuarioConMismoNombreCorreoODocumento($data, $idUsuario) : bool{
        try{
            $stmt = $this->pdo->prepare("SELECT EXISTS (
                                         SELECT 1 FROM usuarios u 
                                         INNER JOIN datos_personales d
                                         ON d.id_usuario = u.id
                                         WHERE 
                                            u.username=:username and u.id != :id_usuario
                                         OR d.correo_electronico=:correo_electronico and u.id != :id_usuario 
                                         OR d.doc_nro=:doc_nro and d.doc_tipo=:doc_tipo and u.id != :id_usuario

                                        )");
            $stmt->execute([
                ':username' => $data->username,
                ':correo_electronico' => $data->contacto->correoElectronico,
                ':doc_nro' => $data->documento->numero,
                ':doc_tipo' => $data->documento->tipo,
                ':id_usuario' => $idUsuario,
            ]);
        
            return (bool) $stmt->fetchColumn();
        }catch(PDOException $e){
            error_log("Error select datos_personales: " . $e->getMessage());
            return false;
        }
    }

    public function actualizarUsername($username, $idUsuario) {
        $sql = "UPDATE usuarios SET username =:username WHERE id = :id_usuario";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':username' => $username,
            ':id_usuario' => $idUsuario
        ]);

        return $stmt->rowCount() > 0;
    }
    
    public function obtenerUsuarioPorUsernameOCorreoElectronico($input){
        try{
            $stmt = $this->pdo->prepare("SELECT u.* FROM usuarios u
                                         INNER JOIN datos_personales d
                                         ON d.id_usuario = u.id
                                         WHERE u.username=:username
                                         OR d.correo_electronico=:correo_electronico");
            $stmt->execute([
                ':username' => $input,
                ':correo_electronico' => $input
            ]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            return $usuario ? RowMapper::mapUsuarioFromDB($usuario) : false;
        }catch(PDOException $e){
            error_log("Error al obtener usuario: " . $e->getMessage());
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

    public function obtenerUsuarioPorId($idUsuario){
        try{
            $stmt = $this->pdo->prepare("SELECT * FROM usuarios WHERE id=:id_usuario");
            $stmt->execute([
                ':id_usuario' => $idUsuario
            ]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            return $usuario ? RowMapper::mapUsuarioFromDB($usuario) : false;
        }catch(PDOException $e){
            error_log("Error al obtener usuario: " . $e->getMessage());
            return false;
        }
    }

    public function cambiarEstado($idUsuario, $idEstado) {
        $sql = "UPDATE usuarios SET id_estado = :id_estado 
                WHERE id = :id_usuario";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id_estado' => $idEstado,
            ':id_usuario' => $idUsuario
        ]);

        return $stmt->rowCount() > 0;
    }

    public function actualizarContrasenia($idUsuario, $contrasenia) {
        $sql = "UPDATE usuarios SET contrasenia = :contrasenia 
                WHERE id = :id_usuario";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':contrasenia' => password_hash($contrasenia, PASSWORD_BCRYPT),
            ':id_usuario' => $idUsuario
        ]);

        return $stmt->rowCount() > 0;
    }

    public function obtenerDatosPerfil($idUsuario){
        try{
            $stmt = $this->pdo->prepare("SELECT u.username, 
                                                d.nombre, d.apellido, d.sexo,
                                                d.doc_nro, d.doc_tipo, 
                                                d.dom_calle, d.dom_nro, 
                                                d.dom_loc, d.dom_depto, d.dom_pcia,
                                                d.telefono, d.correo_electronico 
                                        FROM usuarios u 
                                        INNER JOIN datos_personales d 
                                        ON d.id_usuario = u.id
                                        WHERE u.id = $idUsuario
                                        ");
            $stmt->execute([
                ':id_usuario' => $idUsuario,
            ]);
        
            $datosPerfil = $stmt->fetch(PDO::FETCH_ASSOC);

            return $datosPerfil ? RowMapper::mapDatosPerfilFromDB($datosPerfil) : false;
        }catch(PDOException $e){
            error_log("Error select obtenerDatosPerfil: " . $e->getMessage());
            return false;
        }
    }
    

}