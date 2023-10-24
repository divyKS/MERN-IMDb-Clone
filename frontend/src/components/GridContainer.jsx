import React from 'react';

const GridContainer = ({ children }) => {
	return (
		<div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1  gap-3">
			{children}
		</div>
	);
};

export default GridContainer;
