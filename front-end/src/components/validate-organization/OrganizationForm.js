// src/components/validate-organization/OrganizationForm.js

import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const fields = [
    { name: 'orgName', label: 'Organization Name', required: true, xs: 12 },
    { name: 'orgType', label: 'Organization Type', required: true, xs: 12 },
    { name: 'registrationNumber', label: 'Registration Number', required: true, xs: 12 },
    { name: 'taxId', label: 'Tax ID / VAT Number', required: false, xs: 12 },
    { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true, xs: 12 },
    { name: 'contactPhone', label: 'Contact Phone', type: 'tel', required: false, xs: 12 },
    { name: 'address', label: 'Address', required: false, xs: 12 },
    { name: 'city', label: 'City', required: false, xs: 6 },
    { name: 'country', label: 'Country', required: false, xs: 6 },
    { name: 'bankAccount', label: 'Bank Account / IBAN', required: false, xs: 12 },
];

export default function OrganizationForm({ form, onChange, onSubmit, error, success }) {
    return (
        <Form onSubmit={onSubmit}>

            <Row>
                {fields.map(({ name, label, type = 'text', required, xs }) => (
                    <Col key={name} xs={xs} className="mb-3">
                        <Form.Group controlId={name}>
                            <Form.Label>{label}{required && ' *'}</Form.Label>
                            <Form.Control
                                name={name}
                                type={type}
                                required={required}
                                value={form[name]}
                                onChange={onChange}
                            />
                        </Form.Group>
                    </Col>
                ))}
            </Row>

            <div className="d-grid">
                <Button type="submit" variant="primary">
                    Submit for Validation
                </Button>
            </div>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">{success}</div>}
        </Form>
    );
}
