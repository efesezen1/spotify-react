import React from 'react'
import { MagnifyingGlassIcon, HomeIcon, BellIcon } from '@radix-ui/react-icons'
import * as Avatar from '@radix-ui/react-avatar'
import * as Popover from '@radix-ui/react-popover'
import { Button, Flex, Box, TextField, Text, Tooltip } from '@radix-ui/themes'
import SpotifyIcon from './icon/SpotifyIcon'
import { Link } from 'react-router-dom'
import Logout from './Logout'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
   const user = useSelector((state) => state.user)
   const navigate = useNavigate()

   return (
      <Flex
         direction="row"
         width="100%"
         justify="between"
         align="center"
         gap="2"
         p="2"
      >
         <Box className="px-4 h-full flex items-center hover:scale-125 transition-all duration-300 active:scale-90 ">
            <Link to="/" className="cursor-default">
               <SpotifyIcon className="" />
            </Link>
         </Box>

         <Flex gap="2" align="center" className="w-[40%]">
            <Tooltip content="Home" delayDuration={0} className="">
               <Button
                  className="w-[2.3rem] h-[2.3rem] "
                  onClick={() => {
                     navigate('/')
                  }}
               >
                  <HomeIcon height="30" width="30" />
               </Button>
            </Tooltip>
            <TextField.Root
               style={{ width: '100%' }}
               color="gray"
               size="3"
               placeholder="Search the docs…"
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
            <Tooltip content="What's New">
               <Button className="mr-2  w-[1rem] h-[1.5rem] " variant="ghost">
                  <BellIcon height="30" width="30" />
               </Button>
            </Tooltip>

            <Box className="mr-2">{user?.display_name}</Box>
            <Popover.Root>
               <Tooltip
                  content={user?.user?.display_name}
                  delayDuration={0}
                  className=""
               >
                  <Popover.Trigger>
                     <Avatar.Root className="AvatarRoot">
                        <Avatar.Image
                           className="AvatarImage"
                           src={user.profilePicture}
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
                  <Popover.Content className="flex flex-col   w-[200px]  border rounded-lg text-left  mr-2 bg-white">
                     <Button className="hover:bg-red-50 active:bg-red-100 pl-2 py-2 justify-start mt-1 mx-1 rounded">
                        Account
                     </Button>
                     <Button className="hover:bg-red-50 active:bg-red-100 pl-2 py-2 justify-start mx-1 rounded">
                        Profile
                     </Button>
                     <Button className="hover:bg-red-50 active:bg-red-100 pl-2 py-2 justify-start  mx-1 mb-1 rounded">
                        Settings
                     </Button>
                     <hr />
                     <Logout className="hover:bg-red-50 active:bg-red-100 pl-2 py-2 justify-start my-1  mx-1 rounded" />

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
