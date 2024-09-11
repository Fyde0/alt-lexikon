## Alt-Lexikon

Alt-Lexikon is an alternative frontend for [The People's Dictionary](https://folkets-lexikon.csc.kth.se/ "The People's Dictionary"), a English-Swedish and Swedish-English dictionary expanded and improved by its users.

You can use alt-lexikon [here](https://dev.flere.pw/lexikon/ "here"), or you can self host it (read below).

### Screenshots

| Desktop, dark mode | Mobile, light mode | Mobile ,settings
| - | - | - |
| ![](/screenshots/desktop-dark.jpg?raw=true) | ![](/screenshots/mobile-light.jpg?raw=true) | ![](/screenshots/mobile-dark-settings.jpg?raw=true)

### About

Alt-Lexikon aims to be a more modern interface with several improvements, like dark mode and a responsive layout, it also has better search and a few settings to personalize your experience.

### Self hosting

Alt-Lexikon is made with Node.js 22.

If you want to self host it, first you need to download the original dictionary data in XML format from Folkets lexikon [here](https://folkets-lexikon.csc.kth.se/folkets/om.en.html "here"), and use the tools in the /server/tools folder to import them in a SQLite database:
```bash
python3 createDB.py words.db
python3 XMLToSQLite.py folkets_sv_en_public.xml words.db
python3 XMLToSQLite.py folkets_en_sv_public.xml words.db
```
Then, you can build and run both the server and the client like normal Node apps, look in the .env.empty files for the environment variables the you need to set.
