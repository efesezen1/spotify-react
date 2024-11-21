import { Box, Text, Flex, Skeleton } from '@radix-ui/themes'
import React, { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, animate } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

const ItemRow = ({ playlistRecommendations, isLoading }) => {
   const navigate = useNavigate()
   const containerRef = useRef(null)
   const [constraints, setConstraints] = useState({ left: 0, right: 0 })
   const x = useMotionValue(0)
   const springX = useSpring(x, { 
      damping: 20, 
      stiffness: 150,
      mass: 0.5
   })

   useEffect(() => {
      if (containerRef.current) {
         const container = containerRef.current
         const scrollWidth = container.scrollWidth
         const viewportWidth = container.offsetWidth
         setConstraints({
            left: -(scrollWidth - viewportWidth),
            right: 0
         })
      }
   }, [playlistRecommendations])

   const handleScroll = (direction) => {
      const container = containerRef.current
      if (container) {
         const scrollAmount = direction === 'left' ? -800 : 800
         const currentX = x.get()
         const targetX = Math.max(
            constraints.left,
            Math.min(constraints.right, currentX + -scrollAmount)
         )

         animate(x, targetX, {
            type: "spring",
            stiffness: 150,
            damping: 20,
            mass: 0.5,
            velocity: direction === 'left' ? -2 : 2
         })
      }
   }

   const handleDragEnd = (event, info) => {
      const container = containerRef.current
      if (container) {
         if (Math.abs(info.velocity.x) > 100) {
            const currentX = x.get()
            const scrollAmount = Math.min(800, Math.abs(info.velocity.x))
            const targetX = Math.max(
               constraints.left,
               Math.min(
                  constraints.right,
                  currentX + (info.velocity.x > 0 ? scrollAmount : -scrollAmount)
               )
            )

            animate(x, targetX, {
               type: "spring",
               stiffness: 150,
               damping: 20,
               mass: 0.5,
               velocity: info.velocity.x
            })
         }
      }
   }

   return (
      <Flex direction="column">
         <Box pl="1">
            {playlistRecommendations?.message && (
               <Text size="5" weight="bold" mb="4">
                  {playlistRecommendations?.message}
               </Text>
            )}
         </Box>
         <Flex direction="column" className="w-[100%]" gap="3">
            <Flex justify="between" align="center" mb="4">
               <Box />
               <Flex gap="2">
                  <Box
                     variant="ghost"
                     onClick={() => handleScroll('left')}
                     className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
                  >
                     <ChevronLeftIcon width="20" height="20" />
                  </Box>
                  <Box
                     variant="ghost"
                     onClick={() => handleScroll('right')}
                     className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
                  >
                     <ChevronRightIcon width="20" height="20" />
                  </Box>
               </Flex>
            </Flex>
            <Box className="relative overflow-hidden">
               <motion.div
                  ref={containerRef}
                  className="overflow-x-scroll scrollbar-hide cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={constraints}
                  dragElastic={0.3}
                  dragTransition={{ 
                     bounceStiffness: 300, 
                     bounceDamping: 20,
                     power: 0.5
                  }}
                  style={{ x: springX }}
                  onDragEnd={handleDragEnd}
               >
                  <Flex className="gap-4 w-full">
                     <div className="grid auto-cols-max grid-flow-col gap-4 px-4">
                        {isLoading
                           ? Array.from({ length: 5 }).map((_, index) => (
                                <div
                                   key={`skeleton-${index}`}
                                   className="w-[150px] initial:w-[300px] xs:w-[230px] sm:w-[220px] md:w-[170px] lg:w-[150px] xl:w-[150px]"
                                >
                                   <Skeleton className="w-[80px] h-[80px] rounded" />
                                   <Flex
                                      direction="column"
                                      p="1"
                                      gap="1"
                                      className="w-[80px]"
                                   >
                                      <Skeleton>
                                         <Text size="2" weight="bold">
                                            Playlist Name
                                         </Text>
                                      </Skeleton>
                                      <Skeleton>
                                         <Text size="1" color="gray">
                                            Creator Name
                                         </Text>
                                      </Skeleton>
                                   </Flex>
                                </div>
                             ))
                           : playlistRecommendations?.playlists?.items.map(
                                (playlist) => (
                                   <div
                                      key={playlist.id}
                                      className="w-[150px] initial:w-[300px] xs:w-[230px] sm:w-[220px] md:w-[170px] lg:w-[150px] xl:w-[150px]"
                                   >
                                      <Box
                                         onClick={() =>
                                            navigate(`/playlist/${playlist.id}`)
                                         }
                                         className="hover:backdrop-brightness-95 active:backdrop-brightness-90 rounded p-1 transition-all duration-200"
                                      >
                                         <img
                                            src={playlist.images[0].url}
                                            alt="playlist"
                                            className="w-full h-full object-contain rounded select-none"
                                            draggable={false}
                                         />
                                         <Flex direction="column" p="1">
                                            <Text
                                               size="2"
                                               weight="bold"
                                               className="select-none"
                                            >
                                               {playlist.name}
                                            </Text>
                                            <Text
                                               size="1"
                                               weight=""
                                               color="gray"
                                               className="select-none"
                                            >
                                               {playlist.owner.display_name}
                                            </Text>
                                         </Flex>
                                      </Box>
                                   </div>
                                )
                             )}
                     </div>
                  </Flex>
               </motion.div>
            </Box>
         </Flex>
      </Flex>
   )
}

export default ItemRow
