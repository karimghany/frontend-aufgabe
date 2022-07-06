# Frontend Aufgabe 07.22 ZEIT Online

## Einleitung und Aufgabe

In diesem Repository liegt der Code, für die in "Runde 2" gestellte Frontend-Aufgabe. Ziel der Aufgabe war die Erstellung eines Wetter-Widgets mit Suchfeld für Städtenamen, Speicherung der ersten Anfrage, GeoLocation-Funktion und Dark-Mode-Kompatibilität. Zur sicheren Kommunikation mit dem API ist eine Middleware nötig.

---

## Lösung

### Starten der Middleware

Um die Middleware erfolgreich zu starten und das Frontend zu inspizieren, muss das repository gecloned werden und anschließend eine `.env`-Datei im root-Ordner erstellt werden mit dem Inhalt:

`OPENWEATHERMAP_API_KEY={Der API-Schlüssel}`

Anschließend muss in der Konsole zum root-Verzeichnis des Codes navigiert und die nötigen Dependencies mit folgendem Befehl installiert werden:

```bash
npm i
```

Nachstehender Befehl startet die Middleware:

```bash
node app.js
```

### Inspizieren des Frontends

Nach erfolgreichem Start der Middleware kann das Frontend unter dem [localhost](http://localhost:3000/) auf dem Port 3000 inspiziert werden. Alternativ kann das Frontend z.B. über die [LiverServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) Extension von VisualStudio Code inspiziert werden. Allerdings sind Wetterdaten nur verfügbar, wenn die Middleware gestartet wurde.

---

## Bermerkung

Aus Sicherheitsgründen sollte im Idealfall die integrierte Middleware (alle Dateien, die sich nicht im "public"-Ordner befinden) separat in einem privaten Repository deployed werden. Um den Scope der Aufgabe nicht zu sprengen, ist hier die Middleware im Frontend-Repository mit eingebunden. Teile der Middleware beruhen auf [OpenSorce-Code](https://github.com/JacksonBates/example-goodreads-api-relay) von Jackson Bates. Im Wetter-Widget werden OpenSource-Icons genutzt ([Dripicons Weather Set](http://demo.amitjakhu.com/dripicons-weather/) von Amit Jakhu). Der freiverfügbare [Mapbox-GL-Geocoder](https://github.com/mapbox/mapbox-gl-geocoder) sorgt für die Autocomplete-Funktionalität.

### License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
