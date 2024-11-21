import React from 'react'
// import { useNavigate, useLocation, useLoaderData } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'

// import {
//    fetchPlaylistRecommendations,
//    fetchUser,
// } from '../store/slicers/userSlice'
import { Box, Flex, Text, Grid } from '@radix-ui/themes'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { motion } from 'framer-motion'
import ItemRow from '../components/ItemRow'
import useSpotifyQuery from '../hook/useSpotifyQuery'
import useSpotifyInstance from '../hook/spotifyInstance'
import { useQuery } from '@tanstack/react-query'

const Browse = () => {
   const { token } = useSpotifyInstance()

   const { data: playlistRecommendations, isLoading } = useSpotifyQuery({
      queryKey: ['playlistRecommendations'],
      endpoint: '/browse/featured-playlists'
   })

   return (
      <Flex direction="column" className={` h-full `}>
         <Box className="  overflow-y-scroll overflow-x-hidden">
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
            <ItemRow playlistRecommendations={playlistRecommendations} isLoading={isLoading} />
         </Box>
      </Flex>
   )
}

export default Browse
