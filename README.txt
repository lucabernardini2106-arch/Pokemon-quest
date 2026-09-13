# Pokémon Quest v6

Versione locale-first dell'app.

## Cosa cambia
- IndexedDB per il salvataggio persistente.
- Backup JSON completo e ripristino.
- Profili bambini dinamici (nome, età 3-14, avatar).
- Libreria Quest separata dalle assegnazioni.
- Una Quest può essere assegnata a più bambini.
- Creazione/modifica/assegnazione Quest dall'Area adulti.
- Quest di gruppo solo quando ci sono almeno 2 bambini.
- XP, livelli ed evoluzioni indipendenti.
- Pokémon ufficiali tramite CDN Pokémon.
- Struttura PWA: manifest + service worker.

## Importante su iPad/Android
Se apri `index.html` direttamente come file locale (`file://`), il salvataggio IndexedDB è molto più robusto del precedente localStorage, ma l'installazione PWA/service worker non può funzionare normalmente in quel contesto.

Per una vera app installabile dalla schermata Home serve pubblicare questi file su un indirizzo HTTPS (anche un hosting statico gratuito). In quel caso il service worker può attivare la modalità offline e l'app può essere installata come PWA.

## Backup
Dall'Area adulti > Dati esporta periodicamente il JSON. È il modo più semplice per trasferire la famiglia su un altro dispositivo.

PIN iniziale: 1234.
