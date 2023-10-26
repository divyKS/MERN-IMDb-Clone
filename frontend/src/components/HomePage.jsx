import React from 'react';
import NotVerified from './user/NotVerified';
import TopRatedMovies from './user/TopRatedMovies';
import TopRatedWebSeries from './user/TopRatedWebSeries';
import TopRatedTVSeries from './user/TopRatedTVSeries';
import HeroSlideShow from './user/HeroSlideShow';

const HomePage = () => {
	return (
    <div className="dark:bg-primary bg-white min-h-screen ">
      {/* Container.jsx below wan't rendering with it*/}
       <div className={"max-w-screen-xl mx-auto px-2 xl:p-0" }> 
        <NotVerified />
        <HeroSlideShow />
        <div className="space-y-3 py-8">
          <TopRatedMovies />
          <TopRatedWebSeries />
          <TopRatedTVSeries />
        </div>
       </div>
    </div>
  );
};

export default HomePage;
