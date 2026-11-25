
"use strict";

const $ = id => document.getElementById(id);

const esc = s => String(s)
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;")
  .replaceAll('"',"&quot;");

const frac = (a,b) =>
  `<span class="frac"><span>${a}</span><span>${b}</span></span>`;

function num(n) {
  if(!Number.isFinite(n)) throw Error("Нәтиже анықталмаған");
  return String(Number(n.toPrecision(10)));
}

/* ==========================================
   24 ОҚУШЫНЫҢ ЕСІМІ
========================================== */

const names = [
  "Рамазан",
  "Тұрғанжан",
  "Нұрай",
  "Әлқуат",
  "Шырай",
  "Гүлсезім",
  "Маржан",
  "Мариям",
  "Жансая",
  "Азиза",
  "Ақсезім",
  "Нұрболсын",
  "Ақнұр",
  "Іңкәр",
  "Асхат",
  "Аяжан",
  "Мирас",
  "Санжар",
  "Ерасыл",
  "Нұрасыл",
  "Расул",
  "Айнұр",
  "Дархан",
  "Айкерім"
];

const students = names.map((name,id)=>({
  id,name,present:true
}));

let attendanceDraft = students.map(()=>true);
let assignments = [];
let completed = new Set();
let randomUsed = new Set();
let randomId = null;

/* ==========================================
   РАНДОМ АЛГОРИТМІ
   ҚАЙТАЛАНБАЙТЫН ТАҢДАУ
========================================== */

function shuffle(list) {
  const result = [...list];

  for(let i=result.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }

  return result;
}

function presentStudents() {
  return students.filter(s=>s.present);
}

function assignTasks() {

  const people=shuffle(presentStudents());

  const taskIds=shuffle(
    Array.from({length:tasks.length},(_,i)=>i)
  ).slice(0,people.length).sort((a,b)=>a-b);

  assignments=people.map((student,i)=>({
    studentId:student.id,
    taskId:taskIds[i]
  }));

  completed.clear();
  randomUsed.clear();
  randomId=null;
}

function reshuffleTasks() {

  if(!presentStudents().length) {
    alert("Сабаққа қатысушы жоқ.");
    return;
  }

  if(!confirm("Есептерді қайта рандом бөлу керек пе? Орындалған белгілер тазаланады.")) {
    return;
  }

  assignTasks();
  buildPages();
  renderTaskList();

  closePanel("tasksPanel");

  const index=pages.findIndex(p=>p.kind==="task");

  goPage(index<0?0:index);
}

/* ==========================================
   НЕГІЗГІ ФОРМУЛАЛАР
========================================== */

const F = {
  emf:`ε = ${frac("A<sub>бөгде</sub>","q")}`,
  ohm:`I = ${frac("ε","R + r")}`,
  total:"R<sub>толық</sub> = R + r",
  voltage:"U = ε − Ir",
  internal:`r = ${frac("ε − U","I")}`,
  k1:"∑ I<sub>кіріс</sub> = ∑ I<sub>шығыс</sub>",
  k2:"∑ ε = ∑ IR",
  charge:"q = It",
  work:"A = UIt",
  power:`P = ${frac("A","t")} = UI`,
  power2:`P = I²R = ${frac("U²","R")}`,
  heat:"Q = I²Rt",
  efficiency:`η = ${frac("U","ε")} × 100%`,
  energy:"1 кВт·сағ = 3,6 × 10<sup>6</sup> Дж"
};

/* ==========================================
   15 ТҮСІНДІРМЕ
========================================== */

const theory = [

  [
    "Ток көзі",
    "Ток көзі — электр тізбегінде потенциалдар айырмасын сақтайтын құрылғы.",
    "Электр тогының ұзақ уақыт жүруі үшін энергия көзі қажет. Ток көздері энергияның басқа түрлерін электр энергиясына айналдырады. Ток көзінің ішінде зарядтардың бөлінуін қамтамасыз ететін электрлік емес күштер әрекет етеді.",
    "Энергия → Электр энергиясы",
    "Күн элементі жарық энергиясын электр энергиясына түрлендіреді.",
    "source"
  ],

  [
    "Бөгде күштер",
    "Бөгде күштер — ток көзінің ішінде зарядтарды электр өрісіне қарсы тасымалдайтын электрлік емес күштер.",
    "Бөгде күштердің табиғаты ток көзінің түріне байланысты болады. Олар химиялық, механикалық немесе басқа табиғатта болуы мүмкін. Бөгде күштердің атқаратын жұмысы зарядтарға энергия берілуін сипаттайды.",
    "A<sub>бөгде</sub> — бөгде күштердің жұмысы",
    "Гальваникалық элементте химиялық энергия электр энергиясына түрленеді.",
    "source"
  ],

  [
    "Электр қозғаушы күш",
    "ЭҚК — бөгде күштердің бірлік оң зарядты тасымалдағанда атқаратын жұмысына тең физикалық шама.",
    "Электр қозғаушы күш эпсилон әрпімен белгіленеді. Оның өлшем бірлігі — вольт. ЭҚК механикалық күш емес, бірлік зарядқа берілетін энергияны сипаттайды.",
    F.emf,
    "30 Дж жұмыс және 5 Кл заряд берілсе, ЭҚК 6 В болады.",
    "source"
  ],

  [
    "Ток көзінің ішкі кедергісі",
    "Ішкі кедергі ток көзінің ішіндегі электр тогына қарсы әсерді сипаттайды.",
    "Нақты ток көзінің ішкі кедергісі болады. Ол кіші r әрпімен белгіленеді. Ток өткенде электр энергиясының бір бөлігі ішкі кедергіде жылуға айналады.",
    "r — ішкі кедергі (Ом)",
    "Ток көзінің математикалық моделінде ішкі кедергі ескеріледі.",
    "circuit"
  ],

  [
    "Толық электр тізбегі",
    "Толық тізбек ток көзінің ішкі бөлігін және сыртқы тізбекті қамтиды.",
    "Қарапайым тұйық тізбекте сыртқы кедергі R және ішкі кедергі r арқылы бірдей ток өтеді. Толық кедергі осы екі кедергінің қосындысына тең.",
    F.total,
    "R = 9 Ом, r = 1 Ом болса, толық кедергі 10 Ом.",
    "circuit"
  ],

  [
    "Толық тізбек үшін Ом заңы",
    "Ток күші ЭҚК-ге тура, толық кедергіге кері пропорционал.",
    "Ток көзінің ЭҚК-і зарядтардың бағытталған қозғалысын қамтамасыз етеді. Сыртқы және ішкі кедергілердің қосындысы артқан сайын тұрақты ЭҚК жағдайындағы ток күші азаяды.",
    F.ohm,
    "ε = 12 В, R = 5 Ом, r = 1 Ом болса, I = 2 А.",
    "circuit"
  ],

  [
    "Қысқыш кернеуі",
    "Ток көзі энергия бергенде қысқыш кернеуі ЭҚК пен ішкі кернеу түсуінің айырмасына тең.",
    "Ток өткен кезде ішкі кедергіде Ir кернеу түсуі пайда болады. Сондықтан ток көзінің қысқыштарындағы кернеу оның электр қозғаушы күшінен төмен болады. Ток болмаған жағдайда қарапайым модельде U = ε.",
    F.voltage,
    "ε = 12 В, I = 2 А, r = 1 Ом болса, U = 10 В.",
    "voltage"
  ],

  [
    "Кирхгофтың бірінші заңы",
    "Түйінге кіретін токтардың қосындысы түйіннен шығатын токтардың қосындысына тең.",
    "Бірнеше өткізгіштің қосылу нүктесі түйін деп аталады. Кирхгофтың бірінші заңы электр зарядының сақталу заңына негізделеді. Тұрақты ток кезінде түйінде заряд жиналмайды.",
    F.k1,
    "3 А + 5 А = 6 А + 2 А.",
    "junction"
  ],

  [
    "Кирхгофтың екінші заңы",
    "Тұйық контурдағы ЭҚК-тердің алгебралық қосындысы кернеу түсулерінің алгебралық қосындысына тең.",
    "Тұйық контур бойынша потенциалдың жалпы өзгерісі нөлге тең. Бұл заң энергияның сақталуына негізделеді. Теңдеуде шамалардың таңбалары контурды айналып өту бағытына сәйкес алынады.",
    F.k2,
    "Бір ток көзі және екі резистор үшін ε = IR₁ + IR₂.",
    "loop"
  ],

  [
    "Тармақталған тізбектер",
    "Кирхгоф заңдары тармақталған тізбектердегі белгісіз токтар мен кернеулерді анықтауға мүмкіндік береді.",
    "Бірінші заң арқылы түйіндерге қатысты теңдеулер құрылады. Екінші заң арқылы контурларға қатысты теңдеулер құрылады. Оларды бірге шешіп, белгісіз физикалық шамаларды табуға болады.",
    "I₁ = I₂ + I₃<br>∑ ε − ∑ IR = 0",
    "Түйіндер мен контурларға арналған теңдеулер бірін-бірі толықтырады.",
    "junction"
  ],

  [
    "Электр тогының жұмысы",
    "Электр тогының жұмысы зарядтардың қозғалысы кезінде берілетін энергияны сипаттайды.",
    "Тұрақты ток кезінде жұмыс кернеуге, ток күшіне және уақытқа тура пропорционал. Электр тогының жұмысы джоульмен өлшенеді.",
    F.work,
    "U = 12 В, I = 2 А, t = 10 с болса, A = 240 Дж.",
    "energy"
  ],

  [
    "Электр тогының қуаты",
    "Қуат — электр тогының бірлік уақытта атқаратын жұмысы.",
    "Электр қуаты ваттпен өлшенеді. Бір ватт бір секундта бір джоуль энергия берілетінін көрсетеді. Тұрақты ток қуаты кернеу мен ток күшінің көбейтіндісіне тең.",
    F.power,
    "U = 10 В, I = 3 А болса, P = 30 Вт.",
    "power"
  ],

  [
    "Қуаттың түрлендірілген формулалары",
    "Омдық резистордың қуатын ток күші немесе кернеу және кедергі арқылы анықтауға болады.",
    "Ом заңын қуаттың негізгі формуласына қойғанда екі қосымша өрнек алынады. Есепті шығарғанда берілген физикалық шамаларға сәйкес формула таңдалады.",
    F.power2,
    "I = 2 А, R = 5 Ом болса, P = 20 Вт.",
    "power"
  ],

  [
    "Джоуль–Ленц заңы",
    "Өткізгіште бөлінетін жылу мөлшері ток күшінің квадратына, кедергіге және уақытқа тура пропорционал.",
    "Өткізгіште электр энергиясының жылу энергиясына түрленуі жүреді. Кедергі мен уақыт тұрақты болғанда ток күші екі есе артса, бөлінетін жылу мөлшері төрт есе артады.",
    F.heat,
    "I = 2 А, R = 4 Ом, t = 5 с болса, Q = 80 Дж.",
    "heat"
  ],

  [
    "Пайдалы әсер коэффициенті",
    "ПӘК — пайдалы энергияның толық жұмсалған энергияға қатынасы.",
    "Ток көзі берген энергияның бір бөлігі сыртқы тізбекке беріледі, бір бөлігі ішкі кедергіде жылуға айналады. Қарапайым модельде ПӘК қысқыш кернеуінің ЭҚК-ге қатынасы арқылы анықталады.",
    `${F.efficiency}<br>${F.energy}`,
    "U = 9 В, ε = 12 В болса, ПӘК 75%.",
    "energy"
  ]
];

/* ==========================================
   10 КОНСПЕКТ
========================================== */

const notes = [

  ["Электр қозғаушы күш",
   "Бөгде күштердің жұмысының тасымалданған зарядқа қатынасы ЭҚК деп аталады.",
   F.emf,
   "ε — В; A — Дж; q — Кл."],

  ["Ішкі және сыртқы кедергі",
   "Толық кедергі ішкі және сыртқы кедергілердің қосындысына тең.",
   F.total,
   "R — сыртқы кедергі; r — ішкі кедергі. Өлшем бірлігі — Ом."],

  ["Толық тізбек үшін Ом заңы",
   "Ток күші ЭҚК-ге тура, толық кедергіге кері пропорционал.",
   F.ohm,
   "I — А; ε — В; R және r — Ом."],

  ["Қысқыш кернеуі",
   "Энергия беріп тұрған ток көзінің қысқыш кернеуі ЭҚК пен ішкі кернеу түсуінің айырмасына тең.",
   F.voltage,
   "Ir — ішкі кернеу түсуі."],

  ["Кирхгофтың бірінші заңы",
   "Түйінге кіретін токтардың қосындысы шығатын токтардың қосындысына тең.",
   F.k1,
   "Электр зарядының сақталу заңына негізделеді."],

  ["Кирхгофтың екінші заңы",
   "Тұйық контурдағы ЭҚК-тердің алгебралық қосындысы кернеу түсулерінің алгебралық қосындысына тең.",
   F.k2,
   "Энергияның сақталу заңына негізделеді."],

  ["Электр тогының жұмысы",
   "Тұрақты токтың жұмысы кернеу, ток күші және уақыттың көбейтіндісіне тең.",
   F.work,
   "A — Дж; U — В; I — А; t — с."],

  ["Электр тогының қуаты",
   "Электр қуаты бірлік уақытта атқарылатын жұмысты сипаттайды.",
   `${F.power}<br>${F.power2}`,
   "P — қуат, Вт."],

  ["Джоуль–Ленц заңы",
   "Өткізгіште бөлінетін жылу мөлшері ток күшінің квадратына, кедергіге және уақытқа тура пропорционал.",
   F.heat,
   "Q — Дж; I — А; R — Ом; t — с."],

  ["Пайдалы әсер коэффициенті",
   "ПӘК пайдалы энергияның толық энергияға пайыздық қатынасын сипаттайды.",
   `${F.efficiency}<br>${F.energy}`,
   "η — пайдалы әсер коэффициенті."]
];

/* ==========================================
   24 ЖЕКЕ ЕСЕП
   ОҚУШЫЛАРДЫҢ ЕСІМДЕРІ БЕКІТІЛМЕЙДІ
========================================== */

const tasks = [

  /* 1-ДЕҢГЕЙ — 8 ЕСЕП */

  [
    "Электр қозғаушы күш",
    "Бөгде күштер 4 Кл зарядты тасымалдағанда 48 Дж жұмыс атқарды. Ток көзінің электр қозғаушы күшін анықта.",
    "A = 48 Дж; q = 4 Кл",
    "ε — ?",
    `ε = ${frac("A","q")} = ${frac("48","4")} = 12 В`
  ],

  [
    "Толық тізбек",
    "Ток көзінің ЭҚК-і 18 В, сыртқы кедергісі 5 Ом, ішкі кедергісі 1 Ом. Ток күшін есепте.",
    "ε = 18 В; R = 5 Ом; r = 1 Ом",
    "I — ?",
    `I = ${frac("ε","R + r")} = ${frac("18","5 + 1")} = 3 А`
  ],

  [
    "Электр қуаты",
    "Тізбектегі кернеу 15 В, ток күші 2 А. Электр қуатын анықта.",
    "U = 15 В; I = 2 А",
    "P — ?",
    "P = UI = 15 × 2 = 30 Вт"
  ],

  [
    "Электр тогының жұмысы",
    "Кернеуі 12 В тізбекте 3 А ток 20 секунд өтеді. Токтың жұмысын есепте.",
    "U = 12 В; I = 3 А; t = 20 с",
    "A — ?",
    "A = UIt = 12 × 3 × 20 = 720 Дж"
  ],

  [
    "Толық кедергі",
    "Ішкі кедергі 2 Ом, сыртқы кедергі 14 Ом. Тізбектің толық кедергісін анықта.",
    "r = 2 Ом; R = 14 Ом",
    "Rтолық — ?",
    "Rтолық = R + r = 14 + 2 = 16 Ом"
  ],

  [
    "Электр заряды",
    "Өткізгіш арқылы 2,5 А тұрақты ток 40 секунд өтті. Электр зарядын анықта.",
    "I = 2,5 А; t = 40 с",
    "q — ?",
    "q = It = 2,5 × 40 = 100 Кл"
  ],

  [
    "Қысқыш кернеуі",
    "Ток көзінің ЭҚК-і 14 В, ішкі кедергісі 1 Ом, ток күші 2 А. Қысқыш кернеуін тап.",
    "ε = 14 В; r = 1 Ом; I = 2 А",
    "U — ?",
    "U = ε − Ir = 14 − 2 × 1 = 12 В"
  ],

  [
    "Кирхгофтың бірінші заңы",
    "Түйінге 3 А және 5 А ток кіреді. Бір тармақ арқылы шығатын ток күшін анықта.",
    "I₁ = 3 А; I₂ = 5 А",
    "I₃ — ?",
    "I₃ = I₁ + I₂ = 3 + 5 = 8 А"
  ],

  /* 2-ДЕҢГЕЙ — 8 ЕСЕП */

  [
    "Ішкі кедергі",
    "Ток көзінің ЭҚК-і 16 В, қысқыш кернеуі 12 В, ток күші 2 А. Ішкі кедергіні есепте.",
    "ε = 16 В; U = 12 В; I = 2 А",
    "r — ?",
    `r = ${frac("ε − U","I")} = ${frac("16 − 12","2")} = 2 Ом`
  ],

  [
    "Электр энергиясы",
    "Қуаты 150 Вт құрылғы 20 минут жұмыс істеді. Жұмсалған электр энергиясын джоульмен есепте.",
    "P = 150 Вт; t = 20 мин",
    "A — ?",
    "t = 1200 с<br>A = Pt = 150 × 1200 = 180 000 Дж"
  ],

  [
    "Джоуль–Ленц заңы",
    "Кедергісі 4 Ом өткізгіштен 3 А ток 25 секунд өтеді. Бөлінетін жылу мөлшерін тап.",
    "R = 4 Ом; I = 3 А; t = 25 с",
    "Q — ?",
    "Q = I²Rt = 3² × 4 × 25 = 900 Дж"
  ],

  [
    "Сыртқы кедергі",
    "Ток көзінің ЭҚК-і 27 В, ішкі кедергісі 1 Ом, ток күші 3 А. Сыртқы кедергіні анықта.",
    "ε = 27 В; r = 1 Ом; I = 3 А",
    "R — ?",
    `R = ${frac("ε","I")} − r = ${frac("27","3")} − 1 = 8 Ом`
  ],

  [
    "Тармақталған тізбек",
    "Түйінге 6 А және 4 А ток кіреді. Екі тармақтан 3 А және 2 А ток шығады. Үшінші шығатын токты тап.",
    "I₁ = 6 А; I₂ = 4 А; I₃ = 3 А; I₄ = 2 А",
    "I₅ — ?",
    "I₅ = 6 + 4 − 3 − 2 = 5 А"
  ],

  [
    "Резистор қуаты",
    "Кедергісі 9 Ом резистордың ұштарындағы кернеу 18 В. Электр қуатын анықта.",
    "R = 9 Ом; U = 18 В",
    "P — ?",
    `P = ${frac("U²","R")} = ${frac("18²","9")} = 36 Вт`
  ],

  [
    "Пайдалы әсер коэффициенті",
    "Ток көзінің ЭҚК-і 25 В, энергия беру кезіндегі қысқыш кернеуі 20 В. ПӘК-ті анықта.",
    "ε = 25 В; U = 20 В",
    "η — ?",
    `η = ${frac("20","25")} × 100% = 80%`
  ],

  [
    "Киловатт-сағат",
    "Қуаты 600 Вт құрылғы 2,5 сағат жұмыс істеді. Электр энергиясын кВт·сағ және джоульмен анықта.",
    "P = 600 Вт; t = 2,5 сағ",
    "A — ?",
    "P = 0,6 кВт<br>A = 0,6 × 2,5 = 1,5 кВт·сағ<br>A = 5 400 000 Дж"
  ],

  /* 3-ДЕҢГЕЙ — 8 ЕСЕП */

  [
    "Толық электр тізбегі",
    "ЭҚК 28 В, ішкі кедергі 2 Ом, сыртқы кедергі 5 Ом. Ток күшін, қысқыш кернеуін және сыртқы қуатты есепте.",
    "ε = 28 В; r = 2 Ом; R = 5 Ом",
    "I, U, P — ?",
    `I = ${frac("28","5 + 2")} = 4 А<br>
     U = 28 − 4 × 2 = 20 В<br>
     P = UI = 80 Вт`
  ],

  [
    "Кирхгофтың екінші заңы",
    "Бір контурдағы ЭҚК-тері 18 В және 6 В екі идеал ток көзі қарама-қарсы әрекет етеді. Контурдың тізбектей кедергілері 4 Ом және 2 Ом. Ток күшінің модулін тап.",
    "ε₁ = 18 В; ε₂ = 6 В; R₁ = 4 Ом; R₂ = 2 Ом",
    "I — ?",
    `ε₁ − ε₂ = I(R₁ + R₂)<br>
     I = ${frac("18 − 6","4 + 2")} = 2 А`
  ],

  [
    "Ішкі қуат шығыны",
    "ЭҚК 24 В, қысқыш кернеуі 18 В, ток күші 3 А. Ішкі кедергіні және ішкі қуат шығынын анықта.",
    "ε = 24 В; U = 18 В; I = 3 А",
    "r, Pішкі — ?",
    `r = ${frac("24 − 18","3")} = 2 Ом<br>
     P<sub>ішкі</sub> = I²r = 3² × 2 = 18 Вт`
  ],

  [
    "Қуат және жылу мөлшері",
    "Кедергісі 6 Ом резистордың кернеуі 24 В. Ток күшін, қуатын және 2 минутта бөлінетін жылу мөлшерін анықта.",
    "R = 6 Ом; U = 24 В; t = 2 мин",
    "I, P, Q — ?",
    `t = 120 с<br>
     I = ${frac("24","6")} = 4 А<br>
     P = 24 × 4 = 96 Вт<br>
     Q = 96 × 120 = 11 520 Дж`
  ],

  [
    "Толық тізбектің ПӘК-і",
    "ЭҚК 30 В, ішкі кедергі 2 Ом, сыртқы кедергі 8 Ом. Ток күшін, қысқыш кернеуін және ПӘК-ті анықта.",
    "ε = 30 В; r = 2 Ом; R = 8 Ом",
    "I, U, η — ?",
    `I = ${frac("30","8 + 2")} = 3 А<br>
     U = 30 − 3 × 2 = 24 В<br>
     η = ${frac("24","30")} × 100% = 80%`
  ],

  [
    "Ток көзінің жұмысы",
    "ЭҚК-і 16 В ток көзі 2 А токты 3 минут бойы береді. Ішкі кедергісі 1 Ом. Бөгде күштердің жұмысын және сыртқы тізбекке берілетін энергияны есепте.",
    "ε = 16 В; I = 2 А; r = 1 Ом; t = 3 мин",
    "Aтолық, Aсыртқы — ?",
    "t = 180 с<br>Aтолық = εIt = 5760 Дж<br>U = 14 В<br>Aсыртқы = UIt = 5040 Дж"
  ],

  [
    "Параллель тармақтар",
    "12 В идеал ток көзіне 6 Ом және 3 Ом кедергілер параллель жалғанған деп қарастырылады. Тармақтардағы ток күштерін, жалпы токты және қуатты анықта.",
    "U = 12 В; R₁ = 6 Ом; R₂ = 3 Ом",
    "I₁, I₂, I, P — ?",
    `I₁ = ${frac("12","6")} = 2 А<br>
     I₂ = ${frac("12","3")} = 4 А<br>
     I = 2 + 4 = 6 А<br>
     P = 12 × 6 = 72 Вт`
  ],

  [
    "Энергияның сақталуы",
    "ЭҚК 21 В, ішкі кедергі 1 Ом, сыртқы кедергі 6 Ом. Ток күшін және 60 секундта ішкі, сыртқы кедергілерде бөлінетін жылуды анықта.",
    "ε = 21 В; r = 1 Ом; R = 6 Ом; t = 60 с",
    "I, Qішкі, Qсыртқы — ?",
    `I = ${frac("21","6 + 1")} = 3 А<br>
     Q<sub>ішкі</sub> = 3² × 1 × 60 = 540 Дж<br>
     Q<sub>сыртқы</sub> = 3² × 6 × 60 = 3240 Дж`
  ]
];

/* ==========================================
   ТОПТЫҚ ОЙЫН — 15 СҰРАҚ
========================================== */

const quiz = [
  ["ЭҚК-тің өлшем бірлігі?",
   ["Ампер","Вольт","Ом","Ватт"],1],

  ["Толық тізбек үшін Ом заңы?",
   ["I = εR","I = R + r","I = ε ÷ (R + r)","I = εr"],2],

  ["Ішкі кедергі қандай әріппен белгіленеді?",
   ["r","P","A","q"],0],

  ["ε = 12 В, R = 5 Ом, r = 1 Ом. Ток күші?",
   ["1 А","3 А","6 А","2 А"],3],

  ["Кирхгофтың бірінші заңы неге негізделеді?",
   ["Массаның сақталуына","Зарядтың сақталуына","Гук заңына","Архимед заңына"],1],

  ["Энергия беретін ток көзінің қысқыш кернеуі?",
   ["U = ε + Ir","U = IRr","U = ε − Ir","U = I + r"],2],

  ["Түйінге 5 А және 4 А ток кіреді. Шығатын жалпы ток?",
   ["9 А","1 А","20 А","5 А"],0],

  ["Электр тогы жұмысының формуласы?",
   ["A = UI","A = IR","A = U + I","A = UIt"],3],

  ["Қуаттың өлшем бірлігі?",
   ["Джоуль","Ватт","Кулон","Ом"],1],

  ["U = 12 В, I = 4 А. Қуат?",
   ["16 Вт","3 Вт","48 Вт","24 Вт"],2],

  ["Кирхгофтың екінші заңы неге негізделеді?",
   ["Энергияның сақталуына","Гук заңына","Массаның сақталуына","Архимед заңына"],0],

  ["Джоуль–Ленц заңы?",
   ["Q = IR","Q = U + I","Q = Rt","Q = I²Rt"],3],

  ["Кедергі мен уақыт тұрақты. Ток күші екі есе артса, жылу мөлшері?",
   ["Екі есе азаяды","Төрт есе артады","Өзгермейді","Екі есе артады"],1],

  ["1 кВт·сағ неше джоуль?",
   ["3600 Дж","1000 Дж","3 600 000 Дж","360 000 Дж"],2],

  ["ε = 20 В, U = 15 В. ПӘК?",
   ["75%","25%","50%","90%"],0]
];

/* ==========================================
   ҚАТЫСУ ТІЗІМІ
========================================== */

function renderStudents() {
  $("students").innerHTML=students.map((s,i)=>`
    <label class="student ${attendanceDraft[i]?"":"absent"}">
      <input type="checkbox"
        ${attendanceDraft[i]?"checked":""}
        onchange="attendanceDraft[${i}]=this.checked;renderStudents()">
      ${esc(s.name)}
    </label>
  `).join("");

  $("attendanceCount").textContent=
    `${presentStudents().length} / ${students.length}`;
}

function markAll(value) {
  attendanceDraft=names.map(()=>value);
  renderStudents();
}

function saveAttendance() {

  const changed=students.some(
    (s,i)=>s.present!==attendanceDraft[i]
  );

  if(changed && (completed.size||Object.keys(answers).length) &&
     !confirm("Қатысу өзгергенде есептер мен ойын нәтижелері қайта басталады. Сақтаймыз ба?")) {
    return;
  }

  const oldKey=pages[current]?.key;

  students.forEach((s,i)=>{
    s.present=attendanceDraft[i];
  });

  if(changed) {
    assignTasks();
    shuffleTeams(false);
  }

  buildPages();

  const index=pages.findIndex(p=>p.key===oldKey);

  renderStudents();
  renderTaskList();
  renderTeams();

  closePanel("attendancePanel");
  goPage(index<0?0:index);
}

/* ==========================================
   РАНДОМ ОҚУШЫНЫҢ ЕСЕБІ
========================================== */

const levelNames=["Оңай","Орташа","Күрделі"];
const levelClasses=["easy","medium","hard"];

function levelOf(taskId) {
  return Math.floor(taskId/8);
}

function renderTaskList() {
  $("taskCount").textContent=
    `Орындалған есептер: ${completed.size} / ${assignments.length}`;

  $("taskList").innerHTML=assignments.map((a,i)=>`
    <button class="${completed.has(a.taskId)?"done":""}"
      onclick="openTask(${a.taskId})">

      ${completed.has(a.taskId)?"✓":"🎲"} ${i+1}. ${esc(students[a.studentId].name)}

      <small>
        ${a.taskId+1}-есеп · ${levelNames[levelOf(a.taskId)]}
      </small>
    </button>
  `).join("")||"<p>Қатысушы жоқ.</p>";
}

function openTask(taskId) {
  const index=pages.findIndex(p=>p.key==="task-"+taskId);

  if(index<0) return;

  closePanel("tasksPanel");
  closePanel("randomPanel");

  goPage(index);
}

function toggleCompleted(taskId) {

  const open=$("solution") &&
    !$("solution").classList.contains("hidden");

  if(completed.has(taskId)) completed.delete(taskId);
  else completed.add(taskId);

  renderTaskList();
  renderPage();

  if(open && $("solution")) {
    $("solution").classList.remove("hidden");
  }
}

function randomStudent() {

  const active=presentStudents();

  if(!active.length) {
    alert("Сабаққа қатысушы жоқ.");
    return;
  }

  let pool=active.filter(s=>!randomUsed.has(s.id));

  if(!pool.length) {
    randomUsed.clear();
    pool=active;
  }

  const chosen=pool[Math.floor(Math.random()*pool.length)];

  randomUsed.add(chosen.id);
  randomId=chosen.id;

  $("randomName").textContent=chosen.name;

  openPanel("randomPanel");
}

function openRandomTask() {
  const assigned=assignments.find(a=>a.studentId===randomId);

  if(assigned) openTask(assigned.taskId);
}

/* ==========================================
   3 КОМАНДА
========================================== */

const teamNames=["Энергия","Кирхгоф","Вольт"];
const teamIcons=["⚡","💡","⚛"];

let teams=[[],[],[]];
let scores=[0,0,0];
let answers={};
let speakers={};
let used=[new Set(),new Set(),new Set()];
let autoNext=null;

function resetGame() {
  clearTimeout(autoNext);
  scores=[0,0,0];
  answers={};
  speakers={};
  used=[new Set(),new Set(),new Set()];
}

function shuffleTeams(show=false) {

  const people=shuffle(presentStudents());

  if(people.length<3 && show) {
    alert("Кемінде 3 оқушы қажет.");
    return false;
  }

  if(show && Object.keys(answers).length &&
     !confirm("Топтар қайта бөлінеді. Ұпайлар тазаланады.")) {
    return false;
  }

  teams=[[],[],[]];

  if(people.length>=3) {
    people.forEach((s,i)=>teams[i%3].push(s.id));
  }

  resetGame();
  renderTeams();

  if(show) {
    openPanel("teamsPanel");
    renderPage();
  }

  return people.length>=3;
}

function members(i) {
  return teams[i].map(id=>students[id]).filter(s=>s.present);
}

function renderTeams() {
  $("teams").innerHTML=teamNames.map((n,i)=>`
    <div class="team-card">
      <b class="blue">${teamIcons[i]} ${i+1}-топ — ${n}</b>
      <p>${members(i).map(s=>esc(s.name)).join(", ")||"Қатысушы жоқ"}</p>
      <b class="green">${scores[i]} ұпай</b>
    </div>
  `).join("");
}

function pickSpeaker(i) {

  const team=i%3;
  const list=members(team);

  if(!list.length) return "Қатысушы жоқ";

  const old=list.find(s=>s.id===speakers[i]);

  if(old) return old.name;

  let pool=list.filter(s=>!used[team].has(s.id));

  if(!pool.length) {
    used[team].clear();
    pool=list;
  }

  const chosen=pool[Math.floor(Math.random()*pool.length)];

  speakers[i]=chosen.id;
  used[team].add(chosen.id);

  return chosen.name;
}

/* ==========================================
   КӨРНЕКІ СЫЗБАЛАР
========================================== */

function diagram(type) {

  const b="#087dcc",g="#16874e",r="#d63a50",ink="#38576e";

  const text=(x,y,s,c=ink,size=18)=>
    `<text x="${x}" y="${y}" text-anchor="middle"
      fill="${c}" font-size="${size}">${s}</text>`;

  const rect=(x,y,w,h,c)=>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}"
      rx="10" fill="${c}"/>`;

  const arrow=(x,y,X,Y,c=b)=>
    `<path d="M${x} ${y} L${X} ${Y}"
      stroke="${c}" stroke-width="4"
      fill="none" marker-end="url(#arrow)"/>`;

  let content="",caption="";

  if(type==="source") {

    caption="Ток көзінің шартты моделі";

    content=`
      ${rect(65,45,290,140,"#dcefff")}
      <circle cx="105" cy="115" r="22" fill="${r}"/>
      <circle cx="315" cy="115" r="22" fill="${b}"/>
      ${text(105,124,"+","white",27)}
      ${text(315,124,"−","white",27)}
      ${text(210,95,"Ток көзі",b,24)}
      ${text(210,145,"ε",g,38)}
      ${arrow(315,210,105,210,g)}
      ${text(210,240,"Бөгде күштер",g,19)}
    `;

  } else if(type==="circuit"||type==="loop") {

    caption="Тұйық тізбектің теориялық сызбасы";

    content=`
      <g stroke="${ink}" stroke-width="4" fill="none">
        <path d="M45 65 H115 M135 65 H235
          M307 65 H375 V185 H245 M173 185 H45 V65"/>
        <path d="M115 50 V80 M135 40 V90"/>
      </g>
      <rect x="235" y="49" width="72" height="32"
        rx="4" fill="#dcefff" stroke="${b}" stroke-width="3"/>
      <rect x="173" y="169" width="72" height="32"
        rx="4" fill="#dff7e9" stroke="${g}" stroke-width="3"/>
      ${text(271,72,type==="loop"?"R₁":"r",b,20)}
      ${text(209,192,type==="loop"?"R₂":"R",g,20)}
      ${text(105,35,"−",b)}
      ${text(148,35,"+",r)}
      ${text(125,120,"ε",b,27)}
      ${arrow(375,95,375,150,g)}
      ${text(395,125,"I",g)}
    `;

  } else if(type==="junction") {

    caption="Кирхгофтың бірінші заңы";

    content=`
      ${arrow(30,40,195,115)}
      ${arrow(30,195,195,125)}
      ${arrow(225,115,385,40,g)}
      ${arrow(225,125,385,195,g)}
      <circle cx="210" cy="120" r="10" fill="${r}"/>
      ${text(90,25,"I₁ = 3 А",b)}
      ${text(90,230,"I₂ = 5 А",b)}
      ${text(325,25,"I₃ = 6 А",g)}
      ${text(325,230,"I₄ = 2 А",g)}
      ${text(210,80,"Түйін",r)}
      ${text(210,180,"3 + 5 = 6 + 2",ink,25)}
    `;

  } else if(type==="voltage"||type==="power") {

    const v=type==="voltage";

    caption=v?"Кернеудің ток күшіне тәуелділігі":
      "Тұрақты кернеудегі қуат";

    content=`
      <g stroke="#c9dfec">
        ${[90,150,210,270,330,390].map(x=>
          `<path d="M${x} 20 V205"/>`).join("")}
        ${[45,85,125,165,205].map(y=>
          `<path d="M40 ${y} H390"/>`).join("")}
      </g>
      <path d="M40 20 V205 H400"
        stroke="${ink}" stroke-width="3" fill="none"/>
      <path d="${v?"M40 40 L340 190":"M40 205 L375 40"}"
        stroke="${b}" stroke-width="5" fill="none"/>
      ${text(15,25,v?"U":"P")}
      ${text(400,235,"I")}
      ${text(240,70,v?"U = ε − Ir":"P = UI",g,24)}
    `;

  } else if(type==="heat") {

    caption="Ток күші және жылу мөлшері";

    content=`
      <path d="M40 20 V205 H400"
        stroke="${ink}" stroke-width="3" fill="none"/>
      ${rect(85,165,90,40,"#f0bd4b")}
      ${rect(245,45,90,160,"#e76c4e")}
      ${text(130,150,"Q",ink,25)}
      ${text(290,30,"4Q",r,25)}
      ${text(130,235,"I")}
      ${text(290,235,"2I")}
    `;

  } else {

    caption="Электр энергиясының түрленуі";

    content=`
      ${rect(20,75,150,100,"#dcefff")}
      ${text(95,115,"Электр",b,20)}
      ${text(95,145,"энергиясы",b,20)}
      ${arrow(175,100,255,55,g)}
      ${arrow(175,150,255,195,r)}
      ${rect(260,20,140,75,"#dff7e9")}
      ${rect(260,155,140,75,"#fff0d6")}
      ${text(330,50,"Пайдалы",g)}
      ${text(330,75,"энергия",g)}
      ${text(330,185,"Жылуға кеткен",ink,16)}
      ${text(330,210,"энергия")}
    `;
  }

  return `
    <div class="visual">
      <svg viewBox="0 0 420 255"
        xmlns="http://www.w3.org/2000/svg"
        font-family="Segoe UI,Arial,sans-serif">

        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="${ink}"/>
          </marker>
        </defs>

        ${content}
      </svg>
      <small>${caption}</small>
    </div>`;
}

/* ==========================================
   САБАҚ БЕТТЕРІ
========================================== */

let pages=[],sections=[],current=0;

const slide=html=>`<article class="slide">${html}</article>`;

function introPage() {
  return slide(`
    <span class="eyebrow">ФИЗИКА · 1-КУРС · 3.2.3</span>

    <div class="card hero">
      <h1>
        Ток көзінің <span class="blue">электр қозғаушы күші</span>
        және ішкі кедергісі.
        <span class="green">Кирхгоф заңдары.</span>
        Электр тогының жұмысы мен қуаты
      </h1>

      <div class="definition">
        <h3>Сабақтың мақсаты</h3>
        <p>Электр қозғаушы күш пен ішкі кедергіні түсіну,
        толық тізбек үшін Ом заңын меңгеру,
        Кирхгоф заңдарын қолдану және электр тогының
        жұмысы мен қуатын есептеу.</p>
      </div>

      <div class="formula">${F.ohm}</div>

      <div class="grid3">
        <div class="definition">
          <h3>15 түсіндірме</h3><p>Теория</p>
        </div>
        <div class="example">
          <h3>24 жеке есеп</h3><p>Рандом оқушылар</p>
        </div>
        <div class="definition">
          <h3>3 команда</h3><p>Топтық ойын</p>
        </div>
      </div>

      <button class="primary" onclick="startTimer();go(1)">
        Сабақты бастау →
      </button>

      <p class="blue">BY DARKHAN</p>
    </div>
  `);
}

function planPage() {

  const plan=[
    ["Ұйымдастыру және қатысуды белгілеу",3],
    ["Түсіндірме және виртуалды зертхана",22],
    ["Конспект жазу",15],
    ["Жеке есептер",25],
    ["Командалық ойын",12],
    ["Қорытынды және үй тапсырмасы",3]
  ];

  return slide(`
    <span class="eyebrow">САБАҚ ЖОСПАРЫ</span>
    <h2>80 минуттық сабақ</h2>

    <div class="card">
      ${plan.map(([n,t])=>`
        <div class="plan-row">
          <b>${n}</b>
          <span class="blue">${t} минут</span>
        </div>`).join("")}

      <div class="formula">Барлығы: 80 минут</div>

      <button onclick="openPanel('attendancePanel')">
        Қатысушыларды белгілеу
      </button>
    </div>
  `);
}

function theoryPage(t,i) {
  return slide(`
    <span class="eyebrow">ТҮСІНДІРМЕ · ${i+1} / 15</span>
    <h2>${esc(t[0])}</h2>

    <div class="card">
      <div class="definition">
        <p class="green">${esc(t[1])}</p>
      </div>

      <div class="theory-layout">
        ${diagram(t[5])}
        <p>${esc(t[2])}</p>
      </div>

      <div class="formula">${t[3]}</div>

      <div class="example">
        <p><b>Мысал:</b> ${esc(t[4])}</p>
      </div>

      <button onclick="openBoard()">✎ Тақтада түсіндіру</button>
    </div>
  `);
}

function notePage(n,i) {
  return slide(`
    <span class="eyebrow">ДӘПТЕРГЕ ЖАЗЫП АЛЫҢДАР · ${i+1} / 10</span>
    <h2>${esc(n[0])}</h2>

    <div class="card notebook">
      <p>${esc(n[1])}</p>
      <div class="formula">${n[2]}</div>
      <p>${esc(n[3])}</p>
    </div>
  `);
}

/* ==========================================
   ЖЕКЕ ЕСЕПТЕРДІҢ БАСТАПҚЫ БЕТІ
========================================== */

function taskIntro() {
  return slide(`
    <span class="eyebrow">ЖЕКЕ ТАПСЫРМАЛАР</span>

    <div class="card hero">
      <h1>🎲 Рандом есептер</h1>

      <p>Әр қатысушыға бір есеп кездейсоқ тағайындалды.
      Бір оқушы екі рет таңдалмайды.</p>

      <div class="grid3">
        ${levelNames.map((n,i)=>`
          <div class="card">
            <span class="level ${levelClasses[i]}">${n}</span>
            <div class="score">
              ${assignments.filter(a=>levelOf(a.taskId)===i).length}
            </div>
            <p>Есеп</p>
          </div>`).join("")}
      </div>

      <div class="formula">
        ${assignments.length} оқушы · ${assignments.length} есеп
      </div>

      <div class="actions">
        <button class="primary"
          ${assignments.length?"":"disabled"}
          onclick="go(1)">Бірінші есеп →</button>

        <button onclick="reshuffleTasks()">🎲 Қайта араластыру</button>
        <button onclick="openPanel('tasksPanel')">Барлық есептер</button>
      </div>
    </div>
  `);
}

/* ==========================================
   РАНДОМ АДАМ ШЫҒАТЫН ЕСЕП БЕТІ
========================================== */

function taskPage(a) {

  const taskId=a.taskId;
  const student=students[a.studentId];
  const p=tasks[taskId];
  const level=levelOf(taskId);

  const number=assignments.findIndex(
    x=>x.taskId===taskId
  )+1;

  const done=completed.has(taskId);

  return slide(`
    <span class="eyebrow">
      ЖЕКЕ ЕСЕП · ${number} / ${assignments.length}
    </span>

    <div class="student-banner">

      <div class="student-avatar">${esc(student.name[0])}</div>

      <div>
        <span class="random-label">🎲 РАНДОМ ТАҢДАЛДЫ</span>

        <h1>${esc(student.name)}</h1>

        <span class="level ${levelClasses[level]}">
          ${level+1}-деңгей · ${levelNames[level]}
        </span>
      </div>

    </div>

    <div class="card">
      <h3 class="blue">${taskId+1}-есеп. ${esc(p[0])}</h3>

      <p class="problem-text">${esc(p[1])}</p>

      <div class="data-line">
        <b class="blue">Берілгені:</b> ${esc(p[2])}
      </div>

      <div class="data-line">
        <b class="green">Табу керек:</b> ${esc(p[3])}
      </div>

      <div class="example">
        <p>${esc(student.name)}, есепті дәптерге шығарып,
        шешу жолын түсіндір.</p>
      </div>

      <div class="actions">

        <button class="primary" onclick="showSolution()">
          Шешу жолын көрсету
        </button>

        <button onclick="openBoard()">✎ Тақтада шығару</button>

        <button class="${done?"done":""}"
          onclick="toggleCompleted(${taskId})">
          ${done?"✓ Орындалды":"Орындалды деп белгілеу"}
        </button>

        <button onclick="openPanel('tasksPanel')">Барлық есептер</button>

        <button class="primary" onclick="go(1)">
          Келесі тапсырма →
        </button>

      </div>

      <div id="solution" class="answer hidden">
        <h3 class="green">Есептің шешуі</h3>
        <div class="formula">${p[4]}</div>
      </div>
    </div>
  `);
}

function showSolution() {
  const answer=$("solution");

  if(answer) answer.classList.toggle("hidden");
}

/* ==========================================
   ВИРТУАЛДЫ ЗЕРТХАНА
========================================== */

function simulationPage() {
  return slide(`
    <span class="eyebrow">ВИРТУАЛДЫ ЗЕРТХАНА</span>
    <h2>Толық тізбек үшін Ом заңы</h2>

    <div class="grid2">

      <div class="card">

        <h3 class="blue">ЭҚК</h3>
        <div class="formula" id="simE">12 В</div>
        <input type="range" id="rangeE" min="1" max="24"
          value="12" oninput="updateSimulation()">

        <h3 class="green">Сыртқы кедергі</h3>
        <div class="formula" id="simR">5 Ом</div>
        <input type="range" id="rangeR" min="1" max="30"
          value="5" oninput="updateSimulation()">

        <h3 class="red">Ішкі кедергі</h3>
        <div class="formula" id="simr">1 Ом</div>
        <input type="range" id="ranger" min="0" max="10"
          step=".5" value="1" oninput="updateSimulation()">

      </div>

      <div class="card">

        ${diagram("circuit")}

        <h3>Ток күші</h3>
        <div class="formula" id="simI"></div>

        <div class="definition">
          <p>Қысқыш кернеуі: <b id="simU"></b></p>
          <p>Сыртқы қуат: <b id="simP"></b></p>
          <p>ПӘК: <b id="simEta"></b></p>
        </div>

      </div>
    </div>

    <div class="example">
      <p>Математикалық модельде кедергі шамаларын өзгертіп,
      ток күші мен қуаттың өзгеруін бақылаңдар.</p>
    </div>
  `);
}

function updateSimulation() {

  const E=Number($("rangeE").value);
  const R=Number($("rangeR").value);
  const r=Number($("ranger").value);

  const I=E/(R+r);
  const U=I*R;
  const round=n=>Number(n.toFixed(3));

  $("simE").textContent=E+" В";
  $("simR").textContent=R+" Ом";
  $("simr").textContent=r+" Ом";
  $("simI").textContent=round(I)+" А";
  $("simU").textContent=round(U)+" В";
  $("simP").textContent=round(U*I)+" Вт";
  $("simEta").textContent=round(U/E*100)+"%";
}

/* ==========================================
   КОМАНДАЛЫҚ ОЙЫН
========================================== */

function quizIntro() {

  return slide(`
    <span class="eyebrow">КОМАНДАЛЫҚ ОЙЫН</span>

    <h1>🏆 Электр энергиясының білгірлері</h1>

    <div class="grid3">
      ${teamNames.map((n,i)=>`
        <div class="card">
          <h2>${teamIcons[i]}</h2>
          <h3 class="blue">${i+1}-топ — ${n}</h3>
          <p>${members(i).map(s=>esc(s.name)).join(", ")||"Қатысушы жоқ"}</p>
        </div>`).join("")}
    </div>

    <div class="card">

      <h3 class="green">Ойын ережесі</h3>

      <p>15 сұрақ. Әр командаға 5 сұрақтан беріледі.</p>
      <p>Әр дұрыс жауапқа 10 ұпай қосылады.</p>
      <p>Әр топтан жауап беретін оқушы кездейсоқ таңдалады.</p>
      <p>Жауаптан кейін 4 секундтан соң кезек келесі топқа өтеді.</p>

      <div class="actions">
        <button onclick="shuffleTeams(true)">🎲 Топтарды араластыру</button>
        <button class="primary" onclick="startQuiz()">Ойынды бастау →</button>
      </div>
    </div>
  `);
}

function startQuiz() {

  if(presentStudents().length<3) {
    alert("Кемінде 3 оқушы қажет.");
    return;
  }

  if(teams.some(t=>!t.length)) shuffleTeams(false);

  resetGame();
  renderTeams();

  closePanel("teamsPanel");

  goPage(pages.findIndex(p=>p.key==="quiz-0"));
}

function quizPage(i) {

  const q=quiz[i];
  const team=i%3;
  const done=Object.hasOwn(answers,i);
  const selected=answers[i];

  return slide(`
    <span class="eyebrow">ТОПТЫҚ ОЙЫН · ${i+1} / 15</span>

    <div class="team-turn">
      ${teamNames.map((n,k)=>`
        <div class="team-pill ${team===k?"active":""}">
          ${teamIcons[k]} ${n} — ${scores[k]} ұпай
        </div>`).join("")}
    </div>

    <div class="card">

      <div class="player">
        ${team+1}-топ — ${teamNames[team]}<br>
        Рандом қатысушы:
        <strong>${esc(pickSpeaker(i))}</strong>
      </div>

      <p class="question">${esc(q[0])}</p>

      <div class="choices">
        ${q[1].map((a,k)=>`
          <button class="choice ${done?
            k===q[2]?"correct":k===selected?"wrong":"":""}"
            ${done?"disabled":""}
            onclick="submitAnswer(${i},${k})">

            ${"ABCD"[k]}. ${esc(a)}

          </button>`).join("")}
      </div>

      ${done?`
        <div class="${selected===q[2]?"definition":"warning"}">
          <p>${selected===q[2]
            ?"Дұрыс жауап! +10 ұпай."
            :"Қате жауап. Дұрыс нұсқа жасылмен көрсетілді."}</p>
        </div>

        <button class="primary" onclick="go(1)">Келесі команда →</button>
      `:""}

    </div>
  `);
}

function submitAnswer(i,k) {

  if(pages[current].key!=="quiz-"+i ||
     Object.hasOwn(answers,i)) return;

  if(teams.some(t=>!t.length)) {
    alert("Алдымен 3 топқа бөлініңдер.");
    return;
  }

  answers[i]=k;

  if(k===quiz[i][2]) scores[i%3]+=10;

  renderTeams();
  renderPage();

  clearTimeout(autoNext);

  autoNext=setTimeout(()=>{
    if(pages[current].key==="quiz-"+i) go(1);
  },4000);
}

/* ==========================================
   ҚОРЫТЫНДЫ
========================================== */

function resultsPage() {

  const total=Object.keys(answers).length;

  const winners=teamNames.filter(
    (_,i)=>scores[i]===Math.max(...scores)
  );

  return slide(`
    <span class="eyebrow">САБАҚ ҚОРЫТЫНДЫСЫ</span>
    <h1>Сабақ нәтижелері</h1>

    <div class="card">
      <h3 class="blue">Жеке тапсырмалар</h3>

      <div class="formula">
        ${completed.size} / ${assignments.length}
      </div>

      <p>Орындалды деп белгіленген есептер.</p>

      <button onclick="openPanel('tasksPanel')">Барлық есептер</button>
    </div>

    <div class="grid3">
      ${teamNames.map((n,i)=>`
        <div class="card">
          <h2>${teamIcons[i]}</h2>
          <h3>${n}</h3>
          <div class="score">${scores[i]} ұпай</div>
        </div>`).join("")}
    </div>

    <div class="definition">
      <h2 class="green">
        ${total<15?"Ойын толық аяқталған жоқ":
          winners.length===1?"🥇 Жеңімпаз — "+winners[0]:
          "Тең нәтиже — "+winners.join(", ")}
      </h2>

      <p>Жауап берілген сұрақтар: ${total} / 15</p>
    </div>

    <button onclick="startQuiz()">↻ Ойынды қайта бастау</button>
  `);
}

/* ==========================================
   ҮЙ ТАПСЫРМАСЫ — 2 ЕСЕП
========================================== */

function homeworkPage() {

  return slide(`
    <span class="eyebrow">ҮЙ ТАПСЫРМАСЫ</span>
    <h2>Есептерді дәптерге шығарыңдар</h2>

    <div class="card homework-card">
      <h3 class="blue">1-есеп</h3>

      <p>
        Ток көзінің электр қозғаушы күші 42 В,
        ішкі кедергісі 2 Ом, ал сыртқы кедергісі 12 Ом.
        Тізбектегі ток күшін, қысқыш кернеуін және
        ток көзінің пайдалы әсер коэффициентін анықтаңдар.
      </p>
    </div>

    <div class="card homework-card">
      <h3 class="green">2-есеп</h3>

      <p>
        Кедергісі 8 Ом резистордың ұштарындағы
        кернеу 24 В. Резистордың қуатын және
        5 минутта жұмсалатын электр энергиясын
        есептеңдер.
      </p>
    </div>

    <div class="example">
      <p>Берілгені, SI жүйесі, формуласы,
      шешуі және жауабы толық жазылсын.</p>
    </div>

    <div class="card hero">
      <h1 class="green">Сабақ аяқталды!</h1>
      <h2>Назарларыңызға рақмет!</h2>
      <p>Сау болыңыздар!</p>
      <p class="blue">BY DARKHAN</p>
    </div>
  `);
}

/* ==========================================
   БЕТТЕР МЕН СОЛ ЖАҚ МӘЗІР
========================================== */

function buildPages() {

  pages=[];
  sections=[];

  function section(name,items) {
    if(!items.length) return;
    sections.push({name,start:pages.length});
    pages.push(...items);
  }

  section("⌂ Басты бет",[
    {key:"intro",render:introPage}
  ]);

  section("📋 Сабақ жоспары",[
    {key:"plan",render:planPage}
  ]);

  section("📖 Түсіндірме",theory.map((t,i)=>({
    key:"theory-"+i,
    render:()=>theoryPage(t,i)
  })));

  section("⚡ Виртуалды зертхана",[
    {key:"simulation",render:simulationPage}
  ]);

  section("📘 Конспект",notes.map((n,i)=>({
    key:"note-"+i,
    render:()=>notePage(n,i)
  })));

  section("🎲 Рандом есептер",[
    {key:"task-intro",render:taskIntro}
  ]);

  for(let level=0;level<3;level++) {

    const list=assignments.filter(
      a=>levelOf(a.taskId)===level
    );

    section(
      `${["🟢","🟡","🔴"][level]} ${level+1}-деңгей (${list.length})`,
      list.map(a=>({
        key:"task-"+a.taskId,
        kind:"task",
        render:()=>taskPage(a)
      }))
    );
  }

  section("🏆 Топтық ойын",[
    {key:"quiz-intro",render:quizIntro},
    ...quiz.map((_,i)=>({
      key:"quiz-"+i,
      render:()=>quizPage(i)
    }))
  ]);

  section("📊 Қорытынды",[
    {key:"results",render:resultsPage}
  ]);

  section("✎ Үй тапсырмасы",[
    {key:"homework",render:homeworkPage}
  ]);

  $("lessonMenu").innerHTML=sections.map((s,i)=>`
    <button data-section="${i}" onclick="goPage(${s.start})">
      ${esc(s.name)}
    </button>`).join("");
}

function renderPage() {

  current=Math.max(0,Math.min(current,pages.length-1));

  $("stage").innerHTML=pages[current].render();

  $("pageCount").textContent=
    `${current+1} / ${pages.length}`;

  $("progressFill").style.width=
    `${(current+1)/pages.length*100}%`;

  $("prev").disabled=current===0;
  $("next").disabled=current===pages.length-1;

  let active=0;

  sections.forEach((s,i)=>{
    if(current>=s.start) active=i;
  });

  document.querySelectorAll("[data-section]").forEach(b=>{
    b.classList.toggle("active",Number(b.dataset.section)===active);
  });

  if($("simI")) updateSimulation();

  applyScale();
}

function goPage(index) {
  clearTimeout(autoNext);
  stopReading();

  current=Math.max(0,Math.min(index,pages.length-1));

  renderPage();

  $("screen").scrollTo(0,0);
}

function go(amount) {
  goPage(current+amount);
}

/* ==========================================
   ЭКРАН МАСШТАБЫ · 25–300%
========================================== */

let scale=100;

function applyScale() {
  const screen=$("screen");
  const css=getComputedStyle(screen);

  const width=Math.max(1,
    screen.clientWidth-
    parseFloat(css.paddingLeft)-
    parseFloat(css.paddingRight)
  );

  $("stage").style.width=width+"px";
  $("stage").style.zoom=scale/100;
  $("stage").style.marginLeft=scale>100?"0":"auto";
  $("stage").style.marginRight=scale>100?"0":"auto";

  $("scaleLabel").textContent=scale+"%";
}

function zoom(amount) {
  scale=Math.max(25,Math.min(300,scale+amount));
  applyScale();
}

function resetZoom() {
  scale=100;
  applyScale();
  $("screen").scrollTo(0,0);
}

function toggleMenu() {
  const hidden=$("app").classList.toggle("menu-hidden");

  document.body.classList.toggle("menu-hidden",hidden);

  requestAnimationFrame(applyScale);
}

async function fullscreen() {
  try {
    if(document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    alert("Толық экран үшін F11 батырмасын басыңыз.");
  }
}

/* ==========================================
   ҚАЗАҚША ДАУЫСТАП ОҚУ
========================================== */

function readPage() {

  if(!("speechSynthesis" in window)) {
    alert("Дыбыстау қолжетімсіз.");
    return;
  }

  const voice=speechSynthesis.getVoices().find(
    v=>v.lang.toLowerCase().startsWith("kk")
  );

  if(!voice) {
    alert("Құрылғыда қазақша дауыс табылмады.");
    return;
  }

  stopReading();

  const speech=new SpeechSynthesisUtterance(
    $("stage").innerText
  );

  speech.lang="kk-KZ";
  speech.voice=voice;
  speech.rate=.95;

  speechSynthesis.speak(speech);
}

function stopReading() {
  if("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
}

/* ==========================================
   ҚОЗҒАЛМАЛЫ ТЕРЕЗЕЛЕР
========================================== */

let z=200;

function openPanel(id) {

  const p=$(id);

  p.classList.remove("hidden");
  p.style.zIndex=++z;

  if(id==="attendancePanel") {
    attendanceDraft=students.map(s=>s.present);
    renderStudents();
  }

  if(id==="tasksPanel") renderTaskList();
  if(id==="teamsPanel") renderTeams();

  clampPanel(p);
}

function closePanel(id) {
  $(id).classList.add("hidden");
}

function clampPanel(p) {

  if(p.classList.contains("hidden")) return;

  const r=p.getBoundingClientRect();

  p.style.left=Math.max(0,
    Math.min(r.left,innerWidth-r.width)
  )+"px";

  p.style.top=Math.max(0,
    Math.min(r.top,innerHeight-r.height)
  )+"px";

  p.style.right="auto";
}

document.querySelectorAll(".floating").forEach(panel=>{

  let drag=null;
  let suppress=false;

  panel.addEventListener("pointerdown",e=>{

    if(e.button!==0||!e.isPrimary) return;

    panel.style.zIndex=++z;
    suppress=false;

    if(!panel.classList.contains("mini") &&
       !e.target.closest(".window-title")) return;

    if(e.target.closest("select,textarea,input:not([readonly])")) return;

    const r=panel.getBoundingClientRect();

    drag={
      id:e.pointerId,
      x:e.clientX,
      y:e.clientY,
      left:r.left,
      top:r.top,
      moving:false
    };
  });

  window.addEventListener("pointermove",e=>{

    if(!drag||drag.id!==e.pointerId) return;

    const dx=e.clientX-drag.x;
    const dy=e.clientY-drag.y;

    if(!drag.moving&&Math.hypot(dx,dy)<6) return;

    if(!drag.moving) {

      drag.moving=true;
      suppress=true;

      panel.classList.add("dragging");

      try {
        panel.setPointerCapture(e.pointerId);
      } catch {}
    }

    if(e.cancelable) e.preventDefault();

    panel.style.left=Math.max(0,
      Math.min(drag.left+dx,innerWidth-panel.offsetWidth)
    )+"px";

    panel.style.top=Math.max(0,
      Math.min(drag.top+dy,innerHeight-panel.offsetHeight)
    )+"px";

    panel.style.right="auto";

  },{passive:false});

  function end(e) {

    if(!drag||drag.id!==e.pointerId) return;

    drag=null;

    panel.classList.remove("dragging");

    if(panel.hasPointerCapture(e.pointerId)) {
      panel.releasePointerCapture(e.pointerId);
    }
  }

  window.addEventListener("pointerup",end);
  window.addEventListener("pointercancel",end);

  panel.addEventListener("click",e=>{

    if(suppress) {
      suppress=false;
      e.preventDefault();
      e.stopImmediatePropagation();
    }

  },true);
});

/* ==========================================
   ҒЫЛЫМИ КАЛЬКУЛЯТОР
========================================== */

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

function renderMathKeys() {

  $("mathKeys").innerHTML=keys.map(k=>`
    <button class="${k==="="?"primary":""}"
      onclick="mathPress('${k}')">
      ${k==="DEG"?(degree?"DEG":"RAD"):k}
    </button>
  `).join("");
}

function mathPress(key) {

  try {

    if(key==="DEG") {
      degree=!degree;
      renderMathKeys();
      return;
    }

    if(key==="C") {
      expression="";
      $("mathResult").textContent="0";

    } else if(key==="⌫") {
      expression=expression.slice(0,-1);

    } else if(key==="=") {
      expression=num(evaluateMath(expression));
      $("mathResult").textContent=expression;

    } else if(key==="x²") {
      expression+="^2";

    } else if(key==="√") {
      expression+="sqrt(";

    } else if(key==="EXP") {
      expression+="e";

    } else if(["sin","cos","tan","ctg","ln","log"].includes(key)) {
      expression+=key+"(";

    } else {

      const map={
        "÷":"/",
        "×":"*",
        "−":"-",
        "π":"pi"
      };

      expression+=map[key]||key;
    }

    $("mathDisplay").value=expression
      .replaceAll("pi","π")
      .replaceAll("sqrt","√")
      .replaceAll("*","×")
      .replaceAll("/","÷");

  } catch {
    $("mathResult").textContent="Қате өрнек";
  }
}

/* МАТЕМАТИКАЛЫҚ ӨРНЕКТІ ЕСЕПТЕУ */

function evaluateMath(source) {

  const clean=source.replace(/\s+/g,"");

  if(!clean||clean.length>500) throw Error("Қате");

  const tokens=clean.match(
    /(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z]+|[+\-*/^()]/gi
  )||[];

  if(tokens.join("")!==clean) throw Error("Қате таңба");

  let pos=0;

  function sum() {

    let n=product();

    while(tokens[pos]==="+"||tokens[pos]==="-") {
      const op=tokens[pos++];
      const b=product();

      n=op==="+"?n+b:n-b;
    }

    return n;
  }

  function product() {

    let n=unary();

    while(tokens[pos]==="*"||tokens[pos]==="/") {

      const op=tokens[pos++];
      const b=unary();

      if(op==="/"&&b===0) throw Error("Нөлге бөлу");

      n=op==="*"?n*b:n/b;
    }

    return n;
  }

  function unary() {

    if(tokens[pos]==="+") {
      pos++;
      return unary();
    }

    if(tokens[pos]==="-") {
      pos++;
      return -unary();
    }

    return power();
  }

  function power() {

    let n=atom();

    if(tokens[pos]==="^") {
      pos++;
      n=Math.pow(n,unary());
    }

    return n;
  }

  function atom() {

    const token=tokens[pos++];

    if(token===undefined) throw Error("Өрнек толық емес");

    if(/^(?:\d|\.)/.test(token)) return Number(token);
    if(token==="pi") return Math.PI;

    if(token==="(") {

      const n=sum();

      if(tokens[pos++]!==")") throw Error("Жақша");

      return n;
    }

    const rad=x=>degree?x*Math.PI/180:x;

    const funcs={
      sin:x=>Math.sin(rad(x)),
      cos:x=>Math.cos(rad(x)),
      tan:x=>{
        if(Math.abs(Math.cos(rad(x)))<1e-12) {
          throw Error("Анықталмаған");
        }
        return Math.tan(rad(x));
      },
      ctg:x=>{
        if(Math.abs(Math.sin(rad(x)))<1e-12) {
          throw Error("Анықталмаған");
        }
        return 1/Math.tan(rad(x));
      },
      sqrt:Math.sqrt,
      ln:Math.log,
      log:Math.log10
    };

    if(Object.hasOwn(funcs,token)) {

      if(tokens[pos++]!=="(") throw Error("Жақша");

      const n=sum();

      if(tokens[pos++]!==")") throw Error("Жақша");

      return funcs[token](n);
    }

    throw Error("Белгісіз өрнек");
  }

  const result=sum();

  if(pos!==tokens.length||!Number.isFinite(result)) {
    throw Error("Қате өрнек");
  }

  return result;
}

/* ==========================================
   ФИЗИКАЛЫҚ КАЛЬКУЛЯТОР
========================================== */

const units={
  I:["Ток күші","А"],
  U:["Кернеу","В"],
  R:["Кедергі","Ом"],
  r:["Ішкі кедергі","Ом"],
  E:["ЭҚК","В"],
  A:["Жұмыс","Дж"],
  q:["Заряд","Кл"],
  P:["Қуат","Вт"],
  Q:["Жылу мөлшері","Дж"],
  t:["Уақыт","с"],
  eta:["ПӘК","%"],
  R1:["Бірінші кедергі","Ом"],
  R2:["Екінші кедергі","Ом"],
  I1:["Кіретін ток 1","А"],
  I2:["Кіретін ток 2","А"],
  I3:["Шығатын ток 1","А"],
  I4:["Шығатын ток 2","А"],
  h:["Уақыт","сағ"],
  W:["Энергия","кВт·сағ"]
};

const physics=[
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
    name:"Электр қозғаушы күш",
    vars:["E","A","q"],
    solve:{
      E:v=>v.A/v.q,
      A:v=>v.E*v.q,
      q:v=>v.A/v.E
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
    name:"Пайдалы әсер коэффициенті",
    vars:["eta","U","E"],
    solve:{
      eta:v=>v.U/v.E*100,
      U:v=>v.E*v.eta/100,
      E:v=>v.U*100/v.eta
    }
  },
  {
    name:"Электр энергиясы — кВт·сағ",
    vars:["W","P","h"],
    solve:{
      W:v=>v.P*v.h/1000,
      P:v=>v.W*1000/v.h,
      h:v=>v.W*1000/v.P
    }
  },
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
    name:"Тізбектей жалғау",
    vars:["R","R1","R2"],
    solve:{
      R:v=>v.R1+v.R2
    }
  },
  {
    name:"Параллель жалғау",
    vars:["R","R1","R2"],
    solve:{
      R:v=>v.R1*v.R2/(v.R1+v.R2)
    }
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

function initPhysics() {

  $("physicsFormula").innerHTML=physics.map((f,i)=>`
    <option value="${i}">${esc(f.name)}</option>
  `).join("");

  selectFormula();
}

function selectFormula() {

  const f=physics[Number($("physicsFormula").value)];

  $("physicsUnknown").innerHTML=Object.keys(f.solve).map(k=>`
    <option value="${k}">${esc(units[k][0])}</option>
  `).join("");

  physicsInputs();
}

function physicsInputs() {

  const f=physics[Number($("physicsFormula").value)];
  const unknown=$("physicsUnknown").value;

  $("physicsInputs").innerHTML=f.vars
    .filter(k=>k!==unknown)
    .map(k=>`
      <label>${esc(units[k][0])} (${esc(units[k][1])})</label>
      <input id="phys_${k}" inputmode="decimal" placeholder="Мәні">
    `).join("");

  $("physicsResult").textContent="Нәтиже";

  clampPanel($("physicsPanel"));
}

function calculatePhysics() {

  try {

    const f=physics[Number($("physicsFormula").value)];
    const unknown=$("physicsUnknown").value;
    const values={};

    f.vars.filter(k=>k!==unknown).forEach(k=>{

      const raw=$("phys_"+k).value.trim().replaceAll(",",".");

      if(!raw || !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(raw)) {
        throw Error("Мәндерді дұрыс енгізіңіз");
      }

      const v=Number(raw);

      if(!Number.isFinite(v)||v<0) {
        throw Error("Мәнді тексеріңіз");
      }

      if(k==="eta"&&v>100) {
        throw Error("ПӘК 100%-дан аспайды");
      }

      values[k]=v;
    });

    const answer=f.solve[unknown](values);

    if(!Number.isFinite(answer)) {
      throw Error("Нәтиже анықталмаған");
    }

    const kirchhoff=f.name.startsWith("Кирхгоф");

    if(answer<0&&!kirchhoff) {
      throw Error("Берілгендерді тексеріңіз");
    }

    if(unknown==="eta"&&answer>100) {
      throw Error("ПӘК 100%-дан аспайды");
    }

    const symbols={
      E:"ε",eta:"η",
      R1:"R₁",R2:"R₂",
      I1:"I₁",I2:"I₂",I3:"I₃",I4:"I₄"
    };

    $("physicsResult").textContent=
      `${symbols[unknown]||unknown} = ${num(answer)} ${units[unknown][1]}`+
      (kirchhoff&&answer<0?" (кері бағыт)":"");

  } catch(e) {
    $("physicsResult").textContent=e.message;
  }
}

/* ==========================================
   ИНТЕРАКТИВТІ ТАҚТА
========================================== */

const canvas=$("canvas");
const ctx=canvas.getContext("2d");

const BW=1600,BH=900;

let ink="#17354e";
let penSize=5;
let tool="pen";
let boardZoom=100;

let boardPages=[{actions:[],redo:[],grid:false}];
let activeBoard=0;
let draft=null;
let pointer=null;
let pan=null;

const state=()=>boardPages[activeBoard];

function openBoard() {
  clearTimeout(autoNext);
  stopReading();

  $("board").classList.remove("hidden");

  setTool(tool);
  resizeBoard();
}

function closeBoard() {
  cancelDrawing();
  $("board").classList.add("hidden");
}

function setColor(color) {
  ink=color;
  $("inkColor").value=color;
}

function setSize(size) {
  penSize=Number(size);
  $("penValue").textContent=penSize;
}

function setTool(value) {

  cancelDrawing();
  tool=value;

  document.querySelectorAll("[data-tool]").forEach(b=>{
    b.classList.toggle("active",b.dataset.tool===value);
  });

  canvas.style.cursor=value==="hand"?"grab":
    value==="text"?"text":"crosshair";
}

/* ДӘЛ КООРДИНАТАЛАР */

function point(e) {

  const rect=canvas.getBoundingClientRect();

  return {
    x:(e.clientX-rect.left)*BW/rect.width,
    y:(e.clientY-rect.top)*BH/rect.height
  };
}

/* СУРЕТ САЛУ */

function draw(a) {

  ctx.save();

  ctx.strokeStyle=a.color||"#17354e";
  ctx.fillStyle=a.color||"#17354e";
  ctx.lineWidth=a.size||5;
  ctx.lineCap="round";
  ctx.lineJoin="round";

  if(a.type==="clear") {

    ctx.clearRect(0,0,BW,BH);

  } else if(a.type==="image") {

    ctx.drawImage(a.image,a.x,a.y,a.width,a.height);

  } else if(a.type==="text") {

    ctx.font=`600 ${a.size}px "Segoe UI",Arial`;
    ctx.textBaseline="top";
    ctx.fillText(a.text,a.x,a.y);

  } else if(["pen","marker","eraser"].includes(a.type)) {

    if(a.type==="eraser") {
      ctx.globalCompositeOperation="destination-out";
    }

    if(a.type==="marker") ctx.globalAlpha=.3;

    const p=a.points;

    if(p.length) {

      ctx.beginPath();

      if(p.length===1) {

        ctx.arc(p[0].x,p[0].y,a.size/2,0,Math.PI*2);
        ctx.fill();

      } else {

        ctx.moveTo(p[0].x,p[0].y);

        p.slice(1).forEach(q=>ctx.lineTo(q.x,q.y));

        ctx.stroke();
      }
    }

  } else {

    const p=a.start,q=a.end;
    const dx=q.x-p.x,dy=q.y-p.y;

    ctx.beginPath();

    if(a.type==="line"||a.type==="arrow") {
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(q.x,q.y);
    }

    if(a.type==="arrow") {

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

    if(a.type==="rect") {
      ctx.rect(p.x,p.y,dx,dy);
    }

    if(a.type==="circle") {
      ctx.ellipse(
        (p.x+q.x)/2,(p.y+q.y)/2,
        Math.max(.1,Math.abs(dx)/2),
        Math.max(.1,Math.abs(dy)/2),
        0,0,Math.PI*2
      );
    }

    if(a.type==="triangle") {
      ctx.moveTo((p.x+q.x)/2,p.y);
      ctx.lineTo(p.x,q.y);
      ctx.lineTo(q.x,q.y);
      ctx.closePath();
    }

    ctx.stroke();
  }

  ctx.restore();
}

function renderBoard() {

  ctx.clearRect(0,0,BW,BH);

  state().actions.forEach(draw);

  if(draft) draw(draft);

  $("boardCount").textContent=
    `${activeBoard+1} / ${boardPages.length}`;

  const paper=$("paper");

  if(state().grid) {

    const step=Math.max(1,40*paper.clientWidth/BW);

    paper.style.backgroundImage=`
      linear-gradient(#d5e6f3 1px,transparent 1px),
      linear-gradient(90deg,#d5e6f3 1px,transparent 1px)
    `;

    paper.style.backgroundSize=`${step}px ${step}px`;

  } else {
    paper.style.backgroundImage="none";
  }
}

function commit(a) {
  state().actions.push(a);
  state().redo=[];
  renderBoard();
}

/* ҚАЛАМ, САУСАҚ, ТІНТУІР */

canvas.addEventListener("pointerdown",e=>{

  if(!e.isPrimary||e.button!==0||pointer!==null) return;

  e.preventDefault();

  const p=point(e);

  if(tool==="text") {

    const text=prompt("Тақтаға жазылатын мәтін:");

    if(text&&text.trim()) {

      commit({
        type:"text",
        text:text.trim(),
        color:ink,
        size:Math.max(25,penSize*4),
        x:p.x,y:p.y
      });
    }

    return;
  }

  pointer=e.pointerId;

  canvas.setPointerCapture(pointer);

  if(tool==="hand") {

    pan={
      x:e.clientX,
      y:e.clientY,
      left:$("boardViewport").scrollLeft,
      top:$("boardViewport").scrollTop
    };

    canvas.style.cursor="grabbing";
    return;
  }

  const size=tool==="eraser"?Math.max(18,penSize*3):
    tool==="marker"?penSize*4:penSize;

  draft=["pen","marker","eraser"].includes(tool)
    ?{type:tool,color:ink,size,points:[p]}
    :{type:tool,color:ink,size,start:p,end:p};

  renderBoard();
});

canvas.addEventListener("pointermove",e=>{

  if(e.pointerId!==pointer) return;

  if(pan) {

    $("boardViewport").scrollLeft=
      pan.left-(e.clientX-pan.x);

    $("boardViewport").scrollTop=
      pan.top-(e.clientY-pan.y);

    return;
  }

  if(!draft) return;

  const p=point(e);

  if(draft.points) {

    const last=draft.points.at(-1);

    if(Math.hypot(p.x-last.x,p.y-last.y)>.3) {
      draft.points.push(p);
    }

  } else {
    draft.end=p;
  }

  renderBoard();
});

function finishDrawing(e,cancelled=false) {

  if(e.pointerId!==pointer) return;

  if(draft&&!cancelled) {

    const p=point(e);

    if(draft.points) {

      const last=draft.points.at(-1);

      if(Math.hypot(p.x-last.x,p.y-last.y)>.3) {
        draft.points.push(p);
      }

    } else {
      draft.end=p;
    }
  }

  const finished=draft;

  pointer=null;
  draft=null;
  pan=null;

  if(finished&&!cancelled) commit(finished);
  else renderBoard();

  if(canvas.hasPointerCapture(e.pointerId)) {
    canvas.releasePointerCapture(e.pointerId);
  }

  if(tool==="hand") canvas.style.cursor="grab";
}

function cancelDrawing() {

  const id=pointer;

  pointer=null;
  draft=null;
  pan=null;

  if(id!==null&&canvas.hasPointerCapture(id)) {
    canvas.releasePointerCapture(id);
  }

  renderBoard();
}

canvas.addEventListener("pointerup",e=>finishDrawing(e));
canvas.addEventListener("pointercancel",e=>finishDrawing(e,true));
canvas.addEventListener("lostpointercapture",e=>finishDrawing(e,true));

/* ТАҚТАНЫҢ БЕТТЕРІ */

function newBoardPage() {

  cancelDrawing();

  boardPages.push({
    actions:[],
    redo:[],
    grid:false
  });

  activeBoard=boardPages.length-1;

  renderBoard();
}

function boardPage(amount) {

  cancelDrawing();

  activeBoard=Math.max(
    0,Math.min(activeBoard+amount,boardPages.length-1)
  );

  renderBoard();
}

function deleteBoardPage() {

  if(!confirm("Осы бетті өшіру керек пе?")) return;

  cancelDrawing();

  if(boardPages.length===1) {

    boardPages[0]={actions:[],redo:[],grid:false};

  } else {

    boardPages.splice(activeBoard,1);

    activeBoard=Math.min(activeBoard,boardPages.length-1);
  }

  renderBoard();
}

function undoBoard() {

  cancelDrawing();

  if(state().actions.length) {
    state().redo.push(state().actions.pop());
    renderBoard();
  }
}

function redoBoard() {

  cancelDrawing();

  if(state().redo.length) {
    state().actions.push(state().redo.pop());
    renderBoard();
  }
}

function clearBoard() {
  if(!confirm("Тақтаны тазалау керек пе?")) return;

  cancelDrawing();
  commit({type:"clear"});
}

function toggleGrid() {
  state().grid=!state().grid;
  renderBoard();
}

/* ТАҚТАНЫҢ МАСШТАБЫ */

function resizeBoard() {

  if($("board").classList.contains("hidden")) return;

  const viewport=$("boardViewport");

  const w=Math.max(1,viewport.clientWidth-24);
  const h=Math.max(1,viewport.clientHeight-24);

  const base=Math.min(w,h*BW/BH);
  const width=base*boardZoom/100;
  const height=width*BH/BW;

  const paper=$("paper");

  paper.style.width=width+"px";
  paper.style.marginTop=Math.max(0,(h-height)/2)+"px";
  paper.style.marginLeft=width>w?"0":"auto";
  paper.style.marginRight=width>w?"0":"auto";

  $("boardZoom").textContent=boardZoom+"%";

  renderBoard();
}

function boardScale(amount) {

  boardZoom=Math.max(25,Math.min(300,boardZoom+amount));

  resizeBoard();
}

function resetBoardScale() {

  boardZoom=100;

  resizeBoard();

  $("boardViewport").scrollTo(0,0);
}

/* ТАҚТАҒА СУРЕТ ҚОСУ */

function importImage(e) {

  const file=e.target.files[0];

  if(!file) return;

  const target=state();

  const image=new Image();
  const url=URL.createObjectURL(file);

  image.onload=()=>{

    const scale=Math.min(1000/image.width,650/image.height,1);
    const w=image.width*scale;
    const h=image.height*scale;

    if(boardPages.includes(target)) {

      target.actions.push({
        type:"image",
        image,
        width:w,height:h,
        x:(BW-w)/2,
        y:(BH-h)/2
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

/* ТАҚТАНЫ PNG СУРЕТ РЕТІНДЕ САҚТАУ */

function saveBoard() {

  const output=document.createElement("canvas");

  output.width=BW;
  output.height=BH;

  const out=output.getContext("2d");

  out.fillStyle="white";
  out.fillRect(0,0,BW,BH);

  if(state().grid) {

    out.strokeStyle="#d5e6f3";
    out.lineWidth=1;

    for(let x=0;x<=BW;x+=40) {
      out.beginPath();
      out.moveTo(x,0);
      out.lineTo(x,BH);
      out.stroke();
    }

    for(let y=0;y<=BH;y+=40) {
      out.beginPath();
      out.moveTo(0,y);
      out.lineTo(BW,y);
      out.stroke();
    }
  }

  out.drawImage(canvas,0,0);

  const page=activeBoard+1;

  output.toBlob(blob=>{

    if(!blob) return;

    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");

    a.href=url;
    a.download=`physics-323-board-${page}.png`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(()=>URL.revokeObjectURL(url),1000);

  },"image/png");
}

/* ==========================================
   АЛМАТЫ УАҚЫТЫ · UTC+5
========================================== */

const clockFormatter=new Intl.DateTimeFormat("kk-KZ",{
  timeZone:"UTC",
  hour:"2-digit",
  minute:"2-digit",
  second:"2-digit",
  hourCycle:"h23"
});

const dateFormatter=new Intl.DateTimeFormat("kk-KZ",{
  timeZone:"UTC",
  day:"numeric",
  month:"long",
  year:"numeric"
});

function updateClock() {

  const local=new Date(Date.now()+5*60*60*1000);

  $("clock").textContent=clockFormatter.format(local);
  $("date").textContent=dateFormatter.format(local);
}

/* ==========================================
   80 МИНУТТЫҚ ТАЙМЕР
========================================== */

const duration=80*60;

let accumulated=0;
let started=0;
let running=false;

function timerSeconds() {

  const extra=running?(Date.now()-started)/1000:0;

  return Math.min(
    duration,Math.max(0,Math.floor(accumulated+extra))
  );
}

function updateTimer() {

  const remaining=duration-timerSeconds();

  const minutes=String(Math.floor(remaining/60)).padStart(2,"0");
  const seconds=String(remaining%60).padStart(2,"0");

  $("timer").textContent=minutes+":"+seconds;

  $("timer").style.color=
    remaining<=300?"#d63a50":"#16874e";

  if(remaining===0) {
    running=false;
    accumulated=duration;
  }

  $("timerBtn").textContent=running?"Тоқтату":"Бастау";
  $("timerBtn").disabled=remaining===0;
}

function startTimer() {

  if(running||accumulated>=duration) return;

  started=Date.now();
  running=true;

  updateTimer();
}

function toggleTimer() {

  if(running) {

    accumulated=Math.min(
      duration,accumulated+(Date.now()-started)/1000
    );

    running=false;

  } else {
    startTimer();
  }

  updateTimer();
}

function resetTimer() {

  if(!confirm("Таймерді 80 минутқа қайтару керек пе?")) return;

  accumulated=0;
  started=0;
  running=false;

  updateTimer();
}

/* ==========================================
   ПЕРНЕТАҚТАДАН БАСҚАРУ
========================================== */

document.addEventListener("keydown",e=>{

  if(e.key==="Escape") {

    const opened=[...document.querySelectorAll(".floating")]
      .filter(p=>!p.classList.contains("hidden"))
      .sort((a,b)=>Number(b.style.zIndex||0)-Number(a.style.zIndex||0));

    if(opened.length) {
      closePanel(opened[0].id);
    } else if(!$("board").classList.contains("hidden")) {
      closeBoard();
    }

    return;
  }

  if(e.target.closest("input,select,textarea,button")) return;

  if(!$("board").classList.contains("hidden")) {

    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z") {
      e.preventDefault();
      if(e.shiftKey) redoBoard();
      else undoBoard();
    }

    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y") {
      e.preventDefault();
      redoBoard();
    }

    return;
  }

  if(e.key==="ArrowRight") go(1);
  if(e.key==="ArrowLeft") go(-1);

  if(!e.ctrlKey&&!e.metaKey) {
    if(e.key==="+") zoom(25);
    if(e.key==="-") zoom(-25);
    if(e.key==="0") resetZoom();
  }
});

function onResize() {

  applyScale();
  resizeBoard();

  document.querySelectorAll(".floating").forEach(clampPanel);
}

window.addEventListener("resize",onResize);
document.addEventListener("fullscreenchange",onResize);

/* ==========================================
   САЙТТЫ ІСКЕ ҚОСУ
========================================== */

/* Ең бірінші — оқушыларды рандом араластыру */

assignTasks();

/* Одан кейін командаларды бөлу */

shuffleTeams(false);

/* Сабақ беттерін құрастыру */

buildPages();

renderStudents();
renderTaskList();
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

console.log("PHYSICS LAB PRO — 3.2.3");
console.log("Рандом есептер:",assignments.length);
console.log("Сабақ беттері:",pages.length);

/* ==========================================
   BY DARKHAN
========================================== */
