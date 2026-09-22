# Bahi Khata — React Frontend

A full React (Vite) web app for **Bahi Khata** — Manoj Kirana Dukan &
Cold Storage — wired to the deployed backend at:

```
https://manoj-kirana.onrender.com/api
```

It's a faithful port of the original mobile-style HTML app: same blue
Zomato-inspired theme, same screens and flows, but built as proper React
components/routes talking to the NestJS API instead of local storage.

## 1. Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The API base
URL is already set in `.env` to the live backend — change it in `.env`
if you want to point at a local backend instead
(`http://localhost:3000/api`).

> Note: Render free-tier services spin down when idle, so the very
> first request after a while can take 30–60 seconds to respond while
> the backend wakes up.

## 2. Build for production

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

`dist/` is a static site — deployable to Vercel, Netlify, GitHub Pages,
Render static sites, etc.

## 3. First-time use

There's no seeded account. Open the app, click **Create an account** on
the login screen, and register a username/password — that hits
`POST /auth/register` on the backend and logs you straight in.

## 4. What's included

- **Auth** — login / register screens, JWT stored in `localStorage`,
  auto-redirect to `/login` on a 401.
- **Firm selection** — Manoj Kirana Dukan / Cold Storage.
- **Kirana Dukan**
  - Customers tab — list with live balances, search, add debit/credit
    entries (auto find-or-create customer, exactly like the original).
  - Customer detail — balance strip, full entry history, generate/view
    invoice or receipt per entry, delete account (only when balanced).
  - Inventory tab — stock list, add items, add/reduce stock, delete.
  - Bills tab — multi-line-item bill builder with live totals,
    optional auto-ledger posting + inventory deduction, sequential
    `INV-0001` numbering.
  - History tab — full ledger across all customers.
  - Bill/Receipt detail — download PDF (jsPDF), download Excel (xlsx),
    send via WhatsApp — generated client-side, same as the original app.
- **Cold Storage**
  - Store select — list with IN/OUT counts, add a store.
  - Store home — IN / OUT / Rent / History tabs, full lot detail
    fields on IN entries, lot-number autocomplete on OUT entries,
    running rent total.

## 5. Project structure

```
src/
  api/            axios client + auth/kirana/cold-storage endpoint wrappers
  context/        AuthContext (login/register/logout, JWT persistence)
  components/     TopBar, Modal, Empty, ProtectedRoute
  pages/
    Login.jsx, Register.jsx, Firms.jsx
    kirana/       KiranaHome, CustomerDetail, modals/
    cold/         StoreSelect, StoreHome, modals/
  utils/          format helpers, PDF/Excel/WhatsApp doc generation
```

## 6. Notes

- This talks to the two-module backend (Kirana Dukan + Cold Storage)
  currently deployed at the URL above. Rice Mill isn't part of that
  backend yet — say the word if you want it added to both.
- Language is English-only here (the original HTML prototype had an
  English/Hindi/Hinglish switch) — can be added back if you want it.
