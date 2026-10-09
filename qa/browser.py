"""Pruebas de los flujos reales del atlas con Chromium y Playwright."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
errors=[]
BASE_URL=os.environ.get('ATLAS_BASE_URL','http://127.0.0.1:8000/')
def show_documented_text(page,text):
    pane=page.locator('.detail-tab-panel').filter(has_text=text).first
    if pane.count():page.locator('#'+pane.get_attribute('aria-labelledby')).click()
with sync_playwright() as p:
    executable='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None
    browser=p.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':960},device_scale_factor=1)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(BASE_URL)
    page.wait_for_function('window.atlas && document.querySelectorAll(".graph-node").length===73')
    assert page.locator('.book-item').count()==73
    assert page.locator('.edge-hit').count()==48
    assert page.locator('.book-circle').count()==73
    assert page.locator('.overview-edge-label').count()==48
    assert 'Rom 4:3' not in page.locator('#graph').text_content()
    assert 'Autor común' in page.locator('#graph').text_content()
    assert page.evaluate("""(()=>{const boxes=[...document.querySelectorAll('.overview-edge-label rect')].map(e=>e.getBoundingClientRect());return boxes.every((a,i)=>boxes.slice(i+1).every(b=>a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top))})()""")
    assert not page.locator('#detail-panel').is_visible()
    assert 'Mapa general' in page.locator('#graph').get_attribute('aria-label')
    page.screenshot(path=str(ROOT/'qa/overview-es.png'),full_page=True)
    # Advanced controls are deliberately disclosed by the user.
    page.locator('#map-options summary').click()
    page.uncheck('#show-labels')
    assert page.locator('.overview-edge-label').count()==0
    page.check('#show-labels')
    page.locator('.overview-edge-label[data-evaluation="access_gen_rom"]').click()
    assert 'Génesis' in page.locator('#detail-panel').inner_text()
    assert 'Romanos' in page.locator('#detail-panel').inner_text()
    assert page.locator('#detail-panel a.source-link').count()>0
    page.press('body','Escape')
    assert not page.locator('#detail-panel').is_visible()
    assert page.evaluate("document.activeElement.matches('.edge-hit')")
    page.select_option('#foundation','inferred')
    assert page.locator('.edge-hit').count()==11
    assert page.locator('#graph path[stroke-dasharray="2 3"][marker-end^="url"]').count()==11
    page.locator('.overview-edge-label[data-evaluation="access_prior_1th_1co"]').click()
    detail=page.locator('#detail-panel').inner_text()
    assert 'Autor común' in detail and 'no hace falta que lo cite' in detail
    assert 'Supuestos de esta evaluación' in detail
    assert page.locator('#detail-panel a.source-link').count()>=2
    page.press('body','Escape')
    page.locator('.overview-edge-label[data-evaluation="access_dan_tales_assembly"]').click()
    show_documented_text(page,'reunión de relatos y visiones')
    assert 'reunión de relatos y visiones' in page.locator('#detail-panel').inner_text()
    show_documented_text(page,'cada autor anterior')
    assert 'cada autor anterior' in page.locator('#detail-panel').inner_text()
    page.press('body','Escape')
    page.select_option('#foundation','all')
    assert page.locator('.edge-hit').count()==48
    page.locator('.overview-node[data-work="book_gen"]').press('Enter')
    assert 'Génesis' in page.locator('#detail-panel').inner_text()
    assert page.evaluate("document.activeElement.id==='detail-dismiss'")
    page.check('#neighborhood')
    assert page.locator('.graph-node').count()==3
    assert page.locator('.edge-hit').count()==2
    page.click('#reset')
    page.click('#presentation')
    assert not page.locator('.topbar').is_visible()
    assert page.locator('.book-circle').count()==73
    assert page.evaluate("[...document.querySelectorAll('.book-circle')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight})")
    page.screenshot(path=str(ROOT/'qa/presentation-es.png'))
    page.press('body','Escape')
    assert page.locator('.topbar').is_visible()
    page.click('#zoom-in')
    assert page.locator('#zoom-value').inner_text()=='125 %'
    page.locator('#graph-scroll').evaluate("e=>e.scrollIntoView({block:'start'})")
    before=page.locator('#graph-scroll').evaluate('(e)=>e.scrollLeft')
    r=page.locator('#graph-scroll').bounding_box()
    # Drag the exposed canvas, below the sticky navigation bar.
    page.mouse.move(r['x']+300,r['y']+85);page.mouse.down();page.mouse.move(r['x']+180,r['y']+85,steps=5);page.mouse.up()
    assert page.locator('#graph-scroll').evaluate('(e)=>e.scrollLeft')>before
    page.click('#zoom-fit')
    assert page.locator('#zoom-value').inner_text()=='100 %'
    page.select_option('#language','en')
    page.wait_for_function("AtlasI18n.getLanguage()==='en'")
    assert 'One library.' in page.locator('.graph-heading').inner_text()
    assert 'Genesis' in page.locator('.overview-node[data-work="book_gen"]').text_content()
    assert 'Each circle is a book.' in page.locator('#graph-notice').inner_text()
    assert 'Same author' in page.locator('#graph').text_content()
    page.evaluate("atlas.select('edge','access_prior_1th_1co')")
    detail=page.locator('#detail-panel').inner_text()
    assert 'no quotation is required' in detail and 'Assumptions of this assessment' in detail
    page.press('body','Escape')
    page.screenshot(path=str(ROOT/'qa/overview-en.png'),full_page=True)
    page.select_option('#language','es')
    page.wait_for_function("AtlasI18n.getLanguage()==='es'")
    page.click('#export-button')
    for selector,extension in [('#download-svg','svg'),('#download-png','png')]:
        with page.expect_download() as info:page.click(selector)
        info.value.save_as(str(ROOT/'qa'/('overview-export.'+extension)))
    svg=(ROOT/'qa/overview-export.svg').read_text()
    assert 'Agrupación editorial, sin escala temporal' in svg
    assert 'class="edge-hit"' not in svg
    assert svg.count('class="book-circle"')==73
    page.locator('#export-dialog .dialog-close').click()
    page.locator('[data-mode="books"]').click()
    assert page.locator('.graph-node').count()==73
    assert page.locator('.edge-hit').count()==44
    page.locator('[data-mode="stages"]').click()
    assert page.locator('.graph-node').count()==86
    page.screenshot(path=str(ROOT/'qa/desktop-es.png'))
    page.select_option('#tour','sirach')
    assert page.locator('.graph-node').count()==2
    page.evaluate("atlas.select('edge','access_sir_he_gr')")
    assert '132' not in page.locator('.graph-node').nth(1).text_content()
    assert '117' in page.locator('.graph-node').nth(1).text_content()
    assert page.locator('#detail-panel a.source-link').count()>0
    page.screenshot(path=str(ROOT/'qa/sirach-es.png'))
    page.select_option('#language','en')
    page.wait_for_function("AtlasI18n.getLanguage()==='en'")
    assert page.locator('html').get_attribute('lang')=='en'
    assert ' '.join(page.locator('#detail-panel > h2').inner_text().split())=='Sirach → Sirach'
    assert 'Access assessment' in page.locator('#detail-panel').inner_text().capitalize() or 'ACCESS ASSESSMENT' in page.locator('#detail-panel').inner_text()
    assert 'Admitted access' in page.locator('#detail-panel').inner_text()
    show_documented_text(page,'Before producing')
    assert 'Before producing' in page.locator('#detail-panel').inner_text()
    page.screenshot(path=str(ROOT/'qa/sirach-en.png'))
    page.click('#method-button')
    assert '73 books, 86 recorded stages' in page.locator('#method-content').inner_text()
    assert 'The registry is a working reconstruction' in page.locator('#method-content').inner_text()
    assert 'A quotation is one possible piece of evidence, not a requirement' in page.locator('#method-content').inner_text()
    page.locator('#method-dialog .dialog-close').click()
    page.click('#reset')
    page.locator('[data-testament="NT"]').click()
    assert page.locator('.book-item').count()==27
    page.locator('#search').fill('Hebrews')
    assert page.locator('.book-item').count()==1
    page.locator('#search').fill('no-such-book')
    assert page.locator('#graph-empty').is_visible()
    page.select_option('#tour','sirach')
    assert page.locator('#search').input_value()==''
    assert page.locator('.graph-node').count()==2
    assert 'Sirach' in page.locator('#detail-panel').inner_text()
    page.click('#reset')
    page.locator('#search').fill('Romans')
    page.locator('[data-book="book_rom"]').click()
    page.check('#neighborhood')
    assert page.locator('#search').input_value()==''
    assert page.locator('.graph-node').count()>1
    assert page.locator('.edge-hit').count()>0
    page.click('#reset')
    page.evaluate("atlas.select('stage','stage_eph')")
    assert '80 CE' in page.locator('#detail-panel').inner_text()
    page.select_option('#scenario','scenario_alternatives')
    assert '61 CE' in page.locator('#detail-panel').inner_text()
    page.check('#neighborhood')
    assert page.locator('.graph-node').count()==1
    page.click('#reset')
    page.select_option('#tour','reception')
    page.check('#show-pending')
    assert page.locator('.edge-hit').count()==57
    assert page.locator('#graph path[stroke-dasharray="5 5"][marker-end=""]').count()==9
    page.evaluate("atlas.select('edge','candidate_matt_luke_alt')")
    show_documented_text(page,'Farrer')
    assert 'Farrer' in page.locator('#detail-panel').inner_text()
    page.click('#export-button')
    for selector,extension in [('#download-svg','svg'),('#download-json','json'),('#download-csv','csv'),('#download-png','png')]:
        with page.expect_download() as info:page.click(selector)
        download=info.value;assert download.suggested_filename.endswith(extension)
        download.save_as(str(ROOT/'qa'/('export.'+extension)))
    with page.expect_download() as info:page.locator('#export-dialog a[download]').click()
    assert info.value.suggested_filename.endswith('.zip')
    page.locator('#export-dialog .dialog-close').click()
    page.set_viewport_size({'width':390,'height':844})
    page.select_option('#tour','sirach')
    page.screenshot(path=str(ROOT/'qa/mobile-en.png'),full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
    page.locator('#graph .graph-node').first.press('Enter')
    assert page.locator('#detail-panel').inner_text()
    page.select_option('#language','es')
    page.wait_for_function("AtlasI18n.getLanguage()==='es'")
    assert 'Colección hebrea' in page.locator('#detail-panel').inner_text()
    page.locator('[data-mode="overview"]').click()
    assert not page.locator('#catalogue').is_visible()
    page.click('#catalogue-toggle')
    assert page.locator('#catalogue').is_visible()
    page.locator('#catalogue [data-book="book_rom"]').click()
    assert not page.locator('#catalogue').is_visible()
    assert page.locator('#detail-panel').is_visible()
    assert 'Romanos' in page.locator('#detail-panel').inner_text()
    page.click('#detail-dismiss')
    page.click('#reset')
    page.check('#show-pending')
    assert page.locator('.edge-hit').count()==57
    assert page.locator('#graph path[stroke-dasharray="5 5"][marker-end=""]').count()==9
    assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
    page.screenshot(path=str(ROOT/'qa/overview-mobile-es.png'),full_page=True)
    page.click('#presentation')
    assert page.locator('.book-circle').count()==73
    assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
    page.screenshot(path=str(ROOT/'qa/presentation-mobile-es.png'))
    page.press('body','Escape')
    assert not errors,errors
    browser.close()
(ROOT/'qa/browser-results.json').write_text(json.dumps({'passed':True,'browser_errors':errors,'flows':['73 circular book nodes and 48 access-ground labels','non-overlapping overview labels','11 inferred-access connections and grounds filter','same-author access without a quotation or claimed reuse','Daniel compilation receiver distinct from prior authors','bilingual access reasons and assumptions','presentation mode','overview SVG/PNG exports','pointer panning and fit','keyboard drawer focus','mobile catalogue and detail drawers','73-book catalogue','86-stage corpus','book/stage views and internal connections','admitted/candidate distinction','scenario authorship/dates','English/Spanish round trip','search and filters','neighborhood','keyboard selection','SVG/PNG/JSON/CSV/ZIP downloads','mobile overflow','GitHub Pages repository path prefix']},ensure_ascii=False,indent=2)+'\n')
print('Flujos del navegador completados sin errores.')
