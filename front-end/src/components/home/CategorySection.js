import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './CategorySection.css';

import concertIcon from './icons/concert.png';
import festivalIcon from './icons/festival.png';
import theatreIcon from './icons/theatre.png';
import philharmonyIcon from './icons/philharmony.png';
import operaIcon from './icons/opera.png';
import sportIcon from './icons/sport.png';

const categories = [
    { name: 'Concerts', icon: concertIcon },
    { name: 'Festivals', icon: festivalIcon },
    { name: 'Theatres', icon: theatreIcon },
    { name: 'Philharmony', icon: philharmonyIcon },
    { name: 'Opera & Ballet', icon: operaIcon },
    { name: 'Sport Events', icon: sportIcon },
];

// helper to slugify category names, e.g. "Opera & Ballet" → "/opera-&-ballet"
const toPath = (name) =>
    '/category/' + name.toLowerCase().replace(/\s+/g, '-');

const CategorySection = () => (
    <Container className="my-4">
        <Row className="justify-content-center">
            {categories.map(({ name, icon }) => (
                <Col
                    key={name}
                    xs={6} sm={4} md={3} lg={2}
                    className="mb-3 text-center"
                >
                    <Link to={toPath(name)} className="text-decoration-none">
                        <div className="category-item p-2 rounded">
                            <img
                                src={icon}
                                alt={name}
                                className="img-fluid mb-2"
                                style={{ width: 50, height: 50 }}
                            />
                            <div className="text-dark">{name}</div>
                        </div>
                    </Link>
                </Col>
            ))}
        </Row>
    </Container>
);

export default CategorySection;