import React, { useEffect, useRef, useState } from 'react';
import {AiOutlineClose} from 'react-icons/ai';

const TagsInput = ({ name, onChange }) => {
    // user writes some text, presses enter or comma, this runs a method which creates an array for the tags, and use map method to render the containers in front of the input field and use ref hook to bring back focus to input tag
    // we are not going to take input inside input tags, we'll replicate it using a div
    const [tag, setTag] = useState('');
    const [tags, setTags] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const inputRef = useRef();
    const tagsInput = useRef();

    const handleOnChange = (e)=>{
        if (editMode) return setEditMode(false);
        const value = e.target.value;
        // console.log("INPUT onChange: ", value);
        if(value !== ',') setTag(value);
        // onChange(tags); // this is used to change the state of our movieInfo so that we can collect all the things that we are entering into the form
    };

    const handleKeyDown = (e)=>{
        const key = e.key;
        // console.log("DIV keyDown:", e.key);
        if(key === 'Enter' || key === ','){
            if(!tag) return;
            if(tags.includes(tag)) return setTag(''); // we won't add hollywood twice if entered
            setTags([...tags, tag]);
            setTag(''); //reset input field
        } 
        // if we press backspace while writing a tag, we are just clearing that tag and don't want to remove the previous tag
        if(key === 'Backspace' && !tag && tags.length){
            setEditMode(true);
            const lastTag = tags.pop();
            // console.log(lastTag);
            setTags([...tags]);
            setTag(lastTag);
        }
    };

    const removeTagFromCross = (tagToRemove)=>{
        const newTags = tags.filter((t)=> t !== tagToRemove );
        setTags(newTags);
    };

    const handleOnFocus = () => {
        tagsInput.current.classList.remove("dark:border-dark-subtle", "border-light-subtle");
        tagsInput.current.classList.add("dark:border-white", "border-primary");
    };
    
    const handleOnBlur = () => {
        tagsInput.current.classList.add("dark:border-dark-subtle","border-light-subtle");
        tagsInput.current.classList.remove("dark:border-white", "border-primary");
    };

    useEffect(()=>{
        inputRef.current.scrollIntoView();
        onChange(tags);
    }, [tags]);

	return (
        <div>
            <div ref={tagsInput} onKeyDown={handleKeyDown} className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle text-primary dark:text-white px-2 h-10 rounded w-full flex items-center justify-center space-x-2 overflow-x-auto custom-scroll-bar transition">
                {tags.map((t)=>{
                    return <Tag onClick={()=>removeTagFromCross(t)} key={t}>{t}</Tag>
                })}
                <input 
                    ref={inputRef}
                    id={name}
                    type="text" 
                    className='h-full flex-grow bg-transparent outline-none dark:text-white'
                    placeholder='Add tags...'
                    value={tag}
                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                />
            </div>
        </div>
    );
};


const Tag = ({ children, onClick }) => {
    // if the type='button' is not mention the onClick would be keep firing thinking of it as a submit button and we would not be able to add any tags
    return (
        <span className='dark:bg-white bg-primary dark:text-primary text-white flex items-center p-1 whitespace-nowrap'>
            {children}
            <button type='button' onClick={onClick}>
                <AiOutlineClose size={12}/>
            </button>
        </span>
    );
};

export default TagsInput;
