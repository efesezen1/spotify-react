import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
   WebPlaybackSDK,
   usePlaybackState,
   useSpotifyPlayer,
} from 'react-spotify-web-playback-sdk'
import useSpotifyInstance from '../hook/spotifyInstance'
import { Box, Flex, Slider } from '@radix-ui/themes'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
   PlayIcon,
   PauseIcon,
   TrackPreviousIcon,
   TrackNextIcon,
   LoopIcon,
   ShuffleIcon,
} from '@radix-ui/react-icons'

const ScrollingText = ({ text, className, onClick }) => {
   const containerRef = useRef(null)
   const textRef = useRef(null)
   const [shouldScroll, setShouldScroll] = useState(false)

   useEffect(() => {
      if (containerRef.current && textRef.current) {
         const shouldAnimate =
            textRef.current.scrollWidth > containerRef.current.clientWidth
         setShouldScroll(shouldAnimate)
      }
   }, [text])

   return (
      <div
         ref={containerRef}
         className={`relative overflow-hidden ${className} ${onClick ? 'cursor-pointer hover:underline' : ''}`}
         onClick={onClick}
      >
         <div
            ref={textRef}
            className={`whitespace-nowrap ${shouldScroll ? 'animate-scrolling' : ''}`}
         >
            {text}
         </div>
         {shouldScroll && (
            <>
               <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-transparent to-transparent z-10" />
               <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-transparent to-transparent z-10" />
            </>
         )}
      </div>
   )
}

const SongInfo = () => {
   const playbackState = usePlaybackState()
   const navigate = useNavigate()

   if (!playbackState) return null

   const {
      track_window: { current_track },
   } = playbackState

   const handleArtistClick = () => {
      navigate(`/artist/${current_track.artists[0].uri.split(':')[2]}`)
   }

   return (
      <motion.div
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ duration: 0.2 }}
         key={current_track.id}
      >
         <Flex align="center" gap="3">
            <motion.div 
               className="relative w-[56px] h-[56px] flex-shrink-0"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ 
                  duration: 0.2,
                  type: "spring",
                  stiffness: 400,
                  damping: 25
               }}
               key={current_track.album.images[0].url}
            >
               <img
                  src={current_track.album.images[0].url}
                  alt={current_track.album.name}
                  className="absolute inset-0 w-full h-full object-cover rounded"
               />
            </motion.div>
            <Flex direction="column" gap="1" className="min-w-0 max-w-full">
               <ScrollingText
                  text={current_track.name}
                  className="font-semibold text-sm"
               />
               <ScrollingText
                  text={current_track.artists[0].name}
                  className="text-sm text-gray-500"
                  onClick={handleArtistClick}
               />
            </Flex>
         </Flex>
      </motion.div>
   )
}

const Controls = () => {
   const player = useSpotifyPlayer()
   const playbackState = usePlaybackState()
   const [isPlaying, setIsPlaying] = useState(false)
   const [isShuffle, setIsShuffle] = useState(false)
   const [isRepeat, setIsRepeat] = useState(false)

   useEffect(() => {
      if (playbackState) {
         setIsPlaying(!playbackState.paused)
      }
   }, [playbackState])

   if (!player) return null

   const handlePlayPause = () => {
      player.togglePlay()
      setIsPlaying(!isPlaying)
   }

   const handlePrevious = () => {
      player.previousTrack()
   }

   const handleNext = () => {
      player.nextTrack()
   }

   const handleShuffle = () => {
      setIsShuffle(!isShuffle)
      // Add Spotify API call to toggle shuffle
   }

   const handleRepeat = () => {
      setIsRepeat(!isRepeat)
      // Add Spotify API call to toggle repeat
   }

   const buttonVariants = {
      hover: { scale: 1.1 },
      tap: { scale: 0.95 },
   }

   return (
      <Flex align="center" gap="4">
         <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
         >
            <ShuffleIcon
               className={`cursor-pointer ${isShuffle ? 'text-green-500' : ''}`}
               onClick={handleShuffle}
            />
         </motion.div>
         <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
         >
            <TrackPreviousIcon
               className="cursor-pointer"
               onClick={handlePrevious}
            />
         </motion.div>
         <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
         >
            <Box
               className="p-2 rounded-full bg-white cursor-pointer"
               onClick={handlePlayPause}
            >
               <motion.div
                  animate={{ rotate: isPlaying ? 180 : 0 }}
                  transition={{ 
                     duration: 0.15,
                     type: "spring",
                     stiffness: 400,
                     damping: 25
                  }}
               >
                  {!isPlaying ? (
                     <PlayIcon className="text-black" />
                  ) : (
                     <PauseIcon className="text-black" />
                  )}
               </motion.div>
            </Box>
         </motion.div>
         <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
         >
            <TrackNextIcon className="cursor-pointer" onClick={handleNext} />
         </motion.div>
         <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
         >
            <LoopIcon
               className={`cursor-pointer ${isRepeat ? 'text-green-500' : ''}`}
               onClick={handleRepeat}
            />
         </motion.div>
      </Flex>
   )
}

const ProgressBar = () => {
   const playbackState = usePlaybackState()
   const [progress, setProgress] = useState(0)

   useEffect(() => {
      if (!playbackState) return
      console.log(playbackState)
      setProgress((playbackState.position / playbackState.duration) * 100)
   }, [playbackState?.duration])

   return (
      <Slider
         size="1"
         value={[progress]}
         min={0}
         max={100}
         className="w-full"
      />
   )
}

const styles = `
@keyframes scrollText {
   0% {
      transform: translateX(0);
   }
   100% {
      transform: translateX(-100%);
   }
}

.animate-scrolling {
   animation: scrollText 15s linear infinite;
   will-change: transform;
}
`

const PlayerSpotify = () => {
   const { token } = useSpotifyInstance()
   const getOAuthToken = useCallback((callback) => callback(token), [token])

   useEffect(() => {
      // Add styles to head
      const styleSheet = document.createElement('style')
      styleSheet.innerText = styles
      document.head.appendChild(styleSheet)
      return () => styleSheet.remove()
   }, [])

   return (
      <Box className="w-10/12 bg-red-200 rounded-lg p-4 mx-auto">
         <WebPlaybackSDK
            initialDeviceName="Spotify Web Player"
            getOAuthToken={getOAuthToken}
            initialVolume={0.5}
            connectOnInitialized={true}
         >
            <Flex direction="column" gap="4">
               <Flex justify="between" align="center">
                  <Box className="w-1/4">
                     <SongInfo />
                  </Box>
                  <Box className="flex-1 flex justify-center">
                     <Controls />
                  </Box>
                  <Box className="w-1/4" /> {/* Empty box for symmetry */}
               </Flex>
               <ProgressBar />
            </Flex>
         </WebPlaybackSDK>
      </Box>
   )
}

export default PlayerSpotify
