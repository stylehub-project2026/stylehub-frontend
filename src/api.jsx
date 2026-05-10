export const USE_BACKEND = false;
export const API_BASE = "/api";

async function request(method, path, body = null) {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem("stylehub-token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, {
        method, headers,
        body: body ? JSON.stringify(body) : null,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || "API error");
    }
    return res.json();
}

const api = {
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body),
    put: (path, body) => request("PUT", path, body),
    patch: (path, body) => request("PATCH", path, body),
    delete: (path) => request("DELETE", path),
};

export async function signIn({ email, password }) {
    const user = { id: "local-user", name: "Guest", email };
    localStorage.setItem("stylehub-user", JSON.stringify(user));
    return { user, token: "local-token" };
}

export async function signUp({ name, email, password }) {
    const user = { id: "local-user", name, email };
    localStorage.setItem("stylehub-user", JSON.stringify(user));
    return { user, token: "local-token" };
}

export function signOut() {
    localStorage.removeItem("stylehub-token");
    localStorage.removeItem("stylehub-user");
}

export function getCurrentUser() {
    try {
        const raw = localStorage.getItem("stylehub-user");
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

export async function sellerSignIn({ email, password }) {
    localStorage.setItem("stylehub-seller-logged-in", "true");
    return { success: true };
}

export function sellerSignOut() {
    localStorage.removeItem("stylehub-seller-token");
    localStorage.removeItem("stylehub-seller-logged-in");
    localStorage.removeItem("stylehub-seller-user");
    localStorage.removeItem("token");
}

export function isSellerLoggedIn() {
    return !!localStorage.getItem("stylehub-seller-user");
}

export async function getCart() {
    try { return JSON.parse(localStorage.getItem("stylehub-cart") || "[]"); }
    catch { return []; }
}

export async function saveCart(cartItems) {
    localStorage.setItem("stylehub-cart", JSON.stringify(cartItems));
    return cartItems;
}

export async function addToCart(cartItems, { id, size, qty = 1 }) {
    const existing = cartItems.find(x => x.id === id && x.size === size);
    const updated = existing
        ? cartItems.map(x => x.id === id && x.size === size ? { ...x, qty: x.qty + qty } : x)
        : [...cartItems, { id, size, qty }];
    await saveCart(updated);
    return updated;
}

export async function removeFromCart(cartItems, { id, size }) {
    const updated = cartItems.filter(x => !(x.id === id && x.size === size));
    await saveCart(updated);
    return updated;
}

export async function updateCartQty(cartItems, { id, size, qty }) {
    const updated = qty < 1
        ? cartItems.filter(x => !(x.id === id && x.size === size))
        : cartItems.map(x => x.id === id && x.size === size ? { ...x, qty } : x);
    await saveCart(updated);
    return updated;
}

export async function clearCart() {
    await saveCart([]);
    return [];
}

export async function getWishlist() {
    try { return JSON.parse(localStorage.getItem("stylehub-wish") || "[]"); }
    catch { return []; }
}

export async function saveWishlist(ids) {
    localStorage.setItem("stylehub-wish", JSON.stringify(ids));
    return ids;
}

export async function toggleWishlist(currentIds, productId) {
    const updated = currentIds.includes(productId)
        ? currentIds.filter(x => x !== productId)
        : [...currentIds, productId];
    await saveWishlist(updated);
    return updated;
}

export async function placeOrder(orderData) {
    const orders = orderData.brandOrders.map(b => ({
        brand: b.brand,
        orderNumber: `SH-${b.brand.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        status: "confirmed",
    }));
    const history = JSON.parse(localStorage.getItem("stylehub-orders") || "[]");
    localStorage.setItem("stylehub-orders", JSON.stringify([...history, { ...orderData, orders, date: new Date().toISOString() }]));
    return { orders };
}

export async function getOrderHistory() {
    try { return JSON.parse(localStorage.getItem("stylehub-orders") || "[]"); }
    catch { return []; }
}

export async function getSellerDashboard() {
    return { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, products: [] };
}

export async function getSellerOrders() { return []; }

export async function updateOrderStatus(orderId, status) { return { orderId, status }; }

export async function addSellerProduct(product) { return { ...product, id: Date.now() }; }

export async function updateSellerProduct(productId, updates) { return { id: productId, ...updates }; }

export async function deleteSellerProduct(productId) { return { success: true }; }

export async function searchProducts(query) { return null; }

export async function subscribeNewsletter(email) { return { success: true }; }

export async function submitContactForm({ name, email, message }) { return { success: true }; }

/* ─── Real Backend API ─── */
const BACKEND_BASE = "https://stylehub-backend-ten.vercel.app/api";

async function backendRequest(method, path, body = null) {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BACKEND_BASE}${path}`, {
        method, headers,
        body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
}

async function sellerBackendRequest(method, path, body = null) {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem("sellerToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BACKEND_BASE}${path}`, {
        method, headers,
        body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
}

export const authAPI = {
    signin: (email, password) =>
        backendRequest("POST", "/customer/auth/signin", { email, password }),

    signup: (firstName, lastName, email, password) =>
        backendRequest("POST", "/customer/auth/signup", { firstName, lastName, email, password }),

    googleAuth: (idToken) =>                                          // ← NEW
        backendRequest("POST", "/customer/auth/google", { idToken }), // ← NEW

    forgotPassword: (email) =>
        backendRequest("POST", "/customer/auth/forgot-password", { email }),

    resetPassword: (token, newPassword) =>
        backendRequest("POST", "/customer/auth/reset-password", { token, newPassword }),

    getMe: () =>
        backendRequest("GET", "/customer/auth/me"),
};

export const sellerAuthAPI = {
    signin: (email, password) =>
        sellerBackendRequest("POST", "/seller/auth/signin", { email, password }),

    signup: (brandName, email, password, phone, description, clothingCategories) =>
        sellerBackendRequest("POST", "/seller/auth/signup", { brandName, email, password, phone, description, category: "all", clothingCategories }),

    forgotPassword: (email) =>
        sellerBackendRequest("POST", "/seller/auth/forgot-password", { email }),

    resetPassword: (token, newPassword) =>
        sellerBackendRequest("POST", "/seller/auth/reset-password", { token, newPassword }),

    getMe: () =>
        sellerBackendRequest("GET", "/seller/auth/me"),
};