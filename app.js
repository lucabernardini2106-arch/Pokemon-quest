const DB="pokemonQuestV8",STORE="state";
const APP_VERSION=88;
const THEMES={rosso:{name:"Rosso",strong:"#d63031",soft:"#fff1f1"},rosa:{name:"Rosa",strong:"#e84393",soft:"#fff0f7"},viola:{name:"Viola",strong:"#6c5ce7",soft:"#f2efff"},verde:{name:"Verde",strong:"#00a86b",soft:"#effbf5"},blu:{name:"Blu",strong:"#2878d4",soft:"#eef6ff"},arancione:{name:"Arancione",strong:"#e67e22",soft:"#fff5e9"},oro:{name:"Giallo Oro",strong:"#c79500",soft:"#fff9df"}};
const THEME_KEYS=Object.keys(THEMES);
const L=[
["Bulbasaur","Ivysaur","Venusaur",1,2,3],["Charmander","Charmeleon","Charizard",4,5,6],["Squirtle","Wartortle","Blastoise",7,8,9],
["Treecko","Grovyle","Sceptile",252,253,254],["Torchic","Combusken","Blaziken",255,256,257],["Mudkip","Marshtomp","Swampert",258,259,260],
["Chikorita","Bayleef","Meganium",152,153,154],["Cyndaquil","Quilava","Typhlosion",155,156,157],["Totodile","Croconaw","Feraligatr",158,159,160],
["Turtwig","Grotle","Torterra",387,388,389],["Chimchar","Monferno","Infernape",390,391,392],["Piplup","Prinplup","Empoleon",393,394,395]];
const P=[
[1,2,[["🧸","Metti a posto un gioco"],["🪥","Lavati i denti con un adulto"],["👕","Metti via un vestito"],["👟","Metti le scarpe al loro posto"],["❤️","Fai un piccolo aiuto in casa"]]],
[3,4,[["🧸","Metti a posto i giochi"],["🪥","Lavati i denti"],["👟","Metti le scarpe al loro posto"],["🧺","Metti i vestiti nel cesto"],["🧹","Aiuta a riordinare una stanza"],["❤️","Fai un piccolo aiuto senza che te lo chiedano"]]],
[5,6,[["❤️","Aiuta in casa"],["🧸","Riordina tutti i giochi"],["🪥","Lavati i denti senza essere ricordato"],["👟","Sistema scarpe e giacca"],["🧺","Metti i tuoi vestiti nel cesto"],["🧹","Riordina ciò che hai usato"],["📚","Guarda/leggi un libro per almeno 10 minuti"],["🤝","Aiuta un fratello o una sorella"],["🌱","Prenditi cura di una pianta o di un piccolo compito"]]],
[7,8,[["🧹","Riordina ciò che hai usato"],["📚","Leggi per almeno 15 minuti"],["🧺","Metti a posto i tuoi vestiti"],["🧸","Riordina la tua stanza"],["❤️","Aiuta un familiare senza che te lo chiedano"],["🤝","Fai un gesto gentile verso un fratello/sorella"],["🌱","Svolgi una piccola responsabilità domestica"]]],
[9,10,[["🧹","Riordina ciò che hai usato"],["📚","Leggi per almeno 20 minuti"],["❤️","Aiuta qualcuno senza che te lo chieda"],["🛏️","Riordina la camera"],["🤝","Aiuta un fratello/sorella in una difficoltà"],["🌱","Svolgi una responsabilità domestica"],["📖","Racconta a un adulto qualcosa che hai imparato"]]],
[11,14,[["📚","Leggi per almeno 20 minuti"],["❤️","Aiuta qualcuno senza che te lo chieda"],["⏱️","Gestisci 20 minuti di studio/attività"],["🧹","Svolgi una responsabilità domestica"],["🛏️","Mantieni in ordine la camera"],["🤝","Collabora con un fratello/sorella"],["📖","Racconta o annota una cosa nuova che hai imparato"],["🌱","Svolgi una responsabilità domestica assegnata"],["💡","Proponi un modo per migliorare un'attività di casa"],["🗓️","Controlla da solo gli impegni del giorno dopo"]]]
];
const GROUPS=[
["🧸","Riordinare insieme la cameretta",15],["🛋️","Riordinare insieme il salone",15],["🧹","Fare insieme una piccola pulizia della casa",20],["🧺","Raccogliere e sistemare insieme i giochi",15],["🍽️","Preparare insieme la tavola per un pasto",15],["🍕","Aiutare insieme a preparare la cena",20],["🧩","Fare un gioco da tavolo tutti insieme",15],["🎨","Fare un disegno o lavoretto insieme",15],["🧱","Costruire qualcosa insieme con LEGO o costruzioni",20],["📖","Leggere insieme una storia",15],["🎭","Inventare e mettere in scena una piccola storia",20],["🧩","Fare un puzzle insieme",20],["🔎","Fare una piccola caccia al tesoro in casa",20],["⚽","Giocare insieme all'aperto",20],["🎵","Fare insieme 15 minuti di musica o canto",15],["🧹","Sistemare insieme una zona della casa scelta dai genitori",20],["❤️","Fare qualcosa di gentile per un altro membro della famiglia",15],["🌱","Fare giardinaggio insieme",20],["🏡","Riordinare il cortile insieme",20]
];
let db,s,active,tab="quests";
const $=s=>document.querySelector(s);
const img=id=>`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(id).padStart(3,"0")}.png`;
const id=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random();
const today=()=>new Date().toISOString().slice(0,10);
const lvl=x=>Math.min(30,Math.floor(x/100)+1),st=l=>l>=20?2:l>=10?1:0;
const pokeXP=k=>Number(k.pokeXp?.[k.line]||0);
const ensurePokeXP=k=>{if(!Array.isArray(k.pokeXp)||k.pokeXp.length!==L.length){const old=Number(k.xp)||0;k.pokeXp=L.map(()=>0);k.pokeXp[Math.max(0,Math.min(L.length-1,Number(k.line)||0))]=old;}k.pokeXp=k.pokeXp.map(x=>Math.max(0,Math.min(3000,Number(x)||0)));k.xp=pokeXP(k);};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function pool(a){return(P.find(x=>a>=x[0]&&a<=x[1])||P[4])[2]}
function xpForText(t){let x=String(t).toLowerCase();if(/20 minuti|20 min|studio|attività fisica|caccia al tesoro|rompicapo/.test(x))return 20;if(/15 minuti|15 min|senza distrazioni|autonomamente|senza che te lo chied/.test(x))return 15;if(/10 minuti|10 min|leggi|leggere|libro|impara|imparato|organizza|responsabilità/.test(x))return 10;return 5}
const FIXED=[
 {icon:"🎒",text:"Prepara la borsa per il giorno dopo",xp:10},
 {icon:"👕",text:"Preparati e vestiti prima di andare a scuola",xp:10},
 {icon:"🛏️",text:"Fai il letto",xp:5},
 {icon:"👚",text:"Prepara i vestiti per il giorno dopo",xp:10},
 {icon:"🧹",text:"Fai il servizio del tuo turno",xp:15}
];
const ROTATION_TERMS=/apparecchia|sparecchia|svuota la lavastoviglie|svuotare la lavastoviglie|servizio del tuo turno|preparare la tavola|prepara la tavola/;
function isFixed(q){return FIXED.some(f=>f.text===q.text)}
function isRotation(q){return ROTATION_TERMS.test(String(q.text).toLowerCase())}

function weekKey(d=today()){const x=new Date(d+"T12:00:00");const day=x.getDay()||7;x.setDate(x.getDate()-day+1);return x.toISOString().slice(0,10)}
function groupQuest(){return s.groupLib?.find(q=>q.id===s.group.qid)||null}
function groupDone(k){return !!k.groupDone?.[today()]}
function groupCard(k){const q=groupQuest();if(!q||s.kids.length<2)return "";const done=groupDone(k),count=s.kids.filter(x=>groupDone(x)).length;return `<div class="card group-card"><div class="row between"><h2>👨‍👩‍👧‍👦 Missione di squadra</h2><span class="chip">${count}/${s.kids.length}</span></div><div class="quest ${done?"done":""}"><span class="icon">${q.icon}</span><span class="text">${esc(q.text)} <span class="small">+${q.xp ?? 15} XP</span></span><button data-gq="${q.id}">${done?"↩️ Annulla":"🤝 Fatto"}</button></div><div class="small">Una sola missione di gruppo al giorno, senza ripetizioni nella stessa settimana.</div></div>`}
function combinations(items,n,target,start=0,picked=[],out=[]){if(out.length)return out;if(n===0){if(target===0)out.push(picked.slice());return out}for(let i=start;i<=items.length-n;i++){let v=items[i].xp;if(v>target)continue;combinations(items,n-1,target-v,i+1,picked.concat(items[i]),out);if(out.length)break}return out}
function variableCandidates(k){return assigned(k).filter(q=>!isRotation(q)&&!isFixed(q)).map(q=>({q,xp:Math.max(5,Math.min(20,ageXP(k,q)))}))}
function possibleSums(k){let a=variableCandidates(k);if(a.length<5)return new Set();let out=new Set();for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)for(let h=j+1;h<a.length;h++)for(let m=h+1;m<a.length;m++)for(let n=m+1;n<a.length;n++)out.add(a[i].xp+a[j].xp+a[h].xp+a[m].xp+a[n].xp);return out}
function commonDailyTarget(){let sets=s.kids.map(possibleSums);if(!sets.length)return 0;let common=[...sets[0]].filter(v=>sets.every(x=>x.has(v)));if(!common.length)return 0;let seed=[...today()].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),17);return common[seed%common.length]}
function dailyPlan(k){let cache=k.dailyPlan?.[today()];if(Array.isArray(cache)&&cache.length===5&&cache.every(x=>s.lib.some(q=>q.id===x.id)))return cache.map(x=>({q:s.lib.find(q=>q.id===x.id),xp:Number(x.xp)||5}));let vars=variableCandidates(k),target=commonDailyTarget(),combo=target?combinations(vars.map(x=>({id:x.q.id,xp:x.xp})),5,target):[];let result=combo.length?combo[0].map(x=>({q:s.lib.find(q=>q.id===x.id),xp:x.xp})):[];if(result.length<5){let sorted=vars.slice().sort((a,b)=>a.xp-b.xp||a.q.text.localeCompare(b.q.text));result=sorted.slice(0,5)}k.dailyPlan=k.dailyPlan||{};k.dailyPlan[today()]=result.map(x=>({id:x.q.id,xp:x.xp}));return result}
function dailyQs(k){let fixed=FIXED.map(f=>{let q=s.lib.find(x=>x.text===f.text);if(!q){q={id:id(),...f};s.lib.push(q)}else{q.icon=f.icon;q.xp=f.xp}return q});return fixed.concat(dailyPlan(k).map(x=>x.q));}
function dailyXP(k,q){let f=FIXED.find(x=>x.text===q.text);if(f)return f.xp;return dailyPlan(k).find(x=>x.q?.id===q.id)?.xp ?? Math.max(5,Math.min(20,ageXP(k,q)));}
function kid(n,a,theme="viola",avatar="none"){return{id:id(),name:n,age:a,xp:0,weekly:0,line:0,dailyBonus:{},theme:THEME_KEYS.includes(theme)?theme:"viola",avatar:avatar||"none",done:{}}}
function open(){return new Promise((ok,no)=>{let r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>{db=r.result;ok()};r.onerror=()=>no(r.error)})}
function get(){return new Promise((ok,no)=>{let r=db.transaction(STORE).objectStore(STORE).get("s");r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
function save(){return new Promise((ok,no)=>{let r=db.transaction(STORE,"readwrite").objectStore(STORE).put(s,"s");r.onsuccess=ok;r.onerror=()=>no(r.error)})}
function init(){s={version:8,pin:"1234",kids:[kid("Giuseppe",9,"rosso"),kid("Anna Chiara",7,"rosa"),kid("Elisabetta",5,"viola"),kid("Miriam",3,"verde")],lib:[],assign:{},groupLib:GROUPS.map(([icon,text,xp])=>({id:id(),icon,text,xp})),group:{date:today(),qid:null,done:{}},groupHistory:{},reward:{small:350,big:850}};ensure()}
function ensure(){
 s=s||{};const oldVersion=Number(s.version)||0;s.version=APP_VERSION;s.pin=s.pin||"1234";s.kids=Array.isArray(s.kids)?s.kids:[];s.lib=Array.isArray(s.lib)?s.lib:[];s.assign=s.assign&&typeof s.assign==="object"?s.assign:{};s.reward=s.reward||{small:350,big:850};s.groupLib=Array.isArray(s.groupLib)?s.groupLib:GROUPS.map(([icon,text,xp])=>({id:id(),icon,text,xp}));s.group=s.group&&typeof s.group==="object"?s.group:{date:today(),qid:null,done:{}};s.group.done=s.group.done&&typeof s.group.done==="object"?s.group.done:{};s.groupHistory=s.groupHistory&&typeof s.groupHistory==="object"?s.groupHistory:{};
 if(!s.kids.length)s.kids=[kid("Giuseppe",9,"rosso"),kid("Anna Chiara",7,"rosa"),kid("Elisabetta",5,"viola"),kid("Miriam",3,"verde")];
 const finalTexts=new Set(P.flatMap(x=>x[2].map(y=>y[1])));
 const oldTexts=new Set(["Metti a posto un gioco","Lavati i denti con un adulto","Metti via un vestito","Lavati le mani","Porta il tuo bicchiere a tavola","Metti un pupazzo al suo posto","Metti le scarpe al loro posto","Metti un oggetto nel suo cesto","Fai un piccolo aiuto in casa","Metti a posto i giochi","Lavati i denti","Vestiti da solo","Lavati le mani prima di mangiare","Metti i vestiti nel cesto","Porta il tuo piatto a tavola","Metti il bicchiere al suo posto","Sistema il cuscino o il letto","Aiuta a riordinare una stanza","Fai un piccolo aiuto senza che te lo chiedano","Metti a posto il pigiama","Prepara una cosa per domani","Aiuta in casa","Riordina tutti i giochi","Lavati i denti senza essere ricordato","Prepara i vestiti per domani","Sistema scarpe e giacca","Aiuta a preparare la tavola","Metti i tuoi vestiti nel cesto","Riordina ciò che hai usato","Guarda/leggi un libro per almeno 10 minuti","Aiuta un fratello o una sorella","Prenditi cura di una pianta o di un piccolo compito","Lascia in ordine il bagno dopo averlo usato","Prepara zaino e materiale","Leggi per almeno 15 minuti","Sistema il letto","Apparecchia o sparecchia la tavola","Metti a posto i tuoi vestiti","Riordina la tua stanza","Lascia ordinato il bagno dopo averlo usato","Aiuta un familiare senza che te lo chiedano","Fai un gesto gentile verso un fratello/sorella","Completa un compito iniziato senza abbandonarlo","Prepara da solo ciò che ti servirà domani","Svolgi una piccola responsabilità domestica","Leggi per almeno 20 minuti","Aiuta qualcuno senza che te lo chieda","Sistema il letto e la camera","Prepara autonomamente i vestiti per domani","Gestisci i tuoi vestiti senza sollecitazioni","Organizza ciò che serve per il giorno dopo","Porta a termine un compito prima di iniziarne un altro","Fai 20 minuti di attività senza distrazioni","Racconta a un adulto qualcosa che hai imparato","Organizza ciò che serve per domani","Gestisci 20 minuti di studio/attività","Svolgi una responsabilità domestica","Prepara zaino e materiale in autonomia","Mantieni in ordine camera e letto","Apparecchia o sparecchia senza essere ricordato","Gestisci autonomamente i tuoi vestiti","Collabora con un fratello/sorella","Porta a termine un'attività prima di passare ad altro","Completa 20 minuti senza distrazioni da schermi","Racconta o annota una cosa nuova che hai imparato","Svolgi una responsabilità domestica assegnata","Proponi un modo per migliorare un'attività di casa","Controlla da solo gli impegni del giorno dopo"]);
 if(oldVersion<APP_VERSION){const removedTexts=new Set(["Lavati le mani","Porta il tuo bicchiere a tavola","Metti un pupazzo al suo posto","Metti un oggetto nel suo cesto","Vestiti da solo","Lavati le mani prima di mangiare","Porta il tuo piatto a tavola","Metti il bicchiere al suo posto","Sistema il cuscino o il letto","Metti a posto il pigiama","Prepara una cosa per domani","Prepara i vestiti per domani","Aiuta a preparare la tavola","Lascia in ordine il bagno dopo averlo usato","Prepara zaino e materiale","Sistema il letto","Apparecchia o sparecchia la tavola","Lascia ordinato il bagno dopo averlo usato","Completa un compito iniziato senza abbandonarlo","Prepara da solo ciò che ti servirà domani","Prepara autonomamente i vestiti per domani","Gestisci i tuoi vestiti senza sollecitazioni","Organizza ciò che serve per il giorno dopo","Porta a termine un compito prima di iniziarne un altro","Fai 20 minuti di attività senza distrazioni","Organizza ciò che serve per domani","Prepara zaino e materiale in autonomia","Mantieni in ordine camera e letto","Apparecchia o sparecchia senza essere ricordato","Gestisci autonomamente i tuoi vestiti","Porta a termine un'attività prima di passare ad altro","Completa 20 minuti senza distrazioni da schermi"]);for(const k of s.kids){s.assign[k.id]=(s.assign[k.id]||[]).filter(qid=>{const q=s.lib.find(x=>x.id===qid);return !q||!removedTexts.has(q.text)});k.dailyPlan={};}s.lib=s.lib.filter(q=>!removedTexts.has(q.text));const removedGroups=new Set(["Mettere in ordine insieme libri e materiale scolastico","Preparare insieme la colazione","Fare una passeggiata insieme"]);s.groupLib=s.groupLib.filter(q=>!removedGroups.has(q.text));const old=s.groupLib.find(q=>q.text==="Risolvere insieme un enigma o rompicapo");if(old){old.text="Fare un puzzle insieme";old.icon="🧩";old.xp=20}[["🌱","Fare giardinaggio insieme",20],["🏡","Riordinare il cortile insieme",20]].forEach(([icon,text,xp])=>{if(!s.groupLib.some(q=>q.text===text))s.groupLib.push({id:id(),icon,text,xp})});}
 s.kids.forEach(k=>{k.age=Math.max(1,Math.min(14,Number(k.age)||7));k.theme=THEME_KEYS.includes(k.theme)?k.theme:"viola";k.avatar=k.avatar||"none";k.dailyBonus=k.dailyBonus&&typeof k.dailyBonus==="object"?k.dailyBonus:{};k.groupDone=k.groupDone&&typeof k.groupDone==="object"?k.groupDone:{};k.xp=Number(k.xp)||0;k.weekly=Number(k.weekly)||0;k.line=Number(k.line)||0;ensurePokeXP(k);k.done=k.done&&typeof k.done==="object"?k.done:{};k.dailyPlan=k.dailyPlan&&typeof k.dailyPlan==="object"?k.dailyPlan:{};s.assign[k.id]=Array.isArray(s.assign[k.id])?s.assign[k.id]:[];FIXED.forEach(f=>{let q=s.lib.find(x=>x.text===f.text);if(!q){q={id:id(),...f};s.lib.push(q)}else{q.icon=f.icon;q.xp=f.xp}if(!s.assign[k.id].includes(q.id))s.assign[k.id].push(q.id)})});
 if(s.group.date!==today()){s.group.date=today();s.group.qid=null;s.group.done={}}if(!s.group.qid&&s.groupLib.length){let used=Object.entries(s.groupHistory).filter(([d])=>weekKey(d)===weekKey()).map(([,q])=>q);let choices=s.groupLib.filter(q=>!used.includes(q.id));if(!choices.length)choices=s.groupLib.slice();let seed=[...today()].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),13);s.group.qid=choices[seed%choices.length].id;s.groupHistory[today()]=s.group.qid}
}
async function boot(){
 try{await open();s=await get();if(!s)init();ensure();await save();active=s.kids[0]?.id||null;render()}
 catch(e){console.error(e);$("#app").innerHTML=`<div class="card"><h2>⚠️ Errore di caricamento</h2><p>Il browser ha bloccato il salvataggio locale.</p><p class="small">${esc(e?.message||e)}</p><button onclick="location.reload()">Ricarica</button></div>`}
}
function assigned(k){return(s.assign[k.id]||[]).map(x=>s.lib.find(q=>q.id===x)).filter(Boolean)}
function done(k,q){return!!k.done[today()+"|"+q.id]}
function render(){
 const k=s.kids.find(x=>x.id===active);
 if(!k){$("#app").innerHTML="";return}
 let currentXP=pokeXP(k);let l=lvl(currentXP),z=st(l),p=L[k.line];
 let tabs=s.kids.map(x=>`<button class="kid-tab theme-${x.theme} ${x.id===active?"active":""}" data-k="${x.id}">${x.avatar && x.avatar!=="none" ? esc(x.avatar)+" " : ""}${esc(x.name)}</button>`).join("");
 let html=`<div class="kids">${tabs}</div>
 <div class="theme-page ${k.age<=6?"simple":""}" style="--theme:${THEMES[k.theme].strong};--theme-soft:${THEMES[k.theme].soft}">
 <div class="card hero"><img src="${img(p[3+z])}"><div>
 <div class="row between"><b class="theme-name" style="font-size:1.3rem">${p[z]}</b><span class="chip">Lv ${l}</span></div>
 <div class="small">${p[0]} → ${p[1]} → ${p[2]}</div>
 <div class="progress"><div class="bar" style="width:${currentXP%100}%"></div></div>
 <div class="row"><span class="chip">⭐ ${currentXP} XP</span><span class="chip">📅 ${k.weekly} XP</span></div>
 </div></div>
 <div class="tabs"><button class="${tab==="quests"?"active":""}" data-t="quests">${k.age<=6?"⭐ Le mie missioni":"📜 Quest"}</button><button class="${tab==="pokemon"?"active":""}" data-t="pokemon">⚡ Pokémon</button><button class="${tab==="progress"?"active":""}" data-t="progress">🏆 Progressi</button></div>
 ${pane(k)}</div></div>`;
 $("#app").innerHTML=html;bind();
}
function speakQuest(text){
 if(!("speechSynthesis"in window)){alert("La lettura vocale non è disponibile su questo dispositivo.");return}
 speechSynthesis.cancel();
 let u=new SpeechSynthesisUtterance(text);u.lang="it-IT";u.rate=.9;speechSynthesis.speak(u);
}
function pane(k){
 if(tab==="quests"){
  let qs=dailyQs(k),doneN=qs.filter(q=>done(k,q)).length;
  if(k.age<=6){
   return `<div class="pane active card"><div class="row between"><h2>⭐ Missioni</h2><span class="chip">${doneN}/${qs.length}</span></div>
   <p class="small">Tocca 🔊 per ascoltare la missione.</p>
   ${qs.map(q=>{let d=done(k,q);return `<div class="quest ${d?"done":""}"><span class="icon">${q.icon}</span><span class="text">${esc(q.text)} <span class="small">+${q.xp ?? 10} XP</span></span><button data-speak="${esc(q.text)}">🔊</button><button data-q="${q.id}">${d?"↩️":"✅"}</button></div>`}).join("")}
   <div class="small">10 missioni al giorno. I punti dipendono dalla difficoltà e dal tempo richiesto. Completandole tutte ottieni il bonus di completamento della giornata, senza XP extra.</div>${groupCard(k)}</div>`;
  }
  return `<div class="pane active card"><div class="row between"><h2>Quest di oggi</h2><span class="chip">${doneN}/${qs.length}</span></div>
  ${qs.map(q=>{let d=done(k,q);return `<div class="quest ${d?"done":""}"><span class="icon">${q.icon}</span><span class="text">${esc(q.text)} <span class="small">+${q.xp ?? 10} XP</span></span><button data-q="${q.id}">${d?"↩️ Annulla":"✅ Fatto"}</button></div>`}).join("")}
  <div class="small">10 Quest al giorno. Ogni Quest vale XP diversi in base alla difficoltà/tempo. Completandole tutte ottieni il bonus di completamento della giornata, senza XP extra.</div>${groupCard(k)}</div>`;
 }
 if(tab==="pokemon")return`<div class="pane active card"><h2>⚡ Scegli il tuo Pokémon</h2><p class="small">Ogni bambino ha una scelta indipendente. Lo stesso Pokémon può essere scelto da più bambini.</p><div class="grid">${L.map((p,i)=>`<div class="poke ${i===k.line?"selected":""}"><img src="${img(p[3])}"><b>${p[0]}</b><div class="small">${p[1]} → ${p[2]}</div><button data-p="${i}">${i===k.line?"✓ Scelto":"Scegli"}</button></div>`).join("")}</div></div>`;
 return`<div class="pane active card"><h2>🏆 Progressi</h2><div class="grid"><div class="chip">Livello ${lvl(pokeXP(k))}/30</div><div class="chip">XP totale ${pokeXP(k)}</div><div class="chip">XP settimana ${k.weekly}</div></div><p>${lvl(pokeXP(k))<30?`Mancano ${lvl(pokeXP(k))*100-pokeXP(k)} XP al prossimo livello.`:"🎉 Livello massimo!"}</p><div class="card">🎁 Piccola ricompensa: <b>${s.reward.small} XP</b> settimanali<br>🏆 Grande ricompensa: <b>${s.reward.big} XP</b> settimanali</div></div>`;
}
function bind(){
 document.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{active=b.dataset.k;tab="quests";render()});
 document.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()});
 document.querySelectorAll("[data-p]").forEach(b=>b.onclick=async()=>{let kk=s.kids.find(k=>k.id===active);kk.line=+b.dataset.p;kk.xp=pokeXP(kk);await save();render()});
 document.querySelectorAll("[data-speak]").forEach(b=>b.onclick=()=>speakQuest(b.dataset.speak));
 bindGroup();
 document.querySelectorAll("[data-q]").forEach(b=>b.onclick=async()=>{
   let k=s.kids.find(x=>x.id===active),q=s.lib.find(x=>x.id===b.dataset.q),key=today()+"|"+q.id,d=!!k.done[key];
   let qs=dailyQs(k), base=dailyXP(k,q);
   if(d){
    // Read the earned XP BEFORE removing the completion marker.
    // Also revoke the daily-completion bonus if this cancellation means the day is no longer complete.
    let earned=Number(k.done[key+"|earned"]||base);
    let earnedLine=Number(k.done[key+"|line"] ?? k.line);
    delete k.done[key];delete k.done[key+"|earned"];delete k.done[key+"|line"];
    k.pokeXp[earnedLine]=Math.max(0,Number(k.pokeXp[earnedLine]||0)-earned);
    k.xp=pokeXP(k);k.weekly=Math.max(0,k.weekly-earned);
    let remaining=qs.filter(x=>done(k,x)).length;
    let bonus=Number(k.dailyBonus?.[today()]||0);
    if(bonus && remaining<qs.length){
      let bonusLine=Number(k.dailyBonus?.[today()+"|line"] ?? k.line);
      k.pokeXp[bonusLine]=Math.max(0,Number(k.pokeXp[bonusLine]||0)-bonus);
      k.xp=pokeXP(k);k.weekly=Math.max(0,k.weekly-bonus);
      delete k.dailyBonus[today()];delete k.dailyBonus[today()+"|line"];
    }
   }
   else{
    let earnedLine=k.line;
    k.done[key]=1;k.done[key+"|earned"]=base;k.done[key+"|line"]=earnedLine;k.pokeXp[earnedLine]=Math.min(3000,Number(k.pokeXp[earnedLine]||0)+base);k.xp=pokeXP(k);k.weekly+=base;
    // Completing all 10 Quest gives a completion marker, not extra XP.
    let all=qs.length>0 && qs.every(x=>done(k,x));
    if(all){k.dailyBonus[today()]=1;k.dailyBonus[today()+"|line"]=k.line}
   }
   await save();render();
 });
}
function bindGroup(){document.querySelectorAll("[data-gq]").forEach(b=>b.onclick=async()=>{let k=s.kids.find(x=>x.id===active),q=groupQuest();if(!k||!q)return;k.groupDone=k.groupDone||{};let xp=q.xp||15;if(groupDone(k)){let earned=Number(k.groupDone["xp|"+today()]||xp);let earnedLine=Number(k.groupDone["line|"+today()] ?? k.line);delete k.groupDone[today()];delete k.groupDone["xp|"+today()];delete k.groupDone["line|"+today()];k.pokeXp[earnedLine]=Math.max(0,Number(k.pokeXp[earnedLine]||0)-earned);k.xp=pokeXP(k);k.weekly=Math.max(0,k.weekly-earned)}else{let earnedLine=k.line;k.groupDone[today()]=1;k.groupDone["xp|"+today()]=xp;k.groupDone["line|"+today()]=earnedLine;k.pokeXp[earnedLine]=Math.min(3000,Number(k.pokeXp[earnedLine]||0)+xp);k.xp=pokeXP(k);k.weekly+=xp}await save();render()})}
function admin(){let m=$("#modal");m.innerHTML=`<div style="overflow:auto"><div class="row between"><h2>🔐 Area adulti</h2><button id="close">Chiudi</button></div><div class="tabs"><button data-a="kids">👨‍👩‍👧 Bambini</button><button data-a="quests">📜 Quest giornaliere</button><button data-a="groups">👨‍👩‍👧‍👦 Quest di gruppo</button><button data-a="data">💾 Dati</button></div><div id="ab"></div></div>`;m.showModal();$("#close").onclick=()=>m.close();document.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>adminPane(b.dataset.a));adminPane("kids")}
function adminPane(t){
 let b=$("#ab");
 if(t==="kids")b.innerHTML=`<div class="card"><button id="add">＋ Aggiungi bambino</button></div>${s.kids.map(k=>`<div class="list"><label>Nome</label><input data-n="${k.id}" value="${esc(k.name)}"><label>Età (fino a 6 = modalità semplificata)</label><input data-age="${k.id}" type="number" min="1" max="14" value="${k.age}"><label>Tema colore</label><select data-theme="${k.id}">${THEME_KEYS.map(t=>`<option value="${t}" ${k.theme===t?"selected":""}>${THEMES[t].name}</option>`).join("")}</select><label>Avatar</label><select data-avatar="${k.id}"><option value="none" ${!k.avatar||k.avatar==="none"?"selected":""}>Nessuno</option><option value="🙂" ${k.avatar==="🙂"?"selected":""}>🙂</option><option value="👧" ${k.avatar==="👧"?"selected":""}>👧</option><option value="👦" ${k.avatar==="👦"?"selected":""}>👦</option><option value="🧒" ${k.avatar==="🧒"?"selected":""}>🧒</option><option value="🐉" ${k.avatar==="🐉"?"selected":""}>🐉</option><option value="⭐" ${k.avatar==="⭐"?"selected":""}>⭐</option><option value="⚡" ${k.avatar==="⚡"?"selected":""}>⚡</option></select><div class="theme-preview" style="background:${THEMES[k.theme].soft};color:${THEMES[k.theme].strong};border-color:${THEMES[k.theme].strong}">Anteprima tema: ${THEMES[k.theme].name}</div><button data-save="${k.id}">Salva</button> <button data-del="${k.id}" style="background:#d63031">Elimina</button></div>`).join("")}`;
 else if(t==="quests")b.innerHTML=`<div class="card"><h3>📜 Quest giornaliere</h3><p class="small">Le Quest personali comprendono 5 attività fisse e 5 variabili ogni giorno.</p><button id="newq">＋ Nuova Quest</button></div>${s.lib.map(q=>`<div class="list"><b>${q.icon} ${esc(q.text)}</b><div class="small">⭐ ${q.xp ?? 10} XP · Assegnata a: ${s.kids.filter(k=>(s.assign[k.id]||[]).includes(q.id)).map(k=>esc(k.name)).join(", ")||"nessuno"}</div><button data-e="${q.id}">Modifica</button><button data-as="${q.id}">Assegna</button><button data-delq="${q.id}" class="danger">🗑️ Elimina</button></div>`).join("")}`;
 else if(t==="groups")b.innerHTML=`<div class="card"><h3>👨‍👩‍👧‍👦 Quest di gruppo</h3><p class="small">Una Quest al giorno, scelta casualmente e senza ripetizioni nella stessa settimana. Ogni bambino riceve gli XP quando la completa.</p><button id="newg">＋ Nuova Quest di gruppo</button></div>${s.groupLib.map(q=>`<div class="list"><b>${q.icon} ${esc(q.text)}</b><div class="small">⭐ ${q.xp ?? 15} XP</div><button data-eg="${q.id}">Modifica</button><button data-dg="${q.id}" class="danger">🗑️ Elimina</button></div>`).join("")}`;
 else b.innerHTML=`<div class="card"><button id="export">Esporta backup JSON</button><input id="import" type="file" accept=".json"><p class="small">Il backup contiene profili, XP, Pokémon, Quest, Quest di gruppo, assegnazioni e impostazioni.</p><hr><input id="pin" type="password" placeholder="Nuovo PIN"><button id="pinb">Cambia PIN</button></div>`;
 bindAdmin();
}
function bindAdmin(){
 $("#add")?.addEventListener("click",()=>{let n=prompt("Nome?");if(!n)return;let a=Math.max(1,Math.min(14,+prompt("Età (1-14)?","7")||7)),k=kid(n,a,"viola");s.kids.push(k);s.assign[k.id]=[];ensure();save().then(()=>{render();adminPane("kids")})});
 document.querySelectorAll("[data-save]").forEach(b=>b.onclick=async()=>{let k=s.kids.find(x=>x.id===b.dataset.save);k.name=$(`[data-n="${k.id}"]`).value||k.name;k.age=Math.max(1,Math.min(14,+$(`[data-age="${k.id}"]`).value||7));k.theme=$(`[data-theme="${k.id}"]`).value||"viola";k.avatar=$(`[data-avatar="${k.id}"]`).value||"none";s.assign[k.id]=Array.isArray(s.assign[k.id])?s.assign[k.id]:[];ensure();await save();render();adminPane("kids")});
 document.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{if(!confirm("Eliminare il profilo?"))return;let i=b.dataset.del;s.kids=s.kids.filter(k=>k.id!==i);delete s.assign[i];active=s.kids[0]?.id;await save();render();adminPane("kids")});
 $("#newq")?.addEventListener("click",()=>{let tx=prompt("Testo Quest");if(!tx)return;let xv=Math.max(5,Math.min(30,+prompt("XP (5-30)",String(xpForText(tx)))||xpForText(tx)));s.lib.push({id:id(),icon:prompt("Icona","⭐")||"⭐",text:tx,xp:xv});save().then(()=>adminPane("quests"))});
 document.querySelectorAll("[data-e]").forEach(b=>b.onclick=async()=>{let q=s.lib.find(x=>x.id===b.dataset.e),tx=prompt("Testo",q.text);if(tx===null)return;q.text=tx;q.icon=prompt("Icona",q.icon)||q.icon;q.xp=Math.max(5,Math.min(30,+prompt("XP (5-30)",String(q.xp||xpForText(q.text)))||q.xp||xpForText(q.text)));await save();adminPane("quests");render()});
 document.querySelectorAll("[data-as]").forEach(b=>b.onclick=()=>{let q=s.lib.find(x=>x.id===b.dataset.as);let lines=s.kids.map((k,i)=>`${i+1}. ${k.name} ${s.assign[k.id]?.includes(q.id)?"[X]":"[ ]"}`).join("\n");let v=prompt(`Quest: ${q.text}\n\nInserisci i numeri dei bambini a cui assegnarla.\nPer togliere un bambino, non inserire il suo numero.`,lines);if(v===null)return;let selected=new Set(v.split(",").map(x=>+x.trim()-1).filter(i=>i>=0&&i<s.kids.length));s.kids.forEach((k,i)=>{s.assign[k.id]=Array.isArray(s.assign[k.id])?s.assign[k.id]:[];let has=s.assign[k.id].includes(q.id);if(selected.has(i)&&!has)s.assign[k.id].push(q.id);if(!selected.has(i)&&has)s.assign[k.id]=s.assign[k.id].filter(x=>x!==q.id)});save().then(()=>{adminPane("quests");render()})});
 document.querySelectorAll("[data-delq]").forEach(b=>b.onclick=async()=>{let q=s.lib.find(x=>x.id===b.dataset.delq);if(!q)return;if(!confirm(`Eliminare la Quest "${q.text}"?\n\nVerrà rimossa dalla libreria e dalle assegnazioni di tutti i bambini.`))return;s.lib=s.lib.filter(x=>x.id!==q.id);s.kids.forEach(k=>{s.assign[k.id]=(s.assign[k.id]||[]).filter(x=>x!==q.id)});await save();adminPane("quests");render()});
 $("#newg")?.addEventListener("click",()=>{let tx=prompt("Testo Quest di gruppo");if(!tx)return;let xv=Math.max(5,Math.min(30,+prompt("XP (5-30)","15")||15));s.groupLib.push({id:id(),icon:prompt("Icona","🤝")||"🤝",text:tx,xp:xv});save().then(()=>adminPane("groups"))});
 document.querySelectorAll("[data-eg]").forEach(b=>b.onclick=async()=>{let q=s.groupLib.find(x=>x.id===b.dataset.eg);if(!q)return;let tx=prompt("Testo",q.text);if(tx===null)return;q.text=tx;q.icon=prompt("Icona",q.icon)||q.icon;q.xp=Math.max(5,Math.min(30,+prompt("XP (5-30)",String(q.xp||15))||q.xp||15));await save();adminPane("groups");render()});
 document.querySelectorAll("[data-dg]").forEach(b=>b.onclick=async()=>{let q=s.groupLib.find(x=>x.id===b.dataset.dg);if(!q)return;if(s.groupLib.length<=1)return alert("Deve rimanere almeno una Quest di gruppo.");if(!confirm(`Eliminare la Quest di gruppo "${q.text}"?`))return;s.groupLib=s.groupLib.filter(x=>x.id!==q.id);s.groupHistory=Object.fromEntries(Object.entries(s.groupHistory||{}).filter(([,v])=>v!==q.id));if(s.group.qid===q.id)s.group.qid=null;await save();ensure();await save();adminPane("groups");render()});
 $("#export")?.addEventListener("click",()=>{let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(s,null,2)],{type:"application/json"}));a.download="pokemon-quest-backup.json";a.click()});
 $("#import")?.addEventListener("change",async e=>{let f=e.target.files[0];if(!f)return;try{s=JSON.parse(await f.text());ensure();await save();active=s.kids[0]?.id;render();alert("Backup ripristinato")}catch{alert("Backup non valido")}});
 $("#pinb")?.addEventListener("click",async()=>{let p=$("#pin").value;if(p.length<4)return alert("PIN troppo corto");s.pin=p;await save();alert("PIN cambiato")});
}

$("#adult").onclick=()=>{let m=$("#modal");m.innerHTML=`<h2>🔐 Area adulti</h2><input id="pp" type="password" inputmode="numeric" placeholder="PIN"><p id="err" class="small"></p><button id="go">Accedi</button> <button id="cc">Chiudi</button>`;m.showModal();$("#cc").onclick=()=>m.close();$("#go").onclick=()=>$("#pp").value===s.pin?(m.close(),admin()):$("#err").textContent="PIN non corretto."};
(async()=>{await boot();if("serviceWorker"in navigator&&location.protocol!=="file:")navigator.serviceWorker.register("service-worker.js").catch(()=>{})})();