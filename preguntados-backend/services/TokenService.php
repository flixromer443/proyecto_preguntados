<?php

require_once __DIR__ . '/../lib/php-jwt/JWT.php';
require_once __DIR__ . '/../lib/php-jwt/Key.php';
require_once __DIR__ . '/../lib/php-jwt/ExpiredException.php';
require_once __DIR__ . '/../lib/php-jwt/SignatureInvalidException.php';
require_once __DIR__ . '/../lib/php-jwt/BeforeValidException.php';

require_once __DIR__ . '/../config/config.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class TokenService {

    private $secret;
    private $lifetime;
    private $alg;

    public function __construct() {
        $this->secret = JWT_SECRET;
        $this->lifetime = JWT_TOKEN_LIFETIME;
        $this->alg = JWT_SIGNING_ALG;

        if (!$this->secret) {
            die('JWT_SECRET no configurado');
        }
    }

    public function generarToken($datosUsuario){
        $payload = [
            'sub' => $datosUsuario['id'],
            'rol' => $datosUsuario['id_rol'],
            'iat' => time(),
            'exp' => time() + $this->lifetime
        ];
        return JWT::encode($payload, $this->secret, $this->alg[0]);
    }

    public function decodificarToken($token){
        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->alg[0]));
            return $decoded;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido']);
            exit;
        }
    }
}