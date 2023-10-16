import React, { useContext, useState } from 'react';
import ModelContainer from './ModelContainer';
import ActorForm from '../form/ActorForm';
import { createActor } from '../../api/actor';
import { NotificationContext } from '../../context/NotificationProvider';

const ActorUpload = ({ visible, onClose }) => {
    const [busy, setBusy] = useState(false);
     
    const useNotification = useContext(NotificationContext);

    const handleSubmit = async (data) => {
        setBusy(true);
        // console.log(data);
        const {error, actor} = await createActor(data);
        setBusy(false);
        // console.log(res);
        if(error) return useNotification.updateNotification('error', error);

        useNotification.updateNotification('success', 'Actor created successfully');
        onClose();
    };

	return (
        <ModelContainer visible={visible} onClose={onClose} ignoreContainer>
            <ActorForm
                title='Create New Actor'
                btnTitle='Create'
                onSubmit={!busy ? handleSubmit : null}
                busy={busy}
            />
        </ModelContainer>
    );
};

export default ActorUpload;
