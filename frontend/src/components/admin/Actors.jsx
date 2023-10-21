import React, { useEffect, useState } from 'react';
import { BsPencilSquare, BsTrash3 } from 'react-icons/bs';
import { getActors } from '../../api/actor';

let currentPageNo = 0;
const limit = 4;

const Actors = () => {

	const [actors, setActors] = useState([]);
	const [reachedEnd, setReachedEnd] = useState(false);

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

	useEffect(()=>{
		fetchActors(currentPageNo);
	}, []);

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

	return (
		<div className="p-5">
			<div className="grid grid-cols-4 gap-5">
				{actors.map((actor)=>{
					return <ActorProfile profile={actor} key={actor.id}/>
				})}
			</div>
			<div className="flex justify-end items-center space-x-5 mt-5">
				<button
					type='button'
					className='text-primary dark:text-white hover:underline'
					onClick={handleOnPrevClick}
				>
					Prev
				</button>
				<button
					type='button'
					className='text-primary dark:text-white hover:underline'
					onClick={handleOnNextClick}
				>
					Next
				</button>
			</div>
		</div>

  	);
};

const ActorProfile = ({ profile }) => {
	
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
				<Options visible={showOptions} />
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
