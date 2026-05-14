import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SHNav, SHFooter, useScrollReveal, SHARED_CSS, PRODUCTS, shuffle } from "./shared";


/* ══════════════════════════════════════════ DATA ══════════════════════════════════════════ */
const HERO_SLIDES = [
  {
    ey: "New Collection 2026",
    h1: "Elegant Styles\nMade for You!",
    sub: "Discover the latest women's looks from Egypt's top local brands.",
    btn: "Shop Now",
    img: "/images/women_hero1.jpg",
    bg: "#f5ede8",
  },
  {
    ey: "End of Season Deals",
    h1: "Refined Grace\nAt Lower Prices",
    sub: "Up to 50% off selected abayas and dresses from local designers.",
    btn: "Explore Sale",
    img: "/images/women_hero2.jpg",
    bg: "#ede9e0",
  },
  {
    ey: "Local Brands Spotlight",
    h1: "Wear What\nDefines You",
    sub: "Support Egyptian creators — every purchase matters.",
    btn: "Meet the Brands",
    img: "/cms.jpg",
    bg: "#eeeae6",
  },
];

const CATEGORIES = [
  { name: "Abayas", img: "/images/women_cat_abaya.png", count: "32 styles" },
  { name: "Dresses", img: "/images/women_cat_dress.png", count: "21 styles" },
  { name: "Sets", img: "/images/women_cat_sets.png", count: "15 styles" },
];


/* ══════════════════════════════════════════ PAGE CSS ══════════════════════════════════════════ */
const PAGE_CSS = `
/* ── Hero ── */
.w-hero { position:relative; overflow:hidden; min-height:520px; display:flex; align-items:center; }
.w-hero-slide { display:flex; align-items:center; justify-content:space-between; width:100%; padding:60px 7%; gap:32px; animation:wSlideIn .55s ease both; }
@keyframes wSlideIn { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:none} }
.w-hero-txt { flex:1; max-width:480px; }
.w-hero-ey { font-size:.72rem; letter-spacing:.22em; text-transform:uppercase; color:var(--sage); margin-bottom:12px; font-weight:500; }
.w-hero-h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(2rem,5vw,3.6rem); font-weight:600; line-height:1.1; color:var(--dark); margin-bottom:18px; }
.w-hero-sub { font-size:.9rem; color:var(--warm); margin-bottom:28px; line-height:1.7; }
.w-hero-img { flex:1; max-width:480px; display:flex; justify-content:center; }
.w-hero-img img { width:100%; max-height:520px; object-fit:cover; border-radius:4px; }
.w-hero-arrow { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.85); border:1px solid var(--border); border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; z-index:5; }
.w-hero-arrow:hover { background:#fff; box-shadow:0 4px 14px rgba(0,0,0,.1); }
.w-hero-arrow.p { left:18px; } .w-hero-arrow.n { right:18px; }
.w-hero-dots { position:absolute; bottom:20px; left:50%; transform:translateX(-50%); display:flex; gap:6px; }
.w-hero-dot { width:7px; height:7px; border-radius:50%; background:var(--border); border:none; cursor:pointer; transition:all .25s; padding:0; }
.w-hero-dot.on { background:var(--sage); width:20px; border-radius:4px; }
.w-hero-counter { position:absolute; bottom:22px; right:28px; font-size:.7rem; letter-spacing:.1em; color:var(--warm); }
/* buttons */
.btn-dk { background:var(--dark); color:#fff; border:none; padding:.65rem 1.6rem; font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:background .2s; border-radius:2px; }
.btn-dk:hover { background:#333; }
.btn-ol-hero { background:transparent; color:var(--dark); border:1.5px solid var(--dark); padding:.65rem 1.6rem; font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:all .2s; border-radius:2px; }
.btn-ol-hero:hover { background:var(--dark); color:#fff; }
/* ── sections ── */
.w-sp { padding:60px 0; }
.w-sec-title { font-family:'Cormorant Garamond',serif; font-size:clamp(1.5rem,3vw,2.2rem); font-weight:600; text-align:center; color:var(--dark); margin-bottom:6px; }
.w-sec-line { width:44px; height:2px; background:var(--sage); margin:0 auto 32px; }
/* ── category cards ── */
.w-cat-card { position:relative; overflow:hidden; border-radius:4px; cursor:pointer; aspect-ratio:4/4; }
.w-cat-card img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
.w-cat-card:hover img { transform:scale(1.07); }
.w-cat-ov { position:absolute; inset:0; background:linear-gradient(to top,rgba(26,26,24,.75) 0%,transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:20px; }
.w-cat-name { font-family:'Cormorant Garamond',serif; color:#fff; font-size:1.4rem; font-weight:600; }
.w-cat-count { color:rgba(255,255,255,.65); font-size:.72rem; letter-spacing:.1em; margin-bottom:10px; }
.w-cat-btn { background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.55); color:#fff; font-size:.7rem; letter-spacing:.1em; padding:.38rem .9rem; cursor:pointer; transition:all .2s; width:fit-content; border-radius:2px; }
.w-cat-btn:hover { background:#fff; color:var(--dark); }
/* ── product card (scroll track) ── */
.w-sc-wrap { position:relative; }
.w-sc-btn { position:absolute; top:50%; transform:translateY(-50%); z-index:4; background:#fff; border:1px solid var(--border); border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 10px rgba(0,0,0,.08); transition:all .2s; }
.w-sc-btn:hover { box-shadow:0 4px 16px rgba(0,0,0,.13); }
.w-sc-btn.l { left:-18px; } .w-sc-btn.r { right:-18px; }
.w-sc-track { display:flex; gap:20px; overflow-x:auto; padding-bottom:4px; scroll-snap-type:x mandatory; }
.w-sc-track::-webkit-scrollbar { display:none; }
/* ── prod card ── */
.w-pc { position:relative; flex:0 0 220px; cursor:pointer; }
.w-pc-img-wrap { position:relative; overflow:hidden; border-radius:3px; aspect-ratio:3/4; background:var(--cream); }
.w-pc-img-wrap img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
.w-pc:hover .w-pc-img-wrap img { transform:scale(1.06); }
.w-pc-tag { position:absolute; top:10px; left:10px; background:var(--sage); color:#fff; font-size:.58rem; padding:.2rem .5rem; letter-spacing:.08em; font-weight:600; text-transform:uppercase; border-radius:2px; }
.w-pc-hover-ov { position:absolute; inset:0; background:rgba(26,26,24,.07); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .25s; }
.w-pc:hover .w-pc-hover-ov { opacity:1; }
.w-pc-qv-btn { background:#fff; border:none; padding:.45rem 1.1rem; font-size:.7rem; letter-spacing:.09em; cursor:pointer; transition:background .2s; border-radius:2px; }
.w-pc-qv-btn:hover { background:var(--dark); color:#fff; }
.w-wish-btn { position:absolute; top:10px; right:10px; background:#fff; border:none; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.1); transition:all .2s; color:var(--warm); }
.w-wish-btn.liked { color:#e63946; }
.w-wish-btn:hover { transform:scale(1.1); }
.w-prod-info { padding:10px 0 4px; }
.w-prod-name { font-size:.82rem; color:var(--dark); font-weight:500; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.w-prod-brand { font-size:.68rem; color:var(--warm); margin-bottom:4px; letter-spacing:.06em; text-transform:uppercase; }
.w-prod-price { font-size:.88rem; color:var(--dark); font-weight:600; }
.w-prod-old { font-size:.72rem; color:var(--warm); text-decoration:line-through; margin-left:6px; }
.w-stars-row { color:var(--gold,#c8a96e); font-size:.65rem; display:flex; gap:1px; }
/* ── trending grid ── */
.w-trend-g { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
@media(max-width:768px){ .w-trend-g{ grid-template-columns:repeat(2,1fr); } }
@media(max-width:480px){ .w-trend-g{ grid-template-columns:1fr; } }
/* ── pick card ── */
.w-picks-g { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
@media(max-width:992px){ .w-picks-g{ grid-template-columns:repeat(2,1fr); } }
@media(max-width:480px){ .w-picks-g{ grid-template-columns:1fr; } }
.w-pick-card { cursor:pointer; }
.w-pick-img-wrap { position:relative; overflow:hidden; border-radius:3px; aspect-ratio:3/4; background:var(--cream); }
.w-pick-img-wrap img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
.w-pick-card:hover .w-pick-img-wrap img { transform:scale(1.06); }
.w-pc-hover-ov2 { position:absolute; inset:0; background:rgba(26,26,24,.07); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .25s; }
.w-pick-card:hover .w-pc-hover-ov2 { opacity:1; }
.w-pick-info { display:flex; justify-content:space-between; align-items:center; padding:8px 0 4px; gap:8px; }
.w-pick-text { flex:1; min-width:0; }
.w-pick-brand-logo { height:28px; width:auto; object-fit:contain; flex-shrink:0; filter:grayscale(1); opacity:.65; transition:all .2s; }
.w-pick-card:hover .w-pick-brand-logo { filter:none; opacity:1; }
/* ── sale banner ── */
.w-sale-ban { overflow:hidden; margin:0; }
.w-sale-ban-inner { display:flex; align-items:stretch; min-height:260px; }
.w-sale-ban-inner img { width:55%; object-fit:cover; display:block; }
.w-sale-ban-text { flex:1; background:var(--dark); color:#fff; display:flex; flex-direction:column; justify-content:center; padding:40px 5%; }
.w-sale-sub { font-size:.68rem; letter-spacing:.22em; text-transform:uppercase; color:var(--sage); margin-bottom:10px; }
.w-sale-ban-text h2 { font-family:'Cormorant Garamond',serif; font-size:clamp(1.6rem,3.5vw,2.6rem); font-weight:600; margin-bottom:20px; line-height:1.15; }
.w-sale-cta-btn { background:transparent; border:1.5px solid rgba(255,255,255,.5); color:#fff; padding:.55rem 1.4rem; font-size:.72rem; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; transition:all .2s; border-radius:2px; width:fit-content; }
.w-sale-cta-btn:hover { background:#fff; color:var(--dark); }
@media(max-width:600px){ .w-sale-ban-inner{ flex-direction:column; } .w-sale-ban-inner img{ width:100%; height:200px; } }
/* ── quick view modal ── */
.w-qv-backdrop { position:fixed; inset:0; background:rgba(26,26,24,.55); z-index:1050; display:flex; align-items:center; justify-content:center; padding:16px; animation:wFadeIn .2s ease; }
@keyframes wFadeIn { from{opacity:0} to{opacity:1} }
.w-qv-modal { background:#fff; max-width:760px; width:100%; border-radius:4px; overflow:hidden; display:flex; max-height:90vh; animation:wSlideUp .3s ease; }
@keyframes wSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
.w-qv-img { width:46%; object-fit:cover; display:block; }
.w-qv-body { flex:1; padding:32px 28px; overflow-y:auto; }
.w-qv-close { position:absolute; top:14px; right:16px; background:none; border:none; font-size:1.4rem; cursor:pointer; color:var(--warm); line-height:1; }
.w-qv-tag-badge { background:var(--sage); color:#fff; font-size:.58rem; padding:.2rem .55rem; letter-spacing:.08em; font-weight:600; text-transform:uppercase; border-radius:2px; display:inline-block; margin-bottom:12px; }
.w-qv-brand { font-size:.68rem; letter-spacing:.15em; text-transform:uppercase; color:var(--warm); margin-bottom:4px; }
.w-qv-name { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:600; color:var(--dark); margin-bottom:10px; }
.w-qv-price { font-size:1.1rem; font-weight:600; color:var(--dark); }
.w-qv-old { font-size:.82rem; color:var(--warm); text-decoration:line-through; margin-left:8px; }
.w-size-btn { border:1.5px solid var(--border); background:#fff; padding:.3rem .7rem; font-size:.72rem; cursor:pointer; transition:all .2s; border-radius:2px; }
.w-size-btn.sel,.w-size-btn:hover { border-color:var(--dark); background:var(--dark); color:#fff; }
.w-color-dot { width:22px; height:22px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:all .2s; }
.w-color-dot.sel { border-color:var(--dark); box-shadow:0 0 0 2px #fff inset; }
.w-qty-btn { border:1px solid var(--border); background:#fff; width:30px; height:30px; font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; border-radius:2px; }
.w-qty-btn:hover { background:var(--cream); }
.w-qty-num { width:36px; text-align:center; font-size:.88rem; }
.w-add-btn { background:var(--dark); color:#fff; border:none; padding:.75rem 1.5rem; font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; border-radius:2px; flex:1; transition:background .2s; }
.w-add-btn:hover { background:#333; }
.w-add-btn.added { background:var(--sage); }
.w-view-btn { background:transparent; border:1.5px solid var(--dark); color:var(--dark); padding:.75rem 1.2rem; font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; border-radius:2px; transition:all .2s; }
.w-view-btn:hover { background:var(--dark); color:#fff; }
.w-size-err { color:#e63946; font-size:.72rem; margin-top:4px; }
/* ── toast ── */
.w-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(20px); background:var(--dark); color:#fff; padding:.55rem 1.4rem; border-radius:30px; font-size:.78rem; letter-spacing:.06em; pointer-events:none; opacity:0; transition:all .3s; z-index:1100; white-space:nowrap; }
.w-toast.on { opacity:1; transform:translateX(-50%) translateY(0); }
`;

/* ══════════════════════════════════════════ HELPERS ══════════════════════════════════════════ */
function Stars({ n }) {
  return (
    <span className="w-stars-row">
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={`bi bi-star${i <= Math.round(n) ? "-fill" : ""}`} />
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════ QUICK VIEW MODAL ══════════════════════════════════════════ */
function QuickViewModal({ p, onClose, onAddToCart }) {
  const navigate = useNavigate();
  const [selSize, setSelSize] = useState(null);
  const [selColor, setSelColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeErr, setSizeErr] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAdd = () => {
    if (!selSize) { setSizeErr(true); return; }
    setSizeErr(false);
    setAdded(true);
    onAddToCart();
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="w-qv-backdrop" onClick={onClose}>
      <div className="w-qv-modal" onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
        <img
          className="w-qv-img"
          src={p.img}
          alt={p.name}
          onError={(e) => { e.target.src = "https://placehold.co/360x480?text=No+Image"; }}
        />
        <div className="w-qv-body">
          <button className="w-qv-close" onClick={onClose}>×</button>
          {p.tag && <span className="w-qv-tag-badge">{p.tag}</span>}
          <div className="w-qv-brand">{p.brand}</div>
          <div className="w-qv-name">{p.name}</div>
          <div className="d-flex align-items-center mb-3">
            <span className="w-qv-price">{p.price.toLocaleString()}</span>
            {p.old && <span className="w-qv-old">LE {p.old.toLocaleString()}</span>}
          </div>
          <div className="d-flex align-items-center gap-2 mb-3">
            {p.rating > 0 && <><Stars n={p.rating} />
              <span style={{ fontSize: ".7rem", color: "var(--warm)" }}>({p.reviews})</span></>}
          </div>
          {/* Colors */}
          <div className="mb-3">
            <div style={{ fontSize: ".72rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px", color: "var(--warm)" }}>Color</div>
            <div className="d-flex gap-2">
              {p.colors.map((c, i) => (
                <button
                  key={i}
                  className={`w-color-dot ${selColor === i ? "sel" : ""}`}
                  style={{ background: c }}
                  onClick={() => setSelColor(i)}
                />
              ))}
            </div>
          </div>
          {/* Sizes */}
          <div className="mb-4">
            <div style={{ fontSize: ".72rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px", color: "var(--warm)" }}>Size</div>
            <div className="d-flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  className={`w-size-btn ${selSize === s ? "sel" : ""}`}
                  onClick={() => { setSelSize(s); setSizeErr(false); }}
                >{s}</button>
              ))}
            </div>
            {sizeErr && <div className="w-size-err">Please select a size</div>}
          </div>
          {/* Qty */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <button className="w-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="w-qty-num">{qty}</span>
            <button className="w-qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <div className="d-flex gap-2">
            <button className={`w-add-btn ${added ? "added" : ""}`} onClick={handleAdd}>
              {added ? "✓ Added!" : "Add to Cart"}
            </button>
            <button className="w-view-btn" onClick={() => navigate(`/product/${p.id}`)}>View</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ PROD CARD ══════════════════════════════════════════ */
function ProdCard({ p, d, addRef, onQuickView, onWish, wishlisted }) {
  const navigate = useNavigate();
  return (
    <div className={`w-pc revealed d${d}`} ref={addRef} style={{ scrollSnapAlign: "start" }}>
      <div className="w-pc-img-wrap">
        <img
          src={p.img}
          alt={p.name}
          onError={(e) => { e.target.src = "https://placehold.co/220x293?text=No+Image"; }}
        />
        {p.tag && <span className="w-pc-tag">{p.tag}</span>}
        <div className="w-pc-hover-ov">
          <button className="w-pc-qv-btn" onClick={(e) => { e.stopPropagation(); onQuickView(p); }}>
            <i className="bi bi-eye me-1" /> Quick View
          </button>
        </div>
        <button
          className={`w-wish-btn ${wishlisted ? "liked" : ""}`}
          onClick={(e) => { e.stopPropagation(); onWish(p.id); }}
        >
          <i className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"}`} />
        </button>
      </div>
      <div className="w-prod-info">
        <div className="w-prod-brand" style={{ cursor: "pointer" }} onClick={() => navigate(`/brand/${encodeURIComponent(p.brand)}`)}>{p.brand}</div>
        <div className="w-prod-name">{p.name}</div>
        <div className="d-flex align-items-center mb-1">
          <span className="w-prod-price"> {p.price.toLocaleString()}</span>
          {p.old && <span className="w-prod-old">LE {p.old.toLocaleString()}</span>}
        </div>
        {p.rating > 0 && <Stars n={p.rating} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ PICK CARD ══════════════════════════════════════════ */
function PickCard({ p, d, addRef, onQuickView, onWish, wishlisted }) {
  return (
    <div className={`w-pick-card reveal d${d}`} ref={addRef}>
      <div className="w-pick-img-wrap">
        <img
          src={p.img}
          alt={p.name}
          onError={(e) => { e.target.src = "https://placehold.co/260x347?text=No+Image"; }}
        />
        <div className="w-pc-hover-ov2">
          <button
            className="w-pc-qv-btn"
            onClick={(e) => { e.stopPropagation(); onQuickView(p); }}
          >
            <i className="bi bi-eye me-1" /> Quick View
          </button>
        </div>
        <button
          className={`w-wish-btn ${wishlisted ? "liked" : ""}`}
          onClick={(e) => { e.stopPropagation(); onWish(p.id); }}
        >
          <i className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"}`} />
        </button>
      </div>
      <div className="w-pick-info">
        <div className="w-pick-text">
          <div className="w-prod-name">{p.name}</div>
          <div className="w-prod-price"> {p.price.toLocaleString()}</div>
        </div>
        {p.brandLogo && (
          <img
            src={p.brandLogo}
            alt={p.brand}
            className="w-pick-brand-logo"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ HERO ══════════════════════════════════════════ */
function HeroCarousel() {
  const [cur, setCur] = useState(0);
  const [key, setKey] = useState(0);

  const go = useCallback((dir) => {
    setCur((i) => (i + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [go]);

  const s = HERO_SLIDES[cur];

  return (
    <div className="w-hero" style={{ background: s.bg }}>
      <div className="w-hero-slide active" key={key}>
        <div className="w-hero-txt">
          <div className="w-hero-ey">{s.ey}</div>
          <h1 className="w-hero-h1">
            {s.h1.split("\n").map((l, i) => (
              <span key={i}>{l}<br /></span>
            ))}
          </h1>
          <p className="w-hero-sub">{s.sub}</p>
          <div className="d-flex gap-3 flex-wrap">
            <button className="btn-dk">{s.btn}</button>

          </div>
        </div>
        <div className="w-hero-img">
          <img
            src={s.img}
            alt={s.h1}
            onError={(e) => { e.target.src = "https://placehold.co/480x520?text=Hero"; }}
          />
        </div>
      </div>
      <button className="w-hero-arrow p" onClick={() => go(-1)}>
        <i className="bi bi-chevron-left" />
      </button>
      <button className="w-hero-arrow n" onClick={() => go(1)}>
        <i className="bi bi-chevron-right" />
      </button>
      <div className="w-hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            className={`w-hero-dot ${i === cur ? "on" : ""}`}
            onClick={() => { setCur(i); setKey((k) => k + 1); }}
          />
        ))}
      </div>
      <div className="w-hero-counter">
        <span>{String(cur + 1).padStart(2, "0")}</span>
        <span style={{ opacity: 0.4 }}> / </span>
        <span style={{ opacity: 0.4 }}>{String(HERO_SLIDES.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ MAIN ══════════════════════════════════════════ */
export default function WomenPage() {
  const addRef = useScrollReveal();
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [toast, setToast] = useState("");
  const [products, setProducts] = useState([]);
  const [selSizes, setSelSizes] = useState(null);
  const [selColors, setSelColors] = useState(null);
  const [selType, setSelType] = useState("all");
  const [selBrands, setSelBrands] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [filterPage, setFilterPage] = useState(1);
  const FILTER_PER_PAGE = 9;

  // ── Women products — hardcoded from shared.jsx, shuffled ────────────────
  useEffect(() => {
    const list = shuffle(
      PRODUCTS
        .filter(p => p.gender === "women" || p.gender === "unisex")
        .map(p => ({
          id: p.id,
          name: p.name,
          price: parseInt(p.price.replace(/[^0-9]/g, ""), 10),
          old: p.oldPrice ? parseInt(p.oldPrice.replace(/[^0-9]/g, ""), 10) : null,
          brand: p.brand,
          img: p.img || null,
          sizes: p.sizes || [],
          colors: p.colors || [],
          rating: p.rating || 0,
          reviews: p.reviews || 0,
          tag: p.oldPrice ? "Sale" : null,
          type: (p.type || "").toLowerCase(),
          brandLogo: null,
          category: "women",
        }))
    );
    setProducts(list);
  }, []);

  const NEW_ARRIVALS = products.slice(0, 6);
  const TRENDING = products.slice(0, 6);
  const TOP_PICKS = products.slice(0, 4);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };
  const addToCart = () => {
    setCartCount((c) => c + 1);
    showToast("✓  Added to cart");
  };
  const toggleWish = (id) => {
    setWishlist((prev) => {
      const isIn = prev.includes(id);
      showToast(isIn ? "Removed from wishlist" : "♥  Added to wishlist");
      return isIn ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const newArrRef = useRef(null);
  const scroll = (ref, dir) =>
    ref.current?.scrollBy({ left: dir * 250, behavior: "smooth" });

  useEffect(() => {
    document.title = `StyleHub — Women${cartCount > 0 ? ` (${cartCount})` : ""}`;
  }, [cartCount]);

  return (
    <div>
      {/* Inject CSS */}
      <style>{SHARED_CSS}</style>
      <style>{PAGE_CSS}</style>

      <SHNav cart={cartCount} wish={wishlist} />

      <HeroCarousel />

      {/* CATEGORIES */}
      <section className="w-sp" style={{ background: "var(--cream)" }}>
        <div className="container">
          <h2 className="w-sec-title reveal" ref={addRef}>Categories</h2>
          <div className="w-sec-line reveal" ref={addRef} />
          <div className="row g-3">
            {CATEGORIES.map((c, i) => (
              <div className="col-12 col-md-4" key={i}>
                <div className={`w-cat-card reveal d${i + 1}`} ref={addRef}>
                  <img
                    src={c.img}
                    alt={c.name}
                    onError={(e) => { e.target.src = "https://placehold.co/400x533?text=" + c.name; }}
                    style={{ objectPosition: "top" }}
                  />
                  <div className="w-cat-ov">
                    <div className="w-cat-name">{c.name}</div>
                    <div className="w-cat-count">{c.count}</div>
                    <button className="w-cat-btn">Shop Now →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="w-sp bg-white">
        <div className="container">
          <h2 className="w-sec-title reveal" ref={addRef}>New Arrivals</h2>
          <div className="w-sec-line reveal" ref={addRef} />
          <div className="w-sc-wrap">
            <button className="w-sc-btn l" onClick={() => scroll(newArrRef, -1)}>
              <i className="bi bi-chevron-left" />
            </button>
            <div className="w-sc-track" ref={newArrRef}>
              {NEW_ARRIVALS.map((p, i) => (
                <ProdCard
                  key={p.id}
                  p={p}
                  d={(i % 3) + 1}
                  addRef={addRef}
                  onQuickView={setQuickView}
                  onWish={toggleWish}
                  wishlisted={wishlist.includes(p.id)}
                />
              ))}
            </div>
            <button className="w-sc-btn r" onClick={() => scroll(newArrRef, 1)}>
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      </section>

      {/* SALE BANNER */}
      <section className="w-sale-ban reveal" ref={addRef}>
        <div className="w-sale-ban-inner">
          <img
            src="/111.png"
            alt="End of Season Sale"
            onError={(e) => { e.target.src = "https://placehold.co/700x260?text=Sale"; }}
          />
          <div className="w-sale-ban-text">
            <p className="w-sale-sub">Limited Time Only</p>
            <h2>END OF SEASON SALE</h2>
            <button className="w-sale-cta-btn">Shop the Sale →</button>
          </div>
        </div>
      </section>

      {/* TRENDING NOW */}
      <section className="w-sp" style={{ background: "var(--cream)" }}>
        <div className="container">
          <h2 className="w-sec-title reveal" ref={addRef}>Trending Now</h2>
          <div className="w-sec-line reveal" ref={addRef} />
          <div className="w-trend-g">
            {TRENDING.map((p, i) => (
              <ProdCard
                key={p.id}
                p={p}
                d={(i % 3) + 1}
                addRef={addRef}
                onQuickView={setQuickView}
                onWish={toggleWish}
                wishlisted={wishlist.includes(p.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TOP PICKS */}
      <section className="w-sp bg-white">
        <div className="container">
          <h2 className="w-sec-title reveal" ref={addRef}>Top Picks</h2>
          <p className="text-center mb-1 reveal" ref={addRef}
            style={{ fontSize: ".82rem", color: "var(--warm)" }}>
            The most loved pieces from Egypt's finest women's brands.
          </p>
          <div className="w-sec-line reveal" ref={addRef} />
          <div className="w-picks-g">
            {TOP_PICKS.map((p, i) => (
              <PickCard
                key={p.id}
                p={p}
                d={(i % 4) + 1}
                addRef={addRef}
                onQuickView={setQuickView}
                onWish={toggleWish}
                wishlisted={wishlist.includes(p.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {quickView && (
        <QuickViewModal
          p={quickView}
          onClose={() => setQuickView(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* ALL PRODUCTS + FILTERS */}
      {(() => {
        const ALL_SIZES = [...new Set(products.flatMap(p => p.sizes))];
        const ALL_COLORS = [...new Set(products.flatMap(p => p.colors))];
        const ALL_TYPES = [...new Set(products.map(p => p.type).filter(Boolean))];
        const ALL_BRANDS = [...new Set(products.map(p => p.brand))];

        let filtered = [...products];
        if (selType !== "all") filtered = filtered.filter(p => p.type === selType);
        if (selBrands.length > 0) filtered = filtered.filter(p => selBrands.includes(p.brand));
        if (selSizes) filtered = filtered.filter(p => p.sizes.includes(selSizes));
        if (selColors) filtered = filtered.filter(p => p.colors.includes(selColors));
        if (sortBy === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
        if (sortBy === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);
        if (sortBy === "sale") filtered = filtered.filter(p => p.old);

        const totalPages = Math.ceil(filtered.length / FILTER_PER_PAGE);
        const paginated = filtered.slice((filterPage - 1) * FILTER_PER_PAGE, filterPage * FILTER_PER_PAGE);
        const hasFilters = selSizes || selColors || selType !== "all" || selBrands.length > 0;

        return (
          <section id="all-products" style={{ background: "var(--cream)", padding: "3rem 5%" }}>
            <h2 className="w-sec-title reveal" ref={addRef}>All Products</h2>
            <div className="w-sec-line reveal" ref={addRef} />
            <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start" }}>

              {/* SIDEBAR */}
              <div style={{ width: 185, flexShrink: 0, position: "sticky", top: 70 }}>
                {/* Sort */}
                <div style={{ marginBottom: "1.8rem" }}>
                  <div style={{ fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".65rem", color: "var(--dark)" }}>Sort By</div>
                  {[["default", "Default"], ["low", "Price: Low → High"], ["high", "Price: High → Low"], ["sale", "On Sale"]].map(([val, label]) => (
                    <div key={val} onClick={() => setSortBy(val)} style={{ fontSize: ".75rem", padding: ".28rem 0", cursor: "pointer", color: sortBy === val ? "var(--dark)" : "var(--warm)", fontWeight: sortBy === val ? 600 : 400, transition: "color .2s" }}>{label}</div>
                  ))}
                </div>

                {/* Brand */}
                {ALL_BRANDS.length > 0 && (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.3rem", marginBottom: "1.6rem" }}>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".65rem", color: "var(--dark)" }}>Brand</div>
                    {ALL_BRANDS.map(b => (
                      <div key={b} onClick={() => { setSelBrands(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b]); setFilterPage(1); }} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".26rem 0", cursor: "pointer" }}>
                        <div style={{ width: 13, height: 13, border: `1.5px solid ${selBrands.includes(b) ? "var(--dark)" : "var(--border)"}`, background: selBrands.includes(b) ? "var(--dark)" : "transparent", borderRadius: 2, flexShrink: 0, transition: "all .2s" }} />
                        <span style={{ fontSize: ".73rem", color: selBrands.includes(b) ? "var(--dark)" : "var(--warm)", transition: "color .2s" }}>{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Type */}
                {ALL_TYPES.length > 0 && (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.3rem", marginBottom: "1.6rem" }}>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".65rem", color: "var(--dark)" }}>Type</div>
                    {ALL_TYPES.map(t => (
                      <div key={t} onClick={() => { setSelType(p => p === t ? "all" : t); setFilterPage(1); }} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".26rem 0", cursor: "pointer" }}>
                        <div style={{ width: 13, height: 13, border: `1.5px solid ${selType === t ? "var(--dark)" : "var(--border)"}`, background: selType === t ? "var(--dark)" : "transparent", borderRadius: 2, flexShrink: 0, transition: "all .2s" }} />
                        <span style={{ fontSize: ".73rem", color: selType === t ? "var(--dark)" : "var(--warm)", transition: "color .2s" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Size */}
                {ALL_SIZES.length > 0 && (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.3rem", marginBottom: "1.6rem" }}>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".65rem", color: "var(--dark)" }}>Size</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".32rem" }}>
                      {ALL_SIZES.map(s => (
                        <button key={s} onClick={() => { setSelSizes(p => p === s ? null : s); setFilterPage(1); }} style={{ padding: ".26rem .52rem", fontSize: ".63rem", border: `1.5px solid ${selSizes === s ? "var(--dark)" : "var(--border)"}`, background: selSizes === s ? "var(--dark)" : "transparent", color: selSizes === s ? "#fff" : "var(--dark)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s", minWidth: 32, borderRadius: 3 }}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color */}
                {ALL_COLORS.length > 0 && (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.3rem", marginBottom: "1.6rem" }}>
                    <div style={{ fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".65rem", color: "var(--dark)" }}>Color</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                      {ALL_COLORS.map((c, i) => (
                        <div key={i} onClick={() => { setSelColors(p => p === c ? null : c); setFilterPage(1); }} style={{ width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer", border: (c === "#fff" || c === "#ffffff" || c === "#ffffffff") ? "1.5px solid var(--border)" : "2px solid transparent", boxShadow: selColors === c ? "0 0 0 2.5px var(--dark)" : "none", transform: selColors === c ? "scale(1.2)" : "none", transition: "all .2s" }} />
                      ))}
                    </div>
                  </div>
                )}

                {hasFilters && (
                  <button onClick={() => { setSelSizes(null); setSelColors(null); setSelType("all"); setSelBrands([]); setFilterPage(1); }} style={{ fontSize: ".61rem", letterSpacing: ".1em", textTransform: "uppercase", background: "none", border: "1px solid var(--border)", padding: ".36rem .8rem", cursor: "pointer", color: "var(--warm)", fontFamily: "'DM Sans',sans-serif", width: "100%", borderRadius: 3 }}>Clear Filters</button>
                )}
              </div>

              {/* GRID */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: ".7rem", color: "var(--warm)", marginBottom: "1rem", letterSpacing: ".04em" }}>
                  {filtered.length} product{filtered.length !== 1 ? "s" : ""}{totalPages > 1 ? ` — page ${filterPage} of ${totalPages}` : ""}
                </div>
                {filtered.length === 0
                  ? <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--warm)", fontSize: ".85rem" }}>No products match your filters.</div>
                  : <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.4rem" }}>
                    {paginated.map(p => (
                      <div key={p.id} onClick={() => setQuickView(p)} style={{ background: "#fff", border: "1px solid var(--border)", cursor: "pointer", borderRadius: 5, overflow: "hidden", transition: "box-shadow .25s" }} onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(26,26,24,.1)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                        <div style={{ position: "relative", aspectRatio: "3/4", background: "#f0ece6", overflow: "hidden" }}>
                          {p.img ? <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>👗</div>}
                          {p.old && <div style={{ position: "absolute", top: ".7rem", left: ".7rem", background: "var(--red)", color: "#fff", fontSize: ".52rem", padding: ".2rem .55rem", fontWeight: 700, borderRadius: 3 }}>SALE</div>}
                        </div>
                        <div style={{ padding: ".55rem .65rem" }}>
                          <div style={{ fontSize: ".52rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".15rem" }}>{p.brand}</div>
                          <div style={{ fontSize: ".78rem", fontWeight: 500, marginBottom: ".25rem" }}>{p.name}</div>
                          <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                            {p.old && <span style={{ fontSize: ".68rem", color: "var(--warm)", textDecoration: "line-through" }}>LE {p.old?.toLocaleString()}</span>}
                            <span style={{ fontSize: ".78rem", fontWeight: 600, color: p.old ? "var(--red)" : "" }}>LE {p.price?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: ".45rem", padding: "2.5rem 0" }}>
                    <button onClick={() => setFilterPage(p => Math.max(1, p - 1))} disabled={filterPage === 1} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)", background: "none", cursor: filterPage === 1 ? "not-allowed" : "pointer", opacity: filterPage === 1 ? .4 : 1, fontSize: "1rem" }}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button key={n} onClick={() => setFilterPage(n)} style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${filterPage === n ? "var(--dark)" : "var(--border)"}`, background: filterPage === n ? "var(--dark)" : "none", color: filterPage === n ? "#fff" : "var(--dark)", cursor: "pointer", fontSize: ".75rem", fontWeight: filterPage === n ? 600 : 400, transition: "all .2s" }}>{n}</button>
                    ))}
                    <button onClick={() => setFilterPage(p => Math.min(totalPages, p + 1))} disabled={filterPage === totalPages} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)", background: "none", cursor: filterPage === totalPages ? "not-allowed" : "pointer", opacity: filterPage === totalPages ? .4 : 1, fontSize: "1rem" }}>›</button>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      <div className={`w-toast ${toast ? "on" : ""}`}>{toast}</div>

      <SHFooter addRef={addRef} />
    </div>
  );
}