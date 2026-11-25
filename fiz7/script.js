
"use strict";

const $=id=>document.getElementById(id);

const esc=s=>String(s).replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",
  '"':"&quot;","'":"&#39;"
}[c]));

const frac=(a,b)=>
  `<span class="frac"><span>${a}</span><span>${b}</span></span>`;

function num(n){
  if(!Number.isFinite(n)) throw Error("Нәтиже анықталмаған");
  return String(Number(n.toPrecision(9))).replace(".",",");
}

const MU0=4*Math.PI*1e-7;

/* 24 ОҚУШЫ */

const names=[
  "Рамазан","Тұрғанжан","Нұрай","Әлқуат",
  "Шырай","Гүлсезім","Маржан","Мариям",
  "Жансая","Азиза","Ақсезім","Нұрболсын",
  "Ақнұр","Іңкәр","Асхат","Аяжан",
  "Мирас","Санжар","Ерасыл","Нұрасыл",
  "Расул","Айнұр","Дархан","Айкерім"
];

const students=names.map((name,id)=>({id,name,present:true}));

let attendanceDraft=[];
let assignments=[];
const completed=new Set();
const drawn=new Set();
let randomId=null;

/* НЕГІЗГІ ФОРМУЛАЛАР */

const F={
  B:`B = ${frac("μ₀I","2πr")}`,
  mu:"μ₀ ≈ 4π × 10<sup>−7</sup> Н/А²",
  force:`F = ${frac("μ₀I₁I₂l","2πr")}`,
  perLength:`${frac("F","l")} = ${frac("μ₀I₁I₂","2πr")}`,
  sum:"B = B₁ + B₂",
  difference:"B = |B₁ − B₂|",
  perpendicular:"B = √(B₁² + B₂²)",
  charge:"q = It"
};

/* =====================================
   15 ТҮСІНДІРМЕ
===================================== */

const theory=[
  [
    "Магнит өрісі",
    "Магнит өрісі — қозғалыстағы электр зарядтарына, электр тогына және магниттік денелерге әсер ететін өріс.",
    "Электр тогы жүретін өткізгіштің айналасында магнит өрісі пайда болады. Тұрақты магниттер де магнит өрісін тудырады. Магнит өрісін тікелей көзбен көре алмаймыз, бірақ оның әсерін магниттік тілшенің бағыты арқылы байқауға болады.",
    "Магнит өрісі → B⃗",
    "Жердің магнит өрісі компас тілшесінің бағдарлануына әсер етеді.",
    "magnet"
  ],
  [
    "Магниттің полюстері",
    "Тұрақты магниттің солтүстік N және оңтүстік S полюстері болады.",
    "Аттас магнит полюстері бір-бірін тебеді, ал әр аттас полюстер тартылады. Магнит өрісі дененің айналасында белгілі бір кеңістікте таралады. Магниттің сыртындағы өріс сызықтары N полюсінен S полюсіне қарай бағытталады.",
    "N — солтүстік; S — оңтүстік",
    "N және S полюстері өзара тартылады.",
    "poles"
  ],
  [
    "Магнит өрісінің күш сызықтары",
    "Магнит өрісінің сызықтары өрістің бағытын көрнекі түрде көрсетеді.",
    "Магнит индукция векторы өріс сызығына жүргізілген жанама бойымен бағытталады. Магнит өрісінің сызықтары тұйық болады және бір-бірімен қиылыспайды. Сызықтардың жиілігі өрістің салыстырмалы күштілігін бейнелейді.",
    "B⃗ — өріс сызығына жанама",
    "Магнит полюстеріне жақын аймақта өріс сызықтары жиірек бейнеленеді.",
    "magnet"
  ],
  [
    "Эрстед тәжірибесінің мағынасы",
    "Электр тогы магнит өрісін тудыратыны тәжірибе жүзінде анықталған.",
    "Электр тогы мен магниттік құбылыстар өзара байланысты. Ток жүретін өткізгіштің маңындағы магниттік тілшенің бағыты өзгеруі мүмкін. Бұл электр тогының айналасында магнит өрісі бар екенін көрсетеді.",
    "Электр тогы → Магнит өрісі",
    "Бұл құбылыс электромагнетизмнің дамуына негіз болды.",
    "wire"
  ],
  [
    "Магнит индукция векторы",
    "Магнит индукциясы — магнит өрісінің күштік сипаттамасын анықтайтын векторлық физикалық шама.",
    "Магнит индукциясы B әрпімен белгіленеді. Оның сандық мәнімен қатар бағыты да болады. Магнит индукциясының халықаралық өлшем бірлігі — тесла. Әлсіз магнит өрістерін милли-тесла немесе микротесла арқылы өрнектеуге болады.",
    "B⃗; 1 мТл = 10⁻³ Тл; 1 мкТл = 10⁻⁶ Тл",
    "0,004 Тл = 4 мТл.",
    "uniform"
  ],
  [
    "Түзу токтың магнит өрісі",
    "Ұзын түзу өткізгіштегі токтың магнит өрісінің сызықтары концентрлік шеңберлер түрінде болады.",
    "Идеалданған ұзын түзу өткізгіш моделінде магнит өрісі өткізгішті айнала орналасады. Магнит индукциясы ток күшіне тура, өткізгіштен қарастырылатын нүктеге дейінгі қашықтыққа кері пропорционал.",
    F.B,
    "Басқа шамалар тұрақты болса, қашықтық екі есе артқанда магнит индукциясы екі есе азаяды.",
    "wire"
  ],
  [
    "Бұрғы ережесі",
    "Бұрғы ережесі ток бағыты мен магнит өрісінің бағыты арасындағы байланысты анықтайды.",
    "Егер оң бұрандалы бұрғының ілгерілемелі қозғалысы шартты ток бағытымен сәйкес келсе, оның айналу бағыты магнит индукция сызықтарының бағытын көрсетеді. Бұл ережені сызбадағы ток бағытын анықтауға қолданамыз.",
    "Ток бағыты ↔ Магнит өрісінің айналу бағыты",
    "Ток бағыты кері өзгерсе, магнит өрісінің бағыты да кері өзгереді.",
    "rule"
  ],
  [
    "Оң қол ережесі",
    "Оң қол ережесі бұрғы ережесінің балама көрнекі тәсілі болып табылады.",
    "Ойша оң қолдың бас бармағын шартты ток бағытымен сәйкестендірсек, бүгілген саусақтар магнит өрісі сызықтарының айналу бағытын білдіреді. Бұл ереже түзу токтың магнит өрісінің бағытын түсіндіреді.",
    "Бас бармақ — I; бүгілген саусақтар — B⃗",
    "Бұл ережеде электрондардың емес, шартты электр тогының бағыты пайдаланылады.",
    "rule"
  ],
  [
    "Ток бағытының шартты белгілері",
    "Сызба жазықтығына перпендикуляр ток ⊙ және ⊗ таңбаларымен белгіленеді.",
    "Нүктесі бар шеңбер токтың бақылаушыға қарай бағытталғанын көрсетеді. Айқышы бар шеңбер токтың бақылаушыдан әрі қарай бағытталғанын білдіреді. Бұл белгілер кеңістіктегі бағыттарды жазық сызбада көрсетуге мүмкіндік береді.",
    "⊙ — бізге қарай; ⊗ — бізден әрі қарай",
    "⊙ белгісінде өріс сағат тіліне қарсы, ⊗ белгісінде сағат тілімен бағытталады.",
    "symbols"
  ],
  [
    "Бағыттас параллель токтар",
    "Бір бағыттағы параллель токтар бір-біріне тартылады.",
    "Әр өткізгіштің тогы өзінің магнит өрісін тудырады. Бірінші өткізгіштің магнит өрісі екінші өткізгішке әсер етеді, ал екіншісі біріншісіне әсер етеді. Токтардың бағыттары бірдей болса, олардың өзара әрекеттесуі тартылыс түрінде болады.",
    "I₁ ↑   ↑ I₂ — тартылыс",
    "Екі бағыттас параллель ток арасындағы күштер қарама-қарсы бағытталған.",
    "attract"
  ],
  [
    "Қарама-қарсы бағытталған токтар",
    "Қарама-қарсы бағыттағы параллель токтар бір-бірін тебеді.",
    "Өткізгіштердегі токтардың бағыттары қарама-қарсы болғанда олардың магниттік өзара әрекеттесу күштерінің бағыты өзгереді. Бұл құбылыс электр тогының магниттік қасиетін сипаттайды.",
    "I₁ ↑   ↓ I₂ — тебіліс",
    "Тартылыс пен тебіліс токтардың өзара бағытына байланысты.",
    "repel"
  ],
  [
    "Параллель токтардың өзара әрекеттесу күші",
    "Идеалданған ұзын параллель өткізгіштер арасындағы магниттік күш токтардың көбейтіндісіне тура пропорционал.",
    "Вакуумдағы екі ұзын түзу параллель өткізгіш моделінде күш қарастырылатын ұзындыққа тура, өткізгіштер арақашықтығына кері пропорционал. Формула күштің модулін анықтайды, бағыты токтардың өзара бағытына байланысты.",
    F.force,
    "F — күш, I₁ және I₂ — ток күштері, l — ұзындық, r — арақашықтық.",
    "attract"
  ],
  [
    "Магниттік тұрақты",
    "Магниттік тұрақты вакуумның магниттік қасиетін сипаттайды.",
    "Магниттік тұрақты μ₀ арқылы белгіленеді. Мектеп пен колледж есептерінде оның жуық мәні 4π × 10⁻⁷ Н/А² деп алынады. Осы мән магнит индукциясы мен параллель токтардың әрекеттесуіне арналған формулаларда қолданылады.",
    F.mu,
    "Есептеулерде μ₀/(2π) ≈ 2 × 10⁻⁷ Н/А².",
    "constant"
  ],
  [
    "Магнит өрістерінің суперпозициясы",
    "Бірнеше магнит өрісі бар нүктеде қорытқы магнит индукциясы олардың векторлық қосындысына тең.",
    "Бір бағыттағы магнит индукцияларының модульдері қосылады. Қарама-қарсы бағытталған өрістер үшін модульдердің айырмасы алынады. Перпендикуляр векторлардың қорытқы модулі Пифагор теоремасымен анықталады.",
    `${F.sum}<br>${F.difference}<br>${F.perpendicular}`,
    "Перпендикуляр 3 мТл және 4 мТл өрістердің қорытқы индукциясы 5 мТл.",
    "vectors"
  ],
  [
    "Біртекті магнит өрісі",
    "Біртекті магнит өрісінде магнит индукциясының модулі мен бағыты барлық нүктеде бірдей болады.",
    "Біртекті өріс параллель және бірдей аралықпен орналасқан бағытталған сызықтар арқылы бейнеленеді. Ал біртекті емес өрісте магнит индукциясы кеңістіктегі орынға байланысты өзгереді. Бұл ұғымдар магниттік құбылыстарды түсіндіруде маңызды.",
    "B⃗ = const",
    "Идеал біртекті өрісте барлық индукция векторлары бірдей.",
    "uniform"
  ]
];

/* =====================================
   10 БЕТТІК КОНСПЕКТ
===================================== */

const notes=[
  ["Магнит өрісі",
   "Магнит өрісі қозғалыстағы электр зарядтарымен, электр тогымен және магниттік денелермен байланысты.",
   "Магнит индукциясы — B⃗",
   "Магнит өрісі қозғалыстағы зарядтарға әсер етеді."],

  ["Магнит полюстері",
   "Аттас магнит полюстері тебіледі, әр аттас полюстер тартылады.",
   "N — солтүстік; S — оңтүстік",
   "Магниттің сыртындағы өріс бағыты N-нен S-ке қарай."],

  ["Магнит өрісінің сызықтары",
   "Магнит өрісінің сызықтары тұйық болады және қиылыспайды. Магнит индукциясы сызыққа жанама бағытталады.",
   "B⃗ — векторлық шама",
   "Сызықтар өрістің кеңістіктегі бағытын көрсетеді."],

  ["Магнит индукциясы",
   "Магнит индукциясы магнит өрісінің күштік сипаттамасы болып табылады.",
   "1 мТл = 10⁻³ Тл<br>1 мкТл = 10⁻⁶ Тл",
   "SI жүйесіндегі өлшем бірлігі — тесла (Тл)."],

  ["Түзу токтың магнит өрісі",
   "Вакуумдағы идеал ұзын түзу өткізгіштің өрісі ток күшіне тура, қашықтыққа кері пропорционал.",
   F.B,
   "I — А; r — м; B — Тл."],

  ["Бұрғы және оң қол ережелері",
   "Бұрғының ілгерілемелі қозғалысы ток бағытымен сәйкес келсе, айналу бағыты магнит өрісінің бағытын көрсетеді.",
   "⊙ — сағат тіліне қарсы<br>⊗ — сағат тілімен",
   "Бағыттар бақылаушыға қатысты анықталады."],

  ["Токтардың әрекеттесуі",
   "Бір бағыттағы параллель токтар тартылады, қарама-қарсы бағыттағы токтар тебіледі.",
   "↑ ↑ — тартылыс<br>↑ ↓ — тебіліс",
   "Өзара әрекеттесу магнит өрісі арқылы жүзеге асады."],

  ["Өзара әрекеттесу күші",
   "Идеал ұзын параллель өткізгіштер арасындағы магниттік күш ток күштеріне және арақашықтыққа тәуелді.",
   `${F.force}<br>${F.perLength}`,
   "F — Н; l және r — м."],

  ["Магниттік тұрақты",
   "Магниттік тұрақты вакуумның магниттік қасиетін сипаттайды.",
   F.mu,
   "μ₀/(2π) ≈ 2 × 10⁻⁷ Н/А²."],

  ["Өрістердің суперпозициясы",
   "Қорытқы магнит индукциясы жеке өрістердің векторлық қосындысына тең.",
   `${F.sum}<br>${F.difference}<br>${F.perpendicular}`,
   "Бұл үш формула сәйкесінше бағыттас, қарама-қарсы және перпендикуляр өрістер үшін қолданылады."]
];

/* =====================================
   24 ЖЕКЕ ЕСЕП
===================================== */

const tasks=[

  /* 1-ДЕҢГЕЙ — ОҢАЙ */

  ["Магнит индукциясының бірлігі",
   "Магнит индукциясы 8 мТл. Оны тесламен өрнекте.",
   "B = 8 мТл","B (Тл) — ?",
   "8 мТл = 8 × 10⁻³ Тл = 0,008 Тл"],

  ["Микротесла",
   "Магнит индукциясы 250 мкТл. Оны теслаға айналдыр.",
   "B = 250 мкТл","B (Тл) — ?",
   "250 × 10⁻⁶ = 2,5 × 10⁻⁴ Тл"],

  ["Бағыттас өрістер",
   "Бір нүктеде бір бағыттағы 3 мТл және 5 мТл екі магнит өрісі бар. Қорытқы индукцияны тап.",
   "B₁ = 3 мТл; B₂ = 5 мТл","B — ?",
   "B = 3 + 5 = 8 мТл"],

  ["Қарама-қарсы өрістер",
   "Қарама-қарсы бағытталған өрістердің индукциялары 12 мТл және 7 мТл. Қорытқы индукцияны анықта.",
   "B₁ = 12 мТл; B₂ = 7 мТл","B — ?",
   "B = |12 − 7| = 5 мТл"],

  ["Перпендикуляр өрістер",
   "Өзара перпендикуляр магнит индукциялары 6 мТл және 8 мТл. Қорытқы мәнді тап.",
   "B₁ = 6 мТл; B₂ = 8 мТл","B — ?",
   "B = √(6² + 8²) = √100 = 10 мТл"],

  ["Қашықтықтың өзгерісі",
   "Түзу токтың идеал моделінде бастапқы магнит индукциясы 60 мкТл. Қашықтық 3 есе артса, жаңа мәнді тап.",
   "B₁ = 60 мкТл; r₂ = 3r₁","B₂ — ?",
   `B₂ = ${frac("60","3")} = 20 мкТл`],

  ["Токтың өзгерісі",
   "Теориялық модельде магнит индукциясы 15 мкТл. Ток күші екі есе артты, қашықтық өзгерген жоқ. Жаңа индукцияны анықта.",
   "B₁ = 15 мкТл; I₂ = 2I₁","B₂ — ?",
   "B₂ = 2 × 15 = 30 мкТл"],

  ["Бірлік ұзындыққа келетін күш",
   "Теориялық есепте 4 м ұзындыққа 0,008 Н магниттік күш сәйкес келеді. Бір метрге келетін күшті анықта.",
   "F = 0,008 Н; l = 4 м","F/l — ?",
   `${frac("F","l")} = ${frac("0,008","4")} = 0,002 Н/м`],

  /* 2-ДЕҢГЕЙ — ОРТАША */

  ["Түзу токтың өрісі",
   "Идеал ұзын түзу ток моделінде I = 2 А, r = 0,1 м. Магнит индукциясын есепте.",
   "I = 2 А; r = 0,1 м","B — ?",
   `B = ${frac("2 × 10⁻⁷ × 2","0,1")} = 4 × 10⁻⁶ Тл = 4 мкТл`],

  ["Магнит индукциясын анықтау",
   "Теориялық түзу өткізгіш моделінде I = 3 А, r = 0,2 м. Магнит индукциясын есепте.",
   "I = 3 А; r = 0,2 м","B — ?",
   `B = ${frac("2 × 10⁻⁷ × 3","0,2")} = 3 мкТл`],

  ["Индукциялардың қатынасы",
   "Екі идеал модельде ток күштері бірдей. Бірінші нүктенің қашықтығы екіншісінен төрт есе кіші. Индукциялардың қатынасын тап.",
   "I₁ = I₂; r₂ = 4r₁","B₁ : B₂ — ?",
   `${frac("B₁","B₂")} = ${frac("r₂","r₁")} = 4`],

  ["Өрістерді салыстыру",
   "Бірінші өрістің индукциясы 0,006 Тл, екіншісі 2000 мкТл. Бірінші өріс екіншісінен неше есе үлкен?",
   "B₁ = 0,006 Тл; B₂ = 0,002 Тл","B₁ : B₂ — ?",
   `${frac("0,006","0,002")} = 3`],

  ["Қорытқы магнит индукциясы",
   "Бағыттас үш магнит өрісінің индукциялары 2, 4 және 7 мТл. Қорытқы индукцияны анықта.",
   "B₁ = 2 мТл; B₂ = 4 мТл; B₃ = 7 мТл","B — ?",
   "B = 2 + 4 + 7 = 13 мТл"],

  ["Күштердің қатынасы",
   "Идеал параллель токтар моделінде бірінші ток екі есе, екінші ток үш есе артты. Қалған шамалар өзгермеді. Күш неше есе өзгереді?",
   "I₁′ = 2I₁; I₂′ = 3I₂","F′ : F — ?",
   `${frac("F′","F")} = 2 × 3 = 6`],

  ["Перпендикуляр векторлар",
   "Екі перпендикуляр магнит өрісінің индукциялары 5 мТл және 12 мТл. Қорытқы индукцияны тап.",
   "B₁ = 5 мТл; B₂ = 12 мТл","B — ?",
   "B = √(25 + 144) = 13 мТл"],

  ["Үш магнит өрісі",
   "Оңға бағытталған 9 мТл және 4 мТл өрістерге солға бағытталған 6 мТл өріс қосылды. Қорытқы индукцияны және бағытын анықта.",
   "B₁ = 9 мТл; B₂ = 4 мТл; B₃ = 6 мТл","B — ?",
   "B = 9 + 4 − 6 = 7 мТл, оңға бағытталған."],

  /* 3-ДЕҢГЕЙ — КҮРДЕЛІ */

  ["Ток пен қашықтықтың өзгерісі",
   "Идеал түзу ток моделінде бастапқы индукция 12 мкТл. Ток күші 3 есе, қашықтық 2 есе артты. Жаңа индукцияны тап.",
   "B₁ = 12 мкТл; I₂ = 3I₁; r₂ = 2r₁","B₂ — ?",
   `B₂ = 12 × ${frac("3","2")} = 18 мкТл`],

  ["Магниттік күштің өзгерісі",
   "Параллель токтардың шартты моделінде бастапқы күш 0,006 Н. Бірінші ток екі есе артып, арақашықтық үш есе артты. Қалған шамалар тұрақты. Жаңа күшті тап.",
   "F₁ = 0,006 Н; I₁′ = 2I₁; r₂ = 3r₁","F₂ — ?",
   `F₂ = 0,006 × ${frac("2","3")} = 0,004 Н`],

  ["Векторлық қосынды",
   "Шығысқа 6 мТл және 2 мТл, солтүстікке 6 мТл магнит өрістері бағытталған. Қорытқы индукцияның модулін анықта.",
   "Bₓ = 6 + 2 мТл; Bᵧ = 6 мТл","B — ?",
   "B = √(8² + 6²) = 10 мТл"],

  ["Өрістің пайыздық өзгерісі",
   "Магнит индукциясы 80 мкТл-дан 60 мкТл-ға азайды. Абсолюттік және пайыздық өзгерісін анықта.",
   "B₁ = 80 мкТл; B₂ = 60 мкТл","ΔB, пайыз — ?",
   `ΔB = 60 − 80 = −20 мкТл<br>${frac("20","80")} × 100% = 25% азайды.`],

  ["Белгісіз магнит индукциясы",
   "Екі өзара перпендикуляр өрістің қорытқы индукциясы 17 мТл. Бірінші өріс 8 мТл. Екінші өрісті тап.",
   "B = 17 мТл; B₁ = 8 мТл","B₂ — ?",
   "B₂ = √(17² − 8²) = √225 = 15 мТл"],

  ["Бірнеше өрістің қосылуы",
   "Оңға бағытталған 10 мТл және солға бағытталған 4 мТл өріске жоғары бағытталған 8 мТл өріс қосылды. Қорытқы модульді тап.",
   "Bₓ = 10 − 4 мТл; Bᵧ = 8 мТл","B — ?",
   "B = √(6² + 8²) = 10 мТл"],

  ["Магниттік күшті салыстыру",
   "Идеал параллель токтар моделінде токтардың әрқайсысы екі есе азайып, арақашықтық екі есе артты. Ұзындық өзгермейді. Күш неше есе өзгереді?",
   "I₁′ = I₁/2; I₂′ = I₂/2; r′ = 2r","F′ : F — ?",
   `${frac("F′","F")} = ${frac("1","2 × 2 × 2")} = ${frac("1","8")}<br>Күш 8 есе азаяды.`],

  ["Қорытқы өріс және пайыз",
   "Перпендикуляр екі өрістің индукциялары 9 мТл және 12 мТл. Кейін екеуінің де модулі 20%-ға азайды. Бастапқы және соңғы қорытқы индукцияны тап.",
   "B₁ = 9 мТл; B₂ = 12 мТл; азаю = 20%","B, B′ — ?",
   "B = √(9² + 12²) = 15 мТл<br>B′ = 15 × 0,8 = 12 мТл"]
];

/* =====================================
   15 КОМАНДАЛЫҚ СҰРАҚ
===================================== */

const quiz=[
  ["Магнит индукциясы қандай әріппен белгіленеді?",
   ["I","B","R","q"],1],

  ["Магнит индукциясының SI жүйесіндегі бірлігі?",
   ["Ампер","Вольт","Тесла","Ом"],2],

  ["Аттас магнит полюстері қалай әрекеттеседі?",
   ["Тебіледі","Тартылады","Әсерлеспейді","Балқиды"],0],

  ["Магнит өрісінің сызықтары қандай?",
   ["Үзік","Тек түзу","Қиылысатын","Тұйық"],3],

  ["Түзу токтың магнит өрісі қандай пішінде?",
   ["Үшбұрыш","Концентрлік шеңберлер","Шаршы","Парабола"],1],

  ["Бұрғы ережесі нені анықтайды?",
   ["Кедергіні","Температураны","Магнит өрісінің бағытын","Массаны"],2],

  ["Бір бағыттағы параллель токтар?",
   ["Тартылады","Тебіледі","Әсерлеспейді","Тоқтайды"],0],

  ["Қарама-қарсы бағыттағы параллель токтар?",
   ["Тартылады","Бірігеді","Өзгермейді","Тебіледі"],3],

  ["⊙ белгісі нені білдіреді?",
   ["Бізден әрі ток","Бізге қарай ток","Ток жоқ","Айнымалы ток"],1],

  ["⊗ белгісінде магнит өрісі қалай бағытталады?",
   ["Жоғары","Сағат тіліне қарсы","Сағат тілімен","Төмен"],2],

  ["1 мТл неше теслаға тең?",
   ["10⁻³ Тл","10³ Тл","10⁻⁶ Тл","100 Тл"],0],

  ["Қашықтық екі есе артса, идеал түзу ток өрісі?",
   ["Екі есе артады","Төрт есе артады","Өзгермейді","Екі есе азаяды"],3],

  ["Бағыттас 4 мТл және 6 мТл өрістердің қосындысы?",
   ["2 мТл","10 мТл","24 мТл","6 мТл"],1],

  ["Перпендикуляр 3 мТл және 4 мТл өрістердің қорытқысы?",
   ["7 мТл","1 мТл","5 мТл","12 мТл"],2],

  ["Біртекті магнит өрісінде B векторы қандай?",
   ["Модулі мен бағыты тұрақты","Үнемі өзгереді","Нөлге тең","Бағытсыз"],0]
];

/* =====================================
   КӨРНЕКІ СЫЗБАЛАР
===================================== */

function diagram(type,reverse=false){
  const b="#087dcc",r="#d63a50",g="#16874e",k="#38576e";

  const txt=(x,y,s,c=k,size=18)=>
    `<text x="${x}" y="${y}" text-anchor="middle"
      font-size="${size}" font-weight="600" fill="${c}">${s}</text>`;

  const arrow=(x,y,X,Y,c=b)=>{
    const a=Math.atan2(Y-y,X-x);

    return `<path d="M${x} ${y} L${X} ${Y}
      L${X-11*Math.cos(a-.5)} ${Y-11*Math.sin(a-.5)}
      M${X} ${Y}
      L${X-11*Math.cos(a+.5)} ${Y-11*Math.sin(a+.5)}"
      stroke="${c}" stroke-width="3.5" fill="none"
      stroke-linecap="round"/>`;
  };

  let content="",caption="";

  if(type==="magnet"){
    caption="Тұрақты магниттің магнит өрісі";

    for(const h of [40,75,110]){
      content+=`
        <path d="M95 140 C20 ${140-h*1.5},420 ${140-h*1.5},345 140
          C420 ${140+h*1.5},20 ${140+h*1.5},95 140"
          fill="none" stroke="${b}" stroke-width="2"/>
        ${arrow(207,140-h*1.125,233,140-h*1.125,b)}
        ${arrow(207,140+h*1.125,233,140+h*1.125,b)}
      `;
    }

    content+=`
      <rect x="100" y="115" width="120" height="50" rx="5" fill="${r}"/>
      <rect x="220" y="115" width="120" height="50" rx="5" fill="${b}"/>
      ${txt(155,148,"N","white",27)}
      ${txt(285,148,"S","white",27)}
      ${arrow(260,140,180,140,"white")}
    `;

  }else if(type==="poles"){
    caption="Магнит полюстерінің әрекеттесуі";

    content=`
      <rect x="25" y="60" width="85" height="50" fill="${b}"/>
      <rect x="110" y="60" width="85" height="50" fill="${r}"/>
      <rect x="245" y="60" width="85" height="50" fill="${b}"/>
      <rect x="330" y="60" width="85" height="50" fill="${r}"/>
      ${txt(67,93,"S","white",25)}
      ${txt(152,93,"N","white",25)}
      ${txt(287,93,"S","white",25)}
      ${txt(372,93,"N","white",25)}
      ${arrow(170,42,215,42,g)}
      ${arrow(270,42,225,42,g)}
      ${txt(220,135,"Тартылыс",g,22)}

      <rect x="25" y="185" width="85" height="50" fill="${b}"/>
      <rect x="110" y="185" width="85" height="50" fill="${r}"/>
      <rect x="245" y="185" width="85" height="50" fill="${r}"/>
      <rect x="330" y="185" width="85" height="50" fill="${b}"/>
      ${txt(67,218,"S","white",25)}
      ${txt(152,218,"N","white",25)}
      ${txt(287,218,"N","white",25)}
      ${txt(372,218,"S","white",25)}
      ${arrow(215,166,155,166,r)}
      ${arrow(225,166,285,166,r)}
      ${txt(220,263,"Тебіліс",r,22)}
    `;

  }else if(type==="wire"||type==="rule"){
    caption=reverse?
      "Ток бізден әрі — өріс сағат тілімен":
      "Ток бізге қарай — өріс сағат тіліне қарсы";

    for(const radius of [45,75,105]){
      content+=`
        <circle cx="220" cy="135" r="${radius}"
          fill="none" stroke="${b}" stroke-width="2.5"/>
        ${arrow(
          reverse?207:233,135-radius,
          reverse?233:207,135-radius,b
        )}
        ${arrow(
          reverse?233:207,135+radius,
          reverse?207:233,135+radius,b
        )}
      `;
    }

    content+=`
      <circle cx="220" cy="135" r="22"
        fill="white" stroke="${r}" stroke-width="4"/>
      ${reverse?
        `<path d="M210 125 L230 145 M230 125 L210 145"
          stroke="${r}" stroke-width="4"/>`:
        `<circle cx="220" cy="135" r="6" fill="${r}"/>`}
      ${txt(220,267,reverse?"⊗ — бізден әрі":"⊙ — бізге қарай",r,21)}
    `;

  }else if(type==="symbols"){
    caption="Ток бағытының шартты таңбалары";

    content=`
      <circle cx="110" cy="110" r="52" fill="white"
        stroke="${r}" stroke-width="4"/>
      <circle cx="110" cy="110" r="12" fill="${r}"/>
      <circle cx="330" cy="110" r="52" fill="white"
        stroke="${b}" stroke-width="4"/>
      <path d="M305 85 L355 135 M355 85 L305 135"
        stroke="${b}" stroke-width="6"/>
      ${txt(110,195,"Бізге қарай",r,24)}
      ${txt(330,195,"Бізден әрі",b,24)}
      ${txt(220,260,"Токтың кеңістіктегі бағыты",k,21)}
    `;

  }else if(type==="attract"||type==="repel"){
    const same=type==="attract";

    caption=same?
      "Бағыттас параллель токтар тартылады":
      "Қарама-қарсы параллель токтар тебіледі";

    content=`
      <rect x="120" y="25" width="18" height="205" rx="9" fill="#b3c6d4"/>
      <rect x="302" y="25" width="18" height="205" rx="9" fill="#b3c6d4"/>
      ${arrow(129,205,129,48,r)}
      ${same?arrow(311,205,311,48,b):arrow(311,48,311,205,b)}
      ${txt(90,38,"I₁",r,25)}
      ${txt(350,38,"I₂",b,25)}

      ${same?
        arrow(143,130,209,130,g)+arrow(297,130,231,130,g):
        arrow(115,130,50,130,r)+arrow(325,130,390,130,r)}
      ${txt(220,260,same?"ТАРТЫЛЫС":"ТЕБІЛІС",same?g:r,28)}
    `;

  }else if(type==="vectors"){
    caption="Перпендикуляр магнит индукция векторлары";

    content=`
      ${arrow(70,210,290,210,b)}
      ${arrow(290,210,290,45,r)}
      ${arrow(70,210,290,45,g)}
      <path d="M70 210 V45 H290" stroke="#8fa9bd"
        fill="none" stroke-dasharray="5 5"/>
      ${txt(180,240,"B₁",b,26)}
      ${txt(320,130,"B₂",r,26)}
      ${txt(160,115,"B қорытқы",g,23)}
    `;

  }else if(type==="constant"){
    caption="Магниттік тұрақты";

    content=`
      <rect x="20" y="25" width="400" height="230"
        rx="18" fill="#e1f2ff"/>
      ${txt(220,100,"μ₀",b,55)}
      ${txt(220,165,"4π × 10⁻⁷ Н/А²",g,32)}
      ${txt(220,215,"Вакуумның магниттік тұрақтысы",k,19)}
    `;

  }else{
    caption="Біртекті магнит өрісі";

    for(let y=45;y<=225;y+=45){
      content+=arrow(35,y,405,y,b);
    }

    content+=txt(220,265,"B = const",g,25);
  }

  return `<div class="visual">
    <svg viewBox="0 0 440 280"
      xmlns="http://www.w3.org/2000/svg"
      font-family="Segoe UI,Arial,sans-serif">
      ${content}
    </svg>
    <small>${caption}</small>
  </div>`;
}

/* =====================================
   3 ВИРТУАЛДЫ ЗЕРТХАНА
===================================== */

const labs=[
  {
    title:"Магнит өрісінің бағытын анықтау",
    aim:"Ток бағыты өзгергенде магнит өрісінің бағыты қалай өзгеретінін бақылау.",
    visual:"rule",
    question:"Ток бағыты кері өзгергенде магнит өрісінің бағыты қалай өзгереді?",
    answer:"Магнит өрісінің бағыты да кері өзгереді."
  },
  {
    title:"Параллель токтардың әрекеттесуі",
    aim:"Токтардың өзара бағытына байланысты тартылыс пен тебілісті ажырату.",
    visual:"attract",
    question:"Екі ток бір бағытта болса, олардың әрекеттесуі қандай?",
    answer:"Олар бір-біріне тартылады. Қарама-қарсы бағытта болса, тебіледі."
  },
  {
    title:"Магнит индукцияларының қосылуы",
    aim:"Екі магнит өрісінің қорытқы индукциясын векторлық модельмен зерттеу.",
    visual:"vectors",
    question:"Екі өріс өзара перпендикуляр болса, қорытқы модуль қалай табылады?",
    answer:"B = √(B₁² + B₂²) формуласы арқылы."
  }
];

function labPage(i){
  const l=labs[i];

  let controls="";

  if(i===0){
    controls=`
      <h3>Ток бағытын таңдаңдар</h3>
      <div class="actions">
        <button class="primary" onclick="updateDirection(false)">⊙ Бізге қарай</button>
        <button onclick="updateDirection(true)">⊗ Бізден әрі</button>
      </div>
    `;
  }else if(i===1){
    controls=`
      <h3>Токтардың өзара бағыты</h3>
      <div class="actions">
        <button class="primary" onclick="updateInteraction(true)">↑ ↑ Бағыттас</button>
        <button onclick="updateInteraction(false)">↑ ↓ Қарама-қарсы</button>
      </div>
    `;
  }else{
    controls=`
      <h3>B₁ = <span id="b1Val" class="blue">3</span> мТл</h3>
      <input id="b1" type="range" min="0" max="20"
        value="3" oninput="updateVectors()">

      <h3>B₂ = <span id="b2Val" class="red">4</span> мТл</h3>
      <input id="b2" type="range" min="0" max="20"
        value="4" oninput="updateVectors()">

      <h3>Өрістердің бағыты</h3>
      <select id="vectorMode" onchange="updateVectors()">
        <option value="90">Перпендикуляр</option>
        <option value="0">Бір бағытта</option>
        <option value="180">Қарама-қарсы</option>
      </select>
    `;
  }

  return slide(`
    <span class="eyebrow">ВИРТУАЛДЫ ЗЕРТХАНА · ${i+1} / 3</span>
    <h2>${l.title}</h2>

    <div class="definition"><p><b>Мақсаты:</b> ${l.aim}</p></div>

    <div class="grid2">
      <div class="card">
        ${controls}
        <div class="formula" id="labResult"></div>
      </div>

      <div class="card">
        <div id="labVisual">${diagram(l.visual)}</div>
      </div>
    </div>

    <div class="card notebook">
      <h3>Дәптерге қорытынды жазыңдар</h3>
      <p>${l.question}</p>
      <button onclick="$('labAnswer').classList.toggle('hidden')">
        Жауапты көрсету
      </button>
      <div id="labAnswer" class="answer hidden"><p>${l.answer}</p></div>
    </div>
  `);
}

function updateDirection(reverse){
  $("labVisual").innerHTML=diagram("rule",reverse);
  $("labResult").textContent=reverse?
    "Сағат тілімен ↻":"Сағат тіліне қарсы ↺";
}

function updateInteraction(same){
  $("labVisual").innerHTML=diagram(same?"attract":"repel");
  $("labResult").textContent=same?"Тартылыс":"Тебіліс";
}

function updateVectors(){
  const a=Number($("b1").value);
  const b=Number($("b2").value);
  const mode=Number($("vectorMode").value);

  $("b1Val").textContent=a;
  $("b2Val").textContent=b;

  const x=a+(mode===0?b:mode===180?-b:0);
  const y=mode===90?b:0;
  const result=Math.hypot(x,y);

  $("labResult").innerHTML=`
    ${mode===90?F.perpendicular:mode===0?F.sum:F.difference}
    <br>B = ${num(result)} мТл
  `;

  const s=4.5,ox=220,oy=210;

  $("labVisual").innerHTML=`
    <div class="visual">
      <svg viewBox="0 0 440 280">
        <defs>
          <marker id="ab" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#087dcc"/>
          </marker>
          <marker id="ar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#d63a50"/>
          </marker>
          <marker id="ag" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#16874e"/>
          </marker>
        </defs>
        <path d="M20 210 H420 M220 30 V240"
          stroke="#b7cddd" stroke-dasharray="5 5"/>
        <line x1="${ox}" y1="${oy}" x2="${ox+a*s}" y2="${oy}"
          stroke="#087dcc" stroke-width="4" marker-end="url(#ab)"/>
        <line x1="${ox+a*s}" y1="${oy}" x2="${ox+x*s}" y2="${oy-y*s}"
          stroke="#d63a50" stroke-width="4" marker-end="url(#ar)"/>
        <line x1="${ox}" y1="${oy}" x2="${ox+x*s}" y2="${oy-y*s}"
          stroke="#16874e" stroke-width="3" stroke-dasharray="5 3"
          marker-end="url(#ag)"/>
        <circle cx="${ox}" cy="${oy}" r="4" fill="#19364f"/>
        <text x="220" y="265" font-size="21"
          text-anchor="middle" fill="#16874e">B = ${num(result)} мТл</text>
      </svg>
      <small>Көк — B₁ · Қызыл — B₂ · Жасыл — қорытқы</small>
    </div>
  `;
}

function updateLab(i){
  if(i===0) updateDirection(false);
  if(i===1) updateInteraction(true);
  if(i===2) updateVectors();
}

/* =====================================
   РАНДОМ ОҚУШЫЛАР
===================================== */

function shuffle(list){
  const a=[...list];

  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }

  return a;
}

const present=()=>students.filter(s=>s.present);
const levels=["Оңай","Орташа","Күрделі"];
const levelClasses=["easy","medium","hard"];
const levelOf=id=>Math.floor(id/8);

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

function reshuffle(){
  if(!present().length) return alert("Қатысушы жоқ.");

  if(!confirm("Есептерді қайта араластырамыз ба? Нәтижелер тазаланады.")) return;

  assignTasks();
  buildPages();
  renderTasks();
  closePanel("taskPanel");
  closePanel("randomPanel");
  goKey("task-intro");
}

function openAttendance(){
  attendanceDraft=students.map(s=>s.present);
  renderStudents();
  openPanel("attendance");
}

function renderStudents(){
  $("students").innerHTML=students.map((s,i)=>`
    <label class="student ${attendanceDraft[i]?"":"absent"}">
      <input type="checkbox" ${attendanceDraft[i]?"checked":""}
        onchange="attendanceDraft[${i}]=this.checked;
        this.parentElement.classList.toggle('absent',!this.checked)">
      ${esc(s.name)}
    </label>
  `).join("");

  $("attendanceCount").textContent=`${present().length} / 24`;
}

function markAll(v){
  attendanceDraft=names.map(()=>v);
  renderStudents();
}

function saveAttendance(){
  const changed=students.some((s,i)=>s.present!==attendanceDraft[i]);

  if(changed&&(completed.size||Object.keys(answers).length)&&
    !confirm("Қатысу өзгерсе, есептер мен ұпайлар қайта басталады.")) return;

  const key=pages[current]?.key;

  students.forEach((s,i)=>s.present=attendanceDraft[i]);

  if(changed){
    assignTasks();
    makeTeams(false);
    closePanel("randomPanel");
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
    if(!confirm("Барлық оқушы таңдалды. Қайта бастаймыз ба?")) return;
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

const teamNames=["Магнит","Индукция","Тесла"];
const teamIcons=["🧲","⚡","⚛"];

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
    !confirm("Командалар қайта бөлініп, ұпайлар тазаланады.")) return;

  teams=[[],[],[]];

  if(people.length>=3)
    people.forEach((s,i)=>teams[i%3].push(s.id));

  resetGame();
  renderTeams();

  if(show){
    renderPage(false);
    openPanel("teamPanel");
  }
}

function teamMembers(i){
  return teams[i].map(id=>students[id]).filter(s=>s.present);
}

function renderTeams(){
  $("teams").innerHTML=teamNames.map((n,i)=>`
    <div class="teamCard">
      <b class="blue">${teamIcons[i]} ${i+1}-топ — ${n}</b>
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
    <span class="eyebrow">ФИЗИКА · 1-КУРС · 3.4.2</span>

    <div class="card hero">
      <h1>
        <span class="blue">Магнит өрісі.</span>
        Токтардың өзара әрекеттесуі.
        <span class="green">Магнит индукция векторы.</span>
        Бұрғы ережесі
      </h1>

      <div class="definition">
        <h3 class="green">Сабақтың мақсаты</h3>
        <p>Магнит өрісінің қасиеттерін түсіну, магнит индукция
        векторының бағытын анықтау, токтардың өзара әрекеттесуін
        сипаттау және бұрғы ережесін есептерде қолдану.</p>
      </div>

      <div class="grid2">
        ${diagram("magnet")}
        ${diagram("rule")}
      </div>

      <div class="grid3">
        <div class="card">
          <h3 class="blue">15 түсіндірме</h3>
          <p>Теория және сызбалар</p>
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
    ["Жаңа тақырыпты түсіндіру",20],
    ["Конспект жазу",12],
    ["Виртуалды зертхана",10],
    ["24 жеке есепті қатар орындау",20],
    ["Командалық ойын",12],
    ["Қорытынды және үй тапсырмасы",3]
  ];

  return slide(`
    <span class="eyebrow">САБАҚ ЖОСПАРЫ</span>
    <h2>80 минуттық сабақ</h2>

    <div class="card">
      ${plan.map(([n,t])=>`
        <div class="planRow">
          <b>${n}</b>
          <span class="blue">${t} минут</span>
        </div>
      `).join("")}

      <div class="formula">Барлығы: 80 минут</div>
      <button onclick="openAttendance()">Қатысуды белгілеу</button>
    </div>
  `);
}

function theoryPage(t,i){
  return slide(`
    <span class="eyebrow">ТҮСІНДІРМЕ · ${i+1} / ${theory.length}</span>
    <h2>${t[0]}</h2>

    <div class="card">
      <div class="definition"><p class="green">${t[1]}</p></div>

      <div class="grid2">
        ${diagram(t[5])}
        <p>${t[2]}</p>
      </div>

      <div class="formula">${t[3]}</div>

      <div class="example">
        <h3 class="gold">Мысал</h3>
        <p>${t[4]}</p>
      </div>

      <button onclick="openBoard()">✎ Тақтада түсіндіру</button>
    </div>
  `);
}

function notePage(n,i){
  return slide(`
    <span class="eyebrow">КОНСПЕКТ · ${i+1} / ${notes.length}</span>
    <h2>${n[0]}</h2>

    <div class="card notebook">
      <h3 class="blue">Дәптерге жазып алыңдар</h3>
      <p>${n[1]}</p>
      <div class="formula">${n[2]}</div>
      <p>${n[3]}</p>
    </div>

    <button onclick="openBoard()">✎ Интерактивті тақта</button>
  `);
}

function taskIntro(){
  return slide(`
    <span class="eyebrow">ЖЕКЕ ТАПСЫРМАЛАР</span>

    <div class="card hero">
      <h1>🎲 Магнит өрісіне арналған есептер</h1>

      <p>Әр қатысушыға бір есеп кездейсоқ тағайындалды.
      Әр оқушының есімі бір реттен шығады.</p>

      <div class="grid3">
        ${levels.map((n,i)=>`
          <div class="card">
            <span class="level ${levelClasses[i]}">${n}</span>
            <div class="score">
              ${assignments.filter(a=>levelOf(a.taskId)===i).length}
            </div>
            <p>Есеп</p>
          </div>
        `).join("")}
      </div>

      <div class="formula">
        ${assignments.length} оқушы · ${assignments.length} есеп
      </div>

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
  const s=students[a.studentId],p=tasks[a.taskId];
  const level=levelOf(a.taskId);
  const done=completed.has(a.taskId);

  return slide(`
    <span class="eyebrow">
      ЖЕКЕ ЕСЕП · ${assignments.indexOf(a)+1} / ${assignments.length}
    </span>

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
        <p>${esc(s.name)}, есепті дәптерге шығарып, шешу жолын түсіндір.</p>
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

      <div id="solution" class="answer hidden">
        <h3 class="green">Есептің шешуі</h3>
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
    <h1>🏆 Магниттік интеллектуалды жарыс</h1>

    <div class="grid3">
      ${teamNames.map((n,i)=>`
        <div class="card">
          <h2>${teamIcons[i]}</h2>
          <h3 class="blue">${i+1}-топ — ${n}</h3>
          <p>${teamMembers(i).map(s=>esc(s.name)).join(", ")||"Қатысушы жоқ"}</p>
        </div>
      `).join("")}
    </div>

    <div class="card">
      <h3 class="green">Ойын ережесі</h3>
      <p>15 сұрақ. Әр топқа 5 сұрақ беріледі.</p>
      <p>Әр дұрыс жауап — 10 ұпай.</p>
      <p>Жауап беретін оқушы рандом таңдалады.</p>
      <p>Жауаптан кейін 4 секундтан соң келесі командаға ауысады.</p>

      <button onclick="makeTeams(true)">🎲 Топтарды қайта бөлу</button>
      <button class="primary" onclick="startQuiz()">Ойынды бастау →</button>
    </div>
  `);
}

function startQuiz(){
  if(present().length<3) return alert("Кемінде 3 қатысушы қажет.");

  if(teams.some(t=>!t.length)) makeTeams(false);

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
          ${teamIcons[j]} ${n} — ${scores[j]} ұпай
        </span>
      `).join("")}
    </div>

    <div class="card">
      <div class="player">
        ${k+1}-топ — ${teamNames[k]}<br>
        Рандом қатысушы: <strong>${esc(pickSpeaker(i))}</strong>
      </div>

      <p class="question">${esc(q[0])}</p>

      <div class="choices">
        ${q[1].map((a,j)=>`
          <button class="choice ${done?
            j===q[2]?"correct":j===answers[i]?"wrong":"":""}"
            ${done?"disabled":""} onclick="submitAnswer(${i},${j})">
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
        <button class="primary" onclick="go(1)">Келесі →</button>
      `:""}
    </div>
  `);
}

function submitAnswer(i,j){
  if(pages[current].key!=="quiz-"+i||Object.hasOwn(answers,i)) return;

  if(teams.some(t=>!t.length)) return alert("Алдымен 3 топқа бөлініңдер.");

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
   ҚОРЫТЫНДЫ
===================================== */

function resultsPage(){
  const total=Object.keys(answers).length;
  const winners=teamNames.filter((_,i)=>scores[i]===Math.max(...scores));

  return slide(`
    <span class="eyebrow">САБАҚ ҚОРЫТЫНДЫСЫ</span>
    <h1>Сабақ нәтижелері</h1>

    <div class="card">
      <h3 class="blue">Жеке есептер</h3>
      <div class="formula">${completed.size} / ${assignments.length}</div>
      <p>Орындалды деп белгіленген есептер.</p>
      <button onclick="openPanel('taskPanel')">Есептер тізімі</button>
    </div>

    <div class="grid3">
      ${teamNames.map((n,i)=>`
        <div class="card">
          <h2>${teamIcons[i]}</h2>
          <h3>${n}</h3>
          <div class="score">${scores[i]} ұпай</div>
        </div>
      `).join("")}
    </div>

    <div class="definition">
      <h2 class="green">
        ${total<15?"Ойын толық аяқталған жоқ":
          winners.length===1?"🏆 Жеңімпаз — "+winners[0]:
          "Тең нәтиже — "+winners.join(", ")}
      </h2>

      <p>Жауап берілген сұрақтар: ${total} / 15</p>
    </div>

    <div class="card">
      <h3>Бүгін не үйрендік?</h3>
      <p>✓ Магнит өрісінің қасиеттері.</p>
      <p>✓ Магнит индукция векторы.</p>
      <p>✓ Бұрғы және оң қол ережелері.</p>
      <p>✓ Параллель токтардың өзара әрекеттесуі.</p>
      <p>✓ Магнит өрістерінің суперпозициясы.</p>
    </div>

    <button onclick="startQuiz()">↻ Қайта ойнау</button>
  `);
}

/* =====================================
   ЖАҢА ҮЙ ТАПСЫРМАСЫ
===================================== */

function homeworkPage(){
  return slide(`
    <span class="eyebrow">ҮЙ ТАПСЫРМАСЫ · 3.4.2</span>
    <h2>Есеп және сызбалық тапсырма</h2>

    <div class="card">
      <span class="level medium">1-ТАПСЫРМА · ЕСЕП</span>

      <h3 class="blue">Қорытқы магнит индукциясы</h3>

      <p class="problem">
        Кеңістіктің бір нүктесінде екі өзара перпендикуляр
        магнит өрісі бар. Бірінші өрістің магнит индукциясы
        12 мТл, ал екінші өрістің индукциясы 16 мТл.
      </p>

      <div class="data">
        <b class="blue">Анықтаңдар:</b>
        <p>а) Екі магнит индукциясын тесламен өрнектеңдер.</p>
        <p>ә) Қорытқы магнит индукциясының модулін есептеңдер.</p>
        <p>б) Векторларды дәптерге масштабпен сызыңдар.</p>
      </div>
    </div>

    <div class="card">
      <span class="level hard">2-ТАПСЫРМА · СЫЗБА</span>

      <h3 class="green">Бұрғы ережесі және токтардың әрекеттесуі</h3>

      <div class="formula">⊙ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⊗</div>

      <p class="problem">
        Дәптерге көрсетілген екі шартты белгіні сызыңдар.
        Әр белгі үшін магнит өрісінің бағытын көрсетіңдер.
      </p>

      <div class="data">
        <p>а) Магнит өрісінің шеңбер тәрізді сызықтарын салыңдар.</p>
        <p>ә) Әр сызықтың бағытын бағдаршамен белгілеңдер.</p>
        <p>б) Осы екі параллель токтың тартылатынын немесе тебілетінін түсіндіріңдер.</p>
        <p>в) Бұрғы ережесін өз сөздеріңмен 3–4 сөйлемде жазыңдар.</p>
      </div>
    </div>

    <div class="example">
      <p>Есептің шешуі мен сызбалар дәптерде анық әрі ұқыпты жазылсын.</p>
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
   СОЛ ЖАҚ МӘЗІР
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

  section("📖 Түсіндірме",theory.map((t,i)=>({
    key:"theory-"+i,render:()=>theoryPage(t,i)
  })));

  section("📘 Конспект",notes.map((n,i)=>({
    key:"note-"+i,render:()=>notePage(n,i)
  })));

  section("🧲 Виртуалды зертхана",labs.map((l,i)=>({
    key:"lab-"+i,lab:i,render:()=>labPage(i)
  })));

  section("🎲 Рандом есептер",[{key:"task-intro",render:taskIntro}]);

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
      ${esc(s.name)}
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
   ҚАЗАҚША ДЫБЫСТАУ
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

    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;

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
    if(p.hasPointerCapture(e.pointerId)) p.releasePointerCapture(e.pointerId);
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

let expression="",degree=true;

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
    <button class="${k==="="?"primary":""}" onclick="mathPress('${k}')">
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

/* eval ҚОЛДАНБАЙ ЕСЕПТЕУ */

function evaluateMath(source){
  const s=source.replace(/\s+/g,"");

  if(!s||s.length>500) throw Error("Қате");

  const t=s.match(
    /(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z]+|[+\-*/^()]/gi
  )||[];

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
  B:["Магнит индукциясы","Тл"],
  B1:["Бірінші индукция","Тл"],
  B2:["Екінші индукция","Тл"],
  I:["Ток күші","А"],
  I1:["Бірінші ток","А"],
  I2:["Екінші ток","А"],
  r:["Арақашықтық","м"],
  l:["Ұзындық","м"],
  force:["Магниттік күш","Н"],
  fl:["Бірлік ұзындыққа күш","Н/м"],
  mT:["Милли-тесла","мТл"],
  uT:["Микротесла","мкТл"],
  angle:["Векторлар арасындағы бұрыш","°"],
  U:["Кернеу","В"],
  R:["Кедергі","Ом"],
  q:["Электр заряды","Кл"],
  t:["Уақыт","с"],
  P:["Қуат","Вт"],
  A:["Жұмыс","Дж"]
};

const physics=[
  {
    name:"Түзу токтың магнит индукциясы",
    vars:["B","I","r"],
    solve:{
      B:v=>MU0*v.I/(2*Math.PI*v.r)
    }
  },
  {
    name:"Параллель токтардың күші",
    vars:["force","I1","I2","l","r"],
    solve:{
      force:v=>MU0*v.I1*v.I2*v.l/(2*Math.PI*v.r)
    }
  },
  {
    name:"Бірлік ұзындыққа келетін күш",
    vars:["fl","force","l"],
    solve:{
      fl:v=>v.force/v.l,
      force:v=>v.fl*v.l,
      l:v=>v.force/v.fl
    }
  },
  {
    name:"Бағыттас магнит өрістері",
    vars:["B","B1","B2"],
    solve:{
      B:v=>v.B1+v.B2,
      B1:v=>v.B-v.B2,
      B2:v=>v.B-v.B1
    }
  },
  {
    name:"Қарама-қарсы магнит өрістері",
    vars:["B","B1","B2"],
    solve:{
      B:v=>Math.abs(v.B1-v.B2)
    }
  },
  {
    name:"Перпендикуляр магнит өрістері",
    vars:["B","B1","B2"],
    solve:{
      B:v=>Math.hypot(v.B1,v.B2),
      B1:v=>Math.sqrt(v.B**2-v.B2**2),
      B2:v=>Math.sqrt(v.B**2-v.B1**2)
    }
  },
  {
    name:"Векторлардың жалпы қосындысы",
    vars:["B","B1","B2","angle"],
    solve:{
      B:v=>Math.hypot(
        v.B1+v.B2*Math.cos(v.angle*Math.PI/180),
        v.B2*Math.sin(v.angle*Math.PI/180)
      )
    }
  },
  {
    name:"Тесла ↔ Милли-тесла",
    vars:["B","mT"],
    solve:{
      B:v=>v.mT*1e-3,
      mT:v=>v.B*1000
    }
  },
  {
    name:"Тесла ↔ Микротесла",
    vars:["B","uT"],
    solve:{
      B:v=>v.uT*1e-6,
      uT:v=>v.B*1e6
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
    name:"Электр қуаты",
    vars:["P","U","I"],
    solve:{
      P:v=>v.U*v.I,
      U:v=>v.P/v.I,
      I:v=>v.P/v.U
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
  }
];

function initPhysics(){
  $("physicsFormula").innerHTML=physics.map((f,i)=>`
    <option value="${i}">${esc(f.name)}</option>
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
    <input id="phys_${k}" type="text" placeholder="Мәні">
  `).join("");

  $("physicsResult").textContent="Нәтиже";
  clampPanel($("physicsPanel"));
}

function calculatePhysics(){
  try{
    const f=physics[Number($("physicsFormula").value)];
    const unknown=$("physicsUnknown").value;
    const values={};

    f.vars.filter(k=>k!==unknown).forEach(k=>{
      const raw=$("phys_"+k).value.trim().replaceAll(",",".");

      if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(raw))
        throw Error("Сандарды дұрыс енгізіңіз");

      const n=Number(raw);

      if(!Number.isFinite(n)||n<0)
        throw Error("Мәнді тексеріңіз");

      if(k==="angle"&&n>180)
        throw Error("Бұрыш 0–180° аралығында болуы керек");

      if(k==="r"&&n===0)
        throw Error("Қашықтық нөл болмауы керек");

      values[k]=n;
    });

    const answer=f.solve[unknown](values);

    if(!Number.isFinite(answer)||answer<0)
      throw Error("Берілгендерді тексеріңіз");

    const symbols={
      B1:"B₁",B2:"B₂",
      I1:"I₁",I2:"I₂",
      force:"F",fl:"F/l",
      mT:"B",uT:"B",angle:"α"
    };

    $("physicsResult").textContent=
      `${symbols[unknown]||unknown} = ${num(answer)} ${units[unknown][1]}`;

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
let draft=null,pointer=null,pan=null;

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

/* ҚАЛАМНЫҢ ДӘЛ КООРДИНАТАЛАРЫ */

function point(e){
  const r=canvas.getBoundingClientRect();

  return {
    x:(e.clientX-r.left)*BW/r.width,
    y:(e.clientY-r.top)*BH/r.height
  };
}

/* СУРЕТ САЛУ */

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

    if(a.type==="rect"){
      ctx.rect(p.x,p.y,dx,dy);
    }

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
        type:"text",
        text:text.trim(),
        color:ink,
        size:Math.max(25,size*4),
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

canvas.addEventListener("pointercancel",e=>
  finishDrawing(e,true));

canvas.addEventListener("lostpointercapture",e=>
  finishDrawing(e,true));

/* =====================================
   ТАҚТАНЫҢ БЕТТЕРІ
===================================== */

function newBoardPage(){
  cancelDrawing();

  boardPages.push({
    actions:[],
    redo:[],
    grid:false
  });

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
   ТАҚТАҒА СУРЕТ ҚОСУ
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
   PNG РЕТІНДЕ САҚТАУ
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
    a.download=`physics-342-board-${page}.png`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(()=>URL.revokeObjectURL(url),1000);
  },"image/png");
}

/* =====================================
   АЛМАТЫ УАҚЫТЫ — UTC+5
===================================== */

const clockFormat=new Intl.DateTimeFormat("kk-KZ",{
  timeZone:"UTC",
  hour:"2-digit",
  minute:"2-digit",
  second:"2-digit",
  hourCycle:"h23"
});

const dateFormat=new Intl.DateTimeFormat("kk-KZ",{
  timeZone:"UTC",
  day:"numeric",
  month:"long",
  year:"numeric"
});

function updateClock(){
  const date=new Date(Date.now()+5*60*60*1000);

  $("clock").textContent=clockFormat.format(date);
  $("date").textContent=dateFormat.format(date);
}

/* =====================================
   80 МИНУТТЫҚ ТАЙМЕР
===================================== */

const duration=80*60;

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

  document.querySelectorAll(".floating")
    .forEach(clampPanel);
}

window.addEventListener("resize",onResize);
document.addEventListener("fullscreenchange",onResize);

/* =====================================
   САЙТТЫ ІСКЕ ҚОСУ
===================================== */

attendanceDraft=students.map(s=>s.present);

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

console.log("PHYSICS LAB PRO — 3.4.2");
console.log("Түсіндірме:",theory.length);
console.log("Конспект:",notes.length);
console.log("Жеке есептер:",tasks.length);
console.log("Командалық сұрақтар:",quiz.length);
console.log("Барлық беттер:",pages.length);

/* BY DARKHAN */
