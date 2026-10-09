"""Ensambla el diccionario inglés. Las claves españolas permiten nuevos idiomas."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
messages=json.loads((ROOT/'research/historical-en.json').read_text())['messages']
pairs='''
Recepción identificada|Identified reception
Dependencia propuesta|Proposed dependence
Uso efectivo sin evaluar|Actual use not assessed
Traducción atestiguada|Attested translation
Fundamento|Grounds
Filtrar por fundamento del acceso|Filter by access grounds
Todas las vías|All routes
Inferencias sin cita explícita|Inferences without explicit quotation
Recepción y traducción|Reception and translation
Recepción y transmisión|Reception and transmission
Recepción / traducción|Reception / translation
Acceso inferido|Inferred access
Por qué pudo conocer el antecedente|Why the antecedent could be known
Supuestos de esta evaluación|Assumptions of this assessment
Vía atestiguada|Attested route
Vía inferida|Inferred route
Canal concreto desconocido|Specific channel unknown
Resultado y alcance|Outcome and scope
Justificaciones plausibles de acceso|Plausible grounds for access
Una cita es una evidencia posible, no un requisito. También se evalúan conocimiento por composición propia, circulación de fuentes escritas, continuidad editorial y disponibilidad de materiales para un recopilador. Cada inferencia declara sus supuestos y se limita a una forma pertinente durante la actividad receptora. No se exige identificar el manuscrito exacto; tampoco se admite por mera anterioridad o semejanza temática.|A quotation is one possible piece of evidence, not a requirement. Knowledge through own composition, circulation of written sources, editorial continuity and materials available to a compiler are also assessed. Each inference states its assumptions and concerns a pertinent form during receiving activity. The exact manuscript need not be identified; mere chronological priority or thematic similarity is also insufficient.
Cada círculo es un libro. Las líneas indican vías o fundamentos de acceso plausible; abre una para leer la justificación y sus supuestos. La posición no representa una cronología.|Each circle is a book. Lines indicate routes or grounds for plausible access; open one to read its justification and assumptions. Position does not represent chronology.
Círculos: libros. Flechas: acceso respaldado. Flechas punteadas: inferencias con supuestos. Líneas sin flecha: candidaturas. Etiquetas: fundamento del acceso.|Circles: books. Arrows: supported access. Dotted arrows: inferences with assumptions. Lines without arrows: candidates. Labels: grounds for access.
Flechas: acceso respaldado. Flechas punteadas: inferencias con supuestos. Líneas sin flecha: candidaturas. Bandas: dataciones propuestas.|Arrows: supported access. Dotted arrows: inferences with assumptions. Lines without arrows: candidates. Bands: proposed dating.

Visualización de textos bíblicos|Visualization of biblical texts
Vista del grafo|Graph view
Grafo temporal de libros|Timeline of books

Una flecha indica acceso al contenido especificado; no prueba dependencia directa. Sin conexión no significa sin acceso.|An arrow indicates access to the specified content; it does not establish direct dependence. No connection does not mean no access.

Presentación|Presentation
Salir de presentación|Exit presentation
Selecciona para consultar fuentes · Desplázate para explorar · Usa + para acercar|Select to consult sources · Scroll to explore · Use + to zoom in

Una biblioteca.|One library.
Muchas voces.|Many voices.
Un mapa de los textos que pudieron encontrarse durante la composición de la Biblia.|A map of the texts that may have met during the composition of the Bible.
General|Overview
Catálogo|Catalogue
Cerrar catálogo|Close catalogue
Etiquetas|Labels
Restablecer|Reset
Ajustar al mapa|Fit the map
Alejar el grafo|Zoom out the graph
Acercar el grafo|Zoom in the graph
Familias del corpus|Corpus families
Volver al mapa|Back to the map
Mapa de libros; desplázate o usa el zoom para explorar|Book map; scroll or zoom to explore
Mapa general de los 73 libros y sus conexiones de acceso|Overview of the 73 books and their access connections
Por evaluar|To assess
Cita|Quotation
conexiones evaluadas|assessed connections
Los textos viajan.|Texts travel.
LAS FUENTES NOS DEJAN SEGUIRLOS|SOURCES LET US FOLLOW THEM
Cada círculo es un libro. Las etiquetas indican la cita receptora o el tipo de vínculo. La posición agrupa el corpus; no representa una cronología.|Each circle is a book. Labels identify the receiving quotation or relationship type. Position groups the corpus; it does not represent a chronology.
Círculos: libros. Flechas: acceso admitido. Líneas discontinuas: candidaturas. Etiquetas: citas receptoras o traducción.|Circles: books. Arrows: admitted access. Dashed lines: candidates. Labels: receiving quotations or translation.
Agrupación editorial, sin escala temporal. Acceso no implica dependencia directa. Sin conexión no significa sin acceso.|Editorial grouping, without a time scale. Access does not imply direct dependence. No connection does not mean no access.

Atlas textual|Textual Atlas
Biblia católica|Catholic Bible
Atlas textual, inicio|Textual Atlas, home
Composición · transmisión · acceso histórico|Composition · transmission · historical access
Información y exportaciones|Information and exports
Idioma|Language
Criterio y fuentes|Method and sources
Exportar|Export
Explorar el corpus|Explore the corpus
Catálogo de libros|Book catalogue
Buscar libro o etapa…|Search book or stage…
Buscar libro o etapa|Search book or stage
Testamento|Testament
Todos|All
AT|OT
NT|NT
Acceso evaluado por escenario|Access assessed by scenario
Sin conexión no significa sin acceso.|No connection does not mean no access.
Grafo temporal|Temporal graph
Historia de los textos|History of the texts
Líneas que se encuentran|Paths that meet
libros ·|books ·
libros|books
libro|book
etapa|stage
conexión admitida|admitted connection
etapas|stages
conexiones admitidas|admitted connections
Granularidad|Granularity
Etapas|Stages
Libros|Books
Escenario|Scenario
Escenario histórico|Historical scenario
Mostrar candidaturas|Show candidates
Vista general|Reset view
Recorrido|Explore
Recorrido del grafo|Graph exploration
Todo el corpus|Whole corpus
Citas y recepción|Quotations and reception
Eclesiástico · transmisión|Sirach · transmission
Evangelios y sus antecedentes|Gospels and their antecedents
Conexiones de la selección|Connections of the selection
Las bandas representan estimaciones de composición. Las flechas representan acceso respaldado.|Bands represent composition estimates. Arrows represent supported access.
Líneas temporales; usa el desplazamiento para recorrerlas|Timelines; scroll to explore
Grafo dirigido de etapas textuales|Directed graph of textual stages
No hay etapas que coincidan con esta búsqueda.|No stages match this search.
Acceso admitido|Admitted access
Candidatura pendiente|Pending candidate
Datación propuesta|Proposed dating
Límite abierto|Open bound
Alejar escala temporal|Zoom out the time scale
Acercar escala temporal|Zoom in the time scale
Detalle de la selección|Selection details
Una reconstrucción abierta|An open reconstruction
Un texto, varias historias.|One text, many histories.
Selecciona un libro, una etapa o una conexión para consultar las fechas, las atribuciones y el fundamento del acceso.|Select a book, a stage or a connection to see dates, attributions and the grounds for access.
El grafo distingue lo documentado, las hipótesis de trabajo y lo que aún no podemos determinar.|The graph distinguishes documented evidence, working hypotheses and what remains unknown.
Explorar el piloto de Eclesiástico|Explore the Sirach pilot
Explorar Eclesiástico|Explore Sirach
La historia permanece abierta.|History remains open.
Selecciona una etapa o una conexión para consultar su evidencia.|Select a stage or connection to see its evidence.
Selecciona una etapa para consultar este escenario.|Select a stage to explore this scenario.
Cerrar|Close
Exportar el proyecto|Export the project
Los gráficos conservan la vista y el escenario seleccionados. JSON y CSV incluyen todo el registro en español, con identificadores estables.|Charts preserve the selected view and scenario. JSON and CSV include the full Spanish registry with stable identifiers.
Grafo visible · SVG|Visible graph · SVG
Grafo visible · PNG|Visible graph · PNG
Registro documentado · JSON|Documented registry · JSON
Evaluaciones · CSV|Assessments · CSV
Archivos del proyecto · ZIP|Project files · ZIP
Los gráficos incluyen el criterio de acceso y el nombre del escenario.|Charts include the access criterion and scenario name.
Activa JavaScript para explorar el grafo. Puedes descargar el|Enable JavaScript to explore the graph. You can download the
registro documentado|documented registry
Torá / Pentateuco|Torah / Pentateuch
Tradiciones históricas|Historical traditions
Deuterocanónicos y Ester|Deuterocanonical books and Esther
Poesía y sabiduría|Poetry and wisdom
Colecciones proféticas|Prophetic collections
Evangelios y Hechos|Gospels and Acts
Correspondencia paulina|Pauline correspondence
Otros escritos cristianos|Other Christian writings
Composición|Composition
Recopilación|Collection
Redacción|Editing
Revisión|Revision
Traducción|Translation
Existencia previa|Prior existence
Disponibilidad y vía|Availability and route
Condiciones lingüísticas|Linguistic conditions
Acceso durante la actividad receptora|Access during the recipient’s activity
Incompatible en este escenario|Incompatible in this scenario
Sin evaluar|Not assessed
Desconocido|Unknown
Datación no delimitada|Undelimited date
Fecha sin delimitar|Date undelimited
Marco temporal|Time frame
Sin datar|Undated
Ver {book}|View {book}
a. C.|BCE
d. C.|CE
Después de|After
Antes de|Before
Hasta|By
Desde|From
Hacia|Around
límite final desconocido|upper bound unknown
límite inicial desconocido|lower bound unknown
{count} etapa(s)|{count} stage(s)
Bandas de composición propuesta; conectores esquemáticos, sin fechar el momento exacto de acceso. Carriles agrupados para la lectura.|Proposed composition bands; schematic connectors do not date access. Lanes group texts for reading.
Cada banda resume las etapas seleccionadas del libro. Las flechas conservan el alcance de sus evaluaciones.|Each band summarizes the book’s selected stages. Arrows retain the scope of their assessments.
Antiguo Testamento|Old Testament
Nuevo Testamento|New Testament
Deuterocanónico|Deuterocanonical
Etapas del escenario|Stages in this scenario
Etapas aún sin registrar.|Stages not yet recorded.
Evaluaciones de acceso|Access assessments
No hay conexiones evaluadas registradas para este libro. Esto no prueba ausencia de acceso.|No assessed connections are recorded for this book. This does not establish absent access.
Etapa textual|Textual stage
Hipótesis de trabajo|Working hypothesis
Responsable|Author / editor
Datación|Date
Lengua|Language
Contexto|Context
Hebreo|Hebrew
Griego|Greek
Arameo|Aramaic
Hebreo, Arameo|Hebrew, Aramaic
Sin determinar|Undetermined
Lugar desconocido|Unknown location
Alcance|Scope
Fundamento de la datación|Grounds for dating
Atribución y actividad|Authorship and activity
Incertidumbres|Uncertainties
Fuentes de la etapa|Stage sources
Fuentes pendientes.|Sources pending.
Conexiones evaluadas|Assessed connections
Sin evaluaciones registradas.|No assessments recorded.
Evaluación de acceso|Access assessment
Forma que pudo ser accesible|Possibly accessible form
Vía y momento de acceso|Access route and timing
Condiciones evaluadas|Assessed conditions
Respaldada|Supported
Incierta|Uncertain
Incompatible|Incompatible
Líneas de evidencia|Lines of evidence
Alcance de la conexión|Connection scope
Dependencia literaria|Literary dependence
Límites|Limitations
Atlas textual · Biblia católica|Textual Atlas · Catholic Bible
Flechas: acceso admitido. Líneas sin flecha: candidaturas. Bandas: dataciones propuestas; límites abiertos desconocidos.|Arrows: admitted access. Lines without arrows: candidates. Bands: proposed dates; open bounds are unknown.
Conectores esquemáticos: no fechan el acceso. La ausencia de flecha no demuestra imposibilidad.|Schematic connectors do not date access. No arrow does not establish impossibility.
No se pudo generar el PNG. Puedes descargar el SVG.|The PNG could not be generated. You can download the SVG.
Una conexión A → B se admite cuando una forma pertinente de A era presumiblemente accesible al responsable de B antes de componer la parte estudiada de B.|A connection A → B is admitted when a pertinent form of A was presumably accessible to B’s author or editor before composing the studied part of B.
Evidencia convergente|Convergent evidence
Se requieren al menos dos líneas con fundamentos distinguibles, al menos una específica del vínculo, y una explicación de su convergencia. La anterioridad cronológica y la semejanza temática por sí solas no admiten una flecha.|At least two lines with distinguishable grounds are required, at least one specific to the connection, with an explanation of convergence. Chronological priority and thematic resemblance alone do not admit an arrow.
Existencia previa del contenido pertinente.|Prior existence of the pertinent content.
Disponibilidad y vía plausible de acceso.|Availability and a plausible access route.
Condiciones lingüísticas pertinentes.|Pertinent linguistic conditions.
Acceso durante la actividad del responsable, antes de la composición receptora.|Access during the recipient author’s or editor’s activity, before composition of the receiving text.
Qué representa cada elemento|What each element represents
En la vista general, cada círculo representa un libro; las constelaciones agrupan familias del corpus, sin representar fechas, lugares ni contactos entre comunidades. Las líneas conservan las evaluaciones entre etapas: el acceso se limita al contenido especificado, y un bucle señala transmisión dentro de un libro. Las vistas temporales muestran etapas o libros; las bandas son estimaciones, no duraciones exactas de escritura. Los carriles agrupan el corpus para facilitar la lectura; compartir carril no demuestra contacto histórico. Los conectores no fechan el acceso. Las candidaturas pendientes se muestran sin punta de flecha.|In the overview, each circle represents a book; constellations group corpus families without representing dates, places or contacts between communities. Lines retain stage-level assessments: access is limited to the specified content, and a loop indicates transmission within a book. Temporal views show stages or books; bands are estimates, not exact writing durations. Lanes group the corpus for readability; sharing a lane does not establish historical contact. Connectors do not date access. Pending candidates have no arrowhead.
Escenarios e incertidumbre|Scenarios and uncertainty
Cada escenario selecciona atribuciones y dataciones compatibles. Una admisión bajo una hipótesis no se convierte en una certeza universal. El uso efectivo y la dependencia literaria se documentan por separado. No se infiere acceso por transitividad.|Each scenario selects compatible attributions and dates. Admission under a hypothesis does not become universal certainty. Actual use and literary dependence are documented separately. Access is not inferred transitively.
Alcance del registro|Registry coverage
73 libros, {stages} etapas registradas y {sources} referencias.|73 books, {stages} recorded stages and {sources} references.
El registro es una reconstrucción de trabajo basada en las fuentes consultadas. No pretende agotar todas las relaciones posibles. Las fechas desconocidas y las candidaturas insuficientemente respaldadas permanecen abiertas.|The registry is a working reconstruction based on consulted sources. It does not exhaust all possible relationships. Unknown dates and insufficiently supported candidates remain open.
Referencias consultadas|Consulted references
No se pudo abrir el registro.|The registry could not be opened.
Recarga la página o descarga los datos desde|Reload the page or download the data from
el registro documentado|the documented registry
Registro no disponible|Registry unavailable
Ben Sira|Ben Sira
Sin fechas de nacimiento o muerte registradas; no se reconstruye su vida desde la datación del libro.|Birth and death dates are not recorded; his life is not reconstructed from the book’s date.
Nieto anónimo de Ben Sira|Ben Sira’s anonymous grandson
La relación familiar procede del prólogo. No demuestra cómo obtuvo el ejemplar.|The family relationship comes from the prologue. It does not establish how he obtained the exemplar.
Entorno de Ben Sira en Jerusalén|Ben Sira’s setting in Jerusalem
Jerusalén|Jerusalem
Contexto del responsable según la síntesis consultada; no prueba que todas las partes se redactaran allí.|The author’s setting according to the consulted synthesis; it does not establish that every part was written there.
Actividad del traductor en Egipto|Translator’s activity in Egypt
Egipto|Egypt
No se identifica una institución o ciudad concreta.|No specific institution or city is identified.
Colección hebrea antecedente de la traducción|Hebrew collection antecedent to the translation
Obra hebrea atribuida a Ben Sira; alcance exacto de la edición antecedente sin reconstruir.|Hebrew work attributed to Ben Sira; the antecedent edition’s exact scope is not reconstructed.
Nodo amplio inicial. No asigna todas las adiciones ni cada versículo actual a Ben Sira.|An initial broad node. Not all additions or present-day verses are assigned to Ben Sira.
Traducción griega atribuida al nieto|Greek translation attributed to the grandson
Traducción de un antecedente hebreo; excluye la atribución automática de ampliaciones posteriores.|Translation of a Hebrew antecedent; later expansions are not automatically attributed to it.
No se identifica con todos los estados posteriores del texto griego.|It is not identified with every subsequent state of the Greek text.
Antecedente hebreo pertinente de la traducción; no se conserva identificado el ejemplar usado.|Pertinent Hebrew antecedent to the translation; the exemplar used has not been identified.
La colección y su forma accesible se distinguen. Su identidad detallada queda abierta.|The collection is distinguished from its accessible form. Its detailed identity remains open.
Producto de la traducción atribuida al nieto; alcance de su edición inicial pendiente de cotejo.|Product of the translation attributed to the grandson; its initial edition’s scope awaits comparison.
No se presupone circulación continua después de traducirse.|Continuous circulation after translation is not presumed.
Hipótesis de la introducción UBS; depende de interpretar Eclo 50 y el contexto político.|Hypothesis from the UBS introduction; it depends on interpreting Sirach 50 and the political setting.
Conversión histórica propuesta del año regnal del prólogo, no fecha de finalización.|Proposed historical conversion of the prologue’s regnal year, not a completion date.
Actividad tras la llegada; no fija el año preciso de inicio o cierre.|Activity after arrival; it does not fix an exact starting or completion year.
Propuesta de finalización, con extremo posterior desconocido.|Proposed completion, with an unknown upper bound.
Atribución a Ben Sira.|Attribution to Ben Sira.
Valoración de trabajo limitada a los fundamentos y objeciones registrados.|Working assessment limited to the recorded grounds and objections.
No establece que todo el texto actual proceda de una única intervención.|It does not establish that the entire present text stems from one intervention.
Atribución al nieto anónimo que habla en el prólogo.|Attribution to the anonymous grandson speaking in the prologue.
Existió un antecedente hebreo de la traducción.|A Hebrew antecedent to the translation existed.
Acceso del responsable de la traducción a un antecedente hebreo pertinente.|Access by the translator to a pertinent Hebrew antecedent.
No se conoce el ejemplar concreto ni su contenido íntegro.|The specific exemplar and its complete contents are unknown.
Hipótesis de composición entre 196 y 175 a. C.|Composition hypothesis between 196 and 175 BCE.
Los argumentos sobre el personaje de Eclo 50 y la ausencia de alusiones políticas requieren revisión.|Arguments concerning the figure in Sirach 50 and absent political allusions require review.
Llegada a Egipto situada en 132 a. C. por conversión del año regnal.|Arrival in Egypt placed in 132 BCE by regnal-year conversion.
Propuesta de finalización posterior a 117 a. C.|Proposed completion after 117 BCE.
No se ha documentado un límite superior ni una fecha exacta.|No upper bound or exact date is documented.
Ben Sira vinculado con Jerusalén.|Ben Sira associated with Jerusalem.
El traductor sitúa su actividad en Egipto y declara trabajo entre hebreo y griego.|The translator places his activity in Egypt and reports work between Hebrew and Greek.
El traductor declara haber trabajado sobre la obra hebrea de su abuelo y sitúa la actividad en Egipto.|The translator reports working on his grandfather’s Hebrew work and places his activity in Egypt.
Prólogo, párrafos sobre traducción y estancia en Egipto.|Prologue, paragraphs concerning translation and residence in Egypt.
Testimonio conservado en una tradición textual; no identifica el ejemplar usado.|Testimony preserved in a textual tradition; it does not identify the exemplar used.
No permite identificar individualmente todos los libros llamados Ley, Profetas y otros escritos.|It does not identify every individual book called Law, Prophets and other writings.
La síntesis consultada informa de correspondencias sustanciales entre testimonios hebreos y el texto griego.|The consulted synthesis reports substantial correspondences between Hebrew witnesses and the Greek text.
Párrafo sobre manuscritos hebreos recuperados y concordancia con el griego.|Paragraph on recovered Hebrew manuscripts and agreement with Greek.
Corroboración mediante análisis publicado; no se ha efectuado un cotejo propio.|Corroboration through published analysis; no comparison of our own was performed.
Los testimonios conservados no se identifican con el ejemplar ni prueban por sí solos su disponibilidad temprana.|Surviving witnesses are not identified with the exemplar and do not independently establish early availability.
La introducción propone límites de composición, llegada y finalización, que corresponden a eventos diferentes.|The introduction proposes composition, arrival and completion bounds, which concern different events.
The author and translator of the book, párrafos sobre datación.|The author and translator of the book, dating paragraphs.
Hipótesis de síntesis; pendiente de ampliar bibliografía y evaluar reconstrucciones alternativas.|Synthesis hypothesis; further bibliography and assessment of alternative reconstructions are pending.
No cuenta como línea independiente de acceso cuando deriva del prólogo.|It is not an independent access line when derived from the prologue.
El colofón atribuye la instrucción escrita a Ben Sira.|The colophon attributes the written instruction to Ben Sira.
Eclo 50:27 y nota al colofón.|Sirach 50:27 and the colophon note.
La atribución no resuelve por sí sola todas las etapas editoriales.|Attribution alone does not resolve every editorial stage.
La introducción vincula al autor con Jerusalén.|The introduction associates the author with Jerusalem.
Párrafo sobre el autor y su entorno.|Paragraph on the author and his setting.
La localización del responsable no demuestra el lugar de cada intervención textual.|The author’s location does not establish the location of every textual intervention.
Testimonio específico de acceso durante la traducción.|Specific testimony of access during translation.
Corroboración textual publicada de un antecedente hebreo pertinente.|Published textual corroboration of a pertinent Hebrew antecedent.
Se distinguen el testimonio del traductor y las correspondencias entre tradiciones textuales. No se cuentan las síntesis modernas como testimonios independientes ni se atribuye al cotejo una prueba autónoma de disponibilidad.|The translator’s testimony is distinguished from correspondences between textual traditions. Modern syntheses are not counted as independent witnesses and comparison is not assigned autonomous proof of availability.
Acceso al antecedente hebreo declarado por el responsable de la traducción; procedencia material del ejemplar desconocida.|Access to the Hebrew antecedent reported by the translator; the exemplar’s material provenance is unknown.
Acceso a una forma antecedente de la obra, sin identificarla con cada versículo del libro actual.|Access to an antecedent form of the work, without identifying it with every verse of the present book.
Antes de producir los segmentos griegos correspondientes, durante la actividad del traductor; año exacto desconocido.|Before producing the corresponding Greek segments, during the translator’s activity; the exact year is unknown.
Admisión de trabajo por convergencia testimonial y textual. El orden relativo se apoya en la traducción declarada y no solo en intervalos cronológicos.|Working admission through testimonial and textual convergence. Relative order rests on the declared translation, not only on chronological ranges.
No se reconstruye el ejemplar completo.|The complete exemplar is not reconstructed.
No acredita acceso del traductor a cada ampliación posterior.|It does not establish the translator’s access to every later expansion.
No identifica una institución, ciudad o trayecto del ejemplar.|It identifies no institution, city or route of the exemplar.
Valoración inicial basada en texto primario traducido y síntesis publicadas; no es un cotejo crítico exhaustivo.|Initial assessment based on translated primary text and published syntheses; not an exhaustive critical comparison.
Uso efectivo adicional documentado; el significado de la flecha sigue siendo accesibilidad.|Additional actual use is documented; the arrow continues to mean accessibility.
Sirácida o Ben Sira. El prólogo del traductor es fuente histórica asociada, no un libro adicional.|Sirach or Ben Sira. The translator’s prologue is an associated historical source, not an additional book.
Eclesiástico: prólogo del traductor, NRSVCE|Sirach: translator’s prologue, NRSVCE
Eclesiástico 50:27 y notas, NABRE|Sirach 50:27 and notes, NABRE
BenSira.org: manuscritos hebreos|BenSira.org: Hebrew manuscripts
'''
for line in pairs.strip().splitlines():
    if not line.strip(): continue
    es,en=line.split('|',1);messages[es]=en
messages.update(json.loads((ROOT/'research/experience-en.json').read_text())['messages'])
messages.update(json.loads((ROOT/'research/explore-en.json').read_text())['messages'])
out=ROOT/'locales/en.json'
out.write_text(json.dumps(dict(locale='en',title='Textual Atlas · Catholic Bible',book_abbreviations=json.loads((ROOT/'research/book-abbreviations.json').read_text())['en'],messages=messages),ensure_ascii=False,indent=2)+'\n')
print(f'{len(messages)} claves traducidas')
