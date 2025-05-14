import React from 'react';
import Card from 'react-bootstrap/Card';

export default function OrderSummary({ event, selectedSeats, unitPrice, total }) {
    return (
        <Card>
            <Card.Header>Order Summary</Card.Header>
            <Card.Body>
                <p>
                    <strong>Date & Time:</strong>{' '}
                    {new Date(event.date).toLocaleDateString()} @ {event.time}
                </p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                <p><strong>Unit Price:</strong> €{unitPrice.toFixed(2)}</p>
                <p><strong>Quantity:</strong> {selectedSeats.length}</p>
                <hr />
                <h5>Total: €{total.toFixed(2)}</h5>
            </Card.Body>
        </Card>
    );
}
