const express = require('express')
const axios = require('axios')
const cors = require('cors')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
require('dotenv').config()

// Configuration
const CLIENT_ID = process.env.VITE_APP_CLIENT_ID
const CLIENT_SECRET = process.env.VITE_APP_CLIENT_SECRET
const REDIRECT_URI = process.env.VITE_APP_REDIRECT_URI
const FRONTEND_URI = process.env.VITE_APP_FRONTEND_URI || 'http://localhost:8080'
const STATE_KEY = process.env.VITE_APP_STATE_KEY

// Check for required environment variables
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
   console.error(
      'Error: Missing required environment variables. Please check your .env file'
   )
   console.error(
      'Required variables: VITE_APP_CLIENT_ID, VITE_APP_CLIENT_SECRET, VITE_APP_REDIRECT_URI'
   )
   process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 8888

// Trust proxy - required for Heroku
app.set('trust proxy', 1)

// Middleware
app.use(
   cors({
      origin: FRONTEND_URI,
      credentials: true,
   })
)
app.use(cookieParser())
app.use(express.json())

// Generate random string for state
const generateRandomString = (length) => {
   return crypto.randomBytes(60).toString('hex').slice(0, length)
}

// Login route
app.get('/login', (req, res) => {
   const state = generateRandomString(16)
   const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private'

   res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
         response_type: 'code',
         client_id: CLIENT_ID,
         scope: scope,
         redirect_uri: REDIRECT_URI,
         state: state
      }))
})

// Callback route
app.get('/callback', async (req, res) => {
   const code = req.query.code || null
   const state = req.query.state || null

   if (state === null) {
      res.redirect(FRONTEND_URI + '?' +
         querystring.stringify({
            error: 'state_mismatch'
         }))
      return
   }

   try {
      const response = await axios({
         method: 'post',
         url: 'https://accounts.spotify.com/api/token',
         data: querystring.stringify({
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
         }),
         headers: {
            'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
         }
      })

      if (response.status === 200) {
         const { access_token, refresh_token, expires_in } = response.data
         
         res.redirect(FRONTEND_URI + '?' +
            querystring.stringify({
               access_token,
               refresh_token,
               expires_in
            }))
      } else {
         res.redirect(FRONTEND_URI + '?' +
            querystring.stringify({
               error: 'invalid_token'
            }))
      }
   } catch (error) {
      res.redirect(FRONTEND_URI + '?' +
         querystring.stringify({
            error: 'invalid_token'
         }))
   }
})

// Refresh token route
app.get('/refresh_token', async (req, res) => {
   const refresh_token = req.query.refresh_token
   
   try {
      const response = await axios({
         method: 'post',
         url: 'https://accounts.spotify.com/api/token',
         data: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
         }),
         headers: {
            'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
         }
      })

      if (response.status === 200) {
         const { access_token, expires_in } = response.data
         res.json({
            access_token,
            expires_in
         })
      } else {
         res.status(response.status).json({
            error: 'invalid_token'
         })
      }
   } catch (error) {
      res.status(400).json({
         error: 'invalid_token'
      })
   }
})

// Root route
app.get('/', (req, res) => {
   res.send('Spotify React Backend is running!')
})

// Start server
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
   console.log('Environment check:')
   console.log('Client ID:', CLIENT_ID ? '✓' : '✗')
   console.log('Client Secret:', CLIENT_SECRET ? '✓' : '✗')
   console.log('Redirect URI:', REDIRECT_URI)
   console.log('Frontend URI:', FRONTEND_URI)
})
