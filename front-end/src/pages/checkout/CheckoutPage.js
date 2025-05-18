import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from '../../components/NavBar';
import OrderSummary from './OrderSummary';
import PaymentForm from './PaymentForm';
import API_BASE_URL from '../../api';

export default function CheckoutPage() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const selectedSeats = state?.selectedSeats || [];
    const orderId = state?.orderId;

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/events/${id}`);
                if (!res.ok) throw new Error('Failed to load event');
                setEvent(await res.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div>Loading…</div>;
    if (error) return <div className="text-danger">Error: {error}</div>;
    if (!event) return <div>Event not found.</div>;
    if (selectedSeats.length === 0 || !orderId) {
        return (
            <Container className="my-5">
                <p>
                    No seats selected.{' '}
                    <a href={`/events/${id}/seats`}>Go back to choose seats.</a>
                </p>
            </Container>
        );
    }

    const unitPrice = parseFloat(event.e_ticket_price);
    const total = selectedSeats.length * unitPrice;

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <h2 className="mb-4">Checkout for “{event.title}”</h2>
                <Row className="g-4">
                    <Col md={5}>
                        <OrderSummary
                            event={event}
                            selectedSeats={selectedSeats}
                            unitPrice={unitPrice}
                            total={total}
                        />
                    </Col>
                    <Col md={7}>
                        <PaymentForm
                            eventId={event.id}
                            orderId={orderId}
                            selectedSeats={selectedSeats}
                            total={total}
                            onSuccess={() => navigate(`/confirmation/${orderId}`)}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
