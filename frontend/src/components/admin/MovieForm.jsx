import React, { useContext, useEffect, useState } from 'react';
import TagsInput from '../TagsInput';
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
import { Label } from '../Label';
import DirectorSelector from '../DirectorSelector';
import WriterSelector from '../WriterSelector';
import ViewAllButton from '../ViewAllButton';
import LabelWithBadge from '../LabelWithBadge';
import { validateMovie } from '../../utils/validator';

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

const MovieForm = ({ onSubmit, busy, initialState, btnTitle }) => {
    const [movieInfo, setMovieInfo] = useState({...defaultMovieInfo});
    const [showWritersModel, setShowWritersModel] = useState(false);
    const [showCastModel, setShowCastModel] = useState(false);
    const [showGenresModel, setShowGenresModel] = useState(false);
    const [selectedPosterForUI, setSelectedPosterForUI] = useState('');

    const { title, storyLine, writers, cast, tags, genres, type, language, status } = movieInfo;

    const useNotification = useContext(NotificationContext);

    const handleSubmit = (e)=>{
        e.preventDefault();
        
        const {error} = validateMovie(movieInfo);
        if(error) return useNotification.updateNotification("error", error);


        console.log("Starting to submit the form with this info: ", movieInfo);


        const finalMovieInfo = {...movieInfo};
        const formData = new FormData();

        finalMovieInfo.tags = JSON.stringify(movieInfo.tags);
        finalMovieInfo.genres = JSON.stringify(movieInfo.genres);

        // cast doesnot take info like this in the backend
        // const finalCast = movieInfo.cast.map((c)=>c.id);
        // finalMovieInfo.cast = JSON.stringify(finalCast);
        const finalCast = cast.map((c) => ({
            actor: c.profile.id,
            roleAs: c.roleAs,
            leadActor: c.leadActor,
          }));
        finalMovieInfo.cast = JSON.stringify(finalCast);

        if(movieInfo.writers.length){
            const finalWriter = movieInfo.writers.map((person)=>person.id);
            finalMovieInfo.writers = JSON.stringify(finalWriter);
        }

        if(movieInfo.director.id) finalMovieInfo.director = movieInfo.director.id;

        if(movieInfo.poster) finalMovieInfo.poster = movieInfo.poster;

        for(let key in finalMovieInfo) formData.append(key, finalMovieInfo[key]);

        onSubmit(formData);

        // LONGER WAY ->
        // trailer, cast, genres, tags, writer are parsed in the backend, so while sending them we will have to stringify them, we dont have trailer here so we wont handle that here
        // const formData = new FormData();
        // formData.append('tags', JSON.stringify(movieInfo.tags));
        // formData.append('genres', JSON.stringify(movieInfo.genres));

        // const finalCast = movieInfo.cast.map((person)=>person.id); // just return the id as cast, writer jsut store the id of the actors
        // formData.append('cast', JSON.stringify(finalCast));

        // if(movieInfo.writers.length){
        //     const finalWriter = movieInfo.writers.map((person)=>person.id);
        //     formData.append('writers', JSON.stringify(finalWriter));
        // }

        // if(movieInfo.director.id){
        //     formData.append('director', movieInfo.director.id);
        // }

        // onSubmit(movieInfo);
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
        // useSearch.resetSearch(); // so that the results of this field dont go to the writers field but now we will do that inside the drector selector method
    };

    const updateWriters = (profile) => {
        const alreadyAddedWriters = movieInfo.writers;
        for(let writer of alreadyAddedWriters){
            if(writer.id === profile.id) return useNotification.updateNotification('warning', "This writer's profile is alreay selected!");
        }

        setMovieInfo({...movieInfo, "writers": [...alreadyAddedWriters, profile]});
        // setWriterName(''); // so that the searched name doesn't stay there after selection of a profile, now this need not be handedled here
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

    // not being used now
    // const handleProfileChange = (e) => {
    //     if(e.target.name === 'director'){
    //         // console.log(e.target.value);
    //         setMovieInfo({...movieInfo, director: {name: e.target.value}});
    //         useSearch.handleSearch(searchActor, e.target.value, setDirectorProfile);

    //     }
    //     if(e.target.name === 'writers'){
    //         setWriterName(e.target.value);
    //         useSearch.handleSearch(searchActor, e.target.value, setWritersProfile);
    //     }
    // };

    useEffect(()=>{
        if(initialState){
            setMovieInfo({...initialState,
                "releaseDate":initialState.releaseDate.split('T')[0],
                "poster": null});
            setSelectedPosterForUI(initialState.poster);
        }
    }, [initialState]);

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

                <DirectorSelector onSelect={updateDirector}/>

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
                    <WriterSelector onSelect={updateWriters}/>
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
                    value={movieInfo.releaseDate}
                />

                <Submit busy={busy} value={btnTitle? btnTitle : 'Upload Movie'} onClick={handleSubmit} type='button'/>

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

export default MovieForm;