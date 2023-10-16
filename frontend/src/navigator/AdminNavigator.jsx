import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../components/NotFound';
import Dashboard from '../components/admin/Dashboard';
import Movies from '../components/admin/Movies';
import Actors from '../components/admin/Actors';
import Navbar from '../components/admin/NavBar';
import Header from '../components/admin/Header';
import MovieUpload from '../components/admin/MovieUpload';
import ActorUpload from '../components/model/ActorUpload';

const AdminNavigator = () => {
	const [showMovieUploadModel, setShowMovieUploadModel] = useState(false);
	const [showActorUploadModel, setShowActorUploadModel] = useState(false);
	return (
		<>
			<div className="flex dark:bg-primary bg-white">
				<Navbar />
				<div className="flex-1 p-2 max-w-screen-xl">
					<Header
						onAddMovieClick={() =>
							setShowMovieUploadModel(true)
						}
						onAddActorClick={() =>
							setShowActorUploadModel(true)
						}
					/>
					<Routes>
						<Route path="/" element={<Dashboard />}></Route>
						<Route path="/movies" element={<Movies />}></Route>
						<Route path="/actors" element={<Actors />}></Route>
						<Route path="*" element={<NotFound />}></Route>
					</Routes>
				</div>
			</div>
			<MovieUpload 
				visible={showMovieUploadModel}
				onClose={()=>setShowMovieUploadModel(false)}
			/>
			<ActorUpload 
				visible={showActorUploadModel}
				onClose={()=>setShowActorUploadModel(false)}
			/>
		</>
	);
};

export default AdminNavigator;
