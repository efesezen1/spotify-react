import { Box, Skeleton, Switch, Tooltip } from '@radix-ui/themes'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Flex, Text, Button } from '@radix-ui/themes'

import Library from './icon/Library'
import {
   ArrowLeftIcon,
   Cross2Icon,
   PlusIcon,
   ValueNoneIcon,
   PlayIcon,
   PauseIcon,
} from '@radix-ui/react-icons'

import { useNavigate, useParams } from 'react-router-dom'
import useSpotifyInstance from '../hook/spotifyInstance'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import PlaylistDialog from './PlaylistDialog'
import { setContextUri, setIsPlaying } from '../store/slicers/userSlice'
import AudioWave from './icon/AudioWave'

const Sidebar = ({ className, sidebarClosed, setSidebarClosed }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const params = useParams()
   const [currentUri, setCurrentUri] = useState('')
   const { selectedPlaylist, isPlaying, contextUri } = useSelector(
      (state) => state.user
   )
   const id = selectedPlaylist?.id
   const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState(false)
   const [isPublic, setIsPublic] = useState(false)
   const { spotifyApi } = useSpotifyInstance()

   const { data: userPlaylists, isLoading } = useSpotifyQuery({
      queryKey: ['userPlaylists'],
      endpoint: '/me/playlists',
   })

   const playPlaylist = (uri) => {
      setCurrentUri(uri)
      spotifyApi
         .put('/me/player/play', {
            context_uri: uri,
            offset: { position: 0 },
         })
         .then(() => {
            dispatch(setIsPlaying(true))
         })
   }

   return (
      <Flex
         direction={'column'}
         className="relative transition-all duration-300"
      >
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
               <Flex gap="2" align="center">
                  <PlaylistDialog
                     modalState={openCreatePlaylistModal}
                     setModalState={setOpenCreatePlaylistModal}
                     isPublic={isPublic}
                     setIsPublic={setIsPublic}
                     mode="create"
                     onSuccess={(id) => navigate('/playlist/' + id)}
                  >
                     <Tooltip content="Create Playlist">
                        <Button
                           variant="ghost"
                           className="h-8 w-8 rounded flex items-center justify-center"
                           color="gray"
                           onClick={() => {
                              setOpenCreatePlaylistModal(true)
                           }}
                        >
                           <PlusIcon className="h-4 w-4" />
                        </Button>
                     </Tooltip>
                  </PlaylistDialog>
                  <Tooltip content="Minimize Sidebar">
                     <Button
                        variant="ghost"
                        color="gray"
                        className="h-8 w-8 rounded flex items-center justify-center"
                        onClick={() => setSidebarClosed(!sidebarClosed)}
                     >
                        <ArrowLeftIcon className="h-4 w-4" />
                     </Button>
                  </Tooltip>
               </Flex>
            )}
         </Flex>
         <Box
            className={`${className} overflow-y-scroll scrollbar-hide relative rounded-lg h-[calc(100vh-120px)] ${
               isLoading ? 'pl-2' : 'pl-3'
            } `}
         >
            {isLoading
               ? // Skeleton loading state for playlists
                 Array.from({ length: 20 }).map((_, index) => (
                    <Flex
                       direction={'row'}
                       key={`skeleton-${index}`}
                       className={`${
                          !sidebarClosed && 'pr-3'
                       } rounded-md overflow-hidden mb-2 `}
                    >
                       <Flex justify="" align="center" className="w-full">
                          {/* <Skeleton className="sidebar-image object-cover w-10 h-10 max-w-fit" /> */}
                          <Skeleton className="w-12 h-12 sidebar-image object-cover " />
                          {!sidebarClosed && (
                             <Flex direction="column" className="ml-2" gap="1">
                                <Skeleton>
                                   <Text className="text-sm">
                                      Playlist Name
                                   </Text>
                                </Skeleton>
                                <Skeleton>
                                   <Text className="text-xs">Creator Name</Text>
                                </Skeleton>
                             </Flex>
                          )}
                       </Flex>
                    </Flex>
                 ))
               : userPlaylists?.items?.map((playlist) => {
                    return (
                       <Flex
                          direction={'row'}
                          key={playlist?.id}
                          onClick={() => {
                             navigate(`/playlist/${playlist.id}`)
                          }}
                          onDoubleClick={() => {
                             playPlaylist(playlist.uri)
                             dispatch(setContextUri(playlist.uri))
                          }}
                          className={`group ${
                             playlist?.id === id ||
                             (location.pathname.startsWith('/playlist/') &&
                                location.pathname.split('/')[2] ===
                                   playlist?.id)
                                ? 'bg-red-100'
                                : ''
                          } ${
                             playlist?.id !== id &&
                             (!location.pathname.startsWith('/playlist/') ||
                                location.pathname.split('/')[2] !==
                                   playlist?.id)
                                ? 'hover:bg-red-50'
                                : ''
                          } ${
                             !sidebarClosed && 'pr-3'
                          } active:bg-red-100 transition-all duration-300  rounded-md  overflow-hidden`}
                       >
                          <Flex
                             justify=""
                             align="center"
                             className={`w-full ${sidebarClosed && 'mx-auto'}`}
                          >
                             <Box
                                className="relative"
                                //   onClick={() => {
                                //      playPlaylist(playlist.uri)
                                //   }}
                             >
                                {playlist?.images?.at(0)?.url ? (
                                   <>
                                      <img
                                         className="sidebar-image object-cover w-10 h-10 max-w-fit transition-all duration-300 group-hover:brightness-75"
                                         src={playlist?.images?.at(0)?.url}
                                         alt=""
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                         {/* <PlayIcon className="w-5 h-5 text-white" /> */}
                                         {currentUri === playlist.uri &&
                                         isPlaying ? (
                                            <PauseIcon className="w-5 h-5 text-white" />
                                         ) : (
                                            <PlayIcon className="w-5 h-5 text-white" />
                                         )}
                                      </div>
                                   </>
                                ) : (
                                   <Box className="sidebar-image w-10 h-10 flex justify-center items-center group-hover:brightness-75 transition-all duration-300">
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
                                      {playlist?.owner?.display_name ||
                                         'Unknown'}
                                   </Text>
                                </Flex>
                             )}
                          </Flex>
                          <Flex align="center">
                             {playlist.uri === contextUri && !sidebarClosed && (
                                <motion.div
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                >
                                   <AudioWave />
                                </motion.div>
                             )}
                          </Flex>
                       </Flex>
                    )
                 })}
            {/* <EmbedPlayer

            /> */}
         </Box>
      </Flex>
   )
}

export default Sidebar
