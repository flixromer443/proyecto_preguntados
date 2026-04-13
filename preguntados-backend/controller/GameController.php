<?php
require_once __DIR__ . '/../model/GameModel.php';

class GameController {

    private $gameModel;

    public function __construct() {
        $this->gameModel = new GameModel();
    }

    public function obtenerPreguntasAlAzar(){
         return $this->gameModel->obtenerPreguntasAlAzar();
    }
}

?>