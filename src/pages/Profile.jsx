import { Box, Flex, Text, Grid, Skeleton } from '@radix-ui/themes'
import * as Popover from '@radix-ui/react-popover'
import { Link, useNavigate } from 'react-router-dom'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import useSpotifyInstance from '../hook/spotifyInstance'
import { useEffect } from 'react'

const Profile = () => {
   const navigate = useNavigate()

   const { token } = useSpotifyInstance()

   const { data: user, isLoading: isUserLoading } = useSpotifyQuery({
      queryKey: ['user'],
      endpoint: '/me'
   })

   const { data: followingArtists, isLoading: isFollowingLoading } = useSpotifyQuery({
      queryKey: ['followingArtists'],
      endpoint: '/me/following',
      params: { type: 'artist' }
   })

   const { data: topItems, isLoading: isTopItemsLoading } = useSpotifyQuery({
      queryKey: ['topArtists'],
      endpoint: '/me/top/artists'
   })

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
                  {isUserLoading ? (
                     <Skeleton className="w-[150px] h-[150px] rounded-full" />
                  ) : user?.images?.at(0)?.url ? (
                     <img
                        src={user?.images.at(0)?.url}
                        alt=""
                        className=" hero-image rounded-full object-cover  "
                     />
                  ) : (
                     <></>
                  )}
               </Flex>

               <Flex direction="column" className="my-5" justify="end">
                  {isUserLoading ? (
                     <>
                        <Skeleton>
                           <Text size="1" className="ml-1">Profile</Text>
                        </Skeleton>
                        <Skeleton>
                           <Text size="9" className="font-bold">User Name</Text>
                        </Skeleton>
                        <Flex direction="row" gap="3" className="mt-3">
                           <Skeleton>
                              <Text size="1">123 Followed Artists</Text>
                           </Skeleton>
                           <Skeleton>
                              <Text size="1">456 Followers</Text>
                           </Skeleton>
                        </Flex>
                     </>
                  ) : (
                     <>
                        <Text
                           size="1"
                           weight="light"
                           className="ml-1 select-none"
                           color="gray"
                        >
                           {user?.type || ''}
                        </Text>
                        <Flex direction="column">
                           <Text size="9" weight="bold" className="select-none">
                              {user?.display_name || ''}
                           </Text>
                           <Text
                              className="mr-10  mt-3 ml-1 select-none"
                              size="2"
                              color="gray"
                           >
                           </Text>
                           <Flex direction="row" className=" w-full">
                              <Text
                                 className="mr-10  mt-3 ml-1 select-none"
                                 size="1"
                                 color="gray"
                              >
                                 <Popover.Root>
                                    <Popover.Trigger>
                                       {followingArtists?.artists?.total
                                          ? `${followingArtists?.artists?.total} Followed Artists`
                                          : ''}
                                    </Popover.Trigger>
                                    <Popover.Portal>
                                       <Popover.Content className="flex flex-col   w-[15rem] max-h-[20rem] p-1 border rounded-lg text-left  mr-2 bg-white overflow-y-scroll">
                                          {followingArtists?.artists?.items.map(
                                             (artist) => {
                                                return (
                                                   <Link
                                                      to={`/artist/${artist.id}`}
                                                      key={artist.id}
                                                      className="btn-color p-2 flex flex-row items-center gap-2"
                                                   >
                                                      <img
                                                         src={artist?.images[2].url}
                                                         alt={artist.name}
                                                         className="w-[2rem] h-[2rem] object-cover rounded-full"
                                                      />
                                                      <Text>{artist.name}</Text>
                                                   </Link>
                                                )
                                             }
                                          )}
                                          <Popover.Arrow className=" fill-white"></Popover.Arrow>
                                       </Popover.Content>
                                    </Popover.Portal>
                                 </Popover.Root>
                              </Text>
                              <Text
                                 className="mr-10  mt-3 ml-1"
                                 size="1"
                                 color="gray"
                              >
                                 {user?.followers?.total &&
                                    `${user?.followers?.total} Followers`}
                              </Text>
                           </Flex>
                        </Flex>
                     </>
                  )}
               </Flex>
            </Flex>
            {/* USER INFO END */}
            {/* ARTISTS */}
            <Flex
               direction="column"
               align={{ xs: 'center', md: 'start' }}
               className="overflow-y-scroll overflow-x-hidden"
            >
               <Box pl="1" className="w-full">
                  <Text
                     size="5"
                     weight="bold"
                     className="hover:underline select-none w-full"
                  >
                     Top Artists
                  </Text>
               </Box>
               <Box className="w-full overflow-y-scroll">
                  <Grid
                     columns={{
                        initial: '1',
                        xs: '2',
                        sm: '3',
                        md: '5',
                        lg: '7',
                        xl: '9',
                     }}
                     className="w-full"
                  >
                     {isTopItemsLoading ? (
                        // Skeleton loading state for top artists grid
                        Array.from({ length: 9 }).map((_, index) => (
                           <Flex
                              align={'center'}
                              direction={'column'}
                              key={`skeleton-${index}`}
                              className="p-3"
                           >
                              <Skeleton className="w-[80px] h-[80px] rounded-lg" />
                              <Flex
                                 direction="column"
                                 p="1"
                                 className="w-[80px]"
                              >
                                 <Skeleton>
                                    <Text size="2" weight="bold">Artist Name</Text>
                                 </Skeleton>
                                 <Skeleton>
                                    <Text size="1" color="gray">Artist</Text>
                                 </Skeleton>
                              </Flex>
                           </Flex>
                        ))
                     ) : (
                        topItems?.items.map((artist) => (
                           <Flex
                              align={'center'}
                              direction={'column'}
                              key={artist.id}
                              onClick={() => navigate(`/artist/${artist.id}`)}
                              className="hover:backdrop-brightness-95 active:backdrop-brightness-90 rounded transition-all duration-200 p-3"
                           >
                              <img
                                 src={artist.images[0].url}
                                 alt="artist"
                                 className="object-cover rounded-lg w-[10rem] h-[10rem] mx-auto"
                              />
                              <Flex
                                 direction="column"
                                 p="1"
                                 className="w-[10rem] justify-center"
                              >
                                 <Text size="2" weight="bold" className="">
                                    {artist.name}
                                 </Text>
                                 <Text size="1" weight="" color="gray">
                                    {artist.type}
                                 </Text>
                              </Flex>
                           </Flex>
                        ))
                     )}
                  </Grid>
               </Box>
            </Flex>
         </Flex>
      </Flex>
   )
}

export default Profile
