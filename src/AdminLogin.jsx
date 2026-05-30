import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAdminToken } from './adminAuth';

const BACKEND_URL = 'https://stylehub-backend-tau.vercel.app';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) return setError(data.message);
            setAdminToken(data.token);
            navigate('/admin/dashboard');
        } catch {
            setError('Something went wrong');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F6F2' }}>
            <div style={{ width: 400, padding: 40, background: '#fff', border: '1px solid #e4e0da', borderRadius: 12 }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: 8 }}>Admin Login</h2>
                <p style={{ color: '#8c8880', fontSize: '.85rem', marginBottom: 28 }}>StyleHub Admin Panel</p>
                {error && <p style={{ color: '#e63946', marginBottom: 16, fontSize: '.85rem' }}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="email" placeholder="Email" value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', marginBottom: 12, borderRadius: 8, border: '1px solid #e4e0da', fontSize: '.9rem', boxSizing: 'border-box' }}
                    />
                    <input
                        type="password" placeholder="Password" value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', marginBottom: 20, borderRadius: 8, border: '1px solid #e4e0da', fontSize: '.9rem', boxSizing: 'border-box' }}
                    />
                    <button type="submit" style={{ width: '100%', padding: 12, background: '#1a1a18', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '.85rem', letterSpacing: '.1em' }}>
                        LOGIN
                    </button>
                </form>
            </div>
        </div>
    );
}