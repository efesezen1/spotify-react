import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@radix-ui/themes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSpotifyInstance from '../hook/spotifyInstance'
import useSpotifyQuery from '../hook/useSpotifyQuery'

const CreatePlaylist = ({ children, className, modalState, setModalState }) => {
   const queryClient = useQueryClient()
   const navigate = useNavigate()
   const { spotifyApi, token } = useSpotifyInstance()
   const [isPublic, setIsPublic] = useState(false)

   const { data: user } = useSpotifyQuery({
      queryKey: ['user'],
      endpoint: '/me',
   })

   const { mutate: createPlaylist } = useMutation({
      mutationFn: ({ name, description, isPublic }) =>
         spotifyApi.post(`/users/${user.id}/playlists`, {
            name,
            description: description || '',
            isPublic,
         }),
      onSuccess: (res) => {
         queryClient.invalidateQueries(['userPlaylists'])
         const id = res.data.id
         navigate('/playlist/' + id)
         setModalState(false)
      },
      onError: (error) => {}
   })

   const handleCreatePlaylist = ({ name, description, isPublic }) => {
      createPlaylist({ name, description, isPublic })
   }

   return (
      <Dialog.Root open={modalState} onOpenChange={setModalState}>
         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
               <Dialog.Title className="m-0 text-[17px] font-medium capitalize ">
                  Create new playlist
               </Dialog.Title>
               <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal ">
                  Create your playlist here. Click create when you're done.
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
                     defaultValue="My Playlist #48"
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
                     defaultValue="New playlist description"
                  />
               </fieldset>
               <form className="mb-[15px] flex items-center gap-5">
                  <label
                     className="w-[90px] text-right text-[15px] "
                     htmlFor="playlist-audience"
                  >
                     Make private
                  </label>
                  <input
                     type="checkbox"
                     id="playlist-audience"
                     checked={!isPublic}
                     onChange={(e) => setIsPublic(!e.target.checked)}
                  />
               </form>
               <div className="mt-[25px] flex justify-end">
                  <Dialog.Close asChild>
                     <Button
                        variant="soft"
                        color="gray"
                        className="mr-2"
                        onClick={() => setModalState(false)}
                     >
                        Cancel
                     </Button>
                  </Dialog.Close>
                  <Button
                     onClick={() => {
                        const name =
                           document.getElementById('playlistName').value
                        const description =
                           document.getElementById('description').value
                        handleCreatePlaylist({
                           name,
                           description,
                           isPublic,
                        })
                     }}
                  >
                     Create
                  </Button>
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

export default CreatePlaylist
