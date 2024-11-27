import { Box, Text, Flex, Skeleton } from '@radix-ui/themes'
import React, { useRef, useEffect } from 'react'
import {
   ChevronLeftIcon,
   ChevronRightIcon,
   PlayIcon,
} from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setContextUri, setIsPlaying } from '../store/slicers/userSlice'
import useSpotifyInstance from '../hook/spotifyInstance'
import AudioWave from './icon/AudioWave'

const ItemRow = ({ playlistRecommendations, isLoading }) => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const containerRef = useRef(null)
   const { spotifyApi } = useSpotifyInstance()
   const { contextUri, isPlaying } = useSelector((state) => state.user)

   const handleScroll = (direction) => {
      const container = containerRef.current
      if (container) {
         const firstItem = container.querySelector('[class*="w-[150px]"]')
         if (!firstItem) return

         const itemWidth = firstItem.offsetWidth
         const gap = 16 // gap-4 equals 16px
         const scrollAmount = itemWidth + gap

         const targetScroll =
            direction === 'left'
               ? container.scrollLeft - scrollAmount
               : container.scrollLeft + scrollAmount

         container.scrollTo({
            left: targetScroll,
            behavior: 'smooth',
         })
      }
   }

   const playPlaylist = (uri, e) => {
      e.stopPropagation() // Prevent navigation when clicking play button
      spotifyApi
         .put('/me/player/play', {
            context_uri: uri,
            offset: { position: 0 },
         })
         .then(() => {
            dispatch(setIsPlaying(true))
            dispatch(setContextUri(uri))
         })
   }

   return (
      <Flex direction="column" className="">
         <Flex direction="column" className="w-[100%]" gap="3">
            <Flex justify="between" align="center" mt="2">
               <Box pl="1">
                  {isLoading ? (
                     <Skeleton>
                        <Text size="5" weight="bold" mb="4">
                           Featured Playlists
                        </Text>
                     </Skeleton>
                  ) : (
                     playlistRecommendations?.message && (
                        <Text size="5" weight="bold" ml="3">
                           {playlistRecommendations?.message}
                        </Text>
                     )
                  )}
               </Box>
               <Box />
               <Flex gap="2">
                  <Box
                     variant="ghost"
                     onClick={() => handleScroll('left')}
                     className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
                  >
                     <ChevronLeftIcon width="20" height="20" />
                  </Box>
                  <Box
                     variant="ghost"
                     onClick={() => handleScroll('right')}
                     className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
                  >
                     <ChevronRightIcon width="20" height="20" />
                  </Box>
               </Flex>
            </Flex>
            <Box className="relative overflow-hidden">
               <div
                  ref={containerRef}
                  className="overflow-x-scroll scrollbar-hide scroll-smooth snap-x snap-mandatory"
               >
                  <Flex className="gap-4 w-full">
                     <div className="grid auto-cols-max grid-flow-col gap-4 px-4">
                        {isLoading
                           ? Array.from({ length: 8 }).map((_, index) => (
                                <div
                                   key={`skeleton-${index}`}
                                   className="w-[150px] initial:w-[300px] xs:w-[230px] sm:w-[220px] md:w-[170px] lg:w-[150px] xl:w-[150px] snap-start"
                                >
                                   <Box className="w-full aspect-square">
                                      <Skeleton className="w-full h-full rounded-md" />
                                   </Box>
                                   <Flex direction="column" p="2" gap="2">
                                      <Skeleton>
                                         <Text
                                            size="2"
                                            weight="bold"
                                            className="w-full"
                                         >
                                            Playlist Name That Is Long
                                         </Text>
                                      </Skeleton>
                                      <Skeleton>
                                         <Text
                                            size="1"
                                            color="gray"
                                            className="w-3/4"
                                         >
                                            Creator Name
                                         </Text>
                                      </Skeleton>
                                   </Flex>
                                </div>
                             ))
                           : playlistRecommendations?.playlists?.items.map(
                                (playlist) => (
                                   <div
                                      key={playlist.id}
                                      className="w-[150px] initial:w-[300px] xs:w-[230px] sm:w-[220px] md:w-[170px] lg:w-[150px] xl:w-[150px] snap-start"
                                   >
                                      <Box
                                         onClick={() =>
                                            navigate(`/playlist/${playlist.id}`)
                                         }
                                         className="group hover:backdrop-brightness-95 active:backdrop-brightness-90 rounded p-1 transition-all duration-200"
                                      >
                                         <div className="relative">
                                            <img
                                               src={playlist.images[0].url}
                                               alt="playlist"
                                               className="w-full h-full object-contain rounded select-none group-hover:brightness-95 transition-all duration-200"
                                               draggable={false}
                                            />
                                            <div 
                                               className="absolute bottom-2 right-2 bg-red-600 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                                               onClick={(e) => playPlaylist(playlist.uri, e)}
                                            >
                                               {contextUri === playlist.uri && isPlaying ? (
                                                  <AudioWave className="w-5 h-5" color="#FFFFFF" />
                                               ) : (
                                                  <PlayIcon className="text-white w-5 h-5" />
                                               )}
                                            </div>
                                         </div>
                                         <Flex direction="column" p="1">
                                            <Text
                                               size="2"
                                               weight="bold"
                                               className="select-none"
                                            >
                                               {playlist.name}
                                            </Text>
                                            <Text
                                               size="1"
                                               weight=""
                                               color="gray"
                                               className="select-none"
                                            >
                                               {playlist.owner.display_name}
                                            </Text>
                                         </Flex>
                                      </Box>
                                   </div>
                                )
                             )}
                     </div>
                  </Flex>
               </div>
            </Box>
         </Flex>
      </Flex>
   )
}

export default ItemRow
