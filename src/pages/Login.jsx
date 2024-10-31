import { Box, Button, Text } from '@radix-ui/themes'
import React from 'react'
import SpotifyIcon from '../components/icon/SpotifyIcon'
import { motion } from 'framer-motion'

const handleClick = () => {
   const clientId = import.meta.env.VITE_APP_CLIENT_ID
   const redirectUri = 'http://localhost:8080/'
   const apiUrl = 'https://accounts.spotify.com/authorize'
   const scope = import.meta.env.VITE_APP_SCOPE
   window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&show_dialog=true`
}

const Login = () => {
   return (
      <Box className="flex items-center justify-center h-screen">
         <Box className="max-w-md flex flex-col justify-center items-center ">
            <motion.div
               initial={{ scale: 0 }}
               animate={{ rotate: 360, scale: 1 }}
               whileHover={{ scale: 1.2 }}
               transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
               }}
            >
               <SpotifyIcon width="40" height="40" />
            </motion.div>
            <motion.div
               initial={{
                  opacity: 0,
               }}
               animate={{
                  opacity: 1,
               }}
               transition={{
                  duration: 1,
               }}
            >
               <Text size="9" className="select-none font-extrabold">
                  Spotify
               </Text>
            </motion.div>

            <p className="py-6">
               Provident cupiditate voluptatem et in. Quaerat fugiat ut
               assumenda excepturi exercitationem quasi. In deleniti eaque aut
               repudiandae et a id nisi.
            </p>

            <Button className="w-full" onClick={handleClick}>
               Login
            </Button>
         </Box>
      </Box>
   )
}

export default Login
