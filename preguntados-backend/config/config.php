<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

define('DB_SERVER', getenv('DB_SERVER'));
define('DB_USERNAME', getenv('DB_USERNAME'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
define('DB_NAME', getenv('DB_NAME'));

define('MAIL_SMTPDEBUG',(int) getenv('MAIL_SMTPDEBUG'));
define('MAIL_HOST', getenv('MAIL_HOST'));
define('MAIL_SMTP_AUTH', getenv('MAIL_SMTP_AUTH'));
define('MAIL_USERNAME', getenv('MAIL_USERNAME'));
define('MAIL_PASSWORD', getenv('MAIL_PASSWORD'));
define('MAIL_SMTP_SECURE', getenv('MAIL_SMTP_SECURE'));
define('MAIL_PORT',(int) getenv('MAIL_PORT'));
define('MAIL_FROM_ADDRESS', getenv('MAIL_FROM_ADDRESS'));
define('MAIL_FROM_NAME', getenv('MAIL_FROM_NAME'));

define('JWT_SECRET', getenv('JWT_SECRET'));
define('JWT_SIGNING_ALG', [getenv('JWT_SIGNING_ALG')]);
define('JWT_TOKEN_LIFETIME', (int) getenv('JWT_TOKEN_LIFETIME'));
?>
