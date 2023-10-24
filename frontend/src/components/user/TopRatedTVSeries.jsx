import React, { useEffect, useState } from 'react';
import { getTopRatedMovies } from '../../api/movie';
import MovieList from './MovieList';

const TopRatedTVSeries = () => {
    const [movies, setMovies] = useState([]);

    useEffect(()=>{
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const {error, movies} = await getTopRatedMovies('TV Series');
        if(error) return console.log('error: could fetch the top rated movies -> ', error);
        setMovies([...movies]);
    };

    return (
        <MovieList movies={movies} title='Viewers Choice(TV Series)'/>
    );
};

export default TopRatedTVSeries;
