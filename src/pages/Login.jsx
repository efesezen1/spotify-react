import { Box, Button, Flex, Text } from '@radix-ui/themes'
import React, { useRef, useEffect } from 'react'
import SpotifyIcon from '../components/icon/SpotifyIcon'
import { motion, useAnimate } from 'framer-motion'
import useMotionTimeline from '../hook/motionTimeline'

const handleClick = () => {
   const clientId = import.meta.env.VITE_APP_CLIENT_ID
   const redirectUri = 'http://localhost:8080/'
   const apiUrl = 'https://accounts.spotify.com/authorize'
   const scope = import.meta.env.VITE_APP_SCOPE
   window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&show_dialog=true`
}

const Login = () => {
   const TRANSITION = {
      ease: 'easeInOut',
      duration: 0.4,
   }
   const scope = useMotionTimeline([
      ['#logo', { scale: 1, opacity: 1, translateY: 0 }, TRANSITION],
      ['#header', { scale: 1, opacity: 1, translateY: 0 }, TRANSITION],
      ['#button', { scale: 1, opacity: 1, translateY: 0 }, TRANSITION],
   ])

   return (
      <motion.div className="flex items-center justify-center h-screen">
         <motion.div
            ref={scope}
            className="max-w-md  justify-center items-center flex flex-col gap-4 "
         >
            <motion.div
               id="logo"
               initial={{ scale: 0, opacity: 0, translateY: 100 }}
               animate={{ scale: 1 }}
               whileHover={{ scale: 1.2 }}

               // transition={{
               //    type: 'spring',
               //    stiffness: 260,
               //    damping: 20,
               // }}
            >
               <SpotifyIcon width="40" height="40" />
            </motion.div>
            <motion.div
               initial={{ scale: 0, opacity: 0, translateY: 100 }}
               animate={{ scale: 0 }}
               id="header"
               // initial={{
               //    opacity: 0,
               // }}
               // animate={{
               //    opacity: 1,
               // }}
               // transition={{
               //    duration: 1,
               // }}
            >
               <Text size="9" className="select-none font-extrabold">
                  Spotify
               </Text>
            </motion.div>

            <motion.button
               initial={{ scale: 0, opacity: 0, translateY: 100 }}
               animate={{ scale: 0 }}
               id="button"
               className="w-full cursor-pointer"
               onClick={handleClick}
            >
               <Button className="w-full cursor-pointer">Login</Button>
            </motion.button>
         </motion.div>
      </motion.div>
   )
}

export default Login
