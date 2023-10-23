import React, { useState, useEffect } from 'react';
import ModelContainer from './ModelContainer';
import MovieForm from '../admin/MovieForm';
import { getMovieForUpdate, updateMovie } from '../../api/movie';

const UpdateMovie = ({ visible, onSuccess, movieId }) => {
    const [busy, setBusy] = useState(false); 
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [ready, setReady] = useState(false);


    const handleSubmit = async (data) => {
        setBusy(true);
        const {error, movie, message} = await updateMovie(movieId, data);
        setBusy(false);
        if(error) return console.log('Movie was unable to update -> ', error)
        if(message) console.log({message});
        onSuccess(movie);
    };

    const fetchMoviesToUpdate = async () => {
        // console.log('Edit Click: ', movie);
        const res = await getMovieForUpdate(movieId);
        if(res.error) return console.log('There was an error in getting the information about the selected movie to be updated');
        setReady(true);
        // console.log('Complete Movie: ', res.movie);
        setSelectedMovie(res.movie);
        // setShowUpdateModel(true); server pai slow hoga
    };

    useEffect(()=>{
        if(movieId) fetchMoviesToUpdate();
    }, [movieId]);

	return (
        <ModelContainer visible={visible} >
            {ready ?
                <MovieForm
                    initialState={selectedMovie}
                    btnTitle='Update Movie'
                    onSubmit={!busy? handleSubmit:null}
                    busy={busy}
                /> : 
                <div className='w-full h-full flex justify-center items-center'>
                    <p className='text-light-subtle dark:text-dark-subtle animate-pulse text-xl'>Please wait...</p>
                </div>}
        </ModelContainer>
    );
};

export default UpdateMovie;
