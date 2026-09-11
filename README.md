# AdministrativeDisplacement.org

Source for the public-interest educational site at [AdministrativeDisplacement.org](https://administrativedisplacement.org/).

The site is plain static HTML, CSS, and JavaScript. Page files live at the repository root and in route folders. No compilation step is required. The chronology tool stores participant-entered data only in the visitor's browser local storage; it does not submit entries to a server.

## Cloudflare deployment

- Application: `administrative-displacement`
- Production branch: `main`
- Root directory: repository root
- Build command: none
- Initial deploy command during migration: `npx wrangler@4.50.0 versions upload`
- Non-production deploy command: `npx wrangler@4.50.0 versions upload`

During migration, uploads create testable Worker versions without replacing the active production deployment. After a Git-built version is verified and promoted, the production deploy command can be changed to `npx wrangler@4.50.0 deploy` to enable automatic deployment from `main`.

The production domain and Worker routing are managed in Cloudflare. The root `CNAME` file records the intended canonical domain but does not configure Cloudflare routing.

## Safety and rollback

Do not delete the earlier manually deployed Worker version. Record its version identifier before promoting a replacement so it remains available for rollback.
