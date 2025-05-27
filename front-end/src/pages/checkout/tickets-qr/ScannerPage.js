import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar';

export default function ScannerPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const html5QrCode = new window.Html5Qrcode('qr-reader');

        html5QrCode
            .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                decodedText => {
                    html5QrCode.stop().catch(() => { });
                    // decodedText === "/ticket/86"
                    navigate(decodedText);
                },
                err => console.error('QR scanning error', err)
            )
            .catch(err => console.error('QR init error', err));

        return () => html5QrCode.stop().catch(() => { });
    }, [navigate]);

    return (
        <>
            <NavBar />
            <div style={{ textAlign: 'center', marginTop: '5vh' }}>
                <h2>Scan Your Ticket</h2>
                <div id="qr-reader" style={{ width: 300, margin: 'auto' }} />
            </div>
        </>
    );
}
