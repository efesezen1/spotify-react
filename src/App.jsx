import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { Theme, ThemePanel } from '@radix-ui/themes'
import { Provider } from 'react-redux'
import store from './store'


const App = () => {
   return (
      <Provider store={store}>
         <Theme
            appearance="light"
            accentColor="red"
            grayColor="slate"
            radius="large"
         >
            <RouterProvider router={router} />
            {/* <ThemePanel /> */}
         </Theme>
      </Provider>
   )
}

export default App
