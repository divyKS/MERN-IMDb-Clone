import React, { useContext, useState } from 'react'
import LiveSearch from './LiveSearch';
import { renderItem } from '../utils/helper';
import { SearchContext } from '../context/SearchProvider';
import { searchActor } from '../api/actor';

const WriterSelector = ({ onSelect }) => {
    const [value, setValue] = useState('');
    const [profiles, setProfiles] = useState('');

    const useSearch = useContext(SearchContext);

    const handleOnSelect = (profile) => {
        setValue('');
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
        <LiveSearch
        name='writers'
        // results={useSearch.results}
        results={profiles}
        placeholder='Search Profile'
        renderItem={renderItem}
        onSelect={handleOnSelect}
        onChange={handleOnChange}
        value={value}
    />);
};

export default WriterSelector;