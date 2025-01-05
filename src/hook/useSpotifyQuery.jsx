import { useQuery } from '@tanstack/react-query'
import useSpotifyInstance from './spotifyInstance'
import { useNavigate } from 'react-router-dom'

const useSpotifyQuery = ({
   queryKey,
   endpoint,
   method = 'get',
   params = {},
   options = {},
}) => {
   const { token, spotifyApi } = useSpotifyInstance()
   const navigate = useNavigate()

   const buildQueryString = (params) => {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
         if (value !== undefined && value !== null) {
            queryParams.append(key, value)
         }
      })
      const queryString = queryParams.toString()
      return queryString ? `?${queryString}` : ''
   }

   return useQuery({
      queryKey,
      queryFn: async () => {
         try {
            const queryString = buildQueryString(params)
            const fullEndpoint = `${endpoint}${queryString}`
            const response = await spotifyApi[method](fullEndpoint)
            return response.data
         } catch (error) {
            if (error.response?.status === 401) {
               localStorage.removeItem('token')
               console.log('useSpotifyQuery: token removed')
               navigate('/login')
            }
            console.error(`Error fetching ${endpoint}:`, error)
            throw error
         }
      },
      enabled: !!token,
      ...options,
   })
}

export default useSpotifyQuery
