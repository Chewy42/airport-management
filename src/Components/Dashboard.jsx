import React from 'react'
import Navbar from './Navbar'
import Landing from './Landing'

function Dashboard() {
  return (
    <div className='w-[100vw] h-[100vh]'>
        <Navbar />
        <div id="" className='w-full h-full'>
        <Landing />
        </div>
    </div>
  )
}

export default Dashboard