import { useMemo, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PRODUCTS, SHARED_CSS, SHFooter, SHNav } from "./shared";

const API = "https://stylehub-backend-tau.vercel.app/api";

const PAGE_CSS = `
.bo-page {
  background: linear-gradient(180deg, #f7f3ec 0%, #f8f6f2 26%, #f5f2ea 100%);
}
.bo-shell { max-width: 1380px; margin: 0 auto; padding: 2.35rem 1.1rem 4rem; }
.bo-hero { text-align: center; margin-bottom: 2rem; }
.bo-title { margin: 0; font-family: 'Cormorant Garamond', serif; font-size: clamp(2.35rem, 4vw, 3.5rem); color: #28231d; }
.bo-sub { margin-top: .45rem; color: #8b8579; font-size: .82rem; }
.bo-layout { display: grid; grid-template-columns: 330px minmax(0, 1fr); gap: 1.8rem; align-items: start; }
.bo-side { position: sticky; top: 84px; }
.bo-soft { background: rgba(255,255,255,.72); border: 1px solid rgba(86, 76, 60, .12); border-radius: 28px; box-shadow: 0 18px 42px rgba(37, 31, 23, .06); }
.bo-stage { height: 560px; overflow: hidden; border-radius: 28px; background: radial-gradient(circle at 48% 16%, rgba(255,255,255,.22), transparent 28%), linear-gradient(180deg, #4c4b47 0%, #3a3936 100%); }
@keyframes fadeInUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
@keyframes fadeInDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:none; } }
.bo-data { margin-top: 1rem; padding: 1.15rem; }
.bo-card-title { text-align: center; font-family: 'Cormorant Garamond', serif; font-size: 1.22rem; color: #2e2922; margin-bottom: .95rem; }
.bo-row { margin-bottom: .78rem; }
.bo-row-top { display: flex; justify-content: space-between; font-size: .7rem; color: #736d63; margin-bottom: .25rem; }
.bo-range { appearance: none; width: 100%; height: 7px; border-radius: 999px; background: linear-gradient(90deg, #d3d7c7, #abb28e); outline: none; }
.bo-range::-webkit-slider-thumb { appearance: none; width: 15px; height: 15px; border-radius: 50%; background: #818a63; border: 3px solid #edf0e5; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.16); }
.bo-data-note { margin-top: .55rem; padding: .85rem .9rem; border-radius: 14px; background: rgba(167, 176, 138, .16); color: #5e644c; font-size: .72rem; line-height: 1.5; }
.bo-favorites { margin-top: 1rem; padding: 1.15rem; }
.bo-fav-title { display: flex; justify-content: center; align-items: center; gap: .35rem; font-family: 'Cormorant Garamond', serif; font-size: 1.18rem; color: #2e2922; margin-bottom: .85rem; }
.bo-mini-list { display: grid; gap: .65rem; }
.bo-mini { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: .6rem; align-items: center; padding: .45rem; background: #fff; border-radius: 14px; border: 1px solid rgba(86, 76, 60, .12); }
.bo-mini img { width: 44px; height: 44px; border-radius: 999px; object-fit: cover; }
.bo-mini-name { font-size: .71rem; color: #28231d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bo-mini-price { color: #7d766a; font-size: .67rem; }
.bo-main { min-width: 0; }
.bo-step { margin-bottom: 2rem; }
.bo-kicker { color: #302923; margin-bottom: .55rem; }
.bo-kicker strong { display: block; font-size: 1rem; margin-bottom: .25rem; }
.bo-divider { display: flex; align-items: center; gap: .85rem; margin-bottom: .95rem; }
.bo-divider span { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; color: #2b261f; white-space: nowrap; }
.bo-divider::after { content: ""; height: 1px; background: rgba(40, 34, 27, .28); flex: 1; }
.bo-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.bo-product { padding: .9rem; border-radius: 25px; background: rgba(255,255,255,.76); border: 1px solid rgba(86, 76, 60, .12); box-shadow: 0 12px 28px rgba(37, 31, 23, .05); transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
.bo-product:hover { transform: translateY(-2px); box-shadow: 0 18px 32px rgba(37, 31, 23, .08); }
.bo-product.on { border-color: rgba(123, 132, 91, .7); box-shadow: 0 18px 34px rgba(123, 132, 91, .18); }
.bo-thumb { position: relative; overflow: hidden; border-radius: 20px; aspect-ratio: .82; background: #ece7df; margin-bottom: .8rem; }
.bo-thumb img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
.bo-heart { position: absolute; left: .6rem; bottom: .6rem; width: 28px; height: 28px; border: none; border-radius: 50%; background: rgba(255,255,255,.96); font-size: .88rem; box-shadow: 0 8px 18px rgba(0,0,0,.12); cursor: pointer; transition: color .2s, transform .18s; display: flex; align-items: center; justify-content: center; }
.bo-heart:hover { transform: scale(1.15); }
.bo-brand { font-size: .63rem; letter-spacing: .18em; text-transform: uppercase; color: #8a8173; margin-bottom: .25rem; }
.bo-name { min-height: 2.45em; font-size: .82rem; font-weight: 600; color: #27211b; }
.bo-price { margin: .18rem 0 .7rem; color: #6f695e; font-size: .74rem; }
.bo-model-badge { display: inline-flex; margin-bottom: .55rem; padding: .18rem .45rem; border-radius: 999px; background: rgba(167, 176, 138, .18); color: #66704d; font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; }
.bo-btn { min-width: 88px; border: none; border-radius: 8px; padding: .48rem .85rem; font-size: .69rem; background: #a7b08a; color: #fff; cursor: pointer; transition: background .18s; }
.bo-btn:hover { background: #8d9672; }
.bo-btn.dark { background: #25211b; }
.bo-btn.dark:hover { background: #3a3630; }
.bo-recs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.bo-rec { text-align: center; }
.bo-rec .bo-thumb { aspect-ratio: .84; margin-bottom: .5rem; }
.bo-rec .bo-name { min-height: auto; }
.bo-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.bo-pill { padding: .95rem 1rem; border-radius: 18px; background: rgba(255,255,255,.76); border: 1px solid rgba(86, 76, 60, .12); }
.bo-pill small { display: block; margin-bottom: .32rem; color: #8c8479; font-size: .57rem; letter-spacing: .18em; text-transform: uppercase; }
.bo-pill strong { color: #28231d; font-size: .88rem; }
.bo-actions { display: flex; gap: .8rem; margin-top: 1rem; }
.bo-primary, .bo-secondary { border: none; border-radius: 12px; padding: .95rem 1rem; text-transform: uppercase; letter-spacing: .1em; font-size: .73rem; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .18s; }
.bo-primary { flex: 1; background: #25211b; color: #fff; }
.bo-primary:hover:not(:disabled) { background: #3a3630; }
.bo-primary:disabled { opacity: .4; cursor: not-allowed; }
.bo-secondary { min-width: 240px; background: rgba(167, 176, 138, .16); color: #5a6249; }
.bo-secondary:hover:not(:disabled) { background: rgba(167, 176, 138, .28); }
.bo-secondary:disabled { opacity: .4; cursor: not-allowed; }
.bo-carousel { position: relative; }
.bo-carousel-track { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; transition: none; }
.bo-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(86,76,60,.18); background: rgba(255,255,255,.92); box-shadow: 0 6px 18px rgba(37,31,23,.10); color: #28231d; font-size: 1rem; cursor: pointer; z-index: 5; display: flex; align-items: center; justify-content: center; transition: background .16s, box-shadow .16s; }
.bo-carousel-btn:hover { background: #fff; box-shadow: 0 8px 22px rgba(37,31,23,.15); }
.bo-carousel-btn:disabled { opacity: .3; cursor: default; }
.bo-carousel-btn.prev { left: -18px; }
.bo-carousel-btn.next { right: -18px; }
.bo-carousel-dots { display: flex; gap: .4rem; justify-content: center; margin-top: .75rem; }
.bo-carousel-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(86,76,60,.2); transition: background .2s, transform .2s; cursor: pointer; }
.bo-carousel-dots span.active { background: #a7b08a; transform: scale(1.3); }

/* ── AI ── */
.bo-view-toggle { position: absolute; top: .65rem; left: 50%; transform: translateX(-50%); display: flex; gap: .35rem; z-index: 10; }
.bo-ai-btn { border: 1px solid rgba(255,255,255,.22); background: rgba(255,255,255,.07); color: rgba(255,255,255,.7); border-radius: 999px; padding: .22rem .7rem; font-size: .58rem; letter-spacing: .1em; cursor: pointer; transition: all .18s; font-family: 'DM Sans', sans-serif; }
.bo-ai-btn:hover:not(:disabled) { background: rgba(255,255,255,.15); color: #fff; }
.bo-ai-btn.on { background: rgba(167,176,138,.32); border-color: rgba(167,176,138,.6); color: #fff; }
.bo-ai-btn:disabled { opacity: .45; cursor: not-allowed; }
.bo-ai-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: .85rem; color: rgba(255,255,255,.5); font-size: .65rem; letter-spacing: .16em; text-transform: uppercase; }
.bo-ai-spinner { width: 32px; height: 32px; border: 2px solid rgba(255,255,255,.1); border-top-color: rgba(167,176,138,.85); border-radius: 50%; animation: bo-spin .7s linear infinite; }
@keyframes bo-spin { to { transform: rotate(360deg); } }
.bo-ai-img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
.bo-ai-error { margin-top: .65rem; padding: .6rem .85rem; background: rgba(200,50,50,.08); border-radius: 14px; font-size: .68rem; color: #b83232; line-height: 1.5; border: 1px solid rgba(200,50,50,.14); }

@media (max-width: 1024px) { .bo-layout { grid-template-columns: 1fr; } .bo-side { position: static; } }
@media (max-width: 768px) { .bo-grid, .bo-recs, .bo-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .bo-shell { padding-inline: .85rem; } .bo-stage { height: 430px; } .bo-grid, .bo-recs, .bo-summary { grid-template-columns: 1fr; } .bo-actions { flex-direction: column; } .bo-secondary { min-width: 0; } }
`;

const TOP_PRODUCT_IDS    = [4, 51, 110, 107, 102, 101, 108, 109, 111, 112, 115, 116];
const BOTTOM_PRODUCT_IDS = [104, 100, 8, 103, 105, 106, 114, 113];
const COLORS = ["#c4956a","#a7b08a","#5a6249","#d4b896","#8b7355","#4a5e3a","#b8c4a8","#6b7a5e","#c9a96e","#7d9b76","#3d5a4a","#e8d5b7"];

// ── Fashion Silhouette SVG ──
function FashionSilhouette() {
  return (
    <svg viewBox="0 0 160 380" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "55%", height: "auto", opacity: 0.18 }}>
      {/* Head */}
      <ellipse cx="80" cy="36" rx="22" ry="26" fill="white" />
      {/* Neck */}
      <rect x="73" y="60" width="14" height="18" rx="6" fill="white" />
      {/* Shoulders */}
      <path d="M30 90 Q50 72 80 78 Q110 72 130 90 L125 150 Q110 158 80 160 Q50 158 35 150 Z" fill="white" />
      {/* Arms */}
      <path d="M35 95 Q18 130 20 175" stroke="white" strokeWidth="14" strokeLinecap="round" />
      <path d="M125 95 Q142 130 140 175" stroke="white" strokeWidth="14" strokeLinecap="round" />
      {/* Torso lower */}
      <path d="M38 148 Q50 200 46 230 L114 230 Q110 200 122 148 Q100 162 80 162 Q60 162 38 148 Z" fill="white" />
      {/* Hips */}
      <path d="M46 228 Q36 246 34 260 L126 260 Q124 246 114 228 Z" fill="white" />
      {/* Legs */}
      <rect x="40" y="258" width="32" height="110" rx="14" fill="white" />
      <rect x="88" y="258" width="32" height="110" rx="14" fill="white" />
      {/* Feet */}
      <ellipse cx="56" cy="372" rx="20" ry="8" fill="white" opacity="0.6" />
      <ellipse cx="104" cy="372" rx="20" ry="8" fill="white" opacity="0.6" />
    </svg>
  );
}

// ── Stage (Placeholder + AI) ──
function SilhouettePreview({ selectedTop, selectedBottom, aiImage, aiLoading, onGenerateAI }) {
  return (
    <div className="bo-stage bo-soft" style={{ position: "relative", background: "linear-gradient(180deg,#3d3c39 0%,#2e2d2b 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      {/* AI button */}
      <div className="bo-view-toggle">
        <button
          className="bo-ai-btn on"
          type="button"
          onClick={onGenerateAI}
          disabled={aiLoading}
        >
          {aiLoading ? "Generating…" : "✦ Generate AI Look"}
        </button>
      </div>

      {/* Content */}
      {aiLoading ? (
        <div className="bo-ai-loading">
          <div className="bo-ai-spinner" />
          <span>Creating your AI look…</span>
        </div>
      ) : aiImage ? (
        <img src={aiImage} alt="AI generated outfit" className="bo-ai-img" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem" }}>
          <FashionSilhouette />
          <div style={{ fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.22)", textAlign: "center" }}>
            Select items &amp; generate AI look
          </div>
        </div>
      )}

      {/* Selected items strip */}
      {(selectedTop || selectedBottom) && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,.75))", padding:".6rem .8rem .7rem", display:"flex", justifyContent:"space-between", gap:".5rem", zIndex:10 }}>
          <div style={{ flex:1 }}>
            {selectedTop && <>
              <div style={{ fontSize:".52rem", letterSpacing:".14em", textTransform:"uppercase", color:"rgba(255,255,255,.4)" }}>Top</div>
              <div style={{ fontSize:".68rem", color:"#fff", fontWeight:500, lineHeight:1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{selectedTop.name}</div>
              <div style={{ fontSize:".6rem", color:"rgba(255,255,255,.5)" }}>{selectedTop.price}</div>
            </>}
          </div>
          <div style={{ width:"1px", background:"rgba(255,255,255,.15)", flexShrink:0 }} />
          <div style={{ flex:1, textAlign:"right" }}>
            {selectedBottom && <>
              <div style={{ fontSize:".52rem", letterSpacing:".14em", textTransform:"uppercase", color:"rgba(255,255,255,.4)" }}>Bottom</div>
              <div style={{ fontSize:".68rem", color:"#fff", fontWeight:500, lineHeight:1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{selectedBottom.name}</div>
              <div style={{ fontSize:".6rem", color:"rgba(255,255,255,.5)" }}>{selectedBottom.price}</div>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Product Card ──
function ProductCard({ item, selected, onSelect, onHeart, isHearted }) {
  return (
    <article className={`bo-product bo-soft${selected ? " on" : ""}`}>
      <div className="bo-thumb">
        {item.img
          ? <img src={item.img} alt={item.name} />
          : <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg, ${item.color || "#a7b08a"}, ${item.color || "#6b7a5e"})`, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"rgba(255,255,255,.3)" }}>{item.brand}</span></div>
        }
        <button className="bo-heart" type="button" onClick={onHeart} style={{ color: isHearted ? "#df5e59" : "rgba(223,94,89,.3)" }}>
          &#10084;
        </button>
      </div>
      <div className="bo-model-badge">{item.img3d ? "2D Try-On Ready" : "3D Fit Ready"}</div>
      <div className="bo-brand">{item.brand}</div>
      <div className="bo-name">{item.name}</div>
      <div className="bo-price">{item.price}</div>
      <button className={`bo-btn${selected ? " dark" : ""}`} type="button" onClick={() => onSelect(item)}>
        {selected ? "Selected ✓" : "Select"}
      </button>
    </article>
  );
}

function MiniFavorite({ item }) {
  return (
    <div className="bo-mini">
      {item.img
        ? <img src={item.img} alt={item.name} />
        : <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg, ${item.color || "#a7b08a"}, ${item.color || "#6b7a5e"})` }} />
      }
      <div className="bo-mini-name">{item.name}</div>
      <div className="bo-mini-price">{item.price}</div>
    </div>
  );
}

function RecCard({ item, onHeart, isHearted }) {
  return (
    <article className="bo-rec">
      <div className="bo-thumb">
        {item.img
          ? <img src={item.img} alt={item.name} />
          : <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg, ${item.color || "#a7b08a"}, ${item.color || "#6b7a5e"})` }} />
        }
        <button className="bo-heart" type="button" onClick={onHeart} style={{ color: isHearted ? "#df5e59" : "rgba(223,94,89,.3)" }}>
          &#10084;
        </button>
      </div>
      <div className="bo-name">{item.name}</div>
      <div className="bo-price">{item.price}</div>
    </article>
  );
}

function ProductCarousel({ products, selectedId, onSelect, heartIds, onHeart }) {
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const total   = products.length;
  const maxIdx  = Math.max(0, total - visible);
  const shown   = products.slice(idx, idx + visible);

  return (
    <div className="bo-carousel" style={{ paddingInline: "20px" }}>
      <button className="bo-carousel-btn prev" type="button" disabled={idx === 0}     onClick={() => setIdx(i => Math.max(0, i-1))}>&#8249;</button>
      <div className="bo-carousel-track">
        {shown.map(item => (
          <ProductCard
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            onSelect={() => onSelect(item)}
            onHeart={e => onHeart(item, e)}
            isHearted={heartIds?.has(item.id)}
          />
        ))}
        {shown.length < visible && Array.from({ length: visible - shown.length }).map((_, i) => <div key={`pad-${i}`} />)}
      </div>
      <button className="bo-carousel-btn next" type="button" disabled={idx >= maxIdx} onClick={() => setIdx(i => Math.min(maxIdx, i+1))}>&#8250;</button>
      {total > visible && (
        <div className="bo-carousel-dots">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <span key={i} className={i === idx ? "active" : ""} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

const parsePrice = (priceStr) => {
  if (!priceStr || typeof priceStr !== "string") return 0;
  return parseFloat(priceStr.replace(/[^0-9.-]+/g, "")) || 0;
};

// ── Map backend product to component format ──
const mapApiProduct = (p, i) => ({
  id:     p._id,
  name:   p.name,
  price:  `LE ${Number(p.price).toLocaleString()}`,
  img:    p.images?.[0] || null,
  brand:  p.seller?.brandName || "",
  sizes:  p.sizes?.length ? p.sizes : ["S","M","L"],
  color:  COLORS[i % COLORS.length],
  colors: p.colors || [],
  imgs:   p.images || [],
  img3d:  null,
});

// ── Main Component ──
export default function BuildOutfit({ cart = [], setCart, wish = [], setWish }) {
  const [selectedTop,    setSelectedTop]    = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [favorites,      setFavorites]      = useState([]);
  const [body, setBody] = useState({ height:170, chest:88, waist:70, hips:96, weight:70 });

  // Heart toggle (persisted)
  const [heartIds, setHeartIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("bo-hearts") || "[]")); }
    catch { return new Set(); }
  });

  // AI state
  const [aiImage,   setAiImage]   = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError,   setAiError]   = useState(null);

  // API products
  const [apiTops,    setApiTops]    = useState([]);
  const [apiBottoms, setApiBottoms] = useState([]);
  const [apiRecs,    setApiRecs]    = useState([]);

  // Static fallbacks
  const adultProducts = useMemo(() =>
    PRODUCTS.filter(p => {
      const brand = String(p.brand || "").toLowerCase();
      const name  = String(p.name  || "").toLowerCase();
      const desc  = String(p.desc  || "").toLowerCase();
      const isKid = brand === "ninos" || name.includes("kids") || desc.includes("kids") ||
        p.category === "boys" || p.category === "girls" ||
        (p.sizes || []).some(s => /\d+y/i.test(s));
      return !isKid && p.img;
    }), []
  );
  const fallbackTops    = useMemo(() => TOP_PRODUCT_IDS.map((id,i) => { const p = adultProducts.find(p => p.id === id); return p ? { ...p, color: COLORS[i % COLORS.length] } : null; }).filter(Boolean), [adultProducts]);
  const fallbackBottoms = useMemo(() => BOTTOM_PRODUCT_IDS.map((id,i) => { const p = adultProducts.find(p => p.id === id); return p ? { ...p, color: COLORS[(i+6) % COLORS.length] } : null; }).filter(Boolean), [adultProducts]);

  // Fetch from API
  useEffect(() => {
    Promise.all([
      fetch(`${API}/products?type=tops&limit=12`).then(r => r.json()).catch(() => null),
      fetch(`${API}/products?type=bottoms&limit=12`).then(r => r.json()).catch(() => null),
      fetch(`${API}/products?limit=9`).then(r => r.json()).catch(() => null),
    ]).then(([topsData, bottomsData, recsData]) => {
      const tops    = (topsData?.data?.products    || []).map((p,i) => mapApiProduct(p, i));
      const bottoms = (bottomsData?.data?.products || []).map((p,i) => mapApiProduct(p, i+6));
      const topIds  = new Set(tops.map(p => p.id));
      const botIds  = new Set(bottoms.map(p => p.id));
      const recs    = (recsData?.data?.products || [])
        .filter(p => !topIds.has(p._id) && !botIds.has(p._id))
        .slice(0, 3)
        .map((p,i) => mapApiProduct(p, i+3));

      if (tops.length)    setApiTops(tops);
      if (bottoms.length) setApiBottoms(bottoms);
      if (recs.length)    setApiRecs(recs);
    });
  }, []);

  const topProducts    = apiTops.length    ? apiTops    : fallbackTops;
  const bottomProducts = apiBottoms.length ? apiBottoms : fallbackBottoms;
  const recommendedProducts = apiRecs.length
    ? apiRecs
    : adultProducts.filter(p => p.id !== selectedTop?.id && p.id !== selectedBottom?.id && !TOP_PRODUCT_IDS.includes(p.id) && !BOTTOM_PRODUCT_IDS.includes(p.id)).slice(0, 3);

  const favoritesToShow = favorites.length ? favorites.slice(-4) : [...topProducts, ...bottomProducts].slice(0, 4);
  const selectedCount   = Number(Boolean(selectedTop)) + Number(Boolean(selectedBottom));
  const total           = parsePrice(selectedTop?.price) + parsePrice(selectedBottom?.price);

  const selectProduct = (item, type) => {
    if (type === "top") setSelectedTop(item); else setSelectedBottom(item);
    setAiImage(null);
  };

  const toggleHeart = (item, e) => {
    e.stopPropagation();
    setHeartIds(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
        setFavorites(f => f.filter(x => x.id !== item.id));
      } else {
        next.add(item.id);
        setFavorites(f => f.some(x => x.id === item.id) ? f : [...f, item]);
      }
      localStorage.setItem("bo-hearts", JSON.stringify([...next]));
      return next;
    });
  };

  const generateAI = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch(`${API}/ai/generate-outfit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedTop:    selectedTop?.name,
          selectedBottom: selectedBottom?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiImage(data.imageUrl);
      } else {
        setAiError(data.message || "AI generation failed.");
      }
    } catch {
      setAiError("AI generation unavailable. Make sure the backend has OPENAI_API_KEY configured.");
    } finally {
      setAiLoading(false);
    }
  };

  const addOutfit = () => {
    if (!selectedTop || !selectedBottom || !setCart) return;
    setCart(prev => {
      let c = [...prev];
      [selectedTop, selectedBottom].forEach(item => {
        const size = item.sizes?.[0] || "M";
        const ex = c.find(x => x.id === item.id && x.size === size);
        if (ex) c = c.map(x => x.id === item.id && x.size === size ? { ...x, qty: x.qty + 1 } : x);
        else    c = [...c, { id: item.id, size, qty: 1 }];
      });
      return c;
    });
  };

  return (
    <div className="bo-page" style={{ minHeight: "100vh" }}>
      <style>{SHARED_CSS}</style>
      <style>{PAGE_CSS}</style>
      <SHNav cart={cart} wish={wish} />

      <div className="bo-shell">
        <header className="bo-hero">
          <h1 className="bo-title">Build Your Perfect Outfit</h1>
          <div className="bo-sub">Mix &amp; Match looks from local brands</div>
        </header>

        <div className="bo-layout">
          {/* ── LEFT SIDE ── */}
          <aside className="bo-side">
            <SilhouettePreview
              selectedTop={selectedTop}
              selectedBottom={selectedBottom}
              aiImage={aiImage}
              aiLoading={aiLoading}
              onGenerateAI={generateAI}
            />

            {/* Body Measurements */}
            <section className="bo-data bo-soft" style={{ marginTop:"1rem", padding:"1.15rem" }}>
              <div className="bo-card-title" style={{ fontSize:".7rem", letterSpacing:".14em", textTransform:"uppercase", color:"#8a8173", marginBottom:"1rem", fontWeight:600 }}>
                Body Measurements
              </div>
              {[
                ["height","Height","cm",140,195],
                ["weight","Weight","kg",45,130],
                ["chest","Chest","cm",75,125],
                ["waist","Waist","cm",55,105],
                ["hips","Hips","cm",80,130],
              ].map(([key,label,unit,min,max]) => (
                <div key={key} style={{ marginBottom:".8rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:".72rem", marginBottom:".3rem" }}>
                    <span style={{ color:"#8a8173" }}>{label}</span>
                    <span style={{ fontWeight:600, color:"#28231d" }}>{body[key]} {unit}</span>
                  </div>
                  <input type="range" min={min} max={max} value={body[key]}
                    onChange={e => setBody(p => ({ ...p, [key]: Number(e.target.value) }))}
                    style={{ width:"100%", accentColor:"#a7b08a", height:4, cursor:"pointer" }}
                  />
                </div>
              ))}
              <div style={{ fontSize:".62rem", color:"#b9b1a3", marginTop:".5rem", lineHeight:1.5 }}>
                Adjust sliders to see how clothes fit your body type
              </div>
            </section>

            {/* AI error */}
            {aiError && <div className="bo-ai-error">{aiError}</div>}

            {/* Favourites */}
            <section className="bo-favorites bo-soft">
              <div className="bo-fav-title">
                <span>Your Favorite</span>
                <span style={{ color:"#df5e59", fontSize:".9rem" }}>&#10084;</span>
              </div>
              <div className="bo-mini-list">
                {favoritesToShow.map(item => <MiniFavorite key={item.id} item={item} />)}
              </div>
            </section>
          </aside>

          {/* ── RIGHT MAIN ── */}
          <main className="bo-main">
            <section className="bo-step">
              <div className="bo-kicker">
                <strong>1. Choose Your Items</strong>
                <div>1. Choose Top</div>
              </div>
              <div className="bo-divider" />
              <ProductCarousel
                products={topProducts}
                selectedId={selectedTop?.id}
                onSelect={item => selectProduct(item, "top")}
                heartIds={heartIds}
                onHeart={toggleHeart}
              />
            </section>

            <section className="bo-step">
              <div className="bo-kicker">2. Choose Bottom</div>
              <div className="bo-divider" />
              <ProductCarousel
                products={bottomProducts}
                selectedId={selectedBottom?.id}
                onSelect={item => selectProduct(item, "bottom")}
                heartIds={heartIds}
                onHeart={toggleHeart}
              />
            </section>

            <section className="bo-step">
              <div className="bo-divider"><span>Recommended For You</span></div>
              <div className="bo-recs">
                {recommendedProducts.map(item => (
                  <RecCard
                    key={item.id}
                    item={item}
                    onHeart={e => toggleHeart(item, e)}
                    isHearted={heartIds.has(item.id)}
                  />
                ))}
              </div>
            </section>

            <div className="bo-summary">
              <div className="bo-pill"><small>Selected Pieces</small><strong>{selectedCount}/2 chosen</strong></div>
              <div className="bo-pill"><small>Preview</small><strong>{selectedTop && selectedBottom ? "Full look ready" : "Select top + bottom"}</strong></div>
              <div className="bo-pill"><small>Estimated Total</small><strong>{total ? `LE ${total.toLocaleString()}` : "Choose items"}</strong></div>
            </div>

            <div className="bo-actions">
              <button className="bo-primary" type="button" onClick={addOutfit} disabled={!selectedTop || !selectedBottom}>
                Add Outfit to Cart
              </button>
              <button
                className="bo-secondary"
                type="button"
                onClick={generateAI}
                disabled={aiLoading || (!selectedTop && !selectedBottom)}
              >
                {aiLoading ? "Generating AI Look…" : (selectedTop || selectedBottom) ? "✦ Generate AI Look" : "Pick Items First"}
              </button>
            </div>
          </main>
        </div>
      </div>

      <SHFooter />
    </div>
  );
}
