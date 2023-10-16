import React, { createContext, useContext, useState } from 'react';
import { NotificationContext } from './NotificationProvider';

export const SearchContext = createContext();

let timeoutId;
const debounce = (func, delay) => {
  return (...args) => {
    if(timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // func(); instead of calling like this we call using the apply method
      func.apply(null, args);
    }, delay);
  };
};

const SearchProvider = ({ children }) => {
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState([]);
    const [resultNotFound, setResultNotFound] = useState(false);
    

    const useNotification = useContext(NotificationContext); // we are using the Notification context, so Notification context has to wrap this context

    const search = async (method, query) => { // method query same as the in the handle search, same as that we send from the call fo debounce function
        const {error, results} = await method(query);
        if(error) return useNotification.updateNotification('error', error);

        if(!results.length) return setResultNotFound(true);

        setResults(results);
    };

    const handleSearch = (method, query) => {
        setSearching(true);
        if(!query.trim()){
            setSearching(false);
            setResults([]);
            setResultNotFound(false);
        }
        debounceFunction(method, query);
    };

    const debounceFunction = debounce(search, 300);


	return (
        <SearchContext.Provider value={{searching, resultNotFound, results, handleSearch}}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;
