import React from 'react';
import MovieListItem from './MovieListItem';

const LatestUploads = () => {
	return (
        <div className="bg-white dark:bg-secondary shadow p-5 rounded col-span-2">
            <h1 className="font-semibold text-2xl text-primary dark:text-white mb-2">
                Recent Uploads
            </h1>
            <MovieListItem 
                movie={{
                    poster: 'https://i.insider.com/5b58c4037708e9736748be3c?width=1200&format=jpeg',
                    title: 'Mad Max: Fury Road',
                    genres: ['Action', 'Fantasy'],
                    status: 'Public'
                }}
                // onDeleteClick={onDeleteClick}
                // onEditClick={onEditClick}
                // onOpenClick={onOpenClick}
            />
        </div>
    );
};

export default LatestUploads;