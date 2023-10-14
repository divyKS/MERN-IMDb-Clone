import React, { useContext } from "react";
import { BsFillSunFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeProvider";
import { AuthContext } from "../../context/AuthProvider";

const NavBar = () => {
  // if we do not use custom hooks then we will have to write the below line in each of our components where we want the theme to change by click of the theme button, if we create a custom hook then we can directly have the function and directly use the function
  const useTheme = useContext(ThemeContext);
  // useTheme.togglgeTheme()
  const useAuth = useContext(AuthContext);
  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <div className="text-white max-w-screen-lg mx-auto p-2">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img
              src="../../../IMDb NavBar.png"
              alt="IMDb Logo"
              className="h-10"
            />
          </Link>

          <ul className="flex items-center space-x-4">
            <li>
              <button
                className="dark:bg-white bg-dark-subtle p-1 rounded"
                onClick={useTheme.toggleTheme}
              >
                <BsFillSunFill className="text-secondary" />
              </button>
            </li>
            <li>
              <input
                type="text"
                className="border-2 border-dark-subtle rounded bg-transparent text-xl outline-none focus:border-white"
                placeholder="Search..."
              />
            </li>
            {useAuth.authInfo.isLoggedIn ? (
              <button
                className="font-semibold text-lg"
                onClick={useAuth.handleLogout}
              >
                Log out
              </button>
            ) : (
              <Link to="/auth/signin">
                <li className="font-semibold text-lg">Login</li>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
