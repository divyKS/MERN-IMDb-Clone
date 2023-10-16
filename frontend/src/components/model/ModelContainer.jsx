import React from 'react';

const ModelContainer = ({ visible, children, onClose, ignoreContainer }) => {
    
    const handleClick = (e) => {
        if(e.target.id === 'model-container') onClose();
    };
    
    const renderChildren = () => {
        if(ignoreContainer) return children;
        return (
            <div className="dark:bg-primary bg-white rounded w-[50rem] h-[42rem] overflow-auto p-2 custom-scroll-bar">
				{children}
			</div>
        );
    };

    if(!visible) return null;
	return (
        // this outer div is the blurred part on which when clicked, we want to close the form
        <div 
            id='model-container'
            onClick={handleClick}
            className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
        >
            {/*  not simply rendering the children inside a div here because we want to have differnt style for when we view all the writers*/}
			{renderChildren()}
		</div>
    );
};

export default ModelContainer;
