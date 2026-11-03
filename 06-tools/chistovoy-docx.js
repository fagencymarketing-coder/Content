// Чистовой .docx статьи: настоящие таблицы, маркированные списки, заголовки.
// Служебное (пометки правок, источники, «Читать ещё», метаданные, подпись об ИИ) не выводится.
const d=require('docx'); const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,
       WidthType,ShadingType,BorderStyle,AlignmentType}=d;

const SLUZH=['ending','pre','note','ask','src','srclink','eyebrow'];
const SKIP_SECTIONS=['Содержание','Источники','Читать ещё','Что нужно от вас','Метаданные для размещения'];

const BODY='Times New Roman', HEAD='Times New Roman';
const clean=t=>String(t||'').replace(/\[\[([^|\]]*)\|[^\]]*\]\]/g,'$1').replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').trim();

const EMO=/[\u231A-\u23FF\u2600-\u27BF\uFE0F\u{1F300}-\u{1FAFF}]/u;
function runs(text,{size=22,bold=false,font=BODY}={}){
  // значок часов и прочие символы — шрифтом, в котором они есть
  if(EMO.test(text)){
    const out=[];
    for(const part of String(text).split(/([\u231A-\u23FF\u2600-\u27BF\uFE0F\u{1F300}-\u{1FAFF}]+)/u)){
      if(!part) continue;
      out.push(new TextRun({text:part,bold,size,font:EMO.test(part)?'Segoe UI Symbol':font}));
    }
    return out;
  }
  // **жирный** внутри абзаца
  // пустые куски не выбрасываются: от их позиции зависит, что станет жирным
  return String(text).split('**').map((part,i)=>
    new TextRun({text:part,bold:bold||i%2===1,size,font})).filter(r=>true);
}
const BRD={style:BorderStyle.SINGLE,size:4,color:'BFBFBF'};
function cell(text,{bold=false,w=3000,fill=null}={}){
  const o={width:{size:w,type:WidthType.DXA},
    margins:{top:60,bottom:60,left:120,right:120},
    children:String(text).split('\n').map(line=>
      new Paragraph({children:runs(line,{size:20,bold}),spacing:{after:0,line:260}}))};
  if(fill) o.shading={type:ShadingType.CLEAR,fill,color:'auto'};
  return new TableCell(o);
}

const blocks=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const body=[]; let skip=false;

for(const b of blocks){
  const cls=(b.cls||'').split(/\s+/);
  if(SLUZH.some(c=>cls.includes(c))) continue;

  if(b.type==='h1'){
    skip=false;
    body.push(new Paragraph({children:runs(clean(b.text),{size:34,bold:true,font:HEAD}),
      spacing:{after:260,line:280}}));
    continue;
  }
  if(b.type==='h2'||b.type==='h3'){
    const t=clean(b.text);
    if(SKIP_SECTIONS.includes(t)){ skip=true; continue; }
    if(t==='Призыв к действию'){ skip=false; continue; }   // текст остаётся, заголовок — нет
    skip=false;
    body.push(new Paragraph({children:runs(t,{size:b.type==='h2'?28:24,bold:true,font:HEAD}),
      spacing:{before:b.type==='h2'?320:240,after:140,line:280}}));
    continue;
  }
  if(skip) continue;

  if(b.type==='table'){
    const n=b.rows[0].length;
    const widths=n===2?[3400,6000]:n===3?[2600,3400,3400]:[2300,2900,2100,2100];
    body.push(new Table({columnWidths:widths,
      width:{size:widths.reduce((a,x)=>a+x,0),type:WidthType.DXA},
      borders:{top:BRD,bottom:BRD,left:BRD,right:BRD,insideHorizontal:BRD,insideVertical:BRD},
      rows:b.rows.map((r,i)=> new TableRow({
        children:r.map((t,j)=>cell(clean(t),{bold:i===0,w:widths[j],fill:i===0?'F2F2F2':null})),
        tableHeader:i===0}))}));
    body.push(new Paragraph({children:[new TextRun({text:'',size:12})],spacing:{after:160}}));
    continue;
  }
  const t=clean(b.text);
  if(!t) continue;
  if(b.type==='li'){
    body.push(new Paragraph({children:runs(t),bullet:{level:0},spacing:{after:80,line:300}}));
  } else {
    body.push(new Paragraph({children:runs(t),spacing:{after:160,line:300},
      alignment:AlignmentType.JUSTIFIED}));
  }
}

const doc=new Document({creator:'1+1',title:process.argv[4]||'Статья',
  styles:{default:{document:{run:{font:BODY,size:22}}}},
  sections:[{properties:{page:{margin:{top:1130,bottom:1130,left:1130,right:1130}}},children:body}]});
Packer.toBuffer(doc).then(buf=>{fs.writeFileSync(process.argv[3],buf);console.log('docx готов',buf.length);});
