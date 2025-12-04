// auth.js
// Lightweight auth helper for local-development demo.
// Places user info in localStorage under "gs_user".

(function () {
  const USER_KEY = "gs_user";

  // --- Utilities ---
  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch {
      return null;
    }
  }

  function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    updateUI();
  }

  function clearUser() {
    localStorage.removeItem(USER_KEY);
    updateUI();
  }

  function formatName(email) {
    if (!email) return "";
    const namePart = email.split("@")[0];
    return namePart.replace(/[._\-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  // --- UI wiring ---
  function updateUI() {
    const user = getUser();

    // userDisplay may be a button or div that exists in header
    const userDisplay = document.getElementById("userDisplay");
    if (!userDisplay) return;

    // clear existing attached menu
    const existingMenu = document.getElementById("gs-auth-menu");
    if (existingMenu) existingMenu.remove();

    if (!user) {
      // show generic icon / navigate to sign_in.html on click
      userDisplay.innerHTML = `<span class="material-symbols-outlined">account_circle</span>`;
      userDisplay.title = "Sign in / Account";
      userDisplay.onclick = () => {
        // go to sign in page (file name provided)
        window.location.href = "sign_in.html";
      };
    } else {
      // show user initial / name & small menu on click
      const initial = (user.name && user.name[0]) || (user.email && user.email[0].toUpperCase()) || "U";
      userDisplay.innerHTML = `<span class="inline-flex h-full w-full items-center justify-center rounded-full bg-primary text-white font-medium">${initial}</span>`;
      userDisplay.title = user.email;

      // create simple menu
      userDisplay.onclick = (e) => {
        // toggle menu
        if (document.getElementById("gs-auth-menu")) {
          document.getElementById("gs-auth-menu").remove();
          return;
        }

        const menu = document.createElement("div");
        menu.id = "gs-auth-menu";
        menu.style.minWidth = "160px";
        menu.style.position = "absolute";
        menu.style.zIndex = 9999;
        menu.style.right = "12px";
        menu.style.top = (userDisplay.getBoundingClientRect().bottom + window.scrollY + 8) + "px";
        menu.style.background = getComputedStyle(document.body).backgroundColor || "#fff";
        menu.style.border = "1px solid rgba(0,0,0,0.08)";
        menu.style.borderRadius = "8px";
        menu.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
        menu.style.padding = "8px";

        menu.innerHTML = `
          <div style="padding:8px 12px; border-bottom:1px solid rgba(0,0,0,0.04);">
            <div style="font-weight:600;">${user.name || formatName(user.email)}</div>
            <div style="font-size:12px; color: #6b7280;">${user.email}</div>
          </div>
          <div style="display:flex;flex-direction:column;padding:8px;">
            <a id="gs-menu-orders" style="padding:8px 6px;cursor:pointer;border-radius:6px;text-decoration:none;color:inherit;">My Orders</a>
            <a id="gs-menu-signout" style="padding:8px 6px;cursor:pointer;border-radius:6px;text-decoration:none;color:inherit;">Sign out</a>
          </div>
        `;

        document.body.appendChild(menu);

        // Hook menu actions
        document.getElementById("gs-menu-signout").onclick = () => {
          clearUser();
          menu.remove();
          // optional: redirect to homepage
          window.location.href = "google_store_homepage.html";
        };
        document.getElementById("gs-menu-orders").onclick = () => {
          // placeholder: route to orders or checkout mockup
          window.location.href = "checkout_mockup_page.htm";
        };

        // close on outside click
        const closeOnClick = (ev) => {
          if (!menu.contains(ev.target) && ev.target !== userDisplay) {
            menu.remove();
            window.removeEventListener("click", closeOnClick);
          }
        };
        window.addEventListener("click", closeOnClick);
      }; // end onclick
    }
  } // end updateUI

  // --- Sign in page wiring ---
  function wireSignInPage() {
    // try to find a sign-in form/button on sign_in.html
    // prefer button whose text includes "Sign In" (case-insensitive)
    const signButtons = Array.from(document.querySelectorAll("button, input[type='button'], input[type='submit']"))
      .filter(b => (b.textContent || b.value || "").toLowerCase().includes("sign in") || (b.getAttribute("aria-label") || "").toLowerCase().includes("sign in"));

    // fallback: first button
    const signBtn = signButtons[0] || document.querySelector("button");
    if (!signBtn) return;

    signBtn.addEventListener("click", (ev) => {
      ev.preventDefault();

      // Attempt to collect email input
      const emailInput = document.querySelector("input[type='email'], input[name='email'], input[placeholder*='email' i]");
      const passwordInput = document.querySelector("input[type='password'], input[name='password']");

      const email = emailInput ? (emailInput.value || emailInput.getAttribute("value") || "").trim() : "";
      const password = passwordInput ? (passwordInput.value || "") : "";

      // Naive validation for demo:
      if (!email) {
        // If there's a visible inline validation element, display; otherwise alert.
        alert("Please enter an email to sign in (demo).");
        return;
      }

      // Create a fake user object and persist
      const user = {
        email,
        name: formatName(email),
        signedAt: new Date().toISOString()
      };

      setUser(user);

      // If the sign in page was opened directly, go back to homepage or referrer
      const redirectTo = (new URLSearchParams(window.location.search)).get("next") || "google_store_homepage.html";
      window.location.href = redirectTo;
    });
  }

  // --- Initialization ---
  function init() {
    updateUI();

    // if we're on sign_in.html, wire the sign in form
    const path = window.location.pathname.split("/").pop();
    if (path === "sign_in.html" || path === "sign-in.html") {
      document.addEventListener("DOMContentLoaded", wireSignInPage);
      // also run immediately in case DOM already loaded
      setTimeout(wireSignInPage, 50);
    }

    // expose a global small API for dev/test
    window.GS_AUTH = {
      getUser,
      setUser,
      clearUser,
    };
  }

  // run
  init();
})();
