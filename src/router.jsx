import { createBrowserRouter } from 'react-router-dom'
import { HomeLayout, Browse, Error, Login, Playlist, Profile } from './pages'
import { ErrorElement } from './components'
const router = createBrowserRouter([
   {
      path: '/',
      element: <HomeLayout />,
      errorElement: <Error />,
      children: [
         {
            index: true,
            element: <Browse />,
            errorElement: <ErrorElement />,
         },
         {
            path: '/playlist/:id',
            element: <Playlist />,
            errorElement: <ErrorElement />,
         },

         {
            path: '/profile',
            element: <Profile />,
            errorElement: <ErrorElement />,
         },
      ],
   },
   {
      path: '/login',
      element: <Login />,
   },
])

export default router
