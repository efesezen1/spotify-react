import React from 'react'
import { Outlet } from 'react-router-dom'
import Player from '../components/Player'
import { Box, Flex, Text, Button, TextField } from '@radix-ui/themes'

import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SetUser from '../components/SetUser'
const HomeLayout = () => {
   return (
      <Flex direction="column" className="h-screen ">
         <SetUser />
         <Navbar />
         <Flex
            direction="row"
            className="h-[calc(100vh-8rem)]"
            style={{ width: '100%' }}
         >
            <Sidebar />
            <Outlet />
         </Flex>
            <hr />
         <Flex className="h-20 ">
            <Player />
         </Flex>
      </Flex>
   )
}

export default HomeLayout
