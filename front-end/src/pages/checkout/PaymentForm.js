import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputField from './InputField';
import { apiFetch } from './api';

export default function PaymentForm({ eventId, selectedSeats, total }) {
    const navigate = useNavigate();
    const stored = localStorage.getItem('currentUser');
    const userId = stored ? JSON.parse(stored).id : null;

    const [method, setMethod] = useState('credit_card');
    const [details, setDetails] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Generic change handler
    const handleChange = e => {
        const { name, value } = e.target;
        setDetails(d => ({ ...d, [name]: value }));
    };

    // Formatters for cardNumber & expiry
    const handleCardNumberChange = e => {
        let digits = e.target.value.replace(/\D/g, '').slice(0, 16);
        let formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
        setDetails(d => ({ ...d, cardNumber: formatted }));
    };
    const handleExpiryChange = e => {
        let digits = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (digits.length > 2) digits = digits.slice(0, 2) + '/' + digits.slice(2);
        setDetails(d => ({ ...d, expiry: digits }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        // 1) All fields present?
        if (method === 'credit_card') {
            const { cardName, cardNumber, expiry, cvv } = details;
            if (!cardName || !cardNumber || !expiry || !cvv) {
                return alert('Please fill in all payment fields.');
            }
            // 2) Basic format validation
            const ccNum = cardNumber.replace(/\s+/g, '');
            if (!/^\d{16}$/.test(ccNum)) {
                return alert('Card number must be exactly 16 digits');
            }
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                return alert('Expiry must be in MM/YY format');
            }
            if (!/^\d{3}$/.test(cvv)) {
                return alert('CVV must be exactly 3 digits');
            }
        }

        setSubmitting(true);

        // 3) Build payload
        const payload = {
            user_id: userId,
            event_id: eventId,
            seats: selectedSeats,
            amount: total,
            paymentMethod: method,
            paymentDetails: details
        };

        try {
            // 4) POST to your backend
            const res = await apiFetch('/api/checkout', {
                method: 'POST',
                body: payload
            });

            // 5) If something went wrong, log the status & body
            if (!res.ok) {
                console.error('Checkout error status:', res.status);
                const errText = await res.text();
                console.error('Checkout error body:', errText);
                throw new Error('Checkout failed');
            }

            // 6) Success → go to cart
            navigate('/cart');
        } catch (err) {
            console.error('Network or server error during checkout:', err);
            alert(err.message);
            setSubmitting(false);
        }
    };

    // Field definitions (to keep JSX small)
    const creditFields = [
        { name: 'cardName', label: 'Name on Card', value: details.cardName, onChange: handleChange, required: true },
        { name: 'cardNumber', label: 'Card Number', value: details.cardNumber, onChange: handleCardNumberChange, required: true }
    ];
    const expiryCvvFields = [
        { name: 'expiry', label: 'Expiry (MM/YY)', value: details.expiry, onChange: handleExpiryChange, required: true },
        { name: 'cvv', label: 'CVV', value: details.cvv, onChange: handleChange, required: true, type: 'password' }
    ];

    return (
        <Card>
            <Card.Header>Payment Details</Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Select
                            value={method}
                            onChange={e => setMethod(e.target.value)}
                        >
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                        </Form.Select>
                    </Form.Group>

                    {method === 'credit_card' && (
                        <>
                            {creditFields.map(f => (
                                <InputField key={f.name} {...f} />
                            ))}
                            <div className="d-flex mb-3">
                                {expiryCvvFields.map(f => (
                                    <div className="flex-fill me-2" key={f.name}>
                                        <InputField {...f} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <Button
                        variant="success"
                        type="submit"
                        className="w-100"
                        disabled={submitting}
                    >
                        {submitting ? 'Processing…' : `Pay €${total.toFixed(2)}`}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
