import React, { useState } from 'react';
import { BsTrash3, BsPencilSquare, BsBoxArrowUpRight } from 'react-icons/bs'
import ConfirmModel from './model/ConfirmModel';
import { deleteMovie } from '../api/movie';
import UpdateMovie from './model/UpdateMovie';
import { AiFillNotification } from 'react-icons/ai';

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
    const [busy, setBusy] = useState(false);
    const [showConfirmModel, setShowConfirmModel] = useState(false);
    const [showUpdateModel, setShowUpdateModel] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const handleOnDeleteConfirm = async () => {
        setBusy(true);
        const {error, message} = await deleteMovie(movie.id);
        setBusy(false);
        if(error) return console.log('movie was not deleted -> ', error);
        console.log('movie was deleted successfully  -> ', message);
        setShowConfirmModel(false); // first hide the model, then change the ui and send the notification from updateNotification
        afterDelete(movie);
        // fetchMovies(currentPageNo); we have things in three four places so this wont work
    };

    const handleOnEditClick = () => {
        setShowUpdateModel(true);
        setSelectedMovieId(movie.id); // we want to handle the update for only that movie on which the button is clicked, hence need this, otherwise request were going out to the backend to update movie for all the movies present on that page
    };

    const handleOnUpdate = (movie) => {
        afterUpdate(movie);
        setShowUpdateModel(false);
        setSelectedMovieId(null);
    };

    return (
        <>
            <MovieCard movie={movie} onDeleteClick={()=>setShowConfirmModel(true)} onEditClick={handleOnEditClick}/>
            <div className='p-0'>
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
                    onSuccess={handleOnUpdate}
                    movieId={selectedMovieId}
                    // onClose={()=>setShowUpdateModel(false)}
                />
            </div>
        </>
    );
};

const MovieCard = ({ movie, onDeleteClick, onEditClick, onOpenClick }) => {
    
    const {title, genres, poster, status} = movie;

	return (
            <table className='w-full border-b'>
                <tbody>
                    <tr>
                        <td>
                            <div className='w-24'>
                                <img src={poster} alt={title} className='w-full aspect-video'/>
                            </div>
                        </td>
    
                        <td className='w-full pl-5'> 
                            <div>
                                <h1 className="font-semibold text-primary dark:text-white text-lg">{title}</h1>
                                <div className='space-x-2'>
                                    {genres.map((genre, index)=>{
                                        return (
                                            <span key={genre+index} className="text-primary dark:text-white text-sm">{genre}</span>
                                        );
                                    })}
                                </div>
                            </div>
                        </td>
    
                        <td className='px-5'>
                            <p className='text-primary dark:text-white'>{status}</p>
                        </td>
    
    
                        <td>
                            <div className='flex items-center space-x-3 text-primary dark:text-white text-lg'>
                                <button type='button' onClick={onEditClick}><BsPencilSquare/></button>
                                <button type='button' onClick={onOpenClick}><BsBoxArrowUpRight/></button>
                                <button type='button' onClick={onDeleteClick}><BsTrash3/></button>
                            </div>
                        </td>
    
                    </tr>
                </tbody>
            </table>
    );
};

export default MovieListItem;