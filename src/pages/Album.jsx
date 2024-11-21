import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Flex, Text, Grid, Skeleton } from '@radix-ui/themes'
import { useDispatch } from 'react-redux'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import TrackTable from '../components/TrackTable'

const Album = () => {
   const params = useParams()
   const id = params.id
   const dispatch = useDispatch()

   // Fetch album details
   const { data: album, isLoading: isAlbumLoading } = useSpotifyQuery({
      queryKey: ['album', id],
      endpoint: `/albums/${id}`,
   })

   // Format duration
   const formatDuration = (ms) => {
      if (!ms) return '0 min 0 sec'
      const minutes = Math.floor(ms / 60000)
      const seconds = Math.floor((ms % 60000) / 1000)
      return `${minutes} min ${seconds} sec`
   }

   // Calculate total duration
   const totalDuration = album?.tracks?.items.reduce(
      (acc, track) => acc + track.duration_ms,
      0
   )

   return (
      <Flex
         className="rounded bg-gradient-to-b from-lime-500 via-white via-50% to-slate-white h-full w-full overflow-y-scroll"
         direction="column"
         align="center"
      >
         {/* Album Info */}
         <Flex direction="column" className="w-full">
            <Flex direction="row">
               <Flex className="p-5 h-full items-center aspect-square">
                  {isAlbumLoading ? (
                     <Skeleton width="100%" height="100%" className="rounded" />
                  ) : album?.images[0]?.url ? (
                     <img
                        src={album.images[0].url}
                        alt={album.name}
                        className="hero-image rounded object-cover w-full h-full"
                     />
                  ) : (
                     <Box className="hero-image rounded bg-gray-200 w-full h-full" />
                  )}
               </Flex>

               <Flex direction="column" className="my-5" justify="end">
                  {isAlbumLoading ? (
                     <>
                        <Skeleton className="mb-2">
                           <Text size="1" className="ml-1">Album</Text>
                        </Skeleton>
                        <Skeleton className="mb-4">
                           <Text size="9" className="font-bold">Album Name</Text>
                        </Skeleton>
                        <Skeleton className="mb-2">
                           <Text size="2">Album Info</Text>
                        </Skeleton>
                     </>
                  ) : (
                     <>
                        <Text
                           size="1"
                           weight="light"
                           className="ml-1 select-none"
                           color="gray"
                        >
                           {album?.type?.toUpperCase()}
                        </Text>
                        <Text 
                           size="9" 
                           weight="bold" 
                           className="select-none text-6xl md:text-7xl lg:text-8xl"
                        >
                           {album?.name}
                        </Text>
                        <Flex gap="2" align="center" className="mt-2">
                           {album?.artists?.map((artist, index) => (
                              <React.Fragment key={artist.id}>
                                 <Link
                                    to={`/artist/${artist.id}`}
                                    className="hover:underline"
                                 >
                                    <Text size="2" color="gray">
                                       {artist.name}
                                    </Text>
                                 </Link>
                                 {index < album.artists.length - 1 && (
                                    <Text size="2" color="gray">,</Text>
                                 )}
                              </React.Fragment>
                           ))}
                           <Text size="2" color="gray" className="ml-1">
                              • {album?.release_date?.split('-')[0]}
                           </Text>
                           <Text size="2" color="gray">
                              • {album?.total_tracks} songs,{' '}
                              {formatDuration(totalDuration)}
                           </Text>
                        </Flex>
                     </>
                  )}
               </Flex>
            </Flex>
         </Flex>

         {/* Tracks */}
         <Box className="w-full px-8 mt-8">
            {isAlbumLoading ? (
               <Flex direction="column" gap="2">
                  {[...Array(5)].map((_, index) => (
                     <Flex 
                        key={index}
                        className="grid grid-cols-[48px_1fr_1fr_120px] gap-4 p-2 px-4 items-center"
                     >
                        <Skeleton>
                           <Text size="2" className="w-4">
                              {index + 1}
                           </Text>
                        </Skeleton>

                        <Flex align="center" gap="3">
                           <Skeleton className="w-10 h-10 rounded" />
                           <Flex direction="column" gap="1">
                              <Skeleton>
                                 <Text>Track Name</Text>
                              </Skeleton>
                              <Skeleton>
                                 <Text size="1" color="gray">Artist Name</Text>
                              </Skeleton>
                           </Flex>
                        </Flex>

                        <Skeleton>
                           <Text>{album?.name}</Text>
                        </Skeleton>

                        <Skeleton>
                           <Text size="2">0:00</Text>
                        </Skeleton>
                     </Flex>
                  ))}
               </Flex>
            ) : (
               <TrackTable tracks={album?.tracks?.items} />
            )}
         </Box>
      </Flex>
   )
}

export default Album
