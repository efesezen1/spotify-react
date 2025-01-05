import React from 'react'
import { useCallback } from 'react'
import useSpotifyInstance from '../hook/spotifyInstance'
import {
   WebPlaybackSDK,
   usePlaybackState,
   useSpotifyPlayer,
} from 'react-spotify-web-playback-sdk'

const SongTitle = () => {
   const playbackState = usePlaybackState()

   if (playbackState === null) return null

   return <p>Current song: {playbackState.track_window.current_track.name}</p>
}

const TogglePlay = () => {
   const player = useSpotifyPlayer()

   if (!player) return null

   return (
      <button
         onClick={() => {
            player.togglePlay()
         }}
      >
         toggle play
      </button>
   )
}

const SpotifyPlayer = () => {
   const { token } = useSpotifyInstance()


   return (
      <div className="bg-red-500 w-10/12 rounded-lg p-2 z-20 min-h-full">
         <WebPlaybackSDK
            initialDeviceName="My awesome Spotify app"
            getOAuthToken={getOAuthToken}
            initialVolume={0.5}
            connectOnInitialized={true}
         >
            <TogglePlay />
            <SongTitle />
         </WebPlaybackSDK>
      </div>
   )
}

export default SpotifyPlayer
