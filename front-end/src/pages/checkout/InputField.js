import React from 'react';
import Form from 'react-bootstrap/Form';

export default function InputField({
    name,
    label,
    type = 'text',
    value,
    onChange,
    required = false
}) {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
            />
        </Form.Group>
    );
}
