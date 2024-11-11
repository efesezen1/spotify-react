import { Box } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Flex, Text, Button } from '@radix-ui/themes'
import Library from './icon/Library'
import { ArrowRightIcon, PlusIcon, ValueNoneIcon } from '@radix-ui/react-icons'
import {
   fetchSelectedPlaylist,
   fetchUserPlaylists,
} from '../store/slicers/userSlice'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ className }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { userPlaylists, credentials } = useSelector((state) => state.user)
   const { selectedPlaylist } = useSelector((state) => state.user)
   const id = selectedPlaylist?.id

   useEffect(() => {
      if (!credentials) return
      dispatch(fetchUserPlaylists(credentials))
   }, [credentials])

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
                  } active:bg-red-100 transition-all duration-300  rounded-md pr-3`}
               >
                  <Flex justify="" align="center" className="">
                     <Box>
                        {/* {console.log(playlist?.images)} */}
                        {playlist?.images?.at(0)?.url ? (
                           <img
                              className="w-[5vw] h-[5vw] lg:w-[3vw] lg:h-[3vw] rounded-md  m-1 ml-2"
                              src={playlist?.images?.at(0)?.url}
                              alt=""
                           />
                        ) : (
                           <Box className="w-[5vw] h-[5vw] lg:w-[3vw] lg:h-[3vw] rounded-md  m-1 ml-2 flex justify-center items-center  shadow">
                              <ValueNoneIcon />
                           </Box>
                        )}
                     </Box>

                     {console.log(playlist)}
                     <Flex direction="column" className="ml-2 select-none">
                        <Text className="text-sm text-nowrap  ">
                           {playlist?.name.length > 25
                              ? playlist?.name.slice(0, 10) + '...'
                              : playlist?.name}{' '}
                        </Text>
                        <Text color="gray" className="text-xs ">
                           {playlist?.owner?.display_name || 'Unknown'}
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
