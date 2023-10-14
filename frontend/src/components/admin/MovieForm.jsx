import React, { useContext, useState } from 'react';
import TagsInput from '../TagsInput';
import LiveSearch from '../LiveSearch';
import { commonInputClasses } from '../../utils/theme';
import { results } from '../../fakeData';
import Submit from '../form/Submit';
import { NotificationContext } from '../../context/NotificationProvider';
import ModelContainer from '../model/ModelContainer';

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
    const [showModel, setShowModel] = useState(false);

    const { title, storyLine, director, writers } = movieInfo;

    const useNotification = useContext(NotificationContext);

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log("Form Submitted: ", movieInfo);
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

    const updateDirector = (profile) => {
        setMovieInfo({...movieInfo, "director": profile});
    };

    const updateWriters = (profile) => {
        const alreadyAddedWriters = movieInfo.writers;
        for(let writer of alreadyAddedWriters){
            if(writer.id === profile.id) return useNotification.updateNotification('warning', "This writer's profile is alreay selected!");
        }

        setMovieInfo({...movieInfo, "writers": [...alreadyAddedWriters, profile]});
    };

	return (
        <>
		{/* // our form is in two parts; LHS RHS, space-x for it and hence flex */}
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
                        // director is coming from that file.js atm, it has the id name and avatar
                        value={director.name}
                        results={results}
                        placeholder='Search Profile'
                        renderItem={renderItem}
                        onSelect={updateDirector}
                    />
                </div>


                <div>
                    <div className="flex justify-between">
                        <LabelWithBadge badge={writers.length} htmlFor='writers'>Writers</LabelWithBadge>
                        <button onClick={()=>setShowModel(true)} type='button' className='dark:text-white text-primary hover:underline transition'>View All</button>
                    </div>
                    <LiveSearch
                        name='writers'
                        results={results}
                        placeholder='Search Profile'
                        renderItem={renderItem}
                        onSelect={updateWriters}
                        value={director.name}
                    />
                </div>


                <Submit value='Upload Movie'/>
            </div>
			<div className="w-[30%] h-5 bg-blue-400"></div>
		</form>
        <ModelContainer visible={showModel} onClose={()=>setShowModel(false)}>
            <div className='p-20 bg-red-400'></div>
        </ModelContainer>
        </>
	);
};

const Label = ({ children, htmlFor }) => {
    return (
        <label htmlFor={htmlFor} className="dark:text-dark-subtle text-light-subtle font-semibold">
            {children}
        </label>
    );
};

const LabelWithBadge = ({ children, htmlFor, badge=0 }) => {
    const renderBadge = () => {
        if(!badge) return null;
        return (
            <span className='dark:bg-dark-subtle bg-light-subtle absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-white translate-x-5 -translate-y-1 text-sm'>
                {(badge <= 9)? badge: '9+'}
            </span>
        );
    };

    return (
        <div className="relative">
            <Label htmlFor={htmlFor}>{children}</Label>
            {renderBadge()}
        </div>
    );
};

// className="dark:text-dark-subtle text-light-subtle font-semibold"

export default MovieForm;
