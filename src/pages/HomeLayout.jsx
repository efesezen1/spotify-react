import React, { useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Player from '../components/Player'
import { Box, Flex } from '@radix-ui/themes'

import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SpotifyPlayer from '../components/SpotifyPlayer'
// import FireyPlayer from '../components/FireyPlayer'
const HomeLayout = () => {
   const mainRef = useRef(null)
   const [sidebarClosed, setSidebarClosed] = useState(false)
   return (
      <Flex direction="column" className="h-screen overflow-hidden ">
         <Navbar />
         <Flex
            direction="row"
            className="h-[calc(100vh-56px)]"
            style={{ width: '100%' }}
         >
            <Sidebar
               // className="w-1/4 lg:w-1/6"
               sidebarClosed={sidebarClosed}
               setSidebarClosed={setSidebarClosed}
            />
            <Box
               className={`relative ${
                  sidebarClosed ? 'w-[95%]' : 'w-full mx-auto'
               }   h-full max-w-[1955px]  rounded `}
               p="3"
               ref={mainRef}
            >
               <Outlet />
               <Flex className="  absolute bottom-24 my-auto w-full ">
                  {/* <Player className="mx-auto " parentRef={mainRef} /> */}
                  <SpotifyPlayer />
                  {/* <FireyPlayer /> */}
               </Flex>
            </Box>
         </Flex>
      </Flex>
   )
}

export default HomeLayout
