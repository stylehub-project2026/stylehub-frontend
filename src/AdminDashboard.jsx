import { useEffect, useState, useRef } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAdminToken, removeAdminToken } from './adminAuth';

const BACKEND_URL = 'https://stylehub-backend-tau.vercel.app';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sage: #92A079;
  --sage-dark: #728060;
  --sage-light: #e8ede2;
  --cream: #F8F6F2;
  --dark: #1a1a18;
  --warm: #8c8880;
  --border: #e4e0da;
  --gold: #c8a96e;
  --red: #e63946;
  --sidebar-w: 220px;
}

body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--dark); }

.admin-layout { display: flex; min-height: 100vh; }

/* ── SIDEBAR ── */
.sidebar {
  width: var(--sidebar-w);
  background: var(--dark);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 50;
}
.sidebar-logo {
  padding: 1.8rem 1.5rem 1.2rem;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.sidebar-logo h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: .08em;
}
.sidebar-logo span {
  font-size: .65rem;
  color: var(--sage);
  letter-spacing: .15em;
  text-transform: uppercase;
  font-weight: 500;
}
.sidebar-nav { flex: 1; padding: 1rem 0; }
.nav-item {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .75rem 1.5rem;
  cursor: pointer;
  font-size: .82rem;
  font-weight: 500;
  color: rgba(255,255,255,.5);
  transition: all .2s;
  border-left: 3px solid transparent;
  letter-spacing: .02em;
}
.nav-item:hover { color: rgba(255,255,255,.85); background: rgba(255,255,255,.04); }
.nav-item.active { color: #fff; background: rgba(146,160,121,.15); border-left-color: var(--sage); }
.nav-item .nav-icon { font-size: 1rem; width: 18px; text-align: center; }
.nav-badge {
  margin-left: auto;
  background: var(--sage);
  color: #fff;
  font-size: .6rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
}
.sidebar-footer {
  padding: 1.2rem 1.5rem;
  border-top: 1px solid rgba(255,255,255,.08);
}
.logout-btn {
  width: 100%;
  padding: 9px;
  background: rgba(230,57,70,.12);
  color: #f08080;
  border: 1px solid rgba(230,57,70,.25);
  border-radius: 8px;
  cursor: pointer;
  font-size: .8rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  transition: all .2s;
  letter-spacing: .04em;
}
.logout-btn:hover { background: rgba(230,57,70,.2); }

/* ── MAIN ── */
.main { margin-left: var(--sidebar-w); flex: 1; min-height: 100vh; }

/* ── TOPBAR ── */
.topbar {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 40;
}
.topbar-title { font-size: 1rem; font-weight: 600; color: var(--dark); }
.topbar-sub { font-size: .75rem; color: var(--warm); margin-top: 1px; }
.topbar-date {
  font-size: .78rem;
  color: var(--warm);
  background: var(--cream);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border);
}

/* ── CONTENT ── */
.content { padding: 2rem; }

/* ── STAT CARDS ── */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.3rem 1.5rem;
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  transition: box-shadow .2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}
.stat-card.green::before { background: var(--sage); }
.stat-card.gold::before { background: var(--gold); }
.stat-card.dark::before { background: var(--dark); }
.stat-card.sage2::before { background: #728060; }
.stat-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  margin-bottom: .8rem;
}
.stat-icon.green { background: #eaf2e3; color: var(--sage-dark); }
.stat-icon.gold { background: #fef6e4; color: #b8860b; }
.stat-icon.dark { background: #f0ece6; color: var(--dark); }
.stat-icon.sage2 { background: #e3ead9; color: #5a6b48; }
.stat-label { font-size: .72rem; color: var(--warm); font-weight: 500; letter-spacing: .04em; text-transform: uppercase; margin-bottom: .35rem; }
.stat-value { font-size: 1.7rem; font-weight: 700; color: var(--dark); line-height: 1; }

/* ── TABLE CARD ── */
.table-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow: hidden;
}
.table-card-header {
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-card-title { font-size: .9rem; font-weight: 600; color: var(--dark); }
.table-card-count {
  font-size: .72rem;
  background: var(--cream);
  color: var(--warm);
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid var(--border);
  font-weight: 500;
}
table { width: 100%; border-collapse: collapse; }
th {
  padding: 10px 16px;
  background: #fafaf8;
  text-align: left;
  font-size: .7rem;
  letter-spacing: .08em;
  color: var(--warm);
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}
td { padding: 12px 16px; border-bottom: 1px solid #f0ece8; font-size: .84rem; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #fafaf8; }

/* ── BADGES ── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: .7rem;
  font-weight: 600;
  letter-spacing: .03em;
}
.badge-approved { background: #e8f5e9; color: #2e7d32; }
.badge-pending { background: #fff8e1; color: #f57f17; }
.badge-rejected { background: #fde8e8; color: #c62828; }
.badge-plan { background: var(--cream); color: var(--warm); border: 1px solid var(--border); }

/* ── ACTION BUTTONS ── */
.btn {
  padding: 5px 13px;
  border-radius: 7px;
  font-size: .76rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: 'DM Sans', sans-serif;
  transition: all .18s;
  letter-spacing: .02em;
}
.btn-approve { background: var(--sage); color: #fff; }
.btn-approve:hover { background: var(--sage-dark); }
.btn-reject { background: #fff; color: #c62828; border: 1px solid #f5c2c2; }
.btn-reject:hover { background: #fde8e8; }
.btn-delete { background: #fff; color: var(--red); border: 1px solid #fcc; }
.btn-delete:hover { background: #fef0f0; }
.btn-actions { display: flex; gap: 6px; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(26,26,24,.6);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(2px);
}
.modal-box {
  background: #fff;
  border-radius: 18px;
  padding: 2rem;
  width: 380px;
  box-shadow: 0 24px 60px rgba(0,0,0,.15);
}
.modal-title { font-size: 1.1rem; font-weight: 600; margin-bottom: .4rem; }
.modal-sub { font-size: .82rem; color: var(--warm); margin-bottom: 1.3rem; line-height: 1.5; }
.modal-input {
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  font-size: .9rem;
  margin-bottom: 1.2rem;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  transition: border-color .2s;
  background: var(--cream);
}
.modal-input:focus { border-color: var(--sage); background: #fff; }
.modal-actions { display: flex; gap: 8px; }
.btn-confirm { flex: 1; padding: 11px; background: var(--sage); color: #fff; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-family: 'DM Sans', sans-serif; font-size: .85rem; transition: background .2s; }
.btn-confirm:hover { background: var(--sage-dark); }
.btn-cancel { flex: 1; padding: 11px; background: var(--cream); color: var(--dark); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: .85rem; transition: background .2s; }
.btn-cancel:hover { background: #ede9e3; }

/* ── REVENUE ── */
.rev-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.rev-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.3rem 1.5rem;
  border: 1px solid var(--border);
  text-align: center;
}
.rev-label { font-size: .72rem; color: var(--warm); text-transform: uppercase; letter-spacing: .06em; margin-bottom: .4rem; }
.rev-value { font-size: 1.5rem; font-weight: 700; color: var(--dark); }

/* ── CHAT ── */
.chat-layout { display: flex; height: calc(100vh - 180px); background: #fff; border-radius: 14px; border: 1px solid var(--border); overflow: hidden; }
.chat-sidebar { width: 240px; border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; }
.chat-sidebar-header { padding: 1rem 1.2rem; border-bottom: 1px solid var(--border); font-size: .82rem; font-weight: 600; color: var(--dark); background: #fafaf8; }
.chat-sessions { flex: 1; overflow-y: auto; }
.chat-session-item {
  padding: .85rem 1.2rem;
  cursor: pointer;
  border-bottom: 1px solid #f0ece8;
  transition: background .15s;
  display: flex;
  align-items: center;
  gap: .7rem;
}
.chat-session-item:hover { background: #f5f7f0; }
.chat-session-item.active { background: var(--sage-light); }
.chat-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--sage-light);
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem;
  font-weight: 700;
  color: var(--sage-dark);
  flex-shrink: 0;
}
.chat-session-name { font-size: .8rem; font-weight: 500; color: var(--dark); }
.chat-main { flex: 1; display: flex; flex-direction: column; }
.chat-header { padding: .9rem 1.3rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: .8rem; background: #fafaf8; }
.chat-header-name { font-size: .85rem; font-weight: 600; color: var(--dark); }
.chat-online { width: 8px; height: 8px; border-radius: 50%; background: #4caf50; }
.chat-messages { flex: 1; overflow-y: auto; padding: 1.2rem; display: flex; flex-direction: column; gap: .6rem; background: #fafaf8; }
.msg { max-width: 68%; }
.msg-admin { align-self: flex-end; }
.msg-customer { align-self: flex-start; }
.msg-bubble {
  padding: .55rem .9rem;
  border-radius: 14px;
  font-size: .83rem;
  line-height: 1.5;
}
.msg-admin .msg-bubble { background: var(--sage-dark); color: #fff; border-bottom-right-radius: 4px; }
.msg-customer .msg-bubble { background: #fff; color: var(--dark); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
.msg-label { font-size: .65rem; color: var(--warm); margin-bottom: 3px; text-align: right; }
.msg-customer .msg-label { text-align: left; }
.chat-input-area { display: flex; gap: 8px; padding: .8rem 1rem; border-top: 1px solid var(--border); background: #fff; }
.chat-input {
  flex: 1;
  padding: 9px 14px;
  border: 1.5px solid var(--border);
  border-radius: 22px;
  outline: none;
  font-size: .84rem;
  font-family: 'DM Sans', sans-serif;
  transition: border-color .2s;
  background: var(--cream);
}
.chat-input:focus { border-color: var(--sage); background: #fff; }
.chat-send {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--sage-dark);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  transition: background .2s;
  flex-shrink: 0;
}
.chat-send:hover { background: #5a6b48; }
.chat-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--warm); gap: .5rem; }
.chat-empty-icon { font-size: 2.5rem; opacity: .3; }

.empty-row td { text-align: center; color: var(--warm); padding: 2rem !important; font-size: .84rem; }

/* ── PENDING HIGHLIGHT ── */
tr.pending-row td { background: #fffdf5; }
`;

export default function AdminDashboard() {
    const [sellers, setSellers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [commissions, setCommissions] = useState({ orders: [], totalCommission: 0, totalSales: 0 });
    const [subRevenue, setSubRevenue] = useState({ sellers: [], totalSubscriptionRevenue: 0 });
    const [tab, setTab] = useState('sellers');
    const [approveModal, setApproveModal] = useState(null);
    const [paidAmount, setPaidAmount] = useState('');
    const [chatSessions, setChatSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatText, setChatText] = useState('');
    const chatBottomRef = useRef();
    const navigate = useNavigate();
    const token = getAdminToken();

    useEffect(() => {
        if (!token) return navigate('/admin/login');
        fetchSellers();
        fetchCustomers();
        fetchCommissions();
        fetchSubRevenue();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'chats'), snap => {
            setChatSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    useEffect(() => {
        if (!activeSession) return;
        const q = query(collection(db, 'chats', activeSession, 'messages'), orderBy('createdAt'));
        const unsub = onSnapshot(q, snap => {
            setChatMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });
        return unsub;
    }, [activeSession]);

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
            if (!res.ok || data.success === false) { alert(data.message || 'Failed to approve seller.'); return; }
            alert('Seller approved and approval email sent.');
            setApproveModal(null); setPaidAmount('');
            fetchSellers(); fetchSubRevenue();
        } catch (err) { console.error(err); alert('Server error while approving seller.'); }
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
            if (!res.ok || data.success === false) { alert(data.message || 'Failed to reject seller.'); return; }
            alert('Seller rejected and rejection email sent.');
            fetchSellers(); fetchSubRevenue();
        } catch (err) { console.error(err); alert('Server error while rejecting seller.'); }
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
    const sendChatMessage = async () => {
        if (!chatText.trim() || !activeSession) return;
        await addDoc(collection(db, 'chats', activeSession, 'messages'), {
            text: chatText.trim(), sender: 'admin', senderName: 'StyleHub Support', createdAt: serverTimestamp(),
        });
        setChatText('');
    };

    const pendingSellers = sellers.filter(s => !s.isApproved && s.subscriptionStatus !== 'rejected');
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const NAV = [
        { key: 'sellers', icon: '🏪', label: 'Sellers', count: sellers.length },
        { key: 'customers', icon: '👥', label: 'Customers', count: customers.length },
        { key: 'revenue', icon: '💰', label: 'Revenue', count: null },
        { key: 'chat', icon: '💬', label: 'Customer Chats', count: chatSessions.length },
    ];

    return (
        <>
            <style>{CSS}</style>
            <div className="admin-layout">

                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <h1>StyleHub</h1>
                        <span>Admin Panel</span>
                    </div>
                    <nav className="sidebar-nav">
                        {NAV.map(n => (
                            <div key={n.key} className={`nav-item${tab === n.key ? ' active' : ''}`} onClick={() => setTab(n.key)}>
                                <span className="nav-icon">{n.icon}</span>
                                {n.label}
                                {n.count !== null && <span className="nav-badge">{n.count}</span>}
                            </div>
                        ))}
                        {pendingSellers.length > 0 && (
                            <div style={{ margin: '1rem 1.2rem .5rem', fontSize: '.65rem', color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                                Pending Approval
                            </div>
                        )}
                        {pendingSellers.map(s => (
                            <div key={s._id} className="nav-item" onClick={() => { setTab('sellers'); }} style={{ fontSize: '.75rem', paddingLeft: '1.8rem', color: '#f0c060' }}>
                                ⏳ {s.brandName}
                            </div>
                        ))}
                    </nav>
                    <div className="sidebar-footer">
                        <button className="logout-btn" onClick={() => { removeAdminToken(); navigate('/admin/login'); }}>
                            ⬡ Logout
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="main">
                    {/* Topbar */}
                    <div className="topbar">
                        <div>
                            <div className="topbar-title">
                                {tab === 'sellers' && 'Sellers Management'}
                                {tab === 'customers' && 'Customers'}
                                {tab === 'revenue' && 'Revenue & Commission'}
                                {tab === 'chat' && 'Customer Support'}
                            </div>
                            <div className="topbar-sub">StyleHub Admin Dashboard</div>
                        </div>
                        <div className="topbar-date">📅 {today}</div>
                    </div>

                    <div className="content">
                        {/* Stats */}
                        <div className="stats-grid">
                            {[
                                { label: 'Total Sellers', value: sellers.length, icon: '🏪', cls: 'green' },
                                { label: 'Total Customers', value: customers.length, icon: '👥', cls: 'gold' },
                                { label: 'Subscription Revenue', value: `EGP ${(subRevenue.totalSubscriptionRevenue || 0).toLocaleString()}`, icon: '💳', cls: 'sage2' },
                                { label: 'Orders Commission', value: `EGP ${(commissions.totalCommission || 0).toLocaleString()}`, icon: '📊', cls: 'dark' },
                            ].map(s => (
                                <div key={s.label} className={`stat-card ${s.cls}`}>
                                    <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                                    <div className="stat-label">{s.label}</div>
                                    <div className="stat-value">{s.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Approve Modal */}
                        {approveModal && (
                            <div className="modal-overlay">
                                <div className="modal-box">
                                    <div style={{ fontSize: '2rem', marginBottom: '.8rem' }}>✅</div>
                                    <div className="modal-title">Approve {approveModal.brandName}</div>
                                    <div className="modal-sub">Enter the subscription amount the seller paid to confirm their store activation.</div>
                                    <input
                                        className="modal-input"
                                        type="number"
                                        placeholder={`e.g. ${approveModal.subscriptionPaidAmount || 200}`}
                                        value={paidAmount}
                                        onChange={e => setPaidAmount(e.target.value)}
                                    />
                                    <div className="modal-actions">
                                        <button className="btn-confirm" onClick={approveSeller}>Confirm & Approve</button>
                                        <button className="btn-cancel" onClick={() => { setApproveModal(null); setPaidAmount(''); }}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sellers Tab */}
                        {tab === 'sellers' && (
                            <div className="table-card">
                                <div className="table-card-header">
                                    <span className="table-card-title">All Sellers</span>
                                    <span className="table-card-count">{sellers.length} total · {pendingSellers.length} pending</span>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            {['Brand', 'Email', 'Plan', 'Paid', 'Discount', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sellers.length === 0 && <tr className="empty-row"><td colSpan={7}>No sellers found</td></tr>}
                                        {sellers.map(s => {
                                            const disc = getDiscountStatus(s);
                                            const isPending = !s.isApproved && s.subscriptionStatus !== 'rejected';
                                            return (
                                                <tr key={s._id} className={isPending ? 'pending-row' : ''}>
                                                    <td><strong>{s.brandName}</strong></td>
                                                    <td style={{ color: '#666' }}>{s.email}</td>
                                                    <td><span className="badge badge-plan">{s.subscriptionPlan || 'standard'}</span></td>
                                                    <td>
                                                        {s.subscriptionPaidAmount > 0
                                                            ? <span style={{ color: '#2e7d32', fontWeight: 600 }}>EGP {s.subscriptionPaidAmount}</span>
                                                            : <span style={{ color: '#ccc' }}>—</span>}
                                                    </td>
                                                    <td>
                                                        {disc ? (
                                                            disc.active
                                                                ? <span className="badge" style={{ background: '#fff8e1', color: '#f57f17' }}>50% · {disc.daysLeft}d left</span>
                                                                : <span className="badge" style={{ background: '#fde8e8', color: '#c62828' }}>Expired</span>
                                                        ) : <span style={{ color: '#ccc' }}>—</span>}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${s.isApproved ? 'badge-approved' : s.subscriptionStatus === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                                                            {s.isApproved ? '✓ Approved' : s.subscriptionStatus === 'rejected' ? '✕ Rejected' : '⏳ Pending'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="btn-actions">
                                                            {!s.isApproved && <button className="btn btn-approve" onClick={() => setApproveModal(s)}>Approve</button>}
                                                            {!s.isApproved && s.subscriptionStatus !== 'rejected' && <button className="btn btn-reject" onClick={() => rejectSeller(s)}>Reject</button>}
                                                            <button className="btn btn-delete" onClick={() => deleteSeller(s._id)}>Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Customers Tab */}
                        {tab === 'customers' && (
                            <div className="table-card">
                                <div className="table-card-header">
                                    <span className="table-card-title">All Customers</span>
                                    <span className="table-card-count">{customers.length} total</span>
                                </div>
                                <table>
                                    <thead>
                                        <tr>{['Name', 'Email', 'Phone', 'Points', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {customers.length === 0 && <tr className="empty-row"><td colSpan={5}>No customers found</td></tr>}
                                        {customers.map(c => (
                                            <tr key={c._id}>
                                                <td><strong>{c.firstName} {c.lastName}</strong></td>
                                                <td style={{ color: '#666' }}>{c.email}</td>
                                                <td>{c.phone || <span style={{ color: '#ccc' }}>—</span>}</td>
                                                <td><span style={{ fontWeight: 600, color: '#b8860b' }}>{c.points || 0} pts</span></td>
                                                <td><button className="btn btn-delete" onClick={() => deleteCustomer(c._id)}>Delete</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Revenue Tab */}
                        {tab === 'revenue' && (
                            <div>
                                <div className="rev-stats">
                                    {[
                                        { label: 'Subscription Payments', value: `EGP ${(subRevenue.totalSubscriptionRevenue || 0).toLocaleString()}` },
                                        { label: 'Orders Commission (10%)', value: `EGP ${(commissions.totalCommission || 0).toLocaleString()}` },
                                        { label: 'Total StyleHub Revenue', value: `EGP ${((subRevenue.totalSubscriptionRevenue || 0) + (commissions.totalCommission || 0)).toLocaleString()}` },
                                    ].map(s => (
                                        <div key={s.label} className="rev-card">
                                            <div className="rev-label">{s.label}</div>
                                            <div className="rev-value">{s.value}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="table-card">
                                    <div className="table-card-header">
                                        <span className="table-card-title">Subscription Payments</span>
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>{['Brand', 'Plan', 'Amount Paid', 'Date'].map(h => <th key={h}>{h}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                            {(!subRevenue.sellers || subRevenue.sellers.length === 0) && <tr className="empty-row"><td colSpan={4}>No subscription payments yet</td></tr>}
                                            {(subRevenue.sellers || []).map(s => (
                                                <tr key={s._id}>
                                                    <td><strong>{s.brandName}</strong></td>
                                                    <td><span className="badge badge-plan">{s.subscriptionPlan}</span></td>
                                                    <td><span style={{ color: '#2e7d32', fontWeight: 600 }}>EGP {s.subscriptionPaidAmount}</span></td>
                                                    <td style={{ color: '#666' }}>{s.subscriptionPaidAt ? new Date(s.subscriptionPaidAt).toLocaleDateString('en-EG') : '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Chat Tab */}
                        {tab === 'chat' && (
                            <div className="chat-layout">
                                <div className="chat-sidebar">
                                    <div className="chat-sidebar-header">💬 Conversations ({chatSessions.length})</div>
                                    <div className="chat-sessions">
                                        {chatSessions.length === 0 && (
                                            <div style={{ padding: '1.5rem', color: '#aaa', fontSize: '.8rem', textAlign: 'center' }}>No chats yet</div>
                                        )}
                                        {chatSessions.map(s => (
                                            <div key={s.id} className={`chat-session-item${activeSession === s.id ? ' active' : ''}`} onClick={() => setActiveSession(s.id)}>
                                                <div className="chat-avatar">{s.id[0]?.toUpperCase()}</div>
                                                <span className="chat-session-name">{s.id.startsWith('guest_') ? 'Guest User' : s.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="chat-main">
                                    {!activeSession ? (
                                        <div className="chat-empty">
                                            <div className="chat-empty-icon">💬</div>
                                            <div style={{ fontSize: '.85rem', fontWeight: 500 }}>Select a conversation</div>
                                            <div style={{ fontSize: '.75rem' }}>Choose a customer chat from the left</div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="chat-header">
                                                <div className="chat-avatar" style={{ width: 34, height: 34, fontSize: '.8rem' }}>{activeSession[0]?.toUpperCase()}</div>
                                                <div>
                                                    <div className="chat-header-name">{activeSession.startsWith('guest_') ? 'Guest User' : activeSession}</div>
                                                    <div style={{ fontSize: '.7rem', color: '#4caf50' }}>● Online</div>
                                                </div>
                                            </div>
                                            <div className="chat-messages">
                                                {chatMessages.map(m => (
                                                    <div key={m.id} className={`msg msg-${m.sender === 'admin' ? 'admin' : 'customer'}`}>
                                                        <div className="msg-label">{m.sender === 'admin' ? 'StyleHub Support' : 'Customer'}</div>
                                                        <div className="msg-bubble">{m.text}</div>
                                                    </div>
                                                ))}
                                                <div ref={chatBottomRef} />
                                            </div>
                                            <div className="chat-input-area">
                                                <input
                                                    className="chat-input"
                                                    value={chatText}
                                                    onChange={e => setChatText(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                                                    placeholder="Reply to customer..."
                                                />
                                                <button className="chat-send" onClick={sendChatMessage}>➤</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}