import React, { useEffect, useState } from 'react';
import AppInfoBox from '../AppInfoBox';
import LatestUploads from '../LatestUploads';
import { getAppInfo } from '../../api/admin';
import MostRatedMovies from '../MostRatedMovies';

const Dashboard = () => {
  const [appInfo, setAppInfo] = useState({
    movieCount: 0,
    reviewCount:0,
    userCount:0
  });

  const fetchAppInfo = async () => {
    const res = await getAppInfo();
    if(res.error) return console.log('cant get the app info -> ', res.error);
    setAppInfo({...res.appInfo});
  };

  useEffect(()=>{
    fetchAppInfo();
  }, []);

	return (
    <div className="grid grid-cols-3 gap-5 p-5">
      <AppInfoBox title='Total Uploads' subtitle={appInfo.movieCount.toLocaleString()} />
      <AppInfoBox title='Total Reviews' subtitle={appInfo.reviewCount.toLocaleString()} />
      <AppInfoBox title='Total Users' subtitle={appInfo.userCount.toLocaleString()} />
      <LatestUploads />
      < MostRatedMovies />
    </div>
  );
};

export default Dashboard;
