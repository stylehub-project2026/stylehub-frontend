import { useState, useEffect } from "react";
import { SHNav, SHFooter, SHARED_CSS } from "./shared.jsx";
import { authAPI, sellerAuthAPI } from "./api.jsx";

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green:       #7b8b5b;
  --green-dark:  #5e6d41;
  --green-light: #e3e8d9;
  --green-mid:   #d4dcbe;
  --gray-text:   #888;
  --border:      #e0e0e0;
  --shadow:      0 20px 50px rgba(0,0,0,0.09);
  --radius-card: 22px;
  --font:        'Jost', sans-serif;
}

body { font-family: var(--font); background: #f5f7f0; }

.rp-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 68px;
}

.rp-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.rp-card {
  width: 100%;
  max-width: 460px;
  background: #fff;
  border-radius: var(--radius-card);
  padding: 2.8rem 2.6rem;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.rp-card::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 180px; height: 180px;
  border-radius: 50%;
  background: var(--green-light);
  opacity: .5;
  pointer-events: none;
}

.rp-role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--green-light);
  border: 1px solid var(--green-mid);
  border-radius: 20px;
  padding: .28rem .9rem;
  font-size: .72rem;
  font-weight: 700;
  color: var(--green-dark);
  letter-spacing: .5px;
  margin-bottom: 1rem;
}

.rp-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #222;
  margin-bottom: .4rem;
  line-height: 1.2;
}
.rp-title span { color: var(--green); }

.rp-sub {
  font-size: .84rem;
  color: var(--gray-text);
  line-height: 1.6;
  margin-bottom: 1.8rem;
}

.sh-label {
  display: block;
  font-size: .78rem;
  font-weight: 700;
  color: #555;
  margin-bottom: .45rem;
  letter-spacing: .3px;
}

.sh-input {
  width: 100%;
  padding: 11px 16px;
  background: var(--green-light);
  border: 2px solid transparent;
  border-radius: 11px;
  font-family: var(--font);
  font-size: .9rem;
  color: #333;
  outline: none;
  transition: all .2s;
  margin-bottom: 1rem;
}
.sh-input:focus { border-color: var(--green); background: var(--green-mid); }
.sh-input.error { border-color: #e74c3c; background: #fdf0ee; }

.sh-input-wrap { position: relative; }
.sh-input-wrap .sh-input { margin-bottom: 0; }
.sh-eye {
  position: absolute; right: 14px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: #888; font-size: .9rem; padding: 4px;
}
.sh-mb { margin-bottom: 1rem; }

.str-bar { height: 4px; border-radius: 2px; background: var(--border); margin-top: .45rem; overflow: hidden; }
.str-fill { height: 100%; border-radius: 2px; transition: width .3s, background .3s; }
.str-lbl { font-size: .7rem; margin-top: 4px; font-weight: 600; letter-spacing: .4px; }

.sh-btn {
  width: 100%; padding: 13px;
  background: var(--green); color: #fff;
  border: none; border-radius: 25px;
  font-family: var(--font); font-size: .86rem;
  font-weight: 700; letter-spacing: 1px;
  cursor: pointer; transition: all .25s; margin-top: .5rem;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.sh-btn:hover:not(:disabled) {
  background: var(--green-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(91,109,65,.25);
}
.sh-btn:disabled { opacity: .55; cursor: not-allowed; }

.sh-alert {
  border-radius: 10px; padding: 10px 14px;
  font-size: .83rem; margin-bottom: 1rem; font-weight: 500;
}
.sh-alert-success { background: #edf7ee; color: #2d7a35; border: 1px solid #b8e6bc; }
.sh-alert-error   { background: #fdf0ee; color: #c0392b; border: 1px solid #f5c6c2; }

.sh-err { font-size: .73rem; color: #c0392b; margin-top: -.6rem; margin-bottom: .8rem; }

.done-card {
  background: #edf7ee;
  border: 1.5px solid #b8e6bc;
  border-radius: 14px;
  padding: 1.6rem;
  text-align: center;
  margin-bottom: 1.4rem;
}
.done-icon {
  width: 52px; height: 52px; border-radius: 50%;
  background: #d0eedc; border: 2px solid #7bc89a;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem; font-size: 1.3rem; color: #2d7a35;
}
.done-card h3 { font-size: 1.1rem; font-weight: 700; color: #2d7a35; margin-bottom: .4rem; }
.done-card p  { font-size: .81rem; color: #4a8c57; line-height: 1.6; }

.invalid-card {
  text-align: center;
  padding: 2rem 0;
}
.invalid-icon {
  width: 60px; height: 60px; border-radius: 50%;
  background: #fdf0ee; border: 2px solid #f5c6c2;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.2rem; font-size: 1.4rem; color: #c0392b;
}
.invalid-card h3 { font-size: 1.1rem; font-weight: 700; color: #222; margin-bottom: .5rem; }
.invalid-card p { font-size: .83rem; color: var(--gray-text); line-height: 1.6; margin-bottom: 1.5rem; }

.fade-up { animation: fadeUp .32s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ─────── Helpers ─────── */
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

/* ─────── Reset Form ─────── */
function ResetForm({ token, role }) {
    const [pw, setPw] = useState("");
    const [cpw, setCpw] = useState("");
    const [show, setShow] = useState(false);
    const [err, setErr] = useState("");
    const [done, setDone] = useState(false);
    const [busy, setBusy] = useState(false);

    const str = pwStrength(pw);
    const meta = STR_META[str];

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        if (pw.length < 8) { setErr("Password must be at least 8 characters."); return; }
        if (pw !== cpw) { setErr("Passwords don't match."); return; }

        setBusy(true);
        try {
            const api = role === "seller" ? sellerAuthAPI : authAPI;
            await api.resetPassword(token, pw);
            setDone(true);
        } catch (error) {
            setErr(error.response?.data?.message || "Reset failed. The link may have expired.");
        } finally {
            setBusy(false);
        }
    };

    if (done) {
        return (
            <div className="fade-up">
                <div className="done-card">
                    <div className="done-icon">
                        <i className="fas fa-check" />
                    </div>
                    <h3>Password Updated!</h3>
                    <p>Your password has been reset successfully. You can now sign in with your new credentials.</p>
                </div>
                <a
                    href={role === "seller" ? "/seller" : "/signin"}
                    className="sh-btn"
                    style={{ textDecoration: "none" }}
                >
                    <i className="fas fa-sign-in-alt" />
                    {role === "seller" ? "GO TO SELLER SIGN IN" : "GO TO SIGN IN"}
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="fade-up">
            {err && (
                <div className="sh-alert sh-alert-error">
                    <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />
                    {err}
                </div>
            )}

            <label className="sh-label">New Password</label>
            <div className="sh-input-wrap sh-mb">
                <input
                    className="sh-input"
                    type={show ? "text" : "password"}
                    style={{ paddingRight: 46 }}
                    placeholder="Min 8 characters"
                    value={pw}
                    onChange={(e) => { setPw(e.target.value); setErr(""); }}
                />
                <button type="button" className="sh-eye" onClick={() => setShow(v => !v)}>
                    <i className={`far ${show ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
            </div>

            {pw && (
                <div style={{ marginTop: "-.6rem", marginBottom: "1rem" }}>
                    <div className="str-bar">
                        <div className="str-fill" style={{ width: `${meta.pct}%`, background: meta.clr }} />
                    </div>
                    <p className="str-lbl" style={{ color: meta.clr }}>{meta.lbl}</p>
                </div>
            )}

            <label className="sh-label">Confirm New Password</label>
            <input
                className={`sh-input${cpw && cpw !== pw ? " error" : ""}`}
                type="password"
                placeholder="Re-enter new password"
                value={cpw}
                onChange={(e) => { setCpw(e.target.value); setErr(""); }}
            />
            {cpw && cpw !== pw && (
                <p className="sh-err">Passwords don't match.</p>
            )}

            <button className="sh-btn" type="submit" disabled={busy || !pw || !cpw}>
                {busy ? (
                    <><i className="fas fa-circle-notch fa-spin" /> Updating…</>
                ) : (
                    <><i className="fas fa-lock" /> SET NEW PASSWORD</>
                )}
            </button>
        </form>
    );
}

/* ─────── ROOT ─────── */
export default function ResetPasswordPage({ cart = 0, wish = [] }) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role") || "customer";

    const isValid = !!token;

    return (
        <>
            <style>{SHARED_CSS}</style>
            <style>{CSS}</style>
            <div className="rp-page">
                <SHNav cart={cart} wish={wish} />

                <section className="rp-section">
                    <div className="rp-card">
                        {isValid ? (
                            <>
                                <div className="rp-role-badge">
                                    <i className={role === "seller" ? "fas fa-store" : "fas fa-user"} />
                                    {role === "seller" ? "Seller Account" : "Customer Account"}
                                </div>

                                <h1 className="rp-title">
                                    New <span>Password</span>
                                </h1>
                                <p className="rp-sub">
                                    Choose a strong password for your {role === "seller" ? "seller" : ""} account.
                                </p>

                                <ResetForm token={token} role={role} />
                            </>
                        ) : (
                            <div className="invalid-card fade-up">
                                <div className="invalid-icon">
                                    <i className="fas fa-link-slash" />
                                </div>
                                <h3>Invalid or Expired Link</h3>
                                <p>
                                    This reset link is no longer valid. It may have already been used or expired after 1 hour.
                                </p>
                                <a href="/signin" className="sh-btn" style={{ textDecoration: "none" }}>
                                    REQUEST A NEW LINK
                                </a>
                            </div>
                        )}
                    </div>
                </section>

                <SHFooter />
            </div>
        </>
    );
}
