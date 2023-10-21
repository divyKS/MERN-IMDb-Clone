import React, { useContext, useEffect, useState } from 'react';
import { commonInputClasses } from '../../utils/theme';
import PosterSelector from '../PosterSelector';
import Selector from '../Selector';
import { NotificationContext } from '../../context/NotificationProvider';
import {LiaSpinnerSolid} from 'react-icons/lia';

const defaultActorInfo = {
    name: '',
    about: '',
    gender: '',
    avatar: null
};

const genderOptions = [
    { title: 'Male', value: 'male' },
    { title: 'Female', value: 'female' },
    { title: 'Others', value: 'others' }
]

const validateActor = ({ avatar, name, gender, about }) => {
    if(!name.trim()) return {"error": "Actor name is missing!"};
    if(!about.trim()) return {"error": "Actor about section is missing!"};
    if(!gender.trim()) return {"error": "Actor gender is missing!"};
    if(avatar && !avatar.type?.startsWith('image')) return {"error": "Invalid image/avatar file!"};
    return {"error": null};
};


const ActorForm = ({ title, btnTitle, busy, onSubmit, initialState }) => {
    const [actorInfo, setActorInfo] = useState({...defaultActorInfo});
    const [selectedAvatarForUI, setSelectedAvatarForUI] = useState('');

    const useNotification = useContext(NotificationContext);

    const updatePosterForUI = (inputFile) => {
        const url = URL.createObjectURL(inputFile);
        setSelectedAvatarForUI(url);
    };

    const handleChange = (e) => {
        const { value, files, name } = e.target;
        if(name === 'avatar'){
            const file = files[0];
            updatePosterForUI(file);
            return setActorInfo({...actorInfo, "avatar": file});
        }
        setActorInfo({...actorInfo, [name]: value});
    };    

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(actorInfo);
        const {error} = validateActor(actorInfo);
        if(error) return useNotification.updateNotification('error', error);

        const formData = new FormData();
        // formData.append('name', actorInfo.name);
        // formData.append('gender', actorInfo.gender);
        // formData.append('about', actorInfo.about);
        // if(actorInfo.avatar) formData.append('avatar', actorInfo.avatar);

        for(let key in actorInfo){ // in will be used, not of, 
            if(key) formData.append(key, actorInfo[key]);
        }
        onSubmit(formData);

    };

    useEffect(()=>{
        if(initialState){
            setActorInfo({...initialState, avatar: null});// the avatar is a file not a url, and to display that we are using selectedAvatarForUI
            setSelectedAvatarForUI(initialState.avatar.url);
        }
    }, [initialState]);

	return (
        <form onSubmit={handleSubmit} className="dark:bg-primary bg-white p-3 w-[35rem] rounded">
            <div className="flex justify-between items-center mb-3">
                <h1 className='font-semibold text-primary text-xl dark:text-white'>
                    {title}
                </h1>
                <button type='submit' className='h-8 w-24 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded flex items-center justify-center'>
                    {busy? <LiaSpinnerSolid className="animate-spin" />: btnTitle}
                </button>
            </div>
            {/* <img 
                    src="https://images.unsplash.com/photo-1676491167770-bce474fe0024?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
                    alt=""
                    className='w-36 h-36 aspect-square object-cover rounded'
                /> */}
            <div className='flex space-x-2 '>
                <PosterSelector 
                    selectedPoster={selectedAvatarForUI}
                    className=' w-36 h-36 aspect-square object-cover rounded'
                    name='avatar'
                    onChange={handleChange}
                    label='Select avatar'
                    accept='image/jpg, image/jpeg, image/png'
                />
                <div className="flex-grow flex flex-col space-y-2">
                    <input
                        placeholder='Enter name'
                        type="text"
                        className={commonInputClasses + ' border-b-2'}
                        name='name'
                        value={actorInfo.name}
                        onChange={handleChange}
                    />
                    <textarea
                        placeholder='Enter about'
                        className={commonInputClasses + ' h-full border-b-2 resize-none'}
                        name='about'
                        value={actorInfo.about}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="mt-3">
                <Selector
                    options={genderOptions}
                    label='Gender'
                    name='gender'
                    value={actorInfo.gender}
                    onChange={handleChange}
                />
            </div>
        </form>
    );
};

export default ActorForm;
