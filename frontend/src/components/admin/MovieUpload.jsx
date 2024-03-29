import React, { useContext, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { NotificationContext } from '../../context/NotificationProvider';
import { uploadMovie, uploadTrailer } from '../../api/movie';
import MovieForm from './MovieForm';
import ModelContainer from '../model/ModelContainer';

const MovieUpload = ({ visible, onClose }) => {

	const useNotification = useContext(NotificationContext);
	
	const [videoSelected, setVideoSelected] = useState(false);
	const [videoUploaded, setVideoUploaded] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [videoInfo, setVideoInfo] = useState({});
	const [busy, setBusy] =useState(false);

	const resetState = () => {
		// if trailer is uploaded but there is som error and the upload form closes, on opening the form again we dont get to choose the trailer, since we are rendering it only when the trailer is not selected, we were setting the state of the trailer to true but never false
		setVideoSelected(false);
		setVideoUploaded(false);
		setUploadProgress(0);
		setVideoInfo({});
	};

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

	const handleSubmit = async (movieInfoFormData) => {
		console.log("Movie has reached the handle submit function|MovieUpload.jsx -> ", movieInfoFormData);

		if(!videoInfo.url || !videoInfo.public_id) return useNotification.updateNotification('error', 'Movie trailer is not uploaded properly/missing');

		movieInfoFormData.append('trailer', JSON.stringify(videoInfo));

		setBusy(true);
		const {error, movie} = await uploadMovie(movieInfoFormData);
		setBusy(false);
		if(error) console.log('Response from uploading movie -> ', error);
		console.log('movie has been uploaded successfully -> ', movie);
		resetState();
		if(movie) onClose(); // we don't want to close the form if there is some error, we want to close the form only when it is successfully updated
	};

	return (
		// we dont want to pass onClose here otherwise, when we view the writers the and close from the blurred section the form closes
		// <ModelContainer visible={visible} onClose={onClose}>		
		<ModelContainer visible={visible}>		
			
			<div className='mb-5'>
				<UploadProgress
					visible={!videoUploaded && videoSelected}
					message={getUploadProgressValue()}
					width={uploadProgress}
				/>
			</div>

			{!videoSelected ? (<TrailerSelector 
				visible={!videoSelected} 
				onTypeError={handleTypeError} 
				handleChange={handleChange}
			/>):(

			<MovieForm busy={busy} onSubmit={!busy ? handleSubmit : null}/>)}
		</ModelContainer>
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
