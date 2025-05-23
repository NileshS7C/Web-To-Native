import React, { useEffect } from 'react'
import CreateAdmin from '../Component/Admin/CreateAdmin'
import AdminListing from '../Component/Admin/AdminListing'

const Admin = () => {

  return (
    <div className='main-admin'>
      <div className='flex items-center justify-between'>
        <h1 className='inline-flex  items-center gap-2.5 text-[#343C6A] font-semibold text-base md:text-[22px]'>Admin</h1>
        <CreateAdmin />
      </div>
      <AdminListing />
    </div>
  )
}

export default Admin