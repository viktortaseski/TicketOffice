// src/components/EventCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import noImg from '../assets/noImg.jpg';
import API_BASE_URL from '../api';

const EventCard = ({ event }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/events/${event.id}`);
    };

    const posterSrc =
        typeof event.poster === 'string'
            ? `${API_BASE_URL}/uploads/${event.poster}`
            : noImg;

    // format date/time as before
    const formattedDate = event.date
        ? new Date(event.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';
    const formattedTime = event.time
        ? new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit'
        })
        : '';

    return (
        <Card
            onClick={handleCardClick}
            className="h-100 movie-card"
            style={{ cursor: 'pointer', transition: 'background-color 0.2s', width: '100%' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
        >
            <Card.Img
                variant="top"
                src={posterSrc}
                alt={event.title}
                style={{ objectFit: 'cover', height: '180px' }}
                onError={e => { e.currentTarget.src = noImg; }}
            />
            <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {formattedDate} {formattedTime && `@ ${formattedTime}`}
                </Card.Subtitle>

                {/* NEW: venue display */}
                <Card.Text className="mb-2">
                    <small className="text-muted">
                        {event.venue || 'Venue not specified'}
                    </small>
                </Card.Text>
                <Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="fw-bold fs-5 text-black">
                            €{event.e_ticket_price}
                        </span>
                    </div>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default EventCard;
