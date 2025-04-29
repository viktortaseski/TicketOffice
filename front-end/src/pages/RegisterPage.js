import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
    const [data, setData] = useState({
        firstName: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'Customer',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

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
            const response = await fetch('http://88.200.63.148:8000/users', {
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

            const result = await response.json();
            console.log('Register response:', response.status, result);

            if (response.ok) {
                setSuccess(result.message || 'Registered successfully!');
                setTimeout(() => navigate('/login'), 1000);
            } else {
                // This now catches both validation errors and "already exists"
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Register error:', err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Register</h3>

                            {success && <div className="alert alert-success">{success}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="mb-3 col">
                                        <label htmlFor="firstName" className="form-label">
                                            First Name
                                        </label>
                                        <input
                                            name="firstName"
                                            type="text"
                                            className="form-control"
                                            id="firstName"
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
                                            name="surname"
                                            type="text"
                                            className="form-control"
                                            id="surname"
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
                                        name="email"
                                        type="email"
                                        className="form-control"
                                        id="email"
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
                                        name="password"
                                        type="password"
                                        className="form-control"
                                        id="password"
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
                                        name="confirmPassword"
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
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
                                        name="userType"
                                        id="userType"
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

                    <p className="text-center mt-3">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
