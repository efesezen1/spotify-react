import React, { useState } from 'react'
import { Box, Flex } from '@radix-ui/themes'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SpotifyPlayer from '../components/SpotifyPlayer'
import PlayerSpotify from '../components/PlayerSpotify'

const HomeLayout = () => {
   const [sidebarClosed, setSidebarClosed] = useState(false)

   return (
      <Flex direction="column" className="h-screen overflow-hidden ">
         <Navbar />
         <Flex
            direction="row"
            className="h-[calc(100vh-56px)]"
            style={{ width: '100%' }}
         >
            <Box className={`transition-all duration-300 ${sidebarClosed ? 'w-[74px]' : 'w-[240px]'}`}>
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
            >
               <Outlet />
               <Flex className="absolute bottom-24 my-auto w-full">
                  <PlayerSpotify />
               </Flex>
            </Box>
         </Flex>
      </Flex>
   )
}

export default HomeLayout
