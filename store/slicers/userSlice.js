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

         const credentials = { token, id: response?.data?.id }
         dispatch(setCredentials(credentials))

         dispatch(fetchPlayerState(credentials))

         return response?.data
      } catch (error) {
         console.error(error?.response?.data?.error)
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

         return response?.data?.items
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

         dispatch(setPlayerState(response?.data))

         return response.data
      } catch (error) {
         console.error(error.response.data.error)
      }
   }
)

const fetchSelectedPlaylist = createAsyncThunk(
   'user/fetchSelectedPlaylist',
   async (url, { dispatch, getState }) => {
      const token = getState()?.user?.token
      console.log('Playlist fetching...')
      try {
         const response = await axios.get(url, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })

         dispatch(setSelectedPlaylist(response?.data))
         console.log('Fetch successful')

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

         return response?.data
      } catch (error) {}
   }
)

const userSlice = createSlice({
   name: 'user',
   initialState: {
      baseURL: 'https://api.spotify.com/v1',
      credentials: null,
      user: null,
      profilePicture: '',
      state: 'idle',
      error: null,
      token: '',
      userPlaylists: [],
      // returns an object with {message, playlists}
      playlistRecommendations: null,
      playerState: null,
      selectedPlaylist: null,
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

      setPlayerState: (state, action) => {
         state.playerState = action.payload
      },

      setSelectedPlaylist: (state, action) => {
         state.selectedPlaylist = action.payload
      },
      setCredentials: (state, action) => {
         state.credentials = action.payload
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
         .addCase(fetchSelectedPlaylist.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(fetchSelectedPlaylist.fulfilled, (state, action) => {
            state.status = 'succeeded'
         })
         .addCase(fetchSelectedPlaylist.rejected, (state, action) => {
            state.status = 'failed'

            state.error = action.error.message
         })
         .addCase(fetchPlaylistRecommendations.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(fetchPlaylistRecommendations.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.playlistRecommendations = action.payload
         })
         .addCase(fetchPlaylistRecommendations.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
         })
         .addCase(fetchUserPlaylists.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.userPlaylists = action.payload
         })
         .addCase(fetchUserPlaylists.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
         })
   },
})
export {
   fetchUser,
   fetchPlayerState,
   fetchUserPlaylists,
   fetchSelectedPlaylist,
   fetchPlaylistRecommendations,
}
export const {
   setUser,
   removeUser,
   setToken,
   setPlaylists,
   setPlaylistRecommendations,
   setPlayerState,
   setSelectedPlaylist,
   setCredentials,
} = userSlice.actions
export default userSlice.reducer
