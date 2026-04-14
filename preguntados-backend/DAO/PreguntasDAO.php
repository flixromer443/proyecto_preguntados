<?php
require_once __DIR__ . '/Database.php';

class PreguntasDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }
    
    public function obtenerPreguntasAlAzar() : array{
        $stmt = $this->pdo->prepare("SELECT * FROM preguntas ORDER BY RAND() LIMIT 5");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}