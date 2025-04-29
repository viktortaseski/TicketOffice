import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BsThreeDotsVertical } from 'react-icons/bs';

const NavBar = () => {
    return (
        <Navbar
            expand="lg"
            variant="dark"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            className="mb-4"
        >
            <Container className="d-flex justify-content-between align-items-center">
                <Nav className="d-flex align-items-center">
                    <Nav.Link href="/" className="text-white">Home</Nav.Link>
                    <Nav.Link href="/purchases" className="text-white">Purchases</Nav.Link>
                </Nav>
                <Navbar.Brand className="mx-auto text-white">TicketOffice</Navbar.Brand>
                <div>
                    <BsThreeDotsVertical size={24} color="white" cursor={"pointer"} />
                </div>
            </Container>
        </Navbar>
    );
};

export default NavBar;
