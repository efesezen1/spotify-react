import axios from 'axios'
import React, {
   forwardRef,
   useContext,
   useEffect,
   useImperativeHandle,
   useRef,
   useState,
} from 'react'

import { useSelector } from 'react-redux'
import useSpotifyInstance from '../hook/spotifyInstance'

function reqWithToken(endpoint, access_token) {
   let source = axios.CancelToken.source()

   const request = async () => {
      let result
      const options = {
         url: endpoint,
         method: 'GET',
         headers: { Authorization: 'Bearer ' + access_token },
         cancelToken: source.token,
      }
      try {
         result = await axios(options)
      } catch (error) {
         if (axios.isCancel(error)) return
         return error
      }
      return result
   }

   return request
}

const updateWithToken = (enpoint, token, data) => {
   let source = axios.CancelToken.source()

   const request = async () => {
      let result
      const options = {
         url: enpoint,
         method: 'PUT',
         headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
         },
         data,
         cancelToken: source.token,
      }
      try {
         result = await axios(options)
      } catch (error) {
         if (axios.isCancel(error)) return
         return error
      }
      return result
   }

   return request
}

const postWithToken = (enpoint, access_token) => {
   let source = axios.CancelToken.source()

   const request = async () => {
      let result
      const options = {
         url: enpoint,
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
         },
         cancelToken: source.token,
      }
      try {
         result = await axios(options)
      } catch (error) {
         if (axios.isCancel(error)) return
         return error
      }
      return result
   }

   return request
}

function Player({ handleMaximize, isFullScreen }) {
   const { token } = useSpotifyInstance()
   const { currentTrack, setCurrentTrack } = /*  useContext(TrackContext) */ [
      1,
      () => 2,
   ]

   let fireyPlayer = useRef(null)

   const [toggleDevice, setToggleDevice] = useState(false)
   const [playbackState, setPlaybackState] = useState({
      loading: false,
      play: false,
      shuffle: false,
      repeat: false,
      progress: 0,
      duration: 0,
   })

   // handle ref from the start
   //    useImperativeHandle(ref, () => ({
   //       updateState: () => {
   //          setPlaybackState((state) => ({ ...state, play: true }))
   //          updateState()
   //       },
   //    }))

   // create a new cross browser audio player with spotify webplayback sdk
   const loadScript = () => {
      const script = document.createElement('script')
      script.id = 'spotify-player'
      script.type = 'text/javascript'
      script.async = 'async'
      script.defer = 'defer'
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      document.body.appendChild(script)
   }

   const InitializePlayer = () => {
      let { Player } = window.Spotify
      fireyPlayer = new Player({
         name: 'Firey Spotify',
         getOAuthToken: (cb) => {
            cb(token)
         },
      })
      // Error handling
      fireyPlayer.addListener('initialization_error', ({ message }) => {
         // console.log(message)
      })
      fireyPlayer.addListener('authentication_error', ({ message }) => {
         // console.log(message)
      })
      fireyPlayer.addListener('account_error', ({ message }) => {
         // console.log(message)
      })
      fireyPlayer.addListener('playback_error', ({ message }) => {
         // console.log(message)
      })
      // Playback status updates
      fireyPlayer.addListener('player_state_changed', (state) => {
         try {
            if (state) {
               const {
                  duration,
                  loading,
                  paused,
                  position,
                  repeat_mode,
                  shuffle,
                  track_window,
               } = state
               const { current_track } = track_window
               setCurrentTrack({ ...current_track, play: !paused })
               setPlaybackState((state) => ({
                  ...state,
                  loading: loading,
                  play: !paused,
                  shuffle: shuffle,
                  repeat: repeat_mode !== 0,
                  progress: position,
                  duration: duration,
               }))
            }
         } catch (error) {
            // console.log(error)
         }
      })
      // Ready
      fireyPlayer.addListener('ready', ({ device_id }) => {
         // console.log('Ready with Device ID', device_id)
      })
      // Not Ready
      fireyPlayer.addListener('not_ready', ({ device_id }) => {
         // console.log('Device ID has gone offline', device_id)
      })
      // Connect the player!
      // console.log('connetion success')
      fireyPlayer.connect()
   }

   const updateState = () => {
      if (!fireyPlayer.current) {
         getPlayerInfo()
      }
   }

   // get user's current player device infomations
   const getPlayerInfo = (_) => {
      const reqInformations = reqWithToken(
         'https://api.spotify.com/v1/me/player',
         token
      )
      const getFunc = async () => {
         try {
            const response = await reqInformations()
            if (response.status === 200) {
               const { data } = response
               const {
                  is_playing,
                  item,
                  progress_ms,
                  repeat_state,
                  shuffle_state,
               } = data
               setCurrentTrack({ ...item, play: is_playing })
               setPlaybackState((state) => ({
                  ...state,
                  play: is_playing,
                  shuffle: shuffle_state,
                  repeat: repeat_state !== 'off',
                  duration: item.duration_ms,
                  progress: progress_ms,
               }))
            } else if (response.status === 204) {
               // setFlash(
               //    'Please select a device to start listening on FIREY SPOTIFY '
               // )
            } else {
               // setFlash('Error from Spotify Server')
            }
         } catch (error) {
            // console.log(error)
         }
      }
      getFunc()
   }

   // playback func
   // const playbackFunc = (ratio) => {
   //     const playback_duration = ratio * playbackState.duration;
   //     setPlaybackScrub(playback_duration);
   // };

   // seek position playback
   // const seekPlaybackPosition = (ratio) => {
   //     const position_ms = Math.round(ratio * playbackState.duration);
   //     const requestFunc = updateWithToken(`https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`, token);
   //     const seekPosition = async _ => {
   //         try {
   //             const response = await requestFunc();
   //             if (response.status === 204) {
   //                 setPostionPb(ratio);
   //                 setPostionPb(state => ({ ...state, progress: position_ms }));
   //                 updateState();
   //             }
   //         } catch (error) {
   //             console.log(error)
   //         }
   //     };

   //     seekPosition();
   //     setPlaybackScrub(null);
   // };

   // play / resume, pause track
   const toggleMusic = (_) => {
      const request = updateWithToken(
         `${
            playbackState.play
               ? `https://api.spotify.com/v1/me/player/pause`
               : `https://api.spotify.com/v1/me/player/play`
         }`,
         token
      )
      const requestFunc = async (_) => {
         try {
            const response = await request()
            if (response.status === 204) {
               setPlaybackState((state) => ({ ...state, play: !state.play }))
               updateState()
            } else {
               // setFlash('Opps, something went wrong!')
               return
            }
         } catch (error) {
            // console.log(error)
         }
      }

      requestFunc()
   }

   // enable shuffle mode
   const toggleShuffle = (_) => {
      const request = updateWithToken(
         `https://api.spotify.com/v1/me/player/shuffle?state=${!playbackState.shuffle}`,
         token
      )
      const requestFunc = async (_) => {
         try {
            const response = await request()
            if (response.status === 204) {
               setPlaybackState((state) => ({
                  ...state,
                  shuffle: !state.shuffle,
               }))
               // setFlash(
               //    `Shuffle ${playbackState.shuffle ? 'disabled' : 'enabled'}`
               // )
            } else {
               // setFlash('Opps, something went wrong!')
               return
            }
         } catch (error) {
            // console.log(error)
         }
      }

      requestFunc()
   }

   // get previous track
   const skipPrevious = (_) => {
      const request = postWithToken(
         'https://api.spotify.com/v1/me/player/previous',
         token
      )
      const requestFunc = async (_) => {
         try {
            const response = await request()
            if (response.status !== 204) {
               // setFlash('Opps, something went wrong!')
               return
            }
         } catch (error) {
            // console.log(error)
         }
      }

      requestFunc()
   }

   // get next track
   const skipNext = (_) => {
      const request = postWithToken(
         'https://api.spotify.com/v1/me/player/next',
         token
      )
      const requestFunc = async (_) => {
         try {
            const response = await request()
            if (response.status !== 204) {
               // setFlash('Opps, something went wrong!')
               return
            }
         } catch (error) {
            // console.log(error)
         }
      }

      requestFunc()
   }

   // enable repeat mode
   const toggleRepeat = (_) => {
      const request = updateWithToken(
         `https://api.spotify.com/v1/me/player/repeat?state=${
            playbackState.repeat ? `off` : `track`
         }`,
         token
      )
      const requestFunc = async (_) => {
         try {
            const response = await request()
            if (response.status === 204) {
               setPlaybackState((state) => ({
                  ...state,
                  repeat: !state.repeat,
               }))
               // setFlash(
               //    `Repeat mode ${playbackState.repeat ? 'disabled' : 'enabled'}`
               // )
            } else {
               // setFlash('Opps, something went wrong!')
               return
            }
         } catch (error) {
            // console.log(error)
         }
      }

      requestFunc()
   }

   useEffect(() => {
      // initialize script

      if (!token) return
      // console.log('token', token)
      loadScript()
      getPlayerInfo()
      window.onSpotifyWebPlaybackSDKReady = () => InitializePlayer()
      // get current state of the player
      return () => {
         fireyPlayer.disconnect()
      }
      // eslint-disable-next-line
   }, [token])

   return (
      <>
         <div className="bg-white">
            currentTrack - {currentTrack}
            <button onClick={() => setCurrentTrack()}>setCurrentTrack</button>
            <div>
               <div className="player_controls">
                  <div className="player_shuffle">
                     <button onClick={toggleShuffle}>
                        {/* <ShufflePlayIcon
                           fill={
                              playbackState.shuffle
                                 ? `rgba(29, 185, 84, 1)`
                                 : `rgba(179, 179, 179, 1)`
                           }
                        /> */}
                        'shuffle'
                     </button>
                  </div>
                  <div className="player_previous">
                     <button onClick={skipPrevious}>
                        {/* <PreviousPlayIcon /> */}
                        'previous'
                     </button>
                  </div>
                  <div onClick={toggleMusic} className="player_play_controls">
                     <button>
                        {playbackState.play && playbackState.loading === false
                           ? //    <PauseIcon />
                             'pause'
                           : //    <PlayIcon />
                             'play'}
                     </button>
                  </div>
                  <div className="player_next">
                     <button onClick={skipNext}>
                        {/* <NextPlayIcon /> */}
                        'next'
                     </button>
                  </div>
                  <div className="player_repeat">
                     <button onClick={toggleRepeat}>
                        {/* <RepeatPlayIcon
                           fill={
                              playbackState.repeat
                                 ? `rgba(29, 185, 84, 1)`
                                 : `rgba(179, 179, 179, 1)`
                           }
                        /> */}
                        'repeat'
                     </button>
                  </div>
               </div>
               {/* <div className="player_progress_bar">
                        <div className="duration">
                            {playbackScrub ? minutesAndSeconds(playbackScrub) : minutesAndSeconds(playbackState.progress)}
                        </div>
                        <Progressbar
                            value={positionPb}
                            setValue={(ratio) => seekPlaybackPosition(ratio)}
                            func={playbackFunc}
                        />
                        <div className="duration">
                            {minutesAndSeconds(playbackState.duration)}
                        </div>
                    </div> */}
            </div>
            <div>
               <button onClick={toggleDevice}>toggleDevice</button>
               <button onClick={setToggleDevice}>setToggleDevice</button>
            </div>
         </div>
      </>
   )
}

export default Player
