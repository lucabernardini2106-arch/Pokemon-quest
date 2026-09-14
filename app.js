const DB="pokemonQuestV7",STORE="state";
const THEMES={rosso:{name:"Rosso",strong:"#d63031",soft:"#fff1f1"},rosa:{name:"Rosa",strong:"#e84393",soft:"#fff0f7"},viola:{name:"Viola",strong:"#6c5ce7",soft:"#f2efff"},verde:{name:"Verde",strong:"#00a86b",soft:"#effbf5"},blu:{name:"Blu",strong:"#2878d4",soft:"#eef6ff"},arancione:{name:"Arancione",strong:"#e67e22",soft:"#fff5e9"},oro:{name:"Giallo Oro",strong:"#c79500",soft:"#fff9df"}};
const THEME_KEYS=Object.keys(THEMES);
const L=[
["Bulbasaur","Ivysaur","Venusaur",1,2,3],["Charmander","Charmeleon","Charizard",4,5,6],["Squirtle","Wartortle","Blastoise",7,8,9],
["Treecko","Grovyle","Sceptile",252,253,254],["Torchic","Combusken","Blaziken",255,256,257],["Mudkip","Marshtomp","Swampert",258,259,260],
["Chikorita","Bayleef","Meganium",152,153,154],["Cyndaquil","Quilava","Typhlosion",155,156,157],["Totodile","Croconaw","Feraligatr",158,159,160],
["Turtwig","Grotle","Torterra",387,388,389],["Chimchar","Monferno","Infernape",390,391,392],["Piplup","Prinplup","Empoleon",393,394,395]];
const P=[
[1,2,[["🧸","Metti a posto un gioco"],["🪥","Lavati i denti con un adulto"],["👕","Metti via un vestito"],["🧼","Lavati le mani"],["🥄","Porta il tuo bicchiere a tavola"],["🧸","Metti un pupazzo al suo posto"],["👟","Metti le scarpe al loro posto"],["🧺","Metti un oggetto nel suo cesto"],["❤️","Fai un piccolo aiuto in casa"]]],
[3,4,[["🧸","Metti a posto i giochi"],["🪥","Lavati i denti"],["👕","Vestiti da solo"],["🧼","Lavati le mani prima di mangiare"],["👟","Metti le scarpe al loro posto"],["🧺","Metti i vestiti nel cesto"],["🍽️","Porta il tuo piatto a tavola"],["🥤","Metti il bicchiere al suo posto"],["🛏️","Sistema il cuscino o il letto"],["🧹","Aiuta a riordinare una stanza"],["❤️","Fai un piccolo aiuto senza che te lo chiedano"]]],
[5,6,[["🛏️","Metti a posto il pigiama"],["🎒","Prepara una cosa per domani"],["❤️","Aiuta in casa"],["🧸","Riordina tutti i giochi"],["🪥","Lavati i denti senza essere ricordato"],["👕","Prepara i vestiti per domani"],["👟","Sistema scarpe e giacca"],["🍽️","Aiuta a preparare la tavola"],["🧺","Metti i tuoi vestiti nel cesto"],["🧹","Riordina ciò che hai usato"],["📚","Guarda/leggi un libro per almeno 10 minuti"],["🤝","Aiuta un fratello o una sorella"],["🌱","Prenditi cura di una pianta o di un piccolo compito"],["🧼","Lascia in ordine il bagno dopo averlo usato"]]],
[7,8,[["🎒","Prepara zaino e materiale"],["🧹","Riordina ciò che hai usato"],["📚","Leggi per almeno 15 minuti"],["🛏️","Sistema il letto"],["👕","Prepara i vestiti per domani"],["🍽️","Apparecchia o sparecchia la tavola"],["🧺","Metti a posto i tuoi vestiti"],["🧸","Riordina la tua stanza"],["🧼","Lascia ordinato il bagno dopo averlo usato"],["❤️","Aiuta un familiare senza che te lo chiedano"],["🤝","Fai un gesto gentile verso un fratello/sorella"],["🎯","Completa un compito iniziato senza abbandonarlo"],["🧠","Prepara da solo ciò che ti servirà domani"],["🌱","Svolgi una piccola responsabilità domestica"]]],
[9,10,[["🎒","Prepara zaino e materiale"],["🧹","Riordina ciò che hai usato"],["📚","Leggi per almeno 20 minuti"],["❤️","Aiuta qualcuno senza che te lo chieda"],["🛏️","Sistema il letto e la camera"],["👕","Prepara autonomamente i vestiti per domani"],["🍽️","Apparecchia o sparecchia la tavola"],["🧺","Gestisci i tuoi vestiti senza sollecitazioni"],["🧼","Lascia in ordine il bagno dopo averlo usato"],["🤝","Aiuta un fratello/sorella in una difficoltà"],["🧠","Organizza ciò che serve per il giorno dopo"],["🎯","Porta a termine un compito prima di iniziarne un altro"],["⏱️","Fai 20 minuti di attività senza distrazioni"],["🌱","Svolgi una responsabilità domestica"],["📖","Racconta a un adulto qualcosa che hai imparato"]]],
[11,14,[["🧠","Organizza ciò che serve per domani"],["📚","Leggi per almeno 20 minuti"],["❤️","Aiuta qualcuno senza che te lo chieda"],["⏱️","Gestisci 20 minuti di studio/attività"],["🧹","Svolgi una responsabilità domestica"],["🎒","Prepara zaino e materiale in autonomia"],["🛏️","Mantieni in ordine camera e letto"],["🍽️","Apparecchia o sparecchia senza essere ricordato"],["🧺","Gestisci autonomamente i tuoi vestiti"],["🤝","Collabora con un fratello/sorella"],["🎯","Porta a termine un'attività prima di passare ad altro"],["📵","Completa 20 minuti senza distrazioni da schermi"],["📖","Racconta o annota una cosa nuova che hai imparato"],["🌱","Svolgi una responsabilità domestica assegnata"],["💡","Proponi un modo per migliorare un'attività di casa"],["🗓️","Controlla da solo gli impegni del giorno dopo"]]]
];
let db,s,active,tab="quests";
const $=s=>document.querySelector(s);
const img=id=>`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(id).padStart(3,"0")}.png`;
const id=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random();
const today=()=>new Date().toISOString().slice(0,10);
const lvl=x=>Math.min(30,Math.floor(x/100)+1),st=l=>l>=20?2:l>=10?1:0;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function pool(a){return(P.find(x=>a>=x[0]&&a<=x[1])||P[4])[2]}
function xpForText(t){let x=String(t).toLowerCase();if(/20 minuti|15 minuti|20 min|senza distrazioni|studio|attività fisica/.test(x))return 15;if(/10 minuti|leggi|leggere|libro|impara|imparato|organizza|responsabilità|autonomamente|senza che te lo chied/.test(x))return 10;return 5}
function dailyQs(k){let all=assigned(k);if(all.length<=10)return all;let seed=[...today(),...String(k.id)].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),7);let arr=all.map(q=>({q,r:((seed=(seed*1664525+1013904223)>>>0)/4294967296)})).sort((a,b)=>a.r-b.r).map(x=>x.q);let target=100, n=Math.min(10,arr.length), chosen=[];
  // Prefer an exact 100-XP set when possible; otherwise choose the closest set below 100.
  function find(start,need,count,sel){if(count===0)return need===0?sel:null;if(arr.length-start<count||need<5)return null;for(let i=start;i<=arr.length-count;i++){let x=Math.max(5,Math.min(30,Number(arr[i].xp)||10));let r=find(i+1,need-x,count-1,sel.concat(arr[i]));if(r)return r}return null}
  let exact=find(0,target,n,[]);if(exact)return exact;
  let best=null,bestSum=-1;
  function bestUnder(start,need,count,sel){if(count===0){let sum=target-need;if(sum>bestSum){bestSum=sum;best=sel}return}if(arr.length-start<count)return;for(let i=start;i<=arr.length-count;i++){let x=Math.max(5,Math.min(30,Number(arr[i].xp)||10));if(need-x<0)continue;bestUnder(i+1,need-x,count-1,sel.concat(arr[i]))}}
  bestUnder(0,target,n,[]);return best||arr.slice(0,n)}
function kid(n,a,theme="viola",avatar="none"){return{id:id(),name:n,age:a,xp:0,weekly:0,line:0,dailyBonus:{},theme:THEME_KEYS.includes(theme)?theme:"viola",avatar:avatar||"none",done:{}}}
function open(){return new Promise((ok,no)=>{let r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>{db=r.result;ok()};r.onerror=()=>no(r.error)})}
function get(){return new Promise((ok,no)=>{let r=db.transaction(STORE).objectStore(STORE).get("s");r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
function save(){return new Promise((ok,no)=>{let r=db.transaction(STORE,"readwrite").objectStore(STORE).put(s,"s");r.onsuccess=ok;r.onerror=()=>no(r.error)})}
function init(){s={version:7,pin:"1234",kids:[kid("Giuseppe",9,"rosso"),kid("Anna Chiara",7,"rosa"),kid("Elisabetta",5,"viola"),kid("Miriam",3,"verde")],lib:[],assign:{},group:{icon:"🤝",text:"Fate insieme qualcosa di utile in casa",done:false,date:today()},reward:{small:350,big:850}};ensure()}
function ensure(){
 s=s||{}; s.version=7; s.pin=s.pin||"1234"; s.kids=Array.isArray(s.kids)?s.kids:[]; s.lib=Array.isArray(s.lib)?s.lib:[]; s.assign=s.assign&&typeof s.assign==="object"?s.assign:{}; s.reward=s.reward||{small:350,big:850}; s.group=s.group||{icon:"🤝",text:"Fate insieme qualcosa di utile in casa",done:false,date:today()};
 if(!s.kids.length){s.kids=[kid("Giuseppe",9,"rosso"),kid("Anna Chiara",7,"rosa"),kid("Elisabetta",5,"viola"),kid("Miriam",3,"verde")]}
 s.kids.forEach(k=>{k.age=Math.max(1,Math.min(14,Number(k.age)||7));k.theme=THEME_KEYS.includes(k.theme)?k.theme:"viola";k.avatar=k.avatar||"none";k.dailyBonus=k.dailyBonus&&typeof k.dailyBonus==="object"?k.dailyBonus:{};k.xp=Number(k.xp)||0;k.weekly=Number(k.weekly)||0;k.line=Number(k.line)||0;k.done=k.done&&typeof k.done==="object"?k.done:{};s.assign[k.id]=Array.isArray(s.assign[k.id])?s.assign[k.id]:[];pool(Math.max(3,k.age)).forEach(([ic,t])=>{let q=s.lib.find(x=>x.text===t);if(!q){q={id:id(),icon:ic,text:t,xp:xpForText(t)};s.lib.push(q)}else{q.xp=Math.max(5,Math.min(30,Number(q.xp)||xpForText(q.text)))}if(!s.assign[k.id].includes(q.id))s.assign[k.id].push(q.id)})});
 if(s.group.date!==today()){s.group.done=false;s.group.date=today()}
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
 let l=lvl(k.xp),z=st(l),p=L[k.line];
 let tabs=s.kids.map(x=>`<button class="kid-tab theme-${x.theme} ${x.id===active?"active":""}" data-k="${x.id}">${x.avatar && x.avatar!=="none" ? esc(x.avatar)+" " : ""}${esc(x.name)}</button>`).join("");
 let html=`<div class="kids">${tabs}</div>
 <div class="theme-page ${k.age<=6?"simple":""}" style="--theme:${THEMES[k.theme].strong};--theme-soft:${THEMES[k.theme].soft}">
 <div class="card hero"><img src="${img(p[3+z])}"><div>
 <div class="row between"><b class="theme-name" style="font-size:1.3rem">${p[z]}</b><span class="chip">Lv ${l}</span></div>
 <div class="small">${p[0]} → ${p[1]} → ${p[2]}</div>
 <div class="progress"><div class="bar" style="width:${k.xp%100}%"></div></div>
 <div class="row"><span class="chip">⭐ ${k.xp} XP</span><span class="chip">📅 ${k.weekly} XP</span></div>
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
   ${qs.map(q=>{let d=done(k,q);return `<div class="quest ${d?"done":""}"><span class="icon">${q.icon}</span><span class="text">${esc(q.text)} <span class="small">+${q.xp||10} XP</span></span><button data-speak="${esc(q.text)}">🔊</button><button data-q="${q.id}">${d?"↩️":"✅"}</button></div>`}).join("")}
   <div class="small">10 missioni al giorno. I punti dipendono dalla difficoltà e dal tempo richiesto. Completandole tutte raggiungi il prossimo livello.</div></div>`;
  }
  return `<div class="pane active card"><div class="row between"><h2>Quest di oggi</h2><span class="chip">${doneN}/${qs.length}</span></div>
  ${qs.map(q=>{let d=done(k,q);return `<div class="quest ${d?"done":""}"><span class="icon">${q.icon}</span><span class="text">${esc(q.text)} <span class="small">+${q.xp||10} XP</span></span><button data-q="${q.id}">${d?"↩️ Annulla":"✅ Fatto"}</button></div>`}).join("")}
  <div class="small">10 Quest al giorno. Ogni Quest vale XP diversi in base alla difficoltà/tempo. Completandole tutte raggiungi il prossimo livello.</div></div>`;
 }
 if(tab==="pokemon")return`<div class="pane active card"><h2>⚡ Scegli il tuo Pokémon</h2><p class="small">Ogni bambino ha una scelta indipendente. Lo stesso Pokémon può essere scelto da più bambini.</p><div class="grid">${L.map((p,i)=>`<div class="poke ${i===k.line?"selected":""}"><img src="${img(p[3])}"><b>${p[0]}</b><div class="small">${p[1]} → ${p[2]}</div><button data-p="${i}">${i===k.line?"✓ Scelto":"Scegli"}</button></div>`).join("")}</div></div>`;
 return`<div class="pane active card"><h2>🏆 Progressi</h2><div class="grid"><div class="chip">Livello ${lvl(k.xp)}/30</div><div class="chip">XP totale ${k.xp}</div><div class="chip">XP settimana ${k.weekly}</div></div><p>${lvl(k.xp)<30?`Mancano ${lvl(k.xp)*100-k.xp} XP al prossimo livello.`:"🎉 Livello massimo!"}</p><div class="card">🎁 Piccola ricompensa: <b>${s.reward.small} XP</b> settimanali<br>🏆 Grande ricompensa: <b>${s.reward.big} XP</b> settimanali</div></div>`;
}
function bind(){
 document.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{active=b.dataset.k;tab="quests";render()});
 document.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()});
 document.querySelectorAll("[data-p]").forEach(b=>b.onclick=async()=>{s.kids.find(k=>k.id===active).line=+b.dataset.p;await save();render()});
 document.querySelectorAll("[data-speak]").forEach(b=>b.onclick=()=>speakQuest(b.dataset.speak));
 document.querySelectorAll("[data-q]").forEach(b=>b.onclick=async()=>{
   let k=s.kids.find(x=>x.id===active),q=s.lib.find(x=>x.id===b.dataset.q),key=today()+"|"+q.id,d=!!k.done[key];
   let qs=dailyQs(k), base=Math.max(5,Math.min(30,Number(q.xp)||10));
   if(d){delete k.done[key];let earned=Number(k.done[key+"|earned"]||0);k.xp=Math.max(0,k.xp-(earned||base));k.weekly=Math.max(0,k.weekly-(earned||base));delete k.done[key+"|earned"]}
   else{k.done[key]=1;k.done[key+"|earned"]=base;k.xp=Math.min(3000,k.xp+base);k.weekly+=base;
    let all=qs.every(x=>done(k,x));
    if(all){let total=qs.reduce((a,x)=>a+(Number(x.xp)||10),0);let bonus=Math.max(0,100-total);if(bonus){k.xp=Math.min(3000,k.xp+bonus);k.weekly+=bonus;k.dailyBonus[today()]=bonus}}
   }
   await save();render();
 });
}
function admin(){let m=$("#modal");m.innerHTML=`<div style="overflow:auto"><div class="row between"><h2>🔐 Area adulti</h2><button id="close">Chiudi</button></div><div class="tabs"><button data-a="kids">👨‍👩‍👧 Bambini</button><button data-a="quests">📜 Quest</button><button data-a="data">💾 Dati</button></div><div id="ab"></div></div>`;m.showModal();$("#close").onclick=()=>m.close();document.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>adminPane(b.dataset.a));adminPane("kids")}
function adminPane(t){let b=$("#ab");if(t==="kids")b.innerHTML=`<div class="card"><button id="add">＋ Aggiungi bambino</button></div>${s.kids.map(k=>`<div class="list"><label>Nome</label><input data-n="${k.id}" value="${esc(k.name)}"><label>Età (fino a 6 = modalità semplificata)</label><input data-age="${k.id}" type="number" min="1" max="14" value="${k.age}"><label>Tema colore</label><select data-theme="${k.id}">${THEME_KEYS.map(t=>`<option value="${t}" ${k.theme===t?"selected":""}>${THEMES[t].name}</option>`).join("")}</select><label>Avatar</label><select data-avatar="${k.id}"><option value="none" ${!k.avatar||k.avatar==="none"?"selected":""}>Nessuno</option><option value="🙂" ${k.avatar==="🙂"?"selected":""}>🙂</option><option value="👧" ${k.avatar==="👧"?"selected":""}>👧</option><option value="👦" ${k.avatar==="👦"?"selected":""}>👦</option><option value="🧒" ${k.avatar==="🧒"?"selected":""}>🧒</option><option value="🐉" ${k.avatar==="🐉"?"selected":""}>🐉</option><option value="⭐" ${k.avatar==="⭐"?"selected":""}>⭐</option><option value="⚡" ${k.avatar==="⚡"?"selected":""}>⚡</option></select><div class="theme-preview" style="background:${THEMES[k.theme].soft};color:${THEMES[k.theme].strong};border-color:${THEMES[k.theme].strong}">Anteprima tema: ${THEMES[k.theme].name}</div><button data-save="${k.id}">Salva</button> <button data-del="${k.id}" style="background:#d63031">Elimina</button></div>`).join("")}`;else if(t==="quests")b.innerHTML=`<div class="card"><button id="newq">＋ Nuova Quest</button></div>${s.lib.map(q=>`<div class="list"><b>${q.icon} ${esc(q.text)}</b><div class="small">⭐ ${q.xp||10} XP · Assegnata a: ${s.kids.filter(k=>(s.assign[k.id]||[]).includes(q.id)).map(k=>esc(k.name)).join(", ")||"nessuno"}</div><button data-e="${q.id}">Modifica</button><button data-as="${q.id}">Assegna</button><button data-delq="${q.id}" class="danger">🗑️ Elimina</button></div>`).join("")}`;else b.innerHTML=`<div class="card"><button id="export">Esporta backup JSON</button><input id="import" type="file" accept=".json"><p class="small">Il backup contiene profili, XP, Pokémon, Quest, assegnazioni e impostazioni.</p><hr><input id="pin" type="password" placeholder="Nuovo PIN"><button id="pinb">Cambia PIN</button></div>`;bindAdmin()}
function bindAdmin(){$("#add")?.addEventListener("click",()=>{let n=prompt("Nome?");if(!n)return;let a=Math.max(1,Math.min(14,+prompt("Età (1-14)?","7")||7)),k=kid(n,a,"viola");s.kids.push(k);s.assign[k.id]=[];ensure();save().then(()=>{render();adminPane("kids")})});document.querySelectorAll("[data-save]").forEach(b=>b.onclick=async()=>{let k=s.kids.find(x=>x.id===b.dataset.save);k.name=$(`[data-n="${k.id}"]`).value||k.name;k.age=Math.max(1,Math.min(14,+$(`[data-age="${k.id}"]`).value||7));k.theme=$(`[data-theme="${k.id}"]`).value||"viola";k.avatar=$(`[data-avatar="${k.id}"]`).value||"none";s.assign[k.id]=[];ensure();await save();render();adminPane("kids")});document.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{if(!confirm("Eliminare il profilo?"))return;let i=b.dataset.del;s.kids=s.kids.filter(k=>k.id!==i);delete s.assign[i];active=s.kids[0]?.id;await save();render();adminPane("kids")});$("#newq")?.addEventListener("click",()=>{let t=prompt("Testo Quest");if(!t)return;let xv=Math.max(5,Math.min(30,+prompt("XP (5-30, in base a difficoltà/tempo)",String(xpForText(t)))||xpForText(t)));s.lib.push({id:id(),icon:prompt("Icona","⭐")||"⭐",text:t,xp:xv});save().then(()=>adminPane("quests"))});document.querySelectorAll("[data-e]").forEach(b=>b.onclick=async()=>{let q=s.lib.find(x=>x.id===b.dataset.e),t=prompt("Testo",q.text);if(t===null)return;q.text=t;q.icon=prompt("Icona",q.icon)||q.icon;q.xp=Math.max(5,Math.min(30,+prompt("XP (5-30)",String(q.xp||xpForText(q.text)))||q.xp||xpForText(q.text)));await save();adminPane("quests");render()});document.querySelectorAll("[data-as]").forEach(b=>b.onclick=()=>{let q=s.lib.find(x=>x.id===b.dataset.as);let lines=s.kids.map((k,i)=>`${i+1}. ${k.name} ${s.assign[k.id]?.includes(q.id)?"[X]":"[ ]"}`).join("\n");let v=prompt(`Quest: ${q.text}\n\nInserisci i numeri dei bambini a cui assegnarla.\nPer togliere un bambino, non inserire il suo numero.`,lines);if(v===null)return;let selected=new Set(v.split(",").map(x=>+x.trim()-1).filter(i=>i>=0&&i<s.kids.length));s.kids.forEach((k,i)=>{s.assign[k.id]=Array.isArray(s.assign[k.id])?s.assign[k.id]:[];let has=s.assign[k.id].includes(q.id);if(selected.has(i)&&!has)s.assign[k.id].push(q.id);if(!selected.has(i)&&has)s.assign[k.id]=s.assign[k.id].filter(x=>x!==q.id)});save().then(()=>{adminPane("quests");render()})});document.querySelectorAll("[data-delq]").forEach(b=>b.onclick=async()=>{let q=s.lib.find(x=>x.id===b.dataset.delq);if(!q)return;if(!confirm(`Eliminare la Quest "${q.text}"?\n\nVerrà rimossa dalla libreria e dalle assegnazioni di tutti i bambini.`))return;s.lib=s.lib.filter(x=>x.id!==q.id);s.kids.forEach(k=>{s.assign[k.id]=(s.assign[k.id]||[]).filter(x=>x!==q.id)});await save();adminPane("quests");render()});$("#export")?.addEventListener("click",()=>{let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(s,null,2)],{type:"application/json"}));a.download="pokemon-quest-backup.json";a.click()});$("#import")?.addEventListener("change",async e=>{let f=e.target.files[0];if(!f)return;try{s=JSON.parse(await f.text());ensure();await save();active=s.kids[0]?.id;render();alert("Backup ripristinato")}catch{alert("Backup non valido")}});$("#pinb")?.addEventListener("click",async()=>{let p=$("#pin").value;if(p.length<4)return alert("PIN troppo corto");s.pin=p;await save();alert("PIN cambiato")})}
$("#adult").onclick=()=>{let m=$("#modal");m.innerHTML=`<h2>🔐 Area adulti</h2><input id="pp" type="password" inputmode="numeric" placeholder="PIN"><p id="err" class="small"></p><button id="go">Accedi</button> <button id="cc">Chiudi</button>`;m.showModal();$("#cc").onclick=()=>m.close();$("#go").onclick=()=>$("#pp").value===s.pin?(m.close(),admin()):$("#err").textContent="PIN non corretto."};
(async()=>{await boot();if("serviceWorker"in navigator&&location.protocol!=="file:")navigator.serviceWorker.register("service-worker.js").catch(()=>{})})();