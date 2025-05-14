import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Dropdown, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [userType, setUserType] = useState(null);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                setUserType(JSON.parse(stored).userType);
            } catch { /* ignore */ }
        }
    }, []);

    const handleSearch = e => {
        e.preventDefault();
        // Navigate to home with the query param
        navigate(`/?q=${encodeURIComponent(query)}`);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3 sticky-top">
            <Container>
                {/* Brand */}
                <Navbar.Brand as={Link} to="/">TicketOffice</Navbar.Brand>

                {/* Search form */}
                <Form
                    onSubmit={handleSearch}
                    className="d-flex mx-auto"
                    style={{ maxWidth: 400, width: '100%' }}
                >
                    <Form.Control
                        type="text"
                        placeholder="Search events…"
                        className="me-2"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <Button type="submit" variant="outline-light">
                        Search
                    </Button>
                </Form>

                {/* Three-dot menu */}
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/cart">My Cart</Nav.Link>
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="link"
                            id="settings-dropdown"
                            className="text-decoration-none p-0"
                            style={{ fontSize: '1.5rem', lineHeight: 1, color: 'rgba(255,255,255,0.75)' }}
                        >
                            &#x22EE;
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end">
                            <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                            {userType === 'Organizer' && (
                                <>
                                    <Dropdown.Item as={Link} to="/create-event">
                                        Create Event
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/validate-organization">
                                        Validate Organization
                                    </Dropdown.Item>
                                </>
                            )}
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavBar;
