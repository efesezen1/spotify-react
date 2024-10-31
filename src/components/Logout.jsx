import { useNavigate } from 'react-router-dom'
import { Button } from '@radix-ui/themes'
import LogoutIcon from './icon/LogoutIcon'
const Logout = ({ className }) => {
   const navigate = useNavigate()
   const logout = () => {
      localStorage.removeItem('accessToken')

      navigate('/login')
      console.log('Logout successful.')
   }
   return (
      <Button className={`flex justify-between items-center ${className}`} onClick={logout}>
         Logout <LogoutIcon className="mr-2" />
      </Button>
   )
}
export default Logout
