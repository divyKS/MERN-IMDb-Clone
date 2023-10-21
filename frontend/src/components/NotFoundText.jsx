import React from 'react';

const NotFoundText = ({ text, visible }) => {
    if(!visible) return null;
	return (
        <h1 className='font-semibold text-3xl text-secondary dark:text-white text-center py-5 opacity-50'>
            <i>{text}</i>
        </h1>
    );
};

export default NotFoundText;
