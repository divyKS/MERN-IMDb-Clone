import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchPublicMovies } from '../../api/movie';
import NotFoundText from '../NotFoundText';
import { NotificationContext } from '../../context/NotificationProvider';
import MovieList from './MovieList';

const SearchMovies = () => {
    const useNotification = useContext(NotificationContext);

    const [searchParams] = useSearchParams();

    const query = searchParams.get('title');
    const [movies, setMovies] = useState([]);
    const [resultsNotFound, setResultsNotFound] = useState(false); 

    const searchMovies = async (val) => {
        const {error, results} = await searchPublicMovies(val); // not using useSearch context here
        if(error) return useNotification.updateNotification('error', error);
        console.log({results});
        if(!results.length){
            setResultsNotFound(true);
            return setMovies([]);
        }        
        setResultsNotFound(false);    
        setMovies([...results]);        
    };

    useEffect(()=>{
        if(query.trim()) searchMovies(query);
    }, [query]);

    return (
        <div className="dark:bg-primary bg-white min-h-screen py-8 ">
            <div className={"max-w-screen-xl mx-auto px-2 xl:p-0" }> 
                <NotFoundText text='Movie not found with given name' visible={resultsNotFound}/>
                <MovieList movies={movies} />
            </div>
        </div>
    );
}

export default SearchMovies