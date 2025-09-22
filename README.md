Prototipo de Juego Táctico SRPG con JavaScript
Este es un prototipo funcional de un juego de rol táctico por turnos (Strategy RPG) desarrollado completamente con HTML5, CSS3 y JavaScript (ES6), sin dependencias de librerías o frameworks externos.

El objetivo de este proyecto es demostrar habilidades fundamentales en el desarrollo front-end, incluyendo la lógica de programación, la manipulación del DOM y la gestión del estado de una aplicación interactiva.

https://alexisgiovani.github.io/srpg-prototype/

Características Implementadas
Tablero de Juego Interactivo: El tablero está generado dinámicamente con CSS Grid y responde a los clics del usuario.

Sistema de Turnos: Lógica de juego que alterna el control entre el jugador y los enemigos.

Gestión de Estado: El juego maneja diferentes estados (IDLE, MOVING, TARGETING) para controlar las acciones disponibles para el jugador.

Acciones de Personaje:

Movimiento: Selección de personaje y movimiento por el tablero usando las flechas del teclado.

Combate: Sistema de ataque básico que calcula el impacto contra la "Clase de Armadura" (AC) del objetivo y determina el daño.

Panel de Estadísticas Dinámico: La información del personaje seleccionado se actualiza y muestra en tiempo real.

Registro de Combate: Un log que informa al jugador de las acciones que ocurren durante el combate (ataques, daños, fallos).

Tecnologías Utilizadas
HTML5: Para la estructura semántica del juego.

CSS3: Para el diseño del tablero, la interfaz de usuario y los indicadores de acción, utilizando Flexbox y Grid.

JavaScript (ES6): Para toda la lógica del juego, incluyendo:

Manipulación del DOM para renderizar el estado del juego.

Manejo de eventos del usuario (clics y teclado).

Estructura de datos con objetos para definir entidades, equipamiento y estadísticas.

Cómo Jugar
Selecciona uno de tus personajes (@ o #) haciendo clic sobre él.

Usa los botones de "Mover" o "Atacar".

Para moverte: Después de presionar "Mover", usa las teclas de flecha y presiona "Enter" para confirmar tu posición final.

Para atacar: Después de presionar "Atacar", haz clic sobre un enemigo (G) que esté dentro del rango.

Presiona "Terminar Turno" para ceder el control a los enemigos.
