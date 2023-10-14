import React from "react";
import { Link } from "react-router-dom";

const CustomLink = ({ to, content }) => {
  return (
    <Link
      className="dark:text-dark-subtle text-light-subtle dark:hover:text-white hover:text-primary transition"
      to={to}
    >
      {content}
    </Link>
  );
};

export default CustomLink;
