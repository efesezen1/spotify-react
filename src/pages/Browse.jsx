import React, { useEffect } from 'react'
// import { useNavigate, useLocation, useLoaderData } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'

// import {
//    fetchPlaylistRecommendations,
//    fetchUser,
// } from '../store/slicers/userSlice'
import { Flex, Text, Box, Grid, Spinner } from '@radix-ui/themes'
import Slider from 'react-slick'
import { motion } from 'framer-motion'
import ItemRow from '../components/ItemRow'
import useSpotifyInstance from '../hook/spotifyInstance'
import { useQuery } from '@tanstack/react-query'

const Browse = ({ className }) => {
   const { spotifyApi, token } = useSpotifyInstance()

   const { data: playlistRecommendations, isLoading } = useQuery({
      queryKey: ['playlistRecommendations'],
      queryFn: () =>
         spotifyApi
            .get('/browse/featured-playlists?limit=10')
            .then((res) => res.data)
            .catch((err) => console.log(err)),

      enabled: !!token,
      refetchOnWindowFocus: false,
   })

   return (
      <Flex direction="column" className={` h-full ${className} `}>
         <Box className="  overflow-y-scroll overflow-x-hidden">
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
   )
}

export default Browse
