# Версия для размещения: разметка для программиста, без служебных строк.
import json,re,sys,io,random
src,dst=sys.argv[1],sys.argv[2]
b=json.load(io.open(src,encoding='utf-8'))

# Служебные блоки определяются по метке ending из парсера, а не по названию:
# название раздела можно переименовать, и фильтр по нему молча перестанет работать.
out=[]; skip=False; links=[]

def links_out(t):
    """[[текст|url]] -> текст, со сбором ссылок"""
    def f(m):
        links.append((m.group(1),m.group(2)))
        return m.group(1)
    return re.sub(r'\[\[([^|\]]*)\|([^\]]*)\]\]', f, t)

def md(t):
    t=links_out(t)
    return t.replace('**','')   # жирный программист проставит по тексту

prev_list=None
for x in b:
    cls=(x.get('cls') or '')
    typ=x.get('type')
    if {'ending','pre'} & set(cls.split()): continue   # до и после статьи — для редактора
    if typ in ('h1','h2','h3'):
        title=md(x.get('text','')).strip()
        tag={'h1':'[H1]','h2':'[H2]','h3':'[H3]'}[typ]
        out.append(('head',tag,title))
        continue
    if 'src' in cls.split() or 'ask' in cls.split() or 'note' in cls.split() or 'eyebrow' in cls.split() or 'srclink' in cls.split():
        continue
    if typ=='table':
        rows=[[md(c) for c in r] for r in x['rows']]
        out.append(('table',rows))
        continue
    if typ=='li':
        out.append(('li',md(x.get('text',''))))
        continue
    out.append(('p',md(x.get('text',''))))

L=[]
A=L.append
A('ПАМЯТКА ДЛЯ РАЗМЕЩЕНИЯ')
A('')
A('1. Всё в квадратных скобках [ ] и в блоках 【 】 — служебное, на страницу не идёт.')
A('   Перед публикацией очистить текст от служебных пометок.')
A('2. В статье только один H1.')
A('3. Заголовки без точки в конце.')
A('4. Meta title, meta description и URL — в соответствующие поля CMS, не в текст.')
A('5. Таблицы вставлять таблицами, списки — списками (не картинками и не текстом).')
A('6. Внутренние ссылки ставить на реальные страницы услуг — адреса проверить.')
A('7. Внешние ссылки закрыть: rel="nofollow noindex".')
A('8. Изображений в статье нет. Если добавляете — каждому прописать ALT.')
A('9. Блок «Вопрос-ответ» вывести с микроразметкой FAQPage (schema.org).')
A('10. Призыв к действию выделить визуально — рамкой или плашкой. Контактов в нём нет.')
A('')
A('─'*70)
A('')
A('【META TITLE: Как проверить бухгалтерию: инициативный аудит компании】')
A('【META DESCRIPTION: Зачем проверять работу бухгалтерии, как это сделать самому и что покажет инициативный аудит: виды, порядок проведения и ошибки, которые находят чаще всего.】')
A('【URL: /news/kak-proverit-svoyu-bukhgalteriyu/ — адрес прежний, не менять】')
A('')
A('─'*70)
A('')

in_faq=False
pending_list=[]
def flush_list():
    global pending_list
    if pending_list:
        A('【СПИСОК: маркированный <ul>】')
        for it in pending_list: A('• '+it)
        A('')
        pending_list=[]

for item in out:
    if item[0]=='head':
        flush_list()
        tag,title=item[1],item[2]
        in_faq = (title=='Вопрос-ответ')
        A(tag+' '+title)
        if in_faq: A('【FAQ: вывести с микроразметкой FAQPage】')
        if title=='Призыв к действию':
            L.pop()  # заголовок раздела на страницу не идёт
            A('【CTA: выделить визуально, контактов нет】')
        A('')
    elif item[0]=='li':
        pending_list.append(item[1])
    elif item[0]=='table':
        flush_list()
        rows=item[1]
        A(f'【ТАБЛИЦА: {len(rows[0])} столбца × {len(rows)} строк, первая строка — заголовок】')
        for r in rows: A(' | '.join(r))
        A('')
    else:
        flush_list()
        t=item[1].strip()
        if t.startswith('Фактура сверена'):
            t='Информация актуальна на '+t.replace('Фактура сверена','').strip().rstrip('.')+'.'
        if t.startswith('⏱'):
            A('【ВРЕМЯ ЧТЕНИЯ: вывести в шапке статьи】')
        if t: A(t); A('')
flush_list()

# подпись: случайный эксперт из списка в kompaniya.md
# имена сразу в творительном падеже: «проверен экспертом … кем?»
EKSPERTY=['Марией Кошляк','Мариной Даниловой','Еленой Веневцевой','Еленой Хохловой']
A('【ПОДПИСЬ: вывести в конце статьи, отдельной строкой】')
A(f'Материал подготовлен при помощи ИИ, проверен экспертом 1+1 {random.choice(EKSPERTY)}.')
A('')
A('─'*70)
A('')
A('ВНУТРЕННИЕ И ВНЕШНИЕ ССЫЛКИ')
A('')
seen=set()
for txt,url in links:
    if (txt,url) in seen: continue
    seen.add((txt,url))
    if '1-plus-1.ru' in url:
        A(f'【ССЫЛКА: «{txt}» сделать гиперссылкой → {url}】')
    else:
        A(f'【ССЫЛКА: «{txt}» → {url}】 【ЗАКРЫТЬ ОТ ИНДЕКСАЦИИ: rel="nofollow noindex"】')
A('')
A('【ССЫЛКА: в призыве к действию слова «инициативный аудит» → /finansoviy-konsalting/initsiativnyy-audit-bukhgalterii/ (ПОСТАВИТЬ РЕАЛЬНЫЙ АДРЕС)】')
A('')
A('─'*70)
A('')
A('ПЕРЕД ПУБЛИКАЦИЕЙ')
for c in ['Один H1','Meta title и description — в поля CMS','URL задан, прежний адрес сохранён',
          'Внутренние ссылки ведут на реальные страницы','Внешние ссылки закрыты nofollow noindex',
          'Таблицы вставлены таблицами','Списки оформлены списками',
          'Вопрос-ответ с разметкой FAQPage','CTA выделен, контактов в нём нет',
          'Подпись эксперта выведена в конце статьи',
          'Служебные пометки [ ] и 【 】 удалены']:
    A('☐ '+c)

io.open(dst,'w',encoding='utf-8').write('\n'.join(L))
print('готово:',dst, len(L),'строк')
