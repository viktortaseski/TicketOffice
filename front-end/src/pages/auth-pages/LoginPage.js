import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

const API_BASE_URL = 'http://88.200.63.148:8000';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setError(''); setSuccess('');

        try {
            const res = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await res.json();

            if (res.ok) {
                setSuccess('Login successful!');
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                setTimeout(() => navigate('/'), 1000);
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div
            className="auth-wrapper"
            style={{
                width: '100vw',
                height: '100vh',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div
                className="auth-card shadow"
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <div className="card-body">
                    <h3 className="card-title mb-4">Login</h3>

                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer link now sits directly under the card */}
            <p className="auth-footer" style={{ marginTop: '1rem' }}>
                Don’t have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}
