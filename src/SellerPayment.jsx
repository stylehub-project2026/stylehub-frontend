import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SHNav, SHFooter, SHARED_CSS } from './shared';

const PLANS = [
    {
        id: 'basic',
        name: 'Basic',
        price: 199,
        color: '#8c8880',
        features: [
            'Dedicated brand page',
            'Unlimited product listings',
            'Basic analytics',
            'Email support',
        ],
        notIncluded: ['Featured in category pages', 'Homepage placement', 'Priority support'],
    },
    {
        id: 'standard',
        name: 'Standard',
        price: 399,
        color: '#92A079',
        popular: true,
        features: [
            'Dedicated brand page',
            'Unlimited product listings',
            'Advanced analytics',
            'Featured in category pages',
            'Priority email support',
        ],
        notIncluded: ['Homepage placement'],
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 699,
        color: '#c8a96e',
        features: [
            'Dedicated brand page',
            'Unlimited product listings',
            'Full analytics dashboard',
            'Featured in category pages',
            '🏠 Homepage placement',
            '24/7 Priority support',
        ],
        notIncluded: [],
    },
];

export default function SellerPayment() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState('standard');
    const [paid, setPaid] = useState(false);

    const plan = PLANS.find(p => p.id === selected);

    return (
        <>
            <style>{SHARED_CSS}</style>
            <SHNav />
            <div style={{ minHeight: '100vh', background: '#f5f7f0', padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e3e8d9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.8rem' }}>
                            🎉
                        </div>
                        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#1a1a18', marginBottom: '.5rem' }}>
                            Choose Your Plan
                        </h2>
                        <p style={{ color: '#8c8880', fontSize: '.9rem' }}>
                            Select the plan that fits your brand. You can upgrade anytime.
                        </p>
                    </div>

                    {/* Plans */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2.5rem' }}>
                        {PLANS.map(p => (
                            <div key={p.id} onClick={() => setSelected(p.id)}
                                style={{
                                    background: '#fff', borderRadius: 18, padding: '1.8rem 1.5rem',
                                    border: `2px solid ${selected === p.id ? p.color : '#e4e0da'}`,
                                    cursor: 'pointer', transition: 'all .2s', position: 'relative',
                                    boxShadow: selected === p.id ? `0 8px 24px ${p.color}33` : 'none',
                                }}>

                                {p.popular && (
                                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#92A079', color: '#fff', fontSize: '.7rem', fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: '.08em', whiteSpace: 'nowrap' }}>
                                        MOST POPULAR
                                    </div>
                                )}

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '.75rem', fontWeight: 700, color: p.color, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.4rem' }}>{p.name}</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a1a18' }}>
                                        EGP {p.price}
                                        <span style={{ fontSize: '.85rem', fontWeight: 400, color: '#8c8880' }}>/mo</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem', marginBottom: '1rem' }}>
                                    {p.features.map(f => (
                                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '.5rem', fontSize: '.82rem', color: '#444' }}>
                                            <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                                        </div>
                                    ))}
                                    {p.notIncluded.map(f => (
                                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '.5rem', fontSize: '.82rem', color: '#ccc' }}>
                                            <span style={{ flexShrink: 0 }}>✕</span> {f}
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    width: '100%', padding: '10px', borderRadius: 25, border: `2px solid ${p.color}`,
                                    background: selected === p.id ? p.color : 'transparent',
                                    color: selected === p.id ? '#fff' : p.color,
                                    fontSize: '.8rem', fontWeight: 700, textAlign: 'center', letterSpacing: '.08em',
                                }}>
                                    {selected === p.id ? '✓ Selected' : 'Select'}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Box */}
                    <div style={{ maxWidth: 520, margin: '0 auto', background: '#fff', borderRadius: 18, padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '.8rem', fontWeight: 700, color: '#555', marginBottom: '1rem', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                            Pay for {plan.name} Plan — EGP {plan.price}/month
                        </div>

                        {/* Vodafone Cash */}
                        <div style={{ background: '#fff5f5', border: '1px solid #fdd', borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '.5rem' }}>
                                <span style={{ fontSize: '1.3rem' }}>📱</span>
                                <span style={{ fontWeight: 700, color: '#c0392b', fontSize: '.95rem' }}>Vodafone Cash</span>
                            </div>
                            <div style={{ fontSize: '.85rem', color: '#555', lineHeight: 1.6 }}>
                                Send <strong>EGP {plan.price}</strong> to: <strong style={{ color: '#c0392b' }}>01XXXXXXXXX</strong>
                                <br />
                                <span style={{ fontSize: '.8rem', color: '#8c8880' }}>Use your brand name as reference</span>
                            </div>
                        </div>

                        {/* Instapay */}
                        <div style={{ background: '#f0f7ff', border: '1px solid #cde', borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '.5rem' }}>
                                <span style={{ fontSize: '1.3rem' }}>🏦</span>
                                <span style={{ fontWeight: 700, color: '#2471a3', fontSize: '.95rem' }}>Instapay</span>
                            </div>
                            <div style={{ fontSize: '.85rem', color: '#555', lineHeight: 1.6 }}>
                                Send <strong>EGP {plan.price}</strong> to: <strong style={{ color: '#2471a3' }}>stylehub@instapay</strong>
                                <br />
                                <span style={{ fontSize: '.8rem', color: '#8c8880' }}>Use your brand name as reference</span>
                            </div>
                        </div>

                        {/* Note */}
                        <div style={{ background: '#fffbeb', border: '1px solid #f6d860', borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '1.5rem', fontSize: '.83rem', color: '#7d6608', lineHeight: 1.6 }}>
                            ⏳ After sending payment, our team will verify and activate your store within <strong>24 hours</strong>.
                        </div>

                        <button onClick={() => { setPaid(true); setTimeout(() => navigate('/seller/dashboard'), 1200); }}
                            style={{ width: '100%', padding: '13px', background: plan.color, color: '#fff', border: 'none', borderRadius: 25, fontSize: '.88rem', fontWeight: 700, letterSpacing: '1px', cursor: 'pointer' }}>
                            {paid ? '✓ Done! Redirecting…' : "I'VE SENT THE PAYMENT →"}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '.78rem', color: '#8c8880', marginTop: '.8rem' }}>
                            Your store will be reviewed and activated within 24 hours.
                        </p>
                    </div>
                </div>
            </div>
            <SHFooter />
        </>
    );
}