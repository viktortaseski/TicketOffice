import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from '../../components/NavBar';
import OrderSummary from './OrderSummary';
import PaymentForm from './PaymentForm';
import API_BASE_URL from '../../api';

export default function CheckoutPage() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const selectedSeats = useMemo(() => state?.selectedSeats || [], [state]);
    const orderId = state?.orderId;
    const isExistingOrder = state?.isExistingOrder;
    const ticketQuantity = state?.ticketQuantity;

    useEffect(() => {
        if (!orderId || selectedSeats.length === 0) {
            navigate(`/events/${id}/seats`, {
                state: { orderId, selectedSeats, ticketQuantity, isExistingOrder }
            });
        }
    }, [orderId, selectedSeats, navigate, id, ticketQuantity, isExistingOrder]);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/events/${id}`);
                if (!res.ok) throw new Error();
                setEvent(await res.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div>Loading…</div>;
    if (error) return <div className="text-danger">{error}</div>;
    if (!event) return <div>Event not found.</div>;

    const unitPrice = parseFloat(event.e_ticket_price);
    const total = selectedSeats.length * unitPrice;

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <h2>Checkout for “{event.title}”</h2>
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
                            isExistingOrder={isExistingOrder}
                            onSuccess={() => navigate(`/confirmation/${orderId}`)}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}