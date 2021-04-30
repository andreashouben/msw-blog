# Mock Service Worker - Das Schweizer Taschenmesser fürs Testen

In praktischen jeder Webapplikation gibt es Interaktion zwischen Frontend und Backend. Das Testen dieser Interaktion
sollte demnach essenzieller Bestandteil einer jeden Webapp sein.

Es gibt diverse Situationen mit denen eine Frontendanwendung umgehen können sollte. Die verschiedenen Status, die ein
Webserver zurückgibt, sollten zum Beispiel korrekt behandelt werden. Auch die Daten, die von einem Backend geliefert
werden, können komplex und schwer zu erzeugen sein. Zu allem Überfluss findet die Kommunikation in der Regel asynchron
statt, was das Schreiben von Tests weiter erschwert.

Testframeworks wie Jest bieten zwar Möglichkeiten um aynchrone Funktionen zu mocken, das ist allerdings recht sperrig.
Außerdem wird bei dieser Art zu Mocken in der Regel die Bibliothek gemockt, die den Aufruf ausführt. Das kann dazu
führen, das Probleme mit der verwendeten Bibliothek, die z.B. durch ein Versionsupdate auftreten, erst in
End-To-End-Tests oder schlimmer noch, in Produktion entdeckt werden.

Eine andere Möglichkeit wäre, einen Testserver aufzusetzen, in dem ich mein Backend simuliere. Das ist jedoch recht
aufwändig und nicht so einfach in eine CI Pipeline zu integrieren.

Die API Mocking Library "[Mock Service Worker](https://mswjs.io)" greift genau diese Probleme auf und bietet eine
großartige Lösung. Sie verwendet die
[Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) um sich zwischen Frontend und
Backend zu schalten. Auf diese Art und Weise können Requests zum Backend abgefangen und simuliert werden. Das Beste
daran ist, dass dies auf allen Ebenen der Testpyramide funktioniert und dadurch eine hohe Wiederverwendbarkeit schafft.

Den Einsatz des Mock Service Workers möchte ich anhand eines Beispiels erläutern.

## Das Backend

Als Backend verwende ich die großartige [Rick and Morty API](https://rickandmortyapi.com/). Sie bietet Zugriff auf eine
Datenbank für Charaktere aus dem Rick & Morty Universum.

Ein Aufruf des Endpunkts https://rickandmortyapi.com/api/character liefert eine Seite mit max. 20 Ergebnissen.
Zusätzlich erhalten wir Meta-Informationen die Auskunft darüber geben wie viele Elemente sich insgesamt auf wie vielen
Seiten in der Datenbank befinden sowie die Links zur nächsten und vorherigen Seite.

### Beispiel:

```json
{
  "info": {
    "count": 671,
    "pages": 34,
    "next": "https://rickandmortyapi.com/api/character/?page=2",
    "prev": null
  },
  "results": [
    // ...
  ]
}
```

## Das Frontend

Das Frontend wird in React entwickelt. Unsere Designabteilung hat uns ein frühes Mockup geschickt:

![MortyMockup](mortymock.png)

Über die Buttons Next und Previous kann man zum jeweils nächsten oder vorherigen Character wechseln.

Eine besondere Anforderung soll sein, dass wir durch die Liste rotieren können. Das bedeutet das der Button "Next" beim
letzten Charakter zum ersten springt und umgekehrt. Eine klassiche Karusselfunktion also.

Die Komponente Characterwheel besteht bereits. Sie erwartet den aktuell ausgewählten Character sowie eine Funktion die
beim anklicken des jeweiligen Buttons ausgeführt werden soll.

```javascript

const next
() => //TODO
const prev
() => //TODO

    <CharacterWheel
        currentCharacter={currentChar}
        onClickNext={() => next()}
        onClickPrev={() => prev()}
    />
```

Um die Kommunikation mit der API zu vereinfachten, existiert ein Adapter, der zwei Methoden anbietet.

```javascript
class RickandmortyApiAdapter {
    static #characterUrl = "https://rickandmortyapi.com/api/character";


    // gibt ein Object zurück das die Anzahl der Seiten und die Anzahl aller Charaktere ausgibt
    // Bsp.: {pages: 34, characters: 634 }
    counts = async () => {
        const response = await fetch(RickandmortyApiAdapter.#characterUrl);
        const data = await response.json();
        const {count, pages} = data.info;
        return {pages, characters: count};
    };

    //ruft eine Seite auf und liefert die Charactere als Array
    fetchResultsOfPage = async (page) => {
        const params = new URLSearchParams({page});
        const response = await fetch(
            `${RickandmortyApiAdapter.#characterUrl}?${params}`
        );
        const data = await response.json();
        return data.results;
    };
}

export default RickandmortyApiAdapter;


```

Die Logik das Characterwheels wird in einem [_
stateful_ Service](https://github.com/andreashouben/msw-blog/blob/master/src/service/characterwheel/index.js) abgebildet
der vier Methoden bietet:

```javascript
class CharacterwheelService {

    constructor(apiAdapter) { // Der Service verwendet den API Adapter. Dieser muss injiziert werden. }

        init = () => { /* lädt die erste Seite und setzt den aktuellen Character (Seite 1, Character 1)*/
        }

        currentChar = () => { /*liefert den aktuellen Character*/
        };

        nextChar = async () => { /*setzt den aktuellen Character auf den nächsten aus den Results und gibt diesen zurück*/
        };

        prevChar = async () => { /*setzt den aktuellen Character auf den vorherigen aus den Results und gibt diesen zurück*/
        };
    }

```

Anmerkung: Die Methoden `nextChar` und `prevChar` müssen asynchron sein, da es sein kann das sie einen Seitenwechsel
erfordern.

## Einsatz in Unit Tests

Sowohl für den Service, als auch für den API Adapter existieren Unit Tests.

### Adapter Test

```javascript
import RickandmortyApiAdapter from "./index";

describe("Rick and Morty Api Adapter", () => {
    it("should give an object containing the count of pages and characters", async () => {
        const rickandmortyapiadapter = new RickandmortyApiAdapter();

        const numberOfPages = await rickandmortyapiadapter.counts();

        expect(numberOfPages).toEqual({pages: 34, characters: 671});
    });

    it("should fetch the results for a page", async () => {
        const rickandmortyapiadapter = new RickandmortyApiAdapter();

        const page34 = await rickandmortyapiadapter.fetchResultsOfPage(34);

        expect(page34).toEqual(pageContentOfPage34.results);
    });
});
const pageContentOfPage34 = {
    // ...Haufenweise code nur fürs Testsn    
}

```

### Service Test

```javascript

describe("CharacterWheel", () => {
    const characterWheel = new CharacterwheelService(
        new RickandmortyApiAdapter()
    );

    describe("after initializing", () => {
        beforeEach(async () => {
            await characterWheel.init();
        });

        it("returns the character with id 1 when callling current() ", () => {
            const currentChar = characterWheel.currentChar();

            expect(currentChar).toEqual(characterWithId1);
        });

        it("returns the next character when calling next()", async () => {
            const nextChar = await characterWheel.nextChar();

            expect(nextChar).toEqual(characterWithId2);
        });

        it("returns the third character when calling next() twice", async () => {
            await characterWheel.nextChar();
            const thirdChar = await characterWheel.nextChar();

            expect(thirdChar).toEqual(characterWithId3);
        });

        it("returns the last character when calling prev()", async () => {
            let lastChar = await characterWheel.prevChar();

            expect(lastChar).toEqual(characterWithId671);
        });

        it("returns the first character when caling prev() and next()", async () => {
            await characterWheel.prevChar();
            const firstChar = await characterWheel.nextChar();

            expect(firstChar).toEqual(characterWithId1);
        });
    });
});

const characterWithId1 = { /* Haufenweise Zeilen */};
const characterWithId2 = { /* Die nur nötig sind, */};
const characterWithId3 = { /* weil wir gegen */};
const characterWithId671 = { /* die echte api testen */};


```

Beide Tests sind an sich sehr überschaubar. Allerdings arbeiten sie aktuell gegen die echte API und genau das birgt
unterschiedliche Gefahrenquellen, die die Tests fehlschlagen lassen können:

* Die API könnte nicht verfügbar sein.
* Die Datenbank wird erweitert und liefert andere Metriken
* Die API wird geändert und liefert Objekte in einem anderen Format

Darüber hinaus arbeiten die Assertions in den Tests mit echten Objekten aus der API. Diese sind enorm groß und blähen
die Tests unnötig auf.

Ein Test der bis zum letzen Character blättert, um festzustellen, ob man bei einem Aufruf von
_nextChar()_ wieder auf dem ersten Character landet, fehlt komplett. Diese Funktionalität wird zwar durch den letzten
Test _"returns the first character when caling prev() and next()"_ implizit abgedeckt, allerdings wäre ein expliziter
Test auch wünschenswert. Aus Perfomancegründen wurde jedoch darauf verzichtet. Schließlich müsste man über 600
Charactere durchgehen, um wieder beim ersten zu landen.