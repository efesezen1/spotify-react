import { Box, Text, Flex } from '@radix-ui/themes'
import React from 'react'
import Slider from 'react-slick'

const ItemRow = ({ playlistRecommendations }) => {
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
         <Box pl="2">
            <Text size="5" weight="bold" className="hover:underline  ">
               {playlistRecommendations?.message}
            </Text>
         </Box>
         <Flex direction="column" className="  w-[100%]" gap="3">
            <Slider {...carouselSettings}>
               {playlistRecommendations?.playlists?.items.map((playlist) => (
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
                        <Text size="1" weight="" color="gray" className="">
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
