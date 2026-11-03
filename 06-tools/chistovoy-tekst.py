# Чистовой текст статьи: только текст, без служебных строк и без подписи об ИИ.
# Вход — чистовик (выход prinyat-pravki.py), выход — .txt, из которого собирается .docx.
import json,re,sys,io

src,dst=sys.argv[1],sys.argv[2]
b=json.load(io.open(src,encoding='utf-8'))

SLUZH={'ending','pre','note','ask','src','srclink','eyebrow'}

def clean(t):
    t=re.sub(r'\[\[([^|\]]*)\|[^\]]*\]\]', r'\1', t)   # ссылки — только текст
    t=t.replace('**','')                                # разметка жирного снимается
    t=re.sub(r'\s+',' ',t)
    return t.strip()

L=[]; A=L.append
skip_h2=None
for x in b:
    cls=set((x.get('cls') or '').split())
    if cls & SLUZH: continue
    typ=x.get('type')
    if typ=='table':
        if skip_h2: continue
        rows=[[clean(c.replace('\n','; ')) for c in r] for r in x['rows']]
        w=[max(len(r[i]) for r in rows) for i in range(len(rows[0]))]
        for n,r in enumerate(rows):
            A('  '.join(c.ljust(w[i]) for i,c in enumerate(r)).rstrip())
            if n==0: A('  '.join('-'*w[i] for i in range(len(r))))
        A('')
        continue
    t=clean(x.get('text',''))
    if not t: continue
    if typ in ('h1','h2','h3'):
        # служебные разделы в чистовой текст не идут
        if t in ('Содержание','Что нужно от вас','Метаданные для размещения','Источники','Читать ещё'):
            skip_h2=t; continue
        if t=='Призыв к действию':
            # сам призыв остаётся в статье, служебный заголовок — нет
            skip_h2=None; continue
        skip_h2=None
        A(''); A(t); A('')
        continue
    if skip_h2: continue
    A('• '+t if typ=='li' else t)
    if typ!='li': A('')

out=re.sub(r'\n{3,}','\n\n','\n'.join(L)).strip()+'\n'
io.open(dst,'w',encoding='utf-8').write(out)
print('готово:',dst,len(out.split('\n')),'строк')
