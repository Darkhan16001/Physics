
"use strict";

const $=id=>document.getElementById(id);
const num=n=>Number.isFinite(n)?
  String(Number(n.toPrecision(9))).replace(".",","):"Қате";

const frac=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const formula=s=>`<div class="formula">${s}</div>`;
const card=s=>`<div class="card">${s}</div>`;
const heading=(s,t)=>`<span class="eyebrow">${s}</span><h2>${t}</h2>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

const title="Электролиттердің балқытпалары мен ерітіндісіндегі электр тогы. Электролиз заңдары.";

const names=[
  "Рамазан","Тұрғанжан","Нұрай","Әлқуат",
  "Шырай","Гүлсезім","Маржан","Мариям",
  "Жансая","Азиза","Ақсезім","Нұрболсын",
  "Ақнұр","Іңкәр","Асхат","Аяжан",
  "Мирас","Санжар","Ерасыл","Нұрасыл",
  "Расул","Айнұр","Дархан","Айкерім"
];

const F=96500;

/* 15 ТҮСІНДІРМЕ */

const theory=[
  ["Электролиттер",
   "Электролиттер — ерітінділері немесе балқытпалары электр тогын иондар арқылы өткізетін заттар.",
   "Электролиттің ішінде оң және теріс зарядталған бөлшектер болады. Электр өрісінің әсерінен олардың бағытталған қозғалысы электр тогын тудырады. Металдардан айырмашылығы — негізгі заряд тасымалдаушылар иондар.",
   "Катион (+) · Анион (−)",
   "Тұздардың, қышқылдардың және негіздердің көптеген ерітінділері электролиттерге жатады.","ions"],

  ["Электролиттік диссоциация",
   "Заттың ерітіндіде иондарға бөлінуі электролиттік диссоциация деп аталады.",
   "Еріген заттың бөлшектері оң және теріс иондарға ажырауы мүмкін. Электр өрісі болмаған кезде иондар ретсіз жылулық қозғалыста болады.",
   "NaCl → Na⁺ + Cl⁻",
   "Натрий хлоридінің суда иондарға ажырауын осы өрнекпен сипаттауға болады.","particles"],

  ["Катиондар",
   "Катиондар — оң зарядталған иондар.",
   "Катиондардың заряды оң болады. Электр өрісінде олар өріс бағытымен қозғалады. Электролиз кезінде катодқа қарай бағытталады.",
   "Na⁺ · Cu²⁺ · Ca²⁺",
   "Кальций ионының заряды екі элементар оң зарядқа тең.","cation"],

  ["Аниондар",
   "Аниондар — теріс зарядталған иондар.",
   "Аниондар электр өрісінің бағытына қарама-қарсы қозғалады. Электролиз кезінде олар анодқа қарай бағытталады.",
   "Cl⁻ · SO₄²⁻",
   "Хлорид ионының заряды теріс.","anion"],

  ["Электродтар",
   "Электродтар — электрондық өткізгіш пен электролит арасында заряд алмасатын бөліктер.",
   "Электролиздік ұяшықта катод теріс, анод оң электрод болады. Катодта тотықсыздану, анодта тотығу процестері жүреді.",
   "Катод (−) · Анод (+)",
   "Катод пен анодтағы процестер бір-бірінен ерекшеленеді.","ions"],

  ["Электролиттердегі электр тогы",
   "Электролиттердегі ток — оң және теріс иондардың бағытталған қозғалысы.",
   "Катиондар мен аниондар қарама-қарсы қозғалғанымен, олардың электр тогына қосқан үлестері қосылады. Ток күші уақыт бірлігінде өтетін қорытқы зарядпен анықталады.",
   "I = "+frac("q","t"),
   "6 Кл заряд 3 секундта өтсе, ток күші 2 А.","charge"],

  ["Электролиз құбылысы",
   "Электролиз — электр тогының әсерінен электродтарда химиялық өзгерістердің жүруі.",
   "Электролиз кезінде электр энергиясы химиялық өзгерістерге жұмсалады. Электродтардағы өнімдер заттардың қасиеттері мен процестің жағдайларына байланысты болады.",
   "Электр энергиясы → Химиялық өзгеріс",
   "Электролиз металдарды өнеркәсіптік тазартуда пайдаланылады.","ions"],

  ["Фарадейдің бірінші заңы",
   "Электродта бөлінетін заттың теориялық массасы өткен электр зарядына тура пропорционал.",
   "Масса m әрпімен, заряд q әрпімен, электрохимиялық эквивалент k әрпімен белгіленеді. Белгілі бір электродтық процесс үшін k тұрақты деп алынады.",
   "m = kq",
   "Өткен заряд екі есе артса, теориялық масса да екі есе артады.","linear"],

  ["Ток күші және уақыт",
   "Тұрақты ток кезінде электр заряды ток күші мен уақыттың көбейтіндісіне тең.",
   "Заряд формуласын Фарадейдің бірінші заңына қойып, массаның ток күші мен уақытқа тәуелділігін аламыз. Уақыт секундпен өлшенеді.",
   "q = It<br>m = kIt",
   "Ток тұрақты болғанда теориялық масса уақытқа тура пропорционал.","charge"],

  ["Электрохимиялық эквивалент",
   "Электрохимиялық эквивалент бір кулон зарядқа сәйкес бөлінетін теориялық массаны сипаттайды.",
   "Электрохимиялық эквиваленттің SI жүйесіндегі өлшем бірлігі кг/Кл. Масса граммен берілген есептерде г/Кл бірлігі де қолданылады.",
   "k = "+frac("m","q"),
   "Формуладағы масса мен k шамасының бірліктері сәйкес болуы керек.","formula"],

  ["Фарадейдің екінші заңы",
   "Электрохимиялық эквивалент молярлық массаға тура, ал заряд алмасу санына кері пропорционал.",
   "M — молярлық масса, z — бір бөлшекке сәйкес электрондар саны, F — Фарадей тұрақтысы. Бұл шамалар берілген электродтық реакцияға байланысты.",
   "k = "+frac("M","zF"),
   "Молярлық масса грамм/моль болса, k грамм/кулонмен шығады.","formula"],

  ["Фарадей тұрақтысы",
   "Фарадей тұрақтысы бір моль электронның электр зарядының модуліне тең.",
   "Мектеп пен колледж есептерінде Фарадей тұрақтысының жуық мәні 96500 Кл/моль деп алынады. Ол электр заряды мен электрондардың зат мөлшерін байланыстырады.",
   "F ≈ 96500 Кл/моль",
   "96500 Кл заряд шамамен бір моль электронға сәйкес келеді.","constant"],

  ["Электролиздің жалпы формуласы",
   "Фарадейдің бірінші және екінші заңдарын біріктіруге болады.",
   "Электродта бөлінетін теориялық масса молярлық масса мен зарядқа тура пропорционал. Формула заряд толық берілген электродтық процеске жұмсалатын идеал жағдайға арналған.",
   "m = "+frac("Mq","zF")+" = "+frac("MIt","zF"),
   "Барлық есепте M, m және k өлшем бірліктерін сәйкестендіреміз.","formula"],

  ["Ток бойынша шығым",
   "Ток бойынша шығым нақты массаның теориялық массаға қатынасын сипаттайды.",
   "Нақты процестерде зарядтың бір бөлігі басқа реакцияларға жұмсалуы мүмкін. Сондықтан алынатын масса теориялық мәннен аз болуы мүмкін.",
   "η = "+frac("mнақты","mтеориялық")+" × 100%",
   "Теориялық масса 10 г, нақты масса 8 г болса, шығым 80%.","efficiency"],

  ["Электролиздің қолданылуы",
   "Электролиз өнеркәсіпте металдарды алу, тазарту және қорғаныш жабындарын өндіру үшін қолданылады.",
   "Электрохимиялық процестер металлургия мен химиялық технологияның маңызды бөлігі болып табылады. Сабақ барысында олардың физикалық негіздерін теориялық модельдер арқылы зерттейміз.",
   "Металлургия · Металды тазарту · Қорғаныш жабындары",
   "Өнеркәсіптік электролиз арнайы бақыланатын жабдықтарда жүргізіледі.","industry"]
];

const noteIds=[0,1,2,3,4,6,7,9,10,12];

/* 24 ЖЕКЕ ЕСЕП */

const tasks=[
  // 1-ДЕҢГЕЙ

  ["Электр заряды",
   "Ток күші 3 А, уақыт 20 с. Өткен зарядты тап.",
   "I = 3 А; t = 20 с","q — ?",
   "q = It = 3 × 20 = 60 Кл"],

  ["Ток күшін анықтау",
   "120 Кл заряд 30 секундта өтті. Ток күшін анықта.",
   "q = 120 Кл; t = 30 с","I — ?",
   "I = "+frac("120","30")+" = 4 А"],

  ["Уақытты есептеу",
   "Ток күші 5 А болғанда 150 Кл заряд қанша уақытта өтеді?",
   "I = 5 А; q = 150 Кл","t — ?",
   "t = "+frac("150","5")+" = 30 с"],

  ["Фарадейдің бірінші заңы",
   "k = 0,0005 г/Кл, q = 2000 Кл. Теориялық массаны тап.",
   "k = 0,0005 г/Кл; q = 2000 Кл","m — ?",
   "m = kq = 0,0005 × 2000 = 1 г"],

  ["Массаны түрлендіру",
   "Заттың массасы 0,008 кг. Граммен өрнекте.",
   "m = 0,008 кг","m (г) — ?",
   "m = 0,008 × 1000 = 8 г"],

  ["Уақыт бірлігі",
   "3 минут 30 секундты секундпен өрнекте.",
   "t = 3 мин 30 с","t (с) — ?",
   "t = 3 × 60 + 30 = 210 с"],

  ["Электрондардың зат мөлшері",
   "Шартты есепте q = 96500 Кл. Электрондардың зат мөлшерін тап.",
   "F = 96500 Кл/моль","ν — ?",
   "ν = "+frac("96500","96500")+" = 1 моль"],

  ["Массалардың қатынасы",
   "Бастапқы теориялық масса 4 г. Өткен заряд екі есе артса, жаңа масса қанша?",
   "m₁ = 4 г; q₂ = 2q₁","m₂ — ?",
   "m₂ = 2 × 4 = 8 г"],

  // 2-ДЕҢГЕЙ

  ["Электрохимиялық эквивалент",
   "Шартты есепте 4000 Кл зарядқа 2 г теориялық масса сәйкес келеді. k шамасын тап.",
   "m = 2 г; q = 4000 Кл","k — ?",
   "k = "+frac("2","4000")+" = 0,0005 г/Кл"],

  ["Теориялық масса",
   "k = 0,0004 г/Кл, I = 2 А, t = 100 с. Теориялық массаны тап.",
   "k = 0,0004 г/Кл; I = 2 А; t = 100 с","m — ?",
   "q = 2 × 100 = 200 Кл<br>m = 0,0004 × 200 = 0,08 г"],

  ["Белгісіз заряд",
   "Теориялық масса 3 г, электрохимиялық эквивалент 0,0006 г/Кл. Зарядты анықта.",
   "m = 3 г; k = 0,0006 г/Кл","q — ?",
   "q = "+frac("3","0,0006")+" = 5000 Кл"],

  ["Фарадейдің екінші заңы",
   "Шартты зат үшін M = 40 г/моль, z = 2. Электрохимиялық эквивалентті тап.",
   "M = 40 г/моль; z = 2; F = 96500 Кл/моль","k — ?",
   "k = "+frac("40","2 × 96500")+" ≈ 0,000207 г/Кл"],

  ["Молярлық масса және заряд",
   "Шартты модельде M = 60 г/моль, z = 2, q = 9650 Кл. Теориялық массаны есепте.",
   "M = 60 г/моль; z = 2; q = 9650 Кл","m — ?",
   "m = "+frac("60 × 9650","2 × 96500")+" = 3 г"],

  ["Ток бойынша шығым",
   "Теориялық масса 20 г, нақты масса 16 г. Шығымды анықта.",
   "mтеор = 20 г; mнақты = 16 г","η — ?",
   "η = "+frac("16","20")+" × 100% = 80%"],

  ["Нақты масса",
   "Теориялық масса 12 г, шығым 75%. Нақты массаны тап.",
   "mтеор = 12 г; η = 75%","mнақты — ?",
   "mнақты = 12 × 0,75 = 9 г"],

  ["Теориялық массаны табу",
   "Нақты масса 18 г, шығым 90%. Теориялық массаны анықта.",
   "mнақты = 18 г; η = 90%","mтеор — ?",
   "mтеор = "+frac("18","0,9")+" = 20 г"],

  // 3-ДЕҢГЕЙ

  ["Заряд және зат мөлшері",
   "Шартты есепте q = 19300 Кл. Электрондардың зат мөлшерін және z = 2 болғандағы зат мөлшерін тап.",
   "F = 96500 Кл/моль; z = 2","ν(e⁻), ν(зат) — ?",
   "ν(e⁻) = 0,2 моль<br>ν(зат) = 0,1 моль"],

  ["Екі теориялық масса",
   "Бірдей заряд үшін бірінші заттың k шамасы 0,0003 г/Кл, екіншісінікі 0,0006 г/Кл. Бірінші масса 2 г. Екінші массаны тап.",
   "k₂ = 2k₁; m₁ = 2 г","m₂ — ?",
   "m₂ = 2m₁ = 4 г"],

  ["Теориялық және нақты масса",
   "Шартты есепте M = 72 г/моль, z = 2, q = 9650 Кл. Шығым 80%. Екі массаны тап.",
   "M = 72; z = 2; q = 9650; η = 80%","mтеор, mнақты — ?",
   "mтеор = "+frac("72 × 9650","2 × 96500")+" = 3,6 г<br>mнақты = 2,88 г"],

  ["Массаның пайыздық өзгерісі",
   "Теориялық масса 5 г-нан 8 г-ға артты. Абсолюттік және пайыздық өсімді тап.",
   "m₁ = 5 г; m₂ = 8 г","Δm, өсім — ?",
   "Δm = 3 г<br>"+frac("3","5")+" × 100% = 60%"],

  ["Электрохимиялық эквивалент және масса",
   "Шартты зат үшін M = 96 г/моль, z = 2, q = 1930 Кл. k мен теориялық массаны тап.",
   "M = 96; z = 2; F = 96500; q = 1930","k, m — ?",
   "k = "+frac("96","193000")+" ≈ 0,0004974 г/Кл<br>m = 0,96 г"],

  ["Екі шығымды салыстыру",
   "Теориялық масса 40 г. Бірінші жағдайда шығым 85%, екіншісінде 95%. Нақты массалар мен айырмасын тап.",
   "mтеор = 40 г; η₁ = 85%; η₂ = 95%","m₁, m₂, Δm — ?",
   "m₁ = 34 г<br>m₂ = 38 г<br>Δm = 4 г"],

  ["Зат мөлшері мен масса",
   "Шартты заттың молярлық массасы 50 г/моль. Электрондардың зат мөлшері 0,6 моль, z = 3. Зат мөлшері мен теориялық массаны тап.",
   "M = 50 г/моль; ν(e⁻) = 0,6 моль; z = 3","ν, m — ?",
   "ν = "+frac("0,6","3")+" = 0,2 моль<br>m = 50 × 0,2 = 10 г"],

  ["Масса мен шығымның өзгерісі",
   "Бірінші теориялық масса 25 г, шығым 80%. Екінші теориялық масса 30 г, шығым 90%. Нақты массалардың айырмасын тап.",
   "mтеор₁ = 25 г; mтеор₂ = 30 г; η₁ = 80%; η₂ = 90%","Δm — ?",
   "m₁ = 20 г<br>m₂ = 27 г<br>Δm = 7 г"]
];

/* 15 КОМАНДАЛЫҚ СҰРАҚ */

const quiz=[
  ["Электролиттердегі заряд тасымалдаушылар?",
   ["Нейтрондар","Иондар","Фотондар","Тек электрондар"],1],

  ["Оң зарядталған ион қалай аталады?",
   ["Анион","Атом","Катион","Нейтрон"],2],

  ["Теріс зарядталған ион?",
   ["Анион","Катион","Протон","Кемтік"],0],

  ["Электролиз кезінде катион қайда қозғалады?",
   ["Анодқа","Екі жаққа","Ешқайда","Катодқа"],3],

  ["Фарадейдің бірінші заңы?",
   ["m = UI","m = kq","m = ρV","m = IR"],1],

  ["Фарадей тұрақтысының өлшем бірлігі?",
   ["Ом","Ватт","Кл/моль","Тесла"],2],

  ["Тұрақты ток кезіндегі заряд формуласы?",
   ["q = It","q = I/t","q = IR","q = Pt"],0],

  ["Электрохимиялық эквиваленттің белгісі?",
   ["R","U","F","k"],3],

  ["Фарадей тұрақтысының жуық мәні?",
   ["965","96500","1000","273"],1],

  ["Катодта қандай процесс жүреді?",
   ["Тотығу","Булану","Тотықсыздану","Балқу"],2],

  ["Анион қай электродқа қозғалады?",
   ["Анодқа","Катодқа","Ешқайда","Екеуіне"],0],

  ["Диссоциация кезінде не пайда болады?",
   ["Фотондар","Нейтрондар","Кемтіктер","Иондар"],3],

  ["I = 2 А, t = 5 с. Заряд қанша?",
   ["2 Кл","10 Кл","5 Кл","7 Кл"],1],

  ["Теориялық масса 10 г, нақты масса 8 г. Шығым?",
   ["20%","100%","80%","125%"],2],

  ["Электролиз қай салада қолданылады?",
   ["Металлургия","Геометрия","Музыка","Картография"],0]
];

/* КӨРНЕКІ СЫЗБАЛАР */

let svgId=0;

function diagram(type="ions",value=0.6){
  const id="arrow"+(++svgId);
  const text=(x,y,s,c="#19364f",size=18)=>
    `<text x="${x}" y="${y}" fill="${c}" font-size="${size}"
      text-anchor="middle" font-weight="600">${s}</text>`;
  const arrow=(x,y,X,Y,c)=>
    `<line x1="${x}" y1="${y}" x2="${X}" y2="${Y}"
      stroke="${c}" stroke-width="3" marker-end="url(#${id})"/>`;
  let content="";

  if(["ions","cation","anion","particles"].includes(type)){
    const free=type==="particles";
    content=`<rect x="20" y="35" width="400" height="215" rx="18" fill="#dcefff"/>`;

    if(!free){
      content+=`
        <rect x="35" y="50" width="24" height="180" rx="5" fill="#087dcc"/>
        <rect x="381" y="50" width="24" height="180" rx="5" fill="#d63a50"/>
        ${text(70,24,"Катод −","#087dcc")}
        ${text(370,24,"Анод +","#d63a50")}`;
    }

    for(let i=0;i<8;i++){
      const x=110+i%4*73,y=90+Math.floor(i/4)*90;
      const positive=i%2===0;
      const c=positive?"#d63a50":"#087dcc";
      const opacity=(type==="cation"&&!positive)||(type==="anion"&&positive)?.3:1;
      content+=`<g opacity="${opacity}">
        <circle cx="${x}" cy="${y}" r="18" fill="${c}"/>
        ${text(x,y+6,positive?"+":"−","white",24)}
        ${free?"":arrow(x,y+28,x+(positive?-42:42),y+28,c)}
        </g>`;
    }
    content+=text(220,278,free?"Ерітіндідегі иондар":"Иондардың бағытталған қозғалысы");

  }else if(type==="linear"||type==="charge"){
    const y=230-170*value;
    content=`<path d="M45 25 V230 H415" stroke="#19364f"
      stroke-width="2.5" fill="none"/>
      <path d="M45 230 L395 60" stroke="#087dcc" stroke-width="4"/>
      <circle cx="${45+350*value}" cy="${y}" r="7" fill="#16874e"/>
      ${text(25,30,type==="charge"?"q":"m")}
      ${text(410,260,type==="charge"?"t":"q")}
      ${text(230,30,"Тура пропорционалдық","#16874e",20)}`;

  }else if(type==="efficiency"){
    content=`
      ${text(220,35,"Теориялық және нақты масса","#087dcc",22)}
      <rect x="40" y="70" width="360" height="55" rx="10" fill="#c8e5fa"/>
      <rect x="40" y="155" width="${360*value}" height="55" rx="10" fill="#26ad77"/>
      ${text(220,104,"100%")}
      ${text(220,244,"Нақты масса: "+num(value*100)+"%","#16874e",24)}`;

  }else if(type==="industry"){
    content=["Металлургия","Тазарту","Қорғаныш"].map((s,i)=>`
      <rect x="${10+i*145}" y="40" width="135" height="190"
        rx="15" fill="${["#dcefff","#d9f5e3","#fff0ce"][i]}"/>
      ${text(77+i*145,110,["⚙","◇","✓"][i],"#087dcc",45)}
      ${text(77+i*145,185,s,"#19364f",16)}
    `).join("");

  }else{
    content=`<rect x="20" y="25" width="400" height="230" rx="18" fill="#e1f1ff"/>
      ${text(220,95,type==="constant"?"F = 96500 Кл/моль":"m = kq","#087dcc",30)}
      ${text(220,165,"q = It","#16874e",35)}
      ${text(220,225,"k = M / (zF)","#19364f",26)}`;
  }

  return `<div class="visual">
    <svg viewBox="0 0 440 290" role="img" aria-label="Электролиздің шартты сызбасы">
      <defs><marker id="${id}" markerWidth="7" markerHeight="7"
        refX="6" refY="3" orient="auto">
        <path d="M0 0 L6 3 L0 6 Z" fill="#38576e"/>
      </marker></defs>
      ${content}
    </svg>
    <small>Түсіндірмеге арналған шартты модель</small>
  </div>`;
}

/* 3 ВИРТУАЛДЫ ЗЕРТХАНА */

const labs=[
  {
    title:"Заряд пен теориялық масса",
    label:"Заряд, Кл",min:0,max:5000,step:100,start:2000,
    info:"Шартты модельде k = 0,0005 г/Кл.",
    result:x=>"m = "+num(x*.0005)+" г",
    visual:x=>diagram("linear",x/5000),
    question:"Заряд екі есе артқанда масса қалай өзгереді?",
    answer:"Теориялық масса екі есе артады."
  },
  {
    title:"Фарадей тұрақтысы",
    label:"Заряд, Кл",min:0,max:96500,step:965,start:19300,
    info:"Электрондардың зат мөлшері ν = q/F.",
    result:x=>"ν = "+num(x/F)+" моль",
    visual:()=>diagram("constant"),
    question:"96500 Кл заряд қанша моль электронға сәйкес келеді?",
    answer:"Шамамен 1 моль электрон."
  },
  {
    title:"Ток бойынша шығым",
    label:"Шығым, %",min:0,max:100,step:5,start:80,
    info:"Теориялық масса 10 г болатын математикалық модель.",
    result:x=>"mнақты = "+num(10*x/100)+" г",
    visual:x=>diagram("efficiency",x/100),
    question:"Шығым 50% болса, нақты масса қанша?",
    answer:"5 г."
  }
];

function labPage(i){
  const l=labs[i];
  return heading("ВИРТУАЛДЫ ЗЕРТХАНА · "+(i+1)+" / 3",l.title)+
    card(`<p>${l.info}</p>
      <div class="grid2">
        <div>
          <h3>${l.label}: <b class="blue" id="labValue">${l.start}</b></h3>
          <input type="range" min="${l.min}" max="${l.max}" step="${l.step}"
            value="${l.start}" oninput="updateLab(${i},this.value)">
          <div id="labResult" class="formula">${l.result(l.start)}</div>
        </div>
        <div id="labVisual">${l.visual(l.start)}</div>
      </div>
      <div class="example">
        <h3>Қорытынды</h3>
        <p>${l.question}</p>
        <button onclick="$('labAnswer').classList.toggle('hidden')">Жауапты көрсету</button>
        <p id="labAnswer" class="green hidden">${l.answer}</p>
      </div>
      <p>Бұл экрандағы математикалық модель. Нақты тәжірибе қажет емес.</p>`);
}

function updateLab(i,x){
  x=Number(x);
  $("labValue").textContent=num(x);
  $("labResult").textContent=labs[i].result(x);
  $("labVisual").innerHTML=labs[i].visual(x);
}

/* ОҚУШЫЛАР */

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

const teamNames=["Фарадей","Катион","Анион"];

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
  if(!present().length)return alert("Қатысушы жоқ.");
  if(!confirm("Есептерді қайта араластырамыз ба?"))return;
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
      ${esc(s.name)}</label>`).join("");
  $("attendanceCount").textContent=present().length+" / 24";
}

function markAll(v){
  attendanceDraft=names.map(()=>v);
  renderStudents();
}

function saveAttendance(){
  const changed=students.some((s,i)=>s.present!==attendanceDraft[i]);
  if(changed&&!confirm("Қатысу өзгерсе, есептер мен ұпайлар қайта басталады."))return;
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
      ${completed.has(a.taskId)?"✓":"🎲"} ${esc(students[a.studentId].name)}
      <small>${a.taskId+1}-есеп · ${levels[Math.floor(a.taskId/8)]}</small>
    </button>`).join("")||"Қатысушы жоқ";
}

function openTask(id){
  closePanel("taskPanel");
  closePanel("randomPanel");
  goKey("task"+id);
}

function markDone(id){
  const visible=$("solution")&&!$("solution").classList.contains("hidden");
  if(completed.has(id))completed.delete(id);
  else completed.add(id);
  renderTasks();
  renderPage(false);
  if(visible&&$("solution"))$("solution").classList.remove("hidden");
}

function randomStudent(){
  let pool=present().filter(s=>!drawn.has(s.id));
  if(!present().length)return alert("Қатысушы жоқ.");
  if(!pool.length){
    if(!confirm("Барлық оқушы таңдалды. Қайта бастаймыз ба?"))return;
    drawn.clear();
    pool=present();
  }
  const s=pool[Math.floor(Math.random()*pool.length)];
  drawn.add(s.id);
  randomId=s.id;
  $("randomName").textContent=s.name;
  openPanel("randomPanel");
}

function openRandomTask(){
  const a=assignments.find(x=>x.studentId===randomId);
  if(a)openTask(a.taskId);
}

/* КОМАНДАЛЫҚ ОЙЫН */

function resetGame(){
  clearTimeout(autoNext);
  scores=[0,0,0];
  answers={};
  speakers={};
  used=[new Set(),new Set(),new Set()];
}

function makeTeams(show=false){
  if(show&&present().length<3)return alert("Кемінде 3 оқушы қажет.");
  if(show&&!confirm("Командаларды қайта бөлеміз бе?"))return;
  teams=[[],[],[]];
  shuffle(present()).forEach((s,i)=>teams[i%3].push(s.id));
  resetGame();
  renderTeams();
  if(show){
    renderPage(false);
    openPanel("teamPanel");
  }
}

function teamCards(){
  return teamNames.map((n,i)=>card(`
    <h3 class="blue">${i+1}-топ · ${n}</h3>
    <p>${teams[i].map(id=>esc(students[id].name)).join(", ")||"Қатысушы жоқ"}</p>
    <div class="score">${scores[i]} ұпай</div>
  `)).join("");
}

function renderTeams(){
  $("teams").innerHTML=teamCards();
}

function pickSpeaker(i){
  const k=i%3;
  if(speakers[i]!==undefined)return students[speakers[i]].name;
  let pool=teams[k].filter(id=>!used[k].has(id));
  if(!pool.length){
    used[k].clear();
    pool=teams[k];
  }
  if(!pool.length)return "Қатысушы жоқ";
  const id=pool[Math.floor(Math.random()*pool.length)];
  used[k].add(id);
  speakers[i]=id;
  return students[id].name;
}

function startQuiz(){
  if(teams.some(t=>!t.length))return alert("Кемінде 3 оқушы қажет.");
  resetGame();
  renderTeams();
  closePanel("teamPanel");
  goKey("quiz0");
}

function quizPage(i){
  const q=quiz[i],k=i%3,done=Object.hasOwn(answers,i);

  return heading("КОМАНДАЛЫҚ ОЙЫН · "+(i+1)+" / 15","Электролиз әлемі")+
    `<div class="teamTurn">${teamNames.map((n,j)=>
      `<span class="${j===k?"active":""}">${n} · ${scores[j]} ұпай</span>`
    ).join("")}</div>`+
    card(`
      <div class="definition">
        <h3>${k+1}-топ — ${teamNames[k]}</h3>
        <h2 class="blue">🎲 ${esc(pickSpeaker(i))}</h2>
      </div>
      <h2>${q[0]}</h2>
      <div class="choices">${q[1].map((a,j)=>`
        <button class="choice ${done?
          j===q[2]?"correct":j===answers[i]?"wrong":"":""}"
          ${done?"disabled":""} onclick="submitAnswer(${i},${j})">
          ${"ABCD"[j]}. ${a}
        </button>`).join("")}
      </div>
      ${done?`
        <div class="${answers[i]===q[2]?"definition":"warning"}">
          <p>${answers[i]===q[2]?"Дұрыс жауап! +10 ұпай":
          "Дұрыс жауап жасыл түспен көрсетілді."}</p>
        </div>
        <button class="primary" onclick="go(1)">Келесі команда →</button>
      `:""}
    `);
}

function submitAnswer(i,j){
  if(Object.hasOwn(answers,i)||pages[current].key!=="quiz"+i)return;
  if(teams.some(t=>!t.length))return alert("3 топ қажет.");
  answers[i]=j;
  if(j===quiz[i][2])scores[i%3]+=10;
  renderTeams();
  renderPage(false);
  clearTimeout(autoNext);
  autoNext=setTimeout(()=>{
    if(pages[current].key==="quiz"+i)go(1);
  },4000);
}

/* САБАҚ БЕТТЕРІ */

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
      <p>${t[1]}</p>
      <p>${t[2]}</p>
      ${formula(t[3])}
      <p>${t[4]}</p>
    </div>
    <button onclick="openBoard()">Интерактивті тақта</button>`;
}

function taskPage(a){
  const p=tasks[a.taskId],s=students[a.studentId];
  const level=Math.floor(a.taskId/8);

  return heading("ЖЕКЕ ЕСЕП · "+(assignments.indexOf(a)+1)+" / "+assignments.length,p[0])+
    `<div class="studentBanner">
      <b class="blue">🎲 РАНДОМ ТАҢДАЛДЫ</b>
      <h1>${esc(s.name)}</h1>
      <span class="level ${classes[level]}">${level+1}-деңгей · ${levels[level]}</span>
    </div>`+
    card(`<h2>${p[1]}</h2>
      <div class="data"><b class="blue">Берілгені:</b> ${p[2]}</div>
      <div class="data"><b class="green">Табу керек:</b> ${p[3]}</div>
      <p>Есепті дәптерге шығарып, шешу жолын түсіндір.</p>
      <div class="actions">
        <button class="primary" onclick="$('solution').classList.toggle('hidden')">
          Шешу жолын көрсету
        </button>
        <button onclick="openBoard()">Тақтада шығару</button>
        <button class="${completed.has(a.taskId)?"done":""}"
          onclick="markDone(${a.taskId})">
          ${completed.has(a.taskId)?"✓ Орындалды":"Орындалды деп белгілеу"}
        </button>
        <button onclick="openPanel('taskPanel')">Барлық есептер</button>
        <button onclick="go(1)">Келесі →</button>
      </div>
      <div id="solution" class="hidden">${formula(p[4])}</div>`);
}

/* ҮЙ ТАПСЫРМАСЫ */

function homeworkPage(){
  return heading("ҮЙ ТАПСЫРМАСЫ · 3.3.3","Үйге берілетін тапсырмалар")+
    `<div class="card notebook">
      <span class="level easy">1-ТАПСЫРМА · ТЕОРИЯ</span>
      <h3 class="blue">Бос орындарды толтырыңдар</h3>
      <p>1. Электролиттердегі заряд тасымалдаушылар — ... .</p>
      <p>2. Оң зарядталған иондар ... деп аталады.</p>
      <p>3. Теріс зарядталған иондар ... деп аталады.</p>
      <p>4. Фарадейдің бірінші заңының формуласы — ... .</p>
      <p>5. Фарадей тұрақтысының жуық мәні — ... .</p>
    </div>`+
    card(`
      <span class="level easy">2-ТАПСЫРМА · ЕСЕП</span>
      <h3 class="green">Фарадейдің бірінші заңы</h3>
      <p>Шартты есепте электрохимиялық эквивалент 0,0006 г/Кл.
        Электролит арқылы 3000 Кл заряд өткен деп есептеледі.
        Бөлінетін заттың теориялық массасын анықтаңдар.</p>
      <div class="data">k = 0,0006 г/Кл; q = 3000 Кл</div>
      <div class="data">m — ?</div>
      <p>Берілгенін, формуласын, шешуін және жауабын дәптерге жазыңдар.</p>
    `)+
    card('<h1 class="green">Сабақ аяқталды!</h1><h2>Назарларыңызға рақмет!</h2><p>Сау болыңыздар!</p><b>BY DARKHAN</b>');
}

function buildPages(){
  pages=[];
  sections=[];

  function section(name,items){
    if(items.length){
      sections.push({name,start:pages.length});
      pages.push(...items);
    }
  }

  section("⌂ Басты бет",[{key:"intro",render:()=>
    `<span class="eyebrow">ФИЗИКА · 3.3.3 · 80 МИНУТ</span>
     <div class="card hero">
       <h1 class="blue">${title}</h1>
       <div class="definition">
         <h3>Сабақтың мақсаты</h3>
         <p>Электролиттердегі электр тогының табиғатын түсіну,
         катиондар мен аниондарды ажырату, Фарадей заңдарын
         меңгеру және есептерде қолдану.</p>
       </div>
       ${diagram("ions")}
       ${formula("m = kq<br>m = "+frac("MIt","zF"))}
       <div class="grid3">
         ${card("<h2>15</h2><p>Түсіндірме</p>")}
         ${card("<h2>24</h2><p>Жеке есеп</p>")}
         ${card("<h2>3</h2><p>Команда</p>")}
       </div>
       <button class="primary" onclick="startTimer();go(1)">Сабақты бастау →</button>
       <p class="blue"><b>BY DARKHAN</b></p>
     </div>`}]);

  section("📋 Сабақ жоспары",[{key:"plan",render:()=>
    heading("САБАҚ ЖОСПАРЫ","80 минут")+
    card([
      ["Ұйымдастыру",3],["Түсіндірме",20],["Конспект",12],
      ["Виртуалды зертхана",10],["Жеке есептерді қатар орындау",20],
      ["Командалық ойын",12],["Қорытынды және үй жұмысы",3]
    ].map(([n,t])=>`<div class="data">${n} — <b class="blue">${t} минут</b></div>`).join(""))
  }]);

  section("📖 Түсіндірме",theory.map((t,i)=>({
    key:"theory"+i,render:()=>theoryPage(t,i)
  })));

  section("📘 Конспект",noteIds.map((id,i)=>({
    key:"note"+i,render:()=>notePage(theory[id],i)
  })));

  section("⚗ Виртуалды зертхана",labs.map((_,i)=>({
    key:"lab"+i,render:()=>labPage(i)
  })));

  section("🎲 Жеке есептер",[{key:"taskIntro",render:()=>
    heading("ЖЕКЕ ЖҰМЫС","Рандом есептер")+
    card(`<p>Әр қатысушыға бір есеп кездейсоқ тағайындалды.
      Есімдер қайталанбайды.</p>
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
    section(`${["🟢","🟡","🔴"][k]} ${k+1}-деңгей · ${levels[k]}`,
      assignments.filter(a=>Math.floor(a.taskId/8)===k)
        .map(a=>({key:"task"+a.taskId,render:()=>taskPage(a)})));
  }

  section("🏆 Командалық ойын",[
    {key:"quizIntro",render:()=>
      heading("КОМАНДАЛЫҚ ОЙЫН","Білім жарысы")+
      `<div class="grid3">${teamCards()}</div>`+
      card(`<p>15 сұрақ. Әр командаға 5 сұрақтан беріледі.</p>
        <p>Дұрыс жауапқа 10 ұпай қосылады.</p>
        <p>Қатысушы рандом таңдалады. 4 секундтан кейін келесі топқа ауысады.</p>
        <button onclick="makeTeams(true)">Топтарды қайта бөлу</button>
        <button class="primary" onclick="startQuiz()">Ойынды бастау</button>`)},
    ...quiz.map((_,i)=>({key:"quiz"+i,render:()=>quizPage(i)}))
  ]);

  section("📊 Қорытынды",[{key:"results",render:()=>{
    const total=Object.keys(answers).length;
    const winners=teamNames.filter((_,i)=>scores[i]===Math.max(...scores));

    return heading("ҚОРЫТЫНДЫ","Сабақ нәтижелері")+
      card(`<h3>Жеке есептер</h3>${formula(completed.size+" / "+assignments.length)}`)+
      `<div class="grid3">${teamCards()}</div>`+
      card(`<h2 class="green">${total<15?"Ойын аяқталмаған":
        winners.length===1?"Жеңімпаз: "+winners[0]:
        "Тең нәтиже: "+winners.join(", ")}</h2>
        <p>Жауап берілген сұрақтар: ${total} / 15</p>
        <p>✓ Электролиттер және иондар.</p>
        <p>✓ Электролиз құбылысы.</p>
        <p>✓ Фарадейдің бірінші және екінші заңдары.</p>
        <button onclick="startQuiz()">Қайта ойнау</button>`);
  }}]);

  section("✎ Үй тапсырмасы",[{key:"home",render:homeworkPage}]);

  $("menu").innerHTML=sections.map((s,i)=>
    `<button data-section="${i}" onclick="goPage(${s.start})">${s.name}</button>`).join("");
}

function renderPage(scroll=true){
  current=Math.max(0,Math.min(pages.length-1,current));
  $("stage").innerHTML=`<article class="slide">${pages[current].render()}</article>`;
  $("pageCount").textContent=`${current+1} / ${pages.length}`;
  $("progress").value=(current+1)/pages.length*100;
  let active=0;
  sections.forEach((s,i)=>{if(current>=s.start)active=i});
  document.querySelectorAll("[data-section]").forEach(b=>
    b.classList.toggle("active",Number(b.dataset.section)===active));
  applyScale();
  if(scroll)$("screen").scrollTo(0,0);
}

function goPage(i){
  clearTimeout(autoNext);
  stopReading();
  current=i;
  renderPage();
}
function go(n){goPage(current+n)}
function goKey(key){goPage(Math.max(0,pages.findIndex(p=>p.key===key)))}

/* МАСШТАБ */

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
  if(n===0)$("screen").scrollTo(0,0);
}

function toggleMenu(){
  const hidden=$("app").classList.toggle("menuHidden");
  document.body.classList.toggle("menuHidden",hidden);
  requestAnimationFrame(applyScale);
}

async function fullscreen(){
  try{
    if(document.fullscreenElement)await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  }catch{alert("Толық экран үшін F11 басыңыз.")}
}

/* ДАУЫСТАП ОҚУ */

function stopReading(){
  if("speechSynthesis" in window)speechSynthesis.cancel();
}

function readPage(){
  if(!("speechSynthesis" in window))return alert("Дыбыстау қолжетімсіз.");
  const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("kk"));
  if(!voice)return alert("Қазақша дауыс табылмады.");
  stopReading();
  const u=new SpeechSynthesisUtterance($("stage").innerText);
  u.lang="kk-KZ";
  u.voice=voice;
  speechSynthesis.speak(u);
}

/* ҚОЗҒАЛМАЛЫ ТЕРЕЗЕЛЕР */

let zIndex=200;

function openPanel(id){
  const p=$(id);
  p.classList.remove("hidden");
  p.style.zIndex=++zIndex;
  if(id==="attendance"){
    attendanceDraft=students.map(s=>s.present);
    renderStudents();
  }
  if(id==="taskPanel")renderTasks();
  if(id==="teamPanel")renderTeams();
  clampPanel(p);
}

function closePanel(id){$(id).classList.add("hidden")}

function clampPanel(p){
  if(p.classList.contains("hidden"))return;
  const r=p.getBoundingClientRect();
  p.style.left=Math.max(0,Math.min(r.left,innerWidth-r.width))+"px";
  p.style.top=Math.max(0,Math.min(r.top,innerHeight-r.height))+"px";
  p.style.right="auto";
}

document.querySelectorAll(".floating").forEach(p=>{
  let drag=null,moved=false;

  p.addEventListener("pointerdown",e=>{
    if(e.button!==0||!e.isPrimary)return;
    p.style.zIndex=++zIndex;
    moved=false;
    if(!p.classList.contains("mini")&&!e.target.closest(".handle"))return;
    if(e.target.closest("select,input:not([readonly])"))return;
    const r=p.getBoundingClientRect();
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,l:r.left,t:r.top};
  });

  window.addEventListener("pointermove",e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!moved&&Math.hypot(dx,dy)<6)return;
    if(!moved){
      moved=true;
      try{p.setPointerCapture(e.pointerId)}catch{}
    }
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
    if(moved){
      moved=false;
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);
});

/* ҒЫЛЫМИ КАЛЬКУЛЯТОР */

let expression="",degree=true;

const keys=[
  "DEG","C","⌫","÷","sin","cos","tan","ctg",
  "√","x²","^","×","7","8","9","−",
  "4","5","6","+","1","2","3","(",
  "0",".","π",")","ln","log","EXP","="
];

function renderMath(){
  $("mathKeys").innerHTML=keys.map(k=>
    `<button onclick="mathPress('${k}')">${k==="DEG"?(degree?"DEG":"RAD"):k}</button>`
  ).join("");
}

function mathPress(k){
  try{
    if(k==="DEG"){degree=!degree;renderMath();return}
    if(k==="C"){
      expression="";
      $("mathResult").textContent="0";
    }else if(k==="⌫"){
      expression=expression.slice(0,-1);
    }else if(k==="="){
      const result=evaluate(expression);
      expression=String(Number(result.toPrecision(12)));
      $("mathResult").textContent=num(result);
    }else{
      const map={"÷":"/","×":"*","−":"-","√":"sqrt(","x²":"^2",
        "π":"pi",EXP:"e",sin:"sin(",cos:"cos(",tan:"tan(",
        ctg:"ctg(",ln:"ln(",log:"log("};
      expression+=map[k]||k;
    }
    $("mathDisplay").value=expression.replaceAll("pi","π")
      .replaceAll("sqrt","√").replaceAll("*","×").replaceAll("/","÷");
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
      const op=t[p++],y=product();
      x=op==="+"?x+y:x-y;
    }
    return x;
  }

  function product(){
    let x=unary();
    while(["*","/"].includes(t[p])){
      const op=t[p++],y=unary();
      if(op==="/"&&y===0)throw Error("Қате");
      x=op==="*"?x*y:x/y;
    }
    return x;
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
      const x=sum();
      if(t[p++]!==")")throw Error("Қате");
      return x;
    }
    if(Object.hasOwn(funcs,k)){
      if(t[p++]!=="(")throw Error("Қате");
      const x=sum();
      if(t[p++]!==")")throw Error("Қате");
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

/* ФИЗИКАЛЫҚ КАЛЬКУЛЯТОР */

const physics=[
  ["Ток күші I = U/R",["U (В)","R (Ом)"],v=>v[0]/v[1],"А"],
  ["Кернеу U = IR",["I (А)","R (Ом)"],v=>v[0]*v[1],"В"],
  ["Кедергі R = U/I",["U (В)","I (А)"],v=>v[0]/v[1],"Ом"],
  ["Заряд q = It",["I (А)","t (с)"],v=>v[0]*v[1],"Кл"],
  ["Ток күші I = q/t",["q (Кл)","t (с)"],v=>v[0]/v[1],"А"],
  ["Уақыт t = q/I",["q (Кл)","I (А)"],v=>v[0]/v[1],"с"],
  ["Масса m = kq",["k (г/Кл)","q (Кл)"],v=>v[0]*v[1],"г"],
  ["Масса m = kIt",["k (г/Кл)","I (А)","t (с)"],v=>v[0]*v[1]*v[2],"г"],
  ["Эквивалент k = m/q",["m (г)","q (Кл)"],v=>v[0]/v[1],"г/Кл"],
  ["Заряд q = m/k",["m (г)","k (г/Кл)"],v=>v[0]/v[1],"Кл"],
  ["Фарадей заңы k = M/(zF)",["M (г/моль)","z"],
    v=>Number.isInteger(v[1])&&v[1]>0?v[0]/(v[1]*F):NaN,"г/Кл"],
  ["Фарадей заңы m = Mq/(zF)",["M (г/моль)","q (Кл)","z"],
    v=>Number.isInteger(v[2])&&v[2]>0?v[0]*v[1]/(v[2]*F):NaN,"г"],
  ["Электрондардың зат мөлшері",["q (Кл)"],v=>v[0]/F,"моль"],
  ["Ток бойынша шығым",["Нақты масса (г)","Теориялық масса (г)"],
    v=>v[0]<=v[1]?100*v[0]/v[1]:NaN,"%"],
  ["Нақты масса",["Теориялық масса (г)","Шығым (%)"],
    v=>v[1]<=100?v[0]*v[1]/100:NaN,"г"],
  ["Қуат P = UI",["U (В)","I (А)"],v=>v[0]*v[1],"Вт"],
  ["Жұмыс A = UIt",["U (В)","I (А)","t (с)"],v=>v[0]*v[1]*v[2],"Дж"]
];

function initPhysics(){
  $("physicsFormula").innerHTML=physics.map((f,i)=>
    `<option value="${i}">${f[0]}</option>`).join("");
  physicsInputs();
}

function physicsInputs(){
  const f=physics[+$("physicsFormula").value];
  $("physicsInputs").innerHTML=f[1].map((n,i)=>
    `<label>${n}</label><input id="phys${i}" inputmode="decimal" placeholder="Мәні">`
  ).join("");
  $("physicsResult").textContent="Нәтиже";
  clampPanel($("physicsPanel"));
}

function calculatePhysics(){
  try{
    const f=physics[+$("physicsFormula").value];
    const v=f[1].map((_,i)=>{
      const s=$("phys"+i).value.trim().replace(",",".");
      if(!/^[+]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s))throw Error();
      const n=Number(s);
      if(!Number.isFinite(n)||n<0)throw Error();
      return n;
    });

    const x=f[2](v);
    if(!Number.isFinite(x)||x<0)throw Error();
    $("physicsResult").textContent=num(x)+" "+f[3];
  }catch{$("physicsResult").textContent="Мәндерді тексеріңіз"}
}

/* ИНТЕРАКТИВТІ ТАҚТА */

const canvas=$("canvas"),ctx=canvas.getContext("2d");
const W=1600,H=900;

let tool="pen",boardScale=100,boardIndex=0;
let boardPages=[{actions:[],redo:[],grid:false}];
let draft=null,pointer=null,pan=null;

const state=()=>boardPages[boardIndex];

function setTool(t){
  cancelDrawing();
  tool=t;
  canvas.style.cursor=t==="hand"?"grab":t==="text"?"text":"crosshair";
}

function openBoard(){
  clearTimeout(autoNext);
  stopReading();
  $("board").classList.remove("hidden");
  resizeBoard();
}

function closeBoard(){
  cancelDrawing();
  $("board").classList.add("hidden");
}

function point(e){
  const r=canvas.getBoundingClientRect();
  return {
    x:(e.clientX-r.left)*W/r.width,
    y:(e.clientY-r.top)*H/r.height
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
    ctx.clearRect(0,0,W,H);

  }else if(a.type==="image"){
    ctx.drawImage(a.img,a.x,a.y,a.w,a.h);

  }else if(a.type==="text"){
    ctx.font=`600 ${Math.max(24,a.size*4)}px Segoe UI`;
    ctx.textBaseline="top";
    ctx.fillText(a.text,a.start.x,a.start.y);

  }else if(["pen","marker","eraser"].includes(a.type)){
    if(a.type==="marker")ctx.globalAlpha=.3;
    if(a.type==="eraser")ctx.globalCompositeOperation="destination-out";

    ctx.beginPath();
    const p=a.points[0];

    if(a.points.length===1||
      a.points.every(q=>q.x===p.x&&q.y===p.y)){
      ctx.arc(p.x,p.y,a.size/2,0,Math.PI*2);
      ctx.fill();
    }else{
      ctx.moveTo(p.x,p.y);
      a.points.slice(1).forEach(q=>ctx.lineTo(q.x,q.y));
      ctx.stroke();
    }
  }else{
    const p=a.start,q=a.end,dx=q.x-p.x,dy=q.y-p.y;
    ctx.beginPath();

    if(a.type==="line"||a.type==="arrow"){
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(q.x,q.y);
    }

    if(a.type==="arrow"){
      const angle=Math.atan2(dy,dx),l=Math.max(18,a.size*3);
      ctx.lineTo(q.x-l*Math.cos(angle-.5),q.y-l*Math.sin(angle-.5));
      ctx.moveTo(q.x,q.y);
      ctx.lineTo(q.x-l*Math.cos(angle+.5),q.y-l*Math.sin(angle+.5));
    }

    if(a.type==="rect")ctx.rect(p.x,p.y,dx,dy);

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
  ctx.clearRect(0,0,W,H);
  state().actions.forEach(draw);
  if(draft)draw(draft);

  $("boardCount").textContent=(boardIndex+1)+"/"+boardPages.length;
  const p=$("paper");
  const step=Math.max(1,40*p.clientWidth/W);

  p.style.backgroundImage=state().grid?
    "linear-gradient(#d5e6f3 1px,transparent 1px),linear-gradient(90deg,#d5e6f3 1px,transparent 1px)":
    "none";

  p.style.backgroundSize=step+"px "+step+"px";
}

function commit(a){
  state().actions.push(a);
  state().redo=[];
  renderBoard();
}

/* ТІНТУІР ЖӘНЕ СЕНСОРЛЫ ЭКРАН */

canvas.addEventListener("pointerdown",e=>{
  if(e.button!==0||!e.isPrimary||pointer!==null)return;
  e.preventDefault();

  const p=point(e);
  const size=+$("penSize").value;
  const color=$("ink").value;

  if(tool==="text"){
    const text=prompt("Мәтінді енгізіңіз:");
    if(text&&text.trim())commit({
      type:"text",text:text.trim(),start:p,size,color
    });
    return;
  }

  pointer=e.pointerId;
  canvas.setPointerCapture(pointer);

  if(tool==="hand"){
    pan={
      x:e.clientX,y:e.clientY,
      l:$("boardViewport").scrollLeft,
      t:$("boardViewport").scrollTop
    };
    canvas.style.cursor="grabbing";
    return;
  }

  draft={
    type:tool,color,
    size:tool==="marker"?size*4:
      tool==="eraser"?Math.max(15,size*3):size,
    start:p,end:p,points:[p]
  };

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
  const p=point(e);
  draft.end=p;
  draft.points.push(p);
  renderBoard();
});

function finish(e,cancel=false){
  if(pointer!==e.pointerId)return;

  const a=draft;
  if(a&&!cancel){
    a.end=point(e);
    a.points.push(a.end);
  }

  draft=null;
  pan=null;
  pointer=null;

  if(a&&!cancel)commit(a);
  else renderBoard();

  if(canvas.hasPointerCapture(e.pointerId))
    canvas.releasePointerCapture(e.pointerId);

  if(tool==="hand")canvas.style.cursor="grab";
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

canvas.addEventListener("pointerup",e=>finish(e));
canvas.addEventListener("pointercancel",e=>finish(e,true));
canvas.addEventListener("lostpointercapture",e=>finish(e,true));

/* ТАҚТА БЕТТЕРІ */

function undo(){
  cancelDrawing();
  if(state().actions.length)
    state().redo.push(state().actions.pop());
  renderBoard();
}

function redo(){
  cancelDrawing();
  if(state().redo.length)
    state().actions.push(state().redo.pop());
  renderBoard();
}

function clearBoard(){
  if(!confirm("Тақтаны тазалаймыз ба?"))return;
  cancelDrawing();
  commit({type:"clear"});
}

function toggleGrid(){
  state().grid=!state().grid;
  renderBoard();
}

function newBoardPage(){
  cancelDrawing();
  boardPages.push({actions:[],redo:[],grid:false});
  boardIndex=boardPages.length-1;
  renderBoard();
}

function boardPage(n){
  cancelDrawing();
  boardIndex=Math.max(0,Math.min(boardPages.length-1,boardIndex+n));
  renderBoard();
}

function deleteBoardPage(){
  if(!confirm("Бетті өшіреміз бе?"))return;
  cancelDrawing();
  boardPages.splice(boardIndex,1);

  if(!boardPages.length)
    boardPages.push({actions:[],redo:[],grid:false});

  boardIndex=Math.min(boardIndex,boardPages.length-1);
  renderBoard();
}

function resizeBoard(){
  if($("board").classList.contains("hidden"))return;

  const v=$("boardViewport");
  const width=Math.max(1,
    Math.min(v.clientWidth-24,(v.clientHeight-24)*W/H)
  )*boardScale/100;

  $("paper").style.width=width+"px";
  $("paper").style.margin=width>v.clientWidth-24?"0":"0 auto";
  $("boardScale").textContent=boardScale+"%";
  renderBoard();
}

function boardZoom(n){
  boardScale=n===0?100:Math.max(25,Math.min(300,boardScale+n));
  resizeBoard();
  if(n===0)$("boardViewport").scrollTo(0,0);
}

/* СУРЕТ ҚОСУ */

function importImage(e){
  const file=e.target.files[0];
  if(!file)return;

  const target=state(),img=new Image();
  const url=URL.createObjectURL(file);

  img.onload=()=>{
    const k=Math.min(1000/img.width,650/img.height,1);
    const w=img.width*k,h=img.height*k;

    if(boardPages.includes(target)){
      target.actions.push({
        type:"image",img,w,h,x:(W-w)/2,y:(H-h)/2
      });
      target.redo=[];
      renderBoard();
    }

    URL.revokeObjectURL(url);
  };

  img.onerror=()=>{
    URL.revokeObjectURL(url);
    alert("Сурет ашылмады");
  };

  img.src=url;
  e.target.value="";
}

/* PNG САҚТАУ */

function saveBoard(){
  const out=document.createElement("canvas");
  out.width=W;
  out.height=H;

  const c=out.getContext("2d");
  c.fillStyle="white";
  c.fillRect(0,0,W,H);

  if(state().grid){
    c.strokeStyle="#d5e6f3";

    for(let x=0;x<W;x+=40){
      c.beginPath();
      c.moveTo(x,0);
      c.lineTo(x,H);
      c.stroke();
    }

    for(let y=0;y<H;y+=40){
      c.beginPath();
      c.moveTo(0,y);
      c.lineTo(W,y);
      c.stroke();
    }
  }

  c.drawImage(canvas,0,0);

  const a=document.createElement("a");
  a.download=`physics-333-board-${boardIndex+1}.png`;
  a.href=out.toDataURL("image/png");
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* АЛМАТЫ УАҚЫТЫ ЖӘНЕ 80 МИНУТТЫҚ ТАЙМЕР */

let remaining=4800,deadline=0,running=false;

function updateTime(){
  const d=new Date(Date.now()+5*3600000);

  $("clock").textContent=d.toLocaleTimeString("kk-KZ",{
    timeZone:"UTC",
    hourCycle:"h23",
    hour:"2-digit",
    minute:"2-digit",
    second:"2-digit"
  });

  $("date").textContent=d.toLocaleDateString("kk-KZ",{
    timeZone:"UTC",
    year:"numeric",
    month:"long",
    day:"numeric"
  });

  if(running)
    remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));

  if(!remaining)running=false;

  $("timer").textContent=
    String(Math.floor(remaining/60)).padStart(2,"0")+
    ":"+String(remaining%60).padStart(2,"0");

  $("timerBtn").textContent=running?"Тоқтату":"Бастау";
  $("timerBtn").disabled=remaining===0;
  $("timer").style.color=remaining<=300?"#d63a50":"#16874e";
}

function startTimer(){
  if(running||remaining<=0)return;
  deadline=Date.now()+remaining*1000;
  running=true;
  updateTime();
}

function toggleTimer(){
  if(running){
    updateTime();
    running=false;
    updateTime();
  }else startTimer();
}

function resetTimer(){
  if(!confirm("Таймерді 80 минутқа қайтарамыз ба?"))return;
  remaining=4800;
  running=false;
  updateTime();
}

/* ПЕРНЕТАҚТАДАН БАСҚАРУ */

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
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){
      e.preventDefault();
      if(e.shiftKey)redo();
      else undo();
    }

    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){
      e.preventDefault();
      redo();
    }
    return;
  }

  if(e.key==="ArrowRight")go(1);
  if(e.key==="ArrowLeft")go(-1);

  if(!e.ctrlKey&&!e.metaKey){
    if(e.key==="+")zoom(25);
    if(e.key==="-")zoom(-25);
    if(e.key==="0")zoom(0);
  }
});

function onResize(){
  applyScale();
  resizeBoard();
  document.querySelectorAll(".floating").forEach(clampPanel);
}

window.addEventListener("resize",onResize);
document.addEventListener("fullscreenchange",onResize);

/* САЙТТЫ ІСКЕ ҚОСУ */

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

console.log("PHYSICS LAB PRO — 3.3.3");
console.log("Түсіндірме:",theory.length);
console.log("Конспект:",noteIds.length);
console.log("Жеке есептер:",tasks.length);
console.log("Командалық сұрақтар:",quiz.length);
console.log("Барлық беттер:",pages.length);

/* BY DARKHAN */
