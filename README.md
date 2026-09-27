# The Valley — Listings Dashboard

A static, no-build listings site for Muhammad Hafeez (Valley Specialist, Coldwell Banker Swap Real Estate). Built with React + Tailwind CSS, both loaded from CDN — no `npm install` or build step required.

## Files

- `index.html` — page shell, loads React/Tailwind/Babel from CDN
- `app.jsx` — all components (hero, filters, property cards, detail modal, clusters, footer)
- `data.js` — sample property, cluster, and agent data (**edit this to update listings**)
- `styles.css` — animations and small styling touches Tailwind's CDN build doesn't cover

## Run it locally

Any static file server works, e.g. with Python:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173`.

## Deploy to GitHub Pages

1. Create a new GitHub repo and push these files to the `main` branch.
2. In the repo: **Settings → Pages → Source** → select branch `main`, folder `/ (root)`.
3. Save. GitHub gives you a URL like `https://<username>.github.io/<repo>/` within a minute or two.

No build/CI step is needed — Pages serves the static files directly.

## Updating listings (until the Excel pipeline is wired up)

Open `data.js` and edit the `PROPERTIES` array. Each entry maps directly to the future Excel columns:

| Excel column | `data.js` field |
|---|---|
| Property ID | `id` |
| Property Name | `name` |
| Cluster/Location | `cluster` (must match a `CLUSTERS[].id`) |
| Property Type | `type` |
| Bedrooms | `bedrooms` |
| Bathrooms | `bathrooms` |
| Size (sqft) | `size` |
| Price | `price` |
| Status | `status` (`Available` \| `Sold` \| `Rent`) |
| Description | `description` |
| Key Features | `features` (array) |
| Image URLs | `images` (array) |
| Amenities | cluster-level, in `CLUSTERS[].amenities` |

`listedDate` (YYYY-MM-DD) drives the "New" badge and the "Newest" sort. `featured: true` puts a property in the "Featured This Week" row.

To add a new cluster, add an entry to `CLUSTERS` with a unique `id`, then reference that `id` in properties.

When ready to automate this from the real Excel file, export each sheet row to a JSON object matching the shape above and generate `data.js` (or fetch a hosted JSON/CSV at page load instead of a static file) — no other file needs to change.

## Notes

- All property data, prices, and photos included are **placeholder/demo content** — replace before sharing with clients.
- Contact buttons use `wa.me` (WhatsApp) and `mailto:` links pre-filled with the property name — update the phone/email in `data.js` (`AGENT` object).
- Theme (light/dark) is remembered per-visitor via `localStorage`.
