import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { apiFetch } from '../../../api';

export default function TicketPage() {
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const res = await apiFetch(`/api/tickets/${ticketId}`);
                if (!res.ok) throw new Error(`Failed to load ticket ${ticketId}`);
                const data = await res.json();
                if (isMounted) setTicket(data.ticket);
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [ticketId]);

    const handleUseTicket = async () => {
        try {
            const res = await apiFetch(`/api/tickets/${ticketId}`, {
                method: 'PATCH',
                body: { isUsed: true }
            });
            if (!res.ok) throw new Error('Could not update ticket');
            setTicket({ ...ticket, isUsed: true });
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading ticket...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <NavBar />
            <Container className="my-5">
                {!ticket.isUsed ? (
                    <>
                        <h2>Ticket #{ticketId} is valid</h2>
                        <p>You can use this ticket.</p>
                        <Button onClick={handleUseTicket}>Mark as Used</Button>
                    </>
                ) : (
                    <Alert variant="warning">
                        This ticket has been used previously.
                    </Alert>
                )}
            </Container>
        </>
    );
}