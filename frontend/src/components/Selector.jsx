import React from 'react';

const Selector = ({ name, options, value, label, onChange }) => {
	return (
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className='border-2 dark:border-dark-subtle bg-white dark:bg-primary border-light-subtle p-1 dark:focus:border-white focus:border-primary outline-none transition rounded bg-transparent text-light-subtle dark:text-dark-subtle dark:focus:text-white focus:text-primary pr-10'
        >
            <option value="">
                {label}
            </option>

            {options.map((option)=>{
                return <option key={option.title} value={option.value}>{option.title}</option>
            })}

        </select>
    );
};

export default Selector;
