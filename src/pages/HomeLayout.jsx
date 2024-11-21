import React, { useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Player from '../components/Player'
import { Box, Flex } from '@radix-ui/themes'

import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SpotifyPlayer from '../components/SpotifyPlayer'
import PlayerSpotify from '../components/PlayerSpotify'
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
            <Box className={`transition-all duration-300 ${sidebarClosed ? 'w-[72px]' : 'w-[240px]'}`}>
               <Sidebar
                  sidebarClosed={sidebarClosed}
                  setSidebarClosed={setSidebarClosed}
               />
            </Box>
            <Box
               className={`relative transition-all duration-300 ${
                  sidebarClosed ? 'w-[calc(100%-72px)]' : 'w-[calc(100%-240px)]'
               } h-full max-w-[1955px] rounded`}
               p="3"
               ref={mainRef}
            >
               <Outlet />
               <Flex className="  absolute bottom-24 my-auto w-full ">
                  {/* <Player className="mx-auto " parentRef={mainRef} /> */}
                  {/* <SpotifyPlayer /> */}
                  <PlayerSpotify />
                  {/* <FireyPlayer /> */}
               </Flex>
            </Box>
         </Flex>
      </Flex>
   )
}

export default HomeLayout
