import { useMemo, useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PRODUCTS, SHARED_CSS, SHFooter, SHNav } from "./shared";

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
function SilhouettePreview({ selectedTop, selectedBottom, body }) {
  const h = body?.height || 170;
  const w = body?.weight || 70;
  const ch = body?.chest || 88;
  const wa = body?.waist || 70;
  const hi = body?.hips || 96;

  // HEIGHT: 140cm → 0.80 | 170cm → 1.0 | 195cm → 1.18
  const heightScale = 0.80 + ((h - 140) / 55) * 0.38;

  // WIDTH: weight dominant, chest + hips add detail
  const widthScale = Math.min(1.55, Math.max(0.70,
    0.75
    + ((w - 45) / 85) * 0.58
    + ((ch - 75) / 50) * 0.10
    + ((hi - 80) / 50) * 0.10
  ));

  // The SVG body occupies 68% width and 88% height of the stage,
  // centered at 50%/50%. We compute the scaled body's actual pixel
  // footprint so clothes can be placed relative to it.
  //
  // Body SVG natural proportions (approximate, tweak to match your SVG):
  //   head top  → ~3%  of SVG height
  //   shoulders → ~14% of SVG height
  //   waist     → ~46% of SVG height
  //   hips end  → ~62% of SVG height
  //   feet      → ~98% of SVG height
  //
  // After scaleY(heightScale) the SVG still renders at 88% stage height
  // visually, but its content shifts. We translate everything through the
  // same transform origin (center of stage) as the body SVG uses.

  // ─────────────────────────────────────────────────────────────────────────
  // 🎛 BODY-PART FITTING WIDTHS
  // These values connect the sliders to the preview more naturally:
  // - chest affects the upper garment width
  // - waist affects the middle narrowing
  // - hips affects the bottom garment width
  // - weight still influences the general body silhouette
  // ─────────────────────────────────────────────────────────────────────────
  const shoulderScale = Math.min(1.45, Math.max(0.82,
    widthScale * (0.9 + ((ch - 75) / 50) * 0.35)
  ));

  const waistScale = Math.min(1.35, Math.max(0.75,
    widthScale * (0.85 + ((wa - 55) / 50) * 0.28)
  ));

  const hipsScale = Math.min(1.5, Math.max(0.82,
    widthScale * (0.9 + ((hi - 80) / 50) * 0.32)
  ));

  const topWidthPct = 68 * ((shoulderScale * 0.7) + (waistScale * 0.3));
  const bottomWidthPct = 68 * ((hipsScale * 0.75) + (waistScale * 0.25));

  // The body SVG is centered at top:50% / left:50% with translate(-50%,-50%).
  // Its rendered height on screen = 88% of stage height × heightScale.
  // Its rendered top edge (in stage %) = 50% - (88% * heightScale / 2)
  const bodyTopPct = 50 - (88 * heightScale) / 2;
  const bodyHeightPct = 88 * heightScale;

  // Anchor positions within the SVG content (as fraction of SVG height):
  const SVG_SHOULDER_FRAC = 0.14;
  const SVG_WAIST_FRAC = 0.46;
  const SVG_HIPS_END_FRAC = 0.63;
  const SVG_FEET_FRAC = 0.97;

  // Convert to stage % coordinates
  const shoulderTopPct = bodyTopPct + bodyHeightPct * SVG_SHOULDER_FRAC;
  const waistPct = bodyTopPct + bodyHeightPct * SVG_WAIST_FRAC;
  const hipsEndPct = bodyTopPct + bodyHeightPct * SVG_HIPS_END_FRAC;
  const feetPct = bodyTopPct + bodyHeightPct * SVG_FEET_FRAC;

  // ─────────────────────────────────────────────────────────────────────────
  // 🎛  TOP GARMENT HEIGHT
  //     Multiplier controls how far down the top stretches:
  //       1.08 = just below waist (default crop)
  //       1.45 = stomach / belly button  ← current
  //       1.70 = hip level (long shirt / tunic)
  //       2.00 = very long top / dress-like
  //     Increase the number → longer top, decrease → shorter/more cropped
  // ─────────────────────────────────────────────────────────────────────────
  const topGarmentTop = shoulderTopPct;
  const topGarmentHeight = (waistPct - shoulderTopPct) * 1.45; // ← change multiplier here

  // ─────────────────────────────────────────────────────────────────────────
  // 🎛  BOTTOM GARMENT HEIGHT & VERTICAL POSITION
  //     bottomGarmentTop  → how high up the bottom starts (overlap with top)
  //       0.18 = slight overlap ← current | 0.30 = more overlap | 0.0 = no overlap
  //     bottomGarmentHeight → auto (reaches feet). To shorten (e.g. shorts):
  //       replace `feetPct - bottomGarmentTop`
  //       with e.g. `(feetPct - bottomGarmentTop) * 0.55`  for knee-length
  // ─────────────────────────────────────────────────────────────────────────
  const bottomGarmentTop = waistPct - (hipsEndPct - waistPct) * 0.18; // ← change 0.18 for overlap
  const bottomGarmentHeight = feetPct - bottomGarmentTop;                 // ← multiply by 0.0–1.0 to shorten

  return (
    <div className="bo-stage bo-soft" style={{
      position: "relative",
      background: "radial-gradient(circle at 48% 16%, rgba(255,255,255,.06), transparent 30%), linear-gradient(180deg,#3d3c39 0%,#2e2d2b 100%)",
    }}>
      {/* Label */}
      <div style={{
        position: "absolute", top: "1rem", left: 0, right: 0, textAlign: "center",
        fontSize: ".55rem", letterSpacing: ".22em", textTransform: "uppercase",
        color: "rgba(255,255,255,.28)", zIndex: 10, pointerEvents: "none",
      }}>Outfit Preview</div>

      {/* ── Body silhouette SVG — positioned at the same top/height as the virtual body
           so shoulders (14% of SVG) land exactly on topGarmentTop,
           and feet (97% of SVG) land exactly on feetPct. ── */}
      <svg
        viewBox="0 0 278.8 984.46"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          top: `${bodyTopPct}%`,
          left: "50%",
          transform: "translateX(-50%)",
          height: `${bodyHeightPct}%`,
          width: "auto",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.18,
        }}
      >
        <g transform="translate(-37.897 -34.052)">
          <path
            d="m184.31 39.407c-2.4389 0.07883-3.6559 0.08033-4.8797 0.09384v0.09384c-1.2004-0.01201-2.3939-0.01652-4.7858-0.09384-39.289 0.35904-38.803 67.435-24.68 87.834 6.2768 12.553-0.0248 25.123-1.5953 37.677-16.296 15.257-69.012 9.9299-77.324 23.554-11.016 22.636-25.015 136.57-19.237 154.93-16.753 28.277 18.096 142.43 18.064 163.56-9.0447 52.676 14.379 68.409 26.932 68.409-0.0643-9.9139-18.388-22.691-12.715-33.876 4.7717-3.0742 3.5556 2.2366 11.402 6.9442-0.30838-3.7707-0.54017-7.8508-0.79764-12.012-1.0503-9.341-2.0133-18.776-2.7214-28.199-0.23254-1.3091-0.47227-2.5421-0.75071-3.7067-6.2768-9.4151 4.4727-102.43-2.4398-135.65 10.211-26.909 17.287-117.63 15.718-131.75 5.6409 38.15 2.7223 104.48 4.692 130.86-18.836 34.879-21.187 87.444-17.22 140.24 1.4124 7.9512 2.1093 18.309 2.7214 28.199 8.0075 71.217 24.235 137.21 22.991 154.18-14.061 68.619 4.1043 184.01 4.9735 196.13-0.93338 11.217-6.8215 27.589-2.5806 34.533-5.673 24.069-12.496 28.199-7.7887 42.322 4.7076 14.123 40.519 21.29 47.061 12.574 2.0358-13.221-3.1281-50.215-7.8356-56.492 2.5025-5.3754 8.2537-21.518 3.1436-37.677 9.3101-15.257 20.802-146.51 16.328-160.23 4.3089-6.181 8.8609-37.541 4.1742-46.035 0.38087-4.1414 1.1622-122.16 3.0964-124.92 3.4167-11.146 2.284-11.021 4.42-0.15238 2.1818 3.8267 1.7454 121.17 2.1263 125.31-4.6867 8.4948-1.1408 39.519 3.1681 45.7-4.4742 13.72 7.0181 144.97 16.328 160.23-5.1101 16.159 0.6411 32.301 3.1436 37.677-4.7076 6.2768-9.8715 43.27-7.8356 56.492 6.5421 8.715 42.353 1.5482 47.061-12.575 4.7075-14.123-2.1158-18.253-7.7887-42.322 4.2409-6.9446-1.6472-23.316-2.5806-34.533 0.8692-12.119 19.035-127.51 4.9735-196.13-1.2442-16.971 14.983-82.962 22.991-154.18 0.61204-9.89 1.3089-20.248 2.7214-28.199 3.9676-52.8 1.616-105.36-17.22-140.24 1.9697-26.377-0.94894-92.709 4.692-130.86-1.5692 14.123 5.5068 104.84 15.718 131.75-6.9126 33.218 3.8369 126.23-2.4398 135.65-0.27843 1.1646-0.51817 2.3976-0.75071 3.7067-0.70803 9.4225-1.6711 18.858-2.7214 28.199-0.25747 4.1607-0.48926 8.2408-0.79763 12.012 7.8459-4.7076 6.6298-10.018 11.402-6.9442 5.673 11.186-12.651 23.962-12.715 33.876 12.553 0 35.977-15.734 26.932-68.409-0.032-21.131 34.818-135.29 18.064-163.56 5.778-18.363-8.2208-132.29-19.237-154.93-8.3126-13.624-61.028-8.2966-77.324-23.554-1.5705-12.553-7.872-25.123-1.5953-37.677 14.123-20.399 14.609-87.475-24.68-87.834z"
            style={{ fill: "rgba(210,205,190,0.9)", stroke: "none" }}
          />
        </g>
      </svg>

      {/* ── TOP garment ── */}
      <div style={{
        position: "absolute",
        top: `${topGarmentTop}%`,
        left: "50%",
        transform: "translateX(-50%)",
        width: `${topWidthPct}%`,
        height: `${topGarmentHeight}%`,
        zIndex: 2,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        transition: "all .35s ease",
      }}>
        {selectedTop ? (
          <img
            key={selectedTop.id}
            src={selectedTop.img3d || selectedTop.img}
            alt={selectedTop.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "fill",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,.6))",
              animation: "fadeInUp .3s ease",
            }}
          />
        ) : (
          <div
            style={{
              width: "80%",
              height: "75%",
              border: "1.5px dashed rgba(255,255,255,.12)",
              borderRadius: "6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              color: "rgba(255,255,255,.2)",
              fontSize: ".58rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>＋</span>
            Choose Top
          </div>
        )}
      </div>

      {/* ── BOTTOM garment ── */}
      <div style={{
        position: "absolute",
        top: `${bottomGarmentTop}%`,
        left: "50%",
        transform: "translateX(-50%)",
        width: `${bottomWidthPct}%`,
        height: `${bottomGarmentHeight}%`,
        zIndex: 1,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        transition: "all .35s ease",
      }}>
        {selectedBottom ? (
          <img
            key={selectedBottom.id}
            src={selectedBottom.img3d || selectedBottom.img}
            alt={selectedBottom.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "fill",
              filter: "drop-shadow(0 6px 16px rgba(0,0,0,.5))",
              animation: "fadeInDown .3s ease",
            }}
          />
        ) : (
          <div style={{
            width: "75%", height: "70%",
            border: "1.5px dashed rgba(255,255,255,.12)", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,.2)", fontSize: ".58rem",
            letterSpacing: ".12em", textTransform: "uppercase",
          }}>Choose Bottom</div>
        )}
      </div>

      {/* ── Info bar ── */}
      {(selectedTop || selectedBottom) && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent,rgba(0,0,0,.75))",
          padding: ".6rem .8rem .7rem",
          display: "flex", justifyContent: "space-between", gap: ".5rem",
          zIndex: 10,
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

  const topProducts = useMemo(() => TOP_PRODUCT_IDS.map(id => adultProducts.find(p => p.id === id)).filter(Boolean), [adultProducts]);
  const bottomProducts = useMemo(() => BOTTOM_PRODUCT_IDS.map(id => adultProducts.find(p => p.id === id)).filter(Boolean), [adultProducts]);
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