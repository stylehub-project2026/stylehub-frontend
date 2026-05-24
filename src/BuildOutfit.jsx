import { useMemo, useState, useEffect, useRef, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PRODUCTS, SHARED_CSS, SHFooter, SHNav } from "./shared";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const API = "https://stylehub-backend-tau.vercel.app/api";

const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `${API.replace("/api", "")}${img}`;
};

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
.bo-heart { position: absolute; left: .6rem; bottom: .6rem; width: 28px; height: 28px; border: none; border-radius: 50%; background: rgba(255,255,255,.96); color: #df5e59; font-size: .88rem; box-shadow: 0 8px 18px rgba(0,0,0,.12); }
.bo-brand { font-size: .63rem; letter-spacing: .18em; text-transform: uppercase; color: #8a8173; margin-bottom: .25rem; }
.bo-name { min-height: 2.45em; font-size: .82rem; font-weight: 600; color: #27211b; }
.bo-price { margin: .18rem 0 .7rem; color: #6f695e; font-size: .74rem; }
.bo-model-badge { display: inline-flex; margin-bottom: .55rem; padding: .18rem .45rem; border-radius: 999px; background: rgba(167, 176, 138, .18); color: #66704d; font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; }
.bo-btn { min-width: 88px; border: none; border-radius: 8px; padding: .48rem .85rem; font-size: .69rem; background: #a7b08a; color: #fff; }
.bo-btn.dark { background: #25211b; }
.bo-recs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.bo-rec { text-align: center; }
.bo-rec .bo-thumb { aspect-ratio: .84; margin-bottom: .5rem; }
.bo-rec .bo-name { min-height: auto; }
.bo-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.bo-pill { padding: .95rem 1rem; border-radius: 18px; background: rgba(255,255,255,.76); border: 1px solid rgba(86, 76, 60, .12); }
.bo-pill small { display: block; margin-bottom: .32rem; color: #8c8479; font-size: .57rem; letter-spacing: .18em; text-transform: uppercase; }
.bo-pill strong { color: #28231d; font-size: .88rem; }
.bo-actions { display: flex; gap: .8rem; margin-top: 1rem; }
.bo-primary, .bo-secondary { border: none; border-radius: 12px; padding: .95rem 1rem; text-transform: uppercase; letter-spacing: .1em; font-size: .73rem; }
.bo-primary { flex: 1; background: #25211b; color: #fff; }
.bo-secondary { min-width: 240px; background: rgba(167, 176, 138, .16); color: #5a6249; }
.bo-carousel { position: relative; }
.bo-carousel-track { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; transition: none; }
.bo-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(86,76,60,.18); background: rgba(255,255,255,.92); box-shadow: 0 6px 18px rgba(37,31,23,.10); color: #28231d; font-size: 1rem; cursor: pointer; z-index: 5; display: flex; align-items: center; justify-content: center; transition: background .16s, box-shadow .16s; }
.bo-carousel-btn:hover { background: #fff; box-shadow: 0 8px 22px rgba(37,31,23,.15); }
.bo-carousel-btn:disabled { opacity: .3; cursor: default; }
.bo-carousel-btn.prev { left: -18px; }
.bo-carousel-btn.next { right: -18px; }
.bo-carousel-dots { display: flex; gap: .4rem; justify-content: center; margin-top: .75rem; }
.bo-carousel-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(86,76,60,.2); transition: background .2s, transform .2s; }
.bo-carousel-dots span.active { background: #a7b08a; transform: scale(1.3); }
@media (max-width: 1024px) { .bo-layout { grid-template-columns: 1fr; } .bo-side { position: static; } }
@media (max-width: 768px) { .bo-grid, .bo-recs, .bo-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .bo-shell { padding-inline: .85rem; } .bo-stage { height: 430px; } .bo-grid, .bo-recs, .bo-summary { grid-template-columns: 1fr; } .bo-actions { flex-direction: column; } .bo-secondary { min-width: 0; } }
`;

const TOP_PRODUCT_IDS = [4, 51, 110, 107, 102, 101, 108, 109, 111, 112, 115, 116];
const BOTTOM_PRODUCT_IDS = [104, 100, 8, 103, 105, 106, 114, 113];

// ── Silhouette Preview ──
// ── 3D Mannequin ──
function MannequinBody({ top, bottom, body }) {
  const topColor = top?.color || "#a7b08a";
  const bottomColor = bottom?.color || "#6b7a5e";

  const h = body?.height || 170;
  const w = body?.weight || 70;
  const ch = body?.chest || 88;
  const wa = body?.waist || 70;
  const hi = body?.hips || 96;

  const heightScale = 0.85 + ((h - 140) / 55) * 0.30;
  const chestScale = 0.85 + ((ch - 75) / 50) * 0.30;
  const waistScale = 0.75 + ((wa - 55) / 50) * 0.35;
  const hipsScale = 0.85 + ((hi - 80) / 50) * 0.30;
  const weightScale = 0.85 + ((w - 45) / 85) * 0.30;

  const bodyW = Math.max(0.7, Math.min(1.4, (chestScale + weightScale) / 2));

  return (
    <group position={[0, -1.2 * heightScale, 0]} scale={[1, heightScale, 1]}>
      {/* Head */}
      <mesh position={[0, 3.15, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#d4b896" roughness={0.6} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 2.88, 0]}>
        <cylinderGeometry args={[0.09, 0.10, 0.22, 16]} />
        <meshStandardMaterial color="#d4b896" roughness={0.6} />
      </mesh>
      {/* Torso (top garment) */}
      <mesh position={[0, 2.35, 0]} scale={[bodyW * chestScale, 1, 0.52]}>
        <capsuleGeometry args={[0.38, 0.65, 8, 32]} />
        <meshStandardMaterial color={topColor} roughness={0.55} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.62 * bodyW, 2.28, 0]} rotation={[0, 0, 0.18]} scale={[0.13, 0.7, 0.13]}>
        <capsuleGeometry args={[0.3, 1.0, 8, 16]} />
        <meshStandardMaterial color={topColor} roughness={0.6} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.62 * bodyW, 2.28, 0]} rotation={[0, 0, -0.18]} scale={[0.13, 0.7, 0.13]}>
        <capsuleGeometry args={[0.3, 1.0, 8, 16]} />
        <meshStandardMaterial color={topColor} roughness={0.6} />
      </mesh>
      {/* Hips/waist (bottom garment) */}
      <mesh position={[0, 1.55, 0]} scale={[bodyW * hipsScale, 1, 0.48]}>
        <capsuleGeometry args={[0.36, 0.22, 8, 32]} />
        <meshStandardMaterial color={bottomColor} roughness={0.55} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.22 * bodyW, 0.88, 0]} scale={[0.19 * hipsScale, 1, 0.19]}>
        <capsuleGeometry args={[0.32, 1.0, 8, 32]} />
        <meshStandardMaterial color={bottomColor} roughness={0.55} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.22 * bodyW, 0.88, 0]} scale={[0.19 * hipsScale, 1, 0.19]}>
        <capsuleGeometry args={[0.32, 1.0, 8, 32]} />
        <meshStandardMaterial color={bottomColor} roughness={0.55} />
      </mesh>
      {/* Left foot */}
      <mesh position={[-0.22 * bodyW, 0.18, 0.08]} scale={[0.22, 0.08, 0.42]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6b6560" roughness={0.8} />
      </mesh>
      {/* Right foot */}
      <mesh position={[0.22 * bodyW, 0.18, 0.08]} scale={[0.22, 0.08, 0.42]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6b6560" roughness={0.8} />
      </mesh>
    </group>
  );
}

function SilhouettePreview({ selectedTop, selectedBottom, body }) {
  const topItem = selectedTop ? { color: selectedTop.color || "#a7b08a" } : null;
  const bottomItem = selectedBottom ? { color: selectedBottom.color || "#5a6249" } : null;

  return (
    <div className="bo-stage bo-soft" style={{ position: "relative", background: "linear-gradient(180deg,#3d3c39 0%,#2e2d2b 100%)" }}>
      <div style={{ position: "absolute", top: "1rem", left: 0, right: 0, textAlign: "center", fontSize: ".55rem", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", zIndex: 10, pointerEvents: "none" }}>
        3D Outfit Preview · Drag to rotate
      </div>
      <Canvas camera={{ position: [0, 1.6, 5.0], fov: 40 }} style={{ height: "100%", width: "100%" }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <Suspense fallback={null}>
          <MannequinBody top={topItem} bottom={bottomItem} body={body} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={3.5} maxDistance={7} />
      </Canvas>
      {(selectedTop || selectedBottom) && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,.75))", padding: ".6rem .8rem .7rem", display: "flex", justifyContent: "space-between", gap: ".5rem", zIndex: 10 }}>
          <div style={{ flex: 1 }}>
            {selectedTop && <>
              <div style={{ fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>Top</div>
              <div style={{ fontSize: ".68rem", color: "#fff", fontWeight: 500, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedTop.name}</div>
              <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.5)" }}>{selectedTop.price}</div>
            </>}
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,.15)", flexShrink: 0 }} />
          <div style={{ flex: 1, textAlign: "right" }}>
            {selectedBottom && <>
              <div style={{ fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>Bottom</div>
              <div style={{ fontSize: ".68rem", color: "#fff", fontWeight: 500, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedBottom.name}</div>
              <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.5)" }}>{selectedBottom.price}</div>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ item, selected, onSelect }) {
  return (
    <article className={`bo-product bo-soft${selected ? " on" : ""}`}>
      <div className="bo-thumb">
        <img src={item.img} alt={item.name} />
        <button className="bo-heart" type="button">&#10084;</button>
      </div>
      <div className="bo-model-badge">{item.img3d ? "2D Try-On Ready" : "3D Fit Ready"}</div>
      <div className="bo-brand">{item.brand}</div>
      <div className="bo-name">{item.name}</div>
      <div className="bo-price">{item.price}</div>
      <button className={`bo-btn${selected ? " dark" : ""}`} type="button" onClick={() => onSelect(item)}>
        {selected ? "Selected" : "Select"}
      </button>
    </article>
  );
}

function MiniFavorite({ item }) {
  return (
    <div className="bo-mini">
      <img src={item.img} alt={item.name} />
      <div className="bo-mini-name">{item.name}</div>
      <div className="bo-mini-price">{item.price}</div>
    </div>
  );
}

function RecCard({ item }) {
  return (
    <article className="bo-rec">
      <div className="bo-thumb">
        <img src={item.img} alt={item.name} />
        <button className="bo-heart" type="button">&#10084;</button>
      </div>
      <div className="bo-name">{item.name}</div>
      <div className="bo-price">{item.price}</div>
    </article>
  );
}

function ProductCarousel({ products, selectedId, onSelect }) {
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const total = products.length;
  const maxIdx = Math.max(0, total - visible);
  const shown = products.slice(idx, idx + visible);

  return (
    <div className="bo-carousel" style={{ paddingInline: "20px" }}>
      <button className="bo-carousel-btn prev" type="button" disabled={idx === 0}
        onClick={() => setIdx(i => Math.max(0, i - 1))}>&#8249;</button>

      <div className="bo-carousel-track">
        {shown.map(item => (
          <ProductCard key={item.id} item={item} selected={selectedId === item.id} onSelect={() => onSelect(item)} />
        ))}
        {/* pad empty slots so grid stays 3-col */}
        {shown.length < visible && Array.from({ length: visible - shown.length }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
      </div>

      <button className="bo-carousel-btn next" type="button" disabled={idx >= maxIdx}
        onClick={() => setIdx(i => Math.min(maxIdx, i + 1))}>&#8250;</button>

      {total > visible && (
        <div className="bo-carousel-dots">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <span key={i} className={i === idx ? "active" : ""} onClick={() => setIdx(i)} style={{ cursor: "pointer" }} />
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

export default function BuildOutfit({ cart = [], setCart, wish = [] }) {
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [body, setBody] = useState({ height: 170, chest: 88, waist: 70, hips: 96, weight: 70 });

  const adultProducts = useMemo(() =>
    PRODUCTS.filter(p => {
      const brand = String(p.brand || "").toLowerCase();
      const name = String(p.name || "").toLowerCase();
      const desc = String(p.desc || "").toLowerCase();
      const isKid = brand === "ninos" || name.includes("kids") || desc.includes("kids") ||
        p.category === "boys" || p.category === "girls" || (p.sizes || []).some(s => /\d+y/i.test(s));
      return !isKid && p.img;
    }), []
  );

  const COLORS = ["#c4956a", "#a7b08a", "#5a6249", "#d4b896", "#8b7355", "#4a5e3a", "#b8c4a8", "#6b7a5e", "#c9a96e", "#7d9b76", "#3d5a4a", "#e8d5b7"];
  const topProducts = useMemo(() => TOP_PRODUCT_IDS.map((id, i) => { const p = adultProducts.find(p => p.id === id); return p ? { ...p, color: COLORS[i % COLORS.length] } : null }).filter(Boolean), [adultProducts]);
  const bottomProducts = useMemo(() => BOTTOM_PRODUCT_IDS.map((id, i) => { const p = adultProducts.find(p => p.id === id); return p ? { ...p, color: COLORS[(i + 6) % COLORS.length] } : null }).filter(Boolean), [adultProducts]);
  const recommendedProducts = useMemo(() =>
    adultProducts.filter(p => p.id !== selectedTop?.id && p.id !== selectedBottom?.id && !TOP_PRODUCT_IDS.includes(p.id) && !BOTTOM_PRODUCT_IDS.includes(p.id)).slice(0, 3),
    [adultProducts, selectedBottom?.id, selectedTop?.id]
  );

  const favoritesToShow = favorites.length ? favorites.slice(-4) : [...topProducts, ...bottomProducts].slice(0, 4);
  const selectedCount = Number(Boolean(selectedTop)) + Number(Boolean(selectedBottom));
  const total = parsePrice(selectedTop?.price) + parsePrice(selectedBottom?.price);

  const selectProduct = (item, type) => {
    if (type === "top") setSelectedTop(item); else setSelectedBottom(item);
    setFavorites(prev => prev.some(s => s.id === item.id) ? prev : [...prev, item]);
  };

  const addOutfit = () => {
    if (!selectedTop || !selectedBottom || !setCart) return;
    setCart(prev => {
      let c = [...prev];
      [selectedTop, selectedBottom].forEach(item => {
        const size = item.sizes?.[0] || "M";
        const ex = c.find(x => x.id === item.id && x.size === size);
        if (ex) c = c.map(x => x.id === item.id && x.size === size ? { ...x, qty: x.qty + 1 } : x);
        else c = [...c, { id: item.id, size, qty: 1 }];
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
          <div className="bo-sub">Mix & Match looks from local brands</div>
        </header>

        <div className="bo-layout">
          <aside className="bo-side">
            <SilhouettePreview selectedTop={selectedTop} selectedBottom={selectedBottom} body={body} />

            {/* BODY MEASUREMENTS */}
            <section className="bo-data bo-soft" style={{ marginTop: "1rem", padding: "1.15rem" }}>
              <div className="bo-card-title" style={{ fontSize: ".7rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8173", marginBottom: "1rem", fontWeight: 600 }}>Body Measurements</div>
              {[
                ["height", "Height", "cm", 140, 195],
                ["weight", "Weight", "kg", 45, 130],
                ["chest", "Chest", "cm", 75, 125],
                ["waist", "Waist", "cm", 55, 105],
                ["hips", "Hips", "cm", 80, 130],
              ].map(([key, label, unit, min, max]) => (
                <div key={key} style={{ marginBottom: ".8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".72rem", marginBottom: ".3rem" }}>
                    <span style={{ color: "#8a8173" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "#28231d" }}>{body[key]} {unit}</span>
                  </div>
                  <input type="range" min={min} max={max} value={body[key]}
                    onChange={e => setBody(p => ({ ...p, [key]: Number(e.target.value) }))}
                    style={{ width: "100%", accentColor: "#a7b08a", height: 4, cursor: "pointer" }} />
                </div>
              ))}
              <div style={{ fontSize: ".62rem", color: "#b9b1a3", marginTop: ".5rem", lineHeight: 1.5 }}>
                Adjust sliders to see how clothes fit your body type
              </div>
            </section>

            {/* YOUR FAVOURITE */}
            <section className="bo-favorites bo-soft">
              <div className="bo-fav-title">
                <span>Your Favorite</span>
                <span style={{ color: "#df5e59", fontSize: ".9rem" }}>&#10084;</span>
              </div>
              <div className="bo-mini-list">
                {favoritesToShow.map(item => (<MiniFavorite key={item.id} item={item} />))}
              </div>
            </section>
          </aside>

          <main className="bo-main">
            <section className="bo-step">
              <div className="bo-kicker"><strong>1. Choose Your Items</strong><div>1. Choose Top</div></div>
              <div className="bo-divider" />
              <ProductCarousel products={topProducts} selectedId={selectedTop?.id} onSelect={item => selectProduct(item, "top")} />
            </section>

            <section className="bo-step">
              <div className="bo-kicker">2. Choose Bottom</div>
              <div className="bo-divider" />
              <ProductCarousel products={bottomProducts} selectedId={selectedBottom?.id} onSelect={item => selectProduct(item, "bottom")} />
            </section>

            <section className="bo-step">
              <div className="bo-divider"><span>Recommended For You</span></div>
              <div className="bo-recs">
                {recommendedProducts.map(item => (<RecCard key={item.id} item={item} />))}
              </div>
            </section>

            <div className="bo-summary">
              <div className="bo-pill"><small>Selected Pieces</small><strong>{selectedCount}/2 chosen</strong></div>
              <div className="bo-pill"><small>Preview</small><strong>{selectedTop && selectedBottom ? "Full look ready" : "Select top + bottom"}</strong></div>
              <div className="bo-pill"><small>Estimated Total</small><strong>{total ? `LE ${total.toLocaleString()}` : "Choose items"}</strong></div>
            </div>

            <div className="bo-actions">
              <button className="bo-primary" type="button" onClick={addOutfit} disabled={!selectedTop || !selectedBottom}>Add Outfit to Cart</button>
              <button className="bo-secondary" type="button">
                {selectedTop?.name || selectedBottom?.name ? "Fit Adjusted to Your Body" : "Pick Items First"}
              </button>
            </div>
          </main>
        </div>
      </div>
      <SHFooter />
    </div>
  );
}