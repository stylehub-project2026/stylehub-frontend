import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { PRODUCTS, BRANDS, CATS, NAV_LINKS, FOOTER_COLS, SHNav, SHFooter } from "./shared";

import Salty from "./salty";
import BlackCloset from "./blackcloset";
import Ninos from "./ninos";
import TwentySeven from "./27";
import SellerBrandPage from "./SellerBrandPage";
import ProfilePage from "./Profilepage";
import Wishlist from "./wishlist";
import Women from "./women";
import MenPage from "./MenPage";
import Kids from "./kids";
import ProductDetail from "./ProductDetail";
import SignIn from "./SignInPage";
import Seller from "./SellerAuthPage";
import SellerDashboard from "./SellerDashboard";
import ResetPasswordPage from "./ResetPasswordPage";
import Cart from "./cart";
import Checkout from "./checkout";


import { saveCart, saveWishlist, sellerSignOut } from "./api";
import BuildOutfit from "./BuildOutfit";
import AboutUs from "./AboutUs";
import ContactPage from "./ContactPage";

// Check if seller is logged in using the new token/seller keys
function isSellerLoggedIn() {
  return !!localStorage.getItem("token") && !!localStorage.getItem("seller");
}
// ─── SCROLL REVEAL ───
function useScrollReveal() {
  const refs = useRef([]);
  useEffect(() => {
    // small delay so DOM is fully painted before observing
    const timer = setTimeout(() => {
      refs.current.forEach(r => r && r.classList.remove("revealed"));
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        }),
        { threshold: 0.01, rootMargin: "0px 0px -20px 0px" }
      );
      refs.current.forEach(r => r && obs.observe(r));
      return () => obs.disconnect();
    }, 50);
    return () => clearTimeout(timer);
  });
  return useCallback(el => { if (el && !refs.current.includes(el)) refs.current.push(el); }, []);
}

// ─── ICONS ───
const I = {
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  cart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
};
const Heart = ({ on }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const Stars = ({ n }) => <>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ color: "#c8a96e", fontSize: ".65rem" }}>{i <= Math.round(n) ? "★" : "☆"}</span>)}</>;

// ─── DATA ───
// 📸 IMAGES: put files in src/assets/ then replace null with "/filename.jpg"
// 🔗 LINKS: replace "#" with "/pagename" when page is ready

// ─── CUSTOM CSS — only effects, colors, fonts ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
:root { --cream:#F8F6F2; --dark:#1a1a18; --sage:#92A079; --deep:#728060; --warm:#8c8880; --border:#e4e0da; --gold:#c8a96e; --red:#e63946; }
body { font-family:'DM Sans',sans-serif; background:var(--cream); color:var(--dark); }

/* REVEAL */
.reveal { opacity:0; transform:translateY(24px); transition:opacity .7s,transform .7s; }
.revealed { opacity:1; transform:none; }
.d1{transition-delay:.1s} .d2{transition-delay:.2s} .d3{transition-delay:.3s} .d4{transition-delay:.4s}

/* NAV */
.sh-nav { background:#fff; border-bottom:1px solid var(--border); height:56px; }
.sh-nav a { color:var(--dark); text-decoration:none; font-size:1rem; letter-spacing:.04em; transition:color .2s; position:relative; padding-bottom:3px; }
.sh-nav a::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1.6px; background:var(--sage); transition:width .25s; }
.sh-nav a:hover { color:var(--sage); } .sh-nav a:hover::after { width:100%; }
.sh-badge { background:var(--sage); color:#fff; font-size:.5rem; width:14px; height:14px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; position:absolute; top:-6px; right:-8px; }
.nav-icon { color:var(--dark); display:flex; align-items:center; position:relative; transition:color .2s; cursor:pointer; text-decoration:none; }
.nav-icon:hover { color:var(--sage); }

/* DROPDOWN */
.nav-item { position:relative; }
.nav-item:hover .dropdown { opacity:1; pointer-events:auto; transform:translateY(0); }
.dropdown { position:absolute; top:100%; left:0; background:#fff; border:1px solid var(--border); min-width:160px; opacity:0; pointer-events:none; transform:translateY(8px); transition:all .25s; z-index:100; box-shadow:0 8px 24px rgba(0,0,0,.08); }
.dropdown a { display:block; padding:.6rem 1.2rem; font-size:.72rem; color:var(--dark); text-decoration:none; letter-spacing:.04em; transition:background .2s; }
.dropdown a:hover { background:var(--cream); color:var(--sage); }


/* HERO */
.sh-hero { position:relative; height:490px; overflow:hidden; }
.hero-fade { position:absolute; inset:0; opacity:0; transition:opacity .8s; pointer-events:none; display:flex; align-items:center; }
.hero-fade.on { opacity:1; pointer-events:auto; }
.hero-fade img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.hero-ov { position:absolute; inset:0; background:linear-gradient(to right,rgba(248,246,242,.5) 20%,transparent 100%); }
.hero-ct { position:relative; z-index:2; max-width:460px; padding:0 5%; }
.hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,4vw,3.4rem); font-weight:400; line-height:1.12; margin-bottom:1rem; }
.hero-sub { font-size:.85rem; line-height:1.8; color:var(--warm); margin-bottom:1.8rem; }
.h-arr { position:absolute; top:50%; transform:translateY(-50%); z-index:5; background:rgba(255,255,255,.8); border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:1rem; display:flex; align-items:center; justify-content:center; transition:all .2s; }
.h-arr:hover { background:#fff; box-shadow:0 4px 16px rgba(0,0,0,.15); }
.h-arr.l { left:1rem; } .h-arr.r { right:1rem; }
.h-dots { position:absolute; bottom:1.2rem; left:50%; transform:translateX(-50%); display:flex; gap:.5rem; z-index:5; }
.hdot { width:8px; height:8px; border-radius:50%; background:rgba(26,26,24,.25); border:none; cursor:pointer; transition:all .3s; }
.hdot.on { background:var(--dark); width:22px; border-radius:4px; }

/* BUTTONS */
.sh-btn { display:inline-flex; align-items:center; padding:.72rem 1.8rem; font-size:.72rem; letter-spacing:.12em; text-transform:uppercase; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; text-decoration:none; }
.sh-btn-dk { background:var(--dark); color:#fff; } .sh-btn-dk:hover { background:var(--deep); transform:translateY(-2px); color:#fff; }
.sh-btn-ol { background:transparent; color:var(--dark); border:1.5px solid var(--dark); } .sh-btn-ol:hover { background:var(--dark); color:#fff; }
.sh-btn-sm { padding:.38rem .9rem; font-size:.65rem; }

/* SECTION TITLE */
.sec-title { font-size: 1.8rem; font-weight:430; letter-spacing:.08em; text-align:center; margin-bottom:1.8rem; }
.sec-title::after { content:''; display:block; width:40px; height:2px; background:var(--sage); margin:.6rem auto 0; }

/* BRANDS */
.brands-label { font-size:.8rem; font-weight:500;letter-spacing:.25em; text-transform:uppercase; color:var(--warm); }
.brand-arrow { background:none; border:1.5px solid var(--border); width:34px; height:34px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; flex-shrink:0; }
.brand-arrow:hover { border-color:var(--dark); background:var(--dark); color:#fff; }
.brands-wrap { overflow:hidden; width:80%; }
.brands-track { display:flex; transition:transform .6s cubic-bezier(.22,1,.36,1); }
.brand-slide { min-width:25%; display:flex; align-items:center; justify-content:center; padding:.8rem 1rem; height:80px; width:25%;}

.brand-txt { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:700; opacity:.5; cursor:pointer; transition:opacity .3s,transform .25s; white-space:nowrap; }
.brand-txt:hover { opacity:1; transform:scale(1.08); }







/* TABS */
.sh-tabs { display:flex; gap:2rem; border-bottom:1px solid var(--border); justify-content:center; margin-bottom:1.8rem; }
.sh-tab { font-size:.85rem; letter-spacing:.08em; color:var(--warm); cursor:pointer; padding-bottom:.6rem; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .2s; }
.sh-tab.on { color:var(--dark); border-bottom-color:var(--dark); }
.sh-tab:hover:not(.on) { color:var(--dark); }

/* PRODUCT CARD */
.pc { background:#fff; cursor:pointer; border:1px solid var(--border); transition:box-shadow .25s; height:100%; }
.pc:hover { box-shadow:0 8px 32px rgba(26,26,24,.1); }
.pc-img { position:relative; overflow:hidden; aspect-ratio:1/1;  background:#f0ece6; }
.pc-img img,.pc-ph { width:100%; height:100%; transition:transform .6s cubic-bezier(.22,1,.36,1); }
.pc-img img { object-fit:cover; } .pc-ph { display:flex; align-items:center; justify-content:center; }
.pc:hover .pc-img img,.pc:hover .pc-ph { transform:scale(1.06); }
.pc-ov { position:absolute; inset:0; background:rgba(26,26,24,0); transition:background .3s; }
.pc:hover .pc-ov { background:rgba(26,26,24,.08); }
.pc-wish { position:absolute; top:.7rem; right:.7rem; background:#fff; border:none; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:transform .2s; box-shadow:0 2px 8px rgba(0,0,0,.1); }
.pc-wish:hover { transform:scale(1.15); } .pc-wish.on { color:var(--red); }
.pc-qv { position:absolute; bottom:.8rem; left:50%; transform:translateX(-50%) translateY(12px); opacity:0; transition:all .28s; white-space:nowrap; padding:.4rem 1rem; font-size:.66rem; letter-spacing:.1em; text-transform:uppercase; background:#fff; color:var(--dark); border:none; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 2px 12px rgba(0,0,0,.15); }
.pc:hover .pc-qv { opacity:1; transform:translateX(-50%) translateY(0); }
.pc-brand { font-size:.68rem; letter-spacing:.15em; text-transform:uppercase; color:var(--warm); }
.pc-name { font-size:.86rem; font-weight:500; line-height:1.3; }
.p-old { font-size:.72rem; color:var(--warm); text-decoration:line-through; }
.p-new { font-size:.78rem; font-weight:600; color:var(--red); } .p-reg { font-size:.78rem; font-weight:500; }

/* TRENDING CARD */
.tc { background:#fff; border:1px solid var(--border); transition:box-shadow .25s; }
.tc:hover { box-shadow:0 6px 24px rgba(26,26,24,.1); }
.tc-img { aspect-ratio:1/1; overflow:hidden; background:#f0ece6; position:relative; cursor:pointer; }
.tc-img img,.tc-ph { width:100%; height:100%; transition:transform .5s cubic-bezier(.22,1,.36,1); }
.tc-img img { object-fit:cover; } .tc-ph { display:flex; align-items:center; justify-content:center; }
.tc:hover .tc-img img,.tc:hover .tc-ph { transform:scale(1.06); }
.tc-w { position:absolute; top:.6rem; left:.6rem; background:#fff; border:none; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.1); transition:transform .2s; }
.tc-w:hover { transform:scale(1.15); } .tc-w.on { color:var(--red); }
.tc-brand { font-size:.70rem; letter-spacing:.15em; text-transform:uppercase; color:var(--warm); }
.tc-name { font-size:.88rem; font-weight:500; }
.tc-price { font-size:.79rem; font-weight:600; } .tc-price.sale { color:var(--red); }
.tc-old { font-size:.7rem; color:var(--warm); text-decoration:line-through; }
.tc-add { width:100%; padding:.5rem; background:var(--deep); color:#fff; border:none; cursor:pointer; font-size:.68rem; letter-spacing:.1em; text-transform:uppercase; font-family:'DM Sans',sans-serif; transition:background .2s; }
.tc-add:hover { background:var(--dark); }
.tc-qty { display:flex; align-items:center; justify-content:space-between; border:1px solid var(--border); }
.tc-qty button { width:28px; height:28px; background:none; border:none; cursor:pointer; font-size:.9rem; display:flex; align-items:center; justify-content:center; }
.tc-qty button:hover { background:var(--cream); } .tc-qty span { font-size:.78rem; font-weight:500; }

/* JOIN */
.sh-join { border-top:4px double var(--dark); border-bottom:4px double var(--dark); }
.sh-join h3 { font-size:1.8rem; font-weight:600; letter-spacing:.1em; }
.sh-join a { font-size:.85rem; color:var(--deep); text-decoration:none; letter-spacing:.06em; display:inline-flex; align-items:center; gap:.3rem; font-weight:500; transition:gap .2s; }
.sh-join a:hover { gap:.6rem; }

/* WHO WE ARE */
.who-left { background:#ede9e3; }
.who-left h3 { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:400; }
.who-left p { font-size:.85rem; line-height:1.8; color:var(--warm); }
.who-right { background:linear-gradient(145deg,#4a5c40,#7a8c6e); min-height:350px; position:relative; overflow:hidden; }
.who-right img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }

/* CATEGORIES */
.sh-cat { position:relative; overflow:hidden; aspect-ratio:1/1; cursor:pointer; text-decoration:none; border-radius:13px; display:block; }
.cat-bg,.sh-cat img { width:100%; height:100%; object-fit:cover; object-position: center top;transition:transform .7s cubic-bezier(.22,1,.36,1); }
.sh-cat:hover .cat-bg,.sh-cat:hover img { transform:scale(1.08); }
.cat-ov { position:absolute; inset:0; background:linear-gradient(transparent 45%,rgba(26,26,24,.68) 100%); }
.cat-ct { position:absolute; bottom:0; left:0; right:0; padding:1.4rem; color:#fff; }
.cat-name { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:300; letter-spacing:.08em; transition:transform .28s; }
.sh-cat:hover .cat-name { transform:translateY(-4px); }
.cat-sub { font-size:.65rem; opacity:0; letter-spacing:.15em; text-transform:uppercase; transition:opacity .3s,transform .3s; transform:translateY(6px); }
.sh-cat:hover .cat-sub { opacity:.75; transform:none; }

/* EDITORIAL */
.sh-ed { position:relative; overflow:hidden; height:350px; cursor:pointer; text-decoration:none; display:block; }
.ed-bg,.sh-ed img { width:100%; height:100%; transition:transform .55s cubic-bezier(.22,1,.36,1); }
.sh-ed img { object-fit:cover; } .sh-ed:hover .ed-bg,.sh-ed:hover img { transform:scale(1.06); }
.ed-ov { position:absolute; inset:0; background:linear-gradient(transparent 25%,rgba(26,26,24,.72) 100%); }
.ed-ct { position:absolute; bottom:0; left:0; right:0; padding:1.4rem; color:#fff; }
.ed-tag { font-size:.60rem; letter-spacing:.2em; text-transform:uppercase; color:var(--gold); }
.ed-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:300; transition:letter-spacing .3s; }
.sh-ed:hover .ed-title { letter-spacing:.04em; }

/* TRUST */
.trust-icon { font-size:1.5rem; }
.trust-label { font-size:.7rem; font-weight:600; letter-spacing:.05em; }
.trust-sub { font-size:.65rem; color:var(--warm); line-height:1.5; }

/* FOOTER */
.sh-foot { background:var(--deep); color:rgba(255,255,255,.8); }
.f-logo-txt { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:500; color:#fff; text-decoration:none; }
.f-about { font-size:.78rem; line-height:1.7; color:rgba(255,255,255,.55); }
.f-soc { width:30px; height:30px; border:1px solid rgba(255,255,255,.3); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.65rem; color:rgba(255,255,255,.6); text-decoration:none; transition:all .2s; }
.f-soc:hover { background:rgba(255,255,255,.15); color:#fff; }
.f-col-title { font-size:.64rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.45); font-weight:500; }
.f-col a { display:block; font-size:.78rem; color:rgba(255,255,255,.7); text-decoration:none; transition:all .2s; }
.f-col a:hover { color:#fff; transform:translateX(3px); }
.f-copy { font-size:.7rem; color:rgba(255,255,255,.35); }
.fpb { background:rgba(255,255,255,.12); border-radius:3px; padding:.2rem .5rem; font-size:.58rem; color:rgba(255,255,255,.6); font-weight:600; }

/* MODAL */
.mbk { position:fixed; inset:0; background:rgba(26,26,24,.65); z-index:800; display:flex; align-items:center; justify-content:center; padding:1rem; animation:fi .2s; }
.sh-modal { background:#fff; width:100%; max-width:860px; max-height:92vh; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; position:relative; animation:su .32s cubic-bezier(.22,1,.36,1); }
.m-img { display:flex; align-items:center; justify-content:center; position:sticky; top:0; align-self:flex-start; min-height:400px; background:#f0ece6; }
.m-img img { width:100%; height:100%; object-fit:cover; }
.m-ph { width:100%; min-height:400px; display:flex; align-items:center; justify-content:center; }
.m-brand { font-size:.62rem; letter-spacing:.2em; text-transform:uppercase; color:var(--warm); }
.m-name { font-family:'Cormorant Garamond',serif; font-size:1.9rem; font-weight:400; line-height:1.1; }
.m-price { font-size:1.25rem; font-weight:600; }
.m-oprice { font-size:.85rem; color:var(--warm); text-decoration:line-through; }
.m-desc { font-size:.82rem; line-height:1.82; color:var(--warm); }
.m-lbl { font-size:.63rem; letter-spacing:.18em; text-transform:uppercase; font-weight:600; }
.sw { width:24px; height:24px; border-radius:50%; cursor:pointer; transition:transform .2s,box-shadow .2s; border:2px solid transparent; }
.sw.on { box-shadow:0 0 0 2px var(--dark); transform:scale(1.12); }
.sz { padding:.4rem .85rem; font-size:.7rem; border:1.5px solid var(--border); background:transparent; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; }
.sz.on { border-color:var(--dark); background:var(--dark); color:#fff; }
.sz:hover:not(.on) { border-color:var(--dark); }
.m-close { position:absolute; top:1rem; right:1rem; width:34px; height:34px; background:#fff; border:none; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 16px rgba(26,26,24,.12); z-index:10; transition:transform .25s; }
.m-close:hover { transform:rotate(90deg) scale(1.1); }
.m-rc { font-size:.7rem; color:var(--warm); }
.sh-toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(20px); background:var(--dark); color:#fff; padding:.8rem 2rem; font-size:.76rem; letter-spacing:.1em; z-index:1000; opacity:0; transition:all .4s; pointer-events:none; white-space:nowrap; }
.sh-toast.on { opacity:1; transform:translateX(-50%) translateY(0); }
@keyframes fi { from{opacity:0} to{opacity:1} }
@keyframes su { from{opacity:0;transform:translateY(26px) scale(.98)} to{opacity:1;transform:none} }
@media(max-width:768px) {
  .sh-hero { height:360px; }
  .sh-modal { grid-template-columns:1fr; }
  .m-img { min-height:220px; position:relative; }
}
`;

// ─── PRODUCT CARD ───
function PCard({ p, onOpen, addRef, d = 1, wish, toggleWish }) {
  const navigate = useNavigate();
  return (
    <div className={`pc d${d}`} ref={addRef} onClick={() => navigate(`/product/${p.id}`)}>
      <div className="pc-img">
        {p.img ? <img src={p.img} alt={p.name} /> : <div className="pc-ph" style={{ background: `linear-gradient(${p.gradient})` }}><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "rgba(255,255,255,.25)" }}>{p.brand}</span></div>}
        <div className="pc-ov" />
        <button className={`pc-wish${wish.includes(p.id) ? " on" : ""}`} onClick={e => { e.stopPropagation(); toggleWish(p.id) }}><Heart on={wish.includes(p.id)} /></button>
        <button className="pc-qv" onClick={e => { e.stopPropagation(); onOpen(p) }}>Quick View</button>
      </div>
      <div className="p-2">
        <div className="pc-brand mb-1" style={{ cursor: "pointer" }} onClick={e => { e.stopPropagation(); navigate(`/brand/${encodeURIComponent(p.brand)}`); }}>{p.brand}</div>
        <div className="pc-name mb-1">{p.name}</div>
        <div className="d-flex gap-2 align-items-center">
          {p.oldPrice && <span className="p-old">{p.oldPrice}</span>}
          <span className={p.oldPrice ? "p-new" : "p-reg"}>{p.price}</span>
        </div>
      </div>
    </div>
  );
}
// ─── TRENDING CARD ───
function TCard({ p, onOpen, addRef, d = 1, wish, toggleWish, onAdd }) {
  const [qty, setQty] = useState(0);
  const navigate = useNavigate();
  return (
    <div className={`tc d${d}`} ref={addRef}>
      <div className="tc-img" onClick={() => navigate(`/product/${p.id}`)}>
        {p.img ? <img src={p.img} alt={p.name} /> : <div className="tc-ph" style={{ background: `linear-gradient(${p.gradient})` }}><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "rgba(255,255,255,.25)" }}>{p.brand}</span></div>}
        <button className={`tc-w${wish.includes(p.id) ? " on" : ""}`} onClick={e => { e.stopPropagation(); toggleWish(p.id) }}><Heart on={wish.includes(p.id)} /></button>
      </div>
      <div className="p-2">
        <div className="tc-brand" style={{ cursor: "pointer" }} onClick={e => { e.stopPropagation(); navigate(`/brand/${encodeURIComponent(p.brand)}`); }}>{p.brand}</div>
        <div className="tc-name my-1">{p.name}</div>
        <div className="d-flex align-items-center gap-1 mb-1">
          {p.oldPrice && <span className="tc-old">{p.oldPrice}</span>}
          <span className={`tc-price${p.oldPrice ? " sale" : ""}`}>{p.price}</span>
        </div>
        {qty === 0
          ? <button className="tc-add" onClick={() => { setQty(1); onAdd(); }}>Add to Cart</button>
          : <div className="tc-qty mt-1"><button onClick={() => setQty(q => Math.max(0, q - 1))}>−</button><span>{qty}</span><button onClick={() => setQty(q => q + 1)}>+</button></div>
        }
      </div>
    </div>
  );
}

// ─── TRENDING CAROUSEL ───
function TrendingCarousel({ products, onOpen, wish, toggleWish, onAdd }) {
  const [cur, setCur] = useState(0);
  const visible = 4;
  const max = products.length - visible;

  useEffect(() => {
    const t = setInterval(() => setCur(c => c >= max ? 0 : c + 1), 3000);
    return () => clearInterval(t);
  }, [max]);


  if (!products.length) return null;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", transition: "transform .2s ease", transform: `translateX(-${cur * (100 / visible)}%)` }}>
          {products.map((p, i) => (
            <div key={p.id} style={{ minWidth: `${100 / visible}%`, padding: "0 .5rem", boxSizing: "border-box" }}>
              <TCard p={p} onOpen={onOpen} addRef={() => { }} d={(i % 4) + 1} wish={wish} toggleWish={toggleWish} onAdd={onAdd} />
            </div>
          ))}
        </div>
      </div>
      {cur > 0 && <button className="h-arr l" onClick={() => setCur(c => c - 1)}>‹</button>}
      {cur < max && <button className="h-arr r" onClick={() => setCur(c => c + 1)}>›</button>}
    </div>
  );
}

// ─── MODAL ───
function Modal({ p, onClose, onAdd }) {
  const [sc, setSc] = useState(0);
  const [ss, setSs] = useState(null);
  const [done, setDone] = useState(false);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div className="mbk" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sh-modal">
        <button className="m-close" onClick={onClose}>✕</button>
        <div className="m-img">
          {p.img ? <img src={p.img} alt={p.name} /> : <div className="m-ph" style={{ background: `linear-gradient(${p.gradient})`, width: "100%" }}><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "4rem", color: "rgba(255,255,255,.2)", fontWeight: 300 }}>{p.brand[0]}</span></div>}
        </div>
        <div className="p-4">
          <div className="m-brand mb-1">{p.brand}</div>
          <div className="m-name mb-2">{p.name}</div>
          <div className="d-flex align-items-center gap-1 mb-3"><Stars n={p.rating} /><span className="m-rc ms-1">{p.rating} · {p.reviews} reviews</span></div>
          <div className="m-price">{p.price}</div>
          {p.oldPrice && <div className="m-oprice mb-3">Was {p.oldPrice}</div>}
          <p className="m-desc mb-3">{p.desc}</p>
          <div className="m-lbl mb-2">Color</div>
          <div className="d-flex gap-2 mb-3">{p.colors.map((c, i) => <div key={i} className={`sw${sc === i ? " on" : ""}`} style={{ background: c }} onClick={() => setSc(i)} />)}</div>
          <div className="m-lbl mb-2">Size {!ss && <span style={{ color: "var(--red)", fontWeight: 400, fontSize: ".6rem", marginLeft: "6px" }}>— select size</span>}</div>
          <div className="d-flex flex-wrap gap-1 mb-4">{p.sizes.map(s => <button key={s} className={`sz${ss === s ? " on" : ""}`} onClick={() => setSs(s)}>{s}</button>)}</div>
          <div className="d-flex flex-column gap-2">
            <button className="sh-btn sh-btn-dk justify-content-center" style={{ opacity: ss ? 1 : .45 }} onClick={() => { if (!ss) return; setDone(true); onAdd(); setTimeout(() => setDone(false), 1800) }}>{done ? "✓  Added to Bag" : "Add to Bag"}</button>
            <button className="sh-btn sh-btn-ol justify-content-center">♡  Save to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BRANDS CAROUSEL ───
function BrandsCarousel() {
  const [idx, setIdx] = useState(0);
  const max = BRANDS.length - 4;
  useEffect(() => { const t = setInterval(() => setIdx(i => i >= max ? 0 : i + 1), 2500); return () => clearInterval(t); }, [max]);
  return (
    <section className="py-4 border-bottom bg-white">
      <p className="brands-label text-center mb-3">Featured Brands</p>
      <div className="d-flex align-items-center justify-content-center gap-2">
        <button className="brand-arrow" onClick={() => setIdx(i => i <= 0 ? max : i - 1)}>‹</button>
        <div className="brands-wrap">
          <div className="brands-track" style={{ transform: `translateX(-${idx * 25}%)` }}>
            {BRANDS.map((b, i) => (
              <div key={i} className="brand-slide">
                <a href={b.href} style={{ textDecoration: "none", color: "inherit" }}>
                  {b.logo ? <img src={b.logo} alt={b.name} style={{ height: "50px", width: "130px", objectFit: "contain" }} /> : <span className="brand-txt">{b.name}</span>}                </a>
              </div>
            ))}
          </div>
        </div>
        <button className="brand-arrow" onClick={() => setIdx(i => i >= max ? 0 : i + 1)}>›</button>
      </div>
    </section>
  );
}

// ─── HERO CAROUSEL ───
const SLIDES = [
  { img: "/12.jpg", title: "Discover Local Fashion,\nAll in One Place", sub: "Shop the finest Egyptian designers. Curated collections, exclusive drops.", btn: "Shop Now", href: "#" },
  { img: "/sec.jpg", title: "Build Your\nPerfect Outfit", sub: "Mix and match pieces from Egypt's top local designers — all in one place.", btn: "Build an Outfit", href: "#" },
]
function HeroCarousel() {
  const [cur, setCur] = useState(0);
  useEffect(() => { const t = setInterval(() => setCur(c => c === 0 ? 1 : 0), 4000); return () => clearInterval(t); }, []);
  return (
    <section className="sh-hero">
      {SLIDES.map((s, i) => (
        <div key={i} className={`hero-fade${cur === i ? " on" : ""}`} style={{ background: s.bg }}>
          {s.img && <img src={s.img} alt="hero" />}
          <div className="hero-ov" />
          <div className="hero-ct">
            <h1 className="hero-title">{s.title.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}</h1>
            <p className="hero-sub">{s.sub}</p>
            <a href={s.href} className="sh-btn sh-btn-dk">{s.btn}</a>
          </div>
        </div>
      ))}
      <button className="h-arr l" onClick={() => setCur(c => c === 0 ? 1 : 0)}>‹</button>
      <button className="h-arr r" onClick={() => setCur(c => c === 0 ? 1 : 0)}>›</button>
      <div className="h-dots">
        <button className={`hdot${cur === 0 ? " on" : ""}`} onClick={() => setCur(0)} />
        <button className={`hdot${cur === 1 ? " on" : ""}`} onClick={() => setCur(1)} />
      </div>
    </section>
  );
}

// ─── APP ───
export default function App() {
  const [tab, setTab] = useState("best");
  const [modal, setModal] = useState(null);
  // ─── CART — persisted via api.js (swap to backend by setting USE_BACKEND=true) ───
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stylehub-cart") || "[]"); }
    catch { return []; }
  });
  useEffect(() => { saveCart(cart); }, [cart]);

  // ─── WISHLIST — persisted via api.js ───────────────────────────────────────
  const [wish, setWish] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stylehub-wish") || "[]"); }
    catch { return []; }
  });
  useEffect(() => { saveWishlist(wish); }, [wish]);

  // ─── SELLER AUTH — via api.js ──────────────────────────────────────────────
  const [sellerLoggedIn, setSellerLoggedIn] = useState(() => isSellerLoggedIn());

  const handleSellerLogin = () => setSellerLoggedIn(true);
  const handleSellerLogout = () => { sellerSignOut(); setSellerLoggedIn(false); };







  const [toast, setToast] = useState("");
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch backend products for home page
  useEffect(() => {
    const API = "https://stylehub-backend-tau.vercel.app/api";
    Promise.all([
      fetch(`${API}/products?category=women&limit=20&t=${Date.now()}`).then(r => r.json()),
      fetch(`${API}/products?category=men&limit=20&t=${Date.now()}`).then(r => r.json()),
      fetch(`${API}/products?category=kids&limit=20&t=${Date.now()}`).then(r => r.json()),
    ]).then(([w, m, k]) => {
      const mapP = p => ({
        id: p._id, _id: p._id, name: p.name,
        brand: p.seller?.brandName || "StyleHub",
        price: `LE ${p.price?.toLocaleString()}`,
        oldPrice: p.salePrice ? `LE ${p.salePrice?.toLocaleString()}` : null,
        img: p.images?.[0] ? (p.images[0].startsWith("http") ? p.images[0] : `https://stylehub-backend-tau.vercel.app${p.images[0]}`) : null,
        sizes: p.sizes || [], colors: p.colors || [],
        rating: p.avgRating || 0, reviews: p.reviewCount || 0,
        tab: "best", category: p.category,
      });
      const all = [
        ...(w.data?.products || []).map(mapP),
        ...(m.data?.products || []).map(mapP),
        ...(k.data?.products || []).map(mapP),
      ];
      setBackendProducts(all);
    }).catch(() => { });
  }, []);
  const addRef = useScrollReveal();
  const location = useLocation();

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 2200); };
  const addToCart = (id, size = "M") => {
    setCart(prev => {
      const existing = prev.find(x => x.id === id && x.size === size);
      if (existing) return prev.map(x => x.id === id && x.size === size ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { id, size, qty: 1 }];
    });
    showToast("✓ Added to bag");
  };
  const toggleWish = id => { setWish(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]); showToast(wish.includes(id) ? "Removed from wishlist" : "♥ Added to wishlist"); };

  return (
    <Routes>
      <Route path="/product/:id" element={<ProductDetail cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/cart" element={<Cart cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/kids" element={<Kids cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/women" element={<Women cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/signin" element={<SignIn cart={cart} wish={wish} />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/brand/blackcloset" element={<BlackCloset cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/brand/salty" element={<Salty cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/brand/ninos" element={<Ninos cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/brand/27" element={<TwentySeven cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/brand/:brandSlug" element={<SellerBrandPage cart={cart} wish={wish} setWish={setWish} />} />
      <Route path="/wishlist" element={<Wishlist cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/profile" element={<ProfilePage cart={cart} wish={wish} />} />
      <Route path="/men" element={<MenPage cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/menpage" element={<MenPage cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/seller" element={sellerLoggedIn ? <SellerDashboard onLogout={handleSellerLogout} /> : <Seller onSellerLoggedIn={handleSellerLogin} cart={cart} wish={wish} />} />
      <Route path="/seller/dashboard" element={sellerLoggedIn ? <SellerDashboard onLogout={handleSellerLogout} /> : <Seller onSellerLoggedIn={handleSellerLogin} cart={cart} wish={wish} />} />
      <Route path="/buildoutfit" element={<BuildOutfit cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/BuildOutfit" element={<BuildOutfit cart={cart} setCart={setCart} wish={wish} setWish={setWish} />} />
      <Route path="/aboutus" element={<AboutUs cart={cart} wish={wish} />} />
      <Route path="/contact" element={<ContactPage cart={cart} wish={wish} />} />

      <Route path="/" element={
        <div key={location.key}>
          <style>{CSS}</style>



          {/* NAV */}
          <SHNav cart={cart} wish={wish} />

          {/* HERO */}
          <HeroCarousel />

          {/* BRANDS */}
          <BrandsCarousel />

          {/* PRODUCTS */}
          <section style={{ padding: " 7rem" }} className="py-3 my-5">
            <div className="sh-tabs reveal" ref={addRef}>
              {[["best", "Best Sellers"], ["new", "New Arrivals"], ["sale", "Sale"]].map(([key, label]) => (
                <div key={key} className={`sh-tab${tab === key ? " on" : ""}`} onClick={() => setTab(key)}>{label}</div>
              ))}
            </div>
            <div className="row row-cols-2 row-cols-md-3 g-3">
              {(backendProducts.length > 0 ? backendProducts : PRODUCTS.filter(p => p.tab === tab)).slice(0, 6).map((p, i) => (
                <div className="col" key={p.id}>
                  <PCard p={p} onOpen={setModal} addRef={addRef} d={(i % 3) + 1} wish={wish} toggleWish={toggleWish} />
                </div>
              ))}
            </div>
          </section>

          {/* JOIN */}
          <div className="sh-join text-center reveal py-5 mx-4 " ref={addRef} style={{ marginTop: "7rem" }} >
            <h3 className="mb-2">Join Style Hub</h3>
            <a href="/seller">Sell with us ›</a>
          </div>

          {/* WHO WE ARE */}
          <div className="row g-0 mx-4 reveal" ref={addRef} style={{ marginTop: "8rem" }}>
            <div className="col-md-6 who-left p-5 d-flex flex-column justify-content-center">
              <h3 className="mb-3">Who We Are?</h3>
              <p className="mb-4">We support local Egyptian fashion brands and help them reach customers across Egypt — all in one place.</p>
              <div><button className="sh-btn sh-btn-ol sh-btn-sm">Learn more ›</button></div>
            </div>
            <div className="col-md-6 who-right">
              <img src="/who.jpg" alt="support local" />
            </div>
          </div>

          {/* CATEGORIES */}
          <section className="px-4 py-4 " style={{ marginTop: "8rem" }}>
            <div className="sec-title reveal" ref={addRef}>Shop By Categories</div>
            <div className="row g-3">
              {CATS.map((c, i) => (
                <div className="col-md-4" key={c.name}>
                  <a href={c.link} className={`sh-cat revealed d${i + 1}`} ref={addRef}>
                    {c.img ? <img src={c.img} alt={c.name} /> : <div className="cat-bg d-flex align-items-center justify-content-center" style={{ background: `linear-gradient(${c.gradient})`, height: "100%" }}><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "4rem", color: "rgba(255,255,255,.15)", fontWeight: 300 }}>{c.name[0]}</span></div>}
                    <div className="cat-ov" />
                    <div className="cat-ct"><div className="cat-name">{c.name}</div><div className="cat-sub mt-1">Shop Now →</div></div>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* TRENDING */}
          <section className="px-4 py-4 " style={{ marginTop: "6rem" }}>
            <div className="sec-title reveal" ref={addRef}>Trending Now</div>
            <TrendingCarousel products={backendProducts.length > 0 ? backendProducts.slice(6, 12) : PRODUCTS.filter(p => p.tab === "trend")} onOpen={setModal} wish={wish} toggleWish={toggleWish} onAdd={addToCart} />
          </section>

          {/* TOP PICKS */}
          <section className="px-4 py-4 " style={{ marginTop: "6rem" }}  >
            <div className="sec-title reveal" ref={addRef}>Top Picks</div>
            <div className="row row-cols-2 row-cols-md-4 g-3">
              {backendProducts.length > 0 ? backendProducts.slice(12, 16) : PRODUCTS.filter(p => p.tab === "picks").map((p, i) => (
                <div className="col" key={p.id}>
                  <TCard p={p} onOpen={setModal} addRef={addRef} d={(i % 4) + 1} wish={wish} toggleWish={toggleWish} onAdd={addToCart} />
                </div>
              ))}
            </div>
          </section>

          {/* EDITORIAL */}
          <div className="row g-3 px-4  pt-3  reveal" ref={addRef} style={{ marginTop: "8rem", marginBottom: "12rem" }}  >
            {[
              { tag: "Editorial", title: "Discover Latest in Fashion", gradient: "145deg,#8a9a7a,#4a5c40", img: "/edit.png", href: "#" },
              { tag: "Explore", title: "Explore Fashion New Era", gradient: "145deg,#c4a882,#8a7060", img: "/ban.jpg", href: "#" },
            ].map((e, i) => (
              <div className="col-md-6" key={i}>
                <a href={e.href} className="sh-ed">
                  {e.img ? <img src={e.img} alt={e.title} /> : <div className="ed-bg" style={{ background: `linear-gradient(${e.gradient})` }} />}
                  <div className="ed-ov" />
                  <div className="ed-ct"><div className="ed-tag mb-1">{e.tag}</div><div className="ed-title">{e.title}</div></div>
                </a>
              </div>
            ))}
          </div>

          {/* TRUST */}
          <div className="d-flex justify-content-center gap-5 py-4 border-top reveal flex-wrap" ref={addRef}>
            {[
              { icon: "🚚", label: "100% Free Shipping", sub: "Free shipping on all orders" },
              { icon: "↩", label: "Easy Returns", sub: "30-day hassle-free returns" },
              { icon: "🎧", label: "24/7 Online Support", sub: "We're here whenever you need us" },
            ].map((t, i) => (
              <div key={i} className="text-center" style={{ maxWidth: 180 }}>
                <div className="trust-icon mb-2">{t.icon}</div>
                <div className="trust-label mb-1">{t.label}</div>
                <div className="trust-sub">{t.sub}</div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <SHFooter addRef={addRef} />

          {modal && <Modal p={modal} onClose={() => setModal(null)} onAdd={addToCart} />}
          <div className={`sh-toast${toast ? " on" : ""}`}>{toast}</div>
        </div>
      } />
    </Routes>
  );
}
