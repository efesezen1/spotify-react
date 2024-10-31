import { createBrowserRouter } from 'react-router-dom'
import { HomeLayout, Browse, Error, Login } from './pages'
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
      ],
   },
   {
      path: '/login',
      element: <Login />,
   },
])

export default router
