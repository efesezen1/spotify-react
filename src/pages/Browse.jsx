import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../../store/slicers/userSlice'
import { Flex, Text, Box, Grid } from '@radix-ui/themes'
import Slider from 'react-slick'
import { motion } from 'framer-motion'

const Browse = () => {
   const { playlistRecommendations } = useSelector((state) => state.user)
   const carouselSettings = {
      dots: false,
      infinite: false,
      slidesToShow: 3.5,
      arrow: false,
   }
   return (
      <>
         <Flex direction="column" gap="3" className=" w-[70vw] h-full  ">
            <Box
               className="bg-red-200 h-full overflow-y-scroll overflow-x-hidden"
               p="3"
            >
               <Box pl="2">
                  <Text size="5" weight="bold" className="hover:underline  ">
                     {playlistRecommendations?.message}
                  </Text>
               </Box>
               <Flex direction="column" className="  w-[100%]" gap="3">
                  <Slider {...carouselSettings}>
                     {playlistRecommendations?.playlists?.items.map(
                        (playlist) => (
                           <Box
                              className="hover:bg-slate-100 active:bg-slate-200 rounded p-2 w-[200px] transition-all duration-200 "
                              key={playlist.id}
                           >
                              <img
                                 src={playlist.images[0].url}
                                 alt="playlist"
                                 className="w-full h-full object-cover rounded"
                              />
                              <Flex direction="column" p="1">
                                 <Text size="2" weight="bold">
                                    {playlist.name}
                                 </Text>
                                 <Text
                                    size="1"
                                    weight=""
                                    color="gray"
                                    className=""
                                 >
                                    {playlist.owner.display_name}
                                 </Text>
                              </Flex>
                           </Box>
                        )
                     )}
                  </Slider>
               </Flex>
               <Flex direction="column" className="  w-[100%]" gap="3">
                  <Slider {...carouselSettings}>
                     {playlistRecommendations?.playlists?.items.map(
                        (playlist) => (
                           <Box
                              className="hover:bg-slate-100 active:bg-slate-200 rounded p-2 w-[200px] transition-all duration-200 "
                              key={playlist.id}
                           >
                              <img
                                 src={playlist.images[0].url}
                                 alt="playlist"
                                 className="w-full h-full object-cover rounded"
                              />
                              <Flex direction="column" p="1">
                                 <Text size="2" weight="bold">
                                    {playlist.name}
                                 </Text>
                                 <Text
                                    size="1"
                                    weight=""
                                    color="gray"
                                    className=""
                                 >
                                    {playlist.owner.display_name}
                                 </Text>
                              </Flex>
                           </Box>
                        )
                     )}
                  </Slider>
               </Flex>
               <Flex direction="column" className="  w-[100%]" gap="3">
                  <Slider {...carouselSettings}>
                     {playlistRecommendations?.playlists?.items.map(
                        (playlist) => (
                           <Box
                              className="hover:bg-slate-100 active:bg-slate-200 rounded p-2 w-[200px] transition-all duration-200 "
                              key={playlist.id}
                           >
                              <img
                                 src={playlist.images[0].url}
                                 alt="playlist"
                                 className="w-full h-full object-cover rounded"
                              />
                              <Flex direction="column" p="1">
                                 <Text size="2" weight="bold">
                                    {playlist.name}
                                 </Text>
                                 <Text
                                    size="1"
                                    weight=""
                                    color="gray"
                                    className=""
                                 >
                                    {playlist.owner.display_name}
                                 </Text>
                              </Flex>
                           </Box>
                        )
                     )}
                  </Slider>
               </Flex>
               <Flex direction="column" className="  w-[100%]" gap="3">
                  <Slider {...carouselSettings}>
                     {playlistRecommendations?.playlists?.items.map(
                        (playlist) => (
                           <Box
                              className="hover:bg-slate-100 active:bg-slate-200 rounded p-2 w-[200px] transition-all duration-200 "
                              key={playlist.id}
                           >
                              <img
                                 src={playlist.images[0].url}
                                 alt="playlist"
                                 className="w-full h-full object-cover rounded"
                              />
                              <Flex direction="column" p="1">
                                 <Text size="2" weight="bold">
                                    {playlist.name}
                                 </Text>
                                 <Text
                                    size="1"
                                    weight=""
                                    color="gray"
                                    className=""
                                 >
                                    {playlist.owner.display_name}
                                 </Text>
                              </Flex>
                           </Box>
                        )
                     )}
                  </Slider>
               </Flex>
               <Flex direction="column" className="  w-[100%]" gap="3">
                  <Slider {...carouselSettings}>
                     {playlistRecommendations?.playlists?.items.map(
                        (playlist) => (
                           <Box
                              className="hover:bg-slate-100 active:bg-slate-200 rounded p-2 w-[200px] transition-all duration-200 "
                              key={playlist.id}
                           >
                              <img
                                 src={playlist.images[0].url}
                                 alt="playlist"
                                 className="w-full h-full object-cover rounded"
                              />
                              <Flex direction="column" p="1">
                                 <Text size="2" weight="bold">
                                    {playlist.name}
                                 </Text>
                                 <Text
                                    size="1"
                                    weight=""
                                    color="gray"
                                    className=""
                                 >
                                    {playlist.owner.display_name}
                                 </Text>
                              </Flex>
                           </Box>
                        )
                     )}
                  </Slider>
               </Flex>
               <Flex direction="column" className="  w-[100%]" gap="3">
                  <Slider {...carouselSettings}>
                     {playlistRecommendations?.playlists?.items.map(
                        (playlist) => (
                           <Box
                              className="hover:bg-slate-100 active:bg-slate-200 rounded p-2 w-[200px] transition-all duration-200 "
                              key={playlist.id}
                           >
                              <img
                                 src={playlist.images[0].url}
                                 alt="playlist"
                                 className="w-full h-full object-cover rounded"
                              />
                              <Flex direction="column" p="1">
                                 <Text size="2" weight="bold">
                                    {playlist.name}
                                 </Text>
                                 <Text
                                    size="1"
                                    weight=""
                                    color="gray"
                                    className=""
                                 >
                                    {playlist.owner.display_name}
                                 </Text>
                              </Flex>
                           </Box>
                        )
                     )}
                  </Slider>
               </Flex>
               <Flex direction="column" className="  w-[100%]" gap="3">
                  <Slider {...carouselSettings}>
                     {playlistRecommendations?.playlists?.items.map(
                        (playlist) => (
                           <Box
                              className="hover:bg-slate-100 active:bg-slate-200 rounded p-2 w-[200px] transition-all duration-200 "
                              key={playlist.id}
                           >
                              <img
                                 src={playlist.images[0].url}
                                 alt="playlist"
                                 className="w-full h-full object-cover rounded"
                              />
                              <Flex direction="column" p="1">
                                 <Text size="2" weight="bold">
                                    {playlist.name}
                                 </Text>
                                 <Text
                                    size="1"
                                    weight=""
                                    color="gray"
                                    className=""
                                 >
                                    {playlist.owner.display_name}
                                 </Text>
                              </Flex>
                           </Box>
                        )
                     )}
                  </Slider>
               </Flex>
            </Box>
         </Flex>
      </>
   )
}

export default Browse
