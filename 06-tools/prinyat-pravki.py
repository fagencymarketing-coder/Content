# Принимает все правки: {{DEL:…}} убирает, {{INS@метка:…}} оставляет только текст.
import json,re,sys,io
src,dst=sys.argv[1],sys.argv[2]
b=json.load(io.open(src,encoding='utf-8'))
def clean(t):
    t=re.sub(r'\{\{DEL:[\s\S]*?\}\}','',t)
    t=re.sub(r'\{\{INS(?:@[^:]*)?:([\s\S]*?)\}\}',r'\1',t)
    return re.sub(r'\s{2,}',' ',t).strip()
out=[]
for x in b:
    if x.get('type')=='table':
        x['rows']=[[clean(c) for c in r] for r in x['rows']]
    elif 'text' in x:
        x['text']=clean(x['text'])
        if not x['text']: continue
    out.append(x)
json.dump(out,io.open(dst,'w',encoding='utf-8'),ensure_ascii=False,indent=0)
print('чистовик:',len(out),'элементов')
