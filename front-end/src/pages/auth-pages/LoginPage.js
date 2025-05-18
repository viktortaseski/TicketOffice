import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://88.200.63.148:8000';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                credentials: 'include',            // ← send+receive cookie
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            console.log('Login response status:', res.status);
            const result = await res.json();
            console.log('Login JSON:', result);

            if (res.ok) {
                setSuccess('Login successful!');
                // OPTIONAL: store in localStorage if you need it elsewhere
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                setTimeout(() => navigate('/'), 1000);
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Login</h3>

                            {/* New: show success message */}
                            {success && (
                                <div className="alert alert-success">{success}</div>
                            )}

                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                    <p className="text-center mt-3">
                        Don’t have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
