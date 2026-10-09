'use strict';
const $ = (selector,root=document) => root.querySelector(selector);
const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
const esc = value => String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const normalize = value => String(value).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const NS = 'http://www.w3.org/2000/svg';
const state = {testament:'all',search:'',mode:'overview',foundation:'all',scenario:null,pending:false,zoom:1,selection:null,tour:'all',neighborhood:false,labels:true,catalogueOpen:false,presentation:false};
let db,tables,positions=new Map(),visibleNodes=[],shownEvaluations=[],toastTimer;
const kinds={composition:'Composición',collection:'Recopilación',redaction:'Redacción',revision:'Revisión',translation:'Traducción'};
const checkLabels={prior_existence:'Existencia previa',contextual_availability:'Disponibilidad y vía',linguistic_access:'Condiciones lingüísticas',access_before_reception_during_activity:'Acceso durante la actividad receptora'};
const statusLabels={admitida:'Acceso admitido',pendiente:'Candidatura pendiente',incompatible:'Incompatible en este escenario',sin_evaluar:'Sin evaluar'};
const dependenceLabels={supported:'Recepción identificada',proposed:'Dependencia propuesta',not_evaluated:'Uso efectivo sin evaluar',translation_attested:'Traducción atestiguada'};
const year = b => b ? b.era==='BCE' ? 1-b.year : b.year : null;
const yearLabel = b => b ? `${b.year} ${b.era==='BCE'?'a. C.':'d. C.'}` : 'Desconocido';
const axisYear = n => n<=0 ? `${1-n} a. C.` : `${n} d. C.`;
function dateLabel(d){
  if(!d)return 'Datación no delimitada';
  if(d.kind==='estimated_point')return `Hacia ${yearLabel(d.earliest)}`;
  if(d.earliest&&!d.latest)return `${d.earliest_inclusive?'Desde':'Después de'} ${yearLabel(d.earliest)} · límite final desconocido`;
  if(!d.earliest&&d.latest)return `${d.latest_inclusive?'Hasta':'Antes de'} ${yearLabel(d.latest)} · límite inicial desconocido`;
  if(d.earliest&&d.latest)return `${yearLabel(d.earliest)} – ${yearLabel(d.latest)}`;
  return 'Datación no delimitada';
}
function group(work){
  const n=work.canonical_order;
  if(n<=5)return {id:'torah',label:'Torá / Pentateuco',color:'#287b73'};
  if(n<=16)return {id:'history',label:'Tradiciones históricas',color:'#3b728d'};
  if(n<=21||[27,28,32].includes(n))return {id:'deut',label:'Deuterocanónicos y Ester',color:'#977135'};
  if(n<=28)return {id:'wisdom',label:'Poesía y sabiduría',color:'#775f97'};
  if(n<=46)return {id:'prophets',label:'Colecciones proféticas',color:'#547e5c'};
  if(n<=51)return {id:'gospels',label:'Evangelios y Hechos',color:'#34759a'};
  if(n<=64)return {id:'paul',label:'Correspondencia paulina',color:'#86638e'};
  return {id:'othernt',label:'Otros escritos cristianos',color:'#a16b55'};
}
function selectedScenario(){return tables.scenarios.get(state.scenario)}
function selectedDate(stage){
  const ids=new Set(selectedScenario().selected_date_ids);
  const choices=stage.date_ids.filter(id=>ids.has(id)).map(id=>tables.dates.get(id));
  return choices.find(d=>d.event==='composition')||choices.find(d=>d.event==='translation_completion')||choices.find(d=>d.event==='translation_activity')||choices[0];
}
function attribution(stage){
  const ids=new Set(selectedScenario().selected_attribution_ids);
  const a=stage.attribution_ids.map(id=>tables.attributions.get(id)).find(a=>ids.has(a.id));
  return a?tables.actors.get(a.actor_id):null;
}
function currentStages(){return selectedScenario().active_stage_ids.map(id=>tables.stages.get(id))}
function bookStages(id){return currentStages().filter(s=>s.work_id===id)}
function matchesFoundation(e){return state.foundation==='all'||state.foundation==='inferred'&&e.access_basis.route_certainty==='inferred'||state.foundation==='reception'&&['textual_reception','translation'].includes(e.access_basis.kind);}
function isInferred(e){return e.status==='admitida'&&e.access_basis.route_certainty==='inferred';}
function filteredStages(allowed){
  let stages=currentStages();
  const evals=db.access_evaluations.filter(e=>e.scenario_id===state.scenario&&matchesFoundation(e)&&(e.status==='admitida'||state.pending&&e.status==='pendiente'));
  let focus=new Set();
  if(state.neighborhood&&state.selection){
    if(state.selection.type==='edge'){const e=tables.access_evaluations.get(state.selection.id);focus=new Set([e.from_stage_id,e.to_stage_id])}
    else if(state.selection.type==='stage')focus.add(state.selection.id);
    else bookStages(state.selection.id).forEach(s=>focus.add(s.id));
  }else if(state.tour==='sirach')bookStages('book_sir').forEach(s=>focus.add(s.id));
  else if(state.tour==='gospels')stages.filter(s=>['book_mat','book_mrk','book_luk','book_jhn','book_act'].includes(s.work_id)).forEach(s=>focus.add(s.id));
  if(focus.size){const keep=new Set(focus);for(const e of evals)if(focus.has(e.from_stage_id)||focus.has(e.to_stage_id)){keep.add(e.from_stage_id);keep.add(e.to_stage_id)}stages=stages.filter(s=>keep.has(s.id));}
  else if(state.tour==='reception'){const keep=new Set(evals.flatMap(e=>[e.from_stage_id,e.to_stage_id]));stages=stages.filter(s=>keep.has(s.id));}
  return stages.filter(s=>allowed.has(s.work_id));
}
function matchingWorks(){
  return db.works.filter(w=>(state.testament==='all'||w.testament===state.testament)&&
    (!state.search||normalize(w.label+' '+window.AtlasI18n?.text(w.label)+' '+bookStages(w.id).map(s=>s.label+' '+window.AtlasI18n?.text(s.label)).join(' ')).includes(normalize(state.search))));
}
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,3500)}
function clearCatalogueFilters(){
  state.search='';state.testament='all';$('#search').value='';
  $$('[data-testament]').forEach(b=>{b.classList.toggle('active',b.dataset.testament==='all');b.setAttribute('aria-pressed',String(b.dataset.testament === 'all'));});
}
function makeSvg(tag,attrs={},text){const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;return el}
function renderCatalogue(){
  const matches=matchingWorks();$('#book-count').textContent=matches.length;
  let lastGroup='';
  $('#book-list').innerHTML=matches.map(w=>{
    const g=group(w),heading=g.id!==lastGroup?`<div class="book-group">${esc(g.label)}</div>`:'';lastGroup=g.id;
    const selected=state.selection?.type==='book'&&state.selection.id===w.id||state.selection?.type==='stage'&&tables.stages.get(state.selection.id)?.work_id===w.id;
    return heading+`<button class="book-item${selected?' selected':''}" data-book="${esc(w.id)}"><span><i class="book-dot" style="background:${g.color}"></i>${esc(w.label)}</span><small>${bookStages(w.id).length||'—'}</small></button>`;
  }).join('');
  $$('.book-item').forEach(b=>b.addEventListener('click',()=>select('book',b.dataset.book,true)));
  window.AtlasI18n?.apply($('.catalogue'));
}
function renderGraph(){
  syncView();
  if(state.mode==='overview'){renderOverview();return;}
  $('#graph').style.width='';$('#graph').style.height='';
  const works=matchingWorks(),allowed=new Set(works.map(w=>w.id)),stages=filteredStages(allowed),visibleWorks=new Set(stages.map(s=>s.work_id));
  const stageByWork=new Map(works.map(w=>[w.id,stages.filter(s=>s.work_id===w.id)]));
  visibleNodes=state.mode==='stages'?stages.map(s=>({id:s.id,work:tables.works.get(s.work_id),label:s.label,stage:s,date:selectedDate(s)})):
    works.filter(w=>stageByWork.get(w.id).length).map(w=>{
      const ss=stageByWork.get(w.id),dates=ss.map(selectedDate).filter(Boolean),first=dates.filter(d=>d.earliest).sort((a,b)=>year(a.earliest)-year(b.earliest))[0],last=dates.filter(d=>d.latest).sort((a,b)=>year(b.latest)-year(a.latest))[0];
      return {id:w.id,work:w,label:w.label,stage:ss[0],date:dates.length?{...dates[0],kind:'estimated_interval',earliest:dates.some(d=>!d.earliest)?null:first?.earliest??null,latest:dates.some(d=>!d.latest)?null:last?.latest??null}:undefined};
    });
  const viewStages=new Set(stages.map(s=>s.id));
  shownEvaluations=db.access_evaluations.filter(e=>e.scenario_id===state.scenario&&matchesFoundation(e)&&viewStages.has(e.from_stage_id)&&viewStages.has(e.to_stage_id)&&
    (e.status==='admitida'||state.pending&&e.status==='pendiente'));
  const admitted=shownEvaluations.filter(e=>e.status==='admitida'&&(state.mode==='stages'||tables.stages.get(e.from_stage_id).work_id!==tables.stages.get(e.to_stage_id).work_id)).length;
  $('#stats').innerHTML=`<strong>${visibleWorks.size}</strong> <span>${visibleWorks.size===1?'libro':'libros'}</span> · <strong>${stages.length}</strong> <span>${stages.length===1?'etapa':'etapas'}</span><br><strong>${admitted}</strong> <span>${admitted===1?'conexión admitida':'conexiones admitidas'}</span>`;
  $('#zoom-value').textContent=Math.round(state.zoom*100)+' %';
  $('#graph-empty').hidden=visibleNodes.length>0;
  const allDates=currentStages().map(selectedDate).filter(Boolean),bounds=allDates.flatMap(d=>[year(d.earliest),year(d.latest)]).filter(n=>n!==null);
  const min=Math.min(-799,...bounds)-40,max=Math.max(160,...bounds)+35;
  const viewport=Math.max(600,$('#graph-scroll').clientWidth),width=Math.max(viewport,860)*state.zoom,left=270,right=185,plot=width-left-right;
  const x=n=>left+(n-min)/(max-min)*plot;
  const rowHeight=64,headingHeight=30;let y=24,last='';positions=new Map();
  const graph=$('#graph');graph.replaceChildren();graph.setAttribute('width',width);
  const defs=makeSvg('defs');
  for(const [id,color]of [['arrow','#a56816'],['selected-arrow','#185d84']]){
    const marker=makeSvg('marker',{id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'});marker.append(makeSvg('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:color}));defs.append(marker);
  }
  graph.append(defs);
  const background=makeSvg('g'),edges=makeSvg('g'),nodes=makeSvg('g');graph.append(background,edges,nodes);
  let lastTickX=-Infinity;const tickStep=state.zoom>=1.75?50:100;
  const axis=makeSvg('svg',{width,height:44});
  axis.append(makeSvg('text',{x:16,y:28,fill:'#607282','font-size':12,'font-family':'system-ui'},'MARCO TEMPORAL'));
  axis.append(makeSvg('text',{x:184,y:28,fill:'#8795a0','font-size':10,'font-family':'system-ui'},'SIN DATAR'));
  axis.append(makeSvg('text',{x:width-right+14,y:28,fill:'#607282','font-size':11,'font-family':'system-ui'},'DATACIÓN PROPUESTA'));
  const ticks=[];
  const candidates=[];for(let by=Math.ceil(Math.abs(min)/tickStep)*tickStep;by>=tickStep;by-=tickStep)candidates.push(1-by);for(let cy=tickStep;cy<=max;cy+=tickStep)candidates.push(cy);
  for(const n of candidates){if(n<min||n>max)continue;const xx=x(n);if(xx-lastTickX<60)continue;lastTickX=xx;ticks.push({n,xx});axis.append(makeSvg('text',{x:xx,y:28,fill:'#607282','font-size':12,'text-anchor':'middle','font-family':'system-ui'},axisYear(n)));}
  $('#axis-sticky').replaceChildren(axis);$('#axis-sticky').style.width=width+'px';
  for(const n of visibleNodes){
    const g=group(n.work);if(g.id!==last){background.append(makeSvg('text',{x:16,y:y+16,fill:g.color,'font-size':12,'font-weight':650,'letter-spacing':'.7','font-family':'system-ui'},g.label.toUpperCase()));y+=headingHeight;last=g.id;}
    const lo=year(n.date?.earliest),hi=year(n.date?.latest);
    const start=lo!==null?x(lo):hi!==null?Math.max(left,x(hi)-70):185;
    const end=hi!==null?x(hi):lo!==null?Math.min(width-right,start+75):250;
    positions.set(n.id,{x1:start,x2:Math.max(start+12,end),y:y+23,node:n});y+=rowHeight;
  }
  const height=Math.max(380,y+35);graph.setAttribute('height',height);graph.setAttribute('viewBox',`0 0 ${width} ${height}`);
  background.prepend(makeSvg('rect',{width,height,fill:'#ffffff'}),makeSvg('rect',{x:175,y:0,width:80,height,fill:'#f6f8fa'}),makeSvg('line',{x1:width-right+6,x2:width-right+6,y1:0,y2:height,stroke:'#edf1f4','stroke-width':1}));
  for(const {xx}of ticks)background.append(makeSvg('line',{x1:xx,x2:xx,y1:0,y2:height,stroke:'#edf1f4','stroke-width':1}));
  const selectedStage=state.selection?.type==='stage'?state.selection.id:null,selectedBook=state.selection?.type==='book'?state.selection.id:selectedStage?tables.stages.get(selectedStage).work_id:null;
  const selectedEdge=state.selection?.type==='edge'?state.selection.id:null;
  for(const e of shownEvaluations){
    const aKey=state.mode==='books'?tables.stages.get(e.from_stage_id).work_id:e.from_stage_id,bKey=state.mode==='books'?tables.stages.get(e.to_stage_id).work_id:e.to_stage_id;
    if(aKey===bKey)continue;
    const a=positions.get(aKey),b=positions.get(bKey);if(!a||!b)continue;
    const active=selectedEdge===e.id||selectedStage&&[e.from_stage_id,e.to_stage_id].includes(selectedStage)||selectedBook&&[a.node.work.id,b.node.work.id].includes(selectedBook);
    const from=Math.min(a.x2,width-right),to=b.x1,dx=Math.max(45,Math.abs(to-from)*.35),path=`M ${from} ${a.y} C ${from+dx} ${a.y}, ${to-dx} ${b.y}, ${to} ${b.y}`;
    edges.append(makeSvg('path',{d:path,fill:'none',stroke:active?'#185d84':e.status==='admitida'?'#a56816':'#9daab4','stroke-width':active?2.5:1.4,opacity:active?1:(selectedEdge||selectedBook)?0.23:0.6,
      'stroke-dasharray':e.status!=='admitida'?'5 5':isInferred(e)?'2 3':'','marker-end':e.status==='admitida'?`url(#${active?'selected-arrow':'arrow'})`:''}));
    const hit=makeSvg('path',{d:path,class:'edge-hit','data-evaluation':e.id,tabindex:0,role:'button','aria-label':`${window.AtlasI18n.text(a.node.work.label)} → ${window.AtlasI18n.text(b.node.work.label)}: ${window.AtlasI18n.text(statusLabels[e.status])}`});
    hit.addEventListener('click',()=>select('edge',e.id));hit.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();select('edge',e.id)}});edges.append(hit);
  }
  for(const [id,p]of positions){
    const {node:n,x1,x2,y:yy}=p,g=group(n.work),active=id===state.selection?.id||selectedBook===n.work.id;
    background.append(makeSvg('line',{x1:left,x2:width-right,y1:yy,y2:yy,stroke:'#e7edf1','stroke-width':1}));
    if(active)background.append(makeSvg('rect',{x:0,y:yy-28,width:width,height:56,fill:'#eaf2f8',opacity:.65}));
    const item=makeSvg('g',{class:'graph-node','data-node-id':id,tabindex:0,role:'button','aria-label':`${window.AtlasI18n.text(n.work.label)}: ${window.AtlasI18n.text(n.label)}. ${window.AtlasI18n.text(dateLabel(n.date))}`});
    item.append(makeSvg('text',{x:16,y:yy-3,fill:active?'#185d84':'#132639','font-size':14,'font-weight':active?650:550,'font-family':'system-ui'},n.work.label));
    const sub=state.mode==='stages'?`${kinds[n.stage.kind]}${bookStages(n.work.id).length>1?' · '+(bookStages(n.work.id).findIndex(s=>s.id===n.stage.id)+1):''}`:bookStages(n.work.id).length+' etapa(s)';
    item.append(makeSvg('text',{x:16,y:yy+15,fill:'#70818e','font-size':12,'font-family':'system-ui'},sub));
    const dated=Boolean(n.date?.earliest||n.date?.latest);
    item.append(makeSvg('rect',{x:x1,y:yy-10,width:Math.max(12,x2-x1),height:20,rx:5,fill:dated?g.color:'#e0e6eb',opacity:dated?0.74:1,stroke:active?g.color:'none','stroke-width':2}));
    if(!n.date?.earliest||!n.date?.latest)item.append(makeSvg('line',{x1:x1,x2:x2,y1:yy,y2:yy,stroke:dated?'#fff':'#8795a0','stroke-width':1.4,'stroke-dasharray':'3 4'}));
    item.append(makeSvg('text',{x:width-right+14,y:yy+4,fill:'#637786','font-size':11,'font-family':'system-ui'},n.date?dateLabel(n.date).replace(' · límite final desconocido','…').replace(' · límite inicial desconocido','…'):'Fecha sin delimitar'));
    item.addEventListener('click',()=>select(state.mode==='books'?'book':'stage',id));
    item.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();select(state.mode==='books'?'book':'stage',id)}});nodes.append(item);
  }
  $('#graph-notice').textContent=state.mode==='books'?'Cada banda resume las etapas seleccionadas del libro. Las flechas conservan el alcance de sus evaluaciones.':'Bandas de composición propuesta; conectores esquemáticos, sin fechar el momento exacto de acceso. Carriles agrupados para la lectura.';
  window.AtlasI18n?.apply($('.graph-area'));
}
function sourcesForClaims(ids){
  const refs=[];for(const id of ids){const c=tables.claims.get(id);if(!c)continue;for(const eid of c.evidence_ids){const e=tables.evidence.get(eid);for(const cite of e.citations)refs.push(cite);}}
  return [...new Map(refs.map(r=>[r.source_id+'|'+r.locator,r])).values()];
}
function sourceLinks(refs){return refs.map(c=>{const s=tables.sources.get(c.source_id);return s?`<a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}<br><span class="muted">${esc(c.locator)}</span></a>`:''}).join('')}
function stageButton(s){return `<button class="stage-card" data-stage="${esc(s.id)}">${esc(s.label)}<small>${esc(dateLabel(selectedDate(s)))}</small></button>`}
function relationButton(e){const a=tables.stages.get(e.from_stage_id),b=tables.stages.get(e.to_stage_id);return `<button class="relation-card" data-edge="${esc(e.id)}"><span>${esc(tables.works.get(a.work_id).label)}</span> → <span>${esc(tables.works.get(b.work_id).label)}</span><small><span>${esc(statusLabels[e.status])}</span> · <span>${esc(e.access_basis.label)}</span><br><span>${esc(e.scope)}</span></small></button>`}
function bindDetail(){
  if(state.mode==='overview'){
    const close=document.createElement('button');close.className='detail-dismiss';close.id='detail-dismiss';close.setAttribute('aria-label',window.AtlasI18n.text('Volver al mapa'));close.innerHTML='<span>Volver al mapa</span><span aria-hidden="true">×</span>';
    close.addEventListener('click',dismissOverviewSelection);$('#detail-panel').prepend(close);
  }
  $$('[data-stage]',$('#detail-panel')).forEach(b=>b.addEventListener('click',()=>select('stage',b.dataset.stage,true)));
  $$('[data-book]',$('#detail-panel')).forEach(b=>b.addEventListener('click',()=>select('book',b.dataset.book,true)));
  $$('[data-edge]',$('#detail-panel')).forEach(b=>b.addEventListener('click',()=>select('edge',b.dataset.edge)));
}
function renderDetail(){
  if(!state.selection)return;
  const panel=$('#detail-panel'),{type,id}=state.selection;
  if(type==='book'){
    const w=tables.works.get(id),ss=bookStages(id),es=db.access_evaluations.filter(e=>e.scenario_id===state.scenario&&[e.from_stage_id,e.to_stage_id].some(sid=>tables.stages.get(sid).work_id===id));
    panel.innerHTML=`<p class="eyebrow">${esc(group(w).label)}</p><h2>${esc(w.label)}</h2><div class="detail-meta"><span class="tag">${w.testament==='AT'?'Antiguo':'Nuevo'} Testamento</span>${w.deuterocanonical_book?'<span class="tag gold">Deuterocanónico</span>':''}</div>${w.scope_notes?`<p>${esc(w.scope_notes)}</p>`:''}<h3>Etapas del escenario</h3>${ss.length?ss.map(stageButton).join(''):'<p class="muted">Etapas aún sin registrar.</p>'}<h3>Evaluaciones de acceso</h3>${es.length?es.map(relationButton).join(''):'<p class="muted">No hay conexiones evaluadas registradas para este libro. Esto no prueba ausencia de acceso.</p>'}`;
  }else if(type==='stage'){
    const s=tables.stages.get(id),w=tables.works.get(s.work_id),actor=attribution(s),date=selectedDate(s),contexts=s.context_ids.map(id=>tables.contexts.get(id));
    const es=db.access_evaluations.filter(e=>e.scenario_id===state.scenario&&[e.from_stage_id,e.to_stage_id].includes(id));
    const selectedClaims=new Set(selectedScenario().selected_claim_ids),claims=s.claim_ids.filter(id=>selectedClaims.has(id)).map(id=>tables.claims.get(id));
    panel.innerHTML=`<button class="back-link" data-book="${esc(w.id)}">Ver ${esc(w.label)}</button><p class="eyebrow">ETAPA TEXTUAL</p><h2>${esc(s.label)}</h2><div class="detail-meta"><span class="tag">${esc(kinds[s.kind])}</span><span class="tag">Hipótesis de trabajo</span></div><dl class="detail-kv"><dt>Responsable</dt><dd>${esc(actor?.label||'Desconocido')}</dd><dt>Datación</dt><dd>${esc(dateLabel(date))}</dd><dt>Lengua</dt><dd>${esc(s.languages.map(l=>({he:'Hebreo',el:'Griego',arc:'Arameo'}[l]||l)).join(', ')||'Sin determinar')}</dd><dt>Contexto</dt><dd>${esc(contexts.map(c=>c.place||'Lugar desconocido').join(', ')||'Sin determinar')}</dd></dl><h3>Alcance</h3><p>${esc(s.scope)}</p>${s.notes?`<p class="muted">${esc(s.notes)}</p>`:''}${date?.notes?`<h3>Fundamento de la datación</h3><p>${esc(date.notes)}</p>`:''}${actor?.notes?`<h3>Atribución y actividad</h3><p>${esc(actor.notes)}</p>`:''}${claims.some(c=>c.counterarguments.length)?'<h3>Incertidumbres</h3><ul>'+[...new Set(claims.flatMap(c=>c.counterarguments))].map(a=>`<li>${esc(a)}</li>`).join('')+'</ul>':''}<h3>Fuentes de la etapa</h3>${sourceLinks(sourcesForClaims([...s.claim_ids,...(date?.claim_ids||[])]))||'<p class="muted">Fuentes pendientes.</p>'}<h3>Conexiones evaluadas</h3>${es.map(relationButton).join('')||'<p class="muted">Sin evaluaciones registradas.</p>'}`;
  }else{
    const e=tables.access_evaluations.get(id),a=tables.stages.get(e.from_stage_id),b=tables.stages.get(e.to_stage_id),form=tables.forms.get(e.source_form_id);
    panel.innerHTML=`<p class="eyebrow">EVALUACIÓN DE ACCESO</p><h2><span>${esc(tables.works.get(a.work_id).label)}</span> → <span>${esc(tables.works.get(b.work_id).label)}</span></h2><div class="detail-meta"><span class="tag ${e.status==='admitida'?'gold':'pending'}">${esc(statusLabels[e.status])}</span></div><h3>Por qué pudo conocer el antecedente</h3><div class="status-box">${esc(e.access_basis.reason)}</div><div class="detail-meta"><span class="tag">${esc(e.access_basis.label)}</span><span class="tag">${esc({attested:'Vía atestiguada',inferred:'Vía inferida',unknown:'Canal concreto desconocido'}[e.access_basis.route_certainty])}</span></div>${e.access_basis.assumptions.length?'<h3>Supuestos de esta evaluación</h3><ul>'+e.access_basis.assumptions.map(a=>`<li>${esc(a)}</li>`).join('')+'</ul>':''}${stageButton(a)}${stageButton(b)}<h3>Resultado y alcance</h3><p>${esc(e.justification)}</p><h3>Forma que pudo ser accesible</h3><p>${esc(form.scope)}</p><h3>Vía y momento de acceso</h3><p>${esc(e.route)}</p><p class="muted">${esc(e.access_time_description)}</p><h3>Condiciones evaluadas</h3><dl class="detail-kv">${Object.entries(e.checks).map(([k,v])=>`<dt>${esc(checkLabels[k])}</dt><dd>${esc({supported:'Respaldada',uncertain:'Incierta',incompatible:'Incompatible',not_evaluated:'Sin evaluar'}[v])}</dd>`).join('')}</dl><h3>Líneas de evidencia</h3>${e.evidence_lines.map(line=>`<div class="evidence-block"><span>${esc(line.contribution)}</span>${line.evidence_ids.map(id=>{const ev=tables.evidence.get(id);return `<p class="muted">${esc(ev.summary)}</p>${sourceLinks(ev.citations)}`}).join('')}</div>`).join('')}<p class="muted">${esc(e.independence_rationale)}</p><h3>Alcance de la conexión</h3><p>${esc(e.scope)}</p><h3>Dependencia literaria</h3><div class="detail-meta"><span class="tag">${esc(dependenceLabels[e.dependence.status])}</span></div><p>${esc(e.dependence.notes)}</p><h3>Límites</h3><ul>${e.limitations.map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`;
  }
  $$('h3',panel).forEach(heading=>heading.dataset.section=heading.textContent);
  bindDetail();window.AtlasI18n?.apply(panel);
}
function select(type,id,focus=false){
  const table={book:'works',stage:'stages',edge:'access_evaluations'}[type];if(!table||!tables[table].has(id))throw new Error('Selección desconocida.');
  if(type==='edge'){
    let assessment=tables.access_evaluations.get(id);
    if(assessment.scenario_id!==state.scenario){assessment=db.access_evaluations.find(e=>e.scenario_id===state.scenario&&e.from_stage_id===assessment.from_stage_id&&e.to_stage_id===assessment.to_stage_id);if(!assessment)throw new Error('Evaluación no disponible en este escenario.');id=assessment.id;}
    if(assessment.status==='pendiente'){state.pending=true;$('#show-pending').checked=true;}
  }
  const workId=type==='book'?id:type==='stage'?tables.stages.get(id).work_id:null;
  if(focus&&workId&&state.tour!=='all'&&!visibleNodes.some(n=>n.work.id===workId)){state.tour='all';$('#tour').value='all';}
  state.selection={type,id};if(state.mode==='overview'){state.catalogueOpen=false;}render();
  if(state.mode==='overview')$('#detail-dismiss')?.focus({preventScroll:true});
  if(focus&&state.mode!=='overview'){let pos=positions.get(id);if(!pos&&type==='book')pos=positions.get(bookStages(id)[0]?.id);if(pos)$('#graph-scroll').scrollTo({top:Math.max(0,pos.y-100)});}
  if(state.mode!=='overview'&&innerWidth<1000&&focus)$('#detail-panel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function render(){renderCatalogue();renderGraph();renderDetail();document.dispatchEvent(new Event('atlas:view'))}
// Shared navigation keeps the map, controls and guided exploration in sync.
function navigate(patch){
  Object.assign(state,patch);
  if(!state.selection)$('#detail-panel').innerHTML='<div class="detail-placeholder"><p class="eyebrow">UNA RECONSTRUCCIÓN ABIERTA</p><h2>Un texto, varias historias.</h2><p>Selecciona un libro, una etapa o una conexión para consultar las fechas, las atribuciones y el fundamento del acceso.</p></div>';
  for(const [id,key]of [['search','search'],['tour','tour'],['foundation','foundation'],['scenario','scenario']])$('#'+id).value=state[key];
  for(const [id,key]of [['show-pending','pending'],['show-labels','labels'],['neighborhood','neighborhood']])$('#'+id).checked=state[key];
  for(const name of ['mode','testament'])$$('[data-'+name+']').forEach(b=>{const active=b.dataset[name]===state[name];b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  render();
}
function download(name,content,mime){const blob=content instanceof Blob?content:new Blob([content],{type:mime});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
function exportSvg(){
  if(state.mode==='overview')return exportOverviewSvg();
  const source=$('#graph').cloneNode(true),width=Number(source.getAttribute('width')),height=Number(source.getAttribute('height'));
  source.setAttribute('xmlns',NS);source.setAttribute('height',height+135);source.setAttribute('viewBox',`0 0 ${width} ${height+135}`);
  source.querySelectorAll('.edge-hit').forEach(p=>p.remove());
  const original=makeSvg('g',{transform:'translate(0 95)'});while(source.firstChild)original.append(source.firstChild);source.append(makeSvg('rect',{width,height:height+135,fill:'white'}),original);
  source.append(makeSvg('text',{x:16,y:28,fill:'#132639','font-size':20,'font-weight':600,'font-family':'system-ui'},'Atlas textual · Biblia católica'));
  source.append(makeSvg('text',{x:16,y:51,fill:'#5d6d7b','font-size':13,'font-family':'system-ui'},selectedScenario().label));
  source.append(makeSvg('text',{x:16,y:71,fill:'#5d6d7b','font-size':12,'font-family':'system-ui'},'Flechas: acceso respaldado. Flechas punteadas: inferencias con supuestos. Líneas sin flecha: candidaturas. Bandas: dataciones propuestas.'));
  for(const child of $('#axis-sticky svg').childNodes){const el=child.cloneNode(true);if(el.getAttribute?.('y'))el.setAttribute('y',Number(el.getAttribute('y'))+60);source.append(el)}
  source.append(makeSvg('text',{x:16,y:height+125,fill:'#5d6d7b','font-size':12,'font-family':'system-ui'},'Conectores esquemáticos: no fechan el acceso. La ausencia de flecha no demuestra imposibilidad.'));
  window.AtlasI18n?.apply(source);return new XMLSerializer().serializeToString(source);
}
function setupEvents(){
  $('#foundation').addEventListener('change',e=>{state.foundation=e.target.value;render();});
  $('#catalogue-toggle').addEventListener('click',()=>{state.catalogueOpen=!state.catalogueOpen;syncView();if(state.catalogueOpen)$('#search').focus();});
  $('#catalogue-close').addEventListener('click',()=>{state.catalogueOpen=false;syncView();$('#catalogue-toggle').focus();});
  $('#show-labels').addEventListener('change',e=>{state.labels=e.target.checked;renderGraph();});
  $('#zoom-fit').addEventListener('click',()=>{state.zoom=1;renderGraph();$('#graph-scroll').scrollTo({top:0,left:0});});
  $('#presentation').addEventListener('click',()=>{state.presentation=!state.presentation;state.zoom=1;renderGraph();});
  setupOverviewPan();
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')){if(state.mode==='overview'&&state.selection){dismissOverviewSelection();return;}if(state.catalogueOpen){state.catalogueOpen=false;syncView();$('#catalogue-toggle').focus();return;}if(state.presentation){state.presentation=false;state.zoom=1;}else{state.selection=null;}render();}});
  $('#search').addEventListener('input',e=>{state.search=e.target.value;render()});
  $$('[data-testament]').forEach(button=>button.addEventListener('click',()=>{state.testament=button.dataset.testament;$$('[data-testament]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button)});render()}));
  $$('[data-mode]').forEach(button=>button.addEventListener('click',()=>{state.mode=button.dataset.mode;state.presentation=false;state.zoom=1;state.catalogueOpen=false;$('#graph-scroll').scrollTo({top:0,left:0});$$('[data-mode]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button)});render()}));
  $('#scenario').addEventListener('change',event=>{
    const previous=state.selection?.type==='edge'?tables.access_evaluations.get(state.selection.id):null;
    state.scenario=event.target.value;
    if(previous){const next=db.access_evaluations.find(e=>e.scenario_id===state.scenario&&e.from_stage_id===previous.from_stage_id&&e.to_stage_id===previous.to_stage_id);state.selection=next?{type:'edge',id:next.id}:null;}
    render();
    if(!state.selection)$('#detail-panel').innerHTML='<p class="muted">Selecciona una etapa para consultar este escenario.</p>';
    window.AtlasI18n?.apply($('#detail-panel'));
  });
  $('#show-pending').addEventListener('change',e=>{state.pending=e.target.checked;renderGraph()});
  $('#reset').addEventListener('click',()=>{state.selection=null;state.catalogueOpen=false;state.foundation='all';$('#foundation').value='all';state.search='';state.testament='all';state.tour='all';state.neighborhood=false;$('#search').value='';$('#tour').value='all';$('#neighborhood').checked=false;$$('[data-testament]').forEach(b=>{b.classList.toggle('active',b.dataset.testament==='all');b.setAttribute('aria-pressed',b.dataset.testament==='all')});state.zoom=1;render();$('#graph-scroll').scrollTo({top:0,left:0});$('#detail-panel').innerHTML='<div class="detail-placeholder"><p class="eyebrow">EXPLORAR EL CORPUS</p><h2>La historia permanece abierta.</h2><p>Selecciona una etapa o una conexión para consultar su evidencia.</p><button class="primary" id="pilot-focus">Explorar Eclesiástico</button></div>';$('#pilot-focus').addEventListener('click',()=>select('book','book_sir',true));window.AtlasI18n?.apply($('#detail-panel'))});
  $('#tour').addEventListener('change',e=>{state.tour=e.target.value;state.neighborhood=false;state.selection=null;clearCatalogueFilters();$('#neighborhood').checked=false;
    if(state.tour==='sirach')select('book','book_sir');else{render();$('#detail-panel').innerHTML='<p class="muted">Selecciona una etapa o una conexión para consultar su evidencia.</p>';window.AtlasI18n?.apply($('#detail-panel'))}
    $('#graph-scroll').scrollTo({top:0,left:0});});
  $('#neighborhood').addEventListener('change',e=>{state.neighborhood=e.target.checked;if(state.neighborhood&&state.selection)clearCatalogueFilters();render();$('#graph-scroll').scrollTo({top:0,left:0})});
  $('#zoom-in').addEventListener('click',()=>{changeZoom(.25)});$('#zoom-out').addEventListener('click',()=>{changeZoom(-.25)});
  $('#graph-scroll').addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();changeZoom(e.deltaY<0?.1:-.1)}},{passive:false});
  $('#pilot-focus').addEventListener('click',()=>{clearCatalogueFilters();state.tour='sirach';$('#tour').value='sirach';select('book','book_sir',true)});
  for(const name of ['method','export'])$(`#${name}-button`).addEventListener('click',()=>{$(`#${name}-dialog`).showModal()});
  $$('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  $$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}}));
  $('#download-json').addEventListener('click',()=>download('atlas-biblico-registro.json',JSON.stringify(db,null,2),'application/json'));
  $('#download-svg').addEventListener('click',()=>download('atlas-biblico-grafo.svg',exportSvg(),'image/svg+xml'));
  $('#download-csv').addEventListener('click',()=>{
    const rows=[['origen','destino','escenario','estado','forma_accesible','alcance','via','justificacion','fundamento','supuestos','certeza_via'],...db.access_evaluations.map(e=>[tables.stages.get(e.from_stage_id).label,tables.stages.get(e.to_stage_id).label,tables.scenarios.get(e.scenario_id).label,e.status,e.source_form_id,e.scope,e.route,e.justification,e.access_basis.kind,e.access_basis.assumptions.join(' | '),e.access_basis.route_certainty])];
    download('atlas-biblico-evaluaciones.csv','\uFEFF'+rows.map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(',')).join('\r\n'),'text/csv;charset=utf-8');
  });
  $('#download-png').addEventListener('click',async()=>{
    const button=$('#download-png');button.disabled=true;try{
      const blob=new Blob([exportSvg()],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});
      const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));URL.revokeObjectURL(url);if(!png)throw new Error('No se pudo generar la imagen.');download('atlas-biblico-grafo.png',png,'image/png');
    }catch(error){toast('No se pudo generar el PNG. Puedes descargar el SVG.')}finally{button.disabled=false}
  });
  let timer;addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(renderGraph,150)});
}
function renderMethod(){
  const sourceCount=db.sources.length,stageCount=db.stages.length;
  $('#method-content').innerHTML=`<p>Una conexión A → B se admite cuando una forma pertinente de A era presumiblemente accesible al responsable de B antes de componer la parte estudiada de B.</p><h3>Evidencia convergente</h3><p>Se requieren al menos dos líneas con fundamentos distinguibles, al menos una específica del vínculo, y una explicación de su convergencia. La anterioridad cronológica y la semejanza temática por sí solas no admiten una flecha.</p><ul><li>Existencia previa del contenido pertinente.</li><li>Disponibilidad y vía plausible de acceso.</li><li>Condiciones lingüísticas pertinentes.</li><li>Acceso durante la actividad del responsable, antes de la composición receptora.</li></ul><h3>Justificaciones plausibles de acceso</h3><p>Una cita es una evidencia posible, no un requisito. También se evalúan conocimiento por composición propia, circulación de fuentes escritas, continuidad editorial y disponibilidad de materiales para un recopilador. Cada inferencia declara sus supuestos y se limita a una forma pertinente durante la actividad receptora. No se exige identificar el manuscrito exacto; tampoco se admite por mera anterioridad o semejanza temática.</p><h3>Qué representa cada elemento</h3><p>En la vista general, cada círculo representa un libro; las constelaciones agrupan familias del corpus, sin representar fechas, lugares ni contactos entre comunidades. Las líneas conservan las evaluaciones entre etapas: el acceso se limita al contenido especificado, y un bucle señala transmisión dentro de un libro. Las vistas temporales muestran etapas o libros; las bandas son estimaciones, no duraciones exactas de escritura. Los carriles agrupan el corpus para facilitar la lectura; compartir carril no demuestra contacto histórico. Los conectores no fechan el acceso. Las candidaturas pendientes se muestran sin punta de flecha.</p><h3>Escenarios e incertidumbre</h3><p>Cada escenario selecciona atribuciones y dataciones compatibles. Una admisión bajo una hipótesis no se convierte en una certeza universal. El uso efectivo y la dependencia literaria se documentan por separado. No se infiere acceso por transitividad.</p><h3>Alcance del registro</h3><p>73 libros, ${stageCount} etapas registradas y ${sourceCount} referencias.</p><p>El registro es una reconstrucción de trabajo basada en las fuentes consultadas. No pretende agotar todas las relaciones posibles. Las fechas desconocidas y las candidaturas insuficientemente respaldadas permanecen abiertas.</p><h3>Referencias consultadas</h3>${db.sources.map(s=>`<a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>`).join('')}`;
}
function registerTools(){
  if(!document.modelContext?.registerTool)return;
  const lifecycle=new AbortController();
  const options={signal:lifecycle.signal};
  for(const tool of [
    {name:'select_textual_stage',title:'Seleccionar etapa textual',description:'Selecciona una etapa del escenario y muestra sus fechas, fuentes y conexiones en la interfaz.',inputSchema:{type:'object',properties:{stage_id:{type:'string'}},required:['stage_id'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input.stage_id!=='string'||Object.keys(input).length!==1||!currentStages().some(s=>s.id===input.stage_id))throw new Error('Etapa inválida para el escenario.');select('stage',input.stage_id,true);return {selected_stage_id:input.stage_id,scenario_id:state.scenario}}},
    {name:'read_access_evaluation',title:'Consultar evaluación de acceso',description:'Devuelve el alcance, resultado, fuentes y límites de una evaluación registrada, sin cambiar la selección.',inputSchema:{type:'object',properties:{evaluation_id:{type:'string'}},required:['evaluation_id'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof input.evaluation_id!=='string'||Object.keys(input).length!==1||!tables.access_evaluations.has(input.evaluation_id))throw new Error('Evaluación desconocida.');const e=tables.access_evaluations.get(input.evaluation_id);return {id:e.id,status:e.status,scenario_id:e.scenario_id,scope:e.scope,route:e.route,justification:e.justification,limitations:e.limitations}}}
  ])try{Promise.resolve(document.modelContext.registerTool(tool,options)).catch(()=>{})}catch(error){}
  addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
async function init(){
  try{
    await window.atlasLocaleReady;
    const response=await fetch('registro.json');if(!response.ok)throw new Error('Registro no disponible.');db=await response.json();
    tables=Object.fromEntries(['works','actors','stages','attributions','forms','contexts','dates','claims','evidence','sources','scenarios','access_evaluations'].map(k=>[k,new Map(db[k].map(x=>[x.id,x]))]));
    state.scenario=db.scenarios[0].id;$('#scenario').innerHTML=db.scenarios.map(s=>`<option value="${esc(s.id)}">${esc(s.label)}</option>`).join('');
    setupEvents();render();renderMethod();registerTools();
    window.atlas={state,select,getData:()=>db,exportSvg,render,navigate};window.AtlasI18n?.apply();document.dispatchEvent(new Event('atlas:ready'));
  }catch(error){$('#graph-scroll').innerHTML='<div class="failure"><h2>No se pudo abrir el registro.</h2><p>Recarga la página o descarga los datos desde <a href="registro.json">el registro documentado</a>.</p></div>';$('#stats').textContent='Registro no disponible';}
  window.AtlasI18n?.apply();
}
init();
