import React, { useEffect, useState } from 'react'
import { getMostRatedMovies } from '../api/admin';
import RatingStar from './RatingStar';

const MostRatedMovies = () => {
    const [movies, setMovies] = useState([]);

    const fetchMostRatedMovies = async () => {
        const {error, movies}= await getMostRatedMovies();
        if(error) return console.log('cant fetch the all category type top rated moives -> ', error);
        setMovies([...movies]);
        console.log({movies})
    };

    useEffect(()=>{
        fetchMostRatedMovies();
    }, []);
    
	return (
        <div className="bg-white dark:bg-secondary shadow p-5 rounded space-y-5">
            <h1 className="font-semibold text-2xl text-primary dark:text-white mb-2">
                Most Rated Movies
            </h1>
            <ul className='space-y-3'>
                {
                    movies.map((m)=>{
                        return (
                            <li key={m.id}>
                                <h1 className='dark:text-white text-secondary font font-semibold'>{m.title}</h1>
                                <div className="flex space-x-3">
                                    <RatingStar rating={m.reviews?.ratingAverage}/>
                                    {m.reviews?.reviewCount ? <p className='text-light-subtle dark:text-dark-subtle'>{m.reviews?.reviewCount} Review</p> : null}
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default MostRatedMovies