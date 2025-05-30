import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from '../../components/NavBar';
import QRCode from 'qrcode';
import { apiFetch } from '../../api';

export default function ConfirmationPage() {
    const { orderId } = useParams();
    const location = useLocation();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [event, setEvent] = useState(null);

    // selectedSeats/eventId/total only present if user just paid
    const selectedSeats = location.state?.selectedSeats;
    const eventIdFromState = location.state?.eventId;
    const total = location.state?.total;

    useEffect(() => {
        let isMounted = true; // helps avoid state updates on unmounted component

        (async () => {
            setLoading(true);
            setError('');
            try {
                // Just paid? Simulate payment, generate tickets.
                if (selectedSeats && eventIdFromState && total) {
                    await apiFetch(`/api/orders/${orderId}`, {
                        method: 'PATCH',
                        body: { payment_status: 'Completed' }
                    });

                    const ticketsPayload = selectedSeats.map(seat => ({
                        order_id: orderId,
                        event_id: eventIdFromState,
                        seat_number: seat,
                        price: total / selectedSeats.length
                    }));
                    await apiFetch('/api/tickets/bulk', {
                        method: 'POST',
                        body: { tickets: ticketsPayload }
                    });
                }

                // Wait 2s for animation
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Fetch tickets for this order
                const res = await apiFetch(`/api/orders/${orderId}/tickets`);
                if (!res.ok) throw new Error('Could not fetch tickets');
                const { tickets } = await res.json();

                if (isMounted) {
                    // turn each ticket into one carrying its JSON-payload QR code
                    const ticketsWithQR = await Promise.all(
                        tickets.map(async t => {
                            // full absolute URL straight into the QR
                            const payload = `${window.location.origin}/ticket/${t.ticket_id}`;
                            const qrDataUrl = await QRCode.toDataURL(payload);
                            return { ...t, qrDataUrl };
                        })
                    );
                    setTickets(ticketsWithQR);
                }

                // If you have tickets, fetch the event details
                if (tickets.length > 0) {
                    const eventRes = await apiFetch(`/events/${tickets[0].event_id}`);
                    if (eventRes.ok && isMounted) {
                        setEvent(await eventRes.json());
                    }
                }
            } catch (err) {
                if (isMounted) setError(err.message || 'Something went wrong.');
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        // Cleanup for unmount
        return () => { isMounted = false; };

        // Proper dependency array for ESLint:
    }, [orderId, selectedSeats, eventIdFromState, total]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        tickets.forEach((t, i) => {
            if (i > 0) doc.addPage();
            doc.setFontSize(14);
            doc.text(`Event: ${t.event_title}`, 20, 20);
            doc.text(`Date: ${new Date(t.date).toLocaleDateString()} @ ${t.time}`, 20, 30);
            doc.text(`Venue: ${t.venue}`, 20, 40);
            doc.text(`Seat: ${t.seat_number}`, 20, 50);

            if (t.event_poster) doc.addImage(t.event_poster, 'PNG', 150, 20, 50, 50);
            if (t.qrDataUrl) doc.addImage(t.qrDataUrl, 'PNG', 50, 70, 100, 100);
        });
        doc.save(`tickets_order_${orderId}.pdf`);
    };

    // Show correct loading message for completed orders
    if (loading)
        return (
            <div style={{ textAlign: 'center', marginTop: '10vh' }}>
                <h3>Generating tickets…</h3>
            </div>
        );
    if (error)
        return <div className="text-danger">{error}</div>;

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <Row>
                    <Col md={8}>
                        <h2>Order #{orderId} — Your Tickets</h2>
                        {tickets.map(t => (
                            <Card key={t.ticket_id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>Seat {t.seat_number}</Card.Title>
                                    <p><strong>Event:</strong> {t.event_title}</p>
                                    <p><strong>Date & Time:</strong> {new Date(t.date).toLocaleDateString()} @ {t.time}</p>
                                    <img src={t.qrDataUrl} alt="QR code" width={100} />
                                </Card.Body>
                            </Card>
                        ))}
                        <Button onClick={downloadPDF}>Download All as PDF</Button>
                    </Col>
                    <Col md={4} className="d-flex align-items-start justify-content-end">
                        {event && event.poster && (
                            <img
                                src={event.poster}
                                alt="Event Poster"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: 400,
                                    borderRadius: 12,
                                    boxShadow: '0 0 10px rgba(0,0,0,0.12)'
                                }}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
