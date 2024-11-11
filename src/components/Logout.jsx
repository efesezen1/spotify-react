import { useNavigate } from 'react-router-dom'
import { Button, Flex, Text } from '@radix-ui/themes'
import LogoutIcon from './icon/LogoutIcon'
const Logout = ({ className }) => {
   const navigate = useNavigate()
   const logout = () => {
      localStorage.removeItem('accessToken')

      navigate('/login')
      console.log('Logout successful.')
   }
   return (
      <Flex
         justify="center"
         direction={'row'}
         align={'center'}
         className={`w-full ${className}`}
         onClick={logout}
      >
         <Text className="">Logout</Text>
         <LogoutIcon className="mr-2" />
      </Flex>
   )
}
export default Logout
