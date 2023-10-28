import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { getLatestUploads } from '../../api/movie';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import {Link} from 'react-router-dom';

let nextSlideIndex = 0;
let intervalId;

const HeroSlideShow = () => {
    const [currentSlide, setCurrentSlide] = useState({});
    const [slides, setSlides] = useState({});
    const [clonedSlide, setClonedSlide] = useState({}); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [upNext, setUpNext] = useState([]);

    const slideRef = useRef();
    const clonedSlideRef = useRef();

    const fetchLatestUploads = async (signal) => {
        const {error, movies} = await getLatestUploads(signal);
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
        updateUpNext(nextSlideIndex);
    };

    const handleOnPrevClick = () => {
        // pauseSlideShow();
        setClonedSlide(slides[nextSlideIndex]); // before updating, it is the current slide index
        nextSlideIndex = (currentIndex - 1) < 0 ? slides.length - 1 : currentIndex - 1;
        setCurrentSlide(slides[nextSlideIndex]);
        setCurrentIndex(nextSlideIndex);
        slideRef.current.classList.add('slide-in-from-left');
        clonedSlideRef.current.classList.add('slide-out-to-right');
        updateUpNext(nextSlideIndex);
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

    const updateUpNext = (currIndex)=>{
        if(!slides.length) return;
        const upNextCount = currIndex + 1;
        const end = upNextCount + 3;
        let newSlides = [...slides];
        newSlides = newSlides.slice(upNextCount, end);
        if(!newSlides.length){
            newSlides = [...slides].slice(0,3);
        }
        setUpNext([...newSlides]);
    }

    useEffect(()=>{
        const ac = new AbortController();
        fetchLatestUploads(ac.signal);
        document.addEventListener('visibilitychange', handleOnVisibilityChange);
        return () => {
            // ac.abort(); 
            pauseSlideShow();
            document.removeEventListener('visibilitychange', handleOnVisibilityChange);
        }; // so that when we go on some other link this automatic slide show can stop, and we don't get errors of that unmounted prop is being edited or so, but it still runs if we are on another tab and we have to stop that
    }, []);

    useEffect(()=>{
        // if(slides.length && visible) {
        //      startSlideShow();
        //      updateUpNext(count);
        // } else {
        //     pauseSlideShow();
        // }
    }, [slides.length, visible]);

	return (
        <div className="w-full flex py-2">            
            <div className='md:w-4/5 w-full aspect-video relative overflow-hidden'>
                <Slide
                    //current slide
                    title={currentSlide.title}
                    src={currentSlide.poster}
                    ref={slideRef}
                    id={currentSlide.id}
                />
                <Slide
                    //cloned slide
                    onAnimationEnd={handleAnimationEnd} // for this we have that ...rest 
                    title={clonedSlide.title}
                    src={clonedSlide.poster}
                    ref={clonedSlideRef}
                    className='absolute inset-0'
                    id={currentSlide.id}
                />

                <SlideShowControls onNextClick={handleOnNextClick} onPrevClick={handleOnPrevClick}/>
            </div>

            <div className='w-1/5 md:block hidden aspect-video space-y-3 px-3'>
                <h1 className='font-semibold text-2xl text-primary dark:text-white'>
                    Up Next
                </h1>
                {
                    upNext.map(({poster, id})=>{
                        return (
                            <img key={id} src={poster} alt="" className='aspect-video object-cover rounded'/>
                        )
                    })
                }
            </div>
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

const Slide = forwardRef((props, ref) => {
    const { title, id, src, className = "", ...rest } = props;
    return (
      <Link to={'/movie/'+id}
        ref={ref}
        className={"w-full cursor-pointer block " + className} //block since by default Link is inline component
        {...rest}
      >
        {src ? (
          <img className="aspect-video object-cover" src={src} alt="" />
        ) : null}
        {title ? (
          <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-transparent dark:from-primary dark:via-transparent">
            <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
              {title}
            </h1>
          </div>
        ) : null}
      </Link>
    );
  });

export default HeroSlideShow;
