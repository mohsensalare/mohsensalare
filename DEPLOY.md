# Deploy notes

This repo is both my GitHub **profile** (`README.md` renders on
github.com/mohsensalare) and the **source of [mohsensalare.ir](https://mohsensalare.ir)**,
served by GitHub Pages straight from `main`.

Hand-built static site — plain HTML + one CSS file + one small JS file. No
framework, no build step, no Actions. `.nojekyll` tells Pages to serve every
file as-is.

## Structure
```
index.html                         landing (hero, about, experience, projects, recognition, skills, writing, contact)
blog/
  index.html                       blog list
  why-your-database-is-choking.html
  why-kafka-is-fast.html
  _post-template.html              copy this to start a new post
  _unused/                         drafts NOT published (git-ignored)
assets/
  css/style.css
  js/main.js
  img/                             mohsen.jpg, ai-star-*, blog/*
  MohsenSalari-Resume.pdf
CNAME            custom domain (mohsensalare.ir)
robots.txt       crawl rules + sitemap pointer
sitemap.xml      list of public URLs
.nojekyll        serve files as-is (skip Jekyll)
.gitignore       ignores .DS_Store and blog/_unused/
```

## One-time GitHub setup
1. **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
2. **Settings → Pages → Custom domain → `mohsensalare.ir`** → Save (the `CNAME`
   file already sets this). Tick **Enforce HTTPS** once the cert is issued.
3. At the `.ir` DNS registrar, point the apex at GitHub Pages:
   - **A** `mohsensalare.ir` → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - (optional) **CNAME** `www` → `mohsensalare.github.io`
4. DNS can take a few hours, then it's live at **https://mohsensalare.ir**.

## Add a blog post
1. Copy `blog/_post-template.html` to `blog/my-new-post.html`.
2. Fill in title, date, body, and the SEO block (canonical, og:url, JSON-LD).
3. Add a row at the top of `blog/index.html` and the "Writing" section of `index.html`.
4. Add the new URL to `sitemap.xml`. Commit and push.

## Local preview
```bash
cd /Users/mohsensalare/Documents/site && python3 -m http.server 8080
# → http://localhost:8080
```
