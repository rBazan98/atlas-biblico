'use strict';
// Learning paths reference existing assessments. They never create historical edges.
(()=>{
  const q=selector=>document.querySelector(selector);
  const safe=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t=source=>window.AtlasI18n.text(source);
  function arrows(root){root.querySelectorAll('span[aria-hidden="true"]').forEach(el=>{if(el.textContent==='↗')el.innerHTML='<svg class="thread-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'})}
  const storageKey='atlas-experience-v1';
  const journeys=[
    {id:'translation',title:'Un texto cruza de lengua',subtitle:'Del hebreo al griego, dentro de un mismo libro.',skill:'Círculos · etapas · fechas',symbol:'translation',steps:[
      {title:'Un círculo, varias etapas',copy:'Eclesiástico es un solo círculo, pero reúne una colección hebrea y su traducción griega. Abre la primera etapa para mirar dentro del libro.',action:'Abrir la etapa hebrea',context:{type:'book',id:'book_sir',tour:'sirach'}},
      {title:'Las fechas tienen margen',copy:'La etapa conserva una datación propuesta y su fundamento. Mira ahora cómo se representa en una línea temporal: un intervalo no es una fecha exacta.',action:'Ver las etapas en el tiempo',context:{type:'stage',id:'stage_sir_he',tour:'sirach'}},
      {title:'Sigue la traducción',copy:'Las dos etapas pertenecen al mismo libro. Su conexión evalúa si el traductor pudo conocer un antecedente hebreo antes de producir el texto griego.',action:'Abrir la conexión de traducción',context:{type:'stage',id:'stage_sir_he',tour:'sirach',mode:'stages'}},
      {title:'¿Qué nos permite decir la flecha?',copy:'La justificación está justo debajo. El testimonio del traductor y la evidencia textual convergen; el ejemplar concreto sigue sin identificarse.',context:{type:'edge',id:'access_sir_he_gr',tour:'sirach',mode:'stages'},answers:['El traductor pudo conocer el antecedente hebreo pertinente.','Conoció exactamente cada versículo del libro actual.'],correct:0,hint:'La evaluación se limita a una forma antecedente pertinente. No reconstruye un ejemplar completo ni todas las ampliaciones posteriores.',takeaway:'Ya puedes pasar de un libro a sus etapas, leer intervalos y consultar una vía de acceso.'}
    ]},
    {id:'memory',title:'Acceso sin una cita',subtitle:'¿Puede un autor conocer lo que escribió antes?',skill:'Justificaciones · supuestos',symbol:'memory',steps:[
      {title:'Una carta antes de otra',copy:'Empieza con 1 Tesalonicenses. El mapa puede mostrar una posibilidad de acceso aunque el texto posterior no cite la carta anterior.',action:'Seguir hacia 1 Corintios',context:{type:'book',id:'book_1th',neighborhood:true}},
      {title:'Recordar lo que escribió',copy:'La autoría paulina compartida y el orden de composición fundamentan esta inferencia. Lee la razón y sus supuestos debajo: acceso plausible y reutilización literaria son afirmaciones distintas.',action:'Poner a prueba la lectura',context:{type:'edge',id:'access_prior_1th_1co',neighborhood:true}},
      {title:'¿Qué se ha admitido aquí?',copy:'El vínculo no exige una cita. Su alcance depende de la atribución común y de una anterioridad compatible dentro del escenario.',context:{type:'edge',id:'access_prior_1th_1co',neighborhood:true},answers:['Una reutilización literaria demostrada de la carta anterior.','Acceso plausible por composición propia, con supuestos explícitos.'],correct:1,hint:'Componer un texto da una vía de conocimiento de su contenido. Eso no demuestra que el autor lo reutilizara en otra obra.',takeaway:'Ya puedes distinguir una vía de acceso de una dependencia literaria y reconocer una inferencia con supuestos.'}
    ]},
    {id:'uncertainty',title:'Lo que aún no sabemos',subtitle:'Una candidatura también cuenta una historia.',skill:'Candidaturas · escenarios',symbol:'uncertainty',steps:[
      {title:'Empieza por un evangelio',copy:'Marcos ofrece un punto de partida para explorar fuentes propuestas de otros evangelios. Abre una evaluación y observa sus fundamentos.',action:'Explorar Marcos → Mateo',context:{type:'book',id:'book_mrk',tour:'gospels'}},
      {title:'Una fuente griega propuesta',copy:'Esta admisión de trabajo declara sus supuestos sobre la circulación de Marcos. Compárala con otro vínculo que permanece pendiente: Mateo y Lucas.',action:'Mostrar la candidatura Mateo → Lucas',context:{type:'edge',id:'candidate_mark_matt',tour:'gospels'}},
      {title:'Una línea sin flecha',copy:'La candidatura aparece sin punta de flecha porque el acceso no está suficientemente resuelto. Cambia de escenario para contrastar otra hipótesis.',action:'Comparar otra hipótesis',context:{type:'edge',id:'candidate_matt_luke',tour:'gospels',pending:true}},
      {title:'¿Basta con que un texto sea anterior?',copy:'Compara la justificación del otro escenario. La candidatura conserva sus reservas: proponer una vía no cierra por sí solo la evaluación. La hipótesis de Farrer se contempla en el escenario alternativo.',context:{type:'edge',id:'candidate_matt_luke',tour:'gospels',pending:true,otherScenario:true},answers:['Sí: la anterioridad y el parecido bastan.','No: hace falta justificar el acceso con evidencia convergente.'],correct:1,hint:'La regla exige una forma pertinente previa, una vía plausible y acceso durante la actividad receptora. La fecha y el parecido por sí solos no admiten una flecha.',takeaway:'Ya puedes reconocer una candidatura, comparar escenarios y conservar la duda cuando falta evidencia.'}
    ]}
  ];
  let memory={completed:[],last:null},active=null,returnView=null,feedback='',ready=false;
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(saved&&Array.isArray(saved.completed))memory.completed=journeys.filter(j=>saved.completed.includes(j.id)).map(j=>j.id);
    const journey=journeys.find(j=>j.id===saved?.last?.id);
    if(journey&&Number.isInteger(saved.last.index)&&saved.last.index>=0&&saved.last.index<journey.steps.length)memory.last={id:journey.id,index:saved.last.index,scenario:saved.last.scenario};
  }catch(error){/* Exploration also works without browser storage. */}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(memory))}catch(error){}}
  function current(){return journeys.find(j=>j.id===active?.id)}
  function icon(kind){
    const paths={translation:'M6 8h12m-6-4v8m-4 9h12m-4-4 4 4-4 4M8 8c0 9 12 4 12 13',memory:'M6 4h13l3 3v16H6V4m13 0v4h3M10 11h8m-8 4h8m-8 4h4',uncertainty:'M5 21 23 5M5 9V5h4m10 18h4v-4M10 19l-2-2m6-2-2-2m6-2-2-2'};
    return `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="${paths[kind]}" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function renderWelcome(){
    const resume=memory.last&&!memory.completed.includes(memory.last.id);
    q('#first-thread').innerHTML=`<span>${resume?'Retomar mi hilo':'Sigue tu primer hilo'}</span><span aria-hidden="true">↗</span>`;
    q('#thread-status').innerHTML=memory.completed.length?`<span>${safe(t('{done} de {total} hilos explorados').replace('{done}',memory.completed.length).replace('{total}',journeys.length))}</span><span aria-hidden="true"> · </span><span>A tu ritmo</span>`:resume?'<span>Tu hilo te espera. Continúa cuando quieras.</span>':'<span>A tu ritmo · Sin conocimientos previos</span>';
    q('#thread-cards').innerHTML=journeys.map((j,i)=>`<button id="thread-${j.id}" class="thread-card ${j.symbol}" data-journey="${j.id}"><div class="thread-card-top"><span class="thread-art">${icon(j.symbol)}</span><span class="thread-number">0${i+1}</span></div><span class="thread-card-title">${j.title}</span><span class="thread-card-copy">${j.subtitle}</span><span class="thread-card-bottom"><span>${memory.completed.includes(j.id)?'Explorado · Puedes repetirlo':j.skill}</span><span aria-hidden="true">↗</span></span></button>`).join('');
    q('#thread-cards').querySelectorAll('[data-journey]').forEach(button=>button.addEventListener('click',()=>start(button.dataset.journey)));
    arrows(q('.welcome-actions'));arrows(q('#thread-library'));
    window.AtlasI18n.apply(q('.welcome-actions'));window.AtlasI18n.apply(q('#thread-status'));window.AtlasI18n.apply(q('#thread-library'));
  }
  function context(step){
    const a=window.atlas,data=a.getData(),c=step.context;
    const origin=active.scenario||a.state.scenario;
    const scenario=c.otherScenario?data.scenarios.find(s=>s.id!==origin)?.id||origin:origin;
    let id=c.id;
    if(c.type==='edge'){
      const base=data.access_evaluations.find(e=>e.id===c.id);
      const assessment=data.access_evaluations.find(e=>e.scenario_id===scenario&&e.from_stage_id===base?.from_stage_id&&e.to_stage_id===base?.to_stage_id);
      if(!assessment)throw new Error('El hilo necesita una evaluación disponible en este escenario.');
      id=assessment.id;
    }
    return {scenario,mode:c.mode||'overview',tour:c.tour||'all',pending:Boolean(c.pending),neighborhood:Boolean(c.neighborhood),selection:{type:c.type,id}};
  }
  function showStep(){
    const a=window.atlas,j=current();feedback='';
    memory.last={...active};save();
    a.navigate({...context(j.steps[active.index]),search:'',testament:'all',foundation:'all',presentation:false,catalogueOpen:false,labels:true,zoom:1});
    q('#detail-panel').scrollTop=0;
    q('#journey-title')?.focus({preventScroll:true});
    frameContext();
  }
  function frameContext(){
    const a=window.atlas,s=a.state;
    if(s.mode!=='overview'){if(innerWidth>640)q('#graph-scroll').scrollIntoView({block:'start',behavior:'auto'});return;}
    const data=a.getData(),stageWork=id=>data.stages.find(stage=>stage.id===id)?.work_id;
    const e=s.selection?.type==='edge'?data.access_evaluations.find(e=>e.id===s.selection.id):null;
    const ids=e?[stageWork(e.from_stage_id),stageWork(e.to_stage_id)]:[s.selection?.type==='stage'?stageWork(s.selection.id):s.selection?.id];
    const boxes=ids.map(id=>q(`.overview-node[data-work="${id}"] .book-circle`)?.getBoundingClientRect()).filter(Boolean);
    if(!boxes.length)return;
    const area=q('#graph-scroll'),r=area.getBoundingClientRect();
    const x=boxes.reduce((sum,b)=>sum+b.x+b.width/2,0)/boxes.length;
    const y=boxes.reduce((sum,b)=>sum+b.y+b.height/2,0)/boxes.length;
    area.scrollLeft+=x-r.left-area.clientWidth/2;
    if(innerWidth>640)window.scrollBy({top:y-innerHeight*.5,behavior:'auto'});
  }
  function start(id,resume=false){
    const j=journeys.find(j=>j.id===id);if(!j||!ready)return;
    if(active)pause(false);
    q('#education-dialog').close();
    returnView={state:{...window.atlas.state,selection:window.atlas.state.selection?{...window.atlas.state.selection}:null},left:q('#graph-scroll').scrollLeft,top:q('#graph-scroll').scrollTop,options:q('#map-options').open,pageY:scrollY,pageX:scrollX,focusId:'education-button'};
    const saved=resume&&memory.last?.id===id?memory.last:null;
    const ids=window.atlas.getData().scenarios.map(s=>s.id);
    active={id,index:saved?.index||0,scenario:ids.includes(saved?.scenario)?saved.scenario:window.atlas.state.scenario};
    document.body.classList.add('journey-active');q('#map-options').open=false;showStep();renderWelcome();
  }
  function pause(restore=true){
    if(!active)return;
    const completed=memory.completed.includes(active.id);
    if(!completed)memory.last={...active};else if(memory.last?.id===active.id)memory.last=null;
    active=null;feedback='';save();q('#journey-coach')?.remove();q('#journey-map-back')?.remove();
    document.body.classList.remove('journey-active','has-journey-detail');
    const focusId=returnView?.focusId;
    if(returnView){window.atlas.navigate(returnView.state);q('#map-options').open=returnView.options;q('#graph-scroll').scrollTo({left:returnView.left,top:returnView.top});window.scrollTo({left:returnView.pageX,top:returnView.pageY,behavior:'auto'});}
    returnView=null;renderWelcome();renderReturn();
    if(restore)(document.getElementById(focusId)||q('#first-thread')).focus({preventScroll:true});
  }
  function next(){const j=current();if(!j||active.index>=j.steps.length-1)return;active.index++;showStep();}
  function answer(index){
    const j=current(),step=j.steps[active.index];
    if(index!==step.correct){feedback=step.hint;renderCoach();q('#journey-feedback')?.focus({preventScroll:true});return;}
    if(!memory.completed.includes(j.id))memory.completed.push(j.id);
    memory.last=null;feedback='';save();active.finished=true;renderCoach();renderWelcome();q('#journey-title')?.focus({preventScroll:true});
  }
  function renderReturn(){
    const el=q('#thread-return');el.hidden=!active||Boolean(window.atlas.state.selection);
    if(!el.hidden){el.innerHTML='<span>Tu hilo sigue abierto.</span><button id="resume-open">Volver a la guía <span aria-hidden="true">↗</span></button>';q('#resume-open').addEventListener('click',showStep);arrows(el);window.AtlasI18n.apply(el);}
  }
  function renderCoach(){
    document.body.classList.toggle('journey-active',Boolean(active));
    document.body.classList.toggle('has-journey-detail',Boolean(active&&window.atlas.state.selection));
    renderReturn();
    if(!active||!window.atlas.state.selection)return;
    const j=current(),step=j.steps[active.index],panel=q('#detail-panel');
    const target=context(step),view=window.atlas.state;
    const offPath=!active.finished&&(view.selection.type!==target.selection.type||view.selection.id!==target.selection.id||view.scenario!==target.scenario||view.mode!==target.mode);
    q('#journey-coach')?.remove();
    if(window.atlas.state.mode!=='overview'&&!q('#journey-map-back')){
      const back=document.createElement('button');back.id='journey-map-back';back.className='detail-dismiss';back.innerHTML='<span>Volver al mapa</span><span aria-hidden="true">×</span>';
      back.addEventListener('click',()=>{window.atlas.navigate({selection:null});q('#guide-button').focus({preventScroll:true})});panel.prepend(back);
    }
    const coach=document.createElement('section');coach.id='journey-coach';coach.className='journey-coach';coach.setAttribute('aria-labelledby','journey-title');
    const progress=t('Paso {step} de {total}').replace('{step}',active.index+1).replace('{total}',j.steps.length);
    coach.innerHTML=`<div class="journey-meta"><span>${j.title}</span><button id="journey-pause">${active.finished?'Cerrar hilo':'Pausar'}</button></div><div class="journey-progress" role="img" aria-label="${safe(active.finished?t('Hilo explorado'):progress)}">${j.steps.map((_,i)=>`<i class="${i<=active.index?'visited':''}"></i>`).join('')}<span>${active.finished?'✓':String(active.index+1).padStart(2,'0')}</span></div><h3 id="journey-title" tabindex="-1">${active.finished?'Ahora el mapa es un poco más tuyo.':step.title}</h3><p>${active.finished?step.takeaway:step.copy}</p>${active.finished?'<div class="journey-finish"><button id="journey-free" class="thread-primary">Explorar por mi cuenta <span aria-hidden="true">↗</span></button><button id="journey-another" class="thread-link">Elegir otro hilo</button></div>':step.answers?`<div class="journey-answers">${step.answers.map((label,i)=>`<button data-answer="${i}">${label}</button>`).join('')}</div><p id="journey-feedback" class="journey-feedback" tabindex="-1" role="status">${feedback||''}</p>`:`<button id="journey-next" class="thread-primary">${step.action}<span aria-hidden="true">→</span></button>`}${!active.finished&&active.index?'<button id="journey-previous" class="journey-previous">← Paso anterior</button>':''}`;
    if(offPath){
      coach.querySelector('h3').textContent='Sigue tu curiosidad.';
      coach.querySelector('h3').nextElementSibling.textContent='Has abierto otro texto. Puedes explorarlo o volver al hilo; tu paso queda guardado.';
      coach.querySelectorAll('.journey-answers,.journey-feedback,#journey-next,#journey-previous').forEach(el=>el.remove());
      coach.insertAdjacentHTML('beforeend','<button id="journey-context" class="thread-primary">Volver a este paso <span aria-hidden="true">→</span></button>');
    }
    const close=q('#detail-dismiss')||q('#journey-map-back');if(close)close.after(coach);else panel.prepend(coach);
    q('#journey-pause').addEventListener('click',()=>pause());q('#journey-next')?.addEventListener('click',next);
    q('#journey-context')?.addEventListener('click',showStep);
    q('#journey-previous')?.addEventListener('click',()=>{active.index--;showStep()});
    coach.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>answer(Number(b.dataset.answer))));
    q('#journey-free')?.addEventListener('click',()=>pause());
    q('#journey-another')?.addEventListener('click',()=>{pause(false);showLibrary()});
    arrows(coach);window.AtlasI18n.apply(panel);
  }
  function onView(){
    if(!ready)return;
    // Opening the suggested element directly also moves the lesson forward.
    if(active&&!active.finished){
      const j=current(),nextStep=j.steps[active.index+1];
      if(nextStep){
        const here=context(j.steps[active.index]),there=context(nextStep),s=window.atlas.state;
        const differs=here.mode!==there.mode||here.scenario!==there.scenario||here.selection.id!==there.selection.id;
        if(differs&&s.mode===there.mode&&s.scenario===there.scenario&&s.selection?.type===there.selection.type&&s.selection?.id===there.selection.id){active.index++;feedback='';memory.last={...active};save();}
      }
    }
    renderCoach();
  }
  function showLibrary(){
    if(!q('#education-dialog').open)q('#education-dialog').showModal();
    q('#thread-library').scrollIntoView({block:'nearest',behavior:'auto'});
    q('#thread-translation')?.focus({preventScroll:true});
  }
  function init(){
    if(ready||!window.atlas)return;ready=true;
    for(const id of ['first-thread','threads-button','guide-button','education-button'])q('#'+id).disabled=false;
    renderWelcome();arrows(q('#guide-dialog'));
    q('#first-thread').addEventListener('click',()=>{const saved=memory.last&&!memory.completed.includes(memory.last.id);start(saved?memory.last.id:journeys[0].id,Boolean(saved))});
    q('#threads-button').addEventListener('click',showLibrary);
    q('#guide-button').addEventListener('click',()=>q('#guide-dialog').showModal());
    q('#guide-start').addEventListener('click',()=>{q('#guide-dialog').close();showLibrary()});
    q('#education-button').addEventListener('click',showLibrary);
    document.addEventListener('atlas:view',onView);
    document.addEventListener('atlas:language',()=>{renderWelcome();renderCoach()});
    window.AtlasExperience={start,pause,getProgress:()=>JSON.parse(JSON.stringify(memory)),isActive:()=>Boolean(active)};
  }
  document.addEventListener('atlas:ready',init);init();
})();
