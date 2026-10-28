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
 'п. 1 ч. 2 ст. 6 Федерального закона от 06.12.2011 № 402-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_122855/',
 'ст. 346.12 и ст. 346.13 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/',
 'подп. 16 п. 3 ст. 346.12 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/',
 'ст. 346.53 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/',
 'приказ ФНС России от 07.11.2023 № ЕА-7-3/816@':'https://www.garant.ru/products/ipo/prime/doc/408009869/',
 'ст. 145 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_517272/935811499d6ea5e9f52ef2da5ceec3d293fde589/',
 'п. 1 ст. 284 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/eb9180fc785448d58fe76ef323fb67d1832b9363/',
 'п. 1 и п. 1.15 ст. 284 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/eb9180fc785448d58fe76ef323fb67d1832b9363/',
 'ст. 284.1 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/9a27ebb827bedf71dea16049203f6645100acf44/',
 'ст. 287 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/17f089448303baae2053c544b5f1423572c91bda/',
 'п. 3 и п. 4 ст. 289 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/e1a5f8ba9742b3e8b843c3ee97e6f6a5bcdcd066/',
 'п. 3 ст. 164 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/35cc6698564adc4507baa31c9cfdbb4f2516d068/',
 'п. 1 ст. 224 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/3e4bbd6dd9fb5dd4e9394f447653506e1d6fa3a9/',
 'ст. 425 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/a3f603ffd57b1431ed51e1693ba710093347235d/',
 'ст. 427 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/c5c16c86f95c5db63601047b1c0a5942bd77c824/',
 'п. 2.4 и п. 13.3 ст. 427 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/c5c16c86f95c5db63601047b1c0a5942bd77c824/',
 'п. 2.2-2, п. 13.2 и п. 2.5 ст. 427 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/c5c16c86f95c5db63601047b1c0a5942bd77c824/',
 'подп. 10 п. 1, п. 2.2, п. 2.2-2, п. 2.4, п. 7, п. 9, п. 13.1 ст. 427 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/c5c16c86f95c5db63601047b1c0a5942bd77c824/',
 'п. 2.2-2 ст. 427 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/c5c16c86f95c5db63601047b1c0a5942bd77c824/',
 'постановление Правительства РФ от 31.10.2025 № 1705':'https://base.garant.ru/412984357/',
 'распоряжение Правительства РФ от 27.12.2025 № 4125-р':'https://www.consultant.ru/document/cons_doc_LAW_523172/6f2a657934602e36fb055b5d6ecb0e23ca727dba/',
 'распоряжения Правительства РФ от 27.12.2025 № 4125-р':'https://www.consultant.ru/document/cons_doc_LAW_523172/6f2a657934602e36fb055b5d6ecb0e23ca727dba/',
 'ст. 164 НК РФ':'https://www.consultant.ru/document/cons_doc_LAW_28165/35cc6698564adc4507baa31c9cfdbb4f2516d068/',
 'Федеральный закон от 07.08.2001 № 115-ФЗ':'https://www.consultant.ru/document/cons_doc_LAW_32834/',
}

def linkify(seg):
    # не трогаем участки, которые уже внутри <a>…</a>
    spans=[(m.start(),m.end()) for m in re.finditer(r'<a\b[^>]*>.*?</a>', seg, re.S)]
    def inside(i): return any(a<=i<b for a,b in spans)
    for txt in sorted(L, key=len, reverse=True):
        i=seg.find(txt)
        if i==-1 or inside(i): continue
        seg = seg[:i] + f'<a href="{L[txt]}">{txt}</a>' + seg[i+len(txt):]
        spans=[(m.start(),m.end()) for m in re.finditer(r'<a\b[^>]*>.*?</a>', seg, re.S)]
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
