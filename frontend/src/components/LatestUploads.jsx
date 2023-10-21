import React from 'react';
import { BsTrash3, BsPencilSquare, BsBoxArrowUpRight } from 'react-icons/bs'
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


const MovieListItem = ({ movie, onDeleteClick, onEditClick, onOpenClick }) => {
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
                            <button className='' type='button' onClick={onDeleteClick}><BsTrash3/></button>
                            <button className='' type='button' onClick={onEditClick}><BsPencilSquare/></button>
                            <button className='' type='button' onClick={onOpenClick}><BsBoxArrowUpRight/></button>
                        </div>
                    </td>

                </tr>
            </tbody>
        </table>
    );
};

export default LatestUploads;