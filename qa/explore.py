"""Real free-exploration flows: search, direction, depth, history and shared context."""
import json,os
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('ATLAS_BASE_URL','http://127.0.0.1:8000/')
errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':960},reduced_motion='reduce',permissions=['clipboard-read','clipboard-write'])
    page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(BASE);page.wait_for_function('window.AtlasExplore')
    assert page.locator('.book-circle').count()==73
    assert not page.locator('#education-dialog').is_visible()
    assert not page.locator('#first-thread').is_visible()
    assert not page.locator('#journey-coach').count()
    assert page.locator('#explore-back').is_disabled()
    assert page.evaluate("(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length===new Set(ids).size})()")
    page.mouse.move(0,0);page.screenshot(path=str(ROOT/'docs/libre-inicio.png'),full_page=True,animations='disabled')
    page.select_option('#language','en');page.wait_for_function("AtlasI18n.getLanguage()==='en'")
    before=page.evaluate('AtlasExplore.getHistory().length')
    page.keyboard.press('/')
    assert page.evaluate("document.activeElement.id==='finder-input'")
    page.fill('#finder-input','no-such-book');assert page.locator('#finder-results').inner_text().startswith('No book')
    page.fill('#finder-input','Romans');assert page.locator('#finder-results [role=option]').count()==1
    page.keyboard.press('Enter')
    assert page.evaluate("atlas.state.selection.id==='book_rom'")
    assert 'book/book_rom' in page.url
    assert page.evaluate('AtlasExplore.getHistory().length')==before+1
    assert 'Assessed antecedents' in page.locator('#detail-pane-connections').inner_text()
    assert '1 stage' in page.locator('.selection-overview').inner_text()
    page.mouse.move(0,0);page.screenshot(path=str(ROOT/'docs/libre-conexiones-en.png'),animations='disabled')
    page.locator('#detail-tab-connections').focus();page.keyboard.press('ArrowRight')
    assert page.locator('#detail-tab-stages').get_attribute('aria-selected')=='true'
    page.keyboard.press('ArrowRight')
    assert page.locator('#detail-pane-sources a.source-link').first.is_visible()
    page.click('#detail-tab-connections')
    page.locator('#detail-pane-connections [data-edge="access_gen_rom"]').click()
    assert page.evaluate("atlas.state.selection.id==='access_gen_rom'")
    assert page.locator('#detail-pane-access').is_visible()
    assert 'Why the antecedent could be known' in page.locator('#detail-pane-access').inner_text()
    page.locator('#detail-tab-access').focus();page.keyboard.press('ArrowRight')
    assert page.locator('#detail-pane-evidence .source-link').first.is_visible()
    page.keyboard.press('ArrowRight')
    assert page.locator('#detail-pane-context .stage-card').count()==2
    page.locator('[data-mode=stages]').click()
    page.click('#zoom-in')
    page.locator('#graph-scroll').evaluate('e=>e.scrollTo({left:120,top:80})')
    page.locator('#detail-panel').evaluate('e=>e.scrollTop=50')
    old=page.evaluate("({selection:atlas.state.selection,mode:atlas.state.mode,zoom:atlas.state.zoom,x:document.querySelector('#graph-scroll').scrollLeft,y:document.querySelector('#graph-scroll').scrollTop,detail:document.querySelector('#detail-panel').scrollTop,tab:document.querySelector('.detail-tabs [aria-selected=true]').dataset.tab})")
    target=page.locator('#detail-pane-context .stage-card').first.get_attribute('data-stage')
    page.locator('#detail-pane-context .stage-card').first.click()
    assert page.evaluate('atlas.state.selection.id')==target
    page.click('#explore-back')
    page.wait_for_function("atlas.state.selection?.id==='access_gen_rom'")
    restored=page.evaluate("({selection:atlas.state.selection,mode:atlas.state.mode,zoom:atlas.state.zoom,x:document.querySelector('#graph-scroll').scrollLeft,y:document.querySelector('#graph-scroll').scrollTop,detail:document.querySelector('#detail-panel').scrollTop,tab:document.querySelector('.detail-tabs [aria-selected=true]').dataset.tab})")
    assert restored==old,(old,restored)
    page.click('#explore-forward');page.wait_for_function(f"atlas.state.selection?.id==={json.dumps(target)}")
    page.go_back();page.wait_for_function("atlas.state.selection?.id==='access_gen_rom'")
    page.click('#detail-tab-evidence');page.click('#share-selection')
    link=page.locator('#share-url').input_value()
    assert 'tab=evidence' in link and 'view=stages' in link and 'scenario_critical' in link and 'lang=en' in link
    page.click('#share-copy');expect(page.locator('#share-feedback')).to_contain_text('Link copied')
    assert page.evaluate('navigator.clipboard.readText()')==link
    page.keyboard.press('Escape')
    linked=context.new_page();linked.on('pageerror',lambda e:errors.append(str(e)));linked.goto(link);linked.wait_for_function('window.AtlasExplore')
    assert linked.evaluate("atlas.state.selection.id==='access_gen_rom' && atlas.state.mode==='stages'")
    assert linked.locator('#detail-tab-evidence').get_attribute('aria-selected')=='true'
    assert linked.locator('#detail-pane-evidence .source-link').first.is_visible()
    linked.close()
    # Same relation survives a scenario change, including its qualified identifier.
    page.evaluate("AtlasExplore.go('edge','candidate_matt_luke')")
    assert page.evaluate("atlas.state.pending")
    page.select_option('#detail-scenario','scenario_alternatives')
    assert page.evaluate("atlas.state.selection.id==='candidate_matt_luke_alt'")
    pane=page.locator('.detail-tab-panel').filter(has_text='Farrer').first
    page.locator('#'+pane.get_attribute('aria-labelledby')).click()
    assert 'Farrer' in pane.inner_text()
    assert page.locator('#graph .edge-hit[data-evaluation=candidate_matt_luke_alt]').count()==1
    page.locator('[data-mode=overview]').click()
    assert page.locator('.overview-connection[data-evaluation=candidate_matt_luke_alt] .overview-path').get_attribute('marker-end')==''
    page.click('#focus-context');assert page.evaluate('atlas.state.neighborhood')
    assert page.locator('[data-clear-filter=neighborhood]').is_visible()
    page.click('[data-clear-filter=neighborhood]');assert not page.evaluate('atlas.state.neighborhood')
    page.evaluate("atlas.navigate({foundation:'reception'})")
    assert page.locator('#selection-outside-view').is_visible()
    page.click('#reveal-selection')
    assert page.evaluate("atlas.state.foundation==='all'")
    assert page.locator('.overview-connection[data-evaluation=candidate_matt_luke_alt]').count()==1
    # A new selection after returning back replaces the forward branch.
    page.evaluate("AtlasExplore.home()")
    page.evaluate("AtlasExplore.go('book','book_gen')")
    page.evaluate("AtlasExplore.go('book','book_rom')")
    page.click('#explore-back');page.wait_for_function("atlas.state.selection?.id==='book_gen'")
    page.evaluate("AtlasExplore.go('book','book_sir')")
    assert page.locator('#explore-forward').is_disabled()
    page.click('#selection-time')
    assert page.evaluate("atlas.state.mode==='stages' && atlas.state.neighborhood")
    assert page.locator('.graph-node').count()==2
    page.click('#selection-time');assert page.evaluate("atlas.state.mode==='overview'")
    page.select_option('#language','es');page.wait_for_function("AtlasI18n.getLanguage()==='es'")
    assert 'Conexiones' in page.locator('.detail-tabs').inner_text()
    page.evaluate('AtlasExplore.home()')
    page.click('#education-button')
    assert page.locator('#education-dialog').is_visible()
    page.mouse.move(0,0);page.screenshot(path=str(ROOT/'docs/libre-apendice.png'),animations='disabled')
    page.keyboard.press('Escape')
    for width in [320,390,768]:
        page.set_viewport_size({'width':width,'height':844});page.evaluate('AtlasExplore.home()')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        page.click('#finder-button');page.fill('#finder-input','Romanos');page.keyboard.press('Enter')
        assert page.locator('#detail-panel').is_visible()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        if width<=640:
            box=page.locator('#detail-panel').bounding_box()
            assert box['height']<844*.75
            assert page.locator('#free-bar').is_visible()
        page.click('#detail-tab-stages');page.locator('#detail-pane-stages .stage-card').first.click()
        assert page.locator('#detail-tab-summary').get_attribute('aria-selected')=='true'
        page.click('#explore-back');page.wait_for_function("atlas.state.selection?.id==='book_rom'")
        if width==390:page.mouse.move(0,0);page.screenshot(path=str(ROOT/'docs/libre-movil.png'),animations='disabled')
        page.click('#detail-dismiss')
    # Bad links remain usable and do not silently substitute an invented context.
    page.goto(BASE+'#stage/not_registered?scenario=unknown');page.wait_for_function('window.AtlasExplore')
    assert page.evaluate('atlas.state.selection===null')
    assert page.locator('.book-circle').count()==73
    assert page.locator('#free-notice').inner_text()
    assert not errors,errors
    browser.close()
report={'passed':True,'browser_errors':errors,'flows':['free default and isolated educational appendix','search by keyboard and localized name','empty search feedback','directional assessment groups','keyboard detail tabs and sources','map/timeline preserve selection','history restores selection/view/zoom/pan/scroll/tab','native browser back and forward','share link clipboard and direct reload','scenario switch preserves qualified relationship','candidate remains without arrowhead','visible and dismissible filter chips','history branches discard obsolete forward entries','book context in time','320/390/768 px navigation','mobile sheet leaves map visible','invalid-link recovery']}
(ROOT/'qa/explore-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Exploración libre, historial, fuentes, enlaces y móvil comprobados.')
