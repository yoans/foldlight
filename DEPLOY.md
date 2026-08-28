# Deploy: GitHub Pages, then foldlight.buildbeyondbelief.com

Static Vite app. Live now on GitHub Pages from the `gh-pages` branch (the GitHub token could not push Actions workflow files).

## 1. Live

- Site: **https://yoans.github.io/foldlight/**
- Repo: https://github.com/yoans/foldlight

Rebuild and republish:

```bash
npm run build
npx gh-pages -d dist --dotfiles
```

## 2. Custom domain (when DNS is ready)

Same pattern as `excavation.buildbeyondbelief.com`.

DNS where `buildbeyondbelief.com` lives (Cloudflare):

| Type | Name | Target |
| --- | --- | --- |
| CNAME | `foldlight` | `yoans.github.io` |

Then add `public/CNAME` with `foldlight.buildbeyondbelief.com`, rebuild, republish, and set the custom domain in repo Settings → Pages.

Apex `buildbeyondbelief.com` stays on the existing host.

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
