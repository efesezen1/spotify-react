import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Text, Flex, Button, Table, TextField } from '@radix-ui/themes'
import {
   fetchSelectedPlaylist,
   setSelectedPlaylist,
   setCurrentSong,
   setIsPlaying,
} from '../store/slicers/userSlice'
import { Link, useParams } from 'react-router-dom'
import {
   PauseIcon,
   PlayIcon,
   TimerIcon,
   ValueNoneIcon,
   MagnifyingGlassIcon,
} from '@radix-ui/react-icons'

const Playlist = () => {
   const { id } = useParams()
   const container = useRef(null)

   const {
      token,
      selectedPlaylist: playlist,
      isPlaying,
      currentSong,
   } = useSelector((state) => state.user)

   const [currentUserIdOnHover, setCurrentUserIdOnHover] = useState(null)
   const [selectedTrack, setSelectedTrack] = useState(null)
   const dispatch = useDispatch()

   useEffect(() => {
      return () => {
         setSelectedTrack(null)
      }
   }, [id])

   useEffect(() => {
      if (!playlist && token) {
         dispatch(
            fetchSelectedPlaylist('https://api.spotify.com/v1/playlists/' + id)
         )
      }
   }, [playlist, token])

   useEffect(() => {
      return () => {
         dispatch(setSelectedPlaylist(null))
         setSelectedTrack(null)
      }
   }, [])

   const gradient_color =
      playlist?.primary_color === '#FFFFFF'
         ? 'from-red-100'
         : playlist?.primary_color === '#ffffff'
         ? 'from-red-100'
         : playlist?.primary_color === null
         ? 'from-red-100'
         : `from-[${playlist?.primary_color}]`

   const formatDuration = (ms) => {
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
   }

   const hoverClass = (item) =>
      selectedTrack !== item.track.id ? 'hover:backdrop-brightness-95' : ''

   const activeClass = (item) =>
      selectedTrack === item.track.id ? 'backdrop-brightness-90' : ''
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

   return (
      <Flex
         direction="column"
         className={` rounded bg-gradient-to-b ${gradient_color} via-white via-50%  to-slate-white h-full `}
         ref={container}
         onClick={() => setSelectedTrack(null)}
      >
         <Flex direction="row" className="w-full">
            <Flex className="p-5 ">
               {playlist?.images?.at(0)?.url ? (
                  <img
                     src={playlist?.images.at(0)?.url}
                     alt=""
                     className=" hero-image rounded "
                  />
               ) : (
                  <Box className="hero-image rounded  !flex justify-center items-center ">
                     <ValueNoneIcon />
                  </Box>
               )}
            </Flex>

            <Flex direction="column" justify="end" className="my-5  ">
               <Text size="9" weight="bold" className="">
                  {playlist?.name}
               </Text>
               <Text className="mr-10  mt-3 ml-1" size="2" color="gray">
                  {playlist?.description || ''}
               </Text>
               <Text className="mr-10  mt-3 ml-1" size="1" color="gray">
                  {playlist?.owner.display_name}
               </Text>
            </Flex>
         </Flex>

         {playlist?.tracks?.items?.length !== 0 ? (
            <Table.Root
               size="2"
               layout=""
               className="overflow-y-scroll"
               onClick={(e) => e.stopPropagation()}
            >
               <Table.Header className="sticky top-0 left-0  backdrop-brightness-100 backdrop-blur-3xl z-10">
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
                        <Box className="text-xs">Date Added</Box>
                     </Table.ColumnHeaderCell>
                     <Table.ColumnHeaderCell>
                        <Box className="text-xs">
                           <TimerIcon />
                        </Box>
                     </Table.ColumnHeaderCell>
                  </Table.Row>
               </Table.Header>

               <Table.Body>
                  {playlist?.tracks?.items?.map((item, index) => {
                     return (
                        <Table.Row
                           key={item.track.id}
                           onClick={() => setSelectedTrack(item.track.id)}
                           onMouseEnter={() =>
                              setCurrentUserIdOnHover(item.track.id)
                           }
                           onMouseLeave={() => setCurrentUserIdOnHover(null)}
                           className={`select-none   active:backdrop-brightness-90
                        ${hoverClass(item)}
                        
                        ${activeClass(item)}`}
                        >
                           <Table.RowHeaderCell>
                              {currentUserIdOnHover === item.track.id ||
                              selectedTrack === item.track.id ? (
                                 isPlaying ? (
                                    currentSong.track.id === item.track.id ? (
                                       <PauseIcon />
                                    ) : (
                                       <PlayIcon
                                          onClick={() =>
                                             dispatch(setCurrentSong(item))
                                          }
                                       />
                                    )
                                 ) : (
                                    <PlayIcon
                                       onClick={() =>
                                          dispatch(setCurrentSong(item))
                                       }
                                    />
                                 )
                              ) : (
                                 <Box className="text-xs">{index + 1}</Box>
                              )}
                           </Table.RowHeaderCell>
                           <Table.Cell>
                              <Flex direction={'column'}>
                                 <Text size="2">{item.track.name}</Text>
                                 <Text size="1">
                                    {item.track.artists
                                       .map((artist) => (
                                          <Link
                                             to={`/artist/${artist.id}`}
                                             key={artist.id}
                                             className="hover:underline"
                                          >
                                             {artist.name}
                                          </Link>
                                       ))
                                       .reduce((prev, curr) => [
                                          prev,
                                          ', ',
                                          curr,
                                       ])}
                                 </Text>
                              </Flex>
                           </Table.Cell>
                           <Table.Cell>
                              <Text size="2">{item.track.album.name}</Text>
                           </Table.Cell>
                           <Table.Cell>
                              <Text className="text-nowrap" size="2">
                                 {timeAgo(item.added_at)}
                              </Text>
                           </Table.Cell>
                           <Table.Cell>
                              <Text size="2">
                                 {formatDuration(item.track.duration_ms)}
                              </Text>
                           </Table.Cell>
                        </Table.Row>
                     )
                  })}
               </Table.Body>
            </Table.Root>
         ) : (
            <Flex className="p-5" direction="column" gap="3">
               <Text size="5">Let's find something for your playlist</Text>
               <TextField.Root
                  placeholder="Search for songs and episodes"
                  className="w-1/2"
                  variant="soft"
               >
                  <TextField.Slot>
                     <MagnifyingGlassIcon height="16" width="16" />
                  </TextField.Slot>
               </TextField.Root>
            </Flex>
         )}
      </Flex>
   )
}

export default Playlist
