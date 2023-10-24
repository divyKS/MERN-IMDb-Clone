import React from "react";

// throughout our app we want things to be rendered in this much width only, so we are going to render everythings insde this container
const Container = ({ childComponent, inputClassName }) => {
  return (
    <div className={"max-w-screen-xl mx-auto " + inputClassName}>
      {childComponent}
    </div>
  );
};

export default Container;
