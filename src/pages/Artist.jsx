import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
   fetchArtist,
   setCurrentArtist,
   setIsFollowing,
   checkIsFollowing,
   followOrUnfollow,
} from '../store/slicers/userSlice'
import { Box, Flex, Text, Grid, Table, Button } from '@radix-ui/themes'
import * as Popover from '@radix-ui/react-popover'
import { PauseIcon, PlayIcon, TimerIcon } from '@radix-ui/react-icons'
const Artist = () => {
   const params = useParams()
   const id = params.id

   const { token, currentArtist, isFollowing } = useSelector(
      (state) => state.user
   )
   const [followStatus, setFollowStatus] = useState(false)
   const [hoverOnFollowBtn, setHoverOnFollowBtn] = useState(false)
   const dispatch = useDispatch(fetchArtist)
   const [artist, setArtist] = useState(null)
   const [popularSongs, setPopularSongs] = useState(null)
   const [albums, setAlbums] = useState(null)
   const [selectedTrack, setSelectedTrack] = useState(null)
   const [currentUserIdOnHover, setCurrentUserIdOnHover] = useState(null)

   useEffect(() => {
      if (id && !token) return

      dispatch(
         checkIsFollowing({
            type: 'artist',
            id,
         })
      )
   }, [currentArtist])

   useEffect(() => {
      if (isFollowing.length === 0) return
   }, [isFollowing])

   const hoverClass = (item) =>
      selectedTrack !== item.id ? 'hover:backdrop-brightness-95' : ''
   useEffect(() => {
      if (!token || !id) return
      dispatch(fetchArtist({ token, id }))
   }, [token, id])
   const activeClass = (item) =>
      selectedTrack === item.id ? 'backdrop-brightness-90' : ''
   const formatDuration = (ms) => {
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
   }

   useEffect(() => {
      if (!currentArtist) return
      const { artist, popularSongs, albums } = currentArtist
      setArtist(artist)
      setPopularSongs(popularSongs.tracks)
      setAlbums(albums)

      return () => {
         dispatch(setCurrentArtist(null))
         setSelectedTrack(null)
      }
   }, [currentArtist])

   useEffect(() => {
      return () => {
         dispatch(setIsFollowing(false))
      }
   }, [])

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
                     <></>
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
                           className="mr-10  mt-3 ml-1"
                           size="1"
                           color="gray"
                        >
                           {artist?.followers?.total &&
                              `${artist?.followers?.total} Followers`}
                        </Text>
                        {/* follow status */}
                        {/* <Box>
                           {isFollowing ? (
                              hoverOnFollowBtn ? (
                                 <Button
                                    variant="outline"
                                    color="blue"
                                    onMouseLeave={() =>
                                       setHoverOnFollowBtn(false)
                                    }
                                    onClick={() => {
                                       dispatch(
                                          followOrUnfollow({
                                             type: 'artist',
                                             id,
                                             action: 'unfollow',
                                          })
                                       )
                                    }}
                                 >
                                    Unfollow
                                 </Button>
                              ) : (
                                 <Button
                                    variant="outline"
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
                                 variant="outline"
                                 color="blue"
                                 onClick={() =>
                                    dispatch(
                                       followOrUnfollow({
                                          type: 'artist',
                                          id,
                                          action: 'follow',
                                       })
                                    )
                                 }
                              >
                                 Follow
                              </Button>
                           )}
                        </Box> */}
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
                  {popularSongs?.map((item, index) => {
                     return (
                        <Table.Row
                           key={item?.id}
                           onClick={() => {
                              // console.log(item)
                              setSelectedTrack(item)
                           }}
                           onMouseEnter={() => setCurrentUserIdOnHover(item.id)}
                           onMouseLeave={() => setCurrentUserIdOnHover(null)}
                           className={`select-none active:backdrop-brightness-90 ${hoverClass(
                              item
                           )} ${activeClass(item)}`}
                        >
                           <Table.RowHeaderCell>
                              {currentUserIdOnHover === item.id ||
                              selectedTrack === item.id ? (
                                 <PlayIcon
                                    onClick={() => {
                                       setSelectedTrack(item)
                                    }}
                                 />
                              ) : (
                                 index + 1
                              )}
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
