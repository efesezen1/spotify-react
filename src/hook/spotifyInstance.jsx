import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
const useSpotifyInstance = () => {
   const location = useLocation()
   const instance = axios.create({
      baseURL: `https://api.spotify.com/v1`,
   })
   const spotifyApi = useRef(null)
   const [token, setToken] = useState(null)

   useEffect(() => {
      const urlParams = new URLSearchParams(location.search)
      const accessToken = urlParams.get('access_token')
      if (accessToken) {
         localStorage.setItem('accessToken', accessToken)
         setToken(accessToken)
         instance.defaults.headers.Authorization = `Bearer ${accessToken}`
         spotifyApi.current = instance
         //  instance.defaults.headers.Authorization = `Bearer ${accessToken}`
      } else {
         const localAccessToken = localStorage.getItem('accessToken')
         setToken(localAccessToken)
         instance.defaults.headers.Authorization = `Bearer ${localAccessToken}`
         spotifyApi.current = instance
      }
   }, [])

   return { spotifyApi: spotifyApi.current, token }
}

export default useSpotifyInstance
