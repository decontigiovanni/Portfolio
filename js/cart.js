(() => {
    const STORAGE_KEY = "gdc_cart_v1";

    const cartPanel = document.getElementById("cartPanel");
    const cartToggle = document.querySelector(".cart-toggle");
    const cartItemsEl = cartPanel ? cartPanel.querySelector(".cart-items") : null;
    const checkoutBtn = cartPanel ? cartPanel.querySelector(".cart-actions .btn-solid") : null;
    const addToCartButtons = Array.from(document.querySelectorAll("[data-add-to-cart]"));

    if (!cartPanel || !cartItemsEl) {
        return;
    }

    function parsePrice(rawValue) {
        if (!rawValue) return 0;
        const normalized = String(rawValue).replace(",", ".").replace(/[^0-9.]/g, "");
        const value = Number.parseFloat(normalized);
        return Number.isFinite(value) ? value : 0;
    }

    function formatPrice(value) {
        return Number.isInteger(value) ? `${value}€` : `${value.toFixed(2).replace(".", ",")}€`;
    }

    function loadCart() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (!Array.isArray(parsed)) return [];
            return parsed.filter((item) => item && item.id && item.name);
        } catch (_error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    function setCheckoutState(cart) {
        if (!checkoutBtn) return;
        const hasItems = cart.length > 0;
        checkoutBtn.disabled = !hasItems;
        checkoutBtn.style.opacity = hasItems ? "1" : "0.55";
        checkoutBtn.style.cursor = hasItems ? "pointer" : "not-allowed";
    }

    function updateCartLabel(cart) {
        if (!cartToggle) return;
        const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        cartToggle.setAttribute("aria-label", count > 0 ? `Open cart (${count} items)` : "Open cart");
    }

    function openCartPanel() {
        if (!cartPanel || !cartToggle) return;
        cartPanel.classList.add("open");
        cartToggle.classList.add("active");
    }

    function goToCheckout() {
        window.location.href = "checkout.html";
    }

    function renderCart() {
        const cart = loadCart();
        cartItemsEl.innerHTML = "";

        if (cart.length === 0) {
            const empty = document.createElement("p");
            empty.className = "cart-empty";
            empty.textContent = "Your cart is empty. Add items to see them here.";
            cartItemsEl.appendChild(empty);
            setCheckoutState(cart);
            updateCartLabel(cart);
            return;
        }

        const fragment = document.createDocumentFragment();

        cart.forEach((item) => {
            const row = document.createElement("article");
            row.className = "cart-item";
            row.dataset.id = item.id;

            const meta = document.createElement("div");
            meta.className = "cart-item__meta";

            const name = document.createElement("p");
            name.className = "cart-item__name";
            name.textContent = item.name;

            const price = document.createElement("p");
            price.className = "cart-item__price";
            price.textContent = `${formatPrice(item.price)} x ${item.quantity}`;

            meta.appendChild(name);
            meta.appendChild(price);

            const controls = document.createElement("div");
            controls.className = "cart-item__controls";

            const dec = document.createElement("button");
            dec.type = "button";
            dec.dataset.action = "dec";
            dec.textContent = "-";

            const qty = document.createElement("span");
            qty.className = "cart-item__qty";
            qty.textContent = String(item.quantity);

            const inc = document.createElement("button");
            inc.type = "button";
            inc.dataset.action = "inc";
            inc.textContent = "+";

            const remove = document.createElement("button");
            remove.type = "button";
            remove.dataset.action = "remove";
            remove.className = "cart-item__remove";
            remove.textContent = "Remove";

            controls.appendChild(dec);
            controls.appendChild(qty);
            controls.appendChild(inc);
            controls.appendChild(remove);

            row.appendChild(meta);
            row.appendChild(controls);
            fragment.appendChild(row);
        });

        const totalRow = document.createElement("div");
        totalRow.className = "cart-total";
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalRow.innerHTML = `<span>Total</span><strong>${formatPrice(total)}</strong>`;
        fragment.appendChild(totalRow);

        cartItemsEl.appendChild(fragment);
        setCheckoutState(cart);
        updateCartLabel(cart);
    }

    function addItem(product) {
        const cart = loadCart();
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        saveCart(cart);
        renderCart();
    }

    cartItemsEl.addEventListener("click", (event) => {
        const actionButton = event.target.closest("button[data-action]");
        if (!actionButton) return;

        const row = actionButton.closest(".cart-item");
        if (!row) return;

        const cart = loadCart();
        const index = cart.findIndex((item) => item.id === row.dataset.id);
        if (index === -1) return;

        const action = actionButton.dataset.action;
        if (action === "inc") {
            cart[index].quantity += 1;
        } else if (action === "dec") {
            cart[index].quantity -= 1;
            if (cart[index].quantity <= 0) cart.splice(index, 1);
        } else if (action === "remove") {
            cart.splice(index, 1);
        }

        saveCart(cart);
        renderCart();
    });

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const product = {
                id: button.dataset.productId || button.dataset.productName || `item-${Date.now()}`,
                name: button.dataset.productName || "Product",
                price: parsePrice(button.dataset.productPrice)
            };

            addItem(product);
            openCartPanel();

            const originalText = button.textContent;
            button.textContent = "Added";
            setTimeout(() => {
                button.textContent = originalText;
            }, 850);
        });
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const cart = loadCart();
            if (cart.length === 0) return;
            goToCheckout();
        });
    }

    window.addEventListener("cart:updated", () => {
        renderCart();
    });

    renderCart();
})();
