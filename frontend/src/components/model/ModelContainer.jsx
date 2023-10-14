import React from 'react';

const ModelContainer = ({ visible, children, onClose }) => {
    
    const handleClick = () => {
        onClose();
    };
    
    if(!visible) return null;
	return (
        // this outer div is the blurred part on which when clicked, we want to close the form
        <div onClick={handleClick} className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
			<div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto p-2 custom-scroll-bar">
				{children}
			</div>
		</div>
    );
};

export default ModelContainer;
