import React, { useContext, useEffect, useState } from 'react';
import CustomButtonLink from '../CustomButtonLink';
import RatingStar from '../RatingStar';
import { useParams, useSearchParams } from 'react-router-dom';
import { deleteReview, getReviewForMovie } from '../../api/review';
import { AuthContext } from '../../context/AuthProvider';
import { NotificationContext } from '../../context/NotificationProvider';
import { BsTrash, BsPencilSquare } from 'react-icons/bs';
import ConfirmModel from '../model/ConfirmModel';
import NotFoundText from '../NotFoundText';
import EditRatingModel from '../model/EditRatingModel';

const MovieReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [movieTitle, setMovieTitle] = useState('');
    const [profileOwnerReview, setProfileOwnerReview] = useState(null);
    const [showConfirmModel, setShowConfirmModel] = useState(false);
    const [showEditModel, setShowEditModel] = useState(false);
    const [selectedReview, setSelectedReview] = useState([]);
    const [busy, setBusy] = useState(false);
    const {movieId} = useParams();

    const useAuth = useContext(AuthContext);
    const useNotification = useContext(NotificationContext);

    const fetchReviews = async () => {
        const {error, movie} = await getReviewForMovie(movieId);
        if(error) return console.log('cant get reviews for this movie -> ', error);
        setReviews([...movie.reviews]);
        setMovieTitle(movie.title);
    };
    
    const findProfileOwnerReview = () => {
        if(profileOwnerReview) return setProfileOwnerReview(null);
        const ownerId = useAuth.authInfo.profile?.id;
        const matched = reviews.find(review => review.owner.id === ownerId);
        if(!matched) return useNotification.updateNotification('error', "You have not reviewed this movie yet! ")
        setProfileOwnerReview(matched);
    };

    const handleDeleteConfirm = async () => {
        setBusy(true);
        const {error, message} = await deleteReview(profileOwnerReview.id);
        setBusy(false);
        if(error) return useNotification.updateNotification('error', error);
        useNotification.updateNotification('success', message);
        // for updating the UI
        const updatedReviews = reviews.filter(r=>r.id!==profileOwnerReview.id);
        setReviews([...updatedReviews]);
        setProfileOwnerReview(null);
        setShowConfirmModel(false);
    };

    const handleOnEditClick = () => {
        const {id, content, rating} = profileOwnerReview;
        setSelectedReview({
            id,
            content,
            rating
        });
        setShowEditModel(true);
    };

    const handleOnReviewUpdate = (review) => {
        const updatedReview = {
            ...profileOwnerReview,
            rating: review.rating,
            content: review.content
        };
        setProfileOwnerReview({...updatedReview});// to change the UI in the my review section
        const newReviews = reviews.map((r)=>{
            if(r.id===updatedReview.id) return updatedReview;
            return r;
        });
        setReviews([...newReviews]); //to change UI where all the reviews are rendered
    };

    const hideEditModel = () => {
        setShowEditModel(false);
        setSelectedReview(null);
    }

    useEffect(()=>{
        if(movieId) fetchReviews();
    }, [movieId]);

	return (
        <div className='dark:bg-primary bg-white min-h-screen pb-10 '>
            <div className={"max-w-screen-xl mx-auto xl:px-0 px-2 py-8"}>
                <div className="flex justify-between items-center">
                    <h1 className='text-2xl font-semibold dark:text-white text-secondary'>
                        <span className='text-light-subtle dark:text-dark-subtle font-normal'>
                            Reviews for:&nbsp; 
                        </span>
                        {movieTitle}
                    </h1>
                    {   useAuth.authInfo.isLoggedIn?
                        <CustomButtonLink label={profileOwnerReview ? 'View All' : 'Find my review' } onClick={findProfileOwnerReview}/> 
                        :
                        null
                    }
                </div>

                < NotFoundText text='This movie has not been rated yet' visible={!reviews.length}/>
                <div className="space-y-3 mt-3">
                    {   profileOwnerReview ? 
                        <div>
                            <ReviewCard review={profileOwnerReview}/>
                            <div className='flex space-x-3 dark:text-white text-primary text-xl p-3'>
                                <button type='button' onClick={handleOnEditClick}><BsPencilSquare/></button>
                                <button type='button' onClick={()=>setShowConfirmModel(true)} ><BsTrash/></button>
                            </div>
                        </div>
                        :
                        reviews.map((r)=>(<ReviewCard review={r} key={r.id}/>))
                    }  
                </div>
            </div>
            <ConfirmModel
                visible={showConfirmModel}
                title='Are you sure?'
                subtitle='Your review will be permanently deleted.'
                onCancel={()=>setShowConfirmModel(false)}
                onConfirm={handleDeleteConfirm}
                busy={busy}
            />
            <EditRatingModel visible={showEditModel} initialState={selectedReview} onSuccess={handleOnReviewUpdate} onClose={hideEditModel}/>
        </div>
    );
};

const ReviewCard = ({review}) => {
    if(!review) return null;
    const {owner, rating, content} = review;
    return (
        <div className='flex space-x-3'>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-xl select-none">
                {owner.name[0].toUpperCase()}
            </div>
            <div>
                <h1 className='dark:text-white text-secondary font-semibold text-lg'>
                    {owner.name}
                </h1>
                <RatingStar rating={rating}/>
                <p className='text-light-subtle dark:text-dark-subtle'>
                    {content}
                </p>
            </div>
        </div>
    )
};

export default MovieReviews;
