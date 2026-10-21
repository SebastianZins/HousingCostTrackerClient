# Home Cost Tracker

Home Cost Tracker is an Angular web application for recording and reviewing household income and expenses. It supports multiple people and three transaction types: income assigned to a person, expenses paid by a person, and transfers between people.

The client is designed to work even when the API is unavailable. In that case, it can store data in the browser's Local Storage and optionally load sample data so the application can be explored without a backend.

## Related repository

The backend REST API is maintained in a separate repository:

**[HousingCostTrackerAPI](https://github.com/SebastianZins/HousingCostTrackerAPI)** — an ASP.NET Core Web API built with .NET 10 and MongoDB.

For API architecture, endpoint documentation, configuration, and backend setup, see the [API README](https://github.com/SebastianZins/HousingCostTrackerAPI#readme).

## Features

- **Multiple people:** Transactions are associated with people. Each person has a first name, last name, and short name.
- **Three transaction types:**
  - **Income:** Money received by a person.
  - **Expense:** Money paid by a person, for example for groceries or rent.
  - **Transfer:** Money moved from one person to another.
- **Reusable categories and recipients/places:** Income and expenses are assigned a category and a recipient/place. Existing entries can be selected using autocomplete. New categories and recipients can be created directly in the transaction form and saved for future use.
- **Transaction management:** Transactions include a date, amount, description, and the relevant people. The overview provides a table with filtering and editing functionality.
- **API-optional operation:** If the API cannot be reached, the app can read and write data using the browser's Local Storage.
- **Sample data:** When the API is unavailable, users can choose to load sample data to explore the app with a populated set of example transactions.

## Transaction types

The application defines `ETransactionType` in `src/app/common/enums/transaction-type.enum.ts`:

| Type | Meaning | Data recorded |
| --- | --- | --- |
| `INCOME` | Income | Amount, date, person receiving the income, description, category, and recipient/place |
| `EXPENSE` | Expense | Amount, date, person paying, description, category, and recipient/place |
| `TRANSFER` | Transfer between people | Amount, date, sending person, and receiving person |

The transaction model (`src/app/common/models/transaction.model.ts`) includes fields such as `amount`, `date`, `transactionType`, `payedBy`, `payedTo`, `description`, `category`, and `place`. People, categories, and recipients/places are referenced by their IDs.

### Examples from the sample data

The sample data in `src/app/testData/` demonstrates the relationships between transactions and the related records:

- **Expense:** Hannah Maier spends €20 on groceries at Rewe.
- **Expense:** Hannah Maier spends €30 on rent, with `Miete` as the category and `Kaufland` as the stored recipient/place in the sample dataset.
- **Income:** Hannah Maier receives €20 with the category `Strom` and the recipient/place `Kaufland`.
- **Transfer:** Max Maier transfers €50 to Hannah Maier. Transfers do not require a category or recipient/place.

These examples illustrate how transactions refer to people, categories, and recipients/places by ID. The UI resolves the corresponding names from those records.

## Data storage and API fallback

The client is designed to use an optional API.

1. On startup, `ConfigService` checks whether the API is reachable by requesting the health endpoint.
2. If the API is reachable, the data services use the HTTP endpoints.
3. If the API is unavailable, the app asks whether sample data should be loaded.
4. If sample data is selected, the app writes the sample transactions, people, categories, and recipients/places to Local Storage.
5. In local mode, the services read and write data in the browser's Local Storage.

The Local Storage keys are `TRANSACTION`, `PERSON`, `CATEGORY`, and `PLACE` (see `src/app/app.constants.ts`).

**Note:** Local Storage belongs to the current browser and origin. It does not automatically synchronize data across devices or users. Clearing browser storage may remove locally saved data.

The API base URL is configured in `src/environments/environment.ts`. Its default value is:

```ts
apiUrl: 'https://localhost:1101/api'
```

The expected routes are defined in `src/app/app.constants.ts`. They include `/health`, `/transaction`, `/person`, `/place`, and `/category`, with `/all` endpoints for fetching collections. See the [API repository](https://github.com/SebastianZins/HousingCostTrackerAPI) for backend details.

## Technology stack

- [Angular](https://angular.dev/) and TypeScript
- [PrimeNG](https://primeng.org/) and [PrimeIcons](https://primeng.org/icons) for UI components and icons
- [RxJS](https://rxjs.dev/) for asynchronous data flows
- Browser Local Storage as the offline/fallback data store
- Angular Router for navigation

Installed dependencies and available npm scripts are listed in `package.json`.

## Prerequisites

- Node.js and npm versions compatible with the installed Angular toolchain
- A current npm installation

## Run locally

Clone the repository and install its dependencies:

```bash
git clone https://github.com/SebastianZins/HousingCostTrackerClient.git
cd HousingCostTrackerClient
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

`npm start` launches the Angular development server. No published API is required to run the client locally. If the configured API is unreachable, the app can use Local Storage with or without sample data.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the development server |
| `npm run build` | Build the application |
| `npm run watch` | Rebuild continuously during development |
| `npm test` | Run tests |

## Project structure

The main directories and files are organized as follows:

```text
src/
├── app/
│   ├── common/
│   │   ├── enums/          # Transaction types
│   │   ├── interfaces/     # For example, the person interface
│   │   ├── models/         # Transaction, category, and recipient/place models
│   │   └── services/       # API configuration, HTTP, Local Storage, and data services
│   ├── components/
│   │   └── transaction-creator/  # Transaction entry form
│   ├── pages/
│   │   ├── landing-page/   # Quick entry
│   │   ├── overview/       # Transaction overview
│   │   └── dashboard-page/ # Dashboard page
│   └── testData/           # Sample people, categories, places, and transactions
└── environments/
    └── environment.ts      # API base URL
```

## Additional notes

- New categories and recipients/places can be created in the transaction form and are then stored through whichever data backend is active.
- Amounts are entered in euros; the form requires a value greater than zero.
- Dates are stored internally as timestamps.
