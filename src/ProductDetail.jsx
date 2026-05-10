import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS, BRANDS, NAV_LINKS, FOOTER_COLS, SHNav, SHFooter } from "./shared";

// ─── ICONS ───
const Heart = ({ on }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const Stars = ({ n }) => <>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ color: "#c8a96e", fontSize: ".75rem" }}>{i <= Math.round(n) ? "★" : "☆"}</span>)}</>;

const PD_CSS = `
:root { --cream:#F8F6F2; --dark:#1a1a18; --sage:#92A079; --deep:#728060; --warm:#8c8880; --border:#e4e0da; --gold:#c8a96e; --red:#e63946; }
body { font-family:'DM Sans',sans-serif; background:var(--cream); color:var(--dark); }

/* NAV — same as homepage */
.sh-nav { background:#fff; border-bottom:1px solid var(--border); height:56px; }
.sh-nav a { color:var(--dark); text-decoration:none; font-size:.85rem; letter-spacing:.04em; transition:color .2s; }
.sh-nav a:hover { color:var(--sage); }
.sh-badge { background:var(--sage); color:#fff; font-size:.5rem; width:14px; height:14px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; position:absolute; top:-6px; right:-8px; }
.nav-icon { color:var(--dark); display:flex; align-items:center; position:relative; transition:color .2s; cursor:pointer; text-decoration:none; }
.nav-icon:hover { color:var(--sage); }
.nav-item { position:relative; }
.nav-item:hover .dropdown { opacity:1; pointer-events:auto; transform:translateY(0); }
.dropdown { position:absolute; top:100%; left:0; background:#fff; border:1px solid var(--border); min-width:160px; opacity:0; pointer-events:none; transform:translateY(8px); transition:all .25s; z-index:100; box-shadow:0 8px 24px rgba(0,0,0,.08); }
.dropdown a { display:block; padding:.6rem 1.2rem; font-size:.72rem; color:var(--dark); text-decoration:none; letter-spacing:.04em; transition:background .2s; }
.dropdown a:hover { background:var(--cream); color:var(--sage); }

/* BREADCRUMB */
.pd-bread { font-size:.68rem; letter-spacing:.06em; color:var(--warm); }
.pd-bread a { color:var(--warm); text-decoration:none; transition:color .2s; }
.pd-bread a:hover { color:var(--dark); }
.pd-bread span { margin:0 .5rem; }

/* GALLERY */
.pd-gallery { display:grid; grid-template-columns:80px 1fr; gap:.75rem; }
.pd-thumbs { display:flex; flex-direction:column; gap:.5rem; }
.pd-thumb { width:80px; height:80px; overflow:hidden; cursor:pointer; border:2px solid transparent; transition:border-color .2s; background:#f0ece6; }
.pd-thumb.on { border-color:var(--dark); }
.pd-thumb img { width:100%; height:100%; object-fit:cover; transition:transform .3s; }
.pd-thumb:hover img { transform:scale(1.08); }
.pd-main { position:relative; background:#f0ece6; overflow:hidden; aspect-ratio:3/4; }
.pd-main img { width:100%; height:100%; object-fit:cover; transition:opacity .3s; }
.pd-main-ph { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
.pd-badge { position:absolute; top:1rem; left:1rem; background:var(--red); color:#fff; font-size:.58rem; letter-spacing:.12em; padding:.3rem .7rem; font-weight:600; }
.pd-wish-btn { position:absolute; top:1rem; right:1rem; width:40px; height:40px; background:#fff; border:none; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,.12); transition:transform .2s; }
.pd-wish-btn:hover { transform:scale(1.1); }
.pd-wish-btn.on { color:var(--red); }

/* PRODUCT INFO */
.pd-brand-tag { font-size:.62rem; letter-spacing:.22em; text-transform:uppercase; color:var(--warm); }
.pd-name { font-family:'Cormorant Garamond',serif; font-size:2.4rem; font-weight:400; line-height:1.1; }
.pd-price { font-size:1.5rem; font-weight:600; }
.pd-oprice { font-size:.9rem; color:var(--warm); text-decoration:line-through; margin-left:.5rem; }
.pd-sale-badge { background:var(--red); color:#fff; font-size:.58rem; letter-spacing:.1em; padding:.25rem .6rem; font-weight:600; margin-left:.6rem; }
.pd-desc { font-size:.84rem; line-height:1.9; color:var(--warm); }
.pd-lbl { font-size:.63rem; letter-spacing:.18em; text-transform:uppercase; font-weight:600; margin-bottom:.5rem; }
.pd-divider { border:none; border-top:1px solid var(--border); margin:1.5rem 0; }

/* COLOR SWATCHES */
.pd-sw { width:28px; height:28px; border-radius:50%; cursor:pointer; transition:transform .2s,box-shadow .2s; border:2px solid transparent; }
.pd-sw.on { box-shadow:0 0 0 2px var(--dark); transform:scale(1.12); }

/* SIZE BUTTONS */
.pd-sz { padding:.5rem 1rem; font-size:.72rem; border:1.5px solid var(--border); background:transparent; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; min-width:52px; }
.pd-sz.on { border-color:var(--dark); background:var(--dark); color:#fff; }
.pd-sz:hover:not(.on) { border-color:var(--dark); }

/* BUTTONS */
.sh-btn { display:inline-flex; align-items:center; justify-content:center; padding:.8rem 1.8rem; font-size:.72rem; letter-spacing:.12em; text-transform:uppercase; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; text-decoration:none; width:100%; }
.sh-btn-dk { background:var(--dark); color:#fff; } .sh-btn-dk:hover { background:var(--deep); color:#fff; }
.sh-btn-ol { background:transparent; color:var(--dark); border:1.5px solid var(--dark); } .sh-btn-ol:hover { background:var(--dark); color:#fff; }

/* DETAILS ACCORDION */
.pd-acc { border-top:1px solid var(--border); }
.pd-acc-item { border-bottom:1px solid var(--border); }
.pd-acc-btn { width:100%; background:none; border:none; display:flex; justify-content:space-between; align-items:center; padding:.9rem 0; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:.78rem; letter-spacing:.06em; color:var(--dark); text-align:left; }
.pd-acc-content { font-size:.8rem; line-height:1.8; color:var(--warm); padding-bottom:1rem; }

/* YOU MAY LIKE */
.pd-sec-title { font-size:1.5rem; font-weight:430; letter-spacing:.08em; margin-bottom:1.5rem; }
.pd-sec-title::after { content:''; display:block; width:32px; height:2px; background:var(--sage); margin:.5rem 0 0; }

/* RELATED CARD */
.rc { background:#fff; cursor:pointer; border:1px solid var(--border); transition:box-shadow .25s; text-decoration:none; color:inherit; display:block; }
.rc:hover { box-shadow:0 8px 32px rgba(26,26,24,.1); }
.rc-img { position:relative; overflow:hidden; aspect-ratio:4/4; background:#f0ece6; }
.rc-img img { width:100%; height:100%; object-fit:cover; transition:transform .6s cubic-bezier(.22,1,.36,1); }
.rc:hover .rc-img img { transform:scale(1.06); }
.rc-brand { font-size:.55rem; letter-spacing:.15em; text-transform:uppercase; color:var(--warm); }
.rc-name { font-size:.78rem; font-weight:500; line-height:1.3; }
.p-old { font-size:.72rem; color:var(--warm); text-decoration:line-through; }
.p-new { font-size:.78rem; font-weight:600; color:var(--red); }
.p-reg { font-size:.78rem; font-weight:500; }

/* TOAST */
.sh-toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(20px); background:var(--dark); color:#fff; padding:.8rem 2rem; font-size:.76rem; letter-spacing:.1em; z-index:1000; opacity:0; transition:all .4s; pointer-events:none; white-space:nowrap; }
.sh-toast.on { opacity:1; transform:translateX(-50%) translateY(0); }

/* ── REVIEWS ── */
.rv-section { background:#fff; border-top:3px solid var(--border); padding:4rem 5%; }
.rv-overview { display:grid; grid-template-columns:200px 1fr; gap:3rem; align-items:center; background:var(--cream); border-radius:16px; padding:2rem 2.5rem; margin-bottom:3rem; border:1px solid var(--border); }
.rv-big-score { text-align:center; }
.rv-big-num { font-family:'Cormorant Garamond',serif; font-size:4.5rem; font-weight:400; line-height:1; color:var(--dark); }
.rv-big-stars { font-size:1.1rem; color:var(--gold); letter-spacing:.1em; margin:.3rem 0; }
.rv-big-count { font-size:.72rem; color:var(--warm); letter-spacing:.04em; }
.rv-bars { display:flex; flex-direction:column; gap:.55rem; }
.rv-bar-row { display:flex; align-items:center; gap:.8rem; font-size:.72rem; color:var(--warm); }
.rv-bar-track { flex:1; height:6px; background:var(--border); border-radius:3px; overflow:hidden; }
.rv-bar-fill { height:100%; background:var(--gold); border-radius:3px; transition:width .6s ease; }
.rv-bar-pct { width:28px; text-align:right; font-size:.68rem; }
.rv-card { background:var(--cream); border:1px solid var(--border); border-radius:12px; padding:1.4rem 1.6rem; margin-bottom:1rem; }
.rv-avatar { width:38px; height:38px; border-radius:50%; background:var(--dark); color:#fff; display:flex; align-items:center; justify-content:center; font-size:.78rem; font-weight:700; flex-shrink:0; }
.rv-name { font-size:.82rem; font-weight:600; color:var(--dark); }
.rv-date { font-size:.68rem; color:var(--warm); }
.rv-stars { color:var(--gold); font-size:.78rem; letter-spacing:.06em; }
.rv-comment { font-size:.82rem; color:#555; line-height:1.75; margin-top:.6rem; }
.rv-badge { display:inline-block; background:var(--sage); color:#fff; font-size:.58rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:.2rem .55rem; border-radius:20px; margin-left:.5rem; vertical-align:middle; }
.rv-form { background:var(--cream); border:1.5px solid var(--border); border-radius:16px; padding:2rem; margin-top:2rem; }
.rv-form-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:400; margin-bottom:1.2rem; }
.rv-star-pick { display:flex; gap:.4rem; margin-bottom:1.2rem; cursor:pointer; }
.rv-star-pick span { font-size:1.8rem; color:var(--border); transition:color .15s; }
.rv-star-pick span.lit { color:var(--gold); }
.rv-textarea { width:100%; padding:.9rem 1.1rem; background:#fff; border:1.5px solid var(--border); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:.84rem; color:var(--dark); resize:vertical; min-height:100px; outline:none; transition:border-color .2s; }
.rv-textarea:focus { border-color:var(--sage); }
.rv-submit { background:var(--dark); color:#fff; border:none; padding:.75rem 2.2rem; font-size:.72rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; font-family:'DM Sans',sans-serif; cursor:pointer; border-radius:6px; transition:background .2s; margin-top:1rem; }
.rv-submit:hover { background:var(--deep); }
.rv-submit:disabled { opacity:.45; cursor:not-allowed; }
.rv-login-note { font-size:.8rem; color:var(--warm); text-align:center; padding:1.5rem; border:1.5px dashed var(--border); border-radius:12px; margin-top:2rem; }
.rv-login-note a { color:var(--sage); font-weight:600; text-decoration:underline; }
.rv-pag { display:flex; gap:.4rem; justify-content:center; margin-top:2rem; }
.rv-pag-btn { width:34px; height:34px; border-radius:50%; border:1px solid var(--border); background:none; font-size:.75rem; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; display:flex; align-items:center; justify-content:center; color:var(--dark); }
.rv-pag-btn.on { background:var(--dark); color:#fff; border-color:var(--dark); }
.rv-pag-btn:hover:not(.on) { border-color:var(--dark); }
.rv-empty { text-align:center; padding:2.5rem; color:var(--warm); font-size:.85rem; }
@media(max-width:600px) {
  .rv-overview { grid-template-columns:1fr; gap:1.5rem; }
  .rv-section { padding:3rem 1.2rem; }
}

/* FOOTER */
.sh-foot { background:var(--deep); color:rgba(255,255,255,.8); }
.f-logo-txt { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:500; color:#fff; text-decoration:none; }
.f-about { font-size:.78rem; line-height:1.7; color:rgba(255,255,255,.55); }
.f-soc { width:30px; height:30px; border:1px solid rgba(255,255,255,.3); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.65rem; color:rgba(255,255,255,.6); text-decoration:none; transition:all .2s; }
.f-soc:hover { background:rgba(255,255,255,.15); color:#fff; }
.f-col-title { font-size:.64rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.45); font-weight:500; }
.f-col a { display:block; font-size:.78rem; color:rgba(255,255,255,.7); text-decoration:none; transition:all .2s; }
.f-col a:hover { color:#fff; }
.f-copy { font-size:.7rem; color:rgba(255,255,255,.35); }
.fpb { background:rgba(255,255,255,.12); border-radius:3px; padding:.2rem .5rem; font-size:.58rem; color:rgba(255,255,255,.6); font-weight:600; }

@media(max-width:768px) {
  .pd-gallery { grid-template-columns:1fr; }
  .pd-thumbs { flex-direction:row; }
  .pd-thumb { width:64px; height:64px; }
  .pd-name { font-size:1.8rem; }
}
`;


// ─── RELATED CARD ───
function RelatedCard({ p }) {
  return (
    <Link to={`/product/${p.id}`} className="rc">
      <div className="rc-img">
        {p.img
          ? <img src={p.img} alt={p.name} />
          : <div style={{ width: "100%", height: "100%", background: `linear-gradient(${p.gradient})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", color: "rgba(255,255,255,.2)" }}>{p.brand[0]}</span>
          </div>
        }
        {p.oldPrice && <div className="pd-badge">SALE</div>}
      </div>
      <div className="p-2">
        <div className="rc-brand mb-1">{p.brand}</div>
        <div className="rc-name mb-1">{p.name}</div>
        <div className="d-flex gap-2 align-items-center">
          {p.oldPrice && <span className="p-old">{p.oldPrice}</span>}
          <span className={p.oldPrice ? "p-new" : "p-reg"}>{p.price}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── ACCORDION ITEM ───
function AccItem({ label, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pd-acc-item">
      <button className="pd-acc-btn" onClick={() => setOpen(o => !o)}>
        <span>{label}</span>
        <span style={{ fontSize: "1.1rem", transition: "transform .2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && <div className="pd-acc-content">{content}</div>}
    </div>
  );
}

// ─── REVIEW SECTION ───
const API = "https://stylehub-backend-ten.vercel.app/api";

function StarPicker({ value, onChange }) {
  const [hov, setHov] = useState(0);
  return (
    <div className="rv-star-pick">
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className={n <= (hov || value) ? "lit" : ""}
          onMouseEnter={() => setHov(n)}
          onMouseLeave={() => setHov(0)}
          onClick={() => onChange(n)}
        >★</span>
      ))}
    </div>
  );
}

function ReviewCard({ rv }) {
  const name = rv.customer
    ? (rv.customer.firstName + " " + (rv.customer.lastName || "")).trim() || "Customer"
    : "Customer";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const date = new Date(rv.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="rv-card">
      <div style={{ display: "flex", alignItems: "center", gap: ".9rem", marginBottom: ".5rem" }}>
        <div className="rv-avatar">{initials}</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span className="rv-name">{name}</span>
            <span className="rv-badge">Verified</span>
          </div>
          <div style={{ display: "flex", gap: ".7rem", alignItems: "center", marginTop: ".15rem" }}>
            <span className="rv-stars">{"★".repeat(rv.rating) + "☆".repeat(5 - rv.rating)}</span>
            <span className="rv-date">{date}</span>
          </div>
        </div>
      </div>
      {rv.comment && <p className="rv-comment">{rv.comment}</p>}
    </div>
  );
}

function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rvRating, setRvRating] = useState(0);
  const [rvComment, setRvComment] = useState("");
  const [rvErr, setRvErr] = useState("");
  const [rvOk, setRvOk] = useState(false);

  const token = localStorage.getItem("token");
  const LIMIT = 5;

  const fetchReviews = async (pg) => {
    setLoading(true);
    try {
      const res = await fetch(API + "/products/" + productId + "/reviews?page=" + pg + "&limit=" + LIMIT);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data.reviews);
        setAvgRating(data.data.avgRating || 0);
        setTotal(data.data.total || 0);
        setPages(data.data.pages || 1);
        setPage(pg);
        const bd = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.data.reviews.forEach(r => { if (bd[r.rating] !== undefined) bd[r.rating]++; });
        setBreakdown(bd);
      }
    } catch (e) { }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(1); }, [productId]);

  const submitReview = async () => {
    setRvErr("");
    if (!rvRating) { setRvErr("Please select a star rating."); return; }
    setSubmitting(true);
    try {
      const res = await fetch(API + "/products/" + productId + "/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ rating: rvRating, comment: rvComment }),
      });
      const data = await res.json();
      if (data.success) {
        setRvOk(true);
        setRvRating(0);
        setRvComment("");
        fetchReviews(1);
      } else {
        setRvErr(data.message || "Something went wrong.");
      }
    } catch (e) { setRvErr("Network error. Please try again."); }
    setSubmitting(false);
  };

  const totalReviewed = Object.values(breakdown).reduce((a, b) => a + b, 0) || 1;

  return (
    <section className="rv-section">
      <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "2rem" }}>
        <h2 className="pd-sec-title" style={{ marginBottom: 0 }}>Customer Reviews</h2>
        {total > 0 && <span style={{ fontSize: ".75rem", color: "var(--warm)" }}>{total} review{total !== 1 ? "s" : ""}</span>}
      </div>

      {total > 0 && (
        <div className="rv-overview">
          <div className="rv-big-score">
            <div className="rv-big-num">{avgRating.toFixed(1)}</div>
            <div className="rv-big-stars">{"★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating))}</div>
            <div className="rv-big-count">out of 5</div>
          </div>
          <div className="rv-bars">
            {[5, 4, 3, 2, 1].map(star => (
              <div className="rv-bar-row" key={star}>
                <span>{star}★</span>
                <div className="rv-bar-track">
                  <div className="rv-bar-fill" style={{ width: ((breakdown[star] / totalReviewed) * 100) + "%" }} />
                </div>
                <span className="rv-bar-pct">{breakdown[star]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="rv-empty">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="rv-empty">No reviews yet — be the first to share your thoughts!</div>
      ) : (
        <>
          {reviews.map(rv => <ReviewCard key={rv._id} rv={rv} />)}
          {pages > 1 && (
            <div className="rv-pag">
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                <button key={n} className={"rv-pag-btn" + (page === n ? " on" : "")} onClick={() => fetchReviews(n)}>{n}</button>
              ))}
            </div>
          )}
        </>
      )}

      {rvOk ? (
        <div style={{ background: "#edf7ee", border: "1px solid #b8e6bc", borderRadius: 12, padding: "1.2rem 1.6rem", marginTop: "2rem", fontSize: ".84rem", color: "#2d7a35", fontWeight: 500 }}>
          Thank you! Your review has been submitted.
        </div>
      ) : token ? (
        <div className="rv-form">
          <div className="rv-form-title">Write a Review</div>
          <div style={{ fontSize: ".72rem", color: "var(--warm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".5rem" }}>Your Rating</div>
          <StarPicker value={rvRating} onChange={setRvRating} />
          <div style={{ fontSize: ".72rem", color: "var(--warm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".5rem" }}>Your Comment</div>
          <textarea
            className="rv-textarea"
            placeholder="Share your thoughts about this product..."
            value={rvComment}
            onChange={e => setRvComment(e.target.value)}
          />
          {rvErr && <div style={{ fontSize: ".78rem", color: "var(--red)", marginTop: ".5rem" }}>{rvErr}</div>}
          <button className="rv-submit" onClick={submitReview} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      ) : (
        <div className="rv-login-note">
          <a href="/signin">Sign in</a> to leave a review for this product.
        </div>
      )}
    </section>
  );
}

// ─── MAIN COMPONENT ───
export default function ProductDetail({ cart, setCart, wish, setWish }) {
  const { id } = useParams();

  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selColor, setSelColor] = useState(0);
  const [selSize, setSelSize] = useState(null);
  const [mainImg, setMainImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setP(null);
    fetch(`https://stylehub-backend-ten.vercel.app/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const raw = data.data.product;
          setP({
            _id: raw._id,
            id: raw._id,
            name: raw.name,
            brand: raw.seller?.brandName || "StyleHub",
            desc: raw.description,
            price: `LE ${raw.price}`,
            oldPrice: raw.salePrice ? `LE ${raw.salePrice}` : null,
            colors: raw.colors?.length > 0 ? raw.colors : [],
            sizes: raw.sizes || [],
            img: raw.images?.[0] ? `https://stylehub-backend-ten.vercel.app${raw.images[0]}` : null,
            imgs: raw.images?.slice(1).map(i => `https://stylehub-backend-ten.vercel.app${i}`) || [],
            rating: 4,
            reviews: 0,
            tab: raw.category || "new",
            gradient: "135deg, #2a2a28 0%, #4a4a48 100%",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 2200); };
  const isWished = wish?.includes(p?.id);
  const toggleWish = () => {
    if (!p) return;
    setWish(w => w.includes(p.id) ? w.filter(x => x !== p.id) : [...w, p.id]);
    showToast(isWished ? "Removed from wishlist" : "♥ Added to wishlist");
  };
  const handleAdd = async () => {
    if (!selSize || !p) {
      showToast("⚠ Please select a size");
      return;
    }

    const token = localStorage.getItem("token");

    // ─── LOGGED IN: save to backend FIRST, then update local cart ───
    if (token) {
      try {
        const res = await fetch("https://stylehub-backend-ten.vercel.app/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: p._id,
            quantity: 1,
            size: selSize,
            color: p.colors?.[selColor] || undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          // Backend failed — show actual error to user, don't update local cart
          console.error("Add to cart failed:", data);
          showToast(`✗ ${data.message || "Failed to add to cart"}`);
          return;
        }

        // Backend succeeded — update local state to keep icon in sync
        setCart(prev => {
          const existing = prev.find(x => x.id === p.id && x.size === selSize);
          if (existing) {
            return prev.map(x =>
              x.id === p.id && x.size === selSize
                ? { ...x, qty: x.qty + 1 }
                : x
            );
          }
          return [...prev, { id: p.id, size: selSize, qty: 1 }];
        });

        setAdded(true);
        showToast("✓ Added to bag");
        setTimeout(() => setAdded(false), 1800);
      } catch (err) {
        console.error("Network error:", err);
        showToast("✗ Network error. Please try again.");
      }
      return;
    }

    // ─── GUEST: add to local cart ───
    setCart(prev => {
      const existing = prev.find(x => x.id === p.id && x.size === selSize);
      if (existing) {
        return prev.map(x => x.id === p.id && x.size === selSize ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...prev, {
        id: p.id,
        size: selSize,
        qty: 1,
        product: {
          id: p.id,
          _id: p.id,
          name: p.name,
          price: p.price,
          oldPrice: p.oldPrice || null,
          img: p.img,
          brand: p.brand,
        }
      }];
    });
    setAdded(true);
    showToast("✓ Added to bag");
    setTimeout(() => setAdded(false), 1800);
  };
  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{PD_CSS}</style>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "var(--warm)" }}>Loading...</div>
    </div>
  );

  if (!p) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
      <style>{PD_CSS}</style>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem" }}>Product not found</div>
      <a href="/" style={{ fontSize: ".8rem", color: "var(--sage)" }}>← Back to Home</a>
    </div>
  );

  const related = [];

  const isSalty = p.brand?.toLowerCase() === "salty";
  const imgs = p.img ? [p.img, ...(p.imgs || []), ...(isSalty ? ["/salty-size-guide.jpg"] : [])] : [];

  return (
    <div>
      <style>{PD_CSS}</style>

      {/* NAV */}
      <SHNav cart={cart} wish={wish} />

      {/* BREADCRUMB */}
      <div className="px-4 py-3 pd-bread">
        <a href="/">Home</a>
        <span>›</span>
        <span style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>{p.tab === "best" ? "Best Sellers" : p.tab === "new" ? "New Arrivals" : p.tab === "sale" ? "Sale" : p.tab === "trend" ? "Trending" : "Top Picks"}</span>
        <span>›</span>
        <span style={{ color: "var(--dark)" }}>{p.name}</span>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <div className="px-4 pb-5">
        <div className="row g-5">

          {/* LEFT — GALLERY */}
          <div className="col-md-6">
            <div className="pd-gallery" style={{ gridTemplateColumns: imgs.length > 1 ? "80px 1fr" : "1fr" }}>
              {/* Thumbnails */}
              {imgs.length > 1 && (
                <div className="pd-thumbs">
                  {imgs.map((img, i) => (
                    <div key={i} className={`pd-thumb${mainImg === i ? " on" : ""}`} onClick={() => setMainImg(i)}>
                      <img src={img} alt={`${p.name} ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
              {/* Main image */}
              <div className="pd-main">
                {p.oldPrice && <div className="pd-badge">SALE</div>}
                <button className={`pd-wish-btn${isWished ? " on" : ""}`} onClick={toggleWish}>
                  <Heart on={isWished} />
                </button>
                {imgs.length > 0
                  ? <img src={imgs[mainImg]} alt={p.name} />
                  : <div className="pd-main-ph" style={{ background: `linear-gradient(${p.gradient})`, height: "100%" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "5rem", color: "rgba(255,255,255,.15)", fontWeight: 300 }}>{p.brand[0]}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          {/* RIGHT — PRODUCT INFO */}
          <div className="col-md-6 pt-md-4">
            {/* Brand + Name */}
            <div className="pd-brand-tag mb-2">{p.brand}</div>
            <h1 className="pd-name mb-3">{p.name}</h1>

            {/* Rating */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <Stars n={p.rating} />
              <span style={{ fontSize: ".72rem", color: "var(--warm)" }}>{p.rating} · {p.reviews} reviews</span>
            </div>

            <hr className="pd-divider" />

            {/* Price */}
            <div className="d-flex align-items-center mb-4">
              <span className="pd-price">{p.price}</span>
              {p.oldPrice && <>
                <span className="pd-oprice">{p.oldPrice}</span>
                <span className="pd-sale-badge">SALE</span>
              </>}
            </div>

            {/* Description */}
            <p className="pd-desc mb-4">{p.desc}</p>

            <hr className="pd-divider" />

            {/* Colors */}
            {p.colors.length > 0 && (
              <div className="mb-4">
                <div className="pd-lbl">Color</div>
                <div className="d-flex gap-2">
                  {p.colors.map((c, i) => (
                    <div key={i} className={`pd-sw${selColor === i ? " on" : ""}`} style={{ background: c, border: c === "#ffffffff" || c === "#fff" ? "1.5px solid var(--border)" : "2px solid transparent" }} onClick={() => { setSelColor(i); if (i < imgs.length) setMainImg(i); }} />
                  ))}
                </div>
              </div>
            )}
            {/* Sizes */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="pd-lbl mb-0">Size</div>
                {!selSize && <span style={{ fontSize: ".62rem", color: "var(--red)" }}>— select a size</span>}
              </div>
              <div className="d-flex flex-wrap gap-2">
                {p.sizes.map(s => (
                  <button key={s} className={`pd-sz${selSize === s ? " on" : ""}`} onClick={() => setSelSize(s)}>{s}</button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex flex-column gap-2 mb-4">
              <button
                className="sh-btn sh-btn-dk"
                style={{ opacity: selSize ? 1 : .45 }}
                onClick={handleAdd}
              >
                {added ? "✓  Added to Bag" : "Add to Bag"}
              </button>
              <button className="sh-btn sh-btn-ol" onClick={toggleWish}>
                {isWished ? "♥  Saved to Wishlist" : "♡  Save to Wishlist"}
              </button>
            </div>

            {/* Accordion details */}
            <div className="pd-acc">
              <AccItem label="Product Details" content={p.desc} />
              <AccItem label="Shipping & Returns" content="Free shipping on all orders. Easy 30-day returns — no questions asked. Items must be unworn and in original condition." />
              <AccItem label="Size Guide" content="XS fits 34–36, S fits 36–38, M fits 38–40, L fits 40–42, XL fits 42–44. If between sizes, size up for a relaxed fit." />
              <AccItem label="Brand Info" content={`${p.brand} is one of Egypt's leading local fashion brands on StyleHub. Discover their full collection in the Brands section.`} />
            </div>
          </div>
        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      {related.length > 0 && (
        <section className="px-5 py-5 " style={{ borderTop: "3px solid var(--border)", marginBottom: "8rem" }}>
          <div className="pd-sec-title">You May Also Like</div>
          <div className="row g-3">
            {related.map(r => (
              <div className="col-4 col-md-3" key={r.id}>
                <RelatedCard p={r} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* REVIEWS */}
      <ReviewSection productId={id} />

      {/* FOOTER */}
      <SHFooter />

      <div className={`sh-toast${toast ? " on" : ""}`}>{toast}</div>
    </div>
  );
}