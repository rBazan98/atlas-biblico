"""Lee las referencias primarias; conserva las capturas fuera del paquete público."""
import concurrent.futures, hashlib, json, urllib.request
from pathlib import Path
from recopilar_fuentes import Paragraphs
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'registro.json').read_text())
CACHE=ROOT/'.research-cache/passages';CACHE.mkdir(exist_ok=True)
def read(source):
    path=CACHE/(source['id']+'.json')
    if path.exists():return json.loads(path.read_text())
    record={'source_id':source['id'],'url':source['url'],'consulted_on':'2026-10-06'}
    try:
        request=urllib.request.Request(source['url'],headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(request,timeout=30) as response:raw=response.read()
        parser=Paragraphs();parser.feed(raw.decode('utf-8'))
        record.update(status='ok',sha256=hashlib.sha256(raw).hexdigest(),paragraphs=parser.records)
    except Exception as error:record.update(status='failed',error=str(error))
    path.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n');return record
if __name__=='__main__':
    sources=[s for s in DATA['sources'] if s['id'].startswith('src_text_')]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(read,sources))
    (ROOT/'research/passages-audit.json').write_text(json.dumps([{k:v for k,v in r.items() if k!='paragraphs'} for r in results],ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'read':sum(r['status']=='ok' for r in results),'failed':[r for r in results if r['status']!='ok']}))
