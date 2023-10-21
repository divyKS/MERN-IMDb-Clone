import React, { createContext, useContext, useState } from 'react';
import { NotificationContext } from './NotificationProvider';

export const SearchContext = createContext();

let timeoutId;
const debounce = (func, delay) => {
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args); // instead of calling func() like this
    }, delay);
  };
};

const SearchProvider = ({ children }) => {
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState([]);
    const [resultNotFound, setResultNotFound] = useState(false);
    

    const useNotification = useContext(NotificationContext); // we are using the Notification context, so Notification context has to wrap this context

    const search = async (method, query, updaterFunction) => { // method query same as the in the handle search, same as that we send from the call fo debounce function
        const {error, results} = await method(query);
        if(error) return useNotification.updateNotification('error', error);

        if(!results.length) {
          setResults([]);
          updaterFunction && updaterFunction([]);
          return setResultNotFound(true);
        }

        setResultNotFound(false);
        setResults(results);
        updaterFunction && updaterFunction([...results]); // we want it to be an optional field
    };

    const resetSearch = () => {
      setSearching(false);
      setResults([]);
      setResultNotFound(false);
    };

    // we can't use this method like this now since the same results are popping up in all the live search fields since they have the same state and the same condition to fire up and become visible, so we have to separate their states
    // const handleSearch = (method, query) => {
    //     setSearching(true);
    //     if(!query.trim()){
    //         resetSearch();
    //     }
    //     debounceFunction(method, query);
    // };

    const handleSearch = (method, query, updaterFunction) => {
      setSearching(true);
      if(!query.trim()){
        updaterFunction && updaterFunction([]);
        return resetSearch();// if we don't return here then the request still goes to our backend
      }
      debounceFunction(method, query, updaterFunction);
    };

    const debounceFunction = debounce(search, 300);


	return (
        <SearchContext.Provider value={{searching, resultNotFound, results, handleSearch, resetSearch}}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;
