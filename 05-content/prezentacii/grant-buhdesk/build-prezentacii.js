const pptxgen = require("pptxgenjs");
const THEME = {
  name: "Buhdesk Grant",
  headFontFace: "Arial", bodyFontFace: "Arial",
  colors: { dk1:"1B1B1B", lt1:"FFFFFF", dk2:"4A4A48", lt2:"F2F3ED",
    accent1:"7C7E2E", accent2:"D73A61", accent3:"646464", accent4:"D3D4CF",
    accent5:"FCF0F3", accent6:"2B2B29", hlink:"7C7E2E", folHlink:"646464" }
};
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";            // 13.33 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = "OOO 1+1 Buhdesk";
pres.title  = "Zayavka na grant: II-agent dlya 1S";
const C = pres.SchemeColor;
const FOOT = "ИИ-агент для 1С  ·  ООО «1+1 Бухдеск»";
["Заявка","Сервис","Планы","Грант","Актуальность","Технологии","Конкуренты","Перспективы","Бюджет","Компания"].forEach(t=>pres.addSection({ title:t }));

const footer = (dark) => ([
  { text: { text: FOOT, options:{ x:0.6, y:6.92, w:8.5, h:0.3, fontSize:9,
      color: dark ? C.accent4 : C.accent3, isTextBox:true, margin:0, valign:"middle" } } },
  { text: { text:"", options:{ x:11.9, y:6.92, w:0.9, h:0.3, fontSize:9, align:"right",
      color: dark ? C.accent4 : C.accent3, isTextBox:true, margin:0, valign:"middle" } } },
]);

pres.defineSlideMaster({ title:"TITLE_DARK", background:{ color: C.accent6 }, objects:[
  { placeholder:{ options:{ name:"kicker", type:"body", x:0.9, y:1.9, w:11.5, h:0.35,
      fontSize:12, bold:true, charSpacing:2, color:C.accent1, margin:0, valign:"bottom", align:"left" }, text:"" } },
  { placeholder:{ options:{ name:"title", type:"title", x:0.9, y:2.3, w:11.5, h:1.5,
      fontSize:38, bold:true, color:C.background1, margin:0, valign:"top", align:"left" }, text:"" } },
  { placeholder:{ options:{ name:"body", type:"body", x:0.9, y:3.85, w:11.5, h:0.6,
      fontSize:16, color:C.accent4, margin:0, valign:"top", align:"left" }, text:"" } },
]});

pres.defineSlideMaster({ title:"CONTENT", background:{ color: C.background2 }, objects:[
  { placeholder:{ options:{ name:"kicker", type:"body", x:0.7, y:0.45, w:11.9, h:0.3,
      fontSize:11, bold:true, charSpacing:2, color:C.accent1, margin:0, valign:"middle", align:"left" }, text:"" } },
  { placeholder:{ options:{ name:"title", type:"title", x:0.7, y:0.8, w:11.9, h:0.65,
      fontSize:30, bold:true, color:C.text1, margin:0, valign:"middle", align:"left" }, text:"" } },
  ...footer(false),
], slideNumber:{ x:11.9, y:6.92, w:0.85, h:0.3, fontSize:9, color:"646464", align:"right" }});

pres.defineSlideMaster({ title:"ACCENT", background:{ color: C.accent6 }, objects:[
  { placeholder:{ options:{ name:"kicker", type:"body", x:0.7, y:0.45, w:11.9, h:0.3,
      fontSize:11, bold:true, charSpacing:2, color:C.accent1, margin:0, valign:"middle", align:"left" }, text:"" } },
  { placeholder:{ options:{ name:"title", type:"title", x:0.7, y:0.8, w:11.9, h:0.65,
      fontSize:30, bold:true, color:C.background1, margin:0, valign:"middle", align:"left" }, text:"" } },
  ...footer(true),
], slideNumber:{ x:11.9, y:6.92, w:0.85, h:0.3, fontSize:9, color:"D3D4CF", align:"right" }});

const card = (s,x,y,w,h,name,fill) => s.addShape(pres.ShapeType.roundRect,
  { x,y,w,h, rectRadius:0.06, fill:{ color: fill || C.background1 }, line:{ color: C.accent4, width:0.5 }, objectName:name });
const T = (s,t,o) => s.addText(t, Object.assign({ isTextBox:true, margin:0 }, o));

/* 1 — титульный */
let s = pres.addSlide({ masterName:"TITLE_DARK", sectionTitle:"Заявка" });
s.addText("ЗАЯВКА НА ГРАНТ", { placeholder:"kicker" });
s.addText("ИИ-агент для создания счетов и актов в 1С через OData", { placeholder:"title" });
s.addText("«Бухдеск» — онлайн-сервис для ведения и контроля бухгалтерии", { placeholder:"body" });
s.addShape(pres.ShapeType.line, { x:0.9, y:4.85, w:11.5, h:0, line:{ color:"4A4A48", width:0.75 }, objectName:"rule" });
[["ЗАПРАШИВАЕМАЯ СУММА","4 153 400 ₽",0.9,3.5],["СРОК РЕАЛИЗАЦИИ","6 месяцев",4.7,3.5],
 ["ЗАЯВИТЕЛЬ","ООО «1+1 Бухдеск»",8.5,3.9]].forEach(([k,v,x,w])=>{
  T(s,k,{ x, y:5.15, w, h:0.25, fontSize:10, bold:true, charSpacing:1.5, color:C.accent1 });
  T(s,v,{ x, y:5.45, w, h:0.4, fontSize:17, bold:true, color:C.background1 }); });
T(s,"Барнаул, 2026",{ x:8.5, y:5.9, w:3.9, h:0.3, fontSize:13, color:C.accent4 });
s.addNotes("Название проекта, сумма и срок взяты из исправленной сметы от 03.10.2026.");

/* 2 — сервис сегодня */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Сервис" });
s.addText("СЕРВИС СЕГОДНЯ", { placeholder:"kicker" });
s.addText("Что делает сервис уже сейчас", { placeholder:"title" });
[["01","Автоматизированный приём задач и первичных документов от клиентов для целей бухгалтерского, налогового, управленческого учёта"],
 ["02","Веб-интерфейс отображает бухгалтерские задачи и статус их выполнения, начисленные и уплаченные налоги, даты предстоящих платежей"],
 ["03","У клиента есть доступ ко всем отчётам, документам и результатам работ бухгалтерии 24/7. Документооборот каждой компании в собственном профиле"]
].forEach(([n,t],i)=>{ const y=1.85+i*1.55;
  card(s,0.7,y,7.3,1.35,"c"+i);
  T(s,n,{ x:1.0, y:y+0.18, w:0.6, h:0.3, fontSize:13, bold:true, color:C.accent1 });
  T(s,t,{ x:1.0, y:y+0.5, w:6.8, h:0.72, fontSize:13, color:C.text1, lineSpacing:17 }); });
s.addShape(pres.ShapeType.roundRect, { x:8.45, y:1.85, w:4.15, h:4.55, rectRadius:0.06,
  fill:{ color:C.background1 }, line:{ color:C.accent3, width:1, dashType:"dash" }, objectName:"ph" });
T(s,"Снимок экрана сервиса",{ x:8.65, y:3.75, w:3.75, h:0.35, fontSize:14, bold:true, align:"center", color:C.accent3 });
T(s,"заполнитель",{ x:8.65, y:4.12, w:3.75, h:0.3, fontSize:11, align:"center", color:C.accent3 });

/* 3 — сервис в цифрах */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Сервис" });
s.addText("ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ О СЕРВИСЕ", { placeholder:"kicker" });
s.addText("Сервис в цифрах", { placeholder:"title" });
T(s,[{ text:"Описание функционала сервиса и оферта для подключения размещены на сайте: ", options:{ color:C.accent3 } },
     { text:"https://service.buh-desk.ru/", options:{ color:C.accent1 } }],
  { x:0.7, y:1.58, w:11.9, h:0.3, fontSize:12 });
[["6","сотрудников трудоустроено в ООО «1+1 Бухдеск» по состоянию на 01.10.2026"],
 ["71 тыс. руб.","среднемесячная заработная плата за 9 мес. 2026 г. в ООО «1+1 Бухдеск»"],
 ["50+","клиентов, с которыми заключены лицензионные соглашения на использование сервиса (на 01.10.2026)"]
].forEach(([n,t],i)=>{ const x=0.7+i*4.0;
  card(s,x,2.05,3.75,2.0,"n"+i);
  T(s,n,{ x:x+0.3, y:2.3, w:3.15, h:0.6, fontSize:30, bold:true, color:C.accent1 });
  T(s,t,{ x:x+0.3, y:2.98, w:3.15, h:0.9, fontSize:11, color:C.text1, lineSpacing:14 }); });
[["№ 202569021","Свидетельство о государственной регистрации программ для ЭВМ"],
 ["№ 32932","Сервис включён в Реестр отечественного ПО (от 31.03.2026)"]
].forEach(([n,t],i)=>{ const x=0.7+i*6.05;
  card(s,x,4.3,5.8,1.5,"r"+i);
  T(s,n,{ x:x+0.3, y:4.52, w:5.2, h:0.45, fontSize:22, bold:true, color:C.text1 });
  T(s,t,{ x:x+0.3, y:5.03, w:5.2, h:0.6, fontSize:11, color:C.accent3, lineSpacing:14 }); });

/* 4 — за свой счёт */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Планы" });
s.addText("ЗА СВОЙ СЧЁТ", { placeholder:"kicker" });
s.addText("Что планируется доработать в Сервисе в 2026–2027 гг.", { placeholder:"title" });
[["01","Автоматизировать разбор, систематизацию и организацию хранения (по видам и срокам) переданных в обработку документов для их последующего распознавания и автоматического ввода в учётную систему клиента и обеспечения быстрого поиска документов в ходе проверок"],
 ["02","Добавить чат для общения с бухгалтером"],
 ["03","Автоматизировать ввод в бухгалтерскую программу 1С следующих документов, полученных от клиентов сервиса: банковские выписки, акты сверок, кадровые документы на приём, увольнение сотрудника, начисление заработной платы и отпускных"]
].forEach(([n,t],i)=>{ const x=0.7+i*4.0;
  card(s,x,1.85,3.75,4.5,"p"+i);
  T(s,n,{ x:x+0.3, y:2.1, w:3.15, h:0.3, fontSize:13, bold:true, color:C.accent1 });
  T(s,t,{ x:x+0.3, y:2.5, w:3.15, h:3.6, fontSize:12, color:C.text1, lineSpacing:16 }); });

/* 5 — предмет гранта */
s = pres.addSlide({ masterName:"ACCENT", sectionTitle:"Грант" });
s.addText("ПРЕДМЕТ ГРАНТА", { placeholder:"kicker" });
s.addText("Что планируется доработать за счёт средств Гранта", { placeholder:"title" });
s.addShape(pres.ShapeType.roundRect,{ x:0.7, y:2.3, w:11.9, h:2.5, rectRadius:0.05,
  fill:{ color:"26261F" }, line:{ color:"7C7E2E", width:1 }, objectName:"gcard" });
T(s,"Автоматизировать формирование и обработку в 1С первичных документов (счетов, актов, УПД) для клиента в режиме 24/7 без участия бухгалтера путём получения от клиента задачи в виде текста или голосового сообщения",
  { x:1.25, y:2.75, w:10.8, h:1.7, fontSize:20, color:C.background1, lineSpacing:30 });
T(s,"4 153 400 ₽  ·  6 месяцев",{ x:0.7, y:5.15, w:11.9, h:0.4, fontSize:16, bold:true, color:C.accent1 });

/* 6 — суть решения */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Грант" });
s.addText("ПРЕДМЕТ ГРАНТА", { placeholder:"kicker" });
s.addText("Суть ИТ-решения", { placeholder:"title" });
[["Клиент ставит задачу","В нашем онлайн-сервисе клиент обращается к ИИ-помощнику «Бухдеск», который подключается к бухгалтерской базе 1С клиента и по заданию клиента (путём печатного или голосового ввода данных) сервис создаёт счёт на оплату или УПД/акт выполненных работ без помощи бухгалтера."],
 ["Сервис заполняет документ","Сервис самостоятельно в справочниках учётной системы клиента подбирает необходимых контрагентов и номенклатуру товара или услуги, выставляет необходимое количество и цену, ставку НДС."],
 ["Клиент уточняет","На основании текстовых сообщений или голосовых комментариев от клиента созданные документы корректируются до нужных значений."]
].forEach(([h,t],i)=>{ const y=1.85+i*1.52;
  card(s,0.7,y,11.9,1.32,"s"+i);
  T(s,h,{ x:1.0, y:y+0.16, w:4.0, h:0.3, fontSize:13, bold:true, color:C.accent1 });
  T(s,t,{ x:1.0, y:y+0.5, w:11.3, h:0.7, fontSize:12, color:C.text1, lineSpacing:15 }); });

/* 7 — сценарий */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Грант" });
s.addText("СЦЕНАРИЙ", { placeholder:"kicker" });
s.addText("Как это работает", { placeholder:"title" });
[["Шаг 1","пользователь печатает или надиктовывает текст"],["Шаг 2","ИИ извлекает данные"],
 ["Шаг 3","создаёт документ в 1С через OData"],["Шаг 4","передаёт документ клиенту"]
].forEach(([n,t],i)=>{ const x=0.7+i*3.1;
  card(s,x,2.6,2.75,1.95,"st"+i);
  T(s,n,{ x:x+0.25, y:2.82, w:2.25, h:0.28, fontSize:11, bold:true, charSpacing:1, color:C.accent1 });
  T(s,t,{ x:x+0.25, y:3.18, w:2.25, h:1.2, fontSize:13, color:C.text1, lineSpacing:16 });
  if(i<3) T(s,"→",{ x:x+2.8, y:3.32, w:0.3, h:0.4, fontSize:18, align:"center", color:C.accent1 }); });

/* 8 — актуальность */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Актуальность" });
s.addText("АКТУАЛЬНОСТЬ И СОЦИАЛЬНАЯ ЗНАЧИМОСТЬ", { placeholder:"kicker" });
s.addText("Эффект от замены бухгалтера-первичника на ИИ", { placeholder:"title" });
T(s,"Одна из самых частых жалоб предпринимателей на бухгалтеров — НЕОПЕРАТИВНОЕ реагирование на срочные задачи. ИИ-помощник в бухгалтерии — это поддержка бизнеса в условиях текущей экономической ситуации и возможность компенсировать рост издержек из-за роста налогов.",
  { x:0.7, y:1.6, w:11.9, h:0.7, fontSize:13, color:C.accent3, lineSpacing:17 });
[["от 45 до 80\nтыс. руб./мес.","Экономия компании на зарплате сотрудника на 1 сотрудника"],
 ["до 20 часов\nв месяц","Экономия времени предпринимателя, который сам выставляет клиентам счета и акты"],
 ["до 80–90%","Снижение ошибок в первичке"],
 ["в 3–10 раз","Скорость обработки документов быстрее ручного ввода в круглосуточном режиме"],
 ["на 20–25%","Увеличение продаж за счёт ускорения реагирования на заявки"]
].forEach(([n,t],i)=>{ const x=0.7+i*2.42;
  card(s,x,2.85,2.25,3.45,"e"+i);
  T(s,n,{ x:x+0.22, y:3.05, w:1.85, h:0.8, fontSize:16, bold:true, color:C.accent1, lineSpacing:20 });
  T(s,t,{ x:x+0.22, y:3.9, w:1.85, h:1.5, fontSize:11, color:C.text1, lineSpacing:14 });
  s.addShape(pres.ShapeType.roundRect,{ x:x+0.22, y:5.65, w:1.85, h:0.42, rectRadius:0.04,
    fill:{ color:C.background2 }, line:{ color:C.accent3, width:0.75, dashType:"dash" }, objectName:"src"+i });
  T(s,"Источник: заполнить",{ x:x+0.22, y:5.65, w:1.85, h:0.42, fontSize:9, align:"center", valign:"middle", color:C.accent3 }); });

/* 9 — технологии */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Технологии" });
s.addText("ТЕХНОЛОГИЧЕСКАЯ ОСНОВА", { placeholder:"kicker" });
s.addText("На чём построено решение", { placeholder:"title" });
T(s,"Модели распознавания и генерации — российские: SpeechKit и YandexGPT",
  { x:0.7, y:1.6, w:11.9, h:0.3, fontSize:13, bold:true, color:C.accent2 });
[["Веб-интерфейс","удобные формы, шаблоны, история и выгрузки. Сервис не зависит от мессенджеров, которые могут быть заблокированы"],
 ["Распознавание и понимание","SpeechKit + YandexGPT извлекают данные из речи и текста"],
 ["Интеграция через OData","создание счетов и актов без доработки конфигурации 1С"],
 ["Контроль и безопасность","превью документа, подтверждение, роли и полный аудит действий"]
].forEach(([h,t],i)=>{ const x=0.7+(i%2)*6.05, y=2.15+Math.floor(i/2)*2.15;
  card(s,x,y,5.8,1.95,"t"+i);
  s.addShape(pres.ShapeType.ellipse,{ x:x+0.3, y:y+0.3, w:0.3, h:0.3, fill:{ color:C.accent1 }, objectName:"dot"+i });
  T(s,h,{ x:x+0.75, y:y+0.28, w:4.8, h:0.35, fontSize:14, bold:true, color:C.text1 });
  T(s,t,{ x:x+0.75, y:y+0.72, w:4.8, h:1.0, fontSize:12, color:C.accent3, lineSpacing:16 }); });

/* 10 — таблица конкурентов */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Конкуренты" });
s.addText("СРАВНЕНИЕ С КОНКУРЕНТАМИ", { placeholder:"kicker" });
s.addText("Чем «Бухдеск» отличается от аналогов", { placeholder:"title" });
T(s,"На рынке нет подобного сервиса, создающего комплексную инфраструктуру для бухгалтерского, налогового и управленческого учёта компаний.",
  { x:0.7, y:1.58, w:11.9, h:0.5, fontSize:12, color:C.accent3, lineSpacing:16 });
const hdr = (t,fill,col)=>({ text:t, options:{ bold:true, color:col||"1B1B1B", fill:{ color:fill||"F2F3ED" }, align:t==="КРИТЕРИЙ"?"left":"center", fontSize:11, valign:"middle" } });
const cel = (t,hl)=>({ text:t, options:{ align:"center", fontSize:11, valign:"middle",
  color: hl?"1B1B1B":(t==="Нет"?"949490":"1B1B1B"), bold:!!hl, fill:{ color: hl?"FCF0F3":"FFFFFF" } } });
const rowsT = [
  [hdr("КРИТЕРИЙ"),hdr("Entera"),hdr("ARQA"),hdr("Кнопка"),hdr("Бухдеск","D73A61","FFFFFF")],
  ["Своя бухгалтерская экспертиза (15 лет)","Нет","Нет","Да","Да"],
  ["Личный кабинет клиента","Нет","Нет","Да","Да"],
  ["Интеграция с 1С","Да","Да","Своя система","Да"],
  ["Входит в комплекс аутсорсингового обслуживания","Нет","Нет","Да","Да"],
  ["Автоматическая обработка первички (текст → документы 1С)","Нет","Нет","Да","Да"],
  ["ИИ-агент (голос → документы 1С)","Да","Нет","Нет","Да"],
].map((r,ri)=> ri===0 ? r : [
  { text:r[0], options:{ fontSize:11, valign:"middle", color:"1B1B1B", fill:{ color:"FFFFFF" } } },
  cel(r[1]),cel(r[2]),cel(r[3]),cel(r[4],true) ]);
s.addTable(rowsT,{ x:0.7, y:2.25, w:11.9, colW:[5.5,1.6,1.6,1.6,1.6], rowH:0.48,
  border:{ type:"solid", color:"E2E3DD", pt:0.75 }, margin:0.08, objectName:"cmp" });

/* 11 — главное отличие */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Конкуренты" });
s.addText("СРАВНЕНИЕ С КОНКУРЕНТАМИ", { placeholder:"kicker" });
s.addText("Главное отличие", { placeholder:"title" });
T(s,"«Бухдеск» — не просто софт, а отраслевая вертикаль: 15-летний бухгалтерский опыт + IT-платформа + разрабатываемый ИИ-агент.",
  { x:0.7, y:1.75, w:5.8, h:0.8, fontSize:14, color:C.text1, lineSpacing:20 });
["15-летний бухгалтерский опыт","IT-платформа","разрабатываемый ИИ-агент"].forEach((t,i)=>{
  const y=2.75+i*0.78; card(s,0.7,y,5.8,0.62,"v"+i);
  s.addShape(pres.ShapeType.ellipse,{ x:0.95, y:y+0.21, w:0.2, h:0.2, fill:{ color:C.accent1 }, objectName:"vd"+i });
  T(s,t,{ x:1.3, y:y, w:5.0, h:0.62, fontSize:13, bold:true, valign:"middle", color:C.text1 }); });
card(s,6.95,1.75,5.65,3.86,"comp");
T(s,"КОНКУРЕНТЫ ПРЕДЛАГАЮТ",{ x:7.3, y:2.05, w:5.0, h:0.3, fontSize:11, bold:true, charSpacing:1.5, color:C.accent1 });
T(s,"Либо софт как отдельную функцию без бухгалтерского аутсорсинга (Entera, при этом сервис запущен только в сентябре 2026 года и работает в тестовом режиме), ARQA), либо еще не реализовали функцию постановки задач голосом (Кнопка), либо предлагают экспертизу без автоматизации (классический аутсорсинг).",
  { x:7.3, y:2.5, w:5.0, h:2.9, fontSize:12, color:C.text1, lineSpacing:17 });

/* 12 — рынок */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Перспективы" });
s.addText("ПЕРСПЕКТИВЫ ПРОЕКТА", { placeholder:"kicker" });
s.addText("Рынок только формируется", { placeholder:"title" });
[["Решений пока единицы","По нашему мнению, передача ввода первичной документации на ИИ — только начинается и в ближайшие годы будет развиваться с помощью множества сервисов. В настоящее время есть единицы таких решений, пока не получившие известности и массового использования из-за большого количества недоработок, отсутствия гарантий конфиденциальности для клиентов (в том числе нет гарантий отсутствия трансграничной передачи данных из-за использования иностранных моделей ИИ)."],
 ["Для наших клиентов решение оптимально","Для клиентов, работающих с бухгалтерским аутсорсингом, наше решение будет оптимальным, так как оно является комплексным, клиенты уже доверили нам свою бухгалтерию, и это значит, что они уверены в безопасности данных, кроме того, им не потребуется подключать дополнительные сервисы и вникать в их изучение."]
].forEach(([h,t],i)=>{ const x=0.7+i*6.05;
  card(s,x,1.85,5.8,4.5,"m"+i);
  T(s,h,{ x:x+0.35, y:2.15, w:5.1, h:0.6, fontSize:14, bold:true, color:C.accent1, lineSpacing:19 });
  T(s,t,{ x:x+0.35, y:2.85, w:5.1, h:3.25, fontSize:12, color:C.text1, lineSpacing:17 }); });

/* 13 — три тренда */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Перспективы" });
s.addText("ПЕРСПЕКТИВЫ ПРОЕКТА", { placeholder:"kicker" });
s.addText("Три тренда, которые сходятся", { placeholder:"title" });
[["01","Налоговая реформа создала всплеск спроса"],["02","Дефицит кадров стимулирует рост аутсорсинга"],
 ["03","ИИ-автоматизация — единственный способ масштабироваться без увеличения штата"]
].forEach(([n,t],i)=>{ const x=0.7+i*4.1;
  card(s,x,2.3,3.75,2.4,"tr"+i);
  T(s,n,{ x:x+0.3, y:2.55, w:1.0, h:0.4, fontSize:20, bold:true, color:C.accent1 });
  T(s,t,{ x:x+0.3, y:3.05, w:3.15, h:1.45, fontSize:13, color:C.text1, lineSpacing:17 });
  if(i<2) T(s,"→",{ x:x+3.8, y:3.3, w:0.3, h:0.4, fontSize:18, align:"center", color:C.accent1 }); });
card(s,0.7,5.05,11.9,0.85,"tr-sum");
T(s,"«Бухдеск» находится в точке пересечения всех трёх трендов.",
  { x:1.05, y:5.05, w:11.2, h:0.85, fontSize:15, bold:true, valign:"middle", color:C.text1 });

/* 14 — бюджет: ФОТ */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Бюджет" });
s.addText("БЮДЖЕТ ПРОЕКТА", { placeholder:"kicker" });
s.addText("Фонд оплаты труда с начислениями", { placeholder:"title" });
const bh = t=>({ text:t, options:{ bold:true, fontSize:11, color:"1B1B1B", fill:{ color:"F2F3ED" }, valign:"middle",
  align:(t==="Сумма, ₽"||t==="Доля")?"right":"left" } });
const bc = (t,a,b)=>({ text:t, options:{ fontSize:11, valign:"middle", align:a||"left", bold:!!b,
  color:"1B1B1B", fill:{ color: b?"F2F3ED":"FFFFFF" } } });
s.addTable([
  [bh("№"),bh("Статья расходов"),bh("Сумма, ₽"),bh("Доля"),bh("Занятость")],
  [bc("1.1"),bc("Python/AI-разработчик (Middle)"),bc("575 000","right"),bc("13,8%","right"),bc("250 000 ₽, 4 мес, 50%")],
  [bc("1.2"),bc("Бэкенд-разработчик / архитектор"),bc("1 265 000","right"),bc("30,5%","right"),bc("220 000 ₽, 5 мес, 100%")],
  [bc("1.3"),bc("Фронтенд-разработчик (React/Vue)"),bc("828 000","right"),bc("19,9%","right"),bc("180 000 ₽, 4 мес, 100%")],
  [bc("1.4"),bc("Тестировщик"),bc("460 000","right"),bc("11,1%","right"),bc("80 000 ₽, 5 мес, 100%")],
  [bc("1.5"),bc("Системный аналитик"),bc("431 250","right"),bc("10,4%","right"),bc("150 000 ₽, 5 мес, 50%")],
  [bc("1.6"),bc("Руководитель проекта"),bc("258 750","right"),bc("6,2%","right"),bc("150 000 ₽, 5 мес, 30%")],
  [bc("",null,true),bc("Итого по ФОТ",null,true),bc("3 818 000","right",true),bc("91,9%","right",true),bc("ФОТ 3 320 000 ₽ + взносы 498 000 ₽",null,true)],
], { x:0.7, y:1.85, w:11.9, colW:[0.6,4.3,1.6,1.0,4.4], rowH:0.44,
  border:{ type:"solid", color:"E2E3DD", pt:0.75 }, margin:0.08, objectName:"bt1" });
card(s,0.7,5.85,11.9,0.72,"stages");
T(s,"Этапы: подготовительный (разработка архитектуры) — 1 месяц · разработка сервиса — 3 месяца · наладка бета-версии и тестовая эксплуатация — 2 месяца",
  { x:1.05, y:5.85, w:11.2, h:0.72, fontSize:12, valign:"middle", color:C.text1 });

/* 15 — бюджет: прочее и итог */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Бюджет" });
s.addText("БЮДЖЕТ ПРОЕКТА", { placeholder:"kicker" });
s.addText("Прочие расходы и итог по смете", { placeholder:"title" });
const sec = t=>({ text:t, options:{ bold:true, fontSize:11, color:"7C7E2E", fill:{ color:"F2F3ED" }, valign:"middle" } });
s.addTable([
  [bh("№"),bh("Статья расходов"),bh("Сумма, ₽"),bh("Доля")],
  [sec(""),sec("2. Yandex AI API и облако"),sec(""),sec("")],
  [bc("2.1"),bc("YandexGPT API (Foundation Models)"),bc("72 000","right"),bc("1,7%","right")],
  [bc("2.2"),bc("Yandex SpeechKit STT"),bc("36 000","right"),bc("0,9%","right")],
  [bc("2.3"),bc("Yandex Cloud — ВМ, хранилище"),bc("120 000","right"),bc("2,9%","right")],
  [bc("2.4"),bc("Yandex Cloud — мониторинг, логи"),bc("14 400","right"),bc("0,3%","right")],
  [sec(""),sec("3. Лицензии и ПО"),sec(""),sec("")],
  [bc("3.1"),bc("SSL-сертификат, домен"),bc("8 000","right"),bc("0,2%","right")],
  [bc("3.2"),bc("CI/CD, инструменты разработки"),bc("45 000","right"),bc("1,1%","right")],
  [bc("3.3"),bc("Тестовые лицензии 1С"),bc("40 000","right"),bc("1,0%","right")],
], { x:0.7, y:1.85, w:7.4, colW:[0.6,4.2,1.5,1.1], rowH:0.42,
  border:{ type:"solid", color:"E2E3DD", pt:0.75 }, margin:0.08, objectName:"bt2" });
s.addShape(pres.ShapeType.roundRect,{ x:8.5, y:1.85, w:4.1, h:1.75, rectRadius:0.06,
  fill:{ color:"26261F" }, line:{ color:"7C7E2E", width:1 }, objectName:"total" });
T(s,"ИТОГО ПО СМЕТЕ",{ x:8.8, y:2.1, w:3.5, h:0.3, fontSize:11, bold:true, charSpacing:1.5, color:C.accent1 });
T(s,"4 153 400 ₽",{ x:8.8, y:2.45, w:3.5, h:0.6, fontSize:28, bold:true, color:C.background1 });
T(s,"100% сметы · срок 6 месяцев",{ x:8.8, y:3.08, w:3.5, h:0.3, fontSize:11, color:C.accent4 });
card(s,8.5,3.8,4.1,2.3,"bnote");
T(s,"Примечания к смете",{ x:8.8, y:4.02, w:3.5, h:0.3, fontSize:12, bold:true, color:C.accent1 });
T(s,"Страховые взносы — по ставке IT-аккредитации Минцифры: 15% до предельной базы 2 979 000 ₽, 7,6% сверх базы.\n\nЗарплаты на уровне региональных ставок (Алтайский край, Барнаул).",
  { x:8.8, y:4.38, w:3.5, h:1.6, fontSize:10, color:C.text1, lineSpacing:13 });

/* 16 — о компании */
s = pres.addSlide({ masterName:"CONTENT", sectionTitle:"Компания" });
s.addText("КРАТКО О КОМПАНИИ", { placeholder:"kicker" });
s.addText("ООО «1+1 Бухдеск»", { placeholder:"title" });
T(s,"ООО «1+1 Бухдеск» — IT-компания из Барнаула, зарегистрирована 10 сентября 2025 года. Создана как технологичный преемник бухгалтерской фирмы ООО «1+1», которая более 15 лет оказывает бухгалтерские и юридические услуги в Алтайском крае и имеет более 450 клиентов на постоянном обслуживании, находится на 37-м месте в рейтинге RAEX среди 15 тысяч бухгалтерских аутсорсинговых компаний.",
  { x:0.7, y:1.8, w:6.0, h:1.9, fontSize:13, color:C.text1, lineSpacing:18 });
T(s,"В нашей компании знают все боли предпринимателей, связанные с бухгалтерским и налоговым учётом.",
  { x:0.7, y:3.85, w:6.0, h:0.6, fontSize:13, color:C.text1, lineSpacing:18 });
T(s,"Наша задача — облегчить процесс предпринимательства и минимизировать их расходы при сохранении качества учёта.",
  { x:0.7, y:4.6, w:6.0, h:0.7, fontSize:13, bold:true, color:C.text1, lineSpacing:18 });
[["15 лет","бухгалтерских и юридических услуг в Алтайском крае"],
 ["450+","клиентов на постоянном обслуживании"],
 ["37-е место","в рейтинге RAEX среди 15 тысяч бухгалтерских аутсорсинговых компаний"]
].forEach(([n,t],i)=>{ const y=1.8+i*1.32;
  card(s,7.1,y,5.5,1.22,"f"+i);
  T(s,n,{ x:7.4, y:y+0.13, w:4.9, h:0.45, fontSize:21, bold:true, color:C.accent1 });
  T(s,t,{ x:7.4, y:y+0.6, w:4.9, h:0.55, fontSize:11, color:C.text1, lineSpacing:13 }); });
s.addShape(pres.ShapeType.roundRect,{ x:7.1, y:5.7, w:5.5, h:0.9, rectRadius:0.06,
  fill:{ color:C.background1 }, line:{ color:C.accent3, width:1, dashType:"dash" }, objectName:"logos" });
T(s,"Логотипы «1+1 Бухдеск», «1+1» — заполнитель",{ x:7.1, y:5.7, w:5.5, h:0.9, fontSize:11, align:"center", valign:"middle", color:C.accent3 });

(async () => {
  await pres.writeFile({ fileName: "grant-buhdesk.pptx" });
  const { applyTheme } = require("/root/.claude/skills/synced/8fae7250-55ee-474e-974f-ff3bf312d260_bba663ed-9441-4c4f-b94e-1ca40f15c12e/pptx/scripts/apply_theme.js");
  await applyTheme("grant-buhdesk.pptx", THEME);
  console.log("готово: 16 слайдов");
})();
