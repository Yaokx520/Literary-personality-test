#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate translation JSON files for literary personality test."""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.dirname(os.path.abspath(__file__))
DATA_SRC = os.path.join(ROOT, 'literary_data.js')
SOURCE_ZH = os.path.join(OUT, 'source_zh.json')

ABSURD = {
    'en': {
        '这也太奇怪了': 'That is too weird',
        '无从下手': 'No idea where to start',
        '我不道啊': 'I have no clue',
        '大脑一片空白': 'My mind goes blank',
        '题在说什么？': 'What is this asking?',
        '随便吧，都可以': 'Whatever, anything works',
        '先逃了再说': 'Escape first, think later',
        '我是来凑数的': "I'm just here for the ride",
    },
    'es': {
        '这也太奇怪了': 'Qué raro',
        '无从下手': 'Sin idea por dónde empezar',
        '我不道啊': 'Ni idea',
        '大脑一片空白': 'Mente en blanco',
        '题在说什么？': '¿De qué va esto?',
        '随便吧，都可以': 'Lo que sea, da igual',
        '先逃了再说': 'Huir primero, pensar después',
        '我是来凑数的': 'Solo vengo de relleno',
    },
    'fr': {
        '这也太奇怪了': 'Trop bizarre',
        '无从下手': 'Aucune idée par où commencer',
        '我不道啊': 'Aucune idée',
        '大脑一片空白': 'Esprit complètement vide',
        '题在说什么？': 'De quoi parle-t-on ?',
        '随便吧，都可以': 'Peu importe, n\'importe lequel',
        '先逃了再说': 'Fuir d\'abord, réfléchir après',
        '我是来凑数的': 'Je suis juste là pour faire nombre',
    },
    'pt': {
        '这也太奇怪了': 'Muito estranho',
        '无从下手': 'Sem ideia por onde começar',
        '我不道啊': 'Sei lá',
        '大脑一片空白': 'Mente completamente vazia',
        '题在说什么？': 'Do que se trata?',
        '随便吧，都可以': 'Tanto faz, qualquer um serve',
        '先逃了再说': 'Fugir primeiro, pensar depois',
        '我是来凑数的': 'Só estou aqui de enfeite',
    },
    'ja': {
        '这也太奇怪了': '変すぎる',
        '无从下手': 'どこから書けばいいかわからない',
        '我不道啊': 'わからない',
        '大脑一片空白': '頭が真っ白',
        '题在说什么？': '何の話？',
        '随便吧，都可以': 'どれでもいい',
        '先逃了再说': 'とりあえず逃げよう',
        '我是来凑数的': 'ノリで来ただけ',
    },
    'ru': {
        '这也太奇怪了': 'Слишком странно',
        '无从下手': 'Не знаю, с чего начать',
        '我不道啊': 'Без понятия',
        '大脑一片空白': 'В голове пустота',
        '题在说什么？': 'О чём это?',
        '随便吧，都可以': 'Любой вариант, всё равно',
        '先逃了再说': 'Сначала сбежать, потом думать',
        '我是来凑数的': 'Я просто за компанию',
    },
}

TYPE_TR = {
    'en': {
        '夜思': 'Night thoughts', '心绪': 'Mood', '人海': 'In the crowd', '读书记': 'Reading notes',
        '乡愁': 'Homesickness', '沉默': 'Silence', '笔端': 'At the pen', '隐忍': 'Restraint',
        '光线': 'Light', '季节': 'Seasons', '远讯': 'Distant news', '起笔': 'Opening lines',
        '话别': 'Farewell', '梦醒': 'Waking', '街角': 'Street corner', '荒唐': 'Absurdity',
        '取舍': 'Choice', '独处': 'Solitude', '表达': 'Expression', '语言偏好': 'Language taste',
        '协作': 'Collaboration', '午后': 'Afternoon', '驿道': 'Post road', '窗纸': 'Window paper',
        '茶烟': 'Tea steam', '归雁': 'Returning geese', '钟鸣': 'Temple bell', '月光': 'Moonlight',
        '心事': 'Secret heart', '岔题·书页': 'Detour · Pages', '岔题·偶遇': 'Detour · Encounter',
        '岔题·讯息': 'Detour · Message', '岔题·旧物': 'Detour · Keepsake', '终题': 'Final question',
    },
    'es': {
        '夜思': 'Pensamiento nocturno', '心绪': 'Estado de ánimo', '人海': 'Entre la multitud',
        '读书记': 'Notas de lectura', '乡愁': 'Nostalgia', '沉默': 'Silencio', '笔端': 'En la pluma',
        '隐忍': 'Contención', '光线': 'Luz', '季节': 'Estaciones', '远讯': 'Noticias lejanas',
        '起笔': 'Primer trazo', '话别': 'Despedida', '梦醒': 'Al despertar', '街角': 'Esquina',
        '荒唐': 'Lo absurdo', '取舍': 'Elección', '独处': 'Soledad', '表达': 'Expresión',
        '语言偏好': 'Gusto literario', '协作': 'Colaboración', '午后': 'Tarde vacía',
        '驿道': 'Camino antiguo', '窗纸': 'Papel en la ventana', '茶烟': 'Humo del té',
        '归雁': 'Gansos del sur', '钟鸣': 'Campana del templo', '月光': 'Claro de luna',
        '心事': 'Secretos del corazón', '岔题·书页': 'Desvío · Páginas', '岔题·偶遇': 'Desvío · Encuentro',
        '岔题·讯息': 'Desvío · Mensaje', '岔题·旧物': 'Desvío · Recuerdo', '终题': 'Pregunta final',
    },
    'fr': {
        '夜思': 'Pensée nocturne', '心绪': 'Humeur', '人海': 'Dans la foule', '读书记': 'Notes de lecture',
        '乡愁': 'Nostalgie', '沉默': 'Silence', '笔端': 'À la plume', '隐忍': 'Retenue',
        '光线': 'Lumière', '季节': 'Saisons', '远讯': 'Nouvelles lointaines', '起笔': 'Premier trait',
        '话别': 'Adieu', '梦醒': 'Au réveil', '街角': 'Coin de rue', '荒唐': 'L\'absurde',
        '取舍': 'Choix', '独处': 'Solitude', '表达': 'Expression', '语言偏好': 'Goût des mots',
        '协作': 'Collaboration', '午后': 'Après-midi', '驿道': 'Route ancienne', '窗纸': 'Papier de fenêtre',
        '茶烟': 'Fumée du thé', '归雁': 'Oies du sud', '钟鸣': 'Cloche du temple', '月光': 'Clair de lune',
        '心事': 'Secrets du cœur', '岔题·书页': 'Détour · Pages', '岔题·偶遇': 'Détour · Rencontre',
        '岔题·讯息': 'Détour · Message', '岔题·旧物': 'Détour · Souvenir', '终题': 'Question finale',
    },
    'pt': {
        '夜思': 'Pensamento noturno', '心绪': 'Estado de espírito', '人海': 'Na multidão',
        '读书记': 'Notas de leitura', '乡愁': 'Saudade', '沉默': 'Silêncio', '笔端': 'Na pena',
        '隐忍': 'Contenção', '光线': 'Luz', '季节': 'Estações', '远讯': 'Notícias distantes',
        '起笔': 'Primeiro traço', '话别': 'Despedida', '梦醒': 'Ao acordar', '街角': 'Esquina',
        '荒唐': 'O absurdo', '取舍': 'Escolha', '独处': 'Solidão', '表达': 'Expressão',
        '语言偏好': 'Gosto literário', '协作': 'Colaboração', '午后': 'Tarde vazia',
        '驿道': 'Estrada antiga', '窗纸': 'Papel na janela', '茶烟': 'Fumaça do chá',
        '归雁': 'Gansos do sul', '钟鸣': 'Sino do templo', '月光': 'Claro de lua',
        '心事': 'Segredos do coração', '岔题·书页': 'Desvio · Páginas', '岔题·偶遇': 'Desvio · Encontro',
        '岔题·讯息': 'Desvio · Mensagem', '岔题·旧物': 'Desvio · Lembrança', '终题': 'Pergunta final',
    },
    'ja': {
        '夜思': '夜の思い', '心绪': '心の様子', '人海': '人の海', '读书记': '読書記',
        '乡愁': '郷愁', '沉默': '沈黙', '笔端': '筆先', '隐忍': '忍び耐える',
        '光线': '光', '季节': '季節', '远讯': '遠い知らせ', '起笔': '起筆',
        '话别': '別れ', '梦醒': '目覚め', '街角': '街角', '荒唐': '荒唐',
        '取舍': '取捨', '独处': '独り', '表达': '表現', '语言偏好': '言葉の好み',
        '协作': '協働', '午后': '午後', '驿道': '駅道', '窗纸': '障子',
        '茶烟': '茶の煙', '归雁': '帰雁', '钟鸣': '鐘の音', '月光': '月光',
        '心事': '心事', '岔题·书页': '枝問 · 書頁', '岔题·偶遇': '枝問 · 偶遇',
        '岔题·讯息': '枝問 · 消息', '岔题·旧物': '枝問 · 旧物', '终题': '最終問',
    },
    'ru': {
        '夜思': 'Ночные мысли', '心绪': 'Настроение', '人海': 'В толпе', '读书记': 'Заметки о чтении',
        '乡愁': 'Тоска по дому', '沉默': 'Молчание', '笔端': 'У пера', '隐忍': 'Стойкость',
        '光线': 'Свет', '季节': 'Времена года', '远讯': 'Дальние вести', '起笔': 'Первые строки',
        '话别': 'Прощание', '梦醒': 'Пробуждение', '街角': 'Угол улицы', '荒唐': 'Абсурд',
        '取舍': 'Выбор', '独处': 'Уединение', '表达': 'Выражение', '语言偏好': 'Вкус к словам',
        '协作': 'Сотрудничество', '午后': 'После полудня', '驿道': 'Старая дорога', '窗纸': 'Оконная бумага',
        '茶烟': 'Чайный пар', '归雁': 'Летящие на юг гуси', '钟鸣': 'Храмовый колокол', '月光': 'Лунный свет',
        '心事': 'Тайны сердца', '岔题·书页': 'Отступление · Страницы', '岔题·偶遇': 'Отступление · Встреча',
        '岔题·讯息': 'Отступление · Сообщение', '岔题·旧物': 'Отступление · Старina', '终题': 'Финальный вопрос',
    },
}

# Per-question translations: q, opts (4 serious + absurd handled separately)
Q_TR = {
    'en': {
        'q01': {'q': 'When rain taps the window at night, you first think of—', 'opts': [
            'Letters never sent, and words left unsaid', 'An old road, a figure receding into distance',
            'How many people in the city are still awake', 'The rain itself, like a dialogue without end']},
        'q02': {'q': 'If you wrote half a sentence for this mood, it would stop at—', 'opts': [
            '"So that\'s how it is."', '"What a pity…"', '"Let it be."', '"Wait — that\'s not right."']},
        'q03': {'q': 'Walking into a crowd, you are more like—', 'opts': [
            'A cool observer taking notes', 'Someone easily moved or stung',
            'A polite, distant passerby', 'A storyteller arranging plots in secret']},
        'q04': {'q': 'When a good book is interrupted midway, you think—', 'opts': [
            'I need a quiet place to finish it', 'Stopping at the cliffhanger makes the aftertaste linger',
            'What is that character doing right now?', 'Mark this page — I\'ll come back']},
        'q05': {'q': 'The word "homesickness" first brings not a place, but—', 'opts': [
            'A tone you can never return to', 'Old objects, old sounds, old scents',
            'Your reckless, sincere younger self', 'Time itself rolling backward']},
        'q06': {'q': 'Which silence do you know best—', 'opts': [
            'Two people saying nothing, yet understanding', 'Those few seconds of clarity in a noisy room',
            'The long stretch after swallowing your words', 'Wanting to speak but finding no exact word']},
        'q07': {'q': 'When you write, the first thing to land is often—', 'opts': [
            'A question that refuses compromise', 'A concrete scene: window, lamp, rain',
            'A line of poetry without beginning or end', 'A strange yet captivating premise']},
        'q08': {'q': 'When hurt runs too deep to speak, you usually—', 'opts': [
            'Write it down, or turn it over in your mind', 'Pretend nothing happened and carry on',
            'Withdraw from people until the feeling sinks', 'Laugh suddenly to change the mood']},
        'q09': {'q': 'Which light relaxes you most easily—', 'opts': [
            'Dusk fading, the sky neither bright nor dark', 'First light through morning mist',
            'The warm circle of a desk lamp at night', 'Midday white, too blunt to hide in']},
        'q10': {'q': 'If you compared yourself to a season, you are closer to—', 'opts': [
            'Late spring: abundance already tinged with decay', 'Long summer: humid, endless, unwilling to leave',
            'Deep autumn: crisp, clear, slightly looking back', 'Late winter: cold, still, yet holding renewal']},
        'q11': {'q': 'Hearing of disaster far away, your first reaction is more like—', 'opts': [
            'Demanding the cause, refusing easy acceptance', 'A sinking heart that takes long to recover',
            'Silence first, piecing details together', 'Finding it absurd, yet unable to laugh it off']},
        'q12': {'q': 'A good story — where would you want it to begin—', 'opts': [
            'A small matter that mirrors an entire age', 'A chance meeting where mood precedes plot',
            'A riddle, or one irregular detail', 'The instant everyday life cracks open']},
        'q13': {'q': 'Saying goodbye to a friend, you often say or do—', 'opts': [
            'Say little, but look once more', 'Light words to cover the weight',
            'Suddenly mention something unrelated', 'Make "goodbye" sound like "until we meet again"']},
        'q14': {'q': 'Waking from a dream, what lingers on the pillow is often—', 'opts': [
            'An emotion you cannot name', 'A clear image, like an old photograph',
            'A line of dialogue from the dream, still remembered', 'Only blankness, yet feeling something lost']},
        'q15': {'q': 'At a street corner where the light is just right, you—', 'opts': [
            'Stop and watch the crowd and shadows', 'Think of someone old, unrelated to this moment',
            'Reach for your phone, fearing you cannot capture the mood', 'Feel this moment should not be disturbed']},
        'q16': {'q': 'Your first instinct about "the absurd" is—', 'opts': [
            'The normal state of things — no need to be shocked', 'Hollowness beneath a gorgeous surface',
            'A cold joke fate plays on us', 'Someone using absurdity as a fig leaf']},
        'q17': {'q': 'If you had to give up one thing, you would least let go of—', 'opts': [
            'The courage to tell the truth', 'Acute sensitivity to and attachment to beauty',
            'Bonds with a few chosen people', 'Room to think independently']},
        'q18': {'q': 'Alone, what you enjoy most is—', 'opts': [
            'Doing nothing, letting time pass', 'Reading, listening to wind, talking with yourself',
            'Putting the small days in order', 'Letting thoughts wander, noting stray ideas']},
        'q19': {'q': 'If you could keep only speaking or writing—', 'opts': [
            'Writing. Words spoken too easily distort', 'Speaking. Writing is too slow for the heartbeat',
            'Neither much — silence is more honest', 'Another way: drawing, walking, or simply watching']},
        'q20': {'q': 'Which kind of sentence moves you more easily?', 'opts': [
            'Direct, sharp, with a sting', 'Quiet, weighty, like a long take',
            'Cool, beautiful, with a little distance', 'Abstract, leaping, making you think']},
        'q21': {'q': 'In a team, you usually play the role of—', 'opts': [
            'The one who points out problems', 'The one who eases the mood',
            'The one who works quietly', 'The one who proposes odd ideas']},
        'q22': {'q': 'On an empty afternoon, you first notice—', 'opts': [
            'Sunlight moving slowly across the floor', 'Distant, faint city sounds',
            'Things you have not yet finished', 'Time suddenly slowing down']},
        'q23': {'q': 'An old locust tree beside the post road — you would—', 'opts': [
            'Rest beneath it, listening to the wind tell old tales', 'Fold a leaf into unfinished manuscript pages',
            'Remember a parting and stop for a long while', 'Keep walking without looking back']},
        'q24': {'q': 'Window paper stirred by wind, like an unread page. You—', 'opts': [
            'Reach out to hold it, afraid it will fly away', 'Let it rustle as background',
            'Open the window and let the wind in', 'Shut the window tight and light a lamp']},
        'q25': {'q': 'When tea steam rises, you think of—', 'opts': [
            'Old friends around the hearth, few words needed', 'Sitting alone, perfect for writing',
            'Life like tea — bitter first, sweet after', 'Tea grows cold, and people disperse']},
        'q26': {'q': 'Seeing geese fly south, what stirs in you—', 'opts': [
            'Thoughts of home, needing no words', 'The vast world, the small self',
            'Wanting to follow the geese and see far places', 'Breaking a reed to give a traveler']},
        'q27': {'q': 'An ancient temple bell — its echo in the valley. You—', 'opts': [
            'Listen with folded hands until the sound fades', 'Remember a line you never finished writing',
            'Turn and leave, not disturbing the quiet', 'Push open the gate and borrow a book']},
        'q28': {'q': 'Moonlight through paper window, like—', 'opts': [
            'A letter never sent, folded in your sleeve', 'Old years and old matters suddenly clear',
            'A small path leading to the unknown', 'Mercury spilled — brightness everywhere']},
        'q29': {'q': 'Wanting to tell someone your heart — in the end you—', 'opts': [
            'Write it into words and give it to the spring wind', 'Tell a confidant, in only a few lines',
            'Swallow it back into a long sigh', 'Tell the mountains and rivers — no answer needed']},
        'q30': {'q': 'Midway through a book, you suddenly don\'t want to read—', 'opts': [
            'Close it and return another day', 'Jump to the last page and peek at the ending',
            'Switch books — none will be finished anyway', 'Stare blankly at the title page']},
        'q31': {'q': 'In an elevator with someone you\'ve met once—', 'opts': [
            'Pretend to check your phone', 'Nod slightly, both silent',
            'Suddenly want to say something, then swallow it', 'Remember their name but act like a stranger']},
        'q32': {'q': 'Receiving a message with no context—', 'opts': [
            'Read it three times, guessing who sent it', 'Don\'t reply — wait for an explanation',
            'Reply with a question mark', 'Assume it was sent by mistake and swipe away']},
        'q33': {'q': 'An old ticket stub tucked in your notebook—', 'opts': [
            'Trace that day by the date', 'Tuck it back and keep writing something else',
            'Throw it away to avoid nostalgia', 'Photograph it, then forget']},
        'q34': {'q': 'If you could leave one line on the flyleaf, you choose—', 'opts': [
            '"There is true meaning here, but words fail once I try to grasp it."',
            '"People live for the sake of living itself."',
            '"Big Brother is watching you"',
            '"So it goes."']},
        'q35': {'q': 'Final question: how would you like to be misread—', 'opts': [
            'Finding warmth in silence', 'Finding edge in the gaps between words',
            'Finding craft in the structure', 'Finding new possibilities in misreading']},
        'q36': {'q': 'Final question: if literature is a window, you want it to—', 'opts': [
            'Show others and show yourself', 'Sway in the wind but never close',
            'Open just a crack — enough is enough', 'Push wide and let the rain in too']},
    },
}

# Load remaining languages from external data file if present
DATA_FILE = os.path.join(OUT, '_translation_data.json')

def extract_writers_zh():
    with open(DATA_SRC, encoding='utf-8') as f:
        src = f.read()
    writers = {}
    for m in re.finditer(
        r"\{id:'([^']+)',name:'([^']+)',region:'([^']+)',kind:'([^']+)',traits:\[[^\]]+\],quote:'((?:\\'|[^'])*)',intro:'((?:\\'|[^'])*)',one:'((?:\\'|[^'])*)'\}",
        src):
        wid, name, region, kind, quote, intro, one = m.groups()
        quote = quote.replace("\\'", "'")
        intro = intro.replace("\\'", "'")
        one = one.replace("\\'", "'")
        writers[wid] = {'name': name, 'region': region, 'kind': kind, 'intro': intro, 'one': one, 'quote': quote}
    return writers


def tr_opt(zh_opt, lang, source_opts):
    if zh_opt in ABSURD.get(lang, {}):
        return ABSURD[lang][zh_opt]
    idx = source_opts.index(zh_opt)
    return Q_TR[lang][qid]['opts'][idx]  # noqa - set by caller


def build_questions(lang, source):
    out = {}
    for qid, item in source.items():
        zh_type = item['type']
        zh_opts = item['opts']
        if lang == 'zh':
            out[qid] = item
            continue
        tr = Q_TR[lang][qid]
        opts = []
        for i, zo in enumerate(zh_opts):
            if zo in ABSURD[lang]:
                opts.append(ABSURD[lang][zo])
            else:
                opts.append(tr['opts'][i])
        out[qid] = {'q': tr['q'], 'type': TYPE_TR[lang].get(zh_type, zh_type), 'opts': opts}
    return out


if __name__ == '__main__':
    with open(SOURCE_ZH, encoding='utf-8') as f:
        source = json.load(f)
    writers_zh = extract_writers_zh()
    with open(os.path.join(OUT, 'writers_source_zh.json'), 'w', encoding='utf-8') as f:
        json.dump(writers_zh, f, ensure_ascii=False, indent=2)
    print('writers_source_zh.json', sum(1 for _ in open(os.path.join(OUT, 'writers_source_zh.json'), encoding='utf-8')))
