// src/pages/select-seats/SelectSeatsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavBar from '../../components/NavBar';
import EventCard from '../../components/EventCard';
import API_BASE_URL from '../../api';
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
    const navigate = useNavigate();

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
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(s => s.filter(x => x !== seat));
        } else if (selectedSeats.length < numericCount) {
            setSelectedSeats(s => [...s, seat]);
        }
    };

    const handleProceed = () => {
        if (selectedSeats.length !== numericCount) {
            return alert(`Please select exactly ${numericCount} seat(s).`);
        }
        navigate(`/checkout/${id}`, { state: { selectedSeats } });
    };

    if (loading) return <div>Loading…</div>;
    if (!event) return <div>Event not found.</div>;

    const seatLayout = generateSeatLayout();

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <Row>
                    {/* Seat selector */}
                    <Col md={8}>
                        <h2 className="mb-4">Select Seats for "{event.title}"</h2>
                        <p className="text-muted">Tickets left: {event.availableTickets}</p>
                        <Form.Group className="mb-3" controlId="ticketCount">
                            <Form.Label>Number of Tickets</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter quantity"
                                min="1"
                                max={event.availableTickets}
                                value={ticketCount}
                                onChange={e => {
                                    let v = e.target.value.replace(/^0+/, '');
                                    setTicketCount(v);
                                    setSelectedSeats([]);
                                }}
                            />
                        </Form.Group>

                        <div className="seat-map mb-4">
                            {seatLayout.map((row, idx) => {
                                const letter = row[0][0];
                                return (
                                    <div key={letter} className="seat-logical-row mb-4">
                                        <div className="seat-subrow d-flex flex-wrap">
                                            {row.map(seat => (
                                                <div
                                                    key={seat}
                                                    className={
                                                        'seat m-1 p-2 border rounded text-center ' +
                                                        (selectedSeats.includes(seat)
                                                            ? 'selected'
                                                            : '')
                                                    }
                                                    onClick={() => handleSeatClick(seat)}
                                                >
                                                    {seat}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="row-divider">
                                            End of row {letter}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Col>

                    {/* Event card + proceed button */}
                    <Col md={4} className="d-flex">
                        <div className="w-100 align-self-start">
                            <EventCard event={event} />
                            <Button
                                variant="success"
                                className="w-100 mt-4"
                                disabled={numericCount < 1}
                                onClick={handleProceed}
                            >
                                Proceed to Checkout
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
