import { useVideos } from './useVideos'

export const useGoogleDrive = () => {
  const { updateSelectedVideos } = useVideos()
  function setSelectedGoogleDriveVideoByUrl(url: string) {
    const id = url.match("d/(.*)/")?.[1]
    updateSelectedVideos({ id, type: 'googleDrive' })
  }

  return { setSelectedGoogleDriveVideoByUrl };
}