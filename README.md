# README #

Aplikacja internetowa wspomagająca wybór najlepszej oferty pracy. 
Stworzona wspólnie w zespole 2 studentów.

frontend - Aleksandra Holik

backend - Krzysztof Romanowski

### Wymagania ###

* python3, w tym moduł flask (instalacja: pip3 install Flask)
* przeglądarka inernetowa (najlepiej Mozilla Firefox)

### Uruchamianie ###

* Wywołanie skryptu: ./start.sh
* Uruchomenie przeglądarki
* Przejście na stronę http://localhost:5000

### Obsługa ###

* Wpisać odpowiednie dane w formularzu
* Wybrać miejsce zamieszkania na mapce (klikając na dowolny punkt)
* Nacisnąć na strzałkę poniżej mapki - wyświetli się dobrana oferta

### Pliki ###

* app/run.py - obsługa żądań, implementacja algorytmu (funkcja fetch_best_offer_json())
* app/static/templates/index.html - szablon html
* app/static/stylesheets/base.css - arkusz styli css
* app/static/scripts/map.js - przygotowanie mapki, obsługa większości zdarzeń, wysyłanie żądań
* app/storage/json/job-offers.json - oferty pracy w formacie JSON
* app/storage/text/locations-cracow.txt - oferty pracy w formie tekstu
* app/storage/markers - katalog z ikonkami do mapy
