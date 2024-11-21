import { useNavigate } from 'react-router-dom'
import { Button, Flex, Text } from '@radix-ui/themes'
import LogoutIcon from './icon/LogoutIcon'
const Logout = ({ className }) => {
   const navigate = useNavigate()
   const logout = () => {
      localStorage.removeItem('accessToken')

      navigate('/login')
   }
   return (
      <Flex
         justify="center"
         direction={'row'}
         align={'center'}
         className={`w-full ${className} select-none`}
         onClick={logout}
      >
         <LogoutIcon className="mr-2" />
         <Text className="">Logout</Text>
      </Flex>
   )
}
export default Logout
