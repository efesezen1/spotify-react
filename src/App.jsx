import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { Theme, ThemePanel } from '@radix-ui/themes'
import { Provider } from 'react-redux'
import store from './store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const App = () => {
   const queryClient = new QueryClient()
   return (
      <QueryClientProvider client={queryClient}>
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
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   )
}

export default App
