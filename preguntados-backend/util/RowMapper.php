<?php

class RowMapper{

    public static function mapUsuarioFromDB($row){
        return [
            'id' => (int) $row['id'],
            'username' => $row['username'],
            'contrasenia' => $row['contrasenia'],
            'id_rol' => (int) $row['id_rol'],
            'id_estado' => (int) $row['id_estado']
            ];
        }
        
    public static function mapDatosPerfilFromDB($row){
        return [
            'username' => $row['username'],
    
            'datos_personales' => [
                'nombre' => $row['nombre'],
                'apellido' => $row['apellido'],
                'sexo' => $row['sexo'],
    
                'documento' => [
                    'numero' => $row['doc_nro'],
                    'tipo' => $row['doc_tipo']
                ],
    
                'domicilio' => [
                    'calle' => $row['dom_calle'],
                    'numero' => $row['dom_nro'],
                    'localidad' => $row['dom_loc'],
                    'departamento' => $row['dom_depto'],
                    'provincia' => $row['dom_pcia']
                ],
    
                'contacto' => [
                    'telefono' => $row['telefono'],
                    'correo_electronico' => $row['correo_electronico']
                ]
            ]
        ];
    }

    public static function mapUsuariosFromDB($row) {
       return [
            'id' => isset($row['id']) ? (int)$row['id'] : null,
            'username' => $row['username'],
            'id_rol' => (int)$row['id_rol'],
            'id_estado' => (int)$row['id_estado']
        ];
    }
}

    

?>