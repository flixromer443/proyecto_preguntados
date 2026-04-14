<?php
require("../Lib/phpmailer/PHPMailer.php");
require("../Lib/phpmailer/OAuth.php");
require("../Lib/phpmailer/Exception.php");
require("../Lib/phpmailer/SMTP.php");
require("../config/config.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

session_start();
$correo="flixromer443@gmail.com";
$nombre="FELIX";
$codigoActivacion="1234";
$mail = new PHPMailer(true);

try {
    //Servidor
    $mail->SMTPDebug  = MAIL_SMTPDEBUG;                    
    $mail->isSMTP();                                            
    $mail->Host       = MAIL_HOST;                   
    $mail->SMTPAuth   = MAIL_SMTP_AUTH;                                  
    $mail->Username   = MAIL_USERNAME;                    
    $mail->Password   = MAIL_PASSWORD;                         
    $mail->SMTPSecure = MAIL_SMTP_SECURE;         
    $mail->Port       = MAIL_PORT;                                  
    //Destinatarios
    $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
    $mail->addAddress($correo);              

    // Attachments
   // $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
   // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

    //Mensaje
    $mail->isHTML(true);                                  
    $mail->Subject = 'Confirmacion de cuenta usuario';
    $mail->Body    = 'Codigo de activacion :<h1>'.$codigoActivacion.'</h1>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

?>