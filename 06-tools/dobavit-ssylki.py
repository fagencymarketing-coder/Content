import io,re,sys

L={
 'ст. 5 Федерального закона от 30.12.2008 № 307-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_83311/e10238792447500445e2f7cb3f3a6d0f37c74402/',
 'ст. 5 закона № 307-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_83311/e10238792447500445e2f7cb3f3a6d0f37c74402/',
 'ч. 2 и ч. 3 ст. 5 Федерального закона от 30.12.2008 № 307-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_83311/e10238792447500445e2f7cb3f3a6d0f37c74402/',
 'ч. 2 и ч. 3 ст. 5 закона № 307-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_83311/e10238792447500445e2f7cb3f3a6d0f37c74402/',
 'п. 4 ч. 1 ст. 5 закона № 307-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_83311/e10238792447500445e2f7cb3f3a6d0f37c74402/',
 'п. 3 ч. 1 ст. 5 и ч. 1.1 ст. 5 закона № 307-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_83311/e10238792447500445e2f7cb3f3a6d0f37c74402/',
 'ст. 5 Федерального закона от 30.12.2008 № 307-ФЗ «Об аудиторской деятельности»':'https://www.consultant.ru/document/cons_doc_LAW_83311/e10238792447500445e2f7cb3f3a6d0f37c74402/',
 'п. 4 ст. 89 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_19671/575046595bc7e01efd9a0a0d2f6c0ffb64442868/',
 'ст. 122 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_19671/1bab8cfd8c4da82e8af44f7ebcbfa1716bac9586/',
 'п. 4 ст. 122 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_19671/1bab8cfd8c4da82e8af44f7ebcbfa1716bac9586/',
 'п. 1, 2 ст. 346.20 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/3908f157150b10882cccfbb7f359866338098767/',
 'п. 1 и п. 2 ст. 346.20 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/3908f157150b10882cccfbb7f359866338098767/',
 'п. 4 ст. 346.20 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/3908f157150b10882cccfbb7f359866338098767/',
 'п. 3.1 ст. 346.20 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/3908f157150b10882cccfbb7f359866338098767/',
 'п. 2 ст. 346.21 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/22c21f60902851e312e9a7ebc582ba92ecea94a6/',
 'распоряжение Правительства РФ от 30.12.2025 № 4176-р':'https://www.garant.ru/products/ipo/prime/doc/413296330/',
 'Информация ФНС России от 05.05.2026':'https://base.garant.ru/414173177/',
 'приказу ФНС России от 30.05.2007 № ММ-3-06/333@':'https://www.consultant.ru/document/cons_doc_LAW_55729/2ff7a8c72de3994f30496a0ccbb1ddafdaddf518/',
 'приказ ФНС России от 30.05.2007 № ММ-3-06/333@':'https://www.consultant.ru/document/cons_doc_LAW_55729/2ff7a8c72de3994f30496a0ccbb1ddafdaddf518/',
 'приказу ФНС от 30.05.2007 № ММ-3-06/333@':'https://www.consultant.ru/document/cons_doc_LAW_55729/2ff7a8c72de3994f30496a0ccbb1ddafdaddf518/',
 'методические рекомендации Банка России от 21.07.2017 № 18-МР':'https://www.garant.ru/products/ipo/prime/doc/71629876/',
 'Федеральный закон от 28.11.2025 № 425-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_520020/',
 'Федерального закона от 28.11.2025 № 425-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_520020/',
 'ФЗ от 28.11.2025 № 425-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_520020/',
 'письмо ФНС России от 27.12.2024 № СД-4-3/14727@':'https://www.consultant.ru/document/cons_doc_LAW_500174/',
 'Федеральный закон от 07.08.2001 № 115-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_32834/',
}

def linkify(seg):
    for txt in sorted(L, key=len, reverse=True):
        if txt in seg and f'>{txt}<' not in seg and 'href' not in seg[max(0,seg.find(txt)-120):seg.find(txt)]:
            seg = seg.replace(txt, f'<a href="{L[txt]}">{txt}</a>', 1)
    return seg

p=sys.argv[1]
s=io.open(p,encoding='utf-8').read()

# 1) строки «Источник:»
def repl_src(m):
    return '<p class="src">'+linkify(m.group(1))+'</p>'
s=re.sub(r'<p class="src">(.*?)</p>', repl_src, s, flags=re.S)

# 2) таблица источников — вторая колонка
i=s.find('<h2>Источники</h2>')
if i!=-1:
    j=s.find('</table>', i)
    head, tab, tail = s[:i], s[i:j], s[j:]
    def repl_td(m):
        return '<td>'+linkify(m.group(1))+'</td>'
    tab=re.sub(r'<td>([^<]*(?:НК РФ|ФЗ|ММ-3-06|18-МР|4176-р|ФНС)[^<]*)</td>', repl_td, tab)
    s=head+tab+tail

io.open(p,'w',encoding='utf-8').write(s)
print(p, '→ ссылок:', s.count('consultant.ru')+s.count('garant.ru'))
