import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import '@radix-ui/themes/styles.css'
import store from './store'
import './index.css'
import { Theme, ThemePanel } from '@radix-ui/themes'
import { Provider } from 'react-redux'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
createRoot(document.getElementById('root')).render(
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
