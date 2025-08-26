import React from 'react'
import AdminNavbar from '../../components/admin/AdminNavbar'
import SideBar from '../../components/admin/SideBar'
import { Outlet } from 'react-router-dom'
import { useAppContext} from '../../context/AppContext'
const Layout = () => {

  //To enable only admin to access admin page
  //const{isAdmin, fetchIsAdmin}=useAppContext()

  // return isAdmin?(
  return(
    <div>
      <AdminNavbar/>
      <div className='flex'>
        <SideBar/>
        <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
            <Outlet/>
        </div>
      </div>
    </div>
  )
  // ):<div>Loading...</div>
}

export default Layout
