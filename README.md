# Home Cost Tracker

Eine Angular-Webanwendung, um Einnahmen und Ausgaben eines Haushalts zu erfassen und zu überblicken. Mehrere Personen können gemeinsam abgebildet werden. Die Anwendung unterstützt Einnahmen, Ausgaben und Geldtransfers zwischen Personen.

Die Client-Anwendung ist so aufgebaut, dass sie auch ohne erreichbare API genutzt werden kann: In diesem Fall kann sie Daten im Browser-Local-Storage speichern und auf Wunsch mit Beispieldaten gestartet werden.

## Funktionen

- **Mehrere Personen:** Transaktionen werden einer Person zugeordnet. Personen besitzen Vorname, Nachname und Kurznamen.
- **Drei Transaktionstypen:**
  - **Einnahme:** Ein Betrag wird einer Person gutgeschrieben.
  - **Ausgabe:** Eine Person bezahlt einen Betrag, zum Beispiel für Lebensmittel oder Miete.
  - **Übertrag:** Geld wird von einer Person an eine andere übertragen.
- **Kategorien und Empfänger wiederverwenden:** Einnahmen und Ausgaben erhalten eine Kategorie und einen Empfänger/Ort. Vorhandene Einträge können über die Autovervollständigung ausgewählt werden. Neue Kategorien und Empfänger lassen sich direkt beim Erfassen anlegen und werden gespeichert.
- **Transaktionen verwalten:** Datum, Betrag, Beschreibung und beteiligte Personen werden erfasst. Die Übersicht bietet eine tabellarische Darstellung und Filter-/Bearbeitungsfunktionen.
- **Lokaler Betrieb ohne API:** Ist die API nicht erreichbar, kann die App ihre Daten aus dem Browser-Local-Storage beziehen und Änderungen dort speichern.
- **Beispieldaten:** Beim Start ohne API kann das Laden von Testdaten ausgewählt werden, damit sich die Anwendung mit realistisch aufgebauten Beispielen ausprobieren lässt.

## Transaktionsarten

Die Anwendung verwendet `ETransactionType` aus `src/app/common/enums/transaction-type.enum.ts`:

| Typ | Bedeutung | Angaben |
| --- | --- | --- |
| `INCOME` | Einnahme | Betrag, Datum, empfangende Person, Beschreibung, Kategorie und Empfänger/Ort |
| `EXPENSE` | Ausgabe | Betrag, Datum, zahlende Person, Beschreibung, Kategorie und Empfänger/Ort |
| `TRANSFER` | Übertrag zwischen Personen | Betrag, Datum, abgebende Person und empfangende Person |

Im Datenmodell (`src/app/common/models/transaction.model.ts`) stehen unter anderem die Felder `amount`, `date`, `transactionType`, `payedBy`, `payedTo`, `description`, `category` und `place`. Personen, Kategorien und Empfänger werden über ihre IDs referenziert.

### Beispiele aus den enthaltenen Testdaten

Die Beispieldaten in `src/app/testData/` zeigen die vorgesehenen Verwendungsfälle:

- **Ausgabe:** Max Maier bezahlt 20 € für Lebensmittel bei Rewe.
- **Ausgabe:** Max Maier bezahlt 30 € für Miete bei Kaufland.
- **Einnahme:** Hannah Maier erhält 20 € mit der Kategorie „Strom“ und dem Empfänger/Ort „Kaufland“.
- **Übertrag:** Hannah Maier überträgt 50 € an Max Maier. Bei einem Übertrag werden keine Kategorie und kein Empfänger benötigt.

Die Beispiele illustrieren die Verknüpfung von Transaktionen mit Personen, Kategorien und Empfängern über IDs; die Bezeichnungen werden in der Oberfläche aus den zugehörigen Datensätzen aufgelöst.

## Datenhaltung und API-Fallback

Die Client-Anwendung ist auf eine optionale API ausgelegt.

1. Beim Start prüft `ConfigService` über den Health-Endpunkt, ob die API erreichbar ist.
2. Ist die API erreichbar, verwenden die Datenservices die HTTP-Endpunkte.
3. Ist die API nicht erreichbar, wartet die App auf die Auswahl, ob Beispieldaten geladen werden sollen.
4. Werden Testdaten ausgewählt, schreibt die App die Beispieldatensätze für Transaktionen, Personen, Kategorien und Empfänger in den Local-Storage.
5. Im lokalen Modus lesen und schreiben die Services ihre Daten im Local-Storage des Browsers.

Die Local-Storage-Schlüssel lauten `TRANSACTION`, `PERSON`, `CATEGORY` und `PLACE` (siehe `src/app/app.constants.ts`).

**Wichtig:** Local-Storage-Daten sind an den Browser und dessen Speicherbereich gebunden. Sie werden nicht automatisch mit anderen Geräten oder Personen synchronisiert. Browserdaten zu löschen kann die lokal gespeicherten Daten entfernen. Das Backend ist ein separates Projekt und wird nicht über dieses Repository veröffentlicht.

Die API-Basis-URL ist derzeit in `src/environments/environment.ts` konfiguriert und lautet standardmäßig:

```ts
apiUrl: 'https://localhost:1101/api'
```

Die erwarteten Routen sind in `src/app/app.constants.ts` definiert. Dazu gehören `/health`, `/transaction`, `/person`, `/place` und `/category`, jeweils mit `/all`-Routen für das Laden von Sammlungen.

## Technologie-Stack

- [Angular](https://angular.dev/) mit TypeScript
- [PrimeNG](https://primeng.org/) und [PrimeIcons](https://primeng.org/icons) für UI-Komponenten und Icons
- [RxJS](https://rxjs.dev/) für asynchrone Datenflüsse
- Browser-Local-Storage als Offline-/Fallback-Datenspeicher
- Angular Router für die Navigation

Die installierten Abhängigkeiten und verfügbaren npm-Skripte stehen in `package.json`.

## Voraussetzungen

- Node.js und npm in einer Version, die mit der installierten Angular-Toolchain kompatibel ist
- Eine aktuelle npm-Installation

## Lokal starten

Repository klonen und in den Projektordner wechseln:

```bash
git clone https://github.com/SebastianZins/HousingCostTrackerClient.git
cd HousingCostTrackerClient
npm install
npm start
```

Danach die Anwendung im Browser unter [http://localhost:4200](http://localhost:4200) öffnen.

`npm start` startet den Angular-Entwicklungsserver. Für den lokalen Betrieb ohne Backend ist keine veröffentlichte API erforderlich. Wenn die konfigurierte API nicht erreichbar ist, kann der Local-Storage-Modus mit oder ohne Beispieldaten verwendet werden.

## Weitere Befehle

| Befehl | Zweck |
| --- | --- |
| `npm start` | Entwicklungsserver starten |
| `npm run build` | Anwendung bauen |
| `npm run watch` | Build während der Entwicklung laufend aktualisieren |
| `npm test` | Tests starten |

## Projektstruktur

Die wichtigsten Verzeichnisse und Dateien:

```text
src/
├── app/
│   ├── common/
│   │   ├── enums/          # Transaktionstypen
│   │   ├── interfaces/     # z. B. Personeninterface
│   │   ├── models/         # Transaktion, Kategorie, Empfänger/Ort
│   │   └── services/       # API-Konfiguration, HTTP, Local-Storage und Datenservices
│   ├── components/
│   │   └── transaction-creator/  # Formular zum Erfassen von Transaktionen
│   ├── pages/
│   │   ├── landing-page/   # Schnelleingabe
│   │   ├── overview/      # Transaktionsübersicht
│   │   └── dashboard-page/ # Dashboard-Seite
│   └── testData/           # Beispieldaten für Personen, Kategorien, Orte und Transaktionen
└── environments/
    └── environment.ts      # API-Basis-URL
```

## Hinweise

- Neue Kategorien und Empfänger werden über das Transaktionsformular erstellt und anschließend über den jeweils aktiven Speicherweg abgelegt.
- Beträge werden in Euro eingegeben; das Formular verlangt einen Betrag größer als null.
- Datumswerte werden intern als Zeitstempel gespeichert.
- Die API wird nicht in diesem Repository bereitgestellt oder veröffentlicht.
