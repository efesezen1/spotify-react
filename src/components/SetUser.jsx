import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../store/slicers/userSlice'

const SetUser = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const location = useLocation()

   useEffect(() => {
      const urlQueryData = location.hash.slice(1)
      const urlParams = new URLSearchParams(urlQueryData)
      const accessToken = urlParams.get('access_token')
      if (accessToken) {
         localStorage.setItem('accessToken', accessToken)
         dispatch(fetchUser(accessToken))
      } else {
         const localAccessToken = localStorage.getItem('accessToken')
         if (!localAccessToken) {
            navigate('/login')
         }
         dispatch(fetchUser(localAccessToken))
      }
   }, [])
   return <></>
}

export default SetUser
