import React from 'react';
import ModelContainer from './ModelContainer';
import RatingForm from '../form/RatingForm';
import { addReview } from '../../api/review';
import { useParams } from 'react-router-dom';

const AddRatingModel = ({ visible, onClose, onSuccess }) => {
    const {movieId} = useParams();
    const handleSubmit = async (data) => {
        const { error, message, reviews } = await addReview(movieId, data);
        if(error) return console.log('cant submit review -> ', error);
        console.log('added review successfully -> ', message);
        onSuccess(reviews);
        onClose();
    };

	return (
       <ModelContainer visible={visible} onClose={onClose} ignoreContainer>
            <RatingForm onSubmit={handleSubmit}/>
       </ModelContainer>
    );
};

export default AddRatingModel;
