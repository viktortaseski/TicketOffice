import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar';
import API_BASE_URL from '../../api';

const MyEventsPage = () => {
    const [events, setEvents] = useState([]);

    const formatDate = isoString => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/events/mine`, { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setEvents(data.events);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();
    }, []);

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <h2>My Events</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Venue</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id}>
                                <td>{event.title}</td>
                                <td>{formatDate(event.date)}</td>
                                <td>{event.venue}</td>
                                <td>
                                    <Link to={`/edit-event/${event.id}`}>
                                        <Button variant="outline-primary" size="sm">Edit</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default MyEventsPage;