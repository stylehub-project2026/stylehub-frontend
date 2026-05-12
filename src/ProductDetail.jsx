import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SHNav, SHFooter, SHARED_CSS } from "./shared";

const API = "https://stylehub-backend-tau.vercel.app/api";

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

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `https://stylehub-backend-tau.vercel.app${img}`;
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/products/${id}`)
      .then(r => r.json())
      .then(data => {
        const raw = data.data?.product;
        if (!raw) return;
        setProduct({
          id: raw._id,
          _id: raw._id,
          name: raw.name,
          brand: raw.seller?.brandName || "StyleHub",
          price: raw.price,
          salePrice: raw.salePrice,
          description: raw.description,
          sizes: (raw.sizes || []).map(s => typeof s === "object" ? s.name || String(s) : s),
          colors: (raw.colors || []).map(c => typeof c === "object" ? c.hex || c.value || String(c) : c),
          images: raw.images || [],
          rating: raw.avgRating || 0,
          reviewCount: raw.reviewCount || 0,
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
    fetch(`${API}/products/${id}/reviews`)
      .then(r => r.json())
      .then(data => setReviews(data.data?.reviews || []))
      .catch(() => { });
  }, [id]);

  const toggleWish = () => {
    setWish(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  };

  const handleAddToCart = async () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    const token = localStorage.getItem("token");
    if (token && product._id) {
      await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product._id, quantity: 1, size: selectedSize }),
      }).catch(console.error);
    }

    setCart(prev => {
      const existing = prev.find(x => x.id === product.id && x.size === selectedSize);
      if (existing) return prev.map(x => x.id === product.id && x.size === selectedSize ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, {
        id: product.id, size: selectedSize, qty: 1,
        product: { id: product.id, _id: product._id, name: product.name, price: `LE ${product.price?.toLocaleString()}`, salePrice: product.salePrice ? `LE ${product.salePrice?.toLocaleString()}` : null, img: getImageUrl(product.images[0]), brand: product.brand }
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
      setReviewMsg({ type: "success", text: "Review submitted! Thank you 🎉" });
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{SHARED_CSS}</style>
      <SHNav cart={cart} wish={wish} />

      {/* Breadcrumb */}
      <div style={{ padding: "1rem 5%", fontSize: ".7rem", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif", display: "flex", gap: ".5rem", alignItems: "center" }}>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</span>
        <span>›</span>
        <span onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>{product.brand}</span>
        <span>›</span>
        <span style={{ color: "var(--dark)" }}>{product.name}</span>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", padding: "1rem 5% 4rem", maxWidth: 1200, margin: "0 auto" }}>

        {/* LEFT — Images */}
        <div>
          {/* Main Image */}
          <div style={{ aspectRatio: "3/4", background: "#f0ece6", overflow: "hidden", marginBottom: "1rem", position: "relative" }}>
            {allImages[selectedImg] ? (
              <img src={getImageUrl(allImages[selectedImg])} alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => e.target.style.display = "none"} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "3rem", color: "rgba(26,26,24,.1)" }}>{product.brand[0]}</span>
              </div>
            )}
            {discountPct && (
              <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--red)", color: "#fff", fontSize: ".6rem", letterSpacing: ".1em", padding: ".3rem .7rem", fontWeight: 700 }}>SALE</div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              {allImages.map((img, i) => (
                <div key={i} onClick={() => setSelectedImg(i)}
                  style={{ width: 70, height: 90, overflow: "hidden", cursor: "pointer", border: `2px solid ${selectedImg === i ? "var(--dark)" : "transparent"}`, background: "#f0ece6" }}>
                  <img src={getImageUrl(img)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Info */}
        <div style={{ paddingTop: "1rem" }}>
          {/* Brand */}
          <div style={{ fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".5rem", fontFamily: "'DM Sans',sans-serif" }}>
            {product.brand}
          </div>

          {/* Name */}
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.2rem", fontWeight: 400, lineHeight: 1.2, marginBottom: "1rem", color: "var(--dark)" }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", gap: ".1rem" }}>
              {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= Math.round(product.rating)} />)}
            </div>
            <span style={{ fontSize: ".72rem", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif" }}>
              {product.rating.toFixed(1)} · {product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", fontWeight: 600, color: product.salePrice ? "var(--red)" : "var(--dark)" }}>
              LE {(product.salePrice || product.price)?.toLocaleString()}
            </span>
            {product.salePrice && (
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", color: "var(--warm)", textDecoration: "line-through" }}>
                LE {product.price?.toLocaleString()}
              </span>
            )}
            {discountPct && (
              <span style={{ background: "var(--red)", color: "#fff", fontSize: ".6rem", padding: ".2rem .5rem", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)", marginBottom: "1.5rem" }} />

          {/* Size Selector */}
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

          {/* Colors */}
          {product.colors.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--dark)", fontWeight: 600, marginBottom: ".7rem", fontFamily: "'DM Sans',sans-serif" }}>COLOR</div>
              <div style={{ display: "flex", gap: ".5rem" }}>
                {product.colors.map((c, i) => (
                  <div key={i} onClick={() => { setSelectedColor(c); setSelectedImg(i); }}
                    style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: selectedColor === c ? "2px solid var(--dark)" : "2px solid var(--border)", cursor: "pointer", boxShadow: selectedColor === c ? "0 0 0 2px var(--dark)" : "none", transform: selectedColor === c ? "scale(1.15)" : "none", transition: "all .2s" }} />
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button onClick={handleAddToCart}
            style={{ width: "100%", background: addedToCart ? "var(--sage)" : "var(--dark)", color: "#fff", border: "none", padding: "1rem", fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: ".8rem", transition: "background .3s" }}>
            {addedToCart ? "✓ ADDED TO BAG" : "ADD TO BAG"}
          </button>

          {/* Wishlist */}
          <button onClick={toggleWish}
            style={{ width: "100%", background: "transparent", color: "var(--dark)", border: "1.5px solid var(--dark)", padding: "1rem", fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", transition: "all .2s" }}>
            <Heart on={isWished} />
            {isWished ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}
          </button>

          {/* Stock */}
          {product.stock < 5 && product.stock > 0 && (
            <div style={{ marginTop: ".8rem", fontSize: ".7rem", color: "var(--red)", fontFamily: "'DM Sans',sans-serif" }}>
              Only {product.stock} left in stock
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)", margin: "1.5rem 0" }} />

          {/* Accordion */}
          {[
            { title: "Product Details", content: product.description || "No description available." },
            { title: "Shipping & Returns", content: "Free shipping on orders above LE 500. Returns accepted within 14 days." },
            { title: "Size Guide", content: "XS: 0-2 | S: 4-6 | M: 8-10 | L: 12-14 | XL: 16-18" },
            { title: "Brand Info", content: `${product.brand} — available exclusively on StyleHub.` },
          ].map(({ title, content }) => (
            <AccordionItem key={title} title={title} content={content} />
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ padding: "3rem 5%", borderTop: "1px solid var(--border)", background: "#fff", maxWidth: 1200, margin: "0 auto" }}>

        {/* Review Form */}
        <div style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 8, padding: "2rem", marginBottom: "2.5rem" }}>
          {isLoggedIn ? (
            <>
              {/* Star Rating */}
              <div style={{ marginBottom: "1.2rem" }}>
                <div style={{ fontSize: ".62rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--dark)", marginBottom: ".6rem", fontFamily: "'DM Sans',sans-serif" }}>Your Rating</div>
                <div style={{ display: "flex", gap: ".3rem" }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <button key={i} type="button"
                      onClick={() => setReviewRating(i)}
                      onMouseEnter={() => setReviewHover(i)}
                      onMouseLeave={() => setReviewHover(0)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <svg width="26" height="26" viewBox="0 0 24 24"
                        fill={(reviewHover || reviewRating) >= i ? "#c8a96e" : "none"}
                        stroke="#c8a96e" strokeWidth="1.5">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: ".62rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--dark)", marginBottom: ".6rem", fontFamily: "'DM Sans',sans-serif" }}>Your Comment</div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  style={{ width: "100%", padding: ".8rem", border: "1px solid var(--border)", fontFamily: "'DM Sans',sans-serif", fontSize: ".85rem", resize: "vertical", outline: "none", background: "#fff", borderRadius: 4, lineHeight: 1.6, boxSizing: "border-box" }}
                />
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

        {/* Existing Reviews */}
        {reviews.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "1.5rem" }}>Customer Reviews</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem" }}>
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

      <SHFooter />
    </div>
  );
}

function AccordionItem({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".9rem 0", cursor: "pointer" }}>
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