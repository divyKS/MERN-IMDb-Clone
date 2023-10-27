import React, { useEffect, useState } from 'react';
import { getRelatedMovies } from '../api/movie';
import MovieList from './user/MovieList';

const RelatedMovies = ({ movieId }) => {
    const [movies, setMovies] = useState([]);

    const fetchRelatedMovies = async () => {
        const {error, relatedMovies} = await getRelatedMovies(movieId);
        if(error) return console.log('could not get the latest movies to render inside the single movie -> ',error);
        setMovies([...relatedMovies]);
        // console.log({movies})
    };

    useEffect(()=>{
        if(movieId) fetchRelatedMovies();
    }, [movieId]);

	return (
        <MovieList title='Related Movies' movies={movies} />
    );
};

export default RelatedMovies;
