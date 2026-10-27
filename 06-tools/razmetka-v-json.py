import sys, json, re
from html.parser import HTMLParser

class P(HTMLParser):
    def __init__(self):
        super().__init__()
        self.out=[]; self.stack=[]; self.cur=None; self.buf=''
        self.blktag='keep'; self.inwrap=False; self.skip=0
        self.table=None; self.row=None; self.incell=False
    def cls(self,attrs): return dict(attrs).get('class','')
    def handle_starttag(self,t,attrs):
        c=self.cls(attrs)
        if t=='div' and 'wrap' in c: self.inwrap=True; return
        if not self.inwrap: return
        if t=='div' and ('legend' in c or 'filters' in c): self.skip+=1; return
        if self.skip: 
            if t=='div': self.skip+=1
            return
        if t=='div' and 'blk' in c:
            for k in ('tz','fact','lang','keep'):
                if k in c.split(): self.blktag=k; break
            return
        if t=='div' and ('tbl' in c or 'ending' in c or 'meta-list' in c or 'doc' in c): return
        if t=='table': self.table=[]; return
        if t=='tr': self.row=[]; return
        if t in ('td','th'): self.incell=True; self.buf=''; return
        if t in ('h1','h2','h3','p','li'):
            self.cur={'type':t,'tag':self.blktag,'cls':c}; self.buf=''
        if t=='b' or t=='strong': self.buf+='**'
    def handle_endtag(self,t):
        if self.skip:
            if t=='div': self.skip-=1
            return
        if t=='b' or t=='strong': self.buf+='**'; return
        if t in ('td','th'):
            self.row.append(self.buf.strip()); self.incell=False; self.buf=''; return
        if t=='tr':
            if self.row: self.table.append(self.row)
            self.row=None; return
        if t=='table':
            self.out.append({'type':'table','tag':self.blktag,'rows':self.table}); self.table=None; return
        if t in ('h1','h2','h3','p','li') and self.cur:
            txt=re.sub(r'\s+',' ',self.buf).strip()
            if txt:
                self.cur['text']=txt; self.out.append(self.cur)
            self.cur=None; self.buf=''
    def handle_data(self,d):
        if self.skip or not self.inwrap: return
        if self.incell or self.cur is not None: self.buf+=d

src=open(sys.argv[1],encoding='utf-8').read()
body=src[src.index('<div class="wrap">'):]
p=P(); p.feed(body)
json.dump(p.out, open(sys.argv[2],'w',encoding='utf-8'), ensure_ascii=False, indent=0)
print('элементов:',len(p.out))
