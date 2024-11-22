import React, {
   useState,
   useCallback,
   useEffect,
   useRef,
   useContext,
} from 'react'
import useSpotifyInstance from '../hook/spotifyInstance'
import { Box, Flex, Slider } from '@radix-ui/themes'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
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
         className={`relative overflow-hidden ${className} ${
            onClick ? 'cursor-pointer hover:underline' : ''
         }`}
         onClick={onClick}
      >
         <div
            ref={textRef}
            className={`whitespace-nowrap ${
               shouldScroll ? 'animate-scrolling' : ''
            }`}
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

// Create a context for player and playback state
const PlayerContext = React.createContext(null)

const usePlayer = () => {
   const context = useContext(PlayerContext)
   if (!context) {
      throw new Error('usePlayer must be used within a PlayerProvider')
   }
   return context
}

const SongInfo = () => {
   const { playbackState } = usePlayer()
   const [currentTrack, setCurrentTrack] = useState(null)
   const navigate = useNavigate()

   useEffect(() => {
      if (playbackState && playbackState.track_window) {
         setCurrentTrack(playbackState.track_window.current_track)
      }
   }, [playbackState])

   if (!currentTrack) return null

   const handleArtistClick = () => {
      navigate(`/artist/${currentTrack.artists[0].uri.split(':')[2]}`)
   }

   return (
      <motion.div
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ duration: 0.2 }}
         key={currentTrack.id}
      >
         <Flex align="center" gap="3">
            <motion.div
               className="relative w-[56px] h-[56px] flex-shrink-0"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{
                  duration: 0.2,
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
               }}
               key={currentTrack.album.images[0].url}
            >
               <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.album.name}
                  className="absolute inset-0 w-full h-full object-cover rounded"
               />
            </motion.div>
            <Flex direction="column" gap="1" className="min-w-0 max-w-full">
               <ScrollingText
                  text={currentTrack.name}
                  className="font-semibold text-sm"
               />
               <ScrollingText
                  text={currentTrack.artists[0].name}
                  className="text-sm text-gray-500"
                  onClick={handleArtistClick}
               />
            </Flex>
         </Flex>
      </motion.div>
   )
}

const Controls = () => {
   const { player, playbackState } = usePlayer()
   const [isPlaying, setIsPlaying] = useState(false)
   const [isShuffle, setIsShuffle] = useState(false)
   const [isRepeat, setIsRepeat] = useState(false)
   const { spotifyApi } = useSpotifyInstance()

   useEffect(() => {
      if (playbackState) {
         setIsPlaying(!playbackState.paused)
      }
   }, [playbackState])

   if (!player) return null

   const handlePlayPause = async () => {
      if (isPlaying) {
         await player.pause()
      } else {
         await player.resume()
      }
      setIsPlaying(!isPlaying)
   }

   const handlePrevious = async () => {
      await player.previousTrack()
   }

   const handleNext = async () => {
      await player.nextTrack()
   }

   const handleShuffle = async () => {
      const newState = !isShuffle
      await spotifyApi.put(`/me/player/shuffle?state=${newState}`)
      setIsShuffle(newState)
   }

   const handleRepeat = async () => {
      const newState = !isRepeat
      const mode = newState ? 'track' : 'off'
      await spotifyApi.put(`/me/player/repeat?state=${mode}`)
      setIsRepeat(newState)
   }

   const buttonVariants = {
      hover: { scale: 1.1 },
      tap: { scale: 0.95 },
   }

   return (
      <Flex align="center" gap="4" justify="center">
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
               {!isPlaying ? (
                  <PlayIcon className="text-black" />
               ) : (
                  <PauseIcon className="text-black" />
               )}
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
   const { player, playbackState } = usePlayer()
   const [position, setPosition] = useState(0)
   const [duration, setDuration] = useState(0)
   const [isDragging, setIsDragging] = useState(false)
   const intervalRef = useRef()

   useEffect(() => {
      if (playbackState) {
         setDuration(playbackState.duration)
         if (!isDragging) {
            setPosition(playbackState.position)
         }
      }
   }, [playbackState, isDragging])

   useEffect(() => {
      if (playbackState && !playbackState.paused && !isDragging) {
         intervalRef.current = setInterval(() => {
            setPosition((prev) => Math.min(prev + 1000, duration))
         }, 1000)
      }

      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current)
         }
      }
   }, [playbackState, isDragging, duration])

   const formatTime = (ms) => {
      const totalSeconds = Math.floor(ms / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
   }

   const handleSliderChange = async (value) => {
      setPosition(value)
      if (player) {
         await player.seek(value)
      }
   }

   return (
      <Flex align="center" gap="2">
         <Box className="text-xs text-gray-400 w-10">
            {formatTime(position)}
         </Box>
         <Slider
            value={[position]}
            max={duration}
            step={1000}
            onValueChange={(value) => {
               setPosition(value[0])
               setIsDragging(true)
            }}
            onValueCommit={async (value) => {
               setIsDragging(false)
               await handleSliderChange(value[0])
            }}
            className="flex-1"
         />
         <Box className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
         </Box>
      </Flex>
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

const PlayerSpotify = ({ parentRef }) => {
   const [player, setPlayer] = useState(null)
   const [playbackState, setPlaybackState] = useState(null)
   const [isReady, setIsReady] = useState(false)
   const { token, spotifyApi } = useSpotifyInstance()
   const controls = useDragControls()
   useEffect(() => {
      if (!token) return
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true

      document.body.appendChild(script)

      window.onSpotifyWebPlaybackSDKReady = () => {
         const player = new window.Spotify.Player({
            name: 'Spotify React Web Player',
            getOAuthToken: (cb) => {
               cb(token)
            },
            volume: 0.5,
         })

         player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id)
            setIsReady(true)
            setPlayer(player)
         })

         player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id)
         })

         player.addListener('player_state_changed', (state) => {
            if (state) {
               setPlaybackState(state)
            }
         })

         player.connect()
      }

      return () => {
         if (player) {
            player.disconnect()
         }
      }
   }, [token])

   if (!isReady) return null

   return (
      <PlayerContext.Provider value={{ player, playbackState }}>
         <motion.div
            dragSnapToOrigin={true}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            drag
            dragConstraints={parentRef}
            dragControls={controls}
            dragListener={false}
            onPointerDown={(e) => {
               if (e.target.role === 'slider') {
               } else {
                  controls.start(e)
               }
            }}
            className={`w-10/12 bg-slate-100 rounded-lg p-4 mx-auto`}
         >
            <Flex justify="between" align="center">
               <Box className="w-1/3">
                  <SongInfo />
               </Box>
               <Box className="w-1/3">
                  <Controls />
               </Box>
               <Box className="w-1/3">
                  <ProgressBar />
               </Box>
            </Flex>
         </motion.div>
      </PlayerContext.Provider>
   )
}

export default PlayerSpotify
