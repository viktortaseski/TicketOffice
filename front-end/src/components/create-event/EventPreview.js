// src/components/create-event/EventPreview.js
import React from 'react';
import Card from 'react-bootstrap/Card';
import noImg from '../../assets/noImg.jpg';

export default function EventPreview({ event = {} }) {
    const {
        date,
        time,
        title,
        posterUrl,
        posterFile,
        category,
        availableTickets,
        venue          // new field
    } = event;

    const src = posterFile
        ? URL.createObjectURL(posterFile)
        : posterUrl || noImg;

    // formatted date/time (as before)
    let formattedDate = '';
    if (date) {
        formattedDate = new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    let formattedTime = '';
    if (time) {
        const [hh, mm] = time.split(':');
        const t = new Date(); t.setHours(+hh, +mm);
        formattedTime = t.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    return (
        <Card className="h-100">
            <Card.Img
                variant="top"
                src={src}
                style={{ objectFit: 'cover', height: '180px' }}
                onError={e => { e.currentTarget.src = noImg; }}
            />
            <Card.Body>
                <Card.Title>{title || 'Your event title'}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {formattedDate} {formattedTime && `@ ${formattedTime}`}
                </Card.Subtitle>

                {/* NEW: venue display */}
                <Card.Text className="mb-2">
                    <small className="text-muted">
                        {venue || 'Venue not specified'}
                    </small>
                </Card.Text>

                <Card.Text>
                    <small className="text-muted">
                        {category || 'Category'} • Tickets: {availableTickets || '—'}
                    </small>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
