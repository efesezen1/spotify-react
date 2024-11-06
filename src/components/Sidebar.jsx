import { Box } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Flex, Text, Button } from '@radix-ui/themes'
import Library from './icon/Library'
import { ArrowRightIcon, PlayIcon, PlusIcon } from '@radix-ui/react-icons'
import { fetchSelectedPlaylist } from '../../store/slicers/userSlice'
import { useNavigate } from 'react-router-dom'
import MediaPlayIcon from './icon/MediaPlayIcon'

const Sidebar = ({ className }) => {
   const navigate = useNavigate()
   const { userPlaylists } = useSelector((state) => state.user)
   const { selectedPlaylist } = useSelector((state) => state.user)
   const id = selectedPlaylist?.id

   const dispatch = useDispatch()
   return (
      <>
         <Box
            className={`${className} overflow-y-scroll m-2 relative rounded-lg `}
         >
            <Flex
               direction="row"
               align="center"
               justify="between"
               p="4"
               className="  sticky top-0 !bg-white "
            >
               <Flex direction="row" align="center" className="">
                  <Box className="mr-2 text-xl">
                     <Library />
                  </Box>
                  <Text className=" w-full select-none  text-nowrap">
                     Playlists
                  </Text>
               </Flex>
               <Flex gap="5">
                  <Button
                     variant="ghost"
                     // radius="full"
                     color="white"
                     className=" color-white rounded w-5 h-7"
                  >
                     <PlusIcon />
                  </Button>
                  <Button
                     variant="ghost"
                     // radius="full"
                     color="white"
                     className=" color-white rounded w-5 h-7"
                  >
                     <ArrowRightIcon />
                  </Button>
               </Flex>
            </Flex>
            {userPlaylists.map((playlist) => (
               <Box
                  key={playlist.id}
                  onClick={() => {
                     dispatch(fetchSelectedPlaylist(playlist.href)).then(() => {
                        navigate('/playlist/' + playlist.id)
                     })
                  }}
                  className={`${playlist.id === id ? 'bg-red-100' : ''} ${
                     playlist.id !== id ? 'hover:bg-red-50' : ''
                  } active:bg-red-100 transition-all duration-300  rounded-md pr-3`}
               >
                  <Flex justify="" align="center" className="">
                     <Box className="relative ">
                        {/* <Box className="absolute top-0 right-0 w-[5vw] h-[5vw] lg:w-[3vw] lg:h-[3vw] hover:backdrop-blur-xl  hover:opacity-90   m-1 flex justify-center items-center">
                           <MediaPlayIcon className='opacity-0 hover:opacity-100' />
                           
                        </Box> */}
                        <img
                           className="w-[5vw] h-[5vw] lg:w-[3vw] lg:h-[3vw] rounded-md  m-1 ml-2"
                           src={playlist.images[0].url}
                           alt=""
                        />
                     </Box>

                     <Flex direction="column" className="ml-2 select-none">
                        <Text className="text-sm text-nowrap  ">
                           {playlist.name.length > 25
                              ? playlist.name.slice(0, 25) + '...'
                              : playlist.name}{' '}
                        </Text>
                        <Text color="gray" className="text-xs ">
                           {playlist.owner.display_name}
                        </Text>
                     </Flex>
                  </Flex>
               </Box>
            ))}
         </Box>
      </>
   )
}

export default Sidebar
