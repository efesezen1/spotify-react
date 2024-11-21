import { useMutation } from '@tanstack/react-query'
import useSpotifyInstance from './spotifyInstance'
import { useNavigate } from 'react-router-dom'

const useSpotifyMutation = ({
   mutationKey,
   endpoint,
   method = 'post',
   options = {},
}) => {
   const { token, spotifyApi } = useSpotifyInstance()
   const navigate = useNavigate()

   return useMutation({
      mutationKey,
      mutationFn: async (data) => {
         try {
            const response = await spotifyApi[method](endpoint, data)
            return response.data
         } catch (error) {
            if (error.response?.status === 401) {
               localStorage.removeItem('token')
               navigate('/login')
            }
            console.error(`Error in ${method.toUpperCase()} ${endpoint}:`, error)
            throw error
         }
      },
      ...options,
   })
}

export default useSpotifyMutation
