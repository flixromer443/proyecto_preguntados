<?php
require_once __DIR__ . '/../DAO/PreguntasDAO.php';
require_once __DIR__ . '/../DAO/RespuestasDAO.php';
require_once __DIR__ . '/../DAO/UsuariosDAO.php';
require_once __DIR__ . '/../DAO/DatosPersonalesDAO.php';

class AuthModel {

    private $usuarioDAO;
    private $datosPersonalesDAO;

    public function __construct() {
        $this->usuarioDAO = new UsuariosDAO();
        $this->datosPersonalesDAO = new DatosPersonalesDAO();
    }

    public function iniciarSesion(){
        
    }

    public function registrarNuevoUsuario($data){
        $usuario = $data->usuario;
        $datosPersonales = $data->datosPersonales;
        
        $existeUsuario = $this->usuarioDAO->existeUsuarioConMismoNombreCorreoODocumento(
            $usuario->username,
            $datosPersonales->correoElectronico,
            $datosPersonales->documento
        );
        
        if(!$existeUsuario){
            
            /**TODO: aca podria ir un llamado a algun servicio externo
             * como para chequear que el titular del CUIL no haya fallecido */
        
            $idDatosPersonales = $this->datosPersonalesDAO->guardarDatosPersonales($datosPersonales); 
            
            if($idDatosPersonales > 0){
        
                $idUsuario = $this->usuarioDAO->guardarUsuario($usuario, $idDatosPersonales);
        
                /**TODO: aca tengo que generar el codigo de confirmacion, guardarlo
                 * Y llamar a PHPMailer para que le mande un correo a la casilla registrada
                 */
        
                return [
                    "success" => true,
                    "message" => "Usuario registrado correctamente",
                    "data" => [
                        "id_usuario" => $idUsuario,
                        "id_datos_personales" => $idDatosPersonales
                    ]
                ];
        
            } else {
                return [
                    "success" => false,
                    "message" => "Error al guardar datos personales"
                ];
            }
        
        }else{
            /**ERROR: Ya existe un usuario registrado con 
             * el mismo documento o correco electronico */
            error_log("Error: ya existe un usuario registrado con los mismos datos");
        
            return [
                "success" => false,
                "message" => "Ya existe un usuario registrado con el mismo username, correo o documento"
            ];
        }
    }

   


    public function solicitarCambioDeContrasenia(){

    }

}