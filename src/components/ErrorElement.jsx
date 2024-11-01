import { Flex, Text } from '@radix-ui/themes'
import React from 'react'

const ErrorElement = () => {
   return (
      <Flex
         className="bg-gradient-to-b from-red-50 to-white bg-red-50 w-full h-full "
         justify={'center'}
         align={'center'}
      >
         <Text size="9" weight="bold">
            Error!
         </Text>
      </Flex>
   )
}

export default ErrorElement
