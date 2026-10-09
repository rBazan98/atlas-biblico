# Historical criterion and data model

**A → B if and only if a pertinent form of A was presumably accessible to B’s author or editor during their activity and before composing the studied part of B.** Earlier dates, thematic similarity, geographical proximity and traditional authorship alone are insufficient. Actual literary dependence is recorded separately.

A biblical quotation is one possible ground for access, not a requirement. Own composition, circulation of written sources, editorial continuity and assembly of materials can also justify access. The assessment needs specific historical grounds without requiring a surviving exemplar, identified library or physical itinerary. See [the access review and examples](accessibility.en.md).

The corpus has 73 Catholic biblical books. Greek additions to Esther and Daniel remain within those books; the Letter of Jeremiah is Baruch 6. Sirach’s prologue is an associated source, not a seventy-fourth book. External or lost sources such as Q and Jason of Cyrene’s work are discussed where relevant, without being drawn as canonical books or established surviving documents.

## Representation and provenance

The registry’s units are textual stages: composition, collection, editing, revision or translation, with stated scope and proposed attribution. They are research units rather than necessarily surviving manuscripts. Book view groups stages without extending partial access to an entire volume. The overview presents one circle per book, with loops for internal connections. Temporal views distinguish books and stages; internal connections also remain in stage view and details.

Overview constellations, colors and positions group corpus families without representing dates, places or communities. Circles share a size and do not encode importance or certainty. Labels identify grounds for access, such as “Same author,” “Greek source” and “Assembly.” Passage references appear within the evidence. Loops represent internal stage relationships: translation in Sirach, editing in John and material assembly in Daniel.

Dotted arrows represent inferences with explicit assumptions; solid arrows represent identifiable textual reception or translation. Both are admissions limited to a form and scenario. Dashed candidates have no arrowhead. The grounds filter lets readers explore inferences without explicit quotation. Line style does not quantify certainty or by itself identify a physical route.

Deuteronomy, Proverbs, Esther, Isaiah, Baruch, Daniel, Mark, John and Sirach are subdivided where consulted sources warrant distinctions. Broad nodes elsewhere do not assert single authorship or the absence of layers. Lanes group the corpus for reading; they do not establish historical communities or transmission networks. Connectors are schematic and do not date access.

| Collection | Purpose |
| --- | --- |
| `works`, `stages` | Canonical book and delimited textual intervention. |
| `actors`, `attributions` | Identified or anonymous agents, groups and alternative attributions. |
| `forms` | Pertinent accessible content or textual state, distinguished from today’s complete edition. |
| `dates`, `contexts` | Dated events, intervals, unknown bounds and supported contextual information. |
| `claims`, `evidence`, `sources` | Claim, ground, citation locator, objections and provenance. |
| `scenarios` | Explicit selection of compatible attributions, dates and claims. |
| `access_evaluations` | Conditions, outcome, form, recipient, route, scope and limitations for a particular scenario. |
| `access_basis` inside each assessment | Ground type, label, reason, assumptions and whether the channel is attested, inferred or unknown. |

Evidence retains `basis_id`; repeated modern explanations are not separate historical witnesses. Identifiers remain stable. Numerical probabilities are not assigned without grounds for estimating them.

The main sources are NABRE/USCCB introductions and critical references, also available through Bible Gateway. Seventy-one introduction pages cover all books, including joint introductions to Samuel and Kings. Joint explanations for the Pastorals and 2–3 John are also used. This editorial synthesis is not an exhaustive specialist literature review. Sirach additionally uses UBS and Hebrew-witness documentation. Synoptic assessments include Felix Just and Oxford’s catalogue/abstract of Eric Eve’s book; the abstract is not represented as full-book consultation.

## Dates and scenarios

Dates have subjects and events. Narrated settings, prophetic activity, arrival, translation and editorial completion are distinct. Sirach’s translator arriving in Egypt in 132 BCE is distinguished from proposed translation completion after 117 BCE. Haggai’s 520 BCE date refers to dated core oracles, not every possible editorial intervention.

Years use positive numbers and BCE/CE eras, without a historical year zero; unknown bounds use `null`. Ranges represent hypotheses or settings, not probability distributions or continuous writing durations. Undated stages occupy a column outside the time scale. Book ranges retain unknown bounds when stages are undated.

Turning “century,” “early,” “late” or “near” into graph endpoints uses explicitly documented display conventions. For example, sixth–fifth centuries BCE appear as 600–401, and “near 70” as 65–75. These are not precise endpoints supplied by the sources. Conditional bounds, such as possible use of Hebrews by 1 Clement around 96, retain their condition in the dating notes.

Final composition remains undelimited wherever the consulted source supplies no bounds. A king’s reign, deportation, fictional setting or an author’s activity does not automatically date a received collection. A reading scene does not establish that the narrated event happened.

Two scenarios retain a critical working synthesis and published alternatives for Galatia, Ephesians, Philippians, the Pastorals, James and 1 Peter. The alternative selection is not a uniform scholarly school. Both provisionally adopt Markan priority for Mark’s connections to Matthew and Luke; each evaluation explicitly states that assumption. Matthew → Luke remains pending. Proposed dependence is not automatically proof of accessibility.

## Admission and uncertainty

Four conditions require support: prior existence of pertinent content; availability and a plausible route; sufficient linguistic conditions, including mediation; and access during the recipient’s activity before receiving composition. At least two distinguishable evidential grounds, one specific to the relationship, and an explanation of convergence are required. This is the project’s working policy rather than a universal historical scale.

Presumed access permits a grounded inference under a stated reconstruction. Attribution of two letters to the same Paul and their composition order can support his knowing the earlier letter when composing the later one. That knowledge requires neither quotation, actual reuse nor retention of an autograph. An author label alone is insufficient: attribution and prior existence are documented.

Mark → Matthew/Luke and Samuel/Kings → Chronicles combine specific parallels and rewritings identified in scholarship with chronological, linguistic and editorial conditions. Luke → Acts and John → epilogue state the proposed continuity of responsibility. Daniel’s two connections end at an assembly stage: compiler access does not establish the original vision author’s access to the stories. Evidential lines can share an editorial reconstruction and are not represented as independent witnesses.

For 36 quotation relationships, the receiving act of quotation is distinguished from identification of antecedent content using the source passage and published editorial references. These grounds share the receiving passage and are not statistically independent; that dependence is declared. Admission concerns direct or mediated access to the excerpt. Teaching, memory, liturgy or quotation collections are possible channels, not identified routes. Possession of a whole scroll, access to every addition, or a specific transport history is not established.

Sirach instead combines the translator’s testimony about his grandfather’s work with published Hebrew/Greek witness correspondences. The exact exemplar is unknown, and surviving manuscripts are not identified with it.

The research uses primary texts in translation and published identification. It does not claim manuscript collation or an original comprehensive Greek/Hebrew comparison. Composite quotations, numbering variants and edition uncertainties limit each result. No arrow is admitted for thematic resemblance alone.

`admitida` produces an arrow for its stated scope and scenario; `pendiente` can appear without an arrowhead. The schema also permits `incompatible`, requiring a specified incompatible condition, and `sin_evaluar`. This version contains admitted and pending cases only. No arrow means neither impossibility nor a completed negative assessment. Access is not inferred transitively.

The registry contains 73 books, 86 stages and 155 references. Each scenario includes 48 admitted connections: 36 receptions of quoted content, one translation, four literary-transmission inferences, three common-authorship inferences, two editorial-continuity inferences and two assembly inferences. Twelve admissions do not rest on explicit quotation; eleven are inferential. Nine candidates remain pending. The JSON’s 114 evaluations assess 57 relationships in two scenarios, not 114 different relationships.

The alternatives change authorship and dates without extending partial access to whole books. Not all possible pairs are assessed, including all possible pairs of letters by a common author. Structural validation checks documentation and consistency; historical revision still requires source reading and judgment. Stable IDs beginning with `candidate_` can now designate admitted records: `status` determines the outcome.
