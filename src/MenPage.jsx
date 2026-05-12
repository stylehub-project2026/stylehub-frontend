import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SHNav, SHFooter, SHARED_CSS } from "./shared";

/* ══════════════════════════════════════════ DATA ══════════════════════════════════════════ */
const HERO_SLIDES = [
    {
        ey: "New Collection 2026",
        h1: "Find Your Favorite\nTrendy Outfits!",
        sub: "Discover the latest looks from Egypt's top local brands.",
        btn: "Shop Now",
        img: "/images/men-slider.avif",
        bg: "#eaeaea",
        fullBg: true,
    },
    {
        ey: "End of Season Deals",
        h1: "Men",
        sub: "Up to 50% off selected items from local designers.",
        btn: "Explore Sale",
        img: "/images/men-slider3.webp",
        bg: "#ede9e0",
        fullBg: true,
    },
    {
        ey: "Local Brands Spotlight",
        h1: "Wear What\nMakes You Bold",
        sub: "Support Egyptian creators — every purchase matters.",
        btn: "Meet the Brands",
        img: "/images/men-slider_photo.jpg",
        bg: "#f0ece8",
        fullBg: true,
    },
];

const CATEGORIES = [
    { name: "Pants", img: "/images/men_cat1.webp", count: "24 styles" },
    { name: "Hoodies", img: "/images/men_cat2.webp", count: "18 styles" },
    { name: "Jackets", img: "/images/men-jacket.png", count: "12 styles" },
];

/* ══════════════════════════════════════════ HELPERS ══════════════════════════════════════════ */
function Stars({ n }) {
    return (
        <span className="stars-row">
            {[1, 2, 3, 4, 5].map((i) => (
                <i
                    key={i}
                    className={`bi bi-star${i <= Math.round(n) ? "-fill" : ""}`}
                />
            ))}
        </span>
    );
}

function useReveal() {
    const refs = useRef([]);
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) =>
                entries.forEach(
                    (e) => e.isIntersecting && e.target.classList.add("revealed"),
                ),
            { threshold: 0.08 },
        );
        refs.current.forEach((r) => r && obs.observe(r));
        return () => obs.disconnect();
    }, []);
    return useCallback((el) => {
        if (el && !refs.current.includes(el)) refs.current.push(el);
    }, []);
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
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleAdd = () => {
        if (!selSize) {
            setSizeErr(true);
            return;
        }
        setSizeErr(false);
        setAdded(true);
        onAddToCart();
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <div
            className="qv-backdrop"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="qv-modal">
                <button className="qv-close" onClick={onClose}>
                    <i className="bi bi-x-lg" />
                </button>
                <div className="qv-img-col">
                    <img src={p.img} alt={p.name} className="qv-img" />
                    {p.tag && (
                        <span className={`qv-tag ${p.tag === "Sale" ? "sale" : "new"}`}>
                            {p.tag}
                        </span>
                    )}
                </div>
                <div className="qv-info-col">
                    <div className="qv-brand">{p.brand}</div>
                    <h2 className="qv-name">{p.name}</h2>
                    <div className="qv-rating">
                        <Stars n={p.rating} />
                        <span className="qv-rating-txt">
                            {p.rating} · {p.reviews} reviews
                        </span>
                    </div>
                    <div className="qv-prices">
                        {p.old && (
                            <span className="qv-old">LE {p.old.toLocaleString()}</span>
                        )}
                        <span className="qv-price">LE {p.price.toLocaleString()}</span>
                        {p.old && (
                            <span className="qv-off">
                                {Math.round((1 - p.price / p.old) * 100)}% OFF
                            </span>
                        )}
                    </div>
                    <div className="qv-divider" />
                    {p.colors?.length > 0 && (
                        <div className="qv-row">
                            <span className="qv-lbl">Color</span>
                            <div className="qv-colors">
                                {p.colors.map((c, i) => (
                                    <button
                                        key={i}
                                        className={`qv-color ${selColor === i ? "on" : ""}`}
                                        style={{ background: c }}
                                        onClick={() => setSelColor(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="qv-row align-items-start">
                        <span className="qv-lbl">Size</span>
                        <div>
                            <div className="qv-sizes">
                                {p.sizes?.map((s) => (
                                    <button
                                        key={s}
                                        className={`qv-sz ${selSize === s ? "on" : ""}`}
                                        onClick={() => {
                                            setSelSize(s);
                                            setSizeErr(false);
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {sizeErr && <p className="qv-sz-err">Please select a size</p>}
                        </div>
                    </div>
                    <div className="qv-row">
                        <span className="qv-lbl">Qty</span>
                        <div className="qv-qty">
                            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                                −
                            </button>
                            <span>{qty}</span>
                            <button onClick={() => setQty((q) => q + 1)}>+</button>
                        </div>
                    </div>
                    <div className="qv-divider" />
                    <div className="qv-btns">
                        <button
                            className={`qv-add ${added ? "added" : ""}`}
                            onClick={handleAdd}
                        >
                            <i className={`bi ${added ? "bi-check-lg" : "bi-bag"} me-2`} />
                            {added ? "Added!" : "Add to Cart"}
                        </button>
                        <button
                            className="qv-full"
                            onClick={() => {
                                onClose();
                                navigate(`/product/${p.id}`, { state: { product: p } });
                            }}
                        >
                            Full Details <i className="bi bi-arrow-right ms-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════ PRODUCT CARD ══════════════════════════════════════════ */
function ProdCard({ p, onQuickView, onWish, wishlisted, addRef, d = 1 }) {
    const navigate = useNavigate();
    return (
        <div
            className={`prod-card revealed d${d}`}
            ref={addRef}
            onClick={() => navigate(`/product/${p.id}`, { state: { product: p } })}
        >
            <div className="ib">
                {p.tag && (
                    <span className={`tag-b ${p.tag === "Sale" ? "sale" : ""}`}>
                        {p.tag}
                    </span>
                )}
                <img src={p.img} alt={p.name} loading="lazy" />
                <div className="pc-hover-ov">
                    <button
                        className="pc-qv-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(p);
                        }}
                    >
                        <i className="bi bi-eye me-1" /> Quick View
                    </button>
                </div>
                <button
                    className={`wish-btn ${wishlisted ? "liked" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onWish(p.id);
                    }}
                >
                    <i className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"}`} />
                </button>
            </div>
            <div className="prod-info">
                {p.brand && <div className="prod-brand-lbl" style={{ cursor: "pointer" }} onClick={e => { e.stopPropagation(); navigate(`/brand/${encodeURIComponent(p.brand)}`); }}>{p.brand}</div>}
                <div className="prod-name">{p.name}</div>
                {p.rating && (
                    <div className="prod-stars-row">
                        <Stars n={p.rating} />
                        <span className="prod-rev-cnt">({p.reviews})</span>
                    </div>
                )}
                <div className="prod-price-row">
                    {p.old && (
                        <span className="prod-old">LE {p.old.toLocaleString()}</span>
                    )}
                    <span className="prod-price">LE {p.price.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════ PICK CARD ══════════════════════════════════════════ */
function PickCard({ p, onQuickView, onWish, wishlisted, addRef, d = 1 }) {
    const navigate = useNavigate();
    return (
        <div
            className={`pick-card revealed d${d}`}
            ref={addRef}
            onClick={() => navigate(`/product/${p.id}`, { state: { product: p } })}
        >
            <div className="ib">
                <img src={p.img} alt={p.name} />
                <button
                    className="pick-add-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(p);
                    }}
                >
                    Quick View
                </button>
                <button
                    className={`wish-btn ${wishlisted ? "liked" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onWish(p.id);
                    }}
                >
                    <i className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"}`} />
                </button>
            </div>
            <div className="pick-info">
                <div className="pick-text">
                    <div className="prod-name">{p.name}</div>
                    <div className="prod-price">LE {p.price.toLocaleString()}</div>
                    {p.rating && <Stars n={p.rating} />}
                </div>
                <img
                    src={p.brandLogo}
                    alt="brand"
                    className="pick-brand-logo"
                    onError={(e) => {
                        e.target.style.display = "none";
                    }}
                />
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════ HERO CAROUSEL ══════════════════════════════════════════ */
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
        <div
            className="hero"
            style={
                s.fullBg
                    ? {
                        backgroundColor: s.bg,
                        backgroundImage: `url(${s.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }
                    : { backgroundColor: s.bg }
            }
        >
            <div
                className={`hero-slide active${s.fullBg ? " full-bg" : ""}`}
                key={key}
            >
                <div className="hero-txt">
                    <div className="hero-ey">{s.ey}</div>
                    <h1 className="hero-h1">
                        {s.h1.split("\n").map((l, i) => (
                            <span key={i}>
                                {l}
                                <br />
                            </span>
                        ))}
                    </h1>
                    <p className="hero-sub">{s.sub}</p>
                    <div className="d-flex gap-3 flex-wrap">
                        <button className="btn-dk">{s.btn}</button>
                    </div>
                </div>
                {!s.fullBg && (
                    <div className="hero-img">
                        <img src={s.img} alt={s.h1} />
                    </div>
                )}
            </div>
            <button className="hero-arrow p" onClick={() => go(-1)}>
                <i className="bi bi-chevron-left" />
            </button>
            <button className="hero-arrow n" onClick={() => go(1)}>
                <i className="bi bi-chevron-right" />
            </button>
            <div className="hero-dots">
                {HERO_SLIDES.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-dot ${i === cur ? "on" : ""}`}
                        onClick={() => {
                            setCur(i);
                            setKey((k) => k + 1);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════ MAIN ══════════════════════════════════════════ */
export default function MenPage({ cart = [], setCart, wish = [], setWish }) {
    const wishlist = wish;
    const cartCount = cart.reduce((s, x) => s + (x.qty || 1), 0);

    const [toast, setToast] = useState("");
    const [quickView, setQuickView] = useState(null);
    const [menProducts, setMenProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Fetch men products from backend
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
                    type: p.tags?.[0] || "",
                }));
                setMenProducts(list);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2200);
    };

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
            if (g)
                return prev.map((x) =>
                    x.id === "__generic__" ? { ...x, qty: x.qty + 1 } : x,
                );
            return [...prev, { id: "__generic__", size: "M", qty: 1 }];
        });
        showToast("✓  Added to cart");
    };

    const addRef = useReveal();
    const newArrRef = useRef(null);
    const scroll = (ref, dir) =>
        ref.current?.scrollBy({ left: dir * 250, behavior: "smooth" });

    useEffect(() => {
        document.title = `StyleHub — Men${cartCount > 0 ? ` (${cartCount})` : ""}`;
    }, [cartCount]);

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
          --fd: 'Playfair Display', serif;
          --fb: 'DM Sans', sans-serif;
          --fh: 'Bebas Neue', cursive;
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

        /* HERO */
        .hero { min-height: 600px; position: relative; overflow: hidden; }
        .hero-slide { display: none; min-height: 600px; align-items: center; justify-content: space-between; }
        .hero-slide.full-bg { justify-content: flex-start; }
        .hero-slide.active { display: flex; animation: fadeIn .55s var(--ease); }
        .hero-txt { padding: 5rem 3rem 5rem 5.5rem; flex: 1; z-index: 1; }
        .hero-ey  { font-size: .7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2.5px; color: var(--c-olive); margin-bottom: .85rem; }
        .hero-img { width: 50%; height: 480px; overflow: hidden; }
        .hero-img img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
        .hero-h1  { font-family: var(--fd); font-size: clamp(2rem,3.5vw,3rem); font-weight: 700; line-height: 1.15; color: var(--c-dark); margin-bottom: .9rem; }
        .hero-sub { font-size: .85rem; color: var(--c-gray); line-height: 1.65; max-width: 300px; margin-bottom: 1.8rem; }
        .hero-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; border-radius: 50%; background: #fff; border: 1px solid var(--c-gray-lt); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: var(--sh-sm); z-index: 5; transition: all .3s; font-size: .85rem; }
        .hero-arrow:hover { background: var(--c-dark); color: #fff; }
        .hero-arrow.p { left: 1rem; } .hero-arrow.n { right: 1rem; }
        .hero-dots { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); display: flex; gap: .4rem; }
        .hero-dot  { width: 6px; height: 6px; border-radius: 3px; background: rgba(0,0,0,.25); border: none; cursor: pointer; transition: all .3s; padding: 0; }
        .hero-dot.on { width: 20px; background: var(--c-olive); }

        /* BUTTONS */
        .btn-dk { background: var(--c-dark); color: #fff; border: none; padding: .78rem 2rem; font-family: var(--fb); font-size: .78rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border-radius: 3px; transition: all .3s; }
        .btn-dk:hover { background: var(--c-olive); transform: translateY(-2px); box-shadow: var(--sh-md); }

        /* HEADINGS */
        .sec-title { font-family: var(--fd); font-size: 1.45rem; font-weight: 700; color: var(--c-dark); text-align: center; letter-spacing: -.3px; }
        .sec-line  { width: 38px; height: 2px; background: var(--c-olive); margin: .6rem auto 3rem; border-radius: 2px; }

        /* CATEGORIES */
        .cat-sec  { padding: 8rem 0; background: var(--c-white); }
        .cat-card { border-radius: var(--r); overflow: hidden; position: relative; cursor: pointer; height: 350px; transition: transform .35s var(--ease), box-shadow .35s var(--ease); box-shadow: var(--sh-sm); }
        .cat-card:hover { transform: translateY(-6px); box-shadow: var(--sh-lg); }
        .cat-card img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform .5s var(--ease); }
        .cat-card:hover img { transform: scale(1.07); }
        .cat-ov  { position: absolute; inset: 0; background: linear-gradient(transparent 45%,rgba(0,0,0,.7)); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.1rem; }
        .cat-name  { font-family: var(--fd); font-size: 1.1rem; font-weight: 700; color: #fff; }
        .cat-count { font-size: .72rem; color: rgba(255,255,255,.75); margin-bottom: .5rem; }
        .cat-btn { display: inline-block; background: rgba(255,255,255,.92); color: var(--c-dark); font-size: .66rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: .3rem .7rem; border-radius: 3px; border: none; cursor: pointer; transition: all .3s; }
        .cat-btn:hover { background: var(--c-olive); color: #fff; }

        /* PRODUCT CARD */
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
        .prod-stars-row { display: flex; align-items: center; gap: .3rem; margin-bottom: .3rem; }
        .prod-rev-cnt { font-size: .7rem; color: var(--c-gray); }
        .stars-row { color: #f5a623; font-size: .75rem; display: flex; gap: 1px; }
        .tag-b { position: absolute; top: .7rem; left: .7rem; background: var(--c-olive); color: #fff; font-size: .62rem; font-weight: 700; padding: .2rem .55rem; border-radius: 3px; text-transform: uppercase; letter-spacing: .5px; z-index: 2; }
        .tag-b.sale { background: var(--c-red); }

        /* QUICK VIEW HOVER */
        .pc-hover-ov { position: absolute; inset: 0; background: rgba(0,0,0,.18); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1rem; opacity: 0; transition: opacity .3s; }
        .prod-card:hover .pc-hover-ov { opacity: 1; }
        .pc-qv-btn { background: rgba(255,255,255,.92); border: none; padding: .4rem 1.2rem; font-size: .72rem; font-weight: 600; border-radius: 4px; cursor: pointer; }

        /* SCROLL CAROUSEL */
        .sc-wrap { position: relative; padding: 0 2px; }
        .sc-track { display: flex; gap: 1.8rem; overflow-x: auto; scroll-behavior: smooth; padding: .5rem .2rem 1.2rem; }
        .sc-track .prod-card { min-width: 220px; flex-shrink: 0; }
        .sc-btn { position: absolute; top: 50%; transform: translateY(-60%); width: 38px; height: 38px; border-radius: 50%; background: var(--c-white); border: 1px solid var(--c-gray-lt); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; box-shadow: var(--sh-md); transition: all .3s; font-size: .9rem; }
        .sc-btn:hover { background: var(--c-dark); color: #fff; border-color: var(--c-dark); }
        .sc-btn.l { left: -16px; } .sc-btn.r { right: -16px; }

        /* SALE BANNER */
        .sale-ban { position: relative; overflow: hidden; }
        .sale-ban-inner { position: relative; width: 100%; overflow: hidden; }
        .sale-ban-inner img { width: 100%; height: 520px; object-fit: cover; object-position: top center; display: block; }
        .sale-ban-text { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem 3rem; background: linear-gradient(transparent, rgba(0,0,0,.35)); text-align: center; }
        .sale-ban-text h2 { font-family: var(--fh); font-size: clamp(2.5rem,6vw,5rem); font-weight: 900; color: #fff; letter-spacing: 4px; line-height: 1; margin: 0; text-transform: uppercase; }
        .sale-sub { color: rgba(255,255,255,.8); font-size: .8rem; letter-spacing: .15em; text-transform: uppercase; margin-bottom: .5rem; }
        .sale-cta-btn { background: #fff; color: var(--c-dark); border: none; padding: .6rem 1.8rem; font-size: .75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border-radius: 3px; margin-top: 1rem; transition: all .3s; }
        .sale-cta-btn:hover { background: var(--c-olive); color: #fff; }

        /* TRENDING */
        .trend-g { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.8rem; }
        @media(max-width:768px) { .trend-g { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:480px) { .trend-g { grid-template-columns: 1fr; } }

        /* TOP PICKS */
        .picks-g { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
        @media(max-width:768px) { .picks-g { grid-template-columns: repeat(2,1fr); } }
        .pick-card { background: var(--c-white); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.06); cursor: pointer; transition: transform .35s var(--ease), box-shadow .35s var(--ease); display: flex; flex-direction: column; }
        .pick-card:hover { transform: translateY(-4px); box-shadow: var(--sh-md); }
        .pick-card .ib { position: relative; width: 100%; aspect-ratio: 1/1.2; overflow: hidden; background: var(--c-off); border-radius: 10px 10px 0 0; }
        .pick-card .ib img { width: 100%; height: 100%; object-fit: contain; display: block; transition: transform .5s var(--ease); }
        .pick-card:hover .ib img { transform: scale(1.03); }
        .pick-add-btn { position: absolute; bottom: .7rem; left: 50%; transform: translateX(-50%) translateY(6px); background: rgba(255,255,255,.92); color: var(--c-dark); border: none; padding: .25rem 1.2rem; font-size: .7rem; font-weight: 600; border-radius: 5px; cursor: pointer; transition: all .3s; opacity: 0; white-space: nowrap; }
        .pick-card:hover .pick-add-btn { opacity: 1; transform: translateX(-50%) translateY(0); }
        .pick-info { display: flex; align-items: center; justify-content: space-between; padding: 1rem; gap: .4rem; flex: 1; }
        .pick-text { flex: 1; }
        .pick-brand-logo { height: 24px; width: auto; max-width: 70px; object-fit: contain; flex-shrink: 0; opacity: .85; }

        /* QUICK VIEW MODAL */
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

        /* UTILS */
        .sp       { padding: 5.5rem 0; }
        .bg-cream { background: var(--c-cream); }
        .bg-white { background: var(--c-white); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .d-flex   { display: flex; }
        .gap-3    { gap: 1rem; }
        .flex-wrap { flex-wrap: wrap; }
        .text-center { text-align: center; }
        .mb-1     { margin-bottom: .5rem; }
        .me-1     { margin-right: .25rem; }
        .me-2     { margin-right: .5rem; }
        .row      { display: flex; flex-wrap: wrap; margin: 0 -.75rem; }
        .g-3 > * { padding: .75rem; }
        .col-12   { flex: 0 0 100%; max-width: 100%; }
        .col-md-4 { flex: 0 0 33.333%; max-width: 33.333%; }
        @media(max-width:768px) { .col-md-4 { flex: 0 0 100%; max-width: 100%; } }
        @media(max-width:768px) { .hero-slide { flex-direction: column-reverse; } .hero-txt { padding: 2rem 1.5rem; } .hero-img { height: 260px; width: 100%; } }

        /* TOAST */
        .sh-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(12px); background: var(--c-dark); color: #fff; padding: .65rem 1.6rem; font-size: .78rem; border-radius: 2px; opacity: 0; pointer-events: none; transition: opacity .3s, transform .3s; z-index: 9999; white-space: nowrap; }
        .sh-toast.on { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* REVEAL */
        .reveal   { opacity:0; transform:translateY(24px); transition:opacity .7s,transform .7s; }
        .revealed { opacity:1; transform:none; }
        .d1{transition-delay:.1s} .d2{transition-delay:.2s} .d3{transition-delay:.3s} .d4{transition-delay:.4s}

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
            <style>{SHARED_CSS}</style>
            <SHNav cart={cart} wish={wish} />

            <HeroCarousel />

            {/* CATEGORIES */}
            <section className="cat-sec">
                <div className="container">
                    <h2 className="sec-title reveal" ref={addRef}>
                        Categories
                    </h2>
                    <div className="sec-line reveal" ref={addRef} />
                    <div className="row g-3">
                        {CATEGORIES.map((c, i) => (
                            <div className="col-12 col-md-4" key={i}>
                                <div className={`cat-card reveal d${i + 1}`} ref={addRef}>
                                    <img
                                        src={c.img}
                                        alt={c.name}
                                        style={{ objectPosition: "top" }}
                                    />
                                    <div className="cat-ov">
                                        <div className="cat-name">{c.name}</div>
                                        <div className="cat-count">{c.count}</div>
                                        <button className="cat-btn">Shop Now →</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW ARRIVALS */}
            <section className="sp bg-white">
                <div className="container">
                    <h2 className="sec-title reveal" ref={addRef}>
                        New Arrivals
                    </h2>
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
                        <button className="sc-btn r" onClick={() => scroll(newArrRef, 1)}>
                            <i className="bi bi-chevron-right" />
                        </button>
                    </div>
                </div>
            </section>

            {/* SALE BANNER */}
            <section className="sale-ban reveal" ref={addRef}>
                <div className="sale-ban-inner">
                    <img src="/images/men-section-page.png" alt="End of Season Sale" />
                    <div className="sale-ban-text">
                        <p className="sale-sub">Limited Time Only</p>
                        <h2>END OF SEASON SALE</h2>
                        <button className="sale-cta-btn">Shop the Sale →</button>
                    </div>
                </div>
            </section>

            {/* TRENDING NOW */}
            <section className="sp">
                <div className="container">
                    <h2 className="sec-title reveal" ref={addRef}>
                        Trending Now
                    </h2>
                    <div className="sec-line reveal" ref={addRef} />
                    <div className="trend-g">
                        {loading ? (
                            <div style={{ padding: "2rem", color: "#888", fontSize: ".85rem", gridColumn: "1/-1" }}>Loading...</div>
                        ) : menProducts.length === 0 ? (
                            <div style={{ padding: "2rem", color: "#888", fontSize: ".85rem", gridColumn: "1/-1" }}>No products available yet.</div>
                        ) : menProducts.slice(0, 6).map((p, i) => (
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
            <section className="sp bg-white">
                <div className="container">
                    <h2 className="sec-title reveal" ref={addRef}>
                        Top Picks
                    </h2>
                    <p
                        className="text-center mb-1 reveal"
                        ref={addRef}
                        style={{ fontSize: ".82rem", color: "var(--c-gray)" }}
                    >
                        Discover the most popular pieces from different brands.
                    </p>
                    <div className="sec-line reveal" ref={addRef} />
                    <div className="picks-g">
                        {loading ? (
                            <div style={{ padding: "2rem", color: "#888", fontSize: ".85rem", gridColumn: "1/-1" }}>Loading...</div>
                        ) : menProducts.length === 0 ? (
                            <div style={{ padding: "2rem", color: "#888", fontSize: ".85rem", gridColumn: "1/-1" }}>No products available yet.</div>
                        ) : menProducts.slice(0, 4).map((p, i) => (
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

            <div className={`sh-toast ${toast ? "on" : ""}`}>{toast}</div>

            <SHFooter />
        </div>
    );
}