import { useMemo, useState, useEffect, useRef } from "react";
import * as THREE from "three";
import "bootstrap/dist/css/bootstrap.min.css";
import { SHARED_CSS, SHFooter, SHNav } from "./shared";

const API = "https://stylehub-backend-tau.vercel.app/api";

const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `${API.replace("/api", "")}${img}`;
};

const PAGE_CSS = `
.bo-page { background: linear-gradient(180deg,#f7f3ec 0%,#f8f6f2 26%,#f5f2ea 100%); }
.bo-shell { max-width:1380px; margin:0 auto; padding:2.35rem 1.1rem 4rem; }
.bo-hero { text-align:center; margin-bottom:2rem; }
.bo-title { margin:0; font-family:'Cormorant Garamond',serif; font-size:clamp(2.35rem,4vw,3.5rem); color:#28231d; }
.bo-sub { margin-top:.45rem; color:#8b8579; font-size:.82rem; }
.bo-layout { display:grid; grid-template-columns:330px minmax(0,1fr); gap:1.8rem; align-items:start; }
.bo-side { position:sticky; top:84px; }
.bo-soft { background:rgba(255,255,255,.72); border:1px solid rgba(86,76,60,.12); border-radius:28px; box-shadow:0 18px 42px rgba(37,31,23,.06); }
.bo-stage { height:520px; overflow:hidden; border-radius:28px; }
.bo-gender-toggle { display:flex; gap:.5rem; margin-bottom:1rem; }
.bo-gender-btn { flex:1; padding:.55rem; border-radius:12px; border:1.5px solid rgba(86,76,60,.15); background:#fff; font-size:.75rem; letter-spacing:.06em; cursor:pointer; transition:all .2s; color:#6b6459; font-family:inherit; }
.bo-gender-btn.active { background:#a7b08a; color:#fff; border-color:#a7b08a; }
.bo-mini-list { display:grid; gap:.65rem; }
.bo-mini { display:grid; grid-template-columns:44px minmax(0,1fr) auto; gap:.6rem; align-items:center; padding:.45rem; background:#fff; border-radius:14px; border:1px solid rgba(86,76,60,.12); }
.bo-mini img { width:44px; height:44px; border-radius:999px; object-fit:cover; }
.bo-mini-name { font-size:.71rem; color:#28231d; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.bo-mini-price { color:#7d766a; font-size:.67rem; }
.bo-main { min-width:0; }
.bo-step { margin-bottom:2rem; }
.bo-divider { display:flex; align-items:center; gap:.85rem; margin-bottom:.95rem; }
.bo-divider span { font-family:'Cormorant Garamond',serif; font-size:1.9rem; color:#2b261f; white-space:nowrap; }
.bo-divider::after { content:""; height:1px; background:rgba(40,34,27,.28); flex:1; }
.bo-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1rem; }
.bo-product { padding:.9rem; border-radius:25px; background:rgba(255,255,255,.76); border:1px solid rgba(86,76,60,.12); box-shadow:0 12px 28px rgba(37,31,23,.05); transition:transform .18s,box-shadow .18s,border-color .18s; }
.bo-product:hover { transform:translateY(-2px); box-shadow:0 18px 32px rgba(37,31,23,.08); }
.bo-product.on { border-color:rgba(123,132,91,.7); box-shadow:0 18px 34px rgba(123,132,91,.18); }
.bo-thumb { position:relative; overflow:hidden; border-radius:20px; aspect-ratio:.82; background:#ece7df; margin-bottom:.8rem; }
.bo-thumb img { width:100%; height:100%; object-fit:cover; object-position:top center; }
.bo-heart { position:absolute; left:.6rem; bottom:.6rem; width:28px; height:28px; border:none; border-radius:50%; background:rgba(255,255,255,.96); color:#df5e59; font-size:.88rem; box-shadow:0 8px 18px rgba(0,0,0,.12); cursor:pointer; }
.bo-brand { font-size:.63rem; letter-spacing:.18em; text-transform:uppercase; color:#8a8173; margin-bottom:.25rem; }
.bo-name { min-height:2.45em; font-size:.82rem; font-weight:600; color:#27211b; }
.bo-price { margin:.18rem 0 .7rem; color:#6f695e; font-size:.74rem; }
.bo-btn { min-width:88px; border:none; border-radius:8px; padding:.48rem .85rem; font-size:.69rem; background:#a7b08a; color:#fff; cursor:pointer; font-family:inherit; }
.bo-btn.dark { background:#25211b; }
.bo-recs { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1rem; }
.bo-rec { text-align:center; }
.bo-rec .bo-thumb { aspect-ratio:.84; margin-bottom:.5rem; }
.bo-summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1rem; margin-top:1rem; }
.bo-pill { padding:.95rem 1rem; border-radius:18px; background:rgba(255,255,255,.76); border:1px solid rgba(86,76,60,.12); }
.bo-pill small { display:block; margin-bottom:.32rem; color:#8c8479; font-size:.57rem; letter-spacing:.18em; text-transform:uppercase; }
.bo-pill strong { color:#28231d; font-size:.88rem; }
.bo-actions { display:flex; gap:.8rem; margin-top:1rem; }
.bo-primary,.bo-secondary { border:none; border-radius:12px; padding:.95rem 1rem; text-transform:uppercase; letter-spacing:.1em; font-size:.73rem; cursor:pointer; font-family:inherit; }
.bo-primary { flex:1; background:#25211b; color:#fff; }
.bo-primary:disabled { opacity:.4; cursor:not-allowed; }
.bo-secondary { min-width:200px; background:rgba(167,176,138,.16); color:#5a6249; }
.bo-secondary:disabled { opacity:.4; cursor:not-allowed; }
.bo-ai-box { margin-top:1.5rem; padding:1.2rem 1.4rem; border-radius:18px; background:linear-gradient(135deg,rgba(167,176,138,.12),rgba(123,132,91,.08)); border:1px solid rgba(123,132,91,.2); }
.bo-ai-title { font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:#2e2922; margin-bottom:.6rem; }
.bo-ai-text { font-size:.8rem; color:#5c574f; line-height:1.75; }
.bo-ai-loading { display:flex; align-items:center; gap:.6rem; font-size:.75rem; color:#8a8173; }
.bo-spinner { width:14px; height:14px; border:2px solid #a7b08a; border-top-color:transparent; border-radius:50%; animation:bospin .7s linear infinite; flex-shrink:0; }
@keyframes bospin { to { transform:rotate(360deg); } }
@media(max-width:1024px){.bo-layout{grid-template-columns:1fr}.bo-side{position:static}}
@media(max-width:768px){.bo-grid,.bo-recs,.bo-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.bo-shell{padding-inline:.85rem}.bo-stage{height:380px}.bo-grid,.bo-recs,.bo-summary{grid-template-columns:1fr}.bo-actions{flex-direction:column}.bo-secondary{min-width:0}}
`;

// ── 3D Body Model ──
function ThreeBodyModel({ body, gender }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 330;
    const H = mount.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2c2b28);
    scene.fog = new THREE.Fog(0x2c2b28, 10, 22);

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 1.4, 5.2);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xfff3e0, 0.65));
    const sun = new THREE.DirectionalLight(0xffffff, 1.3);
    sun.position.set(3, 7, 5);
    sun.castShadow = true;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xa7b08a, 0.45);
    fill.position.set(-4, 2, -3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x7090ff, 0.2);
    rim.position.set(0, 5, -5);
    scene.add(rim);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.5, 36),
      new THREE.MeshLambertMaterial({ color: 0x222120 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── Measurements ──
    const h = body.height || 170;
    const w = body.weight || 70;
    const ch = body.chest || 88;
    const wa = body.waist || 70;
    const hi = body.hips || 96;
    const isFemale = gender === "female";

    const hS = 0.82 + ((h - 140) / 55) * 0.36;   // height scale
    const wS = Math.min(1.5, Math.max(0.72,
      0.76 + ((w - 45) / 85) * 0.55 + ((ch - 75) / 50) * 0.08 + ((hi - 80) / 50) * 0.07
    ));

    // Materials
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xd4a07a });
    const topMat = new THREE.MeshLambertMaterial({ color: isFemale ? 0x8a7b9c : 0x4a5568 });
    const btmMat = new THREE.MeshLambertMaterial({ color: isFemale ? 0x7a6b5a : 0x2d3748 });
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x3d2b1a });
    const shoeMat = new THREE.MeshLambertMaterial({ color: 0x1a1816 });

    const group = new THREE.Group();

    // Helper: add mesh to group
    const add = (geo, mat, pos, rot) => {
      const m = new THREE.Mesh(geo, mat);
      m.castShadow = true;
      if (pos) m.position.set(...pos);
      if (rot) m.rotation.set(...rot);
      group.add(m);
      return m;
    };

    // HEAD
    const headY = 2.38 * hS;
    add(new THREE.SphereGeometry(0.22, 18, 14), skinMat, [0, headY, 0]);

    // Hair
    if (isFemale) {
      add(new THREE.SphereGeometry(0.232, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), hairMat, [0, headY, 0]);
      add(new THREE.CylinderGeometry(0.21, 0.14, 0.55, 14), hairMat, [0, headY - 0.32, -0.04]);
    } else {
      add(new THREE.SphereGeometry(0.228, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.42), hairMat, [0, headY, 0]);
    }

    // Neck
    const neckY = headY - 0.22 - 0.09;
    add(new THREE.CylinderGeometry(0.09, 0.1, 0.18, 12), skinMat, [0, neckY, 0]);

    // TORSO
    const torsoTopR = (ch / 88) * (isFemale ? 0.27 : 0.31) * wS;
    const torsoMidR = (wa / 70) * (isFemale ? 0.21 : 0.26) * wS;
    const torsoH = 0.7 * hS;
    const torsoY = neckY - 0.09 - torsoH / 2;
    add(new THREE.CylinderGeometry(torsoTopR, torsoMidR, torsoH, 16), topMat, [0, torsoY, 0]);

    // Bust (female)
    if (isFemale && ch > 80) {
      const bR = (ch / 88) * 0.085 * wS;
      [-0.1, 0.1].forEach(x => add(new THREE.SphereGeometry(bR, 12, 10), topMat, [x, torsoY + torsoH * 0.18, torsoTopR * 0.88]));
    }

    // HIPS
    const hipsR = (hi / 96) * (isFemale ? 0.3 : 0.27) * wS;
    const hipsH = 0.24 * hS;
    const hipsY = torsoY - torsoH / 2 - hipsH / 2 + 0.05;
    add(new THREE.CylinderGeometry(hipsR, hipsR * 0.9, hipsH, 16), btmMat, [0, hipsY, 0]);

    // Female skirt
    if (isFemale) {
      const skirtGeo = new THREE.CylinderGeometry(hipsR * 1.12, hipsR * 1.38, hipsH * 1.05, 18, 1, true);
      const skirtMesh = new THREE.Mesh(skirtGeo, new THREE.MeshLambertMaterial({ color: 0x8a7b9c, side: THREE.DoubleSide, transparent: true, opacity: 0.82 }));
      skirtMesh.position.set(0, hipsY, 0);
      group.add(skirtMesh);
    }

    // ARMS
    const armR = wS * 0.072;
    const upArmH = 0.56 * hS;
    const foreH = 0.46 * hS;
    const armY = torsoY + torsoH * 0.28;
    const armX = torsoTopR + armR + 0.015;

    [-1, 1].forEach(s => {
      add(new THREE.CylinderGeometry(armR, armR * 0.86, upArmH, 10), skinMat, [s * armX, armY - upArmH / 2, 0], [0, 0, s * 0.1]);
      const foreX = s * (armX + Math.sin(0.1) * upArmH * 0.55);
      const foreY = armY - upArmH - foreH / 2 + 0.03;
      add(new THREE.CylinderGeometry(armR * 0.76, armR * 0.62, foreH, 10), skinMat, [foreX, foreY, 0]);
      add(new THREE.SphereGeometry(armR * 0.68, 10, 8), skinMat, [foreX, foreY - foreH / 2 - 0.035, 0]);
    });

    // LEGS
    const legR = wS * (isFemale ? 0.105 : 0.1) * Math.sqrt(hi / 96);
    const thighH = 0.6 * hS;
    const calfH = 0.54 * hS;
    const legX = hipsR * 0.54;
    const legTopY = hipsY - hipsH / 2 + 0.04;

    [-1, 1].forEach(s => {
      add(new THREE.CylinderGeometry(legR, legR * 0.8, thighH, 12), btmMat, [s * legX, legTopY - thighH / 2, 0]);
      add(new THREE.CylinderGeometry(legR * 0.7, legR * 0.54, calfH, 12), btmMat, [s * legX, legTopY - thighH - calfH / 2 + 0.02, 0]);
      // Shoe
      const shoeGeo = new THREE.CylinderGeometry(legR * 0.55, legR * 0.5, 0.1, 10);
      const shoe = new THREE.Mesh(shoeGeo, shoeMat);
      shoe.position.set(s * legX, legTopY - thighH - calfH + 0.01, 0.07);
      shoe.rotation.x = 0.28;
      group.add(shoe);
    });

    // Center group vertically
    const bbox = new THREE.Box3().setFromObject(group);
    group.position.y = -bbox.min.y * 0.42;

    scene.add(group);

    // Label
    const label = document.createElement("div");
    label.textContent = isFemale ? "♀ Female Model" : "♂ Male Model";
    label.style.cssText = "position:absolute;top:12px;left:0;right:0;text-align:center;font-size:.52rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.32);pointer-events:none";
    mount.style.position = "relative";
    mount.appendChild(label);

    // Animate
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      group.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      if (mount.contains(label)) mount.removeChild(label);
      renderer.dispose();
    };
  }, [body, gender]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

function ProductCard({ item, selected, onSelect }) {
  return (
    <article className={`bo-product bo-soft${selected ? " on" : ""}`}>
      <div className="bo-thumb">
        {item.img ? <img src={item.img} alt={item.name} onError={e => { e.target.style.display = "none"; }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>👗</div>}
        <button className="bo-heart" type="button">&#10084;</button>
      </div>
      <div className="bo-brand">{item.brand}</div>
      <div className="bo-name">{item.name}</div>
      <div className="bo-price">{item.price}</div>
      <button className={`bo-btn${selected ? " dark" : ""}`} type="button" onClick={() => onSelect(item)}>
        {selected ? "Selected ✓" : "Select"}
      </button>
    </article>
  );
}

function RecCard({ item }) {
  return (
    <article className="bo-rec">
      <div className="bo-thumb">
        {item.img ? <img src={item.img} alt={item.name} onError={e => { e.target.style.display = "none"; }} /> : null}
        <button className="bo-heart" type="button">&#10084;</button>
      </div>
      <div className="bo-brand">{item.brand}</div>
      <div className="bo-name">{item.name}</div>
      <div className="bo-price">{item.price}</div>
    </article>
  );
}

const parsePrice = (p) => parseFloat((p || "").replace(/[^0-9.-]+/g, "")) || 0;

export default function BuildOutfit({ cart = [], setCart, wish = [] }) {
  const [gender, setGender] = useState("female");
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [body, setBody] = useState({ height: 170, chest: 88, waist: 70, hips: 96, weight: 70 });
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiRec, setAiRec] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/products?limit=100`)
      .then(r => r.json())
      .then(data => {
        const mapProduct = p => ({
          id: p._id,
          name: p.name,
          brand: p.seller?.brandName || "StyleHub",
          price: `LE ${p.price?.toLocaleString()}`,
          img: getImageUrl(p.images?.[0]),
          sizes: p.sizes || [],
          type: (p.subCategory || p.tags?.[0] || p.category || "").toLowerCase(),
          category: (p.category || "").toLowerCase(),
        });
        setAllProducts((data.data?.products || []).map(mapProduct));
      }).catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const topProducts = useMemo(() =>
    allProducts.filter(p => {
      const t = p.type + " " + p.category;
      return t.includes("top") || t.includes("shirt") || t.includes("hoodie") || t.includes("jacket") || t.includes("tee") || t.includes("sweater") || t.includes("sweatshirt") || t.includes("zip");
    }).slice(0, 6), [allProducts]);

  const bottomProducts = useMemo(() =>
    allProducts.filter(p => {
      const t = p.type + " " + p.category;
      return t.includes("bottom") || t.includes("pant") || t.includes("jean") || t.includes("skirt") || t.includes("trouser") || t.includes("sweatpant");
    }).slice(0, 6), [allProducts]);

  const recommendedProducts = useMemo(() =>
    allProducts.filter(p => !topProducts.find(t => t.id === p.id) && !bottomProducts.find(b => b.id === p.id)).slice(0, 3),
    [allProducts, topProducts, bottomProducts]);

  const getAIRec = async (top, bottom) => {
    if (!top && !bottom) return;
    setAiLoading(true);
    setAiRec("");
    try {
      const prompt = `You are a friendly fashion stylist for StyleHub, an Egyptian fashion marketplace. Be concise (max 55 words).
Customer: ${gender}, Height ${body.height}cm, Weight ${body.weight}kg, Chest ${body.chest}cm, Waist ${body.waist}cm, Hips ${body.hips}cm.
${top ? `Top: ${top.name} by ${top.brand}` : ""}${bottom ? `, Bottom: ${bottom.name} by ${bottom.brand}` : ""}.
Give a warm, specific style tip about this outfit for their body measurements.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      setAiRec(data.content?.[0]?.text || "");
    } catch {
      setAiRec("Great choice! This combination works beautifully for your body type.");
    } finally {
      setAiLoading(false);
    }
  };

  const selectProduct = (item, type) => {
    const newTop = type === "top" ? item : selectedTop;
    const newBottom = type === "bottom" ? item : selectedBottom;
    if (type === "top") setSelectedTop(item);
    else setSelectedBottom(item);
    setFavorites(prev => prev.some(s => s.id === item.id) ? prev : [...prev, item]);
    getAIRec(newTop, newBottom);
  };

  const favoritesToShow = favorites.length ? favorites.slice(-4) : [...topProducts, ...bottomProducts].slice(0, 4);
  const selectedCount = Number(Boolean(selectedTop)) + Number(Boolean(selectedBottom));
  const total = parsePrice(selectedTop?.price) + parsePrice(selectedBottom?.price);

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
          <div className="bo-sub">Create your perfect look — powered by AI & local Egyptian brands</div>
        </header>

        <div className="bo-layout">
          <aside className="bo-side">
            {/* Gender Toggle */}
            <div className="bo-gender-toggle">
              <button className={`bo-gender-btn${gender === "female" ? " active" : ""}`} onClick={() => setGender("female")}>♀ Female</button>
              <button className={`bo-gender-btn${gender === "male" ? " active" : ""}`} onClick={() => setGender("male")}>♂ Male</button>
            </div>

            {/* 3D Model */}
            <div className="bo-stage bo-soft">
              <ThreeBodyModel body={body} gender={gender} />
            </div>

            {/* Measurements */}
            <section className="bo-soft" style={{ marginTop: "1rem", padding: "1.15rem" }}>
              <div style={{ textAlign: "center", fontSize: ".68rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a8173", marginBottom: "1rem", fontWeight: 600 }}>
                Body Measurements
              </div>
              {[
                ["height", "Height", "cm", 140, 195],
                ["weight", "Weight", "kg", 45, 130],
                ["chest", "Chest", "cm", 75, 125],
                ["waist", "Waist", "cm", 55, 105],
                ["hips", "Hips", "cm", 80, 130],
              ].map(([key, label, unit, min, max]) => (
                <div key={key} style={{ marginBottom: ".78rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".72rem", marginBottom: ".28rem" }}>
                    <span style={{ color: "#8a8173" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "#28231d" }}>{body[key]} {unit}</span>
                  </div>
                  <input type="range" min={min} max={max} value={body[key]}
                    onChange={e => setBody(p => ({ ...p, [key]: Number(e.target.value) }))}
                    style={{ width: "100%", accentColor: "#a7b08a", cursor: "pointer" }} />
                </div>
              ))}
              <div style={{ fontSize: ".6rem", color: "#c0b8af", marginTop: ".4rem", lineHeight: 1.5 }}>
                Sliders update the 3D model in real time ✨
              </div>
            </section>

            {/* Favorites */}
            {favoritesToShow.length > 0 && (
              <section className="bo-soft" style={{ marginTop: "1rem", padding: "1.15rem" }}>
                <div style={{ textAlign: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", color: "#2e2922", marginBottom: ".85rem" }}>
                  Your Favorites ❤️
                </div>
                <div className="bo-mini-list">
                  {favoritesToShow.map(item => (
                    <div key={item.id} className="bo-mini">
                      {item.img && <img src={item.img} alt={item.name} onError={e => { e.target.style.display = "none"; }} />}
                      <div className="bo-mini-name">{item.name}</div>
                      <div className="bo-mini-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>

          <main className="bo-main">
            {/* Top */}
            <section className="bo-step">
              <div className="bo-divider"><span>1. Choose Top</span></div>
              {loading ? (
                <div className="bo-ai-loading"><div className="bo-spinner" /> Loading products...</div>
              ) : topProducts.length ? (
                <div className="bo-grid">
                  {topProducts.map(item => (
                    <ProductCard key={item.id} item={item} selected={selectedTop?.id === item.id} onSelect={() => selectProduct(item, "top")} />
                  ))}
                </div>
              ) : (
                <div style={{ color: "#8a8173", fontSize: ".8rem", padding: "1rem 0" }}>No tops found from backend. Add products via the seller dashboard.</div>
              )}
            </section>

            {/* Bottom */}
            <section className="bo-step">
              <div className="bo-divider"><span>2. Choose Bottom</span></div>
              {loading ? (
                <div className="bo-ai-loading"><div className="bo-spinner" /> Loading products...</div>
              ) : bottomProducts.length ? (
                <div className="bo-grid">
                  {bottomProducts.map(item => (
                    <ProductCard key={item.id} item={item} selected={selectedBottom?.id === item.id} onSelect={() => selectProduct(item, "bottom")} />
                  ))}
                </div>
              ) : (
                <div style={{ color: "#8a8173", fontSize: ".8rem", padding: "1rem 0" }}>No bottoms found from backend.</div>
              )}
            </section>

            {/* Recommended */}
            {recommendedProducts.length > 0 && (
              <section className="bo-step">
                <div className="bo-divider"><span>Recommended For You</span></div>
                <div className="bo-recs">
                  {recommendedProducts.map(item => <RecCard key={item.id} item={item} />)}
                </div>
              </section>
            )}

            {/* AI Box */}
            {(selectedTop || selectedBottom) && (
              <div className="bo-ai-box">
                <div className="bo-ai-title">✨ AI Style Tip</div>
                {aiLoading ? (
                  <div className="bo-ai-loading"><div className="bo-spinner" /> Analyzing your outfit...</div>
                ) : aiRec ? (
                  <div className="bo-ai-text">{aiRec}</div>
                ) : null}
              </div>
            )}

            {/* Summary */}
            <div className="bo-summary">
              <div className="bo-pill"><small>Selected Pieces</small><strong>{selectedCount}/2 chosen</strong></div>
              <div className="bo-pill"><small>Preview</small><strong>{selectedTop && selectedBottom ? "Full look ready ✓" : "Select top + bottom"}</strong></div>
              <div className="bo-pill"><small>Estimated Total</small><strong>{total ? `LE ${total.toLocaleString()}` : "Choose items"}</strong></div>
            </div>

            <div className="bo-actions">
              <button className="bo-primary" type="button" onClick={addOutfit} disabled={!selectedTop || !selectedBottom}>
                Add Outfit to Cart
              </button>
              <button className="bo-secondary" type="button" onClick={() => getAIRec(selectedTop, selectedBottom)} disabled={aiLoading || (!selectedTop && !selectedBottom)}>
                {aiLoading ? "Analyzing..." : "✨ Refresh AI Tip"}
              </button>
            </div>
          </main>
        </div>
      </div>
      <SHFooter />
    </div>
  );
}