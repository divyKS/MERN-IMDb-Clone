import React, { useContext, useState } from 'react';
import ModelContainer from './ModelContainer';
import RatingForm from '../form/RatingForm';
import { updateReview } from '../../api/review';
import { NotificationContext } from '../../context/NotificationProvider';

const EditRatingModel = ({ visible, onClose, onSuccess, initialState }) => {
    const useNotification = useContext(NotificationContext);
    const [busy, setBusy] = useState(false);

    const handleSubmit = async (data) => {
        setBusy(true);
        const {error, message} = await updateReview(initialState.id, data);
        setBusy(false);
        if(error) return useNotification.updateNotification('error', error);
        onSuccess({...data});
        useNotification.updateNotification('success', message);
        onClose();
    };

	return (
       <ModelContainer visible={visible} onClose={onClose} ignoreContainer>
            <RatingForm busy={busy} onSubmit={handleSubmit} initialState={initialState}/>
       </ModelContainer>
    );
};

export default EditRatingModel;
