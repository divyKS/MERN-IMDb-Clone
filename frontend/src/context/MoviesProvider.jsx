import React, { createContext, useContext, useState } from 'react'
import { getMovies } from '../api/movie';
import { NotificationContext } from './NotificationProvider';

export const MovieContext = createContext();

let currentPageNo = 0;
const limit = 5;

const MoviesProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);
    const [latestsUploads, setLatestUploads] = useState([]);
	const [reachedEnd, setReachedEnd] = useState(false);

    const useNotification = useContext(NotificationContext);

    const fetchMovies = async (pageNo=currentPageNo) => {
        const {movies, error} = await getMovies(pageNo, limit); 
        if(error) return useNotification.updateNotification('error', error);

        if(!movies.length){
			currentPageNo = pageNo - 1;
			return setReachedEnd(true)
		};

        setMovies([...movies]);
    };

    const fetchNextPage = () => {
		if(reachedEnd) return ;
		currentPageNo += 1;
		fetchMovies(currentPageNo);
	};

	const fetchPrevPage = () => {
		if(currentPageNo <= 0) return ;
        if(reachedEnd === 'true') setReachedEnd(false);
		currentPageNo -= 1;
		fetchMovies(currentPageNo);
	};

    const fetchLatestUploads = async (quantity = 5) => {
        const { error, movies } = await getMovies(0, quantity);
        if (error) return useNotification.updateNotification('error', error);

        setLatestUploads([...movies]);
    };


	return(
        <MovieContext.Provider value={{ movies, latestsUploads, fetchMovies, fetchNextPage, fetchPrevPage, fetchLatestUploads }}>
            {children}
        </MovieContext.Provider>
    );
};

export default MoviesProvider