import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../../store/slicers/userSlice'
import { Flex, Text, Box, Grid } from '@radix-ui/themes'
import Slider from 'react-slick'
import { motion } from 'framer-motion'
import ItemRow from '../components/ItemRow'

const Browse = ({ className }) => {
   const { playlistRecommendations } = useSelector((state) => state.user)

   return (
      <>
         <Flex direction="column" gap="3" className={`h-full ${className} `}>
            <Box className=" h-full overflow-y-scroll overflow-x-hidden" p="3">
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
               <ItemRow playlistRecommendations={playlistRecommendations} />
            </Box>
         </Flex>
      </>
   )
}

export default Browse
