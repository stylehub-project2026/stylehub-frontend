import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SHNav, SHFooter, SHARED_CSS } from "./shared";

const API = "https://stylehub-backend-tau.vercel.app/api";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

.pf-page { min-height:100vh; background:var(--cream); }
.pf-shell { max-width:900px; margin:0 auto; padding:3rem 2rem 6rem; }

.pf-header { display:flex; align-items:center; gap:1.5rem; margin-bottom:2rem; }
.pf-avatar { width:60px; height:60px; border-radius:50%; background:var(--dark); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:1.5rem; flex-shrink:0; }
.pf-name { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:400; color:var(--dark); }
.pf-email { font-size:.75rem; color:var(--warm); margin-top:.1rem; }

.pf-points-banner { background:var(--dark); color:#fff; border-radius:14px; padding:1.5rem 2rem; margin-bottom:1.8rem; display:flex; align-items:center; justify-content:space-between; gap:1.5rem; position:relative; overflow:hidden; }
.pf-points-banner::before { content:''; position:absolute; top:-30px; right:-30px; width:150px; height:150px; border-radius:50%; background:rgba(146,160,121,.12); }
.pf-points-banner::after { content:''; position:absolute; bottom:-50px; left:35%; width:180px; height:180px; border-radius:50%; background:rgba(146,160,121,.07); }
.pf-pts-left { position:relative; z-index:1; }
.pf-pts-label { font-size:.58rem; letter-spacing:.25em; text-transform:uppercase; color:rgba(255,255,255,.5); margin-bottom:.3rem; }
.pf-pts-val { font-family:'Cormorant Garamond',serif; font-size:3rem; font-weight:300; line-height:1; }
.pf-pts-sub { font-size:.65rem; color:rgba(255,255,255,.5); margin-top:.3rem; }
.pf-pts-right { position:relative; z-index:1; text-align:right; }
.pf-pts-disc-label { font-size:.65rem; color:rgba(255,255,255,.6); }
.pf-pts-disc { font-family:'Cormorant Garamond',serif; font-size:1.6rem; color:#92A079; }
.pf-pts-note { font-size:.58rem; color:rgba(255,255,255,.4); margin-top:.2rem; }

.pf-tabs { display:flex; border-bottom:1px solid var(--border); margin-bottom:2rem; }
.pf-tab { padding:.7rem 1.2rem; font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; color:var(--warm); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .2s; background:none; border-top:none; border-left:none; border-right:none; font-family:'DM Sans',sans-serif; }
.pf-tab:hover { color:var(--dark); }
.pf-tab.on { color:var(--dark); border-bottom-color:var(--dark); font-weight:600; }

.pf-card { background:#fff; border:1px solid var(--border); border-radius:12px; padding:1.5rem 2rem; margin-bottom:1.2rem; }
.pf-card-title { font-size:.58rem; letter-spacing:.2em; text-transform:uppercase; color:var(--warm); font-weight:600; margin-bottom:1.2rem; }

.order-item { border:1px solid var(--border); border-radius:10px; padding:1.2rem 1.4rem; margin-bottom:.9rem; }
.order-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:.8rem; flex-wrap:wrap; gap:.5rem; }
.order-id { font-size:.72rem; font-weight:700; color:var(--dark); }
.order-date { font-size:.62rem; color:var(--warm); margin-top:.1rem; }
.order-status { display:inline-block; padding:.22rem .65rem; border-radius:20px; font-size:.58rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
.order-status.pending { background:#fff3cd; color:#856404; }
.order-status.confirmed { background:#d1ecf1; color:#0c5460; }
.order-status.shipped { background:#cce5ff; color:#004085; }
.order-status.delivered { background:#d4edda; color:#155724; }
.order-status.cancelled { background:#f8d7da; color:#721c24; }
.order-products { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:.8rem; }
.order-img { width:50px; height:62px; object-fit:cover; border-radius:6px; background:#f0ece6; }
.order-footer { display:flex; justify-content:space-between; align-items:center; }
.order-total { font-size:.82rem; font-weight:700; color:var(--dark); }
.order-pay { font-size:.62rem; color:var(--warm); margin-top:.1rem; }
.order-cancel-btn { background:none; border:1px solid var(--border); padding:.28rem .75rem; font-size:.6rem; color:var(--warm); cursor:pointer; border-radius:6px; font-family:'DM Sans',sans-serif; transition:all .2s; }
.order-cancel-btn:hover { border-color:#e63946; color:#e63946; }

.pf-form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
.pf-form-row.full { grid-template-columns:1fr; }
.pf-field { display:flex; flex-direction:column; gap:.3rem; }
.pf-label { font-size:.56rem; letter-spacing:.15em; text-transform:uppercase; color:var(--warm); }
.pf-input { padding:.62rem .85rem; border:1.5px solid var(--border); font-family:'DM Sans',sans-serif; font-size:.82rem; color:var(--dark); background:#fff; outline:none; transition:border-color .2s; border-radius:6px; }
.pf-input:focus { border-color:var(--dark); }
.pf-input:disabled { background:var(--cream); color:var(--warm); }
.pf-save-btn { background:var(--dark); color:#fff; border:none; padding:.72rem 1.8rem; font-family:'DM Sans',sans-serif; font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; border-radius:6px; transition:background .2s; margin-top:.5rem; }
.pf-save-btn:hover { background:var(--deep); }
.pf-save-btn:disabled { opacity:.5; cursor:not-allowed; }
.pf-success-msg { background:#edf7ee; border:1px solid #b8e6bc; color:#2d7a35; padding:.55rem 1rem; border-radius:6px; font-size:.72rem; margin-bottom:1rem; }

.how-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:1.2rem; margin-top:.8rem; }
.how-step { text-align:center; padding:.8rem; }
.how-icon { font-size:1.4rem; margin-bottom:.4rem; }
.how-step-title { font-size:.7rem; font-weight:600; color:var(--dark); margin-bottom:.2rem; }
.how-step-desc { font-size:.62rem; color:var(--warm); line-height:1.6; }

.pf-empty { text-align:center; padding:3rem 1rem; }
.pf-empty-icon { font-size:2.5rem; margin-bottom:.8rem; }
.pf-empty-text { font-size:.82rem; color:var(--warm); }

.pf-logout { width:100%; padding:.75rem; background:none; border:1.5px solid var(--border); font-family:'DM Sans',sans-serif; font-size:.65rem; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; color:var(--warm); transition:all .2s; border-radius:8px; margin-top:1.5rem; }
.pf-logout:hover { border-color:#e63946; color:#e63946; }

.wish-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
.wish-card { background:#fff; border:1px solid var(--border); border-radius:10px; overflow:hidden; cursor:pointer; transition:box-shadow .2s; }
.wish-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.08); }
.wish-img { width:100%; aspect-ratio:3/4; object-fit:cover; background:#f0ece6; display:block; }
.wish-info { padding:.7rem .9rem; }
.wish-name { font-size:.75rem; font-weight:500; color:var(--dark); }
.wish-price { font-size:.7rem; color:var(--warm); margin-top:.2rem; }

@media(max-width:640px){
  .pf-points-banner { flex-direction:column; align-items:flex-start; }
  .pf-pts-right { text-align:left; }
  .pf-form-row { grid-template-columns:1fr; }
  .wish-grid { grid-template-columns:repeat(2,1fr); }
  .how-steps { grid-template-columns:1fr; }
}
`;

export default function ProfilePage({ cart, wish = [], setWish }) {
    const navigate = useNavigate();
    const [tab, setTab] = useState("orders");
    const [user, setUser] = useState(null);
    const [points, setPoints] = useState(0);
    const [orders, setOrders] = useState([]);
    const [wishProducts, setWishProducts] = useState([]); // ✅ كانت ناقصة
    const [loading, setLoading] = useState(true);
    const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) { navigate("/signin"); return; }

        // تحميل بيانات المستخدم من localStorage فوراً
        const stored = localStorage.getItem("user");
        if (stored) {
            const u = JSON.parse(stored);
            setUser(u);
            setEditForm({ firstName: u.firstName || "", lastName: u.lastName || "", phone: u.phone || "" });
        }


        fetch(`${API}/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => { if (data.success) setOrders(data.data?.orders || []); })
            .catch(() => { })
            .finally(() => setLoading(false));

        fetch(`${API}/customer/auth/points`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => { if (data.success) setPoints(data.data?.points || 0); })
            .catch(() => { });
    }, [token]);

    // جلب منتجات الـ wishlist
    useEffect(() => {
        if (!wish.length) { setWishProducts([]); return; }
        Promise.all(
            wish.map(id =>
                fetch(`${API}/products/${id}`).then(r => r.json()).catch(() => null)
            )
        ).then(results => {
            setWishProducts(results.filter(r => r?.success).map(r => r.data.product));
        });
    }, [wish]);

    const handleCancelOrder = async (orderId) => {
        try {
            const res = await fetch(`${API}/orders/${orderId}/cancel`, {
                method: "PATCH", headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "cancelled" } : o));
        } catch (err) { console.error(err); }
    };

    const handleSaveProfile = async () => {
        setSaving(true); setSaveMsg("");
        try {
            const res = await fetch(`${API}/users/me`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data.user);
                localStorage.setItem("user", JSON.stringify({ ...data.data.user, role: "customer" }));
                setSaveMsg("Profile updated successfully!");
                setTimeout(() => setSaveMsg(""), 3000);
            }
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const discount = Math.floor(points / 100) * 10;
    const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "?";

    return (
        <div className="pf-page">
            <style>{SHARED_CSS}</style>
            <style>{CSS}</style>
            <SHNav cart={cart} wish={wish} />
            <div className="pf-shell">

                {/* HEADER */}
                <div className="pf-header">
                    <div className="pf-avatar">{initials}</div>
                    <div>
                        <div className="pf-name">{user?.firstName} {user?.lastName}</div>
                        <div className="pf-email">{user?.email}</div>
                    </div>
                </div>

                {/* POINTS BANNER */}
                <div className="pf-points-banner">
                    <div className="pf-pts-left">
                        <div className="pf-pts-label">Your Points</div>
                        <div className="pf-pts-val">{points}</div>
                        <div className="pf-pts-sub">earned from reviews</div>
                    </div>
                    <div className="pf-pts-right">
                        <div className="pf-pts-disc-label">Worth</div>
                        <div className="pf-pts-disc">LE {discount} off</div>
                        <div className="pf-pts-note">100 pts = LE 10</div>
                    </div>
                </div>

                {/* TABS */}
                <div className="pf-tabs">
                    {[["orders", "Orders"], ["edit", "Edit Profile"], ["points", "Points"]].map(([id, label]) => (
                        <button key={id} className={`pf-tab${tab === id ? " on" : ""}`} onClick={() => setTab(id)}>{label}</button>
                    ))}
                </div>

                {/* ORDERS */}
                {tab === "orders" && (
                    loading ? <div style={{ color: "var(--warm)", fontSize: ".85rem" }}>Loading orders...</div> :
                        orders.length === 0 ? (
                            <div className="pf-empty"><div className="pf-empty-icon">🛍</div><div className="pf-empty-text">No orders yet.</div></div>
                        ) : orders.map(order => (
                            <div key={order._id} className="order-item">
                                <div className="order-header">
                                    <div>
                                        <div className="order-id">#{order._id.slice(-8).toUpperCase()}</div>
                                        <div className="order-date">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                                    </div>
                                    <span className={`order-status ${order.status}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                </div>
                                <div className="order-products">
                                    {order.items.map((item, i) => (
                                        item.product?.images?.[0]
                                            ? <img key={i} className="order-img" src={(item.product.images[0].startsWith('http') ? item.product.images[0] : `https://stylehub-backend-tau.vercel.app${item.product.images[0]}`)} alt={item.name} onError={e => e.target.style.display = "none"} />
                                            : <div key={i} className="order-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".58rem", color: "var(--warm)" }}>{item.name?.slice(0, 6)}</div>
                                    ))}
                                </div>
                                <div className="order-footer">
                                    <div>
                                        <div className="order-pay">{order.items.length} item{order.items.length !== 1 ? "s" : ""} · {order.paymentMethod?.toUpperCase()}</div>
                                        <div className="order-total">LE {order.totalPrice?.toLocaleString()}</div>
                                    </div>
                                    {["pending", "confirmed"].includes(order.status) && (
                                        <button className="order-cancel-btn" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                                    )}
                                </div>
                            </div>
                        ))
                )}

                {/* WISHLIST */}
                {tab === "wishlist" && (
                    wishProducts.length === 0 ? (
                        <div className="pf-empty"><div className="pf-empty-icon">♡</div><div className="pf-empty-text">Your wishlist is empty.</div></div>
                    ) : (
                        <div className="wish-grid">
                            {wishProducts.map(p => (
                                <div key={p._id} className="wish-card" onClick={() => navigate(`/product/${p._id}`)}>
                                    {p.images?.[0]
                                        ? <img className="wish-img" src={(p.images[0].startsWith('http') ? p.images[0] : `https://stylehub-backend-tau.vercel.app${p.images[0]}`)} alt={p.name} onError={e => e.target.style.display = "none"} />
                                        : <div className="wish-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--warm)", fontSize: ".75rem" }}>No image</div>
                                    }
                                    <div className="wish-info">
                                        <div className="wish-name">{p.name}</div>
                                        <div className="wish-price">LE {p.salePrice || p.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* EDIT PROFILE */}
                {tab === "edit" && (
                    <div className="pf-card">
                        <div className="pf-card-title">Edit Profile</div>
                        {saveMsg && <div className="pf-success-msg">✓ {saveMsg}</div>}
                        <div className="pf-form-row">
                            <div className="pf-field">
                                <label className="pf-label">First Name</label>
                                <input className="pf-input" value={editForm.firstName} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Last Name</label>
                                <input className="pf-input" value={editForm.lastName} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
                            </div>
                        </div>
                        <div className="pf-form-row full">
                            <div className="pf-field">
                                <label className="pf-label">Email (cannot be changed)</label>
                                <input className="pf-input" value={user?.email || ""} disabled />
                            </div>
                        </div>
                        <div className="pf-form-row full">
                            <div className="pf-field">
                                <label className="pf-label">Phone</label>
                                <input className="pf-input" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="+20 1xx xxx xxxx" />
                            </div>
                        </div>
                        <button className="pf-save-btn" onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                    </div>
                )}

                {/* HOW POINTS WORK */}
                {tab === "points" && (
                    <div className="pf-card">
                        <div className="pf-card-title">How Points Work</div>
                        <div className="how-steps">
                            <div className="how-step"><div className="how-icon">⭐</div><div className="how-step-title">Write a Review</div><div className="how-step-desc">Leave a review on any product</div></div>
                            <div className="how-step"><div className="how-icon">🎯</div><div className="how-step-title">Earn 10 Points</div><div className="how-step-desc">Points added automatically to your account</div></div>
                            <div className="how-step"><div className="how-icon">💸</div><div className="how-step-title">Redeem at Checkout</div><div className="how-step-desc">100 points = LE 10 off your order</div></div>
                        </div>
                        <div style={{ marginTop: "1.5rem", padding: "1rem 1.2rem", background: "var(--cream)", borderRadius: 8, fontSize: ".78rem", color: "var(--warm)", lineHeight: 1.8 }}>
                            You have <strong style={{ color: "var(--dark)" }}>{points} points</strong> — worth <strong style={{ color: "var(--sage)" }}>LE {discount}</strong> in discounts.
                            {points < 100 && <span> Keep reviewing to reach 100 points!</span>}
                        </div>
                    </div>
                )}

                <button className="pf-logout" onClick={handleLogout}>Sign Out</button>
            </div>
            <SHFooter />
        </div>
    );
}