import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

export default function RegisterPage() {
    const [data, setData] = useState({
        firstName: '', surname: '',
        email: '', password: '',
        confirmPassword: '', userType: 'Customer'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(''); setSuccess('');
        const { firstName, surname, email, password, confirmPassword, userType } = data;

        if (!firstName.trim() || !surname.trim()) {
            setError('Please enter both first name and surname');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('http://88.200.63.148:8000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    name: firstName.trim(),
                    surname: surname.trim(),
                    userType
                })
            });
            const result = await res.json();

            if (res.ok) {
                setSuccess(result.message || 'Registered successfully!');
                setTimeout(() => navigate('/login'), 1000);
            } else {
                setError(result.message || 'Registration failed');
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
                    <h3 className="card-title mb-4">Register</h3>

                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="mb-3 col">
                                <label htmlFor="firstName" className="form-label">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className="form-control"
                                    value={data.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div className="mb-3 col">
                                <label htmlFor="surname" className="form-label">
                                    Surname
                                </label>
                                <input
                                    id="surname"
                                    name="surname"
                                    type="text"
                                    className="form-control"
                                    value={data.surname}
                                    onChange={handleChange}
                                    placeholder="Surname"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-control"
                                value={data.email}
                                onChange={handleChange}
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
                                name="password"
                                type="password"
                                className="form-control"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className="form-control"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="userType" className="form-label">
                                User Type
                            </label>
                            <select
                                id="userType"
                                name="userType"
                                className="form-select"
                                value={data.userType}
                                onChange={handleChange}
                                required
                            >
                                <option value="Customer">Customer</option>
                                <option value="Organizer">Organization</option>
                            </select>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-success">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <p className="auth-footer" style={{ marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
