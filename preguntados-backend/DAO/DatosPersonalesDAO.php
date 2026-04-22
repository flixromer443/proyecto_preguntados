<?php
require_once __DIR__ . '/Database.php';


class DatosPersonalesDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function existePersonaCargadaConMismoDocumento($documento){
        try{
            $stmt = $this->pdo->prepare("SELECT EXISTS 
                                        (SELECT 1 FROM datos_personales d 
                                         WHERE d.doc_nro=:doc_nro 
                                         and d.doc_tipo=:doc_tipo
                                    )");
            $stmt->execute([
                ':doc_nro' => $documento->numero,
                ':doc_tipo' => $documento->tipo,
            ]);
        
            return (bool) $stmt->fetchColumn();

        }catch(PDOException $e){
            error_log("Error existePersonaCargadaConMismoDocumento: " . $e->getMessage());
            return false;
        }
    }
    


    public function guardarDatosPersonales($datosPersonales, $idUsuario){
        try{
            if($idUsuario > 0){
                $sql = "INSERT INTO 
                 datos_personales (
                    nombre, apellido, sexo, 
                    doc_nro, doc_tipo,
                    dom_calle, dom_nro, dom_loc, dom_depto, dom_pcia, 
                    telefono, correo_electronico, id_usuario)
                 VALUES(
                    :nombre, :apellido, :sexo, 
                    :doc_nro, :doc_tipo, 
                    :dom_calle, :dom_nro, :dom_loc, :dom_depto, :dom_pcia, 
                    :telefono, :correo_electronico, :id_usuario
                )";

                $stmt = $this->pdo->prepare($sql);

                $stmt->execute([
                    ':nombre' => $datosPersonales->nombre,
                    ':apellido' => $datosPersonales->apellido,
                    ':sexo' => $datosPersonales->sexo,
                    ':doc_nro' => $datosPersonales->documento->numero,
                    ':doc_tipo' => $datosPersonales->documento->tipo,
                    ':dom_calle' => $datosPersonales->domicilio->calle,
                    ':dom_nro' => $datosPersonales->domicilio->numero,
                    ':dom_loc' => $datosPersonales->domicilio->localidad,
                    ':dom_depto' => $datosPersonales->domicilio->departamento,
                    ':dom_pcia' => $datosPersonales->domicilio->provincia,
                    ':telefono' => $datosPersonales->telefono,
                    ':correo_electronico' => $datosPersonales->correoElectronico,
                    ':id_usuario' => $idUsuario
                ]);

            }
            return (int) $this->pdo->lastInsertId();

        }catch(PDOException $e){
            error_log("Error insert guardarDatosPersonales: " . $e->getMessage());
            return false;
        }
    }

    public function obtenerDatosPersonalesPorIdUsuario($idUsuario){
        try{
            $stmt = $this->pdo->prepare("SELECT * FROM datos_personales  
                                         WHERE id_usuario=:id_usuario ");
            $stmt->execute([
                ':id_usuario' => $idUsuario,
            ]);
            return $stmt->fetch(PDO::FETCH_ASSOC);

        }catch(PDOException $e){
            error_log("Error select obtenerDatosPersonalesPorIdUsuario: " . $e->getMessage());
            return false;
        }
    }

    public function actualizarDatosPersonales($datosPersonales, $idUsuario){
        $sql = "UPDATE datos_personales 
        SET nombre = :nombre,
            apellido = :apellido,
            sexo = :sexo,
            doc_nro = :doc_nro,
            doc_tipo = :doc_tipo,
            dom_calle = :dom_calle,
            dom_nro = :dom_nro,
            dom_loc = :dom_loc,
            dom_depto = :dom_depto,
            dom_pcia = :dom_pcia,
            telefono = :telefono,
            correo_electronico = :correo_electronico
        WHERE id_usuario = :id_usuario";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
           ':nombre' => $datosPersonales->nombre,
           ':apellido' => $datosPersonales->apellido,
           ':sexo' => $datosPersonales->sexo,
           ':doc_nro' => $datosPersonales->documento->numero,
           ':doc_tipo' => $datosPersonales->documento->tipo,
           ':dom_calle' => $datosPersonales->domicilio->calle,
           ':dom_nro' => $datosPersonales->domicilio->numero,
           ':dom_loc' => $datosPersonales->domicilio->localidad,
           ':dom_depto' => $datosPersonales->domicilio->departamento,
           ':dom_pcia' => $datosPersonales->domicilio->provincia,
           ':telefono' => $datosPersonales->contacto->telefono,
           ':correo_electronico' => $datosPersonales->contacto->correo_electronico,
           ':id_usuario' => $idUsuario
        ]);
       
        return $stmt->rowCount() > 0;
    }

}