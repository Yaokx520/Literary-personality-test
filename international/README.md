# International Literary Temperament Test

Six language editions of the literary personality test (66 writers, branching questions).

## Languages

| Code | Language | Entry URL |
|------|----------|-----------|
| en | English | `packs/en/index.html` |
| es | Español | `packs/es/index.html` |
| fr | Français | `packs/fr/index.html` |
| pt | Português | `packs/pt/index.html` |
| ja | 日本語 | `packs/ja/index.html` |
| ru | Русский | `packs/ru/index.html` |

## Folder layout

```
international/
  index.html              Language hub
  README.md
  literary_test_i18n.js   Locale-aware app logic
  gen_international.py      Regenerate all packs
  gen_international.js      Node fallback generator
  shared/
    literary.css
    literary_test_i18n.js
  packs/
    en/  es/  fr/  pt/  ja/  ru/
      index.html
      locale.js      UI strings + dimensions
      writers.js     66 writers (shared data)
      questions.js   Branching question bank
    MANIFEST.txt
```

## Dependencies (from repo root)

Each pack loads from parent project:

- `../../assets/` — avatars, flowers, music
- `../../stats-config.js`, `../../stats-client.js`
- `../../personality_insights.js`
- `../../literary_avatars.js`

## Regenerate after edits

```cmd
py -3 international\gen_international.py
```

## GitHub Pages

Upload the whole repo (or at minimum `international/` + `assets/` + shared JS).  
Example URL: `https://yaokx520.github.io/Literary-personality-test/international/packs/en/`

## Notes

- UI and core questions are translated per language; some branch items may remain in Chinese until extended in `gen_international.py` (`Q_TRANSLATIONS`).
- Writer bios in `writers.js` use the Chinese edition text; quotes stay in original languages where applicable.
