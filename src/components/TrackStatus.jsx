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

const TrackStatus = ({ item, index, currentUserIdOnHover, selectedTrack }) => {
   const { isPlaying, currentSong } = useSelector((state) => state.user)
   const dispatch = useDispatch()

   const iconVariants = {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
      hover: { scale: 1.1 }
   }

   return (
      <Flex className="w-[20px] h-[20px] relative flex items-center justify-center">
         <AnimatePresence mode="wait">
            {currentUserIdOnHover === item.id || selectedTrack === item.id ? (
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
                     <PlayIcon onClick={() => dispatch(setCurrentSong(item))} />
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
