import React, { useContext, useEffect, useState } from 'react';
import { BsPencilSquare, BsTrash3 } from 'react-icons/bs';
import { deleteActor, getActors, searchActor } from '../../api/actor';
import UpdateActor from '../model/UpdateActor';
import AppSearchForm from '../AppSearchForm';
import { SearchContext } from '../../context/SearchProvider';
import NotFoundText from '../NotFoundText';
import ConfirmModel from '../model/ConfirmModel';

let currentPageNo = 0;
const limit = 4;

const Actors = () => {

	const [actors, setActors] = useState([]);
	const [reachedEnd, setReachedEnd] = useState(false);
	const [showUpdateModel, setShowUpdateModel] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [results, setResults] = useState([]);
	const [showConfirmModel, setShowConfirmModel] = useState(false);
	const [busy, setBusy] = useState(false);

	const useSearch = useContext(SearchContext);

	const fetchActors = async (pageNo) => {
		const {profiles, error} = await getActors(pageNo, limit);
		// setActors(res) was wrong
		if(error) return console.log(error);
		if(!profiles.length){
			currentPageNo = pageNo - 1;
			return setReachedEnd(true)
		}; 
		setActors([...profiles]);
	};
	
	const handleOnNextClick = () => {
		if(reachedEnd) return ;
		currentPageNo += 1;
		fetchActors(currentPageNo);
	};

	const handleOnPrevClick = () => {
		if(currentPageNo <= 0) return ;
        if(reachedEnd === 'true') setReachedEnd(false);
		currentPageNo -= 1;
		fetchActors(currentPageNo);
	};

	const handleOnEditClick = (profile) => {
		console.log({profile});
		setShowUpdateModel(true);
		setSelectedProfile(profile);
	};
	
	const handleOnActorUpdate = (profile) => { 
		// this be the list of the actors with the updated actor updated, for this page
		const updatedActors = actors.map((actor)=>{
			if(profile.id === actor.id){
				return profile;
			}
			return actor;
		});

		setActors([...updatedActors]);
	};

	const handleOnSearchSubmit = (value) => {
		console.log({value});
		useSearch.handleSearch(searchActor, value, setResults);

	};
	
	const handleSearchFormReset = () => {
		useSearch.resetSearch();
		setResults([]);
		
	};

	const handleOnDeleteClick = (profile) => {
		setShowConfirmModel(true);
		setSelectedProfile(profile);//so that we can use it in inside handleOnDeleteConfirm
		console.log({profile})	
	};

	const handleOnDeleteConfirm = async () => {
		setBusy(true);
		const {error, message} = await deleteActor(selectedProfile.id);
		setBusy(false);
		if(error) return console.log('Your actor was not deleted: ', error);
		console.log('Your actor has been deleted successfully: ', message);
		setShowConfirmModel(false);
		fetchActors(currentPageNo);// because there will a empty space, its best to re render all 
	};

	useEffect(()=>{
		fetchActors(currentPageNo);
	}, []);

	return (
		<>
			<div className="p-5">
				<div className="flex justify-end mb-5">
					<AppSearchForm
						placeholder="Search Actor..."
						onSubmit={handleOnSearchSubmit}
						showResetIcon={results.length || useSearch.resultNotFound}
						onReset={handleSearchFormReset}
					/>
				</div>
				{/* we have this state in useSeach will stores if we found something in our db or not */}
				
				<NotFoundText text="Actor with given name doesn't exist in our database." visible={useSearch.resultNotFound}/>:
				<div className="grid grid-cols-4 gap-5">
					{results.length || useSearch.resultNotFound
						? results.map((result) => {
								return (
									<ActorProfile profile={result} key={result.id} onEditClick={() => handleOnEditClick(result)} onDeleteClick={() => handleOnDeleteClick(result)}/>
								);
						  })
						: actors.map((actor) => {
								return (
									<ActorProfile profile={actor} key={actor.id} onEditClick={() => handleOnEditClick(actor)} onDeleteClick={() => handleOnDeleteClick(actor)}/>
								);
						  })}
				</div>

				{!results.length && !useSearch.resultNotFound? <div className="flex justify-end items-center space-x-5 mt-5">
					<button
						type="button"
						className="text-primary dark:text-white hover:underline"
						onClick={handleOnPrevClick}
					>
						Prev
					</button>
					<button
						type="button"
						className="text-primary dark:text-white hover:underline"
						onClick={handleOnNextClick}
					>
						Next
					</button>
				</div>:null}
			</div>
			
			<ConfirmModel
				visible={showConfirmModel}
				onClose={()=>!busy && setShowConfirmModel(false)}
				busy={busy}
				onConfirm={handleOnDeleteConfirm}
				onCancel={()=>setShowConfirmModel(false)}
				title='Are you sure?'
				subtitle='Please wait, the deletion is under progress.'
			/>

			<UpdateActor
				visible={showUpdateModel}
				onClose={() => setShowUpdateModel(false)}
				initialState={selectedProfile}
				onSuccess={handleOnActorUpdate}
			/>
		</>
	);
};

const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
	
	const [showOptions, setShowOptions] = useState(false);

	const { name, about = '', avatar } = profile;

	if (!profile) return null;

	const formattedName = (name) => {
		if(name.length <= 15) return name;
		return name.substring(0,15) + '..';
	}

	return (
		<div className="bg-white shadow dark:shadow dark:bg-secondary rounded h-20 overflow-hidden col-span-2">
			<div
				onMouseEnter={()=>setShowOptions(true)}
				onMouseLeave={()=>setShowOptions(false)}
				className="flex cursor-pointer relative"
			>
				<img
					src={avatar.url}
					alt={name}
					className="w-20 aspect-square object-cover"
				/>

				<div className="px-2">
					<h1 className="text-xl text-primary dark:text-white font-semibold whitespace-nowrap">
						{formattedName(name)}
					</h1>
					<p className="text-primary dark:text-white white opacity-60">
						{about.substring(0, 50)}
					</p>
				</div>
				<Options visible={showOptions} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
			</div>
		</div>
	);
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
	if (!visible) return null;

	return (
		<div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5">
			<button
				onClick={onEditClick}
				className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
				type="button"
			>
				<BsPencilSquare />
			</button>
			<button
				onClick={onDeleteClick}
				className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
				type="button"
			>
				<BsTrash3 />
			</button>
		</div>
	);
};


export default Actors;
