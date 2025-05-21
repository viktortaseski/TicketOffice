// src/components/EventPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../api';
import NavBar from '../../components/NavBar';
import MyButton from '../../components/MyButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import noImg from '../../assets/noImg.jpg';

export default function EventPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/events/${id}`);
                if (!res.ok) throw new Error('Not OK');
                const data = await res.json();
                setEvent(data);
            } catch (err) {
                console.error('Error fetching event:', err);
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return <div>Loading…</div>;
    if (!event) return <div>Event not found.</div>;

    const {
        title, date, time, venue,
        description, category,
        availableTickets, poster, e_ticket_price
    } = event;

    const posterSrc = poster
        ? `${API_BASE_URL}/uploads/${poster}`
        : noImg;

    const formattedDate = date
        ? new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';
    const formattedTime = time
        ? new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit'
        })
        : '';

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <Card className="shadow">
                    <Row className="g-0">
                        <Col md={4}>
                            <Image
                                src={posterSrc}
                                alt={title}
                                fluid
                                className="p-3"
                                style={{ objectFit: 'cover', height: '100%' }}
                                onError={e => (e.currentTarget.src = noImg)}
                            />
                        </Col>
                        <Col md={8}>
                            <Card.Body>
                                <Card.Title as="h1" className="mb-3">{title}</Card.Title>

                                <Card.Text>
                                    <strong>Date & Time: </strong>
                                    {formattedDate} {formattedTime && `@ ${formattedTime}`}
                                </Card.Text>

                                <Card.Text>
                                    <strong>Venue: </strong>{venue}
                                </Card.Text>

                                <Card.Text>
                                    <strong>Category: </strong>{category || '—'}
                                </Card.Text>

                                <Card.Text>
                                    <strong>Tickets Available: </strong>{availableTickets}
                                </Card.Text>

                                <Card.Text>
                                    <strong>Description: </strong>{description}
                                </Card.Text>

                                <div>
                                    <Card.Text>
                                        <strong>Price: €{e_ticket_price}</strong>
                                    </Card.Text>
                                    <MyButton text="Buy Ticket" onClick={() => navigate(`/events/${id}/seats`)} />
                                </div>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </>
    );
}