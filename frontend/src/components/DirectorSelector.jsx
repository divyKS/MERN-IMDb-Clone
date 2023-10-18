import React, { useContext, useState } from 'react';
import LiveSearch from './LiveSearch';
import { renderItem } from '../utils/helper';
import { SearchContext } from '../context/SearchProvider';
import { searchActor } from '../api/actor';
import { Label } from './Label';

const DirectorSelector = ({ onSelect }) => {
    const [value, setValue] = useState('');
    const [profiles, setProfiles] = useState('');

    const useSearch = useContext(SearchContext);

    const handleOnSelect = (profile) => {
        setValue(profile.name);
        onSelect(profile);
        setProfiles([]);
        useSearch.resetSearch();
    };
    
    const handleOnChange = (e) => {
        const value = e.target.value;
        setValue(value);
        useSearch.handleSearch(searchActor, value, setProfiles);
    };

	return (
        <div>
            <Label htmlFor='director'>Director</Label>
            <LiveSearch
                name='director'
                placeholder='Search Profile'
                value={value}
                results={profiles}
                renderItem={renderItem}
                onSelect={handleOnSelect}
                onChange={handleOnChange}
            />
        </div>
    );
};

export default DirectorSelector;
