import React from 'react';
import Button from 'react-bootstrap/Button';

const MyButton = (props) => {
    return (
        <Button variant="primary" >
            {props.text}
        </Button>
    );
};

export default MyButton;
