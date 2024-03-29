import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getSingleMovie } from '../../api/movie';
import RatingStar from '../RatingStar';
import RelatedMovies from '../RelatedMovies';
import { AuthContext } from '../../context/AuthProvider';
import AddRatingModel from '../model/AddRatingModel'
import CustomButtonLink from '../CustomButtonLink';
import ProfileModel from '../model/ProfileModel';

const convertReviewCount = (count = 0) => {
	if(count <= 999) return count;
	return parseFloat(count / 1000).toFixed(2) + "k";
};

const SingleMovie = () => {
	const [movie, setMovie] = useState({});
	const [ready, setReady] = useState(false);
	const [showRatingModel, setShowRatingModel] = useState(false);
	const [showProfileModel, setShowProfileModel] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState({});

	const {movieId} = useParams(); // movieId from the app.jsx <Route path="/movie/:movieId" element={<SingleMovie/>}></Route>
	const useAuth = useContext(AuthContext);
	const navigate = useNavigate();

	const fetchMovie = async () => {
		const {movie, error} = await getSingleMovie(movieId);
		if(error) return console.log('cant get this movie ->', error);
		setMovie(movie);
		setReady(true);
	};
	
	const { id, trailer, poster, title, storyLine, releaseDate, type, director={}, writers=[], cast=[], tags, genres=[],  language, reviews={} } = movie;

	const handleOnRateMovie = () => {
		if(!useAuth.authInfo.isLoggedIn) return navigate('/auth/signin');
		setShowRatingModel(true);
	};
	
	const handleOnRatingSuccess = (reviews) => {
		// to refresh the UI we are updating the movie state altogether
		setMovie({...movie, reviews:{...reviews}}) ;
	};

	const handleProfileClick = (profile) => {
		setSelectedProfile(profile);
		setShowProfileModel(true);
	};
	
	useEffect(()=>{
		if(movieId) fetchMovie();
	}, [movieId]);

	if(!ready) return (
		<div className='h-screen flex justify-center items-center dark:bg-primary bg-white'>
			<p className='text-light-subtle dark:text-dark-subtle animate-pulse'>
				Please wait...
			</p>
		</div>
	);

	return (
		<div className='dark:bg-primary bg-white min-h-screen pb-10 '>
			 <div className={"max-w-screen-xl mx-auto xl:px-0 px-2"}> {/*container, but mine just hides everything*/}
			 	{/* vide0 */}
			 	<video poster={poster} controls src={trailer}></video>
				{/* things under movie */}
				<div className='flex justify-between'>
				 	<h1 className='xl:text-4xl lg:text-3xl text-2xl text-highlight dark:text-highlight-dark font-semibold p-3'>
						{title}
					</h1>
					<div className='flex flex-col items-end p-3'>
						<RatingStar rating={reviews.ratingAverage}/>
						<CustomButtonLink
							label={convertReviewCount(reviews.reviewCount) + " Reviews"}
							onClick={() => navigate("/movie/reviews/" + id)}
						/>
						<CustomButtonLink
							label="Rate the movie"
							onClick={handleOnRateMovie}
						/>
						{/* <Link className='text-highlight dark:text-highlight-dark hover:underline' to={'/movie/reviews/'+id}>
							{reviews.reviewCount} Reviews
						</Link>

						<button type='button' className='text-highlight dark:text-highlight-dark hover:underline' onClick={handleOnRateMovie}>
							Rate Movie
						</button> */}
					</div>
				</div>
				{/* info about movie */}
				<div className='space-y-3'>
					<p className='text-light-subtle dark:text-dark-subtle'>
						{storyLine}
					</p>

					<div className='flex space-x-2'>
						<p className='text-light-subtle dark:text-dark-subtle font-semibold'>Director:</p>
						<p className='text-highlight dark:text-highlight-dark hover:underline cursor-pointer' onClick={()=>handleProfileClick(director)}>{director.name}</p>
					</div>
					
					<div className='flex'>
						<p className='text-light-subtle dark:text-dark-subtle font-semibold mr-2'>Writers:</p>
						<div className="space-x-2 flex">
							{writers.map((w)=>{
								return (
									<p key={w.id} className='text-highlight dark:text-highlight-dark hover:underline cursor-pointer'>{w.name}</p>
								)
							})}
						</div>							
					</div>

					<div className='flex'>
						<p className='text-light-subtle dark:text-dark-subtle font-semibold mr-2'>Lead Cast:</p>
						<div className="space-x-2 flex">
							{cast.map((c)=>{
								if(!c.leadActor) return null;
								return (
									<p key={c.profile.id} className='text-highlight dark:text-highlight-dark hover:underline cursor-pointer '>{c.profile.name}</p>
								)
							})}
						</div>							
					</div>
					
					<div className='flex space-x-2'>
						<p className='text-light-subtle dark:text-dark-subtle font-semibold'>Language:</p>
						<p className='text-highlight dark:text-highlight-dark'>{language}</p>
					</div>
						
					<div className='flex space-x-2'>
						<p className='text-light-subtle dark:text-dark-subtle font-semibold'>Release Date:</p>
						<p className='text-highlight dark:text-highlight-dark'>{releaseDate.split('T')[0]}</p>
					</div>
					
					<div className='flex'>
						<p className='text-light-subtle dark:text-dark-subtle font-semibold mr-2'>Genres:</p>
						<div className="space-x-2 flex">
							{genres.map((g)=>{
								return (
									<p key={g} className='text-highlight dark:text-highlight-dark'>{g}</p>
								)
							})}
						</div>							
					</div>

					<div className='flex space-x-2'>
						<p className='text-light-subtle dark:text-dark-subtle font-semibold'>Type:</p>
						<p className='text-highlight dark:text-highlight-dark'>{type}</p>
					</div>
					
					<div className="mt-5">
						<h1 className='text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2'>Cast:</h1>
						<div className='flex flex-wrap space-x-4'>
							{cast.map((c)=>{
								return (
									<div key={c.profile.id} className='flex flex-col items-center basis-28 text-center mb-4'>
										<img className='w-24 h-24 aspect-square object-cover rounded-full' src={c.profile.avatar} alt="" />
										<p className='text-highlight dark:text-highlight-dark hover:underline cursor-pointer'>{c.profile.name}</p>
										<span className='text-light-subtle dark:text-dark-subtle text-sm'>as</span>
										<p className='text-light-subtle dark:text-dark-subtle'>{c.roleAs}</p>
									</div>
								);
							})}
						</div>
					</div>

				</div>
				<div className="mt-3">
					<RelatedMovies movieId={movieId}/>
				</div>
			 </div>
			 
			 <ProfileModel visible={showProfileModel} onClose={()=>setShowProfileModel(false)} profileId={selectedProfile.id}/>
			 <AddRatingModel visible={showRatingModel} onClose={()=>setShowRatingModel(false)} onSuccess={handleOnRatingSuccess}/>

		</div>
	);
};

const ListWithLabel = ({label, children}) => {
	return (
		<div className='flex space-x-2'>
			<p className='text-light-subtle dark:text-dark-subtle font-semibold'>{label}</p>
			{children}
		</div>

	);
}

export default SingleMovie;
