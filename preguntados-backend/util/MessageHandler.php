<?php
require_once __DIR__ . '/../config/config.php';

class MessageHandler {

    public static function response($success, $code, $message, $data = null) {
        return [
            "success" => $success,
            "code" => $code,
            "message" => $message,
            "data" => $data
        ];
    }

    public static function success($code = 200, $message = "OK", $data = null) {
        return self::response(true, $code, $message, $data);
    }

    public static function error($code = 500, $message = "Error", $data = null) {
        return self::response(false, $code, $message, $data);
    }
}
?>