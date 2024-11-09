import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchArtist } from '../../store/slicers/userSlice'
import { Box, Flex, Text, Grid } from '@radix-ui/themes'
import * as Popover from '@radix-ui/react-popover'

const Artist = () => {
   const params = useParams()
   const id = params.id
   const { token, currentArtist } = useSelector((state) => state.user)
   const dispatch = useDispatch(fetchArtist)
   useEffect(() => {
      if (!token || !id) return
      dispatch(fetchArtist({ token, id }))
   }, [token, id])

   useEffect(() => {
      if (!currentArtist) return
      const { artist, popularSongs, albums } = currentArtist
      console.log(artist, popularSongs, albums)
   }, [currentArtist])

   const artist = {
      external_urls: {
         spotify: 'https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x',
      },
      followers: {
         href: null,
         total: 27874490,
      },
      genres: ['chicago rap', 'hip hop', 'rap'],
      href: 'https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x?locale=en-US%2Cen%3Bq%3D0.9',
      id: '5K4W6rqBFWDnAN6FQUkS6x',
      images: [
         {
            url: 'https://i.scdn.co/image/ab6761610000e5eb6e835a500e791bf9c27a422a',
            height: 640,
            width: 640,
         },
         {
            url: 'https://i.scdn.co/image/ab676161000051746e835a500e791bf9c27a422a',
            height: 320,
            width: 320,
         },
         {
            url: 'https://i.scdn.co/image/ab6761610000f1786e835a500e791bf9c27a422a',
            height: 160,
            width: 160,
         },
      ],
      name: 'Kanye West',
      popularity: 93,
      type: 'artist',
      uri: 'spotify:artist:5K4W6rqBFWDnAN6FQUkS6x',
   }

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
                     </Flex>
                  </Flex>
               </Flex>
            </Flex>

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
