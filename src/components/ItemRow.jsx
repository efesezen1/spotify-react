import { Box, Text, Flex, Skeleton } from '@radix-ui/themes'
import React from 'react'
import Slider from 'react-slick'

import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ItemRow = ({ playlistRecommendations, isLoading }) => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const carouselSettings = {
      dots: false,
      infinite: false,
      slidesToShow: 5,
      arrow: false,
      responsive: [
         {
            breakpoint: 950,
            settings: {
               slidesToShow: 5,
            },
         },
      ],
   }

   return (
      <Flex direction="column">
         <Box pl="1">
            {isLoading ? (
               <Skeleton>
                  <Text size="5" weight="bold">Featured Playlists</Text>
               </Skeleton>
            ) : (
               <Text
                  size="5"
                  weight="bold"
                  className="hover:underline select-none"
               >
                  {playlistRecommendations?.message}
               </Text>
            )}
         </Box>
         <Flex direction="column" className="w-[100%]" gap="3">
            <Slider {...carouselSettings}>
               {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 5 }).map((_, index) => (
                     <Box
                        key={`skeleton-${index}`}
                        className="rounded p-1"
                     >
                        <Skeleton className="w-[80px] h-[80px] rounded" />
                        <Flex direction="column" p="1" gap="1" className="w-[80px]">
                           <Skeleton>
                              <Text size="2" weight="bold">Playlist Name</Text>
                           </Skeleton>
                           <Skeleton>
                              <Text size="1" color="gray">Creator Name</Text>
                           </Skeleton>
                        </Flex>
                     </Box>
                  ))
               ) : (
                  playlistRecommendations?.playlists?.items.map((playlist) => (
                     <Box
                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                        key={playlist.id}
                        className="hover:backdrop-brightness-95 active:backdrop-brightness-90 rounded p-1 transition-all duration-200"
                     >
                        <img
                           src={playlist.images[0].url}
                           alt="playlist"
                           className="w-full h-full object-contain rounded"
                        />
                        <Flex direction="column" p="1">
                           <Text size="2" weight="bold" className="">
                              {playlist.name}
                           </Text>
                           <Text size="1" weight="" color="gray">
                              {playlist.owner.display_name}
                           </Text>
                        </Flex>
                     </Box>
                  ))
               )}
            </Slider>
         </Flex>
      </Flex>
   )
}

export default ItemRow
