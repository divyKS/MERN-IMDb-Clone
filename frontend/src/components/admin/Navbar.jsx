import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {AiOutlineHome} from 'react-icons/ai'
import {BiMoviePlay} from 'react-icons/bi'
import {FaUserNinja} from 'react-icons/fa'
import {RiLogoutBoxLine} from 'react-icons/ri'
import { AuthContext } from '../../context/AuthProvider'

const Navbar = () => {
    const useAuth = useContext(AuthContext)
    // console.log("useAuth", useAuth)
    return (
        <nav className='w-48 min-h-screen bg-secondary  border-r-4 border-red-500 dark:text-white'>
            <div className='pl-5 sticky top-0 flex flex-col justify-between h-screen'>
                <ul className=''>
                    <li className='mt-3 mb-8'>
                    <Link to='/'>
                        <img src="../../../IMDb NavBar.png" alt="Logo" className='h-14 p-2' />
                    </Link>
                    </li>
                    <li>
                    <NavItem to='/'>
                        <AiOutlineHome />
                        <span>Home</span>
                    </NavItem>
                    </li>
                    <li>
                    <NavItem to='/movies'>
                        <BiMoviePlay />
                        <span>Movies</span>
                    </NavItem>
                    </li>
                    <li>
                    <NavItem to='/actors'>
                        <FaUserNinja />
                        <span>Actors</span>
                    </NavItem>
                    </li>
                </ul>
                <div className='flex flex-col items-start text-lg pb-5'>
                    <span className='font-semibold '>Admin</span>
                    <button onClick={useAuth.handleLogout} className='flex items-center space-x-1 text-dark-subtle hover:text-white transition'>
                    <RiLogoutBoxLine />
                    <span>Logout</span>
                    </button>
                </div>
            </div>      
        </nav>
  )
}

const NavItem = ({children, to})=>{
  const commonClasses = ' flex items-center text-lg space-x-2 p-2 hover:opacity-80 transition';
  return (
    // this is different from <Link> in way that this has this function with isActive
    <NavLink className={(isActive)=> (isActive? 'text-white': 'text-gray-400') + commonClasses} to={to}>
      {children}
    </NavLink>
  )
}

export default Navbar