import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Text, Flex, Button, TextField, Skeleton } from '@radix-ui/themes'
import { Link, useParams, useNavigate } from 'react-router-dom'
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
import PlaylistDialog from '../components/PlaylistDialog'

const Playlist = () => {
   const { id } = useParams()
   const [isPublic, setIsPublic] = useState(false)
   const [editModalOpen, setEditModalOpen] = useState(false)
   const container = useRef(null)
   const navigate = useNavigate()

   const { data: playlist, isLoading: isPlaylistLoading } = useSpotifyQuery({
      queryKey: ['playlist', id],
      endpoint: `/playlists/${id}`,
   })

   useEffect(() => {
      if (playlist) {
         document.title = `Spotify | ${playlist?.name}`
      }
   }, [playlist])

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
                        <PlaylistDialog
                           modalState={editModalOpen}
                           setModalState={setEditModalOpen}
                           isPublic={isPublic}
                           setIsPublic={setIsPublic}
                           initialValues={{
                              name: playlist?.name,
                              description: playlist?.description,
                           }}
                           mode="edit"
                           playlistId={playlist?.id}
                           onSuccess={(id) => navigate('/playlist/' + id)}
                        >
                           <Text
                              size="8"
                              weight="bold"
                              className="cursor-pointer hover:underline text-6xl md:text-7xl lg:text-8xl"
                           >
                              {playlist?.name}
                           </Text>
                        </PlaylistDialog>
                     ) : (
                        <Text
                           size="8"
                           className="font-bold text-6xl md:text-7xl lg:text-8xl"
                        >
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
               context_uri={playlist?.uri}
               playlist={playlist}
               tracks={playlist?.tracks?.items}
               isPlaylist={true}
               isLoading={isPlaylistLoading}
            />
         </Box>
      </Flex>
   )
}

export default Playlist
