import React, { useContext, useState } from 'react';
import ModelContainer from './ModelContainer';
import ActorForm from '../form/ActorForm';
import { NotificationContext } from '../../context/NotificationProvider';
import { updateActor } from '../../api/actor';

const UpdateActor = ({ visible, onClose, initialState, onSuccess }) => {
    const [busy, setBusy] = useState(false);
     
    const useNotification = useContext(NotificationContext);

    const handleSubmit = async (data) => {
        setBusy(true);
        const {error, actor} = await updateActor(initialState.id, data);
        setBusy(false);
        if(error) return useNotification.updateNotification('error', error);
        useNotification.updateNotification('success', 'Actor updated successfully!');
        onSuccess(actor); // we are sending the updated actor back, so that we can used it the update the state insde the parent function so that we can trigger a re-render automatically
        onClose();
    };

	return (
        <ModelContainer visible={visible} onClose={onClose} ignoreContainer>
            <ActorForm
                title='Update Actor'
                btnTitle='Update'
                onSubmit={!busy ? handleSubmit : null}
                busy={busy}
                initialState={initialState}
            />
        </ModelContainer>
    );
};

export default UpdateActor;
