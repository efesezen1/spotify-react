import { useEffect, useRef } from 'react'

const usePrevious = (value) => {
   const ref = useRef() // Create a ref to hold the previous value

   useEffect(() => {
      ref.current = value // Update the ref with the current value on each render
   }, [value]) // Only update when the value changes

   return ref.current // Return the previous value
}
export default usePrevious
