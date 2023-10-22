import React, { useContext, useEffect, useState } from 'react';
import MovieListItem from './MovieListItem';
import { deleteMovie, getMovieForUpdate, getMovies } from '../api/movie';
import ConfirmModel from './model/ConfirmModel';
import UpdateMovie from './model/UpdateMovie';
import { NotificationContext } from '../context/NotificationProvider';

const pageNo = 0;
const limit = 5;

const LatestUploads = () => {
    const [movies, setMovies] = useState([]);
    const [busy, setBusy] = useState(false);
    const [showConfirmModel, setShowConfirmModel] = useState(false);
    const [showUpdateModel, setShowUpdateModel] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    
    const useNotification = useContext(NotificationContext);

    const fetchLatestUploads = async () => {
        const { error, movies } = await getMovies(pageNo, limit);
        if (error) return useNotification.updateNotification('error', error);

        setMovies([...movies]);
    };

    const handleOnDeleteClick = (movie) => {
        setSelectedMovie(movie);
        setShowConfirmModel(true);
    };

    const handleOnEditClick = async ({ id }) => {
        const { movie, error } = await getMovieForUpdate(id);
        setShowUpdateModel(true);

        if (error) return useNotification.updateNotification("error", error);

        setSelectedMovie(movie);
    };

    const handleOnDeleteConfirm = async () => {
        setBusy(true);
        const { error, message } = await deleteMovie(selectedMovie.id);
        setBusy(false);

        if (error) return useNotification.updateNotification("error", error);

        useNotification.updateNotification("success", message);
        fetchLatestUploads();
        setShowConfirmModel(false);
    };

    const handleOnUpdate = (movie) => {
        const updatedMovies = movies.map((m) => {
        if (m.id === movie.id) return movie;
        return m;
        });

        setMovies([...updatedMovies]);
    };

        useEffect(() => {
            fetchLatestUploads();
        }, []);

	return (
        <>
            <div className="bg-white dark:bg-secondary shadow p-5 rounded col-span-2 space-y-5">
                <h1 className="font-semibold text-2xl text-primary dark:text-white mb-2">
                    Recent Uploads
                </h1>

                {movies.map((m)=>{
                    return (
                        <MovieListItem
                            key={m.id}
                            movie={m}
                            onDeleteClick={()=>handleOnDeleteClick(m)}
                            onEditClick={()=>handleOnEditClick(m)}
                            // onOpenClick={onOpenClick}
                        />
                    );
                })}

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

export default LatestUploads;