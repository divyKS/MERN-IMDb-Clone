import React from 'react';
import GridContainer from '../GridContainer';
import {AiFillStar} from 'react-icons/ai';
import {Link} from 'react-router-dom';
import RatingStar from '../RatingStar';

const trimTitle = (title) => {
    if(title.length <= 20) return title;
    return title.substring(0,20)+'..';
};

const MovieList = ({ title, movies }) => {
    if(!movies.length) return null;
	return (
        <div>
            <h1 className="text-2xl dark:text-white text-secondary font-semibold mb-5">{title}</h1>
            <GridContainer>
                {movies.map(( movie ) => {
                        return (
                            <ListItem key={movie.id} movie={movie}/>
                        );
                })}
            </GridContainer>
        </div>
	);
};

const ListItem = ({movie}) => {
    const {title, poster, reviews } = movie;
    return (
        <Link to={'/movie/'+movie.id}>
            <img
                src={poster}
                alt={title}
                className="aspect-video object-cover"
            />
            <h1
                className="text-lg dark:text-white text-secondary font-semibold"
                title={title}
            >
                {trimTitle(title)}
            </h1>
            <RatingStar rating={reviews.ratingAverage}/>
        </Link>
    );
};

export default MovieList;
