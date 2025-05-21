import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../api';
import EventForm from './EventForm';
import EventPreview from './EventPreview';
import NavBar from '../NavBar';
import AlertModal from './AlertModal';
import './CreateEventPage.css';

export default function CreateEventPage() {
    const [data, setData] = useState({
        date: '',
        time: '',
        title: '',
        venue: '',
        posterFile: null,
        posterUrl: '',
        category: 'Concerts',
        description: '',
        availableTickets: '',
        ticketPrice: undefined,
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setData(d => ({ ...d, [name]: value }));
    };

    const handleFileChange = e => {
        const file = e.target.files[0];
        setData(d => ({ ...d, posterFile: file, posterUrl: '' }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setShowError(false);
        setShowSuccess(false);

        const stored = localStorage.getItem('user');
        const organizer = stored ? JSON.parse(stored) : null;
        if (!organizer?.id) {
            setError('Please log in as an organizer.');
            setShowError(true);
            return;
        }

        const {
            date,
            time,
            title,
            venue,
            posterFile,
            posterUrl,
            category,
            availableTickets,
            description,
            ticketPrice,
        } = data;

        if (
            !date ||
            !time ||
            !title ||
            !venue ||
            (!posterFile && !posterUrl) ||
            !category ||
            !availableTickets ||
            !ticketPrice
        ) {
            setError('Please fill in all required fields.');
            setShowError(true);
            return;
        }

        const formData = new FormData();
        formData.append('date', date);
        formData.append('time', time);
        formData.append('title', title);
        formData.append('venue', venue);
        if (posterFile) formData.append('poster', posterFile);
        else formData.append('posterUrl', posterUrl);
        formData.append('category', category);
        formData.append('ticketPrice', ticketPrice);
        formData.append('availableTickets', availableTickets);
        formData.append('description', description);
        formData.append('organizer_id', organizer.id);

        try {
            const res = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const json = await res.json();

            if (res.ok) {
                setSuccess('Event created successfully!');
                setShowSuccess(true);
                setData({
                    date: '',
                    time: '',
                    title: '',
                    venue: '',
                    posterFile: null,
                    posterUrl: '',
                    category: 'Concerts',
                    description: '',
                    availableTickets: '',
                    ticketPrice: undefined,
                });
                navigate('/');
            } else {
                setError(json.message || 'Failed to create event.');
                setShowError(true);
            }
        } catch (err) {
            console.error('Error creating event:', err);
            setError('Server error—please try again later.');
            setShowError(true);
        }
    };

    return (
        <>
            <NavBar />

            {showError && (
                <AlertModal
                    message={error}
                    variant="danger"
                    onClose={() => {
                        setError('');
                        setShowError(false);
                    }}
                />
            )}

            {showSuccess && (
                <AlertModal
                    message={success}
                    variant="success"
                    onClose={() => {
                        setSuccess('');
                        setShowSuccess(false);
                    }}
                />
            )}

            <Container className="my-5">
                <Row className="g-4">
                    <Col md={8}>
                        <EventForm
                            data={data}
                            onChange={handleChange}
                            onFileChange={handleFileChange}
                            onSubmit={handleSubmit}
                        />
                    </Col>
                    <Col md={4}>
                        <EventPreview event={data} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
