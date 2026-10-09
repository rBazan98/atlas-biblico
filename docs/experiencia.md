# Aprender explorando / Learn by exploring

Los recorridos se conservan dentro del **apéndice educativo**, separado de la exploración libre. La persona descubre un libro, abre sus etapas y sigue una evaluación real. Las ayudas aparecen junto al registro. No se abre un tutorial automáticamente ni se exige terminarlo para navegar.

## Tres hilos

| Hilo | Acción que se aprende | Idea que se conserva |
| --- | --- | --- |
| Un texto cruza de lengua | Abrir etapas, cambiar de vista y seguir una traducción | El intervalo no es una fecha exacta; el antecedente accesible tiene un alcance limitado. |
| Acceso sin una cita | Abrir una conexión y leer razón y supuestos | Autoría común puede fundamentar acceso; no demuestra reutilización literaria. |
| Lo que aún no sabemos | Mostrar una candidatura y comparar escenarios | Una línea pendiente no lleva flecha; anterioridad y semejanza no bastan. |

Cada recorrido tiene tres o cuatro pasos, acciones concretas y una pregunta breve con pista. La pregunta comprueba la lectura del modelo; no es una puntuación de certeza histórica. Las historias se refieren a evaluaciones ya documentadas en `registro.json` y resuelven el identificador correspondiente al escenario seleccionado. No crean conexiones.

## Comportamiento

El mapa abre con navegación libre. «Apéndice educativo» abre un espacio independiente con el piloto, tres tarjetas y el progreso. «Sigue tu primer hilo» empieza el piloto; «Elige otra historia» permite elegir dentro del apéndice. «Cómo explorar» ofrece tres claves breves. Los controles avanzados siguen disponibles bajo «Afinar el mapa».

Abrir directamente el elemento sugerido también hace avanzar el recorrido. Si la persona abre otro texto, la guía permite seguir curioseando o volver al mismo paso. Al pausar o cerrar se recuperan filtros, escenario, selección y posición anteriores. El recorrido activo puede recuperarse después de cerrar su panel.

La clave local `atlas-experience-v1` conserva los hilos explorados y el último paso pausado. La recarga nunca reabre una guía por sí sola. Los datos no salen del navegador; si el almacenamiento está bloqueado, se puede completar el recorrido durante la sesión. La preferencia de idioma se conserva por separado.

Los recorridos y la brújula admiten teclado. Los diálogos devuelven el foco al control que los abrió; las acciones del recorrido lo llevan a su nuevo título. El panel se adapta a móvil y sus contenidos se pueden desplazar. El movimiento reducido desactiva transiciones y desplazamiento suave.

## Mantener la experiencia

`experience.js` contiene las historias y el progreso, `experience.css` su presentación y `research/experience-en.json` las traducciones nuevas. `scripts/locales.py` las integra en el diccionario general. Para añadir idiomas se conservan las mismas claves españolas, como en el resto de la aplicación.

Si se revisa una evaluación histórica, hay que revisar su historia asociada, la pregunta y las traducciones. Las afirmaciones de la guía deben seguir limitadas al alcance de la evaluación; una candidatura no se convierte en admisión para hacer más sencillo un recorrido.

`qa/experience.py` comprueba recorridos, salida y recuperación, progreso tras recarga, traducción, escenarios, teclado, movimiento reducido, almacenamiento bloqueado y anchuras de 320, 390 y 768 px. `qa/browser.py` mantiene las comprobaciones previas del atlas. `qa/distribution.py` revisa los paquetes y la integridad de sus recursos. Son pruebas de funcionamiento; no sustituyen investigación histórica ni evaluación de usabilidad con participantes.

## English

This iteration offers a voluntary route into the atlas. Three short stories use real assessments to teach book/stage navigation, estimated dates, access without quotation and pending candidates across scenarios. Guidance lives alongside the record. There is no automatic tutorial or requirement to finish one before exploring.

Directly opening the suggested element advances the lesson. Opening a different text preserves the current step and offers a return to its context. Pause/close restores the prior view; reload offers optional resuming. Local browser storage records progress only, with an in-memory fallback when storage is denied. Completion is a reading milestone, not historical certainty or an assessment score.

Keyboard navigation, focus return, mobile layouts and reduced motion are covered by browser checks. New UI copy is translated through the existing locale dictionary and can be extended to other languages. The historical registry remains byte-identical to v1.0.0. Research revisions must update the associated stories, questions and translations. Automated checks establish working behavior; usability with participants has not yet been evaluated.
