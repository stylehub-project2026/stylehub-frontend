import { useNavigate } from 'react-router-dom';
import { SHNav, SHFooter, SHARED_CSS } from './shared';

export default function SellerPayment() {
    const navigate = useNavigate();

    return (
        <>
            <style>{SHARED_CSS}</style>
            <SHNav />
            <div style={{ minHeight: '100vh', background: '#f5f7f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ maxWidth: 560, width: '100%', background: '#fff', borderRadius: 22, padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.09)' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e3e8d9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.8rem' }}>
                            🎉
                        </div>
                        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#1a1a18', marginBottom: '.5rem' }}>
                            Store Created Successfully!
                        </h2>
                        <p style={{ color: '#8c8880', fontSize: '.9rem', lineHeight: 1.6 }}>
                            One last step — complete your subscription to activate your store on StyleHub.
                        </p>
                    </div>

                    {/* Plan Box */}
                    <div style={{ background: '#f5f7f0', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', border: '2px solid #92A079' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#92A079', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.3rem' }}>Monthly Plan</div>
                                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a18' }}>EGP 299 <span style={{ fontSize: '.9rem', fontWeight: 400, color: '#8c8880' }}>/month</span></div>
                            </div>
                            <div style={{ background: '#92A079', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: '.75rem', fontWeight: 700 }}>
                                Active Plan
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                            {['Dedicated brand storefront', 'Unlimited product listings', 'Analytics dashboard', 'Featured placements', '24/7 seller support'].map(f => (
                                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.85rem', color: '#444' }}>
                                    <span style={{ color: '#92A079', fontWeight: 700 }}>✓</span> {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '.8rem', fontWeight: 700, color: '#555', marginBottom: '1rem', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                            Pay via
                        </div>

                        {/* Vodafone Cash */}
                        <div style={{ background: '#fff5f5', border: '1px solid #fdd', borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '.5rem' }}>
                                <span style={{ fontSize: '1.3rem' }}>📱</span>
                                <span style={{ fontWeight: 700, color: '#c0392b', fontSize: '.95rem' }}>Vodafone Cash</span>
                            </div>
                            <div style={{ fontSize: '.85rem', color: '#555', lineHeight: 1.6 }}>
                                Send <strong>EGP 299</strong> to: <strong style={{ color: '#c0392b', fontSize: '1rem' }}>01XXXXXXXXX</strong>
                                <br />
                                <span style={{ fontSize: '.8rem', color: '#8c8880' }}>Use your brand name as reference</span>
                            </div>
                        </div>

                        {/* Instapay */}
                        <div style={{ background: '#f0f7ff', border: '1px solid #cde', borderRadius: 12, padding: '1rem 1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '.5rem' }}>
                                <span style={{ fontSize: '1.3rem' }}>🏦</span>
                                <span style={{ fontWeight: 700, color: '#2471a3', fontSize: '.95rem' }}>Instapay</span>
                            </div>
                            <div style={{ fontSize: '.85rem', color: '#555', lineHeight: 1.6 }}>
                                Send <strong>EGP 299</strong> to: <strong style={{ color: '#2471a3', fontSize: '1rem' }}>stylehub@instapay</strong>
                                <br />
                                <span style={{ fontSize: '.8rem', color: '#8c8880' }}>Use your brand name as reference</span>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div style={{ background: '#fffbeb', border: '1px solid #f6d860', borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '1.5rem', fontSize: '.83rem', color: '#7d6608', lineHeight: 1.6 }}>
                        ⏳ After sending payment, our team will verify and activate your store within <strong>24 hours</strong>. You'll receive a confirmation email.
                    </div>

                    {/* CTA */}
                    <button
                        onClick={() => navigate('/seller/dashboard')}
                        style={{ width: '100%', padding: '13px', background: '#92A079', color: '#fff', border: 'none', borderRadius: 25, fontSize: '.88rem', fontWeight: 700, letterSpacing: '1px', cursor: 'pointer' }}>
                        I'VE SENT THE PAYMENT →
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '.78rem', color: '#8c8880', marginTop: '.8rem' }}>
                        Your store will be reviewed and activated within 24 hours.
                    </p>
                </div>
            </div>
            <SHFooter />
        </>
    );
}
