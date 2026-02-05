// Utility functions shared across cart and checkout modules
const CartUtils = (() => {
    const STORAGE_KEY = "gdc_cart_v1";

    const parsePrice = (rawValue) => {
        if (!rawValue) return 0;
        const normalized = String(rawValue).replace(",", ".").replace(/[^0-9.]/g, "");
        const value = Number.parseFloat(normalized);
        return Number.isFinite(value) ? value : 0;
    };

    const formatPrice = (value) => {
        return Number.isInteger(value) ? `${value}€` : `${value.toFixed(2).replace(".", ",")}€`;
    };

    const loadCart = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(parsed) ? parsed.filter((item) => item && item.id && item.name) : [];
        } catch (_error) {
            return [];
        }
    };

    const saveCart = (cart) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    };

    const getTotal = (cart) => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const clearCart = () => {
        saveCart([]);
        window.dispatchEvent(new Event("cart:updated"));
    };

    return {
        STORAGE_KEY,
        parsePrice,
        formatPrice,
        loadCart,
        saveCart,
        getTotal,
        clearCart
    };
})();
