# Visitor map Worker

This Worker records coarse visitor locations in Cloudflare D1 and returns the aggregated points used by the site's locally rendered map. It does not store IP addresses.

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
