import React, { useContext, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { NotificationContext } from '../../context/NotificationProvider';
import { uploadTrailer } from '../../api/movie';
import MovieForm from './MovieForm';

const MovieUpload = () => {

	const useNotification = useContext(NotificationContext);
	
	const [videoSelected, setVideoSelected] = useState(false);
	const [videoUploaded, setVideoUploaded] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [videoInfo, setVideoInfo] = useState({})
	const [movieInfo, setMovieInfo] = useState({
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
		trailer: {
			url: '',
			public_id: '',
		},
	});
	
	const handleUploadTrailer = async (data) => {
		const { error, url, public_id } = await uploadTrailer(data, setUploadProgress);
		if(error) useNotification.updateNotification('error', error);
		setVideoUploaded(true); // uploaded to our backend
		setVideoInfo({url, public_id});
	};

	const handleChange = ( file ) => {
		setVideoSelected(true);
		const formData = new FormData();
		formData.append('video', file); // video is the key with which we are accepting the video insdie the multer, uploadVideo.single('video')
		handleUploadTrailer(formData); // not awaiting this, since we want it to just run in the background
	};
	
	const handleTypeError = (error) => {
		useNotification.updateNotification('error', error);
	};

	const getUploadProgressValue = () => {
		if(!videoUploaded && uploadProgress >= 100){
			// means we have uploaded the video to our backend and now it's being uploaded to cloudinary
			return 'Processing...'
		}
	};

	return (
		<div className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
			<div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto p-2 custom-scroll-bar">
				
				{/* <UploadProgress
					visible={!videoUploaded && videoSelected}
					message={getUploadProgressValue()}
					width={uploadProgress}
				/>

				<TrailerSelector 
					visible={!videoSelected} 
					onTypeError={handleTypeError} 
					handleChange={handleChange}
				/> */}

				<MovieForm/>
			</div>
		</div>
	)
};

const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
	
	if(!visible) return null;

	return (
		<div className="flex items-center justify-center h-full">
			<FileUploader
				types={['mp4', 'avi', 'mkv']}
				handleChange={handleChange}
				onTypeError={onTypeError}
			>
				<div className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex flex-col items-center justify-center dark:text-dark-subtle text-secondary cursor-pointer">
					<AiOutlineCloudUpload size={80} />
					<p>Drop your file here</p>
				</div>
			</FileUploader>
		</div>		
	);
};

const UploadProgress = ({ message, width, visible })=>{
	if(!visible) return null;

	return (
		<div className='dark:bg-secondary bg-white drop-shadow-lg rounded p-3'>
			{/* Progress bar below */}
			<div className='relative overflow-hidden h-3 dark:bg-dark-subtle bg-light-subtle'>
				<div style={{width: width + '%'}} className='h-full absolute dark:bg-white bg-secondary left-0'/>
			</div>
			<p className='animate-pulse font-semibold dark:text-dark-subtle text-light-subtle mt-1'>
				{message}
			</p>
		</div>
	)
};

export default MovieUpload;
