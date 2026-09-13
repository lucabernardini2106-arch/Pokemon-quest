const DB_NAME="pokemonQuestV6", DB_VER=1, STORE="state";
const POKE=[
["Bulbasaur","Ivysaur","Venusaur"],["Charmander","Charmeleon","Charizard"],["Squirtle","Wartortle","Blastoise"],
["Treecko","Grovyle","Sceptile"],["Torchic","Combusken","Blaziken"],["Mudkip","Marshtomp","Swampert"],
["Chikorita","Bayleef","Meganium"],["Cyndaquil","Quilava","Typhlosion"],["Totodile","Croconaw","Feraligatr"],
["Turtwig","Grotle","Torterra"],["Chimchar","Monferno","Infernape"],["Piplup","Prinplup","Empoleon"]];
const IDS=[1,2,3,4,5,6,7,8,9,252,253,254,255,256,257,258,259,260,152,153,154,155,156,157,158,159,160,387,388,389,390,391,392,393,394,395];
const AGE_QUESTS=[
 {min:3,max:4,q:[["🧸","Metti a posto i giochi"],["🪥","Lavati i denti"],["👕","Vestiti da solo"]]},
 {min:5,max:6,q:[["🛏️","Metti a posto il pigiama"],["🎒","Prepara una cosa per domani"],["❤️","Aiuta in casa"]]},
 {min:7,max:8,q:[["🎒","Prepara zaino e materiale"],["🧹","Riordina ciò che hai usato"],["📚","Leggi per almeno 15 minuti"]]},
 {min:9,max:10,q:[["🎒","Prepara zaino e materiale"],["🧹","Riordina ciò che hai usato"],["📚","Leggi per almeno 20 minuti"],["❤️","Aiuta qualcuno senza che te lo chieda"]]},
 {min:11,max:14,q:[["🧠","Organizza ciò che serve per domani"],["📚","Leggi per almeno 20 minuti"],["❤️","Aiuta qualcuno senza che te lo chieda"],["⏱️","Gestisci 20 minuti di studio/attività"],["🧹","Svolgi una responsabilità domestica"]]}
];
const defaults={version:6,pin:"1234",weekStart:null,kids:[],library:[],assignments:{},groupQuest:null,settings:{smallReward:350,bigReward:850}};

function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(16).slice(2)}
function today(){return new Date().toISOString().slice(0,10)}
function monday(){let d=new Date();let n=(d.getDay()+6)%7;d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)}
function xpToLevel(x){return Math.min(30,Math.floor(x/100)+1)}
function stage(l){return l>=20?2:l>=10?1:0}
function pokeImg(id){return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(id).padStart(3,"0")}.png`}

let db;
function openDB(){return new Promise((res,rej)=>{let r=indexedDB.open(DB_NAME,DB_VER);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>{db=r.result;res()};r.onerror=()=>rej(r.error)})}
function getState(){return new Promise((res,rej)=>{let r=db.transaction(STORE).objectStore(STORE).get("state");r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error)})}
function putState(s){return new Promise((res,rej)=>{let r=db.transaction(STORE,"readwrite").objectStore(STORE).put(s,"state");r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
async function load(){await openDB();let s=await getState();if(!s){s=structuredClone(defaults);s.weekStart=monday();s.kids=[newKid("Giuseppe",9),newKid("Anna Chiara",7),newKid("Elisabetta",5)];s.library=buildLibrary(s.kids);ensureAssignments(s);await putState(s)}return s}
function newKid(name,age){return {id:uid(),name,age,avatar:"👤",xp:0,weeklyXp:0,pokemonIndex:0,completed:{}}}
function pool(age){return AGE_QUESTS.find(x=>age>=x.min&&age<=x.max)?.q||AGE_QUESTS.at(-1).q}
function buildLibrary(kids){let a=[];kids.forEach(k=>pool(k.age).forEach(([icon,text])=>{if(!a.some(x=>x.text===text)){a.push({id:uid(),icon,text,minAge:3,maxAge:14})}}));return a}
function ensureAssignments(s){s.kids.forEach(k=>{if(!s.assignments[k.id])s.assignments[k.id]=[];if(!s.assignments[k.id].length){pool(k.age).forEach(([icon,text])=>{let q=s.library.find(x=>x.text===text);if(q)s.assignments[k.id].push(q.id)})}})}
function completeKey(kid,qid){return `${today()}|${qid}`}
function isDone(k,qid){return !!k.completed[completeKey(k,qid)]}
async function save(){await putState(state)}
function toast(t){let d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
function render(){renderHome();renderKidsTab();renderQuestTab();renderBackupTab()}
function renderHome(){
 const el=document.querySelector("#children");el.innerHTML="";
 state.kids.forEach(k=>{let level=xpToLevel(k.xp),si=stage(level),pi=k.pokemonIndex%12, name=POKE[pi][si], pid=IDS[pi*3+si];
 let c=document.createElement("div");c.className="card child";c.innerHTML=`<img class="avatar" src="${pokeImg(pid)}"><div><div class="row between"><h2>${esc(k.name)}</h2><span class="pill">Lv ${level}</span></div><div class="pokemon"><b>${name}</b> <span class="small">· ${k.xp} XP</span></div><div class="progress"><div class="bar" style="width:${(k.xp%100)}%"></div></div><div class="stats"><span class="pill">Settimana: ${k.weeklyXp} XP</span><span class="pill">Quest: ${doneCount(k)} completate</span></div><div class="line"></div><div id="q-${k.id}"></div></div>`;el.appendChild(c);renderKidQuests(c,k)});
}
function doneCount(k){return Object.keys(k.completed).filter(x=>x.startsWith(today()+"|")).length}
function renderKidQuests(card,k){let box=card.querySelector(`#q-${CSS.escape(k.id)}`);let ids=state.assignments[k.id]||[];if(!ids.length){box.innerHTML="<span class='small'>Nessuna Quest assegnata oggi.</span>";return}
ids.forEach(qid=>{let q=state.library.find(x=>x.id===qid);if(!q)return;let done=isDone(k,qid);let d=document.createElement("div");d.className="quest "+(done?"done":"");d.innerHTML=`<span class="emoji">${q.icon}</span><span class="text">${esc(q.text)}</span><button>${done?"↩️ Annulla":"✅ Fatto"}</button>`;d.querySelector("button").onclick=async()=>{let key=completeKey(k,qid);if(done){delete k.completed[key];k.xp=Math.max(0,k.xp-20);k.weeklyXp=Math.max(0,k.weeklyXp-20)}else{k.completed[key]=true;k.xp+=20;k.weeklyXp+=20}await save();render();toast(done?"Quest annullata":"Quest completata! +20 XP")};box.appendChild(d)})
}
function renderGroup(){
 let box=document.querySelector("#groupQuest");if(state.kids.length<2){box.innerHTML="<span class='small'>La Quest di gruppo compare quando ci sono almeno 2 bambini.</span>";return}
 if(!state.groupQuest)state.groupQuest={icon:"🤝",text:"Fate insieme qualcosa di utile in casa",date:today(),done:false};
 let g=state.groupQuest;box.innerHTML=`<div class="quest ${g.done?"done":""}"><span class="emoji">${g.icon}</span><span class="text">${esc(g.text)}<br><span class="small">+30 XP a ciascun partecipante</span></span><button>${g.done?"↩️ Annulla":"🤝 Completa"}</button></div>`;
 box.querySelector("button").onclick=async()=>{g.done=!g.done;state.kids.forEach(k=>{k.weeklyXp=Math.max(0,k.weeklyXp+(g.done?30:-30));k.xp=Math.max(0,k.xp+(g.done?30:-30))});await save();render();toast(g.done?"Quest di gruppo completata!":"Quest di gruppo annullata")};
}
function renderKidsTab(){let e=document.querySelector("#kidsTab");if(!e)return;e.innerHTML=`<div class="row between"><h3>Bambini</h3><button id="addKid">＋ Aggiungi</button></div><div class="grid">${state.kids.map(k=>`<div class="card"><h3>${esc(k.name)}</h3><div class="field"><label>Nome</label><input data-name="${k.id}" value="${esc(k.name)}"></div><div class="field"><label>Età</label><input data-age="${k.id}" type="number" min="3" max="14" value="${k.age}"></div><div class="field"><label>Avatar</label><input data-avatar="${k.id}" value="${esc(k.avatar||"👤")}"></div><div class="row"><button data-savekid="${k.id}">Salva</button><button class="danger" data-delkid="${k.id}">Elimina</button></div></div>`).join("")}</div>`;
e.querySelector("#addKid").onclick=()=>addKidUI();e.querySelectorAll("[data-savekid]").forEach(b=>b.onclick=async()=>{let k=state.kids.find(x=>x.id===b.dataset.savekid);k.name=e.querySelector(`[data-name="${k.id}"]`).value.trim()||k.name;k.age=Math.max(3,Math.min(14,+e.querySelector(`[data-age="${k.id}"]`).value||7));k.avatar=e.querySelector(`[data-avatar="${k.id}"]`).value||"👤";state.assignments[k.id]=[];pool(k.age).forEach(([ic,tx])=>{let q=state.library.find(x=>x.text===tx);if(q)state.assignments[k.id].push(q.id)});await save();render();toast("Profilo aggiornato")});e.querySelectorAll("[data-delkid]").forEach(b=>b.onclick=async()=>{if(!confirm("Eliminare questo bambino e le sue assegnazioni?"))return;state.kids=state.kids.filter(k=>k.id!==b.dataset.delkid);delete state.assignments[b.dataset.delkid];await save();render()})}
function addKidUI(){let n=prompt("Nome del bambino?");if(!n)return;let a=+prompt("Età (3-14)?","7");if(!a)return;let k=newKid(n,Math.max(3,Math.min(14,a)));state.kids.push(k);state.assignments[k.id]=[];pool(k.age).forEach(([ic,tx])=>{let q=state.library.find(x=>x.text===tx);if(!q){q={id:uid(),icon:ic,text:tx,minAge:3,maxAge:14};state.library.push(q)}state.assignments[k.id].push(q.id)});save().then(()=>{render();toast("Bambino aggiunto")})}
function renderQuestTab(){let e=document.querySelector("#questsTab");if(!e)return;e.innerHTML=`<div class="row between"><h3>Libreria Quest</h3><button id="newQuest">＋ Nuova Quest</button></div><p class="small">Una Quest può essere assegnata a più bambini. Le assegnazioni sono separate dalla libreria.</p><div>${state.library.map(q=>`<div class="library-item"><div><b>${q.icon} ${esc(q.text)}</b><div class="small">Assegnata a: ${state.kids.filter(k=>(state.assignments[k.id]||[]).includes(q.id)).map(k=>esc(k.name)).join(", ")||"nessuno"}</div></div><div class="row"><button data-editq="${q.id}">Modifica</button><button class="secondary" data-assignq="${q.id}">Assegna</button></div></div>`).join("")}</div>`;
e.querySelector("#newQuest").onclick=()=>newQuestUI();e.querySelectorAll("[data-editq]").forEach(b=>b.onclick=()=>editQuestUI(b.dataset.editq));e.querySelectorAll("[data-assignq]").forEach(b=>b.onclick=()=>assignQuestUI(b.dataset.assignq))}
function newQuestUI(){let icon=prompt("Icona/emoji della Quest","⭐");let text=prompt("Testo della Quest");if(!text)return;let q={id:uid(),icon:icon||"⭐",text,minAge:3,maxAge:14};state.library.push(q);save().then(()=>{render();toast("Quest creata")})}
function editQuestUI(id){let q=state.library.find(x=>x.id===id);let text=prompt("Modifica Quest",q.text);if(text===null)return;let icon=prompt("Icona/emoji",q.icon);q.text=text.trim()||q.text;q.icon=icon||q.icon;save().then(()=>{render();toast("Quest modificata")})}
function assignQuestUI(id){let q=state.library.find(x=>x.id===id);let names=state.kids.map((k,i)=>`${i+1}. ${k.name}`).join("\n");let s=prompt(`A chi assegnare "${q.text}"?\n${names}\nInserisci i numeri separati da virgola, oppure 0 per rimuoverla da tutti.`);if(s===null)return;if(s.trim()==="0"){state.kids.forEach(k=>state.assignments[k.id]=(state.assignments[k.id]||[]).filter(x=>x!==id))}else{s.split(",").map(x=>+x.trim()-1).filter(i=>i>=0&&i<state.kids.length).forEach(i=>{let k=state.kids[i];state.assignments[k.id]??=[];if(!state.assignments[k.id].includes(id))state.assignments[k.id].push(id)})}save().then(()=>{render();toast("Assegnazioni aggiornate")})}
function renderBackupTab(){let e=document.querySelector("#backupTab");if(!e)return;e.innerHTML=`<div class="card"><h3>💾 Backup</h3><p>Esporta una copia completa dei dati. Salvala anche su iCloud/Drive/Google Drive.</p><button id="export">Esporta JSON</button><label for="importFile" class="button secondary" style="display:inline-block;margin-top:8px">Importa JSON</label><input id="importFile" type="file" accept=".json" style="display:none"><div class="line"></div><p class="small">Il backup contiene profili, XP, Pokémon, Quest, assegnazioni e impostazioni.</p></div><div class="card"><h3>🔑 PIN adulto</h3><input id="newPin" type="password" inputmode="numeric" placeholder="Nuovo PIN"><button id="changePin">Cambia PIN</button></div>`;
e.querySelector("#export").onclick=()=>{let blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`pokemon-quest-backup-${today()}.json`;a.click();URL.revokeObjectURL(a.href);toast("Backup esportato")};
e.querySelector("#importFile").onchange=async ev=>{let f=ev.target.files[0];if(!f)return;try{let x=JSON.parse(await f.text());if(!x.kids||!x.library||!x.assignments)throw Error();x.version=6;state=x;ensureAssignments(state);await save();render();toast("Backup ripristinato")}catch{alert("File di backup non valido.")}};
e.querySelector("#changePin").onclick=async()=>{let p=e.querySelector("#newPin").value.trim();if(p.length<4){alert("Usa almeno 4 cifre.");return}state.pin=p;await save();toast("PIN cambiato")}}
function adultOpen(){document.querySelector("#adult").classList.remove("hidden");document.querySelector("#loginBox").classList.remove("hidden");document.querySelector("#adultPanel").classList.add("hidden");document.querySelector("#pin").value=""}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
let state;
(async()=>{state=await load();if(state.weekStart!==monday()){state.weekStart=monday();state.kids.forEach(k=>k.weeklyXp=0);state.groupQuest=null;await save()}ensureAssignments(state);render();renderGroup();
document.querySelector("#adultBtn").onclick=adultOpen;document.querySelector("#closeAdult").onclick=()=>document.querySelector("#adult").classList.add("hidden");
document.querySelector("#login").onclick=()=>{if(document.querySelector("#pin").value===state.pin){document.querySelector("#loginBox").classList.add("hidden");document.querySelector("#adultPanel").classList.remove("hidden")}else document.querySelector("#loginMsg").textContent="PIN non corretto."};
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.add("hidden"));document.getElementById(b.dataset.tab).classList.remove("hidden")});
document.querySelector('[data-tab="kidsTab"]').click();
})();

if("serviceWorker" in navigator && location.protocol!=="file:"){navigator.serviceWorker.register("service-worker.js").catch(()=>{})}