<?php
    //ROLES_USUARIO 
    define('JUGADOR', 1);
    define('ADMINISTRADOR', 2);

    //ESTADOS USUARIO 
    define('ESTADO_1', 1); //Inactivo(todavia no confirmo el mail)
    define('ESTADO_2', 2); //Activo(se encuentra operativo)
    define('ESTADO_3', 3); //Suspendido(a definirse)

    //ESTADOS USUARIO 
    define('TEMATICA_1', 1); //Historia
    define('TEMATICA_2', 2); //Matematicas
    define('TEMATICA_3', 3); //Deportes
    define('TEMATICA_4', 4); //Geografia
    define('TEMATICA_5', 5); //Biologia
    define('TEMATICA_6', 6); //Literatura

    //ERRORES LOGICOS
    define('ERROR_300', "Error: ha ocurrido un error de negocio."); 
    define('ERROR_303', "Error: ya existe un usuario registrado con los mismos datos."); 
    
    //ERRORES FUNCIONALES
    define('ERROR_501', "Ha ocurrido un error al intentar generar un nuevo usuario");
    define('ERROR_502', "Ha ocurrido un error al iniciar sesion, verifique sus credenciales");
    define('ERROR_503', "El codigo de verificacion ingresado no es valido");


    //MENSAJES DE EXITO
    define('SUCCESS_201', "Usuario registrado correctamente");
    define('SUCCESS_202', "Inicio de sesion exitoso");
    define('SUCCESS_203', "Usuario activado exitosamente");
    define('SUCCESS_204', "Solicitud de cambio de contrasenia aprobada");



?>