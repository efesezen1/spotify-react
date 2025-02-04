import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Box, Flex, Text, Button, Skeleton } from '@radix-ui/themes'
import useSpotifyInstance from '../hook/spotifyInstance'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import TrackTable from '../components/TrackTable'
import { motion, AnimatePresence } from 'framer-motion'

const Artist = () => {
   const params = useParams()
   const id = params.id
   const [hoverOnFollowBtn, setHoverOnFollowBtn] = useState(false)
   const dispatch = useDispatch()
   const queryClient = useQueryClient()

   const humanReadableNum = (number) => {
      let numStr = number.toString()
      let counter = 0
      let res = ''
      for (let i = numStr.length - 1; i >= 0; i--) {
         res = numStr[i] + res
         counter++
         if (counter % 3 === 0 && i !== 0) {
            res = '.' + res
         }
      }
      return res
   }

   const { token, spotifyApi } = useSpotifyInstance()

   const followMutation = useMutation({
      mutationFn: async () => {
         const res = await spotifyApi.put(`/me/following?type=artist&ids=${id}`)
         return res.data
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['isFollowing', id] })
      },
   })

   const unfollowMutation = useMutation({
      mutationFn: async () => {
         const res = await spotifyApi.delete(
            `/me/following?type=artist&ids=${id}`
         )
         return res.data
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['isFollowing', id] })
      },
   })

   const { data: isFollowing } = useSpotifyQuery({
      queryKey: ['isFollowing', id],
      endpoint: `/me/following/contains?type=artist&ids=${id}`,
   })

   const { data: popularSongs, isLoading: isPopularSongsLoading } =
      useSpotifyQuery({
         queryKey: ['popularSongs', id],
         endpoint: `/artists/${id}/top-tracks`,
      })

   React.useEffect(() => {
      if (popularSongs) {
         // Removed console.log statement
      }
   }, [popularSongs])

   const { data: albums, isLoading: isAlbumsLoading } = useSpotifyQuery({
      queryKey: ['albums', id],
      endpoint: `/artists/${id}/albums`,
   })

   const { data: artist, isLoading: isArtistLoading } = useSpotifyQuery({
      queryKey: ['artist', id],
      endpoint: `/artists/${id}`,
   })

   const hoverClass = (item) => ''

   const activeClass = (item) => ''

   const formatDuration = (ms) => {
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
   }

   return (
      <Flex
         className="rounded bg-gradient-to-b from-lime-500 via-white via-50% to-slate-white h-full w-full overflow-y-scroll"
         direction="column"
         align={'center'}
      >
         {/* USER INFO */}
         <Flex direction="column" className="w-full">
            <Flex direction="row" className="mb-8">
               <Flex className="p-5">
                  {isArtistLoading ? (
                     <Skeleton className="w-[125px] h-[125px] rounded-full" />
                  ) : artist?.images?.at(0)?.url ? (
                     <img
                        src={artist?.images?.at(0)?.url}
                        alt=""
                        className="hero-image rounded-full object-cover w-[200px] h-[200px]"
                     />
                  ) : (
                     <Flex
                        className="hero-image bg-gray-200 rounded-full w-[200px] h-[200px]"
                        align={'center'}
                        justify={'center'}
                     ></Flex>
                  )}
               </Flex>

               <Flex direction="column" className="my-5" justify="end">
                  {isArtistLoading ? (
                     <>
                        <Skeleton className="mb-2 w-16">
                           <Text size="1">Artist</Text>
                        </Skeleton>
                        <Skeleton className="mb-4 w-96">
                           <Text size="9" className="font-bold">
                              Artist Name
                           </Text>
                        </Skeleton>
                        <Skeleton className="mb-4 w-32">
                           <Text size="1">1,234,567 Followers</Text>
                        </Skeleton>
                        <Box className="mt-2">
                           <Skeleton className="w-24">
                              <Button variant="solid" color="blue">
                                 Follow
                              </Button>
                           </Skeleton>
                        </Box>
                     </>
                  ) : (
                     <>
                        <Text
                           size="1"
                           weight="light"
                           className="ml-1 select-none"
                           color="gray"
                        >
                           {artist?.type || ''}
                        </Text>
                        <Flex direction="column">
                           <Text
                              size="9"
                              weight="bold"
                              className="select-none text-6xl md:text-7xl lg:text-8xl"
                           >
                              {artist?.name || ''}
                           </Text>
                           <Text
                              className="mr-10 mt-3 ml-1 select-none"
                              size="2"
                              color="gray"
                           ></Text>
                           <Flex direction="row" className="w-full">
                              <Text
                                 className="mr-10 mt-3 ml-1 select-none"
                                 size="1"
                                 color="gray"
                              >
                                 {artist?.followers?.total &&
                                    `${humanReadableNum(
                                       artist?.followers?.total
                                    )} Followers`}
                              </Text>
                              {/* follow status */}
                              <Box>
                                 <motion.div layout>
                                    {isFollowing?.at(0) ? (
                                       <Button
                                          variant="solid"
                                          style={{
                                             backgroundColor: hoverOnFollowBtn ? '#ef4444' : '#2563eb',
                                             transition: 'background-color 0.2s ease'
                                          }}
                                          onMouseLeave={() => setHoverOnFollowBtn(false)}
                                          onMouseEnter={() => setHoverOnFollowBtn(true)}
                                          onClick={() => unfollowMutation.mutate()}
                                       >
                                          <motion.span
                                             key={hoverOnFollowBtn ? "unfollow" : "following"}
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             exit={{ opacity: 0 }}
                                             transition={{ duration: 0.15 }}
                                          >
                                             {hoverOnFollowBtn ? "Unfollow" : "Following"}
                                          </motion.span>
                                       </Button>
                                    ) : (
                                       <Button
                                          variant="solid"
                                          color="blue"
                                          onClick={() => followMutation.mutate()}
                                       >
                                          <motion.span
                                             key="follow"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             exit={{ opacity: 0 }}
                                             transition={{ duration: 0.15 }}
                                          >
                                             Follow
                                          </motion.span>
                                       </Button>
                                    )}
                                 </motion.div>
                              </Box>
                           </Flex>
                        </Flex>
                     </>
                  )}
               </Flex>
            </Flex>
            {(popularSongs || isPopularSongsLoading) && (
               <Box className="px-8 mb-6">
                  {isPopularSongsLoading ? (
                     <Skeleton className="w-32 mb-4">
                        <Text weight="bold" size="7">
                           Popular
                        </Text>
                     </Skeleton>
                  ) : (
                     <Text weight="bold" size="7">
                        Popular
                     </Text>
                  )}
               </Box>
            )}
            {(popularSongs?.tracks || isPopularSongsLoading) && (
               <Box className="px-8">
                  <TrackTable
                     tracks={popularSongs?.tracks}
                     isPlaylist={false}
                     isLoading={isPopularSongsLoading}
                  />
               </Box>
            )}
         </Flex>
      </Flex>
   )
}

export default Artist
