import React from 'react';
import TagsInput from '../TagsInput';
import LiveSearch from '../LiveSearch';
import { commonInputClasses } from '../../utils/theme';
import { results } from '../../fakeData';


const MovieForm = () => {
    
    const handleSubmit = (e)=>{
        e.preventDefault();
    };

    const renderItem = (result) => {
        return (
            <div className="flex rounded overflow-hidden">
            <img src={result.avatar} alt="" className="w-16 h-16 object-cover" />
            <p className="dark:text-white font-semibold">{result.name}</p>
            </div>
        );
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
                        className={ commonInputClasses + "border-b-2 font-semibold text-xl"}
                        placeholder="Movie Name"
                    />
                </div>

                <div>
                    <Label htmlFor='storyLine'>Story Line</Label>
                    <textarea 
                        id="storyLine" 
                        className={commonInputClasses + ' font-semibold text-xl resize-none h-24 border-b-2'} 
                        placeholder='Movie Story Line'
                    />
                </div>

                <div>
                    <Label htmlFor='tags'>Tags</Label>
                    <TagsInput name='tags'/>
                </div>

                <LiveSearch
                    results={results}
                    placeholder='Search Profile'
                    renderItem={renderItem}
                    onSelect={(result) => console.log(result)}
                />

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
