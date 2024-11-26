import React, { useEffect } from 'react'
import { Box, Flex } from '@radix-ui/themes'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentSong, setIsPlaying } from '../store/slicers/userSlice'
import { motion, AnimatePresence } from 'framer-motion'
import {
   PauseIcon,
   PlayIcon,
   TimerIcon,
   ValueNoneIcon,
   Cross2Icon,
   MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import useSpotifyMutation from '../hook/useSpotifyMutation'

const TrackStatus = ({
   item,
   index,
   currentUserIdOnHover,
   selectedTrackId,
   currentSong,
}) => {
   const { isPlaying } = useSelector((state) => state.user)
   const dispatch = useDispatch()

   const iconVariants = {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
      hover: { scale: 1.1 },
   }

   const playTrack = useSpotifyMutation({
      mutationKey: ['playTrack'],
      endpoint: '/me/player/play',
      method: 'put'
   })

   const pauseTrack = useSpotifyMutation({
      mutationKey: ['stopTrack'],
      endpoint: '/me/player/pause',
      method: 'put'
   })

   return (
      <Flex className="w-[20px] h-[20px] relative flex items-center justify-center">
         <AnimatePresence mode="wait">
            {currentUserIdOnHover === item.id || selectedTrackId === item.id ? (
               isPlaying && currentSong.id === item.id ? (
                  <motion.div
                     key="pause"
                     variants={iconVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     whileHover="hover"
                     transition={{ duration: 0.1 }}
                     className="absolute"
                  >
                     <PauseIcon
                        onClick={() => {
                           dispatch(setIsPlaying(false))
                           pauseTrack.mutate({})
                        }}
                     />
                  </motion.div>
               ) : (
                  <motion.div
                     key="play"
                     variants={iconVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     whileHover="hover"
                     transition={{ duration: 0.1 }}
                     className="absolute"
                  >
                     <PlayIcon
                        onClick={() => {
                           dispatch(setCurrentSong(item))
                           playTrack.mutate(
                              {
                                 uris: [item.uri],
                                 position_ms: 0,
                              },
                              {
                                 onSuccess: () => {
                                    dispatch(setIsPlaying(true))
                                 },
                                 onError: (error) => {
                                    console.error(
                                       'An error occurred while playing track:',
                                       error
                                    )
                                 },
                              }
                           )
                        }}
                     />
                  </motion.div>
               )
            ) : (
               <motion.div
                  key="index"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.1 }}
                  className="absolute"
               >
                  <Box className="text-xs">{index + 1}</Box>
               </motion.div>
            )}
         </AnimatePresence>
      </Flex>
   )
}

export default TrackStatus
