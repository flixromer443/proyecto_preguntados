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
    }

?>