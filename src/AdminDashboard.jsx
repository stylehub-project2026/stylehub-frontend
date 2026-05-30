import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminToken, removeAdminToken } from './adminAuth';

const BACKEND_URL = 'https://stylehub-backend-tau.vercel.app';

export default function AdminDashboard() {
    const [sellers, setSellers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [tab, setTab] = useState('sellers');
    const navigate = useNavigate();
    const token = getAdminToken();

    useEffect(() => {
        if (!token) return navigate('/admin/login');
        fetchSellers();
        fetchCustomers();
    }, []);

    const fetchSellers = async () => {
        const res = await fetch(`${BACKEND_URL}/api/admin/sellers`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSellers(Array.isArray(data) ? data : []);
    };

    const fetchCustomers = async () => {
        const res = await fetch(`${BACKEND_URL}/api/admin/customers`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
    };

    const approveSeller = async (id) => {
        await fetch(`${BACKEND_URL}/api/admin/sellers/${id}/approve`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchSellers();
    };

    const deleteSeller = async (id) => {
        if (!window.confirm('Delete this seller?')) return;
        await fetch(`${BACKEND_URL}/api/admin/sellers/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchSellers();
    };

    const deleteCustomer = async (id) => {
        if (!window.confirm('Delete this customer?')) return;
        await fetch(`${BACKEND_URL}/api/admin/customers/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchCustomers();
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

            <div style={{ padding: '2rem' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    {[['sellers', `Sellers (${sellers.length})`], ['customers', `Customers (${customers.length})`]].map(([key, label]) => (
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
                                <tr>
                                    {['Brand', 'Email', 'Category', 'Status', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.length === 0 && <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#8c8880' }}>No sellers found</td></tr>}
                                {sellers.map(s => (
                                    <tr key={s._id}>
                                        <td style={td}><strong>{s.brandName}</strong></td>
                                        <td style={td}>{s.email}</td>
                                        <td style={td}>{s.category}</td>
                                        <td style={td}>
                                            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, background: s.isApproved ? '#e8f5e9' : '#fff3e0', color: s.isApproved ? '#2e7d32' : '#e65100' }}>
                                                {s.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={td}>
                                            {!s.isApproved && (
                                                <button onClick={() => approveSeller(s._id)}
                                                    style={{ marginRight: 8, padding: '5px 12px', background: '#92A079', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem' }}>
                                                    Approve
                                                </button>
                                            )}
                                            <button onClick={() => deleteSeller(s._id)}
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

                {/* Customers Table */}
                {tab === 'customers' && (
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e4e0da', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Name', 'Email', 'Phone', 'Points', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}
                                </tr>
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
            </div>
        </div>
    );
}