import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, Skeleton } from '@radix-ui/themes'
import { TimerIcon, PauseIcon, PlayIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'
import TrackStatus from './TrackStatus'
import { setCurrentSong, setIsPlaying } from '../store/slicers/userSlice'
import { Reorder, AnimatePresence, motion } from 'framer-motion'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import useSpotifyMutation from '../hook/useSpotifyMutation'

const TrackTable = ({
   tracks,
   isPlaylist = false,
   isLoading = false,
   onReorder,
   playlist,
}) => {
   const dispatch = useDispatch()
   const { currentSong, isPlaying } = useSelector((state) => state.user)
   const [selectedTrack, setSelectedTrack] = useState(null)
   const [currentUserIdOnHover, setCurrentUserIdOnHover] = useState(null)
   const [items, setItems] = useState(tracks || [])

   const { data: user } = useSpotifyQuery({
      queryKey: ['user'],
      endpoint: '/me',
   })

   const reorderTracksMutation = useSpotifyMutation({
      mutationKey: ['reorderTracks', playlist?.id],
      endpoint: `/playlists/${playlist?.id}/tracks`,
      method: 'put',
   })

   // Check if current user is the playlist owner
   const isPlaylistOwner = user?.id === playlist?.owner?.id
   const canReorderTracks = isPlaylist && isPlaylistOwner

   // Update items when tracks prop changes
   React.useEffect(() => {
      setItems(tracks || [])
   }, [tracks])

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

   const hoverClass = (item) =>
      selectedTrack !== (isPlaylist ? item.track?.id : item.id)
         ? 'hover:backdrop-brightness-95'
         : ''

   const activeClass = (item) =>
      selectedTrack === (isPlaylist ? item.track?.id : item.id)
         ? 'backdrop-brightness-90'
         : ''

   const handlePlay = (track) => {
      if (currentSong?.id === track.id) {
         dispatch(setIsPlaying(!isPlaying))
      } else {
         dispatch(setCurrentSong(track))
         dispatch(setIsPlaying(true))
      }
   }

   const handleReorder = (newOrder) => {
      console.log('New Order:', newOrder.map(item => ({
         id: item.track.id,
         name: item.track.name,
         position: newOrder.indexOf(item)
      })))
      
      setItems(newOrder)
      
      if (!playlist?.id) return

      // Find the indices of the moved item in both old and new arrays
      const movedItemId = newOrder[0].track.id
      const oldIndex = tracks.findIndex(track => track.track.id === movedItemId)
      const newIndex = newOrder.findIndex(item => item.track.id === movedItemId)

      // Calculate the range_start and insert_before based on drag direction
      const range_start = oldIndex
      const insert_before = newIndex

      console.log('Reorder Parameters:', {
         range_start,
         insert_before,
         range_length: 1,
         movedTrack: {
            id: movedItemId,
            name: newOrder[0].track.name,
            oldPosition: oldIndex,
            newPosition: newIndex
         }
      })

      reorderTracksMutation.mutate({
         range_start,
         insert_before,
         range_length: 1,
      }, {
         onSuccess: () => {
            console.log('Track reorder successful')
            onReorder?.(newOrder)
         },
         onError: (error) => {
            // Revert the optimistic update on error
            console.error('Failed to reorder tracks:', error)
            setItems(tracks)
         }
      })
   }

   return (
      <motion.div className="w-full overflow-y-scroll">
         {/* Header */}
         <motion.div
            className={`sticky top-0 left-0 backdrop-brightness-100 backdrop-blur-3xl z-10 grid ${
               isPlaylist
                  ? 'grid-cols-[48px_1fr_1fr_120px_120px]'
                  : 'grid-cols-[48px_1fr_1fr_120px]'
            } gap-4 p-2 px-4 text-sm font-medium`}
         >
            <motion.div className="text-xs">
               {isLoading ? <Skeleton>00</Skeleton> : '#'}
            </motion.div>
            <motion.div className="text-xs">
               {isLoading ? <Skeleton>Title Here</Skeleton> : 'Title'}
            </motion.div>
            <motion.div className="text-xs">
               {isLoading ? <Skeleton>Album Here</Skeleton> : 'Album'}
            </motion.div>
            {isPlaylist && (
               <motion.div className="text-xs">
                  {isLoading ? (
                     <Skeleton>Date Added Here</Skeleton>
                  ) : (
                     'Date Added'
                  )}
               </motion.div>
            )}
            <motion.div className="text-xs">
               {isLoading ? (
                  <Skeleton>
                     <TimerIcon />
                  </Skeleton>
               ) : (
                  <TimerIcon />
               )}
            </motion.div>
         </motion.div>

         {/* Track List */}
         {canReorderTracks ? (
            <Reorder.Group
               axis="y"
               values={items}
               onReorder={handleReorder}
               className="w-full"
            >
               {renderTracks()}
            </Reorder.Group>
         ) : (
            <motion.div className="w-full">{renderTracks()}</motion.div>
         )}
      </motion.div>
   )

   function renderTracks() {
      if (isLoading) {
         return Array.from({ length: 10 }).map((_, index) => (
            <motion.div
               key={`skeleton-${index}`}
               className={`grid ${
                  isPlaylist
                     ? 'grid-cols-[48px_1fr_1fr_120px_120px]'
                     : 'grid-cols-[48px_1fr_1fr_120px]'
               } gap-4 p-2 px-4 items-center`}
            >
               <motion.div>
                  <Skeleton>
                     <Box className="w-4">{index + 1}</Box>
                  </Skeleton>
               </motion.div>
               <motion.div>
                  <Flex gap="3" align="center">
                     <Skeleton className="w-10 h-10" />
                     <Flex direction="column" gap="1">
                        <Skeleton>
                           <Text>Track Title</Text>
                        </Skeleton>
                        <Skeleton>
                           <Text size="1" color="gray">
                              Artist Name
                           </Text>
                        </Skeleton>
                     </Flex>
                  </Flex>
               </motion.div>
               <motion.div>
                  <Skeleton>
                     <Text>Album Name</Text>
                  </Skeleton>
               </motion.div>
               {isPlaylist && (
                  <motion.div>
                     <Skeleton>
                        <Text>Date Added</Text>
                     </Skeleton>
                  </motion.div>
               )}
               <motion.div>
                  <Skeleton>
                     <Text>0:00</Text>
                  </Skeleton>
               </motion.div>
            </motion.div>
         ))
      }

      return items?.map((item, index) => {
         const track = isPlaylist ? item.track : item
         const trackId = isPlaylist ? item.track?.id : item.id

         const TrackContent = (
            <motion.div
               onClick={() => setSelectedTrack(trackId)}
               onMouseEnter={() => setCurrentUserIdOnHover(trackId)}
               onMouseLeave={() => setCurrentUserIdOnHover(null)}
               className={`grid ${
                  isPlaylist
                     ? 'grid-cols-[48px_1fr_1fr_120px_120px]'
                     : 'grid-cols-[48px_1fr_1fr_120px]'
               } gap-4 p-2 px-4 items-center select-none active:backdrop-brightness-90 ${hoverClass(
                  item
               )} ${activeClass(item)} ${
                  canReorderTracks ? 'cursor-grab active:cursor-grabbing' : ''
               }`}
            >
               <motion.div>
                  <Flex align="center" gap="3">
                     {currentUserIdOnHover === trackId ? (
                        <button
                           className="w-4"
                           onClick={(e) => {
                              e.stopPropagation()
                              handlePlay(track)
                           }}
                        >
                           {currentSong?.id === trackId && isPlaying ? (
                              <PauseIcon />
                           ) : (
                              <PlayIcon />
                           )}
                        </button>
                     ) : (
                        <Text size="2" className="w-4">
                           {index + 1}
                        </Text>
                     )}
                  </Flex>
               </motion.div>

               <motion.div>
                  <Flex align="center" gap="3">
                     {track?.album?.images[0]?.url && (
                        <img
                           src={track.album.images[0].url}
                           className="w-10 h-10 rounded"
                           alt=""
                        />
                     )}
                     <Flex direction="column">
                        <Text>{track?.name}</Text>
                        <Text size="1" color="gray">
                           {track?.artists
                              ?.map((artist) => (
                                 <Link
                                    to={`/artist/${artist.id}`}
                                    key={artist.id}
                                    className="hover:underline"
                                 >
                                    {artist.name}
                                 </Link>
                              ))
                              .reduce((prev, curr) => [prev, ', ', curr])}
                        </Text>
                     </Flex>
                     {currentSong?.id === trackId && (
                        <TrackStatus isPlaying={isPlaying} />
                     )}
                  </Flex>
               </motion.div>

               <motion.div>
                  <Link
                     to={`/album/${track?.album?.id}`}
                     className="hover:underline"
                  >
                     {track?.album?.name}
                  </Link>
               </motion.div>

               {isPlaylist && (
                  <motion.div>
                     <Text size="2">{timeAgo(item?.added_at)}</Text>
                  </motion.div>
               )}

               <motion.div>
                  <Text size="2">{formatDuration(track?.duration_ms)}</Text>
               </motion.div>
            </motion.div>
         )

         return canReorderTracks ? (
            <Reorder.Item
               key={trackId}
               value={item}
               whileDrag={{
                  scale: 1.02,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  cursor: 'grabbing',
               }}
            >
               {TrackContent}
            </Reorder.Item>
         ) : (
            <React.Fragment key={trackId}>{TrackContent}</React.Fragment>
         )
      })
   }
}

export default TrackTable
