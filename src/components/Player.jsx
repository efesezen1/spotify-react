import React, { useState } from 'react'
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
const Player = () => {
   const [isPlaying, setIsPlaying] = useState(false)
   const [isOnLoop, setIsOnLoop] = useState(false)
   const [isShuffled,setIsShuffled] = useState(false) 
   return (
      <Flex direction="row" className="w-full ">
         <Box className="w-1/4 lg:w-1/6">efe</Box>
         <Flex
            direction="row"
            justify="between"
            align="center"
            className="w-3/4 lg:w-5/6"
         >
            <Flex className=" w-7/12" direction="column">
               <Flex className="w-full flex-row justify-evenly p-3 ">
                  <ShuffleIcon onClick={() => setIsShuffled(!isShuffled)} color={isShuffled ? 'teal' : 'black'} />
                  <TrackPreviousIcon />
                  {isPlaying ? (
                     <PauseIcon onClick={() => setIsPlaying(false)} />
                  ) : (
                     <PlayIcon onClick={() => setIsPlaying(true)} />
                  )}
                  <TrackNextIcon />
                  <LoopIcon
                     onClick={() => setIsOnLoop(!isOnLoop)}
                     color={isOnLoop ? 'teal' : 'black'}
                  />
               </Flex>
               <Slider
                  defaultValue={[75]}
                  variant="soft"
                  color="teal"
                  size="1"
               />
            </Flex>
            <Flex className=" w-4/12" direction="column">
               <Flex className="w-full flex-row justify-evenly items-center p-3 ">
                  <QueueIcon />
                  <MicrophoneIcon />
                  <DevicesIcon />
                  <Flex className="w-4/12" direction="row" align="center">
                     <SpeakerModerateIcon />
                     <Slider
                        defaultValue={[75]}
                        variant="soft"
                        color="teal"
                        size="1"
                     />
                  </Flex>
                  <SizeIcon />
               </Flex>
            </Flex>
         </Flex>
      </Flex>
   )
}

export default Player
