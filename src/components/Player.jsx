import React, { useEffect, useRef, useState } from 'react'
import { Flex, Box, Slider } from '@radix-ui/themes'
import {
   LoopIcon,
   TrackNextIcon,
   TrackPreviousIcon,
   PlayIcon,
   SpeakerLoudIcon,
   PauseIcon,
   SizeIcon,
   SpeakerQuietIcon,
   SpeakerModerateIcon,
   MaskOnIcon,
   ShuffleIcon,
   SpeakerOffIcon,
} from '@radix-ui/react-icons'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import QueueIcon from './icon/QueueIcon'
import MicrophoneIcon from './icon/MicrophoneIcon'
import DevicesIcon from './icon/DevicesIcon'
import { useDispatch, useSelector } from 'react-redux'
import {
   setIsPlaying,
   setIsShuffled,
   setIsOnLoop,
} from '../store/slicers/userSlice'
import { Link } from 'react-router-dom'

const Player = ({ className, previewUrl, parentRef }) => {
   const [snapToOrigin, setSnapToOrigin] = useState(false)
   const dispatch = useDispatch()
   const [volume, setVolume] = useState(50)
   const audioRef = useRef(null)
   const controls = useDragControls()
   const [currentTime, setCurrentTime] = useState(0)
   const { currentSong, isPlaying, isOnLoop, isShuffled } = useSelector(
      (state) => state.user
   )
   // Toggle play/pause
   const togglePlayPause = () => {
      if (isPlaying) {
         audioRef.current.pause()
      } else {
         audioRef.current.play()
      }
      dispatch(setIsPlaying(!isPlaying))
   }

   // Handle volume changes
   useEffect(() => {
      if (!currentSong) return
      if (audioRef.current) {
         audioRef.current.volume = volume / 100
      }
   }, [volume, currentSong])

   useEffect(() => {
      if (!currentSong) return
      const audio = audioRef.current

      const updateTime = () => {
         const duration = audio.duration || 1 // Avoid division by zero
         setCurrentTime((audio.currentTime / duration) * 100)
      }

      const handleEnded = () => {
         dispatch(setIsPlaying(false))
      }

      audio?.addEventListener('timeupdate', updateTime)
      audio?.addEventListener('ended', handleEnded)

      return () => {
         audio?.removeEventListener('timeupdate', updateTime)
         audio?.removeEventListener('ended', handleEnded)
      }
   }, [audioRef, currentSong])

   useEffect(() => {
      !isPlaying && audioRef?.current?.pause()
   }, [isPlaying, currentSong])

   useEffect(() => {
      if (!currentSong) return
      console.log(currentSong)
      audioRef.current.pause()
      dispatch(setIsPlaying(false))
      audioRef.current.play()
      dispatch(setIsPlaying(true))
   }, [currentSong])

   return (
      <AnimatePresence>
         {currentSong ? (
            <motion.div
               key="modal"
               dragSnapToOrigin={true}
               exit={{ opacity: 0, scale: 1.1 }}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               drag
               dragConstraints={parentRef}
               className={` flex flex-row ${className} w-10/12 rounded-full   p-10 z-20 bg-slate-200 `}
               dragControls={controls}
               dragListener={false}
               onPointerDown={(e) => {
                  if (e.target.role === 'slider') {
                     console.log(e.target.role)
                     console.log(e.target.role === 'slider')
                  } else {
                     controls.start(e)
                  }
               }}
            >
               <audio
                  ref={audioRef}
                  src={currentSong?.preview_url || currentSong?.preview_url}
                  loop={isOnLoop}
               />

               <Flex
                  className="w-1/4 lg:w-1/6 mb-2"
                  direction="row"
                  align="center"
               >
                  <img
                     className="sidebar-image"
                     src={currentSong?.album?.images?.at(-1)?.url}
                     alt=""
                  />
                  <Flex direction="column" pl="2">
                     <Link to={`/album/${currentSong?.album?.id}`}>
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

               <Flex
                  direction="row"
                  justify="center"
                  align="center"
                  className="w-2/4 lg:w-4/6"
               >
                  <Flex className="w-7/12 mb-2" direction="column">
                     <Flex className="w-full flex-row justify-evenly p-3">
                        <PlayerBox
                           onClick={() => dispatch(setIsShuffled(!isShuffled))}
                           children={<ShuffleIcon />}
                        />
                        <PlayerBox children={<TrackPreviousIcon />} />
                        {isPlaying ? (
                           <PlayerBox
                              onClick={togglePlayPause}
                              children={<PauseIcon />}
                           />
                        ) : (
                           <PlayerBox
                              onClick={togglePlayPause}
                              children={<PlayIcon />}
                           />
                        )}
                        <PlayerBox children={<TrackNextIcon />} />
                        <PlayerBox
                           onClick={() => dispatch(setIsOnLoop(!isOnLoop))}
                           children={<LoopIcon />}
                        />
                     </Flex>
                     <Slider
                        type="range"
                        value={[currentTime]}
                        onValueChange={(value) =>
                           (audioRef.current.currentTime =
                              (value[0] / 100) * audioRef.current.duration)
                        }
                        variant="soft"
                        highContrast
                        size="3"
                     />
                  </Flex>
               </Flex>

               <Flex
                  className="w-1/4 lg:w-1/6 mb-2"
                  align="center"
                  justify="center"
                  direction="column"
               >
                  <Flex className="w-full flex-row justify-evenly items-center p-3 ">
                     <PlayerBox children={<QueueIcon />} />
                     <PlayerBox children={<MicrophoneIcon />} />
                     <PlayerBox children={<DevicesIcon />} className={'mr-2'} />

                     <Flex className="w-4/12" direction="row" align="center">
                        <SpeakerModerateIcon />
                        <Slider
                           type="range"
                           value={[volume]}
                           onValueChange={(value) => setVolume(value[0])}
                           variant="soft"
                           highContrast
                           size="1"
                        />
                     </Flex>
                     <PlayerBox children={<SizeIcon />} className={'ml-2'} />
                  </Flex>
               </Flex>
            </motion.div>
         ) : null}
      </AnimatePresence>
   )
}

const PlayerBox = ({ children, className, onClick }) => {
   return (
      <Box
         onClick={onClick}
         className={`hover:bg-red-300 active:bg-red-500 rounded-full p-2 transition-all duration-300 hover:text-white active:text-white ${className}`}
      >
         {children}
      </Box>
   )
}

export default Player
