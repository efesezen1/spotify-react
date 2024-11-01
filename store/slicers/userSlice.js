import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'

const fetchUser = createAsyncThunk(
   'user/fetchUser',
   async (token, { dispatch }) => {
      try {
         const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })
         dispatch(setToken(token))

         const credentials = { token, id: response.data.id }
         dispatch(fetchUserPlaylists(credentials))
         dispatch(fetchPlayerState(credentials))
         dispatch(fetchPlaylistRecommendations(credentials))
         return response.data
      } catch (error) {
         console.error(error.response.data.error)
      }
   }
)

const fetchUserPlaylists = createAsyncThunk(
   'user/fetchPlaylists',
   async ({ token, id }, { dispatch, getState }) => {
      try {
         const response = await axios.get(
            `https://api.spotify.com/v1/users/${id}/playlists`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         )
         dispatch(setPlaylists(response.data.items))
         return response.data.items
      } catch (error) {
         console.error(error.response.data.error)
      }
   }
)

const fetchPlayerState = createAsyncThunk(
   'user/fetchPlayerState',
   async ({ token, id }, { dispatch, getState }) => {
      try {
         const response = await axios.get(
            `https://api.spotify.com/v1/me/player`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         )

         dispatch(setPlayerState(response.data))
         console.log(response.data)
         return response.data
      } catch (error) {
         console.error(error.response.data.error)
      }
   }
)

const fetchPlaylistRecommendations = createAsyncThunk(
   'user/fetchPlaylistRecommendation',
   async ({ token, id }, { dispatch, getState }) => {
      try {
         const response = await axios.get(
            `https://api.spotify.com/v1/browse/featured-playlists?limit=10`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         )

         dispatch(setPlaylistRecommendations(response.data))
         return response.data
      } catch (error) {}
   }
)

const userSlice = createSlice({
   name: 'user',
   initialState: {
      baseURL: 'https://api.spotify.com/v1',
      user: null,
      profilePicture: '',
      state: 'idle',
      error: null,
      token: '',
      userPlaylists: [],
      // returns an object with {message, playlists}
      playlistRecommendations: {},
      playerState: null,
   },
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload

         state.profilePicture = action.payload.images[0].url
      },
      removeUser: (state) => {
         state.user = null
      },
      setToken: (state, action) => {
         state.token = action.payload
      },
      setPlaylists: (state, action) => {
         state.userPlaylists = action.payload
      },
      setPlayerState: (state, action) => {
         state.playerState = action.payload
      },
      setPlaylistRecommendations: (state, action) => {
         state.playlistRecommendations = action.payload
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchUser.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(fetchUser.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.user = action.payload
            state.profilePicture = action.payload.images[0].url
         })
         .addCase(fetchUser.rejected, (state, action) => {
            state.status = 'failed'
            state.user = null
            state.error = action.error.message
         })
   },
})
export { fetchUser, fetchPlayerState }
export const {
   setUser,
   removeUser,
   setToken,
   setPlaylists,
   setPlaylistRecommendations,
} = userSlice.actions
export default userSlice.reducer
