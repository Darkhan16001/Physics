
"use strict";

const $ = id => document.getElementById(id);

const esc = s => String(s).replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",
  '"':"&quot;","'":"&#39;"
}[c]));

const frac = (a,b) =>
  `<span class="frac"><span>${a}</span><span>${b}</span></span>`;

function num(n) {
  if(!Number.isFinite(n)) throw Error("Нәтиже анықталмаған");
  return String(Number(n.toPrecision(10))).replace(".",",");
}

/* =====================================
   24 ОҚУШЫ
===================================== */

const names=[
  "Рамазан","Тұрғанжан","Нұрай","Әлқуат",
  "Шырай","Гүлсезім","Маржан","Мариям",
  "Жансая","Азиза","Ақсезім","Нұрболсын",
  "Ақнұр","Іңкәр","Асхат","Аяжан",
  "Мирас","Санжар","Ерасыл","Нұрасыл",
  "Расул","Айнұр","Дархан","Айкерім"
];

const students=names.map((name,id)=>({
  id,name,present:true
}));

let attendanceDraft=names.map(()=>true);
let assignments=[];
let completed=new Set();
let drawn=new Set();
let randomId=null;

function shuffle(list) {
  const a=[...list];

  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }

  return a;
}

const present=()=>students.filter(s=>s.present);

/* =====================================
   ФОРМУЛАЛАР
===================================== */

const F={
  current:`I = ${frac("q","t")}`,
  ohm:`I = ${frac("U","R")}`,
  resistance:`R = ${frac("ρl","S")}`,
  series:"R = R₁ + R₂",
  parallel:`R = ${frac("R₁R₂","R₁ + R₂")}`,
  emf:`ε = ${frac("A<sub>бөгде</sub>","q")}`,
  full:`I = ${frac("ε","R + r")}`,
  voltage:"U = ε − Ir",
  k1:"∑ I<sub>кіріс</sub> = ∑ I<sub>шығыс</sub>",
  k2:"∑ ε = ∑ IR",
  work:"A = UIt = Pt",
  power:`P = UI = I²R = ${frac("U²","R")}`,
  heat:"Q = I²Rt",
  efficiency:`η = ${frac("U","ε")} × 100%`
};

/* =====================================
   10 КОНСПЕКТ
===================================== */

const notes=[

  ["Электр тогы",
   "Электр тогы — зарядталған бөлшектердің бағытталған қозғалысы. Ток күші өткізгіштің көлденең қимасынан бірлік уақытта өткен зарядпен анықталады.",
   F.current,
   "I — ампер (А); q — кулон (Кл); t — секунд (с)."],

  ["Тізбек бөлігі үшін Ом заңы",
   "Тізбек бөлігіндегі ток күші кернеуге тура, электр кедергісіне кері пропорционал.",
   F.ohm,
   "U — кернеу, В; R — кедергі, Ом."],

  ["Өткізгіштің кедергісі",
   "Өткізгіштің кедергісі оның ұзындығына, қима ауданына және материалына тәуелді.",
   F.resistance,
   "ρ — меншікті кедергі (Ом·м); l — ұзындық (м); S — аудан (м²)."],

  ["Тізбектей жалғау",
   "Тізбектей жалғанған өткізгіштер арқылы бірдей ток өтеді. Жалпы кернеу жеке кернеулердің қосындысына тең.",
   `${F.series}<br>I = I₁ = I₂<br>U = U₁ + U₂`,
   "Жалпы кедергі жеке кедергілердің қосындысына тең."],

  ["Параллель жалғау",
   "Параллель тармақтардағы кернеулер бірдей. Жалпы ток күші тармақтардағы токтардың қосындысына тең.",
   `${F.parallel}<br>U = U₁ = U₂<br>I = I₁ + I₂`,
   "Берілген кедергі формуласы екі параллель резистор үшін."],

  ["Электр қозғаушы күш",
   "ЭҚК — бөгде күштердің бірлік оң зарядты тасымалдағанда атқаратын жұмысына тең физикалық шама.",
   F.emf,
   "ε — ЭҚК, В; A — жұмыс, Дж; q — заряд, Кл."],

  ["Толық тізбек үшін Ом заңы",
   "Толық тізбекте ток көзінің ішкі кедергісі де ескеріледі. Энергия беріп тұрған ток көзінің қысқыш кернеуі ЭҚК-тен ішкі кернеу түсуін азайтқанға тең.",
   `${F.full}<br>${F.voltage}`,
   "r — ішкі кедергі; R — сыртқы кедергі."],

  ["Кирхгоф заңдары",
   "Бірінші заң зарядтың сақталуына, екінші заң энергияның сақталуына негізделеді. Контур теңдеуінде таңбалар бағытқа байланысты алынады.",
   `${F.k1}<br>${F.k2}`,
   "Түйін мен тұйық контурға арналған теңдеулер."],

  ["Электр тогының жұмысы мен қуаты",
   "Тұрақты токтың жұмысы кернеуге, ток күшіне және уақытқа тәуелді. Қуат бірлік уақыттағы жұмысты сипаттайды.",
   `${F.work}<br>${F.power}`,
   "A — Дж; P — Вт. I²R және U²/R омдық резисторға қолданылады."],

  ["Джоуль–Ленц заңы және ПӘК",
   "Омдық өткізгіште электр энергиясы жылуға айналады. Қарапайым ток көзі моделінде пайдалы энергияның толық энергияға қатынасы ПӘК деп аталады.",
   `${F.heat}<br>${F.efficiency}`,
   "Q — жылу мөлшері, Дж; η — пайдалы әсер коэффициенті."]
];

/* =====================================
   24 ТҮРЛІ ЕСЕП
   8 ОҢАЙ + 8 ОРТАША + 8 КҮРДЕЛІ
===================================== */

const tasks=[

  /* 1-ДЕҢГЕЙ */

  ["Электр тогының күші",
   "Өткізгіштің қимасынан 30 секундта 90 Кл заряд өтті. Ток күшін анықта.",
   "q = 90 Кл; t = 30 с","I — ?",
   `I = ${frac("90","30")} = 3 А`],

  ["Ом заңы",
   "Кедергісі 8 Ом резистордың кернеуі 24 В. Ток күшін анықта.",
   "R = 8 Ом; U = 24 В","I — ?",
   `I = ${frac("24","8")} = 3 А`],

  ["Кернеуді анықтау",
   "Өткізгіштің кедергісі 7 Ом, ток күші 2 А. Кернеуді есепте.",
   "R = 7 Ом; I = 2 А","U — ?",
   "U = IR = 2 × 7 = 14 В"],

  ["Тізбектей жалғау",
   "Кедергілері 4 Ом, 6 Ом және 10 Ом үш резистор тізбектей жалғанған. Жалпы кедергіні тап.",
   "R₁ = 4 Ом; R₂ = 6 Ом; R₃ = 10 Ом","R — ?",
   "R = 4 + 6 + 10 = 20 Ом"],

  ["Параллель жалғау",
   "Кедергілері 6 Ом және 3 Ом екі резистор параллель жалғанған. Жалпы кедергіні анықта.",
   "R₁ = 6 Ом; R₂ = 3 Ом","R — ?",
   `R = ${frac("6 × 3","6 + 3")} = 2 Ом`],

  ["Электр қуаты",
   "Кернеу 16 В, ток күші 4 А. Электр қуатын анықта.",
   "U = 16 В; I = 4 А","P — ?",
   "P = UI = 16 × 4 = 64 Вт"],

  ["Электр қозғаушы күш",
   "Бөгде күштер 5 Кл зарядты тасымалдағанда 75 Дж жұмыс атқарды. ЭҚК-ті тап.",
   "A = 75 Дж; q = 5 Кл","ε — ?",
   `ε = ${frac("75","5")} = 15 В`],

  ["Электр тогының жұмысы",
   "Кернеуі 12 В тізбекте 2 А ток 40 секунд өтті. Электр тогының жұмысын тап.",
   "U = 12 В; I = 2 А; t = 40 с","A — ?",
   "A = UIt = 12 × 2 × 40 = 960 Дж"],

  /* 2-ДЕҢГЕЙ */

  ["Толық тізбек",
   "Ток көзінің ЭҚК-і 24 В, ішкі кедергісі 2 Ом, сыртқы кедергісі 6 Ом. Ток күшін анықта.",
   "ε = 24 В; r = 2 Ом; R = 6 Ом","I — ?",
   `I = ${frac("24","6 + 2")} = 3 А`],

  ["Қысқыш кернеуі",
   "Ток көзінің ЭҚК-і 20 В, ішкі кедергісі 1,5 Ом, ток күші 4 А. Қысқыш кернеуін тап.",
   "ε = 20 В; r = 1,5 Ом; I = 4 А","U — ?",
   "U = ε − Ir = 20 − 4 × 1,5 = 14 В"],

  ["Ішкі кедергі",
   "ЭҚК 18 В, қысқыш кернеуі 12 В, ток күші 3 А. Ішкі кедергіні есепте.",
   "ε = 18 В; U = 12 В; I = 3 А","r — ?",
   `r = ${frac("18 − 12","3")} = 2 Ом`],

  ["Джоуль–Ленц заңы",
   "Кедергісі 5 Ом өткізгіш арқылы 3 А ток 20 секунд өтеді. Бөлінетін жылуды анықта.",
   "R = 5 Ом; I = 3 А; t = 20 с","Q — ?",
   "Q = I²Rt = 3² × 5 × 20 = 900 Дж"],

  ["Өткізгіш кедергісі",
   "Ұзындығы 5 м, қима ауданы 2 мм² өткізгіштің меншікті кедергісі 2 × 10⁻⁸ Ом·м. Электр кедергісін тап.",
   "l = 5 м; S = 2 × 10⁻⁶ м²; ρ = 2 × 10⁻⁸ Ом·м","R — ?",
   `R = ${frac("2 × 10⁻⁸ × 5","2 × 10⁻⁶")} = 0,05 Ом`],

  ["Кирхгофтың бірінші заңы",
   "Түйінге 8 А және 3 А ток кіреді. Бірінші тармақтан 6 А ток шығады. Екінші шығатын токты анықта.",
   "I₁ = 8 А; I₂ = 3 А; I₃ = 6 А","I₄ — ?",
   "I₄ = I₁ + I₂ − I₃ = 8 + 3 − 6 = 5 А"],

  ["Резистор қуаты",
   "Кедергісі 12 Ом резистордың кернеуі 36 В. Қуатын есепте.",
   "R = 12 Ом; U = 36 В","P — ?",
   `P = ${frac("36²","12")} = 108 Вт`],

  ["Пайдалы әсер коэффициенті",
   "Энергия беріп тұрған ток көзінің ЭҚК-і 30 В, қысқыш кернеуі 24 В. ПӘК-ті есепте.",
   "ε = 30 В; U = 24 В","η — ?",
   `η = ${frac("24","30")} × 100% = 80%`],

  /* 3-ДЕҢГЕЙ */

  ["Аралас жалғау",
   "6 Ом және 3 Ом резисторлар параллель жалғанған. Оларға 4 Ом резистор тізбектей жалғанған деп қарастырылады. Жалпы кернеу 18 В. Жалпы кедергі мен ток күшін анықта.",
   "R₁ = 6 Ом; R₂ = 3 Ом; R₃ = 4 Ом; U = 18 В","R, I — ?",
   `R₁₂ = ${frac("6 × 3","6 + 3")} = 2 Ом<br>
    R = 2 + 4 = 6 Ом<br>I = ${frac("18","6")} = 3 А`],

  ["Толық тізбек және ПӘК",
   "ЭҚК 36 В, сыртқы кедергі 10 Ом, ішкі кедергі 2 Ом. Ток күшін, қысқыш кернеуін және ПӘК-ті анықта.",
   "ε = 36 В; R = 10 Ом; r = 2 Ом","I, U, η — ?",
   `I = ${frac("36","12")} = 3 А<br>U = 36 − 3 × 2 = 30 В<br>
    η = ${frac("30","36")} × 100% ≈ 83,33%`],

  ["Электр энергиясының түрленуі",
   "Кедергісі 8 Ом резистордың кернеуі 16 В. Ток күшін, қуатын және 3 минутта бөлінетін жылу мөлшерін тап.",
   "R = 8 Ом; U = 16 В; t = 180 с","I, P, Q — ?",
   `I = ${frac("16","8")} = 2 А<br>P = 16 × 2 = 32 Вт<br>
    Q = 32 × 180 = 5760 Дж`],

  ["Кирхгофтың екінші заңы",
   "Теориялық контурда ЭҚК-тері 24 В және 6 В болатын екі идеал ток көзі қарама-қарсы әрекет етеді. Тізбектің толық кедергісі 9 Ом. Ток күшінің модулін тап.",
   "ε₁ = 24 В; ε₂ = 6 В; R = 9 Ом","I — ?",
   `I = ${frac("24 − 6","9")} = 2 А`],

  ["Параллель тармақтардағы ток",
   "12 В кернеуге 4 Ом және 6 Ом резисторлар параллель жалғанған. Тармақтардағы токтарды, жалпы токты және қуатты анықта.",
   "U = 12 В; R₁ = 4 Ом; R₂ = 6 Ом","I₁, I₂, I, P — ?",
   `I₁ = ${frac("12","4")} = 3 А<br>
    I₂ = ${frac("12","6")} = 2 А<br>
    I = 5 А<br>P = 12 × 5 = 60 Вт`],

  ["Ток көзіндегі энергия шығыны",
   "ЭҚК 18 В, қысқыш кернеуі 15 В, ток күші 3 А. Ішкі кедергіні және 2 минуттағы ішкі жылу шығынын анықта.",
   "ε = 18 В; U = 15 В; I = 3 А; t = 120 с","r, Q — ?",
   `r = ${frac("18 − 15","3")} = 1 Ом<br>
    Q = I²rt = 3² × 1 × 120 = 1080 Дж`],

  ["Киловатт-сағат",
   "Қуаты 800 Вт құрылғы 1,5 сағат жұмыс істеді. Энергияны кВт·сағ және джоульмен анықта.",
   "P = 800 Вт; t = 1,5 сағ","A — ?",
   "P = 0,8 кВт<br>A = 0,8 × 1,5 = 1,2 кВт·сағ<br>A = 4 320 000 Дж"],

  ["Толық тізбектегі энергия",
   "ЭҚК 28 В, ішкі кедергі 1 Ом, сыртқы кедергі 6 Ом. Ток күшін және 30 секундтағы ішкі, сыртқы жылу мөлшерін анықта.",
   "ε = 28 В; r = 1 Ом; R = 6 Ом; t = 30 с","I, Qішкі, Qсыртқы — ?",
   `I = ${frac("28","6 + 1")} = 4 А<br>
    Q<sub>ішкі</sub> = 4² × 1 × 30 = 480 Дж<br>
    Q<sub>сыртқы</sub> = 4² × 6 × 30 = 2880 Дж`]
];

/* =====================================
   15 КОМАНДАЛЫҚ СҰРАҚ
===================================== */

const quiz=[
  ["Ток күшінің өлшем бірлігі?",
   ["Вольт","Ампер","Ом","Джоуль"],1],

  ["Ом заңының формуласы?",
   ["I = UR","I = R/U","I = U/R","I = U + R"],2],

  ["4 Ом және 5 Ом тізбектей жалғанса, жалпы кедергі?",
   ["9 Ом","20 Ом","1 Ом","4 Ом"],0],

  ["6 Ом және 6 Ом параллель жалғанса?",
   ["12 Ом","6 Ом","36 Ом","3 Ом"],3],

  ["ЭҚК қандай таңбамен белгіленеді?",
   ["α","ε","ρ","η"],1],

  ["Толық тізбек үшін Ом заңы?",
   ["I = εR","I = R + r","I = ε/(R + r)","I = εr"],2],

  ["12 В кернеуде 2 А ток өтеді. Қуаты?",
   ["24 Вт","6 Вт","14 Вт","10 Вт"],0],

  ["Электр жұмысының формуласы?",
   ["A = UI","A = U/I","A = It","A = UIt"],3],

  ["Түйінге 4 А және 7 А ток кіреді. Жалпы шығатын ток?",
   ["3 А","11 А","28 А","7 А"],1],

  ["Кирхгофтың бірінші заңы неге негізделген?",
   ["Гук заңына","Ньютон заңына","Зарядтың сақталуына","Архимед заңына"],2],

  ["Кирхгофтың екінші заңы неге негізделген?",
   ["Энергияның сақталуына","Массаның артуына","Гук заңына","Қысым заңына"],0],

  ["Джоуль–Ленц заңы?",
   ["Q = IR","Q = U + I","Q = Rt","Q = I²Rt"],3],

  ["R және t тұрақты. Ток 3 есе артса, жылу мөлшері?",
   ["3 есе","9 есе","6 есе","Өзгермейді"],1],

  ["1 кВт·сағ неше джоуль?",
   ["1000 Дж","3600 Дж","3 600 000 Дж","360 000 Дж"],2],

  ["ЭҚК 20 В, қысқыш кернеуі 16 В. ПӘК?",
   ["80%","20%","60%","100%"],0]
];

/* =====================================
   РАНДОМ ТАҢДАУ
===================================== */

function assignTasks(){
  const people=shuffle(present());
  const ids=shuffle(tasks.map((_,i)=>i))
    .slice(0,people.length).sort((a,b)=>a-b);

  assignments=people.map((s,i)=>({
    studentId:s.id,
    taskId:ids[i]
  }));

  completed.clear();
  drawn.clear();
  randomId=null;
}

const levels=["Оңай","Орташа","Күрделі"];
const levelClasses=["easy","medium","hard"];
const levelOf=id=>Math.floor(id/8);

function reshuffle(){
  if(!present().length) return alert("Қатысушы жоқ.");

  if(!confirm("Есептерді қайта араластырамыз ба? Орындалған белгілер тазаланады.")) return;

  assignTasks();
  buildPages();
  renderTasks();
  closePanel("taskPanel");
  goKey("task-intro");
}

function renderStudents(){
  $("students").innerHTML=students.map((s,i)=>`
    <label class="student ${attendanceDraft[i]?"":"absent"}">
      <input type="checkbox" ${attendanceDraft[i]?"checked":""}
        onchange="attendanceDraft[${i}]=this.checked;renderStudents()">
      ${esc(s.name)}
    </label>
  `).join("");

  $("attendanceCount").textContent=
    `${present().length} / ${students.length}`;
}

function markAll(v){
  attendanceDraft=names.map(()=>v);
  renderStudents();
}

function saveAttendance(){
  const changed=students.some((s,i)=>s.present!==attendanceDraft[i]);

  if(changed && (completed.size||Object.keys(answers).length) &&
    !confirm("Қатысу өзгерсе, нәтижелер қайта басталады. Сақтаймыз ба?")) return;

  const key=pages[current]?.key;

  students.forEach((s,i)=>s.present=attendanceDraft[i]);

  if(changed){
    assignTasks();
    makeTeams(false);
  }

  buildPages();
  renderStudents();
  renderTasks();
  renderTeams();
  closePanel("attendance");
  goKey(key);
}

function renderTasks(){
  $("taskCount").textContent=
    `Орындалды: ${completed.size} / ${assignments.length}`;

  $("taskList").innerHTML=assignments.map(a=>`
    <button class="${completed.has(a.taskId)?"done":""}"
      onclick="openTask(${a.taskId})">
      ${completed.has(a.taskId)?"✓":"🎲"} ${esc(students[a.studentId].name)}
      <small>${a.taskId+1}-есеп · ${levels[levelOf(a.taskId)]}</small>
    </button>
  `).join("")||"<p>Қатысушы жоқ.</p>";
}

function openTask(id){
  closePanel("taskPanel");
  closePanel("randomPanel");
  goKey("task-"+id);
}

function markDone(id){
  const visible=$("solution")&&!$("solution").classList.contains("hidden");

  if(completed.has(id)) completed.delete(id);
  else completed.add(id);

  renderTasks();
  renderPage(false);

  if(visible&&$("solution")) $("solution").classList.remove("hidden");
}

function randomStudent(){
  const all=present();

  if(!all.length) return alert("Қатысушы жоқ.");

  let pool=all.filter(s=>!drawn.has(s.id));

  if(!pool.length){
    drawn.clear();
    pool=all;
  }

  const s=pool[Math.floor(Math.random()*pool.length)];

  drawn.add(s.id);
  randomId=s.id;

  $("randomName").textContent=s.name;
  openPanel("randomPanel");
}

function openRandomTask(){
  const a=assignments.find(x=>x.studentId===randomId);

  if(a) openTask(a.taskId);
}

/* =====================================
   3 КОМАНДА
===================================== */

const teamNames=["Вольт","Ампер","Энергия"];
let teams=[[],[],[]];
let scores=[0,0,0];
let answers={};
let speakers={};
let used=[new Set(),new Set(),new Set()];
let autoNext=null;

function resetGame(){
  clearTimeout(autoNext);
  scores=[0,0,0];
  answers={};
  speakers={};
  used=[new Set(),new Set(),new Set()];
}

function makeTeams(show=false){
  const people=shuffle(present());

  if(show&&people.length<3)
    return alert("Кемінде 3 қатысушы қажет.");

  if(show&&Object.keys(answers).length&&
    !confirm("Топтарды және ұпайларды қайта бастаймыз ба?")) return;

  teams=[[],[],[]];

  if(people.length>=3)
    people.forEach((s,i)=>teams[i%3].push(s.id));

  resetGame();
  renderTeams();

  if(show){
    openPanel("teamPanel");
    renderPage(false);
  }
}

function teamMembers(i){
  return teams[i].map(id=>students[id]).filter(s=>s.present);
}

function renderTeams(){
  $("teams").innerHTML=teamNames.map((n,i)=>`
    <div class="teamCard">
      <b class="blue">${i+1}-топ — ${n}</b>
      <p>${teamMembers(i).map(s=>esc(s.name)).join(", ")||"Қатысушы жоқ"}</p>
      <b class="green">${scores[i]} ұпай</b>
    </div>
  `).join("");
}

function pickSpeaker(i){
  const k=i%3;
  const list=teamMembers(k);

  if(!list.length) return "Қатысушы жоқ";

  const old=list.find(s=>s.id===speakers[i]);
  if(old) return old.name;

  let pool=list.filter(s=>!used[k].has(s.id));

  if(!pool.length){
    used[k].clear();
    pool=list;
  }

  const s=pool[Math.floor(Math.random()*pool.length)];

  speakers[i]=s.id;
  used[k].add(s.id);

  return s.name;
}

/* =====================================
   САБАҚ БЕТТЕРІ
===================================== */

let pages=[],sections=[],current=0;

const slide=html=>`<article class="slide">${html}</article>`;

function introPage(){
  return slide(`
    <span class="eyebrow">ФИЗИКА · 1-КУРС · 3.2.4</span>

    <div class="card hero">
      <h1><span class="blue">Практикалық жұмыс</span></h1>

      <h2>Тұрақты электр тогы</h2>

      <div class="definition">
        <h3 class="green">Сабақтың мақсаты</h3>
        <p>Тұрақты электр тогының заңдарын есептер шығару
        арқылы бекіту. Өткізгіштердің аралас жалғануын,
        толық тізбек үшін Ом заңын, Кирхгоф заңдарын
        және электр энергиясының формулаларын қолдану.</p>
      </div>

      <div class="grid3">
        <div class="card">
          <h3 class="blue">3 зертхана</h3>
          <p>Виртуалды практикалық жұмыс</p>
        </div>
        <div class="card">
          <h3 class="green">24 есеп</h3>
          <p>Рандом жеке тапсырмалар</p>
        </div>
        <div class="card">
          <h3 class="gold">3 команда</h3>
          <p>15 ойын сұрағы</p>
        </div>
      </div>

      <button class="primary" onclick="startTimer();go(1)">
        Сабақты бастау →
      </button>

      <p class="blue">BY DARKHAN</p>
    </div>
  `);
}

function planPage(){
  const plan=[
    ["Ұйымдастыру",3],
    ["Формулаларды қайталау және конспект",15],
    ["Виртуалды практикалық жұмыстар",15],
    ["24 жеке есеп",30],
    ["Командалық ойын",14],
    ["Қорытынды және үй жұмысы",3]
  ];

  return slide(`
    <span class="eyebrow">САБАҚ ЖОСПАРЫ</span>
    <h2>80 минуттық практикалық сабақ</h2>

    <div class="card">
      ${plan.map(([n,t])=>`
        <div class="planRow">
          <b>${n}</b>
          <span class="blue">${t} минут</span>
        </div>`).join("")}

      <div class="formula">Барлығы: 80 минут</div>

      <button onclick="openPanel('attendance')">
        Қатысуды белгілеу
      </button>
    </div>
  `);
}

function notePage(n,i){
  return slide(`
    <span class="eyebrow">ҚАЙТАЛАУ · ${i+1} / 10</span>
    <h2>${n[0]}</h2>

    <div class="card notebook">
      <h3 class="blue">Дәптерге жазып алыңдар</h3>
      <p>${n[1]}</p>
      <div class="formula">${n[2]}</div>
      <p>${n[3]}</p>
    </div>

    <button onclick="openBoard()">✎ Тақтада түсіндіру</button>
  `);
}

/* =====================================
   ЭЛЕКТР ТІЗБЕГІНІҢ СЫЗБАЛАРЫ
===================================== */

function circuit(kind){
  const wire='stroke="#38576e" stroke-width="4" fill="none"';

  const label=(x,y,s,c="#087dcc")=>
    `<text x="${x}" y="${y}" text-anchor="middle"
      fill="${c}" font-size="20" font-weight="700">${s}</text>`;

  const resistor=(x,y,s)=>`
    <rect x="${x}" y="${y}" width="80" height="34" rx="4"
      fill="#dff7e9" stroke="#16874e" stroke-width="3"/>
    ${label(x+40,y+24,s,"#16874e")}`;

  const source=`
    <path d="M115 40 V70 M135 30 V80" ${wire}/>
    ${label(110,23,"−")}
    ${label(143,23,"+","#d63a50")}
    ${label(125,105,"ε")}
  `;

  let content="";

  if(kind==="mixed"){
    content=`
      <path d="M40 55 H115 M135 55 H360 V100
        M360 100 H305 M225 100 H195 V185
        H40 V55 M360 100 V185 H305
        M225 185 H195" ${wire}/>
      ${source}
      ${resistor(225,83,"R₁")}
      ${resistor(225,168,"R₂")}
      <path d="M360 185 H395 V240 H40 V185" ${wire}/>
      <path d="M40 200 V240 H145" stroke="white" stroke-width="7" fill="none"/>
      <path d="M40 185 V240 H145 M225 240 H395 V185" ${wire}/>
      ${resistor(145,223,"R₃")}
    `;

    /* Аралас сызбаны дұрыс жеке контурмен алмастыру */
    content=`
      <path d="M40 55 H115 M135 55 H205
        M285 55 H385 V110 H310
        M230 110 H180 V210
        M385 110 V210 H310
        M230 210 H40 V55" ${wire}/>
      ${source}
      ${resistor(205,38,"R₃")}
      ${resistor(230,93,"R₁")}
      ${resistor(230,193,"R₂")}
      <circle cx="180" cy="210" r="5" fill="#38576e"/>
      <circle cx="385" cy="110" r="5" fill="#38576e"/>
      ${label(320,255,"Аралас жалғау")}
    `;

  }else{
    content=`
      <path d="M40 55 H115 M135 55 H235
        M315 55 H385 V205 H250
        M170 205 H40 V55" ${wire}/>
      ${source}
      ${resistor(235,38,kind==="full"?"r":"R₁")}
      ${resistor(170,188,kind==="full"?"R":"R₂")}
      ${label(410,135,"I","#16874e")}
      <path d="M385 95 V155 L377 143 M385 155 L393 143"
        stroke="#16874e" stroke-width="3" fill="none"/>
    `;
  }

  return `<div class="visual">
    <svg viewBox="0 0 440 280" xmlns="http://www.w3.org/2000/svg"
      font-family="Segoe UI,Arial,sans-serif">
      ${content}
    </svg>
    <small>Шартты теориялық модель</small>
  </div>`;
}

/* =====================================
   3 ВИРТУАЛДЫ ПРАКТИКАЛЫҚ ЖҰМЫС
===================================== */

const labs=[
  {
    title:"Ом заңын зерттеу",
    aim:"Кернеу мен кедергінің ток күшіне әсерін анықтау.",
    sliders:[
      ["U","Кернеу","В",1,30,12,1],
      ["R","Кедергі","Ом",1,30,6,1]
    ],
    formula:F.ohm,
    calc:v=>[["Ток күші",v.U/v.R,"А"],
             ["Қуат",v.U*v.U/v.R,"Вт"]],
    question:"Кернеу тұрақты болғанда кедергіні екі есе арттырса, ток күші қалай өзгереді?",
    answer:"Ток күші екі есе азаяды.",
    visual:"series"
  },
  {
    title:"Аралас жалғаудың кедергісі",
    aim:"Параллель және тізбектей бөліктердің жалпы кедергісін есептеу.",
    sliders:[
      ["R1","Бірінші кедергі","Ом",1,30,6,1],
      ["R2","Екінші кедергі","Ом",1,30,3,1],
      ["R3","Тізбектей кедергі","Ом",1,30,4,1],
      ["U","Жалпы кернеу","В",1,30,18,1]
    ],
    formula:`R = ${frac("R₁R₂","R₁ + R₂")} + R₃`,
    calc:v=>{
      const rp=v.R1*v.R2/(v.R1+v.R2);
      const R=rp+v.R3;
      const I=v.U/R;
      return [
        ["Параллель бөліктің кедергісі",rp,"Ом"],
        ["Жалпы кедергі",R,"Ом"],
        ["Жалпы ток күші",I,"А"],
        ["Параллель бөліктің кернеуі",I*rp,"В"]
      ];
    },
    question:"Параллель бөліктің жалпы кедергісі ең кіші тармақ кедергісінен үлкен бола ма?",
    answer:"Жоқ. Оң кедергілер параллель жалғанғанда жалпы кедергі ең кіші тармақ кедергісінен де аз болады.",
    visual:"mixed"
  },
  {
    title:"Толық тізбек және энергия",
    aim:"Ішкі кедергінің ток күшіне, қысқыш кернеуіне және ПӘК-ке әсерін зерттеу.",
    sliders:[
      ["E","ЭҚК","В",1,30,12,1],
      ["R","Сыртқы кедергі","Ом",1,30,5,1],
      ["r","Ішкі кедергі","Ом",0,10,1,.5],
      ["t","Уақыт","с",10,120,30,10]
    ],
    formula:F.full,
    calc:v=>{
      const I=v.E/(v.R+v.r);
      const U=I*v.R;

      return [
        ["Ток күші",I,"А"],
        ["Қысқыш кернеуі",U,"В"],
        ["Сыртқы қуат",U*I,"Вт"],
        ["Ішкі жылу мөлшері",I*I*v.r*v.t,"Дж"],
        ["ПӘК",U/v.E*100,"%"]
      ];
    },
    question:"ЭҚК пен сыртқы кедергі тұрақты болғанда ішкі кедергі артса, ПӘК қалай өзгереді?",
    answer:"Пайдалы әсер коэффициенті азаяды.",
    visual:"full"
  }
];

function labPage(i){
  const l=labs[i];

  return slide(`
    <span class="eyebrow">ВИРТУАЛДЫ ПРАКТИКАЛЫҚ ЖҰМЫС · ${i+1} / 3</span>
    <h2>${l.title}</h2>

    <div class="definition"><p><b>Мақсаты:</b> ${l.aim}</p></div>

    <div class="grid2">

      <div class="card">
        <h3 class="blue">Берілген шамалар</h3>

        ${l.sliders.map(([key,label,unit,min,max,value,step])=>`
          <h3>${label}: <span class="blue" id="val_${key}">${value}</span> ${unit}</h3>
          <input type="range" id="lab_${key}"
            min="${min}" max="${max}" value="${value}" step="${step}"
            oninput="updateLab(${i})">
        `).join("")}

        <div class="formula">${l.formula}</div>
      </div>

      <div class="card">
        ${circuit(l.visual)}
        <h3 class="green">Есептелген нәтижелер</h3>
        <div id="labResults"></div>
      </div>
    </div>

    <div class="card notebook">
      <h3>Дәптерге жазып алыңдар</h3>
      <p>Виртуалды модельден үш түрлі мәндер жиынтығын таңдап,
      берілген шамалар мен есептелген нәтижелерді кестеге жазыңдар.</p>

      <p>${l.question}</p>

      <button onclick="$('labAnswer').classList.toggle('hidden')">
        Қорытындыны көрсету
      </button>

      <div id="labAnswer" class="answer hidden">
        <p>${l.answer}</p>
      </div>
    </div>
  `);
}

function updateLab(i){
  const l=labs[i],v={};

  l.sliders.forEach(([key])=>{
    v[key]=Number($("lab_"+key).value);
    $("val_"+key).textContent=num(v[key]);
  });

  $("labResults").innerHTML=l.calc(v).map(([n,a,u])=>`
    <div class="data">
      ${n}: <b class="green">${num(a)} ${u}</b>
    </div>
  `).join("");
}

/* =====================================
   РАНДОМ ЕСЕП БЕТТЕРІ
===================================== */

function taskIntro(){
  return slide(`
    <span class="eyebrow">ЖЕКЕ ТАПСЫРМАЛАР</span>

    <div class="card hero">
      <h1>🎲 Рандом есептер</h1>

      <p>Әр қатысушыға бір есеп кездейсоқ тағайындалды.
      Барлық оқушының есімі бір реттен шығады.</p>

      <div class="grid3">
        ${levels.map((n,i)=>`
          <div class="card">
            <span class="level ${levelClasses[i]}">${n}</span>
            <div class="score">${assignments.filter(a=>levelOf(a.taskId)===i).length}</div>
            <p>Есеп</p>
          </div>
        `).join("")}
      </div>

      <div class="formula">${assignments.length} оқушы · ${assignments.length} есеп</div>

      <div class="actions">
        <button class="primary" ${assignments.length?"":"disabled"}
          onclick="go(1)">Бірінші есеп →</button>
        <button onclick="reshuffle()">🎲 Қайта араластыру</button>
        <button onclick="openPanel('taskPanel')">Барлық есептер</button>
      </div>
    </div>
  `);
}

function taskPage(a){
  const s=students[a.studentId];
  const p=tasks[a.taskId];
  const level=levelOf(a.taskId);
  const done=completed.has(a.taskId);
  const position=assignments.indexOf(a)+1;

  return slide(`
    <span class="eyebrow">ЖЕКЕ ЕСЕП · ${position} / ${assignments.length}</span>

    <div class="studentBanner">
      <div class="avatar">${esc(s.name[0])}</div>

      <div>
        <b class="blue">🎲 РАНДОМ ТАҢДАЛДЫ</b>
        <h1>${esc(s.name)}</h1>
        <span class="level ${levelClasses[level]}">
          ${level+1}-деңгей · ${levels[level]}
        </span>
      </div>
    </div>

    <div class="card">
      <h3 class="blue">${a.taskId+1}-есеп. ${p[0]}</h3>

      <p class="problem">${p[1]}</p>

      <div class="data"><b class="blue">Берілгені:</b> ${p[2]}</div>
      <div class="data"><b class="green">Табу керек:</b> ${p[3]}</div>

      <div class="example">
        <p>${esc(s.name)}, есепті дәптерге шығарып,
        формуласы мен жауабын түсіндір.</p>
      </div>

      <div class="actions">
        <button class="primary"
          onclick="$('solution').classList.toggle('hidden')">
          Шешу жолын көрсету
        </button>

        <button onclick="openBoard()">✎ Тақтада шығару</button>

        <button class="${done?"done":""}" onclick="markDone(${a.taskId})">
          ${done?"✓ Орындалды":"Орындалды деп белгілеу"}
        </button>

        <button onclick="openPanel('taskPanel')">Барлық есептер</button>
        <button class="primary" onclick="go(1)">Келесі →</button>
      </div>

      <div class="answer hidden" id="solution">
        <h3 class="green">Шешуі:</h3>
        <div class="formula">${p[4]}</div>
      </div>
    </div>
  `);
}

/* =====================================
   КОМАНДАЛЫҚ ОЙЫН
===================================== */

function quizIntro(){
  return slide(`
    <span class="eyebrow">КОМАНДАЛЫҚ ОЙЫН</span>
    <h1>⚡ Физика білгірлері</h1>

    <div class="grid3">
      ${teamNames.map((n,i)=>`
        <div class="card">
          <h3 class="blue">${i+1}-топ — ${n}</h3>
          <p>${teamMembers(i).map(s=>esc(s.name)).join(", ")||"Қатысушы жоқ"}</p>
        </div>
      `).join("")}
    </div>

    <div class="card">
      <h3 class="green">Ойын ережесі</h3>
      <p>15 сұрақ, әр командаға 5 сұрақтан беріледі.</p>
      <p>Әр дұрыс жауапқа 10 ұпай қосылады.</p>
      <p>Жауап беретін оқушы рандом таңдалады.</p>
      <p>Жауаптан кейін 4 секундтан соң келесі командаға ауысады.</p>

      <button onclick="makeTeams(true)">🎲 Топтарды араластыру</button>
      <button class="primary" onclick="startQuiz()">Ойынды бастау →</button>
    </div>
  `);
}

function startQuiz(){
  if(present().length<3)
    return alert("Кемінде 3 қатысушы қажет.");

  if(teams.some(t=>!t.length)) makeTeams();

  resetGame();
  renderTeams();
  closePanel("teamPanel");
  goKey("quiz-0");
}

function quizPage(i){
  const q=quiz[i],k=i%3;
  const done=Object.hasOwn(answers,i);

  return slide(`
    <span class="eyebrow">ТОПТЫҚ ОЙЫН · ${i+1} / 15</span>

    <div class="teamTurn">
      ${teamNames.map((n,j)=>`
        <span class="teamPill ${j===k?"active":""}">
          ${n} — ${scores[j]} ұпай
        </span>
      `).join("")}
    </div>

    <div class="card">

      <div class="player">
        ${k+1}-топ — ${teamNames[k]}<br>
        Рандом қатысушы:
        <strong>${esc(pickSpeaker(i))}</strong>
      </div>

      <p class="question">${esc(q[0])}</p>

      <div class="choices">
        ${q[1].map((a,j)=>`
          <button class="choice ${done?
            j===q[2]?"correct":j===answers[i]?"wrong":"":""}"
            ${done?"disabled":""}
            onclick="submitAnswer(${i},${j})">
            ${"ABCD"[j]}. ${esc(a)}
          </button>
        `).join("")}
      </div>

      ${done?`
        <div class="${answers[i]===q[2]?"definition":"warning"}">
          <p>${answers[i]===q[2]?
            "Дұрыс жауап! +10 ұпай.":
            "Дұрыс жауап жасыл түспен көрсетілді."}</p>
        </div>

        <button class="primary" onclick="go(1)">
          Келесі команда →
        </button>
      `:""}
    </div>
  `);
}

function submitAnswer(i,j){
  if(pages[current].key!=="quiz-"+i||
    Object.hasOwn(answers,i)) return;

  if(teams.some(t=>!t.length))
    return alert("Алдымен 3 командаға бөлініңдер.");

  answers[i]=j;

  if(j===quiz[i][2]) scores[i%3]+=10;

  renderTeams();
  renderPage(false);

  clearTimeout(autoNext);

  autoNext=setTimeout(()=>{
    if(pages[current].key==="quiz-"+i) go(1);
  },4000);
}

/* =====================================
   ҚОРЫТЫНДЫ ЖӘНЕ ҮЙ ЖҰМЫСЫ
===================================== */

function resultsPage(){
  const total=Object.keys(answers).length;
  const best=Math.max(...scores);
  const winners=teamNames.filter((_,i)=>scores[i]===best);

  return slide(`
    <span class="eyebrow">ҚОРЫТЫНДЫ</span>
    <h1>Практикалық жұмыс нәтижелері</h1>

    <div class="card">
      <h3>Жеке есептер</h3>
      <div class="formula">${completed.size} / ${assignments.length}</div>
      <p>Орындалды деп белгіленген тапсырмалар.</p>
      <button onclick="openPanel('taskPanel')">Есептер тізімі</button>
    </div>

    <div class="grid3">
      ${teamNames.map((n,i)=>`
        <div class="card">
          <h3>${n}</h3>
          <div class="score">${scores[i]} ұпай</div>
        </div>
      `).join("")}
    </div>

    <div class="definition">
      <h2 class="green">${total<15?"Ойын толық аяқталған жоқ":
        winners.length===1?"🏆 Жеңімпаз — "+winners[0]:
        "Тең нәтиже — "+winners.join(", ")}</h2>
      <p>Жауап берілген сұрақтар: ${total} / 15</p>
    </div>

    <button onclick="startQuiz()">Қайта ойнау</button>
  `);
}

function homeworkPage(){
  return slide(`
    <span class="eyebrow">ҮЙ ТАПСЫРМАСЫ</span>
    <h2>Екі есепті дәптерге шығарыңдар</h2>

    <div class="card">
      <h3 class="blue">1-есеп. Аралас электр тізбегі</h3>

      <p>Кедергілері 12 Ом және 6 Ом болатын екі резистор
      параллель жалғанған. Осы бөлікке 5 Ом резистор
      тізбектей жалғанған деп қарастырылады.
      Жалпы кернеу 27 В.</p>

      <p><b>Анықтаңдар:</b></p>
      <p>а) Тізбектің жалпы кедергісін.</p>
      <p>ә) Жалпы ток күшін.</p>
      <p>б) Параллель бөліктегі кернеуді.</p>
      <p>в) Әр параллель тармақтағы ток күшін.</p>
    </div>

    <div class="card">
      <h3 class="green">2-есеп. Электр энергиясы</h3>

      <p>Ток көзінің ЭҚК-і 40 В, ішкі кедергісі 2 Ом,
      ал сыртқы кедергісі 8 Ом. Токтың өту уақыты 2 минут.</p>

      <p><b>Анықтаңдар:</b></p>
      <p>а) Тізбектегі ток күшін.</p>
      <p>ә) Қысқыш кернеуін.</p>
      <p>б) Сыртқы тізбектегі қуатты.</p>
      <p>в) Ішкі кедергіде бөлінетін жылу мөлшерін.</p>
    </div>

    <div class="example">
      <p>Берілгені, SI жүйесі, формуласы, шешуі және жауабы
      толық жазылсын.</p>
    </div>

    <div class="card hero">
      <h1 class="green">Сабақ аяқталды!</h1>
      <h2>Назарларыңызға рақмет!</h2>
      <p>Сау болыңыздар!</p>
      <b class="blue">BY DARKHAN</b>
    </div>
  `);
}

/* =====================================
   БЕТТЕРДІ ҚҰРАСТЫРУ
===================================== */

function buildPages(){
  pages=[];
  sections=[];

  function section(name,items){
    if(!items.length) return;
    sections.push({name,start:pages.length});
    pages.push(...items);
  }

  section("⌂ Басты бет",[{key:"intro",render:introPage}]);
  section("📋 Сабақ жоспары",[{key:"plan",render:planPage}]);

  section("📘 Қайталау және конспект",
    notes.map((n,i)=>({
      key:"note-"+i,render:()=>notePage(n,i)
    })));

  section("⚡ Практикалық жұмыс",
    labs.map((l,i)=>({
      key:"lab-"+i,lab:i,render:()=>labPage(i)
    })));

  section("🎲 Рандом есептер",
    [{key:"task-intro",render:taskIntro}]);

  for(let level=0;level<3;level++){
    const list=assignments.filter(a=>levelOf(a.taskId)===level);

    section(`${["🟢","🟡","🔴"][level]} ${level+1}-деңгей (${list.length})`,
      list.map(a=>({
        key:"task-"+a.taskId,render:()=>taskPage(a)
      })));
  }

  section("🏆 Топтық ойын",[
    {key:"quiz-intro",render:quizIntro},
    ...quiz.map((_,i)=>({
      key:"quiz-"+i,render:()=>quizPage(i)
    }))
  ]);

  section("📊 Қорытынды",[{key:"results",render:resultsPage}]);
  section("✎ Үй тапсырмасы",[{key:"homework",render:homeworkPage}]);

  $("menu").innerHTML=sections.map((s,i)=>`
    <button data-section="${i}" onclick="goPage(${s.start})">
      ${s.name}
    </button>
  `).join("");
}

function renderPage(scroll=true){
  current=Math.max(0,Math.min(current,pages.length-1));

  $("stage").innerHTML=pages[current].render();

  $("pageCount").textContent=`${current+1} / ${pages.length}`;
  $("progress").style.width=`${(current+1)/pages.length*100}%`;

  $("prev").disabled=current===0;
  $("next").disabled=current===pages.length-1;

  let active=0;

  sections.forEach((s,i)=>{
    if(current>=s.start) active=i;
  });

  document.querySelectorAll("[data-section]").forEach(b=>{
    b.classList.toggle("active",Number(b.dataset.section)===active);
  });

  if(pages[current].lab!==undefined) updateLab(pages[current].lab);

  applyScale();

  if(scroll) $("screen").scrollTo(0,0);
}

function goPage(i){
  clearTimeout(autoNext);
  stopReading();
  current=Math.max(0,Math.min(i,pages.length-1));
  renderPage();
}

function goKey(key){
  const i=pages.findIndex(p=>p.key===key);
  goPage(i<0?0:i);
}

function go(n){goPage(current+n);}

/* =====================================
   ЭКРАН МАСШТАБЫ
===================================== */

let scale=100;

function applyScale(){
  const screen=$("screen");
  const css=getComputedStyle(screen);

  const width=Math.max(1,screen.clientWidth-
    parseFloat(css.paddingLeft)-parseFloat(css.paddingRight));

  $("stage").style.width=width+"px";
  $("stage").style.zoom=scale/100;
  $("stage").style.margin=scale>100?"0":"0 auto";
  $("scale").textContent=scale+"%";
}

function zoom(n){
  scale=n===0?100:Math.max(25,Math.min(300,scale+n));
  applyScale();
  if(n===0) $("screen").scrollTo(0,0);
}

function toggleMenu(){
  const hidden=$("app").classList.toggle("menuHidden");
  document.body.classList.toggle("menuHidden",hidden);
  requestAnimationFrame(applyScale);
}

async function fullscreen(){
  try{
    if(document.fullscreenElement)
      await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  }catch{
    alert("Толық экран үшін F11 басыңыз.");
  }
}

/* =====================================
   ДАУЫСТАП ОҚУ
===================================== */

function stopReading(){
  if("speechSynthesis" in window) speechSynthesis.cancel();
}

function readPage(){
  if(!("speechSynthesis" in window))
    return alert("Дыбыстау қолжетімсіз.");

  const voice=speechSynthesis.getVoices()
    .find(v=>v.lang.toLowerCase().startsWith("kk"));

  if(!voice) return alert("Құрылғыда қазақша дауыс табылмады.");

  stopReading();

  const speech=new SpeechSynthesisUtterance($("stage").innerText);
  speech.lang="kk-KZ";
  speech.voice=voice;
  speech.rate=.95;

  speechSynthesis.speak(speech);
}

/* =====================================
   ҚОЗҒАЛМАЛЫ ТЕРЕЗЕЛЕР
===================================== */

let z=200;

function openPanel(id){
  const p=$(id);

  p.classList.remove("hidden");
  p.style.zIndex=++z;

  if(id==="attendance"){
    attendanceDraft=students.map(s=>s.present);
    renderStudents();
  }

  if(id==="taskPanel") renderTasks();
  if(id==="teamPanel") renderTeams();

  clampPanel(p);
}

function closePanel(id){
  $(id).classList.add("hidden");
}

function clampPanel(p){
  if(p.classList.contains("hidden")) return;

  const r=p.getBoundingClientRect();

  p.style.left=Math.max(0,Math.min(r.left,innerWidth-r.width))+"px";
  p.style.top=Math.max(0,Math.min(r.top,innerHeight-r.height))+"px";
  p.style.right="auto";
}

document.querySelectorAll(".floating").forEach(p=>{

  let drag=null,suppress=false;

  p.addEventListener("pointerdown",e=>{
    if(e.button!==0||!e.isPrimary) return;

    p.style.zIndex=++z;
    suppress=false;

    if(!p.classList.contains("mini")&&!e.target.closest(".handle")) return;

    if(e.target.closest("select,input:not([readonly]),textarea")) return;

    const r=p.getBoundingClientRect();

    drag={
      id:e.pointerId,x:e.clientX,y:e.clientY,
      left:r.left,top:r.top,moving:false
    };
  });

  window.addEventListener("pointermove",e=>{
    if(!drag||drag.id!==e.pointerId) return;

    const dx=e.clientX-drag.x;
    const dy=e.clientY-drag.y;

    if(!drag.moving&&Math.hypot(dx,dy)<6) return;

    if(!drag.moving){
      drag.moving=true;
      suppress=true;

      try{p.setPointerCapture(e.pointerId);}catch{}
    }

    if(e.cancelable) e.preventDefault();

    p.style.left=Math.max(0,Math.min(
      drag.left+dx,innerWidth-p.offsetWidth))+"px";

    p.style.top=Math.max(0,Math.min(
      drag.top+dy,innerHeight-p.offsetHeight))+"px";

    p.style.right="auto";
  },{passive:false});

  function end(e){
    if(!drag||drag.id!==e.pointerId) return;

    drag=null;

    if(p.hasPointerCapture(e.pointerId))
      p.releasePointerCapture(e.pointerId);
  }

  window.addEventListener("pointerup",end);
  window.addEventListener("pointercancel",end);

  p.addEventListener("click",e=>{
    if(suppress){
      suppress=false;
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);
});

/* =====================================
   ҒЫЛЫМИ КАЛЬКУЛЯТОР
===================================== */

let expression="";
let degree=true;

const keys=[
  "DEG","C","⌫","÷",
  "sin","cos","tan","ctg",
  "√","x²","^","×",
  "7","8","9","−",
  "4","5","6","+",
  "1","2","3","(",
  "0",".","π",")",
  "ln","log","EXP","="
];

function renderMathKeys(){
  $("mathKeys").innerHTML=keys.map(k=>`
    <button class="${k==="="?"primary":""}"
      onclick="mathPress('${k}')">
      ${k==="DEG"?(degree?"DEG":"RAD"):k}
    </button>
  `).join("");
}

function mathPress(k){
  try{
    if(k==="DEG"){
      degree=!degree;
      renderMathKeys();
      return;
    }

    if(k==="C"){
      expression="";
      $("mathResult").textContent="0";
    }else if(k==="⌫"){
      expression=expression.slice(0,-1);
    }else if(k==="="){
      expression=String(Number(evaluateMath(expression).toPrecision(12)));
      $("mathResult").textContent=num(Number(expression));
    }else{
      const map={
        "÷":"/","×":"*","−":"-","π":"pi",
        "√":"sqrt(","x²":"^2","EXP":"e",
        sin:"sin(",cos:"cos(",tan:"tan(",
        ctg:"ctg(",ln:"ln(",log:"log("
      };

      expression+=map[k]||k;
    }

    $("mathDisplay").value=expression
      .replaceAll("pi","π")
      .replaceAll("sqrt","√")
      .replaceAll("*","×")
      .replaceAll("/","÷");

  }catch{
    $("mathResult").textContent="Қате өрнек";
  }
}

/* ӨРНЕКТІ eval ҚОЛДАНБАЙ ЕСЕПТЕУ */

function evaluateMath(source){
  const s=source.replace(/\s+/g,"");

  if(!s||s.length>500) throw Error("Қате");

  const t=s.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z]+|[+\-*/^()]/gi)||[];

  if(t.join("")!==s) throw Error("Қате таңба");

  let p=0;

  function sum(){
    let x=product();

    while(t[p]==="+"||t[p]==="-"){
      const op=t[p++],y=product();
      x=op==="+"?x+y:x-y;
    }

    return x;
  }

  function product(){
    let x=unary();

    while(t[p]==="*"||t[p]==="/"){
      const op=t[p++],y=unary();
      if(op==="/"&&y===0) throw Error("Нөлге бөлу");
      x=op==="*"?x*y:x/y;
    }

    return x;
  }

  function unary(){
    if(t[p]==="+"){p++;return unary();}
    if(t[p]==="-"){p++;return -unary();}
    return power();
  }

  function power(){
    let x=atom();

    if(t[p]==="^"){
      p++;
      x=x**unary();
    }

    return x;
  }

  function atom(){
    const k=t[p++];

    if(k===undefined) throw Error("Өрнек толық емес");
    if(/^(?:\d|\.)/.test(k)) return Number(k);
    if(k==="pi") return Math.PI;

    if(k==="("){
      const x=sum();
      if(t[p++]!==")") throw Error("Жақша");
      return x;
    }

    const rad=x=>degree?x*Math.PI/180:x;

    const funcs={
      sin:x=>Math.sin(rad(x)),
      cos:x=>Math.cos(rad(x)),
      tan:x=>{
        if(Math.abs(Math.cos(rad(x)))<1e-12) throw Error("Қате");
        return Math.tan(rad(x));
      },
      ctg:x=>{
        if(Math.abs(Math.sin(rad(x)))<1e-12) throw Error("Қате");
        return 1/Math.tan(rad(x));
      },
      sqrt:Math.sqrt,
      ln:Math.log,
      log:Math.log10
    };

    if(Object.hasOwn(funcs,k)){
      if(t[p++]!=="(") throw Error("Жақша");
      const x=sum();
      if(t[p++]!==")") throw Error("Жақша");
      return funcs[k](x);
    }

    throw Error("Қате өрнек");
  }

  const result=sum();

  if(p!==t.length||!Number.isFinite(result))
    throw Error("Қате");

  return result;
}

/* =====================================
   ФИЗИКАЛЫҚ КАЛЬКУЛЯТОР
===================================== */

const units={
  I:["Ток күші","А"],
  U:["Кернеу","В"],
  R:["Кедергі","Ом"],
  r:["Ішкі кедергі","Ом"],
  E:["ЭҚК","В"],
  A:["Жұмыс","Дж"],
  q:["Заряд","Кл"],
  P:["Қуат","Вт"],
  Q:["Жылу","Дж"],
  t:["Уақыт","с"],
  eta:["ПӘК","%"],
  R1:["Кедергі 1","Ом"],
  R2:["Кедергі 2","Ом"],
  R3:["Кедергі 3","Ом"],
  rho:["Меншікті кедергі","Ом·м"],
  l:["Ұзындық","м"],
  S:["Қима ауданы","м²"],
  I1:["Кіретін ток 1","А"],
  I2:["Кіретін ток 2","А"],
  I3:["Шығатын ток 1","А"],
  I4:["Шығатын ток 2","А"]
};

const physics=[
  {
    name:"Ом заңы",
    vars:["I","U","R"],
    solve:{
      I:v=>v.U/v.R,
      U:v=>v.I*v.R,
      R:v=>v.U/v.I
    }
  },
  {
    name:"Электр заряды",
    vars:["q","I","t"],
    solve:{
      q:v=>v.I*v.t,
      I:v=>v.q/v.t,
      t:v=>v.q/v.I
    }
  },
  {
    name:"Өткізгіштің кедергісі",
    vars:["R","rho","l","S"],
    solve:{
      R:v=>v.rho*v.l/v.S,
      rho:v=>v.R*v.S/v.l,
      l:v=>v.R*v.S/v.rho,
      S:v=>v.rho*v.l/v.R
    }
  },
  {
    name:"Тізбектей жалғау",
    vars:["R","R1","R2"],
    solve:{
      R:v=>v.R1+v.R2,
      R1:v=>v.R-v.R2,
      R2:v=>v.R-v.R1
    }
  },
  {
    name:"Параллель жалғау",
    vars:["R","R1","R2"],
    solve:{R:v=>v.R1*v.R2/(v.R1+v.R2)}
  },
  {
    name:"Аралас жалғау",
    vars:["R","R1","R2","R3"],
    solve:{R:v=>v.R1*v.R2/(v.R1+v.R2)+v.R3}
  },
  {
    name:"Электр қозғаушы күш",
    vars:["E","A","q"],
    solve:{
      E:v=>v.A/v.q,
      A:v=>v.E*v.q,
      q:v=>v.A/v.E
    }
  },
  {
    name:"Толық тізбек үшін Ом заңы",
    vars:["I","E","R","r"],
    solve:{
      I:v=>v.E/(v.R+v.r),
      E:v=>v.I*(v.R+v.r),
      R:v=>v.E/v.I-v.r,
      r:v=>v.E/v.I-v.R
    }
  },
  {
    name:"Қысқыш кернеуі",
    vars:["U","E","I","r"],
    solve:{
      U:v=>v.E-v.I*v.r,
      E:v=>v.U+v.I*v.r,
      I:v=>(v.E-v.U)/v.r,
      r:v=>(v.E-v.U)/v.I
    }
  },
  {
    name:"Электр тогының жұмысы",
    vars:["A","U","I","t"],
    solve:{
      A:v=>v.U*v.I*v.t,
      U:v=>v.A/(v.I*v.t),
      I:v=>v.A/(v.U*v.t),
      t:v=>v.A/(v.U*v.I)
    }
  },
  {
    name:"Қуат — P = UI",
    vars:["P","U","I"],
    solve:{
      P:v=>v.U*v.I,
      U:v=>v.P/v.I,
      I:v=>v.P/v.U
    }
  },
  {
    name:"Қуат — P = I²R",
    vars:["P","I","R"],
    solve:{
      P:v=>v.I**2*v.R,
      I:v=>Math.sqrt(v.P/v.R),
      R:v=>v.P/v.I**2
    }
  },
  {
    name:"Қуат — P = U²/R",
    vars:["P","U","R"],
    solve:{
      P:v=>v.U**2/v.R,
      U:v=>Math.sqrt(v.P*v.R),
      R:v=>v.U**2/v.P
    }
  },
  {
    name:"Джоуль–Ленц заңы",
    vars:["Q","I","R","t"],
    solve:{
      Q:v=>v.I**2*v.R*v.t,
      I:v=>Math.sqrt(v.Q/(v.R*v.t)),
      R:v=>v.Q/(v.I**2*v.t),
      t:v=>v.Q/(v.I**2*v.R)
    }
  },
  {
    name:"ПӘК",
    vars:["eta","U","E"],
    solve:{eta:v=>100*v.U/v.E}
  },
  {
    name:"Кирхгофтың бірінші заңы",
    vars:["I1","I2","I3","I4"],
    solve:{
      I1:v=>v.I3+v.I4-v.I2,
      I2:v=>v.I3+v.I4-v.I1,
      I3:v=>v.I1+v.I2-v.I4,
      I4:v=>v.I1+v.I2-v.I3
    }
  }
];

function initPhysics(){
  $("physicsFormula").innerHTML=physics.map((f,i)=>`
    <option value="${i}">${f.name}</option>
  `).join("");

  selectFormula();
}

function selectFormula(){
  const f=physics[Number($("physicsFormula").value)];

  $("physicsUnknown").innerHTML=Object.keys(f.solve).map(k=>`
    <option value="${k}">${units[k][0]}</option>
  `).join("");

  physicsInputs();
}

function physicsInputs(){
  const f=physics[Number($("physicsFormula").value)];
  const unknown=$("physicsUnknown").value;

  $("physicsInputs").innerHTML=f.vars.filter(k=>k!==unknown).map(k=>`
    <label>${units[k][0]} (${units[k][1]})</label>
    <input id="phys_${k}" inputmode="decimal" placeholder="Мәні">
  `).join("");

  $("physicsResult").textContent="Нәтиже";
  clampPanel($("physicsPanel"));
}

function calculatePhysics(){
  try{
    const f=physics[Number($("physicsFormula").value)];
    const unknown=$("physicsUnknown").value;
    const v={};

    f.vars.filter(k=>k!==unknown).forEach(k=>{
      const raw=$("phys_"+k).value.trim().replaceAll(",",".");

      if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(raw))
        throw Error("Мәндерді дұрыс енгізіңіз");

      const n=Number(raw);

      if(!Number.isFinite(n)||n<0)
        throw Error("Мәнді тексеріңіз");

      v[k]=n;
    });

    const result=f.solve[unknown](v);
    const kirchhoff=f.name.startsWith("Кирхгоф");

    if(!Number.isFinite(result)||(result<0&&!kirchhoff))
      throw Error("Берілгендерді тексеріңіз");

    if(unknown==="eta"&&result>100)
      throw Error("ПӘК 100%-дан аспайды");

    const symbols={
      E:"ε",rho:"ρ",eta:"η",
      R1:"R₁",R2:"R₂",R3:"R₃",
      I1:"I₁",I2:"I₂",I3:"I₃",I4:"I₄"
    };

    $("physicsResult").textContent=
      `${symbols[unknown]||unknown} = ${num(result)} ${units[unknown][1]}`+
      (kirchhoff&&result<0?" (кері бағыт)":"");

  }catch(e){
    $("physicsResult").textContent=e.message;
  }
}

/* =====================================
   ИНТЕРАКТИВТІ ТАҚТА
===================================== */

const canvas=$("canvas");
const ctx=canvas.getContext("2d");
const BW=1600,BH=900;

let tool="pen";
let ink="#19364f";
let boardScaleValue=100;

let boardPages=[{actions:[],redo:[],grid:false}];
let boardIndex=0;
let draft=null;
let pointer=null;
let pan=null;

const state=()=>boardPages[boardIndex];

function openBoard(){
  clearTimeout(autoNext);
  stopReading();

  $("board").classList.remove("hidden");
  setTool(tool);
  resizeBoard();
}

function closeBoard(){
  cancelDrawing();
  $("board").classList.add("hidden");
}

function color(c){
  ink=c;
  $("ink").value=c;
}

function setTool(t){
  cancelDrawing();

  tool=t;

  document.querySelectorAll("[data-tool]").forEach(b=>{
    b.classList.toggle("active",b.dataset.tool===t);
  });

  canvas.style.cursor=
    t==="hand"?"grab":t==="text"?"text":"crosshair";
}

/* СУРЕТТІҢ ДӘЛ КООРДИНАТАЛАРЫ */

function point(e){
  const r=canvas.getBoundingClientRect();

  return {
    x:(e.clientX-r.left)*BW/r.width,
    y:(e.clientY-r.top)*BH/r.height
  };
}

function draw(a){
  ctx.save();

  ctx.strokeStyle=a.color||"#19364f";
  ctx.fillStyle=a.color||"#19364f";
  ctx.lineWidth=a.size||5;
  ctx.lineCap="round";
  ctx.lineJoin="round";

  if(a.type==="clear"){
    ctx.clearRect(0,0,BW,BH);

  }else if(a.type==="image"){
    ctx.drawImage(a.image,a.x,a.y,a.w,a.h);

  }else if(a.type==="text"){
    ctx.font=`600 ${a.size}px "Segoe UI",Arial`;
    ctx.textBaseline="top";
    ctx.fillText(a.text,a.x,a.y);

  }else if(["pen","marker","eraser"].includes(a.type)){

    if(a.type==="eraser")
      ctx.globalCompositeOperation="destination-out";

    if(a.type==="marker") ctx.globalAlpha=.3;

    const points=a.points;

    if(points.length){
      ctx.beginPath();

      if(points.length===1){
        ctx.arc(points[0].x,points[0].y,a.size/2,0,Math.PI*2);
        ctx.fill();
      }else{
        ctx.moveTo(points[0].x,points[0].y);
        points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
        ctx.stroke();
      }
    }

  }else{
    const p=a.start,q=a.end;
    const dx=q.x-p.x,dy=q.y-p.y;

    ctx.beginPath();

    if(a.type==="line"||a.type==="arrow"){
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(q.x,q.y);
    }

    if(a.type==="arrow"){
      const angle=Math.atan2(dy,dx);
      const len=Math.max(16,a.size*3);

      ctx.lineTo(
        q.x-len*Math.cos(angle-Math.PI/6),
        q.y-len*Math.sin(angle-Math.PI/6)
      );

      ctx.moveTo(q.x,q.y);

      ctx.lineTo(
        q.x-len*Math.cos(angle+Math.PI/6),
        q.y-len*Math.sin(angle+Math.PI/6)
      );
    }

    if(a.type==="rect") ctx.rect(p.x,p.y,dx,dy);

    if(a.type==="circle"){
      ctx.ellipse(
        (p.x+q.x)/2,(p.y+q.y)/2,
        Math.max(.1,Math.abs(dx)/2),
        Math.max(.1,Math.abs(dy)/2),
        0,0,Math.PI*2
      );
    }

    if(a.type==="triangle"){
      ctx.moveTo((p.x+q.x)/2,p.y);
      ctx.lineTo(p.x,q.y);
      ctx.lineTo(q.x,q.y);
      ctx.closePath();
    }

    ctx.stroke();
  }

  ctx.restore();
}

function renderBoard(){
  ctx.clearRect(0,0,BW,BH);

  state().actions.forEach(draw);

  if(draft) draw(draft);

  $("boardCount").textContent=
    `${boardIndex+1} / ${boardPages.length}`;

  const paper=$("paper");

  if(state().grid){
    const step=Math.max(1,40*paper.clientWidth/BW);

    paper.style.backgroundImage=`
      linear-gradient(#d5e6f3 1px,transparent 1px),
      linear-gradient(90deg,#d5e6f3 1px,transparent 1px)
    `;

    paper.style.backgroundSize=`${step}px ${step}px`;
  }else{
    paper.style.backgroundImage="none";
  }
}

function commit(a){
  state().actions.push(a);
  state().redo=[];
  renderBoard();
}

/* =====================================
   ҚАЛАМ, ТІНТУІР ЖӘНЕ САУСАҚ
===================================== */

canvas.addEventListener("pointerdown",e=>{
  if(!e.isPrimary||e.button!==0||pointer!==null) return;

  e.preventDefault();

  const p=point(e);
  const size=Number($("penSize").value);

  if(tool==="text"){
    const text=prompt("Тақтаға жазылатын мәтін:");

    if(text&&text.trim()){
      commit({
        type:"text",text:text.trim(),
        color:ink,size:Math.max(25,size*4),
        x:p.x,y:p.y
      });
    }

    return;
  }

  pointer=e.pointerId;
  canvas.setPointerCapture(pointer);

  if(tool==="hand"){
    pan={
      x:e.clientX,y:e.clientY,
      left:$("boardViewport").scrollLeft,
      top:$("boardViewport").scrollTop
    };

    canvas.style.cursor="grabbing";
    return;
  }

  const width=tool==="eraser"?Math.max(18,size*3):
    tool==="marker"?size*4:size;

  draft=["pen","marker","eraser"].includes(tool)
    ?{type:tool,color:ink,size:width,points:[p]}
    :{type:tool,color:ink,size:width,start:p,end:p};

  renderBoard();
});

canvas.addEventListener("pointermove",e=>{
  if(e.pointerId!==pointer) return;

  if(pan){
    $("boardViewport").scrollLeft=pan.left-(e.clientX-pan.x);
    $("boardViewport").scrollTop=pan.top-(e.clientY-pan.y);
    return;
  }

  if(!draft) return;

  const p=point(e);

  if(draft.points){
    const last=draft.points.at(-1);

    if(Math.hypot(p.x-last.x,p.y-last.y)>.3)
      draft.points.push(p);
  }else{
    draft.end=p;
  }

  renderBoard();
});

function finishDrawing(e,cancelled=false){
  if(e.pointerId!==pointer) return;

  if(draft&&!cancelled){
    const p=point(e);

    if(draft.points){
      const last=draft.points.at(-1);

      if(Math.hypot(p.x-last.x,p.y-last.y)>.3)
        draft.points.push(p);
    }else{
      draft.end=p;
    }
  }

  const finished=draft;

  draft=null;
  pan=null;
  pointer=null;

  if(finished&&!cancelled) commit(finished);
  else renderBoard();

  if(canvas.hasPointerCapture(e.pointerId))
    canvas.releasePointerCapture(e.pointerId);

  if(tool==="hand") canvas.style.cursor="grab";
}

function cancelDrawing(){
  const id=pointer;

  pointer=null;
  draft=null;
  pan=null;

  if(id!==null&&canvas.hasPointerCapture(id))
    canvas.releasePointerCapture(id);

  renderBoard();
}

canvas.addEventListener("pointerup",e=>finishDrawing(e));
canvas.addEventListener("pointercancel",e=>finishDrawing(e,true));
canvas.addEventListener("lostpointercapture",e=>finishDrawing(e,true));

/* =====================================
   ТАҚТАНЫҢ БЕТТЕРІ
===================================== */

function newBoardPage(){
  cancelDrawing();

  boardPages.push({actions:[],redo:[],grid:false});
  boardIndex=boardPages.length-1;

  renderBoard();
}

function boardPage(n){
  cancelDrawing();

  boardIndex=Math.max(
    0,Math.min(boardIndex+n,boardPages.length-1)
  );

  renderBoard();
}

function deleteBoardPage(){
  if(!confirm("Осы бетті өшіреміз бе?")) return;

  cancelDrawing();

  if(boardPages.length===1){
    boardPages[0]={actions:[],redo:[],grid:false};
  }else{
    boardPages.splice(boardIndex,1);
    boardIndex=Math.min(boardIndex,boardPages.length-1);
  }

  renderBoard();
}

function undo(){
  cancelDrawing();

  if(state().actions.length){
    state().redo.push(state().actions.pop());
    renderBoard();
  }
}

function redo(){
  cancelDrawing();

  if(state().redo.length){
    state().actions.push(state().redo.pop());
    renderBoard();
  }
}

function clearBoard(){
  if(!confirm("Тақтаны тазалаймыз ба?")) return;
  cancelDrawing();
  commit({type:"clear"});
}

function toggleGrid(){
  state().grid=!state().grid;
  renderBoard();
}

/* =====================================
   ТАҚТАНЫҢ МАСШТАБЫ
===================================== */

function resizeBoard(){
  if($("board").classList.contains("hidden")) return;

  const viewport=$("boardViewport");

  const w=Math.max(1,viewport.clientWidth-24);
  const h=Math.max(1,viewport.clientHeight-24);

  const base=Math.min(w,h*BW/BH);
  const width=base*boardScaleValue/100;
  const height=width*BH/BW;

  const paper=$("paper");

  paper.style.width=width+"px";
  paper.style.marginTop=Math.max(0,(h-height)/2)+"px";
  paper.style.marginLeft=width>w?"0":"auto";
  paper.style.marginRight=width>w?"0":"auto";

  $("boardScale").textContent=boardScaleValue+"%";

  renderBoard();
}

function boardZoom(n){
  boardScaleValue=n===0?100:
    Math.max(25,Math.min(300,boardScaleValue+n));

  resizeBoard();

  if(n===0) $("boardViewport").scrollTo(0,0);
}

/* =====================================
   СУРЕТ ҚОСУ
===================================== */

function importImage(e){
  const file=e.target.files[0];

  if(!file) return;

  const target=state();
  const image=new Image();
  const url=URL.createObjectURL(file);

  image.onload=()=>{
    const k=Math.min(1000/image.width,650/image.height,1);
    const w=image.width*k,h=image.height*k;

    if(boardPages.includes(target)){
      target.actions.push({
        type:"image",image,w,h,
        x:(BW-w)/2,y:(BH-h)/2
      });

      target.redo=[];
    }

    URL.revokeObjectURL(url);
    renderBoard();
  };

  image.onerror=()=>{
    URL.revokeObjectURL(url);
    alert("Сурет ашылмады.");
  };

  image.src=url;
  e.target.value="";
}

/* =====================================
   ТАҚТАНЫ PNG РЕТІНДЕ САҚТАУ
===================================== */

function saveBoard(){
  const output=document.createElement("canvas");

  output.width=BW;
  output.height=BH;

  const out=output.getContext("2d");

  out.fillStyle="white";
  out.fillRect(0,0,BW,BH);

  if(state().grid){
    out.strokeStyle="#d5e6f3";
    out.lineWidth=1;

    for(let x=0;x<=BW;x+=40){
      out.beginPath();
      out.moveTo(x,0);
      out.lineTo(x,BH);
      out.stroke();
    }

    for(let y=0;y<=BH;y+=40){
      out.beginPath();
      out.moveTo(0,y);
      out.lineTo(BW,y);
      out.stroke();
    }
  }

  out.drawImage(canvas,0,0);

  const page=boardIndex+1;

  output.toBlob(blob=>{
    if(!blob) return;

    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");

    a.href=url;
    a.download=`physics-324-board-${page}.png`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(()=>URL.revokeObjectURL(url),1000);
  },"image/png");
}

/* =====================================
   АЛМАТЫ УАҚЫТЫ
   UTC+5
===================================== */

const clockFormat=new Intl.DateTimeFormat("kk-KZ",{
  timeZone:"UTC",
  hour:"2-digit",minute:"2-digit",second:"2-digit",
  hourCycle:"h23"
});

const dateFormat=new Intl.DateTimeFormat("kk-KZ",{
  timeZone:"UTC",
  day:"numeric",month:"long",year:"numeric"
});

function updateClock(){
  const date=new Date(Date.now()+5*60*60*1000);

  $("clock").textContent=clockFormat.format(date);
  $("date").textContent=dateFormat.format(date);
}

/* =====================================
   80 МИНУТТЫҚ ТАЙМЕР
===================================== */

const duration=4800;

let elapsed=0;
let started=0;
let running=false;

function timerSeconds(){
  return Math.min(duration,Math.max(0,Math.floor(
    elapsed+(running?(Date.now()-started)/1000:0)
  )));
}

function updateTimer(){
  const remaining=duration-timerSeconds();

  $("timer").textContent=
    String(Math.floor(remaining/60)).padStart(2,"0")+":"+
    String(remaining%60).padStart(2,"0");

  $("timer").style.color=remaining<=300?"#d63a50":"#16874e";

  if(remaining===0){
    elapsed=duration;
    running=false;
  }

  $("timerBtn").textContent=running?"Тоқтату":"Бастау";
  $("timerBtn").disabled=remaining===0;
}

function startTimer(){
  if(running||elapsed>=duration) return;

  started=Date.now();
  running=true;
  updateTimer();
}

function toggleTimer(){
  if(running){
    elapsed=Math.min(duration,elapsed+(Date.now()-started)/1000);
    running=false;
  }else{
    startTimer();
  }

  updateTimer();
}

function resetTimer(){
  if(!confirm("Таймерді 80 минутқа қайтарамыз ба?")) return;

  elapsed=0;
  started=0;
  running=false;

  updateTimer();
}

/* =====================================
   БІР РЕЗИСТОРЛЫ МОДЕЛЬ
===================================== */

const originalCircuit=circuit;

circuit=function(kind){
  if(kind!=="single") return originalCircuit(kind);

  return `
    <div class="visual">
      <svg viewBox="0 0 440 280" xmlns="http://www.w3.org/2000/svg"
        font-family="Segoe UI,Arial">
        <path d="M40 65 H115 M135 65 H385 V205 H260
          M180 205 H40 V65 M115 50 V80 M135 40 V90"
          stroke="#38576e" stroke-width="4" fill="none"/>
        <rect x="180" y="188" width="80" height="34"
          rx="4" fill="#dff7e9" stroke="#16874e" stroke-width="3"/>
        <text x="220" y="212" text-anchor="middle" font-size="20"
          fill="#16874e">R</text>
        <text x="125" y="125" text-anchor="middle" font-size="22"
          fill="#087dcc">U</text>
        <text x="105" y="35" font-size="20" fill="#087dcc">−</text>
        <text x="145" y="35" font-size="20" fill="#d63a50">+</text>
        <path d="M385 95 V155 L377 143 M385 155 L393 143"
          fill="none" stroke="#16874e" stroke-width="3"/>
        <text x="410" y="130" font-size="20" fill="#16874e">I</text>
      </svg>
      <small>Ом заңына арналған виртуалды модель</small>
    </div>`;
};

labs[0].visual="single";

/* =====================================
   ПЕРНЕТАҚТАДАН БАСҚАРУ
===================================== */

document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){

    const opened=[...document.querySelectorAll(".floating")]
      .filter(p=>!p.classList.contains("hidden"))
      .sort((a,b)=>Number(b.style.zIndex||0)-Number(a.style.zIndex||0));

    if(opened.length) closePanel(opened[0].id);
    else if(!$("board").classList.contains("hidden")) closeBoard();

    return;
  }

  if(e.target.closest("input,select,textarea,button")) return;

  if(!$("board").classList.contains("hidden")){
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){
      e.preventDefault();
      if(e.shiftKey) redo();
      else undo();
    }

    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){
      e.preventDefault();
      redo();
    }

    return;
  }

  if(e.key==="ArrowRight") go(1);
  if(e.key==="ArrowLeft") go(-1);

  if(!e.ctrlKey&&!e.metaKey){
    if(e.key==="+") zoom(25);
    if(e.key==="-") zoom(-25);
    if(e.key==="0") zoom(0);
  }
});

function onResize(){
  applyScale();
  resizeBoard();
  document.querySelectorAll(".floating").forEach(clampPanel);
}

window.addEventListener("resize",onResize);
document.addEventListener("fullscreenchange",onResize);

/* =====================================
   САЙТТЫ ІСКЕ ҚОСУ
===================================== */

assignTasks();
makeTeams(false);
buildPages();

renderStudents();
renderTasks();
renderTeams();
renderMathKeys();
initPhysics();

renderPage();
updateClock();
updateTimer();

setInterval(()=>{
  updateClock();
  updateTimer();
},1000);

console.log("PHYSICS LAB PRO — 3.2.4");
console.log("Жеке есептер:",assignments.length);
console.log("Барлық беттер:",pages.length);

/* BY DARKHAN */
