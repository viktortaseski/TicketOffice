import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../NavBar';
import API_BASE_URL from '../../api';

const EditEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        date: '',
        time: '',
        description: '',
        category: '',
        availableTickets: '',
        venue: '',
        ticketPrice: '',
        posterUrl: ''
    });

    const categories = [
        'Concerts',
        'Festivals',
        'Theatres',
        'Philharmony',
        'Opera & Ballet',
        'Sport Events',
        'Others'
    ];


    const [posterFile, setPosterFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // fetch existing event
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/events/${id}`, { credentials: 'include' });
                if (!res.ok) throw new Error('Could not load event');
                const data = await res.json();
                setForm({
                    title: data.title,
                    date: data.date.slice(0, 10),     // YYYY-MM-DD for <input type="date">
                    time: data.time,                 // e.g. "19:30"
                    description: data.description,
                    category: data.category,
                    availableTickets: data.availableTickets,
                    venue: data.venue,
                    ticketPrice: data.e_ticket_price,
                    posterUrl: data.poster
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };
    const handleFile = e => setPosterFile(e.target.files[0]);
    const handleSubmit = async e => {
        e.preventDefault();
        console.log('[EditEventPage] handleSubmit — form:', form, 'posterFile:', posterFile);
        const payload = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            console.log(`[EditEventPage] append ${k} =`, v);
            payload.append(k, v);
        });
        if (posterFile) {
            console.log('[EditEventPage] append poster file:', posterFile.name);
            payload.append('poster', posterFile);
        }

        const url = `${API_BASE_URL}/events/${id}`;
        console.log('[EditEventPage] PUT →', url);
        try {
            const res = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                body: payload
            });
            console.log('[EditEventPage] response status:', res.status);
            const result = await res.json();
            console.log('[EditEventPage] response JSON:', result);
            if (!res.ok) throw new Error(result.message || `Status ${res.status}`);
            navigate('/my-events');
        } catch (err) {
            console.error('[EditEventPage] fetch error:', err);
            setError(err.message);
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <>
            <NavBar />
            <Container className="my-5" style={{ maxWidth: 600 }}>
                <h2>Edit Event</h2>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="time">
                        <Form.Label>Time</Form.Label>
                        <Form.Control
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            name="category" value={form.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">— Select category —</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Available Tickets</Form.Label>
                        <Form.Control
                            type="number"
                            name="availableTickets"
                            value={form.availableTickets}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Venue</Form.Label>
                        <Form.Control
                            name="venue"
                            value={form.venue}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ticket Price</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="ticketPrice"
                            value={form.ticketPrice}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Poster (leave blank to keep existing)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFile}
                        />
                    </Form.Group>

                    <Button type="submit">Save Changes</Button>
                </Form>
                <br></br>
                {error && <Alert variant="danger">{error}</Alert>}
            </Container >
        </>
    );
};

export default EditEventPage;
