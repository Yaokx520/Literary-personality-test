#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Write FR/PT/JA/RU writer text modules from Chinese source + literary translations."""
import json, os, textwrap

OUT = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(OUT, 'writers_source_zh.json'), encoding='utf-8') as f:
    ZH = json.load(f)

# Literary translations keyed by writer id
FR = {
'kongzi': ('Vous valorisez l\'ordre, la cultivation et le soin d\'autrui ; vous croyez que les mots doivent porter la morale et les idées transformer.', 'Vous êtes comme un maître doux cherchant l\'éternel dans l\'ordre et la bienveillance.'),
'zhuangzi': ('Vous refusez d\'être enchaîné par les règles ; vous préférez l\'imagination libre et une sagesse contre les convenances.', 'Vous êtes comme le vent dans les bois — léger, insaisissable, indéfinissable.'),
'quyuan': ('Vous portez un idéalisme ardent et l\'amour du pays ; vos sentiments brûlent d\'intensité et de fidélité.', 'Vous êtes comme un long chant funèbre — fervent, loyal, refusant de céder.'),
'libai': ('Vous êtes passionné et expansif ; la vie doit être magnifique et le langage est votre vin et votre épée.', 'Vous êtes comme la lune et le vent — libre, lumineux, sans entraves.'),
'dufu': ('Vous placez le destin personnel dans le torrent de l\'histoire ; votre voix est compatissante et grave.', 'Vous êtes comme un long poème qui se déploie — stable, lourd, plein de pitié.'),
'sushi': ('Vous gardez l\'humour et l\'ouverture dans l\'adversité, mêlant talent et chaleur du quotidien.', 'Vous êtes comme un arc-en-ciel après la pluie — clair, doux, avec un arrière-goût.'),
'caoxueqin': ('Vous écrivez la chaleur et la froideur humaines et le caprice du destin — fin et désolé.', 'Vous êtes comme un miroir de tous les vivants — splendeur et tristesse ensemble.'),
'luxun': ('Vous ressentez le monde avec une douleur aiguë et usez d\'un langage tranchant pour éclairer ses contradictions.', 'Vous êtes comme un scalpel froid ouvrant l\'émotion et le réel.'),
'shencongwen': ('Vous trouvez ordre et beauté dans le quotidien simple, avec douceur et sérénité.', 'Vous êtes comme une rivière tranquille — tiède, paisible, coulant lentement.'),
'laoshe': ('Vous veillez à la dignité des gens ordinaires ; l\'humour cache l\'amertume.', 'Vous êtes comme une lanterne de ruelle — familière, drôle, pleine de vie.'),
'zhangailing': ('Vous voyez la nature humaine dans le détail et gardez distance avec élégance.', 'Vous avez un tact magnifique et une lucidité qui perce les mondes brillants.'),
'yuhua': ('Vous restez résilient dans l\'absurde et l\'épreuve, digérant le lourd par l\'humour.', 'Vous êtes comme une pierre lissée par la vie — silencieuse, difficile à briser.'),
'murasaki': ('Vous écrivez des émotions subtiles et la lumière des strates sociales — prose contenue et longue.', 'Vous êtes comme une lumière derrière le washi — délicate, élégante, à demi-dite.'),
'natsume': ('Vous traversez tradition et modernité ; votre style est sobre et réfléchi.', 'Vous êtes comme un jardin calme où raison et mélancolie se reflètent.'),
'kawabata': ('Vous êtes sensible à la beauté fugitive ; vous aimez la pureté, la tristesse et le silence.', 'Vous êtes comme un feu au pays des neiges — quiet, transparent, un peu froid.'),
'mishima': ('Vous poursuivez la beauté formelle et l\'intensité spirituelle — contradictoire et éclatant.', 'Vous êtes comme une lame trempée — magnifique, dangereuse, refusant la médiocrité.'),
'oe': ('Vous vous souciez des faibles et des blessures historiques ; la littérature est éthique et rédemption.', 'Vous êtes comme une plaie qui ne se ferme pas — sérieux, responsable, tourné vers la lumière.'),
'murakami': ('Vous circulez entre quotidien et rêve ; la solitude rythme votre pas.', 'Vous êtes comme une musique basse — calme, fluide, un peu distante.'),
'shakespeare': ('Vous voyez tout le spectre humain ; tragédie et comédie sont en vos mains.', 'Vous êtes comme un théâtre — joie et peine côte à côte, tout y est.'),
'austen': ('Vous maîtrisez le détail social et l\'éthique du mariage — spirituel et retenu.', 'Vous êtes comme un thé raffiné — fin, subtil, lame dans le rire.'),
'dickens': ('Vous suivez le sort des humbles ; dans le grand récit reste chaleur et justice.', 'Vous êtes comme brouillard et lampes de Londres — sombre, mais lumière humaine.'),
'woolf': ('Vous captez l\'instant et écrivez le flux de la conscience et du temps.', 'Vous êtes comme un miroir qui respire, reflétant les ondes intérieures.'),
'orwell': ('Vous alertez face au pouvoir et à la manipulation du langage ; la littérature est lucidité et résistance.', 'Vous êtes comme une alarme qui ne s\'éteint pas — froide, tranchante, sans silence.'),
'poe': ('Vous aimez l\'obscur, le rêve et les bords de la psyché — formes compactes et étranges.', 'Vous êtes comme un clocher de minuit — mystérieux, sombre, fascinant.'),
'whitman': ('Vous embrassez la multiplicité et le corps ; le poème est une déclaration ouverte de vie.', 'Vous êtes comme le vent sur la plaine — vaste, ardent, sans cadre.'),
'hemingway': ('Vous faites confiance aux phrases sèches et fortes et portez le destin en silence.', 'Vous êtes comme un récif poli par les vagues — dur, silencieux, fort.'),
'fitzgerald': ('Vous écrivez splendeur et désenchantement ; la romance cache les fissures d\'une époque.', 'Vous êtes comme le feu vert de Gatsby — brillant, lointain, mélancolique.'),
'faulkner': ('Vous construisez des temps complexes et des épopées familiales d\'une densité extrême.', 'Vous êtes comme une forêt du Sud — enchevêtrée, profonde, infinie.'),
'salinger': ('Vous écrivez la sensibilité adolescente, la rébellion et la soif de sincérité.', 'Vous êtes comme un gardien dans le seigle — entêté, seul, refusant de grandir.'),
'vonnegut': ('Vous affrontez guerre et vide par l\'absurde et l\'humour — tendre et ironique.', 'Vous êtes comme une étoile de travers — drôle, triste, profondément humaine.'),
'morrison': ('Vous écrivez mémoire, race et trauma féminin dans un langage poétique et puissant.', 'Vous êtes comme un chant sorti de la terre — grave, solennel, indélébile.'),
'mccarthy': ('Votre prose est austère ; dans le désert et la violence vous sondez l\'humain.', 'Vous êtes comme des braises sur la plaine — froides, rares, brûlantes.'),
'rousseau': ('Vous croyez à la nature et à la sincérité ; vous aimez la civilisation mais la doutez.', 'Vous êtes comme un écho dans les bois — ardent, sensible, en quête du vrai.'),
'balzac': ('Vous mettez la société en scène immense où personnages et argent s\'entrelacent.', 'Vous êtes comme les archives d\'une ville — vaste, réel, impitoyable.'),
'hugo': ('Vous unissez épopée et compassion ; vous parlez pour les faibles.', 'Vous êtes comme une cathédrale — grandiose, compatissante, ouverte à la lumière.'),
'baudelaire': ('Vous cherchez beauté et décadence en la ville moderne ; votre vers est dense et décadent.', 'Vous êtes comme une ombre sous néon — magnifique, brisée, addictive.'),
'proust': ('Vous faites du temps et de la mémoire un labyrinthe sensoriel sans fin.', 'Vous êtes comme une madeleine — un contact et le passé afflue.'),
'camus': ('Vous restez lucide et digne dans l\'absurde ; la révolte est sens.', 'Vous êtes comme la pierre de Sisyphe — lourde, mais porteuse d\'une lumière invincible.'),
'goethe': ('Vous poursuivez plénitude et équilibre classique ; romantisme et raison coexistent.', 'Vous êtes comme un jardin de la Renaissance — fertile, profond, toujours neuf.'),
'heine': ('Votre poésie est romantique et mordante ; amour et satire marchent ensemble.', 'Vous êtes comme une dague enveloppée de roses — belle, mais tranchante.'),
'kafka': ('Vous alertez face aux règles et à l\'identité ; dans l\'ordre vous voyez l\'absurde.', 'Vous êtes comme un labyrinthe silencieux — plus vous avancez, plus vous vous entendez.'),
'mann': ('Vous tissez philosophie, maladie et crise civilisationnelle en longs récits.', 'Vous êtes comme un clocher qui tourne lentement — solennel, complexe, suggestif.'),
'hesse': ('Vous écrivez croissance spirituelle et sagesse orientale — intérieur et limpide.', 'Vous êtes comme un chemin vers l\'intérieur — calme, profond, invitant à la solitude.'),
'rilke': ('Vous méditez existence, solitude et beauté en langage poétique.', 'Vous êtes comme une lettre au futur — lente, pure, touchant l\'âme.'),
'pushkin': ('Vous êtes poète national et symbole de grâce et de liberté.', 'Vous êtes comme les bouleaux russes — clairs, droits, mélancoliques.'),
'dostoevsky': ('Vous descendez dans l\'abîme moral et les crises de foi ; les personnages se révèlent dans l\'extrême.', 'Vous êtes comme une confession dans la tempête — ardente, sombre, inévitable.'),
'tolstoy': ('Avec une vision vaste vous interrogez morale, guerre et sens de la vie.', 'Vous êtes comme un vaste champ — lourd, solennel, accueillant tout.'),
'chekhov': ('Vous écrivez le silence et l\'impuissance du quotidien ; l\'humour porte la tendresse.', 'Vous êtes comme une fumée du soir — légère, lointaine, mélancolique.'),
'bulgakov': ('Vous créez dans l\'absurde et la censure ; la magie cache la vérité.', 'Vous êtes comme un bal du diable — absurde, éclatant, inoubliable.'),
'solzhenitsyn': ('Vous témoignez du totalitarisme et de la souffrance ; la dignité avant tout.', 'Vous êtes comme le vent de Sibérie — froid, lucide, impossible à ignorer.'),
'borges': ('Vous démontez structures et niveaux ; la réalité même vous fascine.', 'Vous êtes comme une bibliothèque qui se replie — complexe, envoûtante.'),
'neruda': ('Votre poésie brûle de politique et d\'amour ; terre et passion ensemble.', 'Vous êtes comme la mer sud-américaine — tumultueuse, romantique, vivante.'),
'marquez': ('Vous tissez mythe et réalité ; le temps boucle comme un fleuve.', 'Vous êtes comme une pluie centenaire — fantastique, humide, inoubliable.'),
'vargasllosa': ('Vous maîtrisez récit multiple et allégorie politique avec structure précise.', 'Vous êtes comme une carte complexe s\'ouvrant vers pouvoir et désir.'),
'paz': ('Vous passez de la poésie à la prose, questionnant identité, temps et mystère.', 'Vous êtes comme un soleil du désert — ardent, abstrait, illuminant tout.'),
    'bolano': ('Vous écrivez exil, jeunesse et fantômes littéraires en récits errants et captivants.', 'Vous êtes comme une route sans fin — déserte, libre, légendaire.'),
'kundera': ('Vous pesez l\'existence entre plaisanterie et philosophie, légèreté et poids.', 'Vous êtes comme une fenêtre réfléchissante — enjouée, profonde, insaisissable.'),
'calvino': ('Vous faites de la littérature un jeu structurel — léger et intellectuel.', 'Vous êtes comme un livre qui se recombine — ludique, fin, jamais fini.'),
'pamuk': ('Vous tissez des labyrinthes entre Orient et Occident, individu et histoire.', 'Vous êtes comme la neige sur Istanbul — couvrant mémoire et identité.'),
'ibsen': ('Vous disséquez éthique familiale et hypocrisie sociale au théâtre.', 'Vous êtes comme une porte frappée — une fois la question posée, on ne peut l\'ignorer.'),
'andersen': ('Vous usez du conte pour écrire solitude, beauté et injustice.', 'Vous êtes comme une étoile qui pleure — douce, amère, éclairant l\'enfance.'),
'saramago': ('Vous écrivez destin collectif et fable morale en phrases longues et fluides.', 'Vous êtes comme une cécité qui se propage — collective, allégorique, glaçante.'),
'tagore': ('Votre poésie brille de nature, de divinité et d\'amour.', 'Vous êtes comme la lune sur le Gange — sereine, sacrée, sur tous.'),
'naipaul': ('Vous écrivez héritage colonial et identité déchirée d\'un regard froid.', 'Vous êtes comme un miroir sans chaleur — clair, tranchant, dérangeant.'),
'achebe': ('Vous donnez voix à l\'histoire silenciée et reconstruisez le récit africain.', 'Vous êtes comme des tambours de tribu — stables, puissants, réveillant la mémoire.'),
'gibran': ('Vos mots sont poésie et proverbe — tendres et spirituels.', 'Vous êtes comme une source au désert — simple, profond, apaisant les cœurs.'),
}

def write_module(name, data):
    lines = [f'{name} = {{']
    for k, (intro, one) in data.items():
        intro = intro.replace('\\', '\\\\').replace("'", "\\'")
        one = one.replace('\\', '\\\\').replace("'", "\\'")
        lines.append(f"    '{k}': {{'intro': '{intro}', 'one': '{one}'}},")
    lines.append('}')
    path = os.path.join(OUT, f'writer_texts_{name.lower()}.py')
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print('wrote', path, len(data))

write_module('fr', FR)
