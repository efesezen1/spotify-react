import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const userSlice = createSlice({
   name: 'user',
   initialState: {
      credentials: null,
      user: null,
      profilePicture: '',
      state: 'idle',
      error: null,
      token: null,
      userPlaylists: [],
      // returns an object with {message, playlists}
      playlistRecommendations: null,
      playerState: null,
      selectedPlaylist: null,
      followingArtists: null,
      topItems: null,
      currentArtist: null,
      currentSong: null,
      isPlaying: false,
      isOnLoop: false,
      isShuffled: false,
      isFollowing: [],
      volume: 50,
   },
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload

         state.profilePicture = action.payload.images[0].url
      },
      setCurrentSong: (state, action) => {
         console.log('setCurrentSong fired', action.payload)
         state.currentSong = action.payload
      },
      removeUser: (state) => {
         state.user = null
      },
      setToken: (state, action) => {
         state.token = action.payload
      },

      setPlayerState: (state, action) => {
         state.playerState = action.payload
      },

      setSelectedPlaylist: (state, action) => {
         state.selectedPlaylist = action.payload
      },
      setCredentials: (state, action) => {
         state.credentials = action.payload
      },
      setCurrentArtist: (state, action) => {
         state.currentArtist = action.payload
      },
      setIsPlaying: (state, action) => {
         state.isPlaying = action.payload
      },
      setIsOnLoop: (state, action) => {
         state.isOnLoop = action.payload
      },
      setIsShuffled: (state, action) => {
         state.isShuffled = action.payload
      },
      setError: (state, action) => {
         state.error = action.payload
      },
      setIsFollowing: (state, action) => {
         state.isFollowing = action.payload
      },
      setVolume: (state, action) => {
         state.volume = action.payload
      },
   },
})

export const {
   setPlaylists,
   setPlaylistRecommendations,
   setSelectedPlaylist,
   setCurrentArtist,
   setCredentials,
   setCurrentSong,
   setIsOnLoop,
   setIsPlaying,
   setIsShuffled,
   setIsFollowing,
   setVolume,
} = userSlice.actions
export default userSlice.reducer
