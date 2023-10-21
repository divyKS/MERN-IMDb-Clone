import React from 'react';
import AppInfoBox from '../AppInfoBox';
import LatestUploads from '../LatestUploads';

const Dashboard = () => {
	return (
    <div className="grid grid-cols-3 gap-5 my-5">
      <AppInfoBox title='Total Uploads' subtitle='267' />
      <AppInfoBox title='Total Reviews' subtitle='87,332' />
      <AppInfoBox title='Total Users' subtitle='5,231' />
      <LatestUploads />
    </div>
  );
};

export default Dashboard;
