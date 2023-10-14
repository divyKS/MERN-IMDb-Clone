import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { commonInputClasses } from '../utils/theme';
// import { results } from '../fakeData';

const LiveSearch = ({ name, value = "", placeholder = "", results = [], resultContainerStyle, selectedResultStyle, inputStyle, renderItem=null, onChange=null, onSelect=null}) => {
    const [displaySearch, setDisplaySearch] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const handleOnFocus = () => {
        if(results.length) setDisplaySearch(true);
    };

    const handleOnBlur = () => {
        setDisplaySearch(false);
        setFocusedIndex(-1);
    };

    const handleKeyDown = (e) => {
        let nextCount;
        const key = e.key;
        const keys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
        if(!keys.includes(key)) return;
        if(key === 'ArrowDown'){
            nextCount = (focusedIndex + 1) % results.length;
        }
        if(key === 'ArrowUp'){
            // nextCount = (foscusedIndex + results.length - 1) % results.length
            nextCount = focusedIndex - 1;
            if(nextCount < 0){
                nextCount = results.length - 1;
            }
        }
        if(key === 'Enter') return handleSelection(results[focusedIndex]);//nextCount is not needed here, we are not navigating, we are already on the correct item
        if(key === 'Escape') return handleOnBlur();
        setFocusedIndex(nextCount);         
    };

    const handleSelection = (selectedItem) => {
        onSelect(selectedItem);
    };

    const getInputStyle = () => {
        return inputStyle? inputStyle: commonInputClasses + " border-2 rounded p-1 text-lg ";
    };

	return(
        <div className='relative outline-none' tabIndex={1} onKeyDown={handleKeyDown} onBlur={handleOnBlur}>
            <input 
                id={name}
                name={name}
                type="text" 
                className={getInputStyle()}
                placeholder={placeholder}
                onFocus={handleOnFocus}
                value={value}
                onChange={onChange}
                // onBlur={handleOnBlur}
                // onKeyDown={handleKeyDown}
            />
            <SearchResults 
                results={results}
                visible={displaySearch}
                focusedIndex={focusedIndex}
                onSelect={handleSelection}
                renderItem={renderItem}
                resultContainerStyle={resultContainerStyle}
                selectedResultStyle={selectedResultStyle}
            />
        </div>
    );
};

// const renderItem = ({id, name, avatar})=>{
//     return (
//         <div className='flex'>
//             <img src={avatar} alt="Profile Picture" />
//             <p>{name}</p>
//         </div>
//     )
// }

const SearchResults = ({ visible, results=[], focusedIndex, onSelect, renderItem, resultContainerStyle, selectedResultStyle }) => {
    const divRef = useRef(); // we need this for only the selcted item,hence checking the index === focusedIndex

    // block center means keep the selected item in the center of the scroller
    useEffect(() => {
        divRef.current?.scrollIntoView({behaviour: 'smooth', block: 'center'});
    }, [focusedIndex]);

    if(!visible) return null;

    return (
        <div className="z-10 absolute right-0 left-0 top-10 mt-1 bg-white dark:bg-secondary shadow-md p-2 max-h-64 space-y-2 overflow-auto custom-scroll-bar">
            {results.map((result, index)=>{
                
                const getSelectedClass = () => {
                    return selectedResultStyle? selectedResultStyle : 'dark:bg-dark-subtle bg-light-subtle';
                };

                return( 
                    <ResultCard 
                        // key={result.id} to make LiveSearch more useable, we can't use id
                        key={index.toString()}
                        ref={(index===focusedIndex)? divRef: null}

                        item={result}
                        renderItem={renderItem}
                        resultContainerStyle={resultContainerStyle}
                        selectedResultStyle={(index===focusedIndex)? getSelectedClass(): ''}
                        onMouseDown={()=>onSelect(result)}
                    />
                )
            })}
        </div>
    );
};

const ResultCard = forwardRef((props, ref)=>{
    const { item, renderItem, onMouseDown, resultContainerStyle, selectedResultStyle } = props;

    const getClasses = () => {
        if(resultContainerStyle) return resultContainerStyle + ' ' + selectedResultStyle;

        return selectedResultStyle + ' cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition'
    };

    return (
        <div onMouseDown={onMouseDown} ref={ref} className={getClasses()}>
            {renderItem(item)}                    
        </div>
    );
});

export default LiveSearch;
