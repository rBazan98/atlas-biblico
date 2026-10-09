'use strict';
(()=>{
  let manifest,active='es',dictionaries={},originalTexts=new WeakMap(),originalAttributes=new WeakMap();
  const attrNames=['placeholder','aria-label','title'];
  function text(source,code=active){
    if(code==='es')return source;
    const messages=dictionaries[code]?.messages||{};
    if(messages[source]!==undefined)return messages[source];
    const trimmed=source.trim();if(messages[trimmed]!==undefined)return source.replace(trimmed,messages[trimmed]);
    if(trimmed===trimmed.toUpperCase()){
      const key=Object.keys(messages).find(k=>k.toUpperCase()===trimmed);
      if(key)return source.replace(trimmed,messages[key].toUpperCase());
    }
    const count=source.match(/^73 libros, (\d+) etapas registradas y (\d+) referencias\.$/);
    if(count&&messages['73 libros, {stages} etapas registradas y {sources} referencias.'])return messages['73 libros, {stages} etapas registradas y {sources} referencias.'].replace('{stages}',count[1]).replace('{sources}',count[2]);
    const stages=source.match(/^(\d+) etapa\(s\)$/);if(stages&&messages['{count} etapa(s)'])return messages['{count} etapa(s)'].replace('{count}',stages[1]);
    const numbered=source.match(/^(Composición|Redacción|Recopilación|Traducción|Revisión) · (\d+)$/);if(numbered)return text(numbered[1],code)+' · '+numbered[2];
    if(source.startsWith('Ver ')&&messages[source.slice(4)]&&messages['Ver {book}'])return messages['Ver {book}'].replace('{book}',text(source.slice(4),code));
    let output=source;
    for(const token of ['a. C.','d. C.','Después de','Antes de','Hasta','Desde','Hacia','límite final desconocido','límite inicial desconocido'])if(messages[token])output=output.replaceAll(token,messages[token]);
    if(output!==source)return output;
    return source;
  }
  function apply(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement?.closest('script,style,textarea,#language')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
    while(walker.nextNode()){
      const node=walker.currentNode;if(!originalTexts.has(node))originalTexts.set(node,node.nodeValue);
      node.nodeValue=text(originalTexts.get(node));
    }
    const elements=root.querySelectorAll?Array.from(root.querySelectorAll('*')):[];if(root.nodeType===Node.ELEMENT_NODE)elements.unshift(root);
    for(const el of elements){if(el.closest?.('#language'))continue;let originals=originalAttributes.get(el);if(!originals){originals={};for(const attr of attrNames)if(el.hasAttribute(attr))originals[attr]=el.getAttribute(attr);originalAttributes.set(el,originals)}for(const [attr,value]of Object.entries(originals))el.setAttribute(attr,text(value));}
    document.documentElement.lang=active;document.title=dictionaries[active]?.title||'Atlas textual · Biblia católica';
  }
  async function setLanguage(code){
    const entry=manifest.languages.find(l=>l.code===code);if(!entry)throw new Error('Idioma no configurado.');
    if(!dictionaries[code]){const response=await fetch('locales/'+entry.file);if(!response.ok)throw new Error('No se pudo cargar el idioma.');dictionaries[code]=await response.json();}
    active=code;try{localStorage.setItem('atlas-language',code)}catch(error){}
    document.querySelector('#language').value=code;
    window.atlas?.render();apply();document.dispatchEvent(new Event('atlas:language'));
    return {locale:code};
  }
  function attribute(el,name,value){
    const originals=originalAttributes.get(el)||{};originals[name]=value;originalAttributes.set(el,originals);el.setAttribute(name,text(value));
  }
  window.AtlasI18n={text,apply,attribute,abbreviation:id=>dictionaries[active]?.book_abbreviations?.[id],setLanguage,getLanguage:()=>active};
  window.atlasLocaleReady=(async()=>{
    const response=await fetch('locales/languages.json');if(!response.ok)throw new Error('Catálogo de idiomas no disponible.');manifest=await response.json();
    const control=document.querySelector('#language');control.replaceChildren();for(const language of manifest.languages){const option=document.createElement('option');option.value=language.code;option.textContent=language.label;control.append(option)}
    let preferred=new URLSearchParams(location.search).get('lang');if(!preferred)try{preferred=localStorage.getItem('atlas-language')}catch(error){}
    await setLanguage(manifest.languages.some(l=>l.code===preferred)?preferred:manifest.default);
    control.addEventListener('change',()=>{setLanguage(control.value).catch(()=>{control.value=active})});
  })().catch(()=>{active='es'});
})();
