import { useState } from "react";
import { SHNav, SHFooter, SHARED_CSS, useScrollReveal } from "./shared";

// ─── API BASE URL ───
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ══════════════════════════════════════════════════════════
// API FUNCTION — real fetch
// ══════════════════════════════════════════════════════════
async function submitContactForm({ firstName, lastName, email, phone, message }) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, phone, message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to send message");
  }
  return res.json();
}

// ══════════════════════════════════════════════════════════
// PAGE CSS
// ══════════════════════════════════════════════════════════
const PAGE_CSS = `
.cp-wrap { background:#f5f3ef; min-height:100vh; }
.cp-section {
  max-width:1100px; margin:0 auto; padding:60px 24px;
  display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:start;
}
@media(max-width:768px){ .cp-section{ grid-template-columns:1fr; gap:32px; } }

/* LEFT — form */
.cp-left h2 { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:600; color:var(--dark); margin-bottom:28px; }
.cp-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
.cp-row-full { margin-bottom:12px; }
.cp-input, .cp-textarea {
  width:100%; padding:10px 14px; font-size:.82rem;
  border:1px solid #d8d4cc; background:#fff;
  color:var(--dark); font-family:'DM Sans',sans-serif;
  outline:none; border-radius:3px; transition:border-color .2s;
}
.cp-input:focus, .cp-textarea:focus { border-color:var(--sage); }
.cp-input:disabled, .cp-textarea:disabled { opacity:.55; cursor:not-allowed; }
.cp-textarea { height:130px; resize:none; }
.cp-privacy { font-size:.68rem; color:var(--warm); margin:10px 0 18px; line-height:1.6; }
.cp-privacy a { color:var(--sage); text-decoration:none; }
.cp-submit-btn {
  display:inline-flex; align-items:center; gap:8px;
  background:var(--sage); color:#fff; border:none;
  padding:.65rem 1.6rem; font-size:.78rem; letter-spacing:.1em;
  text-transform:uppercase; cursor:pointer; border-radius:3px;
  font-family:'DM Sans',sans-serif; transition:background .2s;
}
.cp-submit-btn:hover:not(:disabled) { background:#6b7d5a; }
.cp-submit-btn:disabled { opacity:.6; cursor:not-allowed; }
.cp-submit-btn.sent { background:#4a7c59; }
.cp-err { font-size:.78rem; color:var(--red); background:#fff5f5; border:1px solid #fcc;
  border-radius:4px; padding:10px 14px; margin-top:12px; }
.cp-success { display:none; background:#f0f7f2; border:1px solid var(--sage);
  border-radius:4px; padding:12px 16px; font-size:.82rem; color:#3d6b4a; margin-top:12px; }
.cp-success.on { display:block; }

/* RIGHT — info card */
.cp-right { background:var(--sage); border-radius:8px; overflow:hidden; color:#fff; }
.cp-info { padding:36px 28px; }
.cp-info-heading { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:400;
  color:#fff; margin-bottom:24px; }
.cp-info-row { display:flex; align-items:flex-start; gap:12px; margin-bottom:20px; }
.cp-info-icon { width:36px; height:36px; background:rgba(255,255,255,.18); border-radius:50%;
  display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:.9rem; }
.cp-info-text { font-size:.82rem; line-height:1.55; color:rgba(255,255,255,.92); }
.cp-info-text strong { display:block; font-size:.65rem; letter-spacing:.14em; text-transform:uppercase;
  color:rgba(255,255,255,.55); margin-bottom:3px; font-weight:400; }
.cp-social-label { font-size:.62rem; letter-spacing:.18em; text-transform:uppercase;
  color:rgba(255,255,255,.55); margin-bottom:12px; }
.cp-socials { display:flex; gap:10px; flex-wrap:wrap; }
.cp-soc-btn { width:36px; height:36px; background:rgba(255,255,255,.18); border:none;
  border-radius:8px; display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:background .2s; color:#fff; font-size:.9rem; text-decoration:none; }
.cp-soc-btn:hover { background:rgba(255,255,255,.35); color:#fff; }
.cp-divider { border:none; border-top:1px solid rgba(255,255,255,.18); margin:24px 0; }
`;

// ══════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════
const INITIAL_FORM = { firstName: "", lastName: "", email: "", phone: "", message: "" };

export default function ContactPage({ cart, wish }) {
  const addRef = useScrollReveal();

  const [form,       setForm]       = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [sent,       setSent]       = useState(false);
  const [error,      setError]      = useState(null);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await submitContactForm(form);
      setSent(true);
      setForm(INITIAL_FORM);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cp-wrap">
      <style>{SHARED_CSS}</style>
      <style>{PAGE_CSS}</style>
      <SHNav cart={cart} wish={wish} />

      <div className="cp-section">

        {/* ── LEFT: FORM ── */}
        <div className="cp-left reveal" ref={addRef}>
          <h2>Get in Touch</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="cp-row">
              <input className="cp-input" name="firstName" placeholder="First Name"
                value={form.firstName} onChange={handleChange} disabled={submitting} required />
              <input className="cp-input" name="lastName" placeholder="Last Name"
                value={form.lastName} onChange={handleChange} disabled={submitting} required />
            </div>
            <div className="cp-row-full">
              <input className="cp-input" name="email" type="email" placeholder="Email address"
                value={form.email} onChange={handleChange} disabled={submitting} required />
            </div>
            <div className="cp-row-full">
              <input className="cp-input" name="phone" placeholder="Phone No. (optional)"
                value={form.phone} onChange={handleChange} disabled={submitting} />
            </div>
            <div className="cp-row-full">
              <textarea className="cp-textarea" name="message" placeholder="Your message..."
                value={form.message} onChange={handleChange} disabled={submitting} required />
            </div>
            <p className="cp-privacy">
              By submitting this form you agree to our{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
            <button type="submit"
              className={`cp-submit-btn ${sent ? "sent" : ""}`}
              disabled={submitting || sent}>
              {submitting
                ? "Sending…"
                : sent
                  ? "Message Sent ✓"
                  : <>Send Message <i className="bi bi-send-fill" /></>}
            </button>
            {error && <div className="cp-err">{error}</div>}
            <div className={`cp-success ${sent ? "on" : ""}`}>
              Thank you! We'll get back to you within 24 hours.
            </div>
          </form>
        </div>

        {/* ── RIGHT: INFO CARD ── */}
        <div className="reveal" ref={addRef}>
          <div className="cp-right">
            <div className="cp-info">
              <div className="cp-info-heading">Contact Information</div>

              <div className="cp-info-row">
                <div className="cp-info-icon"><i className="bi bi-telephone-fill" /></div>
                <div className="cp-info-text">
                  <strong>Phone</strong>
                  +20 111 234 5678
                </div>
              </div>

              <div className="cp-info-row">
                <div className="cp-info-icon"><i className="bi bi-envelope-fill" /></div>
                <div className="cp-info-text">
                  <strong>Email</strong>
                  hello@stylehub.com.eg
                </div>
              </div>

              <div className="cp-info-row">
                <div className="cp-info-icon"><i className="bi bi-clock-fill" /></div>
                <div className="cp-info-text">
                  <strong>Working Hours</strong>
                  Sun – Thu, 10:00 AM – 6:00 PM
                </div>
              </div>

              <hr className="cp-divider" />

              <div className="cp-social-label">Find us on</div>
              <div className="cp-socials">
                <a href="https://www.facebook.com/share/18ztJYRk3q/?mibextid=wwXIfr"
                  target="_blank" rel="noreferrer" className="cp-soc-btn">
                  <i className="bi bi-facebook" />
                </a>
                <a href="https://www.instagram.com/stylehub7500?igsh=MTE2bm1uYXoyZmFndw%3D%3D&utm_source=qr"
                  target="_blank" rel="noreferrer" className="cp-soc-btn">
                  <i className="bi bi-instagram" />
                </a>
                <a href="https://wa.me/201112345678"
                  target="_blank" rel="noreferrer" className="cp-soc-btn">
                  <i className="bi bi-whatsapp" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <SHFooter addRef={addRef} />
    </div>
  );
}
