import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS, SHNav, SHFooter, SHARED_CSS } from "./shared";

const SHIPPING = 80;
const API = "https://stylehub-backend-tau.vercel.app/api";

// ─── helpers ───
const toNum = s => {
  if (typeof s === "number") return s;
  return parseInt(String(s || "").replace(/\D/g, "")) || 0;
};

// Resolve a raw cart item (id-only) to a full product shape using static PRODUCTS
const resolveStaticProduct = (item) => {
  // Already resolved
  if (item.product && item.product.name) return item.product;
  // Look up by numeric or string id
  const found = PRODUCTS.find(p => String(p.id) === String(item.id));
  if (found) return found;
  return null;
};

const resolveImg = (product) => {
  if (product.img) return product.img;
  if (product.images?.[0]) {
    return product.images[0].startsWith("http")
      ? product.images[0]
      : `https://stylehub-backend-tau.vercel.app${product.images[0]}`;
  }
  return null;
};

// ─── CUSTOMIZATION ───
const FONT_LABEL = { "serif-italic": "Italic", serif: "Serif", block: "Block" };
const COLOR_LABEL = { "#c8a96e": "Gold", "#ffffff": "White", "#c84a3d": "Red", "#9eaa8a": "Sage", "#1a1a18": "Black" };
const POS_LABEL = { chest: "Chest", sleeve: "Sleeve", back: "Back" };

function CustomizationLine({ customization }) {
  if (!customization) return null;
  const { text, font, color, position, fee } = customization;
  return (
    <div style={{ marginTop: ".5rem", padding: ".5rem .7rem", background: "#fbf6ea", border: "1px solid #ede4d3", borderRadius: 4, fontSize: ".7rem", color: "#7a6a3f", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>
      <div style={{ fontWeight: 600, marginBottom: ".15rem" }}>✨ Personalized <span style={{ color: "var(--warm)", fontWeight: 400 }}>· +LE {fee?.toLocaleString()}</span></div>
      <div style={{ color: "#5a4f30" }}>"{text}" · {FONT_LABEL[font] || font} · {COLOR_LABEL[color] || color} thread · {POS_LABEL[position] || position}</div>
    </div>
  );
}

// ─── RESPONSIVE CSS ───
const CART_CSS = `
.cart-grid { display:grid; grid-template-columns:1fr 340px; gap:3rem; align-items:flex-start; }
.cart-aside { background:#fff; padding:2rem; border:1px solid var(--border); position:sticky; top:80px; }
.cart-item { display:flex; gap:1.2rem; padding:1.5rem 0; border-bottom:1px solid var(--border); }
.cart-item-img { width:110px; height:140px; flex-shrink:0; background:#f0ece6; cursor:pointer; overflow:hidden; }
.cart-wrap { max-width:1000px; margin:0 auto; padding:3rem 2rem; }
.cart-page { min-height:100vh; background:var(--cream); }
@media(max-width:1024px){ .cart-grid{grid-template-columns:1fr;gap:2rem;} .cart-aside{position:static;} }
@media(max-width:768px){ .cart-wrap{padding:2rem 1.2rem;} }
@media(max-width:480px){ .cart-wrap{padding:1.5rem .75rem;} .cart-item{gap:.8rem;} .cart-item-img{width:85px;height:108px;} .cart-aside{padding:1.2rem;} }
`;

// ─── SHARED SUMMARY SIDEBAR ───
function OrderSidebar({ subtotal, count, onCheckout, onContinue }) {
  const total = subtotal + SHIPPING;
  return (
    <div className="cart-aside">
      <div style={{ fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1.5rem" }}>Order Summary</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".8rem" }}>
        <span style={{ color: "var(--warm)" }}>Subtotal ({count} item{count !== 1 ? "s" : ""})</span>
        <span>LE {subtotal.toLocaleString()}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".8rem" }}>
        <span style={{ color: "var(--warm)" }}>Shipping</span>
        <span style={{ color: "var(--sage)", fontWeight: 600 }}>LE {SHIPPING}</span>
      </div>
      <div style={{ borderTop: "1px solid var(--border)", margin: "1.2rem 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem" }}>
        <span>Total</span><span>LE {total.toLocaleString()}</span>
      </div>
      <button onClick={onCheckout}
        style={{ width: "100%", background: "var(--dark)", color: "#fff", border: "none", padding: ".9rem", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: ".8rem" }}
        onMouseEnter={e => e.target.style.background = "var(--deep)"}
        onMouseLeave={e => e.target.style.background = "var(--dark)"}>
        Checkout
      </button>
      <button onClick={onContinue}
        style={{ width: "100%", background: "transparent", color: "var(--dark)", border: "1.5px solid var(--dark)", padding: ".9rem", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
        Continue Shopping
      </button>
      <div style={{ display: "flex", gap: ".4rem", justifyContent: "center", marginTop: "1.2rem" }}>
        {["VISA", "FAWRY", "CASH"].map(m => (
          <span key={m} style={{ background: "rgba(0,0,0,.06)", borderRadius: 3, padding: ".2rem .5rem", fontSize: ".55rem", color: "var(--warm)", fontWeight: 600 }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

// ─── EMPTY STATE ───
function EmptyCart({ onContinue }) {
  return (
    <div style={{ textAlign: "center", padding: "6rem 0" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", marginBottom: ".8rem" }}>Your Cart is empty</div>
      <p style={{ color: "var(--warm)", fontSize: ".85rem", marginBottom: "2rem" }}>Add items to get started</p>
      <button onClick={onContinue} style={{ background: "var(--dark)", color: "#fff", border: "none", padding: ".8rem 2.5rem", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
        Continue Shopping
      </button>
    </div>
  );
}

// ─── PAGE SHELL ───
function CartShell({ cart, wish, children }) {
  return (
    <div className="cart-page">
      <style>{SHARED_CSS}</style>
      <style>{CART_CSS}</style>
      <SHNav cart={cart} wish={wish} />
      <div className="cart-wrap">
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 400, marginBottom: ".3rem" }}>Your Cart</h1>
        <div style={{ width: 36, height: 2, background: "var(--sage)", marginBottom: "2.5rem" }} />
        {children}
      </div>
      <SHFooter />
    </div>
  );
}

// ─── BACKEND CART (logged-in users) ───
// Also shows local static items (home/BuildOutfit) that aren't in backend cart
function BackendCart({ cart, setCart, wish }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [backendItems, setBackendItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = () => {
    setLoading(true);
    setError(null);
    fetch(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || `Server error ${r.status}`);
        return data;
      })
      .then(data => {
        if (data.success) setBackendItems(data.data.items || []);
        else setError(data.message || "Failed to load cart");
      })
      .catch(err => setError(err.message || "Failed to load cart"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  // ── Resolve local (static) cart items – home page & BuildOutfit add only
  // { id, size, qty } with numeric ids. Merge them alongside backend items.
  const localItems = (cart || [])
    .map(item => {
      // Skip items already in backend cart
      const alreadyInBackend = backendItems.some(
        bi => String(bi.product?._id) === String(item.id) || String(bi.product?.id) === String(item.id)
      );
      if (alreadyInBackend) return null;

      // If item already has a full product object (from ProductDetail), use it directly
      if (item.product && item.product.name) {
        return { ...item, _isLocal: true };
      }

      // Otherwise resolve from static PRODUCTS array (homepage/BuildOutfit items)
      const product = resolveStaticProduct(item);
      if (!product) return null;
      return { ...item, product, _isLocal: true };
    })
    .filter(Boolean);

  const updateBackendQty = async (itemId, quantity) => {
    if (quantity < 1) return removeBackendItem(itemId);
    try {
      const res = await fetch(`${API}/cart/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");
      setBackendItems(prev => prev.map(i => i._id === itemId ? { ...i, quantity } : i));
    } catch (err) { alert(`Failed to update: ${err.message}`); }
  };

  const removeBackendItem = async (itemId) => {
    try {
      const res = await fetch(`${API}/cart/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Remove failed");
      setBackendItems(prev => prev.filter(i => i._id !== itemId));
    } catch (err) { alert(`Failed to remove: ${err.message}`); }
  };

  const updateLocalQty = (id, size, delta) => {
    setCart(prev => prev.map(item =>
      String(item.id) === String(id) && item.size === size
        ? { ...item, qty: Math.max(1, item.qty + delta) }
        : item
    ));
  };

  const removeLocalItem = (id, size) => {
    setCart(prev => prev.filter(item => !(String(item.id) === String(id) && item.size === size)));
  };

  // Subtotals
  const backendSubtotal = backendItems.reduce((sum, i) => {
    const base = i.product?.salePrice || i.product?.price || 0;
    const fee = i.customization?.fee || 0;
    return sum + (base + fee) * i.quantity;
  }, 0);

  const localSubtotal = localItems.reduce((sum, item) => {
    const base = toNum(item.product.price);
    const fee = item.customization?.fee || 0;
    return sum + (base + fee) * item.qty;
  }, 0);

  const subtotal = backendSubtotal + localSubtotal;
  const totalCount = backendItems.length + localItems.length;

  if (loading) return (
    <CartShell cart={cart} wish={wish}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh" }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "var(--warm)" }}>Loading cart...</span>
      </div>
    </CartShell>
  );

  if (error) return (
    <CartShell cart={cart} wish={wish}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", padding: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", marginBottom: ".8rem", textAlign: "center" }}>Couldn't load your cart</div>
        <p style={{ color: "var(--warm)", fontSize: ".85rem", marginBottom: "2rem", textAlign: "center", maxWidth: 420 }}>{error}</p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={fetchCart} style={{ background: "var(--dark)", color: "#fff", border: "none", padding: ".8rem 2rem", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Retry</button>
          <button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} style={{ background: "transparent", color: "var(--dark)", border: "1.5px solid var(--dark)", padding: ".8rem 2rem", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Logout</button>
        </div>
      </div>
    </CartShell>
  );

  return (
    <CartShell cart={cart} wish={wish}>
      {totalCount === 0 ? (
        <EmptyCart onContinue={() => navigate("/")} />
      ) : (
        <div className="cart-grid">
          <div>
            {/* ── Backend items (from API) ── */}
            {backendItems.map(item => {
              const p = item.product;
              if (!p) return null;
              const img = resolveImg(p);
              const basePrice = p.salePrice || p.price;
              const fee = item.customization?.fee || 0;
              const unitPrice = basePrice + fee;

              return (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-img" onClick={() => navigate(`/product/${p._id}`)}>
                    {img
                      ? <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", color: "rgba(26,26,24,.1)" }}>S</span>
                      </div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div onClick={() => navigate(`/product/${p._id}`)} style={{ fontSize: ".95rem", fontWeight: 500, marginBottom: ".5rem", cursor: "pointer" }}>{p.name}</div>
                    {item.size && <div style={{ fontSize: ".75rem", color: "var(--warm)", marginBottom: ".5rem" }}>Size: <strong style={{ color: "var(--dark)" }}>{item.size}</strong></div>}
                    <CustomizationLine customization={item.customization} />
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginTop: ".8rem" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
                        <button onClick={() => updateBackendQty(item._id, item.quantity - 1)} style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}>−</button>
                        <span style={{ width: 32, textAlign: "center", fontSize: ".85rem" }}>{item.quantity}</span>
                        <button onClick={() => updateBackendQty(item._id, item.quantity + 1)} style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}>+</button>
                      </div>
                      <button onClick={() => removeBackendItem(item._id)} style={{ fontSize: ".68rem", letterSpacing: ".08em", color: "var(--warm)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans',sans-serif" }}>Remove</button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {p.salePrice && <div style={{ fontSize: ".75rem", color: "var(--warm)", textDecoration: "line-through", marginBottom: ".2rem" }}>LE {(p.price + fee).toLocaleString()}</div>}
                    <div style={{ fontSize: "1rem", fontWeight: 600 }}>LE {unitPrice.toLocaleString()}</div>
                    {item.quantity > 1 && <div style={{ fontSize: ".72rem", color: "var(--warm)" }}>× {item.quantity} = LE {(unitPrice * item.quantity).toLocaleString()}</div>}
                  </div>
                </div>
              );
            })}

            {/* ── Local static items (home / BuildOutfit) ── */}
            {localItems.map((item, idx) => {
              const p = item.product;
              const img = resolveImg(p);
              const base = toNum(p.price);
              const fee = item.customization?.fee || 0;
              const unitPrice = base + fee;
              const oldBase = p.oldPrice ? toNum(p.oldPrice) : null;
              const oldUnit = oldBase ? oldBase + fee : null;

              return (
                <div key={`local-${item.id}-${item.size}-${idx}`} className="cart-item">
                  <div className="cart-item-img" onClick={() => navigate(`/product/${p.id}`)}>
                    {img
                      ? <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", background: p.gradient ? `linear-gradient(${p.gradient})` : "#f0ece6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "rgba(26,26,24,.15)" }}>{p.brand?.[0]}</span>
                      </div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".3rem" }}>{p.brand}</div>
                    <div onClick={() => navigate(`/product/${p.id}`)} style={{ fontSize: ".95rem", fontWeight: 500, marginBottom: ".5rem", cursor: "pointer" }}>{p.name}</div>
                    {item.size && <div style={{ fontSize: ".75rem", color: "var(--warm)", marginBottom: ".5rem" }}>Size: <strong style={{ color: "var(--dark)" }}>{item.size}</strong></div>}
                    <CustomizationLine customization={item.customization} />
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginTop: ".8rem" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
                        <button onClick={() => updateLocalQty(item.id, item.size, -1)} style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}>−</button>
                        <span style={{ width: 32, textAlign: "center", fontSize: ".85rem" }}>{item.qty}</span>
                        <button onClick={() => updateLocalQty(item.id, item.size, +1)} style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}>+</button>
                      </div>
                      <button onClick={() => removeLocalItem(item.id, item.size)} style={{ fontSize: ".68rem", letterSpacing: ".08em", color: "var(--warm)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans',sans-serif" }}>Remove</button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {oldUnit && <div style={{ fontSize: ".75rem", color: "var(--warm)", textDecoration: "line-through", marginBottom: ".2rem" }}>LE {oldUnit.toLocaleString()}</div>}
                    <div style={{ fontSize: "1rem", fontWeight: 600 }}>LE {unitPrice.toLocaleString()}</div>
                    {item.qty > 1 && <div style={{ fontSize: ".72rem", color: "var(--warm)" }}>× {item.qty} = LE {(unitPrice * item.qty).toLocaleString()}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <OrderSidebar
            subtotal={subtotal}
            count={totalCount}
            onCheckout={() => navigate("/checkout")}
            onContinue={() => navigate("/")}
          />
        </div>
      )}
    </CartShell>
  );
}

// ─── LOCAL CART (guest users) ───
function LocalCart({ cart, setCart, wish }) {
  const navigate = useNavigate();

  const items = (cart || []).map(item => {
    const product = resolveStaticProduct(item);
    return product ? { ...item, product } : null;
  }).filter(Boolean);

  const subtotal = items.reduce((sum, item) => {
    const base = toNum(item.product.price);
    const fee = item.customization?.fee || 0;
    return sum + (base + fee) * item.qty;
  }, 0);

  const updateQty = (id, size, delta) => {
    setCart(prev => prev.map(item =>
      String(item.id) === String(id) && item.size === size
        ? { ...item, qty: Math.max(1, item.qty + delta) }
        : item
    ));
  };

  const removeItem = (id, size) => {
    setCart(prev => prev.filter(item => !(String(item.id) === String(id) && item.size === size)));
  };

  return (
    <CartShell cart={cart} wish={wish}>
      {items.length === 0 ? (
        <EmptyCart onContinue={() => navigate("/")} />
      ) : (
        <div className="cart-grid">
          <div>
            {items.map((item, idx) => {
              const p = item.product;
              const img = resolveImg(p);
              const base = toNum(p.price);
              const fee = item.customization?.fee || 0;
              const unitPrice = base + fee;
              const oldBase = p.oldPrice ? toNum(p.oldPrice) : null;
              const oldUnit = oldBase ? oldBase + fee : null;

              return (
                <div key={`${item.id}-${item.size}-${idx}`} className="cart-item">
                  <div className="cart-item-img" onClick={() => navigate(`/product/${p.id}`)}>
                    {img
                      ? <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", background: p.gradient ? `linear-gradient(${p.gradient})` : "#f0ece6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "rgba(26,26,24,.15)" }}>{p.brand?.[0]}</span>
                      </div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".3rem" }}>{p.brand}</div>
                    <div onClick={() => navigate(`/product/${p.id}`)} style={{ fontSize: ".95rem", fontWeight: 500, marginBottom: ".5rem", cursor: "pointer" }}>{p.name}</div>
                    {item.size && <div style={{ fontSize: ".75rem", color: "var(--warm)", marginBottom: ".5rem" }}>Size: <strong style={{ color: "var(--dark)" }}>{item.size}</strong></div>}
                    <CustomizationLine customization={item.customization} />
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginTop: ".8rem" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
                        <button onClick={() => updateQty(item.id, item.size, -1)} style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}>−</button>
                        <span style={{ width: 32, textAlign: "center", fontSize: ".85rem" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.size, +1)} style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item.id, item.size)} style={{ fontSize: ".68rem", letterSpacing: ".08em", color: "var(--warm)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans',sans-serif" }}>Remove</button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {oldUnit && <div style={{ fontSize: ".75rem", color: "var(--warm)", textDecoration: "line-through", marginBottom: ".2rem" }}>LE {oldUnit.toLocaleString()}</div>}
                    <div style={{ fontSize: "1rem", fontWeight: 600 }}>LE {unitPrice.toLocaleString()}</div>
                    {item.qty > 1 && <div style={{ fontSize: ".72rem", color: "var(--warm)" }}>× {item.qty} = LE {(unitPrice * item.qty).toLocaleString()}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <OrderSidebar
            subtotal={subtotal}
            count={items.length}
            onCheckout={() => navigate("/checkout")}
            onContinue={() => navigate("/")}
          />
        </div>
      )}
    </CartShell>
  );
}

// ─── MAIN EXPORT ───
export default function Cart({ cart, setCart, wish, setWish }) {
  const token = localStorage.getItem("token");
  if (token) return <BackendCart cart={cart} setCart={setCart} wish={wish} />;
  return <LocalCart cart={cart} setCart={setCart} wish={wish} />;
}