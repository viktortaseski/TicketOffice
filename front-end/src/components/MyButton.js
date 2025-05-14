import React from 'react';
import Button from 'react-bootstrap/Button';

const MyButton = ({ text, onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} >
            {text}
        </Button>
    );
};

export default MyButton;
