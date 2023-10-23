import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMovieForAdmin } from '../../api/movie';
import { NotificationContext } from '../../context/NotificationProvider';
import MovieListItem from '../MovieListItem';
import NotFoundText from '../NotFoundText';

const SearchMovies = () => {
    const useNotification = useContext(NotificationContext);

    const [searchParams] = useSearchParams();

    const query = searchParams.get('title');
    const [movies, setMovies] = useState([]);
    const [resultsNotFound, setResultsNotFound] = useState(false); 

    const searchMovies = async (val) => {
        const {error, results} = await searchMovieForAdmin(val); // not using useSearch context here
        if(error) return useNotification.updateNotification('error', error);
        console.log({results});
        if(!results.length){
            setResultsNotFound(true);
            return setMovies([]);
        }        
        setResultsNotFound(false);    
        setMovies([...results]);        
    };

    const handleAfterUpdate = (movie) => {
        const updatedMovies =  movies.map(m=>{
            if(m.id === movie.id) return movie;
            return m;
        });
        setMovies([...updatedMovies]);
    };
    
    const handleAfterDelete = (movie) => {
        const updatedMovies =  movies.filter(m=>{
            if(m.id!==movie.id) return m;
        });
        setMovies([...updatedMovies]);
    };

    useEffect(()=>{
        if(query.trim()) searchMovies(query);
    }, [query]);

    return (
        <div className='p-5 space-y-5'>
            <NotFoundText text='Movie not found with given name' visible={resultsNotFound}/>
            {!resultsNotFound && movies.map((m)=>{
                return (
                    <MovieListItem
                        movie={m}
                        key={m.id}
                        afterUpdate={handleAfterUpdate}
                        afterDelete={handleAfterDelete}
                    />
                )
            })}
        </div>
    );
}

export default SearchMovies