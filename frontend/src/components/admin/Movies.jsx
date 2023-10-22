import React, { useEffect, useState } from 'react';
import MovieListItem from '../MovieListItem';
import { deleteMovie, getMovieForUpdate, getMovies, updateMovie } from '../../api/movie';
import NextAndPrevButton from '../NextAndPrevButton';
import UpdateMovie from '../model/UpdateMovie';
import ConfirmModel from '../model/ConfirmModel';

let currentPageNo = 0;
const limit = 1;

const Movies = () => {
    const [movies, setMovies] = useState([]);
	const [reachedEnd, setReachedEnd] = useState(false);
    const [showUpdateModel, setShowUpdateModel] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showConfirmModel, setShowConfirmModel] = useState(false);
    const [busy, setBusy] = useState(false);

    const fetchMovies = async (pageNo) => {
        const {movies, error} = await getMovies(pageNo, limit); // we can't destrucutre with any name, we will have the use the name which comes in the response
        if(error) return console.log(error);
        if(!movies.length){
			currentPageNo = pageNo - 1;
			return setReachedEnd(true)
		}; 
        setMovies([...movies]);
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

    const handleOnEditClick = async (movie) => {
        console.log('Edit Click: ', movie);
        const res = await getMovieForUpdate(movie.id);
        if(res.error) return console.log('There was an error in getting the information about the selected movie to be updated');
        console.log('Complete Movie: ', res.movie);
        setSelectedMovie(res.movie);
        setShowUpdateModel(true);
    };

    const handleOnUpdate = (movie) => {
        // we just have the single updated movie hence can't use setMovies(movie)
        // so first we will create that list
        const updatedMovies = movies.map((m)=>{
            if(m.id === movie.id) return movie;
            return m;
        });
        setMovies([...updatedMovies]);
    };

    const handleOnDeleteClick = (movie) => {
        setShowConfirmModel(true);
        setSelectedMovie(movie);

    };

    const handleOnDeleteConfirm = async () => {
        setBusy(true);
        const {error, message} = await deleteMovie(selectedMovie.id);
        setBusy(false);
        if(error) return console.log('movie was not deleted -> ', error);
        console.log('movie was deleted successfully  -> ', message);
        setShowConfirmModel(false);
        fetchMovies(currentPageNo);
    };

    return (
        <>
            <div className="p-5">                
                <div className='space-y-3 p-5'>
                    {movies.map((movie)=>{
                        return <MovieListItem
                                    key={movie.title}
                                    movie={movie}
                                    onEditClick={()=>handleOnEditClick(movie)}
                                    onDeleteClick={()=>handleOnDeleteClick(movie)}
                                /> // was calling the function directly for all movies hence they were getting printed
                    })}
                </div>
                {/* <div className="flex justify-end items-center space-x-5 mt-5">
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
                </div> */}
                <NextAndPrevButton
                    className="mt-5"
                    onNextClick={handleOnNextClick}
                    onPrevClick={handleOnPrevClick}
                />
            </div>

            <ConfirmModel
                visible={showConfirmModel}
                onConfirm={handleOnDeleteConfirm}
                title='Are you sure?'
                subtitle='This will delete this movie permanently'
                onCancel={()=>setShowConfirmModel(false)}
                busy={busy}
            />

            <UpdateMovie
                visible={showUpdateModel}
                initialState={selectedMovie}
                onSuccess={handleOnUpdate}
                onClose={()=>setShowUpdateModel(false)}
            />
        </>
    );
};

export default Movies;
