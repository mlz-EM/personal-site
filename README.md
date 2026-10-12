# Personal Website

Menglin Zhu's [personal website](https://mlz-em.github.io/personal-site), built with React, React Router, and Sass.

## Development

```sh
npm ci
npm start
npm run ci:check
```

`ci:check` runs ESLint, Jest, content validation, and the production build. `npm run predeploy` also prerenders the landing and faculty jobs pages with React Snap. GitHub Actions handles deployment; a local build does not publish the site.

## Code map

| Location | Responsibility |
| --- | --- |
| `src/App.js` | Routes and lazy loading for the large daily feeds |
| `src/data/routes.js` | Navigation labels and order; intentionally excludes hidden routes such as Statistics |
| `src/pages/` | Page composition, page tools, and page-specific state |
| `src/layouts/PageFrame.js` | Shared document title, description, Helmet provider, and scroll reset |
| `src/layouts/Main.js`, `LandingMain.js` | Standard page shell and animated landing shell |
| `src/components/Template/` | Shared headers, tools, cards, and feed controls |
| `src/components/People/`, `Stats/` | Member cards and the interactive visit trend chart |
| `src/content/` | Data normalization, feed adapters, and people grouping |
| `src/hooks/` | Reusable state and request lifecycles |
| `src/config/visitorApi.js` | Visitor API endpoint shared by the map and statistics page |
| `src/data/` | Editable site content and generated JSON feeds |
| `src/static/css/` | Sass variables, base styles, layouts, components, and page styles |
| `scripts/` | Content validation and Scholar metrics refresh |
| `worker/` | Visitor tracking API and database schema; see its README |
| `src/__tests__/` | Content contracts and page interaction regression tests |

## Common edits

- **Page content:** edit the matching file in `src/data/`. Projects, news, publications, and feed items pass through `src/content/` before rendering. People visibility, section order, and sorting are handled in `src/content/people.js`; member presentation lives in `PersonCard.js`.
- **Routes and navigation:** register the page in `src/App.js`, then update `src/data/routes.js` if it should appear in navigation. Keep large feed imports lazy to avoid loading their JSON on every page.
- **Daily feed controls:** change `useFeedFilters.js` for filtering rules and `FeedFilters.js` for controls. All feeds default to new items within the last 30 days. Clear restores that date window, shows seen items, resets job fit to one, and restores all sources. Preserve each page's input IDs and anchor IDs.
- **Job entries:** edit `JobFeedItem.js`. `pages/_feeds.scss` styles both feeds through the shared `jobs-page` class. `SourceJobsPage.js` adds source selection and source labels; the TTAP page uses the same item component without those labels. Feed adapters must retain canonical source names rather than trust producer labels in JSON.
- **Statistics:** `useVisitorStats.js` owns fetching and cancellation, `visitorStats.js` owns fallback data and normalization, and `TrendChart.js` owns chart interaction. Formatters live in `statsFormatting.js`.
- **Styles:** start with the matching component or page partial. `main.scss` is the entry point; `pages/_academic.scss` lists the academic styles in their existing cascade order. `academic-responsive` and `content-filters` contain shared rules spanning several features. Preserve import order when moving rules, since later declarations intentionally override template styles. Visitor map styles and final feed spacing overrides have their own partials.

Run `npm run ci:check` after changes. For a structural refactor, also compare desktop and mobile pages, including filter reset, card expansion, and chart hover states. Tests using a rolling date window should freeze the clock.

## Configuration

The deployment base path comes from `homepage` in `package.json` and `PUBLIC_URL` in React. Set `REACT_APP_VISITOR_MAP_API_URL` at build time to enable live map/statistics requests. Without it, the map and zeroed statistics remain available.

## Acknowledgements

Based on [mldangelo/personal-site](https://github.com/mldangelo/personal-site) and the Future Imperfect template by HTML5 UP. See the existing license files and stylesheet attribution.
