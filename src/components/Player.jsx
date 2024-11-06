import React, { useEffect, useState } from 'react'
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
   const [volume, setVolume] = useState(50)
   const [isPlaying, setIsPlaying] = useState(false)
   const [isOnLoop, setIsOnLoop] = useState(false)
   const [isShuffled, setIsShuffled] = useState(false)
   const [spotifyPlayer, setSpotifyPlayer] = useState(null)

   useEffect(() => {
      let player
      window.onSpotifyWebPlaybackSDKReady = () => {
         const token = import.meta.env.VITE_APP_PLAYER_TOKEN
         player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: (cb) => {
               cb(token)
            },
            volume: volume / 100,
         })
         setSpotifyPlayer(player)
      }
   }, [])

   const playerManagement = async () => {
      try {
         console.log(spotifyPlayer)
         await spotifyPlayer.connect()
         console.log(
            'The Web Playback SDK successfully connected to Spotify! 😇'
         )

         console.log(spotifyPlayer)

         spotifyPlayer.addListener('player_state_changed', (state) => {
            console.log('state changed')
            if (!state) {
               return
            }
            console.log('track:')
            console.log(state.track_window.current_track)

            spotifyPlayer.getCurrentState().then((state) => {
               // !state ? setActive(false) : setActive(true)
               console.log(state)
            })
         })
      } catch (err) {
         console.error(err)
      }
   }

   useEffect(() => {
      if (!spotifyPlayer) return

      playerManagement()

      return () => {
         spotifyPlayer.disconnect()
      }
   }, [spotifyPlayer])

   return (
      <Flex direction="row" className="w-full  ">
         <Flex className="w-1/4 lg:w-1/6 bg-slate-50 mb-2">efe</Flex>
         <Flex
            direction="row"
            justify="center"
            align="center"
            className="w-2/4 lg:w-4/6 "
            // className="w-full bg-yellow-50"
         >
            <Flex className=" w-7/12 mb-2" direction="column">
               <Flex className="w-full flex-row justify-evenly p-3">
                  {/* <Box className="hover:bg-red-300 active:bg-red-500 rounded-full p-2 hover:text-white active:text-white transition-all duration-300">
                     <ShuffleIcon onClick={() => setIsShuffled(!isShuffled)} />
                  </Box> */}
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
                        children={
                           <PauseIcon onClick={() => setIsPlaying(false)} />
                        }
                     />
                  ) : (
                     <PlayerBox
                        children={
                           <PlayIcon onClick={() => setIsPlaying(true)} />
                        }
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
                  defaultValue={[volume]}
                  variant="soft"
                  highContrast
                  size="3"
               />
            </Flex>
         </Flex>
         <Flex
            className=" w-1/4 lg:w-1/6  mb-2"
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
                     defaultValue={[volume]}
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
         className={`hover:bg-red-300 active:bg-red-500 rounded-full p-2  transition-all duration-300 hover:text-white active:text-white ${className}`}
      >
         {children}
      </Box>
   )
}

export default Player
