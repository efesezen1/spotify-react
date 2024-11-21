import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Box, Flex, Text, Button, Skeleton } from '@radix-ui/themes'
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons'
import useSpotifyInstance from '../hook/spotifyInstance'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import TrackTable from '../components/TrackTable'

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

   const { data: popularSongs, isLoading: isPopularSongsLoading } = useSpotifyQuery({
      queryKey: ['popularSongs', id],
      endpoint: `/artists/${id}/top-tracks`,
   })

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
         <Flex direction="column" className="w-full ">
            <Flex direction="row" className=" ">
               <Flex className="p-5 ">
                  {isArtistLoading ? (
                     <Skeleton className="w-[150px] h-[150px] rounded-full" />
                  ) : artist?.images[1]?.url ? (
                     <img
                        src={artist?.images[0]?.url}
                        alt=""
                        className=" hero-image rounded-full object-cover  "
                     />
                  ) : (
                     <Flex
                        className="hero-image bg-gray-200 rounded-full"
                        align={'center'}
                        justify={'center'}
                     ></Flex>
                  )}
               </Flex>

               <Flex direction="column" className="my-5" justify="end">
                  {isArtistLoading ? (
                     <>
                        <Skeleton>
                           <Text size="1" className="ml-1">Artist</Text>
                        </Skeleton>
                        <Skeleton>
                           <Text size="9" className="font-bold">Artist Name</Text>
                        </Skeleton>
                        <Skeleton>
                           <Text size="1">1,234,567 Followers</Text>
                        </Skeleton>
                        <Box className="mt-3">
                           <Skeleton>
                              <Button variant="solid" color="blue">Follow</Button>
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
                           <Text size="9" weight="bold" className="select-none">
                              {artist?.name || ''}
                           </Text>
                           <Text
                              className="mr-10  mt-3 ml-1 select-none"
                              size="2"
                              color="gray"
                           ></Text>
                           <Flex direction="row" className=" w-full">
                              <Text
                                 className="mr-10  mt-3 ml-1 select-none"
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
                                 {isFollowing?.at(0) ? (
                                    hoverOnFollowBtn ? (
                                       <Button
                                          variant="solid"
                                          color="red"
                                          onMouseLeave={() =>
                                             setHoverOnFollowBtn(false)
                                          }
                                          onClick={() => unfollowMutation.mutate()}
                                       >
                                          Unfollow
                                       </Button>
                                    ) : (
                                       <Button
                                          variant="solid"
                                          color="blue"
                                          onMouseEnter={() =>
                                             setHoverOnFollowBtn(true)
                                          }
                                       >
                                          Following
                                       </Button>
                                    )
                                 ) : (
                                    <Button
                                       variant="solid"
                                       color="blue"
                                       onClick={() => followMutation.mutate()}
                                    >
                                       Follow
                                    </Button>
                                 )}
                              </Box>
                           </Flex>
                        </Flex>
                     </>
                  )}
               </Flex>
            </Flex>
            {(popularSongs || isPopularSongsLoading) && (
               <Text weight="bold" size="7" className="ml-3">
                  Popular
               </Text>
            )}
            {(popularSongs?.tracks || isPopularSongsLoading) && (
               <TrackTable
                  tracks={popularSongs?.tracks}
                  isPlaylist={false}
                  isLoading={isPopularSongsLoading}
               />
            )}
         </Flex>
      </Flex>
   )
}

export default Artist
