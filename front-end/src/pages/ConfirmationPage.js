import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import NavBar from '../components/NavBar';
import API_BASE_URL from '../api';

export default function ConfirmationPage() {
    const { orderId } = useParams();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_BASE_URL}/orders/${orderId}/tickets`);
            const { tickets } = await res.json();
            setTickets(tickets);
            setLoading(false);
        })();
    }, [orderId]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        tickets.forEach((t, i) => {
            if (i > 0) doc.addPage();
            doc.setFontSize(14);
            doc.text(`Event: ${t.event_title}`, 20, 20);
            doc.text(`Date: ${new Date(t.date).toLocaleDateString()} @ ${t.time}`, 20, 30);
            doc.text(`Venue: ${t.venue}`, 20, 40);
            doc.text(`Seat: ${t.seat_number}`, 20, 50);
            // add QR image
            doc.addImage(t.QR_img, 'PNG', 20, 60, 50, 50);
        });
        doc.save(`tickets_order_${orderId}.pdf`);
    };

    if (loading) return <div>Loading…</div>;

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <h2>Order #{orderId}—Your Tickets</h2>
                {tickets.map(t => (
                    <Card key={t.ticket_id} className="mb-3">
                        <Card.Body>
                            <Card.Title>Seat {t.seat_number}</Card.Title>
                            <p><strong>Event:</strong> {t.event_title}</p>
                            <p><strong>Date & Time:</strong> {new Date(t.date).toLocaleDateString()} @ {t.time}</p>
                            <img src={t.QR_img} alt="QR code" width={100} />
                        </Card.Body>
                    </Card>
                ))}
                <Button onClick={downloadPDF}>Download All as PDF</Button>
            </Container>
        </>
    );
}
