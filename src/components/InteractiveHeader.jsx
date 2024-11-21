import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'
import { Text, Button } from '@radix-ui/themes'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useSpotifyInstance from '../hook/spotifyInstance'

const InteractiveHeader = ({
   playlist,
   size,
   setIsPublic,
   isPublic,
}) => {
   const queryClient = useQueryClient()
   const { spotifyApi } = useSpotifyInstance()
   const { mutate: editPlaylist } = useMutation({
      mutationFn: ({ name, description, isPublic, playlistId }) =>
         spotifyApi.put(`/playlists/${playlistId}`, {
            name,
            description,
            public: isPublic,
         }),
      onSuccess: (response) => {
         queryClient.invalidateQueries(['playlist', playlist.id])
      },
      onError: (error) => {},
   })

   const handleEditPlaylist = ({ name, description, isPublic }) => {
      editPlaylist({ name, description, isPublic, playlistId: playlist.id })
   }

   return (
      <Dialog.Root>
         <Dialog.Trigger className="text-start">
            <Text size={size} weight="bold" className="">
               {playlist?.name}
            </Text>
         </Dialog.Trigger>
         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
               <Dialog.Title className="m-0 text-[17px] font-medium capitalize ">
                  Edit playlist
               </Dialog.Title>
               <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal ">
                  Edit your playlist here. Click edit when you're done.
               </Dialog.Description>
               <fieldset className="mb-[15px] flex items-center gap-5">
                  <label
                     className="w-[90px] text-right text-[15px] capitalize"
                     htmlFor="playlistName"
                  >
                     Playlist Name
                  </label>
                  <input
                     className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none  shadow-[0_0_0_1px]  outline-none focus:shadow-[0_0_0_2px] "
                     id="playlistName"
                     defaultValue={playlist?.name}
                  />
               </fieldset>
               <fieldset className="mb-[15px] flex items-center gap-5">
                  <label
                     className="w-[90px] text-right text-[15px] "
                     htmlFor="description"
                  >
                     Description
                  </label>
                  <input
                     className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none  shadow-[0_0_0_1px]  outline-none focus:shadow-[0_0_0_2px] "
                     id="description"
                     defaultValue={playlist?.description}
                  />
               </fieldset>
               <fieldset className="mb-[15px] flex items-center gap-5">
                  <label
                     className="w-[90px] text-right text-[15px]"
                     htmlFor="playlist-audience"
                  >
                     {isPublic ? 'Public' : 'Private'}
                  </label>
                  <Switch.Root
                     checked={isPublic}
                     onCheckedChange={() => setIsPublic((prev) => !prev)}
                     className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
                     id="playlist-audience"
                     style={{
                        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
                     }}
                  >
                     <Switch.Thumb
                        className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]"
                     />
                  </Switch.Root>
               </fieldset>
               <div className="mt-[25px] flex justify-end">
                  <Dialog.Close asChild>
                     <Button
                        onClick={() => {
                           handleEditPlaylist({
                              name: document.getElementById('playlistName')
                                 .value,
                              description:
                                 document.getElementById('description').value,
                              isPublic,
                              id: playlist.id,
                           })
                        }}
                        variant="soft"
                     >
                        Edit
                     </Button>
                  </Dialog.Close>
               </div>
               <Dialog.Close asChild>
                  <button
                     className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full  hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:outline-none"
                     aria-label="Close"
                  >
                     <Cross2Icon />
                  </button>
               </Dialog.Close>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

export default InteractiveHeader
