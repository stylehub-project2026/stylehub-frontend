import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SHNav, SHFooter, SHARED_CSS } from "./shared";

const FAQS = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I register as a seller on StyleHub?",
        a: "Click 'Sell With Us' in the navigation bar and fill out the seller registration form with your brand name, email, and password. Once submitted, your account will be created and you can start adding products immediately.",
      },
      {
        q: "Is there a fee to join StyleHub as a seller?",
        a: "No — joining StyleHub is completely free. We believe in supporting local Egyptian designers, so there are no setup fees or monthly charges to list your brand on our platform.",
      },
      {
        q: "What kind of brands can sell on StyleHub?",
        a: "StyleHub is built for Egyptian local fashion brands. Whether you sell streetwear, kids clothing, women's fashion, or accessories — if you're a local Egyptian label, you're welcome here.",
      },
    ],
  },
  {
    category: "Products & Dashboard",
    items: [
      {
        q: "How do I add products to my brand page?",
        a: "Log in to your seller dashboard and click 'Add Product'. Fill in the product name, price, sizes, colors, description, and upload photos. Your product will appear on your brand page immediately after saving.",
      },
      {
        q: "How many products can I list?",
        a: "There is no limit on the number of products you can list. Add as many items as your collection includes — the more you list, the more visibility you get.",
      },
      {
        q: "Can I edit or delete a product after publishing?",
        a: "Yes. In your seller dashboard, find the product you want to update, click edit to change details or the delete button to remove it. Changes reflect on your brand page instantly.",
      },
      {
        q: "Why aren't my products showing on my brand page?",
        a: "Make sure you're logged in with the same seller account you used to add the products. If the issue persists, try logging out and back in. Your seller ID must match the products in our database.",
      },
    ],
  },
  {
    category: "Orders & Payments",
    items: [
      {
        q: "How do I know when I receive an order?",
        a: "Currently, orders placed by customers are visible in your seller dashboard. We recommend checking it regularly. Email notifications for new orders are coming in a future update.",
      },
      {
        q: "How do I get paid?",
        a: "Payment methods and payout schedules are managed directly with the StyleHub team. Contact us via the form below to discuss your preferred payment arrangement — we support bank transfer and Fawry.",
      },
      {
        q: "What is the return policy for my products?",
        a: "StyleHub's platform-wide return window is 14 days from delivery. As a seller, you should be prepared to accept returns for items that arrive damaged or significantly different from the listing.",
      },
    ],
  },
  {
    category: "Account & Brand Page",
    items: [
      {
        q: "Can I upload a logo for my brand?",
        a: "Yes — in your seller dashboard, you can upload a brand logo. This logo will appear on your brand page hero and in the StyleHub brands carousel on the homepage.",
      },
      {
        q: "How do I reset my seller password?",
        a: "On the seller login page, click 'Forgot Password' and enter your registered email. You'll receive a reset link. If you don't receive it within a few minutes, check your spam folder.",
      },
      {
        q: "Can I have multiple brand pages?",
        a: "Each seller account is linked to one brand. If you manage multiple brands, you'll need a separate seller account and email address for each one.",
      },
    ],
  },
];

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        transition: "background .2s",
        background: open ? "#fafaf8" : "transparent",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.1rem 1.4rem",
        gap: "1rem",
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: ".82rem",
          fontWeight: open ? 600 : 400,
          color: open ? "var(--dark)" : "#555",
          lineHeight: 1.4,
          transition: "all .2s",
        }}>{q}</span>
        <span style={{
          fontSize: "1.1rem",
          color: "var(--sage)",
          flexShrink: 0,
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform .25s",
          fontWeight: 300,
        }}>+</span>
      </div>
      {open && (
        <div style={{
          padding: "0 1.4rem 1.2rem",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: ".79rem",
          color: "var(--warm)",
          lineHeight: 1.85,
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function SellerSupport({ cart, wish }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Getting Started");
  const [formData, setFormData] = useState({ name: "", email: "", brand: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setFormData({ name: "", email: "", brand: "", message: "" });
  };

  const activeItems = FAQS.find(f => f.category === activeCategory)?.items || [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <style>{SHARED_CSS + PAGE_CSS}</style>
      <SHNav cart={cart} wish={wish} />

      {/* ── HERO ── */}
      <section style={{
        background: "var(--dark)",
        padding: "5rem 6%",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(146,160,121,.15)", top: "-100px", right: "10%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(146,160,121,.1)", bottom: "-60px", right: "20%", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 700 }}>
          <div style={{ fontSize: ".58rem", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--sage)", marginBottom: "1rem" }}>
            StyleHub · Seller Support
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 400,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "1.2rem",
          }}>
            We're here to help<br />
            <span style={{ color: "var(--sage)", fontStyle: "italic" }}>your brand grow.</span>
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: ".88rem",
            color: "rgba(255,255,255,.55)",
            lineHeight: 1.8,
            maxWidth: 480,
            marginBottom: "2rem",
          }}>
            Find answers to the most common seller questions below, or send us a message and we'll get back to you.
          </p>
          <button
            onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "var(--sage)",
              color: "#fff",
              border: "none",
              padding: ".75rem 2rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: ".68rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 3,
              transition: "background .2s",
            }}
            onMouseEnter={e => e.target.style.background = "#728060"}
            onMouseLeave={e => e.target.style.background = "var(--sage)"}
          >
            Contact Us
          </button>
        </div>
      </section>

      {/* ── QUICK CARDS ── */}
      <section style={{ padding: "3rem 6%", background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.2rem", maxWidth: 900, margin: "0 auto" }}>
          {[
            { icon: "📦", title: "Dashboard Guide", sub: "Learn how to add and manage your products step by step." },
            { icon: "💳", title: "Payments", sub: "Understand how and when you get paid for your sales." },
            { icon: "📩", title: "Contact Team", sub: "Reach our seller support team directly for personal help." },
          ].map((c, i) => (
            <div key={i} className="quick-card">
              <div style={{ fontSize: "1.6rem", marginBottom: ".6rem" }}>{c.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 400, color: "var(--dark)", marginBottom: ".4rem" }}>{c.title}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: ".74rem", color: "var(--warm)", lineHeight: 1.6 }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "4rem 6%", background: "var(--cream)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontSize: ".58rem", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".5rem" }}>
              Seller FAQ
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 400, color: "var(--dark)", margin: 0 }}>
              Common Questions
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "2.5rem", alignItems: "flex-start" }}>

            {/* Category tabs */}
            <div style={{ position: "sticky", top: "80px" }}>
              {FAQS.map(f => (
                <div
                  key={f.category}
                  onClick={() => setActiveCategory(f.category)}
                  className="faq-tab"
                  style={{
                    padding: ".65rem .9rem",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: ".74rem",
                    letterSpacing: ".06em",
                    color: activeCategory === f.category ? "var(--dark)" : "var(--warm)",
                    fontWeight: activeCategory === f.category ? 600 : 400,
                    borderLeft: `2px solid ${activeCategory === f.category ? "var(--sage)" : "transparent"}`,
                    transition: "all .2s",
                    marginBottom: ".2rem",
                  }}
                >
                  {f.category}
                </div>
              ))}
            </div>

            {/* FAQ items */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{
                padding: ".9rem 1.4rem",
                background: "var(--cream)",
                borderBottom: "1px solid var(--border)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: ".58rem",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "var(--warm)",
                fontWeight: 600,
              }}>
                {activeCategory}
              </div>
              {activeItems.map((item, i) => (
                <AccordionItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="contact-form" style={{ padding: "4rem 6%", background: "#fff", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: ".58rem", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--warm)", marginBottom: ".5rem" }}>
              Still have questions?
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--dark)", margin: 0 }}>
              Send Us a Message
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            {[
              { key: "name", label: "Your Name", placeholder: "Habiba Mohamed" },
              { key: "brand", label: "Brand Name", placeholder: "Your Brand" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--dark)", fontWeight: 600, marginBottom: ".4rem" }}>{label}</div>
                <input
                  value={formData[key]}
                  onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: ".75rem .9rem", border: "1px solid var(--border)", fontFamily: "'DM Sans', sans-serif", fontSize: ".82rem", outline: "none", borderRadius: 4, background: "var(--cream)", color: "var(--dark)", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "var(--dark)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--dark)", fontWeight: 600, marginBottom: ".4rem" }}>Email</div>
            <input
              value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="your@email.com"
              type="email"
              style={{ width: "100%", padding: ".75rem .9rem", border: "1px solid var(--border)", fontFamily: "'DM Sans', sans-serif", fontSize: ".82rem", outline: "none", borderRadius: 4, background: "var(--cream)", color: "var(--dark)", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "var(--dark)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--dark)", fontWeight: 600, marginBottom: ".4rem" }}>Message</div>
            <textarea
              value={formData.message}
              onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
              placeholder="Tell us what you need help with..."
              rows={5}
              style={{ width: "100%", padding: ".75rem .9rem", border: "1px solid var(--border)", fontFamily: "'DM Sans', sans-serif", fontSize: ".82rem", outline: "none", borderRadius: 4, background: "var(--cream)", color: "var(--dark)", resize: "vertical", lineHeight: 1.7, boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "var(--dark)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              background: sent ? "var(--sage)" : "var(--dark)",
              color: "#fff",
              border: "none",
              padding: "1rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: ".68rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 4,
              transition: "background .3s",
            }}
          >
            {sent ? "✓ Message Sent" : "Send Message"}
          </button>

          <div style={{ marginTop: "2rem", padding: "1.2rem", background: "var(--cream)", borderRadius: 6, border: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: ".7rem", color: "var(--warm)", lineHeight: 1.7, textAlign: "center" }}>
              You can also reach us on{" "}
              <a href="https://www.instagram.com/stylehub7500" target="_blank" rel="noopener noreferrer" style={{ color: "var(--dark)", fontWeight: 600, textDecoration: "none" }}>Instagram</a>
              {" "}or{" "}
              <a href="https://www.facebook.com/share/18ztJYRk3q/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--dark)", fontWeight: 600, textDecoration: "none" }}>Facebook</a>
              {" "}— we usually respond within 24 hours.
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: "var(--dark)", padding: "3.5rem 6%", textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, color: "#fff", marginBottom: ".8rem" }}>
          Ready to start selling?
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: ".8rem", color: "rgba(255,255,255,.5)", marginBottom: "1.8rem" }}>
          Join StyleHub and put your brand in front of thousands of Egyptian shoppers.
        </p>
        <button
          onClick={() => navigate("/seller")}
          style={{ background: "var(--sage)", color: "#fff", border: "none", padding: ".8rem 2.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: ".68rem", letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer", borderRadius: 3 }}
        >
          Sign Up as a Seller
        </button>
      </section>

      <SHFooter />
    </div>
  );
}

const PAGE_CSS = `
  .quick-card {
    padding: 1.6rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--cream);
    transition: box-shadow .25s, transform .25s;
  }
  .quick-card:hover {
    box-shadow: 0 8px 28px rgba(26,26,24,.08);
    transform: translateY(-4px);
  }
  .faq-tab:hover {
    color: var(--dark) !important;
    border-left-color: var(--border) !important;
  }

  @media (max-width: 768px) {
    .quick-card-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 768px) {
    section { padding-left: 5% !important; padding-right: 5% !important; }

    .faq-layout {
      grid-template-columns: 1fr !important;
    }

    .faq-tabs-row {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: wrap !important;
      gap: .4rem !important;
      position: static !important;
      margin-bottom: 1.2rem;
    }

    .faq-tab-item {
      border-left: none !important;
      border-bottom: 2px solid transparent !important;
      padding: .4rem .7rem !important;
      font-size: .68rem !important;
    }

    .form-two-col {
      grid-template-columns: 1fr !important;
    }
  }
`;
