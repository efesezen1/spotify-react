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
   ShuffleIcon,
   SpeakerOffIcon,
} from '@radix-ui/react-icons'
import QueueIcon from './icon/QueueIcon'
import MicrophoneIcon from './icon/MicrophoneIcon'
import DevicesIcon from './icon/DevicesIcon'

const Player = ({ previewUrl }) => {
   const [volume, setVolume] = useState(50)
   const [isPlaying, setIsPlaying] = useState(false)
   const [isOnLoop, setIsOnLoop] = useState(false)
   const [isShuffled, setIsShuffled] = useState(false)
   const audioRef = useRef(null)

   // Toggle play/pause
   const togglePlayPause = () => {
      if (isPlaying) {
         audioRef.current.pause()
      } else {
         audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
   }

   // Handle volume changes
   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.volume = volume / 100
      }
   }, [volume])

   return (
      <Flex direction="row" className="w-full">
         <audio ref={audioRef} src={previewUrl} loop={isOnLoop} />

         <Flex className="w-1/4 lg:w-1/6 bg-slate-50 mb-2">efe</Flex>

         <Flex
            direction="row"
            justify="center"
            align="center"
            className="w-2/4 lg:w-4/6"
         >
            <Flex className="w-7/12 mb-2" direction="column">
               <Flex className="w-full flex-row justify-evenly p-3">
                  <PlayerBox
                     children={
                        <ShuffleIcon
                           onClick={() => setIsShuffled(!isShuffled)}
                        />
                     }
                  />
                  <PlayerBox children={<TrackPreviousIcon />} />
                  {isPlaying ? (
                     <PlayerBox
                        children={<PauseIcon onClick={togglePlayPause} />}
                     />
                  ) : (
                     <PlayerBox
                        children={<PlayIcon onClick={togglePlayPause} />}
                     />
                  )}
                  <PlayerBox children={<TrackNextIcon />} />
                  <PlayerBox
                     children={
                        <LoopIcon onClick={() => setIsOnLoop(!isOnLoop)} />
                     }
                  />
               </Flex>
               <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
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
      </Flex>
   )
}

const PlayerBox = ({ children, className }) => {
   return (
      <Box
         className={`hover:bg-red-300 active:bg-red-500 rounded-full p-2 transition-all duration-300 hover:text-white active:text-white ${className}`}
      >
         {children}
      </Box>
   )
}

export default Player
