<?php
require_once __DIR__ . '/Database.php';


class DatosPersonalesDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    /*public function guardarOActualizarDatosPersonales($datosPersonales){
        try{
            $existePersona = $this->existePersonaCargadaConMismoDocumento($datosPersonales->documento);
            if($existePersona){
                $this->actualizarDatosPersonalesPorDocumento($datosPersonales);
            }else{
                $this->guardarDatosPersonales($datosPersonales);
            }
        }catch(PDOException $e){
            error_log("Error insert o update datos_personales: " . $e->getMessage());
            return false;
        }
    }*/

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
            error_log("Error insert datos_personales: " . $e->getMessage());
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
            error_log("Error insert datos_personales: " . $e->getMessage());
            return false;
        }
    }

    public function actualizarDatosPersonalesPorDocumento($data){
        
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
            error_log("Error select datos_personales: " . $e->getMessage());
            return false;
        }
    }

}