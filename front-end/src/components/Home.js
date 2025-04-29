import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MovieCard from './MovieCard';
import NavBar from './NavBar';

const API_URL = 'http://www.omdbapi.com?apikey=c032e2d7';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const searchMovies = async (title) => {
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();

        if (data.Search) {
            // Sort movies by release year (most recent first)
            const sortedMovies = data.Search.sort(
                (a, b) => parseInt(b.Year) - parseInt(a.Year)
            );
            setMovies(sortedMovies);
        } else {
            setMovies([]);
        }
    };

    useEffect(() => {
        // Initial search with "Movie"
        searchMovies('Movie');
    }, []);

    return (
        <>
            <NavBar />
            <Container className="my-5">
                <Row className="justify-content-center mb-4">
                    <Col xs={12} md={8}>
                        <Form className="d-flex">
                            <Form.Control
                                size="lg"
                                type="text"
                                placeholder="Search for movies"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => searchMovies(searchTerm)}
                                className="ms-2"
                            >
                                Search
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    {movies?.length > 0 ? (
                        movies.map((movie) => (
                            <Col
                                key={movie.imdbID}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                className="mb-4 d-flex align-items-stretch"
                            >
                                <MovieCard movie={movie} />
                            </Col>
                        ))
                    ) : (
                        <Col xs={12} className="text-center">
                            <h2>No movies found.</h2>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default Home;
