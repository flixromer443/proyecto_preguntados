-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 22-04-2026 a las 17:54:23
-- Versión del servidor: 5.7.44
-- Versión de PHP: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "-03:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `preguntados`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clasificaciones`
--

CREATE TABLE `clasificaciones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `puntaje` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `clasificaciones`
--

INSERT INTO `clasificaciones` (`id`, `id_usuario`, `puntaje`) VALUES
(9, 10, 65),
(10, 12, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codigos_verificacion`
--

CREATE TABLE `codigos_verificacion` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `codigo` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `intentos_consulta` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_personales`
--

CREATE TABLE `datos_personales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `sexo` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `doc_nro` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `doc_tipo` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `dom_calle` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `dom_nro` varchar(11) COLLATE utf8_spanish_ci NOT NULL,
  `dom_loc` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `dom_depto` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `dom_pcia` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `telefono` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `correo_electronico` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `datos_personales`
--

INSERT INTO `datos_personales` (`id`, `nombre`, `apellido`, `sexo`, `doc_nro`, `doc_tipo`, `dom_calle`, `dom_nro`, `dom_loc`, `dom_depto`, `dom_pcia`, `telefono`, `correo_electronico`, `id_usuario`) VALUES
(4, 'Felix', 'Romero', 'M', '42471205', '1', 'ZAPIOLA', '946', 'Libertad', '06539', '06', '1159305824', 'flixromer443@gmail.com', 10),
(6, 'Clelia', 'Romero', 'F', '23413834', '1', 'ZAPIOLA', '946', 'Libertad', '06539', '06', '1159606732', 'flixromer443@gmail.com', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticas`
--

CREATE TABLE `estadisticas` (
  `id` int(11) NOT NULL,
  `id_tematica` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fallos` int(11) NOT NULL DEFAULT '0',
  `aciertos` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `estadisticas`
--

INSERT INTO `estadisticas` (`id`, `id_tematica`, `id_usuario`, `fallos`, `aciertos`) VALUES
(49, 1, 10, 29, 23),
(50, 2, 10, 20, 7),
(51, 3, 10, 2, 6),
(52, 4, 10, 3, 7),
(53, 5, 10, 5, 3),
(54, 6, 10, 8, 2),
(55, 1, 12, 1, 2),
(56, 2, 12, 1, 1),
(57, 3, 12, 0, 0),
(58, 4, 12, 0, 0),
(59, 5, 12, 0, 0),
(60, 6, 12, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(50) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id`, `descripcion`) VALUES
(1, 'INACTIVO'),
(2, 'ACTIVO'),
(3, 'Suspendido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidas`
--

CREATE TABLE `partidas` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fallos` int(11) NOT NULL,
  `aciertos` int(11) NOT NULL,
  `fecha_y_hora` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `partidas`
--

INSERT INTO `partidas` (`id`, `id_usuario`, `fallos`, `aciertos`, `fecha_y_hora`) VALUES
(5, 10, 2, 3, '2026-04-21 01:18:45'),
(6, 10, 2, 3, '2026-04-21 01:24:31'),
(7, 10, 3, 2, '2026-04-21 01:26:43'),
(8, 10, 3, 2, '2026-04-21 01:32:42'),
(9, 10, 2, 3, '2026-04-21 02:28:55'),
(10, 10, 2, 3, '2026-04-21 03:09:21'),
(11, 10, 4, 1, '2026-04-21 03:39:47'),
(12, 10, 0, 5, '2026-04-21 11:28:07'),
(13, 10, 2, 3, '2026-04-21 11:44:47'),
(14, 10, 3, 2, '2026-04-21 11:45:22'),
(15, 10, 3, 2, '2026-04-21 11:54:56'),
(16, 10, 2, 3, '2026-04-21 11:55:59'),
(17, 10, 5, 0, '2026-04-21 13:22:30'),
(18, 12, 2, 3, '2026-04-21 13:42:40'),
(19, 10, 3, 2, '2026-04-21 19:01:06'),
(20, 10, 3, 2, '2026-04-22 11:27:45'),
(21, 10, 0, 5, '2026-04-22 11:29:22'),
(22, 10, 4, 1, '2026-04-22 11:30:49'),
(23, 10, 2, 3, '2026-04-22 11:38:04'),
(24, 10, 4, 1, '2026-04-22 11:41:39'),
(25, 10, 5, 0, '2026-04-22 08:43:01'),
(26, 10, 2, 3, '2026-04-22 08:46:27'),
(27, 10, 4, 1, '2026-04-22 08:53:48'),
(28, 10, 4, 1, '2026-04-22 08:56:29'),
(29, 10, 4, 1, '2026-04-22 09:00:09'),
(30, 10, 4, 1, '2026-04-22 09:01:23'),
(31, 10, 4, 1, '2026-04-22 09:04:45'),
(32, 10, 4, 1, '2026-04-22 09:07:08'),
(33, 10, 4, 1, '2026-04-22 09:08:01'),
(34, 10, 1, 4, '2026-04-22 09:09:12'),
(35, 10, 1, 4, '2026-04-22 13:54:49'),
(36, 10, 3, 2, '2026-04-22 14:22:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `id_tematica` int(11) DEFAULT NULL,
  `uri_imagen` varchar(500) DEFAULT NULL,
  `pregunta` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id`, `id_tematica`, `uri_imagen`, `pregunta`) VALUES
(1, 1, NULL, '¿Quien fue el creador de la bandera?'),
(2, 1, NULL, '¿En que fecha se produjo la revolucion de mayo?'),
(3, 1, 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Juan_Manuel_de_Rosas_1842.jpg', '¿Quien es este procer?'),
(4, 1, 'https://upload.wikimedia.org/wikipedia/commons/8/81/Manuel_belgrano_by_carbonier_retouched.jpg', '¿Quien es este procer?'),
(5, 2, NULL, '¿Si X tiende a infinito, que valor se le asigna?'),
(6, 2, NULL, '¿Que numero esta en la tabla del 8?'),
(7, 5, NULL, '¿Cuál es la unidad básica de la vida?'),
(8, 5, NULL, '¿Qué proceso utilizan las plantas para producir su alimento?'),
(9, 5, NULL, '¿Cuál es el orgánulo encargado de producir energía en la célula?'),
(10, 5, NULL, '¿Qué sistema del cuerpo humano controla y coordina las funciones del organismo?'),
(11, 5, NULL, '¿Qué molécula contiene la información genética?'),
(12, 5, NULL, '¿Qué tipo de célula NO tiene núcleo?'),
(13, 5, NULL, '¿Cuál es la función principal de los glóbulos rojos?'),
(14, 5, NULL, '¿Qué gas liberan las plantas durante la fotosíntesis?'),
(15, 5, NULL, '¿Cómo se llama el proceso de división celular que produce dos células idénticas?'),
(16, 5, NULL, '¿Qué biomolécula está formada por aminoácidos?'),
(17, 4, NULL, '¿Cuál es el continente más grande del mundo?'),
(18, 4, NULL, '¿Cuál es la montaña más alta del mundo?'),
(19, 4, NULL, '¿Cuál es el océano más grande?'),
(20, 4, NULL, '¿En qué continente se encuentra Egipto?'),
(21, 4, NULL, '¿Cuál es el desierto más grande del mundo?'),
(22, 4, NULL, '¿Cuál es la capital de Francia?'),
(23, 4, NULL, '¿Qué tipo de relieve es un volcán?'),
(24, 4, NULL, '¿Cuál es el río más largo del mundo?'),
(25, 4, NULL, '¿Qué línea imaginaria divide la Tierra en hemisferio norte y sur?'),
(26, 4, NULL, '¿Qué país tiene mayor superficie?'),
(27, 6, NULL, '¿Quién escribió Don Quijote de la Mancha?'),
(28, 6, NULL, '¿Cuál de estas obras pertenece a William Shakespeare?'),
(29, 6, NULL, '¿Quién es el autor de Cien años de soledad?'),
(30, 6, NULL, '¿Qué escritor argentino es famoso por Ficciones?'),
(31, 6, NULL, '¿Quién escribió El principito?'),
(32, 6, NULL, '¿Qué obra comienza con “En un lugar de la Mancha…”?'),
(33, 6, NULL, '¿Quién escribió La Odisea?'),
(34, 6, NULL, '¿Qué género literario se caracteriza por relatar hechos ficticios en prosa?'),
(35, 6, NULL, '¿Quién escribió Rayuela?'),
(36, 6, NULL, '¿Qué tipo de texto es una obra teatral?'),
(37, 3, NULL, '¿Cuántos jugadores tiene un equipo en cancha en fútbol?'),
(38, 3, NULL, '¿Qué selección ganó el Mundial de 2022?'),
(39, 3, NULL, '¿Cuántos puntos vale un tiro libre en básquet?'),
(40, 3, NULL, '¿En qué deporte se utiliza el término “ace”?'),
(41, 3, NULL, '¿En qué deporte se utiliza el término “ace”?'),
(42, 3, NULL, '¿En qué deporte se realiza un “touchdown”?'),
(43, 3, NULL, '¿Qué país es famoso por el Tour de France?'),
(44, 3, NULL, '¿Cada cuántos años se celebran los Juegos Olímpicos?'),
(45, 3, NULL, '¿Quién es conocido como uno de los mejores futbolistas de la historia?'),
(46, 3, NULL, '¿Qué estilo de natación es el más rápido?'),
(47, 3, NULL, '¿Cuántos strikes hacen falta para eliminar a un bateador en béisbol?'),
(48, 2, NULL, '¿Cuánto es 7 × 8?'),
(49, 2, NULL, '¿Cuál es el resultado de 81 ÷ 9?'),
(50, 2, NULL, '¿Cuánto mide la suma de los ángulos interiores de un triángulo?'),
(51, 2, NULL, '¿Cuál es el número primo?'),
(52, 2, NULL, '¿Cuál es el resultado de 5²?'),
(53, 2, NULL, '¿Cuál es el promedio de 4, 6 y 10?'),
(54, 2, NULL, 'En un triángulo rectángulo, ¿cómo se llama el lado más largo?'),
(55, 2, NULL, '¿Cuál es la raíz cuadrada de 64?'),
(56, 1, NULL, '¿En qué año comenzó la Segunda Guerra Mundial?'),
(57, 1, NULL, '¿Quién fue el líder de Alemania durante la Segunda Guerra Mundial?'),
(58, 1, NULL, '¿En qué año se declaró la independencia de Argentina?'),
(59, 1, NULL, '¿Qué país regaló la Estatua de la Libertad a Estados Unidos?'),
(60, 1, NULL, '¿Quién fue Napoleón Bonaparte?'),
(61, 1, NULL, '¿Dónde se desarrolló la civilización egipcia?'),
(62, 1, NULL, '¿Qué fue la Revolución Francesa?'),
(63, 1, NULL, '¿En qué siglo comenzó la Revolución Industrial?'),
(64, 1, NULL, '¿Quién fue el primer presidente de Estados Unidos?'),
(65, 1, NULL, '. ¿Qué explorador llegó a América en 1492?'),
(66, 4, NULL, '¿Cuál es la capital de Argentina?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `id` int(11) NOT NULL,
  `id_pregunta` int(11) DEFAULT NULL,
  `respuesta` varchar(100) DEFAULT NULL,
  `id_estado_respuesta` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `respuestas`
--

INSERT INTO `respuestas` (`id`, `id_pregunta`, `respuesta`, `id_estado_respuesta`) VALUES
(1, 1, 'Jose de San Martin', 0),
(4, 1, 'Manuel Belgrano', 1),
(5, 1, 'Juan Manuel de Rosas', 0),
(6, 1, 'Cornelio Saavedra', 0),
(7, 2, '25 de mayo de 1810', 1),
(8, 2, '25 de mayo de 1816', 0),
(9, 2, '25 de mayo de 1812', 0),
(10, 2, '25 de mayo de 1809', 0),
(11, 3, 'Domingo faustino Sarmiento', 0),
(12, 3, 'Cornelio Saavedra', 0),
(13, 3, 'Bartolome Mitre', 0),
(14, 3, 'Juan Manuel de Rosas', 1),
(15, 4, 'Bernardino Rivadavia', 0),
(16, 4, 'Justo Jose de Urquiza', 0),
(17, 4, 'Manuel Belgrano', 1),
(18, 4, 'Jose de San Martin', 0),
(19, 5, '1', 0),
(20, 5, 'infinito', 0),
(21, 5, '0', 1),
(22, 5, '-1', 0),
(23, 6, '18', 0),
(24, 6, '6', 0),
(25, 6, '19', 0),
(26, 6, '48', 1),
(27, 7, 'Tejido ', 0),
(28, 7, 'Órgano ', 0),
(29, 7, 'Célula ', 1),
(30, 7, 'Sistema', 0),
(31, 8, 'Respiración celular', 0),
(32, 8, 'Fotosíntesis ', 1),
(33, 8, 'Digestión ', 0),
(34, 8, 'Fermentación', 0),
(35, 9, 'Nucleo', 0),
(36, 9, 'Ribosoma', 0),
(37, 9, 'Mitocondria', 1),
(38, 9, 'Lisosoma', 0),
(39, 10, 'Sistema digestivo ', 0),
(40, 10, 'Sistema nervioso ', 1),
(41, 10, 'Sistema respiratorio ', 0),
(42, 10, 'Sistema circulatorio ', 0),
(43, 11, 'Proteina', 0),
(44, 11, 'Lipido', 0),
(45, 11, 'ADN', 1),
(46, 11, 'Glucosa', 0),
(47, 12, 'Eucariota', 1),
(48, 12, 'Procariota', 0),
(49, 12, 'Animal', 0),
(50, 12, 'Vegetal', 0),
(51, 13, ' Defender el cuerpo', 0),
(52, 13, 'Transportar oxigeno', 1),
(53, 13, 'Producir hormonas', 0),
(54, 13, 'Coagular la sangre', 0),
(55, 14, 'Dióxido de carbono', 0),
(56, 14, 'Oxigeno ', 1),
(57, 14, 'Nitrógeno ', 0),
(58, 14, 'Hidrógeno ', 0),
(59, 15, 'Meiosis', 0),
(60, 15, 'Mitosis ', 1),
(61, 15, 'Fecundación ', 0),
(62, 15, 'Transcripción', 0),
(63, 16, 'Carbohidratos ', 0),
(64, 16, 'Lipidos', 0),
(65, 16, 'Proteinas', 1),
(66, 16, 'Ácidos nucleicos', 0),
(67, 17, 'Africa', 0),
(68, 17, 'América ', 0),
(69, 17, 'Asía ', 1),
(70, 17, 'Europa', 0),
(71, 18, 'Aconcagua ', 0),
(72, 18, 'Everest ', 1),
(73, 18, 'K2', 0),
(74, 18, 'Kilimanjaro ', 0),
(75, 19, 'Atlántico ', 0),
(76, 19, 'Indico', 0),
(77, 19, 'Pacífico ', 1),
(78, 19, 'Artico', 0),
(79, 20, 'America', 0),
(80, 20, 'Europa', 0),
(81, 20, 'Asia', 0),
(82, 20, 'Africa', 1),
(83, 21, 'Antartico', 1),
(84, 21, 'Sahara', 0),
(85, 21, 'Gobi', 0),
(86, 21, 'Kalahari', 0),
(87, 22, 'Madrid ', 0),
(88, 22, 'Berlin', 0),
(89, 22, 'Paris', 1),
(90, 22, 'Roma', 0),
(91, 23, 'Llanura', 0),
(92, 23, 'Mesesta', 0),
(93, 23, 'Montaña', 1),
(94, 23, 'Valle', 0),
(95, 24, 'Amazonas ', 1),
(96, 24, 'Nilo', 0),
(97, 24, 'Yangtsé', 0),
(98, 24, 'Misisipi', 0),
(99, 25, 'Trópico de cáncer ', 0),
(100, 25, 'Trópico de capricornio ', 0),
(101, 25, 'Ecuador ', 1),
(102, 25, 'Meridiano de greenwich ', 0),
(103, 26, 'Estados unidos', 0),
(104, 26, 'China', 0),
(105, 26, 'Canadá ', 0),
(106, 26, 'Rusia', 1),
(107, 27, 'Gabriel García Márquez ', 0),
(108, 27, 'Miguel de Cervantes ', 1),
(109, 27, 'Pablo Neruda ', 0),
(110, 27, 'Jorge Luis Borges ', 0),
(111, 28, 'La odisea ', 0),
(112, 28, 'Hamlet', 1),
(113, 28, 'Cien años de soledad ', 0),
(114, 28, 'El principito ', 0),
(115, 29, 'Mario Vargas Llosa', 0),
(116, 29, 'Julio Cortázar ', 0),
(117, 29, 'Gabriel García Márquez ', 1),
(118, 29, 'Isabel Allende ', 0),
(119, 30, 'Adolfo Bloy Casares', 0),
(120, 30, 'Jorge Luis Borges ', 1),
(121, 30, 'Ernesto Sabato', 0),
(122, 30, 'Ricardo Piglia', 0),
(123, 31, 'Antoine de Saint-Exupéry', 1),
(124, 31, 'Victor Hugo ', 0),
(125, 31, 'Albert Camus', 0),
(126, 31, 'Gustave Flaubert ', 0),
(127, 32, 'La celestina', 0),
(128, 32, 'Don quijote de la Mancha', 1),
(129, 32, 'El lazarillo de Tormes', 0),
(130, 32, 'Fuenteovejuna', 0),
(131, 33, 'Homero', 1),
(132, 33, 'Platón ', 0),
(133, 33, 'Aristoteles', 0),
(134, 33, 'Sófocles ', 0),
(135, 34, 'Poesia', 0),
(136, 34, 'Teatro', 0),
(137, 34, 'Narrativa', 1),
(138, 34, 'Ensayo', 0),
(139, 35, 'Julio Cortazar', 1),
(140, 35, 'Jorge Luis Borges ', 0),
(141, 35, 'Ernesto Sabato ', 0),
(142, 35, 'Leopoldo Lugones ', 0),
(143, 36, 'Narrativo', 0),
(144, 36, 'Lirico', 0),
(145, 36, 'Dramático ', 1),
(146, 36, 'Informativo ', 0),
(147, 37, '9', 0),
(148, 37, '10', 0),
(149, 37, '11', 1),
(150, 37, '12', 0),
(151, 38, 'Brasil', 0),
(152, 38, 'Francia', 0),
(153, 38, 'Argentina ', 1),
(154, 38, 'Alemania ', 0),
(155, 39, '1', 1),
(156, 39, '2', 0),
(157, 39, '3', 0),
(158, 39, '4', 0),
(159, 40, 'Futbol ', 0),
(160, 40, 'Tenis', 1),
(161, 41, 'Futbol ', 0),
(162, 40, 'Rugby ', 0),
(163, 41, 'Tenis', 1),
(164, 40, 'Hockey ', 0),
(165, 41, 'Rugby ', 0),
(166, 41, 'Hockey ', 0),
(167, 42, 'Beisbol', 0),
(168, 42, 'Rugby ', 0),
(169, 42, 'Futbol americano ', 1),
(170, 42, 'Handball ', 0),
(171, 43, 'Italia', 0),
(172, 43, 'España ', 0),
(173, 43, 'Francia', 1),
(174, 43, 'Bélgica ', 0),
(175, 44, '2', 0),
(176, 44, '3', 0),
(177, 44, '4', 1),
(178, 44, '5', 0),
(179, 45, 'Roger Federer', 0),
(180, 45, 'Mbappe', 1),
(181, 45, 'Usain Bolt', 0),
(182, 45, 'Michael Jordan ', 0),
(183, 46, 'Pecho ', 0),
(184, 46, 'Espalda ', 0),
(185, 46, 'Mariposa ', 0),
(186, 46, 'Crol', 1),
(187, 47, '2', 0),
(188, 47, '3', 1),
(189, 47, '4', 0),
(190, 47, '5', 0),
(191, 48, '54', 0),
(192, 48, '56', 1),
(193, 48, '58', 0),
(194, 48, '64', 0),
(195, 49, '7', 0),
(196, 49, '8', 0),
(197, 49, '9', 1),
(198, 49, '10', 0),
(199, 50, '90°', 0),
(200, 50, '180°', 1),
(201, 50, '270°', 0),
(202, 50, '360°', 0),
(203, 51, '17', 1),
(204, 51, '15', 0),
(205, 51, '9', 0),
(206, 51, '21', 0),
(207, 52, '10', 0),
(208, 52, '20', 0),
(209, 52, '30', 0),
(210, 52, '25', 1),
(211, 53, '5.21', 0),
(212, 53, '6.22', 0),
(213, 53, '6.67', 1),
(214, 53, '7', 0),
(215, 54, 'Cateto', 0),
(216, 54, 'Hipotenusa ', 1),
(217, 54, 'Diagonal ', 0),
(218, 54, 'Base', 0),
(219, 55, '6', 0),
(220, 55, '8', 1),
(221, 55, '9', 0),
(222, 55, '7', 0),
(223, 56, '1914', 0),
(224, 56, '1939', 1),
(225, 56, '1945', 0),
(226, 56, '1929', 0),
(227, 57, 'Benito Mussolini', 0),
(228, 57, 'Adolf Hitler ', 1),
(229, 57, 'Winston Churchill ', 0),
(230, 57, 'Franklin D. Roosevelt ', 0),
(231, 58, '1810', 0),
(232, 58, '1812', 0),
(233, 58, '1820', 0),
(234, 58, '1816', 1),
(235, 59, 'Reino Unido', 0),
(236, 59, 'Francia', 1),
(237, 59, 'España ', 0),
(238, 59, 'Italia ', 0),
(239, 60, 'Rey de Inglaterra ', 0),
(240, 60, 'Emperador francés ', 1),
(241, 60, 'Presidente de España ', 0),
(242, 60, 'Zar de Rusia ', 0),
(243, 61, 'Rio Amazonas ', 0),
(244, 61, 'Rio Nilo', 1),
(245, 61, 'Rio Danubio', 0),
(246, 61, 'Rio Missisipi', 0),
(247, 62, 'Una guerra mundial ', 0),
(248, 62, 'Un movimiento político y social en Francia', 1),
(249, 62, 'Una invasión ', 0),
(250, 62, 'Una revolución industrial ', 0),
(251, 63, 'Siglo XV', 0),
(252, 63, 'Siglo XVI', 0),
(253, 63, 'SigloXVIII', 1),
(254, 63, 'Siglo XX', 0),
(255, 64, 'Abraham Lincoln ', 0),
(256, 64, 'George Washington ', 1),
(257, 64, 'Thomas Jefferson ', 0),
(258, 64, 'John Adams ', 0),
(259, 65, 'Fernando de Magallanes ', 0),
(260, 65, 'Cristóbal Colon ', 1),
(261, 65, 'Marco Polo', 0),
(262, 65, 'Hernán Cortéz ', 0),
(263, 66, 'Buenos Aires', 1),
(264, 66, 'Córdoba', 0),
(265, 66, 'Rosario', 0),
(266, 66, 'Mendoza', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(50) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `descripcion`) VALUES
(1, 'Jugador'),
(2, 'Administrador'),
(3, 'Super Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tematicas`
--

CREATE TABLE `tematicas` (
  `id` int(11) NOT NULL,
  `tematica` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tematicas`
--

INSERT INTO `tematicas` (`id`, `tematica`) VALUES
(1, 'Historia'),
(2, 'Matematica'),
(3, 'Deportes'),
(4, 'Geografia'),
(5, 'Biologia'),
(6, 'Literatura');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `contrasenia` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `id_rol` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `contrasenia`, `id_rol`, `id_estado`) VALUES
(10, 'flixromer443', '$2y$10$6iT1NORL3x/.EtRL647ms.O7WVSfucyUmjjmINamGkvnLGvY8B7c2', 3, 2),
(12, 'cle', '$2y$10$lrcqStxEOntV6tOGCzBoluKWgiWanpQ0lv.lSO/akyPbG5t5dAoiO', 2, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clasificaciones`
--
ALTER TABLE `clasificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_clasificaciones_usuarios` (`id_usuario`);

--
-- Indices de la tabla `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_codigos_verificacion_usuario` (`id_usuario`);

--
-- Indices de la tabla `datos_personales`
--
ALTER TABLE `datos_personales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_datos_personales_usuarios` (`id_usuario`);

--
-- Indices de la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_estadisticas_tematica` (`id_tematica`),
  ADD KEY `FK_estadisticas_usuario` (`id_usuario`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `partidas`
--
ALTER TABLE `partidas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_partidas_usuarios` (`id_usuario`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_preguntas_tematicas` (`id_tematica`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_respuestas_preguntas` (`id_pregunta`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tematicas`
--
ALTER TABLE `tematicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuarios_roles` (`id_rol`),
  ADD KEY `fk_usuarios_estados` (`id_estado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clasificaciones`
--
ALTER TABLE `clasificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `datos_personales`
--
ALTER TABLE `datos_personales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `partidas`
--
ALTER TABLE `partidas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=267;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tematicas`
--
ALTER TABLE `tematicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clasificaciones`
--
ALTER TABLE `clasificaciones`
  ADD CONSTRAINT `fk_clasificaciones_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  ADD CONSTRAINT `fk_codigos_verificacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `datos_personales`
--
ALTER TABLE `datos_personales`
  ADD CONSTRAINT `fk_datos_personales_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  ADD CONSTRAINT `FK_estadisticas_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_estadisticas_tematica` FOREIGN KEY (`id_tematica`) REFERENCES `tematicas` (`id`);

--
-- Filtros para la tabla `partidas`
--
ALTER TABLE `partidas`
  ADD CONSTRAINT `fk_partidas_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `fk_preguntas_tematicas` FOREIGN KEY (`id_tematica`) REFERENCES `tematicas` (`id`);

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `fk_respuestas_preguntas` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_estados` FOREIGN KEY (`id_estado`) REFERENCES `estados` (`id`),
  ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
