<?php

require_once("../Lib/phpmailer/PHPMailer.php");
require_once("../Lib/phpmailer/OAuth.php");
require_once("../Lib/phpmailer/Exception.php");
require_once("../Lib/phpmailer/SMTP.php");
require_once("../config/config.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailService {

    private function createMailer() {
        $mail = new PHPMailer(true);

        // Configuración del servidor
        $mail->SMTPDebug  = MAIL_SMTPDEBUG;
        $mail->isSMTP();
        $mail->Host       = MAIL_HOST;
        $mail->SMTPAuth   = MAIL_SMTP_AUTH;
        $mail->Username   = MAIL_USERNAME;
        $mail->Password   = MAIL_PASSWORD;
        $mail->SMTPSecure = MAIL_SMTP_SECURE;
        $mail->Port       = MAIL_PORT;

        // Remitente
        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);

        return $mail;
    }

    public function enviarCodigoVerificacion($nombre, $correo, $codigoVerificacion) {
        try {
            $mail = $this->createMailer();

            // Destinatario
            $mail->addAddress($correo, $nombre);

            // Contenido
            $mail->isHTML(true);
            $mail->Subject = 'Verificacion de cuenta';

            $mail->Body = '
            <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333;">Verificación de cuenta</h2>
                    <p style="color: #555; font-size: 16px;">
                        Hola <strong>' . htmlspecialchars($nombre) . '</strong>,
                    </p>
                    <p style="color: #555; font-size: 15px;">
                        Gracias por registrarte. Usá el siguiente código para verificar tu cuenta:
                    </p>
                    <div style="margin: 30px 0;">
                        <span style="display: inline-block; font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #2c3e50; background: #f1f3f5; padding: 15px 25px; border-radius: 8px;">
                            ' . $codigoVerificacion . '
                        </span>
                    </div>
                    <p style="color: #777; font-size: 14px;">
                        Este código es válido por tiempo limitado.
                    </p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #aaa; font-size: 12px;">
                        Si no solicitaste este código, podés ignorar este mensaje.
                    </p>
                </div>
            </div>
            ';

            $mail->AltBody = "Hola $nombre,\n\nTu código de verificación es: $codigoVerificacion\n\nSi no solicitaste este código, ignorá este mensaje.";

            $mail->send();
            return true;

        } catch (Exception $e) {
            error_log("Error al enviar mail: " . $e->getMessage());
            return false;
        }
    }

    public function notificarCambioEstadoUsuario($nombre, $correo, $estado) {
        try {
            $mail = $this->createMailer();

            $mail->addAddress($correo, $nombre);

            $mail->isHTML(true);
            $mail->Subject = 'Actualizacion de estado de tu cuenta';

            $mensajeEstado = '';
            $color = '';

            switch ((int)$estado) {
                case 1:
                    $mensajeEstado = 'tu cuenta fue marcada como <b>INACTIVA</b>.';
                    $color = '#f39c12';
                    break;

                case 2:
                    $mensajeEstado = 'tu cuenta está ahora <b>ACTIVA / REHABILITADA</b>.';
                    $color = '#27ae60';
                    break;

                case 3:
                    $mensajeEstado = 'tu cuenta ha sido <b>SUSPENDIDA</b>.';
                    $color = '#e74c3c';
                    break;

                default:
                    $mensajeEstado = 'tu cuenta tuvo una actualización de estado.';
                    $color = '#2c3e50';
                    break;
            }

            $mail->Body = '
            <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                    <h2 style="color: ' . $color . ';">Actualización de cuenta</h2>

                    <p style="color: #555; font-size: 16px;">
                        Hola <strong>' . htmlspecialchars($nombre) . '</strong>,
                    </p>

                    <p style="color: #555; font-size: 15px;">
                        ' . $mensajeEstado . '
                    </p>

                    <p style="color: #777; font-size: 14px;">
                        Si creés que esto es un error, podés contactar al soporte.
                    </p>

                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

                    <p style="color: #aaa; font-size: 12px;">
                        Este es un mensaje automático, no respondas este correo.
                    </p>

                </div>
            </div>
            ';

            $mail->AltBody = "Hola $nombre,\n\nEstado de tu cuenta: $mensajeEstado";

            $mail->send();
            return true;

        } catch (Exception $e) {
            error_log("Error al enviar mail estado usuario: " . $e->getMessage());
            return false;
        }
    }


}
?>