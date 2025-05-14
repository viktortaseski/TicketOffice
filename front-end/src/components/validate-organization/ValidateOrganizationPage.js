// src/components/validate-organization/ValidateOrganizationPage.js

import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import OrganizationForm from './OrganizationForm';  // same-folder import
import NavBar from '../NavBar';

const REQUIRED_KEYS = ['orgName', 'orgType', 'registrationNumber', 'contactEmail'];

const ValidateOrganizationPage = () => {
    const initialData = {
        orgName: '', orgType: '', registrationNumber: '',
        taxId: '', contactEmail: '', contactPhone: '',
        address: '', city: '', country: '', bankAccount: ''
    };

    const [form, setForm] = useState(initialData);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setError(''); setSuccess('');

        // Check required keys
        const missing = REQUIRED_KEYS.filter(key => !form[key].trim());
        if (missing.length) {
            return setError('Please fill in all required fields.');
        }

        console.log('Submitting org validation:', form);
        setSuccess('Your organization details have been submitted for validation.');
    };

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card>
                            <Card.Header as="h4" className="text-center">
                                Validate Organization
                            </Card.Header>
                            <Card.Body>
                                <OrganizationForm
                                    form={form}
                                    onChange={handleChange}
                                    onSubmit={handleSubmit}
                                    error={error}
                                    success={success}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ValidateOrganizationPage;
