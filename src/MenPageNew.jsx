import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SHNav, SHFooter, SHARED_CSS } from "./shared";

/*  DATA  */
const HERO_SLIDES = [
    {
        ey: "New Collection 2026",
        h1: "Find Your Favorite\nTrendy Outfits!",
        sub: "Discover the latest looks from Egypt's top local brands.",
        btn: "Shop Now",
        img: "/men-slider_photo.jpg",
        bg: "#eaeaea",
        fullBg: true,
    },
    {
        ey: "End of Season Deals",
        h1: "Men",
        sub: "Up to 50% off selected items from local designers.",
        btn: "Explore Sale",
        img: "/REM.jpeg",
        bg: "#ede9e0",
        fullBg: true,
    },
];

const CAT_TYPE_MAP = {
    "Pants": "pants",
    "Hoodies": "hoodies",
    "Jackets": "jackets",
};

const CATEGORIES = [
    { name: "Pants", img: "https://twentysevenegy.myshopify.com/cdn/shop/files/022A2473.jpg?v=1768003189&width=980", count: "10 styles" },
    { name: "Hoodies", img: "https://m.media-amazon.com/images/I/61pyF5Fn+qL._AC_SY445_SX342_QL70_ML2_.jpg", count: "12 styles" },
    { name: "Jackets", img: "/men-jacket.jpeg", count: "11 styles" },
];

function Stars({ n }) {
    return (
        <span className="stars-row">
            {[1, 2, 3, 4, 5].map((i) => (
                <i key={i} className={`bi bi-star${i <= Math.round(n) ? "-fill" : ""}`} />
            ))}
        </span>
    );
}

function useReveal() {
    const refs = useRef([]);
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("revealed")),
            { threshold: 0.08 },
        );
        refs.current.forEach((r) => r && obs.observe(r));
        return () => obs.disconnect();
    }, []);
    return useCallback((el) => {
        if (el && !refs.current.includes(el)) refs.current.push(el);
    }, []);
}

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
        <div className="qv-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="qv-modal">
                <button className="qv-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
                <div className="qv-img-col">
                    <img src={p.img} alt={p.name} className="qv-img" />
                    {p.tag && <span className={`qv-tag ${p.tag === "Sale" ? "sale" : "new"}`}>{p.tag}</span>}
                </div>
                <div className="qv-info-col">
                    <div className="qv-brand">{p.brand}</div>
                    <h2 className="qv-name">{p.name}</h2>
                    <div className="qv-rating">
                        <Stars n={p.rating} />
                        <span className="qv-rating-txt">{p.rating} · {p.reviews} reviews</span>
                    </div>
                    <div className="qv-prices">
                        {p.old && <span className="qv-old">LE {p.old.toLocaleString()}</span>}
                        <span className="qv-price">LE {p.price.toLocaleString()}</span>
                        {p.old && <span className="qv-off">{Math.round((1 - p.price / p.old) * 100)}% OFF</span>}
                    </div>
                    <div className="qv-divider" />
                    {p.colors?.length > 0 && (
                        <div className="qv-row">
                            <span className="qv-lbl">Color</span>
                            <div className="qv-colors">
                                {p.colors.map((c, i) => (
                                    <button key={i} className={`qv-color ${selColor === i ? "on" : ""}`}
                                        style={{ background: c }} onClick={() => setSelColor(i)} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="qv-row align-items-start">
                        <span className="qv-lbl">Size</span>
                        <div>
                            <div className="qv-sizes">
                                {p.sizes?.map((s) => (
                                    <button key={s} className={`qv-sz ${selSize === s ? "on" : ""}`}
                                        onClick={() => { setSelSize(s); setSizeErr(false); }}>{s}</button>
                                ))}
                            </div>
                            {sizeErr && <p className="qv-sz-err">Please select a size</p>}
                        </div>
                    </div>
                    <div className="qv-row">
                        <span className="qv-lbl">Qty</span>
                        <div className="qv-qty">
                            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty((q) => q + 1)}>+</button>
                        </div>
                    </div>
                    <div className="qv-divider" />
                    <div className="qv-btns">
                        <button className={`qv-add ${added ? "added" : ""}`} onClick={handleAdd}>
                            <i className={`bi ${added ? "bi-check-lg" : "bi-bag"} me-2`} />
                            {added ? "Added!" : "Add to Cart"}
                        </button>
                        <button className="qv-full" onClick={() => { onClose(); navigate(`/product/${p.id}`, { state: { product: p } }); }}>
                            Full Details <i className="bi bi-arrow-right ms-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProdCard({ p, onQuickView, onWish, wishlisted, addRef, d = 1 }) {
    const navigate = useNavigate();
    return (
        <div className={`prod-card revealed d${d}`} ref={addRef}
            onClick={() => navigate(`/product/${p.id}`, { state: { product: p } })}>
            <div className="ib">
                {p.tag && <span className={`tag-b ${p.tag === "Sale" ? "sale" : ""}`}>{p.tag}</span>}
                <img src={p.img} alt={p.name} loading="lazy" />
                <div className="pc-hover-ov">
                    <button className="pc-qv-btn" onClick={(e) => { e.stopPropagation(); onQuickView(p); }}>
                        <i className="bi bi-eye me-1" /> Quick View
                    </button>
                </div>
                <button className={`wish-btn ${wishlisted ? "liked" : ""}`}
                    onClick={(e) => { e.stopPropagation(); onWish(p.id); }}>
                    <i className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"}`} />
                </button>
            </div>
            <div className="prod-info">
                {p.brand && (
                    <div className="prod-brand-lbl" style={{ cursor: "pointer" }}
                        onClick={e => { e.stopPropagation(); navigate(`/brand/${encodeURIComponent(p.brand)}`); }}>
                        {p.brand}
                    </div>
                )}
                <div className="prod-name">{p.name}</div>
                <div className="prod-price-row">
                    {p.old && <span className="prod-old">LE {p.old.toLocaleString()}</span>}
                    <span className="prod-price">LE {p.price.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

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
        <div className="hero" style={s.fullBg ? {
            backgroundColor: s.bg,
            backgroundImage: `url(${s.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
        } : { backgroundColor: s.bg }}>
            <div className={`hero-slide active${s.fullBg ? " full-bg" : ""}`} key={key}>
                <div className="hero-txt">
                    {s.ey && <div className="hero-ey">{s.ey}</div>}
                    <h1 className="hero-h1">
                        {s.h1.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}
                    </h1>
                    <p className="hero-sub">{s.sub}</p>
                </div>
                {!s.fullBg && (
                    <div className="hero-img"><img src={s.img} alt={s.h1} /></div>
                )}
            </div>
            <button className="hero-arrow p" onClick={() => go(-1)}><i className="bi bi-chevron-left" /></button>
            <button className="hero-arrow n" onClick={() => go(1)}><i className="bi bi-chevron-right" /></button>
            <div className="hero-dots">
                {HERO_SLIDES.map((_, i) => (
                    <button key={i} className={`hero-dot ${i === cur ? "on" : ""}`}
                        onClick={() => { setCur(i); setKey((k) => k + 1); }} />
                ))}
            </div>
        </div>
    );
}

function FilterContent({ ALL_TYPES, ALL_SIZES, ALL_COLORS, ALL_BRANDS, selType, selSizes, selColors, selBrands, sortBy, setSelType, setSelSizes, setSelColors, setSelBrands, setSortBy, setFilterPage, hasFilters, onClear }) {
    const lbl = { fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, marginBottom: ".65rem", color: "var(--c-dark)" };
    return (
        <>
            <div style={{ marginBottom: "1.8rem" }}>
                <div style={lbl}>Sort By</div>
                {[["default", "Default"], ["low", "Price: Low → High"], ["high", "Price: High → Low"], ["sale", "On Sale"]].map(([val, label]) => (
                    <div key={val} onClick={() => setSortBy(val)} style={{ fontSize: ".75rem", padding: ".28rem 0", cursor: "pointer", color: sortBy === val ? "var(--c-dark)" : "var(--c-gray)", fontWeight: sortBy === val ? 600 : 400 }}>{label}</div>
                ))}
            </div>

            {ALL_BRANDS.length > 0 && (
                <div style={{ borderTop: "1px solid var(--c-gray-lt)", paddingTop: "1.3rem", marginBottom: "1.6rem" }}>
                    <div style={lbl}>Brand</div>
                    {ALL_BRANDS.map(b => (
                        <div key={b} onClick={() => { setSelBrands(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b]); setFilterPage(1); }} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".26rem 0", cursor: "pointer" }}>
                            <div style={{ width: 13, height: 13, border: `1.5px solid ${selBrands.includes(b) ? "var(--c-dark)" : "var(--c-gray-lt)"}`, background: selBrands.includes(b) ? "var(--c-dark)" : "transparent", borderRadius: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: ".73rem", color: selBrands.includes(b) ? "var(--c-dark)" : "var(--c-gray)" }}>{b}</span>
                        </div>
                    ))}
                </div>
            )}

            {ALL_TYPES.length > 0 && (
                <div style={{ borderTop: "1px solid var(--c-gray-lt)", paddingTop: "1.3rem", marginBottom: "1.6rem" }}>
                    <div style={lbl}>Type</div>
                    {ALL_TYPES.map(t => (
                        <div key={t} onClick={() => { setSelType(p => p === t ? "all" : t); setFilterPage(1); }} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".26rem 0", cursor: "pointer" }}>
                            <div style={{ width: 13, height: 13, border: `1.5px solid ${selType === t ? "var(--c-dark)" : "var(--c-gray-lt)"}`, background: selType === t ? "var(--c-dark)" : "transparent", borderRadius: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: ".73rem", color: selType === t ? "var(--c-dark)" : "var(--c-gray)" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                        </div>
                    ))}
                </div>
            )}

            {ALL_SIZES.length > 0 && (
                <div style={{ borderTop: "1px solid var(--c-gray-lt)", paddingTop: "1.3rem", marginBottom: "1.6rem" }}>
                    <div style={lbl}>Size</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".32rem" }}>
                        {ALL_SIZES.map(s => (
                            <button key={s} onClick={() => { setSelSizes(p => p === s ? null : s); setFilterPage(1); }} style={{ padding: ".26rem .52rem", fontSize: ".63rem", border: `1.5px solid ${selSizes === s ? "var(--c-dark)" : "var(--c-gray-lt)"}`, background: selSizes === s ? "var(--c-dark)" : "transparent", color: selSizes === s ? "#fff" : "var(--c-dark)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", minWidth: 32, borderRadius: 3 }}>{s}</button>
                        ))}
                    </div>
                </div>
            )}

            {ALL_COLORS.length > 0 && (
                <div style={{ borderTop: "1px solid var(--c-gray-lt)", paddingTop: "1.3rem", marginBottom: "1.6rem" }}>
                    <div style={lbl}>Color</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                        {ALL_COLORS.map((c, i) => (
                            <div key={i} onClick={() => { setSelColors(p => p === c ? null : c); setFilterPage(1); }} style={{ width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer", border: (c === "#fff" || c === "#ffffff") ? "1.5px solid var(--c-gray-lt)" : "2px solid transparent", boxShadow: selColors === c ? "0 0 0 2.5px var(--c-dark)" : "none", transform: selColors === c ? "scale(1.2)" : "none", transition: "all .2s" }} />
                        ))}
                    </div>
                </div>
            )}

            {hasFilters && (
                <button onClick={onClear} style={{ fontSize: ".61rem", letterSpacing: ".1em", textTransform: "uppercase", background: "none", border: "1px solid var(--c-gray-lt)", padding: ".36rem .8rem", cursor: "pointer", color: "var(--c-gray)", fontFamily: "'DM Sans',sans-serif", width: "100%", borderRadius: 3 }}>Clear Filters</button>
            )}
        </>
    );
}

export default function MenPage({ cart = [], setCart, wish = [], setWish }) {
    const navigate = useNavigate();
    const wishlist = wish;
    const cartCount = cart.reduce((s, x) => s + (x.qty || 1), 0);

    const [toast, setToast] = useState("");
    const [quickView, setQuickView] = useState(null);
    const [menProducts, setMenProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selType, setSelType] = useState("all");
    const [selSizes, setSelSizes] = useState(null);
    const [selColors, setSelColors] = useState(null);
    const [selBrands, setSelBrands] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [filterPage, setFilterPage] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const FILTER_PER_PAGE = 9;

    const allProductsRef = useRef(null);
    const newArrRef = useRef(null);

    const handleCategoryClick = (catName) => {
        const typeTag = CAT_TYPE_MAP[catName] || catName.toLowerCase();
        setSelType(typeTag);
        setFilterPage(1);
        setTimeout(() => {
            allProductsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const handleShopSale = () => {
        setSortBy("sale");
        setFilterPage(1);
        setTimeout(() => {
            allProductsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const handleClearFilters = () => {
        setSelSizes(null); setSelColors(null); setSelType("all"); setSelBrands([]); setFilterPage(1);
    };

    useEffect(() => {
        setLoading(true);
        fetch(`https://stylehub-backend-tau.vercel.app/api/products?category=men&limit=100&t=${Date.now()}`)
            .then(r => r.json())
            .then(data => {
                const list = (data.data?.products || []).map(p => ({
                    id: p._id,
                    name: p.name,
                    price: p.price,
                    old: p.salePrice || null,
                    brand: p.seller?.brandName || "StyleHub",
                    img: p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `https://stylehub-backend-tau.vercel.app${p.images[0]}`) : null,
                    sizes: p.sizes || [],
                    colors: p.colors || [],
                    rating: p.avgRating || 0,
                    reviews: p.reviewCount || 0,
                    tag: p.salePrice ? "Sale" : null,
                    type: (p.tags?.[0] || "").toLowerCase(),
                    brandLogo: p.seller?.logo ? (p.seller.logo.startsWith('http') ? p.seller.logo : `https://stylehub-backend-tau.vercel.app${p.seller.logo}`) : null,
                }));
                const byBrand = {};
                list.forEach(p => { if (!byBrand[p.brand]) byBrand[p.brand] = []; byBrand[p.brand].push(p); });
                Object.values(byBrand).forEach(arr => arr.sort(() => Math.random() - 0.5));
                const brands = Object.values(byBrand).sort(() => Math.random() - 0.5);
                const interleaved = [];
                const maxLen = Math.max(...brands.map(b => b.length));
                for (let i = 0; i < maxLen; i++) { brands.forEach(arr => { if (arr[i]) interleaved.push(arr[i]); }); }
                setMenProducts(interleaved);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

    const toggleWish = (id) => {
        setWish((prev) => {
            const isIn = prev.includes(id);
            showToast(isIn ? "Removed from wishlist" : "♥  Added to wishlist");
            return isIn ? prev.filter((x) => x !== id) : [...prev, id];
        });
    };

    const addToCart = () => {
        setCart((prev) => {
            const g = prev.find((x) => x.id === "__generic__");
            if (g) return prev.map((x) => x.id === "__generic__" ? { ...x, qty: x.qty + 1 } : x);
            return [...prev, { id: "__generic__", size: "M", qty: 1 }];
        });
        showToast("✓  Added to cart");
    };

    const addRef = useReveal();
    const scroll = (ref, dir) => ref.current?.scrollBy({ left: dir * 250, behavior: "smooth" });

    useEffect(() => {
        document.title = `StyleHub — Men${cartCount > 0 ? ` (${cartCount})` : ""}`;
    }, [cartCount]);

    useEffect(() => {
        if (!drawerOpen) return;
        const onKey = (e) => { if (e.key === "Escape") setDrawerOpen(false); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    }, [drawerOpen]);

    const ALL_SIZES = [...new Set(menProducts.flatMap(p => p.sizes))];
    const ALL_COLORS = [...new Set(menProducts.flatMap(p => p.colors))];
    const ALL_TYPES = [...new Set(menProducts.map(p => p.type).filter(Boolean))];
    const ALL_BRANDS = [...new Set(menProducts.map(p => p.brand))];

    let filtered = [...menProducts];
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
    const activeFilterCount = (selSizes ? 1 : 0) + (selColors ? 1 : 0) + (selType !== "all" ? 1 : 0) + selBrands.length;

    const filterProps = { ALL_TYPES, ALL_SIZES, ALL_COLORS, ALL_BRANDS, selType, selSizes, selColors, selBrands, sortBy, setSelType, setSelSizes, setSelColors, setSelBrands, setSortBy, setFilterPage, hasFilters, onClear: handleClearFilters };

    return (
        <div>
            <style>{`
        :root {
          --c-dark:     #1a1a1a;
          --c-darker:   #0f0f0f;
          --c-olive:    #6b7a4e;
          --c-olive-lt: #8a9963;
          --c-olive-dk: #4a5534;
          --c-cream:    #f4f0e8;
          --c-white:    #fff;
          --c-off:      #f8f8f6;
          --c-gray:     #888;
          --c-gray-lt:  #e2e2e2;
          --c-red:      #d94040;
          --fd:   'Playfair Display', serif;
          --fb:   'DM Sans', sans-serif;
          --fh:   'Bebas Neue', cursive;
          --sh-sm: 0 2px 12px rgba(0,0,0,.09);
          --sh-md: 0 4px 24px rgba(0,0,0,.13);
          --sh-lg: 0 8px 40px rgba(0,0,0,.18);
          --r:    14px;
          --r-sm:  8px;
          --ease: cubic-bezier(.4,0,.2,1);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html  { scroll-behavior: smooth; }
        body  { font-family: var(--fb); color: var(--c-dark); background: var(--c-white); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        a     { text-decoration: none; color: inherit; }
        img   { max-width: 100%; display: block; }
        .no-sb { scrollbar-width: none; }
        .no-sb::-webkit-scrollbar { display: none; }

        /* ─────────────────────────────────────────
           HERO  –  fully responsive
        ───────────────────────────────────────── */
        .hero {
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        /* base slide */
        .hero-slide {
          display: none;
          position: relative;
          width: 100%;
          min-height: 560px;
          align-items: flex-end;
          justify-content: flex-start;
        }

        /* full-background variant */
        .hero-slide.full-bg {
          background-attachment: scroll;
          justify-content: flex-start;
          align-items: flex-end;
        }

        .hero-slide.active {
          display: flex;
          animation: fadeIn .55s var(--ease);
        }

        /* dark gradient overlay so text is always legible */
        .hero-slide.full-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0)   25%,
            rgba(0,0,0,.60) 100%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* text block */
        .hero-txt {
          position: relative;
          z-index: 1;
          padding: 2.5rem 3rem 4.5rem 5.5rem;
          max-width: 560px;
        }
        .hero-slide.full-bg .hero-txt {
          padding: 2rem 2rem 4rem 4rem;
        }
        .hero-slide.full-bg .hero-h1  { color: #fff; }
        .hero-slide.full-bg .hero-sub { color: rgba(255,255,255,.82); }

        /* eyebrow */
        .hero-ey {
          font-size: .7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: var(--c-olive);
          margin-bottom: .85rem;
        }
        .hero-slide.full-bg .hero-ey { color: rgba(255,255,255,.7); }

        /* headings */
        .hero-h1 {
          font-family: var(--fd);
          font-size: clamp(1.6rem, 3.5vw, 3rem);
          font-weight: 700;
          line-height: 1.15;
          color: var(--c-dark);
          margin-bottom: .9rem;
        }
        .hero-sub {
          font-size: .99rem;
          color: var(--c-gray);
          line-height: 1.65;
          max-width: 320px;
          margin-bottom: 1.8rem;
        }

        /* split-layout image column (non-full-bg slides) */
        .hero-img { width: 50%; height: 480px; overflow: hidden; }
        .hero-img img { width: 100%; height: 100%; object-fit: cover; object-position: center; }

        /* arrows */
        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px; height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,.88);
          border: 1px solid var(--c-gray-lt);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: var(--sh-sm);
          z-index: 5;
          transition: all .3s;
          font-size: .85rem;
        }
        .hero-arrow:hover { background: var(--c-dark); color: #fff; border-color: var(--c-dark); }
        .hero-arrow.p { left: 1rem; }
        .hero-arrow.n { right: 1rem; }

        /* dots */
        .hero-dots {
          position: absolute;
          bottom: 1.1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: .4rem;
          z-index: 5;
        }
        .hero-dot {
          width: 6px; height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,.45);
          border: none;
          cursor: pointer;
          transition: all .3s;
          padding: 0;
        }
        .hero-dot.on { width: 20px; background: #fff; }

        /* ── tablet ── */
        @media (max-width: 1024px) {
          .hero-txt { padding: 2.5rem 2rem 4rem 3rem; }
          .hero-slide.full-bg .hero-txt { padding: 2rem 2rem 4rem 3rem; }
        }

        /* ── mobile ── */
        @media (max-width: 768px) {
          .hero-slide,
          .hero-slide.full-bg {
            min-height: 420px;
          }
          /* non-full-bg: stack image above, text below */
          .hero-slide:not(.full-bg) {
            flex-direction: column-reverse;
            min-height: auto;
          }
          .hero-txt,
          .hero-slide.full-bg .hero-txt {
            padding: 1.4rem 1.2rem 3.2rem 1.2rem;
            max-width: 100%;
          }
          .hero-img { height: 240px; width: 100%; }
          .hero-arrow { width: 32px; height: 32px; font-size: .78rem; }
          .hero-arrow.p { left: .6rem; }
          .hero-arrow.n { right: .6rem; }
        }

        @media (max-width: 600px) {
          .hero-slide,
          .hero-slide.full-bg { min-height: 360px; }
          .hero-h1 { font-size: clamp(1.4rem, 6vw, 2rem); }
          .hero-sub { font-size: .82rem; max-width: 100%; margin-bottom: 1.2rem; }
          .hero-dots { bottom: .65rem; }
          .hero-arrow { width: 28px; height: 28px; font-size: .72rem; }
        }

        @media (max-width: 400px) {
          .hero-slide,
          .hero-slide.full-bg { min-height: 300px; }
          .hero-h1 { font-size: 1.3rem; }
          .hero-txt,
          .hero-slide.full-bg .hero-txt { padding: 1rem 1rem 2.8rem 1rem; }
        }
        /* ─────────────────────────────────────────
           END HERO
        ───────────────────────────────────────── */

        .btn-dk { background: var(--c-dark); color: #fff; border: none; padding: .78rem 2rem; font-family: var(--fb); font-size: .78rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border-radius: 3px; transition: all .3s; }
        .btn-dk:hover { background: var(--c-olive); transform: translateY(-2px); box-shadow: var(--sh-md); }

        .sec-title { font-family: var(--fd); font-size: clamp(1.1rem, 2.5vw, 1.45rem); font-weight: 700; color: var(--c-dark); text-align: center; letter-spacing: -.3px; }
        .sec-line  { width: 38px; height: 2px; background: var(--c-olive); margin: .6rem auto 3rem; border-radius: 2px; }

        .cat-sec  { padding: 6rem 0; background: var(--c-white); }
        .cat-card { border-radius: var(--r); overflow: hidden; position: relative; cursor: pointer; height: 350px; transition: transform .35s var(--ease), box-shadow .35s var(--ease); box-shadow: var(--sh-sm); }
        .cat-card:hover { transform: translateY(-6px); box-shadow: var(--sh-lg); }
        .cat-card img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform .5s var(--ease); }
        .cat-card:hover img { transform: scale(1.07); }
        .cat-ov   { position: absolute; inset: 0; background: linear-gradient(transparent 45%,rgba(0,0,0,.7)); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.1rem; }
        .cat-name  { font-family: var(--fd); font-size: 1.1rem; font-weight: 700; color: #fff; }
        .cat-count { font-size: .72rem; color: rgba(255,255,255,.75); margin-bottom: .5rem; }
        .cat-btn  { display: inline-block; background: rgba(255,255,255,.92); color: var(--c-dark); font-size: .66rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: .3rem .7rem; border-radius: 3px; border: none; cursor: pointer; transition: all .3s; }
        .cat-btn:hover { background: var(--c-olive); color: #fff; }

        .prod-card { background: var(--c-white); border-radius: var(--r); overflow: hidden; box-shadow: var(--sh-sm); transition: transform .35s var(--ease), box-shadow .35s var(--ease); cursor: pointer; position: relative; }
        .prod-card:hover { transform: translateY(-6px); box-shadow: var(--sh-lg); }
        .prod-card .ib { position: relative; overflow: hidden; background: var(--c-off); height: 260px; }
        .prod-card .ib img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform .5s var(--ease); }
        .prod-card:hover .ib img { transform: scale(1.07); }
        .wish-btn { position: absolute; top: .7rem; right: .7rem; width: 32px; height: 32px; border-radius: 50%; background: #fff; border: none; display: flex; align-items: center; justify-content: center; font-size: .85rem; color: var(--c-gray); cursor: pointer; transition: all .3s; box-shadow: var(--sh-sm); z-index: 2; }
        .wish-btn:hover, .wish-btn.liked { color: var(--c-red); background: #fff0f0; }
        .prod-info  { padding: 1.2rem; }
        .prod-brand-lbl { font-size: .62rem; letter-spacing: .12em; text-transform: uppercase; color: var(--c-gray); margin-bottom: .2rem; }
        .prod-name  { font-size: .87rem; font-weight: 600; color: var(--c-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: .25rem; }
        .prod-price { font-size: .83rem; font-weight: 500; color: var(--c-olive-dk); }
        .prod-old   { font-size: .75rem; color: var(--c-gray); text-decoration: line-through; margin-right: .3rem; }
        .prod-price-row { display: flex; align-items: center; gap: .4rem; }
        .stars-row { color: #f5a623; font-size: .75rem; display: flex; gap: 1px; }
        .tag-b { position: absolute; top: .7rem; left: .7rem; background: var(--c-olive); color: #fff; font-size: .62rem; font-weight: 700; padding: .2rem .55rem; border-radius: 3px; text-transform: uppercase; letter-spacing: .5px; z-index: 2; }
        .tag-b.sale { background: var(--c-red); }

        .pc-hover-ov { position: absolute; inset: 0; background: rgba(0,0,0,.18); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1rem; opacity: 0; transition: opacity .3s; }
        .prod-card:hover .pc-hover-ov { opacity: 1; }
        .pc-qv-btn { background: rgba(255,255,255,.92); border: none; padding: .4rem 1.2rem; font-size: .72rem; font-weight: 600; border-radius: 4px; cursor: pointer; }

        .sc-wrap { position: relative; padding: 0 2px; }
        .sc-track { display: flex; gap: 1.4rem; overflow-x: auto; scroll-behavior: smooth; padding: .5rem .2rem 1.2rem; }
        .sc-track .prod-card { min-width: 200px; flex-shrink: 0; }
        .sc-btn { position: absolute; top: 50%; transform: translateY(-60%); width: 38px; height: 38px; border-radius: 50%; background: var(--c-white); border: 1px solid var(--c-gray-lt); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; box-shadow: var(--sh-md); transition: all .3s; font-size: .9rem; }
        .sc-btn:hover { background: var(--c-dark); color: #fff; border-color: var(--c-dark); }
        .sc-btn.l { left: -16px; } .sc-btn.r { right: -16px; }

        .sale-ban { position: relative; overflow: hidden; }
        .sale-ban-inner { position: relative; width: 100%; overflow: hidden; }
        .sale-ban-inner img { width: 100%; height: 520px; object-fit: cover; object-position: top center; display: block; }
        .sale-ban-text { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem 3rem; background: linear-gradient(transparent, rgba(0,0,0,.45)); text-align: center; }
        .sale-ban-text h2 { font-family: var(--fh); font-size: clamp(1.8rem, 6vw, 5rem); font-weight: 900; color: #fff; letter-spacing: 4px; line-height: 1; margin: 0; text-transform: uppercase; }
        .sale-sub { color: rgba(255,255,255,.8); font-size: .8rem; letter-spacing: .15em; text-transform: uppercase; margin-bottom: .5rem; }
        .sale-cta-btn { background: #fff; color: var(--c-dark); border: none; padding: .6rem 1.8rem; font-size: .75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border-radius: 3px; margin-top: 1rem; transition: all .3s; display: inline-block; }
        .sale-cta-btn:hover { background: var(--c-olive); color: #fff; }

        .trend-g { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.8rem; }

        .qv-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 9998; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .qv-modal { background: #fff; border-radius: var(--r); max-width: 820px; width: 100%; display: flex; max-height: 90vh; overflow: hidden; position: relative; }
        .qv-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.1rem; cursor: pointer; z-index: 5; color: var(--c-gray); }
        .qv-img-col { width: 45%; flex-shrink: 0; background: var(--c-off); position: relative; }
        .qv-img { width: 100%; height: 100%; object-fit: cover; }
        .qv-tag { position: absolute; top: .8rem; left: .8rem; font-size: .62rem; font-weight: 700; padding: .2rem .6rem; border-radius: 3px; text-transform: uppercase; }
        .qv-tag.sale { background: var(--c-red); color: #fff; }
        .qv-tag.new  { background: var(--c-olive); color: #fff; }
        .qv-info-col { flex: 1; padding: 2rem 1.8rem; overflow-y: auto; }
        .qv-brand { font-size: .65rem; letter-spacing: .15em; text-transform: uppercase; color: var(--c-gray); margin-bottom: .4rem; }
        .qv-name  { font-family: var(--fd); font-size: 1.3rem; font-weight: 700; margin-bottom: .6rem; }
        .qv-rating { display: flex; align-items: center; gap: .5rem; margin-bottom: .8rem; }
        .qv-rating-txt { font-size: .75rem; color: var(--c-gray); }
        .qv-prices { display: flex; align-items: center; gap: .6rem; margin-bottom: .8rem; }
        .qv-price { font-size: 1.15rem; font-weight: 700; color: var(--c-olive-dk); }
        .qv-old   { font-size: .9rem; color: var(--c-gray); text-decoration: line-through; }
        .qv-off   { font-size: .72rem; background: var(--c-red); color: #fff; padding: .15rem .45rem; border-radius: 3px; font-weight: 700; }
        .qv-divider { height: 1px; background: var(--c-gray-lt); margin: 1rem 0; }
        .qv-row   { display: flex; align-items: center; gap: 1rem; margin-bottom: .9rem; }
        .qv-lbl   { font-size: .72rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--c-dark); min-width: 44px; }
        .qv-colors { display: flex; gap: .4rem; flex-wrap: wrap; }
        .qv-color  { width: 22px; height: 22px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: box-shadow .2s; }
        .qv-color.on { box-shadow: 0 0 0 2.5px var(--c-dark); }
        .qv-sizes  { display: flex; gap: .35rem; flex-wrap: wrap; }
        .qv-sz     { padding: .28rem .65rem; font-size: .72rem; border: 1.5px solid var(--c-gray-lt); background: none; cursor: pointer; border-radius: 4px; transition: all .2s; font-family: var(--fb); }
        .qv-sz.on  { border-color: var(--c-dark); background: var(--c-dark); color: #fff; }
        .qv-sz-err { font-size: .7rem; color: var(--c-red); margin-top: .3rem; }
        .qv-qty    { display: flex; align-items: center; gap: .5rem; }
        .qv-qty button { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--c-gray-lt); background: none; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all .2s; }
        .qv-qty button:hover { background: var(--c-dark); color: #fff; border-color: var(--c-dark); }
        .qv-qty span { min-width: 24px; text-align: center; font-weight: 600; }
        .qv-btns   { display: flex; flex-direction: column; gap: .7rem; }
        .qv-add    { background: var(--c-dark); color: #fff; border: none; padding: .85rem; font-size: .78rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; border-radius: 6px; transition: all .3s; }
        .qv-add:hover { background: var(--c-olive); }
        .qv-add.added { background: #2e7d32; }
        .qv-full   { background: none; border: 1.5px solid var(--c-dark); color: var(--c-dark); padding: .75rem; font-size: .76rem; font-weight: 600; cursor: pointer; border-radius: 6px; transition: all .3s; }
        .qv-full:hover { background: var(--c-dark); color: #fff; }

        .m-ap-layout { display: flex; gap: 2.5rem; align-items: flex-start; }
        .m-ap-sidebar { width: 185px; flex-shrink: 0; position: sticky; top: 70px; }
        .m-ap-grid    { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.4rem; }
        .m-filter-bar { display: none; }
        .m-filter-drawer { position: fixed; top: 0; left: 0; bottom: 0; width: min(320px,88vw); background: #fff; z-index: 901; overflow-y: auto; transform: translateX(-100%); transition: transform .32s cubic-bezier(.4,0,.2,1); box-shadow: 4px 0 24px rgba(0,0,0,.15); }
        .m-filter-drawer.open { transform: translateX(0); }
        .m-filter-drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.3rem; border-bottom: 1px solid var(--c-gray-lt); position: sticky; top: 0; background: #fff; z-index: 2; }
        .m-filter-drawer-close { background: none; border: none; font-size: 1.3rem; cursor: pointer; color: var(--c-gray); line-height: 1; }
        .m-active-type-badge { display: inline-flex; align-items: center; gap: .4rem; background: var(--c-olive); color: #fff; font-size: .68rem; padding: .2rem .6rem; border-radius: 3px; margin-bottom: 1rem; }
        .m-active-type-badge button { background: none; border: none; color: #fff; cursor: pointer; font-size: .85rem; line-height: 1; padding: 0; margin-left: .2rem; opacity: .8; }
        .m-active-type-badge button:hover { opacity: 1; }

        .sp        { padding: 5rem 0; }
        .bg-cream  { background: var(--c-cream); }
        .bg-white  { background: var(--c-white); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .d-flex    { display: flex; }
        .gap-3     { gap: 1rem; }
        .flex-wrap { flex-wrap: wrap; }
        .text-center { text-align: center; }
        .mb-1  { margin-bottom: .5rem; }
        .me-1  { margin-right: .25rem; }
        .me-2  { margin-right: .5rem; }
        .ms-1  { margin-left: .25rem; }
        .row   { display: flex; flex-wrap: wrap; margin: 0 -.75rem; }
        .g-3 > * { padding: .75rem; }
        .col-12   { flex: 0 0 100%; max-width: 100%; }
        .col-md-4 { flex: 0 0 33.333%; max-width: 33.333%; }

        .sh-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(12px); background: var(--c-dark); color: #fff; padding: .65rem 1.6rem; font-size: .78rem; border-radius: 2px; opacity: 0; pointer-events: none; transition: opacity .3s, transform .3s; z-index: 9999; white-space: nowrap; }
        .sh-toast.on { opacity: 1; transform: translateX(-50%) translateY(0); }

        .reveal   { opacity:0; transform:translateY(24px); transition:opacity .7s,transform .7s; }
        .revealed { opacity:1; transform:none; }
        .d1{transition-delay:.1s} .d2{transition-delay:.2s} .d3{transition-delay:.3s} .d4{transition-delay:.4s}

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media(max-width:1024px) {
          .m-ap-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:768px) {
          .col-md-4 { flex: 0 0 100%; max-width: 100%; }
          .cat-sec { padding: 4rem 0; }
          .cat-card { height: 280px; }
          .trend-g  { grid-template-columns: repeat(2,1fr); gap: 1.2rem; }
          .sc-btn.l { left: 4px; } .sc-btn.r { right: 4px; }
          .sale-ban-inner img { height: 340px; }
          .sale-ban-text { padding: 1.2rem 1.5rem; }
          .sp { padding: 3.5rem 0; }
          .sec-line { margin-bottom: 2rem; }
          .m-ap-layout { flex-direction: column !important; }
          .m-ap-sidebar { display: none !important; }
          .m-ap-grid { grid-template-columns: repeat(2,1fr) !important; gap: .9rem !important; }
          .m-filter-bar { display: flex !important; align-items: center; gap: .6rem; padding: .7rem 0 1rem; flex-wrap: wrap; }
          .m-filter-btn { display: flex; align-items: center; gap: .4rem; background: var(--c-dark); color: #fff; border: none; padding: .5rem 1.1rem; font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; border-radius: 3px; font-family: 'DM Sans',sans-serif; }
          .m-sort-select { border: 1px solid var(--c-gray-lt); background: #fff; padding: .45rem .7rem; font-size: .7rem; color: var(--c-dark); font-family: 'DM Sans',sans-serif; border-radius: 3px; cursor: pointer; flex: 1; max-width: 180px; }
          .qv-modal { flex-direction: column; max-height: 95vh; overflow-y: auto; border-radius: var(--r) var(--r) 0 0; align-self: flex-end; }
          .qv-img-col { width: 100%; height: 220px; flex-shrink: 0; }
          .qv-info-col { padding: 1.4rem 1.2rem; }
          .qv-name { font-size: 1.1rem; }
          .qv-backdrop { align-items: flex-end; padding: 0; }
        }
        @media(max-width:600px) {
          .cat-card { height: 240px; }
          .sc-btn { display: none; }
          .sc-track { gap: 1rem; padding: .4rem .1rem 1rem; }
          .sc-track .prod-card { min-width: 170px; }
          .prod-card .ib { height: 200px; }
          .sale-ban-inner img { height: 260px; }
          .sale-ban-text { padding: 1rem; }
          .trend-g { grid-template-columns: repeat(2,1fr); gap: .9rem; }
          .container { padding: 0 1rem; }
          .sp { padding: 2.5rem 0; }
          .sh-toast { width: 88%; white-space: normal; text-align: center; font-size: .74rem; }
          .btn-dk { padding: .65rem 1.4rem; font-size: .74rem; }
        }
        @media(max-width:400px) {
          .trend-g { grid-template-columns: 1fr; }
          .cat-card { height: 220px; }
          .sc-track .prod-card { min-width: 150px; }
          .prod-card .ib { height: 180px; }
          .sale-ban-inner img { height: 220px; }
          .qv-img-col { height: 180px; }
          .m-ap-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
            <style>{SHARED_CSS}</style>
            <SHNav cart={cart} wish={wish} />

            <HeroCarousel />

            {/* ── CATEGORIES ── */}
            <section className="cat-sec">
                <div className="container">
                    <h2 className="sec-title reveal" ref={addRef}>Categories</h2>
                    <div className="sec-line reveal" ref={addRef} />
                    <div className="row g-3">
                        {CATEGORIES.map((c, i) => (
                            <div className="col-12 col-md-4" key={i}>
                                <div
                                    className={`cat-card reveal d${i + 1}`}
                                    ref={addRef}
                                    onClick={() => handleCategoryClick(c.name)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img src={c.img} alt={c.name} style={{ objectPosition: "top" }} />
                                    <div className="cat-ov">
                                        <div className="cat-name">{c.name}</div>
                                        <div className="cat-count">{c.count}</div>
                                        <button
                                            className="cat-btn"
                                            onClick={(e) => { e.stopPropagation(); handleCategoryClick(c.name); }}
                                        >
                                            Shop Now →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── NEW ARRIVALS ── */}
            <section className="sp bg-white">
                <div className="container">
                    <h2 className="sec-title reveal" ref={addRef}>New Arrivals</h2>
                    <div className="sec-line reveal" ref={addRef} />
                    <div className="sc-wrap">
                        <button className="sc-btn l" onClick={() => scroll(newArrRef, -1)}>
                            <i className="bi bi-chevron-left" />
                        </button>
                        <div className="sc-track no-sb" ref={newArrRef}>
                            {loading ? (
                                <div style={{ padding: "3rem", color: "#888", fontSize: ".85rem" }}>Loading products...</div>
                            ) : menProducts.length === 0 ? (
                                <div style={{ padding: "3rem", color: "#888", fontSize: ".85rem" }}>No products available yet.</div>
                            ) : menProducts.map((p, i) => (
                                <ProdCard key={p.id} p={p} d={(i % 3) + 1} addRef={addRef}
                                    onQuickView={setQuickView} onWish={toggleWish}
                                    wishlisted={wishlist.includes(p.id)} />
                            ))}
                        </div>
                        <button className="sc-btn r" onClick={() => scroll(newArrRef, 1)}>
                            <i className="bi bi-chevron-right" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── SALE BANNER ── */}
            <section className="sale-ban reveal" ref={addRef}>
                <div className="sale-ban-inner">
                    <img src="/men-section-page.png" alt="End of Season Sale" />
                    <div className="sale-ban-text">
                        <p className="sale-sub">Limited Time Only</p>
                        <h2>END OF SEASON SALE</h2>
                        <button className="sale-cta-btn" onClick={handleShopSale}>
                            Shop the Sale →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── TRENDING NOW ── */}
            <section className="sp">
                <div className="container">
                    <h2 className="sec-title reveal" ref={addRef}>Trending Now</h2>
                    <div className="sec-line reveal" ref={addRef} />
                    <div className="trend-g">
                        {loading ? (
                            <div style={{ padding: "2rem", color: "#888", fontSize: ".85rem", gridColumn: "1/-1" }}>Loading...</div>
                        ) : menProducts.length === 0 ? (
                            <div style={{ padding: "2rem", color: "#888", fontSize: ".85rem", gridColumn: "1/-1" }}>No products available yet.</div>
                        ) : menProducts.slice(0, 6).map((p, i) => (
                            <ProdCard key={p.id} p={p} d={(i % 3) + 1} addRef={addRef}
                                onQuickView={setQuickView} onWish={toggleWish}
                                wishlisted={wishlist.includes(p.id)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ALL PRODUCTS + FILTERS ── */}
            <section ref={allProductsRef} style={{ background: "var(--c-cream)", padding: "3rem 5%" }}>
                <h2 className="sec-title reveal" ref={addRef}>All Products</h2>
                <div className="sec-line reveal" ref={addRef} />

                {selType !== "all" && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                        <span className="m-active-type-badge">
                            {selType.charAt(0).toUpperCase() + selType.slice(1)}
                            <button onClick={() => { setSelType("all"); setFilterPage(1); }}>×</button>
                        </span>
                    </div>
                )}

                {sortBy === "sale" && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                        <span className="m-active-type-badge" style={{ background: "var(--c-red)" }}>
                            On Sale
                            <button onClick={() => { setSortBy("default"); setFilterPage(1); }}>×</button>
                        </span>
                    </div>
                )}

                <div className="m-filter-bar">
                    <button className="m-filter-btn" onClick={() => setDrawerOpen(true)}>
                        <i className="bi bi-sliders" />
                        Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                    </button>
                    <select className="m-sort-select" value={sortBy} onChange={e => { setSortBy(e.target.value); setFilterPage(1); }}>
                        <option value="default">Default</option>
                        <option value="low">Price: Low → High</option>
                        <option value="high">Price: High → Low</option>
                        <option value="sale">On Sale</option>
                    </select>
                    {hasFilters && (
                        <button onClick={handleClearFilters} style={{ fontSize: ".65rem", background: "none", border: "1px solid var(--c-gray-lt)", padding: ".4rem .8rem", cursor: "pointer", color: "var(--c-gray)", borderRadius: 3, fontFamily: "'DM Sans',sans-serif" }}>
                            Clear ×
                        </button>
                    )}
                </div>

                {drawerOpen && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 900 }} onClick={() => setDrawerOpen(false)}>
                        <div className={`m-filter-drawer ${drawerOpen ? "open" : ""}`} onClick={e => e.stopPropagation()}>
                            <div className="m-filter-drawer-head">
                                <span style={{ fontSize: ".78rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" }}>Filters</span>
                                <button className="m-filter-drawer-close" onClick={() => setDrawerOpen(false)}>×</button>
                            </div>
                            <div style={{ padding: "1.2rem 1.3rem" }}>
                                <FilterContent {...filterProps} />
                            </div>
                            <div style={{ padding: "1rem 1.3rem", borderTop: "1px solid var(--c-gray-lt)", position: "sticky", bottom: 0, background: "#fff" }}>
                                <button onClick={() => setDrawerOpen(false)} style={{ width: "100%", background: "var(--c-dark)", color: "#fff", border: "none", padding: ".7rem", fontSize: ".75rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", borderRadius: 3, fontFamily: "'DM Sans',sans-serif" }}>
                                    View {filtered.length} Result{filtered.length !== 1 ? "s" : ""}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="m-ap-layout">
                    <div className="m-ap-sidebar">
                        <FilterContent {...filterProps} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: ".7rem", color: "var(--c-gray)", marginBottom: "1rem", letterSpacing: ".04em" }}>
                            {filtered.length} product{filtered.length !== 1 ? "s" : ""}{totalPages > 1 ? ` — page ${filterPage} of ${totalPages}` : ""}
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "3rem", color: "var(--c-gray)" }}>Loading products...</div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--c-gray)", fontSize: ".85rem" }}>No products match your filters.</div>
                        ) : (
                            <div className="m-ap-grid">
                                {paginated.map((p, i) => (
                                    <div key={p.id}
                                        onClick={() => navigate(`/product/${p.id}`, { state: { product: p } })}
                                        style={{ background: "#fff", borderRadius: "var(--r)", overflow: "hidden", boxShadow: "var(--sh-sm)", cursor: "pointer", transition: "transform .35s, box-shadow .35s" }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--sh-lg)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--sh-sm)"; }}
                                    >
                                        <div style={{ position: "relative", height: 240, background: "var(--c-off)", overflow: "hidden" }}>
                                            {p.img
                                                ? <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} onError={e => e.target.style.display = "none"} />
                                                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>👕</div>
                                            }
                                            {p.old && <div style={{ position: "absolute", top: ".7rem", left: ".7rem", background: "var(--c-red)", color: "#fff", fontSize: ".58rem", padding: ".2rem .55rem", fontWeight: 700, borderRadius: 3 }}>SALE</div>}
                                        </div>
                                        <div style={{ padding: "1rem" }}>
                                            <div style={{ fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-gray)", marginBottom: ".2rem" }}>{p.brand}</div>
                                            <div style={{ fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                                            <div style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
                                                {p.old && <span style={{ fontSize: ".72rem", color: "var(--c-gray)", textDecoration: "line-through" }}>LE {p.old?.toLocaleString()}</span>}
                                                <span style={{ fontSize: ".83rem", fontWeight: 600, color: p.old ? "var(--c-red)" : "var(--c-olive-dk)" }}>LE {p.price?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div style={{ display: "flex", justifyContent: "center", gap: ".45rem", padding: "2.5rem 0", flexWrap: "wrap" }}>
                                <button onClick={() => setFilterPage(p => Math.max(1, p - 1))} disabled={filterPage === 1} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--c-gray-lt)", background: "none", cursor: filterPage === 1 ? "not-allowed" : "pointer", opacity: filterPage === 1 ? .4 : 1, fontSize: "1rem" }}>‹</button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                    <button key={n} onClick={() => setFilterPage(n)} style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${filterPage === n ? "var(--c-dark)" : "var(--c-gray-lt)"}`, background: filterPage === n ? "var(--c-dark)" : "none", color: filterPage === n ? "#fff" : "var(--c-dark)", cursor: "pointer", fontSize: ".75rem", fontWeight: filterPage === n ? 600 : 400, transition: "all .2s" }}>{n}</button>
                                ))}
                                <button onClick={() => setFilterPage(p => Math.min(totalPages, p + 1))} disabled={filterPage === totalPages} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--c-gray-lt)", background: "none", cursor: filterPage === totalPages ? "not-allowed" : "pointer", opacity: filterPage === totalPages ? .4 : 1, fontSize: "1rem" }}>›</button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {quickView && (
                <QuickViewModal p={quickView} onClose={() => setQuickView(null)} onAddToCart={addToCart} />
            )}

            <div className={`sh-toast ${toast ? "on" : ""}`}>{toast}</div>
            <SHFooter />
        </div>
    );
}