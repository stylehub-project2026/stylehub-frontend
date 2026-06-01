import { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PRODUCTS, SHARED_CSS, SHFooter, SHNav } from "./shared";

const API = "https://stylehub-backend-tau.vercel.app/api";

const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `${API.replace("/api", "")}${img}`;
};

// ── Size calculation — based on your brand size chart ────────────────────────
// Chart: XS: chest 80-84, waist 60-64, hips 86-90
//         S:  chest 84-88, waist 64-68, hips 90-94
//         M:  chest 88-92, waist 68-72, hips 94-98
//         L:  chest 92-96, waist 72-76, hips 98-102
//        XL:  chest 96-100,waist 76-80, hips 102-106
//
// Top size → chest (cm)
function calcTopSize(chest) {
  if (chest < 84) return "XS";
  if (chest < 88) return "S";
  if (chest < 92) return "M";
  if (chest < 96) return "L";
  return "XL";
}
// Bottom size → hips (cm)
const SIZES = ["XS", "S", "M", "L", "XL"];

function calcBottomSize(waist, hips) {
  const fromWaist = waist < 64 ? "XS" : waist < 68 ? "S" : waist < 72 ? "M" : waist < 76 ? "L" : "XL";
  const fromHips = hips < 90 ? "XS" : hips < 94 ? "S" : hips < 98 ? "M" : hips < 102 ? "L" : "XL";
  return SIZES[Math.max(SIZES.indexOf(fromWaist), SIZES.indexOf(fromHips))];
}

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
.bo-size-result { margin-top: .85rem; padding: .75rem 1rem; border-radius: 16px; background: linear-gradient(135deg, rgba(167,176,138,.22) 0%, rgba(167,176,138,.08) 100%); border: 1px solid rgba(123,132,91,.22); display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.bo-size-result-label { font-size: .62rem; letter-spacing: .14em; text-transform: uppercase; color: #8a8173; }
.bo-size-badges { display: flex; gap: .45rem; }
.bo-size-badge { display: flex; flex-direction: column; align-items: center; gap: .12rem; }
.bo-size-badge span:first-child { font-size: .55rem; letter-spacing: .1em; text-transform: uppercase; color: #a7af8a; }
.bo-size-badge span:last-child { font-size: 1rem; font-weight: 700; color: #3a4228; font-family: 'Cormorant Garamond', serif; letter-spacing: .04em; }
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
.bo-heart { position: absolute; left: .6rem; bottom: .6rem; width: 28px; height: 28px; border: none; border-radius: 50%; background: rgba(255,255,255,.96); color: #df5e59; font-size: .88rem; box-shadow: 0 8px 18px rgba(0,0,0,.12); cursor: pointer; transition: transform .15s ease, background .15s ease; }
.bo-heart:hover { transform: scale(1.15); background: #fff4f4; }
.bo-heart.wishlisted { background: #df5e59; color: #fff; }
.bo-brand { font-size: .63rem; letter-spacing: .18em; text-transform: uppercase; color: #8a8173; margin-bottom: .25rem; }
.bo-name { min-height: 2.45em; font-size: .82rem; font-weight: 600; color: #27211b; }
.bo-price { margin: .18rem 0 .7rem; color: #6f695e; font-size: .74rem; }
.bo-model-badge { display: inline-flex; margin-bottom: .55rem; padding: .18rem .45rem; border-radius: 999px; background: rgba(167, 176, 138, .18); color: #66704d; font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; }
.bo-btn { min-width: 88px; border: none; border-radius: 8px; padding: .48rem .85rem; font-size: .69rem; background: #a7b08a; color: #fff; cursor: pointer; }
.bo-btn.dark { background: #25211b; }
.bo-recs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.bo-rec { text-align: center; padding: .9rem; border-radius: 25px; background: rgba(255,255,255,.76); border: 1px solid rgba(86, 76, 60, .12); box-shadow: 0 12px 28px rgba(37, 31, 23, .05); transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
.bo-rec:hover { transform: translateY(-2px); box-shadow: 0 18px 32px rgba(37, 31, 23, .08); }
.bo-rec.on { border-color: rgba(123, 132, 91, .7); box-shadow: 0 18px 34px rgba(123, 132, 91, .18); }
.bo-rec .bo-thumb { aspect-ratio: .84; margin-bottom: .5rem; }
.bo-rec .bo-name { min-height: auto; }
.bo-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.bo-pill { padding: .95rem 1rem; border-radius: 18px; background: rgba(255,255,255,.76); border: 1px solid rgba(86, 76, 60, .12); }
.bo-pill small { display: block; margin-bottom: .32rem; color: #8c8479; font-size: .57rem; letter-spacing: .18em; text-transform: uppercase; }
.bo-pill strong { color: #28231d; font-size: .88rem; }
.bo-actions { display: flex; gap: .8rem; margin-top: 1rem; }
.bo-primary, .bo-secondary { border: none; border-radius: 12px; padding: .95rem 1rem; text-transform: uppercase; letter-spacing: .1em; font-size: .73rem; cursor: pointer; }
.bo-primary { flex: 1; background: #25211b; color: #fff; transition: background .25s ease, box-shadow .25s ease; }
.bo-primary.ready { background: linear-gradient(135deg, #7b9c5a 0%, #a7b08a 100%); box-shadow: 0 8px 24px rgba(123,156,90,.28); }
.bo-primary:disabled { opacity: .45; cursor: default; }
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
const BOTTOM_PRODUCT_IDS = [104, 8, 103, 105, 106, 114, 113];

// ── Silhouette Preview ──
function SilhouettePreview({ selectedTop, selectedBottom, body }) {
  const h = body?.height || 170;
  const w = body?.weight || 70;
  const ch = body?.chest || 88;
  const wa = body?.waist || 70;
  const hi = body?.hips || 96;

  // ── نطاق طبيعي لكل مقياس ─────────────────────────────────────────────────
  const norm = (val, min, max) => Math.min(1, Math.max(0, (val - min) / (max - min)));

  // Height scale: 140cm → 0.78 | 195cm → 1.18
  const heightScale = 0.78 + norm(h, 140, 195) * 0.40;

  // عرض كل منطقة على حدة
  const shoulderScale = 0.82 + norm(ch, 80, 110) * 0.52;  // chest → كتف
  const waistScale = 0.72 + norm(wa, 60, 90) * 0.52;  // waist → خصر
  const hipsScale = 0.82 + norm(hi, 86, 120) * 0.52;  // hips  → ورك

  // الجسم كله بيتسع بناءً على weighted average
  const bodyWidthScale = Math.min(1.55, Math.max(0.72,
    shoulderScale * 0.33 + waistScale * 0.30 + hipsScale * 0.37
  ));

  // ── تحديد نقاط الجسم ─────────────────────────────────────────────────────
  const bodyHeightPct = 86 * heightScale;
  const bodyTopPct = 52 - bodyHeightPct / 2;  // مركز الجسم أسفل شوية

  // نسب ثابتة من الـ SVG body
  const shoulderTopPct = bodyTopPct + bodyHeightPct * 0.13;
  const waistPct = bodyTopPct + bodyHeightPct * 0.46;
  const feetPct = bodyTopPct + bodyHeightPct * 0.97;

  // حساب الـ silhouette image
  const silhouetteHeight = (feetPct - shoulderTopPct) / (0.965 - 0.08);
  const silhouetteTop = shoulderTopPct - silhouetteHeight * 0.08;

  // ── الهدوم — بتتأقلم مع كل منطقة ────────────────────────────────────────
  // Top: عرضه بيتبع الكتف، ارتفاعه من الرقبة للخصر + overlap صغير
  const topW = Math.min(78, Math.max(52, 62 * shoulderScale));
  const topTop = bodyTopPct + bodyHeightPct * 0.07;     // بيبدأ من الرقبة
  const topH = (waistPct - topTop) * 1.38;            // بينتهي تحت الخصر شوية

  // Bottom: عرضه بيتبع الهيبس، بيبدأ من تحت الـ top مباشرة
  const botW = Math.min(82, Math.max(54, 64 * hipsScale));
  const botTop = topTop + topH * 0.80;                  // overlap مع الـ top
  const botH = feetPct - botTop;

  return (
    <div className="bo-stage bo-soft" style={{
      position: "relative",
      background: "radial-gradient(circle at 48% 16%, rgba(255,255,255,.06), transparent 30%), linear-gradient(180deg,#3d3c39 0%,#2e2d2b 100%)",
    }}>
      <div style={{
        position: "absolute", top: "1rem", left: 0, right: 0, textAlign: "center",
        fontSize: ".55rem", letterSpacing: ".22em", textTransform: "uppercase",
        color: "rgba(255,255,255,.28)", zIndex: 10, pointerEvents: "none",
      }}>Outfit Preview</div>

      {/* ── Body silhouette ── */}
      <img src="/body.png" alt="" style={{
        position: "absolute",
        top: `${silhouetteTop}%`,
        left: "50%",
        transform: `translateX(-50%) scaleX(${bodyWidthScale})`,
        height: `${silhouetteHeight}%`,
        width: "auto",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.50,
        userSelect: "none",
        transition: "all .4s cubic-bezier(.4,0,.2,1)",
        transformOrigin: "center top",
      }} draggable={false} />

      {/* ── Top garment ── */}
      <div style={{
        position: "absolute",
        top: `${topTop}%`, left: "50%",
        transform: "translateX(-50%)",
        width: `${topW}%`, height: `${topH}%`,
        zIndex: 2,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        transition: "all .4s cubic-bezier(.4,0,.2,1)",
      }}>
        {selectedTop ? (
          <img key={selectedTop.id} src={selectedTop.img3d || selectedTop.img} alt={selectedTop.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "contain", objectPosition: "top center",
              filter: "drop-shadow(0 8px 22px rgba(0,0,0,.65))",
              animation: "fadeInUp .3s ease",
            }} />
        ) : (
          <div style={{
            width: "80%", height: "70%", border: "1.5px dashed rgba(255,255,255,.12)",
            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,.2)", fontSize: ".58rem", letterSpacing: ".12em", textTransform: "uppercase"
          }}>Choose Top</div>
        )}
      </div>

      {/* ── Bottom garment ── */}
      <div style={{
        position: "absolute",
        top: `${botTop}%`, left: "50%",
        transform: "translateX(-50%)",
        width: `${botW}%`, height: `${botH}%`,
        zIndex: 1,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        transition: "all .4s cubic-bezier(.4,0,.2,1)",
      }}>
        {selectedBottom ? (
          <img key={selectedBottom.id} src={selectedBottom.img3d || selectedBottom.img} alt={selectedBottom.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "contain", objectPosition: "top center",
              filter: "drop-shadow(0 6px 18px rgba(0,0,0,.55))",
              animation: "fadeInDown .3s ease",
            }} />
        ) : (
          <div style={{
            width: "75%", height: "65%", border: "1.5px dashed rgba(255,255,255,.12)",
            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,.2)", fontSize: ".58rem", letterSpacing: ".12em", textTransform: "uppercase"
          }}>Choose Bottom</div>
        )}
      </div>

      {(selectedTop || selectedBottom) && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent,rgba(0,0,0,.75))",
          padding: ".6rem .8rem .7rem",
          display: "flex", justifyContent: "space-between", gap: ".5rem", zIndex: 10,
        }}>
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

function ProductCard({ item, selected, onSelect, wish, onWish }) {
  const isWished = wish && wish.some(w => w.id === item.id);
  return (
    <article className={`bo-product bo-soft${selected ? " on" : ""}`}>
      <div className="bo-thumb">
        <img src={item.img} alt={item.name} />
        <button
          className={`bo-heart${isWished ? " wishlisted" : ""}`}
          type="button"
          title={isWished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onWish && onWish(item)}
        >&#10084;</button>
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

function RecCard({ item, selected, onSelect, wish, onWish }) {
  const isWished = wish && wish.some(w => w.id === item.id);
  return (
    <article className={`bo-rec${selected ? " on" : ""}`}>
      <div className="bo-thumb">
        <img src={item.img} alt={item.name} />
        <button
          className={`bo-heart${isWished ? " wishlisted" : ""}`}
          type="button"
          title={isWished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onWish && onWish(item)}
        >&#10084;</button>
      </div>
      <div className="bo-brand">{item.brand}</div>
      <div className="bo-name">{item.name}</div>
      <div className="bo-price">{item.price}</div>
      <button className={`bo-btn${selected ? " dark" : ""}`} type="button" onClick={() => onSelect(item)}>
        {selected ? "Selected" : "Select"}
      </button>
    </article>
  );
}

function ProductCarousel({ products, selectedId, onSelect, wish, onWish }) {
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
          <ProductCard
            key={item.id} item={item}
            selected={selectedId === item.id}
            onSelect={onSelect}
            wish={wish} onWish={onWish}
          />
        ))}
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

export default function BuildOutfit({ cart = [], setCart, wish = [], setWish }) {
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [body, setBody] = useState({ height: 170, chest: 88, waist: 70, hips: 96, weight: 70 });
  const [addedToCart, setAddedToCart] = useState(false);

  // Derived sizes — recalculated live as sliders move
  const topSize = calcTopSize(body.chest);
  const bottomSize = calcBottomSize(body.waist, body.hips);

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

  const topProducts = useMemo(() => TOP_PRODUCT_IDS.map(id => adultProducts.find(p => p.id === id)).filter(Boolean), [adultProducts]);
  const bottomProducts = useMemo(() => BOTTOM_PRODUCT_IDS.map(id => adultProducts.find(p => p.id === id)).filter(Boolean), [adultProducts]);

  const recommendedProducts = useMemo(() => {
    const availTops = topProducts.filter(p => p.id !== selectedTop?.id);
    const availBottoms = bottomProducts.filter(p => p.id !== selectedBottom?.id);
    const pick = [];
    if (availTops[2]) pick.push({ ...availTops[2], _kind: "top" });
    if (availBottoms[0]) pick.push({ ...availBottoms[0], _kind: "bottom" });
    if (availTops[5]) pick.push({ ...availTops[5], _kind: "top" });
    const pool = [
      ...availTops.map(p => ({ ...p, _kind: "top" })),
      ...availBottoms.map(p => ({ ...p, _kind: "bottom" })),
    ];
    while (pick.length < 3) {
      const next = pool.find(p => !pick.some(x => x.id === p.id));
      if (!next) break;
      pick.push(next);
    }
    return pick.slice(0, 3);
  }, [topProducts, bottomProducts, selectedTop?.id, selectedBottom?.id]);

  const favoritesToShow = favorites.length ? favorites.slice(-4) : [...topProducts, ...bottomProducts].slice(0, 4);
  const selectedCount = Number(Boolean(selectedTop)) + Number(Boolean(selectedBottom));
  const total = parsePrice(selectedTop?.price) + parsePrice(selectedBottom?.price);
  const outfitReady = Boolean(selectedTop && selectedBottom);

  const handleWish = (item) => {
    if (!setWish) return;
    setWish(prev => {
      const exists = prev.some(w => w.id === item.id);
      return exists ? prev.filter(w => w.id !== item.id) : [...prev, item];
    });
  };

  const selectProduct = (item, type) => {
    if (type === "top") setSelectedTop(item);
    else setSelectedBottom(item);
    setFavorites(prev => prev.some(s => s.id === item.id) ? prev : [...prev, item]);
  };

  const selectRecommended = (item) => {
    const type = item._kind || (TOP_PRODUCT_IDS.includes(item.id) ? "top" : "bottom");
    selectProduct(item, type);
  };

  const addOutfit = () => {
    if (!selectedTop || !selectedBottom || !setCart) return;
    setCart(prev => {
      let c = [...prev];
      const items = [
        { item: selectedTop, size: topSize },
        { item: selectedBottom, size: bottomSize },
      ];
      items.forEach(({ item, size }) => {
        const rawPrice = parsePrice(item.price);
        const rawOld = item.oldPrice ? parsePrice(item.oldPrice) : null;
        const cartProduct = {
          id: item.id,
          name: item.name,
          brand: item.brand,
          price: `LE ${rawPrice.toLocaleString()}`,
          oldPrice: rawOld ? `LE ${rawOld.toLocaleString()}` : null,
          img: item.img,
        };
        const ex = c.find(x => x.id === item.id && x.size === size);
        if (ex) c = c.map(x => x.id === item.id && x.size === size ? { ...x, qty: x.qty + 1 } : x);
        else c = [...c, { id: item.id, size, qty: 1, product: cartProduct }];
      });
      return c;
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
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

            <section className="bo-data bo-soft" style={{ marginTop: "1rem", padding: "1.15rem" }}>
              <div className="bo-card-title" style={{ fontSize: ".7rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8173", marginBottom: "1rem", fontWeight: 600 }}>
                Body Measurements
              </div>

              {[
                ["height", "Height", "cm", 140, 195],
                ["weight", "Weight", "kg", 45, 130],
                ["chest", "Chest", "cm", 80, 100],
                ["waist", "Waist", "cm", 60, 80],
                ["hips", "Hips", "cm", 86, 110],
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

              {/* ── Calculated size result ── */}
              <div className="bo-size-result">
                <div className="bo-size-result-label">Your size</div>
                <div className="bo-size-badges">
                  <div className="bo-size-badge">
                    <span>Top</span>
                    <span>{topSize}</span>
                  </div>
                  <div style={{ width: "1px", background: "rgba(123,132,91,.25)", margin: "0 .15rem" }} />
                  <div className="bo-size-badge">
                    <span>Bottom</span>
                    <span>{bottomSize}</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: ".62rem", color: "#b9b1a3", marginTop: ".6rem", lineHeight: 1.5 }}>
                Sizes update live as you adjust your measurements
              </div>
            </section>

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
              <ProductCarousel
                products={topProducts}
                selectedId={selectedTop?.id}
                onSelect={item => selectProduct(item, "top")}
                wish={wish} onWish={handleWish}
              />
            </section>

            <section className="bo-step">
              <div className="bo-kicker">2. Choose Bottom</div>
              <div className="bo-divider" />
              <ProductCarousel
                products={bottomProducts}
                selectedId={selectedBottom?.id}
                onSelect={item => selectProduct(item, "bottom")}
                wish={wish} onWish={handleWish}
              />
            </section>

            <section className="bo-step">
              <div className="bo-divider"><span>Recommended For You</span></div>
              <div className="bo-recs">
                {recommendedProducts.map(item => (
                  <RecCard
                    key={item.id} item={item}
                    selected={selectedTop?.id === item.id || selectedBottom?.id === item.id}
                    onSelect={selectRecommended}
                    wish={wish} onWish={handleWish}
                  />
                ))}
              </div>
            </section>

            <div className="bo-summary">
              <div className="bo-pill"><small>Selected Pieces</small><strong>{selectedCount}/2 chosen</strong></div>
              <div className="bo-pill">
                <small>Your Sizes</small>
                <strong>{outfitReady ? `${topSize} top · ${bottomSize} bottom` : "Set measurements"}</strong>
              </div>
              <div className="bo-pill"><small>Estimated Total</small><strong>{total ? `LE ${total.toLocaleString()}` : "Choose items"}</strong></div>
            </div>

            <div className="bo-actions">
              <button
                className={`bo-primary${addedToCart ? " ready" : outfitReady ? " ready" : ""}`}
                type="button"
                onClick={addOutfit}
                disabled={!outfitReady}
                style={addedToCart ? { background: "linear-gradient(135deg,#4a7c3f 0%,#6a9e5a 100%)", boxShadow: "0 8px 24px rgba(74,124,63,.4)" } : {}}
              >
                {addedToCart
                  ? `✓ Added to Cart!`
                  : outfitReady
                    ? `✓ Add Outfit to Cart (${topSize} / ${bottomSize})`
                    : "Add Outfit to Cart"}
              </button>
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