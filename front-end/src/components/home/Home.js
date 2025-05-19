// src/components/home/Home.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import NavBar from '../NavBar';
import CategorySection from './CategorySection';
import EventCard from '../EventCard';
import API_BASE_URL from '../../api';
import './home.css';

import gameBanner from '../../assets/gameBanner.jpg'            // Import image

function useQueryParam(name) {
    return new URLSearchParams(useLocation().search).get(name);
}

export default function Home() {
    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const queryRaw = useQueryParam('q') || '';
    const query = queryRaw.toLowerCase();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/events`);
                if (!res.ok) throw new Error('Network response was not ok');
                const all = await res.json();

                const sorted = all
                    .filter(ev => ev.title.toLowerCase().includes(query))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));


                setItems(sorted);
            } catch (err) {
                console.error('Error fetching items:', err);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [query]);

    return (
        <>
            <NavBar />

            {/* Promotion Banner */}
            <div className='promotionDiv'>
                <img
                    src={//mainPromotion
                        gameBanner
                    }
                    alt="Promotion Banner"
                    className='promotionImg'
                />
            </div>

            <CategorySection />

            <Container className="my-5">
                <Row className="justify-content-center">
                    {isLoading ? (
                        <Col xs={12} className="text-center">
                            <h2>Loading…</h2>
                        </Col>
                    ) : items.length > 0 ? (
                        items.map(item => (
                            <Col
                                key={item.id}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                className="mb-4 d-flex align-items-stretch"
                            >
                                <EventCard event={item} />
                            </Col>
                        ))
                    ) : (
                        <Col xs={12} className="text-center">
                            <h2>No events found.</h2>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    );
}
