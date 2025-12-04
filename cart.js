// cart.js
// Lightweight cart storage in localStorage under "gs_cart".
// Items are objects: { id, title, price, qty, img, meta }

(function () {
  const CART_KEY = "gs_cart";

  // --- Utilities ---
  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateBadge();
  }

  function updateBadge() {
    const countEl = document.getElementById("cartCount");
    if (!countEl) return;
    const cart = readCart();
    const totalQty = cart.reduce((s, it) => s + (Number(it.qty) || 0), 0);

    // If the badge is visible as a numeric circle (your pages vary),
    // set textContent and also aria.
    if (countEl.tagName.toLowerCase() === "span") {
      countEl.textContent = totalQty;
      countEl.setAttribute("aria-label", `${totalQty} items in cart`);
      // for accessibility: if zero, optionally hide with sr-only class or keep 0.
      if (totalQty === 0) {
        // keep it visible but with sr-only if you prefer (your markup uses visible bubble)
        // If you prefer hiding when 0: countEl.style.display = "none";
        // We'll keep it visible with 0 for consistency
      }
    } else {
      countEl.textContent = totalQty;
    }
  }

  function addItem(item) {
    if (!item || !item.id) return;
    const cart = readCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty = Number(existing.qty || 0) + Number(item.qty || 1);
    } else {
      cart.push({
        id: String(item.id),
        title: item.title || "Product",
        price: Number(item.price || 0),
        qty: Number(item.qty || 1),
        img: item.img || "",
        meta: item.meta || {}
      });
    }
    writeCart(cart);
  }

  function removeItem(id) {
    const cart = readCart().filter(i => i.id !== id);
    writeCart(cart);
  }

  function setQuantity(id, qty) {
    const cart = readCart();
    const it = cart.find(x => x.id === id);
    if (it) {
      it.qty = Math.max(0, Number(qty || 0));
      if (it.qty === 0) {
        // remove if zero
        const filtered = cart.filter(x => x.id !== id);
        writeCart(filtered);
        return;
      }
      writeCart(cart);
    }
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateBadge();
  }

  // --- DOM wiring: universal / defensive ---
  function wireAddButtons() {
    // Match buttons whose text includes "add to cart"
    const addBtns = Array.from(document.querySelectorAll("button, a, input[type='button'], input[type='submit']"))
      .filter(el => ((el.textContent || el.value || "").toLowerCase().includes("add to cart")));

    addBtns.forEach(btn => {
      // avoid attaching twice
      if (btn.__gs_cart_attached) return;
      btn.__gs_cart_attached = true;

      btn.addEventListener("click", (ev) => {
        ev.preventDefault();

        // Try to extract product data from the surrounding DOM
        const card = btn.closest("[data-product-id]") || btn.closest(".product-card") || btn.closest("main") || document;
        // read attributes if present
        const pid = (card && card.getAttribute && card.getAttribute("data-product-id")) || (btn.getAttribute && btn.getAttribute("data-product-id")) || (Date.now().toString());
        const titleEl = card.querySelector("h1, h2, h3, .product-title, .title") || document.querySelector("h1") || null;
        const priceEl = card.querySelector("[data-price], .price, .product-price, p") || null;
        let price = 0;
        if (priceEl) {
          const pText = (priceEl.getAttribute("data-price") || priceEl.textContent || "").replace(/[^0-9.\-]/g, "");
          price = parseFloat(pText) || 0;
        }
        const title = (titleEl && (titleEl.textContent || titleEl.innerText).trim()) || (btn.getAttribute("data-title") || "Product");

        // optionally pick up image
        const imgEl = card.querySelector("img") || null;
        const img = imgEl ? (imgEl.src || imgEl.getAttribute("data-src") || "") : "";

        addItem({
          id: String(pid),
          title,
          price,
          qty: 1,
          img
        });

        // give quick visual feedback
        btn.classList.add("opacity-80");
        setTimeout(() => btn.classList.remove("opacity-80"), 300);

        // small toast (non-blocking)
        showToast(`${title} added to cart`);
      });
    });
  }

  function wireCartButton() {
    const cartBtn = document.getElementById("cartBtn");
    if (!cartBtn) return;
    cartBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      // go to the cart page
      window.location.href = "shopping_cart_page.html";
    });
  }

  // Small toast helper
  function showToast(msg) {
    if (!msg) return;
    const id = "gs-cart-toast";
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.style.position = "fixed";
      el.style.bottom = "28px";
      el.style.left = "50%";
      el.style.transform = "translateX(-50%)";
      el.style.zIndex = 99999;
      el.style.background = "rgba(22,22,22,0.9)";
      el.style.color = "#fff";
      el.style.padding = "10px 14px";
      el.style.borderRadius = "999px";
      el.style.fontSize = "14px";
      el.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    setTimeout(() => {
      el.style.transition = "opacity 400ms";
      el.style.opacity = "0";
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 420);
    }, 900);
  }

  // Expose small API and wire on load
  function init() {
    // update badge initially
    updateBadge();

    // wire add-to-cart buttons and cart button
    document.addEventListener("DOMContentLoaded", () => {
      wireAddButtons();
      wireCartButton();
    });

    // also run a short-timeout in case DOM is already ready
    setTimeout(() => {
      wireAddButtons();
      wireCartButton();
    }, 50);

    // global API for debug / other pages
    window.GS_CART = {
      addItem,
      removeItem,
      setQuantity,
      readCart,
      clearCart
    };
  }

  init();
})();
