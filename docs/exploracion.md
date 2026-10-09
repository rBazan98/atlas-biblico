# Exploración libre / Free exploration

La experiencia principal es moverse por el atlas: elegir un texto, entender sus conexiones, profundizar y regresar sin perder contexto. El apéndice educativo conserva las historias guiadas, pero su progreso y sus preguntas no forman parte de la navegación libre.

## Orientación y profundidad

La entrada ofrece búsqueda directa y accesos a libros reales. La búsqueda consulta los 73 libros por nombre o abreviatura en el idioma mostrado y admite teclado. Cada selección abre un detalle con pestañas: conexiones, etapas y fuentes para libros; resumen, conexiones y fuentes para etapas; acceso, evidencia y contexto para evaluaciones. Las pestañas admiten flechas, Inicio y Fin.

Las conexiones se agrupan por su dirección respecto al texto seleccionado: antecedentes evaluados, receptores evaluados o transmisión interna. Las agrupaciones incluyen el estado de cada evaluación. No crean admisiones, vínculos transitivos ni relaciones por semejanza. Las razones, los supuestos, la dependencia literaria y los límites conservan su texto documental.

El escenario aparece en el detalle. Cambiarlo resuelve la evaluación correspondiente del mismo par de etapas; no deja una evaluación de otro escenario bajo una etiqueta nueva. Al abrir una candidatura se hace visible su línea sin flecha. Las acciones permiten enfocar el entorno, cambiar entre mapa y tiempo, situar la selección y obtener un enlace.

Los filtros activos aparecen como controles que se pueden quitar individualmente. Si la selección no se representa en la vista actual, el panel lo indica y permite mostrar su contexto. No se interpreta la ausencia visual como prueba de ausencia de acceso.

## Historial y enlaces

Atrás, Adelante y los puntos visitados representan el recorrido del usuario, no una cadena de influencia histórica. Se conservan selección, vista, escenario, filtros, pestaña, zoom y posición. La búsqueda escrita y los ajustes de zoom actualizan el punto actual sin crear una entrada por cada pulsación. Una selección nueva después de volver abre una nueva rama de navegación.

Los botones nativos del navegador usan el mismo historial. Los enlaces incluyen el texto, la vista, el escenario, los filtros, la pestaña y el idioma. La ruta se guarda después de `#`; la aplicación sigue siendo estática y funciona bajo un prefijo de repositorio en GitHub Pages. Los identificadores desconocidos ofrecen recuperación al mapa, sin inventar una selección.

El historial vive en la sesión de la pestaña; el enlace permite recuperar el contexto tras recargar. El zoom y la posición se recuperan al volver dentro de la sesión, mientras que el enlace abre una vista inicial legible. El progreso educativo se conserva por separado en el navegador.

## Móvil y comprobación

En móvil, el detalle ocupa un panel inferior y deja parte del mapa visible. La barra de exploración permanece accesible al desplazarse. Se puede buscar, profundizar, cambiar escenario y volver usando las mismas acciones que en escritorio. El movimiento reducido se respeta.

`explore.js` y `explore.css` contienen esta experiencia; `experience.js` conserva el apéndice. Las traducciones nuevas están en `research/explore-en.json` y se integran con `scripts/locales.py`. `qa/explore.py` comprueba búsqueda, pestañas, dirección, profundidad, historial, enlaces, escenarios, filtros, tamaños móviles y recuperación de enlaces desconocidos. Los controles previos y el apéndice mantienen sus pruebas. La validación verifica funcionamiento y documentación; todavía no constituye una evaluación de usabilidad con participantes.

## Registro visual y siguiente prioridad

[Dos grabaciones de 20 segundos](demos/README.md) documentan el modo libre de `v1.1.0-preview.2`: desplazarse entre círculos y profundizar en el acceso entre dos etapas. Se guardan como material de presentación y referencia para revisar la navegación.

La siguiente prioridad es mejorar el encuadre al cambiar entre mapa y tiempo: mantener visibles la selección, los nombres de las etapas conectadas y sus fechas, incluso cuando el panel de detalle reduce el espacio disponible. En la grabación temporal, centrar las bandas puede recortar los nombres laterales y ajustar el mapa puede dejar uno de los extremos fuera del área visible. Esta mejora queda pendiente; los clips conservan el funcionamiento observado.

## English

The primary experience is free atlas navigation: choose a text, follow documented connections, inspect stages and sources, and return without losing context. Guided stories remain in the educational appendix.

Search, directional assessment groups and progressive detail tabs expose depth without changing historical claims. Scenario switching preserves the relationship and resolves its corresponding assessment. Pending candidates remain without arrowheads. Active filters are visible, and selections excluded from a view have an explicit recovery action.

Session history restores selection, view, scenario, filters, detail tab, zoom and position; visited points describe user navigation, not a historical influence chain. Shared hash links restore text, view, filters, tab, scenario and display language through a static GitHub Pages URL. A link opens a readable initial view; pan and zoom are session history details. Invalid identifiers recover to the map. Mobile uses a bottom sheet and persistent exploration controls.

The historical registry remains byte-identical to v1.0.0. Browser checks establish working flows; participant usability research has not yet been conducted.

[Two 20-second recordings](demos/README.md) document the current free atlas and provide a presentation and navigation review reference. The next priority is map-to-timeline framing: keep the selection, endpoint stage names and dates visible when the detail panel reduces the available area. The timeline recording shows that centering bands can clip left-hand names and fitting the map can leave an endpoint outside the visible area. This improvement remains pending; the clips preserve the observed behavior.
