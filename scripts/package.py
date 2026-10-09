"""Empaqueta solo archivos públicos; el ZIP no se incluye a sí mismo."""
from pathlib import Path
import hashlib, json, shutil, zipfile
ROOT=Path(__file__).resolve().parents[1]
VERSION=(ROOT/'VERSION').read_text().strip()
OUTPUT=ROOT.parent/f'atlas-biblico-v{VERSION}-completo.zip'
PAGES_OUTPUT=ROOT.parent/f'atlas-biblico-v{VERSION}-github-pages.zip'
INNER=ROOT/'proyecto.zip'
files=['index.html','styles.css','language.css','portfolio.css','experience.css','explore.css','overview.js','app.js','i18n.js','experience.js','explore.js','registro.json','.nojekyll','.gitignore','README.md','README.en.md','NOTICE.md','requirements-dev.txt','VERSION','CHANGELOG.md','release.json']
paths=[ROOT/f for f in files]
for directory in ['locales','docs','research','scripts','qa']:
    paths.extend(p for p in (ROOT/directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix not in ['.pyc'] and not p.name.startswith('export.') and (directory!='qa' or p.suffix in ['.py','.json']))
with zipfile.ZipFile(INNER,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(set(paths)):
        z.write(p,p.relative_to(ROOT))
with zipfile.ZipFile(OUTPUT,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(set(paths+[INNER])):z.write(p,p.relative_to(ROOT))
with zipfile.ZipFile(OUTPUT) as z:
    assert z.testzip() is None
    assert 'index.html' in z.namelist() and '.nojekyll' in z.namelist()
    assert not any(name.startswith(('.research-cache/','.openai/','.git/')) for name in z.namelist())
page_files=['index.html','styles.css','language.css','portfolio.css','experience.css','explore.css','overview.js','app.js','i18n.js','experience.js','explore.js','registro.json','.nojekyll','NOTICE.md','VERSION','CHANGELOG.md','release.json','proyecto.zip']
page_files.extend(str(p.relative_to(ROOT)) for p in (ROOT/'locales').rglob('*') if p.is_file())
with zipfile.ZipFile(PAGES_OUTPUT,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for name in sorted(page_files):z.write(ROOT/name,name)
    channel=json.loads((ROOT/'release.json').read_text())['channel']
    label='Versión estable / Stable release' if channel=='stable' else 'Versión de revisión / Preview release'
    z.writestr('README.md',f'**{label}: v{VERSION}**\n\n'+(ROOT/'docs/publicar-pages.md').read_text())
with zipfile.ZipFile(PAGES_OUTPUT) as z:
    assert z.testzip() is None and 'index.html' in z.namelist() and 'VERSION' in z.namelist()
for output in [OUTPUT,PAGES_OUTPUT]:
    print(json.dumps({'file':str(output),'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest()}))
