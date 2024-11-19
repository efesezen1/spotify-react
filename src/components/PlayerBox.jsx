import { Box } from '@radix-ui/themes'
const PlayerBox = ({ children, className, onClick }) => {
   return (
      <Box
         onClick={onClick}
         className={`hover:bg-red-300 active:bg-red-500 rounded-full p-2 transition-all duration-300 hover:text-white active:text-white ${className}`}
      >
         {children}
      </Box>
   )
}

export default PlayerBox
