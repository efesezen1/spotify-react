import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Switch from '@radix-ui/react-switch'
import * as Dialog from '@radix-ui/react-dialog'
import { Box, Text, Flex, Button, TextField, Skeleton } from '@radix-ui/themes'
import { Link, useParams } from 'react-router-dom'
import {
   ValueNoneIcon,
   Cross2Icon,
   MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import usePrevious from '../hook/prevId'
import useSpotifyInstance from '../hook/spotifyInstance'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import TrackStatus from '../components/TrackStatus'
import TrackTable from '../components/TrackTable'

const Playlist = () => {
   const { id } = useParams()
   const dispatch = useDispatch()
   const queryClient = useQueryClient()
   const { token, spotifyApi } = useSpotifyInstance()
   const [isPublic, setIsPublic] = useState(null)
   const container = useRef(null)
   const prevId = usePrevious(id)

   const { data: playlist, isLoading: isPlaylistLoading } = useSpotifyQuery({
      queryKey: ['playlist', id],
      endpoint: `/playlists/${id}`,
   })

   const { data: user } = useSpotifyQuery({
      queryKey: ['user'],
      endpoint: '/me',
   })

   useEffect(() => {
      if (!playlist) return
      setIsPublic(playlist.public)
   }, [playlist])

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
         className={`rounded bg-gradient-to-b ${gradient_color} via-white via-50% to-slate-white h-full w-full overflow-y-scroll`}
         ref={container}
      >
         <Flex direction="row" className="w-full">
            <Flex className="p-5  h-full items-center aspect-square">
               {isPlaylistLoading ? (
                  <Skeleton width="100%" height="100%" className="rounded" />
               ) : playlist?.images?.at(0)?.url ? (
                  <img
                     src={playlist?.images.at(0)?.url}
                     alt=""
                     className="hero-image rounded object-cover w-full h-full "
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
               {isPlaylistLoading ? (
                  <>
                     <Skeleton>
                        <Text size="1">PLAYLIST</Text>
                     </Skeleton>
                     <Skeleton>
                        <Text size="8" className="font-bold">
                           Playlist Title
                        </Text>
                     </Skeleton>
                     <Skeleton>
                        <Text>Playlist Description</Text>
                     </Skeleton>
                     <Skeleton>
                        <Text>Playlist Info</Text>
                     </Skeleton>
                  </>
               ) : (
                  <>
                     {user?.id === playlist?.owner?.id ? (
                        <InteractiveHeader
                           playlist={playlist}
                           size="8"
                           setIsPublic={setIsPublic}
                           isPublic={isPublic}
                        />
                     ) : (
                        <Text size="8" className="font-bold">
                           {playlist?.name}
                        </Text>
                     )}
                     <Text>{playlist?.description}</Text>
                     <Text size="2">
                        {playlist?.owner?.display_name} •{' '}
                        {playlist?.tracks?.total} songs
                     </Text>
                  </>
               )}
            </Flex>
         </Flex>
         <Box className="p-5">
            <TrackTable
               tracks={playlist?.tracks?.items}
               isPlaylist={true}
               isLoading={isPlaylistLoading}
            />
         </Box>
      </Flex>
   )
}

const InteractiveHeader = ({
   playlist,
   size,
   setIsPublic,

   isPublic,
}) => {
   const queryClient = useQueryClient()
   const { spotifyApi } = useSpotifyInstance()
   const { mutate: editPlaylist } = useMutation({
      mutationFn: ({ name, description, isPublic, playlistId }) =>
         spotifyApi.put(`/playlists/${playlistId}`, {
            name,
            description,
            public: isPublic,
         }),
      onSuccess: (response) => {
         queryClient.invalidateQueries(['playlist', playlistId])
      },
      onError: (error) => {},
   })

   const handleEditPlaylist = ({ name, description, isPublic }) => {
      editPlaylist({ name, description, isPublic, playlistId: playlist.id })
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
                  <Switch.Thumb
                     className={`block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]`}
                  />
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
