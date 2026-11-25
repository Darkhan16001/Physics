
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

const cos=a=>{
  const x=Math.cos(a*Math.PI/180);
  return Math.abs(x)<1e-12?0:x;
};

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

let attendanceDraft=names.map(()=>true);
let assignments=[];
const completed=new Set();
const drawn=new Set();
let randomId=null;

/* НЕГІЗГІ ФОРМУЛАЛАР */

const F={
  flux:"Φ = BS cos α",
  difference:"ΔΦ = Φ₂ − Φ₁",
  faraday:`ε = −${frac("ΔΦ","Δt")}`,
  emf:`|ε| = ${frac("N|ΔΦ|","Δt")}`,
  current:`I = ${frac("|ε|","R")}`,
  ampere:"F<sub>A</sub> = BIl sin α",
  work:"A = IΔΦ",
  mechanical:"A = Fs cos β",
  weber:"1 Вб = 1 Тл · м²"
};

/* =====================================
   15 ТҮСІНДІРМЕ
===================================== */

const theory=[
  [
    "Электромагниттік индукция",
    "Электромагниттік индукция — контур арқылы өтетін магнит ағыны өзгерген кезде индукциялық электр қозғаушы күшінің пайда болу құбылысы.",
    "Магнит өрісі мен электрлік құбылыстар өзара тығыз байланысты. Контурды қиып өтетін магнит ағыны уақыт бойынша өзгергенде электр қозғаушы күші пайда болады. Егер контур тұйық болса, оның бойымен индукциялық ток жүруі мүмкін.",
    "Магнит ағынының өзгеруі → Индукциялық ЭҚК",
    "Электр генераторларының жұмыс принципі электромагниттік индукцияға негізделген.",
    "induction"
  ],
  [
    "Фарадейдің ашқан құбылысы",
    "Электромагниттік индукцияны Майкл Фарадей 1831 жылы тәжірибе жүзінде ашты.",
    "Фарадей магниттік құбылыстар мен электр тогының байланысын зерттеді. Оның тәжірибелері магнит ағынының өзгеруі электр қозғаушы күшін тудыратынын көрсетті. Бұл жаңалық электр энергетикасының дамуына үлкен әсер етті.",
    "1831 жыл · Электромагниттік индукция",
    "Индукциялық ЭҚК-тің пайда болуы үшін магнит ағыны өзгеруі қажет.",
    "induction"
  ],
  [
    "Магнит ағыны",
    "Магнит ағыны — берілген бет арқылы өтетін магнит өрісін сипаттайтын скалярлық шама.",
    "Біртекті магнит өрісіндегі жазық беттің магнит ағыны магнит индукциясына, беттің ауданына және өріс пен бетке жүргізілген нормаль арасындағы бұрышқа тәуелді.",
    F.flux,
    "B = 0,2 Тл, S = 0,5 м², α = 0° болса, Φ = 0,1 Вб.",
    "flux"
  ],
  [
    "Магнит ағынының өлшем бірлігі",
    "Магнит ағынының халықаралық өлшем бірлігі — вебер.",
    "Магнит ағыны Φ таңбасымен белгіленеді. Магнит индукциясы тесламен, аудан шаршы метрмен өлшенеді. Бір вебер бір тесла мен бір шаршы метрдің көбейтіндісіне тең.",
    F.weber,
    "5 мВб = 0,005 Вб.",
    "units"
  ],
  [
    "Магнит ағыны және бұрыш",
    "Магнит ағыны магнит индукциясы мен бет нормалі арасындағы бұрышқа тәуелді.",
    "Нормаль — бетке перпендикуляр бағытталған вектор. Бұрыш 0° болғанда ағын оң максимал мәнге ие. Бұрыш 90° болғанда магнит өрісі бетке параллель орналасады және магнит ағыны нөлге тең болады.",
    "cos 0° = 1<br>cos 60° = 0,5<br>cos 90° = 0",
    "Бұрышты беттің өзімен емес, бетке жүргізілген нормальмен өлшейміз.",
    "angle"
  ],
  [
    "Магнит ағынының өзгеруі",
    "Магнит ағынының өзгерісі соңғы және бастапқы ағындардың айырмасына тең.",
    "Магнит индукциясы, бет ауданы немесе беттің өріске қатысты бағыты өзгерсе, магнит ағыны да өзгеруі мүмкін. Ағынның таңбасы таңдалған нормаль бағытына байланысты.",
    F.difference,
    "Φ₁ = 0,1 Вб, Φ₂ = 0,3 Вб болса, ΔΦ = 0,2 Вб.",
    "change"
  ],
  [
    "Индукциялық электр қозғаушы күші",
    "Индукциялық ЭҚК магнит ағынының уақыт бойынша өзгеруіне байланысты пайда болады.",
    "Ағынның өзгеру жылдамдығы неғұрлым үлкен болса, басқа жағдайлар бірдей болғанда индукциялық ЭҚК модулі де соғұрлым үлкен болады. ЭҚК вольтпен өлшенеді.",
    F.faraday,
    "Бұл қатынас бір орам үшін уақыт аралығындағы орташа ЭҚК-ті сипаттайды.",
    "graph"
  ],
  [
    "Фарадей заңы",
    "Фарадей заңы индукциялық ЭҚК пен магнит ағынының өзгеру жылдамдығы арасындағы байланысты анықтайды.",
    "Барлық орамдар арқылы бірдей магнит ағыны өткен жағдайда катушканың орташа индукциялық ЭҚК модулі бір орамдағы ЭҚК модулін орамдар санына көбейту арқылы табылады.",
    F.emf,
    "N — орам саны; ΔΦ — бір орамдағы ағын өзгерісі; Δt — уақыт.",
    "coil"
  ],
  [
    "Ленц ережесі",
    "Индукциялық токтың магнит өрісі оны тудырған магнит ағынының өзгерісіне қарсы әсер етеді.",
    "Егер бастапқы магнит ағыны артып жатса, индукциялық токтың өрісі осы артуға қарсы бағытталады. Ағын кеміген кезде индукциялық өріс оның кемуіне қарсы әсер етеді. Бұл энергияның сақталу заңымен байланысты.",
    "Индукциялық өріс → Ағын өзгерісіне қарсы әсер",
    "Индукциялық өріс әрдайым бастапқы өрістің өзіне емес, оның өзгерісіне қарсы әсер етеді.",
    "lenz"
  ],
  [
    "Индукциялық ток",
    "Индукциялық ток — индукциялық ЭҚК әсерінен тұйық контурда пайда болатын электр тогы.",
    "Қарапайым резистивті контур моделінде ток күшінің модулі индукциялық ЭҚК модулінің кедергіге қатынасымен анықталады. Тұйықталмаған контурда ЭҚК пайда болуы мүмкін, бірақ тұрақты контурлық ток жүрмейді.",
    F.current,
    "ЭҚК 6 В, кедергі 3 Ом болса, ток күші 2 А.",
    "circuit"
  ],
  [
    "Ампер күші",
    "Ампер күші — магнит өрісіндегі тогы бар өткізгішке әсер ететін күш.",
    "Біртекті магнит өрісіндегі түзу өткізгішке әсер ететін күш магнит индукциясына, ток күшіне, өткізгіш ұзындығына және олардың арасындағы бұрышқа тәуелді.",
    F.ampere,
    "Ток өріске перпендикуляр болса, F = BIl.",
    "work"
  ],
  [
    "Ампер күшінің механикалық жұмысы",
    "Күш әсерінен дене орын ауыстырғанда механикалық жұмыс атқарылуы мүмкін.",
    "Тұрақты Ампер күшінің жұмысы күш модулінің, орын ауыстырудың және олардың арасындағы бұрыш косинусының көбейтіндісіне тең. Күш пен орын ауыстыру бағыттас болса, жұмыс F пен s көбейтіндісіне тең.",
    F.mechanical,
    "F = 2 Н, s = 0,5 м және β = 0° болса, A = 1 Дж.",
    "work"
  ],
  [
    "Жұмыс пен магнит ағынының байланысы",
    "Тұрақты ток жүретін контурдың белгілі бір механикалық орын ауыстыруында Ампер күшінің жұмысы магнит ағынының өзгерісімен байланысты.",
    "Қарапайым бір орамды контур моделінде ток күші тұрақты болғанда және ағын өзгерісі контурдың механикалық қозғалысынан туындағанда, үйлесімді бағыттар үшін жұмыс A = IΔΦ өрнегімен анықталады.",
    F.work,
    "I = 2 А және ΔΦ = 0,3 Вб болса, жұмыс 0,6 Дж.",
    "workflux"
  ],
  [
    "Электр генераторы",
    "Электр генераторы механикалық энергияны электр энергиясына түрлендіреді.",
    "Генераторда магнит өрісі мен контурдың өзара орналасуы өзгеріп, магнит ағыны уақыт бойынша өзгереді. Соның нәтижесінде индукциялық ЭҚК пайда болады. Бұл электр энергиясын өндірудің негізгі физикалық принциптерінің бірі.",
    "Механикалық энергия → Электр энергиясы",
    "Электр станцияларындағы генераторлар электромагниттік индукцияға негізделеді.",
    "generator"
  ],
  [
    "Электромагниттік индукцияның қолданылуы",
    "Электромагниттік индукция қазіргі электр техникасының көптеген салаларында қолданылады.",
    "Генераторлар, трансформаторлар және индукциялық датчиктер магнит ағынының өзгеруіне байланысты жұмыс істейді. Трансформаторда айнымалы магнит ағыны екінші орамда ЭҚК тудырады. Индукциялық датчиктер қозғалыс пен орналасу өзгерісін анықтауға көмектеседі.",
    "Генератор · Трансформатор · Индукциялық датчик",
    "Электромагниттік индукция энергияны түрлендіруге және сигнал алуға мүмкіндік береді.",
    "applications"
  ]
];

/* =====================================
   10 БЕТТІК КОНСПЕКТ
===================================== */

const notes=[
  ["Электромагниттік индукция",
   "Контур арқылы өтетін магнит ағыны өзгергенде индукциялық ЭҚК пайда болады.",
   "Магнит ағыны өзгереді → ЭҚК пайда болады",
   "Құбылысты М. Фарадей 1831 жылы ашқан."],

  ["Магнит ағыны",
   "Біртекті магнит өрісіндегі жазық беттің магнит ағыны:",
   F.flux,
   "B — Тл; S — м²; Φ — Вб; α — B мен нормаль арасындағы бұрыш."],

  ["Магнит ағынының өлшем бірлігі",
   "Магнит ағыны вебермен өлшенеді.",
   F.weber,
   "1 мВб = 10⁻³ Вб."],

  ["Бұрыштың әсері",
   "Магнит ағыны беттің магнит өрісіне қатысты бағытына тәуелді.",
   "α = 0° → Φ = BS<br>α = 90° → Φ = 0",
   "Бұрыш магнит индукциясы мен бет нормалі арасында алынады."],

  ["Магнит ағынының өзгерісі",
   "Соңғы магнит ағынынан бастапқы магнит ағынын азайтамыз.",
   F.difference,
   "Магнит ағынының өзгерісінің өлшем бірлігі — вебер."],

  ["Фарадей заңы",
   "Орташа индукциялық ЭҚК магнит ағынының өзгерісіне және оның өзгеру уақытына тәуелді.",
   `${F.faraday}<br>${F.emf}`,
   "N — бірдей ағын өтетін орамдар саны; ε — В."],

  ["Ленц ережесі",
   "Индукциялық токтың магнит өрісі бастапқы магнит ағынының өзгерісіне қарсы әсер етеді.",
   "Индукция → Ағын өзгерісіне қарсы әсер",
   "Фарадей заңындағы минус таңбасы осы ережемен байланысты."],

  ["Индукциялық ток",
   "Қарапайым резистивті тұйық контурда ток ЭҚК пен кедергіге тәуелді.",
   F.current,
   "I — А; ε — В; R — Ом."],

  ["Ампер күшінің жұмысы",
   "Тұрақты күштің жұмысы күш, орын ауыстыру және олардың арасындағы бұрыш арқылы анықталады.",
   `${F.mechanical}<br>${F.work}`,
   "Екінші формула тұрақты токты бір орамды контурдың механикалық қозғалысына арналған."],

  ["Қолданылуы",
   "Электромагниттік индукция генераторлардың, трансформаторлардың және индукциялық датчиктердің жұмысында маңызды.",
   "Механикалық энергия → Электр энергиясы",
   "Генератор электромагниттік индукция құбылысына негізделеді."]
];

/* =====================================
   24 ЖЕКЕ ЕСЕП
===================================== */

const tasks=[
  /* 1-ДЕҢГЕЙ — ОҢАЙ */

  ["Магнит ағыны",
   "Магнит индукциясы 0,4 Тл, бет ауданы 0,5 м². Нормаль мен өріс арасындағы бұрыш 0°. Магнит ағынын тап.",
   "B = 0,4 Тл; S = 0,5 м²; α = 0°","Φ — ?",
   "Φ = BS cos α = 0,4 × 0,5 × 1 = 0,2 Вб"],

  ["Веберге айналдыру",
   "Магнит ағыны 25 мВб. Оны вебермен өрнекте.",
   "Φ = 25 мВб","Φ (Вб) — ?",
   "Φ = 25 × 10⁻³ = 0,025 Вб"],

  ["Ағынның өзгерісі",
   "Магнит ағыны 0,1 Вб-ден 0,6 Вб-ге артты. Өзгерісін анықта.",
   "Φ₁ = 0,1 Вб; Φ₂ = 0,6 Вб","ΔΦ — ?",
   "ΔΦ = 0,6 − 0,1 = 0,5 Вб"],

  ["Магнит өрісіне параллель бет",
   "B = 0,5 Тл, S = 0,4 м², нормаль мен өріс арасындағы бұрыш 90°. Ағынды тап.",
   "B = 0,5 Тл; S = 0,4 м²; α = 90°","Φ — ?",
   "Φ = BS cos 90° = 0 Вб"],

  ["Индукциялық ЭҚК",
   "Бір орамдағы магнит ағыны 2 секундта 0,8 Вб-ге өзгерді. Орташа ЭҚК модулін тап.",
   "|ΔΦ| = 0,8 Вб; Δt = 2 с; N = 1","|ε| — ?",
   `|ε| = ${frac("0,8","2")} = 0,4 В`],

  ["Индукциялық ток күші",
   "Қарапайым резистивті контурда ЭҚК 8 В, кедергі 4 Ом. Ток күшін тап.",
   "|ε| = 8 В; R = 4 Ом","I — ?",
   `I = ${frac("8","4")} = 2 А`],

  ["Механикалық жұмыс",
   "Тұрақты Ампер күші 3 Н, күш бағытындағы орын ауыстыру 0,2 м. Жұмысты анықта.",
   "F = 3 Н; s = 0,2 м","A — ?",
   "A = Fs = 3 × 0,2 = 0,6 Дж"],

  ["Ауданның өлшем бірлігі",
   "Контурдың ауданы 300 см². Шаршы метрмен өрнекте.",
   "S = 300 см²","S (м²) — ?",
   "S = 300 × 10⁻⁴ = 0,03 м²"],

  /* 2-ДЕҢГЕЙ — ОРТАША */

  ["60° бұрыштағы магнит ағыны",
   "B = 0,6 Тл, S = 0,2 м², α = 60°. Магнит ағынын анықта.",
   "B = 0,6 Тл; S = 0,2 м²; α = 60°","Φ — ?",
   "Φ = 0,6 × 0,2 × 0,5 = 0,06 Вб"],

  ["Белгісіз магнит индукциясы",
   "Магнит ағыны 0,12 Вб, бет ауданы 0,4 м², α = 0°. Магнит индукциясын тап.",
   "Φ = 0,12 Вб; S = 0,4 м²","B — ?",
   `B = ${frac("0,12","0,4")} = 0,3 Тл`],

  ["Беттің ауданы",
   "Магнит ағыны 0,24 Вб, индукция 0,8 Тл. Бұрыш 0°. Ауданды есепте.",
   "Φ = 0,24 Вб; B = 0,8 Тл","S — ?",
   `S = ${frac("0,24","0,8")} = 0,3 м²`],

  ["Көп орамды контур",
   "10 орамның әрқайсысындағы ағын 2 секундта 0,2 Вб-ге өзгерді. Орташа ЭҚК модулін анықта.",
   "N = 10; |ΔΦ| = 0,2 Вб; Δt = 2 с","|ε| — ?",
   `|ε| = ${frac("10 × 0,2","2")} = 1 В`],

  ["Магнит ағынының кемуі",
   "Ағын 0,7 Вб-ден 0,2 Вб-ге өзгерді. Өзгерісті және оның модулін тап.",
   "Φ₁ = 0,7 Вб; Φ₂ = 0,2 Вб","ΔΦ; |ΔΦ| — ?",
   "ΔΦ = 0,2 − 0,7 = −0,5 Вб<br>|ΔΦ| = 0,5 Вб"],

  ["Ампер күшінің жұмысы",
   "Тұрақты токты бір орамды контурдың механикалық қозғалысында I = 3 А, ΔΦ = 0,4 Вб. Жұмысты тап.",
   "I = 3 А; ΔΦ = 0,4 Вб","A — ?",
   "A = IΔΦ = 3 × 0,4 = 1,2 Дж"],

  ["ЭҚК-тің өзгеруі",
   "Бастапқы орташа ЭҚК 5 В. Ағын өзгерісі тұрақты, ал уақыт 2 есе артты. Жаңа ЭҚК модулін тап.",
   "|ε₁| = 5 В; Δt₂ = 2Δt₁","|ε₂| — ?",
   `|ε₂| = ${frac("5","2")} = 2,5 В`],

  ["Магнит ағындарын салыстыру",
   "Бірдей B және α кезінде бірінші беттің ауданы екінші беттің ауданынан үш есе үлкен. Нөлден өзгеше ағындардың қатынасын тап.",
   "S₁ = 3S₂","Φ₁ : Φ₂ — ?",
   `${frac("Φ₁","Φ₂")} = ${frac("S₁","S₂")} = 3`],

  /* 3-ДЕҢГЕЙ — КҮРДЕЛІ */

  ["Аудан және магнит ағыны",
   "B = 0,5 Тл, S = 200 см², α = 60°. Магнит ағынын вебермен есепте.",
   "S = 0,02 м²; B = 0,5 Тл; α = 60°","Φ — ?",
   "Φ = 0,5 × 0,02 × 0,5 = 0,005 Вб"],

  ["Екі магнит ағыны",
   "B = 0,4 Тл, S = 0,2 м². Бастапқы бұрыш 0°, соңғы бұрыш 60°. Екі ағынды және өзгерісін тап.",
   "α₁ = 0°; α₂ = 60°","Φ₁, Φ₂, ΔΦ — ?",
   "Φ₁ = 0,08 Вб<br>Φ₂ = 0,04 Вб<br>ΔΦ = −0,04 Вб"],

  ["ЭҚК және ток күші",
   "Шартты резистивті контурда 5 орам бар. Бір орамдағы ағын 2 секундта 0,4 Вб-ге бірқалыпты өзгерді. Кедергі 2 Ом. ЭҚК пен ток модулін тап.",
   "N = 5; |ΔΦ| = 0,4 Вб; Δt = 2 с; R = 2 Ом","|ε|, I — ?",
   `|ε| = ${frac("5 × 0,4","2")} = 1 В<br>I = ${frac("1","2")} = 0,5 А`],

  ["Жұмыс пен ағын",
   "Тұрақты токты бір орамды контурда механикалық қозғалыстан ΔΦ = 0,6 Вб өзгеріс пайда болды. Ампер күшінің жұмысы 1,8 Дж. Ток күшін анықта.",
   "A = 1,8 Дж; ΔΦ = 0,6 Вб","I — ?",
   `I = ${frac("1,8","0,6")} = 3 А`],

  ["Магнит ағынының пайыздық өзгерісі",
   "Магнит ағыны 0,5 Вб-ден 0,8 Вб-ге артты. Абсолюттік және пайыздық өсімін тап.",
   "Φ₁ = 0,5 Вб; Φ₂ = 0,8 Вб","ΔΦ; пайыз — ?",
   `ΔΦ = 0,3 Вб<br>${frac("0,3","0,5")} × 100% = 60%`],

  ["Бұрышты анықтау",
   "B = 0,5 Тл, S = 0,4 м², магнит ағыны 0,1 Вб. Бұрыш 0°–90° аралығында. Бұрышты тап.",
   "Φ = 0,1 Вб; B = 0,5 Тл; S = 0,4 м²","α — ?",
   `cos α = ${frac("0,1","0,5 × 0,4")} = 0,5<br>α = 60°`],

  ["ЭҚК-терді салыстыру",
   "Бастапқы ЭҚК модулі 4 В. Ағынның өзгерісі үш есе, өзгеру уақыты екі есе артты. Орам саны өзгермеді. Жаңа ЭҚК-ті тап.",
   "|ε₁| = 4 В; |ΔΦ₂| = 3|ΔΦ₁|; Δt₂ = 2Δt₁","|ε₂| — ?",
   `|ε₂| = 4 × ${frac("3","2")} = 6 В`],

  ["Ампер күшінің екі жұмысы",
   "Тұрақты күш 4 Н. Бірінші орын ауыстыру 0,5 м, екіншісі 0,8 м. Екеуі де күш бағытымен бағыттас. Жұмыстарды және айырмасын тап.",
   "F = 4 Н; s₁ = 0,5 м; s₂ = 0,8 м","A₁, A₂, ΔA — ?",
   "A₁ = 4 × 0,5 = 2 Дж<br>A₂ = 4 × 0,8 = 3,2 Дж<br>ΔA = 1,2 Дж"]
];

/* =====================================
   15 КОМАНДАЛЫҚ СҰРАҚ
===================================== */

const quiz=[
  ["Электромагниттік индукция құбылысын кім ашты?",
   ["Ньютон","Фарадей","Кюри","Паскаль"],1],

  ["Магнит ағынының өлшем бірлігі?",
   ["Тесла","Ампер","Вебер","Ньютон"],2],

  ["Магнит ағынының формуласы?",
   ["Φ = BS cos α","Φ = UI","Φ = mg","Φ = IR"],0],

  ["Нормаль мен өріс арасындағы бұрыш 90° болса, магнит ағыны?",
   ["Максимал","Екі есе артады","Шексіз","Нөл"],3],

  ["Магнит ағынының өзгерісі қалай табылады?",
   ["Φ₂ + Φ₁","Φ₂ − Φ₁","Φ₂ × Φ₁","Φ₂²"],1],

  ["Индукциялық ЭҚК қандай бірлікпен өлшенеді?",
   ["Кулон","Вебер","Вольт","Ом"],2],

  ["Индукциялық ток бағытын анықтайтын ереже?",
   ["Ленц ережесі","Архимед заңы","Ом заңы","Паскаль заңы"],0],

  ["Генератор қандай энергияны электр энергиясына айналдырады?",
   ["Тек жарық","Химиялық","Тек жылулық","Механикалық"],3],

  ["Магнит ағыны 0,6 Вб-ден 0,2 Вб-ге өзгерді. ΔΦ қанша?",
   ["0,8 Вб","−0,4 Вб","0,4 Вб","0 Вб"],1],

  ["1 мВб неше веберге тең?",
   ["1 Вб","1000 Вб","0,001 Вб","0,01 Вб"],2],

  ["Ампер күшінің жұмысының өлшем бірлігі?",
   ["Джоуль","Тесла","Ампер","Вебер"],0],

  ["Бір орамда ағын өзгермесе, индукциялық ЭҚК қандай?",
   ["Максимал","10 В","1 В","0 В"],3],

  ["B = 0,2 Тл, S = 0,5 м², α = 0°. Магнит ағыны қанша?",
   ["1 Вб","0,1 Вб","0,7 Вб","2 Вб"],1],

  ["Тұрақты күш 2 Н, күш бағытындағы орын ауыстыру 3 м. Жұмыс?",
   ["2 Дж","3 Дж","6 Дж","1 Дж"],2],

  ["Ленц ережесі бойынша индукциялық өріс неге қарсы әсер етеді?",
   ["Магнит ағынының өзгерісіне","Заттың массасына","Температураға","Кедергіге"],0]
];

/* =====================================
   КӨРНЕКІ СЫЗБАЛАР
===================================== */

function diagram(type,value=0){
  const b="#087dcc",r="#d63a50",g="#16874e",k="#38576e";

  const text=(x,y,s,c=k,size=18)=>
    `<text x="${x}" y="${y}" text-anchor="middle"
      fill="${c}" font-size="${size}" font-weight="600">${s}</text>`;

  const rect=(x,y,w,h,c)=>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}"
      rx="10" fill="${c}"/>`;

  const arrow=(x,y,X,Y,c=b)=>{
    const a=Math.atan2(Y-y,X-x);
    return `<path d="M${x} ${y} L${X} ${Y}
      L${X-12*Math.cos(a-.5)} ${Y-12*Math.sin(a-.5)}
      M${X} ${Y}
      L${X-12*Math.cos(a+.5)} ${Y-12*Math.sin(a+.5)}"
      stroke="${c}" stroke-width="3.5" fill="none"
      stroke-linecap="round"/>`;
  };

  let content="",caption="";

  if(type==="flux"||type==="angle"){
    caption="Магнит өрісі, бет және нормаль векторы";

    const a=value*Math.PI/180;
    const nx=220+100*Math.cos(a);
    const ny=140-100*Math.sin(a);
    const dx=80*Math.sin(a);
    const dy=80*Math.cos(a);

    for(let y=45;y<=235;y+=38)
      content+=arrow(25,y,410,y,"#9bbfda");

    content+=`
      <path d="M${220-dx-35} ${140-dy+20}
        L${220-dx+35} ${140-dy-20}
        L${220+dx+35} ${140+dy-20}
        L${220+dx-35} ${140+dy+20} Z"
        fill="#24ac7040" stroke="${g}" stroke-width="3"/>
      ${arrow(220,140,nx,ny,r)}
      ${text(nx,ny-12,"n",r,23)}
      ${text(390,30,"B",b,25)}
      ${text(220,267,"Φ = BS cos α",g,24)}
    `;

  }else if(type==="induction"||type==="coil"){
    caption="Магнит пен контурдың шартты көрінісі";

    content=`
      ${rect(25,85,85,85,b)}
      ${rect(110,85,85,85,r)}
      ${text(67,137,"S","white",30)}
      ${text(152,137,"N","white",30)}
      ${arrow(40,50,190,50,g)}
      ${text(115,35,"Қозғалыс",g,18)}
      ${[245,267,289,311].map(x=>
        `<ellipse cx="${x}" cy="128" rx="26" ry="78"
          fill="none" stroke="#b57d33" stroke-width="4"/>`
      ).join("")}
      <path d="M245 206 V240 H360 V206 H311"
        fill="none" stroke="${k}" stroke-width="3"/>
      <circle cx="360" cy="240" r="28" fill="white"
        stroke="${b}" stroke-width="3"/>
      ${text(360,248,"ε",b,25)}
      ${text(280,25,"Контур",k,21)}
    `;

  }else if(type==="change"||type==="graph"){
    caption="Магнит ағынының уақыт бойынша өзгеруі";

    content=`
      <path d="M45 25 V230 H415"
        stroke="${k}" stroke-width="3" fill="none"/>
      <path d="M70 205 L360 50"
        stroke="${b}" stroke-width="5" fill="none"/>
      <path d="M100 189 H300 V82"
        stroke="${g}" stroke-width="2.5"
        stroke-dasharray="7 5" fill="none"/>
      ${text(200,214,"Δt",g,21)}
      ${text(333,140,"ΔΦ",g,21)}
      ${text(23,30,"Φ",b,23)}
      ${text(410,255,"t",b,23)}
      ${text(220,270,"Ағынның өзгеру жылдамдығы",k,18)}
    `;

  }else if(type==="lenz"){
    const increasing=value===0;
    caption="Ленц ережесінің бағыттық моделі";

    content=`
      ${rect(20,25,190,210,"#dcefff")}
      ${rect(230,25,190,210,"#e1f6e8")}
      ${text(115,55,"Бастапқы өріс",b,18)}
      ${text(325,55,"Индукциялық өріс",g,16)}
      ${arrow(115,185,115,85,b)}
      ${increasing?
        arrow(325,85,325,185,g):
        arrow(325,185,325,85,g)}
      ${text(115,218,increasing?"Ағын артады":"Ағын кемиді",b,18)}
      ${text(325,218,"Қарсы әсер",g,18)}
      ${text(220,265,"Ағын өзгерісіне қарсы",r,23)}
    `;

  }else if(type==="work"||type==="workflux"){
    caption="Ампер күшінің механикалық жұмысы";

    content=`
      ${rect(35,35,370,195,"#dcefff")}
      <rect x="100" y="90" width="20" height="105"
        rx="7" fill="#b0bfcb"/>
      <rect x="290" y="90" width="20" height="105"
        rx="7" fill="none" stroke="${g}" stroke-width="3"
        stroke-dasharray="6 4"/>
      ${arrow(125,125,250,125,r)}
      ${arrow(125,170,290,170,g)}
      ${text(190,112,"F",r,27)}
      ${text(220,194,"s",g,27)}
      ${text(220,65,"Күш және орын ауыстыру",k,20)}
      ${text(220,267,type==="work"?"A = Fs cos β":"A = IΔΦ",b,26)}
    `;

  }else if(type==="generator"){
    caption="Генератордың энергия түрлендіру принципі";

    content=`
      ${rect(15,70,130,140,"#fff0cf")}
      ${rect(155,70,130,140,"#dcefff")}
      ${rect(295,70,130,140,"#ddf7e7")}
      ${text(80,110,"Механикалық",k,15)}
      ${text(80,135,"энергия",k,20)}
      ${text(220,140,"Генератор",b,19)}
      ${text(360,110,"Электр",g,19)}
      ${text(360,135,"энергиясы",g,19)}
      ${arrow(125,170,175,170,r)}
      ${arrow(265,170,315,170,g)}
    `;

  }else if(type==="circuit"){
    caption="Қарапайым тұйық контурдың шартты сызбасы";

    content=`
      <path d="M100 65 H340 V215 H100 Z"
        stroke="${b}" stroke-width="4" fill="none"/>
      <circle cx="100" cy="140" r="34"
        fill="white" stroke="${b}" stroke-width="3"/>
      ${text(100,150,"ε",b,30)}
      <rect x="310" y="110" width="60" height="60"
        fill="#fff2cb" stroke="${r}" stroke-width="3"/>
      ${text(340,149,"R",r,25)}
      ${arrow(155,65,280,65,g)}
      ${text(220,45,"I",g,26)}
      ${text(220,265,"I = |ε| / R",k,25)}
    `;

  }else if(type==="units"){
    caption="Физикалық шамалардың өлшем бірліктері";

    content=[
      ["Φ","Вебер"],["B","Тесла"],
      ["S","Метр²"],["ε","Вольт"]
    ].map(([a,c],i)=>
      rect(12+i*106,55,98,170,i%2?"#e1f6e8":"#dcefff")+
      text(61+i*106,120,a,b,40)+
      text(61+i*106,185,c,k,17)
    ).join("");

  }else{
    caption="Электромагниттік индукцияның қолданылуы";

    content=[
      ["Генератор","Энергетика"],
      ["Трансформатор","Электр желісі"],
      ["Датчик","Автоматика"]
    ].map(([a,c],i)=>
      rect(10+i*145,35,138,210,["#dcefff","#d9f5e4","#fff0cf"][i])+
      text(79+i*145,105,["⚡","≈","◉"][i],b,43)+
      text(79+i*145,160,a,k,15)+
      text(79+i*145,195,c,g,15)
    ).join("");
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
  ["Магнит ағыны және бұрыш",
   "Бұрыш өзгергенде магнит ағынының қалай өзгеретінін бақылау.",
   "Қай бұрышта магнит ағыны нөлге тең?",
   "90° бұрышта, себебі cos 90° = 0."],

  ["Фарадей заңының моделі",
   "Ағын өзгерісі мен уақыттың орташа ЭҚК-ке әсерін зерттеу.",
   "Бірдей ағын өзгерісі кезінде уақыт екі есе артса, ЭҚК қалай өзгереді?",
   "ЭҚК модулі екі есе азаяды."],

  ["Ленц ережесі",
   "Магнит ағыны артқанда және кемігенде индукциялық өріс бағытын салыстыру.",
   "Индукциялық өріс әрдайым бастапқы магнит өрісіне қарсы бағыттала ма?",
   "Жоқ. Ол бастапқы магнит ағынының өзгерісіне қарсы әсер етеді."]
];

let lenzMode=0;

function labPage(i){
  const controls=i===0?`
    <div class="data">B = 0,5 Тл; S = 1 м²</div>
    <h3>Бұрыш: <span id="angleVal" class="blue">0°</span></h3>
    <input id="labAngle" type="range" min="0" max="90"
      value="0" step="5" oninput="updateLab(0)">
    <div class="formula">${F.flux}</div>
  `:i===1?`
    <h3>Ағын өзгерісі: <span id="fluxVal" class="blue"></span> Вб</h3>
    <input id="labFlux" type="range" min="0" max="1"
      value="0.4" step="0.1" oninput="updateLab(1)">

    <h3>Уақыт: <span id="timeVal" class="red"></span> с</h3>
    <input id="labTime" type="range" min="1" max="5"
      value="2" step="0.5" oninput="updateLab(1)">

    <p>Бір орамға арналған математикалық модель.</p>
    <div class="formula">${F.emf}</div>
  `:`
    <h3>Магнит ағынының өзгерісін таңдаңдар</h3>
    <div class="actions">
      <button onclick="lenzMode=0;updateLab(2)">Ағын артады ↑</button>
      <button onclick="lenzMode=1;updateLab(2)">Ағын кемиді ↓</button>
    </div>
  `;

  return slide(`
    <span class="eyebrow">ВИРТУАЛДЫ ЗЕРТХАНА · ${i+1} / 3</span>
    <h2>${labs[i][0]}</h2>

    <div class="definition"><p>${labs[i][1]}</p></div>

    <div class="grid2">
      <div class="card">
        ${controls}
        <div class="formula" id="labResult"></div>
      </div>
      <div class="card" id="labVisual"></div>
    </div>

    <div class="card notebook">
      <h3>Дәптерге қорытынды жазыңдар</h3>
      <p>${labs[i][2]}</p>
      <button onclick="$('labAnswer').classList.toggle('hidden')">
        Жауапты көрсету
      </button>
      <div class="answer hidden" id="labAnswer"><p>${labs[i][3]}</p></div>
    </div>
  `);
}

function updateLab(i){
  if(i===0){
    const a=Number($("labAngle").value);
    $("angleVal").textContent=a+"°";
    $("labResult").innerHTML=
      `Φ = 0,5 × cos ${a}°<br>Φ = ${num(0.5*cos(a))} Вб`;
    $("labVisual").innerHTML=diagram("angle",a);
  }

  if(i===1){
    const f=Number($("labFlux").value);
    const t=Number($("labTime").value);

    $("fluxVal").textContent=num(f);
    $("timeVal").textContent=num(t);

    $("labResult").innerHTML=
      `|ε| = ${frac(num(f),num(t))}<br>|ε| = ${num(f/t)} В`;

    $("labVisual").innerHTML=`
      <div class="visual">
        <svg viewBox="0 0 440 280">
          <path d="M45 20 V235 H420" fill="none"
            stroke="#38576e" stroke-width="3"/>
          <path d="M45 235 L${45+70*t} ${235-190*f}"
            fill="none" stroke="#087dcc" stroke-width="5"/>
          <circle cx="${45+70*t}" cy="${235-190*f}" r="6"
            fill="#16874e"/>
          <text x="25" y="30" fill="#087dcc">Φ</text>
          <text x="410" y="260" fill="#087dcc">t</text>
        </svg>
        <small>Ағын өзгерісінің шартты графигі</small>
      </div>`;
  }

  if(i===2){
    $("labVisual").innerHTML=diagram("lenz",lenzMode);
    $("labResult").textContent=lenzMode===0?
      "Индукциялық өріс ағынның артуына қарсы":
      "Индукциялық өріс ағынның кемуіне қарсы";
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
    !confirm("Қатысу өзгерсе, нәтижелер қайта басталады.")) return;

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
    if(!confirm("Барлық оқушы таңдалды. Жаңа айналым бастаймыз ба?")) return;
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

const teamNames=["Фарадей","Ленц","Индукция"];
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

  if(show&&people.length<3) return alert("Кемінде 3 қатысушы қажет.");

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
    <span class="eyebrow">ФИЗИКА · 1-КУРС · 3.5.2</span>

    <div class="card hero">
      <h1>
        <span class="blue">Электромагниттік индукция құбылысы.</span>
        <span class="green">Магнит ағыны.</span>
        Ампер күшінің жұмысы
      </h1>

      <div class="definition">
        <h3>Сабақтың мақсаты</h3>
        <p>Электромагниттік индукция құбылысын түсіну,
        магнит ағынын есептеу, Фарадей заңы мен Ленц
        ережесін меңгеру және Ампер күшінің жұмысын анықтау.</p>
      </div>

      <div class="grid2">
        ${diagram("induction")}
        ${diagram("flux")}
      </div>

      <div class="formula">${F.flux}<br>${F.emf}</div>

      <div class="grid3">
        <div class="card">
          <h3 class="blue">15 түсіндірме</h3><p>Жаңа тақырып</p>
        </div>
        <div class="card">
          <h3 class="green">24 есеп</h3><p>Рандом тапсырмалар</p>
        </div>
        <div class="card">
          <h3 class="gold">3 команда</h3><p>15 ойын сұрағы</p>
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
    ["Жаңа тақырып",20],
    ["Конспект жазу",12],
    ["Виртуалды зертхана",10],
    ["24 жеке есепті қатар орындау",20],
    ["Командалық ойын",12],
    ["Қорытынды және үй жұмысы",3]
  ];

  return slide(`
    <span class="eyebrow">САБАҚ ЖОСПАРЫ</span>
    <h2>80 минуттық сабақ</h2>
    <div class="card">
      ${plan.map(([n,t])=>`
        <div class="planRow">
          <b>${n}</b><span class="blue">${t} минут</span>
        </div>
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
      <h1>🎲 Электромагниттік индукция есептері</h1>
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
  const level=levelOf(a.taskId),done=completed.has(a.taskId);

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
        <p>${esc(s.name)}, есепті дәптерге шығарып,
        шешу жолын түсіндір.</p>
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
   КОМАНДАЛЫҚ ОЙЫН
===================================== */

function teamCards(){
  return `<div class="grid3">
    ${teamNames.map((n,i)=>`
      <div class="card">
        <h2>${teamIcons[i]}</h2>
        <h3 class="blue">${i+1}-топ — ${n}</h3>
        <p>${teamMembers(i).map(s=>esc(s.name)).join(", ")||"Қатысушы жоқ"}</p>
        <div class="score">${scores[i]} ұпай</div>
      </div>
    `).join("")}
  </div>`;
}

function quizIntro(){
  return slide(`
    <span class="eyebrow">КОМАНДАЛЫҚ ОЙЫН</span>
    <h1>🏆 Индукция әлемі</h1>

    ${teamCards()}

    <div class="card">
      <h3 class="green">Ойын ережесі</h3>
      <p>15 сұрақ. Әр командаға 5 сұрақтан беріледі.</p>
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
      <p>Орындалды деп белгіленген тапсырмалар.</p>
      <button onclick="openPanel('taskPanel')">Есептер тізімі</button>
    </div>

    ${teamCards()}

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
      <p>✓ Электромагниттік индукция құбылысы.</p>
      <p>✓ Магнит ағыны және оның өзгерісі.</p>
      <p>✓ Фарадей заңы және Ленц ережесі.</p>
      <p>✓ Ампер күшінің жұмысы.</p>
      <p>✓ Электромагниттік индукцияның қолданылуы.</p>
    </div>

    <button onclick="startQuiz()">↻ Қайта ойнау</button>
  `);
}

/* =====================================
   ЖАҢА ҮЙ ТАПСЫРМАСЫ
===================================== */

function homeworkPage(){
  return slide(`
    <span class="eyebrow">ҮЙ ТАПСЫРМАСЫ · 3.5.2</span>
    <h2>Үйге берілетін тапсырмалар</h2>

    <div class="card notebook">
      <span class="level easy">1-ТАПСЫРМА · СӘЙКЕСТЕНДІРУ</span>
      <h3 class="blue">Формуланы атауымен сәйкестендіріңдер</h3>

      <p>Дәптерге әр физикалық шаманың нөмірін
      және сәйкес формуланың әрпін жазыңдар.</p>

      <div class="grid2">
        <div class="card">
          <h3 class="green">Физикалық шамалар</h3>
          <p>1. Магнит ағыны</p>
          <p>2. Индукциялық ЭҚК модулі</p>
          <p>3. Магнит ағынының өзгерісі</p>
          <p>4. Ампер күшінің жұмысы</p>
          <p>5. Индукциялық ток күші</p>
        </div>

        <div class="card">
          <h3 class="blue">Формулалар</h3>
          <div class="data">А. A = IΔΦ</div>
          <div class="data">Ә. ΔΦ = Φ₂ − Φ₁</div>
          <div class="data">Б. ${F.current}</div>
          <div class="data">В. Φ = BS cos α</div>
          <div class="data">Г. ${F.emf}</div>
        </div>
      </div>

      <div class="example">
        <p>Жауап жазу үлгісі: 1 — ...; 2 — ...</p>
        <p>Жұмыс формуласы тұрақты токты бір орамды контурға,
        ал ток формуласы қарапайым резистивті контурға арналған.</p>
      </div>
    </div>

    <div class="card">
      <span class="level easy">2-ТАПСЫРМА · ФИЗИКА ӨМІРДЕ</span>
      <h3 class="green">Электромагниттік индукцияның қолданылуы</h3>

      <div class="grid3">
        ${["Генератор","Трансформатор","Индукциялық датчик"].map((n,i)=>`
          <div class="card">
            <h2 class="blue">${["⚡","≈","◉"][i]}</h2>
            <h3>${n}</h3>
          </div>
        `).join("")}
      </div>

      <p>Осы үш құрылғының біреуін таңдаңдар.</p>
      <div class="data">
        <p>1. Құрылғы не үшін қолданылатынын жазыңдар.</p>
        <p>2. Электромагниттік индукциямен байланысын түсіндіріңдер.</p>
        <p>3. Құрылғының қарапайым суретін дәптерге салыңдар.</p>
      </div>

      <div class="example">
        <p>Жалпы 4–5 сөйлем жеткілікті.
        Құрылғыны құрастыру немесе тәжірибе жасау қажет емес.</p>
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

  section("⚡ Виртуалды зертхана",labs.map((_,i)=>({
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
  sections.forEach((s,i)=>{if(current>=s.start) active=i;});

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

/* ҚАЗАҚША ДАУЫСТАП ОҚУ */

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

/* МАТЕМАТИКАЛЫҚ ПАРСЕР */

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
    if(t[p]==="^"){p++;x=x**unary();}
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
  phi:["Магнит ағыны","Вб","Φ"],
  phi1:["Бастапқы ағын","Вб","Φ₁"],
  phi2:["Соңғы ағын","Вб","Φ₂"],
  delta:["Ағын өзгерісі","Вб","ΔΦ"],
  emf:["ЭҚК модулі","В","|ε|"],
  N:["Орам саны","","N"],
  B:["Магнит индукциясы","Тл","B"],
  S:["Аудан","м²","S"],
  alpha:["Бұрыш","°","α"],
  beta:["Күш пен орын ауыстыру бұрышы","°","β"],
  I:["Ток күші","А","I"],
  R:["Кедергі","Ом","R"],
  U:["Кернеу","В","U"],
  t:["Уақыт","с","t"],
  A:["Жұмыс","Дж","A"],
  force:["Күш","Н","F"],
  s:["Орын ауыстыру","м","s"],
  l:["Ұзындық","м","l"],
  P:["Қуат","Вт","P"],
  q:["Заряд модулі","Кл","q"]
};

const physics=[
  {
    name:"Магнит ағыны — Φ = BS cos α",
    vars:["phi","B","S","alpha"],
    solve:{
      phi:v=>v.B*v.S*cos(v.alpha),
      B:v=>v.phi/(v.S*cos(v.alpha)),
      S:v=>v.phi/(v.B*cos(v.alpha)),
      alpha:v=>Math.acos(v.phi/(v.B*v.S))*180/Math.PI
    }
  },
  {
    name:"Магнит ағынының өзгерісі",
    vars:["delta","phi1","phi2"],
    solve:{
      delta:v=>v.phi2-v.phi1,
      phi1:v=>v.phi2-v.delta,
      phi2:v=>v.phi1+v.delta
    }
  },
  {
    name:"Фарадей заңы — ЭҚК модулі",
    vars:["emf","N","delta","t"],
    solve:{
      emf:v=>v.N*Math.abs(v.delta)/v.t,
      t:v=>v.N*Math.abs(v.delta)/v.emf
    }
  },
  {
    name:"Индукциялық ток",
    vars:["I","emf","R"],
    solve:{
      I:v=>v.emf/v.R,
      emf:v=>v.I*v.R,
      R:v=>v.emf/v.I
    }
  },
  {
    name:"Ампер жұмысы — A = IΔΦ",
    vars:["A","I","delta"],
    solve:{
      A:v=>v.I*v.delta,
      I:v=>v.A/v.delta,
      delta:v=>v.A/v.I
    }
  },
  {
    name:"Механикалық жұмыс",
    vars:["A","force","s","beta"],
    solve:{
      A:v=>v.force*v.s*cos(v.beta),
      force:v=>v.A/(v.s*cos(v.beta)),
      s:v=>v.A/(v.force*cos(v.beta))
    }
  },
  {
    name:"Ампер күші",
    vars:["force","B","I","l","alpha"],
    solve:{
      force:v=>v.B*v.I*v.l*Math.sin(v.alpha*Math.PI/180)
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
    name:"Электр қуаты",
    vars:["P","U","I"],
    solve:{
      P:v=>v.U*v.I,
      U:v=>v.P/v.I,
      I:v=>v.P/v.U
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
    <label>${units[k][0]} ${units[k][1]?"("+units[k][1]+")":""}</label>
    <input id="phys_${k}" type="text" placeholder="Мәні">
  `).join("");

  $("physicsResult").textContent="Нәтиже";
  clampPanel($("physicsPanel"));
}

function validatePhysics(k,n){
  if(!Number.isFinite(n)) throw Error("Мән анықталмаған");

  if(!["phi","phi1","phi2","delta","A"].includes(k)&&n<0)
    throw Error("Теріс мән енгізілмейді");

  if(["alpha","beta"].includes(k)&&n>180)
    throw Error("Бұрыш 0–180° болуы керек");

  if(k==="N"&&(!Number.isInteger(n)||n<1))
    throw Error("Орам саны оң бүтін сан");

  if(k==="t"&&n===0)
    throw Error("Уақыт нөл болмауы керек");

  if(k==="R"&&n===0)
    throw Error("Кедергі нөл болмауы керек");
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
      validatePhysics(k,n);
      values[k]=n;
    });

    const result=f.solve[unknown](values);
    validatePhysics(unknown,result);

    $("physicsResult").textContent=
      `${units[unknown][2]} = ${num(result)} ${units[unknown][1]}`;

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

/* ҚАЛАМНЫҢ ДӘЛ КООРДИНАТАЛАРЫ */

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

/* ҚАЛАМ, САУСАҚ, ТІНТУІР */

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

  draft=null;
  pan=null;
  pointer=null;

  if(id!==null&&canvas.hasPointerCapture(id))
    canvas.releasePointerCapture(id);

  renderBoard();
}

canvas.addEventListener("pointerup",e=>finishDrawing(e));
canvas.addEventListener("pointercancel",e=>finishDrawing(e,true));
canvas.addEventListener("lostpointercapture",e=>finishDrawing(e,true));

/* ТАҚТА БЕТТЕРІ */

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
    a.download=`physics-352-board-${page}.png`;

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

console.log("PHYSICS LAB PRO — 3.5.2");
console.log("Түсіндірме:",theory.length);
console.log("Конспект:",notes.length);
console.log("Жеке есептер:",tasks.length);
console.log("Командалық сұрақтар:",quiz.length);
console.log("Барлық беттер:",pages.length);

/* BY DARKHAN */
