import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SHNav, SHFooter, SHARED_CSS, useScrollReveal } from "./shared";

const API = "https://stylehub-backend-tau.vercel.app/api";

const Heart = ({ on }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ── PRODUCT CARD ──
function KidCard({ p, wish, toggleWish }) {
  const navigate = useNavigate();
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", cursor: "pointer", transition: "box-shadow .25s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,26,24,.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
      onClick={() => navigate(`/product/${p.id}`)}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "2/2", background: "#f0ece6" }}>
        {p.img
          ? <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }}
            onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"} />
          : <div style={{ width: "100%", height: "100%", background: `linear-gradient(${p.gradient})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", color: "rgba(255,255,255,.2)" }}>{p.brand[0]}</span>
          </div>
        }
        {p.oldPrice && <div style={{ position: "absolute", top: ".8rem", left: ".8rem", background: "var(--red)", color: "#fff", fontSize: ".55rem", letterSpacing: ".1em", padding: ".25rem .6rem", fontWeight: 600 }}>SALE</div>}
        <button onClick={e => { e.stopPropagation(); toggleWish(p.id); }} style={{ position: "absolute", top: ".8rem", right: ".8rem", width: 32, height: 32, background: "#fff", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.1)", color: wish.includes(p.id) ? "var(--red)" : "inherit" }}>
          <Heart on={wish.includes(p.id)} />
        </button>
      </div>
      <div style={{ padding: ".6rem .7rem" }}>
        <div style={{ fontSize: ".55rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".2rem" }}>{p.brand}</div>
        <div style={{ fontSize: ".78rem", fontWeight: 500, marginBottom: ".3rem", lineHeight: 1.3 }}>{p.name}</div>
        <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          {p.oldPrice && <span style={{ fontSize: ".7rem", color: "var(--warm)", textDecoration: "line-through" }}>{p.oldPrice}</span>}
          <span style={{ fontSize: ".78rem", fontWeight: 600, color: p.oldPrice ? "var(--red)" : "" }}>{p.price}</span>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──
export default function Kids({ cart, setCart, wish, setWish }) {
  const [allProducts, setAllProducts] = useState([]);
  const [selSizes, setSelSizes] = useState([]);
  const [selColors, setSelColors] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [selCategory, setSelCategory] = useState("all");
  const [selBrands, setSelBrands] = useState([]);
  const [selType, setSelType] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const addRef = useScrollReveal();

  useEffect(() => {
    fetch(`${API}/products?category=kids&limit=100`)
      .then(r => r.json())
      .then(data => {
        const list = (data.data?.products || []).map(p => ({
          id: p._id,
          name: p.name,
          price: `LE ${p.price?.toLocaleString()}`,
          oldPrice: p.salePrice ? `LE ${p.salePrice?.toLocaleString()}` : null,
          brand: p.seller?.brandName || "StyleHub",
          img: p.images?.[0] ? `https://stylehub-backend-tau.vercel.app${p.images[0]}` : null,
          sizes: p.sizes || [],
          colors: p.colors || [],
          type: p.tags?.[0] || "",
          category: p.category,
        }));
        setAllProducts(list);
      })
      .catch(() => { });
  }, []);

  const ALL_SIZES = [...new Set(allProducts.flatMap(p => p.sizes))].sort();
  const ALL_COLORS = [...new Set(allProducts.flatMap(p => p.colors))];

  const toggleWish = id => setWish(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  const toggleSize = s => { setSelSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]); setPage(1); };
  const toggleColor = c => { setSelColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]); setPage(1); };
  const toggleBrand = b => { setSelBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]); setPage(1); };
  const toggleType = t => { setSelType(prev => prev === t ? "all" : t); setPage(1); };

  // filter
  let filtered = allProducts;
  if (selCategory !== "all") filtered = filtered.filter(p => p.category === selCategory);
  if (selType !== "all") filtered = filtered.filter(p => p.type === selType);
  if (selBrands.length > 0) filtered = filtered.filter(p => selBrands.includes(p.brand.toLowerCase()));
  if (selSizes.length > 0) filtered = filtered.filter(p => p.sizes.some(s => selSizes.includes(s)));
  if (selColors.length > 0) filtered = filtered.filter(p => p.colors.some(c => selColors.includes(c)));

  // sort
  if (sortBy === "low") filtered = [...filtered].sort((a, b) => parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, "")));
  if (sortBy === "high") filtered = [...filtered].sort((a, b) => parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, "")));
  if (sortBy === "sale") filtered = filtered.filter(p => p.oldPrice);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{SHARED_CSS}</style>

      {/* NAV */}
      <SHNav cart={cart} wish={wish} />

      {/* HERO BANNER */}
      <div style={{ position: "relative", height: 390, overflow: "hidden", background: "linear-gradient(135deg,#6b8aad,#3a5878)", display: "flex", alignItems: "center" }}>
        <img src="/2.jpg" alt="kids" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .5 }}
          onError={e => e.target.style.display = "none"} />
        <div style={{ position: "relative", zIndex: 2, padding: "0 5%" }}>
          <div style={{ fontSize: ".7rem", letterSpacing: ".25em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginBottom: ".8rem" }}>StyleHub</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>Kids Collection</h1>
          <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.75)", maxWidth: 400, lineHeight: 1.8 }}>Curated styles for little ones from Egypt's top local brands.</p>
        </div>
      </div>

      {/* SUB CATEGORIES */}
      <section style={{ padding: "2.5rem 2rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Boys", key: "boys", img: "/boyi.jpg", gradient: "145deg,#8a9e7a,#4a6040" },
            { label: "Girls", key: "girls", img: "/girly.jpg", gradient: "145deg,#c4b8a8,#8a7868" },


          ].map(cat => (
            <div key={cat.label} style={{ textAlign: "center", cursor: "pointer" }} onClick={() => { setSelCategory(selCategory === cat.key ? "all" : cat.key); setPage(1); }}>
              <div style={{ width: 140, height: 140, borderRadius: "60%", overflow: "hidden", background: `linear-gradient(${cat.gradient})`, margin: "0 auto .6rem", border: `3px solid ${selCategory === cat.key ? "var(--dark)" : "var(--border)"}`, transition: "border-color .2s", transform: selCategory === cat.key ? "scale(1.05)" : "none" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--sage)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = selCategory === cat.key ? "var(--dark)" : "var(--border)"}>
                <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                  onError={e => e.target.style.display = "none"} />
              </div>
              <div style={{ fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 500, color: selCategory === cat.key ? "var(--dark)" : "inherit" }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS + FILTERS */}
      <div style={{ display: "flex", gap: "2rem", padding: "2.5rem 2rem", alignItems: "flex-start" }}>

        {/* FILTERS SIDEBAR */}
        <div style={{ width: 200, flexShrink: 0, position: "sticky", top: "70px" }}>

          {/* Sort */}
          <div style={{ marginBottom: "1.8rem" }}>
            <div style={{ fontSize: ".70rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".8rem" }}>Sort By</div>
            {[["default", "Default"], ["low", "Price: Low to High"], ["high", "Price: High to Low"], ["sale", "On Sale"]].map(([val, label]) => (
              <div key={val} onClick={() => setSortBy(val)} style={{ fontSize: ".78rem", padding: ".3rem 0", cursor: "pointer", color: sortBy === val ? "var(--dark)" : "var(--warm)", fontWeight: sortBy === val ? 600 : 400, transition: "color .2s" }}>
                {label}
              </div>
            ))}
          </div>


          {/* Brand */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginBottom: "1.8rem" }}>
            <div style={{ fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".8rem" }}>Brand</div>
            {[...new Set(allProducts.map(p => p.brand))].map(b => (
              <div key={b} onClick={() => toggleBrand(b.toLowerCase())} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".3rem 0", cursor: "pointer" }}>
                <div style={{ width: 14, height: 14, border: `1.5px solid ${selBrands.includes(b.toLowerCase()) ? "var(--dark)" : "var(--border)"}`, background: selBrands.includes(b.toLowerCase()) ? "var(--dark)" : "transparent", borderRadius: 2, flexShrink: 0, transition: "all .2s" }} />
                <span style={{ fontSize: ".75rem", color: selBrands.includes(b.toLowerCase()) ? "var(--dark)" : "var(--warm)", transition: "color .2s" }}>{b}</span>
              </div>
            ))}
          </div>


          {/* Type */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginBottom: "1.8rem" }}>
            <div style={{ fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".8rem" }}>Type</div>
            {[["tops", "Tops"], ["bottoms", "Bottoms"], ["jackets", "Jackets"]].map(([val, label]) => (
              <div key={val} onClick={() => toggleType(val)} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".3rem 0", cursor: "pointer" }}>
                <div style={{ width: 14, height: 14, border: `1.5px solid ${selType === val ? "var(--dark)" : "var(--border)"}`, background: selType === val ? "var(--dark)" : "transparent", borderRadius: 2, flexShrink: 0, transition: "all .2s" }} />
                <span style={{ fontSize: ".75rem", color: selType === val ? "var(--dark)" : "var(--warm)", transition: "color .2s" }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginBottom: "1.8rem" }}>
            <div style={{ fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".8rem" }}>Size</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
              {ALL_SIZES.map(s => (
                <button key={s} onClick={() => toggleSize(s)} style={{ padding: ".3rem .6rem", fontSize: ".68rem", border: `1.5px solid ${selSizes.includes(s) ? "var(--dark)" : "var(--border)"}`, background: selSizes.includes(s) ? "var(--dark)" : "transparent", color: selSizes.includes(s) ? "#fff" : "var(--dark)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s", minWidth: 36 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".8rem" }}>Color</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
              {ALL_COLORS.map((c, i) => (
                <div key={i} onClick={() => toggleColor(c)} style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: c === "#ffffffff" || c === "#fff" ? "1.5px solid var(--border)" : "2px solid transparent", boxShadow: selColors.includes(c) ? "0 0 0 2px var(--dark)" : "none", transform: selColors.includes(c) ? "scale(1.15)" : "none", transition: "all .2s" }} />
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {(selSizes.length > 0 || selColors.length > 0 || selBrands.length > 0 || selCategory !== "all" || selType !== "all") && (
            <button onClick={() => { setSelSizes([]); setSelColors([]); setSelBrands([]); setSelCategory("all"); setSelType("all"); setPage(1); }} style={{ fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase", background: "none", border: "1px solid var(--border)", padding: ".4rem .8rem", cursor: "pointer", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif", transition: "all .2s", width: "100%" }}>
              Clear Filters
            </button>
          )}
        </div>

        {/* PRODUCTS GRID */}
        <div id="products-grid" style={{ flex: 1 }}>
          {/* count */}
          <div style={{ fontSize: ".72rem", color: "var(--warm)", marginBottom: "1.2rem", letterSpacing: ".04em" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} {totalPages > 1 ? `— page ${page} of ${totalPages}` : ""}
          </div>

          {filtered.length === 0
            ? <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--warm)", fontSize: ".85rem" }}>No products match your filters.</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2.3rem" }}>
              {paginated.map(p => (
                <KidCard key={p.id} p={p} wish={wish} toggleWish={toggleWish} />
              ))}
            </div>
          }
        </div>
      </div>


      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: ".5rem", padding: "2.5rem 0" }}>
          <button onClick={() => { setPage(p => Math.max(1, p - 1)); document.getElementById("products-grid").scrollIntoView({ behavior: "smooth" }); }} disabled={page === 1}
            style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "none", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? .4 : 1, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => { setPage(n); document.getElementById("products-grid").scrollIntoView({ behavior: "smooth" }); }}
              style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${page === n ? "var(--dark)" : "var(--border)"}`, background: page === n ? "var(--dark)" : "none", color: page === n ? "#fff" : "var(--dark)", cursor: "pointer", fontSize: ".78rem", fontWeight: page === n ? 600 : 400, transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {n}
            </button>
          ))}
          <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); document.getElementById("products-grid").scrollIntoView({ behavior: "smooth" }); }} disabled={page === totalPages}
            style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "none", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? .4 : 1, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ›
          </button>
        </div>
      )}

      {/* FOOTER */}
      <SHFooter addRef={addRef} />

    </div>
  );
}
