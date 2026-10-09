# Criterio histórico y modelo

La regla del proyecto es: **A → B si y solo si una forma pertinente de A era presumiblemente accesible al responsable de B durante su actividad y antes de componer la parte de B estudiada**. La existencia anterior, la semejanza temática, la proximidad geográfica y una atribución tradicional, tomadas aisladamente, no admiten una conexión.

Una cita bíblica es una evidencia posible de acceso, no una condición de la regla. También puede haber acceso por composición propia, circulación de fuentes escritas, continuidad editorial o reunión de materiales. Se exige una justificación histórica específica, sin exigir que sobrevivan el ejemplar, la biblioteca o el trayecto físico. [Ejemplos y revisión de accesibilidad](accesibilidad.md).

El corpus comprende los 73 libros de la Biblia católica. Las adiciones griegas de Ester y Daniel se incluyen dentro de sus libros; la Carta de Jeremías se registra como Baruc 6. El prólogo de Sirácida es una fuente asociada, no un libro número 74. Q, la obra perdida de Jasón de Cirene y otras tradiciones externas se mencionan en las evaluaciones pertinentes; no se dibujan como libros canónicos ni como documentos de existencia establecida.

## Unidades de representación

La unidad del registro es una **etapa textual**, con alcance y responsable propuestos. Puede ser composición, colección, redacción, revisión o traducción. Es una unidad de investigación, no necesariamente un manuscrito conservado. La vista de libros agrupa etapas, sin convertir sus conexiones parciales en acceso a un libro íntegro. La vista general presenta un círculo por libro y bucles para conexiones internas; las vistas temporales separan libros o etapas. Las conexiones internas también se consultan en la vista de etapas y en los detalles.

Se subdividen Deuteronomio, Proverbios, Ester, Isaías, Baruc, Daniel, Marcos, Juan y Sirácida donde las fuentes consultadas justifican distinguir unidades. Otros libros conservan un nodo amplio. Esto no afirma que sean obras de un único autor ni que carezcan de capas. Tampoco identifica automáticamente cada división por capítulos con una campaña de redacción.

En el mapa general, las constelaciones, el color y las posiciones agrupan familias del corpus: no representan fechas, geografías ni comunidades. Los círculos mantienen el mismo tamaño; no codifican importancia ni certeza. Las etiquetas identifican fundamentos de acceso, como «Autor común», «Fuente griega» o «Recopilación». Los pasajes se consultan dentro de la evidencia. Los bucles representan relaciones entre etapas del mismo libro: traducción en Sirácida, redacción en Juan y reunión de materiales en Daniel.

Las flechas punteadas representan inferencias con supuestos explícitos; las líneas continuas corresponden a recepción textual identificable o traducción. Ambas son admisiones limitadas a una forma y un escenario. Las candidaturas pendientes son discontinuas y no tienen punta de flecha. El filtro «Fundamento» permite explorar las inferencias sin cita explícita. El estilo de una línea no cuantifica la certeza ni identifica por sí solo una ruta física.

Los carriles agrupan el corpus para facilitar su lectura. No son comunidades históricas demostradas, rutas de migración ni escuelas de escribas. Una convergencia visual corresponde únicamente a los vínculos documentados. Los conectores se apoyan en los nodos de forma esquemática; sus extremos no fechan el acceso.

## Datos y procedencia

| Colección | Contenido |
| --- | --- |
| `works` | Libro, orden católico, alcance y estado parcial de investigación. |
| `stages` | Etapa, contenido estudiado, tipo de intervención, lenguas y referencias. |
| `actors`, `attributions` | Personas identificadas, responsables anónimos o grupos propuestos; atribuciones alternativas separadas. |
| `forms` | Contenido o estado de A que pudo ser accesible; no se identifica automáticamente con su edición actual. |
| `dates`, `contexts` | Eventos fechados, intervalos, límites abiertos, lugares y condiciones lingüísticas cuando hay respaldo. |
| `claims`, `evidence`, `sources` | Afirmación, fundamento, cita con localizador, objeciones y procedencia. |
| `scenarios` | Selección explícita de etapas, atribuciones, fechas y afirmaciones compatibles. |
| `access_evaluations` | Origen, destino, forma accesible, responsable receptor, escenario, condiciones, resultado, vía, alcance y límites. |
| `access_basis` dentro de cada evaluación | Tipo de fundamento, etiqueta, razón del acceso, supuestos y carácter atestiguado, inferido o desconocido del canal. |

Los identificadores son estables. Cada evidencia conserva `basis_id` para distinguir fundamentos de referencias bibliográficas. Dos páginas que repiten el mismo argumento no se cuentan como dos líneas históricas. No se asignan probabilidades numéricas sin base para estimarlas. Un estado «respaldado» describe una valoración limitada, no certeza universal.

Las fuentes principales son las introducciones y notas críticas de la NABRE publicadas por la USCCB y disponibles también en Bible Gateway. Se consultaron 71 páginas de introducción: Samuel y Reyes tienen introducciones conjuntas aplicadas a ambos volúmenes. Para las Pastorales y 2–3 Juan se emplean también las introducciones conjuntas que explicitan sus relaciones. La fuente editorial es una síntesis, no una revisión exhaustiva de la bibliografía especializada. El piloto de Sirácida añade UBS y documentación de testimonios hebreos; las evaluaciones sinópticas incluyen Felix Just y el catálogo/resumen de Eric Eve en Oxford. El resumen de Eve no se presenta como lectura de su libro completo.

## Fechas y atribuciones

Una fecha tiene sujeto y evento. **Actividad profética, llegada a un país, acontecimientos narrados, traducción y cierre de composición son eventos distintos.** En Sirácida, 132 a. C. representa llegada a Egipto y actividad posible; la propuesta de finalización posterior a 117 a. C. se muestra separadamente. En Ageo, 520 a. C. corresponde al núcleo de oráculos fechados, no a todas las intervenciones editoriales posibles.

Los intervalos usan año positivo y era (`BCE`/`CE`), sin año cero histórico. Límites desconocidos se guardan como `null`. Los intervalos representan hipótesis o contextos, no distribución de probabilidad ni duración continua de escritura. La aplicación coloca las etapas totalmente sin fecha en una columna separada de la escala.

Cuando una introducción dice «siglo», «principios» o «finales», se explicita la convención gráfica que transforma esa descripción en extremos aproximados. Por ejemplo, los siglos VI–V a. C. se muestran como 600–401; «cerca del 70» como 65–75. Esos años **no son precisión suministrada por la fuente**. Límites condicionados —como la posible cita de Hebreos por 1 Clemente hacia 96— conservan su condición en el fundamento de datación.

Si una fuente no delimita el cierre de un libro, no se inventa una fecha. Esto afecta a varias colecciones proféticas, Salmos, Esdras-Nehemías y otras unidades. Una fecha de un rey, una deportación o el escenario de una ficción no sustituye esa información. Una escena de lectura tampoco prueba que el episodio narrado haya ocurrido.

Se conservan dos escenarios: una síntesis crítica de trabajo y una selección de alternativas publicadas para Galacia, Efesios, Filipenses, las Pastorales, Santiago y 1 Pedro. El segundo no representa una escuela uniforme. Ambos adoptan provisionalmente la prioridad de Marcos para sus conexiones con Mateo y Lucas, con ese supuesto expresado en cada evaluación. La candidatura Mateo → Lucas conserva una evaluación pendiente. No se usa una propuesta de dependencia como demostración automática de accesibilidad.

## Umbral de admisión

La evaluación comprueba cuatro condiciones:

1. Existencia anterior del contenido pertinente.
2. Disponibilidad y una vía plausible de acceso.
3. Condiciones lingüísticas suficientes, incluida posible mediación; no se presupone conocimiento de hebreo por un receptor griego.
4. Acceso durante la actividad del responsable y antes de redactar el pasaje receptor.

Se requieren dos líneas con fundamentos distinguibles, al menos una específica del vínculo, y explicación de su convergencia y sus dependencias. Esto es una política de trabajo de este proyecto, no una escala universal de la historiografía.

«Presumiblemente accesible» permite una inferencia fundada bajo una reconstrucción declarada. Por ejemplo, la atribución de dos cartas al mismo Pablo y su orden de composición respaldan que conociera la anterior durante la composición de la siguiente. Ese conocimiento no exige cita, uso efectivo ni conservación de su autógrafo. Una mera etiqueta de autor no basta: la atribución y la anterioridad se documentan.

En Marcos → Mateo/Lucas y Samuel/Reyes → Crónicas se combinan correspondencias y reelaboraciones concretas identificadas en la bibliografía con condiciones cronológicas, lingüísticas y editoriales. En Lucas → Hechos y Juan → epílogo se explicita la continuidad de responsabilidad propuesta. En Daniel, dos conexiones terminan en una etapa de reunión: el acceso del recopilador no prueba que el autor original de las visiones conociera los relatos. Las líneas pueden compartir una reconstrucción editorial y no se presentan como testimonios independientes.

Las 36 admisiones por citas distinguen el **gesto receptor explícito** y la **identificación del contenido antecedente** mediante el pasaje de origen y las referencias publicadas. No son pruebas estadísticamente independientes: comparten el texto receptor. Esa dependencia se declara. Se admite acceso directo **o mediado al fragmento**, por ejemplo mediante enseñanza, memoria, liturgia o una colección de citas. No se acredita posesión de un rollo entero, un trayecto material específico ni lectura de cada adición del libro. Las rutas posibles no se presentan como rutas identificadas.

En Sirácida se distinguen el testimonio del traductor sobre la obra de su abuelo y la corroboración publicada de correspondencias entre testimonios hebreos y griegos. No se identifica el ejemplar exacto, ni los manuscritos conservados con aquel ejemplar.

Estas admisiones se apoyan en textos primarios **en traducción** y en identificación editorial publicada. No se ha realizado una colación de manuscritos ni un cotejo propio completo en griego y hebreo. Las citas compuestas, las variantes de numeración y la incertidumbre de las ediciones limitan el alcance de cada resultado. Ninguna flecha se admite por una simple alusión temática.

## Estados y ausencia de conexiones

| Estado | Interpretación |
| --- | --- |
| `admitida` | Las cuatro condiciones tienen respaldo registrado y convergencia documentada para ese alcance y escenario. Se dibuja una flecha. |
| `pendiente` | Existe una candidatura documentada, pero falta respaldo suficiente de acceso. Se puede mostrar sin punta de flecha. |
| `incompatible` | Hay una condición incompatible bajo el escenario y alcance elegidos; exige identificar cuál. El modelo lo permite, aunque esta versión no incorpora casos históricos con ese estado. |
| `sin_evaluar` | No hay valoración histórica suficiente. No genera una flecha. |

La ausencia de flecha no prueba imposibilidad. No se evalúan automáticamente todas las parejas. No se infiere acceso por transitividad, ni se eliminan conexiones fundadas por ser gráficamente redundantes. La dependencia literaria efectiva se registra en un campo aparte y no sustituye la regla de accesibilidad.

## Alcance y revisión

Esta versión entrega 73 libros, 86 etapas y 155 referencias, con una selección documentada de relaciones. Cada escenario contiene 48 conexiones admitidas: 36 recepciones de contenido citado, una traducción, cuatro inferencias de transmisión literaria, tres de autoría común, dos de continuidad editorial y dos de recopilación. Son 12 admisiones sin cita explícita, de las que 11 son inferenciales. Nueve candidaturas siguen pendientes. Las 114 evaluaciones del JSON corresponden a 57 relaciones valoradas en dos escenarios; no son 114 relaciones diferentes.

Las alternativas modifican atribuciones y fechas sin transformar accesos parciales en conocimiento de obras enteras. La selección no agota todas las parejas accesibles, ni siquiera las cartas atribuidas a un mismo autor. Ampliar la investigación especializada puede cambiar etapas, dataciones y admisiones. Los identificadores que empiezan por `candidate_` se mantienen estables aunque la evaluación ahora esté admitida; el estado válido es el campo `status`.

La revisión de una conexión debe conservar la forma pertinente, los pasajes concretos, la cronología receptora y las objeciones. Para admitir una candidatura, añade respaldo específico y explica cómo converge, sin duplicar el argumento que la originó. Los validadores comprueban estructura y documentación; la decisión histórica requiere lectura y valoración de fuentes.
