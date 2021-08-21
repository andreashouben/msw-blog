# Mock Service Worker - Einfach Backends mocken

Beim Entwickeln einer clientseitigen Webanwendung ist die Kommunikation zwischen Frontend und Backend essentiel.
Dementsprechend ist es wichtig, diese hinreichend zu testen. Das ist allerdings kein triviales Problem, da es etliche
Fehlerszenarien gibt, die es zu beachten gilt. Darüber hinaus ist die Kommunikation asynchron, was für sich allein gestellt
schon eine gewisse Komplexität mitbringt.

Test Frameworks wie Jest bieten zwar eine Möglichkeit um Aufrufe zum Server zu mocken, allerdings sind diese imperativ
und damit nicht sonderlich flexibel. Eine weitere Möglichkeit ist es, einen Testserver aufzusetzen, um ein Backend zu
simulieren. Das ist jedoch recht aufwändig und nicht so einfach in einer CI Pipeline zu integrieren.

Die API Mocking Library "[Mock Service Worker](https://mswjs.io)" greift genau diese Probleme auf und bietet eine
großartige Lösung. Sie verwendet die
[Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) um sich zwischen Frontend und
Backend zu schalten. Hierdurch können Requests zum Backend abgefangen und simuliert werden. Das Beste
daran ist, dass dies auf allen Ebenen der Testpyramide funktioniert und dadurch eine hohe Wiederverwendbarkeit geschaffen wird.

Den Einsatz des Mock Service Workers möchte ich anhand einer Beispielanwendung, dem ["Magnificent Rick & Morty Character
Wheel"](https://msw-blog-demo-app.vercel.app/) erläutern.

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

Eine React Anwendung soll es uns ermöglichen, die Charaktere der Datenbank anzuzeigen und über zwei Buttons zum jeweils 
nächsten bzw. vorherigen Character zu wechseln.

Eine besondere Anforderung soll sein, dass wir durch die Liste rotieren können. Das bedeutet das der Button "Next" beim
letzten Charakter zum ersten springt und umgekehrt. Eine klassiche Karusselfunktion also.

Die Komponente `CharacterWheel` erhält den jeweils aktuell gewählten Charakter und bietet Callbacks für die beiden
Buttons. Bei den einzelnen Elementen der Komponente handelt es sich
um [styled components](https://styled-components.com/), daher die eventuell etwas verwirrenden Elementnamen.

```javascript
//components/characterwheel/characterWheel.js
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

Da unsere Anwendung nur aus einer Seite besteht, wird die Komponente direkt in der Hauptseite eingebunden:

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
CharacterWheelService. Dieser bietet Methoden zum Abrufen des aktuellen Characters sowie zum vor- und zurück wechseln.

```javascript
//service/characterwheel/index.js
class CharacterwheelService {

    // ...

    currentChar = () => {
        return this.#currentPageResults[this.#currentCharIndex];
    };

    nextChar = async () => {
        await this.#raiseCharIndex();

        return this.currentChar();
    };

    prevChar = async () => {
        await this.#lowerCharIndex();

        return this.currentChar();
    };
}
```

Der Service bindet dabei einen Adapter ein, der die Rick and Morty API bedient und bei Bedarf eine neue Seite mit
Charakteren abruft.

```javascript
//service/characterwheel/index.js
class RickandmortyApiAdapter {
    static #characterUrl = "https://rickandmortyapi.com/api/character";

    // ...

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

## Einsatz in Unit Tests

Sowohl für den Service, als auch für den API Adapter werden Unit Tests implementiert.

### Adapter Test

```javascript
//adapters/rickandmortyapiadapter/index.spec.js
import RickandmortyApiAdapter from "./index";

describe("Rick and Morty Api Adapter", () => {

    //...

    it("should fetch the results for a page", async () => {
        const rickandmortyapiadapter = new RickandmortyApiAdapter();

        const page34 = await rickandmortyapiadapter.fetchResultsOfPage(34);

        expect(page34).toEqual(pageContentOfPage34.results);
    });
});
const pageContentOfPage34 = {
    // ...Haufenweise code nur fürs Testen    
}

```

### Service Test

```javascript
//service/characterwheel/index.spec.js
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

* Die API könnte nicht verfügbar sein
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

Mit dem Mock Service Worker können wir den genannten Problemen entgegentreten indem wir das Backend mocken. Das geht
mit dem MSW sehr einfach. Nach der Installation mit `npm install -D msw` legen wir in dem Verzeichnis `src/mocks`
eine Datei `handlers.js` an, in der wir die zu mockenden Backend Funktionen ablegen.

In unserem Fall ist das der GET-Endpunkt `https://rickandmortyapi.com/api/character` den ich im
Abschnitt [Das Backend](#das-backend) bereits beschrieben habe. Allerdings möchten wir in unseren Tests nur zwei
Charaktere zurückgeben die wir auch selber definieren. Über das `rest` Objekt das wir aus dem Modul `msw` importieren,
können wir sehr einfach Endpunkte erzeugen. Es genügt, die nach der entsprechenden HTTP Methode benannte Funktion
aufzurufen. In unserem Fall `rest.get`. Jede dieser Funktion erhält als Parameter die URL sowie eine Callback Funktion
mit den drei Parametern

* req – ein Objekt, dass Informationen über den Request enthält.
* res – eine Funktion, die es ermöglicht eine Response zu erzeugen.
* ctx – ein Hilfsobjekt, dass Funktionen bietet, um die Respnse nach unseren Wünschen zu transformieren.

```javascript
//mocks/handlers.js
import {rest} from "msw";

export const handlers = [
    //der zu mockende Endpunkt
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

```javascript
//mocks/server.js
import {setupServer} from "msw/node";
import {handlers} from "./handlers";

export const server = setupServer(...handlers);

```

Da das Projekt mit der create-react-app erstellt wurde, gibt es bereits eine Datei `setupTests.js` im `src` Verzeichnis.
(Ist dies nicht der
Fall, [kann man Jest auch sehr einfach so konfigurieren, dass eine Datei vor dem Start der Tests ausgeführt wird](https://jestjs.io/docs/configuration#setupfilesafterenv-array))
. Diese machen wir uns zunutze, um den Server vor den Tests zu starten und danach zu beenden. Nach jedem ausgeführten
Tests wird die Funktion resetHandlers() aufgerufen. Diese kann in Tests benutzt
werden [um definierte handler zu überschreiben](https://mswjs.io/docs/api/setup-server/reset-handlers). Das ist
nützlich, wenn z. B. getestet werden soll, dass ein Endpunkt einen Fehler zurückgibt. Der Aufruf ohne Parameter sorgt
dafür das die Handler in den Ursprungsstatus zurückversetzt werden (so wie in der handlers.js definiert).

```javascript
//setupTests.js
import {server} from "./mocks/server";

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
```

Das war es schon. Startet man nun die Tests, wird der Handler des Mock Service Worker aufgerufen und ein von der echten API entkoppeltes
Testen wird ermöglicht. Es sind keine Änderungen am produktiven Code notwendig. Lediglich die Testdaten müssen etwas angepasst werden. 
Das Beste an der Sache ist, dass backend calls für die noch keine Handler bestehen, weiterhin vom vorhandenen Backend bedient werden. 
Möchte ich den MSW in ein existierendes Projekt integrieren, kann ich Schritt für Schritt echte calls durch Mocks ersetzen.

## Ausblick

Dieses Beispiel ist nur ein kleiner Einblick in die Möglichkeiten, die der Mock Service Worker bietet. Durch die den
Einsatz der Service Worker API können alle im Test gemockten auch in einen Browser geladen werden. Alles, was dafür
notwendig ist, ist das Einbinden einer JavaScript Datei im Auslieferungsverzeichnis der Webanwendung. Der Service Worker
kann anschließend beim Bootstrappen der Anwendung gestartet werden und fängt alle zuvor definierten Rest Calls ab.
[Die Einbindung ist kinderleicht](https://mswjs.io/docs/getting-started/integrate/browser) und wird durch ein npm Script
unterstützt.

Dieser Vorteil wird erst dann ersichtlich, wenn er im Zusammenspiel mit weiteren Tools eingesetzt wird. Nutzt man z. B.
cypress zum Testen der Anwendung, kann der Mock Service Worker als zuverlässiges Backend agieren, ohne das ein Server
notwendig ist. Aber auch bei Einsatz von Komponentenbibliotheken wie [StorybookJS](https://storybook.js.org) kann der
MSW seine Stärken ausspielen. Er ermöglicht das entkoppelte Entwickeln von Komponenten die eine Backendanbindung
benötigen, ohne das dafür extra ein Server gestartet werden muss.

## Fazit

Der MSW ist ein hilfreiches Werkzeug beim Entwickeln von Single Page Applications. Gerade im Hinblick auf verteilte
Systeme (Stichwort: Microservices) kann er seine Stärken ausspielen. Die Einbindung ist einfach, die API ist schnell
gelernt und die Einsatzmöglichkeiten sind vielseitig. In meinem Werkzeugkasten hat er jedenfalls einen Platz gefunden.

---

Der Code zur Beispielanwendung befindet sich auf [Github](https://github.com/andreashouben/msw-blog).
