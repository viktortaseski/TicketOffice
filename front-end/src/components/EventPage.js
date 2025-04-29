import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyButton from './MyButton';
import MovieCard from './MovieCard';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

const API_URL = 'http://www.omdbapi.com?apikey=c032e2d7';

const EventPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [recommendedMovies, setRecommendedMovies] = useState([]);

    // Fetch the main movie details using its imdbID
    useEffect(() => {
        const fetchMovie = async () => {
            const response = await fetch(`${API_URL}&i=${id}`);
            const data = await response.json();
            setMovie(data);
        };

        fetchMovie();
    }, [id]);

    // Once the main movie is loaded, fetch recommended movies based on its title
    useEffect(() => {
        if (movie && movie.Title) {
            const fetchRecommendedMovies = async () => {
                const response = await fetch(
                    `${API_URL}&s=${encodeURIComponent(movie.Title)}`
                );
                const data = await response.json();
                if (data.Search) {
                    const filtered = data.Search.filter(
                        (m) => m.imdbID !== movie.imdbID
                    );
                    setRecommendedMovies(filtered);
                } else {
                    setRecommendedMovies([]);
                }
            };

            fetchRecommendedMovies();
        }
    }, [movie]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <NavBar />
            {/* Main Movie Details */}
            <Container className="my-5">
                <Card className="shadow">
                    <Row className="g-0">
                        <Col md={4}>
                            <Image
                                src={movie.Poster}
                                alt={movie.Title}
                                fluid
                                className="p-3"
                            />
                        </Col>
                        <Col md={8}>
                            <Card.Body>
                                <Card.Title as="h1" className="mb-3">
                                    {movie.Title}
                                </Card.Title>
                                <Card.Text>
                                    <strong>Year:</strong> {movie.Year}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Plot:</strong> {movie.Plot}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Genre:</strong> {movie.Genre}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Actors:</strong> {movie.Actors}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Price:</strong> {((movie.Year - 2000) * 5) % 100}$
                                </Card.Text>
                                <MyButton text="Buy Ticket" />
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            </Container>

            {/* Recommended Movies Section */}
            <Container className="my-5">
                <h2 className="mb-4 text-center">Recommended Movies</h2>
                <Row className="justify-content-center">
                    {recommendedMovies.length > 0 ? (
                        recommendedMovies.map((recMovie) => (
                            <Col
                                key={recMovie.imdbID}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                className="mb-4 d-flex align-items-stretch"
                            >
                                <MovieCard movie={recMovie} />
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

export default EventPage;
