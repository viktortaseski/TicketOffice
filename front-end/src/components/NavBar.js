import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Dropdown, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './home/home.css'
import ticketIcon from '../assets/ticketOutlined.png';

const NavBar = () => {
    const [userType, setUserType] = useState(null);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://88.200.63.148:8000/users/me', { credentials: 'include' });
                if (!res.ok) throw new Error('Not logged in');
                const data = await res.json();
                setUserType(data.user.userType);
            } catch {
                setUserType(null); // not logged in
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://88.200.63.148:8000/users/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setUserType(null);
            navigate('/login'); // Or '/' if you want to go to home
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSearch = e => {
        e.preventDefault();
        // Navigate to home with the query param
        navigate(`/?q=${encodeURIComponent(query)}`);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3 sticky-top">
            <Container className="d-flex justify-content-between align-items-center">
                {/* Brand with ticket icon */}
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={ticketIcon}
                        alt="Ticket"
                        className="ticket-logo"
                    />
                    TicketOffice
                </Navbar.Brand>

                <Form
                    onSubmit={handleSearch}
                    className="d-flex align-items-center me-2 search-form"
                    style={{ minWidth: 0 }}
                >
                    <Form.Control
                        type="text"
                        placeholder="Search events…"
                        className="me-2 flex-grow-1"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <Button type="submit" variant="outline-light">
                        Search
                    </Button>
                </Form>

                {/* Three-dot menu */}
                <Nav className="d-flex align-items-center">
                    <Dropdown
                        className="settings-dropdown"
                        drop="down"
                        align="end"
                    >
                        <Dropdown.Toggle
                            variant="link"
                            id="settings-dropdown"
                            className="text-decoration-none p-0"
                            style={{
                                fontSize: '1.5rem',
                                lineHeight: 1,
                                color: 'rgba(255,255,255,0.75)'
                            }}
                        >
                            &#x22EE;
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end">
                            {userType ? (
                                <>
                                    <Dropdown.Item as={Link} to="/cart">My Cart</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/">Settings</Dropdown.Item>

                                    {userType === 'Organizer' && (
                                        <>
                                            <Dropdown.Item as={Link} to="/my-events">My Events</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/create-event">Create Event</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/validate-organization">Validate Organization</Dropdown.Item>
                                        </>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </>
                            ) : (
                                <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar >
    );
};

export default NavBar;
