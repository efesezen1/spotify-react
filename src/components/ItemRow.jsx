import { Box, Text, Flex } from '@radix-ui/themes'
import React from 'react'
import Slider from 'react-slick'
import { fetchSelectedPlaylist } from '../store/slicers/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const ItemRow = ({ playlistRecommendations }) => {
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
            <Text
               size="5"
               weight="bold"
               className="hover:underline select-none  "
            >
               {playlistRecommendations?.message}
            </Text>
         </Box>
         <Flex direction="column" className="  w-[100%]" gap="3">
            <Slider {...carouselSettings}>
               {playlistRecommendations?.playlists?.items.map((playlist) => (
                  <Box
                     onClick={
                        () =>
                           dispatch(fetchSelectedPlaylist(playlist.href)).then(
                              () => {
                                 navigate(`/playlist/${playlist.id}`)
                              }
                           )
                        // fetchPlaylist(playlist.href)
                     }
                     key={playlist.id}
                     className="hover:backdrop-brightness-95 active:backdrop-brightness-90 rounded p-1  transition-all duration-200 "
                  >
                     <img
                        src={playlist.images[0].url}
                        alt="playlist"
                        className="w-full h-full object-contain rounded"
                     />
                     <Flex direction="column" p="1">
                        <Text size="2" weight="bold " className="">
                           {playlist.name}
                        </Text>
                        <Text size="1" weight="" color="gray">
                           {playlist.owner.display_name}
                        </Text>
                     </Flex>
                  </Box>
               ))}
            </Slider>
         </Flex>
      </Flex>
   )
}

export default ItemRow
