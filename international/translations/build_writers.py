#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build writers.{lang}.json files."""
import json
import os

OUT = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(OUT, 'writers_source_zh.json'), encoding='utf-8') as f:
    ZH = json.load(f)

REGIONS = {
    'en': {'中国': 'China', '日本': 'Japan', '英美': 'Anglo-American', '法国': 'France', '德语': 'German', '俄语': 'Russian', '拉美': 'Latin America', '其他': 'Other'},
    'es': {'中国': 'China', '日本': 'Japón', '英美': 'Angloamericano', '法国': 'Francia', '德语': 'Alemania', '俄语': 'Rusia', '拉美': 'América Latina', '其他': 'Otros'},
    'fr': {'中国': 'Chine', '日本': 'Japon', '英美': 'Anglo-américain', '法国': 'France', '德语': 'Allemagne', '俄语': 'Russie', '拉美': 'Amérique latine', '其他': 'Autres'},
    'pt': {'中国': 'China', '日本': 'Japão', '英美': 'Anglo-americano', '法国': 'França', '德语': 'Alemanha', '俄语': 'Rússia', '拉美': 'América Latina', '其他': 'Outros'},
    'ja': {'中国': '中国', '日本': '日本', '英美': '英米', '法国': 'フランス', '德语': 'ドイツ', '俄语': 'ロシア', '拉美': 'ラテンアメリカ', '其他': 'その他'},
    'ru': {'中国': 'Китай', '日本': 'Япония', '英美': 'Англоязычный мир', '法国': 'Франция', '德语': 'Германия', '俄语': 'Россия', '拉美': 'Лatinская Америка', '其他': 'Другое'},
}

NAMES = json.load(open(os.path.join(OUT, 'data', 'writer_names.json'), encoding='utf-8'))
KINDS = json.load(open(os.path.join(OUT, 'data', 'writer_kinds.json'), encoding='utf-8'))
TEXTS = json.load(open(os.path.join(OUT, 'data', 'writer_texts.json'), encoding='utf-8'))

QUOTES = {
    'en': {
        'kongzi': '"Is it not a pleasure, when studying abroad, to apply what you have learned?"',
        'hemingway': '"A man can be destroyed but not defeated."',
        'kawabata': '"Beauty is in the eye of the beholder."',
        'murakami': '"When I close my eyes, the world becomes a different place."',
    },
}

def build(lang):
    out = {}
    for wid, zh in ZH.items():
        t = TEXTS[lang][wid]
        q = t.get('quote') or QUOTES.get(lang, {}).get(wid) or zh['quote']
        out[wid] = {
            'name': NAMES[lang][wid],
            'region': REGIONS[lang][zh['region']],
            'kind': KINDS[lang].get(zh['kind'], zh['kind']),
            'intro': t['intro'],
            'one': t['one'],
            'quote': q,
        }
    return out

if __name__ == '__main__':
    counts = {}
    for lang in ['en', 'es', 'fr', 'pt', 'ja', 'ru']:
        p = os.path.join(OUT, f'writers.{lang}.json')
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(build(lang), f, ensure_ascii=False, indent=2)
        counts[f'writers.{lang}.json'] = sum(1 for _ in open(p, encoding='utf-8'))
    print(json.dumps(counts, indent=2))
