"""Verify standalone Pages/source archives against the actual release manifest."""
import hashlib, io, json, re, subprocess, zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
version=(ROOT/'VERSION').read_text().strip()
release=json.loads((ROOT/'release.json').read_text())
baseline=subprocess.check_output(['git','show','v1.0.0:registro.json'],cwd=ROOT)
assert (ROOT/'registro.json').read_bytes()==baseline
paths=[ROOT.parent/f'atlas-biblico-v{version}-github-pages.zip',ROOT.parent/f'atlas-biblico-v{version}-completo.zip']
for path in paths:
    with zipfile.ZipFile(path) as z:
        names=z.namelist()
        assert z.testzip() is None
        assert 'index.html' in names and '.nojekyll' in names
        assert not any(n.startswith(('.research-cache/','.git/','.openai/')) for n in names)
        assert all(not n.startswith('/') and '..' not in Path(n).parts for n in names)
        assert z.read('VERSION').decode().strip()==version
        manifest=json.loads(z.read('release.json'))
        assert manifest==release
        for name,digest in manifest['runtime_sha256'].items():
            assert hashlib.sha256(z.read(name)).hexdigest()==digest,name
        for src in re.findall(r'<(?:script|link)\b[^>]*?(?:src|href)="([^"]+)"',z.read('index.html').decode()):
            if not src.startswith('data:'):assert src in names,src
        languages=json.loads(z.read('locales/languages.json'))
        for language in languages['languages']:assert 'locales/'+language['file'] in names
        assert z.read('registro.json')==baseline
        with zipfile.ZipFile(io.BytesIO(z.read('proyecto.zip'))) as project:
            assert project.testzip() is None
            assert project.read('VERSION').decode().strip()==version
            assert 'proyecto.zip' not in project.namelist()
            assert 'experience.js' in project.namelist() and 'qa/experience.py' in project.namelist()
            for name,digest in manifest['runtime_sha256'].items():assert hashlib.sha256(project.read(name)).hexdigest()==digest
report={'passed':True,'application_version':version,'runtime_files_verified':len(release['runtime_sha256']),'historical_registry_matches_v1_0_0':True,'checks':['Pages and full-source ZIP integrity','runtime SHA-256 manifest','relative script/style paths','locale files present','matching inner project version and assets','no source caches, credentials or Git history','inner project ZIP does not contain itself']}
(ROOT/'qa/distribution-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Dos paquetes autónomos verificados; datos idénticos a v1.0.0.')
