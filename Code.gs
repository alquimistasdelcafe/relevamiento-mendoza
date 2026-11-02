const SCHEMA = [{"key": "perfil", "title": "¿Cuál es tu vínculo actual con el café?", "kind": "radio", "options": ["Me interesa y quiero empezar", "Estoy aprendiendo o buscando mi primera experiencia laboral", "Trabajo actualmente en el sector", "Trabajé en el sector, pero hoy no"], "step": 1, "when": "all", "required": true, "exclusive": null}, {"key": "formacion", "title": "¿Cómo aprendiste sobre café?", "kind": "multi", "options": ["Todavía no tuve formación", "Aprendí por mi cuenta", "Aprendí trabajando o con otras personas", "Hice cursos o talleres", "Realicé una formación profesional o certificación"], "step": 1, "when": "all", "required": true, "exclusive": "Todavía no tuve formación"}, {"key": "departamento", "title": "¿En qué departamento vivís?", "kind": "select", "options": ["Capital", "Godoy Cruz", "Guaymallén", "Las Heras", "Luján de Cuyo", "Maipú", "Lavalle", "San Martín", "Junín", "Rivadavia", "Santa Rosa", "La Paz", "Tunuyán", "Tupungato", "San Carlos", "San Rafael", "General Alvear", "Malargüe", "Fuera de Mendoza"], "step": 1, "when": "all", "required": true, "exclusive": null}, {"key": "tareas", "title": "¿Qué tareas realizás o realizaste en el sector?", "kind": "multi", "options": ["Barra / preparación de café", "Tueste", "Atención y servicio", "Formación", "Comercialización", "Mantenimiento de equipos", "Gestión de un emprendimiento", "Otra"], "step": 2, "when": "experienced", "required": false, "exclusive": null}, {"key": "experiencia", "title": "¿Cuánto tiempo trabajaste en el sector en total?", "kind": "radio", "options": ["Menos de 1 año", "1 a 3 años", "4 a 6 años", "7 años o más"], "step": 2, "when": "experienced", "required": false, "exclusive": null}, {"key": "modalidad", "title": "¿Cómo trabajás actualmente?", "kind": "radio", "options": ["En relación de dependencia", "Por mi cuenta", "Combino ambas modalidades"], "step": 2, "when": "working", "required": true, "exclusive": null}, {"key": "espacio", "title": "¿En qué espacios trabajás?", "kind": "multi", "options": ["Cafetería", "Restaurante / hotel", "Tostadero", "Emprendimiento propio", "Espacio de formación", "Otro"], "step": 2, "when": "working", "required": false, "exclusive": null}, {"key": "horas", "title": "¿Cuántas horas semanales dedicás al trabajo con café?", "kind": "radio", "options": ["Menos de 20", "20 a 35", "36 a 48", "Más de 48", "Varía mucho"], "step": 2, "when": "working", "required": false, "exclusive": null}, {"key": "ingresos", "title": "¿Qué lugar ocupa el café en tus ingresos?", "kind": "radio", "options": ["Es mi principal fuente de ingresos", "Es un ingreso complementario", "Todavía no genera ingresos", "Prefiero no responder"], "step": 2, "when": "working", "required": false, "exclusive": null}, {"key": "continuidad", "title": "En los últimos 12 meses, ¿cómo fue tu trabajo en el sector?", "kind": "radio", "options": ["Continuo durante todo el año", "Por temporadas", "Ocasional", "Empecé hace menos de 12 meses"], "step": 2, "when": "working", "required": false, "exclusive": null}, {"key": "registro", "title": "En tu empleo en relación de dependencia, ¿estás registrado/a?", "kind": "radio", "options": ["Sí, por toda la jornada", "Por una parte de la jornada", "No", "No sé", "Prefiero no responder"], "step": 2, "when": "employee", "required": false, "exclusive": null}, {"key": "salida", "title": "¿Por qué dejaste de trabajar en el sector?", "kind": "multi", "options": ["Ingresos insuficientes", "Horarios o carga laboral", "Falta de oportunidades", "Tareas de cuidado", "Cambio de interés o actividad", "Condiciones o trato en el trabajo", "Otro motivo", "Prefiero no responder"], "step": 2, "when": "former", "required": false, "exclusive": "Prefiero no responder"}, {"key": "barreras", "title": "¿Qué te dificulta crecer o formarte en el mundo del café?", "kind": "multi", "options": ["El costo de las capacitaciones", "Los horarios o la falta de tiempo", "Las tareas de cuidado", "La distancia o el transporte", "La falta de oportunidades laborales", "No encontrar propuestas que me interesen", "Situaciones de discriminación o trato desigual", "Actualmente no encuentro dificultades", "Otra"], "step": 2, "when": "all", "required": false, "exclusive": "Actualmente no encuentro dificultades"}, {"key": "necesidades", "title": "¿Qué te gustaría aprender o profundizar para seguir desarrollándote en el mundo del café?", "kind": "text", "options": null, "step": 3, "when": "all", "required": false, "exclusive": null}, {"key": "edad", "title": "¿En qué rango de edad estás?", "kind": "select", "options": ["Menos de 18", "18 a 24", "25 a 34", "35 a 44", "45 a 54", "55 o más", "Prefiero no responder"], "step": 3, "when": "all", "required": false, "exclusive": null}, {"key": "genero", "title": "¿Cómo describís tu género?", "kind": "radio", "options": ["Mujer", "Varón", "No binario", "Otra identidad", "Prefiero no responder"], "step": 3, "when": "all", "required": false, "exclusive": null}];
function visible(q,p){
 const working=p.perfil==='Trabajo actualmente en el sector',former=p.perfil==='Trabajé en el sector, pero hoy no';
 return q.when==='all'||(q.when==='working'&&working)||(q.when==='former'&&former)||(q.when==='experienced'&&(working||former))||(q.when==='employee'&&working&&['En relación de dependencia','Combino ambas modalidades'].includes(p.modalidad));
}
function normalize(p){
 const out={};
 for(const q of SCHEMA){if(!visible(q,p))continue;const raw=p[q.key];
 if(q.kind==='multi'){const a=raw===undefined?[]:Array.isArray(raw)?raw:[raw];if(a.length>q.options.length||a.some(v=>!q.options.includes(v))||new Set(a).size!==a.length)throw Error('Revisá: '+q.title);if(q.required&&!a.length)throw Error('Completá: '+q.title);if(q.exclusive&&a.includes(q.exclusive)&&a.length>1)throw Error('Elegí opciones compatibles: '+q.title);out[q.key]=a.join(' | ');}
 else{const v=raw||'';if(typeof v!=='string'||v.length>1200||(v&&q.options&&!q.options.includes(v)))throw Error('Revisá: '+q.title);if(q.required&&!v.trim())throw Error('Completá: '+q.title);out[q.key]=v;}
 }
 return out;
}

const HEADERS=['Fecha','ID',...SCHEMA.map(q=>q.key),'email','novedades','consentimiento','Version'];
function sheet_(ss){
 let sh=ss.getSheetByName('Respuestas_v3');
 if(!sh){sh=ss.insertSheet('Respuestas_v3');sh.appendRow(HEADERS);sh.setFrozenRows(1);}
 const actual=sh.getRange(1,1,1,HEADERS.length).getValues()[0];
 if(JSON.stringify(actual)!==JSON.stringify(HEADERS))throw Error('La estructura de la planilla requiere revisión.');
 return sh;
}
function setup(){
 const props=PropertiesService.getScriptProperties();
 const ss=SpreadsheetApp.getActiveSpreadsheet();
 if(!ss)throw Error('Abrí la planilla de respuestas y creá el proyecto desde Extensiones → Apps Script. Luego ejecutá setup.');
 sheet_(ss);
 ss.setSpreadsheetTimeZone('America/Argentina/Mendoza');
 props.setProperty('SHEET_ID',ss.getId());
 console.log(ss.getUrl());
}
function doGet(){return page_('Relevamiento de profesionales del café en Mendoza','Receptor del relevamiento de Alquimistas del Café.');}
function doPost(e){let lock;try{
 if(!e||!e.parameter||!e.postData||e.postData.length>30000)throw Error('Envío no válido.');
 const p=e.parameter;
 if(p.version!=='v3')throw Error('Actualizá el formulario antes de enviar.');
 if(p.website||p.consentimiento!=='si')throw Error('Revisá el consentimiento.');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.submission_id||''))throw Error('Identificador no válido.');
 const raw={...p};for(const q of SCHEMA)if(q.kind==='multi')raw[q.key]=(e.parameters||{})[q.key]||[];
 const answers=normalize(raw);
 if(p.novedades&&p.novedades!=='si')throw Error('Opción no válida.');
 const email=p.novedades==='si'?(p.email||''):'';
 if(p.novedades==='si'&&(email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))throw Error('Revisá tu correo.');
 const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(!id)throw Error('Relevamiento todavía no habilitado.');
 lock=LockService.getScriptLock();lock.waitLock(15000);const sh=sheet_(SpreadsheetApp.openById(id));
 const exists=sh.getLastRow()>1&&sh.getRange(2,2,sh.getLastRow()-1,1).createTextFinder(p.submission_id).matchEntireCell(true).findNext();
 if(!exists){const safe=v=>/^[\s]*[=+@-]/.test(v)?"'"+v:v;sh.appendRow([new Date(),p.submission_id,...SCHEMA.map(q=>safe(answers[q.key]||'')),safe(email),p.novedades||'',p.consentimiento,'v3']);SpreadsheetApp.flush();}
 return page_('¡Gracias por compartir tu recorrido!','Tu respuesta quedó guardada. Ya podés cerrar esta página.');
 }catch(err){return page_('No pudimos registrar tu respuesta','Volvé atrás y revisá tus respuestas. '+err.message);}finally{if(lock&&lock.hasLock())lock.releaseLock();}}
function page_(title,message){
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+'</title><body style="background:#f4eddf;color:#39281f;font:20px/1.5 Arial;padding:10%;max-width:700px"><p>ALQUIMISTAS DEL CAFÉ</p><h1>'+escape(title)+'</h1><p>'+escape(message)+'</p></body></html>');
}

