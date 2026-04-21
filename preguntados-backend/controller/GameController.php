<?php
require_once __DIR__ . '/../model/GameModel.php';
require_once __DIR__ . '/../services/TokenService.php';

class GameController {

    private $gameModel;
    private $tokenService;

    public function __construct() {
        $this->gameModel = new GameModel();
        $this->tokenService = new TokenService();
    }

    public function obtenerPreguntasAlAzar($token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->gameModel->obtenerPreguntasAlAzar();
    }

    public function obtenerDatosPerfil($token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->gameModel->obtenerDatosPerfil($decoded);
    }

    public function actualizarDatosPerfil($data, $token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->gameModel->actualizarDatosPerfil($data, $decoded);
    }

    public function eliminarCuenta($token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->gameModel->eliminarCuenta($decoded);
    }
    
    public function guardarResultados($data, $token){
        $decoded = $this->tokenService->decodificarToken($token);
        return $this->gameModel->guardarResultados($data, $decoded);
    }
}

?>