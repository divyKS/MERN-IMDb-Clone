import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const AppSearchForm = ({ placeholder, onSubmit, showResetIcon, onReset }) => {
    const [value, setValue] = useState('');

    const handleOnSubmit = (e) => {
        e.preventDefault();
        onSubmit(value);
    };

    const onClickReset = (e) => {
        setValue('');
        onReset();
    };

	return (
        <form onSubmit={handleOnSubmit} className='relative'>
            <input
                type="text"
                className="border-2 dark:border-dark-subtle border-light-subtle  dark:focus:border-white focus:border-primary dark:text-white transition bg-transparent rounded text-lg p-1 outline-none"
                placeholder={placeholder}
                value={value}
                onChange={(e)=>setValue(e.target.value)}
            />
           { showResetIcon ? <button onClick={onClickReset} type='button' className='absolute top-1/2 -translate-y-1/2 right-2 text-secondary dark:text-white'>
                <AiOutlineClose/>
            </button> : null}
        </form>
    );
};

export default AppSearchForm;
