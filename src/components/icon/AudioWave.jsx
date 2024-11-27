import React from 'react'

const AudioWave = () => {
   return (
      <svg
         width="1rem"
         height="1rem"
         viewBox="0 0 16 16"
         xmlns="http://www.w3.org/2000/svg"
      >
         <rect x="1" y="7" width="2" height="2" rx="1" ry="1" fill="#000000">
            <animate
               attributeName="height"
               values="2;6;2"
               dur="1s"
               repeatCount="indefinite"
            />
            <animate
               attributeName="y"
               values="7;5;7"
               dur="1s"
               repeatCount="indefinite"
            />
         </rect>

         <rect x="4" y="6" width="2" height="4" rx="1" ry="1" fill="#000000">
            <animate
               attributeName="height"
               values="4;8;4"
               dur="1.2s"
               repeatCount="indefinite"
            />
            <animate
               attributeName="y"
               values="6;4;6"
               dur="1.2s"
               repeatCount="indefinite"
            />
         </rect>

         <rect x="7" y="5" width="2" height="6" rx="1" ry="1" fill="#000000">
            <animate
               attributeName="height"
               values="6;10;6"
               dur="0.8s"
               repeatCount="indefinite"
            />
            <animate
               attributeName="y"
               values="5;3;5"
               dur="0.8s"
               repeatCount="indefinite"
            />
         </rect>

         <rect x="10" y="6" width="2" height="4" rx="1" ry="1" fill="#000000">
            <animate
               attributeName="height"
               values="4;8;4"
               dur="1.4s"
               repeatCount="indefinite"
            />
            <animate
               attributeName="y"
               values="6;4;6"
               dur="1.4s"
               repeatCount="indefinite"
            />
         </rect>

         <rect x="13" y="7" width="2" height="2" rx="1" ry="1" fill="#000000">
            <animate
               attributeName="height"
               values="2;6;2"
               dur="1s"
               repeatCount="indefinite"
            />
            <animate
               attributeName="y"
               values="7;5;7"
               dur="1s"
               repeatCount="indefinite"
            />
         </rect>
      </svg>
   )
}

export default AudioWave
