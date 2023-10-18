import React, { useContext, useState } from 'react';
import TagsInput from '../TagsInput';
import LiveSearch from '../LiveSearch';
import { commonInputClasses } from '../../utils/theme';
// import { results } from '../../fakeData';
import Submit from '../form/Submit';
import { NotificationContext } from '../../context/NotificationProvider';
import WritersModel from '../model/WritersModel';
import CastForm from '../form/CastForm';
import CastModel from '../model/CastModel';
import PosterSelector from '../PosterSelector';
import GenresSelector from '../GenresSelector';
import GenresModel from '../model/GenresModel';
import Selector from '../Selector';
import { languageOptions, statusOptions, typeOptions } from '../../utils/options';
import { SearchContext } from '../../context/SearchProvider';
import { searchActor } from '../../api/actor';

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
    const [showWritersModel, setShowWritersModel] = useState(false);
    const [showCastModel, setShowCastModel] = useState(false);
    const [showGenresModel, setShowGenresModel] = useState(false);
    const [selectedPosterForUI, setSelectedPosterForUI] = useState('');
    const [writerName, setWriterName] = useState('');
    const [writersProfile, setWritersProfile] = useState([]);
    const [directorProfile, setDirectorProfile] = useState([]);


    const { title, storyLine, director, writers, cast, tags, genres, type, language, status } = movieInfo;

    const useNotification = useContext(NotificationContext);
    const useSearch = useContext(SearchContext);

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log("Form Submitted: ", movieInfo);
    };

    const renderItem = (result) => {
        return (
            <div className="flex rounded overflow-hidden">
                <img src={result.avatar.url} alt="" className="w-16 h-16 object-cover" />
                <p className="dark:text-white font-semibold">{result.name}</p>
            </div>
        );
    };

    const updatePosterForUI = (inputFile) => {
        const url = URL.createObjectURL(inputFile);
        setSelectedPosterForUI(url);
    };

    const handleChange = (e) => {
        const {value, name, files} = e.target;
        if(name === 'poster'){
            const posterInput = files[0]; // this can't be used as it is for the image`
            updatePosterForUI(posterInput);
            return setMovieInfo({...movieInfo, "poster": posterInput});
        }
        // if(name === 'writer') return setWriterName(value); now this can't be done here, it will be done in handle profile channge
        setMovieInfo({...movieInfo, [name]: value});
    };

    const updateTags = (tags) => {
        setMovieInfo({...movieInfo, "tags": tags});
    };

    const updateDirector = (profile) => {
        setMovieInfo({...movieInfo, "director": profile});
        useSearch.resetSearch(); // so that the results of this field dont go to the writers field
    };

    const updateWriters = (profile) => {
        const alreadyAddedWriters = movieInfo.writers;
        for(let writer of alreadyAddedWriters){
            if(writer.id === profile.id) return useNotification.updateNotification('warning', "This writer's profile is alreay selected!");
        }

        setMovieInfo({...movieInfo, "writers": [...alreadyAddedWriters, profile]});
        setWriterName(''); // so that the searched name doesn't stay there after selection of a profile
    };


    const handleWriterRemove = (profileId) => {
        const { writers } = movieInfo;
        const newWriters = writers.filter(({id})=>id!==profileId);
        if(!newWriters.length) setShowWritersModel(false); //to hide if there are no entries left
        setMovieInfo({...movieInfo, writers: [...newWriters]});
    };

    const updateCast = (updatedCast) => {
        const presentCast = movieInfo.cast;
        setMovieInfo({...movieInfo, "cast": [...presentCast, updatedCast]});
    };

    const handleCastRemove = (profileId) => {
        const presentCast = movieInfo.cast;
        const newCast = presentCast.filter(({profile})=>profile.id!==profileId);
        if(!newCast.length) setShowCastModel(false);
        setMovieInfo({...movieInfo, "cast": [...newCast]});
    };

    const updateGenre = (selectedGenres) => {
        setMovieInfo({...movieInfo, "genres": selectedGenres});
    };

    const handleProfileChange = (e) => {
        if(e.target.name === 'director'){
            // console.log(e.target.value);
            setMovieInfo({...movieInfo, director: {name: e.target.value}});
            useSearch.handleSearch(searchActor, e.target.value, setDirectorProfile);

        }
        if(e.target.name === 'writers'){
            setWriterName(e.target.value);
            useSearch.handleSearch(searchActor, e.target.value, setWritersProfile);
        }
    };

	return (
        <>
		{/* // our form is in two parts; LHS RHS, space-x for it and hence flex */}
		<div className="flex space-x-3">
            <div className="w-[70%] space-y-5">
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
                    <TagsInput value={tags} name='tags' onChange={updateTags}/>
                </div>

                <div>
                    <Label htmlFor='director'>Director</Label>
                    <LiveSearch
                        name='director'
                        // results={useSearch.results}
                        results={directorProfile}
                        placeholder='Search Profile'
                        renderItem={renderItem}
                        onSelect={updateDirector}
                        value={director.name}
                        onChange={handleProfileChange}
                        // visible={useSearch.results.length}
                        visible={directorProfile.length}
                        // director is coming from that file.js atm, it has the id name and avatar
                    />
                </div>

                <div>
                    {/* problem of it showing the same results as typed in the director, and for that we fix our search provider and add reset serach */}
                    <div className="flex justify-between">
                        <LabelWithBadge 
                            badge={writers.length}
                            htmlFor='writers'
                        >
                            Writers
                        </LabelWithBadge>
                        <ViewAllButton 
                            visible={writers.length}
                            onClick={()=>setShowWritersModel(true)}
                        >View All</ViewAllButton>
                    </div>
                    <LiveSearch
                        name='writers'
                        // results={useSearch.results}
                        results={writersProfile}
                        placeholder='Search Profile'
                        renderItem={renderItem}
                        onSelect={updateWriters}
                        // onChange={handleChange}
                        onChange={handleProfileChange}
                        value={writerName}
                        // visible={useSearch.results.length}
                        visible={writersProfile.length}
                    />
                </div>

                <div>
                    <div className="flex justify-between">
                        <LabelWithBadge 
                            badge={cast.length}
                        >
                            Add Cast & Crew
                        </LabelWithBadge>
                        <ViewAllButton 
                            visible={cast.length}
                            onClick={()=>setShowCastModel(true)}
                        >
                            View All
                        </ViewAllButton>
                    </div>
                    {/* <LabelWithBadge>Add Cast & Crew</LabelWithBadge> */}
                    <CastForm onSubmit={updateCast}></CastForm>
                </div>
                
                <input 
                    type="date"
                    className={commonInputClasses + ' border-2 rounded p-1 w-auto'}
                    onChange={handleChange}
                    name='releaseDate'
                />
                <Submit value='Upload Movie' onClick={handleSubmit} type='button'/>
            </div>

			<div className="w-[30%] space-y-5">
                <PosterSelector 
                    name='poster'
                    onChange={handleChange}
                    selectedPoster={selectedPosterForUI}
                    accept='image/jpg, image/jpeg, image/png'
                    label='Select poster'
                />
                <GenresSelector
                    onClick={()=>setShowGenresModel(true)}
                    badge={genres.length}                    
                />
                <Selector onChange={handleChange} name='type' value={type} label='Type' options={typeOptions}/>
                <Selector onChange={handleChange} name='language' value={language} label='Language' options={languageOptions}/>
                <Selector onChange={handleChange} name='status' value={status} label='Status' options={statusOptions}/>
            </div>

		</div>

        <WritersModel 
            visible={showWritersModel}
            profiles={writers}
            onClose={()=>setShowWritersModel(false)}
            onRemoveClick={handleWriterRemove}
        />

        <CastModel 
            visible={showCastModel}
            cast={cast}
            onClose={()=>setShowCastModel(false)}
            onRemoveClick={handleCastRemove}
        />

        <GenresModel 
            visible={showGenresModel}
            onClose={()=>setShowGenresModel(false)}
            // onRemoveClick={handleGenresRemove}
            onSubmit={updateGenre}
            previousSelection={genres}
        />

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

const ViewAllButton = ({ visible, children, onClick }) => {
    if(!visible) return null;
    return (
        <button 
            onClick={onClick}
            type='button'
            className='dark:text-white text-primary hover:underline transition'
        >
            {children}
        </button>
    );
};

export default MovieForm;
