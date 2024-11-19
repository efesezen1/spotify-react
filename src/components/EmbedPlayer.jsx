import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Flex } from '@radix-ui/themes'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
const EmbedPlayer = ({ className }) => {
   const { currentSong, isPlaying, isOnLoop, isShuffled } = useSelector(
      (state) => state.user
   )
   return (
      <AnimatePresence>
         <motion.div
            key="modal"
            exit={{ opacity: 0, scale: 1.1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${className}  sticky bottom-0 left-0 w-full bg-slate-200 h-1/6 rounded-lg`}
         >
            <Flex
               className="w-1/4 lg:w-3/12 mb-2 py-2"
               direction="row"
               align="center"
            >
               <img
                  className="sidebar-image "
                  src={currentSong?.album?.images?.at(-1)?.url}
                  alt=""
               />
               <Flex direction="column" pl="2">
                  <Link
                     to={`/album/${currentSong?.album?.id}`}
                     className="whitespace-nowrap text-ellipsis"
                  >
                     {currentSong?.name}
                  </Link>
                  <Box className=" whitespace-nowrap text-ellipsis text-sm">
                     {currentSong?.artists
                        .map((artist) => (
                           <Link
                              to={`/artist/${artist.id}`}
                              key={artist.id}
                              className="hover:underline"
                           >
                              {artist.name}
                           </Link>
                        ))
                        .reduce((prev, curr) => [prev, ', ', curr])}
                  </Box>
               </Flex>
            </Flex>
         </motion.div>
      </AnimatePresence>
   )
}

export default EmbedPlayer
