# Mock Service Worker - Das Schweizer Taschenmesser fürs Testen

MSW ist eine Werkeug zum mocken von Backends.

Da es mir immer schwer fällt, mir Fantasiebackends für Blogartikel auszudenken, nehme ich die großartige Rick and Morty
API um Komponenten zu entwickeln, welche diese verwenden.

## Einsatz in Unit Tests

Angenommen wir sollen eine Komponente entwickeln die jeden R&M Character als Avatar darstellt. Unsere Designabteilung
hat uns ein frühes Mockup geschickt:

![MortyMockup](mortymock.png)

Über die Buttons Next und Previous kann man zum jeweils nächsten oder vorherigen Character wechseln.

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

Eine besondere Anforderung soll sein, dass wir durch die Liste rotieren können. Das bedeutet das der Button "Next" beim
Letzten Charakter zum Ersten springt und umgekehrt.

Wir arbeiten testgetrieben und schreiben erst einmal eine Komponente die einen Character so rendert wie abgebildet.
