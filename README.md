# Singapore Hawker Centre Interactive Map

A responsive, interactive map of all hawker centres in Singapore. Built as a frontend technical assessment for Topo EH-AI Consulting (Option 2).

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Other commands
npm run lint    # ESLint check
npm run build   # Production build output to dist/
```

---

## Tech Stack

| Layer     | Choice                                          | Reason                                                |
| --------- | ----------------------------------------------- | ----------------------------------------------------- |
| Framework | React 18 + Vite                                 | Specified in assessment; fast HMR dev experience      |
| Map       | Leaflet.js + react-leaflet v4                   | Lightweight, no API key required, OpenStreetMap tiles |
| Styling   | Tailwind CSS v3                                 | Utility-first; rapid, consistent UI                   |
| Fonts     | DM Sans + DM Mono (Google Fonts)                | Clean, legible; Mono for data fields                  |
| Data      | data.gov.sg public API + local GeoJSON fallback | Official Singapore government open dataset            |

---

## Features

- **Interactive map** — 129 hawker centres rendered as amber pins on OpenStreetMap
- **Hover preview** — hovering a pin shows name, address, and postal code in a tooltip popup
- **Click to zoom** — clicking a pin smoothly flies the map to that location and keeps the popup open
- **Search** — real-time debounced search by hawker centre name (200 ms)
- **Region filter** — dropdown filters by URA planning region; map auto-pans to show the filtered area
- **Sidebar list** — scrollable list of filtered results; clicking an item flies the map to that pin
- **Live result count** — shows how many centres match the current filters vs. total
- **Clear filters** — one-click button to reset all search and region filters
- **Loading + error states** — spinner while fetching; error card with a "Try Again" button
- **Offline fallback** — if the data.gov.sg API is unavailable, loads from a bundled local GeoJSON file

---

## Project Structure

```text
public/
└── HawkerCentresGEOJSON.geojson   # Offline fallback dataset (129 features)

src/
├── api/
│   └── hawkerApi.js               # All data fetching logic (API + fallback)
├── components/
│   ├── map/
│   │   ├── MapView.jsx            # Leaflet MapContainer; handles region-pan and sidebar flyTo
│   │   └── HawkerMarker.jsx       # Individual pin with hover popup and click-to-zoom
│   ├── sidebar/
│   │   ├── Sidebar.jsx            # Sidebar shell with grain texture background
│   │   ├── SearchBar.jsx          # Debounced search input with clear button
│   │   ├── RegionFilter.jsx       # Region dropdown
│   │   └── HawkerList.jsx         # Scrollable, filterable result list
│   └── ui/
│       ├── LoadingSpinner.jsx      # Loading state
│       └── ErrorMessage.jsx        # Error state with retry
├── constants/
│   └── regions.js                 # URA region option list and display labels
├── hooks/
│   └── useHawkerData.js           # Data hook: fetch → normalise → expose state
├── styles/
│   └── index.css                  # Tailwind directives, custom animations, Leaflet popup overrides
├── utils/
│   ├── filterUtils.js             # Pure function: filter hawkers by search + region
│   └── regionUtils.js             # Pure function: classify each hawker centre into a URA region
├── App.jsx                        # Root component; owns all app state
└── main.jsx                       # Entry point; imports global CSS and Leaflet CSS
```

---

## Architecture Notes

### Data flow

```
data.gov.sg API
    │  GET /v1/public/api/datasets/{id}/poll-download
    │  → presigned S3 URL → GeoJSON download
    │  (on any error: falls back to bundled HawkerCentresGEOJSON.geojson)
    ▼
hawkerApi.js
    ▼
useHawkerData.js  — normalises each GeoJSON feature into a flat object:
    │               { id, name, address, postalCode, lat, lng, region }
    │               Note: GeoJSON stores coordinates as [lng, lat] — these are swapped on read
    ▼
App.jsx  — owns state: data, searchQuery, regionFilter, selectedId
    │       derives filteredData via useMemo → filterHawkers(data, searchQuery, regionFilter)
    │
    ├──▶ Sidebar  →  SearchBar, RegionFilter, HawkerList
    └──▶ MapView  →  HawkerMarker × N
```

### Region classification (`regionUtils.js`)

Follows URA's 5-region planning model: **Central, West, North, North-East, East**.

Two-step approach:

1. **Keyword match** — checks the hawker name and street address against a curated locality list (e.g. `"ang mo kio"` → North-East, `"jurong"` → West, `"bedok"` → East).
2. **Coordinate fallback** — if no keyword matches, classifies by lat/lng zone calibrated against URA planning boundaries.

```js
getRegion({ lat, lng, name, address });
// returns: 'central' | 'north-east' | 'east' | 'west' | 'north' | 'unknown'
```

### State management

All state lives in `App.jsx` — no external library needed at this scale:

| State          | Type           | Purpose                                  |
| -------------- | -------------- | ---------------------------------------- |
| `data`         | `Array`        | All normalised hawker records            |
| `searchQuery`  | `String`       | Current search input                     |
| `regionFilter` | `String`       | Selected region (`"all"` by default)     |
| `selectedId`   | `String\|null` | Hawker ID selected from the sidebar list |

---

## Data Source

- **Dataset**: Singapore Hawker Centres — [data.gov.sg](https://data.gov.sg/datasets/d_4a086da0a5553be1d89383cd90d07ecd/view)
- **API endpoint**: `https://api-open.data.gov.sg/v1/public/api/datasets/{id}/poll-download`
- **Format**: GeoJSON — coordinates follow the GeoJSON spec (`[longitude, latitude]`), so they are swapped when read into the app
- **Fallback**: `public/HawkerCentresGEOJSON.geojson` (129 hawker centres, bundled at build time)

---

## Environment

The app works without any `.env` file. To override the API base URL, copy `.env.example`:

```bash
cp .env.example .env.local
```

`.env.example`:

```
VITE_API_BASE_URL=https://data.gov.sg
```

---

## Testing

There are no automated tests in this project. The application can be verified manually by running it locally and working through the checklist below.

```bash
npm install
npm run dev
```

**Manual verification checklist:**

| Area             | What to check                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Data loading     | On first load, all 129 hawker centres appear as amber pins on the map                                                       |
| Offline fallback | Disconnect from the internet (or block `api-open.data.gov.sg` in devtools), reload — pins still load from the local GeoJSON |
| Hover popup      | Hover over any pin → popup shows name, address, and postal code                                                             |
| Click to zoom    | Click any pin → map smoothly flies to that location; popup stays open after zoom                                            |
| Search           | Type a name (e.g. `"adam"`) → sidebar list and map markers update in real time                                              |
| Region filter    | Select `"North-East"` → only North-East hawker centres remain; map pans to that area                                        |
| Sidebar click    | Click any list item → map flies to that pin and opens its popup                                                             |
| Clear filters    | With filters active, click "Clear" → all 129 pins reappear and map resets                                                   |
| Error state      | In `hawkerApi.js`, temporarily throw an error before the fetch — error card with "Try Again" button appears                 |
| Lint / build     | `npm run lint` passes with 0 warnings; `npm run build` completes successfully                                               |

---

## Assumptions & Known Limitations

- Records with missing or non-numeric coordinates are silently skipped (a count is logged to the browser console).
- Region classification is best-effort: keyword matching covers the majority of cases; the coordinate fallback handles the rest. Edge cases at URA zone boundaries may occasionally be misclassified.
- App is optimised for desktop viewports (1280px+). Mobile layout is functional but not the primary target.
- OpenStreetMap tiles are loaded without authentication — standard rate limits apply (acceptable for this context).
