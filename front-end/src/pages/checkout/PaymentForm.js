import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputField from './InputField';
import { apiFetch } from '../../api';

export default function PaymentForm({
    eventId,
    orderId,
    selectedSeats,
    total,
    onSuccess
}) {
    const [method, setMethod] = useState('credit_card');
    const [details, setDetails] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setDetails(d => ({ ...d, [name]: value }));
    };

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

        // 1) Validate CC fields
        if (method === 'credit_card') {
            const { cardName, cardNumber, expiry, cvv } = details;
            if (!cardName || !cardNumber || !expiry || !cvv) {
                return alert('Please fill in all payment fields.');
            }
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

        try {
            // 2) Record Payment
            const paymentRes = await apiFetch('/api/payments', {
                method: 'POST',
                body: {
                    p_order_id: orderId,
                    payment_method: method,
                    amount: total,
                    payment_date: new Date().toISOString().slice(0, 10),
                    payment_status: 'Success'
                }
            });
            if (!paymentRes.ok) throw new Error('Payment failed');

            // 3) Mark Order as Completed
            const orderRes = await apiFetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                body: { payment_status: 'Completed' }
            });
            if (!orderRes.ok) throw new Error('Could not update order');

            // 4) Create Tickets in bulk
            const ticketsPayload = selectedSeats.map(seat => ({
                order_id: orderId,
                event_id: eventId,
                seat_number: seat,
                price: total / selectedSeats.length
            }));
            const ticketRes = await apiFetch('/api/tickets/bulk', {
                method: 'POST',
                body: { tickets: ticketsPayload }
            });
            if (!ticketRes.ok) throw new Error('Could not issue tickets');

            // 5) everything succeeded
            setTimeout(onSuccess, 2000); // Simulate 2s "processing" for a nice UX
        } catch (err) {
            console.error(err);
            alert(err.message || 'Something went wrong');
            setSubmitting(false);
        }
    };

    const creditFields = [
        {
            name: 'cardName',
            label: 'Name on Card',
            value: details.cardName,
            onChange: handleChange,
            required: true
        },
        {
            name: 'cardNumber',
            label: 'Card Number',
            value: details.cardNumber,
            onChange: handleCardNumberChange,
            required: true
        }
    ];
    const expiryCvvFields = [
        {
            name: 'expiry',
            label: 'Expiry (MM/YY)',
            value: details.expiry,
            onChange: handleExpiryChange,
            required: true
        },
        {
            name: 'cvv',
            label: 'CVV',
            value: details.cvv,
            onChange: handleChange,
            required: true,
            type: 'password'
        }
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
