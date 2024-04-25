import React from 'react'
import Navbar from './Navbar'
import Landing from './Landing'

function Homepage() {
  return (
    <div className='w-[100vw] h-[100vh]'>
        <Navbar />
        <div id="homepage-content" className='w-full h-full'>
        <Landing />
        </div>
    </div>
  )
}

export default Homepage