'use strict';
// Free exploration changes navigation and presentation, never historical assessments.
(()=>{
  const q=(selector,root=document)=>root.querySelector(selector);
  const qa=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const t=source=>window.AtlasI18n.text(source);
  const html=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const format=(source,values)=>Object.entries(values).reduce((s,[k,v])=>s.replace('{'+k+'}',v),t(source));
  const education=()=>Boolean(window.AtlasExperience?.isActive());
  const session=Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  let ready=false,replaying=false,entries=[],cursor=-1,signature='',wantedTab=null,results=[],resultIndex=0;
  const tabs=new Map();
  function copyState(){return {...window.atlas.state,selection:window.atlas.state.selection?{...window.atlas.state.selection}:null}}
  function viewport(){return {x:q('#graph-scroll').scrollLeft,y:q('#graph-scroll').scrollTop,pageX:scrollX,pageY:scrollY,detail:q('#detail-panel').scrollTop}}
  function key(s=window.atlas.state){return s.scenario+'|'+s.selection?.type+'|'+s.selection?.id}
  function routeSignature(){const s=window.atlas.state;return JSON.stringify([s.selection,s.mode,s.scenario,s.pending,s.foundation,s.tour,s.testament,s.neighborhood])}
  function title(selection){
    if(!selection)return t('Mapa completo');
    const data=window.atlas.getData();
    if(selection.type==='book')return t(data.works.find(w=>w.id===selection.id)?.label||'Libro');
    if(selection.type==='stage')return t(data.stages.find(s=>s.id===selection.id)?.label||'Etapa');
    const e=data.access_evaluations.find(e=>e.id===selection.id),work=id=>data.works.find(w=>w.id===data.stages.find(s=>s.id===id)?.work_id);
    return e?t(work(e.from_stage_id)?.label)+' '+(e.status==='admitida'?'→':'·')+' '+t(work(e.to_stage_id)?.label):t('Conexión');
  }
  function url(){
    const s=window.atlas.state,p=new URLSearchParams({scenario:s.scenario});
    if(s.mode!=='overview')p.set('view',s.mode);
    for(const [name,value,defaultValue]of [['pending',s.pending,false],['scope',s.neighborhood,false],['tour',s.tour,'all'],['grounds',s.foundation,'all'],['testament',s.testament,'all'],['q',s.search,'']])if(value!==defaultValue)p.set(name,String(value));
    const tab=tabs.get(key());if(tab)p.set('tab',tab);
    const path=s.selection?s.selection.type+'/'+encodeURIComponent(s.selection.id):'map';
    const language=new URLSearchParams(location.search);language.set('lang',window.AtlasI18n.getLanguage());
    return location.pathname+'?'+language.toString()+'#'+path+'?'+p.toString();
  }
  function saveEntry(){
    if(cursor<0||replaying||education())return;
    const entry=entries[cursor];entry.state=copyState();entry.viewport=viewport();entry.tab=tabs.get(key());
    const destination=url(),nav=history.state?.atlasNavigation;
    if(nav?.session===session&&nav.index===cursor&&location.pathname+location.search+location.hash===destination)return;
    history.replaceState({...history.state,atlasNavigation:{session,index:cursor}},'',destination);
  }
  function record(){
    const next=routeSignature();
    if(!replaying&&next!==signature){
      entries=entries.slice(0,cursor+1);entries.push({state:copyState(),viewport:viewport(),tab:tabs.get(key())});cursor=entries.length-1;
      if(cursor===0)history.replaceState({...history.state,atlasNavigation:{session,index:cursor}},'',url());
      else history.pushState({atlasNavigation:{session,index:cursor}},'',url());
    }else if(!replaying)saveEntry();
    signature=next;renderTrail();
  }
  function restore(index){
    if(index<0||index>=entries.length)return;
    replaying=true;cursor=index;const entry=entries[index];wantedTab=entry.tab||null;
    window.atlas.navigate(entry.state);
    const v=entry.viewport;
    q('#graph-scroll').scrollTo({left:v.x,top:v.y,behavior:'auto'});q('#detail-panel').scrollTop=v.detail;
    window.scrollTo({left:v.pageX,top:v.pageY,behavior:'auto'});
    signature=routeSignature();replaying=false;renderTrail();
  }
  function move(delta){if(cursor+delta>=0&&cursor+delta<entries.length){saveEntry();history.go(delta)}}
  function go(type,id){saveEntry();window.atlas.select(type,id,true);locate(false)}
  function home(){saveEntry();window.atlas.navigate({mode:'overview',selection:null,search:'',testament:'all',tour:'all',foundation:'all',neighborhood:false,pending:false,presentation:false,zoom:1});q('#graph-scroll').scrollTo({left:0,top:0});}
  function renderTrail(){
    q('#explore-back').disabled=cursor<=0;q('#explore-forward').disabled=cursor>=entries.length-1;
    const relevant=entries.slice(0,cursor+1).map((e,i)=>({e,i})).filter(({e},i,all)=>e.state.selection&&(i===all.length-1||title(e.state.selection)!==title(all[i+1]?.e.state.selection)));
    const recent=relevant.slice(-3);
    q('#explore-trail').innerHTML=`<button id="explore-home">${t('Mapa completo')}</button>${relevant.length>3?'<span aria-hidden="true">/ …</span>':''}${recent.map(({e,i})=>`<span aria-hidden="true">/</span><button data-history="${i}" title="${html(title(e.state.selection))}" ${i===cursor?'aria-current="page"':''}>${html(title(e.state.selection))}</button>`).join('')}`;
    q('#explore-home').addEventListener('click',home);
    qa('[data-history]',q('#explore-trail')).forEach(b=>b.addEventListener('click',()=>move(Number(b.dataset.history)-cursor)));
  }
  function relations(list,selection){
    const data=window.atlas.getData(),work=id=>data.stages.find(s=>s.id===id)?.work_id;
    const own=id=>selection.type==='stage'?id===selection.id:work(id)===selection.id;
    const parts=[['Antecedentes evaluados',list.filter(e=>own(e.to_stage_id)&&!own(e.from_stage_id))],['Textos receptores evaluados',list.filter(e=>own(e.from_stage_id)&&!own(e.to_stage_id))],['Dentro de este libro',list.filter(e=>own(e.from_stage_id)&&own(e.to_stage_id))]];
    return list.length?parts.filter(([,es])=>es.length).map(([label,es])=>`<section class="direction-section"><h3><span>${label}</span><small>${es.length}</small></h3>${es.map(relationButton).join('')}</section>`).join(''):'<p class="muted">No hay conexiones evaluadas registradas para este libro. Esto no prueba ausencia de acceso.</p>';
  }
  function organizeDetail(){
    const s=window.atlas.state;if(!s.selection)return;
    const panel=q('#detail-panel');if(q('.detail-tabs',panel))return;
    const prefix=[],sections=[];let current=null;
    for(const child of [...panel.children]){
      if(child.tagName==='H3'){current={name:child.dataset.section,nodes:[child]};sections.push(current)}
      else if(current)current.nodes.push(child);else prefix.push(child);
    }
    const groups=new Map(sections.map(section=>[section.name,section.nodes]));
    const append=(target,name)=>{for(const node of groups.get(name)||[])target.append(node)};
    const makePanel=()=>{const el=document.createElement('div');el.className='detail-tab-panel';el.setAttribute('role','tabpanel');return el};
    const panels=[makePanel(),makePanel(),makePanel()];let definitions;
    const data=window.atlas.getData(),selection=s.selection;
    if(selection.type==='book'){
      definitions=[['connections','Conexiones'],['stages','Etapas'],['sources','Fuentes']];
      const stages=bookStages(selection.id),ids=new Set(stages.map(stage=>stage.id)),evals=data.access_evaluations.filter(e=>e.scenario_id===s.scenario&&(ids.has(e.from_stage_id)||ids.has(e.to_stage_id)));
      panels[0].innerHTML=relations(evals,selection);append(panels[1],'Etapas del escenario');
      const refs=sourcesForClaims(stages.flatMap(stage=>[...stage.claim_ids,...(selectedDate(stage)?.claim_ids||[])]));
      panels[2].innerHTML='<h3>Fuentes de las etapas</h3>'+sourceLinks(refs)+(refs.length?'':'<p class="muted">Fuentes pendientes.</p>');
      const overview=document.createElement('p');overview.className='selection-overview';const admitted=evals.filter(e=>e.status==='admitida').length,pending=evals.filter(e=>e.status==='pendiente').length;overview.innerHTML=`<span>${stages.length} <span>${stages.length===1?'etapa':'etapas'}</span></span> · <span>${admitted} <span>${admitted===1?'admitida':'admitidas'}</span></span> · <span>${pending} <span>${pending===1?'pendiente':'pendientes'}</span></span>`;prefix.push(overview);
    }else if(selection.type==='stage'){
      definitions=[['summary','Resumen'],['connections','Conexiones'],['sources','Fuentes']];
      for(const name of ['Alcance','Fundamento de la datación','Atribución y actividad','Incertidumbres'])append(panels[0],name);
      const es=data.access_evaluations.filter(e=>e.scenario_id===s.scenario&&[e.from_stage_id,e.to_stage_id].includes(selection.id));
      panels[1].innerHTML=relations(es,selection);append(panels[2],'Fuentes de la etapa');
    }else{
      definitions=[['access','Acceso'],['evidence','Evidencia'],['context','Contexto']];
      for(const name of ['Por qué pudo conocer el antecedente','Supuestos de esta evaluación','Alcance de la conexión','Dependencia literaria','Límites'])append(panels[0],name);
      for(const name of ['Condiciones evaluadas','Líneas de evidencia'])append(panels[1],name);
      const endpoints=document.createElement('section');endpoints.className='connection-endpoints';endpoints.innerHTML='<h3>Etapas conectadas</h3>';
      // Keep existing stage buttons and their click listeners while reordering them.
      for(const button of qa(':scope > .stage-card',panel))endpoints.append(button);
      for(const group of panels)for(const button of qa('.stage-card',group))endpoints.append(button);
      panels[2].append(endpoints);
      for(const name of ['Resultado y alcance','Forma que pudo ser accesible','Vía y momento de acceso'])append(panels[2],name);
    }
    panel.replaceChildren(...prefix);
    const scenario=document.createElement('label');scenario.className='selection-scenario';scenario.innerHTML=`<span>Escenario histórico</span><select id="detail-scenario" aria-label="Escenario de la selección">${data.scenarios.map(item=>`<option value="${item.id}" ${item.id===s.scenario?'selected':''}>${html(item.label)}</option>`).join('')}</select>`;panel.append(scenario);
    q('#detail-scenario').addEventListener('change',event=>{q('#scenario').value=event.target.value;q('#scenario').dispatchEvent(new Event('change',{bubbles:true}))});
    const tools=document.createElement('div');tools.className='selection-tools';tools.innerHTML=`<button id="focus-context" aria-pressed="${s.neighborhood}">${s.neighborhood?'Ver contexto completo':'Solo su entorno'}</button><button id="selection-time">${s.mode==='overview'?'En el tiempo':'En el mapa'}</button><button id="locate-selection">Situar en mapa</button><button id="share-selection">Enlace</button>`;panel.append(tools);
    const tablist=document.createElement('div');tablist.className='detail-tabs';tablist.setAttribute('role','tablist');tablist.setAttribute('aria-label',t('Profundizar en la selección'));
    definitions.forEach(([id,label],index)=>{
      const button=document.createElement('button');button.type='button';button.id='detail-tab-'+id;button.dataset.tab=id;button.textContent=label;button.setAttribute('role','tab');button.setAttribute('aria-controls','detail-pane-'+id);
      panels[index].id='detail-pane-'+id;panels[index].setAttribute('aria-labelledby',button.id);tablist.append(button);
      button.addEventListener('click',()=>chooseTab(id,true));
      button.addEventListener('keydown',event=>{const keys=['ArrowLeft','ArrowRight','Home','End'];if(!keys.includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?definitions.length-1:(index+(event.key==='ArrowRight'?1:-1)+definitions.length)%definitions.length;chooseTab(definitions[next][0],true);q('#detail-tab-'+definitions[next][0]).focus()});
    });
    panel.append(tablist,...panels);
    // Generated directional cards use the same selectors as the documentary renderer.
    for(const container of [panels[0],panels[1],panels[2]]){
      qa('[data-edge]',container).forEach(button=>{if(selection.type==='edge')return;button.addEventListener('click',()=>go('edge',button.dataset.edge))});
    }
    q('#focus-context').addEventListener('click',()=>window.atlas.navigate({neighborhood:!s.neighborhood,search:'',testament:'all',tour:'all'}));
    q('#selection-time').addEventListener('click',()=>{window.atlas.navigate({mode:s.mode==='overview'?'stages':'overview',neighborhood:true,search:'',testament:'all',tour:'all',zoom:1});locate(true)});
    q('#locate-selection').addEventListener('click',()=>locate(true));q('#share-selection').addEventListener('click',share);
    chooseTab(wantedTab||tabs.get(key())||definitions[0][0],false);wantedTab=null;
    window.AtlasI18n.apply(panel);
  }
  function chooseTab(id,save){
    const buttons=qa('.detail-tabs [data-tab]');if(!buttons.length)return;
    if(!buttons.some(b=>b.dataset.tab===id))id=buttons[0].dataset.tab;
    tabs.set(key(),id);
    buttons.forEach(b=>{const selected=b.dataset.tab===id;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;q('#'+b.getAttribute('aria-controls')).hidden=!selected});
    if(save)saveEntry();
  }
  function renderFilters(){
    const s=window.atlas.state,items=[];
    if(s.search)items.push(['search','Búsqueda',s.search,'']);
    if(s.testament!=='all')items.push(['testament','Testamento',s.testament,'all']);
    if(s.tour!=='all')items.push(['tour','Recorrido',q('#tour option:checked').textContent,'all']);
    if(s.foundation!=='all')items.push(['foundation','Fundamento',q('#foundation option:checked').textContent,'all']);
    if(s.neighborhood)items.push(['neighborhood','Entorno de la selección','',false]);
    if(s.pending)items.push(['pending','Candidaturas visibles','',false]);
    const el=q('#filter-summary');el.hidden=!items.length;el.innerHTML=items.map(([key,label,value])=>`<button data-clear-filter="${key}"><span>${t(label)}${value?' · '+html(value):''}</span><span aria-hidden="true">×</span></button>`).join('');
    qa('[data-clear-filter]',el).forEach(button=>button.addEventListener('click',()=>{const item=items.find(([key])=>key===button.dataset.clearFilter);window.atlas.navigate({[item[0]]:item[3]})}));
  }
  function renderVisibility(){
    q('#selection-outside-view')?.remove();
    const s=window.atlas.state,selection=s.selection;if(!selection||!q('.selection-tools'))return;
    const data=window.atlas.getData(),stage=selection.type==='stage'?data.stages.find(stage=>stage.id===selection.id):null;
    const workId=stage?.work_id||selection.id;
    const target=selection.type==='edge'?q(`#graph [data-evaluation="${selection.id}"]`):s.mode==='overview'?q(`.overview-node[data-work="${workId}"]`):s.mode==='books'?q(`.graph-node[data-node-id="${workId}"]`):selection.type==='stage'?q(`.graph-node[data-node-id="${selection.id}"]`):bookStages(selection.id).some(stage=>q(`.graph-node[data-node-id="${stage.id}"]`));
    if(target)return;
    const note=document.createElement('div');note.id='selection-outside-view';note.className='selection-outside-view';note.innerHTML='<p>La selección no se representa en esta vista.</p><button id="reveal-selection">Mostrar su contexto</button>';q('.selection-tools').after(note);
    q('#reveal-selection').addEventListener('click',()=>{window.atlas.navigate({mode:'overview',search:'',testament:'all',tour:'all',foundation:'all',neighborhood:true});locate(true)});
    window.AtlasI18n.apply(note);
  }
  function locate(scrollPage){
    const s=window.atlas.state,selection=s.selection;if(!selection)return;
    const data=window.atlas.getData(),work=id=>data.stages.find(stage=>stage.id===id)?.work_id;
    const e=selection.type==='edge'?data.access_evaluations.find(e=>e.id===selection.id):null;
    let targets;
    if(s.mode==='overview'){
      const ids=e?[work(e.from_stage_id),work(e.to_stage_id)]:[selection.type==='stage'?work(selection.id):selection.id];
      targets=ids.map(id=>q(`.overview-node[data-work="${id}"] .book-circle`)).filter(Boolean);
    }else{
      const ids=e?[e.from_stage_id,e.to_stage_id]:selection.type==='book'?bookStages(selection.id).map(stage=>stage.id):[selection.id];
      targets=ids.map(id=>q(`.graph-node[data-node-id="${s.mode==='books'?work(id):id}"] rect`)).filter(Boolean);
    }
    if(!targets.length)return;
    const area=q('#graph-scroll'),r=area.getBoundingClientRect(),boxes=targets.map(el=>el.getBoundingClientRect());
    const x=boxes.reduce((sum,b)=>sum+b.x+b.width/2,0)/boxes.length,y=boxes.reduce((sum,b)=>sum+b.y+b.height/2,0)/boxes.length;
    area.scrollLeft+=x-r.left-area.clientWidth/2;
    if(s.mode!=='overview')area.scrollTop+=y-r.top-area.clientHeight/2;
    if(scrollPage){const panel=q('#detail-panel').getBoundingClientRect();const available=innerWidth<=640?Math.max(120,panel.top):innerHeight;window.scrollBy({top:y-available*.5,behavior:'auto'});}
    saveEntry();
  }
  function search(){
    const data=window.atlas.getData(),term=normalize(q('#finder-input').value);
    results=data.works.filter(w=>!term||normalize(t(w.label)+' '+w.label+' '+window.AtlasI18n.abbreviation(w.id)).includes(term)).sort((a,b)=>{
      const rank=w=>normalize(t(w.label))===term||normalize(window.AtlasI18n.abbreviation(w.id))===term?0:normalize(t(w.label)).startsWith(term)?1:2;
      return rank(a)-rank(b)||a.canonical_order-b.canonical_order;
    });resultIndex=0;
    q('#finder-count').textContent=format('{count} libros encontrados',{count:results.length});
    q('#finder-results').innerHTML=results.length?results.slice(0,8).map((w,i)=>`<button id="finder-option-${i}" role="option" tabindex="-1" data-result="${i}" aria-selected="${i===0}"><span class="finder-dot" style="background:${group(w).color}"></span><span><strong>${html(t(w.label))}</strong><small>${html(t(group(w).label))}</small></span><span class="finder-abbr">${html(window.AtlasI18n.abbreviation(w.id))}</span></button>`).join(''):'<p class="finder-empty">No aparece ningún libro con ese nombre. Prueba su abreviatura o abre el catálogo.</p>';
    qa('[data-result]').forEach(button=>button.addEventListener('click',()=>openResult(Number(button.dataset.result))));
    highlightResult();window.AtlasI18n.apply(q('#finder-results'));
  }
  function highlightResult(){
    const options=qa('#finder-results [role="option"]');options.forEach((el,i)=>el.setAttribute('aria-selected',String(i===resultIndex)));
    if(options[resultIndex])q('#finder-input').setAttribute('aria-activedescendant',options[resultIndex].id);else q('#finder-input').removeAttribute('aria-activedescendant');
  }
  function openResult(index){
    const work=results[index];if(!work)return;
    q('#finder-dialog').close();window.atlas.navigate({search:'',testament:'all',tour:'all',foundation:'all',neighborhood:false});go('book',work.id);locate(true);
  }
  function finder(){if(education())window.AtlasExperience.pause(false);q('#finder-input').value='';search();q('#finder-dialog').showModal();q('#finder-input').focus()}
  function share(){saveEntry();q('#share-url').value=location.href;q('#share-feedback').textContent='';q('#share-dialog').showModal();q('#share-url').select()}
  async function copyLink(){
    try{await navigator.clipboard.writeText(q('#share-url').value);q('#share-feedback').textContent=t('Enlace copiado.')}catch(error){q('#share-url').focus();q('#share-url').select();q('#share-feedback').textContent=t('Selecciona el enlace para copiarlo.')}
  }
  function parseLink(){
    if(!location.hash)return null;
    const data=window.atlas.getData(),[path,query]=location.hash.slice(1).split('?'),parts=path.split('/'),p=new URLSearchParams(query||'');
    try{
      const scenario=p.get('scenario')||window.atlas.state.scenario;
      if(!data.scenarios.some(s=>s.id===scenario))throw new Error();
      let selection=null;
      if(parts[0]!=='map'){
        const table={book:'works',stage:'stages',edge:'access_evaluations'}[parts[0]],id=decodeURIComponent(parts[1]||'');
        if(!table||!data[table].some(x=>x.id===id))throw new Error();selection={type:parts[0],id};
        if(selection.type==='edge'){const old=data.access_evaluations.find(e=>e.id===id),matching=data.access_evaluations.find(e=>e.scenario_id===scenario&&e.from_stage_id===old.from_stage_id&&e.to_stage_id===old.to_stage_id);if(!matching)throw new Error();selection.id=matching.id;}
      }
      const choice=(name,values,fallback)=>{const value=p.get(name);if(value&&!values.includes(value))throw new Error();return value||fallback};
      const candidate=selection?.type==='edge'&&data.access_evaluations.find(e=>e.id===selection.id).status==='pendiente';
      wantedTab=p.get('tab');
      return {scenario,selection,mode:choice('view',['overview','books','stages'],'overview'),foundation:choice('grounds',['all','inferred','reception'],'all'),tour:choice('tour',['all','reception','sirach','gospels'],'all'),testament:choice('testament',['all','AT','NT'],'all'),pending:candidate||p.get('pending')==='true',neighborhood:p.get('scope')==='true',search:(p.get('q')||'').slice(0,128),zoom:1,presentation:false,catalogueOpen:false};
    }catch(error){q('#free-notice').textContent=t('Este enlace no corresponde a un texto o escenario disponible. Puedes explorar el mapa completo.');return null;}
  }
  function onView(){
    if(!ready)return;
    document.body.classList.toggle('free-exploration',!education());
    if(education())return;
    const changed=entries[cursor]?.state.selection?.id!==window.atlas.state.selection?.id;
    organizeDetail();renderFilters();renderVisibility();record();
    if(changed&&!replaying&&innerWidth<=640&&window.atlas.state.mode==='overview')locate(true);
  }
  function init(){
    if(ready||!window.atlas)return;ready=true;document.body.classList.add('free-exploration');history.scrollRestoration='manual';
    for(const id of ['open-finder','finder-button'])q('#'+id).disabled=false;
    const notice=document.createElement('p');notice.id='free-notice';notice.setAttribute('role','status');q('#filter-summary').after(notice);
    document.addEventListener('atlas:view',onView);document.addEventListener('atlas:language',()=>{renderTrail();if(q('#finder-dialog').open)search()});
    q('#open-finder').addEventListener('click',finder);q('#finder-button').addEventListener('click',finder);
    qa('[data-entry-book]').forEach(b=>b.addEventListener('click',()=>{go('book',b.dataset.entryBook);locate(true)}));
    q('#explore-back').addEventListener('click',()=>move(-1));q('#explore-forward').addEventListener('click',()=>move(1));q('#share-copy').addEventListener('click',copyLink);
    q('#finder-input').addEventListener('input',search);
    q('#finder-input').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();openResult(resultIndex)}else if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();const n=Math.min(results.length,8);if(n){resultIndex=(resultIndex+(event.key==='ArrowDown'?1:-1)+n)%n;highlightResult()}}});
    addEventListener('keydown',event=>{const editing=event.target.closest?.('input,textarea,select,[contenteditable="true"]');if((event.key==='/'&&!editing||event.key.toLowerCase()==='k'&&(event.ctrlKey||event.metaKey))&&!q('dialog[open]')){event.preventDefault();finder()}});
    addEventListener('popstate',event=>{qa('dialog[open]').forEach(dialog=>dialog.close());if(education())window.AtlasExperience.pause(false);const nav=event.state?.atlasNavigation;if(nav?.session===session)restore(nav.index);else{const state=parseLink();if(state){replaying=true;window.atlas.navigate(state);replaying=false;entries=[];cursor=-1;signature='';record()}}});
    document.addEventListener('pointerdown',()=>saveEntry(),{capture:true});document.addEventListener('keydown',event=>{if(event.key==='Enter')saveEntry()},{capture:true});
    document.addEventListener('change',()=>{if(!education()){renderFilters();renderVisibility();record()}});
    document.addEventListener('click',()=>{if(!education()&&!replaying)saveEntry()});
    for(const el of [window,q('#graph-scroll'),q('#detail-panel')])el.addEventListener('scroll',()=>{if(cursor>=0&&!replaying&&!education())entries[cursor].viewport=viewport()},{passive:true});
    const linked=parseLink();if(linked)window.atlas.navigate(linked);else onView();
    window.AtlasExplore={go,home,showTab:id=>chooseTab(id,true),locate:()=>locate(true),getHistory:()=>({index:cursor,length:entries.length})};
  }
  document.addEventListener('atlas:ready',init);init();
})();
