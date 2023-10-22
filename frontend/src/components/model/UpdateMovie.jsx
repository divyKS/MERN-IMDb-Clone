import React, { useState } from 'react';
import ModelContainer from './ModelContainer';
import MovieForm from '../admin/MovieForm';
import { updateMovie } from '../../api/movie';

const UpdateMovie = ({ visible, initialState, onSuccess, onClose }) => {
    const [busy, setBusy] = useState(false); 

    const handleSubmit = async (data) => {
        setBusy(true);
        const {error, movie, message} = await updateMovie(initialState.id, data);
        setBusy(false);
        if(error) return console.log('Movie was unable to update -> ', error)
        if(message) console.log({message});
        onSuccess(movie);
        onClose();
    };

	return (
        <ModelContainer visible={visible} >
            <MovieForm
                initialState={initialState}
                btnTitle='Update Movie'
                onSubmit={!busy? handleSubmit:null}
                busy={busy}
            />
        </ModelContainer>
    );
};

export default UpdateMovie;
