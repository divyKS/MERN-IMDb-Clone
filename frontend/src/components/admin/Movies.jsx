import React, { useEffect, useState } from 'react';
import MovieListItem from '../MovieListItem';
import { getMovies } from '../../api/movie';

let currentPageNo = 0;
const limit = 1;

const Movies = () => {
    const [movies, setMovies] = useState([]);
	const [reachedEnd, setReachedEnd] = useState(false);

    const fetchMovies = async (pageNo) => {
        const {movies, error} = await getMovies(pageNo, limit); // we can't destrucutre with any name, we will have the use the name which comes in the response
        if(error) return console.log(error);
        if(!movies.length){
			currentPageNo = pageNo - 1;
			return setReachedEnd(true)
		}; 
        setMovies(movies);
    };

    useEffect(()=>{
        fetchMovies(currentPageNo);
    }, []);

    const handleOnNextClick = () => {
		if(reachedEnd) return ;
		currentPageNo += 1;
		fetchMovies(currentPageNo);
	};

	const handleOnPrevClick = () => {
		if(currentPageNo <= 0) return ;
        if(reachedEnd === 'true') setReachedEnd(false);
		currentPageNo -= 1;
		fetchMovies(currentPageNo);
	};

    return (
        <div className="p-5">                
            <div className='space-y-3 p-5'>
                {movies.map((movie)=>{
                    return <MovieListItem key={movie.title} movie={movie}/>
                })}
            </div>
            <div className="flex justify-end items-center space-x-5 mt-5">
            <button
                type='button'
                className='text-primary dark:text-white hover:underline'
                onClick={handleOnPrevClick}
            >
                Prev
            </button>
            <button
                type='button'
                className='text-primary dark:text-white hover:underline'
                onClick={handleOnNextClick}
            >
                Next
            </button>
        </div>
    </div>
    );
};

export default Movies;
