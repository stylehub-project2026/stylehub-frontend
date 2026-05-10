import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS, SHNav, SHFooter, SHARED_CSS } from "./shared";

const API = "https://stylehub-backend-tau.vercel.app/api";

const Heart = ({ on }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function Wishlist({ cart, setCart, wish, setWish }) {
  const navigate = useNavigate();

  const [backendProducts, setBackendProducts] = useState([]);
  const [sizePicker, setSizePicker] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    if (!wish || wish.length === 0) { setBackendProducts([]); return; }
    Promise.all(
      wish.map(id => fetch(`${API}/products/${id}`).then(r => r.json()).catch(() => null))
    ).then(results => {
      const prods = results.filter(r => r?.success).map(r => {
        const p = r.data.product;
        return {
          id: p._id, _id: p._id, name: p.name,
          brand: p.seller?.brandName || "StyleHub",
          price: `LE ${p.price?.toLocaleString()}`,
          oldPrice: p.salePrice ? `LE ${p.salePrice?.toLocaleString()}` : null,
          img: p.images?.[0] ? `https://stylehub-backend-tau.vercel.app${p.images[0]}` : null,
          sizes: p.sizes || [], colors: p.colors || [],
        };
      });
      setBackendProducts(prods);
    });
  }, [wish]);

  const staticItems = (wish || []).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const items = backendProducts.length > 0 ? backendProducts : staticItems;

  const removeWish = id => setWish(w => w.filter(x => x !== id));

  const addProductToCart = async (p, size) => {
    const token = localStorage.getItem("token");
    if (token && p._id) {
      await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: p._id, quantity: 1, size }),
      }).catch(console.error);
    }
    setCart(prev => {
      const existing = prev.find(x => x.id === p.id && x.size === size);
      if (existing) return prev.map(x => x.id === p.id && x.size === size ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { id: p.id, size, qty: 1, product: { id: p.id, _id: p._id, name: p.name, price: p.price, oldPrice: p.oldPrice || null, img: p.img, brand: p.brand } }];
    });
  };

  const handleAddToBag = (p) => {
    if (!p.sizes || p.sizes.length === 0) { addProductToCart(p, null); return; }
    setSizePicker(p.id);
  };

  const confirmAddToBag = async (p) => {
    const size = selectedSizes[p.id];
    if (!size) return;
    await addProductToCart(p, size);
    setSizePicker(null);
    setSelectedSizes(s => ({ ...s, [p.id]: null }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{SHARED_CSS}</style>
      <SHNav cart={cart} wish={wish} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 400, marginBottom: ".3rem" }}>Your Wishlist</h1>
        <div style={{ width: 36, height: 2, background: "var(--sage)", marginBottom: "2.5rem" }} />

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>♡</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", marginBottom: ".8rem" }}>Your wishlist is empty</div>
            <p style={{ color: "var(--warm)", fontSize: ".85rem", marginBottom: "2rem" }}>Save items you love by clicking the heart icon</p>
            <button onClick={() => navigate("/")} style={{ background: "var(--dark)", color: "#fff", border: "none", padding: ".8rem 2.5rem", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              Discover Products
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: ".75rem", color: "var(--warm)", marginBottom: "1.5rem", letterSpacing: ".04em" }}>
              {items.length} saved item{items.length !== 1 ? "s" : ""}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
              {items.map(p => (
                <div key={p.id} style={{ background: "#fff", border: "1px solid var(--border)" }}>
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#f0ece6", cursor: "pointer" }} onClick={() => navigate(`/product/${p.id}`)}>
                    {p.img
                      ? <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }}
                        onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                        onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", color: "rgba(26,26,24,.15)" }}>{p.brand?.[0]}</span>
                      </div>
                    }
                    {p.oldPrice && <div style={{ position: "absolute", top: ".8rem", left: ".8rem", background: "var(--red)", color: "#fff", fontSize: ".55rem", letterSpacing: ".1em", padding: ".25rem .6rem", fontWeight: 600 }}>SALE</div>}
                    <button onClick={e => { e.stopPropagation(); removeWish(p.id); }} style={{ position: "absolute", top: ".8rem", right: ".8rem", width: 32, height: 32, background: "#fff", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.1)", color: "var(--red)" }}>
                      <Heart on={true} />
                    </button>
                  </div>

                  <div style={{ padding: ".8rem" }}>
                    <div style={{ fontSize: ".55rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".2rem" }}>{p.brand}</div>
                    <div style={{ fontSize: ".82rem", fontWeight: 500, marginBottom: ".4rem", lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginBottom: ".8rem" }}>
                      {p.oldPrice && <span style={{ fontSize: ".72rem", color: "var(--warm)", textDecoration: "line-through" }}>{p.oldPrice}</span>}
                      <span style={{ fontSize: ".82rem", fontWeight: 600, color: p.oldPrice ? "var(--red)" : "" }}>{p.price}</span>
                    </div>

                    {sizePicker === p.id ? (
                      <div>
                        <div style={{ fontSize: ".6rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".4rem" }}>Select Size</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem", marginBottom: ".5rem" }}>
                          {p.sizes.map(s => (
                            <button key={s} onClick={() => setSelectedSizes(prev => ({ ...prev, [p.id]: s }))}
                              style={{ padding: ".3rem .6rem", fontSize: ".65rem", border: `1.5px solid ${selectedSizes[p.id] === s ? "var(--dark)" : "var(--border)"}`, background: selectedSizes[p.id] === s ? "var(--dark)" : "#fff", color: selectedSizes[p.id] === s ? "#fff" : "var(--dark)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", borderRadius: 4 }}>
                              {s}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: ".4rem" }}>
                          <button onClick={() => confirmAddToBag(p)} disabled={!selectedSizes[p.id]}
                            style={{ flex: 2, background: "var(--dark)", color: "#fff", border: "none", padding: ".5rem", fontSize: ".65rem", textTransform: "uppercase", cursor: selectedSizes[p.id] ? "pointer" : "not-allowed", fontFamily: "'DM Sans',sans-serif", opacity: selectedSizes[p.id] ? 1 : .4 }}>
                            Add to Bag
                          </button>
                          <button onClick={() => setSizePicker(null)}
                            style={{ flex: 1, background: "none", border: "1px solid var(--border)", padding: ".5rem", fontSize: ".65rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", color: "var(--warm)" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => handleAddToBag(p)}
                        style={{ width: "100%", background: "var(--dark)", color: "#fff", border: "none", padding: ".6rem", fontSize: ".68rem", letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "background .2s" }}
                        onMouseEnter={e => e.target.style.background = "var(--deep)"}
                        onMouseLeave={e => e.target.style.background = "var(--dark)"}>
                        Add to Bag
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <SHFooter />
    </div>
  );
}
