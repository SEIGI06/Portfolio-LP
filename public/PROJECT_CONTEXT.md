# PROJECT CONTEXT & ARCHITECTURE

> **AI INSTRUCTION**: Read this file first when starting a new session on this project. It contains the Source of Truth for the architecture, database, and recurrent issues.

## 1. Project Overview

- **Type**: Portfolio & Documentation Site
- **Stack**: HTML5, CSS3 (Vanilla + Variables), JavaScript (Vanilla ES6+).
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage).
- **Hosting**: Vercel (Automatic deployments via GitHub).
- **URL Strategy**: SPA-like feel with URL Rewriting for SEO-friendly links (e.g., `/doc/my-slug`).
- **Production URL**: `https://seigi-tech.fr`

## 2. Architecture

### Frontend

- **Structure**: Multi-page site (`index.html`, `projets.html`, `documentation.html`, etc.).
- **Shared Components**: `js/components.js` injects the Header (Nav) and Footer into all pages dynamically.
- **Styling**:
  - `css/base.css`: CSS Variables (Colors, Spacing), Typography, Reset.
  - `css/layout.css`: Grid system, Containers, Animations (`fade-in-up`).
  - `css/components.css`: Buttons, Cards, Badges, Inputs.
- **Assets**: CSS/JS paths must be **ABSOLUTE** (e.g., `/css/base.css`) to support URL rewriting deep links.

### Backend (Supabase)

- **Client**: `js/supabase-client.js` (Public read-only operations).
- **Admin API**: `js/admin-api.js` (Protected write operations, requires Auth).
- **Security**: Row Level Security (RLS) is ENFORCED.
  - `Public`: SELECT only on specific tables/rows (e.g., `is_published = true`).
  - `Authenticated`: FULL CRUD access.

## 3. Database Schema

_(As of Jan 2026)_

### Tables

1.  **`projects`**:
    - `id` (uuid), `title` (text), `description` (text), `image_url` (text), `category` (text), `created_at`.
2.  **`veilles`** (Technology Watch):
    - `id`, `title`, `description`, `date`, `source_url`.
3.  **`certifications`**:
    - `id`, `title`, `issuer`, `date`, `image_url` (storage path).
4.  **`documentations`** (The Blog/Wiki):
    - `id` (uuid)
    - `title` (text)
    - `slug` (text, unique) -> Used in URLs `/doc/:slug`
    - `content` (text, Markdown format)
    - `is_published` (bool) -> **CRITICAL**: Only true records are visible efficiently.
    - `category_id` (uuid, fk -> doc_categories)
5.  **`doc_categories`**:
    - `id`, `name`.

### Storage Buckets

- `project-images`: Public.
- `certifications`: Public.
- `documentation-images`: Public (for article content).

## 4. Key Features Implementation

### Documentation System (`documentation.html` + `js/documentation.js`)

- **Routing**: Handles both `/documentation.html` (List) and `/doc/:slug` (Detail).
- **URL Rewriting**: Configured in `vercel.json` (`source: "/doc/:slug", destination: "/documentation.html"`).
- **Rendering**:
  - **List Mode**: Displays grid of cards (Categories on sidebar).
  - **Read Mode**: **Full Width** layout (Sidebar hidden). Updates `document.title` and `<meta description>` for SEO.
- **Markdown**: Uses `marked.js` for parsing and `highlight.js` for code syntax highlighting.

### Admin Panel (`admin.html`)

- **Authentication**: Supabase Auth (Email/Password).
- **Features**: CRUD for Projects, Veille, Certifs, and Docs.
- **Editor**: Simple textarea for Markdown.

## 5. Recurrent Bugs & "Gotchas" (HISTORY)

### 🔴 Critical: The "Invisible" Articles

- **Symptoms**: Data loads (visible in console/DOM) but screen is blank/empty.
- **Cause**: The CSS class `.fade-in-up` sets `opacity: 0` and waits for an IntersectionObserver to add `.is-visible`. If dynamic JS injects elements without triggering the observer, they stay invisible.
- **Fix**: **Do not use `.fade-in-up` on dynamically injected content** (like documentation list/articles) unless you manually trigger the visibility logic.

### 🔴 Critical: The "White Page" on Deep Links

- **Symptoms**: Navigation works, but refreshing `/doc/some-article` gives an unstyled white page.
- **Cause**: Relative paths in HTML (`href="css/style.css"`). In `/doc/slug`, browser looks in `/doc/css/style.css` (404).
- **Fix**: ALWAYS use **Absolute Paths** (`href="/css/style.css"`) in ALL HTML files.

### 🔴 CSP (Content Security Policy) Blocks

- **Symptoms**: Red errors in console "Blocked by Content Security Policy". Styles or Scripts don't load.
- **Cause**: Strict `vercel.json` CSP rules.
- **Fix**:
  - `script-src`: Allow `cdn.jsdelivr.net`, `cdnjs.cloudflare.com`.
  - `style-src`: Allow `cdn.jsdelivr.net`, `fonts.googleapis.com`.

### 🔴 Supabase Client Error

- **Symptoms**: `TypeError: ...count is not a function`.
- **Cause**: Invalid chaining in older/newer Supabase JS client versions.
- **Fix**: Do not chain `.count()` directly on complex queries unnecessarily.

## 6. Deployment

- **Platform**: Vercel.
- **Config**: `vercel.json` is vital for:
  - CSP Headers (Security).
  - Rewrites (Clean URLs).
- **Process**: Push to `main` branch on GitHub -> Vercel builds automatically.
