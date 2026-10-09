# Atlas textual de la Biblia católica

[English documentation](README.en.md)

**Exploración libre: v1.1.0-preview.2.** La primera versión estable se conserva en la etiqueta `v1.0.0`; la iteración educativa anterior permanece en `v1.1.0-preview.1`. [Notas de las versiones](CHANGELOG.md) · [Metadatos e integridad](release.json). Esta iteración desarrolla la navegación sin modificar los datos históricos; el esquema del registro conserva su versión `0.2`.

Aplicación estática bilingüe para explorar la composición y la accesibilidad histórica de textos bíblicos. Preparada para GitHub Pages: `index.html` está en la raíz y todas las rutas de la aplicación son relativas. No necesita compilación, cuenta de servicio ni servidor de datos.

## Qué incluye

- Los **73 libros** del corpus católico: 46 del Antiguo Testamento y 27 del Nuevo.
- **86 etapas textuales**, con dataciones citadas o límites desconocidos explícitos.
- **2 escenarios** para comparar atribuciones y cronologías publicadas.
- **48 conexiones admitidas y 9 candidaturas pendientes por escenario**. El JSON contiene 114 evaluaciones: los mismos 57 vínculos evaluados en ambos escenarios. No son 114 conexiones históricas diferentes.
- **155 referencias**, principalmente introducciones y notas NABRE/USCCB, pasajes primarios en traducción y fuentes complementarias del piloto y del problema sinóptico.
- Español e inglés, búsqueda, filtros, vista general de círculos, vistas temporales de libros o etapas, recorridos y conexiones de la selección; exportación SVG, PNG, JSON y CSV.

Una flecha significa **acceso presumible a la forma o al contenido especificados antes de componer el texto receptor**. No demuestra acceso al libro entero ni dependencia directa. El corpus está cubierto por el registro; las relaciones son una selección documentada, no una investigación exhaustiva de todas las parejas posibles. La reconstrucción histórica sigue siendo revisable.

**Una cita bíblica no es requisito.** Doce admisiones se apoyan en otros fundamentos: autoría común, transmisión literaria, continuidad editorial, recopilación o traducción. Cada conexión conserva su razón de accesibilidad, supuestos, fuentes y límites. [Ejemplos documentados](docs/accesibilidad.md).

## Vista general y presentación

La aplicación abre un mapa con un círculo por libro, agrupado por familias del corpus. Las curvas tienen dirección y etiquetas con el fundamento de acceso, como «Autor común», «Fuente griega» o «Recopilación». Las flechas punteadas señalan inferencias con supuestos; las líneas continuas, recepción identificable o traducción. Los bucles indican conexiones entre etapas del mismo libro. Las candidaturas son discontinuas y no tienen flecha. **La posición de los círculos no representa fechas, lugares ni comunidades históricas.** La vista conserva el alcance documentado de cada evaluación.

Pulsa un círculo o una etiqueta para consultar primero la justificación del acceso y sus supuestos, y después etapas, fuentes e incertidumbres. Los vínculos pertinentes se resaltan y el resto se atenúa. «Fundamento → Inferencias sin cita explícita» muestra las once conexiones inferenciales. El botón «Catálogo» abre la búsqueda y los filtros. Puedes arrastrar el fondo con el ratón, desplazarlo con el tacto, usar el zoom y ajustar el mapa; «Presentación» reduce los controles y muestra el conjunto. `Esc` cierra el detalle o sale de presentación. Las vistas «Etapas» y «Libros» conservan la escala temporal.

[Vista general](docs/vista-presentacion.png) · [Vista de la aplicación](docs/vista-previa.png) · [Grafo general exportado](docs/grafo-general.svg)

## Exploración libre

Busca cualquier libro por nombre o abreviatura, desde «Buscar un libro», la barra de navegación o `/` y Ctrl/Cmd K. Abre sus conexiones, etapas y fuentes en el panel. Los antecedentes evaluados, los receptores evaluados y la transmisión dentro de un libro aparecen agrupados para facilitar el siguiente paso. Las evaluaciones distinguen acceso, evidencia y contexto, conservando la razón, los supuestos y los límites.

«Solo su entorno» enfoca la selección; «En el tiempo» la lleva a las etapas; «Situar en mapa» la localiza. Los filtros activos quedan visibles y se pueden quitar directamente. Cambiar de escenario conserva la relación y consulta su evaluación correspondiente. Las candidaturas siguen sin flecha.

Atrás, Adelante y los puntos visitados recuperan la selección, la vista, el escenario, los filtros, la pestaña, el zoom y la posición anteriores. También funcionan los botones del navegador. «Enlace» permite volver o compartir el texto, la vista, los filtros, el escenario y la pestaña en el idioma elegido; no requiere rutas especiales de servidor para GitHub Pages. En móvil, el detalle ocupa un panel inferior y deja parte del mapa visible.

[Inicio libre](docs/libre-inicio.png) · [Conexiones en inglés](docs/libre-conexiones-en.png) · [Navegación móvil](docs/libre-movil.png) · [Notas de diseño](docs/exploracion.md)

### Demostraciones en vídeo

[Navegación por nodos · 20 s](docs/demos/navegacion-nodos-20s.mp4) · [Exploración y evidencia · 20 s](docs/demos/exploracion-libre-20s.mp4) · [Recorridos y datos de las grabaciones](docs/demos/README.md).

Las grabaciones muestran la aplicación en español: selección directa de libros, desplazamiento del mapa, justificación de acceso, fuentes y vista temporal. Documentan el estado de la navegación libre en `v1.1.0-preview.2`.

## Apéndice educativo

«Apéndice educativo» reúne los recorridos guiados y su progreso. «Sigue tu primer hilo» abre un recorrido voluntario sobre Eclesiástico. Las ayudas aparecen junto al registro: abrir una etapa, cambiar a la vista temporal, seguir una traducción y reconocer su alcance. Otros dos hilos exploran el acceso sin cita y una candidatura pendiente bajo distintos escenarios. Las preguntas ofrecen pistas, sin alterar las evaluaciones históricas.

Puedes salir del recorrido para curiosear otro texto, volver al mismo paso, pausar o repetirlo. El progreso se guarda únicamente en este navegador; al recargar, el atlas abre libremente y permite retomar cuando lo decidas. Al cerrar o pausar, se recupera la vista anterior. «Cómo explorar» abre una brújula breve y «Afinar el mapa» reúne escenarios, filtros, candidaturas y etiquetas.

[Inicio de la experiencia](docs/experiencia-inicio.png) · [Guía en móvil](docs/experiencia-movil.png) · [Diseño de la experiencia](docs/experiencia.md)

## Publicación en GitHub Pages

El flujo [pages.yml](.github/workflows/pages.yml) publica automáticamente la aplicación al enviar cambios a `master`. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions** como origen. La dirección de este repositorio es `https://rbazan98.github.io/atlas-biblico/` una vez que GitHub complete el despliegue.

### Publicar manualmente

1. Descomprime el paquete y sube su contenido a un repositorio de tu cuenta. `index.html` debe quedar directamente en la raíz del repositorio, junto con `app.js`, `registro.json` y `locales/`.
2. En GitHub, abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch** y la rama donde subiste los archivos, normalmente `main`, carpeta **/ (root)**. Guarda.
4. Abre la dirección que muestra GitHub cuando termine de publicar.

Funciona tanto en `https://TU_USUARIO.github.io/` —repositorio `TU_USUARIO.github.io`— como en `https://TU_USUARIO.github.io/NOMBRE_DEL_REPOSITORIO/`. El archivo `.nojekyll` evita procesamiento de Jekyll. 

Para publicar solo la aplicación bastan: `index.html`, `styles.css`, `language.css`, `portfolio.css`, `experience.css`, `explore.css`, `overview.js`, `app.js`, `i18n.js`, `experience.js`, `explore.js`, `registro.json`, `locales/`, `.nojekyll` y `proyecto.zip`. Este último mantiene disponible la descarga del proyecto desde la interfaz. Los directorios `research/`, `scripts/`, `docs/` y `qa/` contienen documentación y herramientas de mantenimiento, y también se pueden subir.

## Abrir localmente

En la carpeta descomprimida ejecuta:

```sh
python -m http.server 8000
```

Abre `http://localhost:8000/`. Se utiliza un servidor local porque los navegadores restringen la lectura de JSON al abrir `index.html` directamente mediante `file://`.

El selector de idioma guarda la preferencia en el navegador. `?lang=es` y `?lang=en` permiten abrir una lengua determinada. No hay analítica ni recursos externos necesarios para usar el atlas; las referencias externas se abren al pulsarlas.

## Leer y mantener el trabajo

- [Criterio histórico y modelo de datos](docs/metodologia.md).
- [Methodology in English](docs/methodology.en.md).
- [Dossier de los 73 libros y registro de conexiones](docs/registro.md).
- [Datos documentados](registro.json) y [esquema JSON](research/schema.json).
- [Evaluaciones en CSV](research/evaluaciones.csv).
- [Auditoría de introducciones](research/audit.json) y [auditoría de pasajes](research/passages-audit.json).
- [Revisión de justificaciones de acceso](research/access-review-audit.json).
- [Resultados de comprobación](qa/report.json).
- [Procedencia y atribución de fuentes](NOTICE.md).

`research/curation.py` y `research/access_review.py` contienen las decisiones históricas explícitas y producen el registro. No deducen una relación únicamente a partir de fechas, semejanzas o transitividad. `scripts/locales.py` reúne las traducciones inglesas. Para regenerar y comprobar:

```sh
python -m pip install -r requirements-dev.txt
python research/curation.py
python scripts/locales.py
python scripts/validar.py
python qa/data.py
python scripts/dossier.py
python scripts/package.py
```

La validación comprueba integridad y documentación; no certifica verdad histórica. Los scripts de recopilación son opcionales: sus capturas privadas no se distribuyen en el ZIP. No necesitas volver a descargarlas para usar la aplicación o regenerar los datos curados.

Para repetir las pruebas de interfaz, instala Chromium con `python -m playwright install chromium`, deja abierto el servidor local del puerto 8000 y ejecuta `python qa/browser.py`, `python qa/explore.py` y `python qa/experience.py`. `ATLAS_BASE_URL` permite probar otra dirección o un prefijo de repositorio. `python qa/distribution.py` comprueba los paquetes después de generarlos.

## Añadir idiomas

Copia `locales/en.json` a un nuevo archivo, conserva las claves españolas y traduce sus valores. Traduce también `book_abbreviations`, que conserva los identificadores de cada libro. Cambia `locale` y `title`, y añade una entrada `{ "code": "fr", "label": "Français", "file": "fr.json" }`, por ejemplo, en `locales/languages.json`. El catálogo y el selector se actualizan sin cambiar el código de la aplicación. Los títulos bibliográficos pueden conservar su lengua original. Los datos descargables mantienen su idioma documental, español, y sus identificadores estables.

Cuando modifiques una afirmación histórica, actualiza sus fuentes, limitaciones, escenarios y traducción, y ejecuta las comprobaciones. No rellenes una fecha desconocida solo para completar la visualización.
