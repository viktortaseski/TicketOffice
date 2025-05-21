import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
                    time: data.time,                  // e.g. "19:30"
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

    // delete event handler
    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/events/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.status === 401) {
                alert('You must be logged in.');
                navigate('/login');
                return;
            }
            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.message || `Status ${res.status}`);
            }
            setShowDeleteModal(false);
            navigate('/my-events');
        } catch (err) {
            console.error('[EditEventPage] delete error:', err);
            setError(err.message);
            setShowDeleteModal(false);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };
    const handleFile = e => setPosterFile(e.target.files[0]);
    const handleSubmit = async e => {
        e.preventDefault();
        const payload = new FormData();
        Object.entries(form).forEach(([k, v]) => payload.append(k, v));
        if (posterFile) payload.append('poster', posterFile);

        try {
            const res = await fetch(`${API_BASE_URL}/events/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: payload
            });
            const result = await res.json();
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
                    {/* Title, date, time, description, category, tickets, venue, price, poster inputs here */}

                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" value={form.title} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" value={form.date} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Time</Form.Label>
                        <Form.Control type="time" name="time" value={form.time} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category" value={form.category} onChange={handleChange} required>
                            <option value="">— Select category —</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Available Tickets</Form.Label>
                        <Form.Control type="number" name="availableTickets" value={form.availableTickets} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Venue</Form.Label>
                        <Form.Control name="venue" value={form.venue} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ticket Price</Form.Label>
                        <Form.Control type="number" step="0.01" name="ticketPrice" value={form.ticketPrice} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Poster (leave blank to keep existing)</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleFile} />
                    </Form.Group>

                    <div className="d-flex justify-content-between mt-4">
                        <Button type="submit">Save Changes</Button>
                        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                            Delete Event
                        </Button>
                    </div>
                </Form>

                <Button className="mt-3" variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                </Button>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Container>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this event? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditEventPage;
