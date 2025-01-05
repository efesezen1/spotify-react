import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Text, Flex, Button, TextField, Skeleton } from '@radix-ui/themes'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ValueNoneIcon, PlayIcon, PauseIcon } from '@radix-ui/react-icons'
import useSpotifyInstance from '../hook/spotifyInstance'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { setCurrentSong, setIsPlaying } from '../store/slicers/userSlice'
import { motion } from 'framer-motion'

const Shows = () => {
   const { id } = useParams()
   const dispatch = useDispatch()
   const queryClient = useQueryClient()
   const { token, spotifyApi } = useSpotifyInstance()
   const container = useRef(null)
   const navigate = useNavigate()
   const { currentSong, isPlaying } = useSelector((state) => state.user)
   const [selectedEpisode, setSelectedEpisode] = useState(null)
   const [currentEpisodeOnHover, setCurrentEpisodeOnHover] = useState(null)

   const { data: show, isLoading: isShowLoading } = useSpotifyQuery({
      queryKey: ['show', id],
      endpoint: `/shows/${id}`,
   })

   const formatDuration = (ms) => {
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
   }

   const timeAgo = (date) => {
      const now = new Date()
      const diff = now - new Date(date)

      const units = [
         { name: 'year', factor: 31536000000 },
         { name: 'day', factor: 86400000 },
         { name: 'hour', factor: 3600000 },
         { name: 'minute', factor: 60000 },
         { name: 'second', factor: 1000 },
      ]

      for (const unit of units) {
         const value = Math.floor(diff / unit.factor)
         if (value > 0) {
            return `${value} ${unit.name}${value > 1 ? 's' : ''} ago`
         }
      }

      return 'just now'
   }

   const handlePlay = (episode) => {
      if (currentSong?.id === episode.id) {
         dispatch(setIsPlaying(!isPlaying))
      } else {
         dispatch(setCurrentSong(episode))
         dispatch(setIsPlaying(true))
      }
   }

   const hoverClass = (episode) =>
      selectedEpisode !== episode.id ? 'hover:backdrop-brightness-95' : ''

   const activeClass = (episode) =>
      selectedEpisode === episode.id ? 'backdrop-brightness-90' : ''

   return (
      <Flex
         direction="column"
         className="rounded bg-gradient-to-b from-red-100 via-white via-50% to-slate-white h-full w-full overflow-y-scroll"
         ref={container}
      >
         <Flex direction="row" className="w-full">
            <Flex className="p-5 h-full items-center aspect-square">
               {isShowLoading ? (
                  <Skeleton width="100%" height="100%" className="rounded" />
               ) : show?.images?.at(0)?.url ? (
                  <img
                     src={show?.images?.at(0)?.url}
                     alt=""
                     className="hero-image rounded object-cover w-full h-full"
                  />
               ) : (
                  <Flex
                     className="hero-image rounded bg-gray-200"
                     align={'center'}
                     justify="center"
                  >
                     <ValueNoneIcon />
                  </Flex>
               )}
            </Flex>
            <Flex direction="column" className="p-5 justify-end" gap="3">
               {isShowLoading ? (
                  <>
                     <Skeleton>
                        <Text size="1">PODCAST</Text>
                     </Skeleton>
                     <Skeleton>
                        <Text size="8" className="font-bold">
                           Show Title
                        </Text>
                     </Skeleton>
                     <Skeleton>
                        <Text>Show Description</Text>
                     </Skeleton>
                     <Skeleton>
                        <Text>Show Info</Text>
                     </Skeleton>
                  </>
               ) : (
                  <>
                     <Text size="1">PODCAST</Text>
                     <Text size="8" className="font-bold text-6xl md:text-7xl lg:text-8xl">
                        {show?.name}
                     </Text>
                     <Text className="line-clamp-2">{show?.description}</Text>
                     <Text>By {show?.publisher} • {show?.total_episodes} episodes</Text>
                  </>
               )}
            </Flex>
         </Flex>
         
         <Box className="p-5">
            <Text size="6" weight="bold" className="mb-4">
               All Episodes
            </Text>
            {isShowLoading ? (
               Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-20 mb-2 rounded" />
               ))
            ) : (
               show?.episodes?.items.map((episode) => (
                  <motion.div
                     key={episode.id}
                     onClick={() => setSelectedEpisode(episode.id)}
                     onMouseEnter={() => setCurrentEpisodeOnHover(episode.id)}
                     onMouseLeave={() => setCurrentEpisodeOnHover(null)}
                     className={`grid grid-cols-[48px_1fr_120px] gap-4 p-2 px-4 items-center select-none active:backdrop-brightness-90 ${hoverClass(episode)} ${activeClass(episode)}`}
                  >
                     <motion.div>
                        <Flex align="center" gap="3">
                           {currentEpisodeOnHover === episode.id ? (
                              <button
                                 className="w-4"
                                 onClick={(e) => {
                                    e.stopPropagation()
                                    handlePlay(episode)
                                 }}
                              >
                                 {currentSong?.id === episode.id && isPlaying ? (
                                    <PauseIcon />
                                 ) : (
                                    <PlayIcon />
                                 )}
                              </button>
                           ) : (
                              <Text size="2" className="w-4">
                                 {show.episodes.items.indexOf(episode) + 1}
                              </Text>
                           )}
                        </Flex>
                     </motion.div>

                     <motion.div>
                        <Flex align="center" gap="3">
                           {episode?.images?.at(0)?.url && (
                              <img
                                 src={episode.images?.at(0)?.url}
                                 className="w-10 h-10 rounded"
                                 alt=""
                              />
                           )}
                           <Flex direction="column">
                              <Text>{episode?.name}</Text>
                              <Text size="1" color="gray">
                                 {episode?.description}
                              </Text>
                           </Flex>
                        </Flex>
                     </motion.div>

                     <motion.div>
                        <Text size="2">{formatDuration(episode?.duration_ms)}</Text>
                     </motion.div>
                  </motion.div>
               ))
            )}
         </Box>
      </Flex>
   )
}

export default Shows
