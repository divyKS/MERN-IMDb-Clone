import React, { useEffect, useState } from 'react';
import ModelContainer from './ModelContainer';
import genres from '../../utils/genres';
import Submit from '../form/Submit';


const GenresModel = ({ visible, onClose, onSubmit, previousSelection }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);

    const handleGenresSelector = (genre) => {
        let updatedGenres = [];

        if(selectedGenres.includes(genre))
            updatedGenres = selectedGenres.filter(g => g !== genre);
        else 
            updatedGenres = [...selectedGenres, genre];
        
        setSelectedGenres([...updatedGenres]);
    };

    const handleSubmit = () => {
        onSubmit(selectedGenres);
        onClose();
    };

    const handleClose = () => {
        setSelectedGenres(previousSelection);
        onClose();
    };

    useEffect(()=>{
        setSelectedGenres(previousSelection);
    }, []);

	return (
        <ModelContainer visible={visible} onClose={handleClose}>
            <div className="flex flex-col justify-between h-full">
                <div>
                    <h1 className='dark:text-white text-primary text-2xl font-semibold text-center'>
                        Select Genres
                    </h1>
                    <div className="space-y-3">
                        {genres.map((genre, index) => {
                            return (
                                <Genre
                                    onClick={()=>handleGenresSelector(genre)}
                                    selected={selectedGenres.includes(genre)}
                                    key={genre}
                                >
                                    {genre}
                                </Genre>
                            );
                        })}
                    </div>
                </div>
                <div className="w-56 self-end">
                    <Submit value='Select' type='button' onClick={handleSubmit}/>
                </div>
            </div>            
        </ModelContainer>
    );
};

const Genre = ({ children, selected, onClick }) => {
    const getSelectedStyle = () => {
        return selected ? "dark:bg-white dark:text-primary bg-light-subtle text-white" : "text-primary dark:text-white";
    };

    return (
        <button onClick={onClick} className={ getSelectedStyle() + " border-2 dark:border-dark-subtle border-light-subtle p-1 rounded mr-3"}>
            {children}
        </button>
    );
};

export default GenresModel;
