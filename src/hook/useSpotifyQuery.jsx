import { useQuery } from '@tanstack/react-query';
import useSpotifyInstance from './spotifyInstance';
import { useNavigate } from 'react-router-dom';

const useSpotifyQuery = ({ queryKey, endpoint, method = 'get', params = {}, options = {} }) => {
  const { token, spotifyApi } = useSpotifyInstance();
  const navigate = useNavigate();

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await spotifyApi[method](endpoint, params);
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          // Clear token from localStorage if needed
          localStorage.removeItem('token');
          navigate('/login');
        }
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
      }
    },
    enabled: !!token,
    ...options,
  });
};

export default useSpotifyQuery;
