import React, { useContext, useState } from 'react';
import LiveSearch from '../LiveSearch';
import { commonInputClasses } from '../../utils/theme';
// import { results } from '../../fakeData'; this was causing that automatic unwanted pop up
import { NotificationContext } from '../../context/NotificationProvider';
import { renderItem } from '../../utils/helper';
import { SearchContext } from '../../context/SearchProvider';
import { searchActor } from '../../api/actor';

// cast = [{ actor: id, roleAs: "", leadActor: true }]
const defaultCastInfo = {
    profile: {},
    roleAs: '',
    leadActor: false
}
const CastForm = ({ onSubmit }) => {
    const [castInfo, setCastInfo] = useState({...defaultCastInfo});
    const [profiles, setProfiles] = useState([]);

    const { profile, roleAs, leadActor } = castInfo;

    const useNotification = useContext(NotificationContext);
    const useSearch = useContext(SearchContext);

    const handleProfileSelect = (profile) => {
        setCastInfo({...castInfo, profile});        
    };

    const handleOnChange = (e) => {
        const target = e.target;
        const { checked, name, value } = target;
        if(name === 'leadActor') return setCastInfo({...castInfo, leadActor: checked});
        setCastInfo({...castInfo, [name]: value});
    };

    const handleSubmit = (e) => {
        const { profile, roleAs } = castInfo;
        if(!profile.name) return useNotification.updateNotification('error', 'Cast profile missing');
        if(!roleAs.trim()) return useNotification.updateNotification('error', 'Cast role missing');
        onSubmit(castInfo);
        setCastInfo({...defaultCastInfo, profile: {name: ''}}); // profile: {name: ''}} so that after adding the search field become empty
        // console.log(castInfo);
        useSearch.resetSearch();
        setProfiles([]);
    };

    const handleProfileChange = (e) => {
        const value = e.target.value;
        const {profile} = castInfo;
        profile.name = value;
        setCastInfo({...castInfo, ...profile});
        useSearch.handleSearch(searchActor, value, setProfiles);
    };

	return (
        <div className='flex items-center space-x-2'>

            <input 
                type="checkbox"
                name='leadActor'
                className='w-4 h-4'
                checked={leadActor}
                onChange={handleOnChange}
                title='Set as Lead Actor'
            />

            <LiveSearch 
                placeholder='Search Profile'
                value={profile.name}
                // results={results}
                results={profiles}
                onSelect={handleProfileSelect}
                renderItem={renderItem}
                onChange={handleProfileChange}
            />

            <span className='dark:text-dark-subtle text-light-subtle font-semibold'>as</span>

            {/* this outer div because our commonInputClasses have w-full, with flex-grow, it will full space of flex-grow only */}
            <div className="flex-grow"> 
                <input 
                    type="text"
                    className={commonInputClasses + " rounded p-1 border-2 text-lg"}
                    placeholder='Role as'
                    value={roleAs}
                    name='roleAs'
                    onChange={handleOnChange}
                />
            </div>

            <button 
                type='button'
                className='bg-secondary dark:bg-white dark:text-primary text-white rounded'
                onClick={handleSubmit}
            >
                Add
            </button>

        </div>
    );
};

export default CastForm;
