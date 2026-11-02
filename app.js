const form=document.getElementById('survey'),box=document.getElementById('questions'),errors=document.getElementById('errors');
const endpoint=window.SURVEY_ENDPOINT||'',live=/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint);
let step=1;
const el=id=>document.getElementById(id);
function values(){const d=new FormData(form),p={};for(const q of SCHEMA)p[q.key]=q.kind==='multi'?d.getAll(q.key):(d.get(q.key)||'');return p;}
for(const q of SCHEMA){const fs=document.createElement('fieldset');fs.dataset.key=q.key;const legend=document.createElement('legend');legend.textContent=q.title+(q.required?' *':' (opcional)');fs.append(legend);
 if(q.kind==='radio'||q.kind==='multi'){if(q.kind==='multi'){const help=document.createElement('p');help.className='help';help.textContent='Podés marcar varias opciones.';fs.append(help);}const choices=document.createElement('div');choices.className='choices';q.options.forEach((o,i)=>{const label=document.createElement('label');label.className='choice';const input=document.createElement('input');input.type=q.kind==='multi'?'checkbox':'radio';input.name=q.key;input.value=o;input.id=q.key+'-'+i;label.append(input,document.createTextNode(o));choices.append(label);});fs.append(choices);}
 else{const input=document.createElement(q.kind==='select'?'select':'textarea');input.name=q.key;input.id=q.key;input.setAttribute('aria-label',q.title);if(q.kind==='select'){input.add(new Option('Seleccioná una opción',''));q.options.forEach(o=>input.add(new Option(o,o)));}else{input.rows=3;input.maxLength=1200;input.placeholder='Con unas palabras alcanza.';}fs.append(input);}if(q.key==='barreras'){
 const detail=document.createElement('div');detail.id='barreras-otra-detalle';detail.hidden=true;
 const label=document.createElement('label');label.htmlFor='barreras_otra';label.textContent='¿Qué otra dificultad encontrás? (opcional)';
 const input=document.createElement('textarea');input.id='barreras_otra';input.name='barreras_otra';input.rows=3;input.maxLength=1200;input.placeholder='Contanos con unas palabras.';input.disabled=true;
 detail.append(label,input);fs.append(detail);
 const choice=fs.querySelector('input[value="Otra"]');choice.setAttribute('aria-controls',detail.id);choice.setAttribute('aria-expanded','false');
}box.append(fs);}
function update(focus=false){const p=values();for(const q of SCHEMA){const fs=box.querySelector('[data-key="'+q.key+'"]'),active=visible(q,p);fs.hidden=!active||q.step!==step;fs.disabled=!active;}
 const otherSelected=p.barreras.includes('Otra');el('barreras-otra-detalle').hidden=!otherSelected;el('barreras_otra').disabled=!otherSelected;box.querySelector('[data-key="barreras"] input[value="Otra"]').setAttribute('aria-expanded',String(otherSelected));
 el('closing').hidden=step!==3;const optedIn=form.elements.novedades.checked;el('contact').hidden=!optedIn;el('email').disabled=!optedIn;el('email').required=optedIn;
 el('back').hidden=step===1;el('next').hidden=step===3;el('send').hidden=step!==3;el('send').textContent=live?'Enviar mi respuesta':'Finalizar prueba';
 el('progress-label').textContent='Paso '+step+' de 3';document.querySelector('progress').value=step;el('step-title').textContent=['Tu vínculo con el café','Tu experiencia y tus posibilidades','Tu próximo paso'][step-1];if(focus)el('step-title').focus();}
function validateStep(){errors.textContent='';const p=values();for(const q of SCHEMA.filter(q=>q.step===step&&visible(q,p))){if(q.required&&(!p[q.key]||!p[q.key].length)){errors.textContent='Completá: '+q.title;box.querySelector('[data-key="'+q.key+'"] input, [data-key="'+q.key+'"] select').focus();return false;}}return true;}
form.addEventListener('change',e=>{const q=SCHEMA.find(q=>q.key===e.target.name);if(q?.exclusive&&e.target.checked){const inputs=[...form.elements[q.key]];inputs.forEach(i=>{if(i!==e.target&&(e.target.value===q.exclusive||i.value===q.exclusive))i.checked=false;});}errors.textContent='';update();if(e.target.name==='barreras'&&e.target.value==='Otra'&&e.target.checked)el('barreras_otra').focus();});
el('next').onclick=()=>{if(validateStep()){step++;update(true);}};
el('back').onclick=()=>{step--;errors.textContent='';update(true);};
let sending=false,submitted=false;
form.addEventListener('submit',async e=>{
 e.preventDefault();if(sending||submitted)return;
 if(step!==3){el('next').click();return;}
 if(!validateStep())return;
 try{normalize(values());}catch(err){errors.textContent=err.message;return;}
 if(!form.reportValidity())return;
 if(!live){form.hidden=true;el('done').hidden=false;el('done').focus();return;}
 const body=new URLSearchParams(new FormData(form));body.set('response_format','json');
 const submissionId=body.get('submission_id'),controller=new AbortController();
 sending=true;form.inert=true;el('send').disabled=true;el('send').textContent='Enviando…';errors.textContent='';
 const timer=setTimeout(()=>controller.abort(),45000);
 try{
  const response=await fetch(endpoint,{method:'POST',body,credentials:'omit',signal:controller.signal});
  if(!response.ok)throw Error('No pudimos confirmar el guardado.');
  const result=await response.json();
  if(!result.ok)throw Error(result.error||'No pudimos registrar tu respuesta.');
  if(result.submission_id!==submissionId)throw Error('No pudimos confirmar el guardado.');
  submitted=true;form.hidden=true;
  el('done').querySelector('h2').textContent='¡Gracias por compartir tu recorrido!';
  el('done').querySelector('p').textContent='Tu respuesta quedó guardada. Gracias por ayudarnos a conocer y fortalecer la comunidad cafetera.';
  el('restart').hidden=true;el('done').hidden=false;
  if(el('confirmation'))el('confirmation').showModal();else el('done').focus();
 }catch(err){
  errors.textContent=err.name==='AbortError'||err instanceof TypeError?'No pudimos confirmar el guardado. Revisá tu conexión y volvé a enviar: el reintento no duplica tu respuesta.':err.message;
 }finally{
  clearTimeout(timer);sending=false;form.inert=false;el('send').disabled=false;el('send').textContent='Enviar mi respuesta';
  if(!submitted)errors.focus();
 }
});
el('close-confirmation')?.addEventListener('click',()=>el('confirmation').close());
el('confirmation')?.addEventListener('close',()=>el('done').focus());
el('restart').onclick=()=>{form.reset();el('submission_id').value=crypto.randomUUID();form.hidden=false;el('done').hidden=true;step=1;update(true);};
window.addEventListener('pageshow',()=>{el('send').disabled=false;update();});
el('submission_id').value=crypto.randomUUID();el('status').textContent=live?'Tus respuestas nos ayudan a conocer y fortalecer la comunidad cafetera.':'Modo de prueba: recorré el formulario. Las respuestas no se envían ni se guardan.';update();
