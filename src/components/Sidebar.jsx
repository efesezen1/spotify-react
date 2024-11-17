import { Box, Tooltip } from '@radix-ui/themes'
import usePrevious from '../hook/prevId'
import * as Dialog from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'
import * as Popover from '@radix-ui/react-popover'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Flex, Text, Button } from '@radix-ui/themes'
import Library from './icon/Library'
import {
   ArrowLeftIcon,
   Cross2Icon,
   PlusIcon,
   ValueNoneIcon,
} from '@radix-ui/react-icons'
import {
   fetchSelectedPlaylist,
   fetchUserPlaylists,
   createPlaylist,
} from '../store/slicers/userSlice'
import {
   useLocation,
   useNavigate,
   useNavigation,
   useSearchParams,
} from 'react-router-dom'

const Sidebar = ({ className, sidebarClosed, setSidebarClosed }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const location = useLocation()

   const { userPlaylists, credentials } = useSelector((state) => state.user)
   const { selectedPlaylist } = useSelector((state) => state.user)
   const id = selectedPlaylist?.id
   // const searchParams = useSearchParams()

   useEffect(() => {
      const loc = location.pathname.split('/').filter((x) => x !== '')
      if (loc?.at(0) === 'playlist') {
         const currentLocation = loc?.at(1)
         const isCurrentIdNotIncludedInPlaylist = userPlaylists.some((item) => {
            return item?.id === currentLocation
         })
         if (!isCurrentIdNotIncludedInPlaylist) {
            dispatch(fetchUserPlaylists(credentials))
         }
      }
   }, [location.pathname])

   useEffect(() => {
      if (!credentials) return
      dispatch(fetchUserPlaylists(credentials))
   }, [credentials])

   return (
      <Flex direction={'column'}>
         <Flex
            direction="row"
            align="center"
            justify={`${sidebarClosed ? 'center' : 'between'}`}
            py="4"
            className={`sticky top-0  m-2 ml-4 rounded-t p-3`}
         >
            <Flex
               direction="row"
               align="center"
               className={`${sidebarClosed && 'flex justify-center'} `}
            >
               <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`mr-1 text-xl `}
                  onClick={() => {
                     setSidebarClosed(!sidebarClosed)
                  }}
               >
                  <Library />
               </motion.div>
               {!sidebarClosed && (
                  <Text className="w-full select-none  text-nowrap ">
                     Playlists
                  </Text>
               )}
            </Flex>
            {!sidebarClosed && (
               <Flex gap="3" className={``}>
                  <CreatePlaylist />
                  <Tooltip content="Minimize Sidebar" className="">
                     <Button
                        variant="ghost"
                        // radius="full"
                        color="white"
                        className=" color-white rounded w-[20px]  h-7 mt-0.5"
                        onClick={() => setSidebarClosed(!sidebarClosed)}
                     >
                        <ArrowLeftIcon />
                     </Button>
                  </Tooltip>
               </Flex>
            )}
         </Flex>
         <Box
            className={`${className} overflow-y-scroll m-2 relative rounded-lg `}
         >
            {userPlaylists?.map((playlist) => (
               <Flex
                  direction={'row'}
                  key={playlist?.id}
                  onClick={() => {
                     dispatch(fetchSelectedPlaylist(playlist?.href)).then(
                        () => {
                           navigate('/playlist/' + playlist?.id)
                        }
                     )
                  }}
                  className={`${playlist?.id === id ? 'bg-red-100' : ''} ${
                     playlist?.id !== id ? 'hover:bg-red-50' : ''
                  } ${
                     !sidebarClosed && 'pr-3'
                  } active:bg-red-100 transition-all duration-300  rounded-md  overflow-hidden`}
               >
                  <Flex justify="" align="center" className="w-full">
                     <Box>
                        {playlist?.images?.at(0)?.url ? (
                           <img
                              className="sidebar-image object-cover w-10 h-10 max-w-fit" // Set fixed width and height here
                              src={playlist?.images?.at(0)?.url}
                              alt=""
                           />
                        ) : (
                           <Box className="sidebar-image w-10 h-10 flex justify-center items-center">
                              {' '}
                              <ValueNoneIcon />
                           </Box>
                        )}
                     </Box>

                     {!sidebarClosed && (
                        <Flex direction="column" className="ml-2 select-none">
                           <Text className="text-sm text-ellipsis whitespace-nowrap overflow-hidden max-w-[150px]">
                              {playlist?.name}
                           </Text>
                           <Text color="gray" className="text-xs ">
                              {playlist?.owner?.display_name || 'Unknown'}
                           </Text>
                        </Flex>
                     )}
                  </Flex>
               </Flex>
            ))}
         </Box>
      </Flex>
   )
}

const CreatePlaylist = ({ children, className }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const [isPublic, setIsPublic] = useState(false)

   // useEffect(() => {
   //    console.log(isPublic)
   // }, [isPublic])

   const handleCreatePlaylist = ({ name, description, isPublic }) => {
      // console.log(user)
      dispatch(createPlaylist({ name, description, isPublic }))
         .then((action) => {
            const response = action.payload
            if (!response?.id) return
            navigate('/playlist/' + response?.id)
         })
         .catch((error) => console.log(error))
   }

   return (
      <Dialog.Root>
         <Dialog.Trigger
            className={` ${className} h-[40px] w-[40px] flex justify-center items-center `}
         >
            <Tooltip content="Create Playlist" delayDuration={0}>
               <Button
                  variant="ghost"
                  // radius="full"
                  className={`color-white  h-[30px] w-[20px] rounded  `}
                  color="white"
               >
                  <PlusIcon />
               </Button>
            </Tooltip>
         </Dialog.Trigger>
         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
               <Dialog.Title className="m-0 text-[17px] font-medium capitalize ">
                  Create new playlist
               </Dialog.Title>
               <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal ">
                  Create your playlist here. Click create when you're done.
               </Dialog.Description>
               <fieldset className="mb-[15px] flex items-center gap-5">
                  <label
                     className="w-[90px] text-right text-[15px] capitalize"
                     htmlFor="playlistName"
                  >
                     Playlist Name
                  </label>
                  <input
                     className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none  shadow-[0_0_0_1px]  outline-none focus:shadow-[0_0_0_2px] "
                     id="playlistName"
                     defaultValue="My Playlist #48"
                  />
               </fieldset>
               <fieldset className="mb-[15px] flex items-center gap-5">
                  <label
                     className="w-[90px] text-right text-[15px] "
                     htmlFor="description"
                  >
                     Description
                  </label>
                  <input
                     className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none  shadow-[0_0_0_1px]  outline-none focus:shadow-[0_0_0_2px] "
                     id="description"
                     defaultValue="New playlist description"
                  />
               </fieldset>
               <form className="mb-[15px] flex items-center gap-5">
                  <label
                     className="w-[90px] text-right text-[15px] "
                     htmlFor="playlist-audience"
                  >
                     Make private
                  </label>
                  <Switch.Root
                     checked={isPublic}
                     onCheckedChange={() => setIsPublic((prev) => !prev)}
                     className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
                     id="playlist-audience"
                     style={{
                        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
                     }}
                  >
                     <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
               </form>
               <div className="mt-[25px] flex justify-end">
                  <Dialog.Close asChild>
                     <Button
                        onClick={() => {
                           handleCreatePlaylist({
                              name: document.getElementById('playlistName')
                                 .value,
                              description:
                                 document.getElementById('description').value,
                              isPublic,
                           })
                        }}
                        variant="soft"
                     >
                        Create
                     </Button>
                     {/* <button>efe</button> */}
                  </Dialog.Close>
               </div>
               <Dialog.Close asChild>
                  <button
                     className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full  hover:bg-violet4 focus:shadow-[0_0_0_2px] focus: focus:outline-none"
                     aria-label="Close"
                  >
                     <Cross2Icon />
                  </button>
               </Dialog.Close>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

export default Sidebar
