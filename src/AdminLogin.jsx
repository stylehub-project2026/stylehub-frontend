import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAdminToken } from './adminAuth';

const BACKEND_URL = 'https://stylehub-backend-tau.vercel.app';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const inputStyle = {
        width: '100%', padding: '11px 16px', borderRadius: 11,
        border: '2px solid transparent', fontSize: '.9rem',
        background: '#e3e8d9', outline: 'none', fontFamily: 'Jost, sans-serif',
        color: '#333', transition: 'all .2s', boxSizing: 'border-box',
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Jost', sans-serif; background: #f5f7f0; }
                .admin-input:focus { border-color: #7b8b5b !important; background: #d4dcbe !important; }
                .admin-btn { transition: all .25s; }
                .admin-btn:hover { background: #5e6d41 !important; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(91,109,65,.25); }
                .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #888; font-size: .9rem; padding: 4px; }
            `}</style>
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7f0' }}>
                <div style={{ width: 420, padding: '2.8rem 2.6rem', background: '#fff', borderRadius: 22, boxShadow: '0 20px 50px rgba(0,0,0,0.09)', position: 'relative', overflow: 'hidden' }}>

                    {/* Decorative circle */}
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: '#e3e8d9', opacity: .5, pointerEvents: 'none' }} />

                    <div style={{ marginBottom: '1.8rem' }}>
                        <p style={{ fontSize: '.72rem', fontWeight: 700, color: '#7b8b5b', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: '.4rem' }}>
                            StyleHub
                        </p>
                        <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#222', lineHeight: 1.2 }}>
                            Admin <span style={{ color: '#7b8b5b' }}>Login</span>
                        </h2>
                    </div>

                    {error && (
                        <div style={{ background: '#fdf0ee', color: '#c0392b', border: '1px solid #f5c6c2', borderRadius: 10, padding: '10px 14px', fontSize: '.83rem', marginBottom: '1rem', fontWeight: 500 }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />{error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: '#555', marginBottom: '.45rem', letterSpacing: '.3px' }}>
                            Email address
                        </label>
                        <input
                            className="admin-input"
                            type="email" placeholder="admin@stylehub.com" value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{ ...inputStyle, marginBottom: '1rem' }}
                        />

                        <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: '#555', marginBottom: '.45rem', letterSpacing: '.3px' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <input
                                className="admin-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••" value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{ ...inputStyle, paddingRight: 46 }}
                            />
                            <button type="button" className="eye-btn" onClick={() => setShowPassword(s => !s)}>
                                <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="admin-btn"
                            style={{ width: '100%', padding: 13, background: '#7b8b5b', color: '#fff', border: 'none', borderRadius: 25, fontSize: '.86rem', fontWeight: 700, letterSpacing: '1px', cursor: 'pointer', fontFamily: 'Jost, sans-serif' }}>
                            SIGN IN
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}