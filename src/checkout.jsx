import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS, SHNav, SHFooter, SHARED_CSS } from "./shared";

const API = "https://stylehub-backend-tau.vercel.app/api";

// ─── helpers ───
const toNum = s => parseInt(String(s || "").replace(/\D/g, "")) || 0;

// ─── Change this one number to update shipping everywhere ───
const SHIPPING = 80;

// ─── CSS ───
const CSS = `
.ck-page { background:var(--cream); min-height:100vh; }
.ck-shell { max-width:1060px; margin:0 auto; padding:3rem 2rem 6rem; }

/* STEPPER */
.ck-steps { display:flex; align-items:center; gap:0; margin-bottom:3rem; }
.ck-step-item { display:flex; align-items:center; gap:.55rem; flex:1; }
.ck-step-item:last-child { flex:0; }
.ck-step-circle {
  width:30px; height:30px; border-radius:50%; border:2px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  font-size:.68rem; font-weight:700; color:var(--warm);
  background:#fff; flex-shrink:0; transition:all .3s;
}
.ck-step-circle.done  { background:var(--sage); border-color:var(--sage); color:#fff; }
.ck-step-circle.active{ background:var(--dark); border-color:var(--dark); color:#fff; }
.ck-step-label { font-size:.62rem; letter-spacing:.1em; text-transform:uppercase; color:var(--warm); white-space:nowrap; }
.ck-step-label.active { color:var(--dark); font-weight:600; }
.ck-step-line { flex:1; height:1px; background:var(--border); margin:0 .5rem; }
.ck-step-line.done { background:var(--sage); }

/* LAYOUT */
.ck-layout { display:grid; grid-template-columns:1fr 340px; gap:2.5rem; align-items:start; }
.ck-main {}
.ck-aside { position:sticky; top:80px; }

/* SECTION CARD */
.ck-card {
  background:#fff; border:1px solid var(--border);
  padding:1.8rem; margin-bottom:1.5rem;
}
.ck-card-title {
  font-family:'Cormorant Garamond',serif; font-size:1.35rem; font-weight:400;
  margin-bottom:1.3rem; color:var(--dark);
  border-bottom:1px solid var(--border); padding-bottom:.7rem;
}

/* FORM */
.ck-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
.ck-row.full { grid-template-columns:1fr; }
.ck-field { display:flex; flex-direction:column; gap:.3rem; }
.ck-label { font-size:.6rem; letter-spacing:.15em; text-transform:uppercase; color:var(--warm); }
.ck-input {
  padding:.65rem .85rem; border:1.5px solid var(--border);
  font-family:'DM Sans',sans-serif; font-size:.82rem; color:var(--dark);
  background:#fff; outline:none; transition:border-color .2s;
}
.ck-input:focus { border-color:var(--dark); }
.ck-input.err { border-color:#e63946; }
.ck-err-msg { font-size:.6rem; color:#e63946; margin-top:.15rem; }

/* RADIO ROWS */
.ck-radio-row {
  display:flex; align-items:center; gap:.8rem; padding:.9rem 1rem;
  border:1.5px solid var(--border); margin-bottom:.6rem; cursor:pointer;
  transition:border-color .2s;
}
.ck-radio-row.on { border-color:var(--dark); background:#fafaf8; }
.ck-radio-dot {
  width:16px; height:16px; border-radius:50%; border:2px solid var(--border);
  flex-shrink:0; transition:all .2s; position:relative;
}
.ck-radio-row.on .ck-radio-dot { border-color:var(--dark); }
.ck-radio-row.on .ck-radio-dot::after {
  content:''; position:absolute; inset:3px; border-radius:50%; background:var(--dark);
}
.ck-radio-label { font-size:.8rem; font-weight:500; }
.ck-radio-sub { font-size:.68rem; color:var(--warm); margin-left:auto; }

/* BRAND BILL */
.ck-bill {
  border:1px solid var(--border); margin-bottom:1.2rem; overflow:hidden;
}
.ck-bill-header {
  background:#f8f6f2; padding:.75rem 1rem;
  display:flex; justify-content:space-between; align-items:center;
  border-bottom:1px solid var(--border);
}
.ck-bill-brand { font-size:.65rem; letter-spacing:.18em; text-transform:uppercase; font-weight:700; color:var(--dark); }
.ck-bill-subtotal { font-size:.75rem; font-weight:600; color:var(--dark); }
.ck-bill-item {
  display:flex; gap:1rem; align-items:center;
  padding:.7rem 1rem; border-bottom:1px solid var(--border);
}
.ck-bill-item:last-child { border-bottom:none; }
.ck-bill-img { width:52px; height:64px; object-fit:cover; background:#f0ece6; flex-shrink:0; }
.ck-bill-info { flex:1; }
.ck-bill-name { font-size:.78rem; font-weight:500; }
.ck-bill-meta { font-size:.65rem; color:var(--warm); margin-top:.15rem; }
.ck-bill-price { font-size:.82rem; font-weight:600; flex-shrink:0; }

/* ORDER SUMMARY BOX */
.ck-sumbox { background:#fff; border:1px solid var(--border); padding:1.5rem; }
.ck-sum-title { font-size:.62rem; letter-spacing:.2em; text-transform:uppercase; font-weight:600; margin-bottom:1.2rem; }
.ck-sum-row { display:flex; justify-content:space-between; font-size:.8rem; margin-bottom:.65rem; }
.ck-sum-row span:first-child { color:var(--warm); }
.ck-sum-divider { border:none; border-top:1px solid var(--border); margin:1rem 0; }
.ck-sum-total { display:flex; justify-content:space-between; font-size:1rem; font-weight:700; }
.ck-sum-item { display:flex; gap:.7rem; align-items:center; padding:.5rem 0; border-bottom:1px solid var(--border); }
.ck-sum-item:last-child { border-bottom:none; }
.ck-sum-img { width:44px; height:54px; object-fit:cover; background:#f0ece6; flex-shrink:0; }
.ck-sum-name { font-size:.72rem; font-weight:500; line-height:1.3; }
.ck-sum-meta { font-size:.62rem; color:var(--warm); }
.ck-sum-price { font-size:.72rem; font-weight:600; margin-left:auto; flex-shrink:0; }

/* BUTTONS */
.ck-btn-primary {
  width:100%; background:var(--dark); color:#fff; border:none;
  padding:1rem; font-size:.72rem; letter-spacing:.14em; text-transform:uppercase;
  cursor:pointer; font-family:'DM Sans',sans-serif; transition:background .2s; margin-top:1rem;
}
.ck-btn-primary:hover { background:var(--deep); }
.ck-btn-primary:disabled { opacity:.4; cursor:not-allowed; }
.ck-btn-back {
  background:none; border:none; font-size:.7rem; color:var(--warm);
  cursor:pointer; font-family:'DM Sans',sans-serif; letter-spacing:.06em;
  display:flex; align-items:center; gap:.3rem; margin-bottom:1.5rem; padding:0;
}
.ck-btn-back:hover { color:var(--dark); }

/* SUCCESS */
.ck-success { text-align:center; padding:5rem 2rem; }
.ck-success-icon { font-size:3.5rem; margin-bottom:1rem; }
.ck-success-title { font-family:'Cormorant Garamond',serif; font-size:2.4rem; font-weight:400; margin-bottom:.6rem; }
.ck-success-sub { font-size:.85rem; color:var(--warm); margin-bottom:2.5rem; line-height:1.8; }
.ck-order-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1rem; margin:2rem auto; max-width:700px; }
.ck-order-card { background:#fff; border:1px solid var(--border); padding:1.2rem; text-align:left; }
.ck-order-card-brand { font-size:.6rem; letter-spacing:.18em; text-transform:uppercase; color:var(--warm); margin-bottom:.4rem; }
.ck-order-num { font-size:1.1rem; font-family:'Cormorant Garamond',serif; }
.ck-order-total { font-size:.78rem; color:var(--warm); margin-top:.3rem; }

@media(max-width:768px){
  .ck-layout { grid-template-columns:1fr; }
  .ck-aside { position:static; }
  .ck-row { grid-template-columns:1fr; }
}
`;

// ─── STEPPER ───
function Stepper({ step }) {
  const steps = ["Delivery", "Payment", "Review"];
  return (
    <div className="ck-steps">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <div key={label} className="ck-step-item">
            <div className={`ck-step-circle${done ? " done" : active ? " active" : ""}`}>
              {done ? "✓" : num}
            </div>
            <span className={`ck-step-label${active ? " active" : ""}`}>{label}</span>
            {i < steps.length - 1 && <div className={`ck-step-line${done ? " done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── ORDER SUMMARY SIDEBAR ───
function OrderSummary({ items, brandGroups, shipping }) {
  const subtotal = items.reduce((s, x) => s + toNum(x.product.price) * x.qty, 0);
  const total = subtotal + shipping;
  return (
    <div className="ck-sumbox">
      <div className="ck-sum-title">Order Summary</div>

      {/* Items */}
      <div style={{ marginBottom: "1rem" }}>
        {items.map(item => (
          <div key={`${item.id}-${item.size}`} className="ck-sum-item">
            <img className="ck-sum-img" src={item.product.img} alt={item.product.name}
              onError={e => e.target.style.display = "none"} />
            <div style={{ flex: 1 }}>
              <div className="ck-sum-name">{item.product.name}</div>
              <div className="ck-sum-meta">{item.product.brand} · Size {item.size} · ×{item.qty}</div>
            </div>
            <div className="ck-sum-price">LE {(toNum(item.product.price) * item.qty).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <hr className="ck-sum-divider" />

      {/* Per-brand subtotals */}
      {Object.entries(brandGroups).map(([brand, bItems]) => {
        const sub = bItems.reduce((s, x) => s + toNum(x.product.price) * x.qty, 0);
        return (
          <div key={brand} className="ck-sum-row">
            <span>{brand}</span>
            <span>LE {sub.toLocaleString()}</span>
          </div>
        );
      })}
      <div className="ck-sum-row">
        <span>Shipping</span>
        <span>LE {shipping.toLocaleString()}</span>
      </div>

      <hr className="ck-sum-divider" />
      <div className="ck-sum-total">
        <span>Total</span>
        <span>LE {total.toLocaleString()}</span>
      </div>

      {/* Payment badges */}
      <div style={{ display: "flex", gap: ".4rem", justifyContent: "center", marginTop: "1.2rem", flexWrap: "wrap" }}>
        {["VISA", "FAWRY", "CASH"].map(m => (
          <span key={m} style={{ background: "rgba(0,0,0,.06)", borderRadius: 3, padding: ".2rem .5rem", fontSize: ".52rem", color: "var(--warm)", fontWeight: 600 }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

// ─── EGYPT GOVERNORATES & CITIES ───
const EGYPT_DATA = {
  "Cairo": ["Cairo", "Heliopolis", "Maadi", "Nasr City", "New Cairo", "6th of October", "Shubra", "Ain Shams"],
  "Alexandria": ["Alexandria", "Montazah", "Smouha", "Sidi Gaber", "Gleem", "Miami", "Agami"],
  "Giza": ["Giza", "Dokki", "Mohandessin", "Haram", "6th of October City", "Sheikh Zayed"],
  "Qalyubia": ["Benha", "Qalyub", "Shubra El Kheima", "Obour"],
  "Sharqia": ["Zagazig", "10th of Ramadan", "Bilbeis", "Minya Al Qamh"],
  "Dakahlia": ["Mansoura", "Mit Ghamr", "Talkha", "Aga"],
  "Gharbia": ["Tanta", "Mahalla El Kubra", "Kafr El Zayat", "Zefta"],
  "Kafr El Sheikh": ["Kafr El Sheikh", "Desouk", "Fuwwah", "Baltim"],
  "Menoufia": ["Shebin El Kom", "Sadat City", "Menouf", "Ashmoun"],
  "Beheira": ["Damanhur", "Rashid", "Kafr El Dawwar", "Abu Hummus"],
  "Ismailia": ["Ismailia", "Tel El Kebir", "Abu Suweir"],
  "Suez": ["Suez", "Ain Sokhna", "Ataka"],
  "Port Said": ["Port Said", "Port Fouad"],
  "Damietta": ["Damietta", "New Damietta", "Faraskour"],
  "North Sinai": ["Arish", "Sheikh Zuweid", "Bir al-Abd"],
  "South Sinai": ["Sharm El Sheikh", "Dahab", "Nuweiba", "Taba"],
  "Red Sea": ["Hurghada", "Safaga", "El Quseir", "Marsa Alam"],
  "Minya": ["Minya", "Mallawi", "Abu Qurqas", "Samalut"],
  "Asyut": ["Asyut", "Dairut", "Manfalut", "Abnoub"],
  "Sohag": ["Sohag", "Akhmim", "Girga", "Tahta"],
  "Qena": ["Qena", "Luxor", "Nag Hammadi", "Qift"],
  "Luxor": ["Luxor", "Esna", "Armant"],
  "Aswan": ["Aswan", "Edfu", "Kom Ombo", "Abu Simbel"],
  "Matrouh": ["Mersa Matruh", "Sidi Barrani", "El Alamein"],
  "New Valley": ["Kharga", "Dakhla", "Farafra"],
  "Beni Suef": ["Beni Suef", "El Fashn", "Beba"],
  "Fayoum": ["Fayoum", "Sinnuris", "Ibsheway"],
};

// ─── STEP 1 — DELIVERY ───
function StepDelivery({ form, setForm, errors, onNext }) {
  const governorates = Object.keys(EGYPT_DATA);
  const cities = form.governorate ? (EGYPT_DATA[form.governorate] || []) : [];

  const fields = (key, label) => (
    <div className="ck-field">
      <label className="ck-label">{label}</label>
      <input className={`ck-input${errors[key] ? " err" : ""}`} value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
      {errors[key] && <span className="ck-err-msg">{errors[key]}</span>}
    </div>
  );

  const selectStyle = {
    width: "100%", padding: ".65rem .85rem", border: `1.5px solid ${errors["governorate"] || errors["city"] ? "#e63946" : "var(--border)"}`,
    fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem", color: "var(--dark)",
    background: "#fff", outline: "none", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%238c8880' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right .8rem center", paddingRight: "2rem",
    cursor: "pointer",
  };

  return (
    <div className="ck-card">
      <div className="ck-card-title">Delivery Information</div>
      <div className="ck-row">{fields("firstName", "First Name")}{fields("lastName", "Last Name")}</div>
      <div className="ck-row full">{fields("email", "Email Address")}</div>
      <div className="ck-row full">{fields("phone", "Phone Number")}</div>
      <div className="ck-row full">{fields("address", "Street Address")}</div>

      <div className="ck-row">
        {/* Governorate dropdown */}
        <div className="ck-field">
          <label className="ck-label">Governorate</label>
          <select
            style={{ ...selectStyle, borderColor: errors["governorate"] ? "#e63946" : "var(--border)" }}
            value={form.governorate}
            onChange={e => setForm(f => ({ ...f, governorate: e.target.value, city: "" }))}>
            <option value="">Select Governorate...</option>
            {governorates.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          {errors["governorate"] && <span className="ck-err-msg">{errors["governorate"]}</span>}
        </div>

        {/* City dropdown */}
        <div className="ck-field">
          <label className="ck-label">City / District</label>
          <select
            style={{ ...selectStyle, borderColor: errors["city"] ? "#e63946" : "var(--border)", opacity: !form.governorate ? 0.5 : 1 }}
            value={form.city}
            disabled={!form.governorate}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
            <option value="">Select City...</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors["city"] && <span className="ck-err-msg">{errors["city"]}</span>}
        </div>
      </div>

      <div style={{ marginTop: "1.2rem" }}>
        <div className="ck-label" style={{ marginBottom: ".6rem" }}>Delivery Method</div>
        {[
          { key: "standard", label: "Standard Delivery", sub: "3–5 business days · LE 80" },
          { key: "express", label: "Express Delivery", sub: "1–2 business days · LE 120" },
        ].map(opt => (
          <div key={opt.key} className={`ck-radio-row${form.delivery === opt.key ? " on" : ""}`}
            onClick={() => setForm(f => ({ ...f, delivery: opt.key }))}>
            <div className="ck-radio-dot" />
            <span className="ck-radio-label">{opt.label}</span>
            <span className="ck-radio-sub">{opt.sub}</span>
          </div>
        ))}
      </div>

      <button className="ck-btn-primary" onClick={onNext}>Continue to Payment →</button>
    </div>
  );
}

// ─── STEP 2 — PAYMENT ───
function StepPayment({ form, setForm, errors, brandGroups, onNext, onBack }) {
  const brands = Object.keys(brandGroups);
  const multiBrand = brands.length > 1;

  return (
    <>
      <button className="ck-btn-back" onClick={onBack}>← Back to Delivery</button>

      {/* Multi-brand notice */}
      {multiBrand && (
        <div style={{ background: "#fff8e6", border: "1px solid #f0d080", padding: "1rem 1.2rem", marginBottom: "1.2rem", fontSize: ".78rem", lineHeight: 1.7, color: "#5a4a10" }}>
          <strong>You're ordering from {brands.length} brands.</strong><br />
          Each brand processes and ships your items separately. You'll receive{" "}
          <strong>{brands.length} separate order confirmations</strong>, one per brand.
        </div>
      )}

      {/* Per-brand payment */}
      {brands.map((brand, bi) => {
        const bItems = brandGroups[brand];
        const sub = bItems.reduce((s, x) => s + toNum(x.product.price) * x.qty, 0);
        const pKey = `payment_${brand}`;
        const current = form[pKey] || "cod";

        return (
          <div key={brand} className="ck-card">
            <div className="ck-card-title">
              Payment for <span style={{ color: "var(--sage)" }}>{brand}</span>
              <span style={{ fontSize: ".78rem", fontWeight: 400, color: "var(--warm)", marginLeft: ".6rem" }}>
                (LE {sub.toLocaleString()})
              </span>
            </div>

            {[
              { key: "cod", label: "Cash on Delivery", sub: "Pay when your order arrives" },
              { key: "fawry", label: "Fawry", sub: "Pay at any Fawry outlet" },
              { key: "card", label: "Credit / Debit Card", sub: "VISA · Mastercard · Meeza" },

            ].map(opt => (
              <div key={opt.key} className={`ck-radio-row${current === opt.key ? " on" : ""}`}
                onClick={() => setForm(f => ({ ...f, [pKey]: opt.key }))}>
                <div className="ck-radio-dot" />
                <span className="ck-radio-label">{opt.label}</span>
                <span className="ck-radio-sub">{opt.sub}</span>
              </div>
            ))}

            {current === "card" && (
              <div style={{ marginTop: ".8rem", padding: ".85rem 1rem", background: "#f0f7ff", border: "1px solid #c0d8f0", fontSize: ".76rem", color: "#1a3a5c", lineHeight: 1.6 }}>
                You'll enter your card details securely on the next step via Paymob.
              </div>
            )}

            {current === "fawry" && (
              <div style={{ marginTop: ".8rem", padding: ".85rem 1rem", background: "#fff8e6", border: "1px solid #f0d080", fontSize: ".76rem", color: "#5a4a10", lineHeight: 1.6 }}>
                After placing your order you'll receive a <strong>Fawry reference code</strong>.<br />
                Pay at any Fawry outlet within <strong>48 hours</strong> to confirm your order.
              </div>
            )}

            {current === "instapay" && (
              <div style={{ marginTop: ".8rem", padding: ".85rem 1rem", background: "#e8f4f0", border: "1px solid #a0d4c4", fontSize: ".76rem", color: "#1a4a3a", lineHeight: 1.6 }}>
                Transfer <strong>LE {sub.toLocaleString()}</strong> via InstaPay to:<br />
                <strong>01xxxxxxxxxx @ CIB</strong><br />
                Use your name as the transfer note, then upload proof below.
              </div>
            )}
          </div>
        );
      })}

      <button className="ck-btn-primary" onClick={onNext}>Review Order →</button>
    </>
  );
}

// ─── STEP 3 — REVIEW ───
function StepReview({ form, brandGroups, onBack, onPlace, placing }) {
  const brands = Object.keys(brandGroups);
  const total = Object.values(brandGroups).flat().reduce((s, x) => s + toNum(x.product.price) * x.qty, 0);
  const shipping = form.delivery === "express" ? 120 : 80;

  const payLabel = key => ({ cod: "Cash on Delivery", fawry: "Fawry", card: "Credit/Debit Card", instapay: "InstaPay" }[key] || key);

  return (
    <>
      <button className="ck-btn-back" onClick={onBack}>← Back to Payment</button>

      {/* Delivery summary */}
      <div className="ck-card">
        <div className="ck-card-title">Delivery Details</div>
        <div style={{ fontSize: ".82rem", lineHeight: 2, color: "var(--dark)" }}>
          <strong>{form.firstName} {form.lastName}</strong><br />
          {form.address}, {form.city}, {form.governorate}<br />
          {form.phone} · {form.email}<br />
          <span style={{ color: "var(--warm)" }}>
            {"Shipping · LE " + (form.delivery === "express" ? 120 : 80)}
          </span>
        </div>
      </div>

      {/* Per-brand order bills */}
      {brands.map(brand => {
        const bItems = brandGroups[brand];
        const sub = bItems.reduce((s, x) => s + toNum(x.product.price) * x.qty, 0);
        const pKey = form[`payment_${brand}`] || "cod";
        return (
          <div key={brand} className="ck-bill">
            <div className="ck-bill-header">
              <span className="ck-bill-brand">📦 Order from {brand}</span>
              <span className="ck-bill-subtotal">LE {sub.toLocaleString()} · {payLabel(pKey)}</span>
            </div>
            {bItems.map(item => (
              <div key={`${item.id}-${item.size}`} className="ck-bill-item">
                <img className="ck-bill-img" src={item.product.img} alt={item.product.name}
                  onError={e => e.target.style.display = "none"} />
                <div className="ck-bill-info">
                  <div className="ck-bill-name">{item.product.name}</div>
                  <div className="ck-bill-meta">Size: {item.size} · Qty: {item.qty}</div>
                </div>
                <div className="ck-bill-price">LE {(toNum(item.product.price) * item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Grand total */}
      <div className="ck-card" style={{ background: "#f8f6f2" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".5rem" }}>
          <span style={{ color: "var(--warm)" }}>Items subtotal</span>
          <span>LE {total.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".5rem" }}>
          <span style={{ color: "var(--warm)" }}>Shipping</span>
          <span style={{ color: "var(--dark)", fontWeight: 600 }}>
            {`LE ${shipping}`}
          </span>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: ".8rem", marginTop: ".5rem", display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: 700 }}>
          <span>Grand Total</span>
          <span>LE {(total + shipping).toLocaleString()}</span>
        </div>
        {brands.length > 1 && (
          <div style={{ marginTop: ".6rem", fontSize: ".7rem", color: "var(--warm)", lineHeight: 1.6 }}>
            ℹ️ Your cart contains items from {brands.length} brands. Each brand ships independently.
          </div>
        )}
      </div>

      <button className="ck-btn-primary" onClick={onPlace} disabled={placing}>
        {placing ? "Placing Order..." : `Place ${brands.length > 1 ? `${brands.length} Orders` : "Order"} →`}
      </button>
    </>
  );
}

// ─── STEP 4 — SUCCESS ───
function StepSuccess({ brandGroups, form, confirmedOrder, onContinue }) {
  const brands = Object.keys(brandGroups);
  const orderNum = confirmedOrder
    ? `SH-${confirmedOrder._id.slice(-8).toUpperCase()}`
    : brands.reduce((acc, b) => ({ ...acc, [b]: `SH-${b.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}` }), {});

  return (
    <div className="ck-success">
      <div className="ck-success-icon">✅</div>
      <div className="ck-success-title">Order Confirmed!</div>
      <p className="ck-success-sub">
        Thank you, <strong>{form.firstName}</strong>! Your order has been placed successfully.<br />
        Confirmation will be sent to <strong>{form.email}</strong>.
      </p>

      <div className="ck-order-cards">
        {confirmedOrder ? (
          <div className="ck-order-card">
            <div className="ck-order-card-brand">StyleHub</div>
            <div className="ck-order-num">{orderNum}</div>
            <div className="ck-order-total">LE {confirmedOrder.totalPrice?.toLocaleString()} · {confirmedOrder.paymentMethod?.toUpperCase()}</div>
          </div>
        ) : (
          brands.map(brand => {
            const sub = brandGroups[brand].reduce((s, x) => s + toNum(x.product.price) * x.qty, 0);
            const pay = form[`payment_${brand}`] || "cod";
            const payLabel = { cod: "Cash on Delivery", fawry: "Fawry", card: "Card", instapay: "InstaPay" }[pay];
            return (
              <div key={brand} className="ck-order-card">
                <div className="ck-order-card-brand">{brand}</div>
                <div className="ck-order-num">{orderNum[brand]}</div>
                <div className="ck-order-total">LE {sub.toLocaleString()} · {payLabel}</div>
              </div>
            );
          })
        )}
      </div>

      <button onClick={onContinue}
        style={{ background: "var(--dark)", color: "#fff", border: "none", padding: ".85rem 2.5rem", fontSize: ".72rem", letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginTop: "1rem" }}>
        Continue Shopping
      </button>
    </div>
  );
}

// ─── MAIN CHECKOUT ───
export default function Checkout({ cart = [], setCart, wish = [], setWish }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ── Redirect to sign in if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/signin?redirect=/checkout");
    }
  }, [token, navigate]);

  if (!token) return null;

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", governorate: "",
    delivery: "standard",
  });

  // ─── Backend cart (if logged in) ───
  const [backendItems, setBackendItems] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // Transform backend items to checkout format
          const transformed = (data.data.items || []).map(i => ({
            id: i.product._id,
            qty: i.quantity,
            size: i.size,
            color: i.color,
            cartItemId: i._id,
            product: {
              id: i.product._id,
              _id: i.product._id,
              name: i.product.name,
              price: `LE ${i.product.salePrice || i.product.price}`,
              rawPrice: i.product.salePrice || i.product.price,
              oldPrice: i.product.salePrice ? `LE ${i.product.price}` : null,
              img: i.product.images?.[0] ? (i.product.images[0].startsWith('http') ? i.product.images[0] : `https://stylehub-backend-tau.vercel.app${i.product.images[0]}`) : null,
              brand: "StyleHub",
            }
          }));
          setBackendItems(transformed);
        }
      })
      .catch(console.error);
  }, [token]);

  // Use backend items if logged in, otherwise fall back to local cart
  const items = useMemo(() => {
    if (token && backendItems !== null) return backendItems;
    return (cart || []).map(item => {
      if (item.product) return item;
      const p = PRODUCTS.find(x => x.id === item.id);
      return p ? { ...item, product: p } : null;
    }).filter(Boolean);
  }, [cart, backendItems, token]);

  // Group by brand
  const brandGroups = useMemo(() =>
    items.reduce((acc, item) => {
      const brand = item.product.brand;
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(item);
      return acc;
    }, {})
    , [items]);

  // Validation
  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.governorate.trim()) e.governorate = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext1 = () => { if (validate()) setStep(2); };
  const handleNext2 = () => setStep(3);

  const handlePlace = async () => {
    if (token) {
      setPlacing(true);
      setPlaceError("");
      try {
        const firstBrand = Object.keys(brandGroups)[0];
        const paymentMethod = form[`payment_${firstBrand}`] || "cod";
        const validPayment = ["cod", "card", "fawry", "instapay"].includes(paymentMethod) ? paymentMethod : "cod";

        const orderItems = items.map(item => ({
          productId: item.product._id || item.product.id,
          quantity: item.qty,
          size: item.size,
          color: item.color,
        }));

        const shippingAddress = {
          firstName: form.firstName,
          lastName: form.lastName,
          street: form.address,
          city: form.city,
          governorate: form.governorate,
          phone: form.phone,
          email: form.email,
        };

        if (validPayment === "card") {
          const pmRes = await fetch(`${API}/orders/paymob`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ items: orderItems, shippingAddress }),
          });
          const pmData = await pmRes.json();
          if (!pmRes.ok) throw new Error(pmData.message || "Payment initiation failed.");
          window.location.href = `https://accept.paymob.com/api/acceptance/iframes/1043832?payment_token=${pmData.data.paymentKey}`;
          return;
        }

        const res = await fetch(`${API}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ items: orderItems, shippingAddress, paymentMethod: validPayment }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to place order.");

        setConfirmedOrder(data.data.order);
        setCart([]);
        setStep(4);
      } catch (err) {
        setPlaceError(err.message || "Something went wrong. Please try again.");
      } finally {
        setPlacing(false);
      }
    } else {
      setStep(4);
      setCart([]);
    }
  };

  // Empty cart redirect
  if (items.length === 0 && step < 4 && !(token && backendItems === null)) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
        <style>{SHARED_CSS}</style>
        <SHNav cart={cart} wish={wish} />
        <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", marginBottom: "1rem" }}>Your cart is empty</div>
          <button onClick={() => navigate("/")}
            style={{ background: "var(--dark)", color: "#fff", border: "none", padding: ".8rem 2rem", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            Continue Shopping
          </button>
        </div>
        <SHFooter />
      </div>
    );
  }

  return (
    <div className="ck-page">
      <style>{SHARED_CSS}</style>
      <style>{CSS}</style>
      <SHNav cart={cart} wish={wish} />

      <div className="ck-shell">
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", fontWeight: 400, marginBottom: ".3rem" }}>
          {step === 4 ? "Order Confirmed" : "Checkout"}
        </h1>
        <div style={{ width: 36, height: 2, background: "var(--sage)", marginBottom: "2rem" }} />

        {step < 4 && <Stepper step={step} />}

        {step === 4 ? (
          <StepSuccess brandGroups={brandGroups} form={form} confirmedOrder={confirmedOrder} onContinue={() => navigate("/")} />
        ) : (
          <div className="ck-layout">
            <div className="ck-main">
              {step === 1 && <StepDelivery form={form} setForm={setForm} errors={errors} onNext={handleNext1} />}
              {step === 2 && <StepPayment form={form} setForm={setForm} errors={errors} brandGroups={brandGroups} onNext={handleNext2} onBack={() => setStep(1)} />}
              {step === 3 && (
                <>
                  <StepReview form={form} brandGroups={brandGroups} onBack={() => setStep(2)} onPlace={handlePlace} placing={placing} />
                  {placeError && (
                    <div style={{ background: "#fdf0ee", border: "1px solid #f5c6c2", borderRadius: 8, padding: "1rem 1.2rem", marginTop: "1rem", fontSize: ".82rem", color: "#c0392b" }}>
                      {placeError}
                    </div>
                  )}
                </>
              )}
            </div>
            <aside className="ck-aside">
              <OrderSummary items={items} brandGroups={brandGroups} shipping={form.delivery === "express" ? 120 : 80} />
            </aside>
          </div>
        )}
      </div>

      {step < 4 && <SHFooter />}
    </div>
  );
}