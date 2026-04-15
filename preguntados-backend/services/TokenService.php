<?php

require_once __DIR__ . '/../lib/php-jwt/JWT.php';
require_once __DIR__ . '/../lib/php-jwt/Key.php';
require_once __DIR__ . '/../lib/php-jwt/ExpiredException.php';
require_once __DIR__ . '/../lib/php-jwt/SignatureInvalidException.php';
require_once __DIR__ . '/../lib/php-jwt/BeforeValidException.php';

require_once __DIR__ . '/../config/config.php';

use \Firebase\JWT\JWT;

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

    public function validarToken() {

        if(!isset($_SERVER['HTTP_X_ACCESS_TOKEN'])){
            $this->errorResponse('token is required');
        }

        try {
            $token = $_SERVER['HTTP_X_ACCESS_TOKEN'];

            $payload = JWT::decode(
                $token,
                $this->secret,
                $this->alg
            );

            $newPayload = (array) $payload;
            $newPayload['iat'] = time();
            $newPayload['exp'] = time() + $this->lifetime;

            $newToken = JWT::encode(
                $newPayload,
                $this->secret,
                $this->alg[0]
            );

            return [
                'payload' => $payload,
                'token' => $newToken
            ];

        } catch(\Exception $e){
            $this->errorResponse($e->getMessage());
        }
    }

    // 📦 DATA protegida (ejemplo)
    public function getData() {

        $jwtData = $this->validarToken();

        $data = [
            ['id' => 1, 'name' => 'product 01'],
            ['id' => 2, 'name' => 'product 02'],
            ['id' => 3, 'name' => 'product 03'],
            ['id' => 4, 'name' => 'product 04']
        ];

        return [
            'status' => true,
            'payload' => [
                'data' => $data
            ],
            'jwt' => $jwtData
        ];
    }

    private function errorResponse($message){
        header("Content-Type: application/json");
        echo json_encode([
            'status' => false,
            'payload' => [
                'message' => $message
            ]
        ]);
        exit();
    }
}