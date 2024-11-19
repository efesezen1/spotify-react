import React, { useEffect } from 'react'
import { Box, Flex } from '@radix-ui/themes'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentSong, setIsPlaying } from '../store/slicers/userSlice'
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
   return (
      <Flex className="max-w-[20px] ">
         {currentUserIdOnHover === item.id || selectedTrack === item.id ? (
            isPlaying ? (
               currentSong.id === item.id ? (
                  <PauseIcon
                     onClick={() => {
                        dispatch(setIsPlaying(false))
                     }}
                  />
               ) : null
            ) : (
               <PlayIcon onClick={() => dispatch(setCurrentSong(item))} />
            )
         ) : (
            <Box className="text-xs  ">{index + 1}</Box>
         )}
      </Flex>
   )
}

export default TrackStatus
