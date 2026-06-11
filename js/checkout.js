(() => {
    const SHOP_EMAIL = "info@example.com";
    const PICKUP_ADDRESS = "Via da definire, Italy";
    const itemsEl = document.getElementById("checkoutItems");
    const totalEl = document.getElementById("checkoutTotal");
    const formEl = document.getElementById("checkoutForm");
    const statusEl = document.getElementById("checkoutStatus");
    const submitBtn = document.getElementById("placeOrderBtn");
    const shippingFieldsEl = document.getElementById("shippingFields");
    const pickupInfoEl = document.getElementById("pickupInfo");
    const deliveryInputs = formEl ? Array.from(formEl.querySelectorAll('input[name="delivery_method"]')) : [];

    if (!itemsEl || !totalEl) return;

    const { formatPrice, loadCart } = CartUtils;

    function getDeliveryMethod() {
        const selected = deliveryInputs.find((input) => input.checked);
        return selected ? selected.value : "shipping";
    }

    function syncDeliveryMode() {
        if (!formEl || !shippingFieldsEl) return;

        const isPickup = getDeliveryMethod() === "pickup";
        shippingFieldsEl.hidden = isPickup;

        const shippingInputs = Array.from(shippingFieldsEl.querySelectorAll("input"));
        shippingInputs.forEach((input) => {
            input.required = !isPickup;
        });

        if (pickupInfoEl) {
            pickupInfoEl.hidden = !isPickup;
        }
    }

    function openOrderMailDraft(payload) {
        const orderLines = payload.cart
            .map((item) => `- ${item.name} x ${item.quantity}: ${formatPrice(item.price * item.quantity)}`)
            .join("\n");

        const deliveryBlock = payload.deliveryMethod === "pickup" ?
            `Delivery method: Pickup in person\nPickup address:\n${PICKUP_ADDRESS}` :
            `Delivery method: Shipping\nShipping address:\n${payload.addressLine}`;

        const mailBody = [
            `Customer: ${payload.fullName}`,
            `Customer email: ${payload.customerEmail}`,
            "",
            "Order summary:",
            orderLines,
            `Total: ${formatPrice(payload.total)}`,
            "",
            deliveryBlock,
            "",
            "Please confirm this order manually."
        ].join("\n");

        const params = new URLSearchParams({
            subject: `New order - ${payload.fullName || "Customer"}`,
            body: mailBody
        });

        if (payload.customerEmail) {
            params.set("cc", payload.customerEmail);
        }

        window.location.href = `mailto:${encodeURIComponent(SHOP_EMAIL)}?${params.toString()}`;
    }

    function renderCheckout() {
        const cart = loadCart();
        itemsEl.innerHTML = "";

        if (cart.length === 0) {
            itemsEl.innerHTML = '<p class="checkout-empty">Your cart is empty. Go back to store to add products.</p>';
            totalEl.textContent = formatPrice(0);
            if (submitBtn) submitBtn.disabled = true;
            return;
        }

        const fragment = document.createDocumentFragment();

        cart.forEach((item) => {
            const row = document.createElement("div");
            row.className = "checkout-item";
            row.innerHTML = `<span>${item.name} x ${item.quantity}</span><strong>${formatPrice(item.price * item.quantity)}</strong>`;
            fragment.appendChild(row);
        });

        itemsEl.appendChild(fragment);
        totalEl.textContent = formatPrice(CartUtils.getTotal(cart));
        if (submitBtn) submitBtn.disabled = false;
    }

    if (formEl) {
        deliveryInputs.forEach((input) => {
            input.addEventListener("change", syncDeliveryMode);
        });
        syncDeliveryMode();

        formEl.addEventListener("submit", (event) => {
            event.preventDefault();

            const cart = loadCart();
            if (cart.length === 0) return;

            const formData = new FormData(formEl);
            const deliveryMethod = String(formData.get("delivery_method") || "shipping");
            const fullName = String(formData.get("full_name") || "").trim();
            const customerEmail = String(formData.get("email") || "").trim();
            const address = String(formData.get("address") || "").trim();
            const city = String(formData.get("city") || "").trim();
            const zip = String(formData.get("zip") || "").trim();
            const addressLine = [address, zip, city].filter(Boolean).join(", ");
            const total = CartUtils.getTotal(cart);

            CartUtils.clearCart();
            renderCheckout();

            if (statusEl) {
                statusEl.textContent = deliveryMethod === "pickup" ?
                    "Order received. Opened email draft includes pickup address." :
                    "Order received. Opened email draft is ready for confirmation.";
            }

            openOrderMailDraft({
                cart,
                total,
                deliveryMethod,
                fullName,
                customerEmail,
                addressLine
            });

            formEl.reset();
            syncDeliveryMode();
        });
    }

    renderCheckout();
})();