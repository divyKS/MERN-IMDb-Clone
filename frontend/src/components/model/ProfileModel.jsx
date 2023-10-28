import React, { useEffect, useState } from 'react';
import ModelContainer from './ModelContainer';
import { getActorProfile } from '../../api/actor';

const ProfileModel = ({ visible, profileId, onClose }) => {
    const [profile, setProfile] = useState({});

    const fetchActorProfile = async () => {
        const {error, actor} = await getActorProfile(profileId);
        if(error) return console.log('cant fetch the actor to display it contents -> ', error);
        setProfile(actor);
    };

    useEffect(()=>{
        if(profileId) fetchActorProfile();
    }, [profileId]);

    const { name, avatar, about } = profile;
	return (
        <ModelContainer visible={visible} onClose={onClose} ignoreContainer>
            <div className="p-5 rounded bg-white dark:bg-primary w-72 flex flex-col items-center space-y-3">
                <img className='w-28 h-28 rounded-full ' src={avatar.url} alt="" />
                <h1 className='dark:text-white text-primary font-semibold'>{name}</h1>
                <p className='dark:text-dark-subtle text-light-subtle'>{about}</p>
            </div>
        </ModelContainer>
    );
};

export default ProfileModel;
