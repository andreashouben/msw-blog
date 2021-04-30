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
Backend zu schalten. Auf diese Art und Weise können Requests zum Backend abgefangen und simuliert werden. Das großartige
daran ist, dass dies auf allen Ebenen der Testpyramide funktioniert und dadurch eine hohe Wiederverwendbarkeit schafft.

Den Einsatz des Mock Service Workers möchte ich anhand eines Beispiels erläutern. Als Backend verwende ich die großartige
Rick and Morty API. Das Frontend wird in React entwickelt.

## Einsatz in Unit Tests

Angenommen wir sollen eine Komponente entwickeln die jeden R&M Character als Avatar darstellt. Unsere Designabteilung
hat uns ein frühes Mockup geschickt:

![MortyMockup](mortymock.png)

Über die Buttons Next und Previous kann man zum jeweils nächsten oder vorherigen Character wechseln.

Eine besondere Anforderung soll sein, dass wir durch die Liste rotieren können. Das bedeutet das der Button "Next" beim
letzten Charakter zum ersten springt und umgekehrt. Eine klassiche Karusselfunktion also.

Die R&M API liefert die Charakter Seitenweise. Ein Aufruf des Endpunkts https://rickandmortyapi.com/api/character
liefert eine Seite mit max. 20 Ergebnissen. Zusätzlich erhalten wir Meta-Informationen die Auskunft darüber geben wie
viele Elemente sich insgesamt auf wie vielen Seiten in der Datenbank befinden sowie die Links zur nächsten und
vorherigen Seite.

### Beispiel:

```
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

Die Komponente Characterwheel besteht bereits. Sie erwartet den aktuell ausgewählten Character sowie eine Funktion die 
beim anklicken des jeweiligen Buttons ausgeführt werden soll.
```

const next () => //TODO
const prev () => //TODO
 
<CharacterWheel 
    currentCharacter={currentChar} 
    onClickNext={() => next()} 
    onClickPrev={() => prev()} 
/>
```

Um die Kommunikation mit der API zu vereinfachten, existiert ein Adapter, der zwei Methoden anbietet.

```
class RickandmortyApiAdapter {
  
  counts = async () => {
    // gibt ein Object zurück das die Anzahl der Seiten und die Anzahl aller Charaktere ausgibt
    // --> {pages: 34, characters: 634 }
  };

  fetchResultsOfPage = async (page) => {
      //ruft eine Seite auf und liefert die Charactere 
  };
}
 
```

Wir möchten einen Service entwickeln, der vier Methoden bietet:
```
class CharacterwheelService {

  init = () => = { //lädt die erste Seite }} 

  currentChar = () => {//TODO};

  nextChar = async () => {//TODO};

  prevChar = async () => {//TODO};
}

```
Die Methoden `nextChar` und `prevChar` müssen asynchron sein, da es sein kann das sie einen Seitenwechsel erfordern. 