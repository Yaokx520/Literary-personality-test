#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_SRC = os.path.join(ROOT, 'literary_data.js')
OUT = os.path.dirname(os.path.abspath(__file__))

with open(DATA_SRC, encoding='utf-8') as f:
    src = f.read()

writers = {}
pat = re.compile(
    r"\{id:'([^']+)',name:'([^']+)',region:'([^']+)',kind:'([^']+)',"
    r"traits:\[[^\]]+\],quote:'((?:\\'|[^'])*)',intro:'((?:\\'|[^'])*)',one:'((?:\\'|[^'])*)'\}"
)
for m in pat.finditer(src):
    wid, name, region, kind, quote, intro, one = m.groups()
    writers[wid] = {
        'name': name,
        'region': region,
        'kind': kind,
        'intro': intro.replace("\\'", "'"),
        'one': one.replace("\\'", "'"),
        'quote': quote.replace("\\'", "'"),
    }

out_path = os.path.join(OUT, 'writers_source_zh.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(writers, f, ensure_ascii=False, indent=2)

print(f'writers_source_zh.json: {len(writers)} writers, {sum(1 for _ in open(out_path, encoding="utf-8"))} lines')
