import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SHNav, SHFooter, SHARED_CSS, useScrollReveal } from "./shared";

// ─── BRAND CONFIG ───
const BRAND = {
  name: "Ninos",
  desc: "Ninos is a kids clothing brand that blends playful design with everyday comfort, offering stylish pieces such as sweatshirts, jackets, bottoms, and tees for children who love to move. Since 2015, NINOS has been dedicated to providing families across Egypt with high-quality products.",
  logo: "/ninos.jpg",
  heroBg: "/ninos-hero.jpg",
  accentColor: "#92A079",
  heroOverlay: "rgba(248,246,242,.60)",
};

// ─── SIZE RATIOS ───
const SZ = {
  heroBanner: 420,
  heroLogoSize: 200,
  shopCardH: 220,
  gridCardRatio: "4/4",
};

// ─── DATA ───
const API = "https://stylehub-backend-tau.vercel.app/api";

// ─── HEART ───
const Heart = ({ on }) => (
  <svg width="16" height="16" viewBox="0 0 24 24"
    fill={on ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ─── PRODUCT CARD ───
function PCard({ p, wish, toggleWish }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/product/${p.id}`)}
      style={{ background: "#fff", border: "1px solid var(--border)", cursor: "pointer", transition: "box-shadow .25s", borderRadius: 5, overflow: "hidden" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(26,26,24,.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: SZ.gridCardRatio, background: "#f0ece6" }}>
        <img src={p.img} alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          onError={e => e.target.style.display = "none"} />
        {p.oldPrice && (
          <div style={{ position: "absolute", top: ".7rem", left: ".7rem", background: "var(--red)", color: "#fff", fontSize: ".52rem", letterSpacing: ".1em", padding: ".2rem .55rem", fontWeight: 700, borderRadius: 3 }}>SALE</div>
        )}
        <button onClick={e => { e.stopPropagation(); toggleWish(p.id); }}
          style={{ position: "absolute", top: ".7rem", right: ".7rem", width: 30, height: 30, background: "#fff", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.1)", color: wish.includes(p.id) ? "var(--red)" : "inherit" }}>
          <Heart on={wish.includes(p.id)} />
        </button>
      </div>
      <div style={{ padding: ".55rem .65rem" }}>
        <div style={{ fontSize: ".52rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".15rem" }}>Ninos</div>
        <div style={{ fontSize: ".78rem", fontWeight: 500, marginBottom: ".25rem", lineHeight: 1.3 }}>{p.name}</div>
        <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          {p.oldPrice && <span style={{ fontSize: ".68rem", color: "var(--warm)", textDecoration: "line-through" }}>{p.oldPrice}</span>}
          <span style={{ fontSize: ".78rem", fontWeight: 600, color: p.oldPrice ? "var(--red)" : "" }}>{p.price}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───
export default function NinosBrand({ cart, wish = [], setWish }) {
  const [allProducts, setAllProducts] = useState([]);
  const [selSizes, setSelSizes] = useState(null);
  const [selColors, setSelColors] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [selCategory, setSelCategory] = useState("all");
  const [selType, setSelType] = useState("all");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const PER_PAGE = 9;

  const navigate = useNavigate();
  const addRef = useScrollReveal();
  const toggleWish = id => setWish(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  const toggleSize = s => { setSelSizes(p => p === s ? null : s); setPage(1); };
  const toggleColor = c => { setSelColors(p => p === c ? null : c); setPage(1); };
  const toggleType = t => { setSelType(p => p === t ? "all" : t); setPage(1); };
  const toNum = s => parseInt((s || "").toString().replace(/\D/g, "")) || 0;
  const scrollGrid = () => document.getElementById("ninos-grid")?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    fetch(`${API}/products?brand=Ninos&limit=100`)
      .then(r => r.json())
      .then(data => {
        const prods = (data.data?.products || []).map(p => ({
          id: p._id, _id: p._id, name: p.name, brand: "Ninos",
          price: `LE ${p.price?.toLocaleString()}`,
          oldPrice: p.salePrice ? `LE ${p.salePrice?.toLocaleString()}` : null,
          img: (p.images && p.images[0]) ? p.images[0] : null,
          imgs: p.images?.slice(1) || [],
          colors: p.colors || [], sizes: p.sizes || [],
          rating: p.avgRating || 0, reviews: p.reviewCount || 0,
          desc: p.description || "", type: p.tags?.[0] || "tops", mongoId: p._id,
        }));
        setAllProducts(prods);
      })
      .catch(() => setAllProducts([]));
  }, []);

  const ALL_SIZES = [...new Set(allProducts.flatMap(p => p.sizes))];
  const ALL_COLORS = [...new Set(allProducts.flatMap(p => p.colors))];

  let filtered = allProducts;
  if (selCategory !== "all") filtered = filtered.filter(p => p.category === selCategory);
  if (selType !== "all") filtered = filtered.filter(p => p.type === selType);
  if (selSizes) filtered = filtered.filter(p => p.sizes.includes(selSizes));
  if (selColors) filtered = filtered.filter(p => p.colors.includes(selColors));
  if (sortBy === "low") filtered = [...filtered].sort((a, b) => toNum(a.price) - toNum(b.price));
  if (sortBy === "high") filtered = [...filtered].sort((a, b) => toNum(b.price) - toNum(a.price));
  if (sortBy === "sale") filtered = filtered.filter(p => p.oldPrice);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hasActiveFilters = selSizes || selColors || selCategory !== "all" || selType !== "all";

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{SHARED_CSS + PAGE_CSS}</style>
      <SHNav cart={cart} wish={wish} />

      {/* ════════════════════════════════
          1. HERO BANNER
      ════════════════════════════════ */}
      <section className="ninos-hero" style={{
        position: "relative", height: SZ.heroBanner, overflow: "hidden",
        background: "#ffffff",
        display: "flex", alignItems: "center",
        margin: "1.5rem", borderRadius: 10,
        border: "2px solid rgba(26,26,24,.2)",
        boxShadow: "0 4px 24px rgba(26,26,24,.07)"
      }}>
        <img src={BRAND.heroBg} alt="" aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .08, borderRadius: 10 }}
          onError={e => e.target.style.display = "none"} />
        <div style={{ position: "absolute", inset: 0, background: BRAND.heroOverlay, borderRadius: 10 }} />

        <div className="ninos-hero-inner" style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "4rem", padding: "0 6%", width: "100%" }}>

          {/* LOGO */}
          <div className="ninos-hero-logo" style={{ width: SZ.heroLogoSize, height: SZ.heroLogoSize, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "3px solid rgba(26,26,24,.15)", boxShadow: "0 8px 32px rgba(26,26,24,.12)" }}>
            <img src={BRAND.logo} alt={BRAND.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={e => e.target.style.display = "none"} />
          </div>

          {/* TEXT */}
          <div className="ninos-hero-text">
            <div style={{ fontSize: ".6rem", letterSpacing: ".35em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".6rem" }}>StyleHub</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 400, lineHeight: 1, marginBottom: ".8rem", color: "var(--dark)" }}>{BRAND.name}</h1>
            <p className="ninos-hero-desc" style={{ fontSize: ".8rem", lineHeight: 1.7, color: "#555", maxWidth: 480 }}>{BRAND.desc}</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          2. SEE WHAT'S POPULAR
      ════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "5rem 6%", borderBottom: "2px solid rgba(26,26,24,.12)" }}>
        <div className="popular-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

          {/* LEFT TEXT */}
          <div className="reveal" ref={addRef}>
            <div style={{ fontSize: ".58rem", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--warm)", marginBottom: "1rem" }}>Ninos Collection</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.9rem,3vw,2.8rem)", fontWeight: 400, lineHeight: 1.2, marginBottom: "1.2rem" }}>See What's Popular</h2>
            <p style={{ fontSize: ".86rem", lineHeight: 1.85, color: "#555252", marginBottom: "2rem", maxWidth: 400 }}>{BRAND.desc}</p>
            <button onClick={scrollGrid} className="ninos-cta-btn">Click Here</button>
          </div>

          {/* RIGHT — decorative dark blob */}
          <div className="popular-blob" style={{ position: "relative", minHeight: "300px" }}>
            <div style={{ position: "absolute", right: "-6%", top: "-22%", width: "52%", height: "144%", background: "var(--dark)", borderRadius: "60% 0 0 60%", zIndex: 0 }} />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════
          3. ALL PRODUCTS — filters + grid
      ════════════════════════════════ */}
      <div className="products-layout" style={{ display: "flex", gap: "2.5rem", padding: "3rem 6%", alignItems: "flex-start", background: "var(--cream)" }}>

        {/* MOBILE FILTER TOGGLE */}
        <button
          className="mobile-filter-toggle"
          onClick={() => setSidebarOpen(o => !o)}
        >
          <span>☰</span> {sidebarOpen ? "Hide Filters" : "Show Filters"}
          {hasActiveFilters && <span className="filter-badge">●</span>}
        </button>

        {/* SIDEBAR */}
        <div className={`products-sidebar${sidebarOpen ? " sidebar-open" : ""}`} style={{ width: 185, flexShrink: 0, position: "sticky", top: "70px" }}>

          {/* Sort */}
          <div style={{ marginBottom: "1.8rem" }}>
            <div className="filter-label">Sort By</div>
            {[["default", "Default"], ["low", "Price: Low → High"], ["high", "Price: High → Low"], ["sale", "On Sale"]].map(([val, label]) => (
              <div key={val} onClick={() => setSortBy(val)}
                style={{ fontSize: ".75rem", padding: ".28rem 0", cursor: "pointer", color: sortBy === val ? "var(--dark)" : "var(--warm)", fontWeight: sortBy === val ? 600 : 400, transition: "color .2s" }}>
                {label}
              </div>
            ))}
          </div>

          {/* Category */}
          <FilterSection title="Category">
            {[["all", "All"], ["boys", "Boys"], ["girls", "Girls"]].map(([val, label]) => (
              <CheckRow key={val} label={label} active={selCategory === val} onClick={() => { setSelCategory(val); setPage(1); setSidebarOpen(false); }} />
            ))}
          </FilterSection>

          {/* Type */}
          <FilterSection title="Type">
            {[
              ["tops", "Tops"],
              ["bottoms", "Bottoms"],
              ["jackets", "Jackets"],
              ["t-shirt", "T-Shirt"],
              ["hoodies", "Hoodies"],
            ].map(([val, label]) => (
              <CheckRow key={val} label={label} active={selType === val} onClick={() => { toggleType(val); setSidebarOpen(false); }} />
            ))}
          </FilterSection>

          {/* Size */}
          <FilterSection title="Size">
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".32rem" }}>
              {ALL_SIZES.map(s => (
                <button key={s} onClick={() => toggleSize(s)}
                  style={{ padding: ".26rem .52rem", fontSize: ".63rem", border: `1.5px solid ${selSizes === s ? "var(--dark)" : "var(--border)"}`, background: selSizes === s ? "var(--dark)" : "transparent", color: selSizes === s ? "#fff" : "var(--dark)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s", minWidth: 32, borderRadius: 3 }}>
                  {s}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Color */}
          <FilterSection title="Color">
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
              {ALL_COLORS.map((c, i) => (
                <div key={i} onClick={() => toggleColor(c)}
                  style={{ width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer", border: (c === "#ffffffff" || c === "#fff") ? "1.5px solid var(--border)" : "2px solid transparent", boxShadow: selColors === c ? "0 0 0 2.5px var(--dark)" : "none", transform: selColors === c ? "scale(1.2)" : "none", transition: "all .2s" }} />
              ))}
            </div>
          </FilterSection>

          {hasActiveFilters && (
            <button onClick={() => { setSelSizes(null); setSelColors(null); setSelCategory("all"); setSelType("all"); setPage(1); setSidebarOpen(false); }}
              style={{ fontSize: ".61rem", letterSpacing: ".1em", textTransform: "uppercase", background: "none", border: "1px solid var(--border)", padding: ".36rem .8rem", cursor: "pointer", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif", width: "100%", borderRadius: 3 }}>
              Clear Filters
            </button>
          )}
        </div>

        {/* GRID */}
        <div id="ninos-grid" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: ".7rem", color: "var(--warm)", marginBottom: "1rem", letterSpacing: ".04em" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {totalPages > 1 ? ` — page ${page} of ${totalPages}` : ""}
          </div>

          {filtered.length === 0
            ? <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--warm)", fontSize: ".85rem" }}>No products match your filters.</div>
            : <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.4rem" }}>
              {paginated.map(p => <PCard key={p.id} p={p} wish={wish} toggleWish={toggleWish} />)}
            </div>
          }

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination-row" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: ".45rem", padding: "2.5rem 0" }}>
              <PagBtn onClick={() => { setPage(p => Math.max(1, p - 1)); scrollGrid(); }} disabled={page === 1}>‹</PagBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <PagBtn key={n} onClick={() => { setPage(n); scrollGrid(); }} active={page === n}>{n}</PagBtn>
              ))}
              <PagBtn onClick={() => { setPage(p => Math.min(totalPages, p + 1)); scrollGrid(); }} disabled={page === totalPages}>›</PagBtn>
            </div>
          )}
        </div>
      </div>

      <SHFooter addRef={addRef} />
    </div>
  );
}

// ─── SMALL HELPERS ───
const FilterSection = ({ title, children }) => (
  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.3rem", marginBottom: "1.6rem" }}>
    <div className="filter-label">{title}</div>
    {children}
  </div>
);

const CheckRow = ({ label, active, onClick }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".26rem 0", cursor: "pointer" }}>
    <div style={{ width: 13, height: 13, border: `1.5px solid ${active ? "var(--dark)" : "var(--border)"}`, background: active ? "var(--dark)" : "transparent", borderRadius: 2, flexShrink: 0, transition: "all .2s" }} />
    <span style={{ fontSize: ".73rem", color: active ? "var(--dark)" : "var(--warm)", transition: "color .2s" }}>{label}</span>
  </div>
);

const PagBtn = ({ children, onClick, disabled, active }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${active ? "var(--dark)" : "var(--border)"}`, background: active ? "var(--dark)" : "none", color: active ? "#fff" : "var(--dark)", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .4 : 1, fontSize: children === "‹" || children === "›" ? "1rem" : ".75rem", fontWeight: active ? 600 : 400, transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
    {children}
  </button>
);

// ─── PAGE CSS ───
const PAGE_CSS = `
.filter-label {
  font-size:.6rem;
  letter-spacing:.2em;
  text-transform:uppercase;
  font-weight:600;
  margin-bottom:.65rem;
  color:var(--dark);
}
.ninos-cta-btn {
  background:var(--dark);
  color:#fff;
  border:none;
  padding:.65rem 1.8rem;
  font-size:.68rem;
  letter-spacing:.14em;
  text-transform:uppercase;
  font-weight:600;
  cursor:pointer;
  font-family:'DM Sans',sans-serif;
  border-radius:3px;
  transition:background .2s;
}
.ninos-cta-btn:hover { background:#92A079; }

/* ── Mobile filter toggle button ── */
.mobile-filter-toggle {
  display: none;
}

/* ════════════════════════════
   TABLET  (≤1024px)
════════════════════════════ */
@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .ninos-hero-inner {
    gap: 2.5rem !important;
  }
}

/* ════════════════════════════
   MOBILE  (≤768px)
════════════════════════════ */
@media (max-width: 768px) {

  /* Hero */
  .ninos-hero {
    margin: 0.6rem !important;
    height: auto !important;
    min-height: unset !important;
    border-radius: 8px !important;
  }
  .ninos-hero-inner {
    flex-direction: column !important;
    gap: 1.4rem !important;
    padding: 2rem 1.2rem 2.2rem !important;
    text-align: center !important;
    align-items: center !important;
  }
  .ninos-hero-logo {
    width: 110px !important;
    height: 110px !important;
  }
  .ninos-hero-text {
    max-width: 100% !important;
  }
  .ninos-hero-desc {
    display: none !important;
  }

  /* Popular section */
  .popular-grid {
    grid-template-columns: 1fr !important;
    gap: 0 !important;
  }
  .popular-blob {
    display: none !important;
  }

  /* Products layout — stack sidebar above grid */
  .products-layout {
    flex-direction: column !important;
    padding: 1.2rem 4% !important;
    gap: 0 !important;
  }

  /* Mobile filter toggle */
  .mobile-filter-toggle {
    display: flex !important;
    align-items: center;
    gap: .5rem;
    width: 100%;
    background: var(--dark);
    color: #fff;
    border: none;
    padding: .65rem 1rem;
    font-size: .72rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  .filter-badge {
    color: #92A079;
    font-size: .9rem;
    line-height: 1;
  }

  /* Sidebar — hidden by default on mobile, shown when open */
  .products-sidebar {
    display: none;
    width: 100% !important;
    position: static !important;
    top: unset !important;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.2rem 1rem;
    margin-bottom: 1.2rem;
  }
  .products-sidebar.sidebar-open {
    display: block !important;
  }

  /* Product grid */
  .product-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.8rem !important;
  }

  /* Pagination */
  .pagination-row {
    flex-wrap: wrap !important;
    gap: .3rem !important;
    padding: 1.5rem 0 !important;
  }
}

/* ════════════════════════════
   SMALL MOBILE  (≤480px)
════════════════════════════ */
@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.6rem !important;
  }
  .ninos-hero {
    margin: 0.4rem !important;
  }
  .ninos-hero-logo {
    width: 90px !important;
    height: 90px !important;
  }
}
`;
