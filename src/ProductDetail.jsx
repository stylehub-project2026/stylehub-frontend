import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SHNav, SHFooter, SHARED_CSS, PRODUCTS } from "./shared";

const API = "https://stylehub-backend-tau.vercel.app/api";

const CUSTOM_FEE = 100; // LE — embroidery surcharge

const PRODUCT_CSS = `
.pd-grid { display:grid; grid-template-columns:52% 48%; gap:0; }
.pd-left { display:flex; gap:.75rem; padding:1rem 2rem 4rem 4%; }
.pd-right { padding:2rem 6% 4rem 3rem; }
.pd-breadcrumb { padding:1rem 5%; font-size:.7rem; color:var(--warm); font-family:'DM Sans',sans-serif; display:flex; gap:.5rem; align-items:center; }
.pd-also-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
.pd-reviews-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.2rem; }
.pd-section { padding:3rem 5%; }
@media(max-width:1024px){
  .pd-grid { grid-template-columns:1fr; }
  .pd-left { padding:1rem 1.5rem 2rem; aspect-ratio:unset !important; min-height:420px; }
  .pd-right { padding:1.5rem 1.5rem 3rem; }
  .pd-also-grid { grid-template-columns:repeat(2,1fr); gap:1.2rem; }
  .pd-reviews-grid { grid-template-columns:repeat(2,1fr); }
  .pd-section { padding:2.5rem 1.5rem; }
}
@media(max-width:768px){
  .pd-left { padding:1rem 1rem 1.5rem; gap:.5rem; min-height:360px; }
  .pd-right { padding:1rem 1rem 2.5rem; }
  .pd-breadcrumb { padding:.75rem 1rem; }
  .pd-reviews-grid { grid-template-columns:1fr; }
  .pd-section { padding:2rem 1rem; }
}
@media(max-width:480px){
  .pd-left { padding:.75rem .75rem 1rem; min-height:300px; }
  .pd-right { padding:.75rem .75rem 2rem; }
  .pd-also-grid { grid-template-columns:repeat(2,1fr); gap:.8rem; }
  .pd-breadcrumb { padding:.75rem; font-size:.62rem; }
  .pd-section { padding:1.5rem .75rem; }
}
`;

const Heart = ({ on }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#c8a96e" : "none"} stroke="#c8a96e" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

function ProductCard({ p, getImageUrl, onClick }) {
  const [hovered, setHovered] = useState(false);
  const rawPrice = parseInt(String(p.price || "").replace(/[^0-9]/g, ""), 10);
  const rawOld = p.oldPrice ? parseInt(String(p.oldPrice).replace(/[^0-9]/g, ""), 10) : null;
  const isOnSale = !!rawOld;
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#f0ece6", marginBottom: ".6rem" }}>
        <img src={getImageUrl(p.img)} alt={p.name} onError={e => (e.target.style.display = "none")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform .4s ease" }} />
        {isOnSale && <div style={{ position: "absolute", top: ".6rem", left: ".6rem", background: "var(--red)", color: "#fff", fontSize: ".55rem", letterSpacing: ".1em", padding: ".25rem .55rem", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>SALE</div>}
      </div>
      <div style={{ fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif", marginBottom: ".2rem" }}>{p.brand}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: ".95rem", color: "var(--dark)", marginBottom: ".3rem", lineHeight: 1.2 }}>{p.name}</div>
      <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
        {isOnSale ? (
          <>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".75rem", color: "var(--red)", fontWeight: 600 }}>LE {rawPrice.toLocaleString()}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".7rem", color: "var(--warm)", textDecoration: "line-through" }}>LE {rawOld.toLocaleString()}</span>
          </>
        ) : (
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".75rem", color: "var(--dark)", fontWeight: 600 }}>LE {rawPrice.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}

function SizeGuidePopup({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(26,26,24,.65)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", maxWidth: 580, width: "100%", padding: "2.5rem", position: "relative", borderRadius: 4, maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--warm)" }}>X</button>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", fontWeight: 400, marginBottom: ".4rem" }}>Size Guide</div>
        <div style={{ width: 40, height: 2, background: "var(--sage)", marginBottom: "1.8rem" }} />

        <div style={{ marginBottom: "1.8rem" }}>
          <div style={{ fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, color: "var(--warm)", marginBottom: ".8rem", fontFamily: "'DM Sans',sans-serif" }}>Women and Men</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans',sans-serif", fontSize: ".75rem" }}>
            <thead>
              <tr style={{ background: "var(--cream)" }}>
                {["Size", "Chest (cm)", "Waist (cm)", "Hips (cm)"].map(h => (
                  <th key={h} style={{ padding: ".6rem .8rem", textAlign: "left", fontWeight: 600, borderBottom: "1px solid var(--border)", color: "var(--dark)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[["XS", "80-84", "60-64", "86-90"], ["S", "84-88", "64-68", "90-94"], ["M", "88-92", "68-72", "94-98"], ["L", "92-96", "72-76", "98-102"], ["XL", "96-100", "76-80", "102-106"]].map(([size, ...vals]) => (
                <tr key={size} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: ".55rem .8rem", fontWeight: 600 }}>{size}</td>
                  {vals.map((v, i) => <td key={i} style={{ padding: ".55rem .8rem", color: "var(--warm)" }}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div style={{ fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, color: "var(--warm)", marginBottom: ".8rem", fontFamily: "'DM Sans',sans-serif" }}>Kids</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans',sans-serif", fontSize: ".75rem" }}>
            <thead>
              <tr style={{ background: "var(--cream)" }}>
                {["Size", "Age", "Height (cm)", "Chest (cm)"].map(h => (
                  <th key={h} style={{ padding: ".6rem .8rem", textAlign: "left", fontWeight: 600, borderBottom: "1px solid var(--border)", color: "var(--dark)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[["4Y", "3-4", "98-104", "54-56"], ["6Y", "5-6", "110-116", "57-59"], ["8Y", "7-8", "122-128", "60-63"], ["10Y", "9-10", "134-140", "64-67"], ["12Y", "11-12", "146-152", "68-72"], ["14Y", "13-14", "158-164", "73-77"]].map(([size, ...vals]) => (
                <tr key={size} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: ".55rem .8rem", fontWeight: 600 }}>{size}</td>
                  {vals.map((v, i) => <td key={i} style={{ padding: ".55rem .8rem", color: "var(--warm)" }}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: ".7rem", color: "var(--warm)", marginTop: "1.2rem", lineHeight: 1.7 }}>
          Sizes may vary slightly between brands. If you are between sizes, we recommend sizing up.
        </p>
      </div>
    </div>
  );
}

export default function ProductDetail({ cart, setCart, wish, setWish }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [backendSimilar, setBackendSimilar] = useState([]);

  // ----- Personalization state -----
  const [customEnabled, setCustomEnabled] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customFont, setCustomFont] = useState("serif-italic");
  const [customColor, setCustomColor] = useState("#c8a96e");
  const [customPosition, setCustomPosition] = useState("chest");
  const [customError, setCustomError] = useState(false);

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    const isLocal = PRODUCTS.some(p => String(p.id) === String(id));
    if (isLocal) return img;
    return `https://stylehub-backend-tau.vercel.app${img}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const local = PRODUCTS.find(p => String(p.id) === String(id));
    if (local) {
      setProduct({
        id: local.id, _id: local.id, name: local.name, brand: local.brand,
        price: local.oldPrice ? parseInt(String(local.oldPrice).replace(/[^0-9]/g, ""), 10) : parseInt(String(local.price).replace(/[^0-9]/g, ""), 10),
        salePrice: local.oldPrice ? parseInt(String(local.price).replace(/[^0-9]/g, ""), 10) : null,
        description: local.desc || "", sizes: local.sizes || [], colors: local.colors || [],
        images: [local.img, ...(local.imgs || [])].filter(Boolean),
        rating: local.rating || 0, reviewCount: local.reviews || 0, stock: 99,
        category: local.category || "", tags: [],
      });
      setLoading(false);
      return;
    }
    fetch(`${API}/products/${id}`)
      .then(r => r.json())
      .then(data => {
        const raw = data.data?.product;
        if (!raw) return;
        setProduct({
          id: raw._id, _id: raw._id, name: raw.name,
          brand: raw.seller?.brandName || "StyleHub",
          price: raw.salePrice && raw.salePrice !== raw.price ? Math.max(raw.price, raw.salePrice) : raw.price,
          salePrice: raw.salePrice && raw.salePrice !== raw.price ? Math.min(raw.price, raw.salePrice) : null,
          description: raw.description,
          sizes: (raw.sizes || []).map(s => typeof s === "object" ? s.name || String(s) : s),
          colors: (raw.colors || []).map(c => typeof c === "object" ? c.hex || c.value || String(c) : c),
          images: raw.images || [], rating: raw.avgRating || 0, reviewCount: raw.reviewCount || 0,
          stock: raw.stock || 0,
          category: typeof raw.category === "object" ? raw.category?.name || "" : raw.category || "",
          tags: raw.tags || [],
        });
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const isLocal = PRODUCTS.some(p => String(p.id) === String(id));
    if (isLocal) { setReviews([]); return; }
    fetch(`${API}/products/${id}/reviews`)
      .then(r => r.json())
      .then(data => setReviews(data.data?.reviews || []))
      .catch(() => { });
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const isLocal = PRODUCTS.some(p => String(p.id) === String(id));
    if (isLocal) return;
    fetch(`${API}/products?brand=${encodeURIComponent(product.brand)}&limit=5`)
      .then(r => r.json())
      .then(data => {
        const prods = (data.data?.products || []).filter(p => p._id !== id).slice(0, 4);
        setBackendSimilar(prods);
      })
      .catch(() => { });
  }, [product, id]);

  const toggleWish = () => setWish(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  // Personalization only enabled for Marble and Salty brands
  const isCustomizable = product && ["marble", "salty"].includes((product.brand || "").toLowerCase());

  const handleAddToCart = async () => {
    if (product.sizes.length > 0 && !selectedSize) { setSizeError(true); return; }
    if (customEnabled && !customText.trim()) { setCustomError(true); return; }
    setSizeError(false);
    setCustomError(false);

    const customization = customEnabled ? {
      text: customText.trim(),
      font: customFont,
      color: customColor,
      position: customPosition,
      fee: CUSTOM_FEE,
    } : null;

    const token = localStorage.getItem("token");
    if (token && product._id) {
      await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product._id, quantity: 1, size: selectedSize, customization }),
      }).catch(console.error);
    }

    setCart(prev => {
      // Dedupe by id+size+customization so different customizations stay as separate lines
      const customKey = JSON.stringify(customization);
      const existing = prev.find(x =>
        x.id === product.id &&
        x.size === selectedSize &&
        JSON.stringify(x.customization || null) === customKey
      );
      if (existing) return prev.map(x => x === existing ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, {
        id: product.id,
        size: selectedSize,
        qty: 1,
        customization, // null if not personalized
        product: {
          id: product.id,
          _id: product._id,
          name: product.name,
          price: `LE ${(product.salePrice || product.price)?.toLocaleString()}`,   // discounted price (shown price)
          oldPrice: product.salePrice ? `LE ${product.price?.toLocaleString()}` : null, // original price (strikethrough)
          img: getImageUrl(product.images[0]),
          brand: product.brand,
        }
      }];
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const isLoggedIn = !!localStorage.getItem("token");

  const submitReview = async () => {
    if (!reviewRating) { setReviewMsg({ type: "error", text: "Please select a rating." }); return; }
    setSubmittingReview(true);
    setReviewMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit.");
      setReviewMsg({ type: "success", text: "Review submitted! Thank you" });
      setReviewRating(0);
      setReviewComment("");
      fetch(`${API}/products/${id}/reviews`).then(r => r.json()).then(d => setReviews(d.data?.reviews || [])).catch(() => { });
    } catch (err) {
      setReviewMsg({ type: "error", text: err.message });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
      <div style={{ color: "var(--warm)", fontFamily: "'DM Sans',sans-serif" }}>Loading...</div>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", marginBottom: "1rem" }}>Product not found</div>
        <button onClick={() => navigate(-1)} style={{ background: "var(--dark)", color: "#fff", border: "none", padding: ".7rem 2rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase" }}>Go Back</button>
      </div>
    </div>
  );

  const allImages = product.images;
  const isWished = wish?.includes(id);
  const discountPct = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : null;

  const BRAND_ALIAS = {
    "twenty seven": "27", "marble": "MARBLE", "antika": "Antika",
    "ninos": "NINOS", "salty": "Salty",
  };
  const normalizedBrand = BRAND_ALIAS[product.brand?.toLowerCase()] || product.brand;
  const sameBrandProducts = PRODUCTS.filter(p => p.brand === normalizedBrand && String(p.id) !== String(id)).slice(0, 4);

  // Live total shown on the Add-to-Bag button
  const displayPrice = (product.salePrice || product.price) + (customEnabled ? CUSTOM_FEE : 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{SHARED_CSS}</style>
      <style>{PRODUCT_CSS}</style>
      <SHNav cart={cart} wish={wish} />

      <div className="pd-breadcrumb">
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</span>
        <span>›</span>
        <span onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>{product.brand}</span>
        <span>›</span>
        <span style={{ color: "var(--dark)" }}>{product.name}</span>
      </div>

      <div className="pd-grid">
        <div className="pd-left" style={{ aspectRatio: "3/4" }}>
          {allImages.length > 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: ".7rem", width: 72, flexShrink: 0, overflowY: "auto" }}>
              {allImages.map((img, i) => (
                <div key={i} onClick={() => setSelectedImg(i)}
                  style={{ width: 72, aspectRatio: "3/4", flexShrink: 0, overflow: "hidden", background: "#f0ece6", cursor: "pointer", outline: selectedImg === i ? "2px solid var(--dark)" : "2px solid transparent", outlineOffset: "-2px", transition: "outline .15s" }}>
                  <img src={getImageUrl(img)} alt={`${product.name} view ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transform: selectedImg === i ? "scale(1.05)" : "scale(1)", transition: "transform .3s ease" }}
                    onError={e => e.target.style.display = "none"} />
                </div>
              ))}
            </div>
          )}
          <div style={{ flex: 1, overflow: "hidden", background: "#f0ece6", position: "relative" }}>
            {allImages[selectedImg] ? (
              <img src={getImageUrl(allImages[selectedImg])} alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => e.target.style.display = "none"} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "3rem", color: "rgba(26,26,24,.1)" }}>{product.brand[0]}</span>
              </div>
            )}
            {discountPct && <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--red)", color: "#fff", fontSize: ".6rem", letterSpacing: ".1em", padding: ".3rem .7rem", fontWeight: 700, zIndex: 6 }}>SALE</div>}
          </div>
        </div>

        <div className="pd-right">
          <div style={{ fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".5rem", fontFamily: "'DM Sans',sans-serif" }}>{product.brand}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 400, lineHeight: 1.2, marginBottom: "1rem", color: "var(--dark)" }}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", gap: ".1rem" }}>
              {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= Math.round(product.rating)} />)}
            </div>
            <span style={{ fontSize: ".72rem", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif" }}>
              {product.rating.toFixed(1)} · {product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", fontWeight: 600, color: product.salePrice ? "var(--red)" : "var(--dark)" }}>
              LE {displayPrice.toLocaleString()}
            </span>
            {product.salePrice && <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", color: "var(--warm)", textDecoration: "line-through" }}>LE {(product.price + (customEnabled ? CUSTOM_FEE : 0)).toLocaleString()}</span>}
            {discountPct && <span style={{ background: "var(--red)", color: "#fff", fontSize: ".6rem", padding: ".2rem .5rem", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>-{discountPct}%</span>}
            {customEnabled && (
              <span style={{ fontSize: ".68rem", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif", fontStyle: "italic" }}>
                includes +LE {CUSTOM_FEE} personalization
              </span>
            )}
          </div>
          <div style={{ height: 1, background: "var(--border)", marginBottom: "1.5rem" }} />

          {product.sizes.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--dark)", fontWeight: 600, marginBottom: ".7rem", fontFamily: "'DM Sans',sans-serif", display: "flex", gap: ".5rem", alignItems: "center" }}>
                SIZE
                {sizeError && <span style={{ color: "var(--red)", fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: ".7rem" }}>— select a size</span>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    style={{ padding: ".45rem 1.1rem", border: `1.5px solid ${selectedSize === s ? "var(--dark)" : "var(--border)"}`, background: selectedSize === s ? "var(--dark)" : "transparent", color: selectedSize === s ? "#fff" : "var(--dark)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: ".75rem", transition: "all .2s", borderRadius: 3 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--dark)", fontWeight: 600, marginBottom: ".7rem", fontFamily: "'DM Sans',sans-serif" }}>COLOR</div>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                {product.colors.map((c, i) => (
                  <div key={i} onClick={() => { setSelectedColor(c); setSelectedImg(i); }}
                    style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: selectedColor === c ? "2px solid var(--dark)" : "2px solid var(--border)", cursor: "pointer", boxShadow: selectedColor === c ? "0 0 0 2px var(--dark)" : "none", transform: selectedColor === c ? "scale(1.15)" : "none", transition: "all .2s" }} />
                ))}
              </div>
            </div>
          )}

          {/* ===================== PERSONALIZATION ===================== */}
          {isCustomizable && (
            <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#fbf6ea", border: "1px solid #ede4d3", borderRadius: 6 }}>
              <label style={{ display: "flex", alignItems: "center", gap: ".7rem", cursor: "pointer", marginBottom: customEnabled ? "1rem" : 0 }}>
                <input type="checkbox" checked={customEnabled} onChange={e => { setCustomEnabled(e.target.checked); setCustomError(false); }}
                  style={{ width: 18, height: 18, accentColor: "#1a1a18", cursor: "pointer", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, color: "var(--dark)", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: ".35rem" }}>
                    ✨ Personalize it
                  </div>
                  <div style={{ fontSize: ".68rem", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif", marginTop: ".2rem" }}>
                    Add embroidered text · +LE {CUSTOM_FEE}
                  </div>
                </div>
              </label>

              {customEnabled && (
                <div style={{ paddingTop: ".9rem", borderTop: "1px solid #ede4d3" }}>
                  {/* Text input */}
                  <div style={{ marginBottom: ".9rem" }}>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 600, color: "var(--dark)", marginBottom: ".4rem", fontFamily: "'DM Sans',sans-serif", display: "flex", gap: ".5rem", alignItems: "center" }}>
                      Your Text
                      {customError && <span style={{ color: "var(--red)", fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: ".7rem" }}>— required</span>}
                    </div>
                    <input type="text" value={customText} onChange={e => { setCustomText(e.target.value); setCustomError(false); }} maxLength={15}
                      placeholder="Type a name or short word"
                      style={{ width: "100%", padding: ".6rem .8rem", border: `1.5px solid ${customError ? "var(--red)" : "var(--border)"}`, background: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem", outline: "none", borderRadius: 3, boxSizing: "border-box" }} />
                    <div style={{ fontSize: ".62rem", color: "var(--warm)", textAlign: "right", marginTop: ".25rem", fontFamily: "'DM Sans',sans-serif" }}>{customText.length}/15</div>
                  </div>

                  {/* Font picker */}
                  <div style={{ marginBottom: ".9rem" }}>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 600, color: "var(--dark)", marginBottom: ".4rem", fontFamily: "'DM Sans',sans-serif" }}>Font Style</div>
                    <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                      {[
                        { id: "serif-italic", label: customText || "Text", style: { fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" } },
                        { id: "serif", label: customText || "Text", style: { fontFamily: "'Cormorant Garamond',serif" } },
                        { id: "block", label: (customText || "Text").toUpperCase(), style: { fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: ".1em" } },
                      ].map(f => (
                        <button key={f.id} onClick={() => setCustomFont(f.id)}
                          style={{ padding: ".5rem .85rem", border: `1.5px solid ${customFont === f.id ? "var(--dark)" : "var(--border)"}`, background: customFont === f.id ? "var(--dark)" : "#fff", color: customFont === f.id ? "#fff" : "var(--dark)", cursor: "pointer", fontSize: ".78rem", borderRadius: 3, transition: "all .2s", ...f.style }}>
                          {f.label.slice(0, 8)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thread color */}
                  <div style={{ marginBottom: ".9rem" }}>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 600, color: "var(--dark)", marginBottom: ".4rem", fontFamily: "'DM Sans',sans-serif" }}>Thread Color</div>
                    <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                      {[
                        { hex: "#c8a96e", name: "Gold" },
                        { hex: "#ffffff", name: "White" },
                        { hex: "#c84a3d", name: "Red" },
                        { hex: "#9eaa8a", name: "Sage" },
                        { hex: "#1a1a18", name: "Black" },
                      ].map(c => (
                        <div key={c.hex} onClick={() => setCustomColor(c.hex)} title={c.name}
                          style={{ width: 26, height: 26, borderRadius: "50%", background: c.hex, border: customColor === c.hex ? "2px solid var(--dark)" : "2px solid var(--border)", cursor: "pointer", boxShadow: customColor === c.hex ? "0 0 0 2px var(--dark)" : "none", transform: customColor === c.hex ? "scale(1.15)" : "none", transition: "all .2s" }} />
                      ))}
                    </div>
                  </div>

                  {/* Placement */}
                  <div style={{ marginBottom: ".8rem" }}>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 600, color: "var(--dark)", marginBottom: ".4rem", fontFamily: "'DM Sans',sans-serif" }}>Placement</div>
                    <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                      {[
                        { id: "chest", label: "Chest" },
                        { id: "sleeve", label: "Sleeve" },
                        { id: "back", label: "Back" },
                      ].map(pos => (
                        <button key={pos.id} onClick={() => setCustomPosition(pos.id)}
                          style={{ padding: ".45rem .8rem", border: `1.5px solid ${customPosition === pos.id ? "var(--dark)" : "var(--border)"}`, background: customPosition === pos.id ? "var(--dark)" : "#fff", color: customPosition === pos.id ? "#fff" : "var(--dark)", cursor: "pointer", fontSize: ".68rem", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", borderRadius: 3, transition: "all .2s" }}>
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: ".65rem", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5, marginTop: ".8rem", display: "flex", gap: ".4rem", alignItems: "flex-start" }}>
                    <span style={{ marginTop: 1 }}>ⓘ</span>
                    <span>Customized items are final sale and ship in 5–7 business days.</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* =================== END PERSONALIZATION =================== */}

          <button onClick={handleAddToCart}
            style={{ width: "100%", background: addedToCart ? "var(--sage)" : "var(--dark)", color: "#fff", border: "none", padding: "1rem", fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: ".8rem", transition: "background .3s" }}>
            {addedToCart ? "ADDED TO BAG" : `ADD TO BAG · LE ${displayPrice.toLocaleString()}`}
          </button>

          <button onClick={toggleWish}
            style={{ width: "100%", background: "transparent", color: "var(--dark)", border: "1.5px solid var(--dark)", padding: "1rem", fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", transition: "all .2s" }}>
            <Heart on={isWished} />
            {isWished ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}
          </button>

          {product.stock < 5 && product.stock > 0 && (
            <div style={{ marginTop: ".8rem", fontSize: ".7rem", color: "var(--red)", fontFamily: "'DM Sans',sans-serif" }}>
              Only {product.stock} left in stock
            </div>
          )}

          <div style={{ height: 1, background: "var(--border)", margin: "1.5rem 0" }} />

          {[
            { title: "Product Details", content: product.description || "No description available." },
            { title: "Shipping & Returns", content: "Free shipping on orders above LE 500. Returns accepted within 14 days. Customized items are final sale." },
            { title: "Brand Info", content: `${product.brand} — available exclusively on StyleHub.` },
          ].map(({ title, content }) => (
            <AccordionItem key={title} title={title} content={content} />
          ))}

          <div style={{ borderBottom: "1px solid var(--border)" }}>
            <div onClick={() => setSizeGuideOpen(true)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".9rem 0", cursor: "pointer" }}>
              <span style={{ fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: "var(--dark)" }}>Size Guide</span>
              <span style={{ fontSize: "1.2rem", color: "var(--warm)" }}>+</span>
            </div>
          </div>
        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      {(() => {
        const allSimilar = [...sameBrandProducts, ...backendSimilar].slice(0, 4);
        return allSimilar.length > 0 && (
          <div className="pd-section" style={{ borderTop: "1px solid var(--border)", background: "var(--cream)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", fontWeight: 400, color: "var(--dark)", marginBottom: ".4rem" }}>You May Also Like</h2>
                <div style={{ width: 40, height: 2, background: "var(--warm)" }} />
              </div>
              <div className="pd-also-grid">
                {allSimilar.map(p => {
                  const isBackend = !p.img && !!p.images;
                  return (
                    <ProductCard
                      key={p.id || p._id}
                      p={isBackend ? {
                        id: p._id, name: p.name,
                        brand: p.seller?.brandName || product.brand,
                        price: `LE ${p.price?.toLocaleString()}`,
                        oldPrice: p.salePrice ? `LE ${p.salePrice?.toLocaleString()}` : null,
                        img: p.images?.[0] || null,
                      } : p}
                      getImageUrl={(img) => {
                        if (!img) return null;
                        if (img.startsWith("http")) return img;
                        return isBackend ? `https://stylehub-backend-tau.vercel.app${img}` : img;
                      }}
                      onClick={() => navigate(`/product/${p._id || p.id}`)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* REVIEWS */}
      <div className="pd-section" style={{ borderTop: "1px solid var(--border)", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 8, padding: "2rem", marginBottom: "2.5rem" }}>
            {isLoggedIn ? (
              <>
                <div style={{ marginBottom: "1.2rem" }}>
                  <div style={{ fontSize: ".62rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--dark)", marginBottom: ".6rem", fontFamily: "'DM Sans',sans-serif" }}>Your Rating</div>
                  <div style={{ display: "flex", gap: ".3rem" }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} type="button" onClick={() => setReviewRating(i)} onMouseEnter={() => setReviewHover(i)} onMouseLeave={() => setReviewHover(0)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill={(reviewHover || reviewRating) >= i ? "#c8a96e" : "none"} stroke="#c8a96e" strokeWidth="1.5">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: ".62rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--dark)", marginBottom: ".6rem", fontFamily: "'DM Sans',sans-serif" }}>Your Comment</div>
                  <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Share your thoughts..." rows={4}
                    style={{ width: "100%", padding: ".8rem", border: "1px solid var(--border)", fontFamily: "'DM Sans',sans-serif", fontSize: ".85rem", resize: "vertical", outline: "none", background: "#fff", borderRadius: 4, lineHeight: 1.6, boxSizing: "border-box" }} />
                </div>
                {reviewMsg && (
                  <div style={{ padding: ".6rem 1rem", borderRadius: 4, marginBottom: "1rem", fontSize: ".8rem", fontFamily: "'DM Sans',sans-serif", background: reviewMsg.type === "success" ? "#edf7ee" : "#fdf0ee", color: reviewMsg.type === "success" ? "#2d7a35" : "#c0392b" }}>
                    {reviewMsg.text}
                  </div>
                )}
                <button onClick={submitReview} disabled={submittingReview}
                  style={{ background: "var(--dark)", color: "#fff", border: "none", padding: ".7rem 2rem", fontSize: ".68rem", letterSpacing: ".14em", textTransform: "uppercase", cursor: submittingReview ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: submittingReview ? .6 : 1, borderRadius: 3 }}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <p style={{ fontSize: ".85rem", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif", marginBottom: "1rem" }}>Sign in to leave a review</p>
                <button onClick={() => navigate("/signin")}
                  style={{ background: "var(--dark)", color: "#fff", border: "none", padding: ".7rem 2rem", fontSize: ".68rem", letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", borderRadius: 3 }}>
                  Sign In
                </button>
              </div>
            )}
          </div>

          {reviews.length > 0 && (
            <>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "1.5rem" }}>Customer Reviews</h2>
              <div className="pd-reviews-grid">
                {reviews.map(r => (
                  <div key={r._id} style={{ padding: "1.2rem", border: "1px solid var(--border)", background: "var(--cream)", borderRadius: 4 }}>
                    <div style={{ display: "flex", gap: ".1rem", marginBottom: ".5rem" }}>
                      {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= r.rating} />)}
                    </div>
                    {r.comment && <p style={{ fontSize: ".8rem", color: "#555", lineHeight: 1.6, marginBottom: ".5rem" }}>{r.comment}</p>}
                    <div style={{ fontSize: ".65rem", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif" }}>
                      — {r.customer?.firstName} {r.customer?.lastName}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <SHFooter />
      {sizeGuideOpen && <SizeGuidePopup onClose={() => setSizeGuideOpen(false)} />}
    </div>
  );
}

function AccordionItem({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".9rem 0", cursor: "pointer" }}>
        <span style={{ fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: "var(--dark)" }}>{title}</span>
        <span style={{ fontSize: "1.2rem", color: "var(--warm)", transition: "transform .2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </div>
      {open && (
        <div style={{ paddingBottom: "1rem", fontSize: ".8rem", color: "#555", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif" }}>
          {content}
        </div>
      )}
    </div>
  );
}