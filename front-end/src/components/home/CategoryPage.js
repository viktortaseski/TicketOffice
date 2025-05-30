import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from '../NavBar';
import EventCard from '../EventCard';
import API_BASE_URL from '../../api';
import CategorySection from './CategorySection';
import newBanner from '../../assets/gameBanner.jpg';
import './home.css';

export default function CategoryPage() {
    const { categoryName } = useParams();
    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/events`);
                if (!res.ok) throw new Error('Network error');
                const all = await res.json();

                const filtered = all.filter(event =>
                    event.category?.toLowerCase() === decodeURIComponent(categoryName).replace(/-/g, ' ')
                );
                setItems(filtered);
            } catch (err) {
                console.error('Error fetching events:', err);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryName]);

    const displayName = categoryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <>
            <NavBar />
            <div className="banner-container">
                <picture>
                    {/* You can add more <source> tags for different resolutions/formats */}
                    <source
                        media="(min-width: 1200px)"
                        srcSet={newBanner}
                        type="image/jpeg"
                    />
                    <img
                        src={newBanner}
                        alt="Promotion Banner"
                        className="banner-image"
                    />
                </picture>
            </div>
            <CategorySection />

            <Container className="my-5">
                <h2 className="mb-4 text-center">{displayName} Events</h2>
                <Row className="justify-content-center">
                    {isLoading ? (
                        <Col xs={12} className="text-center"><h2>Loading…</h2></Col>
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
                        <Col xs={12} className="text-center"><h2>No events found.</h2></Col>
                    )}
                </Row>
            </Container>
        </>
    );
}
