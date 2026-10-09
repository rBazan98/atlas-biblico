"""Recupera introducciones para lectura local; no publica los textos de las fuentes."""
import concurrent.futures
import hashlib
import json
import re
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.research-cache'
CACHE.mkdir(exist_ok=True)
NAMES = '''Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Tobit|Judith|Esther|1 Maccabees|2 Maccabees|Job|Psalms|Proverbs|Ecclesiastes|Song of Songs|Wisdom|Sirach|Isaiah|Jeremiah|Lamentations|Baruch|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation'''.split('|')

class Paragraphs(HTMLParser):
    def __init__(self):
        super().__init__(); self.active = False; self.parts = []; self.records = []
    def handle_starttag(self, tag, attrs):
        if tag in ('p', 'h2', 'h3'):
            if self.active:self.flush()
            self.active = True; self.parts = []
    def handle_endtag(self, tag):
        if tag in ('p', 'h2', 'h3') and self.active:self.flush()
    def handle_data(self, text):
        if self.active:self.parts.append(text)
    def flush(self):
        value = re.sub(r'\s+', ' ', ''.join(self.parts)).strip()
        if value:self.records.append(value)
        self.active=False; self.parts=[]

def fetch(item):
    number, name = item
    path = CACHE / f'{number:02d}.json'
    if path.exists():
        previous=json.loads(path.read_text())
        if previous.get('status')=='ok':return previous
    url='https://www.biblegateway.com/passage/intro/?search='+urllib.parse.quote(name)+'&version=NABRE'
    result={'number':number,'book':name,'url':url,'consulted_on':datetime.now(timezone.utc).date().isoformat()}
    try:
        request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(request,timeout=35) as response:raw=response.read()
        parser=Paragraphs();parser.feed(raw.decode('utf-8'))
        result.update(status='ok',sha256=hashlib.sha256(raw).hexdigest(),paragraphs=parser.records)
    except Exception as error:result.update(status='failed',error=str(error))
    path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    return result

if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results=list(pool.map(fetch,enumerate(NAMES,1)))
    print(json.dumps({'consultadas':sum(r['status']=='ok' for r in results),'fallidas':[
        {'libro':r['book'],'error':r.get('error')} for r in results if r['status']!='ok']},ensure_ascii=False))
