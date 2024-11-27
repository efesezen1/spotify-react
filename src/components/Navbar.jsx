import React, { useEffect, useState } from 'react'
import {
   MagnifyingGlassIcon,
   HomeIcon,
   // BellIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
} from '@radix-ui/react-icons'
import * as Avatar from '@radix-ui/react-avatar'
import * as Popover from '@radix-ui/react-popover'
import {
   Button,
   Flex,
   Box,
   TextField,
   Text,
   Tooltip,
   DropdownMenu,
} from '@radix-ui/themes'
import SpotifyIcon from './icon/SpotifyIcon'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logout from './Logout'
import { useDispatch, useSelector } from 'react-redux'
import useSpotifyInstance from '../hook/spotifyInstance'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import { motion } from 'framer-motion'

const Navbar = () => {
   const navigate = useNavigate()
   const { token } = useSpotifyInstance()

   const { data: user } = useSpotifyQuery({
      queryKey: ['user'],
      endpoint: '/me',
   })

   const location = useLocation()

   return (
      <Flex
         direction="row"
         width="100%"
         justify="between"
         align="center"
         gap="2"
         p="2"
      >
         <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="px-4 h-full flex items-center  "
         >
            <Link to="/" className="cursor-default">
               <SpotifyIcon className="" />
            </Link>
         </motion.div>
         <Flex gap="4">
            <Button
               variant="ghost"
               // className="w-[2.3rem] h-[2.3rem] "
               onClick={() => {
                  if (location.key) {
                     navigate(-1)
                  }
               }}
               disabled={!location.key}
               className={`color-white  h-[20px] w-[20px] rounded  `}
            >
               <ChevronLeftIcon />
            </Button>
            <Button
               className={`color-white  h-[20px] w-[20px] rounded  `}
               variant="ghost"
               // className="w-[2.3rem] h-[2.3rem] "
               // className={`color-white  h-[30px] w-[20px] rounded  `}
               onClick={() => {
                  navigate(1)
               }}
            >
               <ChevronRightIcon
               // height="30" width="30"
               />
            </Button>
         </Flex>
         <Flex gap="2" align="center" className="w-[40%]">
            <Tooltip content="Home" delayDuration={0} className="">
               <Button
                  className="w-[2.3rem] h-[2.3rem] "
                  onClick={() => {
                     navigate('/')
                  }}
                  variant="soft"
               >
                  <HomeIcon height="30" width="30" />
               </Button>
            </Tooltip>
            <TextField.Root
               style={{ width: '100%' }}
               color="gray"
               size="3"
               placeholder="Search tracks…"
               p="3"
               variant="soft"
               // radius="full"
            >
               <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
               </TextField.Slot>
            </TextField.Root>
         </Flex>
         <Flex align="center">
            {/* <Tooltip content="What's New">
               <Button className="mr-2  w-[1rem] h-[1.5rem] " variant="ghost">
                  <BellIcon height="30" width="30" />
               </Button>
            </Tooltip> */}

            {/* <Box className="mr-2">{user?.display_name}</Box> */}
            <Popover.Root>
               <Tooltip
                  content={user?.display_name}
                  delayDuration={0}
                  className=""
               >
                  <Popover.Trigger>
                     <Avatar.Root className="AvatarRoot">
                        <Avatar.Image
                           className="AvatarImage"
                           src={user?.images?.at(1)?.url}
                           alt="Colm Tuite"
                        />
                        <Avatar.Fallback
                           className="AvatarFallback"
                           delayMs={600}
                        >
                           EF
                        </Avatar.Fallback>
                     </Avatar.Root>
                  </Popover.Trigger>
               </Tooltip>
               <Popover.Portal>
                  <Popover.Content className="popover-menu  w-[200px]">
                     <Link to="/account" className="popover-menu-item mt-1">
                        Account
                     </Link>
                     <Link to="/profile" className="popover-menu-item ">
                        Profile
                     </Link>

                     <Link className="popover-menu-item mb-1">Settings</Link>

                     <hr />
                     <Logout className="popover-menu-item my-1  mx-1 " />

                     {/* <Popover.Close>Close</Popover.Close> */}
                     <Popover.Arrow className=" fill-white"></Popover.Arrow>
                  </Popover.Content>
               </Popover.Portal>
            </Popover.Root>
         </Flex>
      </Flex>
   )
}

export default Navbar
