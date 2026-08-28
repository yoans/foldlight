# Deploy: GitHub Pages, then foldlight.buildbeyondbelief.com

Static Vite app. First ship is the GitHub Pages URL so the site works before DNS.

## 1. GitHub Pages

Repo: `yoans/foldlight`. Pages source = **GitHub Actions** (`.github/workflows/pages.yml`).

Live: **https://yoans.github.io/foldlight/**

## 2. Custom domain (when DNS is ready)

Add `public/CNAME` with:

```
foldlight.buildbeyondbelief.com
```

DNS where `buildbeyondbelief.com` lives:

| Type | Name | Target |
| --- | --- | --- |
| CNAME | `foldlight` | `yoans.github.io` |

Then repo **Settings → Pages → Custom domain** = `foldlight.buildbeyondbelief.com`. Apex stays on the existing host.

## 3. Local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
npm run preview
```

## 4. After it is live

- Send Dave Blair the letter in `outreach/letter-to-dave-blair.md`.
- Add a Work card on buildbeyondbelief.com pointing at the subdomain (public proof, not a product SKU).
