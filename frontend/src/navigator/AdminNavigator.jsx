import React from 'react'
import { Route, Routes } from 'react-router-dom'
import NotFound from '../components/NotFound'
import Dashboard from '../components/admin/Dashboard'
import Movies from '../components/admin/Movies'
import Actors from '../components/admin/Actors'
import Navbar from '../components/admin/NavBar'
import Header from '../components/admin/Header'

const AdminNavigator = () => {
  return (
        <div className='flex dark:bg-primary bg-white'>
          <Navbar/>
          <div className='flex-1 p-2 max-w-screen-xl'>
            <Header/>
            <Routes>
              <Route path='/' element={<Dashboard/>}></Route>
              <Route path='/movies' element={<Movies/>}></Route>
              <Route path='/actors' element={<Actors/>}></Route>
              <Route path='*' element={<NotFound/>}></Route>
            </Routes>
          </div>
        </div>
  )
}

export default AdminNavigator