
"use strict";

const $=id=>document.getElementById(id);
const num=n=>Number.isFinite(n)?
  String(Number(n.toPrecision(9))).replace(".",","):"Қате";
const frac=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const formula=s=>`<div class="formula">${s}</div>`;
const card=s=>`<div class="card">${s}</div>`;
const heading=(s,t)=>`<span class="eyebrow">${s}</span><h2>${t}</h2>`;

const TOPIC=/(^|\/)fiz5(\/|$)/i.test(location.pathname)?"333":"332";
const isMetal=TOPIC==="332";

const names=[
  "Рамазан","Тұрғанжан","Нұрай","Әлқуат",
  "Шырай","Гүлсезім","Маржан","Мариям",
  "Жансая","Азиза","Ақсезім","Нұрболсын",
  "Ақнұр","Іңкәр","Асхат","Аяжан",
  "Мирас","Санжар","Ерасыл","Нұрасыл",
  "Расул","Айнұр","Дархан","Айкерім"
];

/* =====================================
   3.3.2 — МЕТАЛДАРДАҒЫ ЭЛЕКТР ТОГЫ
===================================== */

const metal={
  number:"3.3.2",
  title:"Металдардағы электр тогы. Асқынөткізгіштік. Жартылай өткізгіштердегі электр тогы.",
  goal:"Металдар мен жартылай өткізгіштердегі токтың табиғатын түсіну, кедергінің температураға тәуелділігін анықтау және асқынөткізгіштік құбылысын сипаттау.",
  teams:["Электрон","Кристалл","Жартылай өткізгіш"],
  theory:[
    ["Металдардағы электр тогы",
     "Металдардағы электр тогы — еркін электрондардың бағытталған қозғалысы.",
     "Металдың кристалдық торында оң иондар орналасады. Еркін электрондар электр өрісінің әсерінен бағытталған қозғалыс жасайды. Осы қозғалыс электр тогын тудырады.",
     "I = "+frac("q","t"),
     "Мыс және алюминий электр тогын жақсы өткізеді.","metal"],

    ["Кристалдық тор",
     "Металдың атомдары белгілі бір тәртіппен орналасып, кристалдық тор құрайды.",
     "Тордағы иондар тепе-теңдік орнының маңында тербеледі. Еркін электрондардың тордағы бөлшектермен шашырауы электр кедергісінің пайда болуына әсер етеді.",
     "Кристалдық тор + еркін электрондар",
     "Температура көтерілгенде тордың жылулық тербелісі күшейеді.","lattice"],

    ["Еркін электрондар",
     "Еркін электрондар металдың ішінде қозғала алатын заряд тасымалдаушылар.",
     "Электр өрісі болмаған кезде электрондар ретсіз қозғалады. Өріс пайда болғанда олардың ретсіз қозғалысына бағытталған дрейф қосылады.",
     "qₑ = −1,6 × 10⁻¹⁹ Кл",
     "Электрондардың қозғалыс бағыты шартты ток бағытына қарама-қарсы.","metal"],

    ["Ток күші және заряд",
     "Ток күші өткізгіштің көлденең қимасынан уақыт бірлігінде өтетін зарядты сипаттайды.",
     "Бірдей уақыт ішінде көбірек заряд өткен сайын ток күші үлкен болады. Ток күші ампермен, заряд кулонмен өлшенеді.",
     "I = "+frac("q","t")+"; q = It",
     "4 Кл заряд 2 секундта өтсе, ток күші 2 А болады.","formula"],

    ["Электр кедергісі",
     "Кедергі — өткізгіштің электр тогына қарсы әсерін сипаттайтын физикалық шама.",
     "Өткізгіштің кедергісі материалына, ұзындығына, көлденең қимасының ауданына және температурасына тәуелді.",
     "R = "+frac("ρl","S"),
     "Бірдей материал мен қимада ұзын өткізгіштің кедергісі үлкен.","wire"],

    ["Меншікті кедергі",
     "Меншікті кедергі материалдың электрлік қасиетін сипаттайды.",
     "Меншікті кедергі ρ әрпімен белгіленеді. Оның халықаралық өлшем бірлігі — Ом·м. Металдардың меншікті кедергілері әртүрлі.",
     "ρ = "+frac("RS","l"),
     "Мыс электр техникасында меншікті кедергісі аз болғандықтан пайдаланылады.","wire"],

    ["Ом заңы",
     "Тізбек бөлігіндегі ток күші кернеуге тура, кедергіге кері пропорционал.",
     "Температура және басқа физикалық жағдайлар тұрақты болғанда омдық өткізгіштің ток күші мен кернеуі сызықтық байланыста болады.",
     "I = "+frac("U","R"),
     "U = 12 В, R = 6 Ом болса, I = 2 А.","graph"],

    ["Температураның әсері",
     "Кәдімгі металдардың электр кедергісі температура артқанда көбіне өседі.",
     "Температура жоғарылаған сайын кристалдық тордың тербелісі күшейіп, электрондардың шашырауы артады. Сондықтан металдың кедергісі жоғарылайды.",
     "R = R₀[1 + α(t − t₀)]",
     "Бұл формула температураның шектеулі аралығындағы жуық модель.","temperature"],

    ["Температуралық коэффициент",
     "Температуралық коэффициент кедергінің температураға тәуелділігін сипаттайды.",
     "α коэффициенті металл түріне байланысты. Кедергінің салыстырмалы өзгерісі сызықтық жуықтауда температура айырмасына пропорционал.",
     "α = "+frac("R − R₀","R₀Δt"),
     "α өлшем бірлігі — К⁻¹.","temperature"],

    ["Асқынөткізгіштік",
     "Асқынөткізгіштік — белгілі жағдайларда материалдың тұрақты токқа электр кедергісінің нөлге дейін төмендеуі.",
     "Кейбір материалдар критикалық температурадан төменде асқынөткізгіш күйге өтеді. Бұл күй критикалық магнит өрісі мен ток сияқты басқа шектерге де тәуелді.",
     "R = 0 — асқынөткізгіш күйде",
     "Асқынөткізгіштік кәдімгі металдың кедергісінің жай азаюынан өзгеше.","super"],

    ["Критикалық температура",
     "Критикалық температура — материалдың асқынөткізгіш күйге ауысу шегі.",
     "Материалдың температурасы критикалық мәннен жоғары болса, ол қалыпты күйде болады. Асқынөткізгіштік кезінде Мейснер эффектісі, яғни магнит өрісінің ығыстырылуы да байқалады.",
     "Tс — критикалық температура",
     "Критикалық температура әр материал үшін әртүрлі.","super"],

    ["Жартылай өткізгіштер",
     "Жартылай өткізгіштердің электр өткізгіштігі өткізгіштер мен диэлектриктер арасындағы қасиеттерді көрсетеді.",
     "Олардың электр өткізгіштігі температураға, жарыққа және қоспалардың құрамына айтарлықтай тәуелді. Кремний мен германий — кең таралған мысалдар.",
     "Кремний (Si) · Германий (Ge)",
     "Жартылай өткізгіштер микроэлектрониканың негізін құрайды.","semi"],

    ["Электрондар мен кемтіктер",
     "Жартылай өткізгіштерде зарядты электрондар және кемтіктер тасымалдайды.",
     "Кемтік — электронның болмауына байланысты пайда болатын оң заряд тасымалдаушының шартты сипаттамасы. Электрондар мен кемтіктер электр өрісінде қарама-қарсы бағытта дрейф жасайды.",
     "Электрон: −e; кемтік: +e",
     "Меншікті жартылай өткізгіште электрондар мен кемтіктер жұппен пайда болады.","semi"],

    ["n-типті және p-типті материал",
     "Қоспалы жартылай өткізгіштерде негізгі заряд тасымалдаушылардың түрі қоспаға байланысты.",
     "n-типті материалда негізгі тасымалдаушылар — электрондар. p-типті материалда — кемтіктер. Екі материал да жалпы алғанда электрлік бейтарап бола алады.",
     "n-тип — электрондар; p-тип — кемтіктер",
     "Осы екі типтің шекарасы p–n ауысу деп аталады.","pn"],

    ["Жартылай өткізгіштердің қолданылуы",
     "Жартылай өткізгіштер заманауи электрондық құрылғыларда кең қолданылады.",
     "Диод, транзистор, микропроцессор және күн элементтері жартылай өткізгіштік қасиеттерге негізделген. p–n ауысуы диодтардың маңызды жұмыс принципін түсіндіреді.",
     "Диод · Транзистор · Күн элементі",
     "Компьютерлер мен телефондардың микросхемаларында жартылай өткізгіштер бар.","pn"]
  ],
  noteIds:[0,1,3,4,6,7,9,11,12,13],
  quiz:[
    ["Металдағы негізгі заряд тасымалдаушы?",["Ион","Электрон","Нейтрон","Протон"],1],
    ["Кедергінің бірлігі?",["Вольт","Ампер","Ом","Ватт"],2],
    ["Ом заңы?",["I = U/R","I = UR","I = Rt","I = qR"],0],
    ["Кристалдық тордың жылулық тербелісі қызғанда?",["Жойылады","Тоқтайды","Өзгермейді","Күшейеді"],3],
    ["Меншікті кедергі белгісі?",["α","ρ","I","q"],1],
    ["Металдың кедергісі қызғанда көбіне?",["Азаяды","Нөл болады","Артады","Өзгермейді"],2],
    ["Асқынөткізгіш күйдегі тұрақты ток кедергісі?",["Нөл","1 Ом","100 Ом","Шексіз"],0],
    ["Критикалық температураның белгісі?",["U","R","I","Tс"],3],
    ["Жартылай өткізгішке мысал?",["Мыс","Кремний","Темір","Күміс"],1],
    ["p-типтің негізгі тасымалдаушысы?",["Нейтрон","Фотон","Кемтік","Протон"],2],
    ["n-типтің негізгі тасымалдаушысы?",["Электрон","Кемтік","Нейтрон","Молекула"],0],
    ["Кернеу тұрақты, кедергі екі есе артса ток?",["Артады","Төрт есе артады","Өзгермейді","Екі есе азаяды"],3],
    ["U = 12 В, R = 4 Ом. Ток күші?",["2 А","3 А","4 А","48 А"],1],
    ["Электронның заряды?",["Оң","Нөл","Теріс","Айнымалы"],2],
    ["Жартылай өткізгіштікке негізделген құрылғы?",["Транзистор","Серіппе","Термос","Сызғыш"],0]
  ],
  homework:`
    <h3 class="blue">1-тапсырма. Қатені түзет</h3>
    <p>Төмендегі тұжырымдардың дұрыс нұсқасын дәптерге жазыңдар:</p>
    <p>а) Металдағы токты нейтрондар тасымалдайды.</p>
    <p>ә) Асқынөткізгіштің электр кедергісі өте үлкен болады.</p>
    <p>б) n-типті жартылай өткізгіштің негізгі тасымалдаушысы — кемтік.</p>
    <h3 class="green">2-тапсырма. Есеп шығару</h3>
    <p>Металдың бастапқы кедергісі 20 Ом. Температуралық коэффициенті
    0,004 К⁻¹. Температурасы 50 К-ге артқанда кедергісі қанша болады?</p>
    <p>Берілгенін, формуласын және шешуін жазыңдар.</p>`
};

/* =====================================
   3.3.3 — ЭЛЕКТРОЛИЗ ЗАҢДАРЫ
===================================== */

const electro={
  number:"3.3.3",
  title:"Электролиттердің балқытпалары мен ерітіндісіндегі электр тогы. Электролиз заңдары.",
  goal:"Электролиттердегі заряд тасымалдаушыларды ажырату, электролиздің физикалық мағынасын түсіну және Фарадей заңдарын есептерде қолдану.",
  teams:["Фарадей","Катион","Анион"],
  theory:[
    ["Электролиттер",
     "Электролиттер — ерітінділері немесе балқытпалары иондардың қозғалысы арқылы ток өткізе алатын заттар.",
     "Электролиттегі заряд тасымалдаушылар еркін электрондар емес, оң және теріс иондар. Иондардың бағытталған қозғалысы электр тогын тудырады.",
     "Электр тогы → Иондардың қозғалысы",
     "Тұздардың, қышқылдардың және негіздердің көптеген ерітінділері электролиттерге жатады.","ions"],

    ["Электролиттік диссоциация",
     "Электролиттің ерітіндіде иондарға бөліну құбылысы электролиттік диссоциация деп аталады.",
     "Еріген заттың бөлшектері оң және теріс иондарға ажырауы мүмкін. Ерітіндідегі иондар ретсіз жылулық қозғалыс жасайды.",
     "NaCl → Na⁺ + Cl⁻",
     "Бұл өрнек диссоциацияның химиялық белгіленуін көрсетеді.","ions"],

    ["Катиондар",
     "Оң зарядталған иондар катиондар деп аталады.",
     "Электр өрісі катиондарға өріс бағытымен әсер етеді. Электролиз кезінде катиондар катодқа қарай қозғалады.",
     "Катион: оң заряд (+)",
     "Na⁺ және Cu²⁺ — катиондардың мысалдары.","cation"],

    ["Аниондар",
     "Теріс зарядталған иондар аниондар деп аталады.",
     "Теріс зарядталған иондарға электр өрісі қарама-қарсы бағытта әсер етеді. Электролиз кезінде аниондар анодқа қарай қозғалады.",
     "Анион: теріс заряд (−)",
     "Cl⁻ және SO₄²⁻ — аниондардың мысалдары.","anion"],

    ["Электродтар",
     "Электродтар — электр тізбегі мен электролит арасындағы ток алмасуына қатысатын өткізгіштер.",
     "Электролиздік ұяшықта катод теріс, анод оң электрод болады. Катодта тотықсыздану, анодта тотығу жүреді.",
     "Катод (−) · Анод (+)",
     "Электродтардағы құбылыстар заряд алмасуымен байланысты.","ions"],

    ["Электролиттердегі электр тогы",
     "Электролиттегі электр тогы оң және теріс иондардың бағытталған қозғалысы арқылы жүзеге асады.",
     "Катиондар мен аниондар қарама-қарсы бағытта қозғалғанымен, олардың электр тогына қосқан үлестері шартты ток бағыты бойынша қосылады.",
     "I = "+frac("q","t"),
     "Ток күші зарядтың уақыт бойынша өтуін сипаттайды.","ions"],

    ["Электролиз құбылысы",
     "Электролиз — электр тогының әсерінен электродтарда химиялық өзгерістердің жүруі.",
     "Электролиз кезінде электр энергиясы химиялық өзгерістерге жұмсалады. Өнімдердің түрі электролит пен электродтардың қасиеттеріне және басқа жағдайларға тәуелді.",
     "Электр энергиясы → Химиялық өзгеріс",
     "Электролиз металдарды өнеркәсіптік тазартуда қолданылады.","ions"],

    ["Фарадейдің бірінші заңы",
     "Электродта бөлінетін заттың массасы электролит арқылы өткен зарядқа тура пропорционал.",
     "Масса m әрпімен, заряд q әрпімен, электрохимиялық эквивалент k әрпімен белгіленеді. Формула берілген электродтық процесс үшін қолданылады.",
     "m = kq",
     "Заряд екі есе артса, бірдей жағдайда бөлінетін теориялық масса екі есе артады.","linear"],

    ["Заряд және уақыт",
     "Тұрақты ток кезінде электр заряды ток күші мен уақыттың көбейтіндісіне тең.",
     "Фарадейдің бірінші заңына q = It өрнегін қойсақ, заттың массасын ток күші мен уақыт арқылы өрнектеуге болады.",
     "q = It; m = kIt",
     "Ток тұрақты болса, масса уақытқа тура пропорционал.","linear"],

    ["Электрохимиялық эквивалент",
     "Электрохимиялық эквивалент бір кулон зарядқа сәйкес бөлінетін теориялық массаны сипаттайды.",
     "Оның SI жүйесіндегі өлшем бірлігі — кг/Кл. Есептерде масса граммен берілсе, k шамасын г/Кл түрінде де қолдануға болады.",
     "k = "+frac("m","q"),
     "Массаның және k шамасының бірліктері өзара сәйкес болуы керек.","formula"],

    ["Фарадейдің екінші заңы",
     "Әртүрлі заттардың электрохимиялық эквиваленті олардың молярлық массасы мен заряд алмасу санына тәуелді.",
     "Молярлық масса M, бір бөлшекке сәйкес электрондар саны z, Фарадей тұрақтысы F арқылы белгіленеді.",
     "k = "+frac("M","zF"),
     "z — электродтық реакцияға сәйкес электрондар саны.","formula"],

    ["Фарадей тұрақтысы",
     "Фарадей тұрақтысы бір моль электронның заряд модуліне тең.",
     "Оқу есептерінде F шамасының жуық мәні 96500 Кл/моль деп алынады. Ол заряд пен зат мөлшерінің байланысын сипаттайды.",
     "F ≈ 96500 Кл/моль",
     "q = 96500 Кл заряд шамамен бір моль электронға сәйкес келеді.","formula"],

    ["Электролиздің жалпы формуласы",
     "Фарадейдің екі заңын біріктіріп, электродта бөлінетін теориялық массаны есептеуге болады.",
     "Бұл қатынас берілген электродтық реакция үшін, заряд толық сол процеске жұмсалады деген идеалданған жағдайда қолданылады.",
     "m = "+frac("MIt","zF"),
     "M грамм/моль болса, нәтиже граммен шығады.","linear"],

    ["Ток бойынша шығым",
     "Нақты электродтық процесте өлшенген масса теориялық массадан өзгеше болуы мүмкін.",
     "Пайдалы процеске жұмсалған ток үлесін ток бойынша шығым сипаттайды. Оны пайызбен көрсетуге болады.",
     "η = "+frac("mнақты","mтеориялық")+" × 100%",
     "Теориялық масса 10 г, нақты масса 8 г болса, шығым 80%.","efficiency"],

    ["Электролиздің қолданылуы",
     "Электролиз өнеркәсіптік металлургия мен химиялық технологияда қолданылады.",
     "Электрохимиялық әдістер металдарды өндіруге, тазартуға және қорғаныш жабындарын алуға мүмкіндік береді. Өнеркәсіптік процестер арнайы бақыланатын жабдықтарда жүргізіледі.",
     "Металлургия · Электрохимия · Қорғаныш жабындары",
     "Бұл сабақта құбылысты теориялық және виртуалды модельдермен зерттейміз.","ions"]
  ],
  noteIds:[0,1,2,3,4,6,7,9,10,12],
  quiz:[
    ["Электролиттегі заряд тасымалдаушылар?",["Нейтрондар","Иондар","Фотондар","Тек электрондар"],1],
    ["Оң зарядталған ион?",["Анион","Атом","Катион","Нейтрон"],2],
    ["Теріс зарядталған ион?",["Анион","Катион","Протон","Кемтік"],0],
    ["Катион қай электродқа қозғалады?",["Анод","Екеуіне де","Ешқайсысына","Катод"],3],
    ["Электролиздің бірінші заңы?",["m = UI","m = kq","m = ρS","m = IR"],1],
    ["Фарадей тұрақтысының бірлігі?",["Ом","Ватт","Кл/моль","Тесла"],2],
    ["Тұрақты токтағы заряд?",["q = It","q = I/t","q = IR","q = Pt"],0],
    ["Электрохимиялық эквивалент белгісі?",["R","U","F","k"],3],
    ["Фарадей тұрақтысының жуық мәні?",["965","96500","100","273"],1],
    ["Электролиз кезінде катодта?",["Булану ғана","Балқу ғана","Тотықсыздану","Тотығу"],2],
    ["Анион қайда қозғалады?",["Анодқа","Катодқа","Ешқайда","Тек жоғары"],0],
    ["Электролиттік диссоциация нәтижесі?",["Фотондар","Нейтрондар","Тек газ","Иондар"],3],
    ["I = 2 А, t = 5 с. Заряд?",["2 Кл","10 Кл","5 Кл","7 Кл"],1],
    ["Ток бойынша шығымның бірлігі?",["Ом","Кулон","Пайыз","Вебер"],2],
    ["Электролиз қай салада қолданылады?",["Металлургияда","Геометрияда","Астрономиялық картада","Музыкалық нотада"],0]
  ],
  homework:`
    <h3 class="blue">1-тапсырма. Сызба арқылы түсіндір</h3>
    <p>Дәптерге электролиттегі оң және теріс иондардың шартты
    сызбасын сал. Катион мен анионның бағытын бағдаршамен көрсет.
    Катод пен анодтың таңбаларын белгіле.</p>
    <h3 class="green">2-тапсырма. Қарапайым есеп</h3>
    <p>Берілген теориялық электродтық процесс үшін электрохимиялық
    эквивалент 0,0004 г/Кл, өткен заряд 2500 Кл.
    Бөлінетін теориялық массаны анықта.</p>
    <p>m = kq формуласын қолдан. Нақты тәжірибе жасау қажет емес.</p>`
};

const lesson=isMetal?metal:electro;

/* =====================================
   ӘР ТАҚЫРЫПҚА 24 ЖЕКЕ ЕСЕП
   8 ОҢАЙ + 8 ОРТАША + 8 КҮРДЕЛІ
===================================== */

const tasks=[];

function task(title,question,given,answer){
  tasks.push({title,question,given,answer});
}

for(let level=0;level<3;level++){
  for(let i=0;i<8;i++){
    const n=i+1;

    if(isMetal){
      if(level===0 && i%2===0){
        const q=6*n,t=3;
        task("Ток күшін анықтау",
          `${q} Кл заряд ${t} секунд ішінде өтті. Ток күшін тап.`,
          `q = ${q} Кл; t = ${t} с`,
          `I = ${frac(q,t)} = ${num(q/t)} А`);
      }else if(level===0){
        const U=6*n,R=3;
        task("Ом заңы",
          `Металл өткізгіштің кернеуі ${U} В, кедергісі ${R} Ом. Ток күшін анықта.`,
          `U = ${U} В; R = ${R} Ом`,
          `I = ${frac(U,R)} = ${num(U/R)} А`);
      }else if(level===1 && i%2===0){
        const R=10+5*n,d=20+10*n,a=0.004;
        task("Температураға тәуелді кедергі",
          `Бастапқы кедергі ${R} Ом. Температура ${d} К-ге артты. α = 0,004 К⁻¹. Жаңа кедергіні тап.`,
          `R₀ = ${R} Ом; Δt = ${d} К`,
          `R = ${R}(1 + 0,004 × ${d}) = ${num(R*(1+a*d))} Ом`);
      }else if(level===1){
        const rho=0.017,l=10*n,S=2;
        task("Өткізгіштің кедергісі",
          `Меншікті кедергі 0,017 Ом·мм²/м, ұзындық ${l} м, қима ауданы ${S} мм². Кедергіні анықта.`,
          `ρ = 0,017 Ом·мм²/м; l = ${l} м; S = ${S} мм²`,
          `R = ${frac("0,017 × "+l,S)} = ${num(rho*l/S)} Ом`);
      }else if(i%2===0){
        const R=10*n,d=50,U=12*n;
        const R2=R*(1+0.004*d);
        task("Қызған металл өткізгіш",
          `Бастапқы кедергі ${R} Ом, кернеу ${U} В. Температура 50 К-ге артты, α = 0,004 К⁻¹. Жаңа кедергі мен ток күшін тап.`,
          `R₀ = ${R} Ом; U = ${U} В; Δt = 50 К`,
          `R = ${num(R2)} Ом<br>I = ${frac(U,num(R2))} = ${num(U/R2)} А`);
      }else{
        const R1=20*n,R2=R1*1.2;
        task("Температуралық коэффициент",
          `Температура 50 К-ге артқанда кедергі ${R1} Ом-нан ${num(R2)} Ом-ға өсті. α коэффициентін және пайыздық өзгерісті тап.`,
          `R₀ = ${R1} Ом; R = ${num(R2)} Ом; Δt = 50 К`,
          `α = ${frac(num(R2-R1),R1+" × 50")} = 0,004 К⁻¹<br>Өсуі: 20%`);
      }
    }else{
      if(level===0 && i%2===0){
        const I=n,t=10;
        task("Электр зарядын анықтау",
          `Теориялық контурда ток күші ${I} А, уақыт ${t} с. Өткен зарядты тап.`,
          `I = ${I} А; t = ${t} с`,
          `q = It = ${I} × ${t} = ${I*t} Кл`);
      }else if(level===0){
        const q=1000*n,k=0.0005;
        task("Фарадейдің бірінші заңы",
          `Берілген идеал модельде k = 0,0005 г/Кл, q = ${q} Кл. Теориялық массаны тап.`,
          `k = 0,0005 г/Кл; q = ${q} Кл`,
          `m = kq = 0,0005 × ${q} = ${num(k*q)} г`);
      }else if(level===1 && i%2===0){
        const q=965*n,M=40,z=2;
        task("Фарадейдің екінші заңы",
          `Шартты есепте M = 40 г/моль, z = 2, q = ${q} Кл. Теориялық массаны анықта.`,
          `F = 96500 Кл/моль; M = 40 г/моль; q = ${q} Кл`,
          `m = ${frac(M+" × "+q,z+" × 96500")} = ${num(M*q/(z*96500))} г`);
      }else if(level===1){
        const m=2*n,q=4000*n;
        task("Электрохимиялық эквивалент",
          `Шартты деректерде ${m} г массаға ${q} Кл заряд сәйкес келеді. k шамасын тап.`,
          `m = ${m} г; q = ${q} Кл`,
          `k = ${frac(m,q)} = ${num(m/q)} г/Кл`);
      }else if(i%2===0){
        const m=5*n,eta=80+i;
        task("Ток бойынша шығым",
          `Теориялық масса ${m} г, ток бойынша шығым ${eta}%. Нақты масса мен масса айырмасын анықта.`,
          `mтеор = ${m} г; η = ${eta}%`,
          `mнақты = ${num(m*eta/100)} г<br>Айырмасы = ${num(m*(1-eta/100))} г`);
      }else{
        const M=60,q=1930*n,z=2,eta=90;
        const m=M*q/(z*96500);
        task("Теориялық және нақты масса",
          `Шартты модельде M = ${M} г/моль, z = ${z}, q = ${q} Кл, шығым 90%. Екі массаны есепте.`,
          `F = 96500 Кл/моль; η = ${eta}%`,
          `mтеор = ${frac(M+" × "+q,z+" × 96500")} = ${num(m)} г<br>mнақты = ${num(m*.9)} г`);
      }
    }
  }
}

/* =====================================
   ВИЗУАЛДЫ СЫЗБАЛАР
===================================== */

function diagram(type){
  let content="";
  const text=(x,y,s,c="#19364f",size=18)=>
    `<text x="${x}" y="${y}" fill="${c}" font-size="${size}"
     font-weight="600" text-anchor="middle">${s}</text>`;
  const arrow=(x,y,X,Y,c)=>`<line x1="${x}" y1="${y}"
    x2="${X}" y2="${Y}" stroke="${c}" stroke-width="3"
    marker-end="url(#arr)"/>`;

  if(["metal","lattice","wire","semi","pn"].includes(type)){
    content=`<rect x="20" y="30" width="400" height="200" rx="15" fill="#deedfa"/>`;
    for(let i=0;i<24;i++){
      const x=50+(i%6)*68,y=56+Math.floor(i/6)*49;
      content+=`<circle cx="${x}" cy="${y}" r="12" fill="#aac7dd"/>`;
      content+=text(x,y+5,"+", "#fff",14);
    }
    if(type!=="lattice"){
      for(let i=0;i<7;i++){
        const x=40+i*56,y=80+(i%3)*50;
        content+=`<circle cx="${x}" cy="${y}" r="8" fill="#087dcc"/>`;
        content+=text(x,y+4,"−","white",12);
      }
      content+=arrow(330,245,90,245,"#087dcc");
      content+=text(220,275,"Электрондардың дрейфі","#087dcc",16);
    }else content+=text(220,265,"Кристалдық тор");
    if(type==="pn"){
      content=`<rect x="20" y="45" width="200" height="170" fill="#ffdfeb"/>
      <rect x="220" y="45" width="200" height="170" fill="#d7edff"/>
      ${text(120,85,"p-тип","#d63a50",26)}
      ${text(320,85,"n-тип","#087dcc",26)}
      ${text(120,150,"+  +  +","#d63a50",28)}
      ${text(320,150,"−  −  −","#087dcc",28)}
      ${text(220,250,"p–n ауысу")}`;
    }
  }else if(["ions","cation","anion"].includes(type)){
    content=`<rect x="25" y="35" width="390" height="210" rx="18" fill="#e2f3ff"/>
    <rect x="35" y="55" width="20" height="170" fill="#087dcc"/>
    <rect x="385" y="55" width="20" height="170" fill="#d63a50"/>
    ${text(75,25,"Катод −","#087dcc")}
    ${text(365,25,"Анод +","#d63a50")}`;
    for(let i=0;i<8;i++){
      const x=120+(i%4)*70,y=90+Math.floor(i/4)*90;
      const positive=i%2===0;
      const c=positive?"#d63a50":"#087dcc";
      content+=`<circle cx="${x}" cy="${y}" r="16" fill="${c}"/>`;
      content+=text(x,y+6,positive?"+":"−","white",20);
      content+=arrow(x,y+25,x+(positive?-45:45),y+25,c);
    }
    content+=text(220,270,"Иондардың шартты қозғалысы");
  }else if(type==="super"){
    content=`<path d="M45 20 V230 H415" fill="none" stroke="#19364f" stroke-width="2"/>
    <path d="M45 230 H180 V140 L400 45" fill="none" stroke="#087dcc" stroke-width="4"/>
    <path d="M180 40 V230" stroke="#d63a50" stroke-dasharray="5 5"/>
    ${text(180,260,"Tс","#d63a50")}
    ${text(25,30,"R")}${text(410,255,"T")}
    ${text(105,210,"R = 0","#16874e",20)}`;
  }else if(["graph","linear","temperature","efficiency"].includes(type)){
    content=`<path d="M45 20 V230 H410" stroke="#19364f" stroke-width="2" fill="none"/>
    <path d="M50 220 L395 40" stroke="#087dcc" stroke-width="4" fill="none"/>
    ${text(25,30,type==="temperature"?"R":type==="graph"?"I":"m")}
    ${text(407,255,type==="temperature"?"t":type==="graph"?"U":"q")}
    ${text(220,272,"Сапалық тәуелділік","#16874e",16)}`;
  }else{
    content=`<rect x="20" y="25" width="400" height="230" rx="18" fill="#dcefff"/>
    ${text(220,100,isMetal?"I = U / R":"m = kq","#087dcc",40)}
    ${text(220,185,isMetal?"q = It":"q = It","#16874e",34)}`;
  }

  return `<div class="visual"><svg viewBox="0 0 440 290">
    <defs><marker id="arr" markerWidth="6" markerHeight="6"
    refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z"
    fill="#38576e"/></marker></defs>${content}</svg>
    <small>Түсіндірмеге арналған шартты сызба</small></div>`;
}

/* =====================================
   3 ВИРТУАЛДЫ ЗЕРТХАНА
===================================== */

const labs=isMetal?[
  ["Ом заңы","Кернеу, В",0,20,8,1,
    x=>`I = ${num(x/4)} А`,
    "Кедергі 4 Ом болатын математикалық модель.","graph"],
  ["Металдың кедергісі","Температура өзгерісі, К",0,100,20,5,
    x=>`R = ${num(20*(1+.004*x))} Ом`,
    "R₀ = 20 Ом; α = 0,004 К⁻¹.","temperature"],
  ["Асқынөткізгіштік","Шартты температура, К",1,30,8,1,
    x=>x<10?"Асқынөткізгіш күй: R = 0":x===10?"Критикалық шек":"Қалыпты күй",
    "Шартты критикалық температура 10 К. Басқа шарттар орындалған деп есептеледі.","super"]
]:[
  ["Заряд пен масса","Шартты заряд, Кл",0,5000,1000,100,
    x=>`m = ${num(x*.0005)} г`,
    "k = 0,0005 г/Кл болатын теориялық модель.","linear"],
  ["Фарадей тұрақтысы","Заряд, Кл",0,96500,19300,965,
    x=>`ν(e⁻) = ${num(x/96500)} моль`,
    "Электрондардың зат мөлшері ν = q/F.","formula"],
  ["Ток бойынша шығым","Шығым, %",0,100,80,5,
    x=>`mнақты = ${num(10*x/100)} г`,
    "Теориялық масса 10 г болатын шартты модель.","efficiency"]
];

function labPage(i){
  const l=labs[i];
  return heading("ВИРТУАЛДЫ ЗЕРТХАНА · "+(i+1),l[0])+
    card(`<p>${l[7]}</p>
      <div class="grid2"><div>
      <h3>${l[1]}: <b id="labValue">${l[4]}</b></h3>
      <input type="range" min="${l[2]}" max="${l[3]}"
        value="${l[4]}" step="${l[5]}" oninput="updateLab(${i},this.value)">
      <div id="labResult" class="formula">${l[6](l[4])}</div>
      </div>${diagram(l[8])}</div>
      <div class="example"><p>Шаманы өзгертіп, нәтижені салыстырыңдар.
      Дәптерге қысқа қорытынды жазыңдар.</p></div>`);
}
function updateLab(i,x){
  $("labValue").textContent=num(+x);
  $("labResult").textContent=labs[i][6](+x);
}

/* =====================================
   ОҚУШЫЛАР ЖӘНЕ РАНДОМ
===================================== */

const students=names.map((name,id)=>({name,id,present:true}));
const present=()=>students.filter(s=>s.present);
const levels=["Оңай","Орташа","Күрделі"];
const classes=["easy","medium","hard"];

function shuffle(list){
  const a=[...list];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

let assignments=[],drawn=new Set(),completed=new Set();
let randomId=null,attendanceDraft=[];
let teams=[[],[],[]],scores=[0,0,0];
let answers={},speakers={},used=[new Set(),new Set(),new Set()];
let pages=[],sections=[],current=0,autoNext=null;

function assignTasks(){
  const people=shuffle(present());
  const ids=shuffle(tasks.map((_,i)=>i))
    .slice(0,people.length).sort((a,b)=>a-b);
  assignments=people.map((s,i)=>({studentId:s.id,taskId:ids[i]}));
  completed.clear();
  drawn.clear();
  randomId=null;
}

function reshuffle(){
  if(!confirm("Есептерді қайта араластырамыз ба?")) return;
  assignTasks();
  buildPages();
  renderTasks();
  closePanel("taskPanel");
  closePanel("randomPanel");
  goKey("taskIntro");
}

function renderStudents(){
  $("students").innerHTML=students.map((s,i)=>`
    <label><input type="checkbox"
      ${attendanceDraft[i]?"checked":""}
      onchange="attendanceDraft[${i}]=this.checked">
      ${s.name}</label>`).join("");
  $("attendanceCount").textContent=present().length+" / 24";
}
function markAll(v){
  attendanceDraft=names.map(()=>v);
  renderStudents();
}
function saveAttendance(){
  const changed=students.some((s,i)=>s.present!==attendanceDraft[i]);
  if(changed&&!confirm("Қатысу өзгерсе, есептер мен ұпайлар қайта басталады.")) return;
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
  closePanel("attendance");
  goKey(key);
}
function renderTasks(){
  $("taskCount").textContent=`Орындалды: ${completed.size} / ${assignments.length}`;
  $("taskList").innerHTML=assignments.map(a=>`
    <button class="${completed.has(a.taskId)?"done":""}"
      onclick="openTask(${a.taskId})">
      ${students[a.studentId].name}
      <small>${a.taskId+1}-есеп · ${levels[Math.floor(a.taskId/8)]}</small>
    </button>`).join("")||"Қатысушы жоқ";
}
function openTask(id){
  closePanel("taskPanel");
  closePanel("randomPanel");
  goKey("task"+id);
}
function markDone(id){
  if(completed.has(id)) completed.delete(id);
  else completed.add(id);
  renderTasks();
  renderPage(false);
}
function randomStudent(){
  let pool=present().filter(s=>!drawn.has(s.id));
  if(!present().length) return alert("Қатысушы жоқ.");
  if(!pool.length){
    if(!confirm("Барлық оқушы таңдалды. Қайта бастаймыз ба?")) return;
    drawn.clear();pool=present();
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
   КОМАНДАЛЫҚ ОЙЫН
===================================== */

function resetGame(){
  clearTimeout(autoNext);
  scores=[0,0,0];
  answers={};speakers={};
  used=[new Set(),new Set(),new Set()];
}
function makeTeams(show=false){
  if(show&&present().length<3) return alert("Кемінде 3 оқушы қажет.");
  if(show&&!confirm("Топтар мен ұпайларды қайта бастаймыз ба?")) return;
  teams=[[],[],[]];
  shuffle(present()).forEach((s,i)=>teams[i%3].push(s.id));
  resetGame();
  renderTeams();
  if(show){renderPage(false);openPanel("teamPanel")}
}
function teamCards(){
  return lesson.teams.map((n,i)=>card(`
    <h3 class="blue">${i+1}-топ · ${n}</h3>
    <p>${teams[i].map(id=>students[id].name).join(", ")||"Қатысушы жоқ"}</p>
    <div class="score">${scores[i]} ұпай</div>`)).join("");
}
function renderTeams(){
  $("teams").innerHTML=teamCards();
}
function pickSpeaker(i){
  const k=i%3;
  if(speakers[i]!==undefined) return students[speakers[i]].name;
  let pool=teams[k].filter(id=>!used[k].has(id));
  if(!pool.length){used[k].clear();pool=teams[k]}
  if(!pool.length) return "Қатысушы жоқ";
  const id=pool[Math.floor(Math.random()*pool.length)];
  used[k].add(id);speakers[i]=id;
  return students[id].name;
}
function startQuiz(){
  if(teams.some(t=>!t.length)) return alert("Кемінде 3 оқушы қажет.");
  resetGame();renderTeams();goKey("quiz0");
}
function quizPage(i){
  const q=lesson.quiz[i],k=i%3,done=Object.hasOwn(answers,i);
  return heading("КОМАНДАЛЫҚ ОЙЫН · "+(i+1)+" / 15","Кім жылдам?")+
    `<div class="teamTurn">${lesson.teams.map((n,j)=>
      `<span class="${j===k?"active":""}">${n} · ${scores[j]}</span>`).join("")}</div>`+
    card(`<div class="definition">
      <h3>${lesson.teams[k]} тобы</h3>
      <h2 class="blue">🎲 ${pickSpeaker(i)}</h2>
      </div><h2>${q[0]}</h2>
      <div class="choices">${q[1].map((a,j)=>`
        <button class="choice ${done?(j===q[2]?"correct":j===answers[i]?"wrong":""):""}"
        ${done?"disabled":""} onclick="submitAnswer(${i},${j})">
        ${"ABCD"[j]}. ${a}</button>`).join("")}</div>
      ${done?`<div class="${answers[i]===q[2]?"definition":"warning"}">
      <p>${answers[i]===q[2]?"Дұрыс жауап! +10 ұпай":"Дұрыс жауап жасыл түспен көрсетілді."}</p>
      </div><button onclick="go(1)">Келесі →</button>`:""}`);
}
function submitAnswer(i,j){
  if(Object.hasOwn(answers,i)||pages[current].key!=="quiz"+i) return;
  if(teams.some(t=>!t.length)) return alert("3 топ қажет.");
  answers[i]=j;
  if(j===lesson.quiz[i][2]) scores[i%3]+=10;
  renderTeams();renderPage(false);
  clearTimeout(autoNext);
  autoNext=setTimeout(()=>{
    if(pages[current].key==="quiz"+i) go(1);
  },4000);
}

/* =====================================
   САБАҚ БЕТТЕРІ
===================================== */

function theoryPage(t,i){
  return heading("ТҮСІНДІРМЕ · "+(i+1)+" / 15",t[0])+
    card(`<div class="definition"><p><b class="green">${t[1]}</b></p></div>
    <div class="grid2">${diagram(t[5])}<p>${t[2]}</p></div>
    ${formula(t[3])}
    <div class="example"><h3>Мысал</h3><p>${t[4]}</p></div>
    <button onclick="openBoard()">✎ Тақтада түсіндіру</button>`);
}
function notePage(t,i){
  return heading("КОНСПЕКТ · "+(i+1)+" / 10",t[0])+
    `<div class="card notebook">
      <h3 class="blue">Дәптерге жазып алыңдар</h3>
      <p>${t[1]}</p><p>${t[2]}</p>
      ${formula(t[3])}<p>${t[4]}</p>
    </div><button onclick="openBoard()">Интерактивті тақта</button>`;
}
function taskPage(a){
  const p=tasks[a.taskId],s=students[a.studentId];
  const level=Math.floor(a.taskId/8);
  return heading("ЖЕКЕ ЕСЕП · "+(assignments.indexOf(a)+1)+" / "+assignments.length,p.title)+
    `<div class="studentBanner">
      <b class="blue">🎲 РАНДОМ ТАҢДАЛДЫ</b>
      <h1>${s.name}</h1>
      <span class="level ${classes[level]}">${level+1}-деңгей · ${levels[level]}</span>
    </div>`+
    card(`<h2>${p.question}</h2>
      <div class="data"><b class="blue">Берілгені:</b> ${p.given}</div>
      <p>Табу керек шаманы белгілеп, есепті дәптерге шығар.</p>
      <div class="actions">
        <button class="primary" onclick="$('solution').classList.toggle('hidden')">Шешу жолын көрсету</button>
        <button onclick="openBoard()">Тақтада шығару</button>
        <button class="${completed.has(a.taskId)?"done":""}"
          onclick="markDone(${a.taskId})">${completed.has(a.taskId)?"✓ Орындалды":"Орындалды деп белгілеу"}</button>
        <button onclick="openPanel('taskPanel')">Барлық есептер</button>
        <button onclick="go(1)">Келесі →</button>
      </div>
      <div id="solution" class="hidden">${formula(p.answer)}</div>`);
}

function buildPages(){
  pages=[];sections=[];
  function section(name,items){
    if(items.length){sections.push({name,start:pages.length});pages.push(...items)}
  }
  section("⌂ Басты бет",[{key:"intro",render:()=>
    `<span class="eyebrow">ФИЗИКА · ${lesson.number} · 80 МИНУТ</span>
     <div class="card hero">
     <h1 class="blue">${lesson.title}</h1>
     <div class="definition"><h3>Сабақтың мақсаты</h3><p>${lesson.goal}</p></div>
     ${diagram(isMetal?"metal":"ions")}
     <div class="grid3">
     ${card("<h2>15</h2><p>Түсіндірме</p>")}
     ${card("<h2>24</h2><p>Жеке есеп</p>")}
     ${card("<h2>3</h2><p>Команда</p>")}
     </div>
     <button class="primary" onclick="startTimer();go(1)">Сабақты бастау →</button>
     <p class="blue"><b>BY DARKHAN</b></p></div>`}]);

  section("📋 Сабақ жоспары",[{key:"plan",render:()=>
    heading("САБАҚ ЖОСПАРЫ","80 минут")+
    card([
      ["Ұйымдастыру",3],["Түсіндірме",20],["Конспект",12],
      ["Виртуалды зертхана",10],["Жеке есептерді қатар орындау",20],
      ["Командалық ойын",12],["Қорытынды және үй жұмысы",3]
    ].map(([n,t])=>`<div class="data">${n} — <b class="blue">${t} минут</b></div>`).join(""))}]);

  section("📖 Түсіндірме",lesson.theory.map((t,i)=>({
    key:"theory"+i,render:()=>theoryPage(t,i)
  })));
  section("📘 Конспект",lesson.noteIds.map((id,i)=>({
    key:"note"+i,render:()=>notePage(lesson.theory[id],i)
  })));
  section("⚗ Виртуалды зертхана",labs.map((_,i)=>({
    key:"lab"+i,render:()=>labPage(i)
  })));

  section("🎲 Жеке есептер",[{key:"taskIntro",render:()=>
    heading("ЖЕКЕ ЖҰМЫС","Рандом есептер")+
    card(`<p>Әр қатысушыға бір есеп кездейсоқ тағайындалды.</p>
    ${formula(assignments.length+" оқушы · "+assignments.length+" есеп")}
    <div class="grid3">${levels.map((n,i)=>card(`
      <span class="level ${classes[i]}">${n}</span>
      <div class="score">${assignments.filter(a=>Math.floor(a.taskId/8)===i).length}</div>
    `)).join("")}</div>
    <button onclick="openPanel('taskPanel')">Есептер тізімі</button>
    <button onclick="reshuffle()">Қайта араластыру</button>
    <button class="primary" ${assignments.length?"":"disabled"} onclick="go(1)">Бастау</button>`)
  }]);

  for(let k=0;k<3;k++){
    section(`${["🟢","🟡","🔴"][k]} ${levels[k]}`,
      assignments.filter(a=>Math.floor(a.taskId/8)===k)
      .map(a=>({key:"task"+a.taskId,render:()=>taskPage(a)})));
  }
  section("🏆 Командалық ойын",[
    {key:"quizIntro",render:()=>
      heading("КОМАНДАЛЫҚ ОЙЫН","Білім жарысы")+
      `<div class="grid3">${teamCards()}</div>`+
      card(`<p>15 сұрақ. Әр командаға 5 сұрақ.
      Дұрыс жауап — 10 ұпай. Жауаптан кейін 4 секундтан соң
      келесі командаға автоматты ауысады.</p>
      <button onclick="makeTeams(true)">Топтарды қайта бөлу</button>
      <button class="primary" onclick="startQuiz()">Ойынды бастау</button>`)},
    ...lesson.quiz.map((_,i)=>({key:"quiz"+i,render:()=>quizPage(i)}))
  ]);

  section("📊 Қорытынды",[{key:"results",render:()=>{
    const total=Object.keys(answers).length;
    const winners=lesson.teams.filter((_,i)=>scores[i]===Math.max(...scores));
    return heading("ҚОРЫТЫНДЫ","Сабақ нәтижелері")+
      card(`<h3>Жеке есептер</h3>${formula(completed.size+" / "+assignments.length)}`)+
      `<div class="grid3">${teamCards()}</div>`+
      card(`<h2 class="green">${total<15?"Ойын аяқталмаған":
        winners.length===1?"Жеңімпаз: "+winners[0]:"Тең нәтиже: "+winners.join(", ")}</h2>
        <p>Жауап берілген сұрақтар: ${total} / 15</p>`);
  }}]);

  section("✎ Үй тапсырмасы",[{key:"home",render:()=>
    heading("ҮЙ ТАПСЫРМАСЫ · "+lesson.number,"Үйге берілетін екі тапсырма")+
    `<div class="card notebook">${lesson.homework}</div>`+
    card('<h1 class="green">Сабақ аяқталды!</h1><h2>Назарларыңызға рақмет!</h2><p>Сау болыңыздар!</p><b>BY DARKHAN</b>')}]);

  $("menu").innerHTML=sections.map((s,i)=>
    `<button data-section="${i}" onclick="goPage(${s.start})">${s.name}</button>`).join("");
}

function renderPage(scroll=true){
  current=Math.max(0,Math.min(pages.length-1,current));
  $("stage").innerHTML=`<article class="slide">${pages[current].render()}</article>`;
  $("pageCount").textContent=`${current+1} / ${pages.length}`;
  $("progress").value=(current+1)/pages.length*100;
  let active=0;
  sections.forEach((s,i)=>{if(current>=s.start) active=i});
  document.querySelectorAll("[data-section]").forEach(b=>
    b.classList.toggle("active",Number(b.dataset.section)===active));
  applyScale();
  if(scroll) $("screen").scrollTo(0,0);
}
function goPage(i){
  clearTimeout(autoNext);stopReading();
  current=i;renderPage();
}
function go(n){goPage(current+n)}
function goKey(key){goPage(Math.max(0,pages.findIndex(p=>p.key===key)))}

/* =====================================
   ЭКРАН МАСШТАБЫ
===================================== */

let scale=100;
function applyScale(){
  const s=$("screen"),css=getComputedStyle(s);
  $("stage").style.width=Math.max(1,s.clientWidth-
    parseFloat(css.paddingLeft)-parseFloat(css.paddingRight))+"px";
  $("stage").style.zoom=scale/100;
  $("stage").style.margin=scale>100?"0":"0 auto";
  $("scale").textContent=scale+"%";
}
function zoom(n){
  scale=n===0?100:Math.max(25,Math.min(300,scale+n));
  applyScale();
}
function toggleMenu(){
  const hidden=$("app").classList.toggle("menuHidden");
  document.body.classList.toggle("menuHidden",hidden);
  requestAnimationFrame(applyScale);
}
async function fullscreen(){
  try{
    if(document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  }catch{alert("Толық экран үшін F11 басыңыз.")}
}

function stopReading(){
  if("speechSynthesis" in window) speechSynthesis.cancel();
}
function readPage(){
  if(!("speechSynthesis" in window)) return alert("Дыбыстау қолжетімсіз.");
  const voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith("kk"));
  if(!voice) return alert("Қазақша дауыс табылмады.");
  stopReading();
  const u=new SpeechSynthesisUtterance($("stage").innerText);
  u.lang="kk-KZ";u.voice=voice;
  speechSynthesis.speak(u);
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
function closePanel(id){$(id).classList.add("hidden")}
function clampPanel(p){
  if(p.classList.contains("hidden")) return;
  const r=p.getBoundingClientRect();
  p.style.left=Math.max(0,Math.min(r.left,innerWidth-r.width))+"px";
  p.style.top=Math.max(0,Math.min(r.top,innerHeight-r.height))+"px";
  p.style.right="auto";
}
document.querySelectorAll(".floating").forEach(p=>{
  let drag=null,moved=false;
  p.addEventListener("pointerdown",e=>{
    if(e.button!==0||!e.isPrimary) return;
    p.style.zIndex=++z;moved=false;
    if(!p.classList.contains("mini")&&!e.target.closest(".handle")) return;
    if(e.target.closest("select,input:not([readonly])")) return;
    const r=p.getBoundingClientRect();
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,l:r.left,t:r.top};
  });
  window.addEventListener("pointermove",e=>{
    if(!drag||drag.id!==e.pointerId) return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!moved&&Math.hypot(dx,dy)<6) return;
    if(!moved){moved=true;p.setPointerCapture(e.pointerId)}
    if(e.cancelable)e.preventDefault();
    p.style.left=Math.max(0,Math.min(innerWidth-p.offsetWidth,drag.l+dx))+"px";
    p.style.top=Math.max(0,Math.min(innerHeight-p.offsetHeight,drag.t+dy))+"px";
    p.style.right="auto";
  },{passive:false});
  const end=e=>{
    if(drag?.id!==e.pointerId)return;
    drag=null;
    if(p.hasPointerCapture(e.pointerId))p.releasePointerCapture(e.pointerId);
  };
  window.addEventListener("pointerup",end);
  window.addEventListener("pointercancel",end);
  p.addEventListener("click",e=>{
    if(moved){moved=false;e.preventDefault();e.stopImmediatePropagation()}
  },true);
});

/* =====================================
   ҒЫЛЫМИ КАЛЬКУЛЯТОР
===================================== */

let expression="",degree=true;
const keys=[
  "DEG","C","⌫","÷","sin","cos","tan","ctg",
  "√","x²","^","×","7","8","9","−",
  "4","5","6","+","1","2","3","(",
  "0",".","π",")","ln","log","EXP","="
];
function renderMath(){
  $("mathKeys").innerHTML=keys.map(k=>
    `<button onclick="mathPress('${k}')">${k==="DEG"?(degree?"DEG":"RAD"):k}</button>`).join("");
}
function mathPress(k){
  try{
    if(k==="DEG"){degree=!degree;renderMath();return}
    if(k==="C"){expression="";$("mathResult").textContent="0"}
    else if(k==="⌫")expression=expression.slice(0,-1);
    else if(k==="="){
      const result=evaluate(expression);
      expression=String(Number(result.toPrecision(12)));
      $("mathResult").textContent=num(result);
    }else{
      const map={"÷":"/","×":"*","−":"-","√":"sqrt(","x²":"^2",
        "π":"pi",EXP:"e",sin:"sin(",cos:"cos(",tan:"tan(",
        ctg:"ctg(",ln:"ln(",log:"log("};
      expression+=map[k]||k;
    }
    $("mathDisplay").value=expression;
  }catch{$("mathResult").textContent="Қате өрнек"}
}

function evaluate(s){
  const t=s.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z]+|[+\-*/^()]/g)||[];
  if(!s||t.join("")!==s||s.length>300)throw Error("Қате");
  let p=0;
  const rad=x=>degree?x*Math.PI/180:x;
  const funcs={
    sin:x=>Math.sin(rad(x)),cos:x=>Math.cos(rad(x)),
    tan:x=>Math.tan(rad(x)),ctg:x=>1/Math.tan(rad(x)),
    sqrt:Math.sqrt,ln:Math.log,log:Math.log10
  };
  function sum(){
    let x=product();
    while(["+","-"].includes(t[p])){
      const op=t[p++],y=product();x=op==="+"?x+y:x-y;
    }return x;
  }
  function product(){
    let x=unary();
    while(["*","/"].includes(t[p])){
      const op=t[p++],y=unary();x=op==="*"?x*y:x/y;
    }return x;
  }
  function unary(){
    if(t[p]==="+"){p++;return unary()}
    if(t[p]==="-"){p++;return -unary()}
    let x=atom();
    if(t[p]==="^"){p++;x=x**unary()}
    return x;
  }
  function atom(){
    const k=t[p++];
    if(k===undefined)throw Error("Қате");
    if(k==="pi")return Math.PI;
    if(/^[0-9.]/.test(k))return Number(k);
    if(k==="("){
      const x=sum();if(t[p++]!==")")throw Error("Қате");return x;
    }
    if(Object.hasOwn(funcs,k)){
      if(t[p++]!=="(")throw Error("Қате");
      const x=sum();if(t[p++]!==")")throw Error("Қате");
      if(k==="tan"&&Math.abs(Math.cos(rad(x)))<1e-12)throw Error("Қате");
      if(k==="ctg"&&Math.abs(Math.sin(rad(x)))<1e-12)throw Error("Қате");
      return funcs[k](x);
    }
    throw Error("Қате");
  }
  const x=sum();
  if(p!==t.length||!Number.isFinite(x))throw Error("Қате");
  return x;
}

/* =====================================
   ФИЗИКАЛЫҚ КАЛЬКУЛЯТОР
===================================== */

const physics=[
  ["Ток күші I = U/R",["U (В)","R (Ом)"],v=>v[0]/v[1],"А"],
  ["Кернеу U = IR",["I (А)","R (Ом)"],v=>v[0]*v[1],"В"],
  ["Кедергі R = U/I",["U (В)","I (А)"],v=>v[0]/v[1],"Ом"],
  ["Заряд q = It",["I (А)","t (с)"],v=>v[0]*v[1],"Кл"],
  ["Қуат P = UI",["U (В)","I (А)"],v=>v[0]*v[1],"Вт"],
  ["Жұмыс A = UIt",["U (В)","I (А)","t (с)"],v=>v[0]*v[1]*v[2],"Дж"],
  ...(isMetal?[
    ["R = ρl/S",["ρ (Ом·м)","l (м)","S (м²)"],v=>v[0]*v[1]/v[2],"Ом"],
    ["Температуралық кедергі",["R₀ (Ом)","α (К⁻¹)","Δt (К)"],
      v=>v[0]*(1+v[1]*v[2]),"Ом"],
    ["Температуралық коэффициент",["R (Ом)","R₀ (Ом)","Δt (К)"],
      v=>(v[0]-v[1])/(v[1]*v[2]),"К⁻¹"]
  ]:[
    ["Теориялық масса m = kq",["k (г/Кл)","q (Кл)"],v=>v[0]*v[1],"г"],
    ["Теориялық масса m = kIt",["k (г/Кл)","I (А)","t (с)"],
      v=>v[0]*v[1]*v[2],"г"],
    ["Эквивалент k = m/q",["m (г)","q (Кл)"],v=>v[0]/v[1],"г/Кл"],
    ["Фарадей заңы",["M (г/моль)","q (Кл)","z"],
      v=>Number.isInteger(v[2])&&v[2]>0?v[0]*v[1]/(v[2]*96500):NaN,"г"],
    ["Ток бойынша шығым",["m нақты (г)","m теориялық (г)"],
      v=>v[0]/v[1]*100,"%"]
  ])
];
function initPhysics(){
  $("physicsFormula").innerHTML=physics.map((f,i)=>
    `<option value="${i}">${f[0]}</option>`).join("");
  physicsInputs();
}
function physicsInputs(){
  const f=physics[+$("physicsFormula").value];
  $("physicsInputs").innerHTML=f[1].map((n,i)=>
    `<label>${n}</label><input id="phys${i}" inputmode="decimal">`).join("");
  $("physicsResult").textContent="Нәтиже";
}
function calculatePhysics(){
  try{
    const f=physics[+$("physicsFormula").value];
    const v=f[1].map((_,i)=>{
      const s=$("phys"+i).value.trim().replace(",",".");
      if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s))throw Error();
      return Number(s);
    });
    const x=f[2](v);
    if(!v.every(Number.isFinite)||!Number.isFinite(x))throw Error();
    $("physicsResult").textContent=num(x)+" "+f[3];
  }catch{$("physicsResult").textContent="Мәндерді тексеріңіз"}
}

/* =====================================
   ИНТЕРАКТИВТІ ТАҚТА
===================================== */

const canvas=$("canvas"),ctx=canvas.getContext("2d");
const W=1600,H=900;
let tool="pen",boardScale=100,boardIndex=0;
let boardPages=[{actions:[],redo:[],grid:false}];
let draft=null,pointer=null,pan=null;
const state=()=>boardPages[boardIndex];

function setTool(t){
  tool=t;canvas.style.cursor=t==="hand"?"grab":t==="text"?"text":"crosshair";
}
function openBoard(){
  clearTimeout(autoNext);
  stopReading();
  $("board").classList.remove("hidden");
  resizeBoard();
}
function closeBoard(){
  draft=null;pan=null;
  if(pointer!==null&&canvas.hasPointerCapture(pointer))
    canvas.releasePointerCapture(pointer);
  pointer=null;
  $("board").classList.add("hidden");
  renderBoard();
}

function point(e){
  const r=canvas.getBoundingClientRect();
  return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};
}
function draw(a){
  ctx.save();
  ctx.strokeStyle=a.color;ctx.fillStyle=a.color;
  ctx.lineWidth=a.size||5;ctx.lineCap="round";ctx.lineJoin="round";
  if(a.type==="clear")ctx.clearRect(0,0,W,H);
  else if(a.type==="image")ctx.drawImage(a.img,a.x,a.y,a.w,a.h);
  else if(a.type==="text"){
    ctx.font=`${Math.max(24,a.size*4)}px Segoe UI`;
    ctx.fillText(a.text,a.start.x,a.start.y);
  }else if(["pen","marker","eraser"].includes(a.type)){
    if(a.type==="marker")ctx.globalAlpha=.3;
    if(a.type==="eraser")ctx.globalCompositeOperation="destination-out";
    ctx.beginPath();
    const p=a.points[0];
    if(a.points.length===1){
      ctx.arc(p.x,p.y,a.size/2,0,Math.PI*2);ctx.fill();
    }else{
      ctx.moveTo(p.x,p.y);
      a.points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
      ctx.stroke();
    }
  }else{
    const p=a.start,q=a.end,dx=q.x-p.x,dy=q.y-p.y;
    ctx.beginPath();
    if(a.type==="line"||a.type==="arrow"){
      ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
    }
    if(a.type==="arrow"){
      const angle=Math.atan2(dy,dx),l=Math.max(18,a.size*3);
      ctx.lineTo(q.x-l*Math.cos(angle-.5),q.y-l*Math.sin(angle-.5));
      ctx.moveTo(q.x,q.y);
      ctx.lineTo(q.x-l*Math.cos(angle+.5),q.y-l*Math.sin(angle+.5));
    }
    if(a.type==="rect")ctx.rect(p.x,p.y,dx,dy);
    if(a.type==="circle")ctx.ellipse(
      (p.x+q.x)/2,(p.y+q.y)/2,
      Math.max(.1,Math.abs(dx)/2),Math.max(.1,Math.abs(dy)/2),
      0,0,Math.PI*2);
    if(a.type==="triangle"){
      ctx.moveTo((p.x+q.x)/2,p.y);
      ctx.lineTo(p.x,q.y);ctx.lineTo(q.x,q.y);ctx.closePath();
    }
    ctx.stroke();
  }
  ctx.restore();
}
function renderBoard(){
  ctx.clearRect(0,0,W,H);
  state().actions.forEach(draw);
  if(draft)draw(draft);
  $("boardCount").textContent=(boardIndex+1)+"/"+boardPages.length;
  const p=$("paper");
  const step=40*p.clientWidth/W;
  p.style.backgroundImage=state().grid?
    "linear-gradient(#d5e6f3 1px,transparent 1px),linear-gradient(90deg,#d5e6f3 1px,transparent 1px)":"none";
  p.style.backgroundSize=step+"px "+step+"px";
}
function commit(a){
  state().actions.push(a);state().redo=[];renderBoard();
}

canvas.addEventListener("pointerdown",e=>{
  if(e.button!==0||!e.isPrimary||pointer!==null)return;
  e.preventDefault();
  const p=point(e),size=+$("penSize").value,color=$("ink").value;
  if(tool==="text"){
    const text=prompt("Мәтінді енгізіңіз:");
    if(text)commit({type:"text",text,start:p,size,color});
    return;
  }
  pointer=e.pointerId;
  canvas.setPointerCapture(pointer);
  if(tool==="hand"){
    pan={x:e.clientX,y:e.clientY,l:$("boardViewport").scrollLeft,
      t:$("boardViewport").scrollTop};
    return;
  }
  draft={type:tool,color,size:tool==="marker"?size*4:
    tool==="eraser"?Math.max(15,size*3):size,start:p,end:p,points:[p]};
  renderBoard();
});
canvas.addEventListener("pointermove",e=>{
  if(pointer!==e.pointerId)return;
  if(pan){
    $("boardViewport").scrollLeft=pan.l-(e.clientX-pan.x);
    $("boardViewport").scrollTop=pan.t-(e.clientY-pan.y);
    return;
  }
  if(!draft)return;
  const p=point(e);draft.end=p;draft.points.push(p);
  renderBoard();
});
function finish(e,cancel=false){
  if(pointer!==e.pointerId)return;
  const a=draft;
  if(a&&!cancel){a.end=point(e);a.points.push(a.end)}
  draft=null;pan=null;pointer=null;
  if(a&&!cancel)commit(a);else renderBoard();
  if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
}
canvas.addEventListener("pointerup",e=>finish(e));
canvas.addEventListener("pointercancel",e=>finish(e,true));
canvas.addEventListener("lostpointercapture",e=>finish(e,true));

function undo(){
  if(state().actions.length)state().redo.push(state().actions.pop());
  renderBoard();
}
function redo(){
  if(state().redo.length)state().actions.push(state().redo.pop());
  renderBoard();
}
function clearBoard(){
  if(confirm("Тақтаны тазалаймыз ба?"))commit({type:"clear"});
}
function toggleGrid(){state().grid=!state().grid;renderBoard()}
function newBoardPage(){
  boardPages.push({actions:[],redo:[],grid:false});
  boardIndex=boardPages.length-1;renderBoard();
}
function boardPage(n){
  boardIndex=Math.max(0,Math.min(boardPages.length-1,boardIndex+n));
  renderBoard();
}
function deleteBoardPage(){
  if(!confirm("Бетті өшіреміз бе?"))return;
  boardPages.splice(boardIndex,1);
  if(!boardPages.length)boardPages.push({actions:[],redo:[],grid:false});
  boardIndex=Math.min(boardIndex,boardPages.length-1);renderBoard();
}
function resizeBoard(){
  if($("board").classList.contains("hidden"))return;
  const v=$("boardViewport");
  const width=Math.max(1,Math.min(v.clientWidth-24,(v.clientHeight-24)*W/H))*boardScale/100;
  $("paper").style.width=width+"px";
  $("paper").style.margin=width>v.clientWidth-24?"0":"0 auto";
  $("boardScale").textContent=boardScale+"%";
  renderBoard();
}
function boardZoom(n){
  boardScale=n===0?100:Math.max(25,Math.min(300,boardScale+n));
  resizeBoard();
}
function importImage(e){
  const file=e.target.files[0];if(!file)return;
  const target=state(),img=new Image(),url=URL.createObjectURL(file);
  img.onload=()=>{
    const k=Math.min(1000/img.width,650/img.height,1);
    const w=img.width*k,h=img.height*k;
    if(boardPages.includes(target)){
      target.actions.push({type:"image",img,w,h,x:(W-w)/2,y:(H-h)/2});
      target.redo=[];renderBoard();
    }
    URL.revokeObjectURL(url);
  };
  img.onerror=()=>{URL.revokeObjectURL(url);alert("Сурет ашылмады")};
  img.src=url;e.target.value="";
}
function saveBoard(){
  const out=document.createElement("canvas");out.width=W;out.height=H;
  const c=out.getContext("2d");c.fillStyle="white";c.fillRect(0,0,W,H);
  if(state().grid){
    c.strokeStyle="#d5e6f3";
    for(let x=0;x<W;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke()}
    for(let y=0;y<H;y+=40){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  }
  c.drawImage(canvas,0,0);
  const a=document.createElement("a");
  a.download=`physics-${TOPIC}-board-${boardIndex+1}.png`;
  a.href=out.toDataURL("image/png");a.click();
}

/* =====================================
   АЛМАТЫ УАҚЫТЫ ЖӘНЕ ТАЙМЕР
===================================== */

let remaining=4800,deadline=0,running=false;
function updateTime(){
  const d=new Date(Date.now()+5*3600000);
  $("clock").textContent=d.toLocaleTimeString("kk-KZ",{
    timeZone:"UTC",hourCycle:"h23",hour:"2-digit",minute:"2-digit",second:"2-digit"
  });
  $("date").textContent=d.toLocaleDateString("kk-KZ",{
    timeZone:"UTC",year:"numeric",month:"long",day:"numeric"
  });
  if(running)remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
  if(!remaining)running=false;
  $("timer").textContent=String(Math.floor(remaining/60)).padStart(2,"0")+
    ":"+String(remaining%60).padStart(2,"0");
  $("timerBtn").textContent=running?"Тоқтату":"Бастау";
  $("timer").style.color=remaining<300?"#d63a50":"#16874e";
}
function startTimer(){
  if(running||remaining<=0)return;
  deadline=Date.now()+remaining*1000;running=true;updateTime();
}
function toggleTimer(){
  if(running){updateTime();running=false;updateTime()}
  else startTimer();
}
function resetTimer(){
  if(!confirm("80 минутқа қайтарамыз ба?"))return;
  remaining=4800;running=false;updateTime();
}

document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){
    const panels=[...document.querySelectorAll(".floating:not(.hidden)")]
      .sort((a,b)=>Number(b.style.zIndex)-Number(a.style.zIndex));
    if(panels.length)closePanel(panels[0].id);
    else if(!$("board").classList.contains("hidden"))closeBoard();
    return;
  }
  if(e.target.closest("input,select,textarea,button"))return;
  if(!$("board").classList.contains("hidden")){
    if(e.ctrlKey&&e.key==="z"){e.preventDefault();undo()}
    if(e.ctrlKey&&e.key==="y"){e.preventDefault();redo()}
    return;
  }
  if(e.key==="ArrowRight")go(1);
  if(e.key==="ArrowLeft")go(-1);
});
window.addEventListener("resize",()=>{
  applyScale();resizeBoard();
  document.querySelectorAll(".floating").forEach(clampPanel);
});

/* =====================================
   САЙТТЫ ІСКЕ ҚОСУ
===================================== */

document.title="PHYSICS LAB PRO — "+lesson.number;
$("topicNumber").textContent=lesson.number;
attendanceDraft=students.map(s=>s.present);

assignTasks();
makeTeams();
buildPages();
renderStudents();
renderTasks();
renderMath();
initPhysics();
renderPage();
updateTime();

setInterval(updateTime,1000);

console.log("Тақырып:",lesson.number,lesson.title);
console.log("Түсіндірме:",lesson.theory.length);
console.log("Конспект:",lesson.noteIds.length);
console.log("Жеке есептер:",tasks.length);
console.log("Командалық сұрақтар:",lesson.quiz.length);
console.log("Барлық беттер:",pages.length);

/* BY DARKHAN */
