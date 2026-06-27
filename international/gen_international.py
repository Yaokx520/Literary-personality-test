#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate international literary personality test packs."""
import json
import os
import re
import shutil
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'packs')
INTL = os.path.dirname(os.path.abspath(__file__))
CSS_SRC = os.path.join(ROOT, 'index.html')

LANGS = {
    'en': {'name': 'English', 'html_lang': 'en', 'dir': 'ltr'},
    'es': {'name': 'Español', 'html_lang': 'es', 'dir': 'ltr'},
    'fr': {'name': 'Français', 'html_lang': 'fr', 'dir': 'ltr'},
    'pt': {'name': 'Português', 'html_lang': 'pt', 'dir': 'ltr'},
    'ja': {'name': '日本語', 'html_lang': 'ja', 'dir': 'ltr'},
    'ru': {'name': 'Русский', 'html_lang': 'ru', 'dir': 'ltr'},
}

UI = {
    'en': {
        'title': 'Which Writer Are You?',
        'eyebrow': 'Literary Temperament Test',
        'intro': 'No trivia, no reading lists. Answer from instinct in rain, streets, farewells, and waking dreams — we match you among <strong>66 writers</strong>. About <strong>10–16 questions</strong>; branch choices bloom flower tokens on the bamboo bar.',
        'tag1': '66 writers', 'tag2': '10–16 Q · branching', 'tag3': 'Mobile friendly', 'tag4': 'Share results',
        'start': 'Start test', 'browse': 'Browse writers',
        'qTitle': 'Questions', 'qTotal': '10–16 Q · single choice',
        'qN': 'Question {n}', 'prev': 'Previous', 'reset': 'Reset', 'next': 'Next', 'seeResult': 'See result',
        'hint0': 'Choose the answer that feels closest to you.',
        'hint1': 'Tap Next when ready.',
        'pickFirst': 'Please choose an option first.',
        'libTitle': 'Writer library', 'libCount': '{n} writers',
        'resultEyebrow': 'Your literary persona',
        'verdict': 'Verdict', 'why': 'Why this match', 'quoteTitle': 'Writer quote',
        'top5q': 'Top 5 quotes', 'radar': 'Temperament radar',
        'radarHint': 'Solid: you · Dashed: best match',
        'probTitle': 'Match popularity', 'probHint': 'Estimated from 8,000 random answer simulations.',
        'hot': 'Popular TOP 3', 'cold': 'Uncommon TOP 3',
        'top5': 'Top 5 matches', 'share': 'Share text', 'shareTip': 'Long-press to copy, or use the Copy button.',
        'shareCard': 'Result card', 'shareCardHint': 'Save a card with match, avatar, flower token and verdict.',
        'saveCard': 'Save card', 'shareImg': 'Share image', 'previewCard': 'Preview',
        'again': 'Take again', 'copy': 'Copy share text', 'copied': 'Copied', 'showLib': 'Writer library',
        'mute': 'Mute', 'unmute': 'Unmute',
        'flowerDesc': 'Temperament: <strong>{dim}</strong> · Flower token <strong>{flower}</strong> (from branch path)',
        'shareTpl': 'I matched with 「{name}」.\n{one}\nTraits: {dims}\nNear matches: {near}\n{quote}\nTry it:\n{url}',
        'probApprox': 'approx.',
        'dims': ['Social critique', 'Lyric romance', 'Abstract thought', 'Urban solitude', 'Human compassion', 'Avant-garde'],
        'flowers': {'taohua': 'Peach blossom', 'lihua': 'Pear blossom', 'meihua': 'Plum blossom', 'juhua': 'Chrysanthemum', 'mudan': 'Peony'},
        'whispers': {
            'Social critique': 'You look past surfaces and distrust empty words',
            'Lyric romance': 'Your feelings run deep and sincere',
            'Abstract thought': 'You chase essence through metaphor and paradox',
            'Urban solitude': 'You keep distance from crowds yet inner order',
            'Human compassion': 'You feel for others and write with warmth',
            'Avant-garde': 'You refuse ordinary forms and seek new voices',
        },
        'whyTpl': 'Your strongest trait is 「{dim}」 — {whisper}. Reading {name} often mirrors something in you.',
    },
    'es': {
        'title': '¿A qué escritor te pareces?',
        'eyebrow': 'Test de temperamento literario',
        'intro': 'Sin trivias ni listas de lectura. Responde por instinto entre <strong>66 escritores</strong>. Unas <strong>10–16 preguntas</strong> con ramificaciones y flores en la barra de bambú.',
        'tag1': '66 escritores', 'tag2': '10–16 preg. · ramas', 'tag3': 'Móvil', 'tag4': 'Compartir',
        'start': 'Comenzar', 'browse': 'Ver escritores',
        'qTitle': 'Preguntas', 'qTotal': '10–16 preg. · una opción',
        'qN': 'Pregunta {n}', 'prev': 'Anterior', 'reset': 'Reiniciar', 'next': 'Siguiente', 'seeResult': 'Ver resultado',
        'hint0': 'Elige la respuesta más cercana a ti.',
        'hint1': 'Pulsa Siguiente cuando estés listo.',
        'pickFirst': 'Elige una opción primero.',
        'libTitle': 'Biblioteca', 'libCount': '{n} escritores',
        'resultEyebrow': 'Tu persona literaria',
        'verdict': 'Veredicto', 'why': 'Por qué este match', 'quoteTitle': 'Cita del escritor',
        'top5q': 'Top 5 citas', 'radar': 'Radar de temperamento',
        'radarHint': 'Sólida: tú · Discontinua: mejor match',
        'probTitle': 'Popularidad de match', 'probHint': 'Estimado con 8.000 simulaciones aleatorias.',
        'hot': 'Popular TOP 3', 'cold': 'Poco común TOP 3',
        'top5': 'Top 5 matches', 'share': 'Texto para compartir', 'shareTip': 'Mantén pulsado para copiar.',
        'shareCard': 'Tarjeta de resultado', 'shareCardHint': 'Guarda una tarjeta con match y veredicto.',
        'saveCard': 'Guardar tarjeta', 'shareImg': 'Compartir imagen', 'previewCard': 'Vista previa',
        'again': 'Repetir', 'copy': 'Copiar texto', 'copied': 'Copiado', 'showLib': 'Biblioteca',
        'mute': 'Silenciar', 'unmute': 'Activar sonido',
        'flowerDesc': 'Temperamento: <strong>{dim}</strong> · Flor <strong>{flower}</strong>',
        'shareTpl': 'Coincido con 「{name}」.\n{one}\nRasgos: {dims}\nCercanos: {near}\n{quote}\nPruébalo:\n{url}',
        'probApprox': 'aprox.',
        'dims': ['Crítica social', 'Romance lírico', 'Pensamiento abstracto', 'Soledad urbana', 'Compasión humana', 'Vanguardia'],
        'flowers': {'taohua': 'Flor de durazno', 'lihua': 'Flor de peral', 'meihua': 'Flor de ciruelo', 'juhua': 'Crisantemo', 'mudan': 'Peonía'},
        'whispers': {
            'Crítica social': 'Ves más allá de las apariencias y desconfías de las palabras vacías',
            'Romance lírico': 'Tus sentimientos son intensos y sinceros',
            'Pensamiento abstracto': 'Buscas la esencia en metáforas y paradojas',
            'Soledad urbana': 'Guardas distancia pero tienes orden interior',
            'Compasión humana': 'Sientes por los demás y escribes con calidez',
            'Vanguardia': 'Rechazas formas convencionales y buscas nuevas voces',
        },
        'whyTpl': 'Tu rasgo más fuerte es 「{dim}」 — {whisper}. Leer a {name} a menudo te refleja.',
    },
    'fr': {
        'title': 'Quel écrivain vous ressemble ?',
        'eyebrow': 'Test de tempérament littéraire',
        'intro': 'Pas de quiz ni de listes. Répondez par instinct parmi <strong>66 écrivains</strong>. Environ <strong>10–16 questions</strong> avec branches et fleurs sur la barre de bambou.',
        'tag1': '66 écrivains', 'tag2': '10–16 Q · branches', 'tag3': 'Mobile', 'tag4': 'Partager',
        'start': 'Commencer', 'browse': 'Parcourir',
        'qTitle': 'Questions', 'qTotal': '10–16 Q · choix unique',
        'qN': 'Question {n}', 'prev': 'Précédent', 'reset': 'Réinitialiser', 'next': 'Suivant', 'seeResult': 'Voir le résultat',
        'hint0': 'Choisissez la réponse la plus proche de vous.',
        'hint1': 'Appuyez sur Suivant quand vous êtes prêt.',
        'pickFirst': 'Choisissez d\'abord une option.',
        'libTitle': 'Bibliothèque', 'libCount': '{n} écrivains',
        'resultEyebrow': 'Votre persona littéraire',
        'verdict': 'Verdict', 'why': 'Pourquoi ce match', 'quoteTitle': 'Citation',
        'top5q': 'Top 5 citations', 'radar': 'Radar de tempérament',
        'radarHint': 'Plein : vous · Pointillé : meilleur match',
        'probTitle': 'Popularité des matchs', 'probHint': 'Estimé sur 8 000 simulations aléatoires.',
        'hot': 'Populaire TOP 3', 'cold': 'Rare TOP 3',
        'top5': 'Top 5 matchs', 'share': 'Texte à partager', 'shareTip': 'Appui long pour copier.',
        'shareCard': 'Carte résultat', 'shareCardHint': 'Enregistrez une carte avec match et verdict.',
        'saveCard': 'Enregistrer', 'shareImg': 'Partager l\'image', 'previewCard': 'Aperçu',
        'again': 'Refaire', 'copy': 'Copier', 'copied': 'Copié', 'showLib': 'Bibliothèque',
        'mute': 'Muet', 'unmute': 'Son',
        'flowerDesc': 'Tempérament : <strong>{dim}</strong> · Fleur <strong>{flower}</strong>',
        'shareTpl': 'Je ressemble à 「{name}」.\n{one}\nTraits : {dims}\nProches : {near}\n{quote}\nEssayez :\n{url}',
        'probApprox': 'env.',
        'dims': ['Critique sociale', 'Romantisme lyrique', 'Pensée abstraite', 'Solitude urbaine', 'Compassion', 'Avant-garde'],
        'flowers': {'taohua': 'Fleur de pêcher', 'lihua': 'Fleur de poirier', 'meihua': 'Prunier', 'juhua': 'Chrysanthème', 'mudan': 'Pivoine'},
        'whispers': {
            'Critique sociale': 'Vous voyez au-delà des apparences',
            'Romantisme lyrique': 'Vos sentiments sont profonds et sincères',
            'Pensée abstraite': 'Vous cherchez l\'essence par la métaphore',
            'Solitude urbaine': 'Vous gardez vos distances avec le monde',
            'Compassion': 'Vous ressentez pour les autres',
            'Avant-garde': 'Vous refusez les formes ordinaires',
        },
        'whyTpl': 'Votre trait dominant est 「{dim}」 — {whisper}. Lire {name} vous reflète souvent.',
    },
    'pt': {
        'title': 'A que escritor você se parece?',
        'eyebrow': 'Teste de temperamento literário',
        'intro': 'Sem trivia ou listas. Responda por instinto entre <strong>66 escritores</strong>. Cerca de <strong>10–16 perguntas</strong> com ramificações e flores na barra de bambu.',
        'tag1': '66 escritores', 'tag2': '10–16 perg. · ramos', 'tag3': 'Mobile', 'tag4': 'Compartilhar',
        'start': 'Começar', 'browse': 'Ver escritores',
        'qTitle': 'Perguntas', 'qTotal': '10–16 perg. · escolha única',
        'qN': 'Pergunta {n}', 'prev': 'Anterior', 'reset': 'Reiniciar', 'next': 'Próxima', 'seeResult': 'Ver resultado',
        'hint0': 'Escolha a resposta mais próxima de você.',
        'hint1': 'Toque em Próxima quando estiver pronto.',
        'pickFirst': 'Escolha uma opção primeiro.',
        'libTitle': 'Biblioteca', 'libCount': '{n} escritores',
        'resultEyebrow': 'Sua persona literária',
        'verdict': 'Veredito', 'why': 'Por que este match', 'quoteTitle': 'Citação',
        'top5q': 'Top 5 citações', 'radar': 'Radar de temperamento',
        'radarHint': 'Sólida: você · Tracejada: melhor match',
        'probTitle': 'Popularidade do match', 'probHint': 'Estimado com 8.000 simulações aleatórias.',
        'hot': 'Popular TOP 3', 'cold': 'Raro TOP 3',
        'top5': 'Top 5 matches', 'share': 'Texto para compartilhar', 'shareTip': 'Toque longo para copiar.',
        'shareCard': 'Cartão de resultado', 'shareCardHint': 'Salve um cartão com match e veredito.',
        'saveCard': 'Salvar cartão', 'shareImg': 'Compartilhar imagem', 'previewCard': 'Pré-visualizar',
        'again': 'Refazer', 'copy': 'Copiar texto', 'copied': 'Copiado', 'showLib': 'Biblioteca',
        'mute': 'Silenciar', 'unmute': 'Ativar som',
        'flowerDesc': 'Temperamento: <strong>{dim}</strong> · Flor <strong>{flower}</strong>',
        'shareTpl': 'Combinei com 「{name}」.\n{one}\nTraços: {dims}\nPróximos: {near}\n{quote}\nExperimente:\n{url}',
        'probApprox': 'aprox.',
        'dims': ['Crítica social', 'Romance lírico', 'Pensamento abstrato', 'Solidão urbana', 'Compaixão humana', 'Vanguarda'],
        'flowers': {'taohua': 'Flor de pêssego', 'lihua': 'Flor de pessegueiro', 'meihua': 'Ameixeira', 'juhua': 'Crisântemo', 'mudan': 'Peônia'},
        'whispers': {
            'Crítica social': 'Você enxerga além das aparências',
            'Romance lírico': 'Seus sentimentos são profundos e sinceros',
            'Pensamento abstrato': 'Você busca a essência na metáfora',
            'Solidão urbana': 'Você mantém distância do mundo',
            'Compaixão humana': 'Você se importa com os outros',
            'Vanguarda': 'Você recusa formas convencionais',
        },
        'whyTpl': 'Seu traço mais forte é 「{dim}」 — {whisper}. Ler {name} frequentemente o reflete.',
    },
    'ja': {
        'title': 'あなたに似た作家は？',
        'eyebrow': '文学気質テスト',
        'intro': '豆知識も読書リストも不要。<strong>66人</strong>の作家から、雨夜・街角・別れ・夢醒めの直感で答えてください。<strong>10〜16問</strong>、分岐で竹枝に花信が咲きます。',
        'tag1': '66人の作家', 'tag2': '10〜16問・分岐', 'tag3': 'スマホ対応', 'tag4': '結果をシェア',
        'start': 'テスト開始', 'browse': '作家一覧',
        'qTitle': '質問', 'qTotal': '10〜16問・単一選択',
        'qN': '第 {n} 問', 'prev': '前へ', 'reset': 'リセット', 'next': '次へ', 'seeResult': '結果を見る',
        'hint0': 'いちばん近い答えを選んでください。',
        'hint1': '選んだら「次へ」を押してください。',
        'pickFirst': 'まず一つ選んでください。',
        'libTitle': '作家ライブラリ', 'libCount': '{n} 人',
        'resultEyebrow': 'あなたの文学人格',
        'verdict': '判語', 'why': 'なぜこの作家', 'quoteTitle': '作家の名言',
        'top5q': 'Top 5 名言', 'radar': '気質レーダー',
        'radarHint': '実線：あなた · 破線：最良マッチ',
        'probTitle': 'マッチ人気度', 'probHint': '8,000回のランダム模擬に基づく推定。',
        'hot': '人気 TOP 3', 'cold': '希少 TOP 3',
        'top5': 'Top 5 マッチ', 'share': 'シェア文案', 'shareTip': '長押しでコピー、またはコピーボタン。',
        'shareCard': '結果カード', 'shareCardHint': 'マッチ・小人・花信・判語入りカードを保存。',
        'saveCard': 'カード保存', 'shareImg': '画像シェア', 'previewCard': 'プレビュー',
        'again': 'もう一度', 'copy': '文案をコピー', 'copied': 'コピー済', 'showLib': '作家一覧',
        'mute': 'ミュート', 'unmute': 'ミュート解除',
        'flowerDesc': '気質：<strong>{dim}</strong> · 花信 <strong>{flower}</strong>（分岐より）',
        'shareTpl': '私は「{name}」タイプ。\n{one}\n気質：{dims}\n近い作家：{near}\n{quote}\nあなたも試して：\n{url}',
        'probApprox': '約',
        'dims': ['社会批判', '叙情ロマン', '抽象思考', '都市の孤独', '人文的慈悲', '前衛実験'],
        'flowers': {'taohua': '桃の花', 'lihua': '梨の花', 'meihua': '梅の花', 'juhua': '菊', 'mudan': '牡丹'},
        'whispers': {
            '社会批判': '表象を剥ぎ、空疎な言葉に警戒する',
            '叙情ロマン': '感情が深く、言葉に余温がある',
            '抽象思考': '比喩と逆説で本質を追う',
            '都市の孤独': '群衆と距離を保ち、内に秩序を持つ',
            '人文的慈悲': '他者への感受性が強い',
            '前衛実験': '常套を拒み、新しい書き方を求める',
        },
        'whyTpl': 'あなたの気質で「{dim}」が最も目立つ——{whisper}。{name}を読むと、自分が映る瞬間がある。',
    },
    'ru': {
        'title': 'На какого писателя вы похожи?',
        'eyebrow': 'Тест литературного темперамента',
        'intro': 'Без эрудиции и списков книг. Отвечайте инстинктом — среди <strong>66 писателей</strong>. Около <strong>10–16 вопросов</strong> с ветвлениями и цветами на бамбуковой шкале.',
        'tag1': '66 писателей', 'tag2': '10–16 вопр. · ветки', 'tag3': 'Мобильная версия', 'tag4': 'Поделиться',
        'start': 'Начать тест', 'browse': 'Библиотека',
        'qTitle': 'Вопросы', 'qTotal': '10–16 вопр. · один ответ',
        'qN': 'Вопрос {n}', 'prev': 'Назад', 'reset': 'Сброс', 'next': 'Далее', 'seeResult': 'Результат',
        'hint0': 'Выберите ответ, который ближе к вам.',
        'hint1': 'Нажмите «Далее», когда готовы.',
        'pickFirst': 'Сначала выберите вариант.',
        'libTitle': 'Библиотека', 'libCount': '{n} писателей',
        'resultEyebrow': 'Ваша литературная persona',
        'verdict': 'Вердикт', 'why': 'Почему это совпадение', 'quoteTitle': 'Цитата писателя',
        'top5q': 'Топ-5 цитат', 'radar': 'Рadar темперамента',
        'radarHint': 'Сплошная: вы · Пунктир: лучшее совпадение',
        'probTitle': 'Популярность совпадений', 'probHint': 'Оценка по 8 000 случайных симуляций.',
        'hot': 'Популярные TOP 3', 'cold': 'Редкие TOP 3',
        'top5': 'Топ-5 совпадений', 'share': 'Текст для sharing', 'shareTip': 'Долгое нажатие для копирования.',
        'shareCard': 'Карточка результата', 'shareCardHint': 'Сохраните карточку с match и вердиктом.',
        'saveCard': 'Сохранить', 'shareImg': 'Поделиться', 'previewCard': 'Предпросмотр',
        'again': 'Пройти снова', 'copy': 'Копировать', 'copied': 'Скопировано', 'showLib': 'Библиотека',
        'mute': 'Без звука', 'unmute': 'Включить звук',
        'flowerDesc': 'Темперамент: <strong>{dim}</strong> · Цветок <strong>{flower}</strong>',
        'shareTpl': 'Я похож на «{name}».\n{one}\nЧерты: {dims}\nБлизкие: {near}\n{quote}\nПопробуйте:\n{url}',
        'probApprox': 'ок.',
        'dims': ['Социальная критика', 'Лирический романтизм', 'Абстрактная мысль', 'Городское одиночество', 'Гуманизм', 'Авангард'],
        'flowers': {'taohua': 'Персиковый цвет', 'lihua': 'Грушевый цвет', 'meihua': 'Слива', 'juhua': 'Хризантема', 'mudan': 'Пион'},
        'whispers': {
            'Социальная критика': 'Вы видите за фасадом и не доверяете пустым словам',
            'Лирический романтизм': 'Ваши чувства глубоки и искренни',
            'Абстрактная мысль': 'Вы ищете суть в метафорах',
            'Городское одиночество': 'Вы держите дистанцию от толпы',
            'Гуманизм': 'Вы чувствительны к другим',
            'Авангард': 'Вы отвергаете обычные формы',
        },
        'whyTpl': 'Ваша главная черта — «{dim}»: {whisper}. Читая {name}, вы часто узнаёте себя.',
    },
}


def merge_lang_pack(lang):
    dest = os.path.join(OUT, lang)
    subprocess.run(
        ['node', os.path.join(INTL, 'merge_pack.js'), lang, dest],
        check=True,
        cwd=INTL,
    )


def emit_locale_js(lang):
    ui = UI[lang]
    return 'window.LIT_I18N = ' + json.dumps(ui, ensure_ascii=False, indent=2) + ';\n'


def emit_index_html(lang):
    ui = UI[lang]
    meta = LANGS[lang]
    return f'''<!DOCTYPE html>
<html lang="{meta["html_lang"]}" dir="{meta["dir"]}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="description" content="{ui["eyebrow"]} — match among 66 writers." />
  <title>{ui["title"]}</title>
  <link rel="stylesheet" href="../../shared/literary.css" />
</head>
<body class="view-welcome">
  <div class="wrap">
    <section class="hero">
      <span class="eyebrow">{ui["eyebrow"]}</span>
      <h1>{ui["title"]}</h1>
      <p class="intro">{ui["intro"]}</p>
      <div class="meta">
        <span class="tag">{ui["tag1"]}</span>
        <span class="tag">{ui["tag2"]}</span>
        <span class="tag">{ui["tag3"]}</span>
        <span class="tag">{ui["tag4"]}</span>
      </div>
      <div class="controls welcome-cta" style="margin-top:20px">
        <button class="btn primary" id="startBtn">{ui["start"]}</button>
        <button class="btn ghost" id="browseBtn">{ui["browse"]}</button>
      </div>
    </section>
    <div class="grid">
      <section class="card panel test-area" id="testArea">
        <div class="section-title" id="questionAnchor">
          <h2>{ui["qTitle"]}</h2><small id="qTotalLabel">{ui["qTotal"]}</small>
        </div>
        <div class="bamboo-progress"><div class="bamboo-track" id="bambooTrack"><div class="bamboo-fill" id="progressFill"></div></div></div>
        <div class="q-count" id="qCount"></div>
        <div class="type-pill" id="typePill"></div>
        <div class="question" id="questionText"></div>
        <div class="options" id="optionsBox"></div>
        <div class="controls">
          <button class="btn ghost" id="prevBtn">{ui["prev"]}</button>
          <button class="btn ghost" id="resetBtn">{ui["reset"]}</button>
          <button class="btn primary" id="nextBtn">{ui["next"]}</button>
        </div>
        <p class="mini" id="hintText"></p>
      </section>
      <aside class="card panel library-aside">
        <div class="section-title"><h2>{ui["libTitle"]}</h2><small id="libCount"></small></div>
        <div class="library" id="libraryBox"></div>
      </aside>
    </div>
    <section class="result" id="resultBox">
      <div class="result-grid">
        <div>
          <span class="eyebrow">{ui["resultEyebrow"]}</span>
          <div class="result-flower-theme" id="resultFlowerTheme"><div class="theme-flower" id="resultFlowerIcon"></div><p id="resultFlowerDesc"></p></div>
          <div class="result-title-row"><h2 id="resultTitle"></h2><div class="result-avatar" id="resultAvatar"></div></div>
          <p class="lead" id="resultIntro"></p>
          <div class="personality-tags" id="personalityTags"></div>
          <div class="result-box"><h3>{ui["verdict"]}</h3><p id="resultOneLiner"></p></div>
          <div class="result-box"><h3>{ui["why"]}</h3><p id="resultWhy"></p></div>
          <div class="result-box quote-card"><h3>{ui["quoteTitle"]}</h3><blockquote id="resultQuote"></blockquote><cite id="resultQuoteAuthor"></cite></div>
          <div class="result-box"><h3>{ui["top5q"]}</h3><div id="top5Quotes" class="top5-quotes"></div></div>
        </div>
        <div>
          <div class="result-box"><h3>{ui["radar"]}</h3><div class="radar-wrap"><svg id="radarChart" width="320" height="320" viewBox="0 0 320 320"></svg></div><p class="mini" style="text-align:center;margin-top:4px">{ui["radarHint"]}</p></div>
          <div class="result-box"><h3>{ui["probTitle"]}</h3><p class="mini" style="margin-bottom:10px">{ui["probHint"]}</p><div class="prob-hotcold"><div><h4>{ui["hot"]}</h4><ol id="probHotList"></ol></div><div><h4>{ui["cold"]}</h4><ol id="probColdList"></ol></div></div></div>
          <div class="result-box"><h3>{ui["top5"]}</h3><div class="top5" id="top5List"></div></div>
          <div class="result-box"><h3>{ui["share"]}</h3><textarea class="share" id="shareText" readonly></textarea><p class="share-tip" id="shareTip">{ui["shareTip"]}</p></div>
          <div class="controls">
            <button class="btn primary" id="againBtn">{ui["again"]}</button>
            <button class="btn ghost" id="copyBtn">{ui["copy"]}</button>
            <button class="btn ghost" id="showLibBtn">{ui["showLib"]}</button>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div class="mobile-bar" id="mobileBar">
    <button class="btn ghost" id="mobilePrevBtn">{ui["prev"]}</button>
    <button class="btn primary" id="mobileNextBtn">{ui["next"]}</button>
  </div>
  <button type="button" class="mute-btn" id="muteBtn"><span class="icon" id="muteIcon">🔊</span><span id="muteLabel">{ui["mute"]}</span></button>
  <div class="toast" id="toast"></div>
  <script src="../../stats-config.js"></script>
  <script src="../../stats-client.js"></script>
  <script src="../../personality_insights.js"></script>
  <script src="locale.js"></script>
  <script src="writers.js"></script>
  <script src="questions.js"></script>
  <script src="../../literary_avatars.js"></script>
  <script src="../../shared/literary_test_i18n.js"></script>
</body>
</html>
'''


def main():
    with open(CSS_SRC, encoding='utf-8') as f:
        html = f.read()
    m = re.search(r'(<style>[\s\S]*?</style>)', html)
    css_block = m.group(1) if m else '<style></style>'
    css_content = css_block.replace('<style>', '').replace('</style>', '')
    if '.bamboo-flower .flower-label' not in css_content:
        css_content += '\n    .bamboo-flower .flower-label { display: none; }\n'

    shared = os.path.join(OUT, '..', 'shared')
    os.makedirs(shared, exist_ok=True)
    with open(os.path.join(shared, 'literary.css'), 'w', encoding='utf-8') as f:
        f.write(css_content)
    shutil.copy2(os.path.join(INTL, 'literary_test_i18n.js'),
                   os.path.join(shared, 'literary_test_i18n.js'))

    manifest = []
    for lang in LANGS:
        dest = os.path.join(OUT, lang)
        os.makedirs(dest, exist_ok=True)
        merge_lang_pack(lang)
        with open(os.path.join(dest, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(emit_index_html(lang))
        with open(os.path.join(dest, 'locale.js'), 'w', encoding='utf-8') as f:
            f.write(emit_locale_js(lang))
        manifest.append(lang)
        print('Generated', lang)

    with open(os.path.join(OUT, 'MANIFEST.txt'), 'w', encoding='utf-8') as f:
        f.write('International Literary Temperament Test\n')
        f.write('Languages: ' + ', '.join(manifest) + '\n\n')
        for lang in manifest:
            f.write(f'{lang}/index.html\n{lang}/locale.js\n{lang}/writers.js\n{lang}/questions.js\n')
        f.write('\nshared/literary.css\nshared/literary_test_i18n.js\n')
        f.write('\nRequires parent ../../assets ../../stats-config.js etc.\n')

    print('Done ->', OUT)


if __name__ == '__main__':
    main()
