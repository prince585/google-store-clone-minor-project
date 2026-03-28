# Google Store Clone

A responsive front-end clone of the [Google Store](https://store.google.com) built with plain HTML, Tailwind CSS (CDN), and Vanilla JavaScript as a minor group project.

---

## ✨ Features

- **Multi-page store experience** — homepage, product listing, product detail, cart, checkout, and sign-in
- **Authentication (demo)** — sign-in / sign-out flow persisted in `localStorage` via `auth.js`; user initials shown in the header after login
- **Shopping cart** — add-to-cart, quantity management, item removal, and a live item-count badge, all stored in `localStorage` via `cart.js`
- **Toast notifications** — non-blocking popup confirms when an item is added to the cart
- **Dark / Light mode** — every page supports a `dark` class toggle on the `<html>` element
- **Fully responsive** — mobile-first layouts using Tailwind's responsive utility classes; no horizontal overflow on small screens

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) (loaded via CDN) |
| Icons | [Material Symbols Outlined](https://fonts.google.com/icons) |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Google Fonts) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | `localStorage` (auth state & cart state) |

No build step or package manager is required — everything runs directly in the browser.

---

## 📁 Project Structure

```
google-store-clone-minor-project/
├── index.html                  # Project showcase / team landing page
├── google_store_homepage.html  # Main store homepage
├── product_listing_page.html   # Product listing (Phones, Earbuds, Watches …)
├── product_detail_page.html    # Individual product detail (Pixel 8 Pro)
├── sign_in.html                # Sign-in / Sign-up page
├── shopping_cart_page.html     # Shopping cart
├── checkout_mockup_page.html   # Checkout (mockup)
├── auth.js                     # Auth helper — localStorage-based session
└── cart.js                     # Cart helper — add / remove / quantity / badge
```

---

## 🚀 Getting Started

Because the project is pure HTML/CSS/JS with no server-side dependencies, you can run it in several ways:

### Option 1 — Open directly in a browser

```bash
# Clone the repository
git clone https://github.com/prince585/google-store-clone-minor-project.git
cd google-store-clone-minor-project

# Open the entry point in your default browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

### Option 2 — Use a local dev server (recommended)

Using [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer):

1. Open the project folder in VS Code.
2. Right-click `index.html` → **Open with Live Server**.

Or with `npx`:

```bash
npx serve .
```

Then navigate to `http://localhost:3000` (or whichever port is shown).

---

## 🗺 Page Walkthrough

| Page | File | Description |
|------|------|-------------|
| Showcase | `index.html` | Team intro with animated Google-colored title and a button to enter the store |
| Homepage | `google_store_homepage.html` | Hero banner, featured product categories, promotional cards |
| Product Listing | `product_listing_page.html` | Filterable grid of Google Store products |
| Product Detail | `product_detail_page.html` | Full detail view for the Pixel 8 Pro — images, specs, color picker, Add to Cart |
| Sign In | `sign_in.html` | Email/password form + Google & Apple OAuth buttons (demo — uses `auth.js`) |
| Shopping Cart | `shopping_cart_page.html` | Cart items, quantity controls, order summary |
| Checkout | `checkout_mockup_page.html` | Multi-step checkout mockup (shipping, payment, confirmation) |

---

## 🔑 Auth Flow (Demo)

`auth.js` provides a lightweight, localStorage-only authentication simulation:

- **Sign in** — enter any email address; a fake user object is saved under the key `gs_user`.
- **Signed-in state** — the header shows the user's initial inside a colored circle.
- **Sign out** — available via the drop-down menu in the header; clears `gs_user` and redirects to the homepage.
- **Redirect support** — the sign-in page reads a `?next=` query parameter so deep links work after login.

> ⚠️ This is a **demo only**. No real credentials are validated or stored on a server.

---

## 🛒 Cart Flow

`cart.js` manages the cart entirely in `localStorage` under the key `gs_cart`:

- Items are stored as `{ id, title, price, qty, img, meta }`.
- Any button whose visible text contains **"Add to Cart"** is automatically wired up.
- The cart badge (`#cartCount`) updates instantly across page navigations.
- A brief toast notification confirms each add-to-cart action.
- The global `window.GS_CART` API (`addItem`, `removeItem`, `setQuantity`, `readCart`, `clearCart`) is exposed for debugging.

---

## 👥 Development Team

| Name | Roll No. | Page |
|------|----------|------|
| **Prince Verma** | 0714CS231087 | Homepage *(Lead)* |
| **Rohit Yadav** | 0714CS231100 | Product Listing Page |
| **Aman Gayakwad** | 0714CS231014 | Product Details Page |
| **Shezan Khan** | 0714CS231109 | Sign In / Sign Up Page |
| **Nabil Shaikh** | 0714CS231071 | Shopping Cart Page |
| **Pranjay Sunehriya** | 0714CS231084 | Checkout Page |

---

## 📄 License

This project was created for educational purposes as a minor academic project. All Google branding, product names, and trademarks belong to Google LLC.
