import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
import { ThemeContext } from "../../context/ThemeProvider";
import AppSearchForm from "../AppSearchForm";
import { useNavigate } from "react-router-dom";

const Header = ({ onAddActorClick, onAddMovieClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const useTheme = useContext(ThemeContext);
  const options = [
    {
      title: "Add Actor",
      onClick: onAddActorClick,
    },
    {
      title: "Add Movie",
      onClick: onAddMovieClick,
    },
  ];

  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    if(!query.trim()) return;
    console.log({query});
    navigate('/search?title='+query);
  };

  return (
    <div className="flex items-center justify-between relative p-5">
      
      <AppSearchForm onSubmit={handleSearchSubmit} placeholder='Search Movie...'/>

      <div className="flex items-center space-x-3">
        <button
          className="dark:text-white text-light-subtle p-1 rounded"
          onClick={useTheme.toggleTheme}
        >
          <BsFillSunFill size={24} />
        </button>

        {/* first we had onClick={()=>setShowOptions(!showOptions)} but now we are using it to only open*/}
        <button
          onClick={() => setShowOptions(true)}
          className="flex items-center space-x-2 dark:border-dark-subtle border-light-subtle dark:text-white text-black  hover:border-primary hover:opacity-80 transition font-semibold border-2 rounded text-lg py-1 px-3"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>
      </div>

      <CreateOptions
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        options={options}
      />
    </div>
  );
};

const CreateOptions = ({ visible, onClose, options }) => {
  const container = useRef();
  const containerID = "options-container";

  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return;
      // console.log(document.getElementById(containerID))

      const { parentElement, id } = e.target;

      // console.log("You clicked on: ", parentElement)
      // console.log("It's ID is: ", id)
      // TODO: parent element without ? gives error, afer clicking on add movie and then clicking out to close it
      if (parentElement?.id === containerID || id === containerID) return;

      if (container.current) {
        if (!container.current.classList.contains("animate-scale"))
          container.current.classList.add("animate-scale-reverse");
      }
    };

    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);

  // we do want to remove the drop down from DOM, but first we want the animation of closing to end before removing it from the DOM
  if (!visible) return null;

  return (
    <div
      id={containerID}
      ref={container}
      className="absolute right-0 top-12 flex z-10 flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale"
      onAnimationEnd={(e) => {
        if (e.target.classList.contains("animate-scale-reverse")) onClose();
        e.target.classList.remove("animate-scale");
      }}
    >
      {options.map((option) => {
        const title = option.title;
        const onClick = option.onClick;

        return (
          <Option onClick={onClick} key={title}>
            {title}
          </Option>
        );
      })}
    </div>
  );
};

const Option = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="dark:text-white text-secondary hover:opacity-80 transition"
    >
      {children}
    </button>
  );
};

export default Header;
