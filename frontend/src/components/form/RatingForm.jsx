import React, { useState } from 'react';
import ModelContainer from '../model/ModelContainer';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import Submit from './Submit';

const ratings = new Array(10).fill('');

const RatingForm = ({ onSubmit, busy }) => {
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [content, setContent] = useState('');

    const handleMouseEnter = (index) => {
        // console.log({index});
        const noOfStarsChosen = new Array(index + 1).fill('');
        setSelectedRatings(noOfStarsChosen);
    };

    const handleOnChange = ({target}) => {
        setContent(target.value);
    };

    const handleSubmit = () => {
        if(!selectedRatings.length) return;
        const data={
            "rating": selectedRatings.length,
            "content": content
        }
        onSubmit(data);
    };

	return (
        <div>
            <div className="p-5 dark:bg-primary bg-white rounded space-y-3">
                <div className="text-highlight dark:text-highlight-dark flex items-center relative">
                    <StarsOutlined ratings={ratings} onMouseEnter={handleMouseEnter}/>
                    <div className='flex absolute items-center top-1/2 -translate-y-1/2'>
                        <StarsFilled ratings={selectedRatings} onMouseEnter={handleMouseEnter}/>
                    </div>
                </div>
                <textarea value={content} onChange={handleOnChange} className='w-full h-24 border-2 p-2 text-primary dark:text-white rounded outline-none bg-transparent resize-none'></textarea>
                <Submit busy={busy} onClick={handleSubmit} value='Rate this movie' />
            </div>
        </div>
    );
};

const StarsOutlined = ({ratings, onMouseEnter}) => {
    return ratings.map((_, index) => {
        return (
            <AiOutlineStar
                onMouseEnter={() => onMouseEnter(index)}
                className='cursor-pointer'
                key={index}
                size={24} 
            />
        );
    })
};

const StarsFilled = ({ratings, onMouseEnter}) => {
    return ratings.map((_, index)=>{
        return (
            <AiFillStar
                onMouseEnter={() => onMouseEnter(index)}
                className='cursor-pointer'
                key={index}
                size={24}
            />
        )
    })
};

export default RatingForm;
