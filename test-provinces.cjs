const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=n=>fs.readFileSync(__dirname+'/'+n,'utf8');
const headers=['Fecha','ID','perfil','formacion','departamento','tareas','experiencia','modalidad','espacio','horas','ingresos','continuidad','registro','salida','barreras','necesidades','edad','genero','email','novedades','consentimiento','Version','barreras_otra','tareas_otra','espacio_otro','salida_otro','genero_otra'];
const originalRow=headers.map((h,i)=>'existing-'+i);
let rows=[headers.slice(),originalRow.slice()],maxColumns=27,appends=0;
const sheet={getMaxColumns:()=>maxColumns,insertColumnsAfter:(i,n)=>{maxColumns+=n;},getLastRow:()=>rows.length,
 getRange:(r,c,n=1,w=1)=>({getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:w},(_,j)=>rows[r-1+i]?.[c-1+j]??'')),getValue:()=>rows[r-1]?.[c-1]??'',setValue:v=>{rows[r-1][c-1]=v;},createTextFinder:v=>({matchEntireCell:()=>({findNext:()=>rows.slice(1).some(row=>row[1]===v)})})}),
 appendRow:row=>{rows.push(row);appends++;},setFrozenRows:()=>{}};
const ctx=vm.createContext({console,PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'test-only'})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),flush:()=>{}},LockService:{getScriptLock:()=>({waitLock:()=>{},hasLock:()=>true,releaseLock:()=>{}})},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>JSON.parse(text)})}});
vm.runInContext(read('Code.gs')+';this.headers=HEADERS;this.schema=SCHEMA;',ctx);
assert.deepEqual(JSON.parse(JSON.stringify(ctx.headers)).slice(0,27),headers);
const front=vm.createContext({});vm.runInContext(read('logic.js')+';this.schema=SCHEMA;',front);
assert.equal(JSON.stringify(ctx.schema),JSON.stringify(front.schema));
const base={perfil:'Me interesa y quiero empezar',formacion:['Todavía no tuve formación'],provincia:'Mendoza',departamento:'Guaymallén'};
assert.equal(front.normalize(base).departamento,'Guaymallén');
assert.throws(()=>front.normalize({...base,departamento:''}));
assert.throws(()=>front.normalize({...base,provincia:''}));
assert.throws(()=>front.normalize({...base,provincia:'Inventada'}));
assert.throws(()=>front.normalize({...base,departamento:'Fuera de Mendoza'}));
for(const province of ctx.schema.find(q=>q.key==='provincia').options){
 const answer=front.normalize({...base,provincia:province});
 assert.equal(answer.departamento,province==='Mendoza'?'Guaymallén':'Fuera de Mendoza');
}
let counter=0;
function submit(overrides={}){
 const p={...base,formacion:'Todavía no tuve formación',version:'v3-provincia',consentimiento:'si',submission_id:'00000000-0000-4000-8000-'+String(++counter).padStart(12,'0'),response_format:'json',...overrides};
 const result=ctx.doPost({parameter:p,parameters:{...p,formacion:[p.formacion]},postData:{length:500}});return {result,p};
}
let sent=submit();assert.equal(sent.result.ok,true);assert.equal(rows.at(-1)[27],'Mendoza');
assert.deepEqual(rows[1],originalRow);assert.deepEqual(rows[0].slice(0,27),headers);assert.equal(rows[0][27],'provincia');assert.equal(maxColumns,28);
let count=rows.length;assert.equal(submit({submission_id:sent.p.submission_id}).result.ok,true);assert.equal(rows.length,count);
assert.equal(submit({provincia:'Córdoba',departamento:'Guaymallén'}).result.ok,true);assert.equal(rows.at(-1)[4],'Fuera de Mendoza');assert.equal(rows.at(-1)[27],'Córdoba');
assert.equal(submit({provincia:'Ciudad Autónoma de Buenos Aires',departamento:''}).result.ok,true);
assert.equal(submit({version:'v3',provincia:undefined,departamento:'Capital'}).result.ok,true);assert.equal(rows.at(-1)[4],'Capital');assert.equal(rows.at(-1)[27],'Mendoza');
assert.equal(submit({version:'v3',provincia:undefined,departamento:'Fuera de Mendoza'}).result.ok,true);assert.equal(rows.at(-1)[4],'Fuera de Mendoza');assert.equal(rows.at(-1)[27],'');
count=rows.length;
for(const bad of [{provincia:''},{provincia:'Inventada'},{departamento:''},{version:'v3',provincia:undefined,departamento:'Inventado'},{consentimiento:''}])assert.equal(submit(bad).result.ok,false);
assert.equal(rows.length,count);
rows[0][27]='occupied';assert.equal(submit().result.ok,false);assert.equal(rows.length,count);rows[0][27]='provincia';
rows[0][4]='unexpected';assert.equal(submit().result.ok,false);assert.equal(rows.length,count);rows[0][4]=headers[4];
assert.deepEqual(rows[1],originalRow);
console.log('PASS: 24 provincias/CABA, validación condicional, columnas A:AA intactas, migración AB, envíos v3/v3-provincia, reintentos sin duplicados, protección ante encabezados incompatibles. Datos simulados; sin envíos reales.');
