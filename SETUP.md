# PlatMemoir.com — GitHub Pages + GoDaddy

Your iOS app already links to:

- `https://www.platmemoir.com/privacy`
- `https://www.platmemoir.com/support`

This folder is a static site for **GitHub Pages** with custom domain **www.platmemoir.com**.

GitHub username (from your account): **Michael5477**

---

## Step 1 — Create GitHub repository

1. Open https://github.com/new  
2. Repository name: `platmemoir.com` (or `platmemoir-website`)  
3. **Public**  
4. Do **not** add README (we already have files locally)  
5. Create repository  

## Step 2 — Push this folder to GitHub

In Terminal:

```bash
cd ~/Desktop/platmemoir-website
git init
git add .
git commit -m "Add PlatMemoir static site for GitHub Pages"
git branch -M main
git remote add origin https://github.com/Michael5477/platmemoir.com.git
git push -u origin main
```

(Change the remote URL if you used a different repo name.)

## Step 3 — Enable GitHub Pages

1. Repo → **Settings** → **Pages**  
2. **Build and deployment** → Source: **Deploy from a branch**  
3. Branch: **main** → folder **/ (root)** → Save  
4. Wait 1–3 minutes. Site preview: `https://michael5477.github.io/platmemoir.com/` (path depends on repo name)

## Step 4 — Custom domain on GitHub

1. Still under **Pages** → **Custom domain**  
2. Enter: `www.platmemoir.com`  
3. Save → enable **Enforce HTTPS** when it appears (can take up to 24h after DNS)

The file `CNAME` in this repo already contains `www.platmemoir.com`.

## Step 5 — GoDaddy DNS

In GoDaddy → **My Products** → **PlatMemoir.com** → **DNS** → **Manage DNS**

### A) Root domain `platmemoir.com` → GitHub Pages

Add **four** **A** records (Type A, Host `@`, TTL 1 hour):

| Host | Type | Value           |
|------|------|-----------------|
| @    | A    | 185.199.108.153 |
| @    | A    | 185.199.109.153 |
| @    | A    | 185.199.110.153 |
| @    | A    | 185.199.111.153 |

(Remove old A records pointing elsewhere if any.)

### B) `www` subdomain

| Host | Type  | Value                 |
|------|-------|-----------------------|
| www  | CNAME | `michael5477.github.io` |

**Important:** CNAME target is your GitHub **username**.github.io, not the repo name.

### C) Optional — redirect bare domain to www

In GoDaddy **Forwarding** (Domain settings):

- Forward `https://platmemoir.com` → `https://www.platmemoir.com` (301 permanent)

Or rely on GitHub checking both after you add `platmemoir.com` under Custom domain (GitHub may issue certs for apex + www).

## Step 6 — Verify

After DNS propagates (minutes to 48h):

- https://www.platmemoir.com/  
- https://www.platmemoir.com/privacy/  
- https://www.platmemoir.com/support/  

Check DNS: https://www.whatsmydns.net/#CNAME/www.platmemoir.com

## Step 7 — Email (optional)

In GoDaddy you can create `support@platmemoir.com` and forward to your Gmail, then update `support/index.html`.

---

## Updating the site later

```bash
cd ~/Desktop/platmemoir-website
# edit files
git add .
git commit -m "Update site copy"
git push
```

Pages redeploys automatically within a few minutes.
