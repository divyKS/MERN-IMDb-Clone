import React from 'react';
import {ImTree} from 'react-icons/im'

const GenresSelector = ({ onClick, badge }) => {
    const renderBadge = () => {
        if(!badge) return null;
        return (
            <span className='dark:bg-dark-subtle bg-light-subtle absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-white translate-x-5 -translate-y-1 text-sm'>
                {(badge <= 9)? badge: '9+'}
            </span>
        );
    };
	return (
        <button type='button' onClick={onClick} className='relative flex items-center justify-center space-x-2 py-1 px-3 border-2 dark:border-dark-subtle border-light-subtle dark:hover:border-white hover:border-primary transition dark:text-dark-subtle text-light-subtle hover:text-primary dark:hover:text-primary rounded'>
            <ImTree/>
            <span>Select Genres</span>
            {renderBadge()}
        </button>
    );
};

export default GenresSelector;
