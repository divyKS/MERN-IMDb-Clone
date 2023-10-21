import React from 'react';

const AppInfoBox = ({ title, subtitle }) => {
	return (
        <div className="bg-white dark:bg-secondary shadow p-5 rounded">
            <h1 className="font-semibold text-2xl text-primary dark:text-white mb-2">
                {title}
            </h1>
            <p className="text-xl text-primary dark:text-white">
                {subtitle}
            </p>
        </div>
    );
};

export default AppInfoBox;
