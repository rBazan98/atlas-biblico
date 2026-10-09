# Publicar el atlas en GitHub Pages

Este paquete contiene la aplicación estática en español e inglés, sus datos y referencias, y los archivos de identificación de versión. No necesita compilación ni servidor de datos.

1. Descomprime el ZIP.
2. Sube su contenido a https://github.com/rBazan98/atlas-biblico. Conserva `locales/` e incluye `.nojekyll`. `index.html` debe quedar directamente en la raíz del repositorio.
3. En **Settings → Pages → Build and deployment**, selecciona **Deploy from a branch**, la rama donde subiste los archivos y **/ (root)**. Pulsa **Save**.
4. Espera a que GitHub termine de publicar y abre la dirección que muestra Pages. La dirección prevista es https://rbazan98.github.io/atlas-biblico/.

`VERSION`, `release.json` y `CHANGELOG.md` identifican esta entrega. La versión estable inicial permanece en `v1.0.0`; `v1.1.0-preview.2` es la iteración de UX para revisión. Si creas una publicación en **Releases**, usa su etiqueta y las notas correspondientes. Marca **Set as a pre-release** para una versión con `channel: preview`; reserva una publicación estable para una versión con `channel: stable`.

El selector permite cambiar entre español e inglés. También puedes abrir `?lang=es` o `?lang=en`. Las conexiones representan accesibilidad histórica plausible bajo sus fuentes y supuestos; la dependencia literaria se documenta aparte. Las reconstrucciones históricas siguen siendo revisables.

`proyecto.zip` conserva la descarga del proyecto desde la aplicación. Para probar localmente, ejecuta `python -m http.server 8000` en esta carpeta y abre http://localhost:8000/.

## English

Extract and upload the contents to your repository root, preserving `locales/` and `.nojekyll`. In **Settings → Pages**, choose **Deploy from a branch**, your uploaded branch and **/ (root)**. Save and wait for GitHub to publish. No build is required. The application includes Spanish and English.

`VERSION`, `release.json` and `CHANGELOG.md` identify this delivery. The first stable baseline remains at `v1.0.0`; `v1.1.0-preview.2` is a UX review iteration. Use the corresponding tag and changelog when creating a GitHub release. Select **Set as a pre-release** for a version with `channel: preview`. Historical reconstructions retain their uncertainties.
