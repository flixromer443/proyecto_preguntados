<?php
require_once __DIR__ . '/../model/AdminModel.php';
require_once __DIR__ . '/../services/TokenService.php';

class AdminController {

    private $adminModel;
    private $tokenService;

    public function __construct() {
        $this->adminModel = new AdminModel();
        $this->tokenService = new TokenService();
    }

    public function obtenerPreguntas($token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->adminModel->obtenerPreguntas();
    }

    public function crearPregunta($data, $token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->adminModel->crearPregunta($data, $decoded);
    }

    public function eliminarPregunta($data, $token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->adminModel->eliminarPregunta($data);
    }

    public function obtenerUsuarios($token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->adminModel->obtenerUsuarios();
    }

    public function cambiarEstadoUsuario($data, $token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->adminModel->cambiarEstadoUsuario($data);
    }
}

?>