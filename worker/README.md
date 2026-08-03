# Visitor map Worker

This Worker records coarse visitor locations and page-view events in Cloudflare D1. It serves the aggregated map points at `/visits` and the hidden statistics page at `/stats`. Cloudflare derives the city and country from the request IP, but the Worker does not store IP addresses.

The map location count is limited by the browser to once every six hours. Page-view events record the normalized path, Cloudflare-provided city/country, and timestamp. An anonymous 30-minute session key shared through browser storage lets the Recent visits list show one entry location and time across tabs and page navigation. Returning after 30 minutes of inactivity creates a new Recent visits row, including when the same machine is used from another location. The summary, trend, and popular-path totals still count every page view. Applying the statistics schema preserves the existing map count as the all-time baseline; time-series and path data begin when the event table is deployed.

## Deploy

1. Authenticate without placing an API key in the repository:

   ```bash
   npx wrangler@3 login
   ```

2. If setting up a new instance, create the database:

   ```bash
   npx wrangler@3 d1 create mlz-em-visitors
   ```

3. Put the returned database ID in `wrangler.toml`. The checked-in configuration already points to the deployed `mlz-em-visitors` database.

4. Apply the schema and deploy from the repository root:

   ```bash
   npx wrangler@3 d1 execute mlz-em-visitors --remote --file=worker/schema.sql --config=worker/wrangler.toml
   npx wrangler@3 deploy --config=worker/wrangler.toml
   ```

5. In the personal-site GitHub repository, create an Actions variable named `VISITOR_MAP_API_URL` containing `https://mlz-em-visitor-map.mlz-em.workers.dev`.

For local site development, copy `.env.example` to `.env.local` and set the same URL.
