#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate writers.{lang}.json from embedded translation tables."""
import json
import os

OUT = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(OUT, 'writers_source_zh.json'), encoding='utf-8') as f:
    ZH = json.load(f)

IDS = list(ZH.keys())

REGIONS = {
    'en': {'中国': 'China', '日本': 'Japan', '英美': 'Anglo-American', '法国': 'France', '德语': 'German', '俄语': 'Russian', '拉美': 'Latin America', '其他': 'Other'},
    'es': {'中国': 'China', '日本': 'Japón', '英美': 'Angloamericano', '法国': 'Francia', '德语': 'Alemania', '俄语': 'Rusia', '拉美': 'América Latina', '其他': 'Otros'},
    'fr': {'中国': 'Chine', '日本': 'Japon', '英美': 'Anglo-américain', '法国': 'France', '德语': 'Allemagne', '俄语': 'Russie', '拉美': 'Amérique latine', '其他': 'Autres'},
    'pt': {'中国': 'China', '日本': 'Japão', '英美': 'Anglo-americano', '法国': 'França', '德语': 'Alemanha', '俄语': 'Rússia', '拉美': 'América Latina', '其他': 'Outros'},
    'ja': {'中国': '中国', '日本': '日本', '英美': '英米', '法国': 'フランス', '德语': 'ドイツ', '俄语': 'ロシア', '拉美': 'ラテンアメリカ', '其他': 'その他'},
    'ru': {'中国': 'Китай', '日本': 'Япония', '英美': 'Англоязычный мир', '法国': 'Франция', '德语': 'Германия', '俄语': 'Россия', '拉美': 'Лatinская Америка', '其他': 'Другое'},
}

NAMES = {
    'en': {
        'kongzi': 'Confucius', 'zhuangzi': 'Zhuangzi', 'quyuan': 'Qu Yuan', 'libai': 'Li Bai', 'dufu': 'Du Fu',
        'sushi': 'Su Shi', 'caoxueqin': 'Cao Xueqin', 'luxun': 'Lu Xun', 'shencongwen': 'Shen Congwen', 'laoshe': 'Lao She',
        'zhangailing': 'Eileen Chang', 'yuhua': 'Yu Hua', 'murasaki': 'Murasaki Shikibu', 'natsume': 'Natsume Soseki',
        'kawabata': 'Yasunari Kawabata', 'mishima': 'Yukio Mishima', 'oe': 'Kenzaburo Oe', 'murakami': 'Haruki Murakami',
        'shakespeare': 'William Shakespeare', 'austen': 'Jane Austen', 'dickens': 'Charles Dickens', 'woolf': 'Virginia Woolf',
        'orwell': 'George Orwell', 'poe': 'Edgar Allan Poe', 'whitman': 'Walt Whitman', 'hemingway': 'Ernest Hemingway',
        'fitzgerald': 'F. Scott Fitzgerald', 'faulkner': 'William Faulkner', 'salinger': 'J. D. Salinger', 'vonnegut': 'Kurt Vonnegut',
        'morrison': 'Toni Morrison', 'mccarthy': 'Cormac McCarthy', 'rousseau': 'Jean-Jacques Rousseau', 'balzac': 'Honoré de Balzac',
        'hugo': 'Victor Hugo', 'baudelaire': 'Charles Baudelaire', 'proust': 'Marcel Proust', 'camus': 'Albert Camus',
        'goethe': 'Johann Wolfgang von Goethe', 'heine': 'Heinrich Heine', 'kafka': 'Franz Kafka', 'mann': 'Thomas Mann',
        'hesse': 'Hermann Hesse', 'rilke': 'Rainer Maria Rilke', 'pushkin': 'Alexander Pushkin', 'dostoevsky': 'Fyodor Dostoevsky',
        'tolstoy': 'Leo Tolstoy', 'chekhov': 'Anton Chekhov', 'bulgakov': 'Mikhail Bulgakov', 'solzhenitsyn': 'Aleksandr Solzhenitsyn',
        'borges': 'Jorge Luis Borges', 'neruda': 'Pablo Neruda', 'marquez': 'Gabriel García Márquez', 'vargasllosa': 'Mario Vargas Llosa',
        'paz': 'Octavio Paz', 'bolano': 'Roberto Bolaño', 'kundera': 'Milan Kundera', 'calvino': 'Italo Calvino',
        'pamuk': 'Orhan Pamuk', 'ibsen': 'Henrik Ibsen', 'andersen': 'Hans Christian Andersen', 'saramago': 'José Saramago',
        'tagore': 'Rabindranath Tagore', 'naipaul': 'V. S. Naipaul', 'achebe': 'Chinua Achebe', 'gibran': 'Kahlil Gibran',
    },
    'es': {
        'kongzi': 'Confucio', 'zhuangzi': 'Zhuangzi', 'quyuan': 'Qu Yuan', 'libai': 'Li Bai', 'dufu': 'Du Fu',
        'sushi': 'Su Shi', 'caoxueqin': 'Cao Xueqin', 'luxun': 'Lu Xun', 'shencongwen': 'Shen Congwen', 'laoshe': 'Lao She',
        'zhangailing': 'Eileen Chang', 'yuhua': 'Yu Hua', 'murasaki': 'Murasaki Shikibu', 'natsume': 'Natsume Soseki',
        'kawabata': 'Yasunari Kawabata', 'mishima': 'Yukio Mishima', 'oe': 'Kenzaburo Oe', 'murakami': 'Haruki Murakami',
        'shakespeare': 'William Shakespeare', 'austen': 'Jane Austen', 'dickens': 'Charles Dickens', 'woolf': 'Virginia Woolf',
        'orwell': 'George Orwell', 'poe': 'Edgar Allan Poe', 'whitman': 'Walt Whitman', 'hemingway': 'Ernest Hemingway',
        'fitzgerald': 'F. Scott Fitzgerald', 'faulkner': 'William Faulkner', 'salinger': 'J. D. Salinger', 'vonnegut': 'Kurt Vonnegut',
        'morrison': 'Toni Morrison', 'mccarthy': 'Cormac McCarthy', 'rousseau': 'Jean-Jacques Rousseau', 'balzac': 'Honoré de Balzac',
        'hugo': 'Víctor Hugo', 'baudelaire': 'Charles Baudelaire', 'proust': 'Marcel Proust', 'camus': 'Albert Camus',
        'goethe': 'Johann Wolfgang von Goethe', 'heine': 'Heinrich Heine', 'kafka': 'Franz Kafka', 'mann': 'Thomas Mann',
        'hesse': 'Hermann Hesse', 'rilke': 'Rainer Maria Rilke', 'pushkin': 'Aleksandr Pushkin', 'dostoevsky': 'Fiódor Dostoyevski',
        'tolstoy': 'León Tolstói', 'chekhov': 'Antón Chejov', 'bulgakov': 'Mijaíl Bulgákov', 'solzhenitsyn': 'Aleksandr Solzhenitsyn',
        'borges': 'Jorge Luis Borges', 'neruda': 'Pablo Neruda', 'marquez': 'Gabriel García Márquez', 'vargasllosa': 'Mario Vargas Llosa',
        'paz': 'Octavio Paz', 'bolano': 'Roberto Bolaño', 'kundera': 'Milan Kundera', 'calvino': 'Italo Calvino',
        'pamuk': 'Orhan Pamuk', 'ibsen': 'Henrik Ibsen', 'andersen': 'Hans Christian Andersen', 'saramago': 'José Saramago',
        'tagore': 'Rabindranath Tagore', 'naipaul': 'V. S. Naipaul', 'achebe': 'Chinua Achebe', 'gibran': 'Kahlil Gibran',
    },
    'fr': {
        'kongzi': 'Confucius', 'zhuangzi': 'Zhuangzi', 'quyuan': 'Qu Yuan', 'libai': 'Li Bai', 'dufu': 'Du Fu',
        'sushi': 'Su Shi', 'caoxueqin': 'Cao Xueqin', 'luxun': 'Lu Xun', 'shencongwen': 'Shen Congwen', 'laoshe': 'Lao She',
        'zhangailing': 'Eileen Chang', 'yuhua': 'Yu Hua', 'murasaki': 'Murasaki Shikibu', 'natsume': 'Natsume Soseki',
        'kawabata': 'Yasunari Kawabata', 'mishima': 'Yukio Mishima', 'oe': 'Kenzaburo Oe', 'murakami': 'Haruki Murakami',
        'shakespeare': 'William Shakespeare', 'austen': 'Jane Austen', 'dickens': 'Charles Dickens', 'woolf': 'Virginia Woolf',
        'orwell': 'George Orwell', 'poe': 'Edgar Allan Poe', 'whitman': 'Walt Whitman', 'hemingway': 'Ernest Hemingway',
        'fitzgerald': 'F. Scott Fitzgerald', 'faulkner': 'William Faulkner', 'salinger': 'J. D. Salinger', 'vonnegut': 'Kurt Vonnegut',
        'morrison': 'Toni Morrison', 'mccarthy': 'Cormac McCarthy', 'rousseau': 'Jean-Jacques Rousseau', 'balzac': 'Honoré de Balzac',
        'hugo': 'Victor Hugo', 'baudelaire': 'Charles Baudelaire', 'proust': 'Marcel Proust', 'camus': 'Albert Camus',
        'goethe': 'Johann Wolfgang von Goethe', 'heine': 'Heinrich Heine', 'kafka': 'Franz Kafka', 'mann': 'Thomas Mann',
        'hesse': 'Hermann Hesse', 'rilke': 'Rainer Maria Rilke', 'pushkin': 'Alexandre Pouchkine', 'dostoevsky': 'Fiodor Dostoïevski',
        'tolstoy': 'Léon Tolstoï', 'chekhov': 'Anton Tchekhov', 'bulgakov': 'Mikhail Boulgakov', 'solzhenitsyn': 'Alexandre Soljenitsyne',
        'borges': 'Jorge Luis Borges', 'neruda': 'Pablo Neruda', 'marquez': 'Gabriel García Márquez', 'vargasllosa': 'Mario Vargas Llosa',
        'paz': 'Octavio Paz', 'bolano': 'Roberto Bolaño', 'kundera': 'Milan Kundera', 'calvino': 'Italo Calvino',
        'pamuk': 'Orhan Pamuk', 'ibsen': 'Henrik Ibsen', 'andersen': 'Hans Christian Andersen', 'saramago': 'José Saramago',
        'tagore': 'Rabindranath Tagore', 'naipaul': 'V. S. Naipaul', 'achebe': 'Chinua Achebe', 'gibran': 'Kahlil Gibran',
    },
    'pt': {
        'kongzi': 'Confúcio', 'zhuangzi': 'Zhuangzi', 'quyuan': 'Qu Yuan', 'libai': 'Li Bai', 'dufu': 'Du Fu',
        'sushi': 'Su Shi', 'caoxueqin': 'Cao Xueqin', 'luxun': 'Lu Xun', 'shencongwen': 'Shen Congwen', 'laoshe': 'Lao She',
        'zhangailing': 'Eileen Chang', 'yuhua': 'Yu Hua', 'murasaki': 'Murasaki Shikibu', 'natsume': 'Natsume Soseki',
        'kawabata': 'Yasunari Kawabata', 'mishima': 'Yukio Mishima', 'oe': 'Kenzaburo Oe', 'murakami': 'Haruki Murakami',
        'shakespeare': 'William Shakespeare', 'austen': 'Jane Austen', 'dickens': 'Charles Dickens', 'woolf': 'Virginia Woolf',
        'orwell': 'George Orwell', 'poe': 'Edgar Allan Poe', 'whitman': 'Walt Whitman', 'hemingway': 'Ernest Hemingway',
        'fitzgerald': 'F. Scott Fitzgerald', 'faulkner': 'William Faulkner', 'salinger': 'J. D. Salinger', 'vonnegut': 'Kurt Vonnegut',
        'morrison': 'Toni Morrison', 'mccarthy': 'Cormac McCarthy', 'rousseau': 'Jean-Jacques Rousseau', 'balzac': 'Honoré de Balzac',
        'hugo': 'Victor Hugo', 'baudelaire': 'Charles Baudelaire', 'proust': 'Marcel Proust', 'camus': 'Albert Camus',
        'goethe': 'Johann Wolfgang von Goethe', 'heine': 'Heinrich Heine', 'kafka': 'Franz Kafka', 'mann': 'Thomas Mann',
        'hesse': 'Hermann Hesse', 'rilke': 'Rainer Maria Rilke', 'pushkin': 'Alexandre Pushkin', 'dostoevsky': 'Fiódor Dostoiévski',
        'tolstoy': 'Leão Tolstói', 'chekhov': 'Antón Tchekhov', 'bulgakov': 'Mikhail Bulgakov', 'solzhenitsyn': 'Aleksandr Soljenitsyn',
        'borges': 'Jorge Luis Borges', 'neruda': 'Pablo Neruda', 'marquez': 'Gabriel García Márquez', 'vargasllosa': 'Mario Vargas Llosa',
        'paz': 'Octavio Paz', 'bolano': 'Roberto Bolaño', 'kundera': 'Milan Kundera', 'calvino': 'Italo Calvino',
        'pamuk': 'Orhan Pamuk', 'ibsen': 'Henrik Ibsen', 'andersen': 'Hans Christian Andersen', 'saramago': 'José Saramago',
        'tagore': 'Rabindranath Tagore', 'naipaul': 'V. S. Naipaul', 'achebe': 'Chinua Achebe', 'gibran': 'Kahlil Gibran',
    },
    'ja': {
        'kongzi': '孔子', 'zhuangzi': '荘子', 'quyuan': '屈原', 'libai': '李白', 'dufu': '杜甫', 'sushi': '蘇軾',
        'caoxueqin': '曹雪芹', 'luxun': '魯迅', 'shencongwen': '沈従文', 'laoshe': '老捨', 'zhangailing': '張愛玲', 'yuhua': '余華',
        'murasaki': '紫式部', 'natsume': '夏目漱石', 'kawabata': '川端康成', 'mishima': '三島由紀夫', 'oe': '大江健三郎', 'murakami': '村上春樹',
        'shakespeare': 'シェイクスピア', 'austen': 'ジェーン・オースティン', 'dickens': 'チャールズ・ディケンズ', 'woolf': 'ヴァージニア・ウルフ',
        'orwell': 'ジョージ・オーウェル', 'poe': 'エドガー・アラン・ポー', 'whitman': 'ウォルト・ホイットマン', 'hemingway': 'アーネスト・ヘミングウェイ',
        'fitzgerald': 'F・スコット・フィッツジェラルド', 'faulkner': 'ウィリアム・フォークナー', 'salinger': 'J・D・サリンジャー', 'vonnegut': 'カート・ヴォネガット',
        'morrison': 'トニ・モリスン', 'mccarthy': 'コーマック・マッカーシー', 'rousseau': 'ルソー', 'balzac': 'バルザック',
        'hugo': 'ヴィクトル・ユーゴー', 'baudelaire': 'ボードレール', 'proust': 'マルセル・プルースト', 'camus': 'アルベール・カミュ',
        'goethe': 'ゲーテ', 'heine': 'ハイネ', 'kafka': 'カフカ', 'mann': 'トーマス・マン', 'hesse': 'ヘッセ', 'rilke': 'リルケ',
        'pushkin': 'プーシキン', 'dostoevsky': 'ドストエフスキー', 'tolstoy': 'トルストイ', 'chekhov': 'チェーホフ', 'bulgakov': 'ブルガーコフ', 'solzhenitsyn': 'ソルジェニーツィン',
        'borges': 'ボルヘス', 'neruda': 'ネルーダ', 'marquez': 'ガルシア＝マルケス', 'vargasllosa': 'バルガス・リョサ', 'paz': 'パス', 'bolano': 'ボラーニョ',
        'kundera': 'クンデラ', 'calvino': 'カルヴィーノ', 'pamuk': 'パムク', 'ibsen': 'イプセン', 'andersen': 'アンデルセン', 'saramago': 'サラマーゴ',
        'tagore': 'タゴール', 'naipaul': 'ナイポール', 'achebe': 'アチェベ', 'gibran': 'ジブラン',
    },
    'ru': {
        'kongzi': 'Конфуций', 'zhuangzi': 'Чжuang-цзы', 'quyuan': 'Цюй Юань', 'libai': 'Ли Бо', 'dufu': 'Ду Фу', 'sushi': 'Су Shi',
        'caoxueqin': 'Цao Сюэцинь', 'luxun': 'Лу Синь', 'shencongwen': 'Шэнь Цунвэнь', 'laoshe': 'Лao Шэ', 'zhangailing': 'Чжан Айлин', 'yuhua': 'Юй Hua',
        'murasaki': 'Мurasaki Sikibu', 'natsume': 'Нatsume Soseki', 'kawabata': 'Яsunari Kavabata', 'mishima': 'Yukio Misima', 'oe': 'Кenzaburo Oe', 'murakami': 'Хaruki Murakami',
        'shakespeare': 'Уильям Шекспир', 'austen': 'Джейн Остин', 'dickens': 'Чарльз Диккенс', 'woolf': 'Вирджиния Вулф',
        'orwell': 'Джордж Оруэлл', 'poe': 'Эдгар Аллан По', 'whitman': 'Уолт Уитмен', 'hemingway': 'Эрнест Хемингуэй',
        'fitzgerald': 'Ф. Скott Фицджеральд', 'faulkner': 'Уильям Фолкнер', 'salinger': 'Дж. Д. Сalinger', 'vonnegut': 'Kurt Vonnegut',
        'morrison': 'Toni Morrison', 'mccarthy': 'Cormac McCarthy', 'rousseau': 'Жан-Жак Рousseau', 'balzac': 'Honoré de Balzac',
        'hugo': 'Victor Hugo', 'baudelaire': 'Charles Baudelaire', 'proust': 'Marcel Proust', 'camus': 'Albert Camus',
        'goethe': 'Johann Wolfgang von Goethe', 'heine': 'Heinrich Heine', 'kafka': 'Franz Kafka', 'mann': 'Thomas Mann',
        'hesse': 'Hermann Hesse', 'rilke': 'Rainer Maria Rilke', 'pushkin': 'Alexander Pushkin', 'dostoevsky': 'Fyodor Dostoevsky',
        'tolstoy': 'Leo Tolstoy', 'chekhov': 'Anton Chekhov', 'bulgakov': 'Mikhail Bulgakov', 'solzhenitsyn': 'Aleksandr Solzhenitsyn',
        'borges': 'Jorge Luis Borges', 'neruda': 'Pablo Neruda', 'marquez': 'Gabriel García Márquez', 'vargasllosa': 'Mario Vargas Llosa',
        'paz': 'Octavio Paz', 'bolano': 'Roberto Bolaño', 'kundera': 'Milan Kundera', 'calvino': 'Italo Calvino',
        'pamuk': 'Orhan Pamuk', 'ibsen': 'Henrik Ibsen', 'andersen': 'Hans Christian Andersen', 'saramago': 'José Saramago',
        'tagore': 'Rabindranath Tagore', 'naipaul': 'V. S. Naipaul', 'achebe': 'Chinua Achebe', 'gibran': 'Kahlil Gibran',
    },
}

KINDS = {
    'en': {
        '儒家哲思派': 'Confucian philosophy', '逍遥哲思派': 'Free-spirited philosophy', '浪漫忧思派': 'Romantic melancholy',
        '豪放浪漫派': 'Bold romanticism', '沉郁家国派': 'Somber patriotism', '旷达文人派': 'Unconstrained literati',
        '世情洞察派': 'Social insight', '锋利现实派': 'Sharp realism', '田园抒情派': 'Pastoral lyricism', '京味写实派': 'Beijing realism',
        '精致疏离派': 'Refined detachment', '冷幽默生存派': 'Gallows humor survival', '细腻物语派': 'Delicate monogatari',
        '近代自省派': 'Modern introspection', '物哀美学派': 'Mono no aware aesthetics', '唯美激烈派': 'Aesthetic intensity',
        '人道反核派': 'Humanist anti-nuclear', '都市孤独派': 'Urban solitude', '戏剧全景派': 'Dramatic panorama',
        '世情讽刺派': 'Social satire', '社会温情派': 'Social warmth', '意识流派': 'Stream of consciousness',
        '政治寓言派': 'Political allegory', '哥特悬疑派': 'Gothic suspense', '自由颂歌派': 'Free verse ode',
        '硬汉极简派': 'Hard-boiled minimalism', '爵士幻灭派': 'Jazz-age disillusion', '南方史诗派': 'Southern epic',
        '青春疏离派': 'Youthful alienation', '黑色幽默派': 'Black humor', '黑人史诗派': 'Black epic',
        '末世冷峻派': 'Apocalyptic austerity', '启蒙情感派': 'Enlightenment sentiment', '现实主义派': 'Realism',
        '浪漫人道派': 'Romantic humanism', '都市象征派': 'Urban symbolism', '记忆意识派': 'Memory & consciousness',
        '荒诞反抗派': 'Absurdist rebellion', '古典全才派': 'Classical polymath', '讽刺抒情派': 'Satirical lyricism',
        '荒诞焦虑派': 'Absurdist anxiety', '启蒙小说派': 'Enlightenment novel', '精神追寻派': 'Spiritual quest',
        '纯诗沉思派': 'Pure poetry meditation', '民族抒情派': 'National lyricism', '灵魂拷问派': 'Soul interrogation',
        '史诗道德派': 'Epic morality', '淡淡忧伤派': 'Quiet melancholy', '魔幻讽刺派': 'Magical satire',
        '良知见证派': 'Conscience witness', '概念迷宫派': 'Conceptual labyrinth', '爱情革命派': 'Love & revolution',
        '魔幻现实派': 'Magical realism', '结构叙事派': 'Structural narrative', '诗性哲思派': 'Poetic philosophy',
        '流亡漫游派': 'Exile wanderer', '轻与重派': 'Lightness & weight', '结构童话派': 'Structural fable',
        '文明交错派': 'Civilizational crossroads', '社会问题派': 'Social problem drama', '童话寓言派': 'Fairy-tale allegory',
        '寓言叙述派': 'Allegorical narrative', '灵性抒情派': 'Spiritual lyricism', '后殖民观察派': 'Postcolonial observer',
        '非洲叙事派': 'African narrative', '哲理诗语派': 'Philosophical poetry',
    },
}

# Load text translations from external JSON
TEXT_FILE = os.path.join(OUT, 'writer_texts.json')

def build(lang):
    texts = json.load(open(TEXT_FILE, encoding='utf-8'))[lang]
    kinds = KINDS.get(lang, KINDS['en'])
    out = {}
    for wid in IDS:
        zh = ZH[wid]
        t = texts[wid]
        out[wid] = {
            'name': NAMES[lang][wid],
            'region': REGIONS[lang][zh['region']],
            'kind': t.get('kind') or kinds.get(zh['kind'], zh['kind']),
            'intro': t['intro'],
            'one': t['one'],
            'quote': t.get('quote', zh['quote']),
        }
    return out

if __name__ == '__main__':
    for lang in ['en', 'es', 'fr', 'pt', 'ja', 'ru']:
        path = os.path.join(OUT, f'writers.{lang}.json')
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(build(lang), f, ensure_ascii=False, indent=2)
        print(f'writers.{lang}.json: {sum(1 for _ in open(path, encoding="utf-8"))} lines')
