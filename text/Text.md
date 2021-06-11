# Mock Service Worker - Einfach Backends mocken

//Einleitung fehlt

Es gibt diverse Situationen mit denen eine Frontendanwendung umgehen können sollte. Die verschiedenen Status, die ein
Webserver zurückgibt, sollten zum Beispiel korrekt behandelt werden. Auch die Daten, die von einem Backend geliefert
werden, können komplex und schwer zu erzeugen sein. Zu allem Überfluss findet die Kommunikation in der Regel asynchron
statt, was das Schreiben von Tests weiter erschwert.

Testframeworks wie Jest bieten zwar Möglichkeiten um asynchrone Funktionen zu mocken, das ist allerdings recht sperrig.
Außerdem wird bei dieser Art zu Mocken in der Regel die Bibliothek gemockt, die den Aufruf ausführt. Das kann dazu
führen, das Probleme mit der verwendeten Bibliothek, die z. B. durch ein Versionsupdate auftreten, erst in
End-To-End-Tests oder schlimmer noch, in Produktion entdeckt werden.

Eine andere Möglichkeit wäre, einen Testserver aufzusetzen, in dem ich mein Backend simuliere. Das ist jedoch recht
aufwändig und nicht so einfach in eine CI Pipeline zu integrieren.

Die API Mocking Library "[Mock Service Worker](https://mswjs.io)" greift genau diese Probleme auf und bietet eine
großartige Lösung. Sie verwendet die
[Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) um sich zwischen Frontend und
Backend zu schalten. Auf diese Art und Weise können Requests zum Backend abgefangen und simuliert werden. Das Beste
daran ist, dass dies auf allen Ebenen der Testpyramide funktioniert und dadurch eine hohe Wiederverwendbarkeit schafft.

Den Einsatz des Mock Service Workers möchte ich anhand einer Beispielanwendung erläutern.

## Das Backend

Als Backend verwende ich die großartige [Rick and Morty API](https://rickandmortyapi.com/). Sie bietet Zugriff auf eine
Datenbank für Charaktere aus dem Rick & Morty Universum.

Ein Aufruf des Endpunkts https://rickandmortyapi.com/api/character liefert eine Seite mit max. 20 Ergebnissen.
Zusätzlich erhalten wir Meta-Informationen die Auskunft darüber geben wie viele Elemente sich insgesamt auf wie vielen
Seiten in der Datenbank befinden, sowie die Links zur nächsten und vorherigen Seite.

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

![MortyMockup](mortymock.png)

Die React Anwendung ermöglicht uns, die Charaktere der Datenbank anzuzeigen.

Über die Buttons Next und Previous kann man zum jeweils nächsten oder vorherigen Character wechseln.

Eine besondere Anforderung soll sein, dass wir durch die Liste rotieren können. Das bedeutet das der Button "Next" beim
letzten Charakter zum ersten springt und umgekehrt. Eine klassiche Karusselfunktion also.

Die Komponente Characterwheel erhält den jeweils aktuell gewählten Charakter und bietet Callbacks für die beiden
Buttons.

```javascript
export const CharacterWheel = ({
                                   currentCharacter,
                                   onClickNext,
                                   onClickPrev,
                               }) => {
    return (
        <CharacterWheelDiv>
            <Character bio={currentCharacter}/>
            <ButtonGroup alignRight={!onClickPrev}>
                {onClickPrev && <Button onClick={() => onClickPrev()}>Previous</Button>}
                {onClickNext && <Button onClick={() => onClickNext()}>Next</Button>}
            </ButtonGroup>
        </CharacterWheelDiv>
    );
};
```

Da unsere Anwendung nur aus einer Seite besteht, wird diese Komponente direkt in der main page eingebunden.

```javascript
//pages/main/index.js
const Main = () => {
    const [wheel] = useState(
        new CharacterwheelService(new RickandmortyApiAdapter())
    );
    const [currentChar, setCurrentChar] = useState(undefined);

    const init = useCallback(async () => {
        await wheel.init();
        setCurrentChar(await wheel.currentChar());
    }, [setCurrentChar, wheel]);

    useEffect(() => {
        init();
    }, [init]);

    const next = async () => {
        setCurrentChar(await wheel.nextChar());
    };

    const prev = async () => {
        setCurrentChar(await wheel.prevChar());
    };

    return (
        <>
            {currentChar && (
                <CharacterWheel
                    currentCharacter={currentChar}
                    onClickNext={() => next()}
                    onClickPrev={() => prev()}
                />
            )}
        </>
    );
};
```

Die Seite hat zwei Statusvariablen. Den aktuellen Charakter `currentChar` sowie das `wheel` als Instanz des
CharacterWheelService.

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
}

```

Anmerkung: Die Methoden `nextChar` und `prevChar` müssen asynchron sein, da es sein kann, dass sie einen Seitenwechsel
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
Charaktere durchgehen, um wieder beim ersten zu landen.

## Einführung des Mock Service Worker

Mit dem Mock Service Worker können wir diesen Problemen entgegen treten indem wir das Backend einfach mocken. Das geht
mit dem MSW sehr einfach. Nach der Installation mit `npm install -D msw` legen wir in dem Verzeichnis `src/mocks`
eine Datei `handlers.js` an, hier legen wir die zu mockenden Backend Funktionen ab.

In unserem Fall ist das der Endpunkt https://rickandmortyapi.com/api/character den ich im
Abschnitt [Das Backend](#das-backend) bereits beschrieben habe. Allerdings möchten wir in unseren Tests nur zwei
Charaktere zurückgeben die wir auch selber definieren.

```js
//handlers.js

export const handlers = [
    rest.get("https://rickandmortyapi.com/api/character", (req, res, ctx) => {
        const page = Number.parseInt(req.url.searchParams.get("page")) - 1 || 0;

        return res(ctx.status(200), ctx.json(pages[page]));
    }),
];

const pages = [
    {
        info: {
            pages: 2,
            count: 6,
            next: "https://rickandmortyapi.com/api/character?page=2",
            prev: null,
        },
        results: [
            {
                id: 1,
                name: "Rick Sanchez",
                status: "Alive",
                species: "Human",
                gender: "Male",
                origin: {
                    name: "Earth (C-137)",
                    url: "https://rickandmortyapi.com/api/location/1",
                },
                image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
            },
            //...
        ],
    },

    {
        info: {
            //...
        },
        results: [
            //...
        ],
    },
];

```

Damit unser Testcode statt der echten API den Handler aufruft, müssen wir jest noch dazu bringen den msw server zu
starten. Dazu legen wir zuerst im Mockverzeichnis eine Datei `server.js` an und registrieren die Handler am zu
startenden Server.

```js
//src/mocks/server.js
import {setupServer} from "msw/node";
import {handlers} from "./handlers";

export const server = setupServer(...handlers);

```

Da das Project mit der create-react-app erstellt wurde, gibt es bereits eine Datei `setupTests.js` im `src` Verzeichnis.
(Ist dies nicht der
Fall, [kann man Jest auch sehr einfach so konfigurieren, dass eine Datei vor dem Start der Tests ausgeführt wird](https://jestjs.io/docs/configuration#setupfilesafterenv-array))
. Diese machen wir uns zunutze, um den Server vor den Tests zu starten und danach zu beenden. Nach jedem ausgeführten
Tests wird die Funktion resetHandlers() aufgerufen. Diese kann in Tests benutzt
werden [um definierte handler zu überschreiben](https://mswjs.io/docs/api/setup-server/reset-handlers). Das ist
nützlich, wenn z. B. getestet werden soll, dass ein Endpunkt einen Fehler zurückgibt. Der Aufruf ohne Parameter sorgt
dafür das die Handler in den Ursprungsstatus zurückversetzt werden (so wie in der handlers.js definiert).

```js
//setupTests.js
import {server} from "./mocks/server";

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
```

Das war es schon. Startet man nun die Tests, wird der Handler des Mock Service Worker aufgerufen. Es sind keine
Änderungen am produktiven Code notwendig. Lediglich die Testdaten müssen etwas angepasst werden. Das Beste an der Sache
ist, dass backend calls für die noch keine Handler bestehen, weiterhin vom vorhandenen Backend bedient werden. Möchte
ich den MSW in ein existierendes Projekt integrieren, kann ich Schritt für Schritt echte calls durch Mocks ersetzen.