const d=require('docx'); const fs=require('fs');
const {Document,Packer,Paragraph,TextRun}=d;
const lines=fs.readFileSync(process.argv[2],'utf8').split('\n');
const kids=lines.map(l=>{
  const mono=/^[☐•]|^\d+\./.test(l.trim());
  const serv=/^[\[【]/.test(l.trim()) || /^(ПАМЯТКА|ПЕРЕД ПУБЛИКАЦИЕЙ|ВНУТРЕННИЕ|─)/.test(l.trim());
  const head=/^\[H[123]\]/.test(l.trim());
  return new Paragraph({children:[new TextRun({
    text:l, size: head?26:20, bold: head,
    font: serv?'Consolas':'Times New Roman',
    color: serv?'806000':'000000'})], spacing:{after: l.trim()?60:40}});
});
const doc=new Document({creator:'1+1',title:'Для размещения',
  sections:[{properties:{page:{margin:{top:900,bottom:900,left:1000,right:1000}}},children:kids}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(process.argv[3],b);console.log('docx готов',b.length);});
