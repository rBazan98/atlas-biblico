# Textual Atlas of the Catholic Bible

[Documentación en español](README.md)

**Free exploration: v1.1.0-preview.2.** The first stable baseline remains at tag `v1.0.0`; the earlier educational iteration remains at `v1.1.0-preview.1`. [Release notes](CHANGELOG.md) · [Release metadata and integrity](release.json). This iteration develops navigation while preserving the historical registry bytes and schema version `0.2`.

A bilingual static application for exploring biblical composition and historically grounded access between textual stages. Ready for GitHub Pages: `index.html` and all relative application paths are at the repository root. No build or data server is required.

The registry includes **73 books, 86 textual stages, two scenarios and 155 references**. Each scenario has **48 admitted connections and 9 pending candidates**. The 114 evaluation records repeat the same 57 relationships across the two scenarios; they are not 114 distinct historical connections.

An arrow means presumed access to the specified form or content before composing the receiving passage. It does not establish access to an entire book or direct literary dependence. All books have registry coverage, while the relationships remain a documented selection rather than an exhaustive study of every possible pair.

**A biblical quotation is not required.** Twelve admissions use other grounds: common authorship, literary transmission, editorial continuity, compilation or translation. Every assessment states its access reason, assumptions, sources and limitations. See [the documented examples](docs/accessibility.en.md).

## Overview and presentation

The default view shows one circle per book, grouped into corpus families. Directed curves carry access grounds such as “Same author,” “Greek source” and “Assembly.” Dotted arrows indicate inferences with stated assumptions; solid arrows indicate identifiable textual reception or translation. Loops show relationships between stages within one book. Pending candidates are dashed and have no arrowhead. **Circle position does not represent chronology, place or historical communities.** Every connector retains its assessment’s documented scope.

Select a label to read its access reason and assumptions first, then stages, evidence and uncertainty. Related connections stand out while the rest fade. “Grounds → Inferences without explicit quotation” shows eleven inferential connections. Open Catalogue for search and filters, drag the background with a mouse or scroll by touch, and use zoom or fit. Presentation shows the complete map with fewer controls. Escape closes details or exits presentation. Stages and Books preserve the timeline views.

[Overview](docs/vista-presentacion.png) · [Application preview](docs/vista-previa.png) · [Exported overview](docs/grafo-general.svg)

## Free exploration

Find a book by name or abbreviation from the home page, navigation bar, `/` or Ctrl/Cmd K. The detail panel separates a book’s connections, stages and sources; a stage’s overview, connections and sources; and an assessment’s access grounds, evidence and context. Incoming assessed antecedents, assessed receiving texts and internal transmission are grouped without implying additional links.

Focus on the selection’s surroundings, see it in time, locate it or copy a contextual link. Active filters are visible and dismissible. Changing scenarios preserves the same relationship and selects its corresponding assessment. Pending candidates retain no arrowhead.

Back, forward, visited points and native browser controls restore the previous selection, view, scenario, filters, tab, zoom and position. Share links preserve the context and chosen language through a hash route compatible with GitHub Pages. On mobile, a bottom sheet leaves part of the map visible.

[Free home](docs/libre-inicio.png) · [Connection exploration](docs/libre-conexiones-en.png) · [Mobile navigation](docs/libre-movil.png) · [Design notes](docs/exploracion.md)

### Video demonstrations

[Node navigation · 20 s](docs/demos/navegacion-nodos-20s.mp4) · [Exploration and evidence · 20 s](docs/demos/exploracion-libre-20s.mp4) · [Recording details and walkthroughs](docs/demos/README.md).

The recordings show the application in Spanish: direct book selection, map panning, access reasoning, sources and the timeline view. They document free navigation in `v1.1.0-preview.2`.

## Educational appendix

The educational appendix contains the optional stories and their progress. “Follow your first thread” starts a Sirach story. Contextual guidance leads you through opening a stage, seeing estimated dates, following a translation and understanding its scope. Two further stories cover access without quotation and a pending candidate across scenarios. Brief interpretation questions provide helpful feedback without changing historical assessments.

Explore outside a thread, return to the same step, pause or revisit a story. Progress stays in this browser; reload opens a free atlas with an optional resume button. Closing or pausing restores the prior view. “How to explore” opens a short compass; “Refine the map” discloses scenarios, filters, candidates and labels.

[Experience preview](docs/experiencia-inicio.png) · [Mobile guide](docs/experiencia-movil.png) · [UX design notes](docs/experiencia.md)

## Publish manually

1. Extract the package and upload its contents to your GitHub repository. Keep `index.html`, scripts, styles, `registro.json` and `locales/` at the root.
2. Open **Settings → Pages** in GitHub.
3. Choose **Deploy from a branch**, your branch (usually `main`) and **/ (root)**. Save.
4. Open the URL GitHub provides when deployment finishes.

Both user sites (`USERNAME.github.io`) and project sites (`USERNAME.github.io/REPOSITORY/`) are supported. `.nojekyll` disables Jekyll processing. 

Application files: `index.html`, `styles.css`, `language.css`, `portfolio.css`, `experience.css`, `explore.css`, `overview.js`, `app.js`, `i18n.js`, `experience.js`, `explore.js`, `registro.json`, `locales/`, `.nojekyll`, and `proyecto.zip` for the project download button. Documentation and maintenance tools may also be uploaded.

## Run and explore

Run `python -m http.server 8000` in the extracted folder and open `http://localhost:8000/`. A local server is needed because browsers restrict JSON loading under `file://`.

Use the language selector or `?lang=en`. Book and stage search works in either displayed language. Choose whole-corpus, reception, Sirach or Gospel explorations; select a book or stage to inspect its evidence, or enable connections of the selection. Pending candidates have no arrowheads. Unknown dates occupy a separate column outside the time scale. Book view omits internal connections between stages of the same book; they remain in the details and stage view.

Charts export in the selected display language. JSON and CSV retain the Spanish documentary registry and stable identifiers. The application requires no external assets or analytics; outside references open only when clicked.

## Research and maintenance

Read [the methodology](docs/methodology.en.md), [the registry dossier](docs/registro.md), [the documented JSON](registro.json), [the schema](research/schema.json), [source notices](NOTICE.md) and [validation report](qa/report.json).

`research/curation.py` and `research/access_review.py` record explicit historical decisions and regenerate the registry; they never infer access solely from chronology, resemblance or transitivity. Consult the [access review audit](research/access-review-audit.json) for the revised inferences. `scripts/locales.py` assembles historical and learning UI translations. Run `qa/browser.py`, `qa/explore.py` and `qa/experience.py` against a local server, then `qa/distribution.py` after packaging. Install `requirements-dev.txt`, then run the curation, locales, validation, data QA, dossier and packaging scripts listed in the Spanish README. Structural validation does not certify historical truth. Private source captures are excluded from the distribution.

To add a language, copy `locales/en.json`, preserve its Spanish keys and book identifiers, translate values and `book_abbreviations`, change `locale` and `title`, and add the new file to `locales/languages.json`. No application code changes are necessary. When revising historical claims, update evidence, objections, scenarios and translations together.
