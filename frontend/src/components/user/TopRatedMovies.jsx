import React, { useEffect, useState } from 'react';
import { getTopRatedMovies } from '../../api/movie';
import MovieList from './MovieList';

const TopRatedMovies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(()=>{
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const {error, movies} = await getTopRatedMovies();
        if(error) return console.log('error: could fetch the top rated movies');
        setMovies([...movies]);
    };

    return (
        <MovieList movies={movies} title='Viewers Choice(Movies)'/>
    );
};

export default TopRatedMovies;
