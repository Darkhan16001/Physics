
"use strict";

const $=id=>document.getElementById(id);
const num=n=>Number.isFinite(n)?String(+n.toPrecision(10)).replace(".",","):"Қате";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));
const frac=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const formula=s=>`<div class="formula">${s}</div>`;
const card=s=>`<div class="card">${s}</div>`;
const heading=(s,t)=>`<span class="eyebrow">${s}</span><h2>${t}</h2>`;

const title="Металдардағы электр тогы. Асқынөткізгіштік. Жартылай өткізгіштердегі электр тогы.";

const teamNames=["Электрон","Кристалл","Кремний"];
const levels=["Оңай","Орташа","Күрделі"];
const classes=["easy","medium","hard"];

/* 15 ТҮСІНДІРМЕ */

const theory=[
  ["Металдардағы электр тогы",
   "Металдардағы электр тогы — еркін электрондардың бағытталған қозғалысы.",
   "Металдың кристалдық торында оң иондар орналасады. Еркін электрондар электр өрісі болмаған кезде ретсіз қозғалады. Электр өрісі әсер еткенде электрондардың бағытталған дрейфі пайда болады.",
   "I = "+frac("q","t"),
   "Мыс, алюминий және күміс электр тогын жақсы өткізетін металдарға жатады.","metal"],

  ["Металдың кристалдық торы",
   "Кристалдық тор — бөлшектердің кеңістікте белгілі бір тәртіппен орналасуы.",
   "Металдағы оң иондар тепе-теңдік орнының маңында тербеледі. Еркін электрондардың осы тордағы бөлшектермен шашырауы металдың электр кедергісінің пайда болуына ықпал етеді.",
   "Оң иондар + еркін электрондар",
   "Температура артқанда кристалдық тордың жылулық тербелістері күшейеді.","lattice"],

  ["Электрондардың қозғалысы",
   "Электрон — теріс зарядталған элементар бөлшек.",
   "Электрондардың бағытталған қозғалысы шартты ток бағытына қарама-қарсы болады. Металдардағы электр тогын негізінен еркін электрондар тасымалдайды.",
   "qₑ = −1,6 × 10⁻¹⁹ Кл",
   "Электрондардың қозғалыс бағыты мен шартты ток бағытын шатастырмау керек.","direction"],

  ["Ток күші",
   "Ток күші өткізгіштің көлденең қимасынан уақыт бірлігінде өтетін электр зарядымен анықталады.",
   "Ток күші ампермен өлшенеді. Егер белгілі бір уақыт ішінде өткізгіштен өткен заряд белгілі болса, ток күшін есептеуге болады.",
   "I = "+frac("q","t")+"; q = It",
   "12 Кл заряд 4 секундта өтсе, ток күші 3 А болады.","charge"],

  ["Электр кедергісі",
   "Электр кедергісі — өткізгіштің электр тогына қарсы әсерін сипаттайтын шама.",
   "Кедергі өткізгіштің материалына, ұзындығына, көлденең қимасының ауданына және температурасына тәуелді. Өткізгіш неғұрлым ұзын болса, бірдей басқа жағдайларда оның кедергісі соғұрлым үлкен болады.",
   "R = "+frac("ρl","S"),
   "Ұзындығы екі есе артқан бірдей өткізгіштің кедергісі де екі есе артады.","wire"],

  ["Меншікті электр кедергісі",
   "Меншікті кедергі — материалдың электрлік қасиетін сипаттайтын физикалық шама.",
   "Меншікті кедергі ρ әрпімен белгіленеді. Халықаралық бірліктер жүйесіндегі өлшем бірлігі — Ом·м. Есептерде Ом·мм²/м бірлігі де кездеседі.",
   "ρ = "+frac("RS","l"),
   "Мыстың меншікті кедергісі шамамен 0,017 Ом·мм²/м.","wire"],

  ["Ом заңы",
   "Тізбек бөлігіндегі ток күші кернеуге тура, ал кедергіге кері пропорционал.",
   "Температура тұрақты болған кезде омдық өткізгіш үшін кернеу мен ток күшінің арасында сызықтық байланыс болады.",
   "I = "+frac("U","R"),
   "Кернеу 12 В, кедергі 4 Ом болса, ток күші 3 А.","ohm"],

  ["Температураға тәуелділік",
   "Кәдімгі металдардың кедергісі температура жоғарылағанда көбіне артады.",
   "Металл қызған сайын тордағы иондардың тербелісі күшейеді. Электрондардың шашырауы артып, электр тогының өтуіне кедергі көбейеді. Шектеулі температура аралығында сызықтық жуықтау қолданылады.",
   "R = R₀(1 + αΔT)",
   "Бастапқы кедергі 10 Ом, α = 0,004 К⁻¹, ΔT = 50 К болса, R = 12 Ом.","temperature"],

  ["Температуралық коэффициент",
   "Температуралық коэффициент кедергінің температура өзгерісіне тәуелділігін сипаттайды.",
   "α коэффициенті материалдың түріне байланысты. Оның өлшем бірлігі К⁻¹. Температура айырмасы кельвинмен де, Цельсий градусымен де сан жағынан бірдей өрнектеледі.",
   "α = "+frac("R − R₀","R₀ΔT"),
   "Көптеген кәдімгі металдар үшін температуралық коэффициент оң болады.","temperature"],

  ["Асқынөткізгіштік",
   "Асқынөткізгіштік — белгілі жағдайларда материалдың тұрақты токқа электр кедергісінің нөлге дейін төмендеу құбылысы.",
   "Кейбір материалдар критикалық температурадан төмендегенде асқынөткізгіш күйге өтеді. Бұл күй магнит өрісі мен токтың критикалық шектеріне де байланысты.",
   "R = 0 — асқынөткізгіш күйде",
   "Асқынөткізгіштік кәдімгі металдың кедергісінің азаюынан ерекшеленеді.","super"],

  ["Критикалық температура",
   "Критикалық температура — қалыпты күй мен асқынөткізгіш күй арасындағы ауысу температурасы.",
   "Әр асқынөткізгіш материалдың критикалық температурасы әртүрлі. Асқынөткізгіштерде белгілі жағдайларда магнит өрісінің ығыстырылуы, яғни Мейснер эффектісі байқалады.",
   "Tс — критикалық температура",
   "Асқынөткізгіштер медицинада, ғылыми зерттеулерде және магниттік жүйелерде қолданылады.","super"],

  ["Жартылай өткізгіштер",
   "Жартылай өткізгіштер — электр өткізгіштігі әртүрлі сыртқы факторларға сезімтал материалдар.",
   "Олардың өткізгіштігі температураға, жарыққа және қоспалардың құрамына тәуелді. Меншікті жартылай өткізгіште температура артқан сайын заряд тасымалдаушылар саны көбейеді.",
   "Si — кремний; Ge — германий",
   "Кремний заманауи микроэлектроникада кең қолданылады.","semi"],

  ["Электрондар мен кемтіктер",
   "Жартылай өткізгіштердегі заряд тасымалдаушылар — электрондар мен кемтіктер.",
   "Кемтік — электронның бос қалған орнына сәйкес келетін оң заряд тасымалдаушы. Электр өрісінде электрондар мен кемтіктер қарама-қарсы бағытта қозғалады.",
   "Электрон: −e; кемтік: +e",
   "Меншікті жартылай өткізгіште электрон мен кемтік жұппен пайда болады.","semi"],

  ["n-типті және p-типті жартылай өткізгіштер",
   "Қоспалы жартылай өткізгіштер негізгі заряд тасымалдаушылардың түріне байланысты жіктеледі.",
   "n-типті жартылай өткізгіште негізгі тасымалдаушылар электрондар, ал p-типті материалда кемтіктер болады. Екі материал да жалпы алғанда электрлік бейтарап болуы мүмкін.",
   "n-тип — электрондар<br>p-тип — кемтіктер",
   "Екі типтегі материалдың шекарасы p–n ауысу деп аталады.","pn"],

  ["Жартылай өткізгіштердің қолданылуы",
   "Жартылай өткізгіштер — қазіргі электрондық техниканың негізі.",
   "Диод, транзистор, микропроцессор, жарық сезгіш датчик және күн элементтерінің жұмысында жартылай өткізгіштік қасиеттер қолданылады. Диод токты негізінен бір бағытта өткізеді.",
   "Диод · Транзистор · Күн элементі",
   "Телефондар мен компьютерлердің микросхемалары жартылай өткізгіштерге негізделген.","devices"]
];

const noteIds=[0,1,3,4,6,7,9,11,12,13];

/* 24 ЖЕКЕ ЕСЕП */

const tasks=[
  // 1-ДЕҢГЕЙ: 8 ОҢАЙ ЕСЕП
  ["Ток күші",
   "18 Кл заряд 6 секундта өтті. Ток күшін анықта.",
   "q = 18 Кл; t = 6 с","I — ?",
   "I = "+frac(18,6)+" = 3 А"],

  ["Электр заряды",
   "Ток күші 2 А, уақыт 30 с. Электр зарядын тап.",
   "I = 2 А; t = 30 с","q — ?",
   "q = It = 2 × 30 = 60 Кл"],

  ["Ом заңы",
   "Кернеу 24 В, кедергі 8 Ом. Ток күшін есепте.",
   "U = 24 В; R = 8 Ом","I — ?",
   "I = "+frac(24,8)+" = 3 А"],

  ["Кедергі",
   "Кернеу 12 В, ток күші 2 А. Кедергіні тап.",
   "U = 12 В; I = 2 А","R — ?",
   "R = "+frac(12,2)+" = 6 Ом"],

  ["Кернеу",
   "Ток күші 4 А, кедергі 5 Ом. Кернеуді анықта.",
   "I = 4 А; R = 5 Ом","U — ?",
   "U = IR = 4 × 5 = 20 В"],

  ["Уақыт",
   "Ток күші 3 А. 90 Кл заряд қанша уақытта өтеді?",
   "I = 3 А; q = 90 Кл","t — ?",
   "t = "+frac(90,3)+" = 30 с"],

  ["Өткізгіш ұзындығы",
   "Өткізгіштің кедергісі 4 Ом. Қимасы мен материалы өзгермей, ұзындығы 3 есе артты. Жаңа кедергіні тап.",
   "R₁ = 4 Ом; l₂ = 3l₁","R₂ — ?",
   "R₂ = 3R₁ = 12 Ом"],

  ["Көлденең қима",
   "Өткізгіштің кедергісі 16 Ом. Ұзындығы мен материалы өзгермей, қима ауданы екі есе артты.",
   "R₁ = 16 Ом; S₂ = 2S₁","R₂ — ?",
   "R₂ = "+frac(16,2)+" = 8 Ом"],

  // 2-ДЕҢГЕЙ: 8 ОРТАША ЕСЕП
  ["Металдың кедергісі",
   "ρ = 0,017 Ом·мм²/м, l = 20 м, S = 2 мм². Кедергіні тап.",
   "ρ = 0,017; l = 20 м; S = 2 мм²","R — ?",
   "R = "+frac("0,017 × 20",2)+" = 0,17 Ом"],

  ["Меншікті кедергі",
   "Ұзындығы 10 м, қимасы 2 мм² өткізгіштің кедергісі 0,14 Ом. Меншікті кедергіні анықта.",
   "R = 0,14 Ом; l = 10 м; S = 2 мм²","ρ — ?",
   "ρ = "+frac("0,14 × 2",10)+" = 0,028 Ом·мм²/м"],

  ["Температуралық кедергі",
   "Бастапқы кедергі 10 Ом. α = 0,004 К⁻¹, температура 50 К-ге артты.",
   "R₀ = 10 Ом; α = 0,004 К⁻¹; ΔT = 50 К","R — ?",
   "R = 10(1 + 0,004 × 50) = 12 Ом"],

  ["Металдың қызуы",
   "Кедергі 25 Ом. Температура 40 К-ге артты. α = 0,004 К⁻¹.",
   "R₀ = 25 Ом; ΔT = 40 К; α = 0,004 К⁻¹","R — ?",
   "R = 25(1 + 0,004 × 40) = 29 Ом"],

  ["Металдың салқындауы",
   "Бастапқы кедергі 20 Ом, температура 25 К-ге төмендеді. α = 0,004 К⁻¹.",
   "R₀ = 20 Ом; ΔT = −25 К; α = 0,004 К⁻¹","R — ?",
   "R = 20(1 − 0,004 × 25) = 18 Ом"],

  ["Өткізгіш ұзындығын анықтау",
   "R = 0,34 Ом, S = 1 мм², ρ = 0,017 Ом·мм²/м. Ұзындықты тап.",
   "R = 0,34 Ом; S = 1 мм²; ρ = 0,017","l — ?",
   "l = "+frac("0,34 × 1","0,017")+" = 20 м"],

  ["Қима ауданын есептеу",
   "ρ = 0,028 Ом·мм²/м, l = 20 м, R = 0,28 Ом. Қиманы тап.",
   "ρ = 0,028; l = 20 м; R = 0,28 Ом","S — ?",
   "S = "+frac("0,028 × 20","0,28")+" = 2 мм²"],

  ["Кедергінің пайыздық өзгерісі",
   "Металл кедергісі 20 Ом-нан 25 Ом-ға артты. Пайыздық өсімді тап.",
   "R₀ = 20 Ом; R = 25 Ом","Өсім — ?",
   frac("25 − 20",20)+" × 100% = 25%"],

  // 3-ДЕҢГЕЙ: 8 КҮРДЕЛІ ЕСЕП
  ["Температуралық коэффициент",
   "Температура 50 К-ге артқанда кедергі 30 Ом-нан 36 Ом-ға өсті. α коэффициентін тап.",
   "R₀ = 30 Ом; R = 36 Ом; ΔT = 50 К","α — ?",
   "α = "+frac("36 − 30","30 × 50")+" = 0,004 К⁻¹"],

  ["Температура айырмасы",
   "Кедергі 10 Ом-нан 14 Ом-ға өсті. α = 0,004 К⁻¹. Температура айырмасын есепте.",
   "R₀ = 10 Ом; R = 14 Ом; α = 0,004 К⁻¹","ΔT — ?",
   "ΔT = "+frac("14 − 10","10 × 0,004")+" = 100 К"],

  ["Қызған өткізгіштегі ток",
   "Кернеу 24 В. Бастапқы кедергі 10 Ом. Температура 50 К-ге артты, α = 0,004 К⁻¹. Жаңа кедергі мен токты тап.",
   "U = 24 В; R₀ = 10 Ом; ΔT = 50 К","R, I — ?",
   "R = 10(1 + 0,004 × 50) = 12 Ом<br>I = "+frac(24,12)+" = 2 А"],

  ["Ток күшінің өзгеруі",
   "Кернеу тұрақты және 20 В. Кедергі 4 Ом-нан 5 Ом-ға артты. Бастапқы және соңғы токтарды салыстыр.",
   "U = 20 В; R₁ = 4 Ом; R₂ = 5 Ом","I₁, I₂, ΔI — ?",
   "I₁ = 5 А; I₂ = 4 А<br>Ток 1 А-ге азайды."],

  ["Ұзындық пен қиманың өзгерісі",
   "Өткізгіштің бастапқы кедергісі 6 Ом. Ұзындығы 2 есе, қимасы 3 есе артты.",
   "R₁ = 6 Ом; l₂ = 2l₁; S₂ = 3S₁","R₂ — ?",
   "R₂ = "+frac("6 × 2",3)+" = 4 Ом"],

  ["Екі металды салыстыру",
   "Бірдей ұзындық пен қимада бірінші материалдың ρ = 0,017, екіншісінің ρ = 0,028 Ом·мм²/м. Кедергілердің қатынасын тап.",
   "ρ₁ = 0,017; ρ₂ = 0,028","R₂/R₁ — ?",
   frac("R₂","R₁")+" = "+frac("0,028","0,017")+" ≈ 1,65"],

  ["Электрондар саны",
   "Өткізгіш қимасынан 3,2 × 10⁻¹⁹ Кл заряд модулі өтті деп есептейік. Бұл неше электронның зарядына тең?",
   "q = 3,2 × 10⁻¹⁹ Кл; e = 1,6 × 10⁻¹⁹ Кл","N — ?",
   "N = "+frac("3,2 × 10⁻¹⁹","1,6 × 10⁻¹⁹")+" = 2"],

  ["Бастапқы кедергі",
   "Температура 50 К-ге артқаннан кейін кедергі 36 Ом болды. α = 0,004 К⁻¹. Бастапқы кедергіні тап.",
   "R = 36 Ом; ΔT = 50 К; α = 0,004 К⁻¹","R₀ — ?",
   "R₀ = "+frac(36,"1 + 0,004 × 50")+" = 30 Ом"]
];

/* 15 КОМАНДАЛЫҚ СҰРАҚ */

const quiz=[
  ["Металдардағы негізгі заряд тасымалдаушы?",
   ["Ион","Электрон","Нейтрон","Протон"],1],
  ["Кедергінің өлшем бірлігі?",
   ["Вольт","Ампер","Ом","Ватт"],2],
  ["Ом заңының формуласы?",
   ["I = U/R","I = UR","I = Rt","I = qR"],0],
  ["Металл қызғанда кристалдық тордың тербелісі?",
   ["Жойылады","Тоқтайды","Өзгермейді","Күшейеді"],3],
  ["Меншікті кедергінің белгісі?",
   ["α","ρ","I","q"],1],
  ["Металдың кедергісі қызғанда көбіне?",
   ["Азаяды","Нөл болады","Артады","Өзгермейді"],2],
  ["Асқынөткізгіштің тұрақты токқа кедергісі?",
   ["Нөл","1 Ом","100 Ом","Шексіз"],0],
  ["Критикалық температураның белгісі?",
   ["U","R","I","Tс"],3],
  ["Жартылай өткізгішке мысал?",
   ["Мыс","Кремний","Темір","Күміс"],1],
  ["p-типті материалдың негізгі тасымалдаушысы?",
   ["Нейтрон","Фотон","Кемтік","Протон"],2],
  ["n-типті материалдың негізгі тасымалдаушысы?",
   ["Электрон","Кемтік","Нейтрон","Молекула"],0],
  ["Кернеу тұрақты, кедергі екі есе артса, ток күші?",
   ["Екі есе артады","Төрт есе артады","Өзгермейді","Екі есе азаяды"],3],
  ["U = 12 В, R = 4 Ом. Ток күші қанша?",
   ["2 А","3 А","4 А","48 А"],1],
  ["Электронның заряды?",
   ["Оң","Нөл","Теріс","Айнымалы"],2],
  ["Жартылай өткізгіштікке негізделген құрылғы?",
   ["Транзистор","Серіппе","Термос","Сызғыш"],0]
];

/* КӨРНЕКІ СЫЗБАЛАР */

function diagram(type,value=.6){
  const text=(x,y,s,c="#19364f",size=18)=>
    `<text x="${x}" y="${y}" fill="${c}" font-size="${size}"
      text-anchor="middle" font-weight="600">${s}</text>`;
  let s="";
  if(["metal","lattice","direction"].includes(type)){
    s='<rect x="20" y="20" width="400" height="205" rx="15" fill="#deedfa"/>';
    for(let i=0;i<24;i++){
      const x=50+(i%6)*68,y=45+Math.floor(i/6)*53;
      s+=`<circle cx="${x}" cy="${y}" r="14" fill="#9abbd6"/>${text(x,y+5,"+","white",18)}`;
    }
    if(type!=="lattice"){
      for(let i=0;i<10;i++){
        const x=42+(i%5)*84,y=72+Math.floor(i/5)*106;
        s+=`<circle cx="${x}" cy="${y}" r="9" fill="#087dcc"/>${text(x,y+4,"−","white",14)}`;
      }
      s+=text(220,252,"← Электрондар","#087dcc",20)+
        text(220,280,"Шартты ток бағыты →","#d63a50",19);
    }else s+=text(220,263,"Кристалдық тор");
  }else if(type==="semi"||type==="pn"){
    s=`<rect x="20" y="35" width="200" height="200" rx="10" fill="#ffdfeb"/>
       <rect x="220" y="35" width="200" height="200" rx="10" fill="#dcefff"/>
       ${text(120,80,type==="pn"?"p-тип":"Кемтіктер","#d63a50",25)}
       ${text(320,80,type==="pn"?"n-тип":"Электрондар","#087dcc",25)}`;
    for(let i=0;i<6;i++){
      const y=115+Math.floor(i/3)*65,x=55+i%3*65;
      s+=`<circle cx="${x}" cy="${y}" r="17" fill="white" stroke="#d63a50" stroke-width="3"/>
        ${text(x,y+6,"+","#d63a50",22)}
        <circle cx="${x+200}" cy="${y}" r="17" fill="#087dcc"/>
        ${text(x+200,y+6,"−","white",22)}`;
    }
    s+=text(220,270,type==="pn"?"p–n ауысу":"Заряд тасымалдаушылар");
  }else if(type==="super"){
    s=`<path d="M50 25 V230 H415" fill="none" stroke="#19364f" stroke-width="2"/>
       <path d="M50 230 H190 V140 L400 50" fill="none" stroke="#087dcc" stroke-width="4"/>
       <path d="M190 35 V230" stroke="#d63a50" stroke-dasharray="5 5"/>
       ${text(25,30,"R")}${text(410,257,"T")}
       ${text(190,259,"Tс","#d63a50")}
       ${text(115,209,"R = 0","#16874e",20)}`;
  }else if(["temperature","ohm","charge"].includes(type)){
    const temp=type==="temperature",y0=temp?190:230;
    s=`<path d="M45 20 V230 H415" fill="none" stroke="#19364f" stroke-width="2"/>
       <path d="M45 ${y0} L395 45" fill="none" stroke="#087dcc" stroke-width="4"/>
       <circle cx="${45+350*value}" cy="${y0-(y0-45)*value}" r="7" fill="#16874e"/>
       ${text(25,30,temp?"R":type==="charge"?"q":"I")}
       ${text(410,258,temp?"ΔT":type==="charge"?"t":"U")}
       ${temp?text(25,190,"R₀","#087dcc",14):""}
       ${text(220,280,"Сапалық график","#16874e",17)}`;
  }else if(type==="wire"){
    s=`<rect x="55" y="85" width="330" height="100" fill="#c5dbec"/>
       <ellipse cx="55" cy="135" rx="25" ry="50" fill="#91b5ce"/>
       <ellipse cx="385" cy="135" rx="25" ry="50" fill="#e7f3ff" stroke="#91b5ce"/>
       <path d="M55 65 V35 H385 V65" stroke="#087dcc" stroke-width="2" fill="none"/>
       ${text(220,29,"l — ұзындық","#087dcc",20)}
       ${text(385,142,"S","#16874e",24)}
       ${text(220,230,"ρ — меншікті кедергі")}`;
  }else{
    s=["Диод","Транзистор","Күн элементі"].map((n,i)=>
      `<rect x="${10+i*145}" y="35" width="135" height="205" rx="15" fill="#dcefff"/>
       ${text(77+i*145,112,["→|","⚙","☀"][i],"#087dcc",45)}
       ${text(77+i*145,190,n,"#19364f",16)}`).join("");
  }
  return `<div class="visual"><svg viewBox="0 0 440 290">${s}</svg>
    <small>Физикалық құбылыстың шартты сызбасы</small></div>`;
}

/* 3 ВИРТУАЛДЫ ЗЕРТХАНА */

const labs=[
  ["Ом заңы","Кернеу, В",0,20,8,1,
   "Кедергі 4 Ом болатын математикалық модель.",
   x=>"I = "+num(x/4)+" А",x=>diagram("ohm",x/20),
   "Кернеу екі есе артса, ток күші де екі есе артады."],

  ["Температура және кедергі","Температура өзгерісі, К",0,100,50,5,
   "R₀ = 20 Ом; α = 0,004 К⁻¹.",
   x=>"R = "+num(20*(1+.004*x))+" Ом",x=>diagram("temperature",x/100),
   "Осы модельде температура артқан сайын кедергі артады."],

  ["Асқынөткізгіштік","Шартты температура, К",1,30,8,1,
   "Шартты критикалық температура 10 К. Басқа қажетті шарттар орындалған деп алынады.",
   x=>x<10?"Асқынөткізгіш күй: R = 0":x===10?"Критикалық шек":"Қалыпты күй",
   ()=>diagram("super"),
   "Критикалық температурадан төменде материал асқынөткізгіш күйге өте алады."]
];

function labPage(i){
  const l=labs[i];
  return heading("ВИРТУАЛДЫ ЗЕРТХАНА · "+(i+1)+" / 3",l[0])+
    card(`<p>${l[6]}</p><div class="grid2"><div>
      <h3>${l[1]}: <span class="blue" id="labValue">${l[4]}</span></h3>
      <input type="range" min="${l[2]}" max="${l[3]}" value="${l[4]}"
        step="${l[5]}" oninput="updateLab(${i},this.value)">
      <div class="formula" id="labResult">${l[7](l[4])}</div>
      </div><div id="labVisual">${l[8](l[4])}</div></div>
      <div class="example"><h3>Қорытынды</h3>
      <p>Шаманы өзгертіп, нәтижені салыстырыңдар.</p>
      <button onclick="$('labAnswer').classList.toggle('hidden')">Қорытындыны көрсету</button>
      <p id="labAnswer" class="green hidden">${l[9]}</p></div>
      <p>Бұл виртуалды модель. Нақты тәжірибе қажет емес.</p>`);
}
function updateLab(i,x){
  x=Number(x);
  $("labValue").textContent=num(x);
  $("labResult").textContent=labs[i][7](x);
  $("labVisual").innerHTML=labs[i][8](x);
}

/* ОҚУШЫЛАР */

let savedNames=[];
try{
  const data=JSON.parse(localStorage.getItem("physics332-names")||"[]");
  if(Array.isArray(data))savedNames=data;
}catch{}

const students=Array.from({length:24},(_,id)=>({
  id,name:typeof savedNames[id]==="string"&&savedNames[id].trim()?
    savedNames[id]:(id+1)+"-оқушы",present:true
}));

const present=()=>students.filter(s=>s.present);
let attendanceDraft=[],assignments=[],randomId=null;
let drawn=new Set(),completed=new Set();
let teams=[[],[],[]],scores=[0,0,0],answers={},speakers={};
let used=[new Set(),new Set(),new Set()];
let pages=[],sections=[],current=0,autoNext=null;

function shuffle(list){
  const a=[...list];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

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
  if(!confirm("Есептерді қайта араластырамыз ба?"))return;
  assignTasks();buildPages();renderTasks();
  closePanel("taskPanel");closePanel("randomPanel");
  goKey("taskIntro");
}

function renderStudents(){
  $("students").innerHTML=attendanceDraft.map((s,i)=>`
    <div class="student">
      <input type="checkbox" ${s.present?"checked":""}
        onchange="attendanceDraft[${i}].present=this.checked">
      <input value="${esc(s.name)}" maxlength="40"
        oninput="attendanceDraft[${i}].name=this.value">
    </div>`).join("");
  $("attendanceCount").textContent=present().length+" / 24";
}

function markAll(v){
  attendanceDraft.forEach(s=>s.present=v);
  renderStudents();
}

function saveAttendance(){
  const changed=students.some((s,i)=>s.present!==attendanceDraft[i].present);
  if(changed&&!confirm("Қатысу өзгерсе, есептер мен ұпайлар қайта басталады."))return;
  const key=pages[current]?.key;
  students.forEach((s,i)=>{
    s.name=attendanceDraft[i].name.trim()||(i+1)+"-оқушы";
    s.present=attendanceDraft[i].present;
  });
  try{localStorage.setItem("physics332-names",JSON.stringify(students.map(s=>s.name)))}
  catch{alert("Есімдер осы сабақта сақталады. Браузер жады қолжетімсіз.")}
  if(changed){assignTasks();makeTeams(false)}
  closePanel("attendance");closePanel("randomPanel");
  buildPages();renderTasks();renderTeams();
  $("attendanceCount").textContent=present().length+" / 24";
  goKey(key);
}

function renderTasks(){
  $("taskCount").textContent=`Орындалды: ${completed.size} / ${assignments.length}`;
  $("taskList").innerHTML=assignments.map(a=>`
    <button class="${completed.has(a.taskId)?"done":""}" onclick="openTask(${a.taskId})">
      ${esc(students[a.studentId].name)}
      <small>${a.taskId+1}-есеп · ${levels[Math.floor(a.taskId/8)]}</small>
    </button>`).join("")||"Қатысушы жоқ";
}
function openTask(id){
  closePanel("taskPanel");closePanel("randomPanel");goKey("task"+id);
}
function markDone(id){
  if(completed.has(id))completed.delete(id);else completed.add(id);
  renderTasks();renderPage(false);
}
function randomStudent(){
  let pool=present().filter(s=>!drawn.has(s.id));
  if(!present().length)return alert("Қатысушы жоқ.");
  if(!pool.length){
    if(!confirm("Барлық оқушы таңдалды. Қайта бастаймыз ба?"))return;
    drawn.clear();pool=present();
  }
  const s=pool[Math.floor(Math.random()*pool.length)];
  drawn.add(s.id);randomId=s.id;
  $("randomName").textContent=s.name;openPanel("randomPanel");
}
function openRandomTask(){
  const a=assignments.find(x=>x.studentId===randomId);
  if(a)openTask(a.taskId);
}

/* КОМАНДАЛАР */

function resetGame(){
  clearTimeout(autoNext);
  scores=[0,0,0];answers={};speakers={};
  used=[new Set(),new Set(),new Set()];
}
function makeTeams(show=false){
  if(show&&present().length<3)return alert("Кемінде 3 оқушы қажет.");
  if(show&&!confirm("Командаларды және ұпайларды қайта бастаймыз ба?"))return;
  teams=[[],[],[]];
  shuffle(present()).forEach((s,i)=>teams[i%3].push(s.id));
  resetGame();renderTeams();
  if(show){renderPage(false);openPanel("teamPanel")}
}
function teamCards(){
  return teamNames.map((n,i)=>card(`
    <h3 class="blue">${i+1}-топ · ${n}</h3>
    <p>${teams[i].map(id=>esc(students[id].name)).join(", ")||"Қатысушы жоқ"}</p>
    <div class="score">${scores[i]} ұпай</div>`)).join("");
}
function renderTeams(){$("teams").innerHTML=teamCards()}
function pickSpeaker(i){
  const k=i%3;
  if(speakers[i]!==undefined)return students[speakers[i]].name;
  let pool=teams[k].filter(id=>!used[k].has(id));
  if(!pool.length){used[k].clear();pool=teams[k]}
  if(!pool.length)return "Қатысушы жоқ";
  const id=pool[Math.floor(Math.random()*pool.length)];
  used[k].add(id);speakers[i]=id;
  return students[id].name;
}
function startQuiz(){
  if(teams.some(t=>!t.length))return alert("Кемінде 3 оқушы қажет.");
  resetGame();renderTeams();closePanel("teamPanel");goKey("quiz0");
}
function quizPage(i){
  const q=quiz[i],k=i%3,done=Object.hasOwn(answers,i);
  return heading("КОМАНДАЛЫҚ ОЙЫН · "+(i+1)+" / 15","Білім жарысы")+
    `<div class="teamTurn">${teamNames.map((n,j)=>
      `<span class="${j===k?"active":""}">${n} · ${scores[j]}</span>`).join("")}</div>`+
    card(`<div class="definition">
      <h3>${k+1}-топ — ${teamNames[k]}</h3>
      <h2 class="blue">🎲 ${esc(pickSpeaker(i))}</h2></div>
      <h2>${q[0]}</h2>
      <div class="choices">${q[1].map((a,j)=>`
        <button class="choice ${done?(j===q[2]?"correct":j===answers[i]?"wrong":""):""}"
          ${done?"disabled":""} onclick="submitAnswer(${i},${j})">
          ${"ABCD"[j]}. ${a}</button>`).join("")}</div>
      ${done?`<div class="${answers[i]===q[2]?"definition":"warning"}">
        <p>${answers[i]===q[2]?"Дұрыс жауап! +10 ұпай":"Дұрыс жауап жасыл түспен көрсетілді."}</p>
        </div><button class="primary" onclick="go(1)">Келесі команда →</button>`:""}`);
}
function submitAnswer(i,j){
  if(Object.hasOwn(answers,i)||pages[current].key!=="quiz"+i)return;
  if(teams.some(t=>!t.length))return alert("3 топ қажет.");
  answers[i]=j;
  if(j===quiz[i][2])scores[i%3]+=10;
  renderTeams();renderPage(false);
  clearTimeout(autoNext);
  autoNext=setTimeout(()=>{if(pages[current].key==="quiz"+i)go(1)},4000);
}

/* ТҮСІНДІРМЕ ЖӘНЕ КОНСПЕКТ */

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
      <p>${t[1]}</p><p>${t[2]}</p>${formula(t[3])}<p>${t[4]}</p>
    </div><button onclick="openBoard()">Интерактивті тақта</button>`;
}
function taskPage(a){
  const p=tasks[a.taskId],level=Math.floor(a.taskId/8);
  return heading("ЖЕКЕ ЕСЕП · "+(assignments.indexOf(a)+1)+" / "+assignments.length,p[0])+
    `<div class="studentBanner">
      <b class="blue">🎲 РАНДОМ ТАҢДАЛДЫ</b>
      <h1>${esc(students[a.studentId].name)}</h1>
      <span class="level ${classes[level]}">${level+1}-деңгей · ${levels[level]}</span>
    </div>`+
    card(`<h2>${p[1]}</h2>
      <div class="data"><b class="blue">Берілгені:</b> ${p[2]}</div>
      <div class="data"><b class="green">Табу керек:</b> ${p[3]}</div>
      <p>Есепті дәптерге шығарып, шешу жолын түсіндір.</p>
      <div class="actions">
        <button class="primary" onclick="$('solution').classList.toggle('hidden')">Шешу жолын көрсету</button>
        <button onclick="openBoard()">Тақтада шығару</button>
        <button class="${completed.has(a.taskId)?"done":""}" onclick="markDone(${a.taskId})">
          ${completed.has(a.taskId)?"✓ Орындалды":"Орындалды деп белгілеу"}</button>
        <button onclick="openPanel('taskPanel')">Барлық есептер</button>
        <button onclick="go(1)">Келесі →</button>
      </div><div id="solution" class="hidden">${formula(p[4])}</div>`);
}

/* ҮЙ ТАПСЫРМАСЫ */

function homeworkPage(){
  return heading("ҮЙ ТАПСЫРМАСЫ · 3.3.2","Екі тапсырма")+
    `<div class="card notebook">
      <h3 class="blue">1-тапсырма. Салыстыру кестесі</h3>
      <p>Металл, жартылай өткізгіш және асқынөткізгіштің
      электрлік қасиеттерін дәптерге кесте түрінде салыстырыңдар.</p>
      <p>Заряд тасымалдаушыларын, кедергісін, температураның
      әсерін және қолданылуына бір мысал жазыңдар.</p>
    </div>`+
    card(`<h3 class="green">2-тапсырма. Есеп шығару</h3>
      <p>Металдың бастапқы кедергісі 20 Ом.
      Температуралық коэффициенті 0,004 К⁻¹.
      Температурасы 50 К-ге артқанда кедергісі қанша болады?</p>
      <div class="data">R₀ = 20 Ом; α = 0,004 К⁻¹; ΔT = 50 К</div>
      ${formula("R = R₀(1 + αΔT)")}
      <p>Берілгенін, формуласын, шешуін және жауабын жазыңдар.</p>`)+
    card('<h1 class="green">Сабақ аяқталды!</h1><h2>Назарларыңызға рақмет!</h2><p>Сау болыңыздар!</p><b>BY DARKHAN</b>');
}

/* БАРЛЫҚ БЕТТЕР */

function buildPages(){
  pages=[];sections=[];
  function section(name,items){
    if(items.length){
      sections.push({name,start:pages.length});
      pages.push(...items);
    }
  }
  section("⌂ Басты бет",[{key:"intro",render:()=>
    `<span class="eyebrow">ФИЗИКА · 3.3.2 · 80 МИНУТ</span>
    <div class="card hero"><h1 class="blue">${title}</h1>
    <div class="definition"><h3>Сабақтың мақсаты</h3>
    <p>Металдардағы электр тогының табиғатын түсіну,
    асқынөткізгіштік құбылысын сипаттау, жартылай өткізгіштердегі
    заряд тасымалдаушыларды ажырату және есептер шығару.</p></div>
    ${diagram("metal")}
    <div class="grid3">${card("<h2>15</h2><p>Түсіндірме</p>")}
    ${card("<h2>24</h2><p>Жеке есеп</p>")}
    ${card("<h2>3</h2><p>Команда</p>")}</div>
    <button class="primary" onclick="startTimer();go(1)">Сабақты бастау →</button>
    <p class="blue"><b>BY DARKHAN</b></p></div>`}]);

  section("📋 Сабақ жоспары",[{key:"plan",render:()=>
    heading("САБАҚ ЖОСПАРЫ","80 минут")+
    card([["Ұйымдастыру",3],["Түсіндірме",20],["Конспект",12],
      ["Виртуалды зертхана",10],["Жеке есептерді қатар орындау",20],
      ["Командалық ойын",12],["Қорытынды және үй жұмысы",3]]
      .map(([n,t])=>`<div class="data">${n} — <b class="blue">${t} минут</b></div>`).join(""))}]);

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
    card(`<p>Әр қатысушыға бір есеп кездейсоқ тағайындалды.</p>
    ${formula(assignments.length+" оқушы · "+assignments.length+" есеп")}
    <div class="grid3">${levels.map((n,i)=>card(`
      <span class="level ${classes[i]}">${n}</span>
      <div class="score">${assignments.filter(a=>Math.floor(a.taskId/8)===i).length}</div>`)).join("")}</div>
    <button onclick="openPanel('taskPanel')">Есептер тізімі</button>
    <button onclick="reshuffle()">Қайта араластыру</button>
    <button class="primary" ${assignments.length?"":"disabled"} onclick="go(1)">Бастау</button>`)}]);

  for(let k=0;k<3;k++){
    section(`${["🟢","🟡","🔴"][k]} ${k+1}-деңгей · ${levels[k]}`,
      assignments.filter(a=>Math.floor(a.taskId/8)===k)
        .map(a=>({key:"task"+a.taskId,render:()=>taskPage(a)})));
  }
  section("🏆 Командалық ойын",[
    {key:"quizIntro",render:()=>
      heading("КОМАНДАЛЫҚ ОЙЫН","Электрондар жарысы")+
      `<div class="grid3">${teamCards()}</div>`+
      card(`<p>15 сұрақ. Әр командаға 5 сұрақтан беріледі.
      Дұрыс жауапқа 10 ұпай қосылады. 4 секундтан кейін
      келесі командаға автоматты ауысады.</p>
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
        winners.length===1?"Жеңімпаз: "+winners[0]:"Тең нәтиже: "+winners.join(", ")}</h2>
        <p>Жауап берілген сұрақтар: ${total} / 15</p>
        <p>✓ Металдардағы электр тогы</p>
        <p>✓ Асқынөткізгіштік</p>
        <p>✓ Жартылай өткізгіштер</p>`);
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
  clearTimeout(autoNext);stopReading();current=i;renderPage();
}
function go(n){goPage(current+n)}
function goKey(key){goPage(Math.max(0,pages.findIndex(p=>p.key===key)))}

/* ЭКРАН */

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
    if(document.fullscreenElement)await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  }catch{alert("Толық экран үшін F11 басыңыз.")}
}
function stopReading(){
  if("speechSynthesis" in window)speechSynthesis.cancel();
}
function readPage(){
  if(!("speechSynthesis" in window))return alert("Дыбыстау қолжетімсіз.");
  const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("kk"));
  if(!voice)return alert("Қазақша дауыс табылмады.");
  stopReading();
  const u=new SpeechSynthesisUtterance($("stage").innerText);
  u.lang="kk-KZ";u.voice=voice;speechSynthesis.speak(u);
}

/* ҚОЗҒАЛМАЛЫ ТЕРЕЗЕЛЕР */

let zIndex=200;

function openPanel(id){
  const p=$(id);
  p.classList.remove("hidden");
  p.style.zIndex=++zIndex;
  if(id==="attendance"){
    attendanceDraft=students.map(s=>({...s}));
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
    if(moved){moved=false;e.preventDefault();e.stopImmediatePropagation()}
  },true);
});

/* МАТЕМАТИКАЛЫҚ КАЛЬКУЛЯТОР */

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
      expression=String(+result.toPrecision(12));
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
      const op=t[p++],y=product();x=op==="+"?x+y:x-y;
    }
    return x;
  }
  function product(){
    let x=unary();
    while(["*","/"].includes(t[p])){
      const op=t[p++],y=unary();
      if(op==="/"&&y===0)throw Error();
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
    if(k===undefined)throw Error();
    if(k==="pi")return Math.PI;
    if(/^[0-9.]/.test(k))return Number(k);
    if(k==="("){
      const x=sum();if(t[p++]!==")")throw Error();return x;
    }
    if(Object.hasOwn(funcs,k)){
      if(t[p++]!=="(")throw Error();
      const x=sum();if(t[p++]!==")")throw Error();
      if(k==="tan"&&Math.abs(Math.cos(rad(x)))<1e-12)throw Error();
      if(k==="ctg"&&Math.abs(Math.sin(rad(x)))<1e-12)throw Error();
      return funcs[k](x);
    }
    throw Error();
  }
  const x=sum();
  if(p!==t.length||!Number.isFinite(x))throw Error();
  return x;
}

/* ФИЗИКАЛЫҚ КАЛЬКУЛЯТОР */

const physics=[
  ["I = U/R",["U (В)","R (Ом)"],v=>v[0]/v[1],"А"],
  ["U = IR",["I (А)","R (Ом)"],v=>v[0]*v[1],"В"],
  ["R = U/I",["U (В)","I (А)"],v=>v[0]/v[1],"Ом"],
  ["q = It",["I (А)","t (с)"],v=>v[0]*v[1],"Кл"],
  ["I = q/t",["q (Кл)","t (с)"],v=>v[0]/v[1],"А"],
  ["t = q/I",["q (Кл)","I (А)"],v=>v[0]/v[1],"с"],
  ["R = ρl/S",["ρ (Ом·мм²/м)","l (м)","S (мм²)"],v=>v[0]*v[1]/v[2],"Ом"],
  ["ρ = RS/l",["R (Ом)","S (мм²)","l (м)"],v=>v[0]*v[1]/v[2],"Ом·мм²/м"],
  ["l = RS/ρ",["R (Ом)","S (мм²)","ρ (Ом·мм²/м)"],v=>v[0]*v[1]/v[2],"м"],
  ["S = ρl/R",["ρ (Ом·мм²/м)","l (м)","R (Ом)"],v=>v[0]*v[1]/v[2],"мм²"],
  ["R = R₀(1 + αΔT)",["R₀ (Ом)","α (К⁻¹)","ΔT (К)"],
    v=>v[0]*(1+v[1]*v[2]),"Ом"],
  ["R₀ — бастапқы кедергі",["R (Ом)","α (К⁻¹)","ΔT (К)"],
    v=>v[0]/(1+v[1]*v[2]),"Ом"],
  ["α — температуралық коэффициент",["R (Ом)","R₀ (Ом)","ΔT (К)"],
    v=>(v[0]-v[1])/(v[1]*v[2]),"К⁻¹"],
  ["ΔT — температура айырмасы",["R (Ом)","R₀ (Ом)","α (К⁻¹)"],
    v=>(v[0]-v[1])/(v[1]*v[2]),"К"],
  ["N — электрондар саны",["Заряд модулі q (Кл)"],v=>v[0]/1.6e-19,""],
  ["P = UI",["U (В)","I (А)"],v=>v[0]*v[1],"Вт"],
  ["A = UIt",["U (В)","I (А)","t (с)"],v=>v[0]*v[1]*v[2],"Дж"]
];

function initPhysics(){
  $("physicsFormula").innerHTML=physics.map((f,i)=>
    `<option value="${i}">${f[0]}</option>`).join("");
  physicsInputs();
}
function physicsInputs(){
  const f=physics[+$("physicsFormula").value];
  $("physicsInputs").innerHTML=f[1].map((n,i)=>
    `<label>${n}</label><input id="phys${i}" inputmode="decimal" placeholder="Мәні">`).join("");
  $("physicsResult").textContent="Нәтиже";
  clampPanel($("physicsPanel"));
}
function calculatePhysics(){
  try{
    const f=physics[+$("physicsFormula").value];
    const v=f[1].map((label,i)=>{
      const s=$("phys"+i).value.trim().replace(",",".");
      if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s))throw Error();
      const x=Number(s);
      if(!Number.isFinite(x))throw Error();
      if(x<0&&!label.startsWith("ΔT")&&!label.startsWith("α"))throw Error();
      return x;
    });
    const x=f[2](v);
    if(!Number.isFinite(x)||(x<0&&!["К","К⁻¹"].includes(f[3])))throw Error();
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
  cancelDrawing();tool=t;
  canvas.style.cursor=t==="hand"?"grab":t==="text"?"text":"crosshair";
}
function openBoard(){
  clearTimeout(autoNext);stopReading();
  $("board").classList.remove("hidden");resizeBoard();
}
function closeBoard(){
  cancelDrawing();$("board").classList.add("hidden");
}
function point(e){
  const r=canvas.getBoundingClientRect();
  return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};
}

function draw(a){
  ctx.save();
  ctx.strokeStyle=a.color||"#19364f";
  ctx.fillStyle=a.color||"#19364f";
  ctx.lineWidth=a.size||5;
  ctx.lineCap="round";ctx.lineJoin="round";

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
    if(a.points.every(q=>q.x===p.x&&q.y===p.y)){
      ctx.arc(p.x,p.y,a.size/2,0,Math.PI*2);ctx.fill();
    }else{
      ctx.moveTo(p.x,p.y);
      a.points.slice(1).forEach(q=>ctx.lineTo(q.x,q.y));
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
    if(a.type==="circle"){
      ctx.ellipse((p.x+q.x)/2,(p.y+q.y)/2,
        Math.max(.1,Math.abs(dx)/2),Math.max(.1,Math.abs(dy)/2),
        0,0,Math.PI*2);
    }
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
  const p=$("paper"),step=Math.max(1,40*p.clientWidth/W);
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
    if(text&&text.trim())commit({type:"text",text:text.trim(),start:p,size,color});
    return;
  }
  pointer=e.pointerId;
  canvas.setPointerCapture(pointer);
  if(tool==="hand"){
    pan={x:e.clientX,y:e.clientY,l:$("boardViewport").scrollLeft,
      t:$("boardViewport").scrollTop};
    canvas.style.cursor="grabbing";
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
  const p=point(e);
  draft.end=p;draft.points.push(p);renderBoard();
});

function finish(e,cancel=false){
  if(pointer!==e.pointerId)return;
  const a=draft;
  if(a&&!cancel){a.end=point(e);a.points.push(a.end)}
  draft=null;pan=null;pointer=null;
  if(a&&!cancel)commit(a);else renderBoard();
  if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  if(tool==="hand")canvas.style.cursor="grab";
}
function cancelDrawing(){
  const id=pointer;
  pointer=null;draft=null;pan=null;
  if(id!==null&&canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);
  renderBoard();
}
canvas.addEventListener("pointerup",e=>finish(e));
canvas.addEventListener("pointercancel",e=>finish(e,true));
canvas.addEventListener("lostpointercapture",e=>finish(e,true));

function undo(){
  cancelDrawing();
  if(state().actions.length)state().redo.push(state().actions.pop());
  renderBoard();
}
function redo(){
  cancelDrawing();
  if(state().redo.length)state().actions.push(state().redo.pop());
  renderBoard();
}
function clearBoard(){
  if(!confirm("Тақтаны тазалаймыз ба?"))return;
  cancelDrawing();commit({type:"clear"});
}
function toggleGrid(){state().grid=!state().grid;renderBoard()}
function newBoardPage(){
  cancelDrawing();
  boardPages.push({actions:[],redo:[],grid:false});
  boardIndex=boardPages.length-1;renderBoard();
}
function boardPage(n){
  cancelDrawing();
  boardIndex=Math.max(0,Math.min(boardPages.length-1,boardIndex+n));
  renderBoard();
}
function deleteBoardPage(){
  if(!confirm("Бетті өшіреміз бе?"))return;
  cancelDrawing();boardPages.splice(boardIndex,1);
  if(!boardPages.length)boardPages.push({actions:[],redo:[],grid:false});
  boardIndex=Math.min(boardIndex,boardPages.length-1);renderBoard();
}
function resizeBoard(){
  if($("board").classList.contains("hidden"))return;
  const v=$("boardViewport");
  const width=Math.max(1,Math.min(v.clientWidth-24,
    (v.clientHeight-24)*W/H))*boardScale/100;
  $("paper").style.width=width+"px";
  $("paper").style.margin=width>v.clientWidth-24?"0":"0 auto";
  $("boardScale").textContent=boardScale+"%";
  renderBoard();
}
function boardZoom(n){
  boardScale=n===0?100:Math.max(25,Math.min(300,boardScale+n));
  resizeBoard();
}

/* СУРЕТТІ ТАҚТАҒА ҚОСУ */

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
  const out=document.createElement("canvas");
  out.width=W;out.height=H;
  const c=out.getContext("2d");
  c.fillStyle="white";c.fillRect(0,0,W,H);
  if(state().grid){
    c.strokeStyle="#d5e6f3";
    for(let x=0;x<W;x+=40){
      c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();
    }
    for(let y=0;y<H;y+=40){
      c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();
    }
  }
  c.drawImage(canvas,0,0);
  const a=document.createElement("a");
  a.download=`physics-332-board-${boardIndex+1}.png`;
  a.href=out.toDataURL("image/png");
  document.body.appendChild(a);a.click();a.remove();
}

/* АЛМАТЫ УАҚЫТЫ ЖӘНЕ ТАЙМЕР */

let remaining=4800,deadline=0,running=false;

function updateTime(){
  const d=new Date(Date.now()+5*3600000);
  $("clock").textContent=d.toLocaleTimeString("kk-KZ",{
    timeZone:"UTC",hourCycle:"h23",
    hour:"2-digit",minute:"2-digit",second:"2-digit"
  });
  $("date").textContent=d.toLocaleDateString("kk-KZ",{
    timeZone:"UTC",year:"numeric",month:"long",day:"numeric"
  });
  if(running)remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
  if(!remaining)running=false;
  $("timer").textContent=String(Math.floor(remaining/60)).padStart(2,"0")+
    ":"+String(remaining%60).padStart(2,"0");
  $("timerBtn").textContent=running?"Тоқтату":"Бастау";
  $("timerBtn").disabled=remaining===0;
  $("timer").style.color=remaining<=300?"#d63a50":"#16874e";
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

/* ПЕРНЕТАҚТА */

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
      e.preventDefault();if(e.shiftKey)redo();else undo();
    }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){
      e.preventDefault();redo();
    }
    return;
  }
  if(e.key==="ArrowRight")go(1);
  if(e.key==="ArrowLeft")go(-1);
});
function onResize(){
  applyScale();resizeBoard();
  document.querySelectorAll(".floating").forEach(clampPanel);
}
window.addEventListener("resize",onResize);
document.addEventListener("fullscreenchange",onResize);

/* САЙТТЫ ІСКЕ ҚОСУ */

attendanceDraft=students.map(s=>({...s}));
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

console.log("PHYSICS LAB PRO — 3.3.2");
console.log("Түсіндірме:",theory.length);
console.log("Конспект:",noteIds.length);
console.log("Жеке есептер:",tasks.length);
console.log("Командалық сұрақтар:",quiz.length);
console.log("Барлық беттер:",pages.length);

/* BY DARKHAN */
