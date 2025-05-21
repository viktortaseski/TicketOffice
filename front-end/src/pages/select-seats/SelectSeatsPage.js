import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import NavBar from '../../components/NavBar';
import EventCard from '../../components/EventCard';
import API_BASE_URL, { apiFetch } from '../../api';
import './SelectSeatsPage.css';

const generateSeatLayout = () => {
    const rows = 'ABCDEFG'.split('');
    const seatsPerRow = 15;
    return rows.map(row =>
        Array.from({ length: seatsPerRow }, (_, i) => `${row}${i + 1}`)
    );
};

export default function SelectSeatsPage() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const isExistingOrder = state?.isExistingOrder;
    const existingOrderId = state?.orderId;

    const [ticketCount, setTicketCount] = useState('1');
    const numericCount = parseInt(ticketCount, 10) || 0;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/events/${id}`);
                if (!res.ok) throw new Error();
                setEvent(await res.json());
            } catch {
                setEvent(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleSeatClick = seat => {
        setSelectedSeats(curr =>
            curr.includes(seat)
                ? curr.filter(x => x !== seat)
                : curr.length < numericCount
                    ? [...curr, seat]
                    : curr
        );
    };

    const createOrder = async () => {
        const unitPrice = parseFloat(event.e_ticket_price);
        const totalAmount = numericCount * unitPrice;

        const res = await apiFetch('/api/orders', {
            method: 'POST',
            body: {
                event_id: id,
                total_amount: totalAmount,
                ticketQuantity: numericCount,
            },
        });

        if (res.status === 401) {
            alert('You must be logged in.');
            navigate('/login');
            return null;
        }
        if (!res.ok) {
            console.error('Order creation failed:', res.status, await res.text());
            throw new Error('Could not create order');
        }
        return res.json();
    };

    const handleAddToCart = async () => {
        if (selectedSeats.length !== numericCount) {
            return alert(`Select exactly ${numericCount} seats.`);
        }
        try {
            const data = await createOrder();
            if (!data) return;
            navigate('/cart');
        } catch (err) {
            console.error(err);
            alert('Failed to add to cart.');
        }
    };

    const handleProceed = async () => {
        if (selectedSeats.length !== numericCount) {
            return alert(`Select exactly ${numericCount} seats.`);
        }
        try {
            const data = await createOrder();
            if (!data) return;
            navigate(`/checkout/${id}`, {
                state: {
                    orderId: data.order_id,
                    selectedSeats,
                    ticketQuantity: numericCount,
                    isExistingOrder: false,
                },
            });
        } catch (err) {
            console.error(err);
            alert('Failed to proceed.');
        }
    };

    // --------------------------------------------------
    // Simplified: just carry forward the existingOrderId
    // --------------------------------------------------
    const handleContinueOrder = () => {
        if (selectedSeats.length !== numericCount) {
            return alert(`Select exactly ${numericCount} seats.`);
        }

        // No fetch/update here—just send existingOrderId into checkout
        navigate(`/checkout/${id}`, {
            state: {
                orderId: existingOrderId,
                selectedSeats,
                ticketQuantity: numericCount,
                isExistingOrder: true,
            },
        });
    };

    if (loading) return <div>Loading…</div>;
    if (!event) return <div>Event not found.</div>;

    const seatLayout = generateSeatLayout();

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <Row>
                    <Col md={8}>
                        <h2>Select Seats for “{event.title}”</h2>
                        <p className="text-muted">Tickets left: {event.availableTickets}</p>

                        <Form.Group className="mb-3">
                            <Form.Label>Number of Tickets</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max={event.availableTickets}
                                value={ticketCount}
                                onChange={e => {
                                    const v = e.target.value.replace(/^0+/, '') || '1';
                                    setTicketCount(v);
                                    setSelectedSeats([]);
                                }}
                            />
                        </Form.Group>

                        <div className="seat-map mb-4">
                            {seatLayout.map(row => {
                                const letter = row[0][0];
                                return (
                                    <div key={letter} className="seat-logical-row mb-3">
                                        <div className="seat-subrow d-flex flex-wrap">
                                            {row.map(seat => (
                                                <div
                                                    key={seat}
                                                    className={
                                                        'seat m-1 p-2 border rounded text-center ' +
                                                        (selectedSeats.includes(seat) ? 'selected' : '')
                                                    }
                                                    onClick={() => handleSeatClick(seat)}
                                                >
                                                    {seat}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="row-divider">End of row {letter}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </Col>

                    <Col md={4} className="d-flex">
                        <div className="w-100 align-self-start">
                            <EventCard event={event} />
                            {!isExistingOrder ? (
                                <>
                                    <Button
                                        className="w-100 mt-3"
                                        onClick={handleAddToCart}
                                        disabled={numericCount < 1}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        className="w-100 mt-2"
                                        variant="success"
                                        onClick={handleProceed}
                                        disabled={numericCount < 1}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    className="w-100 mt-2"
                                    variant="success"
                                    onClick={handleContinueOrder}
                                    disabled={numericCount < 1}
                                >
                                    Complete Order
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
