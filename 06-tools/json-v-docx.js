const d=require('docx'); const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,Table,TableRow,TableCell,
       WidthType,ShadingType,BorderStyle,ExternalHyperlink}=d;

const C={keep:null,tz:'D9EAD3',fact:'FFF2CC',lang:'DEEAF6'};
const LBL={tz:'ДОБАВЛЕНО ПО ТЗ',fact:'ИСПРАВЛЕНО ПО ПЕРВОИСТОЧНИКУ',lang:'ПРАВКА ЯЗЫКА'};

function runs(text,{size=22,font='Times New Roman',color=null,italics=false}={}){
  const out=[];
  // сначала выделяем ссылки [[текст|адрес]], потом жирный **…**
  text.split(/(\[\[[^\]]*\]\])/).forEach(chunk=>{
    const m=chunk.match(/^\[\[(.*)\|(.*)\]\]$/);
    if(m){
      out.push(new ExternalHyperlink({
        children:[new TextRun({text:m[1],size,font,color:'0563C1',underline:{}})], link:m[2]}));
      return;
    }
    chunk.split('**').forEach((part,i)=>{
      if(part==='') return;
      out.push(new TextRun({text:part, bold:i%2===1, size, font, italics, ...(color?{color}:{})}));
    });
  });
  return out.length?out:[new TextRun({text:'',size,font})];
}
function shade(tag){ return C[tag] ? {shading:{type:ShadingType.CLEAR,fill:C[tag],color:'auto'}} : {}; }
function label(tag){
  return new Paragraph({children:[new TextRun({text:'▌'+LBL[tag],bold:true,size:16,font:'Arial',color:'444444'})],
    spacing:{before:160,after:40},...shade(tag)});
}
function cell(text,{bold=false,w=3000,fill=null}={}){
  const o={width:{size:w,type:WidthType.DXA},
    children:[new Paragraph({children:runs(text,{size:20}).map(r=>r),spacing:{after:40}})]};
  if(bold) o.children=[new Paragraph({children:[new TextRun({text:text.replace(/\*\*/g,''),bold:true,size:20,font:'Times New Roman'})],spacing:{after:40}})];
  if(fill) o.shading={type:ShadingType.CLEAR,fill,color:'auto'};
  return new TableCell(o);
}

const blocks=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const body=[]; let lastTag=null;

// легенда
body.push(new Paragraph({children:[new TextRun({text:'Как читать документ',bold:true,size:24,font:'Arial'})],spacing:{after:120}}));
[['Белый фон без пометки — текст исходной статьи, не менялся.',null],
 ['   Зелёный — добавлено по ТЗ, этого в статье не было.','D9EAD3'],
 ['   Жёлтый — исправлено по первоисточнику: факт устарел или был неверен. Под каждым таким местом указан документ.','FFF2CC'],
 ['   Голубой — правка языка: смысл прежний, формулировка приведена к голосу компании.','DEEAF6']].forEach(([t,f])=>{
  body.push(new Paragraph({children:[new TextRun({text:t,size:20,font:'Arial'})],spacing:{after:60},
    ...(f?{shading:{type:ShadingType.CLEAR,fill:f,color:'auto'}}:{})}));
});
body.push(new Paragraph({children:[new TextRun({text:'Серым курсивом с отступом — источник факта. В публикуемый текст эти строки не идут.',italics:true,size:20,font:'Arial',color:'666666'})],spacing:{after:260}}));
body.push(new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:6,color:'BBBBBB'}},spacing:{after:240}}));

for(const b of blocks){
  if(b.cls && b.cls.includes('eyebrow')) continue;
  if(b.type==='h1'){
    body.push(new Paragraph({children:[new TextRun({text:b.text,bold:true,size:32,font:'Arial'})],spacing:{after:200}}));
    lastTag=null; continue;
  }
  if(b.type==='h2'||b.type==='h3'){
    body.push(new Paragraph({children:[new TextRun({text:b.text,bold:true,size:b.type==='h2'?26:22,font:'Arial',color:b.type==='h2'?'1F3864':'23251F'})],
      spacing:{before:b.type==='h2'?300:200,after:120}}));
    lastTag=null; continue;
  }
  if(b.type==='table'){
    const n=b.rows[0].length; const widths=n===2?[4600,4400]:[2600,3200,3200];
    body.push(new Table({columnWidths:widths,width:{size:widths.reduce((a,x)=>a+x,0),type:WidthType.DXA},
      rows:b.rows.map((r,i)=> new TableRow({children:r.map((t,j)=>cell(t,{bold:i===0,w:widths[j],fill:i===0?'EFEFEF':C[b.tag]})),tableHeader:i===0}))}));
    body.push(new Paragraph({children:[new TextRun({text:'',size:12})],spacing:{after:100}}));
    continue;
  }
  const cls=(b.cls||'').split(/\s+/);
  if(cls.includes('srclink')){
    body.push(new Paragraph({children:runs(b.text,{size:18,font:'Arial',color:'666666'}),
      spacing:{after:240}})); lastTag=null; continue;
  }
  if(cls.includes('src')){
    body.push(new Paragraph({children:runs(b.text,{size:18,font:'Arial',color:'666666',italics:true}),
      spacing:{after:160},indent:{left:200}})); lastTag=null; continue;
  }
  if(cls.includes('ask')){
    body.push(new Paragraph({children:runs(b.text,{size:18,font:'Arial',color:'C00000',italics:true}),
      spacing:{after:160},indent:{left:200}})); lastTag=null; continue;
  }
  if(cls.includes('note')){
    body.push(new Paragraph({children:runs(b.text,{size:18,font:'Arial',color:'666666',italics:true}),
      spacing:{after:140},...shade(b.tag)})); continue;
  }
  if(b.tag!=='keep' && b.tag!==lastTag){ body.push(label(b.tag)); }
  lastTag=b.tag;
  if(b.type==='li'){
    body.push(new Paragraph({children:runs(b.text),bullet:{level:0},spacing:{after:80,line:300},...shade(b.tag)}));
  } else {
    body.push(new Paragraph({children:runs(b.text),spacing:{after:140,line:300},...shade(b.tag)}));
  }
}

const doc=new Document({creator:'1+1',title:process.argv[4]||'Доработка статьи',
  sections:[{properties:{page:{margin:{top:1000,bottom:1000,left:1100,right:1100}}},children:body}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(process.argv[3],b);console.log('written',b.length);});
