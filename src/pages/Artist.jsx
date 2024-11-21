import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setCurrentSong, setIsPlaying } from '../store/slicers/userSlice'
import { Box, Flex, Text, Table, Button } from '@radix-ui/themes'
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons'
import useSpotifyInstance from '../hook/spotifyInstance'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import TrackStatus from '../components/TrackStatus'

const Artist = () => {
   const params = useParams()
   const id = params.id

   const [hoverOnFollowBtn, setHoverOnFollowBtn] = useState(false)
   const dispatch = useDispatch()
   const [selectedTrack, setSelectedTrack] = useState(null)
   const [currentUserIdOnHover, setCurrentUserIdOnHover] = useState(null)
   const queryClient = useQueryClient()
   let humanReadableNum = (number) => {
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
      endpoint: `/me/following/contains?type=artist&ids=${id}`
   })

   const { data: popularSongs } = useSpotifyQuery({
      queryKey: ['popularSongs', id],
      endpoint: `/artists/${id}/top-tracks`
   })

   const { data: albums } = useSpotifyQuery({
      queryKey: ['albums', id],
      endpoint: `/artists/${id}/albums`
   })

   const { data: artist } = useSpotifyQuery({
      queryKey: ['artist', id],
      endpoint: `/artists/${id}`
   })

   useEffect(() => {
      // if (isFollowing.length === 0) return
   }, [isFollowing])

   const hoverClass = (item) =>
      selectedTrack !== item.id ? 'hover:backdrop-brightness-95' : ''

   const activeClass = (item) =>
      selectedTrack === item.id ? 'backdrop-brightness-90' : ''
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
         onClick={() => setSelectedTrack(null)}
      >
         {/* USER INFO */}
         <Flex direction="column" className="w-full ">
            <Flex direction="row" className=" ">
               <Flex className="p-5 ">
                  {artist?.images[1]?.url ? (
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
                           {isFollowing ? (
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
               </Flex>
            </Flex>
            {popularSongs && (
               <Text weight="bold" size="7" className="ml-3">
                  Popular
               </Text>
            )}
            <Table.Root
               size="2"
               layout=""
               className="overflow-y-scroll"
               onClick={(e) => e.stopPropagation()}
            >
               {/* <Table.Header className="sticky top-0 left-0  backdrop-brightness-100 backdrop-blur-3xl z-10">
                  <Table.Row>
                     <Table.ColumnHeaderCell>
                        <Box className="text-xs">#</Box>
                     </Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>
                        <Box className="text-xs">Title</Box>
                     </Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>
                        <Box className="text-xs">Album</Box>
                     </Table.ColumnHeaderCell>

                     <Table.ColumnHeaderCell>
                        <Box className="text-xs">
                           <TimerIcon />
                        </Box>
                     </Table.ColumnHeaderCell>
                  </Table.Row>
               </Table.Header> */}

               <Table.Body>
                  {popularSongs?.tracks?.map((item, index) => {
                     return (
                        <Table.Row
                           key={item?.id}
                           onClick={() => {
                              setSelectedTrack(item.id)
                           }}
                           onMouseEnter={() => {
                              setCurrentUserIdOnHover(item.id)
                           }}
                           onMouseLeave={() => setCurrentUserIdOnHover(null)}
                           className={`select-none active:backdrop-brightness-90 ${hoverClass(
                              item
                           )} ${activeClass(item)}`}
                        >
                           <Table.RowHeaderCell>
                              <TrackStatus
                                 item={item}
                                 index={index}
                                 currentUserIdOnHover={currentUserIdOnHover}
                                 selectedTrack={selectedTrack}
                              />
                           </Table.RowHeaderCell>
                           <Table.Cell>
                              <Flex direction={'column'}>
                                 {/* Song Title */}
                                 <Text size="2">{item?.name}</Text>
                                 {/* Artists */}
                                 {/* <Text size="1">
                                    {item.artists
                                       .map((artist) => artist?.name)
                                       .join(', ')}
                                 </Text> */}
                              </Flex>
                           </Table.Cell>
                           <Table.Cell>
                              {/* Album Name */}
                              <Text size="2">{item?.album?.name}</Text>
                           </Table.Cell>

                           <Table.Cell>
                              <Text size="2">
                                 {formatDuration(item?.duration_ms)}
                              </Text>
                           </Table.Cell>
                        </Table.Row>
                     )
                  })}
               </Table.Body>
            </Table.Root>
            {/* <Flex
               direction="column"
               align={{ xs: 'center', md: 'start' }}
               className="overflow-y-scroll overflow-x-hidden"
            >
               <Box pl="1" className="w-full">
                  <Text
                     size="5"
                     weight="bold"
                     className="hover:underline select-none w-full  "
                  ></Text>
               </Box>
               <Box className=" w-full overflow-y-scroll">
                  <Grid
                     columns={{
                        initial: '1',
                        xs: '2',
                        sm: '3',
                        md: '5',
                        lg: '7',
                        xl: '9',
                     }}
                     align="center"
                     className="w-full "
                  >
                     {topItems?.items.map((artist) => (
                        <Flex
                           align={'center'}
                           direction={'column'}
                           key={artist.id}
                           onClick={() => navigate(`/artist/${artist.id}`)}
                           className="hover:backdrop-brightness-95 active:backdrop-brightness-90 rounded   transition-all duration-200   p-3 "
                        >
                           <img
                              src={artist.images[0].url}
                              alt="artist"
                              className="  object-cover rounded-lg  w-[10rem] h-[10rem] mx-auto "
                           />
                           <Flex
                              direction="column"
                              p="1"
                              className="w-[10rem]  justify-center "
                           >
                              <Text size="2" weight="bold " className="">
                                 {artist.name}
                              </Text>
                              <Text size="1" weight="" color="gray">
                                 {artist.type}
                              </Text>
                           </Flex>
                        </Flex>
                     ))}
                  </Grid>
               </Box>
            </Flex> */}
         </Flex>
      </Flex>
   )
}

export default Artist
