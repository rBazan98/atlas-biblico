'use strict';
// Spatial arrangement is editorial. Only evaluated relationships become connectors.
const overviewFamilies={
  torah:{x:205,y:195,columns:3},
  history:{x:220,y:438,columns:4},
  wisdom:{x:194,y:742,columns:3},
  deut:{x:495,y:805,columns:4},
  prophets:{x:594,y:225,columns:5},
  gospels:{x:1000,y:191,columns:3},
  paul:{x:1150,y:478,columns:4},
  othernt:{x:975,y:805,columns:3}
};
const overviewText=text=>window.AtlasI18n.text(text);
function shortBook(work){return window.AtlasI18n.abbreviation(work.id)||work.id.replace('book_','').toUpperCase()}
function syncView(){
  const overview=state.mode==='overview';
  document.body.classList.toggle('overview-view',overview);
  document.body.classList.toggle('has-selection',overview&&Boolean(state.selection));
  document.body.classList.toggle('catalogue-open',overview&&state.catalogueOpen);
  document.body.classList.toggle('presentation-view',overview&&state.presentation);
  $('#presentation').setAttribute('aria-pressed',String(state.presentation));
  $('#presentation').textContent=overviewText(state.presentation?'Salir de presentación':'Presentación');
  $('#catalogue-toggle').setAttribute('aria-expanded',String(state.catalogueOpen));
  window.AtlasI18n.attribute($('#graph-scroll'),'aria-label',overview?'Mapa de libros; desplázate o usa el zoom para explorar':'Líneas temporales; usa el desplazamiento para recorrerlas');
  window.AtlasI18n.attribute($('#graph'),'aria-label',overview?'Mapa general de los 73 libros y sus conexiones de acceso':state.mode==='books'?'Grafo temporal de libros':'Grafo dirigido de etapas textuales');
}
function overviewReference(e){return overviewText(e.access_basis.label);}
function curvePoint(p,t){const u=1-t;return {x:u*u*u*p[0].x+3*u*u*t*p[1].x+3*u*t*t*p[2].x+t*t*t*p[3].x,y:u*u*u*p[0].y+3*u*u*t*p[1].y+3*u*t*t*p[2].y+t*t*t*p[3].y}}
function overviewMarker(defs,id,color){
  const marker=makeSvg('marker',{id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto',markerUnits:'userSpaceOnUse'});
  marker.append(makeSvg('path',{d:'M 0 1 L 9 5 L 0 9',fill:'none',stroke:color,'stroke-width':1.5,'stroke-linecap':'round','stroke-linejoin':'round'}));defs.append(marker);
}
function renderOverview(){
  const works=matchingWorks(),stages=filteredStages(new Set(works.map(w=>w.id))),stageIds=new Set(stages.map(s=>s.id));
  const workIds=new Set(stages.map(s=>s.work_id));
  visibleNodes=works.filter(w=>workIds.has(w.id)).map(w=>({id:w.id,work:w,label:w.label,stage:stages.find(s=>s.work_id===w.id)}));
  shownEvaluations=db.access_evaluations.filter(e=>e.scenario_id===state.scenario&&matchesFoundation(e)&&stageIds.has(e.from_stage_id)&&stageIds.has(e.to_stage_id)&&(e.status==='admitida'||state.pending&&e.status==='pendiente'));
  const admitted=shownEvaluations.filter(e=>e.status==='admitida').length;
  $('#stats').innerHTML=`<div><strong>${visibleNodes.length}</strong><span>${visibleNodes.length===1?'libro':'libros'}</span></div><div><strong>${admitted}</strong><span>${admitted===1?'conexión admitida':'conexiones admitidas'}</span></div><div><strong>${stages.length}</strong><span>${stages.length===1?'etapa':'etapas'}</span></div>`;
  $('#zoom-value').textContent=Math.round(state.zoom*100)+' %';
  $('#graph-empty').hidden=visibleNodes.length>0;
  $('#axis-sticky').replaceChildren();$('#axis-sticky').style.width='';
  const graph=$('#graph'),width=1400,height=990;graph.replaceChildren();
  graph.setAttribute('width',width);graph.setAttribute('height',height);graph.setAttribute('viewBox',`0 0 ${width} ${height}`);
  const baseWidth=state.presentation?Math.min($('#graph-scroll').clientWidth,(innerHeight-100)*width/height):Math.max($('#graph-scroll').clientWidth,1050);
  graph.style.width=(baseWidth*state.zoom)+'px';graph.style.height='auto';
  const defs=makeSvg('defs');
  overviewMarker(defs,'overview-selected','#284d4b');
  for(const [id]of Object.entries(overviewFamilies)){const g=group(db.works.find(w=>group(w).id===id));overviewMarker(defs,'overview-'+id,g.color);}
  const gradient=makeSvg('radialGradient',{id:'overview-wash'});gradient.append(makeSvg('stop',{offset:0,'stop-color':'#e7ede7','stop-opacity':.45}),makeSvg('stop',{offset:1,'stop-color':'#e7ede7','stop-opacity':0}));defs.append(gradient);graph.append(defs);
  graph.append(makeSvg('rect',{width,height,fill:'#f8f7f2'}));
  graph.append(makeSvg('ellipse',{cx:690,cy:505,rx:530,ry:390,fill:'url(#overview-wash)'}));
  const headingLayer=makeSvg('g',{'aria-hidden':'true'});
  const backdrop=makeSvg('g',{'aria-hidden':'true'}),edgeLayer=makeSvg('g',{class:'overview-edges'}),labelLayer=makeSvg('g',{class:'overview-labels'}),nodeLayer=makeSvg('g',{class:'overview-nodes'});
  graph.append(backdrop,edgeLayer,labelLayer,headingLayer,nodeLayer);positions=new Map();
  // Full-corpus positions remain stable during searches, tours and scenario changes.
  const key=[];
  for(const [id,layout]of Object.entries(overviewFamilies)){
    const family=db.works.filter(w=>group(w).id===id).sort((a,b)=>a.canonical_order-b.canonical_order),g=group(family[0]);
    const rows=Math.ceil(family.length/layout.columns),stepX=id==='prophets'?88:88,stepY=77;
    const top=layout.y-(rows-1)*stepY/2;
    for(let i=0;i<family.length;i++){
      const row=Math.floor(i/layout.columns),count=Math.min(layout.columns,family.length-row*layout.columns),col=i%layout.columns;
      const x=layout.x+(col-(count-1)/2)*stepX+(row%2?9:-3),y=top+row*stepY+(col%2?5:0);
      const n=visibleNodes.find(n=>n.id===family[i].id);if(n)positions.set(n.id,{x,x1:x-19,x2:x+19,y,node:n});
    }
    const members=family.filter(w=>workIds.has(w.id));if(!members.length)continue;
    key.push(`<span><i style="background:${g.color}"></i>${esc(g.label)}<small>${members.length}</small></span>`);
    const heading=makeSvg('g',{opacity:.95});
    heading.append(makeSvg('circle',{cx:layout.x,cy:top-65,r:2.5,fill:g.color}));
    heading.append(makeSvg('text',{x:layout.x,y:top-43,'text-anchor':'middle','font-family':'system-ui','font-size':10.5,'font-weight':600,'letter-spacing':1.3,fill:g.color,stroke:'#f8f7f2','stroke-width':5,'paint-order':'stroke'},overviewText(g.label).toLocaleUpperCase()));headingLayer.append(heading);
    backdrop.append(makeSvg('ellipse',{cx:layout.x,cy:layout.y+9,rx:Math.min(layout.columns,family.length)*stepX/2+24,ry:rows*stepY/2+15,fill:g.color,opacity:.027}));
  }
  $('#overview-key').innerHTML=key.join('');
  const selection=state.selection;
  const selectedBook=selection?.type==='book'?selection.id:selection?.type==='stage'?tables.stages.get(selection.id).work_id:null;
  const selectedEdge=selection?.type==='edge'?selection.id:null,neighbors=new Set(selectedBook?[selectedBook]:[]);
  for(const e of shownEvaluations)if(e.id===selectedEdge||selectedBook&&[e.from_stage_id,e.to_stage_id].some(id=>tables.stages.get(id).work_id===selectedBook)){
    neighbors.add(tables.stages.get(e.from_stage_id).work_id);neighbors.add(tables.stages.get(e.to_stage_id).work_id);
  }
  const loopCounts=new Map();
  const labelBoxes=[...positions.values()].map(p=>({x:p.x-46,y:p.y-24,w:92,h:76}));
  for(const text of headingLayer.querySelectorAll('text')){const b=text.getBBox();labelBoxes.push({x:b.x-8,y:b.y-5,w:b.width+16,h:b.height+10});}
  const intersects=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  for(let i=0;i<shownEvaluations.length;i++){
    const e=shownEvaluations[i],aId=tables.stages.get(e.from_stage_id).work_id,bId=tables.stages.get(e.to_stage_id).work_id,a=positions.get(aId),b=positions.get(bId);if(!a||!b)continue;
    const isLoop=aId===bId,active=e.id===selectedEdge||selectedBook&&[aId,bId].includes(selectedBook),muted=Boolean(selection)&&!active;
    const color=active?'#284d4b':e.status==='admitida'?group(a.node.work).color:'#9a9691';
    let points,path;
    if(isLoop){const index=loopCounts.get(aId)||0;loopCounts.set(aId,index+1);const sign=group(a.node.work).id==='prophets'?-1:1,h=Math.min(120,85+index*18),wide=54+index*13;points=[{x:a.x+14,y:a.y+sign*14},{x:a.x+wide,y:a.y+sign*h},{x:a.x-wide,y:a.y+sign*h},{x:a.x-14,y:a.y+sign*14}];}
    else {
      const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1,vx=dx/length,vy=dy/length;
      const bend=(i%7-3)*22+(Math.abs(dx)<200?-65:35),reach=Math.min(Math.max(Math.abs(dx)*.38,65),400),sign=dx<0?-1:1;
      points=[{x:a.x+vx*21,y:a.y+vy*21},{x:a.x+sign*reach,y:a.y+bend},{x:b.x-sign*reach,y:b.y+bend},{x:b.x-vx*23,y:b.y-vy*23}];
    }
    path=`M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}, ${points[3].x} ${points[3].y}`;
    const connection=makeSvg('g',{class:'overview-connection','data-evaluation':e.id,opacity:muted?.1:1});
    const ref=overviewReference(e),stageInfo=isLoop?' · '+overviewText(tables.stages.get(e.from_stage_id).label)+' → '+overviewText(tables.stages.get(e.to_stage_id).label):'',title=`${overviewText(a.node.work.label)} → ${overviewText(b.node.work.label)} · ${ref} · ${overviewText(statusLabels[e.status])}${stageInfo}`;
    connection.append(makeSvg('title',{},title));
    connection.append(makeSvg('path',{class:'overview-path',d:path,fill:'none',stroke:color,'stroke-width':active?2.2:1.15,opacity:active?.9:e.status==='admitida'?.52:.5,'stroke-dasharray':e.status!=='admitida'?'5 5':isInferred(e)?'2 3':'','marker-end':e.status==='admitida'?`url(#${active?'overview-selected':'overview-'+group(a.node.work).id})`:'','stroke-linecap':'round'}));
    const hover=on=>{connection.classList.toggle('is-hovered',on);for(const id of new Set([aId,bId])){const n=$(`.overview-node[data-work="${id}"]`,graph);n?.classList.toggle('relation-hover',on);}};
    connection.addEventListener('pointerenter',()=>hover(true));connection.addEventListener('pointerleave',()=>hover(false));
    const hit=makeSvg('path',{class:'edge-hit',d:path,fill:'none',stroke:'transparent','stroke-width':14,tabindex:0,role:'button','aria-label':title});
    hit.addEventListener('click',()=>select('edge',e.id));hit.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();select('edge',e.id)}});connection.append(hit);edgeLayer.append(connection);
    if(state.labels||active){
      const labelWidth=ref.length*6.1+15,labelHeight=21;
      let best=null;
      const ts=isLoop?[.5,.4,.6]:[.50,.47,.53,.44,.56,.41,.59,.37,.63,.34,.66,.30,.70,.26,.74,.23,.77,.19,.81,.16,.84,.12,.88];
      const consider=(t,dx,dy)=>{
        const anchor=curvePoint(points,t),p={x:anchor.x+dx,y:anchor.y+dy},box={x:p.x-labelWidth/2,y:p.y-labelHeight/2,w:labelWidth,h:labelHeight};
        if(box.x<12||box.y<12||box.x+box.w>width-12||box.y+box.h>height-12)return;
        const padded={x:box.x-2,y:box.y-2,w:box.w+4,h:box.h+4};
        const overlap=labelBoxes.reduce((s,b)=>s+intersects(padded,b),0);
        const score=overlap*1000+Math.abs(t-.5)*12+Math.hypot(dx,dy)*.07;
        if(!best||score<best.score)best={p,box,score,overlap,anchor,offset:dx||dy};
      };
      for(const t of ts)for(const dy of [0,18,-18,36,-36,54,-54,72,-72,90,-90])consider(t,0,dy);
      if(best?.overlap)for(const t of ts)for(const dx of [0,30,-30,60,-60,90,-90,120,-120,150,-150,180,-180,210,-210])for(const dy of [0,36,-36,72,-72,108,-108,144,-144,180,-180])consider(t,dx,dy);
      if(best?.overlap){const anchor=curvePoint(points,.5);for(let y=25;y<height-15;y+=27)for(let x=25;x<width-15;x+=30)consider(.5,x-anchor.x,y-anchor.y);}
      labelBoxes.push(best.box);
      const label=makeSvg('g',{class:'edge-label overview-edge-label','data-evaluation':e.id,opacity:muted?.12:1,role:'button','aria-label':title,tabindex:-1});
      if(best.offset)label.append(makeSvg('line',{class:'label-guide',x1:best.anchor.x,y1:best.anchor.y,x2:best.p.x,y2:best.p.y,stroke:color,'stroke-width':.65,'stroke-opacity':.35}));
      label.append(makeSvg('title',{},title),makeSvg('rect',{x:best.box.x,y:best.box.y,width:labelWidth,height:labelHeight,rx:7,fill:'#f8f7f2',stroke:color,'stroke-opacity':active?.3:.1,'stroke-width':.8}));
      label.append(makeSvg('text',{x:best.p.x,y:best.p.y+3.8,'text-anchor':'middle','font-family':'system-ui','font-size':10.8,'font-weight':active?650:450,fill:color},ref));
      label.addEventListener('pointerenter',()=>hover(true));label.addEventListener('pointerleave',()=>hover(false));label.addEventListener('click',()=>select('edge',e.id));labelLayer.append(label);
    }
  }
  for(const [id,p]of positions){
    const n=p.node,g=group(n.work),active=selectedBook===id||selectedEdge&&neighbors.has(id),connected=neighbors.has(id),muted=Boolean(selection)&&!connected;
    const item=makeSvg('g',{class:'graph-node overview-node',tabindex:0,role:'button','data-work':id,'aria-label':overviewText(n.work.label),opacity:muted?.35:1});
    const count=shownEvaluations.filter(e=>[e.from_stage_id,e.to_stage_id].some(sid=>tables.stages.get(sid).work_id===id)).length;
    item.append(makeSvg('title',{},overviewText(n.work.label)+' · '+count+' '+overviewText('conexiones evaluadas')));
    item.append(makeSvg('rect',{x:p.x-42,y:p.y-24,width:84,height:70,rx:20,fill:'transparent'}));
    if(active)item.append(makeSvg('circle',{cx:p.x,cy:p.y,r:27,fill:g.color,opacity:.1}));
    item.append(makeSvg('circle',{class:'book-circle',cx:p.x,cy:p.y,r:19,fill:active?g.color:'#f8f7f2',stroke:g.color,'stroke-width':active?1.8:1.2}));
    if(!active)item.append(makeSvg('circle',{cx:p.x,cy:p.y,r:17.7,fill:g.color,opacity:.075}));
    item.append(makeSvg('text',{x:p.x,y:p.y+4,'text-anchor':'middle','font-family':'system-ui','font-size':shortBook(n.work).length>4?10:11.5,'font-weight':600,fill:active?'#fff':g.color},shortBook(n.work)));
    const name=overviewText(n.work.label),parts=name.length>18?name.split(/\s+/):[name];
    let lines=[name];if(parts.length>1){const middle=Math.ceil(parts.length/2);lines=[parts.slice(0,middle).join(' '),parts.slice(middle).join(' ')];}
    lines.forEach((line,i)=>item.append(makeSvg('text',{x:p.x,y:p.y+34+i*13,'text-anchor':'middle','font-family':'system-ui','font-size':12,'font-weight':active?600:450,fill:'#4d5754',stroke:'#f8f7f2','stroke-width':4,'paint-order':'stroke','stroke-linejoin':'round'},line)));
    item.addEventListener('click',()=>select('book',id));item.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();select('book',id)}});nodeLayer.append(item);
  }
  // Quiet annotation in the unused central area; no decorative network edges.
  if(!selection&&visibleNodes.length===73){
    const note=makeSvg('g',{'aria-hidden':'true',opacity:.7});
    note.append(makeSvg('text',{x:664,y:620,'text-anchor':'middle','font-family':'Georgia,serif','font-size':23,'font-style':'italic',fill:'#697970'},overviewText('Los textos viajan.')));
    note.append(makeSvg('text',{x:664,y:644,'text-anchor':'middle','font-family':'system-ui','font-size':10,'letter-spacing':1.1,fill:'#8a928b'},overviewText('LAS FUENTES NOS DEJAN SEGUIRLOS')));backdrop.append(note);
  }
  $('#graph-notice').textContent='Cada círculo es un libro. Las líneas indican vías o fundamentos de acceso plausible; abre una para leer la justificación y sus supuestos. La posición no representa una cronología.';
  window.AtlasI18n.apply($('.graph-area'));
}
function exportOverviewSvg(){
  const source=$('#graph').cloneNode(true),width=1400,height=990;
  source.removeAttribute('style');source.setAttribute('xmlns',NS);source.setAttribute('width',width);source.setAttribute('height',height+145);source.setAttribute('viewBox',`0 0 ${width} ${height+145}`);
  source.querySelectorAll('.edge-hit, title, .graph-node > rect').forEach(e=>e.remove());
  const graphic=makeSvg('g',{transform:'translate(0 100)'});while(source.firstChild)graphic.append(source.firstChild);
  source.append(makeSvg('rect',{width,height:height+145,fill:'#f8f7f2'}),graphic);
  source.append(makeSvg('text',{x:35,y:37,fill:'#284d4b','font-size':25,'font-family':'Georgia,serif'},overviewText('Atlas textual · Biblia católica')));
  source.append(makeSvg('text',{x:35,y:62,fill:'#68756c','font-size':12,'font-family':'system-ui'},overviewText(selectedScenario().label)));
  source.append(makeSvg('text',{x:35,y:83,fill:'#68756c','font-size':12,'font-family':'system-ui'},overviewText('Círculos: libros. Flechas: acceso respaldado. Flechas punteadas: inferencias con supuestos. Líneas sin flecha: candidaturas. Etiquetas: fundamento del acceso.')));
  source.append(makeSvg('text',{x:35,y:height+126,fill:'#68756c','font-size':12,'font-family':'system-ui'},overviewText('Agrupación editorial, sin escala temporal. Acceso no implica dependencia directa. Sin conexión no significa sin acceso.')));
  return new XMLSerializer().serializeToString(source);
}

function changeZoom(delta){
  const scroll=$('#graph-scroll'),previous=state.zoom,centerX=scroll.scrollLeft+scroll.clientWidth/2,centerY=scroll.scrollTop+scroll.clientHeight/2;
  state.zoom=Math.max(.75,Math.min(3,state.zoom+delta));renderGraph();
  if(state.mode==='overview'){const ratio=state.zoom/previous;scroll.scrollLeft=centerX*ratio-scroll.clientWidth/2;scroll.scrollTop=centerY*ratio-scroll.clientHeight/2;}
}
function setupOverviewPan(){
  const scroll=$('#graph-scroll');let drag=null;
  scroll.addEventListener('pointerdown',e=>{
    if(state.mode!=='overview'||e.pointerType!=='mouse'||e.button!==0||e.target.closest('.graph-node,.edge-hit,.edge-label'))return;
    drag={x:e.clientX,y:e.clientY,left:scroll.scrollLeft,top:scroll.scrollTop};scroll.setPointerCapture(e.pointerId);scroll.classList.add('dragging');e.preventDefault();
  });
  scroll.addEventListener('pointermove',e=>{if(!drag)return;scroll.scrollLeft=drag.left+drag.x-e.clientX;scroll.scrollTop=drag.top+drag.y-e.clientY;});
  const release=()=>{drag=null;scroll.classList.remove('dragging');};scroll.addEventListener('pointerup',release);scroll.addEventListener('pointercancel',release);scroll.addEventListener('lostpointercapture',release);
}

function dismissOverviewSelection(){
  const old=state.selection;state.selection=null;render();
  if(!old)return;
  const id=old.type==='book'?old.id:old.type==='stage'?tables.stages.get(old.id).work_id:null;
  const target=id?$(`.overview-node[data-work="${id}"]`):$(`.overview-connection[data-evaluation="${old.id}"] .edge-hit`);
  target?.focus({preventScroll:true});
}
