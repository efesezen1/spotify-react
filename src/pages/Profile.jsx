import { Box, Flex, Text } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFollowingArtists } from '../../store/slicers/userSlice'
import * as Popover from '@radix-ui/react-popover'
import { Link } from 'react-router-dom'

const Profile = () => {
   const { userPlaylists, user, token, followingArtists } = useSelector(
      (state) => state.user
   )

   const dispatch = useDispatch()
   useEffect(() => {
      if (!token) return
      dispatch(fetchFollowingArtists(token))
   }, [token])

   useEffect(() => {
      if (!followingArtists) return
      console.log(token)

      console.log(followingArtists)
      // console.log(
      //    followingArtists?.artists?.items.map((artist) => {
      //       console.log(artist)
      //    })
      // )
   }, [followingArtists])
   return (
      <Flex direction="row" className="w-full">
         <Flex className="p-5 ">
            {user?.images[1]?.url ? (
               <img
                  src={user?.images[0]?.url}
                  alt=""
                  className=" hero-image rounded-full object-cover "
               />
            ) : (
               <></>
            )}
         </Flex>

         <Flex direction="column" justify="end" className="my-5 ">
            <Text size="1" weight="light" className="ml-1" color="gray">
               {/* {playlist?.name} */}
               {user?.type || ''}
            </Text>
            <Flex direction="column" justify={'end'}>
               <Text size="9" weight="bold" className="">
                  {/* {playlist?.name} */}
                  {user?.display_name || ''}
               </Text>
               <Text className="mr-10  mt-3 ml-1" size="2" color="gray">
                  {/* {playlist?.description || ''} */}
               </Text>
               <Flex direction="row" className="bg-lime-500 w-full">
                  <Text className="mr-10  mt-3 ml-1" size="1" color="gray">
                     {/* {playlist?.owner.display_name} */}

                     <Popover.Root>
                        <Popover.Trigger>
                           {followingArtists?.artists?.total ? `${followingArtists?.artists?.total} Followed Artists`} 
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
                  <Text className="mr-10  mt-3 ml-1" size="1" color="gray">
                     {user?.followers?.total &&
                        `${user?.followers?.total} Followers`}
                  </Text>
               </Flex>
            </Flex>
         </Flex>
      </Flex>
   )
}

export default Profile
