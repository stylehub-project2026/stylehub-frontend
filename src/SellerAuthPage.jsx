import React from "react";
import { useState } from "react";
import { sellerAuthAPI, authAPI } from "./api.jsx";
import { signInWithGoogle, signInWithFacebook } from "./firebase";
import { SHNav, SHFooter, SHARED_CSS } from "./shared";


/* ─────────────────────────────────────────
   STYLES — same palette / fonts as SignInPage
───────────────────────────────────────── */
const CSS = `

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green:       #7b8b5b;
  --green-dark:  #5e6d41;
  --green-light: #e3e8d9;
  --green-mid:   #d4dcbe;
  --footer-bg:   #92a079;
  --white:       #ffffff;
  --gray-text:   #888;
  --border:      #e0e0e0;
  --shadow:      0 20px 50px rgba(0,0,0,0.09);
  --radius-card: 22px;
  --font:        'Jost', sans-serif;
}

body { font-family: var(--font); background: #f5f7f0; }

/* ── PAGE ── */
.seller-page { min-height: 100vh; display: flex; flex-direction: column; }

/* ── HERO ── */
.seller-hero {
  background: linear-gradient(135deg, #5e6d41 0%, #7b8b5b 50%, #92a079 100%);
  color: #fff;
  padding: 5rem 2.5rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.seller-hero::before {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.seller-hero-badge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 30px;
  padding: .38rem 1.1rem;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 1.4rem;
  backdrop-filter: blur(6px);
}
.seller-hero h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.1rem;
}
.seller-hero h1 em { font-style: normal; opacity: .75; }
.seller-hero p {
  font-size: 1.05rem;
  font-weight: 400;
  opacity: .82;
  max-width: 560px;
  margin: 0 auto 2.5rem;
  line-height: 1.65;
}
  .seller-auth-card {
  position: relative;
  z-index: 10;
}

.seller-main {
  flex: 1;
  display: flex;
  gap: 0;
  max-width: 1160px;
  margin: 3.5rem auto;
  padding: 0 2rem;
  width: 100%;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.benefits-panel {
  pointer-events: none;
}
  
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  position: relative;
}
.hero-stat { text-align: center; }
.hero-stat strong { display: block; font-size: 1.8rem; font-weight: 800; }
.hero-stat span { font-size: .75rem; opacity: .7; letter-spacing: .5px; font-weight: 500; }

/* ── PERKS STRIP ── */
.perks-strip {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 1.6rem 2.5rem;
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}
.perk {
  display: flex; align-items: center; gap: .7rem;
  font-size: .82rem; font-weight: 600; color: #444;
}
.perk i { color: var(--green); font-size: 1.05rem; }

/* ── MAIN LAYOUT ── */
.seller-main {
  flex: 1;
  display: flex;
  gap: 0;
  max-width: 1160px;
  margin: 3.5rem auto;
  padding: 0 2rem;
  width: 100%;
  align-items: flex-start;
}

/* ── BENEFITS PANEL ── */
.benefits-panel {
  flex: 1;
  padding-right: 4rem;
}
.benefits-panel h2 {
  font-size: 1.7rem;
  font-weight: 800;
  color: #1a1a18;
  margin-bottom: .5rem;
  line-height: 1.25;
}
.benefits-panel h2 span { color: var(--green); }
.benefits-panel > p {
  font-size: .88rem;
  color: var(--gray-text);
  line-height: 1.65;
  margin-bottom: 2.2rem;
}
.benefit-list { display: flex; flex-direction: column; gap: 1.3rem; }
.benefit-item {
  display: flex;
  gap: 1.1rem;
  align-items: flex-start;
  padding: 1.2rem;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  transition: box-shadow .2s, border-color .2s;
}
.benefit-item:hover {
  box-shadow: 0 8px 24px rgba(91,109,65,.1);
  border-color: var(--green-mid);
}
.benefit-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--green-light);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
  color: var(--green-dark);
}
.benefit-text h4 { font-size: .9rem; font-weight: 700; color: #222; margin-bottom: .25rem; }
.benefit-text p { font-size: .8rem; color: var(--gray-text); line-height: 1.55; }

.testimonial-box {
  margin-top: 2rem;
  background: var(--green-light);
  border-radius: 16px;
  padding: 1.4rem;
  border-left: 4px solid var(--green);
}
.testimonial-box p { font-size: .84rem; color: #444; line-height: 1.6; font-style: italic; margin-bottom: .8rem; }
.testimonial-author {
  display: flex; align-items: center; gap: .7rem;
}
.t-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--green); display: flex; align-items: center;
  justify-content: center; font-size: .75rem; font-weight: 800; color: #fff;
}
.t-name { font-size: .78rem; font-weight: 700; color: #333; }
.t-store { font-size: .72rem; color: var(--gray-text); }

/* ── AUTH CARD ── */
.seller-auth-card {
  width: 460px;
  flex-shrink: 0;
  background: #fff;
  border-radius: var(--radius-card);
  padding: 2.6rem 2.4rem;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}
.seller-auth-card::before {
  content: '';
  position: absolute; top: -60px; right: -60px;
  width: 170px; height: 170px; border-radius: 50%;
  background: var(--green-light); opacity: .5;
  pointer-events: none;
}

/* Tab toggle */
.card-tabs {
  display: flex;
  background: var(--green-light);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 1.8rem;
}
.card-tab {
  flex: 1; border: none; background: transparent; cursor: pointer;
  font-family: var(--font); font-size: .82rem; font-weight: 600;
  letter-spacing: .5px; padding: .55rem; border-radius: 9px;
  color: var(--green-dark); transition: all .22s;
}
.card-tab.active {
  background: #fff;
  color: var(--green-dark);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.seller-tag {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--green-light);
  border: 1px solid var(--green-mid);
  border-radius: 20px;
  padding: .28rem .9rem;
  font-size: .72rem; font-weight: 700; color: var(--green-dark);
  letter-spacing: .5px;
  margin-bottom: 1rem;
}
.card-title {
  font-size: 1.65rem; font-weight: 800; color: #222;
  margin-bottom: 1.4rem; line-height: 1.2;
}
.card-title span { color: var(--green); }

/* Inputs */
.sh-label {
  display: block; font-size: .78rem; font-weight: 700;
  color: #555; margin-bottom: .45rem; letter-spacing: .3px;
}
.sh-input {
  width: 100%; padding: 11px 16px;
  background: var(--green-light); border: 2px solid transparent;
  border-radius: 11px; font-family: var(--font); font-size: .9rem;
  color: #333; outline: none; transition: all .2s;
  margin-bottom: 1rem;
}
.sh-input:focus { border-color: var(--green); background: var(--green-mid); }
.sh-input.error { border-color: #e74c3c; background: #fdf0ee; }
.sh-input-wrap { position: relative; }
.sh-input-wrap .sh-input { margin-bottom: 0; }
.sh-eye {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #888;
  font-size: .9rem; padding: 4px;
}
.sh-mb { margin-bottom: 1rem; }
.sh-name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* Submit */
.sh-btn {
  width: 100%; padding: 13px;
  background: var(--green); color: #fff; border: none; border-radius: 25px;
  font-family: var(--font); font-size: .86rem; font-weight: 700; letter-spacing: 1px;
  cursor: pointer; transition: all .25s; margin-top: .5rem;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.sh-btn:hover:not(:disabled) {
  background: var(--green-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(91,109,65,.25);
}
.sh-btn:active:not(:disabled) { transform: translateY(0); }
.sh-btn:disabled { opacity: .55; cursor: not-allowed; }

/* Divider */
.sh-divider { display: flex; align-items: center; gap: 12px; margin: 1.2rem 0; }
.sh-divider hr { flex: 1; border: none; border-top: 1.5px solid var(--border); }
.sh-divider span { font-size: .76rem; color: var(--gray-text); white-space: nowrap; }

/* Social */
.sh-social { display: flex; gap: 10px; }
.sh-social-btn {
  flex: 1; padding: 10px; border: 1.5px solid var(--border); background: #fff;
  border-radius: 11px; font-family: var(--font); font-size: .8rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .2s; color: #333;
}
.sh-social-btn:hover { border-color: var(--green); background: var(--green-light); }

/* Switch */
.sh-switch { text-align: center; margin-top: 1.4rem; font-size: .83rem; color: var(--gray-text); }
.sh-switch button {
  color: var(--green); font-weight: 700; cursor: pointer;
  background: none; border: none; font-family: var(--font); font-size: .83rem;
  text-decoration: underline; margin-left: 4px;
}
.sh-switch button:hover { color: var(--green-dark); }

/* Alerts */
.sh-alert {
  border-radius: 10px; padding: 10px 14px; font-size: .83rem;
  margin-bottom: 1rem; font-weight: 500;
}
.sh-alert-success { background: #edf7ee; color: #2d7a35; border: 1px solid #b8e6bc; }
.sh-alert-error   { background: #fdf0ee; color: #c0392b; border: 1px solid #f5c6c2; }

/* Forgot link */
.forgot-link {
  text-align: right; font-size: .76rem; color: var(--green);
  cursor: pointer; font-weight: 600; background: none; border: none;
  font-family: var(--font); width: 100%;
  margin-top: -.4rem; margin-bottom: .7rem;
  transition: color .2s;
}
.forgot-link:hover { color: var(--green-dark); text-decoration: underline; }

/* Password strength */
.str-bar { height: 4px; border-radius: 2px; background: var(--border); margin-top: .45rem; overflow: hidden; }
.str-fill { height: 100%; border-radius: 2px; transition: width .3s, background .3s; }
.str-lbl { font-size: .7rem; margin-top: 4px; font-weight: 600; letter-spacing: .4px; }

/* Checkbox */
.sh-check-row {
  display: flex; align-items: flex-start; gap: 10px;
  margin-bottom: 1rem; font-size: .8rem; color: #555;
}
.sh-check-row input[type="checkbox"] { accent-color: var(--green); width: 15px; height: 15px; flex-shrink: 0; margin-top: 2px; }
.sh-check-row a { color: var(--green); font-weight: 600; }

/* Steps indicator */
.step-dots { display: flex; gap: 6px; margin-bottom: 1.6rem; }
.step-dot { height: 4px; border-radius: 2px; flex: 1; transition: all .4s; }

/* Shop type */
.shop-types { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1rem; }
.shop-type-btn {
  padding: .85rem .5rem; border: 2px solid var(--border); border-radius: 12px;
  background: #fff; cursor: pointer; text-align: center; transition: all .2s;
  font-family: var(--font);
}
.shop-type-btn:hover { border-color: var(--green); background: var(--green-light); }
.shop-type-btn.selected { border-color: var(--green); background: var(--green-light); }
.shop-type-btn i { display: block; font-size: 1.2rem; color: var(--green); margin-bottom: .4rem; }
.shop-type-btn span { font-size: .75rem; font-weight: 700; color: #333; letter-spacing: .3px; }

/* Select */
.sh-select {
  width: 100%; padding: 11px 16px;
  background: var(--green-light); border: 2px solid transparent;
  border-radius: 11px; font-family: var(--font); font-size: .9rem;
  color: #333; outline: none; transition: all .2s;
  margin-bottom: 1rem; appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b8b5b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}
.sh-select:focus { border-color: var(--green); background-color: var(--green-mid); }

/* Textarea */
.sh-textarea {
  width: 100%; padding: 11px 16px;
  background: var(--green-light); border: 2px solid transparent;
  border-radius: 11px; font-family: var(--font); font-size: .9rem;
  color: #333; outline: none; transition: all .2s;
  margin-bottom: 1rem; resize: vertical; min-height: 80px; line-height: 1.5;
}
.sh-textarea:focus { border-color: var(--green); background: var(--green-mid); }

/* Animations */
.fade-up { animation: fadeUp .32s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* ── FOOTER ── */
.sh-footer { background: var(--footer-bg); color: rgba(255,255,255,.85); padding: 2.5rem 0 0; margin-top: auto; }
.sh-f-inner { max-width: 1200px; margin: 0 auto; padding: 0 2.5rem; }
.sh-f-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.2rem; color: #fff; margin-bottom: .8rem; }
.sh-f-desc { font-size: .82rem; color: rgba(255,255,255,.7); line-height: 1.65; margin-bottom: 1.2rem; }
.sh-f-bar {
  border-top: 1px solid rgba(255,255,255,.15); margin-top: 2rem;
  padding: 1.1rem 0; text-align: center;
  font-size: .73rem; color: rgba(255,255,255,.45);
}

@media (max-width: 1024px) {
  .seller-main { flex-direction: column; align-items: stretch; }
  .benefits-panel { padding-right: 0; padding-bottom: 2.5rem; }
  .seller-auth-card { width: 100%; }
}
@media (max-width: 600px) {
  .seller-auth-card { padding: 1.8rem 1.4rem; }
  .seller-hero { padding: 4rem 1.5rem 3rem; }
  .hero-stats { gap: 1.5rem; }
  .sh-name-row { grid-template-columns: 1fr; }
  .shop-types { grid-template-columns: 1fr 1fr; }
}
`;

/* ─────── helpers ─────── */
function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const STR_META = [
  { lbl: "", clr: "transparent", pct: 0 },
  { lbl: "Weak", clr: "#e74c3c", pct: 25 },
  { lbl: "Fair", clr: "#e09030", pct: 55 },
  { lbl: "Good", clr: "#7b8b5b", pct: 78 },
  { lbl: "Strong", clr: "#2d7a35", pct: 100 },
];
function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ─────── Sign In Form ─────── */
function SellerSignInForm({ onForgot, onSwitchSignUp, onDone }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gBusy, setGBusy] = useState(false);
  const [fBusy, setFBusy] = useState(false);

  const handleGoogle = async () => {
    setErr(""); setGBusy(true);
    try {
      const idToken = await signInWithGoogle();
      const { data } = await authAPI.googleAuth(idToken);
      localStorage.setItem("sellerToken", data.data.token);
      localStorage.setItem("seller", JSON.stringify(data.data.user));
      setOk(true);
      setTimeout(onDone, 900);
    } catch (error) {
      setErr(error.response?.data?.message || "Google sign-in failed.");
    } finally { setGBusy(false); }
  };

  const handleFacebook = async () => {
    setErr(""); setFBusy(true);
    try {
      const idToken = await signInWithFacebook();
      const { data } = await authAPI.googleAuth(idToken);
      localStorage.setItem("sellerToken", data.data.token);
      localStorage.setItem("seller", JSON.stringify(data.data.user));
      setOk(true);
      setTimeout(onDone, 900);
    } catch (error) {
      setErr(error.response?.data?.message || "Facebook sign-in failed.");
    } finally { setFBusy(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email || !isEmail(email)) {
      setErr("Please enter a valid email.");
      return;
    }
    if (!pw) {
      setErr("Please enter your password.");
      return;
    }
    setBusy(true);
    try {
      const res = await sellerAuthAPI.signin(email, pw);
      const { token, user } = res.data.data;
      localStorage.setItem("sellerToken", token);
      localStorage.setItem("seller", JSON.stringify(user));
      setOk(true);
      setTimeout(onDone, 900);
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="fade-up">
      {ok && (
        <div className="sh-alert sh-alert-success">
          <i className="fas fa-check-circle" style={{ marginRight: 8 }} />
          Welcome back! Redirecting to dashboard…
        </div>
      )}
      {err && (
        <div className="sh-alert sh-alert-error">
          <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />
          {err}
        </div>
      )}
      <label className="sh-label">Email address</label>
      <input
        className="sh-input"
        type="email"
        placeholder="seller@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErr("");
        }}
      />
      <label className="sh-label">Password</label>
      <div className="sh-input-wrap sh-mb">
        <input
          className="sh-input"
          type={show ? "text" : "password"}
          style={{ paddingRight: 46 }}
          placeholder="••••••••"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr("");
          }}
        />
        <button
          type="button"
          className="sh-eye"
          onClick={() => setShow((v) => !v)}
        >
          <i className={`far ${show ? "fa-eye-slash" : "fa-eye"}`} />
        </button>
      </div>
      <button type="button" className="forgot-link" onClick={onForgot}>
        Forgot password?
      </button>
      <button className="sh-btn" type="submit" disabled={busy}>
        {busy ? (
          <>
            <i className="fas fa-circle-notch fa-spin" /> Signing in…
          </>
        ) : (
          <>
            <i className="fas fa-store" /> ACCESS MY SELLER DASHBOARD
          </>
        )}
      </button>
      <div className="sh-divider">
        <hr />
        <span>or continue with</span>
        <hr />
      </div>
      <div className="sh-social">
        <button type="button" className="sh-social-btn" onClick={handleGoogle} disabled={gBusy || fBusy || busy}>
          {gBusy ? <i className="fas fa-circle-notch fa-spin" /> : <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>}
          {gBusy ? "Connecting…" : "Google"}
        </button>
        <button type="button" className="sh-social-btn" onClick={handleFacebook} disabled={fBusy || gBusy || busy}>
          {fBusy ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fab fa-facebook-f" style={{ color: "#1877f2" }} />}
          {fBusy ? "Connecting…" : "Facebook"}
        </button>
      </div>
      <p className="sh-switch">
        New seller?{" "}
        <button type="button" onClick={onSwitchSignUp}>
          Create a seller account
        </button>
      </p>
    </form>
  );
}


function SellerSignUpForm({ onSwitchSignIn, onDone }) {
  const [step, setStep] = useState(1); // 1=account 2=store 3=verify
  const [form, setForm] = useState({
    ownerName: "",
    brandName: "",
    email: "",
    pw: "",
    cpw: "",
    clothingCategories: [],
    bio: "",
  });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const str = pwStrength(form.pw);
  const meta = STR_META[str];
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErr("");
  };

  const toggleCategory = (cat) => {
    setForm((f) => ({
      ...f,
      clothingCategories: f.clothingCategories.includes(cat)
        ? f.clothingCategories.filter((c) => c !== cat)
        : [...f.clothingCategories, cat],
    }));
    setErr("");
  };

  const next = async (e) => {
    e.preventDefault();
    setErr("");
    if (step === 1) {
      if (!form.ownerName.trim()) {
        setErr("Owner name required.");
        return;
      }
      if (!form.brandName.trim()) {
        setErr("Brand name required.");
        return;
      }
      if (!isEmail(form.email)) {
        setErr("Valid email required.");
        return;
      }
      if (form.pw.length < 6) {
        setErr("Password must be at least 6 characters.");
        return;
      }
      if (form.pw !== form.cpw) {
        setErr("Passwords don't match.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (form.clothingCategories.length === 0) {
        setErr("Please select at least one clothing category.");
        return;
      }
      if (!agreed) {
        setErr("Please accept the seller terms.");
        return;
      }
      setBusy(true);
      try {
        const res = await sellerAuthAPI.signup(
          form.brandName,
          form.email,
          form.pw,
          "",
          form.bio,
          form.clothingCategories.join(",")
        );
        const { token, user } = res.data.data;
        localStorage.setItem("sellerToken", token);
        localStorage.setItem("seller", JSON.stringify(user));
        setOk(true);
        setTimeout(onDone, 1100);
      } catch (error) {
        setErr(error.response?.data?.message || "Something went wrong. Please try again.");
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <form onSubmit={next} className="fade-up">
      {/* Progress */}
      <div className="step-dots" style={{ marginBottom: "1.4rem" }}>
        {[1, 2].map((s) => (
          <div
            key={s}
            className="step-dot"
            style={{
              flex: s <= step ? 2 : 1,
              background:
                s < step
                  ? "#2d7a35"
                  : s === step
                    ? "var(--green)"
                    : "var(--green-light)",
            }}
          />
        ))}
      </div>

      {ok && (
        <div className="sh-alert sh-alert-success">
          <i className="fas fa-check-circle" style={{ marginRight: 8 }} />
          Store created! Redirecting to dashboard…
        </div>
      )}
      {err && (
        <div className="sh-alert sh-alert-error">
          <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />
          {err}
        </div>
      )}

      {step === 1 && (
        <>
          <p style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--green)", letterSpacing: ".8px", textTransform: "uppercase", marginBottom: ".5rem" }}>
            Step 1 of 2 · Account Info
          </p>

          <label className="sh-label">Owner Name</label>
          <input
            className="sh-input"
            type="text"
            placeholder="e.g. Sara Ahmed"
            value={form.ownerName}
            onChange={set("ownerName")}
          />

          <label className="sh-label">Brand Name</label>
          <input
            className="sh-input"
            type="text"
            placeholder="e.g. Salty"
            value={form.brandName}
            onChange={set("brandName")}
          />

          <label className="sh-label">Email address</label>
          <input
            className="sh-input"
            type="email"
            placeholder="brand@example.com"
            value={form.email}
            onChange={set("email")}
          />

          <label className="sh-label">Password</label>
          <div className="sh-input-wrap sh-mb">
            <input
              className="sh-input"
              type={show ? "text" : "password"}
              style={{ paddingRight: 46 }}
              placeholder="••••••••"
              value={form.pw}
              onChange={set("pw")}
            />
            <button type="button" className="sh-eye" onClick={() => setShow((v) => !v)}>
              <i className={`far ${show ? "fa-eye-slash" : "fa-eye"}`} />
            </button>
          </div>
          {form.pw && (
            <div style={{ marginTop: "-.6rem", marginBottom: "1rem" }}>
              <div className="str-bar">
                <div className="str-fill" style={{ width: `${meta.pct}%`, background: meta.clr }} />
              </div>
              <p className="str-lbl" style={{ color: meta.clr }}>{meta.lbl}</p>
            </div>
          )}

          <label className="sh-label">Confirm Password</label>
          <input
            className="sh-input"
            type="password"
            placeholder="••••••••"
            value={form.cpw}
            onChange={set("cpw")}
          />
          <button className="sh-btn" type="submit">
            <i className="fas fa-arrow-right" /> CONTINUE
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              color: "var(--green)",
              letterSpacing: ".8px",
              textTransform: "uppercase",
              marginBottom: ".5rem",
            }}
          >
            Step 2 of 2 · Store Details
          </p>

          <label className="sh-label" style={{ marginBottom: ".6rem" }}>
            Who do you sell for?
          </label>
          <div
            className="shop-types"
            style={{ gridTemplateColumns: "1fr 1fr 1fr", marginBottom: "1rem" }}
          >
            {[
              { id: "women", icon: "fas fa-venus", label: "Women's" },
              { id: "men", icon: "fas fa-mars", label: "Men's" },
              { id: "children", icon: "fas fa-child", label: "Children's" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                className={`shop-type-btn${form.clothingCategories.includes(t.id) ? " selected" : ""}`}
                onClick={() => toggleCategory(t.id)}
              >
                <i className={t.icon} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
          <label className="sh-label">Short Bio (optional)</label>
          <textarea
            className="sh-textarea"
            placeholder="Tell customers about your brand…"
            value={form.bio}
            onChange={set("bio")}
          />
          <div className="sh-check-row">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree">
              I agree to StyleHub's <a href="#">Seller Terms</a> and{" "}
              <a href="#">Commission Policy</a>
            </label>
          </div>
          <button className="sh-btn" type="submit" disabled={busy}>
            {busy ? (
              <>
                <i className="fas fa-circle-notch fa-spin" /> Creating Store…
              </>
            ) : (
              <>
                <i className="fas fa-store" /> LAUNCH MY STORE
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              width: "100%",
              marginTop: ".7rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font)",
              fontSize: ".8rem",
              color: "var(--gray-text)",
              textDecoration: "underline",
            }}
          >
            ← Back
          </button>
        </>
      )}

      <p className="sh-switch">
        Already a seller?{" "}
        <button type="button" onClick={onSwitchSignIn}>
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ─────── Benefits Panel ─────── */
const BENEFITS = [
  {
    icon: "fas fa-chart-line",
    title: "Reach Thousands of Buyers",
    desc: "StyleHub connects you with a curated audience of fashion-forward shoppers actively looking to buy.",
  },
  {
    icon: "fas fa-percent",
    title: "Low Commission, High Returns",
    desc: "Keep more of every sale with our competitive seller fees — among the lowest in Egyptian fashion e-commerce.",
  },
  {
    icon: "fas fa-box-open",
    title: "Easy Product Management",
    desc: "Upload, manage, and update your inventory through an intuitive seller dashboard built for speed.",
  },
  {
    icon: "fas fa-headset",
    title: "Dedicated Seller Support",
    desc: "Our team is always ready to help you grow — from onboarding to after-sale queries.",
  },
];

function BenefitsPanel() {
  return (
    <div className="benefits-panel">
      <h2>
        Start <span>Selling</span> on StyleHub Today
      </h2>
      <p>
        Join hundreds of Egyptian fashion brands and independent sellers already
        growing their business on StyleHub.
      </p>
      <div className="benefit-list">
        {BENEFITS.map((b) => (
          <div className="benefit-item" key={b.title}>
            <div className="benefit-icon">
              <i className={b.icon} />
            </div>
            <div className="benefit-text">
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonial-box">
        <p>
          "StyleHub gave my brand the visibility I needed. Within 3 months we
          doubled our monthly sales — the dashboard is incredibly easy to use."
        </p>
        <div className="testimonial-author">
          <div className="t-avatar">N</div>
          <div>
            <div className="t-name">Nour Hassan</div>
            <div className="t-store">Founder, Nour's Closet · Cairo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────── Seller Forgot — Step 1: Email ─────── */
function SellerForgotEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setErr("");
    if (!isEmail(email)) { setErr("Please enter a valid email."); return; }
    setBusy(true);
    console.log("Sending seller forgot password for:", email);
    try {
      await sellerAuthAPI.forgotPassword(email);
      console.log("Forgot password request sent successfully");
      onNext(email);
    } catch (error) {
      console.error("Forgot password error:", error);
      setErr(
        error?.response?.data?.message ||
        error?.message ||
        "Server error. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fade-up">
      <label className="sh-label">Your email address</label>
      <input
        className={`sh-input${err ? " error" : ""}`}
        type="email"
        value={email}
        placeholder="seller@example.com"
        onChange={(e) => { setEmail(e.target.value); setErr(""); }}
        onKeyDown={(e) => e.key === "Enter" && submit(e)}
      />
      {err && (
        <div className="sh-alert sh-alert-error">
          <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />{err}
        </div>
      )}
      <p style={{ fontSize: ".77rem", color: "var(--gray-text)", marginBottom: "1.2rem", lineHeight: 1.55 }}>
        We'll send a <strong style={{ color: "var(--green)" }}>reset link</strong> to this address. It expires in 1 hour.
      </p>
      <button className="sh-btn" onClick={submit} disabled={busy} type="button">
        {busy ? (
          <><i className="fas fa-circle-notch fa-spin" /> Sending link…</>
        ) : (
          "SEND RESET LINK"
        )}
      </button>
    </div>
  );
}

/* ─────── Seller Forgot — Step 2: Email Sent ─────── */
function SellerForgotEmailSent({ email }) {
  return (
    <div className="fade-up">
      <div style={{ background: "var(--green-light)", borderRadius: 14, padding: "1.4rem", textAlign: "center", marginBottom: "1.4rem" }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#fff", border: "2px solid var(--green-mid)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.3rem", color: "var(--green)" }}>
          <i className="fas fa-envelope" />
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#333", marginBottom: ".4rem" }}>Check Your Email</h3>
        <p style={{ fontSize: ".81rem", color: "var(--gray-text)", lineHeight: 1.6 }}>
          We sent a reset link to <strong style={{ color: "var(--green-dark)" }}>{email}</strong>
        </p>
      </div>
      <p style={{ fontSize: ".78rem", color: "var(--gray-text)", textAlign: "center", lineHeight: 1.6 }}>
        Click the link in the email to set a new password. It expires in 1 hour.
      </p>
    </div>
  );
}

/* ─────── Seller Forgot Wizard ─────── */
function SellerForgotForm({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const HEADERS = [
    { eyebrow: "Step 1 of 2", title: "Forgot Password", sub: "Enter your registered seller email address." },
    { eyebrow: "Step 2 of 2", title: "Email Sent", sub: null },
  ];
  const h = HEADERS[step - 1];

  return (
    <div className="fade-up">
      <button
        type="button"
        className="forgot-link"
        style={{ textAlign: "left", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 7 }}
        onClick={step === 1 ? onBack : () => setStep(1)}
      >
        <i className="fas fa-arrow-left" />
        {step === 1 ? "Back to Sign In" : "Go Back"}
      </button>

      <p style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--green)", letterSpacing: ".8px", textTransform: "uppercase", marginBottom: ".4rem" }}>
        {h.eyebrow}
      </p>
      <h2 className="card-title" style={{ marginBottom: h.sub ? ".4rem" : "1.4rem" }}>
        {h.title.split(" ").map((w, i, arr) =>
          i === arr.length - 1
            ? <span key={i} style={{ color: "var(--green)" }}>{w}</span>
            : <span key={i}>{w} </span>
        )}
      </h2>
      {h.sub && (
        <p style={{ fontSize: ".83rem", color: "var(--gray-text)", marginBottom: "1.4rem", lineHeight: 1.55 }}>{h.sub}</p>
      )}

      {/* Progress bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1.6rem" }}>
        {[1, 2].map((s) => (
          <div key={s} style={{
            height: 4, borderRadius: 2, flex: s <= step ? 2 : 1, transition: "all .4s",
            background: s < step ? "#2d7a35" : s === step ? "var(--green)" : "var(--green-light)",
          }} />
        ))}
      </div>

      {step === 1 && <SellerForgotEmail onNext={(e) => { setEmail(e); setStep(2); }} />}
      {step === 2 && <SellerForgotEmailSent email={email} />}
    </div>
  );
}

/* ─────── ROOT ─────── */
export default function SellerAuthPage({ onSellerLoggedIn }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "forgot"

  const go = (m) => setMode(m);
  const handleDone = () => {
    if (onSellerLoggedIn) onSellerLoggedIn();
  };

  return (
    <>
      <style>{CSS}</style>
      <style>{SHARED_CSS}</style>
      <SHNav />
      <div className="seller-page">
        <section className="seller-hero">
          <div className="seller-hero-badge">🛍️ Become a Seller</div>
          <h1>Your Fashion Brand<br /><em>Deserves a Bigger Stage</em></h1>
          <p>Open your store on StyleHub and reach thousands of shoppers who are looking for exactly what you sell.</p>
          <div className="hero-stats">
            <div className="hero-stat"><strong>50K+</strong><span>Active Buyers</span></div>
            <div className="hero-stat"><strong>300+</strong><span>Active Sellers</span></div>
            <div className="hero-stat"><strong>EGP 2M+</strong><span>Monthly Sales</span></div>
            <div className="hero-stat"><strong>48h</strong><span>Setup Time</span></div>
          </div>
        </section>

        <div className="perks-strip">
          {[
            { icon: "fas fa-bolt", text: "Quick Setup" },
            { icon: "fas fa-shield-alt", text: "Secure Payments" },
            { icon: "fas fa-truck", text: "Logistics Support" },
            { icon: "fas fa-star", text: "Featured Placements" },
            { icon: "fas fa-chart-bar", text: "Analytics Dashboard" },
          ].map((p) => (
            <div className="perk" key={p.text}><i className={p.icon} />{p.text}</div>
          ))}
        </div>

        <div className="seller-main">
          <BenefitsPanel />

          <div className="seller-auth-card">
            <div className="seller-tag"><i className="fas fa-store" /> Seller Portal</div>

            {mode !== "forgot" && (
              <>
                <div className="card-tabs">
                  <button className={`card-tab${mode === "signin" ? " active" : ""}`} onClick={() => go("signin")}>Sign In</button>
                  <button className={`card-tab${mode === "signup" ? " active" : ""}`} onClick={() => go("signup")}>Create Store</button>
                </div>
                <h2 className="card-title">
                  {mode === "signin" ? <>Seller <span>Sign In</span></> : <>Open Your <span>Store</span></>}
                </h2>
              </>
            )}

            {mode === "signin" && <SellerSignInForm onForgot={() => go("forgot")} onSwitchSignUp={() => go("signup")} onDone={handleDone} />}
            {mode === "signup" && <SellerSignUpForm onSwitchSignIn={() => go("signin")} onDone={handleDone} />}
            {mode === "forgot" && <SellerForgotForm onBack={() => go("signin")} />}
          </div>
        </div>

        <SHFooter />
      </div>
    </>
  );
}