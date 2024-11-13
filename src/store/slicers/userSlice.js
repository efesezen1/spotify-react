import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const spotifyApi = axios.create({
   baseURL: 'https://api.spotify.com/v1',
})

const getItem = (path, token) =>
   spotifyApi.get(path, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   })

const fetchUser = createAsyncThunk(
   'user/fetchUser',
   async (token, { dispatch }) => {
      try {
         const response = await getItem('/me', token)
         const credentials = { token, id: response?.data?.id }
         dispatch(setCredentials(credentials))
         dispatch(setToken(token))
         return response?.data
      } catch (error) {
         console.error(error?.response?.data?.error)
      }
   }
)

const fetchUserPlaylists = createAsyncThunk(
   'user/fetchPlaylists',
   async ({ id }, { dispatch, getState }) => {
      try {
         const token = getState()?.user?.token
         const response = await getItem(`/users/${id}/playlists`, token)

         return response?.data?.items
      } catch (error) {
         console.error(error.response.data.error)
      }
   }
)

const fetchPlayerState = createAsyncThunk(
   'user/fetchPlayerState',
   async ({ id }, { dispatch, getState }) => {
      try {
         const token = getState()?.user?.token

         const response = await getItem(`/me/player`, token)

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

         return response.data
      } catch (error) {
         console.error(error.response.data.error)
      }
   }
)

const fetchPlaylistRecommendations = createAsyncThunk(
   'user/fetchPlaylistRecommendations',
   async ({ id }, { dispatch, getState }) => {
      try {
         const token = getState()?.user?.token
         const response = await getItem(
            `/browse/featured-playlists?limit=10`,
            token
         )

         return response?.data
      } catch (error) {}
   }
)
const fetchFollowingArtists = createAsyncThunk(
   'user/fetchFollowingArtists',
   async (_, { dispatch, getState }) => {
      try {
         const token = getState()?.user?.token

         const response = await getItem('/me/following?type=artist', token)

         return response?.data
      } catch (error) {}
   }
)
const fetchArtist = createAsyncThunk(
   'user/fetchArtist',
   async ({ id }, { dispatch, getState }) => {
      try {
         const token = getState()?.user?.token
         const responseArtist = spotifyApi.get(`/artists/${id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })

         const responsePopularSongs = spotifyApi.get(
            `/artists/${id}/top-tracks`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         )
         const responseAlbums = spotifyApi.get(`/artists/${id}/albums`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         })

         const [artist, popularSongs, albums] = await Promise.all([
            responseArtist,
            responsePopularSongs,
            responseAlbums,
         ])

         return {
            artist: artist.data,
            popularSongs: popularSongs.data,
            albums: albums.data,
         }
      } catch (error) {}
   }
)
const fetchUserTopItems = createAsyncThunk(
   'user/fetchUserTopItems',
   async (_, { dispatch, getState }) => {
      const token = getState()?.user?.token
      // Recursive helper function to accumulate results
      // const fetchData = async (url, accumulatedItems = []) => {
      //    try {
      //       const response = await spotifyApi.get(url, {
      //          headers: {
      //             Authorization: `Bearer ${token}`,
      //          },
      //       })
      //       const data = response.data
      //       const combinedItems = [...accumulatedItems, ...data.items]

      //       // If there's a `next` URL, fetch the next page recursively
      //       if (data.next) {
      //          return await fetchData(data.next, combinedItems)
      //       } else {
      //          // No more pages, return the combined results
      //          return combinedItems
      //       }
      //    } catch (error) {
      //       throw new Error('Failed to fetch user top items.')
      //    }
      // }

      const fetchData = async (url) => {
         try {
            const response = await spotifyApi.get(url, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            return response.data
         } catch (error) {
            throw new Error('Failed to fetch user top items.')
         }
      }

      // Start the recursive fetching from the initial URL
      const initialUrl = '/me/top/artists'
      const topItems = await fetchData(initialUrl)
      return topItems
   }
)

const createPlaylist = createAsyncThunk(
   'user/createPlaylist',
   async ({ name, description, isPublic }, { dispatch, getState }) => {
      const token = getState()?.user?.token
      const userId = getState()?.user?.user?.id
      console.log(name, description, isPublic, 'in da slice.')
      const response = await spotifyApi.post(
         `/users/${userId}/playlists`,
         {
            name,
            description,
            public: isPublic,
         },
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      )
      return response.data
   }
)
const editPlaylist = createAsyncThunk(
   'user/editPlaylist',
   async (
      { name, description, isPublic, playlistId },
      { dispatch, getState }
   ) => {
      const token = getState()?.user?.token
      const userId = getState()?.user?.user?.id
      console.log(name, description, isPublic, 'in da slice.')
      const response = await spotifyApi.put(
         `/playlists/${playlistId}`,
         {
            name,
            description,
            public: isPublic,
         },
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      )
      return response.data
   }
)

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
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchUser.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(fetchUser.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // console.log(action.payload)
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
            state.selectedPlaylist = action.payload
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
         .addCase(fetchFollowingArtists.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(fetchFollowingArtists.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.followingArtists = action.payload
         })
         .addCase(fetchFollowingArtists.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
         })
         .addCase(fetchUserTopItems.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(fetchUserTopItems.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.topItems = action.payload
         })
         .addCase(fetchUserTopItems.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
         })
         .addCase(fetchArtist.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(fetchArtist.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.currentArtist = action.payload
         })
         .addCase(fetchArtist.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
         })
         .addCase(createPlaylist.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(editPlaylist.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(editPlaylist.fulfilled, (state) => {
            state.status = 'succeeded'
         })
         .addCase(editPlaylist.rejected, (state) => {
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
   fetchFollowingArtists,
   fetchUserTopItems,
   fetchArtist,
   createPlaylist,
   editPlaylist,
}
export const {
   setUser,
   removeUser,
   setToken,
   setPlaylists,
   setPlaylistRecommendations,
   setPlayerState,
   setSelectedPlaylist,
   setCurrentArtist,
   setCredentials,
   setCurrentSong,
   setIsOnLoop,
   setIsPlaying,
   setIsShuffled,
} = userSlice.actions
export default userSlice.reducer
