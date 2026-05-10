import { useEffect, useRef } from "react";
import { SHNav, SHFooter, SHARED_CSS, useScrollReveal } from "./shared";

const VALUES = [
  {
    id:"01", label:"Quality",
    headline:"Uncompromising Standards",
    body:"We are committed to maintaining the highest standards of quality across every aspect of our business — from the brands we partner with to the experience we deliver.",
    icon:(
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4">
        <polygon points="20,4 24,15 36,15 27,22 30,34 20,27 10,34 13,22 4,15 16,15"/>
      </svg>
    ),
    accent:"#92A079"
  },
  {
    id:"02", label:"Security",
    headline:"Your Trust, Protected",
    body:"We are committed to maintaining the highest standards of security to protect our systems, data, and users at every level of our operations.",
    icon:(
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M20 4 L34 10 L34 22 C34 30 20 36 20 36 C20 36 6 30 6 22 L6 10 Z"/>
      </svg>
    ),
    accent:"#b8a88a"
  },
  {
    id:"03", label:"Innovation",
    headline:"Always Moving Forward",
    body:"We drive ongoing innovation through advanced technology and creative marketing to stay ahead in a competitive market and bring our designers to more people.",
    icon:(
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="20" cy="16" r="7"/>
        <line x1="20" y1="23" x2="20" y2="30"/>
        <line x1="15" y1="36" x2="25" y2="36"/>
        <line x1="13" y1="32" x2="27" y2="32"/>
      </svg>
    ),
    accent:"#7a9ab8"
  },
  {
    id:"04", label:"Sustainability",
    headline:"Fashion With Conscience",
    body:"We are committed to a sustainable, responsible business that supports local industry growth while minimizing environmental impact. Local is the new luxury.",
    icon:(
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M20 34 C20 34 6 26 6 14 C6 14 12 8 20 14 C28 8 34 14 34 14 C34 26 20 34 20 34Z"/>
      </svg>
    ),
    accent:"#92A079"
  },
  {
    id:"05", label:"Partnership",
    headline:"Built on Collaboration",
    body:"We value strategic partnerships with suppliers and stakeholders built on collaboration and mutual benefit — growing together with Egypt's creative community.",
    icon:(
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="13" cy="15" r="5"/>
        <circle cx="27" cy="15" r="5"/>
        <path d="M6 33 C6 27 10 24 13 24 L20 24 L27 24 C30 24 34 27 34 33"/>
        <line x1="20" y1="10" x2="20" y2="30"/>
      </svg>
    ),
    accent:"#c8a96e"
  },
  {
    id:"06", label:"Authenticity",
    headline:"Real Brands, Real Stories",
    body:"We uphold strict verification standards to ensure the authenticity and integrity of information — so every brand on StyleHub is exactly who they say they are.",
    icon:(
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="20" cy="20" r="14"/>
        <polyline points="13,20 18,25 27,15"/>
      </svg>
    ),
    accent:"#a07892"
  },
];

const STATS = [
  { num:"10+",  label:"Local Brands" },
  { num:"11K+", label:"Happy Shoppers" },
  { num:"3",    label:"Cities Covered" },
  { num:"2025", label:"Est. in Alexandria" },
];

const CSS = `
.au-hero {
  min-height: 88vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}
.au-hero-left {
  background: var(--dark);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 5rem 4rem;
  position: relative;
  overflow: hidden;
}
.au-hero-left::before {
  content: 'SH';
  position: absolute;
  top: -40px;
  left: -30px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 28rem;
  color: rgba(255,255,255,.03);
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
}
.au-hero-right {
  background: var(--cream);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem 4rem;
}
.au-tag {
  font-size: .62rem;
  letter-spacing: .28em;
  text-transform: uppercase;
  color: var(--sage);
  font-weight: 600;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: .6rem;
}
.au-tag::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 1.5px;
  background: var(--sage);
}
.au-h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  font-weight: 400;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 0;
}
.au-h1-em { font-style: italic; color: var(--sage); }
.au-mission {
  font-size: 1rem;
  line-height: 1.85;
  color: #777777ff;
  max-width: 380px;
  margin-bottom: 2.5rem;
}
.au-mission strong { color: var(--dark); font-weight: 600; }
.au-stats {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 1.5rem;
  background: #fff;
  padding: 2.5rem 4rem;
  border-bottom: 1px solid var(--border);
}
.au-stat-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--dark);
  line-height: 1;
  margin-bottom: .3rem;
}
.au-stat-label {
  font-size: .62rem;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--warm);
}
.au-section { max-width: 1100px; margin: 0 auto; padding: 6rem 2rem; }
.au-section-tag {
  font-size: .64rem;
  letter-spacing: .28em;
  text-transform: uppercase;
  color: var(--warm);
  margin-bottom: .8rem;
  display: flex;
  align-items: center;
  gap: .5rem;
}
.au-section-tag::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
.au-section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 4rem;
  max-width: 520px;
}
.au-values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}
.au-value-card {
  background: #fff;
  padding: 2.5rem;
  transition: background .3s;
  cursor: default;
  position: relative;
  overflow: hidden;
}
.au-value-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 0; height: 2.5px;
  background: var(--accent-color, var(--sage));
  transition: width .4s ease;
}
.au-value-card:hover { background: #fafaf7; }
.au-value-card:hover::after { width: 100%; }
.au-value-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: .75rem;
  color: var(--warm);
  letter-spacing: .14em;
  margin-bottom: 1.2rem;
}
.au-value-icon {
  width: 36px; height: 36px;
  margin-bottom: 1.2rem;
  color: var(--warm);
  transition: color .3s;
}
.au-value-card:hover .au-value-icon { color: var(--sage); }
.au-value-label {
  font-size: .7rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--sage);
  margin-bottom: .5rem;
  font-weight: 600;
}
.au-value-headline {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-weight: 400;
  color: var(--dark);
  margin-bottom: .7rem;
  line-height: 1.3;
}
.au-value-body {
  font-size: .90rem;
  color: #6b6b6eff;
  line-height: 1.8;
}
.au-manifesto {
  background: var(--dark);
  padding: 7rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.au-manifesto::before {
  content: '"';
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Cormorant Garamond', serif;
  font-size: 26rem;
  color: rgba(255,255,255,.04);
  font-weight: 700;
  line-height: 1;
}
.au-manifesto-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3.5vw, 2.8rem);
  font-weight: 300;
  font-style: italic;
  color: #fff;
  line-height: 1.5;
  max-width: 780px;
  margin: 0 auto 2rem;
}
.au-manifesto-text em { color: var(--sage); font-style: normal; }
.au-manifesto-sig {
  font-size: .65rem;
  letter-spacing: .25em;
  text-transform: uppercase;
  color: rgba(255,255,255,.35);
}
.au-team-section { background: var(--cream); padding: 6rem 2rem; }
.au-team-inner { max-width: 1100px; margin: 0 auto; }
.au-join {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: var(--sage);
  overflow: hidden;
}
.au-join-left {
  padding: 4rem 3.5rem;
}
.au-join-right {
  background: var(--deep);
  padding: 4rem 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.au-join-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  font-weight: 400;
  color: #fff;
  margin-bottom: .8rem;
  line-height: 1.2;
}
.au-join-body {
  font-size: .90rem;
  color: rgba(255,255,255,.75);
  line-height: 1.8;
  margin-bottom: 2rem;
}
.au-btn {
  display: inline-block;
  background: #fff;
  color: var(--dark);
  border: none;
  padding: .85rem 2.2rem;
  font-size: .68rem;
  letter-spacing: .16em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  text-decoration: none;
  transition: background .2s, color .2s;
}
.au-btn:hover { background: var(--dark); color: #fff; }
.au-btn-outline {
  background: transparent;
  color: rgba(255,255,255,.9);
  border: 1.5px solid rgba(255,255,255,.5);
}
.au-btn-outline:hover { background: rgba(255,255,255,.12); color: #fff; }
@media(max-width:900px){
  .au-hero { grid-template-columns: 1fr; }
  .au-hero-left { min-height: 60vh; padding: 3rem 2rem; }
  .au-hero-right { padding: 3rem 2rem; }
  .au-stats { grid-template-columns: repeat(2,1fr); padding: 2rem; }
  .au-values-grid { grid-template-columns: 1fr; }
  .au-join { grid-template-columns: 1fr; }
}
`;

export default function AboutUs({ cart=[], wish=[] }) {
  const addRef = useScrollReveal();
  const lineRef = useRef(null);

  useEffect(() => {
    // Animate the decorative line on mount
    if (lineRef.current) {
      lineRef.current.style.width = "0";
      setTimeout(() => {
        if (lineRef.current) lineRef.current.style.width = "60px";
      }, 400);
    }
  }, []);

  return (
    <div style={{minHeight:"100vh",background:"var(--cream)"}}>
      <style>{SHARED_CSS}</style>
      <style>{CSS}</style>

      <SHNav cart={cart} wish={wish}/>

      {/* ── HERO ── */}
      <section className="au-hero">
        <div className="au-hero-left">
          <div className="au-tag" style={{color:"var(--sage)"}}>Our Story</div>
          <h1 className="au-h1">
            Where Egyptian<br/>
            Fashion<br/>
            <em className="au-h1-em">Finds Its Stage</em>
          </h1>
        </div>
        <div className="au-hero-right">
          <div className="au-tag">Est. 2025 · ALexandria, Egypt</div>
          <p className="au-mission">
            StyleHub was born from a simple belief: <strong>Egypt's designers deserve a world-class platform.</strong>{" "}
            We connect independent local brands with fashion lovers who value originality, craftsmanship, and identity over mass production.
          </p>
          <p className="au-mission" style={{marginBottom:"2rem"}}>
            We're not just a marketplace — we're a movement for <strong>local fashion culture.</strong> Every purchase supports a real Egyptian designer, a real story, and a more vibrant creative economy.
          </p>
          <a href="/seller" className="au-btn">Become a Brand Partner</a>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="au-stats">
        {STATS.map(s => (
          <div key={s.label} className="reveal" ref={addRef}>
            <div className="au-stat-num">{s.num}</div>
            <div className="au-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── VALUES ── */}
      <section className="au-section">
        <div className="au-section-tag">What We Stand For</div>
        <h2 className="au-section-title reveal" ref={addRef}>
          Six principles that shape<br/>
          <em style={{fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>everything we do</em>
        </h2>
        <div className="au-values-grid">
          {VALUES.map((v, i) => (
            <div
              key={v.id}
              className={`au-value-card reveal d${(i%4)+1}`}
              ref={addRef}
              style={{"--accent-color": v.accent}}
            >
              <div className="au-value-num">{v.id}</div>
              <div className="au-value-icon">{v.icon}</div>
              <div className="au-value-label">{v.label}</div>
              <div className="au-value-headline">{v.headline}</div>
              <p className="au-value-body">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="au-manifesto">
        <p className="au-manifesto-text reveal" ref={addRef}>
          "Fashion is not just clothing — it's a language.<br/>
          And we're here to give <em>Egypt's voice</em> the platform it deserves."
        </p>
        <div className="au-manifesto-sig">— The StyleHub Team</div>
      </section>

      {/* ── JOIN / SELL ── */}
      <section style={{padding:"6rem 2rem",maxWidth:1100,margin:"0 auto"}} className="reveal" ref={addRef}>
        <div className="au-join">
          <div className="au-join-left">
            <div className="au-tag" style={{color:"rgba(255,255,255,.6)"}}>For Designers</div>
            <div className="au-join-title">Sell With Us</div>
            <p className="au-join-body">
              Are you an Egyptian fashion brand? Join StyleHub and reach thousands of shoppers who love local. We handle the platform — you focus on creating.
            </p>
            <a href="/seller" className="au-btn">Apply Now</a>
          </div>
          <div className="au-join-right">
            <div className="au-tag" style={{color:"rgba(255,255,255,.4)"}}>For Shoppers</div>
            <div className="au-join-title" style={{fontSize:"1.6rem"}}>Discover Local Fashion</div>
            <p className="au-join-body">
              Browse curated collections from Egypt's most exciting independent brands — all in one place.
            </p>
            <a href="/" className="au-btn au-btn-outline">Shop Now</a>
          </div>
        </div>
      </section>

      <SHFooter/>
    </div>
  );
}