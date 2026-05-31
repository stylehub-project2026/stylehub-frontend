import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminToken, removeAdminToken } from './adminAuth';

const BACKEND_URL = 'https://stylehub-backend-tau.vercel.app';

export default function AdminDashboard() {
    const [sellers, setSellers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [commissions, setCommissions] = useState({ orders: [], totalCommission: 0, totalSales: 0 });
    const [subRevenue, setSubRevenue] = useState({ sellers: [], totalSubscriptionRevenue: 0 });
    const [tab, setTab] = useState('sellers');
    const [approveModal, setApproveModal] = useState(null); // seller object
    const [paidAmount, setPaidAmount] = useState('');
    const navigate = useNavigate();
    const token = getAdminToken();

    useEffect(() => {
        if (!token) return navigate('/admin/login');
        fetchSellers();
        fetchCustomers();
        fetchCommissions();
        fetchSubRevenue();
    }, []);

    const fetchSellers = async () => {
        const res = await fetch(`${BACKEND_URL}/api/admin/sellers`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setSellers(Array.isArray(data) ? data : []);
    };

    const fetchCustomers = async () => {
        const res = await fetch(`${BACKEND_URL}/api/admin/customers`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
    };

    const fetchCommissions = async () => {
        const res = await fetch(`${BACKEND_URL}/api/admin/commissions`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setCommissions(data);
    };

    const fetchSubRevenue = async () => {
        const res = await fetch(`${BACKEND_URL}/api/admin/subscription-revenue`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setSubRevenue(data);
    };

    const approveSeller = async () => {
        if (!approveModal) return;

        try {
            const res = await fetch(`${BACKEND_URL}/api/seller/admin/approve-subscription/${approveModal._id}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ paidAmount: Number(paidAmount) || approveModal.subscriptionPaidAmount || 0 }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || data.success === false) {
                alert(data.message || 'Failed to approve seller.');
                return;
            }

            alert('Seller approved and approval email sent.');
            setApproveModal(null);
            setPaidAmount('');
            fetchSellers();
            fetchSubRevenue();
        } catch (err) {
            console.error(err);
            alert('Server error while approving seller.');
        }
    };

    const rejectSeller = async (seller) => {
        const reason = window.prompt('Reason for rejection:', 'Your payment or application could not be verified.');
        if (reason === null) return;

        try {
            const res = await fetch(`${BACKEND_URL}/api/seller/admin/reject-subscription/${seller._id}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || data.success === false) {
                alert(data.message || 'Failed to reject seller.');
                return;
            }

            alert('Seller rejected and rejection email sent.');
            fetchSellers();
            fetchSubRevenue();
        } catch (err) {
            console.error(err);
            alert('Server error while rejecting seller.');
        }
    };

    const deleteSeller = async (id) => {
        if (!window.confirm('Delete this seller?')) return;
        await fetch(`${BACKEND_URL}/api/admin/sellers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        fetchSellers();
    };

    const deleteCustomer = async (id) => {
        if (!window.confirm('Delete this customer?')) return;
        await fetch(`${BACKEND_URL}/api/admin/customers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        fetchCustomers();
    };

    const getDiscountStatus = (seller) => {
        if (!seller.discountEndsAt) return null;
        const daysLeft = Math.ceil((new Date(seller.discountEndsAt) - new Date()) / (1000 * 60 * 60 * 24));
        return { active: daysLeft > 0, daysLeft: Math.max(0, daysLeft) };
    };

    const th = { padding: '12px 16px', background: '#f8f6f2', textAlign: 'left', fontSize: '.75rem', letterSpacing: '.08em', color: '#8c8880', fontWeight: 600 };
    const td = { padding: '12px 16px', borderBottom: '1px solid #e4e0da', fontSize: '.85rem' };

    return (
        <div style={{ minHeight: '100vh', background: '#F8F6F2', fontFamily: 'DM Sans, sans-serif' }}>
            {/* Header */}
            <div style={{ background: '#1a1a18', color: '#fff', padding: '0 2rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', letterSpacing: '.1em' }}>StyleHub Admin</span>
                <button onClick={() => { removeAdminToken(); navigate('/admin/login'); }}
                    style={{ background: 'none', border: '1px solid rgba(255,255,255,.3)', color: '#fff', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem' }}>
                    Logout
                </button>
            </div>

            {/* Approve Modal */}
            {approveModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: 360 }}>
                        <h3 style={{ marginBottom: '.5rem', fontSize: '1.1rem' }}>Approve {approveModal.brandName}</h3>
                        <p style={{ fontSize: '.85rem', color: '#8c8880', marginBottom: '1.2rem' }}>Enter the subscription amount the seller paid:</p>
                        <input
                            type="number"
                            placeholder="e.g. 200"
                            value={paidAmount}
                            onChange={e => setPaidAmount(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e4e0da', fontSize: '.9rem', marginBottom: '1rem', boxSizing: 'border-box' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={approveSeller}
                                style={{ flex: 1, padding: '10px', background: '#92A079', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                                Confirm & Approve
                            </button>
                            <button onClick={() => { setApproveModal(null); setPaidAmount(''); }}
                                style={{ flex: 1, padding: '10px', background: '#f8f6f2', color: '#1a1a18', border: '1px solid #e4e0da', borderRadius: 8, cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ padding: '2rem' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Sellers', value: sellers.length, color: '#92A079' },
                        { label: 'Total Customers', value: customers.length, color: '#c8a96e' },
                        { label: 'Subscription Revenue', value: `EGP ${(subRevenue.totalSubscriptionRevenue || 0).toLocaleString()}`, color: '#728060' },
                        { label: 'Orders Commission (10%)', value: `EGP ${(commissions.totalCommission || 0).toLocaleString()}`, color: '#1a1a18' },
                    ].map(s => (
                        <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1.2rem 1.5rem', border: '1px solid #e4e0da' }}>
                            <div style={{ fontSize: '.75rem', color: '#8c8880', marginBottom: '.4rem' }}>{s.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    {[['sellers', `Sellers (${sellers.length})`], ['customers', `Customers (${customers.length})`], ['revenue', 'Revenue']].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            style={{ padding: '8px 20px', background: tab === key ? '#1a1a18' : '#fff', color: tab === key ? '#fff' : '#1a1a18', border: '1px solid #e4e0da', borderRadius: 8, cursor: 'pointer', fontSize: '.85rem' }}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Sellers Table */}
                {tab === 'sellers' && (
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e4e0da', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>{['Brand', 'Email', 'Plan', 'Paid', 'Discount', 'Status', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {sellers.length === 0 && <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#8c8880' }}>No sellers found</td></tr>}
                                {sellers.map(s => {
                                    const disc = getDiscountStatus(s);
                                    return (
                                        <tr key={s._id}>
                                            <td style={td}><strong>{s.brandName}</strong></td>
                                            <td style={td}>{s.email}</td>
                                            <td style={td}><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, background: '#f8f6f2' }}>{s.subscriptionPlan || 'standard'}</span></td>
                                            <td style={td}>
                                                {s.subscriptionPaidAmount > 0
                                                    ? <span style={{ color: '#2e7d32', fontWeight: 600 }}>EGP {s.subscriptionPaidAmount}</span>
                                                    : <span style={{ color: '#ccc' }}>—</span>}
                                            </td>
                                            <td style={td}>
                                                {disc ? (
                                                    disc.active
                                                        ? <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, background: '#fff3cd', color: '#856404' }}>50% OFF — {disc.daysLeft}d left</span>
                                                        : <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, background: '#fde8e8', color: '#c0392b' }}>Expired</span>
                                                ) : <span style={{ color: '#ccc', fontSize: '.75rem' }}>—</span>}
                                            </td>
                                            <td style={td}>
                                                <span style={{
                                                    padding: '3px 10px',
                                                    borderRadius: 20,
                                                    fontSize: '.75rem',
                                                    fontWeight: 600,
                                                    background: s.isApproved ? '#e8f5e9' : s.subscriptionStatus === 'rejected' ? '#fde8e8' : '#fff3e0',
                                                    color: s.isApproved ? '#2e7d32' : s.subscriptionStatus === 'rejected' ? '#c0392b' : '#e65100'
                                                }}>
                                                    {s.isApproved ? 'Approved' : s.subscriptionStatus === 'rejected' ? 'Rejected' : 'Pending'}
                                                </span>
                                            </td>
                                            <td style={td}>
                                                {!s.isApproved && (
                                                    <button onClick={() => setApproveModal(s)}
                                                        style={{ marginRight: 8, padding: '5px 12px', background: '#92A079', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem' }}>
                                                        Approve
                                                    </button>
                                                )}
                                                {!s.isApproved && s.subscriptionStatus !== 'rejected' && (
                                                    <button onClick={() => rejectSeller(s)}
                                                        style={{ marginRight: 8, padding: '5px 12px', background: '#fff', color: '#c0392b', border: '1px solid #c0392b', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem' }}>
                                                        Reject
                                                    </button>
                                                )}
                                                <button onClick={() => deleteSeller(s._id)}
                                                    style={{ padding: '5px 12px', background: '#fff', color: '#e63946', border: '1px solid #e63946', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem' }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Customers Table */}
                {tab === 'customers' && (
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e4e0da', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>{['Name', 'Email', 'Phone', 'Points', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 && <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#8c8880' }}>No customers found</td></tr>}
                                {customers.map(c => (
                                    <tr key={c._id}>
                                        <td style={td}>{c.firstName} {c.lastName}</td>
                                        <td style={td}>{c.email}</td>
                                        <td style={td}>{c.phone || '—'}</td>
                                        <td style={td}>{c.points}</td>
                                        <td style={td}>
                                            <button onClick={() => deleteCustomer(c._id)}
                                                style={{ padding: '5px 12px', background: '#fff', color: '#e63946', border: '1px solid #e63946', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem' }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Revenue Tab */}
                {tab === 'revenue' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                            {[
                                { label: 'Subscription Payments', value: `EGP ${(subRevenue.totalSubscriptionRevenue || 0).toLocaleString()}` },
                                { label: 'Orders Commission (10%)', value: `EGP ${(commissions.totalCommission || 0).toLocaleString()}` },
                                { label: 'Total StyleHub Revenue', value: `EGP ${((subRevenue.totalSubscriptionRevenue || 0) + (commissions.totalCommission || 0)).toLocaleString()}` },
                            ].map(s => (
                                <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1.2rem 1.5rem', border: '1px solid #e4e0da', textAlign: 'center' }}>
                                    <div style={{ fontSize: '.75rem', color: '#8c8880', marginBottom: '.4rem' }}>{s.label}</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a18' }}>{s.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Subscription payments table */}
                        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e4e0da', overflow: 'hidden', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e4e0da', fontWeight: 600, fontSize: '.85rem' }}>Subscription Payments</div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>{['Brand', 'Plan', 'Amount Paid', 'Date'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {(!subRevenue.sellers || subRevenue.sellers.length === 0) && (
                                        <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: '#8c8880' }}>No subscription payments yet</td></tr>
                                    )}
                                    {(subRevenue.sellers || []).map(s => (
                                        <tr key={s._id}>
                                            <td style={td}><strong>{s.brandName}</strong></td>
                                            <td style={td}>{s.subscriptionPlan}</td>
                                            <td style={{ ...td, color: '#92A079', fontWeight: 600 }}>EGP {s.subscriptionPaidAmount}</td>
                                            <td style={td}>{s.subscriptionPaidAt ? new Date(s.subscriptionPaidAt).toLocaleDateString('en-EG') : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}