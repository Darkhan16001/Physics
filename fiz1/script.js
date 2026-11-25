
"use strict";

const $ = id => document.getElementById(id);

const esc = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const frac = (a, b) => `
  <span class="frac">
    <span>${a}</span>
    <span>${b}</span>
  </span>
`;

function num(value) {
  if (!Number.isFinite(value)) {
    throw new Error("Нәтиже анықталмаған");
  }
  return String(Number(value.toPrecision(10)));
}

/* =====================================
   ЭКРАН МАСШТАБЫ: 25% — 300%
===================================== */

let scale = 100;

function applyScale() {
  const screen = $("screen");
  const stage = $("stage");
  const css = getComputedStyle(screen);

  const available = Math.max(
    1,
    screen.clientWidth -
    parseFloat(css.paddingLeft) -
    parseFloat(css.paddingRight)
  );

  stage.style.width = available + "px";
  stage.style.zoom = scale / 100;

  stage.style.marginLeft = scale > 100 ? "0" : "auto";
  stage.style.marginRight = scale > 100 ? "0" : "auto";

  $("scaleLabel").textContent = scale + "%";
}

function changeScale(amount) {
  scale = Math.max(25, Math.min(300, scale + amount));
  applyScale();
}

function resetScale() {
  scale = 100;
  applyScale();
  $("screen").scrollTo(0, 0);
}

function toggleMenu() {
  const hidden = $("app").classList.toggle("menu-hidden");

  document.body.classList.toggle("menu-hidden", hidden);

  requestAnimationFrame(applyScale);
}

async function fullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    alert("Толық экран үшін F11 батырмасын басыңыз.");
  }
}

/* =====================================
   НЕГІЗГІ ФОРМУЛАЛАР
===================================== */

const F = {
  I: `I = ${frac("q", "t")}`,
  U: `U = ${frac("A", "q")}`,
  R: `R = ${frac("U", "I")}`,
  ohm: `I = ${frac("U", "R")}`,
  rho: `R = ρ${frac("l", "S")}`,

  series: "R = R<sub>1</sub> + R<sub>2</sub>",

  parallel: `${frac("1", "R")} =
    ${frac("1", "R<sub>1</sub>")} +
    ${frac("1", "R<sub>2</sub>")}`,

  parallel2: `R =
    ${frac("R<sub>1</sub>R<sub>2</sub>",
    "R<sub>1</sub> + R<sub>2</sub>")}`,

  mixed: `R = R<sub>1</sub> +
    ${frac("R<sub>2</sub>R<sub>3</sub>",
    "R<sub>2</sub> + R<sub>3</sub>")}`
};

/* =====================================
   15 ТҮСІНДІРМЕ
===================================== */

const theory = [
  {
    title: "Электр тогы дегеніміз не?",
    def: "Электр тогы — зарядталған бөлшектердің бағытталған қозғалысы.",
    text: "Металдардың құрамында еркін электрондар болады. Электр өрісінің әсерінен олардың ретсіз жылулық қозғалысына бағытталған қозғалыс қосылады. Осы құбылыс электр тогын тудырады. Электр тогы компьютерлерде, байланыс жүйелерінде және көптеген электрондық құрылғыларда маңызды қызмет атқарады.",
    formula: F.I,
    example: "Металдарда электр тогын еркін электрондар тасымалдайды.",
    visual: "current"
  },
  {
    title: "Электр тогының пайда болу шарттары",
    def: "Тұрақты токтың жүруі үшін еркін заряд тасымалдаушылар, электр өрісі және тұйық тізбек қажет.",
    text: "Электр өрісі зарядталған бөлшектердің бағытталған қозғалысын қамтамасыз етеді. Ток көзі потенциалдар айырмасын сақтайды. Қарапайым тұйық тізбекте тұрақты ток жүре алады. Тізбек ажыратылған кезде тұрақты ток тоқтайды.",
    formula: "Еркін зарядтар + электр өрісі + тұйық тізбек",
    example: "Тұйық және ажыратылған тізбектердің айырмашылығын виртуалды модельде қарастыруға болады.",
    visual: "circuit"
  },
  {
    title: "Электр тогының бағыты",
    def: "Токтың шартты бағыты оң зарядтардың қозғалыс бағытымен сәйкес келеді.",
    text: "Сыртқы металл тізбегінде ток бағыты оң полюстен теріс полюске қарай алынады. Электрондардың заряды теріс болғандықтан, олардың бағытталған қозғалысы токтың шартты бағытына қарама-қарсы болады.",
    formula: "Электрондар бағыты ↔ Ток бағыты",
    example: "Электрондар оңға бағытталса, шартты ток солға бағытталады.",
    visual: "current"
  },
  {
    title: "Ток күші",
    def: "Ток күші — өткізгіштің көлденең қимасы арқылы бірлік уақытта өтетін электр заряды.",
    text: "Ток күші I әрпімен белгіленеді. Халықаралық бірліктер жүйесінде ампермен өлшенеді. Өткізгіш қимасы арқылы белгілі бір уақытта өтетін заряд мөлшері неғұрлым көп болса, ток күші де соғұрлым үлкен болады.",
    formula: F.I,
    example: "4 секундта 20 Кл заряд өтсе, ток күші 5 А болады.",
    visual: "current"
  },
  {
    title: "Амперметр",
    def: "Амперметр — электр тогының күшін өлшейтін аспап.",
    text: "Электрлік сызбада амперметр шеңбер ішіндегі A әрпімен белгіленеді. Теориялық тізбекте ол ток өлшенетін тармақпен тізбектей орналасады. Идеал амперметрдің ішкі кедергісі нөлге тең деп есептеледі.",
    formula: "I — ток күші, А",
    example: "Виртуалды амперметрдің көрсеткіші 2 А болуы мүмкін.",
    visual: "ammeter"
  },
  {
    title: "Электр кернеуі",
    def: "Кернеу — электр өрісінің бірлік зарядты тасымалдағанда атқаратын жұмысын сипаттайтын шама.",
    text: "Кернеу U әрпімен белгіленеді және вольтпен өлшенеді. Кернеу тізбектегі екі нүктенің потенциалдар айырмасын сипаттайды. Ол бірлік зарядқа сәйкес келетін энергия өзгерісін түсіндіруге мүмкіндік береді.",
    formula: F.U,
    example: "6 Кл зарядқа 24 Дж жұмыс сәйкес келсе, кернеу 4 В болады.",
    visual: "voltmeter"
  },
  {
    title: "Вольтметр",
    def: "Вольтметр — екі нүкте арасындағы электр кернеуін өлшейтін аспап.",
    text: "Вольтметр сызбада шеңбер ішіндегі V әрпімен белгіленеді. Теориялық модельде кернеуі өлшенетін элементпен параллель орналасады. Идеал вольтметрдің кедергісі шексіз үлкен деп қабылданады.",
    formula: "U — кернеу, В",
    example: "Виртуалды вольтметр резистордағы потенциалдар айырмасын көрсетеді.",
    visual: "voltmeter"
  },
  {
    title: "Электр кедергісі",
    def: "Электр кедергісі — өткізгіштің электр тогына қарсы әсерін сипаттайтын физикалық шама.",
    text: "Металдағы электрондар кристалдық тор бөлшектерімен әрекеттеседі. Бұл олардың бағытталған қозғалысын қиындатады. Кедергі өткізгіштің материалына, ұзындығына, көлденең қимасына және температурасына байланысты.",
    formula: F.R,
    example: "Кернеу 12 В, ток күші 2 А болса, кедергі 6 Ом.",
    visual: "wire"
  },
  {
    title: "Меншікті кедергі",
    def: "Меншікті кедергі — материалдың электр тогына қарсы әсерін сипаттайтын шама.",
    text: "Біртекті өткізгіштің ұзындығы артқан сайын кедергісі артады. Ал көлденең қимасының ауданы артса, кедергісі азаяды. Меншікті кедергі материалдың түріне және температурасына тәуелді.",
    formula: F.rho,
    example: "Қалған шарттар бірдей болса, ұзындық екі есе артқанда кедергі де екі есе артады.",
    visual: "wire"
  },
  {
    title: "Тізбек бөлігі үшін Ом заңы",
    def: "Омдық өткізгіштегі ток күші кернеуге тура, кедергіге кері пропорционал.",
    text: "Кедергі тұрақты кезде кернеу артса, ток күші де артады. Кернеу тұрақты болса, кедергі артқан сайын ток күші азаяды. Ом заңы электр тізбектерінің теориялық есептеулерінде кеңінен қолданылады.",
    formula: F.ohm,
    example: "U = 18 В, R = 6 Ом болғанда I = 3 А.",
    visual: "graph"
  },
  {
    title: "Ом заңының түрлендірілген формулалары",
    def: "Екі физикалық шама белгілі болса, Ом заңы арқылы үшінші шаманы табуға болады.",
    text: "Есептің берілгенін жазамыз. Шамаларды халықаралық бірліктер жүйесіне келтіреміз. Белгісіз шаманы формуладан өрнектеп, белгілі мәндерді қойып есептейміз.",
    formula: `${F.ohm} &nbsp; U = IR &nbsp; ${F.R}`,
    example: "I = 2 А, R = 8 Ом болса, U = 16 В.",
    visual: "ohm"
  },
  {
    title: "Өткізгіштерді тізбектей жалғау",
    def: "Тізбектей жалғауда өткізгіштер бірінен кейін бірі орналасады.",
    text: "Тізбектей жалғанған өткізгіштерден бірдей ток күші өтеді. Жалпы кернеу жеке өткізгіштердегі кернеулердің қосындысына тең. Жалпы кедергі жеке кедергілерді қосу арқылы анықталады.",
    formula: `I = I<sub>1</sub> = I<sub>2</sub><br>
      U = U<sub>1</sub> + U<sub>2</sub><br>${F.series}`,
    example: "3 Ом және 7 Ом тізбектей резисторлардың жалпы кедергісі 10 Ом.",
    visual: "series"
  },
  {
    title: "Өткізгіштерді параллель жалғау",
    def: "Параллель жалғауда өткізгіштердің ұштары ортақ екі түйінге сәйкес келеді.",
    text: "Барлық параллель тармақтарда кернеу бірдей болады. Жалпы ток күші жеке тармақтардағы ток күштерінің қосындысына тең. Жалпы кедергі жеке оң кедергілердің ең кішісінен де кіші болады.",
    formula: `U = U<sub>1</sub> = U<sub>2</sub><br>
      I = I<sub>1</sub> + I<sub>2</sub><br>${F.parallel}`,
    example: "6 Ом және 3 Ом параллель кедергілерінің баламалы кедергісі 2 Ом.",
    visual: "parallel"
  },
  {
    title: "Өткізгіштерді аралас жалғау",
    def: "Аралас жалғау — тізбектей және параллель жалғаулардың бір тізбекте кездесуі.",
    text: "Аралас тізбекті есептеу кезінде алдымен сызбаның құрылымын талдаймыз. Берілген сызбадағы параллель бөліктің баламалы кедергісін табамыз. Содан кейін оны тізбектей орналасқан кедергімен қосамыз.",
    formula: F.mixed,
    example: "R₁ = 4 Ом, R₂ = 6 Ом, R₃ = 3 Ом. Көрсетілген сызбада жалпы кедергі 6 Ом.",
    visual: "mixed"
  },
  {
    title: "Тақырыпты қорытындылау",
    def: "Электр тізбектерін есептеудің негізі — ток күші, кернеу, кедергі және Ом заңы.",
    text: "Тізбектей жалғауда ток күші бірдей, параллель жалғауда кернеу бірдей болады. Аралас жалғауда әр бөліктің ерекшелігі жеке қарастырылады. Формуланы дұрыс таңдау және өлшем бірліктерін сақтау маңызды.",
    formula: F.ohm,
    example: "Электр құбылыстарын қауіпсіз виртуалды модельдер арқылы зерттейміз.",
    visual: "mixed"
  }
];

/* =====================================
   КӨРНЕКІ SVG СУРЕТТЕР
===================================== */

function diagram(type) {
  let content = "";
  let caption = "";

  const resistor = (x, y, name) => `
    <rect x="${x}" y="${y}" width="76" height="34"
      rx="4" fill="#e3f2ff"
      stroke="#087dcc" stroke-width="3"/>
    <text x="${x + 38}" y="${y + 23}"
      text-anchor="middle" fill="#087dcc"
      font-size="19" font-weight="bold">${name}</text>
  `;

  const meter = (x, y, name) => `
    <circle cx="${x}" cy="${y}" r="25"
      fill="white" stroke="#087dcc" stroke-width="3"/>
    <text x="${x}" y="${y + 8}"
      text-anchor="middle" font-size="24"
      fill="#087dcc">${name}</text>
  `;

  if (type === "current") {
    caption = "Электрондар және электр тогының бағыты";

    content = `
      <rect x="25" y="65" width="370" height="100"
        rx="22" fill="#e1f2ff"
        stroke="#80b9df" stroke-width="3"/>

      ${[65,125,185,245,305,365].map(x => `
        <circle cx="${x}" cy="115" r="16" fill="#087dcc"/>
        <text x="${x}" y="122"
          text-anchor="middle" font-size="20"
          fill="white">−</text>
      `).join("")}

      <path d="M50 44 H365 L350 32 M365 44 L350 56"
        stroke="#16874e" stroke-width="4" fill="none"/>

      <text x="210" y="26"
        text-anchor="middle" font-size="18"
        fill="#16874e">Электрондар</text>

      <path d="M365 190 H50 L65 178 M50 190 L65 202"
        stroke="#d63a50" stroke-width="4" fill="none"/>

      <text x="210" y="225"
        text-anchor="middle" font-size="18"
        fill="#d63a50">Шартты ток бағыты</text>
    `;

  } else if (type === "series") {
    caption = "Тізбектей жалғау";

    content = `
      <path d="M20 120 H400"
        stroke="#38576e" stroke-width="4"/>

      ${resistor(85,103,"R₁")}
      ${resistor(255,103,"R₂")}

      <text x="210" y="55" text-anchor="middle"
        font-size="25" fill="#16874e">I₁ = I₂ = I</text>

      <text x="210" y="190" text-anchor="middle"
        font-size="25" fill="#087dcc">R = R₁ + R₂</text>
    `;

  } else if (type === "parallel" || type === "mixed") {
    caption = type === "mixed"
      ? "Аралас жалғау"
      : "Параллель жалғау";

    content = `
      <g stroke="#38576e" stroke-width="4" fill="none">
        <path d="M15 120 H140 V50 H355 V120 H405"/>
        <path d="M140 120 V190 H355 V120"/>
      </g>

      ${type === "mixed" ? resistor(32,103,"R₁") : ""}
      ${resistor(210,33,type === "mixed" ? "R₂" : "R₁")}
      ${resistor(210,173,type === "mixed" ? "R₃" : "R₂")}

      <circle cx="140" cy="120" r="6" fill="#d63a50"/>
      <circle cx="355" cy="120" r="6" fill="#d63a50"/>

      <text x="247" y="108" text-anchor="middle"
        font-size="17" fill="#16874e">Параллель бөлік</text>

      <text x="247" y="135" text-anchor="middle"
        font-size="18" fill="#16874e">U бірдей</text>
    `;

  } else if (type === "graph") {
    caption = "Вольт-амперлік сипаттама";

    content = `
      <g stroke="#b8d6e9" stroke-width="1">
        ${[80,120,160,200,240,280,320].map(x =>
          `<path d="M${x} 30 V200"/>`).join("")}

        ${[40,80,120,160,200].map(y =>
          `<path d="M40 ${y} H360"/>`).join("")}
      </g>

      <path d="M40 20 V200 H385"
        stroke="#38576e" stroke-width="3" fill="none"/>

      <path d="M40 200 L330 35"
        stroke="#087dcc" stroke-width="5"/>

      <text x="15" y="25" font-size="22">I</text>
      <text x="385" y="225" font-size="22">U</text>
      <text x="20" y="222" font-size="15">0</text>

      <text x="230" y="60" font-size="20"
        fill="#16874e">R = const</text>
    `;

  } else if (type === "wire") {
    caption = "Өткізгіштің геометриялық өлшемдері";

    content = `
      <rect x="55" y="75" width="300" height="85"
        rx="25" fill="#ffdfac"
        stroke="#bb873b" stroke-width="3"/>

      <ellipse cx="355" cy="117" rx="26" ry="42"
        fill="#ffd291" stroke="#bb873b" stroke-width="3"/>

      <path d="M55 45 H355 M55 35 V55 M355 35 V55"
        stroke="#087dcc" stroke-width="3"/>

      <text x="210" y="30" font-size="22"
        text-anchor="middle" fill="#087dcc">Ұзындық l</text>

      <text x="355" y="124" font-size="25"
        text-anchor="middle" fill="#986813">S</text>

      <text x="210" y="205" font-size="20"
        text-anchor="middle">Меншікті кедергі ρ</text>
    `;

  } else if (type === "ohm") {
    caption = "Ом заңының формулалық үшбұрышы";

    content = `
      <path d="M210 15 L65 220 H355 Z"
        fill="#e0f2ff" stroke="#087dcc" stroke-width="4"/>

      <path d="M138 117 H282 M210 117 V220"
        stroke="#087dcc" stroke-width="3"/>

      <text x="210" y="95" font-size="42"
        text-anchor="middle" fill="#d63a50">U</text>

      <text x="155" y="180" font-size="42"
        text-anchor="middle" fill="#16874e">I</text>

      <text x="265" y="180" font-size="42"
        text-anchor="middle" fill="#087dcc">R</text>
    `;

  } else if (type === "voltmeter") {
    caption = "Вольтметрдің теориялық сызбасы";

    content = `
      <path d="M25 75 H395 M100 75 V180 H320 V75"
        stroke="#38576e" stroke-width="4" fill="none"/>

      ${resistor(172,58,"R")}
      ${meter(210,180,"V")}

      <circle cx="100" cy="75" r="5" fill="#d63a50"/>
      <circle cx="320" cy="75" r="5" fill="#d63a50"/>

      <text x="210" y="30" text-anchor="middle"
        font-size="20" fill="#087dcc">Кернеу U</text>
    `;

  } else {
    caption = type === "ammeter"
      ? "Амперметрдің теориялық сызбасы"
      : "Тұйық тізбектің шартты моделі";

    content = `
      <path d="M55 190 V60 H365 V190 H225
               M175 190 H55"
        stroke="#38576e" stroke-width="4" fill="none"/>

      ${meter(130,60,"A")}
      ${resistor(245,43,"R")}

      <path d="M175 190 H190 M215 190 H225
               M190 165 V215 M215 178 V202"
        stroke="#38576e" stroke-width="4" fill="none"/>

      <text x="185" y="150" font-size="22" fill="#d63a50">+</text>
      <text x="215" y="150" font-size="22" fill="#087dcc">−</text>
    `;
  }

  return `
    <div class="visual">
      <svg viewBox="0 0 420 245"
        xmlns="http://www.w3.org/2000/svg"
        font-family="Segoe UI, Arial, sans-serif"
        role="img" aria-label="${esc(caption)}">
        ${content}
      </svg>

      <small>${esc(caption)}</small>
    </div>
  `;
}

/* =====================================
   10 КОНСПЕКТ
===================================== */

const notes = [
  [
    "Электр тогы",
    "Электр тогы — зарядталған бөлшектердің бағытталған қозғалысы.",
    "Металдардағы заряд тасымалдаушылар — еркін электрондар.",
    "Тұрақты токтың шамасы мен бағыты уақыт бойынша өзгермейді."
  ],
  [
    "Ток күші",
    "Бірлік уақытта өткізгіштің көлденең қимасы арқылы өтетін заряд мөлшері.",
    F.I,
    "I — ток күші (А); q — заряд (Кл); t — уақыт (с)."
  ],
  [
    "Электр кернеуі",
    "Электр өрісінің бірлік зарядты тасымалдағанда атқаратын жұмысы.",
    F.U,
    "U — кернеу (В); A — жұмыс (Дж); q — заряд (Кл)."
  ],
  [
    "Электр кедергісі",
    "Өткізгіштің электр тогына қарсы әсерін сипаттайтын шама.",
    F.R,
    "R — кедергі. Өлшем бірлігі — ом (Ω)."
  ],
  [
    "Меншікті кедергі",
    "Кедергі өткізгіштің материалына, ұзындығына және қима ауданына тәуелді.",
    F.rho,
    "ρ — меншікті кедергі (Ом·м); l — ұзындық (м); S — аудан (м²)."
  ],
  [
    "Ом заңы",
    "Омдық өткізгіштегі ток күші кернеуге тура, кедергіге кері пропорционал.",
    F.ohm,
    "Кернеу мен кедергі белгілі болса, ток күшін есептеуге болады."
  ],
  [
    "Өлшеу аспаптары",
    "Амперметр ток күшін, вольтметр кернеуді өлшейді.",
    "A — амперметр; V — вольтметр",
    "Өлшеулерді қауіпсіз виртуалды модель арқылы қарастырамыз."
  ],
  [
    "Тізбектей жалғау",
    "Тізбектің барлық бөліктеріндегі ток күші бірдей.",
    `I = I<sub>1</sub> = I<sub>2</sub><br>
     U = U<sub>1</sub> + U<sub>2</sub><br>${F.series}`,
    "Жалпы кедергі жеке кедергілердің қосындысына тең."
  ],
  [
    "Параллель жалғау",
    "Параллель тармақтардағы кернеу бірдей.",
    `U = U<sub>1</sub> = U<sub>2</sub><br>
     I = I<sub>1</sub> + I<sub>2</sub><br>${F.parallel}`,
    "Жалпы кедергі жеке оң кедергілердің ең кішісінен де кіші."
  ],
  [
    "Аралас жалғау",
    "Тізбектей және параллель бөліктерден тұратын жалғау.",
    F.mixed,
    "Бұл формула R₁ резисторы R₂ мен R₃ параллель бөлігіне тізбектей орналасқанда қолданылады."
  ]
];

/* =====================================
   3 ДЕҢГЕЙ · 12 ЕСЕП
===================================== */

const problems = [
  [
    [
      "Өткізгіш арқылы 5 секундта 20 Кл заряд өтті. Ток күшін анықтаңдар.",
      "q = 20 Кл; t = 5 с",
      "I — ?",
      `I = ${frac("q","t")} = ${frac("20","5")} = 4 А`
    ],
    [
      "Кернеу 24 В, кедергі 6 Ом. Ток күшін табыңдар.",
      "U = 24 В; R = 6 Ом",
      "I — ?",
      `I = ${frac("U","R")} = ${frac("24","6")} = 4 А`
    ],
    [
      "Ток күші 3 А, кедергі 8 Ом. Кернеуді табыңдар.",
      "I = 3 А; R = 8 Ом",
      "U — ?",
      "U = IR = 3 × 8 = 24 В"
    ],
    [
      "Кернеу 36 В, ток күші 4 А. Кедергіні есептеңдер.",
      "U = 36 В; I = 4 А",
      "R — ?",
      `R = ${frac("U","I")} = ${frac("36","4")} = 9 Ом`
    ]
  ],
  [
    [
      "4 Ом және 8 Ом тізбектей жалғанған. Жалпы кернеу 36 В. Ток күшін анықтаңдар.",
      "R₁ = 4 Ом; R₂ = 8 Ом; U = 36 В",
      "R, I — ?",
      `R = 4 + 8 = 12 Ом<br>I = ${frac("36","12")} = 3 А`,
      "series"
    ],
    [
      "6 Ом және 12 Ом параллель жалғанған. Жалпы кедергіні анықтаңдар.",
      "R₁ = 6 Ом; R₂ = 12 Ом",
      "R — ?",
      `R = ${frac("6 × 12","6 + 12")} = 4 Ом`,
      "parallel"
    ],
    [
      "Ток күші 250 мА. 3 минутта өтетін зарядты табыңдар.",
      "I = 250 мА; t = 3 мин",
      "q — ?",
      "I = 0,25 А; t = 180 с<br>q = It = 0,25 × 180 = 45 Кл"
    ],
    [
      "Параллель тармақтардағы кедергілер 4 Ом және 6 Ом. Кернеу 12 В. Жалпы ток күші қандай?",
      "R₁ = 4 Ом; R₂ = 6 Ом; U = 12 В",
      "I — ?",
      `I<sub>1</sub> = ${frac("12","4")} = 3 А<br>
       I<sub>2</sub> = ${frac("12","6")} = 2 А<br>I = 5 А`
    ]
  ],
  [
    [
      "4 Ом резистор 6 Ом және 3 Ом параллель бөлікпен тізбектей орналасқан. Жалпы кернеу 24 В.",
      "R₁ = 4 Ом; R₂ = 6 Ом; R₃ = 3 Ом; U = 24 В",
      "R, I — ?",
      `R<sub>23</sub> = ${frac("6 × 3","6 + 3")} = 2 Ом<br>
       R = 4 + 2 = 6 Ом<br>I = ${frac("24","6")} = 4 А`,
      "mixed"
    ],
    [
      "2 Ом және 4 Ом резисторлар тізбектей орналасқан. Осы бөлік 12 Ом резистормен параллель жалғанған. Жалпы кедергі қандай?",
      "R₁ = 2 Ом; R₂ = 4 Ом; R₃ = 12 Ом",
      "R — ?",
      `R<sub>12</sub> = 2 + 4 = 6 Ом<br>
       R = ${frac("6 × 12","6 + 12")} = 4 Ом`
    ],
    [
      "Ұзындығы 20 м, қима ауданы 2 мм² өткізгіштің меншікті кедергісі 1,7 × 10⁻⁸ Ом·м. Кедергіні табыңдар.",
      "l = 20 м; S = 2 мм²; ρ = 1,7 × 10⁻⁸ Ом·м",
      "R — ?",
      `S = 2 × 10<sup>−6</sup> м²<br>
       R = ${frac("1,7 × 10<sup>−8</sup> × 20",
       "2 × 10<sup>−6</sup>")} = 0,17 Ом`
    ],
    [
      "5 Ом резистор екі 10 Ом параллель резистормен тізбектей орналасқан. Жалпы кернеу 20 В. Ток күштерін табыңдар.",
      "R₁ = 5 Ом; R₂ = R₃ = 10 Ом; U = 20 В",
      "I, I₂, I₃ — ?",
      `R<sub>23</sub> = ${frac("10 × 10","10 + 10")} = 5 Ом<br>
       R = 10 Ом<br>I = ${frac("20","10")} = 2 А<br>
       U<sub>23</sub> = 10 В<br>I₂ = I₃ = 1 А`,
      "mixed"
    ]
  ]
];

/* =====================================
   ТОПТЫҚ ОЙЫН · 15 СҰРАҚ
===================================== */

const quiz = [
  ["Электр тогы дегеніміз не?",
    ["Зарядтардың бағытталған қозғалысы","Дененің қызуы",
     "Молекулалардың ретсіз қозғалысы","Жарықтың шағылуы"],0],

  ["Ток күшінің өлшем бірлігі қандай?",
    ["Вольт","Джоуль","Ампер","Ом"],2],

  ["Кернеу қандай әріппен белгіленеді?",
    ["I","U","R","q"],1],

  ["Ом заңының дұрыс формуласы қандай?",
    ["I = UR","I = R/U","I = U + R","I = U/R"],3],

  ["Кернеу 18 В, кедергі 6 Ом. Ток күші?",
    ["2 А","3 А","6 А","12 А"],1],

  ["Амперметр нені өлшейді?",
    ["Кернеуді","Кедергіні","Ток күшін","Жұмысты"],2],

  ["Тізбектей жалғауда қай шама барлық бөлікте бірдей?",
    ["Кернеу","Қуат","Кедергі","Ток күші"],3],

  ["Параллель жалғауда қай шама барлық тармақта бірдей?",
    ["Кернеу","Ток күші","Қуат","Кедергі"],0],

  ["3 Ом және 9 Ом тізбектей орналасқан. Жалпы кедергі?",
    ["27 Ом","6 Ом","12 Ом","3 Ом"],2],

  ["8 Ом және 8 Ом параллель орналасқан. Жалпы кедергі?",
    ["16 Ом","4 Ом","8 Ом","64 Ом"],1],

  ["Металдардағы токты қандай бөлшектер тасымалдайды?",
    ["Протондар","Нейтрондар","Фотондар","Еркін электрондар"],3],

  ["Кернеу тұрақты кезде кедергі екі есе артса, ток күші қалай өзгереді?",
    ["Екі есе азаяды","Екі есе артады","Өзгермейді","Төрт есе артады"],0],

  ["Ток күші 5 А. 8 секундта өтетін заряд?",
    ["13 Кл","5 Кл","40 Кл","8 Кл"],2],

  ["750 мА неше амперге тең?",
    ["7,5 А","0,75 А","75 А","0,075 А"],1],

  ["4 Ом резистор 6 Ом және 3 Ом параллель бөлікпен тізбектей орналасқан. Жалпы кедергі?",
    ["13 Ом","9 Ом","2 Ом","6 Ом"],3]
];

/* =====================================
   24 ОҚУШЫ
===================================== */

const students = [
  "Рамазан","Тұрғанжан","Нұрай","Әлқуат",
  "Шырай","Гүлсезім","Маржан","Мариям",
  "Жансая","Азиза","Ақсезім","Нұрболсын",
  "Ақнұр","Іңкәр","Асхат","Аяжан",
  "Мирас","Санжар","Ерасыл","Нұрасыл",
  "Расул","Айнұр","Дархан","Айкерім"
].map((name,id) => ({
  id,
  name,
  present:true
}));

const teamNames = ["Электрон","Вольт","Ампер"];
const teamIcons = ["⚡","💡","⚛"];

let teams = [[],[],[]];
let scores = [0,0,0];
let answers = {};
let speakers = {};
let history = [[],[],[]];
let teamsDirty = false;
let autoNext = null;

function renderStudents() {
  $("students").innerHTML = students.map(s => `
    <label class="student ${s.present ? "" : "absent"}">
      <input type="checkbox"
        ${s.present ? "checked" : ""}
        onchange="attendance(${s.id},this.checked)">
      ${esc(s.name)}
    </label>
  `).join("");

  $("attendanceCount").textContent =
    `${students.filter(s=>s.present).length} / ${students.length}`;
}

function attendance(id,value) {
  const s = students.find(s=>s.id===id);

  if (!s) return;

  s.present = value;
  teamsDirty = true;

  renderStudents();
  renderTeams();
}

function markAll(value) {
  students.forEach(s=>s.present=value);
  teamsDirty = true;
  renderStudents();
  renderTeams();
}

function addStudent() {
  const name = $("studentName").value.trim();

  if (!name) return;

  students.push({
    id: Math.max(-1,...students.map(s=>s.id))+1,
    name,
    present:true
  });

  $("studentName").value = "";
  teamsDirty = true;
  renderStudents();
}

function resetGame() {
  clearTimeout(autoNext);
  scores = [0,0,0];
  answers = {};
  speakers = {};
  history = [[],[],[]];
}

function shuffleTeams(show=false) {
  const list = students.filter(s=>s.present);

  if (list.length < 3) {
    alert("Кемінде 3 оқушы қажет.");
    return false;
  }

  if (show && Object.keys(answers).length) {
    if (!confirm("Ойын ұпайларын өшіріп, топтарды қайта бөлу керек пе?")) {
      return false;
    }
  }

  for (let i=list.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [list[i],list[j]] = [list[j],list[i]];
  }

  teams = [[],[],[]];

  list.forEach((s,i)=>teams[i%3].push(s.id));

  teamsDirty = false;
  resetGame();
  renderTeams();

  if (show) {
    closePanel("attendancePanel");
    openPanel("teamsPanel");
    renderPage();
  }

  return true;
}

function members(i) {
  return teams[i]
    .map(id=>students.find(s=>s.id===id))
    .filter(s=>s && s.present);
}

function renderTeams() {
  $("teams").innerHTML = `
    ${teamsDirty ? `
      <p class="red">Қатысу өзгерді. Топтарды қайта бөліңіз.</p>
    ` : ""}

    ${teamNames.map((name,i)=>`
      <div class="team-card">
        <strong class="blue">
          ${teamIcons[i]} ${i+1}-топ — ${name}
        </strong>

        <p>${members(i).map(s=>esc(s.name)).join(", ")
          || "Қатысушы жоқ"}</p>

        <strong class="green">${scores[i]} ұпай</strong>
      </div>
    `).join("")}
  `;
}

function pickSpeaker(index) {
  const team = index%3;
  const list = members(team);

  if (!list.length) return "Қатысушы жоқ";

  const previous = list.find(s=>s.id===speakers[index]);

  if (previous) return previous.name;

  let available = list.filter(s=>!history[team].includes(s.id));

  if (!available.length) {
    history[team] = [];
    available = list;
  }

  const s = available[Math.floor(Math.random()*available.length)];

  speakers[index] = s.id;
  history[team].push(s.id);

  return s.name;
}

/* =====================================
   САБАҚТЫҢ БЕТТЕРІ
===================================== */

let pages = [];
let sections = [];
let current = 0;

function slide(content) {
  return `<article class="slide">${content}</article>`;
}

function introPage() {
  return slide(`
    <span class="eyebrow">ФИЗИКА · 1-КУРС · 3.2.2</span>

    <div class="card hero">
      <h1>Электр тогы. Тізбек бөлігі үшін
        <span class="blue">Ом заңы.</span>
        Өткізгіштерді аралас жалғау
      </h1>

      <div class="definition">
        <h3 class="green">Сабақтың мақсаты</h3>
        <p>Электр тогының физикалық табиғатын түсіну,
          Ом заңын есептерде қолдану және
          өткізгіштерді жалғау ерекшеліктерін анықтау.</p>
      </div>

      <div class="formula">${F.ohm}</div>

      <div class="grid3">
        <div class="example">
          <h3>📖 Теория</h3><p>15 түсіндірме</p>
        </div>
        <div class="definition">
          <h3>✍ Практика</h3><p>12 есеп</p>
        </div>
        <div class="example">
          <h3>🏆 Ойын</h3><p>3 команда</p>
        </div>
      </div>

      <button class="primary" onclick="startLesson()">Сабақты бастау →</button>
      <p class="blue">BY DARKHAN</p>
    </div>
  `);
}

function planPage() {
  const plan = [
    ["Ұйымдастыру",3],
    ["Түсіндірме және виртуалды зертхана",25],
    ["Конспект",20],
    ["Деңгейлік есептер",15],
    ["Топтық ойын",14],
    ["Қорытынды және үй тапсырмасы",3]
  ];

  return slide(`
    <span class="eyebrow">САБАҚ ЖОСПАРЫ</span>
    <h2>80 минуттық сабақ</h2>

    <div class="card">
      ${plan.map(([name,time])=>`
        <div class="plan-row">
          <strong>${name}</strong>
          <span class="blue">${time} минут</span>
        </div>
      `).join("")}

      <div class="formula">Барлығы: 80 минут</div>

      <button onclick="openPanel('attendancePanel')">
        Оқушыларды белгілеу
      </button>
    </div>
  `);
}

function theoryPage(t,i) {
  return slide(`
    <span class="eyebrow">ТҮСІНДІРМЕ · ${i+1} / 15</span>
    <h2>${esc(t.title)}</h2>

    <div class="card">
      <div class="definition">
        <p class="green">${esc(t.def)}</p>
      </div>

      <div class="theory-layout">
        ${diagram(t.visual)}
        <p>${esc(t.text)}</p>
      </div>

      <div class="formula">${t.formula}</div>

      <div class="example">
        <p><strong class="gold">Мысал:</strong> ${esc(t.example)}</p>
      </div>

      <button onclick="openBoard()">✎ Тақтада түсіндіру</button>
    </div>
  `);
}

function notePage(n,i) {
  return slide(`
    <span class="eyebrow">ДӘПТЕРГЕ ЖАЗЫП АЛЫҢДАР</span>
    <h2>Конспект ${i+1} / 10</h2>

    <div class="card notebook">
      <h3 class="blue">${i+1}. ${esc(n[0])}</h3>
      <p>${esc(n[1])}</p>
      <div class="formula">${n[2]}</div>
      <p>${esc(n[3])}</p>
    </div>

    <div class="example">
      <p>Анықтаманы және формуланы дәптерге жазыңдар.</p>
    </div>
  `);
}

function problemPage(level,i) {
  const p = problems[level][i];

  return slide(`
    <span class="level ${["easy","medium","hard"][level]}">
      ${level+1}-ДЕҢГЕЙ · ${["ОҢАЙ","ОРТАША","КҮРДЕЛІ"][level]}
    </span>

    <h2>${i+1}-есеп</h2>

    <div class="card">
      <p><strong>${esc(p[0])}</strong></p>

      ${p[4] ? diagram(p[4]) : ""}

      <div class="data-line">
        <span class="blue">Берілгені:</span> ${esc(p[1])}
      </div>

      <div class="data-line">
        <span class="green">Табу керек:</span> ${esc(p[2])}
      </div>

      <div class="row">
        <button class="primary" onclick="toggleAnswer()">Шешу жолы</button>
        <button onclick="openBoard()">✎ Тақтада шығару</button>
      </div>

      <div id="solution" class="answer hidden">
        <h3 class="green">Шешуі:</h3>
        <div class="formula">${p[3]}</div>
      </div>
    </div>
  `);
}

function toggleAnswer() {
  $("solution").classList.toggle("hidden");
}

/* =====================================
   ВИРТУАЛДЫ ЗЕРТХАНА
===================================== */

function simulationPage() {
  return slide(`
    <span class="eyebrow">ВИРТУАЛДЫ ЗЕРТХАНА</span>
    <h2>Ом заңын интерактивті зерттеу</h2>

    <div class="grid2">
      <div class="card">
        <h3 class="blue">Кернеу</h3>
        <div id="simU" class="formula">12 В</div>
        <input id="rangeU" type="range" min="1" max="24"
          value="12" oninput="updateSimulation()">

        <h3 class="green">Кедергі</h3>
        <div id="simR" class="formula">6 Ом</div>
        <input id="rangeR" type="range" min="1" max="24"
          value="6" oninput="updateSimulation()">
      </div>

      <div class="card">
        ${diagram("ohm")}
        <h3>Ток күші</h3>
        <div id="simI" class="formula">2 А</div>
      </div>
    </div>

    <div class="definition">
      <p>Кернеу мен кедергі мәндерін өзгертіп,
        ток күшінің қалай өзгеретінін бақылаңдар.</p>
      <p class="red">Бұл тек виртуалды математикалық модель.</p>
    </div>
  `);
}

function updateSimulation() {
  const u = Number($("rangeU").value);
  const r = Number($("rangeR").value);

  $("simU").textContent = u+" В";
  $("simR").textContent = r+" Ом";
  $("simI").textContent = num(u/r)+" А";
}

/* =====================================
   ТОПТЫҚ ОЙЫН
===================================== */

function quizIntro() {
  return slide(`
    <span class="eyebrow">ТОПТЫҚ ОЙЫН</span>
    <h1>🏆 Электр әлемінің білгірлері</h1>

    <div class="grid3">
      ${teamNames.map((name,i)=>`
        <div class="card">
          <h2>${teamIcons[i]}</h2>
          <h3>${i+1}-топ — ${name}</h3>
          <p>${members(i).map(s=>esc(s.name)).join(", ")
            || "Қатысушы жоқ"}</p>
        </div>
      `).join("")}
    </div>

    <div class="card">
      <h3 class="green">Ойын ережесі</h3>
      <p>15 сұрақ. Әр командаға 5 сұрақтан беріледі.</p>
      <p>Дұрыс жауап — 10 ұпай.</p>
      <p>Жауап беретін оқушы кездейсоқ таңдалады.
        Жауаптан кейін кезек келесі топқа өтеді.</p>

      <div class="row">
        <button onclick="shuffleTeams(true)">🎲 Топқа бөлу</button>
        <button class="primary" onclick="startQuiz()">Бастау →</button>
      </div>
    </div>
  `);
}

function startQuiz() {
  if (students.filter(s=>s.present).length < 3) {
    alert("Кемінде 3 оқушы қажет.");
    return;
  }

  if (teamsDirty || teams.some(t=>!t.length)) {
    if (!shuffleTeams()) return;
  }

  resetGame();
  renderTeams();

  goPage(pages.findIndex(p=>p.quiz===0));
}

function quizPage(i) {
  const q = quiz[i];
  const team = i%3;
  const done = Object.hasOwn(answers,i);
  const selected = answers[i];

  return slide(`
    <span class="eyebrow">ТОПТЫҚ ОЙЫН · ${i+1} / 15</span>

    <div class="team-turn">
      ${teamNames.map((name,k)=>`
        <div class="team-pill ${team===k ? "active" : ""}">
          ${teamIcons[k]} ${name} — ${scores[k]} ұпай
        </div>
      `).join("")}
    </div>

    <div class="card">
      <div class="player">
        ${team+1}-топ — ${teamNames[team]}<br>
        Жауап беретін оқушы:
        <strong>${esc(pickSpeaker(i))}</strong>
      </div>

      <p class="question">${esc(q[0])}</p>

      <div class="choices">
        ${q[1].map((answer,k)=>{
          let color = "";

          if (done && k===q[2]) color="correct";
          if (done && k===selected && k!==q[2]) color="wrong";

          return `
            <button class="choice ${color}"
              ${done ? "disabled" : ""}
              onclick="submitAnswer(${i},${k})">
              ${["A","B","C","D"][k]}. ${esc(answer)}
            </button>
          `;
        }).join("")}
      </div>

      ${done ? `
        <div class="${selected===q[2] ? "definition" : "warning"}">
          <p class="${selected===q[2] ? "green" : "red"}">
            ${selected===q[2]
              ? "Дұрыс жауап! +10 ұпай"
              : "Қате жауап. Дұрыс нұсқа жасыл түспен белгіленді."}
          </p>
        </div>

        <button class="primary" onclick="go(1)">
          Келесі команда →
        </button>
      ` : ""}
    </div>
  `);
}

function submitAnswer(i,k) {
  if (pages[current].quiz!==i) return;
  if (Object.hasOwn(answers,i)) return;

  if (!members(i%3).length) {
    alert("Топта қатысушы жоқ. Топтарды қайта бөліңіз.");
    return;
  }

  answers[i]=k;

  if (k===quiz[i][2]) scores[i%3]+=10;

  renderTeams();
  renderPage();

  clearTimeout(autoNext);

  autoNext=setTimeout(()=>{
    if (pages[current].quiz===i) go(1);
  },4000);
}

function resultsPage() {
  const total=Object.keys(answers).length;

  const winners=teamNames.filter(
    (_,i)=>scores[i]===Math.max(...scores)
  );

  return slide(`
    <span class="eyebrow">ОЙЫН ҚОРЫТЫНДЫСЫ</span>
    <h1>🏆 Командалардың нәтижесі</h1>

    <div class="grid3">
      ${teamNames.map((name,i)=>`
        <div class="card">
          <h2>${teamIcons[i]}</h2>
          <h3>${name}</h3>
          <div class="score">${scores[i]} ұпай</div>
          <p>${members(i).map(s=>esc(s.name)).join(", ")}</p>
        </div>
      `).join("")}
    </div>

    <div class="definition">
      <h2 class="green">
        ${total<quiz.length
          ? "Ойын әлі толық аяқталған жоқ"
          : winners.length===1
            ? "🥇 Жеңімпаз — "+winners[0]
            : "🤝 Тең нәтиже — "+winners.join(", ")}
      </h2>

      <p>Жауап берілген сұрақтар: ${total} / 15</p>
    </div>

    <button onclick="startQuiz()">↻ Қайта бастау</button>
  `);
}

/* =====================================
   ҮЙ ТАПСЫРМАСЫ
===================================== */

function homeworkPage() {
  return slide(`
    <span class="eyebrow">ҮЙ ТАПСЫРМАСЫ</span>
    <h2>Дәптерге орындаңдар</h2>

    <div class="card">
      <h3 class="blue">1-есеп</h3>

      <p>Кернеуі 36 В, кедергісі 12 Ом өткізгіштегі
        ток күшін және 20 секундта өтетін зарядты табыңдар.</p>

      <h3 class="green">2-есеп</h3>

      <p>4 Ом резистор 8 Ом және 8 Ом параллель бөлікпен
        тізбектей орналасқан. Жалпы кернеу 24 В.
        Жалпы кедергі мен ток күшін анықтаңдар.</p>

      ${diagram("mixed")}

      <div class="example">
        <p>Берілгені, формуласы, шешуі және жауабы толық жазылсын.</p>
      </div>
    </div>

    <div class="card hero">
      <h1 class="green">Сабақ аяқталды!</h1>
      <p>Назарларыңызға рақмет!</p>
      <h2>Сау болыңыздар!</h2>
      <p class="blue">BY DARKHAN</p>
    </div>
  `);
}

/* =====================================
   МӘЗІР ЖӘНЕ НАВИГАЦИЯ
===================================== */

function buildPages() {
  pages=[];
  sections=[];

  function section(name,icon,items) {
    sections.push({name,icon,start:pages.length});
    pages.push(...items);
  }

  section("Басты бет","⌂",[{render:introPage}]);
  section("Сабақ жоспары","📋",[{render:planPage}]);

  section("Түсіндірме","📖",
    theory.map((t,i)=>({render:()=>theoryPage(t,i)}))
  );

  section("Виртуалды зертхана","⚡",[{render:simulationPage}]);

  section("Конспект","📘",
    notes.map((n,i)=>({render:()=>notePage(n,i)}))
  );

  problems.forEach((list,level)=>{
    section(`${level+1}-деңгей`,["🟢","🟡","🔴"][level],
      list.map((p,i)=>({render:()=>problemPage(level,i)}))
    );
  });

  section("Топтық ойын","🏆",[
    {render:quizIntro},
    ...quiz.map((q,i)=>({
      quiz:i,
      render:()=>quizPage(i)
    }))
  ]);

  section("Қорытынды","📊",[{render:resultsPage}]);
  section("Үй тапсырмасы","✎",[{render:homeworkPage}]);

  $("lessonMenu").innerHTML=sections.map((s,i)=>`
    <button data-section="${i}" onclick="goPage(${s.start})">
      ${s.icon} ${s.name}
    </button>
  `).join("");
}

function renderPage() {
  current=Math.max(0,Math.min(current,pages.length-1));

  $("stage").innerHTML=pages[current].render();

  $("pageCount").textContent=`${current+1} / ${pages.length}`;

  $("progressFill").style.width=
    `${(current+1)/pages.length*100}%`;

  $("prev").disabled=current===0;
  $("next").disabled=current===pages.length-1;

  let active=0;

  sections.forEach((s,i)=>{
    if (current>=s.start) active=i;
  });

  document.querySelectorAll("[data-section]").forEach(b=>{
    b.classList.toggle("active",Number(b.dataset.section)===active);
  });

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

function startLesson() {
  startTimer();
  goPage(1);
}

/* =====================================
   ҚАЗАҚША МӘТІНДІ ДАУЫСТАП ОҚУ
===================================== */

function readPage() {
  if (!("speechSynthesis" in window)) {
    alert("Бұл браузерде дыбыстау қолжетімсіз.");
    return;
  }

  const voice=speechSynthesis.getVoices().find(
    v=>v.lang.toLowerCase().startsWith("kk")
  );

  if (!voice) {
    alert("Құрылғыда қазақша дауыс орнатылмаған немесе әлі жүктелмеген.");
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
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
}

/* =====================================
   ҚОЗҒАЛМАЛЫ ТЕРЕЗЕЛЕР
===================================== */

let z=200;

function openPanel(id) {
  const p=$(id);

  p.classList.remove("hidden");
  p.style.zIndex=++z;

  if (id==="attendancePanel") renderStudents();
  if (id==="teamsPanel") renderTeams();

  clampPanel(p);
}

function closePanel(id) {
  $(id).classList.add("hidden");
}

function clampPanel(p) {
  if (p.classList.contains("hidden")) return;

  const r=p.getBoundingClientRect();

  p.style.left=Math.max(0,Math.min(r.left,innerWidth-r.width))+"px";
  p.style.top=Math.max(0,Math.min(r.top,innerHeight-r.height))+"px";
  p.style.right="auto";
}

/* Калькуляторды батырмаларынан да қозғалту */

document.querySelectorAll(".floating").forEach(panel=>{
  let drag=null;
  let suppress=false;

  panel.addEventListener("pointerdown",e=>{
    if (e.button!==0 || !e.isPrimary) return;

    panel.style.zIndex=++z;
    suppress=false;

    const mini=panel.classList.contains("mini");

    if (!mini && !e.target.closest(".window-title")) return;

    if (e.target.closest("select,textarea,input:not([readonly])")) {
      return;
    }

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
    if (!drag || e.pointerId!==drag.id) return;

    const dx=e.clientX-drag.x;
    const dy=e.clientY-drag.y;

    if (!drag.moving && Math.hypot(dx,dy)<6) return;

    if (!drag.moving) {
      drag.moving=true;
      suppress=true;

      panel.classList.add("dragging");

      try {
        panel.setPointerCapture(e.pointerId);
      } catch {}
    }

    if (e.cancelable) e.preventDefault();

    panel.style.left=Math.max(
      0,Math.min(drag.left+dx,innerWidth-panel.offsetWidth)
    )+"px";

    panel.style.top=Math.max(
      0,Math.min(drag.top+dy,innerHeight-panel.offsetHeight)
    )+"px";

    panel.style.right="auto";

  },{passive:false});

  function end(e) {
    if (!drag || e.pointerId!==drag.id) return;

    drag=null;
    panel.classList.remove("dragging");

    if (panel.hasPointerCapture(e.pointerId)) {
      panel.releasePointerCapture(e.pointerId);
    }

    setTimeout(()=>suppress=false,250);
  }

  window.addEventListener("pointerup",end);
  window.addEventListener("pointercancel",end);

  panel.addEventListener("click",e=>{
    if (suppress) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);
});

/* =====================================
   МАТЕМАТИКАЛЫҚ КАЛЬКУЛЯТОР
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
  "ln","log","abs","="
];

function renderMathKeys() {
  $("mathKeys").innerHTML=keys.map(key=>`
    <button class="${key==="=" ? "primary" : ""}"
      onclick="mathPress('${key}')">
      ${key==="DEG" ? degree ? "DEG" : "RAD" : key}
    </button>
  `).join("");
}

function mathPress(key) {
  try {
    if (key==="DEG") {
      degree=!degree;
      renderMathKeys();
      return;
    }

    if (key==="C") {
      expression="";
      $("mathResult").textContent="0";

    } else if (key==="⌫") {
      expression=expression.slice(0,-1);

    } else if (key==="=") {
      expression=num(evaluateMath(expression));
      $("mathResult").textContent=expression;

    } else if (key==="x²") {
      expression+="^2";

    } else if (key==="√") {
      expression+="sqrt(";

    } else if (["sin","cos","tan","ctg","ln","log","abs"].includes(key)) {
      expression+=key+"(";

    } else {
      const map={"÷":"/","×":"*","−":"-","π":"pi"};

      expression+=map[key] || key;
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

/* eval қолданбай математикалық есептеу */

function evaluateMath(source) {
  const clean=source.replace(/\s+/g,"");

  if (!clean || clean.length>500) throw Error("Қате");

  const tokens=clean.match(
    /(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z]+|[+\-*/^()]/gi
  ) || [];

  if (tokens.join("")!==clean) throw Error("Қате");

  let pos=0;

  function sum() {
    let n=product();

    while (tokens[pos]==="+" || tokens[pos]==="-") {
      const op=tokens[pos++];
      const b=product();

      n=op==="+" ? n+b : n-b;
    }
    return n;
  }

  function product() {
    let n=unary();

    while (tokens[pos]==="*" || tokens[pos]==="/") {
      const op=tokens[pos++];
      const b=unary();

      if (op==="/" && b===0) throw Error("Нөлге бөлу");

      n=op==="*" ? n*b : n/b;
    }
    return n;
  }

  function unary() {
    if (tokens[pos]==="+") {
      pos++;
      return unary();
    }

    if (tokens[pos]==="-") {
      pos++;
      return -unary();
    }

    return power();
  }

  function power() {
    let n=atom();

    if (tokens[pos]==="^") {
      pos++;
      n=Math.pow(n,unary());
    }
    return n;
  }

  function atom() {
    const token=tokens[pos++];

    if (token===undefined) throw Error("Қате");

    if (/^(?:\d|\.)/.test(token)) return Number(token);

    if (token==="pi") return Math.PI;

    if (token==="(") {
      const n=sum();

      if (tokens[pos++]!==")") throw Error("Жақша");

      return n;
    }

    const rad=x=>degree ? x*Math.PI/180 : x;

    const funcs={
      sin:x=>Math.sin(rad(x)),
      cos:x=>Math.cos(rad(x)),

      tan:x=>{
        if (Math.abs(Math.cos(rad(x)))<1e-12) throw Error("Қате");
        return Math.tan(rad(x));
      },

      ctg:x=>{
        if (Math.abs(Math.sin(rad(x)))<1e-12) throw Error("Қате");
        return 1/Math.tan(rad(x));
      },

      sqrt:Math.sqrt,
      abs:Math.abs,
      ln:Math.log,
      log:Math.log10
    };

    if (Object.hasOwn(funcs,token)) {
      if (tokens[pos++]!=="(") throw Error("Жақша");

      const n=sum();

      if (tokens[pos++]!==")") throw Error("Жақша");

      return funcs[token](n);
    }

    throw Error("Белгісіз өрнек");
  }

  const result=sum();

  if (pos!==tokens.length || !Number.isFinite(result)) {
    throw Error("Қате");
  }

  return result;
}

/* =====================================
   ФИЗИКАЛЫҚ КАЛЬКУЛЯТОР
===================================== */

const physics=[
  {
    name:"Ом заңы",
    vars:{
      I:["Ток күші","А"],
      U:["Кернеу","В"],
      R:["Кедергі","Ом"]
    },
    solve:{
      I:v=>v.U/v.R,
      U:v=>v.I*v.R,
      R:v=>v.U/v.I
    }
  },
  {
    name:"Электр заряды",
    vars:{
      q:["Заряд","Кл"],
      I:["Ток күші","А"],
      t:["Уақыт","с"]
    },
    solve:{
      q:v=>v.I*v.t,
      I:v=>v.q/v.t,
      t:v=>v.q/v.I
    }
  },
  {
    name:"Электр кернеуі",
    vars:{
      U:["Кернеу","В"],
      A:["Жұмыс","Дж"],
      q:["Заряд","Кл"]
    },
    solve:{
      U:v=>v.A/v.q,
      A:v=>v.U*v.q,
      q:v=>v.A/v.U
    }
  },
  {
    name:"R = ρl/S",
    vars:{
      R:["Кедергі","Ом"],
      rho:["Меншікті кедергі","Ом·м"],
      l:["Ұзындық","м"],
      S:["Қима ауданы","м²"]
    },
    solve:{
      R:v=>v.rho*v.l/v.S,
      rho:v=>v.R*v.S/v.l,
      l:v=>v.R*v.S/v.rho,
      S:v=>v.rho*v.l/v.R
    }
  },
  {
    name:"Тізбектей жалғау",
    vars:{
      R:["Жалпы кедергі","Ом"],
      R1:["R₁","Ом"],
      R2:["R₂","Ом"]
    },
    solve:{
      R:v=>v.R1+v.R2
    }
  },
  {
    name:"Параллель жалғау",
    vars:{
      R:["Жалпы кедергі","Ом"],
      R1:["R₁","Ом"],
      R2:["R₂","Ом"]
    },
    solve:{
      R:v=>v.R1*v.R2/(v.R1+v.R2)
    }
  },
  {
    name:"Аралас жалғау",
    vars:{
      R:["Жалпы кедергі","Ом"],
      R1:["R₁","Ом"],
      R2:["R₂","Ом"],
      R3:["R₃","Ом"]
    },
    solve:{
      R:v=>v.R1+v.R2*v.R3/(v.R2+v.R3)
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

  $("physicsUnknown").innerHTML=Object.keys(f.solve).map(key=>`
    <option value="${key}">${esc(f.vars[key][0])}</option>
  `).join("");

  physicsInputs();
}

function physicsInputs() {
  const f=physics[Number($("physicsFormula").value)];
  const unknown=$("physicsUnknown").value;

  $("physicsInputs").innerHTML=Object.entries(f.vars)
    .filter(([key])=>key!==unknown)
    .map(([key,info])=>`
      <label for="phys_${key}">
        ${esc(info[0])} (${esc(info[1])})
      </label>
      <input id="phys_${key}" type="number"
        min="0" step="any" placeholder="Мәні">
    `).join("");

  $("physicsResult").textContent="Нәтиже";

  clampPanel($("physicsPanel"));
}

function calculatePhysics() {
  try {
    const f=physics[Number($("physicsFormula").value)];
    const unknown=$("physicsUnknown").value;
    const values={};

    Object.keys(f.vars).forEach(key=>{
      if (key===unknown) return;

      const input=$("phys_"+key);

      if (!input.value.trim()) throw Error("Мәндерді енгізіңіз");

      const value=Number(input.value);

      if (!Number.isFinite(value) || value<0) {
        throw Error("Мәнді тексеріңіз");
      }

      if (["R","R1","R2","R3","rho","l","S"].includes(key)
        && value===0) {
        throw Error("Мән нөлден үлкен болсын");
      }

      values[key]=value;
    });

    const answer=f.solve[unknown](values);
    const symbol=unknown==="rho" ? "ρ" : unknown;

    $("physicsResult").textContent=
      `${symbol} = ${num(answer)} ${f.vars[unknown][1]}`;

  } catch(error) {
    $("physicsResult").textContent=error.message;
  }
}

/* =====================================
   ИНТЕРАКТИВТІ ТАҚТА
===================================== */

const canvas=$("canvas");
const ctx=canvas.getContext("2d");

const BW=1600;
const BH=900;

let ink="#172b42";
let penSize=5;
let tool="pen";
let boardZoom=100;

let boardPages=[
  {
    actions:[],
    redo:[],
    grid:false
  }
];

let activeBoard=0;
let draft=null;
let pointer=null;
let pan=null;

function state() {
  return boardPages[activeBoard];
}

function openBoard() {
  clearTimeout(autoNext);

  $("board").classList.remove("hidden");

  setTool(tool);
  resizeBoard();
  renderBoard();
}

function closeBoard() {
  cancelDrawing();

  $("board").classList.add("hidden");
  $("eraserCursor").classList.add("hidden");
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

  canvas.style.cursor=
    value==="hand" ? "grab" :
    value==="eraser" ? "none" :
    value==="text" ? "text" :
    "crosshair";

  $("eraserCursor").classList.add("hidden");
}

/* Тақтадағы нақты координаталар */

function point(e) {
  const r=canvas.getBoundingClientRect();

  return {
    x:(e.clientX-r.left)*BW/r.width,
    y:(e.clientY-r.top)*BH/r.height
  };
}

/* =====================================
   СУРЕТ САЛУ
===================================== */

function draw(action) {
  ctx.save();

  ctx.strokeStyle=action.color || "#172b42";
  ctx.fillStyle=action.color || "#172b42";
  ctx.lineWidth=action.size || 5;
  ctx.lineCap="round";
  ctx.lineJoin="round";

  if (action.type==="clear") {
    ctx.clearRect(0,0,BW,BH);

  } else if (action.type==="image") {
    ctx.drawImage(
      action.image,
      action.x,
      action.y,
      action.width,
      action.height
    );

  } else if (action.type==="text") {
    ctx.font=`600 ${action.size}px "Segoe UI", Arial`;
    ctx.textBaseline="top";

    ctx.fillText(action.text,action.x,action.y);

  } else if (["pen","marker","eraser"].includes(action.type)) {
    const points=action.points;

    if (action.type==="eraser") {
      ctx.globalCompositeOperation="destination-out";
    }

    if (action.type==="marker") {
      ctx.globalAlpha=.32;
    }

    if (points.length) {
      ctx.beginPath();

      if (points.length===1) {
        ctx.arc(
          points[0].x,
          points[0].y,
          action.size/2,
          0,
          Math.PI*2
        );

        ctx.fill();

      } else {
        ctx.moveTo(points[0].x,points[0].y);

        points.slice(1).forEach(p=>{
          ctx.lineTo(p.x,p.y);
        });

        ctx.stroke();
      }
    }

  } else {
    const a=action.start;
    const b=action.end;

    const dx=b.x-a.x;
    const dy=b.y-a.y;

    ctx.beginPath();

    if (action.type==="line") {
      ctx.moveTo(a.x,a.y);
      ctx.lineTo(b.x,b.y);
    }

    if (action.type==="arrow") {
      const angle=Math.atan2(dy,dx);
      const length=Math.max(16,action.size*3);

      ctx.moveTo(a.x,a.y);
      ctx.lineTo(b.x,b.y);

      ctx.lineTo(
        b.x-length*Math.cos(angle-Math.PI/6),
        b.y-length*Math.sin(angle-Math.PI/6)
      );

      ctx.moveTo(b.x,b.y);

      ctx.lineTo(
        b.x-length*Math.cos(angle+Math.PI/6),
        b.y-length*Math.sin(angle+Math.PI/6)
      );
    }

    if (action.type==="rect") {
      ctx.rect(a.x,a.y,dx,dy);
    }

    if (action.type==="circle") {
      ctx.ellipse(
        (a.x+b.x)/2,
        (a.y+b.y)/2,
        Math.max(.1,Math.abs(dx)/2),
        Math.max(.1,Math.abs(dy)/2),
        0,
        0,
        Math.PI*2
      );
    }

    if (action.type==="triangle") {
      ctx.moveTo((a.x+b.x)/2,a.y);
      ctx.lineTo(a.x,b.y);
      ctx.lineTo(b.x,b.y);
      ctx.closePath();
    }

    ctx.stroke();
  }

  ctx.restore();
}

function renderBoard() {
  ctx.clearRect(0,0,BW,BH);

  state().actions.forEach(draw);

  if (draft) draw(draft);

  $("boardCount").textContent=
    `${activeBoard+1} / ${boardPages.length}`;

  const paper=$("paper");

  if (state().grid) {
    const step=40*paper.clientWidth/BW;

    paper.style.backgroundImage=`
      linear-gradient(#d5e6f3 1px,transparent 1px),
      linear-gradient(90deg,#d5e6f3 1px,transparent 1px)
    `;

    paper.style.backgroundSize=`${step}px ${step}px`;

  } else {
    paper.style.backgroundImage="none";
  }
}

function commit(action) {
  state().actions.push(action);
  state().redo=[];

  renderBoard();
}

/* =====================================
   САУСАҚ, ТІНТУІР ЖӘНЕ ҚАЛАМ
===================================== */

canvas.addEventListener("pointerdown",e=>{
  if (!e.isPrimary || e.button!==0 || pointer!==null) {
    return;
  }

  e.preventDefault();

  const p=point(e);

  if (tool==="text") {
    const text=prompt("Тақтаға жазылатын мәтін:");

    if (text && text.trim()) {
      commit({
        type:"text",
        color:ink,
        size:Math.max(25,penSize*4),
        text:text.trim(),
        x:p.x,
        y:p.y
      });
    }

    return;
  }

  pointer=e.pointerId;

  canvas.setPointerCapture(e.pointerId);

  if (tool==="hand") {
    const v=$("boardViewport");

    pan={
      x:e.clientX,
      y:e.clientY,
      left:v.scrollLeft,
      top:v.scrollTop
    };

    canvas.style.cursor="grabbing";

    return;
  }

  const size=tool==="eraser"
    ? Math.max(18,penSize*3)
    : tool==="marker"
      ? penSize*4
      : penSize;

  if (["pen","marker","eraser"].includes(tool)) {
    draft={
      type:tool,
      color:ink,
      size,
      points:[p]
    };

  } else {
    draft={
      type:tool,
      color:ink,
      size,
      start:p,
      end:p
    };
  }

  renderBoard();
});

canvas.addEventListener("pointermove",e=>{
  if (tool==="eraser") {
    const r=canvas.getBoundingClientRect();
    const cursor=$("eraserCursor");

    const size=
      Math.max(18,penSize*3)*r.width/BW;

    cursor.style.width=size+"px";
    cursor.style.height=size+"px";

    cursor.style.left=e.clientX-r.left+"px";
    cursor.style.top=e.clientY-r.top+"px";

    cursor.classList.remove("hidden");
  }

  if (e.pointerId!==pointer) return;

  if (pan) {
    const v=$("boardViewport");

    v.scrollLeft=pan.left-(e.clientX-pan.x);
    v.scrollTop=pan.top-(e.clientY-pan.y);

    return;
  }

  if (!draft) return;

  const p=point(e);

  if (draft.points) {
    const last=draft.points[draft.points.length-1];

    if (Math.hypot(p.x-last.x,p.y-last.y)>.3) {
      draft.points.push(p);
    }
  } else {
    draft.end=p;
  }

  renderBoard();
});

function finishDrawing(e,cancelled=false) {
  if (e.pointerId!==pointer) return;

  if (draft && !cancelled) {
    const p=point(e);

    if (draft.points) {
      const last=draft.points[draft.points.length-1];

      if (Math.hypot(p.x-last.x,p.y-last.y)>.3) {
        draft.points.push(p);
      }

    } else {
      draft.end=p;
    }
  }

  const finished=draft;

  draft=null;
  pan=null;
  pointer=null;

  if (finished && !cancelled) {
    commit(finished);
  } else {
    renderBoard();
  }

  if (canvas.hasPointerCapture(e.pointerId)) {
    canvas.releasePointerCapture(e.pointerId);
  }

  if (tool==="hand") {
    canvas.style.cursor="grab";
  }
}

function cancelDrawing() {
  const id=pointer;

  draft=null;
  pan=null;
  pointer=null;

  if (id!==null && canvas.hasPointerCapture(id)) {
    canvas.releasePointerCapture(id);
  }

  renderBoard();
}

canvas.addEventListener("pointerup",e=>{
  finishDrawing(e);
});

canvas.addEventListener("pointercancel",e=>{
  finishDrawing(e,true);
});

canvas.addEventListener("lostpointercapture",e=>{
  finishDrawing(e,true);
});

canvas.addEventListener("pointerleave",()=>{
  $("eraserCursor").classList.add("hidden");
});

/* =====================================
   ТАҚТАНЫҢ БЕТТЕРІ
===================================== */

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
    0,
    Math.min(activeBoard+amount,boardPages.length-1)
  );

  renderBoard();
}

function deleteBoardPage() {
  if (!confirm("Осы тақта бетін өшіру керек пе?")) return;

  cancelDrawing();

  if (boardPages.length===1) {
    boardPages[0]={
      actions:[],
      redo:[],
      grid:false
    };

  } else {
    boardPages.splice(activeBoard,1);

    activeBoard=Math.min(
      activeBoard,
      boardPages.length-1
    );
  }

  renderBoard();
}

function undoBoard() {
  cancelDrawing();

  if (state().actions.length) {
    state().redo.push(state().actions.pop());
    renderBoard();
  }
}

function redoBoard() {
  cancelDrawing();

  if (state().redo.length) {
    state().actions.push(state().redo.pop());
    renderBoard();
  }
}

function clearBoard() {
  if (!confirm("Тақтаны тазалау керек пе?")) return;

  cancelDrawing();
  commit({type:"clear"});
}

function toggleGrid() {
  state().grid=!state().grid;
  renderBoard();
}

/* =====================================
   ТАҚТАНЫҢ МАСШТАБЫ
===================================== */

function resizeBoard() {
  if ($("board").classList.contains("hidden")) return;

  const viewport=$("boardViewport");

  const w=Math.max(1,viewport.clientWidth-24);
  const h=Math.max(1,viewport.clientHeight-24);

  const baseWidth=Math.min(w,h*BW/BH);

  const width=baseWidth*boardZoom/100;
  const height=width*BH/BW;

  const paper=$("paper");

  paper.style.width=width+"px";

  paper.style.marginTop=
    Math.max(0,(h-height)/2)+"px";

  paper.style.marginLeft=
    width>w ? "0" : "auto";

  paper.style.marginRight=
    width>w ? "0" : "auto";

  $("boardZoom").textContent=boardZoom+"%";

  renderBoard();
}

function boardScale(amount) {
  boardZoom=Math.max(
    25,
    Math.min(300,boardZoom+amount)
  );

  resizeBoard();
}

function resetBoardScale() {
  boardZoom=100;

  resizeBoard();

  $("boardViewport").scrollTo(0,0);
}

/* =====================================
   ТАҚТАҒА СУРЕТ ҚОСУ
===================================== */

function importImage(e) {
  const file=e.target.files[0];

  if (!file) return;

  const target=state();

  const image=new Image();
  const url=URL.createObjectURL(file);

  image.onload=()=>{
    const scale=Math.min(
      1000/image.width,
      650/image.height,
      1
    );

    const w=image.width*scale;
    const h=image.height*scale;

    if (boardPages.includes(target)) {
      target.actions.push({
        type:"image",
        image,
        x:(BW-w)/2,
        y:(BH-h)/2,
        width:w,
        height:h
      });

      target.redo=[];
    }

    URL.revokeObjectURL(url);

    renderBoard();
  };

  image.onerror=()=>{
    URL.revokeObjectURL(url);
    alert("Суретті ашу мүмкін болмады.");
  };

  image.src=url;
  e.target.value="";
}

/* =====================================
   PNG СУРЕТІ РЕТІНДЕ САҚТАУ
===================================== */

function saveBoard() {
  const output=document.createElement("canvas");

  output.width=BW;
  output.height=BH;

  const out=output.getContext("2d");

  out.fillStyle="#ffffff";
  out.fillRect(0,0,BW,BH);

  if (state().grid) {
    out.strokeStyle="#d5e6f3";
    out.lineWidth=1;

    for (let x=0;x<=BW;x+=40) {
      out.beginPath();
      out.moveTo(x,0);
      out.lineTo(x,BH);
      out.stroke();
    }

    for (let y=0;y<=BH;y+=40) {
      out.beginPath();
      out.moveTo(0,y);
      out.lineTo(BW,y);
      out.stroke();
    }
  }

  out.drawImage(canvas,0,0);

  const pageNumber=activeBoard+1;

  output.toBlob(blob=>{
    if (!blob) return;

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;
    a.download=`physics-board-${pageNumber}.png`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(()=>{
      URL.revokeObjectURL(url);
    },1000);

  },"image/png");
}

/* =====================================
   АЛМАТЫНЫҢ НАҚТЫ УАҚЫТЫ — UTC+5
===================================== */

function updateClock() {
  const local=new Date(
    Date.now()+5*60*60*1000
  );

  $("clock").textContent=
    new Intl.DateTimeFormat("kk-KZ",{
      timeZone:"UTC",
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit",
      hourCycle:"h23"
    }).format(local);

  $("date").textContent=
    new Intl.DateTimeFormat("kk-KZ",{
      timeZone:"UTC",
      day:"numeric",
      month:"long",
      year:"numeric"
    }).format(local);
}

/* =====================================
   80 МИНУТТЫҚ САБАҚ ТАЙМЕРІ
===================================== */

const duration=80*60;

let accumulated=0;
let started=0;
let running=false;

function timerSeconds() {
  const extra=running
    ? (Date.now()-started)/1000
    : 0;

  return Math.min(
    duration,
    Math.floor(accumulated+extra)
  );
}

function formatTime(s) {
  return String(Math.floor(s/60)).padStart(2,"0")
    +":"
    +String(s%60).padStart(2,"0");
}

function updateTimer() {
  const remaining=duration-timerSeconds();

  $("timer").textContent=formatTime(remaining);

  $("timer").style.color=
    remaining<=300 ? "#d63a50" : "#16874e";

  if (remaining===0) {
    running=false;
    accumulated=duration;
  }

  $("timerButton").textContent=
    running ? "Тоқтату" : "Бастау";

  $("timerButton").disabled=remaining===0;
}

function startTimer() {
  if (running || accumulated>=duration) return;

  started=Date.now();
  running=true;

  updateTimer();
}

function toggleTimer() {
  if (running) {
    accumulated=Math.min(
      duration,
      accumulated+(Date.now()-started)/1000
    );

    running=false;

  } else {
    startTimer();
  }

  updateTimer();
}

function resetTimer() {
  if (!confirm("Таймерді 80 минутқа қайтару керек пе?")) {
    return;
  }

  accumulated=0;
  started=0;
  running=false;

  updateTimer();
}

/* =====================================
   ПЕРНЕТАҚТА БАТЫРМАЛАРЫ
===================================== */

document.addEventListener("keydown",e=>{
  if (e.key==="Escape") {
    const opened=[...document.querySelectorAll(".floating")]
      .filter(p=>!p.classList.contains("hidden"))
      .sort((a,b)=>
        Number(b.style.zIndex || 0)-
        Number(a.style.zIndex || 0)
      );

    if (opened.length) {
      closePanel(opened[0].id);

    } else if (!$("board").classList.contains("hidden")) {
      closeBoard();
    }

    return;
  }

  if (e.target.closest("input,select,textarea,button")) {
    return;
  }

  const boardOpened=
    !$("board").classList.contains("hidden");

  if (boardOpened) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==="z") {
      e.preventDefault();

      if (e.shiftKey) redoBoard();
      else undoBoard();
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==="y") {
      e.preventDefault();
      redoBoard();
    }

    return;
  }

  if (e.key==="ArrowRight") go(1);
  if (e.key==="ArrowLeft") go(-1);

  if (!e.ctrlKey && !e.metaKey) {
    if (e.key==="+") changeScale(25);
    if (e.key==="-") changeScale(-25);
    if (e.key==="0") resetScale();
  }
});

$("studentName").addEventListener("keydown",e=>{
  if (e.key==="Enter") addStudent();
});

function onResize() {
  applyScale();
  resizeBoard();

  document.querySelectorAll(".floating")
    .forEach(clampPanel);
}

window.addEventListener("resize",onResize);

document.addEventListener(
  "fullscreenchange",
  onResize
);

/* =====================================
   САЙТТЫ ІСКЕ ҚОСУ
===================================== */

buildPages();

shuffleTeams();

renderStudents();
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

/* PHYSICS LAB PRO — BY DARKHAN */
