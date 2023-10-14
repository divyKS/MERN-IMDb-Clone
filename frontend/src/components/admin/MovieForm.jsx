import React, { useState } from 'react';
import TagsInput from '../TagsInput';
import LiveSearch from '../LiveSearch';
import { commonInputClasses } from '../../utils/theme';
import { results } from '../../fakeData';
import Submit from '../form/Submit';

// the trailer is being handeled in the MovieUpload component
const defaultMovieInfo = {
    title: '',
    storyLine: '',
    tags: [],
    cast: [],
    director: {},
    writers: [],
    releaseDate: '',
    poster: null,
    genres: [],
    type: '',
    language: '',
    status: '',
}

const MovieForm = () => {
    const [movieInfo, setMovieInfo] = useState({...defaultMovieInfo});

    const { title, storyLine, director } = movieInfo;

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(movieInfo);
    };

    const renderItem = (result) => {
        return (
            <div className="flex rounded overflow-hidden">
            <img src={result.avatar} alt="" className="w-16 h-16 object-cover" />
            <p className="dark:text-white font-semibold">{result.name}</p>
            </div>
        );
    };

    const handleChange = (e) => {
        const target = e.target;
        const {value, name} = target;
        setMovieInfo({...movieInfo, [name]: value});
    };

    const updateTags = (tags) => {
        setMovieInfo({...movieInfo, "tags": tags});
    };

	return (
		// our form is in two parts; LHS RHS, space-x for it and hence flex
		<form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="w-[70%] h-5 space-y-5">
                <div>
                    <Label htmlFor='title'>Title</Label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={title}
                        onChange={handleChange}
                        className={ commonInputClasses + "border-b-2 font-semibold text-xl"}
                        placeholder="Movie Name"
                    />
                </div>

                <div>
                    <Label htmlFor='storyLine'>Story Line</Label>
                    <textarea 
                        id="storyLine" 
                        value={storyLine}
                        onChange={handleChange}
                        name='storyLine'
                        className={commonInputClasses + ' font-semibold text-xl resize-none h-24 border-b-2'} 
                        placeholder='Movie Story Line'
                    />
                </div>

                <div>
                    <Label htmlFor='tags'>Tags</Label>
                    <TagsInput name='tags' onChange={updateTags}/>
                </div>

                <div>
                    <Label htmlFor='director'>Director</Label>
                    <LiveSearch
                        name='director'
                        results={results}
                        placeholder='Search Profile'
                        renderItem={renderItem}
                        onSelect={(result) => console.log(result)}
                    />
                </div>

                <Submit value='Upload Movie'/>
            </div>
			<div className="w-[30%] h-5 bg-blue-400"></div>
		</form>
	);
};

const Label = ({ children, htmlFor }) => {
    return (
        <label htmlFor={htmlFor} className="dark:text-dark-subtle text-light-subtle font-semibold">
            {children}
        </label>
    );
};

export default MovieForm;
