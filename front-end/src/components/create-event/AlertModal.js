import React from 'react';
import './AlertModal.css';

const AlertModal = ({ message, onClose, variant }) => {
    if (!message) return null;

    return (
        <div className="alert-backdrop">
            <div className={`alert-modal alert-${variant}`}>
                <button className="alert-close" onClick={onClose}>×</button>
                <div className="alert-content">
                    <p>{message}</p>
                </div>
                <button className="alert-ok" onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default AlertModal;
