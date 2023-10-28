import React, { useEffect, useState } from 'react';
import { getTopRatedMovies } from '../../api/movie';
import MovieList from './MovieList';

const TopRatedWebSeries = () => {
    const [movies, setMovies] = useState([]);

    useEffect(()=>{
        const ac = new AbortController();
        fetchMovies(ac.signal);
        return ()=>{
            // ac.abort();
        }
    }, []);

    const fetchMovies = async (signal) => {
        const {error, movies} = await getTopRatedMovies('Web Series', signal);
        if(error) return console.log('error: could fetch the top rated movies -> ', error);
        setMovies([...movies]);
    };

    return (
        <MovieList movies={movies} title='Viewers Choice(Web Series)'/>
    );
};

export default TopRatedWebSeries;
