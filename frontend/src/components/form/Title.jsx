import React from "react";

const Title = ({ content }) => {
  return (
    <h1 className="text-xl dark:text-white text-secondary font-semibold text-center">
      {content}
    </h1>
  );
};

export default Title;
