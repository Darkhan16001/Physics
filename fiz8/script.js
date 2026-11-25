
"use strict";

const $=id=>document.getElementById(id);

const esc=s=>String(s).replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",
  '"':"&quot;","'":"&#39;"
}[c]));

const frac=(a,b)=>
  `<span class="frac"><span>${a}</span><span>${b}</span></span>`;

const num=n=>Number.isFinite(n)
  ?String(Number(n.toPrecision(9))).replace(".",",")
  :"Анықталмаған";

const sin=a=>Math.abs(Math.sin(a*Math.PI/180))<1e-12
  ?0:Math.sin(a*Math.PI/180);

/* 24 ОҚУШЫ */

const names=[
  "Рамазан","Тұрғанжан","Нұрай","Әлқуат",
  "Шырай","Гүлсезім","Маржан","Мариям",
  "Жансая","Азиза","Ақсезім","Нұрболсын",
  "Ақнұр","Іңкәр","Асхат","Аяжан",
  "Мирас","Санжар","Ерасыл","Нұрасыл",
  "Расул","Айнұр","Дархан","Айкерім"
];

const students=names.map((name,id)=>({name,id,present:true}));

let attendanceDraft=names.map(()=>true);
let assignments=[];
const completed=new Set();
const drawn=new Set();
let randomId=null;

/* НЕГІЗГІ ФОРМУЛАЛАР */

const F={
  ampere:"F<sub>A</sub> = BIl sin α",
  maximum:"F<sub>A max</sub> = BIl",
  induction:`B = ${frac("F<sub>A</sub>","Il sin α")}`,
  lorentz:"F<sub>Л</sub> = |q|vB sin α",
  radius:`r = ${frac("mv","|q|B")}`,
  period:`T = ${frac("2πm","|q|B")}`,
  frequency:`ν = ${frac("|q|B","2πm")}`,
  energy:`E<sub>k</sub> = ${frac("mv²","2")}`,
  electron:"e ≈ 1,6 × 10<sup>−19</sup> Кл",
  work:"A = 0 (магниттік Лоренц күші)"
};

/* =====================================
   15 ТҮСІНДІРМЕ
===================================== */

const theory=[
  [
    "Ампер күші",
    "Ампер күші — магнит өрісіндегі тогы бар өткізгішке әсер ететін күш.",
    "Өткізгіштің бойымен электр тогы жүргенде зарядтар бағытталған қозғалыс жасайды. Сыртқы магнит өрісі осы зарядтарға әсер етеді. Нәтижесінде өткізгішке тұтас магниттік күш әсер етеді. Оның шамасы магнит индукциясына, ток күшіне, өткізгіш ұзындығына және бұрышқа байланысты.",
    F.ampere,
    "Ампер күші электрқозғалтқыштардың жұмыс принципін түсіндіруге көмектеседі.",
    "ampere"
  ],
  [
    "Ампер күшінің формуласы",
    "Ампер күшінің модулі магнит индукциясы, ток күші, ұзындық және бұрыш синусының көбейтіндісіне тең.",
    "B — магнит индукциясы, I — ток күші, l — біртекті магнит өрісіндегі түзу өткізгіштің ұзындығы. α — ток бағыты мен магнит индукция векторы арасындағы бұрыш.",
    F.ampere,
    "B = 0,2 Тл, I = 2 А, l = 0,5 м және α = 90° болса, күш 0,2 Н-ға тең.",
    "angle"
  ],
  [
    "Ампер күшінің өлшем бірлігі",
    "Ампер күшінің халықаралық өлшем бірлігі — ньютон.",
    "Магнит индукциясы тесламен, ток күші ампермен, ұзындық метрмен өлшенеді. Формулаға барлық шамалар сәйкес өлшем бірліктерімен қойылады.",
    "1 Н = 1 Тл · 1 А · 1 м",
    "20 см ұзындық формулаға 0,2 м түрінде енгізіледі.",
    "units"
  ],
  [
    "Бұрыштың күшке әсері",
    "Ампер күшінің модулі ток пен магнит индукциясы арасындағы бұрышқа тәуелді.",
    "Өткізгіш магнит өрісіне параллель болса, sin α нөлге тең. Өткізгіш өріске перпендикуляр болса, sin 90° = 1. Сондықтан перпендикуляр жағдайда күштің модулі ең үлкен болады.",
    "sin 0° = 0<br>sin 30° = 0,5<br>sin 90° = 1",
    "30° бұрыштағы күш 90° бұрыштағы күштің жартысына тең.",
    "angle"
  ],
  [
    "Ампер күшінің ең үлкен мәні",
    "Ток бағыты магнит индукциясына перпендикуляр болғанда Ампер күші максимал болады.",
    "Бұл жағдайда бұрыштың синусы бірге тең. Сондықтан жалпы формула ықшамдалады. Ал ток пен өріс бағыттас немесе қарама-қарсы бағыттас болса, магниттік күш нөлге тең.",
    F.maximum,
    "α = 0° немесе 180° болса, F = 0.",
    "ampere"
  ],
  [
    "Сол қол ережесі",
    "Сол қол ережесі Ампер күшінің бағытын анықтауға мүмкіндік береді.",
    "Сол қолды магнит индукциясының сызықтары алақанға кіретіндей, төрт саусақ шартты ток бағытымен бағытталатындай орналастырамыз. Сонда 90°-қа керілген бас бармақ Ампер күшінің бағытын көрсетеді.",
    "Алақан — B⃗<br>Төрт саусақ — I<br>Бас бармақ — F⃗",
    "Күштің бағыты ток пен магнит индукциясының бағыттарына перпендикуляр.",
    "direction"
  ],
  [
    "Күш бағытының өзгеруі",
    "Ток бағыты немесе магнит өрісінің бағыты өзгергенде Ампер күшінің бағыты да өзгереді.",
    "Егер тек ток бағыты кері өзгерсе, магниттік күш қарама-қарсы бағытталады. Тек магнит өрісі өзгергенде де осындай нәтиже болады. Ал екеуінің бағыты бірдей уақытта кері өзгерсе, күштің бастапқы бағыты сақталады.",
    "I бағыты өзгереді → F⃗ бағыты өзгереді",
    "Күш бағытын анықтағанда барлық векторлардың бағытын ескеру қажет.",
    "direction"
  ],
  [
    "Лоренц күші",
    "Магниттік Лоренц күші — магнит өрісінде қозғалған зарядталған бөлшекке әсер ететін күш.",
    "Тыныш тұрған зарядқа магнит өрісінің осы күші әсер етпейді. Қозғалып келе жатқан зарядталған бөлшек магнит өрісінде болғанда оның қозғалыс бағыты өзгеруі мүмкін. Күштің шамасы бөлшектің зарядына, жылдамдығына және магнит индукциясына тәуелді.",
    F.lorentz,
    "Лоренц күші электрондар мен иондардың магнит өрісіндегі қозғалысын түсіндіреді.",
    "lorentz"
  ],
  [
    "Лоренц күшінің бағыты",
    "Оң зарядқа әсер ететін магниттік Лоренц күшінің бағыты сол қол ережесімен анықталады.",
    "Төрт саусақ оң зарядтың жылдамдық бағытымен бағытталады, ал магнит индукциясы алақанға кіреді. Бас бармақ күштің бағытын көрсетеді. Теріс заряд үшін күш осы бағытқа қарама-қарсы болады.",
    "Оң заряд: +q<br>Теріс заряд: −q — күш бағыты кері",
    "Электронның заряды теріс болғандықтан күш бағыты оң зарядпен салыстырғанда кері.",
    "charges"
  ],
  [
    "Магнит өрісінің жұмысы",
    "Магниттік Лоренц күші жеке зарядтың жылдамдығына перпендикуляр бағытталады.",
    "Күш жылдамдық бағытына перпендикуляр болғандықтан, магниттік күштің жұмысы нөлге тең. Тек магниттік күш әсер ететін жағдайда бөлшектің жылдамдық модулі мен кинетикалық энергиясы өзгермейді, бірақ қозғалыс бағыты өзгереді.",
    `${F.work}<br>${F.energy} = const`,
    "Бұл жағдайда магнит өрісі бөлшекті жылдамдатпайды, оның траекториясын өзгертеді.",
    "circle"
  ],
  [
    "Шеңбер бойымен қозғалыс",
    "Жылдамдығы біртекті магнит өрісіне перпендикуляр зарядталған бөлшек шеңбер бойымен қозғала алады.",
    "Магниттік күш шеңбердің центріне бағытталған центрге тартқыш күш рөлін атқарады. Бөлшектің жылдамдық модулі тұрақты болып, бағыты үздіксіз өзгереді. Бұл классикалық механикадағы идеал модель ретінде қарастырылады.",
    `${frac("mv²","r")} = |q|vB`,
    "Шеңберлік қозғалыста жылдамдық траекторияға жанама бағытталады.",
    "circle"
  ],
  [
    "Траектория радиусы",
    "Бейрелятивистік модельде перпендикуляр қозғалыстың радиусы бөлшектің массасына, жылдамдығына, зарядына және магнит индукциясына тәуелді.",
    "Бөлшектің массасы немесе жылдамдығы артқанда басқа шамалар тұрақты болса, радиус артады. Заряд модулі мен магнит индукциясы артқанда радиус азаяды.",
    F.radius,
    "Басқа шамалар бірдей болса, радиус жылдамдыққа тура пропорционал.",
    "radius"
  ],
  [
    "Айналу периоды",
    "Айналу периоды — бөлшектің бір толық айналым жасауына кететін уақыт.",
    "Бейрелятивистік шеңберлік қозғалыста айналу периоды бөлшектің массасына тура, заряд модулі мен магнит индукциясына кері пропорционал. Бұл идеал модельде период жылдамдыққа тәуелсіз.",
    `${F.period}<br>${F.frequency}`,
    "Период секундпен, айналу жиілігі герцпен өлшенеді.",
    "period"
  ],
  [
    "Бұрандалы траектория",
    "Жылдамдықтың магнит өрісіне параллель және перпендикуляр құраушылары бар болса, бөлшек бұрандалы траекториямен қозғалады.",
    "Перпендикуляр құраушы шеңберлік қозғалысты, ал параллель құраушы өріс бойымен орын ауыстыруды сипаттайды. Екі қозғалыстың қосылуы кеңістікте бұранда тәрізді траектория береді.",
    "v = v∥ + v⊥ (векторлық қосынды)",
    "Тек параллель құраушы болса, магниттік күш нөл болады.",
    "helix"
  ],
  [
    "Ампер және Лоренц күштерін салыстыру",
    "Ампер күші тогы бар өткізгішке, ал магниттік Лоренц күші жеке қозғалыстағы зарядқа әсер етеді.",
    "Екі күш те магнит өрісінің әсерін сипаттайды. Ампер күші өткізгіштегі қозғалыстағы зарядтарға әсер ететін магниттік күштермен байланысты. Олардың бағытын анықтау кезінде сол қол ережесі қолданылады.",
    `${F.ampere}<br>${F.lorentz}`,
    "Ампер формуласында I және l, Лоренц формуласында q және v шамалары қолданылады.",
    "compare"
  ]
];

/* =====================================
   10 БЕТТІК КОНСПЕКТ
===================================== */

const notes=[
  ["Ампер күші",
   "Магнит өрісіндегі тогы бар өткізгішке әсер ететін күш Ампер күші деп аталады.",
   F.ampere,"B — Тл; I — А; l — м; F — Н."],

  ["Ампер күшінің бұрышқа тәуелділігі",
   "Күш ток бағыты мен магнит индукциясы арасындағы бұрышқа тәуелді.",
   "α = 0° → F = 0<br>α = 90° → F = BIl",
   "sin 30° = 0,5; sin 90° = 1."],

  ["Сол қол ережесі",
   "Магнит индукциясы алақанға кіріп, төрт саусақ ток бағытын көрсеткенде бас бармақ күш бағытын көрсетеді.",
   "B⃗ — алақан; I — саусақтар; F⃗ — бас бармақ.",
   "Бас бармақ төрт саусаққа перпендикуляр орналасады."],

  ["Лоренц күші",
   "Магнит өрісінде қозғалған зарядталған бөлшекке әсер ететін магниттік күш.",
   F.lorentz,"q — Кл; v — м/с; B — Тл."],

  ["Лоренц күшінің бағыты",
   "Оң заряд үшін сол қол ережесі қолданылады. Теріс заряд үшін күштің бағыты кері болады.",
   "q > 0: сол қол ережесі<br>q &lt; 0: қарама-қарсы бағыт",
   "Күш жылдамдық пен магнит индукциясына перпендикуляр."],

  ["Магниттік күштің жұмысы",
   "Магниттік Лоренц күші зарядтың кинетикалық энергиясын өзгертпейді.",
   `${F.work}<br>${F.energy} = const`,
   "Қозғалыс бағыты өзгеруі мүмкін."],

  ["Шеңберлік қозғалыс",
   "Жылдамдық магнит өрісіне перпендикуляр болса, біртекті өрістегі идеал траектория шеңбер болады.",
   `${frac("mv²","r")} = |q|vB`,
   "Магниттік күш центрге тартқыш күш рөлін атқарады."],

  ["Траектория радиусы",
   "Перпендикуляр қозғалыстың радиусы бейрелятивистік жуықтауда мына формуламен табылады.",
   F.radius,"r — м; m — кг."],

  ["Айналу периоды мен жиілігі",
   "Период — бір толық айналымның уақыты, жиілік — уақыт бірлігіндегі айналым саны.",
   `${F.period}<br>${F.frequency}`,
   "T — с; ν — Гц."],

  ["Ампер және Лоренц күштері",
   "Ампер күші өткізгішке, Лоренц күші жеке зарядқа әсер етеді.",
   `${F.ampere}<br>${F.lorentz}`,
   "Екі күштің де өлшем бірлігі — ньютон."]
];

/* =====================================
   24 ЖЕКЕ ЕСЕП
===================================== */

const tasks=[
  /* 1-ДЕҢГЕЙ — 8 ОҢАЙ ЕСЕП */

  ["Ампер күші",
   "Магнит индукциясы 0,2 Тл, ток күші 3 А, өткізгіш ұзындығы 0,5 м. Бұрыш 90°. Ампер күшін тап.",
   "B = 0,2 Тл; I = 3 А; l = 0,5 м; α = 90°","F — ?",
   "F = BIl = 0,2 × 3 × 0,5 = 0,3 Н"],

  ["Перпендикуляр өткізгіш",
   "Біртекті магнит өрісінің индукциясы 0,4 Тл. Ток күші 2 А, ұзындық 0,5 м. Өткізгіш өріске перпендикуляр. Күшті тап.",
   "B = 0,4 Тл; I = 2 А; l = 0,5 м","F — ?",
   "F = 0,4 × 2 × 0,5 = 0,4 Н"],

  ["Ұзындықты түрлендіру",
   "Өткізгіштің ұзындығы 40 см. Оны метрмен өрнекте.",
   "l = 40 см","l (м) — ?",
   `l = ${frac("40","100")} = 0,4 м`],

  ["Параллель бағыт",
   "Өткізгіш магнит өрісіне параллель орналасқан. B = 0,5 Тл, I = 2 А, l = 1 м. Ампер күшін анықта.",
   "α = 0°","F — ?",
   "F = BIl sin 0° = 0 Н"],

  ["Бұрыш синусы",
   "Ампер күшінің максимал мәні 8 Н. Бұрыш 30° болғанда күш қанша?",
   "Fmax = 8 Н; α = 30°","F — ?",
   "F = 8 × sin 30° = 8 × 0,5 = 4 Н"],

  ["Магнит индукциясы",
   "Магнит индукциясы 15 мТл. Оны тесламен өрнекте.",
   "B = 15 мТл","B (Тл) — ?",
   "B = 15 × 10⁻³ = 0,015 Тл"],

  ["Күштің өзгеруі",
   "Магнит индукциясы екі есе артқанда Ампер күші қалай өзгереді? Бастапқы күш 0,6 Н.",
   "F₁ = 0,6 Н; B₂ = 2B₁; қалған шамалар тұрақты","F₂ — ?",
   "F₂ = 2 × 0,6 = 1,2 Н"],

  ["Магниттік күштің жұмысы",
   "Зарядталған бөлшекке тек магниттік Лоренц күші әсер етеді. Бастапқы кинетикалық энергиясы 6 эВ. Соңғы энергиясын тап.",
   "E₁ = 6 эВ; A = 0","E₂ — ?",
   "E₂ = E₁ = 6 эВ"],

  /* 2-ДЕҢГЕЙ — 8 ОРТАША ЕСЕП */

  ["Белгісіз ток күші",
   "Ампер күші 0,6 Н, магнит индукциясы 0,3 Тл, ұзындық 0,5 м. Бұрыш 90°. Ток күшін есепте.",
   "F = 0,6 Н; B = 0,3 Тл; l = 0,5 м","I — ?",
   `I = ${frac("F","Bl")} = ${frac("0,6","0,3 × 0,5")} = 4 А`],

  ["Өткізгіш ұзындығы",
   "Ампер күші 0,4 Н, магнит индукциясы 0,5 Тл, ток күші 2 А. Бұрыш 90°. Ұзындықты анықта.",
   "F = 0,4 Н; B = 0,5 Тл; I = 2 А","l — ?",
   `l = ${frac("0,4","0,5 × 2")} = 0,4 м`],

  ["Магнит индукциясын есептеу",
   "Өткізгішке 0,9 Н күш әсер етеді. Ток күші 3 А, ұзындығы 1 м, бұрыш 90°. Магнит индукциясын тап.",
   "F = 0,9 Н; I = 3 А; l = 1 м","B — ?",
   `B = ${frac("0,9","3 × 1")} = 0,3 Тл`],

  ["30° бұрыштағы күш",
   "B = 0,4 Тл, I = 5 А, l = 0,5 м. Ток пен өріс арасындағы бұрыш 30°. Ампер күшін тап.",
   "B = 0,4 Тл; I = 5 А; l = 0,5 м; α = 30°","F — ?",
   "F = 0,4 × 5 × 0,5 × 0,5 = 0,5 Н"],

  ["Лоренц күшін салыстыру",
   "Екі бөлшектің заряд модульдері бірдей. Бірінші бөлшектің жылдамдығы екіншісінен төрт есе үлкен. Бірдей өріс пен бұрышта күштердің қатынасын тап.",
   "v₁ = 4v₂; B және q бірдей","F₁ : F₂ — ?",
   `${frac("F₁","F₂")} = 4`],

  ["Лоренц күшінің өзгеруі",
   "Шартты математикалық модельде магниттік күш 6 бірлікке тең. Магнит индукциясы үш есе азайды. Қалған шамалар тұрақты. Жаңа күшті тап.",
   "F₁ = 6 бірлік; B₂ = B₁/3","F₂ — ?",
   "F₂ = 6 ÷ 3 = 2 бірлік"],

  ["Траектория радиусы",
   "Шеңберлік қозғалыстың теориялық моделінде бастапқы радиус 12 см. Бөлшектің жылдамдығы екі есе артты, қалған шамалар тұрақты. Жаңа радиусты тап.",
   "r₁ = 12 см; v₂ = 2v₁","r₂ — ?",
   "r₂ = 2 × 12 = 24 см"],

  ["Айналу жиілігі",
   "Шартты периодтық қозғалыста бір айналымның уақыты 0,04 с. Айналу жиілігін есепте.",
   "T = 0,04 с","ν — ?",
   `ν = ${frac("1","T")} = ${frac("1","0,04")} = 25 Гц`],

  /* 3-ДЕҢГЕЙ — 8 КҮРДЕЛІ ЕСЕП */

  ["Өлшем бірліктері және Ампер күші",
   "Магнит индукциясы 200 мТл, ток күші 4 А, өткізгіш ұзындығы 25 см. Бұрыш 90°. Күшті есепте.",
   "B = 0,2 Тл; I = 4 А; l = 0,25 м","F — ?",
   "F = 0,2 × 4 × 0,25 = 0,2 Н"],

  ["Белгісіз бұрыш",
   "Ампер күшінің максимал мәні 4 Н, ал берілген жағдайда 2 Н. Бұрыш 0°–90° аралығында. Бұрышты анықта.",
   "Fmax = 4 Н; F = 2 Н","α — ?",
   `sin α = ${frac("2","4")} = 0,5<br>α = 30°`],

  ["Екі жағдайды салыстыру",
   "Бірінші жағдайда Ампер күші 0,8 Н. Екінші жағдайда ток күші екі есе артып, өткізгіш ұзындығы екі есе азайды. B және α тұрақты. Жаңа күшті анықта.",
   "F₁ = 0,8 Н; I₂ = 2I₁; l₂ = l₁/2","F₂ — ?",
   "F₂ = 0,8 × 2 × 0,5 = 0,8 Н"],

  ["Магниттік күштің пайыздық өзгерісі",
   "Ампер күші 0,5 Н-нан 0,75 Н-ға артты. Күштің пайыздық өсуін анықта.",
   "F₁ = 0,5 Н; F₂ = 0,75 Н","Өсу — ?",
   `${frac("0,75 − 0,5","0,5")} × 100% = 50%`],

  ["Лоренц күшінің қатынасы",
   "Теориялық модельде заряд модулі үш есе, жылдамдық екі есе артты. B және α өзгермеді. Күш неше есе өзгереді?",
   "q₂ = 3q₁; v₂ = 2v₁","F₂ : F₁ — ?",
   "F₂/F₁ = 3 × 2 = 6<br>6 есе артады."],

  ["Радиустарды салыстыру",
   "Идеал шеңберлік қозғалыста бөлшектің массасы екі есе, заряд модулі төрт есе үлкен болды. v және B бірдей. Радиустар қатынасын анықта.",
   "m₂ = 2m₁; |q₂| = 4|q₁|","r₂ : r₁ — ?",
   `${frac("r₂","r₁")} = ${frac("2","4")} = 0,5`],

  ["Период және жиілік",
   "Теориялық модельде айналу периоды 0,02 с. Период үш есе артса, жаңа период пен жиілікті тап.",
   "T₁ = 0,02 с; T₂ = 3T₁","T₂, ν₂ — ?",
   `T₂ = 0,06 с<br>ν₂ = ${frac("1","0,06")} ≈ 16,67 Гц`],

  ["Ампер күшінің екі жағдайы",
   "B = 0,5 Тл, I = 2 А, l = 0,8 м. Бірінші бұрыш 30°, екінші бұрыш 90°. Екі күштің модулін және айырмасын тап.",
   "α₁ = 30°; α₂ = 90°","F₁, F₂, ΔF — ?",
   "F₁ = 0,5 × 2 × 0,8 × 0,5 = 0,4 Н<br>F₂ = 0,8 Н<br>ΔF = 0,4 Н"]
];

/* =====================================
   15 КОМАНДАЛЫҚ СҰРАҚ
===================================== */

const quiz=[
  ["Ампер күші қандай денеге әсер етеді?",
   ["Бейтарап тыныш атомға","Тогы бар өткізгішке","Жарық сәулесіне","Тек диэлектрикке"],1],

  ["Ампер күшінің өлшем бірлігі?",
   ["Тесла","Ампер","Ньютон","Кулон"],2],

  ["Ампер күшінің формуласы?",
   ["F = BIl sin α","F = mg","F = q/t","F = UI"],0],

  ["Ампер күші қай бұрышта ең үлкен?",
   ["0°","180°","30°","90°"],3],

  ["Сол қол ережесінде бас бармақ нені көрсетеді?",
   ["Ток күшінің шамасын","Күш бағытын","Кернеуді","Кедергіні"],1],

  ["Магниттік Лоренц күші неге әсер етеді?",
   ["Тыныш бейтарап денеге","Дыбысқа","Қозғалыстағы зарядқа","Температураға"],2],

  ["Магниттік Лоренц күшінің формуласы?",
   ["F = |q|vB sin α","F = BIl","F = mv","F = ρV"],0],

  ["Магниттік Лоренц күшінің жұмысы?",
   ["100 Дж","1 Дж","10 Дж","0 Дж"],3],

  ["Электрон зарядының таңбасы?",
   ["Оң","Теріс","Бейтарап","Таңбасы жоқ"],1],

  ["Жылдамдық өріске перпендикуляр болса, идеал траектория?",
   ["Түзу","Парабола","Шеңбер","Шаршы"],2],

  ["Ток бағыты кері өзгерсе, Ампер күшінің бағыты?",
   ["Кері өзгереді","Өзгермейді","Әрқашан нөл","Бағытсыз болады"],0],

  ["sin 30° мәні?",
   ["1","0","2","0,5"],3],

  ["B = 0,2 Тл, I = 2 А, l = 1 м, α = 90°. F қанша?",
   ["0,2 Н","0,4 Н","2 Н","4 Н"],1],

  ["Айналу периодының өлшем бірлігі?",
   ["Ньютон","Тесла","Секунд","Кулон"],2],

  ["Магниттік Лоренц күші бөлшектің кинетикалық энергиясын өзгерте ме?",
   ["Өзгертпейді","Екі есе арттырады","Нөлге түсіреді","Әрқашан азайтады"],0]
];

/* =====================================
   КӨРНЕКІ СЫЗБАЛАР
===================================== */

function diagram(type,option=1){
  const b="#087dcc",r="#d63a50",g="#16874e",k="#38576e";

  const txt=(x,y,s,c=k,size=18)=>
    `<text x="${x}" y="${y}" text-anchor="middle"
      font-size="${size}" font-weight="600" fill="${c}">${s}</text>`;

  const arrow=(x,y,X,Y,c=b)=>{
    const a=Math.atan2(Y-y,X-x);

    return `<path d="M${x} ${y} L${X} ${Y}
      L${X-12*Math.cos(a-.5)} ${Y-12*Math.sin(a-.5)}
      M${X} ${Y}
      L${X-12*Math.cos(a+.5)} ${Y-12*Math.sin(a+.5)}"
      stroke="${c}" stroke-width="4" fill="none"
      stroke-linecap="round" stroke-linejoin="round"/>`;
  };

  function field(){
    let s="";
    for(let y=35;y<=235;y+=40){
      for(let x=40;x<=400;x+=45){
        s+=`<circle cx="${x}" cy="${y}" r="8"
          fill="none" stroke="#8cb8d5" stroke-width="1.5"/>
          <path d="M${x-4} ${y-4} l8 8 m-8 0 l8 -8"
            stroke="#8cb8d5" stroke-width="1.5"/>`;
      }
    }
    return s;
  }

  let content="",caption="";

  if(["ampere","direction","lorentz","charges"].includes(type)){
    const particle=type==="lorentz"||type==="charges";
    caption=particle?"Лоренц күшінің бағыты":"Ампер күшінің бағыты";

    content=field();

    if(particle){
      content+=`
        <circle cx="220" cy="140" r="21"
          fill="${option===1?r:b}" stroke="white" stroke-width="3"/>
        ${txt(220,148,option===1?"+":"−","white",26)}
        ${arrow(245,140,365,140,r)}
        ${txt(335,125,"v",r,25)}
      `;
    }else{
      content+=`
        <rect x="70" y="126" width="300" height="28"
          rx="14" fill="#b4c7d8"/>
        ${arrow(option===1?100:340,140,
          option===1?340:100,140,r)}
        ${txt(330,120,"I",r,25)}
      `;
    }

    content+=arrow(220,option===1?116:164,
      220,option===1?45:235,g);

    content+=txt(260,option===1?55:230,"F",g,28);
    content+=txt(220,272,"⊗ B — жазықтық ішіне",b,20);

  }else if(type==="angle"){
    const a=option===1?45:option;
    const rad=a*Math.PI/180;
    const x=100+180*Math.cos(rad);
    const y=210-180*Math.sin(rad);

    caption="Ток пен магнит өрісі арасындағы бұрыш";

    content=`
      ${arrow(100,210,400,210,b)}
      ${arrow(100,210,x,y,r)}
      <path d="M155 210 A55 55 0 0 0
        ${100+55*Math.cos(rad)} ${210-55*Math.sin(rad)}"
        fill="none" stroke="${g}" stroke-width="3"/>
      ${txt(185,184,"α",g,24)}
      ${txt(395,240,"B",b,26)}
      ${txt(x+10,y-10,"I",r,26)}
      ${txt(220,268,"F = BIl sin α",g,25)}
    `;

  }else if(type==="circle"||type==="radius"||type==="period"){
    caption="Біртекті өрістегі шартты шеңберлік қозғалыс";

    content=`
      ${field()}
      <circle cx="220" cy="140" r="88"
        fill="#ffffffaa" stroke="${b}" stroke-width="3"
        stroke-dasharray="7 5"/>
      <circle cx="220" cy="52" r="14" fill="${r}"/>
      ${arrow(240,52,340,52,r)}
      ${arrow(220,72,220,130,g)}
      <circle cx="220" cy="140" r="4" fill="${k}"/>
      <path d="M220 140 H308" stroke="${k}"
        stroke-width="2" stroke-dasharray="4 4"/>
      ${txt(263,132,"r",k,22)}
      ${txt(325,40,"v",r,25)}
      ${txt(245,106,"F",g,22)}
      ${txt(220,265,"Жылдамдық — жанама, күш — центрге",k,16)}
    `;

  }else if(type==="helix"){
    caption="Бұрандалы траекторияның шартты көрінісі";

    const points=Array.from({length:161},(_,i)=>{
      const t=i/160;
      return `${30+380*t},${140+60*Math.sin(t*Math.PI*8)}`;
    }).join(" ");

    content=`
      ${arrow(20,140,420,140,b)}
      <polyline points="${points}" fill="none"
        stroke="${r}" stroke-width="4"/>
      ${txt(220,45,"Бұрандалы траектория",r,23)}
      ${txt(220,265,"Магнит өрісінің бағыты →",b,21)}
    `;

  }else if(type==="units"){
    caption="Негізгі өлшем бірліктері";

    const values=[["B","Тесла"],["I","Ампер"],["l","Метр"],["F","Ньютон"]];

    content=values.map(([a,c],i)=>{
      const x=15+i*105;
      return `<rect x="${x}" y="55" width="98" height="160"
        rx="14" fill="${i%2?"#e1f6e8":"#dcefff"}"/>
        ${txt(x+49,115,a,b,38)}
        ${txt(x+49,175,c,k,18)}`;
    }).join("");

  }else{
    caption="Ампер және Лоренц күштерін салыстыру";

    content=`
      <rect x="15" y="30" width="200" height="215" rx="15" fill="#dcefff"/>
      <rect x="225" y="30" width="200" height="215" rx="15" fill="#e1f6e8"/>
      ${txt(115,70,"Ампер күші",b,23)}
      ${txt(325,70,"Лоренц күші",g,23)}
      <rect x="45" y="120" width="140" height="20" rx="10" fill="${b}"/>
      <circle cx="325" cy="130" r="22" fill="${r}"/>
      ${txt(325,137,"+","white",25)}
      ${txt(115,185,"Өткізгіш",b,20)}
      ${txt(325,185,"Жеке заряд",g,20)}
      ${txt(115,220,"F = BIl sin α",b,18)}
      ${txt(325,220,"F = |q|vB sin α",g,17)}
    `;
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
   ВИРТУАЛДЫ ЗЕРТХАНАЛАР
===================================== */

const labs=[
  {
    title:"Ампер күшінің бұрышқа тәуелділігі",
    aim:"Бұрыш синусының күш шамасына әсерін зерттеу.",
    question:"Қай бұрышта Ампер күші ең үлкен болады?",
    answer:"90° бұрышта, себебі sin 90° = 1."
  },
  {
    title:"Лоренц күшінің бағыты",
    aim:"Оң және теріс зарядқа әсер ететін күш бағыттарын салыстыру.",
    question:"Зарядтың таңбасы өзгергенде күштің бағыты қалай өзгереді?",
    answer:"Күш қарама-қарсы бағытқа өзгереді."
  },
  {
    title:"Зарядталған бөлшектердің траекториялары",
    aim:"Жылдамдық пен магнит өрісінің өзара бағытына байланысты қозғалыс түрлерін ажырату.",
    question:"Қандай жағдайда зарядталған бөлшек шеңбер бойымен қозғалады?",
    answer:"Жылдамдық магнит өрісіне перпендикуляр болғанда, біртекті өрістегі идеал модельде."
  }
];

function labPage(i){
  let controls="";

  if(i===0){
    controls=`
      <h3>Бұрыш: <span class="blue" id="angleVal">90°</span></h3>
      <input id="labAngle" type="range" min="0" max="90"
        step="5" value="90" oninput="updateLab(0)">
      <div class="data">Шартты максимал күш: 1 Н</div>
      <div class="formula">${F.ampere}</div>`;
  }else if(i===1){
    controls=`
      <h3>Зарядтың таңбасын таңдаңдар</h3>
      <div class="actions">
        <button onclick="chargeSign=1;updateLab(1)">+ Оң заряд</button>
        <button onclick="chargeSign=-1;updateLab(1)">− Теріс заряд</button>
      </div>
      <div class="formula">${F.lorentz}</div>`;
  }else{
    controls=`
      <h3>Жылдамдықтың бағыты</h3>
      <select id="trajectory" onchange="updateLab(2)">
        <option value="parallel">Өріске параллель</option>
        <option value="circle" selected>Өріске перпендикуляр</option>
        <option value="helix">Өріске көлбеу</option>
      </select>`;
  }

  return slide(`
    <span class="eyebrow">ВИРТУАЛДЫ ЗЕРТХАНА · ${i+1} / 3</span>
    <h2>${labs[i].title}</h2>
    <div class="definition"><p>${labs[i].aim}</p></div>

    <div class="grid2">
      <div class="card">
        ${controls}
        <div class="formula" id="labResult"></div>
      </div>
      <div class="card" id="labVisual"></div>
    </div>

    <div class="card notebook">
      <h3>Дәптерге қорытынды жазыңдар</h3>
      <p>${labs[i].question}</p>
      <button onclick="$('labAnswer').classList.toggle('hidden')">
        Жауапты көрсету
      </button>
      <div class="answer hidden" id="labAnswer">
        <p>${labs[i].answer}</p>
      </div>
    </div>
  `);
}

let chargeSign=1;

function updateLab(i){
  if(i===0){
    const a=Number($("labAngle").value);
    $("angleVal").textContent=a+"°";
    $("labResult").innerHTML=`F = 1 × sin ${a}°<br>F = ${num(sin(a))} Н`;
    $("labVisual").innerHTML=diagram("angle",a);
  }

  if(i===1){
    $("labVisual").innerHTML=diagram("charges",chargeSign);
    $("labResult").textContent=chargeSign===1?
      "Күш жоғары бағытталған ↑":"Күш төмен бағытталған ↓";
  }

  if(i===2){
    const mode=$("trajectory").value;

    if(mode==="parallel"){
      $("labResult").textContent="Түзу қозғалыс · F = 0";
      $("labVisual").innerHTML=`
        <div class="visual">
          <svg viewBox="0 0 440 280">
            <path d="M30 100 H400 l-15 -9 M400 100 l-15 9"
              stroke="#087dcc" stroke-width="4" fill="none"/>
            <circle cx="100" cy="180" r="15" fill="#d63a50"/>
            <path d="M120 180 H370 l-15 -9 M370 180 l-15 9"
              stroke="#d63a50" stroke-width="4" fill="none"/>
            <text x="220" y="70" text-anchor="middle"
              font-size="24" fill="#087dcc">B</text>
            <text x="250" y="165" text-anchor="middle"
              font-size="24" fill="#d63a50">v</text>
          </svg>
          <small>Жылдамдық пен магнит өрісі бағыттас</small>
        </div>`;
    }else{
      $("labResult").textContent=mode==="circle"?
        "Шеңберлік қозғалыс":"Бұрандалы қозғалыс";
      $("labVisual").innerHTML=diagram(mode);
    }
  }
}

/* =====================================
   РАНДОМ ЖҮЙЕСІ
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
    studentId:s.id,taskId:ids[i]
  }));

  completed.clear();
  drawn.clear();
  randomId=null;
}

function reshuffle(){
  if(!present().length) return alert("Қатысушы жоқ.");
  if(!confirm("Есептерді қайта араластырамыз ба?")) return;

  assignTasks();
  buildPages();
  renderTasks();
  closePanel("taskPanel");
  closePanel("randomPanel");
  goKey("task-intro");
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
    !confirm("Қатысу өзгергенде есептер мен ұпайлар қайта басталады.")) return;

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
   КОМАНДАЛАР
===================================== */

const teamNames=["Ампер","Лоренц","Фарадей"];
const teamIcons=["⚡","🧲","⚛"];

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
    !confirm("Командалар мен ұпайлар қайта басталады.")) return;

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
  const k=i%3,list=teamMembers(k);
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
    <span class="eyebrow">ФИЗИКА · 1-КУРС · 3.4.3</span>

    <div class="card hero">
      <h1>
        <span class="blue">Ампер күші.</span>
        Сол қол ережесі.
        <span class="green">Лоренц күші.</span>
        Магнит өрісіндегі зарядталған бөлшектердің қозғалысы
      </h1>

      <div class="definition">
        <h3>Сабақтың мақсаты</h3>
        <p>Ампер және Лоренц күштерінің физикалық мағынасын түсіну,
        сол қол ережесін меңгеру, магнит өрісіндегі зарядталған
        бөлшектердің қозғалысын сипаттау және есептер шығару.</p>
      </div>

      <div class="grid2">
        ${diagram("ampere")}
        ${diagram("circle")}
      </div>

      <div class="formula">${F.ampere}<br>${F.lorentz}</div>

      <div class="grid3">
        <div class="card">
          <h3 class="blue">15 түсіндірме</h3><p>Жаңа тақырып</p>
        </div>
        <div class="card">
          <h3 class="green">24 есеп</h3><p>Рандом оқушылар</p>
        </div>
        <div class="card">
          <h3 class="gold">3 команда</h3><p>15 ойын сұрағы</p>
        </div>
      </div>

      <button class="primary" onclick="startTimer();go(1)">Сабақты бастау →</button>
      <p class="blue">BY DARKHAN</p>
    </div>
  `);
}

function planPage(){
  const plan=[
    ["Ұйымдастыру",3],
    ["Жаңа тақырып",20],
    ["Конспект жазу",12],
    ["Виртуалды зертханалар",10],
    ["24 жеке есепті қатар орындау",20],
    ["Командалық ойын",12],
    ["Қорытынды және үй жұмысы",3]
  ];

  return slide(`
    <span class="eyebrow">САБАҚ ЖОСПАРЫ</span>
    <h2>80 минуттық сабақ</h2>
    <div class="card">
      ${plan.map(([n,t])=>`
        <div class="planRow"><b>${n}</b><span class="blue">${t} минут</span></div>
      `).join("")}
      <div class="formula">Барлығы: 80 минут</div>
      <button onclick="openPanel('attendance')">Қатысуды белгілеу</button>
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
        <h3 class="gold">Мысал</h3><p>${t[4]}</p>
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
      <h1>🎲 Рандом есептер</h1>
      <p>Әр қатысушыға бір есеп кездейсоқ тағайындалды.
      Оқушылардың есімдері қайталанбайды.</p>

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
        <button class="primary" onclick="$('solution').classList.toggle('hidden')">
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
   ТОПТЫҚ ОЙЫН
===================================== */

function quizIntro(){
  return slide(`
    <span class="eyebrow">КОМАНДАЛЫҚ ОЙЫН</span>
    <h1>🏆 Магниттік күштер жарысы</h1>

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
      <p>15 сұрақ, әр командаға 5 сұрақтан.</p>
      <p>Әр дұрыс жауап — 10 ұпай.</p>
      <p>Жауап беретін оқушы рандом таңдалады.</p>
      <p>Жауаптан кейін 4 секундтан соң келесі топқа ауысады.</p>

      <button onclick="makeTeams(true)">🎲 Топтарды араластыру</button>
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
        <button class="primary" onclick="go(1)">Келесі команда →</button>
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

/* ҚОРЫТЫНДЫ */

function resultsPage(){
  const total=Object.keys(answers).length;
  const winners=teamNames.filter((_,i)=>scores[i]===Math.max(...scores));

  return slide(`
    <span class="eyebrow">САБАҚ ҚОРЫТЫНДЫСЫ</span>
    <h1>Сабақ нәтижелері</h1>

    <div class="card">
      <h3>Жеке есептер</h3>
      <div class="formula">${completed.size} / ${assignments.length}</div>
      <p>Орындалды деп белгіленген тапсырмалар.</p>
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
      <p>✓ Ампер күшінің формуласы.</p>
      <p>✓ Сол қол ережесі.</p>
      <p>✓ Лоренц күшінің қасиеттері.</p>
      <p>✓ Магнит өрісіндегі бөлшектердің қозғалысы.</p>
    </div>

    <button onclick="startQuiz()">↻ Қайта ойнау</button>
  `);
}

/* =====================================
   ЖЕҢІЛ ҮЙ ТАПСЫРМАСЫ
===================================== */

function homeworkPage(){
  return slide(`
    <span class="eyebrow">ҮЙ ТАПСЫРМАСЫ · 3.4.3</span>
    <h2>Үйге берілетін тапсырмалар</h2>

    <div class="card notebook">
      <span class="level easy">1-ТАПСЫРМА · ЖАТТАУ</span>
      <h3 class="blue">Негізгі формулалар мен ереже</h3>

      <p>Ампер күшінің формуласын жаттаңдар:</p>
      <div class="formula">${F.ampere}</div>

      <p>Лоренц күшінің формуласын жаттаңдар:</p>
      <div class="formula">${F.lorentz}</div>

      <div class="definition">
        <h3 class="green">Сол қол ережесі</h3>
        <p>Магнит өрісінің сызықтары алақанға кіріп,
        төрт саусақ ток бағытын көрсетсе,
        керілген бас бармақ Ампер күшінің бағытын көрсетеді.</p>
      </div>
    </div>

    <div class="card">
      <span class="level easy">2-ТАПСЫРМА · ЕСЕП</span>
      <h3 class="blue">Ампер күшін анықтау</h3>

      <p class="problem">
        Магнит индукциясы 0,5 Тл болатын біртекті өрісте
        ұзындығы 0,4 м өткізгіш орналасқан.
        Өткізгіштегі ток күші 2 А.
        Ток бағыты магнит өрісіне перпендикуляр.
        Ампер күшін анықтаңдар.
      </p>

      <div class="data"><b>Берілгені:</b>
        B = 0,5 Тл; l = 0,4 м; I = 2 А; α = 90°.
      </div>
      <div class="data"><b class="green">Табу керек:</b> F — ?</div>

      <div class="example">
        <p>Берілгенін, формуласын, шешуін және жауабын дәптерге жазыңдар.</p>
      </div>
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

  section("🧲 Виртуалды зертхана",labs.map((_,i)=>({
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

/* ҚАЗАҚША ДЫБЫСТАУ */

function stopReading(){
  if("speechSynthesis" in window) speechSynthesis.cancel();
}

function readPage(){
  if(!("speechSynthesis" in window))
    return alert("Дыбыстау қолжетімсіз.");

  const voice=speechSynthesis.getVoices()
    .find(v=>v.lang.toLowerCase().startsWith("kk"));

  if(!voice) return alert("Қазақша дауыс табылмады.");

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

let zIndex=200;

function openPanel(id){
  const p=$(id);
  p.classList.remove("hidden");
  p.style.zIndex=++zIndex;

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

    p.style.zIndex=++zIndex;
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
   МАТЕМАТИКАЛЫҚ КАЛЬКУЛЯТОР
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

/* ҚАУІПСІЗ МАТЕМАТИКАЛЫҚ ПАРСЕР */

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

  if(p!==t.length||!Number.isFinite(result)) throw Error("Қате");
  return result;
}

/* =====================================
   ФИЗИКАЛЫҚ КАЛЬКУЛЯТОР
===================================== */

const units={
  force:["Күш","Н"],
  B:["Магнит индукциясы","Тл"],
  I:["Ток күші","А"],
  l:["Ұзындық","м"],
  alpha:["Бұрыш","°"],
  q:["Заряд модулі","Кл"],
  v:["Жылдамдық","м/с"],
  m:["Масса","кг"],
  r:["Радиус","м"],
  T:["Период","с"],
  nu:["Жиілік","Гц"],
  U:["Кернеу","В"],
  R:["Кедергі","Ом"],
  P:["Қуат","Вт"],
  t:["Уақыт","с"],
  A:["Жұмыс","Дж"]
};

const physics=[
  {
    name:"Ампер күші",
    vars:["force","B","I","l","alpha"],
    solve:{
      force:v=>v.B*v.I*v.l*sin(v.alpha),
      B:v=>v.force/(v.I*v.l*sin(v.alpha)),
      I:v=>v.force/(v.B*v.l*sin(v.alpha)),
      l:v=>v.force/(v.B*v.I*sin(v.alpha))
    }
  },
  {
    name:"Магниттік Лоренц күші",
    vars:["force","q","v","B","alpha"],
    solve:{
      force:v=>v.q*v.v*v.B*sin(v.alpha)
    }
  },
  {
    name:"Ампер күшінің максимал мәні",
    vars:["force","B","I","l"],
    solve:{
      force:v=>v.B*v.I*v.l,
      B:v=>v.force/(v.I*v.l),
      I:v=>v.force/(v.B*v.l),
      l:v=>v.force/(v.B*v.I)
    }
  },
  {
    name:"Айналу периоды және жиілігі",
    vars:["T","nu"],
    solve:{
      T:v=>1/v.nu,
      nu:v=>1/v.T
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

      if(k==="alpha"&&n>180)
        throw Error("Бұрыш 0–180° болуы керек");

      if(k==="v"&&n>=299792458)
        throw Error("Жылдамдықты тексеріңіз");

      values[k]=n;
    });

    const answer=f.solve[unknown](values);

    if(!Number.isFinite(answer)||answer<0)
      throw Error("Берілгендерді тексеріңіз");

    const symbols={force:"F",alpha:"α",nu:"ν"};

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

let tool="pen",ink="#19364f";
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

  canvas.style.cursor=t==="hand"?"grab":t==="text"?"text":"crosshair";
}

/* ДӘЛ КООРДИНАТАЛАР */

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

  $("boardCount").textContent=`${boardIndex+1} / ${boardPages.length}`;

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

/* ҚАЛАМ, САУСАҚ ЖӘНЕ ТІНТУІР */

canvas.addEventListener("pointerdown",e=>{
  if(!e.isPrimary||e.button!==0||pointer!==null) return;
  e.preventDefault();

  const p=point(e);
  const size=Number($("penSize").value);

  if(tool==="text"){
    const text=prompt("Тақтаға жазылатын мәтін:");

    if(text&&text.trim()){
      commit({
        type:"text",text:text.trim(),color:ink,
        size:Math.max(25,size*4),x:p.x,y:p.y
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

/* ТАҚТАНЫҢ БЕТТЕРІ */

function newBoardPage(){
  cancelDrawing();

  boardPages.push({actions:[],redo:[],grid:false});
  boardIndex=boardPages.length-1;

  renderBoard();
}

function boardPage(n){
  cancelDrawing();
  boardIndex=Math.max(0,Math.min(boardIndex+n,boardPages.length-1));
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

/* ТАҚТАНЫҢ МАСШТАБЫ */

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

/* СУРЕТ ҚОСУ */

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

/* PNG САҚТАУ */

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
    a.download=`physics-343-board-${page}.png`;

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

let elapsed=0,started=0,running=false;

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

console.log("PHYSICS LAB PRO — 3.4.3");
console.log("Түсіндірме:",theory.length);
console.log("Конспект:",notes.length);
console.log("Жеке есептер:",tasks.length);
console.log("Командалық сұрақтар:",quiz.length);
console.log("Барлық беттер:",pages.length);

/* BY DARKHAN */
