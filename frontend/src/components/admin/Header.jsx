import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
import { ThemeContext } from "../../context/ThemeProvider";

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

  return (
    <div className="flex items-center justify-between relative">
      <input
        type="text"
        className="border-2 dark:border-dark-subtle border-light-subtle  dark:focus:border-white focus:border-primary dark:text-white transition bg-transparent rounded text-lg p-1 outline-none"
        placeholder="Search Movie..."
      />

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
      if (parentElement.id === containerID || id === containerID) return;

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
      className="absolute right-0 top-12 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale"
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