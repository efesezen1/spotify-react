import { Box, Skeleton, Switch, Tooltip } from '@radix-ui/themes'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Flex, Text, Button } from '@radix-ui/themes'

import Library from './icon/Library'
import { ArrowLeftIcon, Cross2Icon, PlusIcon, ValueNoneIcon } from '@radix-ui/react-icons'

import { useNavigate, useLocation } from 'react-router-dom'
import useSpotifyInstance from '../hook/spotifyInstance'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CreatePlaylist from './CreatePlaylist'

const Sidebar = ({ className, sidebarClosed, setSidebarClosed }) => {
   const navigate = useNavigate()
   const location = useLocation()
   const { selectedPlaylist } = useSelector((state) => state.user)
   const id = selectedPlaylist?.id
   const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState(false)
   const { token, spotifyApi } = useSpotifyInstance()
   const queryClient = useQueryClient()

   const { data: userPlaylists, isLoading } = useSpotifyQuery({
      queryKey: ['userPlaylists'],
      endpoint: '/me/playlists',
   })
   useEffect(() => {
      if (userPlaylists) {
         fetch(userPlaylists.items.at(0).tracks.href, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
            .then((res) => res.json())
            .then((res) => {
               // dispatch(setCurrentSong(res.items.at(0)))
            })

         // fetch(userPlaylists[0].tracks.href).then((res) => {
         //    console.log(res)
         // })
      }
   }, [userPlaylists])

   const { data: user } = useSpotifyQuery({
      queryKey: ['user'],
      endpoint: '/me',
   })

   return (
      <Flex direction={'column'} className="relative transition-all duration-300">
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
                  <Tooltip content="Create Playlist" delayDuration={0}>
                     <Button
                        variant="ghost"
                        className="color-white h-[30px] w-[20px] rounded"
                        color="white"
                        onClick={() => setOpenCreatePlaylistModal(true)}
                     >
                        <PlusIcon />
                     </Button>
                  </Tooltip>
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
            className={`${className} overflow-y-scroll m-2 relative rounded-lg h-[calc(100vh-120px)]`}
         >
            {isLoading ? (
               // Skeleton loading state for playlists
               Array.from({ length: 20 }).map((_, index) => (
                  <Flex
                     direction={'row'}
                     key={`skeleton-${index}`}
                     className={`${!sidebarClosed && 'pr-3'} rounded-md overflow-hidden mb-2 pl-3`}
                  >
                     <Flex justify="" align="center" className="w-full">
                        <Skeleton className="w-12 h-12" />
                        {!sidebarClosed && (
                           <Flex
                              direction="column"
                              className="ml-2"
                              gap="1"
                           >
                              <Skeleton>
                                 <Text className="text-sm">Playlist Name</Text>
                              </Skeleton>
                              <Skeleton>
                                 <Text className="text-xs">Creator Name</Text>
                              </Skeleton>
                           </Flex>
                        )}
                     </Flex>
                  </Flex>
               ))
            ) : (
               userPlaylists?.items?.map((playlist) => {
                  return (
                     <Flex
                        direction={'row'}
                        key={playlist?.id}
                        onClick={() => {
                           navigate('/playlist/' + playlist?.id)
                        }}
                        className={`${
                           (playlist?.id === id || (location.pathname.startsWith('/playlist/') && location.pathname.split('/')[2] === playlist?.id)) 
                           ? 'bg-red-100' 
                           : ''
                        } ${
                           (playlist?.id !== id && (!location.pathname.startsWith('/playlist/') || location.pathname.split('/')[2] !== playlist?.id))
                           ? 'hover:bg-red-50' 
                           : ''
                        } ${
                           !sidebarClosed && 'pr-3'
                        } active:bg-red-100 transition-all duration-300  rounded-md  overflow-hidden`}
                     >
                        <Flex justify="" align="center" className="w-full">
                           <Box>
                              {playlist?.images?.at(0)?.url ? (
                                 <img
                                    className="sidebar-image object-cover w-10 h-10 max-w-fit "
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
                              <Flex
                                 direction="column"
                                 className="ml-2 select-none"
                              >
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
                  )
               })
            )}
            {/* <EmbedPlayer

            /> */}
         </Box>
         <CreatePlaylist
            modalState={openCreatePlaylistModal}
            setModalState={setOpenCreatePlaylistModal}
         />
      </Flex>
   )
}

export default Sidebar
