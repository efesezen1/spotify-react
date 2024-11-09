import React from 'react'
import { Outlet } from 'react-router-dom'
import Player from '../components/Player'
import { Box, Flex, Text, Button, TextField } from '@radix-ui/themes'

import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SetUser from '../components/SetUser'
const HomeLayout = () => {
   return (
      <Flex direction="column" className="h-screen overflow-hidden ">
         <SetUser />
         <Navbar />
         <Flex
            direction="row"
            className="h-[calc(100vh-8rem)]"
            style={{ width: '100%' }}
         >
            <Sidebar className="w-1/4 lg:w-1/6" />
            <Box
               className="w-3/4 lg:w-5/6  h-full max-w-[1955px] mx-auto  rounded "
               p="3"
            >
               <Outlet />
            </Box>
         </Flex>
         <hr />
         <Flex className="h-20 ">
            <Player />
         </Flex>
      </Flex>
   )
}

export default HomeLayout
