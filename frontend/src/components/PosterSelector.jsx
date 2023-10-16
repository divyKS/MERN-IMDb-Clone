import React from 'react';

const commonPosterUI = 'flex items-center justify-center border-dashed rounded border aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer';

const PosterSelector = ({ name, selectedPoster, onChange, accept, className, label }) => {
	return (
        <div>
            <input accept={accept} onChange={onChange} id={name} name={name} type="file" hidden/>
            <label htmlFor={name}>
                {selectedPoster ? <img className={commonPosterUI + ' object-cover' + className} src={selectedPoster} alt="Uploaded Poster"/> : <PosterUI label={label} className={className}/>}
            </label>
        </div>
    );
};

const PosterUI = ({ label, className }) => {
    return (
        <div className={commonPosterUI + ' ' + className }>
            <span className='dark:text-dark-subtle text-light-subtle'>
                {label}
            </span>
        </div>
    );
};

export default PosterSelector;
