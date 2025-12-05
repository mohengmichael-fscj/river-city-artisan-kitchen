// Simple front-end cart + form handling for demo purposes

(function () {
  const CART_KEY = "rcak-demo-cart";

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore for demo
    }
  }

  function updateCartCount(cart) {
    const countEl = document.getElementById("cart-count");
    if (!countEl) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = String(totalItems);
  }

  function renderCartSummary(cart) {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!container || !totalEl) return;

    if (!cart.length) {
      container.innerHTML = "<p>Your cart is currently empty.</p>";
      totalEl.textContent = "";
      return;
    }

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item-row";

      const name = document.createElement("span");
      name.className = "cart-item-name";
      name.textContent = `${item.name} × ${item.quantity}`;

      const price = document.createElement("span");
      const itemTotal = item.quantity * item.price;
      total += itemTotal;
      price.textContent = `$${itemTotal.toFixed(2)}`;

      row.appendChild(name);
      row.appendChild(price);
      container.appendChild(row);
    });

    totalEl.textContent = `Estimated subtotal: $${total.toFixed(2)} (demo only)`;
  }

  function attachAddToCartHandlers(cart) {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-product") || "Bakery item";
        const price = parseFloat(btn.getAttribute("data-price") || "0");
        if (!name || !price) return;

        const existing = cart.find((item) => item.name === name);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ name, price, quantity: 1 });
        }

        saveCart(cart);
        updateCartCount(cart);
        renderCartSummary(cart);

        btn.blur();
      });
    });
  }

  function attachFormHandlers() {
    const forms = document.querySelectorAll(".js-form");
    forms.forEach((form) => {
      const statusEl = form.querySelector(".form-status");

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          // Let browser show validation messages
          return;
        }

        if (statusEl) {
          statusEl.textContent =
            "Thank you! This form is part of a course project and does not send data.";
        }
        form.reset();
      });
    });
  }

  function injectYear() {
    const yearEls = document.querySelectorAll("#year");
    const year = new Date().getFullYear();
    yearEls.forEach((el) => {
      el.textContent = String(year);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const cart = loadCart();
    updateCartCount(cart);
    renderCartSummary(cart);
    attachAddToCartHandlers(cart);
    attachFormHandlers();
    injectYear();
  });
})();
