import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import noImg from '../assets/noImg.jpg';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/movies/${movie.imdbID}`);
    };

    return (
        <Card onClick={handleCardClick} className="h-100 movie-card" style={{ cursor: 'pointer' }}>
            <Card.Img
                variant="top"
                src={movie.Poster !== 'N/A' ? movie.Poster : noImg} // <-- use imported noImg
                alt={movie.Title}
            />
            <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Card.Text>
                    <small className="text-muted">
                        {movie.Year} - {movie.Type}
                    </small>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default MovieCard;