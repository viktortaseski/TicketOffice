// src/components/create-event/EventForm.js
import React from 'react';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';

const categories = [
    'Concerts',
    'Festivals',
    'Theatres',
    'Philharmony',
    'Opera & Ballet',
    'Sport Events',
    'Others'
];

const fields = [
    { name: 'date', label: 'Date', type: 'date', required: true, min: '2024-01-01', max: '2200-12-31', col: { md: 6 } },
    { name: 'time', label: 'Time', type: 'time', required: true, col: { md: 6 } },
    { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Event title', col: { md: 12 } },
    { name: 'venue', label: 'Venue', type: 'text', required: true, placeholder: 'Event venue', col: { md: 12 } },
    // we'll handle posterFile + posterUrl specially below...
    { name: 'category', label: 'Category', type: 'select', required: true, options: categories, col: { md: 12 } },
    { name: 'availableTickets', label: 'Tickets for sale', type: 'number', required: true, placeholder: 'e.g. 100', col: { md: 6 } },
    { name: 'ticketPrice', label: 'Price (€)', type: 'number', required: true, placeholder: 'e.g. 100.00', col: { md: 6 } },
    { name: 'description', label: 'Description', type: 'textarea', required: false, rows: 4, col: { md: 12 } },
];

export default function EventForm({ data, onChange, onFileChange, onSubmit }) {
    return (
        <Form onSubmit={onSubmit}>
            <Row className="g-3">
                {fields.map(field => {
                    const { name, label, type, required, placeholder, col, options, rows, min } = field;
                    return (
                        <Col key={name} xs={12} {...col}>
                            <Form.Group controlId={name}>
                                <Form.Label>
                                    {label}{required && ' *'}
                                </Form.Label>

                                {type === 'select' ? (
                                    <Form.Select
                                        name={name}
                                        value={data[name]}
                                        onChange={onChange}
                                        required={required}
                                    >
                                        {options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </Form.Select>
                                ) : type === 'textarea' ? (
                                    <Form.Control
                                        as="textarea"
                                        rows={rows}
                                        name={name}
                                        value={data[name]}
                                        onChange={onChange}
                                        placeholder={placeholder}
                                    />
                                ) : name === 'ticketPrice' ? (
                                    <InputGroup>
                                        <InputGroup.Text>€</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            name={name}
                                            value={data[name]}
                                            onChange={onChange}
                                            placeholder={placeholder}
                                            required={required}
                                            min="0"
                                        />
                                    </InputGroup>
                                ) : (
                                    <Form.Control
                                        type={type}
                                        name={name}
                                        value={data[name]}
                                        onChange={onChange}
                                        placeholder={placeholder}
                                        required={required}
                                        min={min}
                                    />
                                )
                                }
                            </Form.Group>
                        </Col>
                    );
                })}

                {/* Poster row: file + URL side-by-side */}
                <Col xs={12} md={12}>
                    <Form.Group controlId="posterFile">
                        <Form.Label>Poster Image *</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            required
                        />
                    </Form.Group>
                </Col>

                <Col xs={12}>
                    <div className="d-grid mt-2">
                        <Button variant="primary" size="lg" type="submit">
                            Publish Event
                        </Button>
                    </div>
                </Col>
            </Row>
        </Form>
    );
}
