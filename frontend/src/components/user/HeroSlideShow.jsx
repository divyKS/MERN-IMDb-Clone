import React, { useEffect, useRef, useState } from 'react';
import { getLatestUploads } from '../../api/movie';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';

let nextSlideIndex = 0;
let intervalId;

const HeroSlideShow = () => {
    const [currentSlide, setCurrentSlide] = useState({});
    const [slides, setSlides] = useState({});
    const [clonedSlide, setClonedSlide] = useState({}); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    const slideRef = useRef();
    const clonedSlideRef = useRef();

    const fetchLatestUploads = async () => {
        const {error, movies} = await getLatestUploads();
        if(error) return console.log('cant fetch movies for slides -> ', error);
        setSlides([...movies]);
        setCurrentSlide(movies[0]);
    };

    const handleOnNextClick = () => {
        // pauseSlideShow();
        setClonedSlide(slides[nextSlideIndex]); // before updating, it is the current slide index
        nextSlideIndex = (currentIndex + 1) % slides.length;
        setCurrentSlide(slides[nextSlideIndex]);
        setCurrentIndex(nextSlideIndex);
        slideRef.current.classList.add('slide-in-from-right');
        clonedSlideRef.current.classList.add('slide-out-to-left');
    };

    const handleOnPrevClick = () => {
        // pauseSlideShow();
        setClonedSlide(slides[nextSlideIndex]); // before updating, it is the current slide index
        nextSlideIndex = (currentIndex - 1) < 0 ? slides.length - 1 : currentIndex - 1;
        setCurrentSlide(slides[nextSlideIndex]);
        setCurrentIndex(nextSlideIndex);
        slideRef.current.classList.add('slide-in-from-left');
        clonedSlideRef.current.classList.add('slide-out-to-right');
    };

    const handleAnimationEnd = () => {
        const classes = ['slide-in-from-right', 'slide-out-to-left', 'slide-in-from-left', 'slide-out-to-right'];
        slideRef.current.classList.remove(...classes);
        clonedSlideRef.current.classList.remove(...classes );
        setClonedSlide({});
    };

    const startSlideShow = () => {
        intervalId = setInterval(handleOnNextClick, 3500);
    };

    const pauseSlideShow = () => {
        clearInterval(intervalId);
    };

    // to handle change of tabs
    const handleOnVisibilityChange = () => {
        // console.log(document.visibilityState);
        const visibility = document.visibilityState;
        if (visibility === 'hidden') setVisible(false);
        if (visibility === 'visible') setVisible(true);
    };

    useEffect(()=>{
        fetchLatestUploads();
        document.addEventListener('visibilitychange', handleOnVisibilityChange);
        return () => { 
            pauseSlideShow();
            document.removeEventListener('visibilitychange', handleOnVisibilityChange);
        }; // so that when we go on some other link this automatic slide show can stop, and we don't get errors of that unmounted prop is being edited or so, but it still runs if we are on another tab and we have to stop that
    }, []);

    useEffect(()=>{
        // if(slides.length && visible) startSlideShow();
        // else pauseSlideShow();
    }, [slides.length, visible]);

	return (
        <div className="w-full flex">
            
            <div className='w-4/5 aspect-video relative overflow-hidden'>
                {/* current slide */}
                <div className='w-full cursor-pointer'>
                    <img
                        ref={slideRef}
                        className='aspect-video object-cover'
                        src={currentSlide.poster}
                        alt=""
                        // onAnimationEnd={handleAnimationEnd}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white dark:from-primary">
                        <h1 className='font-semibold text-4xl dark:text-highlight-dark text-highlight'>
                            {currentSlide.title}
                        </h1>
                    </div>
                </div>
                {/* cloned slide */}
                <img
                    ref={clonedSlideRef}
                    onAnimationEnd={handleAnimationEnd}
                    className='aspect-video object-cover absolute inset-0'
                    src={clonedSlide.poster}
                    alt=""
                />
                <SlideShowControls onNextClick={handleOnNextClick} onPrevClick={handleOnPrevClick}/>
            </div>

            <div className='w-1/5 aspect-video bg-red-300'></div>

        </div>
    );
};

const SlideShowControls = ({onPrevClick, onNextClick}) => {
    const btnClasses = 'bg-primary rounded border-2 text-white text-xl p-2 outline-none';
    return (
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-2">
            <button  onClick={onPrevClick} type='button' className={btnClasses}>
                <AiOutlineDoubleLeft/>
            </button>
            <button onClick={onNextClick} type='button' className={btnClasses}>
                <AiOutlineDoubleRight/>
            </button>
        </div>
    );
};

export default HeroSlideShow;
