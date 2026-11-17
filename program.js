'use strict';
const dayOffsets=ACTIVE_SPLIT==='5'?[0,1,2,4,5]:[0,1,3,5];
function trainingWeek(){return Math.max(0,Math.min(11,Math.floor((dayNumber(date)-dayNumber(programStart()))/7)));}
function selectTrainingDay(index){day=index;date=addDays(programStart(),trainingWeek()*7+dayOffsets[index]);render();}
function selectTrainingWeek(index){date=addDays(programStart(),index*7+dayOffsets[day]);render();}
function renderTrainingControls(){
 const current=trainingWeek(),month=Math.floor(current/4);
 $('training-months').innerHTML=Array.from({length:3},(_,i)=>'<button type="button" data-training-month="'+i+'" class="'+(i===month?'active':'')+'" aria-pressed="'+(i===month)+'">Mes '+(i+1)+'</button>').join('');
 $('training-weeks').innerHTML=Array.from({length:4},(_,i)=>{const index=month*4+i,w=weekInfo(index);return '<button type="button" class="week '+(index===current?'active':'')+'" aria-pressed="'+(index===current)+'" data-training-week="'+index+'"><span>Semana '+(i+1)+'</span><small>'+w.start.slice(8)+'/'+w.start.slice(5,7)+' — '+w.end.slice(8)+'/'+w.end.slice(5,7)+'</small></button>';}).join('');
 $('training-months').querySelectorAll('button').forEach(b=>b.onclick=()=>selectTrainingWeek(Number(b.dataset.trainingMonth)*4));
 $('training-weeks').querySelectorAll('button').forEach(b=>b.onclick=()=>selectTrainingWeek(Number(b.dataset.trainingWeek)));
 $('training-range').textContent='Mes '+(month+1)+' · Semana '+(current%4+1)+' · '+pretty(weekInfo(current).start)+' — '+pretty(weekInfo(current).end);
}
$('split-select').value=ACTIVE_SPLIT;
$('split-select').onchange=()=>{
 const selected=$('split-select').value;if(selected===ACTIVE_SPLIT)return;
 if(!persist()){$('split-select').value=ACTIVE_SPLIT;toast('No se pudo guardar. Descarga una copia antes de cambiar de split.');return;}
 try{localStorage.setItem('fernando-active-split',selected);}catch{$('split-select').value=ACTIVE_SPLIT;return;}
 const url=new URL(location.href);url.searchParams.set('split',selected);url.hash='';location.assign(url.href);
};
$('split-schedule').textContent=ACTIVE_SPLIT==='5'?'5 días: Lun · Mar · Mié · Vie · Sáb':'4 días: Lun · Mar · Jue · Sáb';
$('split-description').textContent=ACTIVE_SPLIT==='5'?'Push A · Pull A · Pierna · Push B · Pull B. Descanso sugerido: jueves y domingo.':'Push · Pull · Pierna · Brazos. Descanso sugerido: miércoles, viernes y domingo.';
document.querySelector('.plan-meta').textContent='SPLIT '+ACTIVE_SPLIT+' DÍAS · 3 MESES · 12 SEMANAS';
$('days').style.setProperty('--day-count',ROUTINE.length);
for(const ex of ROUTINE.flatMap(d=>d.exercises)){if(ex.id.endsWith('-b'))MUSCLES[ex.id]=MUSCLES[ex.id.slice(0,-2)];}
render();
