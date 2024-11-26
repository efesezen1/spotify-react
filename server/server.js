const express = require('express')
const request = require('request')
const cors = require('cors')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
require('dotenv').config()

// Configuration
const client_id = process.env.VITE_APP_CLIENT_ID
const client_secret = process.env.VITE_APP_CLIENT_SECRET
const redirect_uri = process.env.VITE_APP_REDIRECT_URI
const frontend_uri = 'http://localhost:8080'
const stateKey = process.env.VITE_APP_STATE_KEY

if (!client_id || !client_secret || !redirect_uri) {
   console.error(
      'Error: Missing required environment variables. Please check your .env file'
   )
   console.error(
      'Required variables: VITE_APP_CLIENT_ID, VITE_APP_CLIENT_SECRET, VITE_APP_REDIRECT_URI'
   )
   process.exit(1)
}

const app = express()

// Middleware
app.use(
   cors({
      origin: frontend_uri,
      credentials: true,
   })
)
app.use(cookieParser())
app.use(express.json())

// Generate random string for state
const generateRandomString = (length) => {
   return crypto.randomBytes(60).toString('hex').slice(0, length)
}

// Routes
app.get('/login', (req, res) => {
   const state = generateRandomString(16)
   res.cookie(stateKey, state)

   const scope = process.env.VITE_APP_SCOPE
   res.redirect(
      'https://accounts.spotify.com/authorize?' +
         querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
            show_dialog: true,
         })
   )
})

app.get('/callback', (req, res) => {
   const code = req.query.code || null
   const state = req.query.state || null
   const storedState = req.cookies ? req.cookies[stateKey] : null

   if (state === null || state !== storedState) {
      res.redirect(`${frontend_uri}/login?error=state_mismatch`)
      return
   }

   res.clearCookie(stateKey)

   const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
         code: code,
         redirect_uri: redirect_uri,
         grant_type: 'authorization_code',
      },
      headers: {
         Authorization:
            'Basic ' +
            Buffer.from(client_id + ':' + client_secret).toString('base64'),
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      json: true,
   }

   request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
         const { access_token, refresh_token } = body

         // Redirect to frontend with tokens in query params
         res.redirect(
            `${frontend_uri}?` +
               querystring.stringify({
                  access_token,
                  refresh_token,
               })
         )
      } else {
         res.redirect(`${frontend_uri}/login?error=invalid_token`)
      }
   })
})

app.get('/refresh_token', (req, res) => {
   const refresh_token = req.query.refresh_token

   const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
         Authorization:
            'Basic ' +
            Buffer.from(client_id + ':' + client_secret).toString('base64'),
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
         grant_type: 'refresh_token',
         refresh_token: refresh_token,
      },
      json: true,
   }

   request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
         const { access_token } = body
         res.json({ access_token })
      } else {
         res.status(400).json({ error: 'Failed to refresh token' })
      }
   })
})

// Start server
const PORT = 8888
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
   console.log('Environment check:')
   console.log('Client ID:', client_id ? '✓' : '✗')
   console.log('Client Secret:', client_secret ? '✓' : '✗')
   console.log('Redirect URI:', redirect_uri)
   console.log('Frontend URI:', frontend_uri)
})
