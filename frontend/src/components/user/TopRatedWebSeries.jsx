import React, { useEffect, useState } from 'react';
import { getTopRatedMovies } from '../../api/movie';
import MovieList from './MovieList';

const TopRatedWebSeries = () => {
    const [movies, setMovies] = useState([]);

    useEffect(()=>{
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const {error, movies} = await getTopRatedMovies('Web Series');
        if(error) return console.log('error: could fetch the top rated movies -> ', error);
        setMovies([...movies]);
    };

    return (
        <MovieList movies={movies} title='Viewers Choice(Web Series)'/>
    );
};

export default TopRatedWebSeries;
