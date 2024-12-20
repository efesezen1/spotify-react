import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Switch from '@radix-ui/react-switch'
import * as Dialog from '@radix-ui/react-dialog'
import { Box, Text, Flex, Button, Table, TextField } from '@radix-ui/themes'
import {
   fetchSelectedPlaylist,
   setSelectedPlaylist,
   setCurrentSong,
   setIsPlaying,
   editPlaylist,
} from '../store/slicers/userSlice'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
   PauseIcon,
   PlayIcon,
   TimerIcon,
   ValueNoneIcon,
   Cross2Icon,
   MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import usePrevious from '../hook/prevId'
const Playlist = () => {
   const { id } = useParams()
   const container = useRef(null)
   const prevId = usePrevious(id)
   const {
      token,
      selectedPlaylist: playlist,
      isPlaying,
      currentSong,
      user,
   } = useSelector((state) => state.user)
   const [isPublic, setIsPublic] = useState(null)
   const [currentUserIdOnHover, setCurrentUserIdOnHover] = useState(null)
   const [selectedTrack, setSelectedTrack] = useState(null)
   const dispatch = useDispatch()

   useEffect(() => {
      return () => {
         setSelectedTrack(null)
      }
   }, [id])

   useEffect(() => {
      if ((prevId !== id || !playlist) && token) {
         dispatch(
            fetchSelectedPlaylist('https://api.spotify.com/v1/playlists/' + id)
         )
      }
   }, [prevId, id, playlist, token])

   useEffect(() => {
      if (!playlist) return
      setIsPublic(playlist.public)
   }, [playlist])

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
            <Flex className="p-5  h-full items-center aspect-square">
               {playlist?.images?.at(0)?.url ? (
                  <img
                     src={playlist?.images.at(0)?.url}
                     alt=""
                     className="hero-image rounded object-cover w-full h-full" // Adjust to make sure the image fills the square container
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

            <Flex direction="column" justify="end" className="my-5 flex-grow">
               {user?.id === playlist?.owner?.id ? (
                  <InteractiveHeader
                     setIsPublic={setIsPublic}
                     isPublic={isPublic}
                     playlist={playlist}
                     size={{ initial: '8', lg: '9' }}
                  />
               ) : (
                  <Text size="9" weight="bold" className="select-none">
                     {playlist?.name}
                  </Text>
               )}
               <Text
                  className="mr-10 mt-3 ml-1 select-none"
                  size="2"
                  color="gray"
               >
                  {playlist?.description || ''}
               </Text>
               <Text
                  className="mr-10 mt-3 ml-1 select-none"
                  size="1"
                  color="gray"
               >
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
                                    currentSong?.track?.id ===
                                    item?.track?.id ? (
                                       <PauseIcon
                                          onClick={() => {
                                             dispatch(setIsPlaying(false))
                                          }}
                                       />
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

const InteractiveHeader = ({
   playlist,
   size,
   setIsPublic,

   isPublic,
}) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleEditPlaylist = ({ name, description, isPublic }) => {
      // console.log(user)
      dispatch(
         editPlaylist({ name, description, isPublic, playlistId: playlist.id })
      )
         .then((action) => {
            const response = action.payload
            if (!response?.id) return
            navigate('/playlist/' + response?.id)
         })
         .catch((error) => console.log(error))
   }

   return (
      <Dialog.Root>
         <Dialog.Trigger className=" text-start">
            <Text size={size} weight="bold" className="">
               {playlist?.name}
            </Text>
         </Dialog.Trigger>
         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
               <Dialog.Title className="m-0 text-[17px] font-medium capitalize ">
                  Edit playlist
               </Dialog.Title>
               <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal ">
                  Edit your playlist here. Click edit when you're done.
               </Dialog.Description>
               <fieldset className="mb-[15px] flex items-center gap-5">
                  <label
                     className="w-[90px] text-right text-[15px] capitalize"
                     htmlFor="playlistName"
                  >
                     Playlist Name
                  </label>
                  <input
                     className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none  shadow-[0_0_0_1px]  outline-none focus:shadow-[0_0_0_2px] "
                     id="playlistName"
                     defaultValue={playlist?.name}
                  />
               </fieldset>
               <fieldset className="mb-[15px] flex items-center gap-5">
                  <label
                     className="w-[90px] text-right text-[15px] "
                     htmlFor="description"
                  >
                     Description
                  </label>
                  <input
                     className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none  shadow-[0_0_0_1px]  outline-none focus:shadow-[0_0_0_2px] "
                     id="description"
                     defaultValue={playlist?.description}
                  />
               </fieldset>
               <Switch.Root
                  checked={isPublic}
                  onCheckedChange={() => setIsPublic((prev) => !prev)}
                  className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
                  id="playlist-audience"
                  style={{
                     '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
                  }}
               >
                  <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
               </Switch.Root>
               <div className="mt-[25px] flex justify-end">
                  <Dialog.Close asChild>
                     <Button
                        onClick={() => {
                           handleEditPlaylist({
                              name: document.getElementById('playlistName')
                                 .value,
                              description:
                                 document.getElementById('description').value,
                              isPublic,
                              id: playlist.id,
                           })
                        }}
                        variant="soft"
                     >
                        Edit
                     </Button>
                     {/* <button>efe</button> */}
                  </Dialog.Close>
               </div>
               <Dialog.Close asChild>
                  <button
                     className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full  hover:bg-violet4 focus:shadow-[0_0_0_2px] focus: focus:outline-none"
                     aria-label="Close"
                  >
                     <Cross2Icon />
                  </button>
               </Dialog.Close>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

export default Playlist
