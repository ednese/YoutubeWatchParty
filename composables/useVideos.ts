import { useStorage } from '@vueuse/core'

export const useVideos = () => {
  const config = useRuntimeConfig()
  const selectedVideos = useStorage('videos', useState('selectedVideos', () => []));
  const videosWithFetchedTime = useState('videosWithFetchedTime', () => []);
  const YOUTUBE_VIDEOS_API = 'https://www.googleapis.com/youtube/v3/videos';

  function setSelectedVideos(videos) {
    selectedVideos.value = videos
  }

  function getVideoDurationById(id: string) {
    return useFetch(YOUTUBE_VIDEOS_API,
      {
        pick: ['items' as never],
        params: {
          id,
          part: 'contentDetails',
          key: config.public.youtubeApiKey,
        }
      }
    ).then(async ({ data, refresh, error }) => {
        if (error.value) {
          alert(error.value)
        } else {
          await refresh()
          return (data.value as any).items[0]?.contentDetails.duration
        }
      }
    )
  }

  async function updateSelectedVideos(video) {
    if (!selectedVideos.value.some(({ id }) => id === video.id)) {
      if (video.type === 'youtube') {
        if (!videosWithFetchedTime.value.some(({ id }) => id === video.id)) {
          const duration = await getVideoDurationById(video.id)
          videosWithFetchedTime.value.push({id: video.id, duration });
        }
        selectedVideos.value.push({...video, duration: videosWithFetchedTime.value.find(({ id }) => id === video.id).duration })
      } else if (video.type === 'googleDrive') {
        selectedVideos.value.push(video)
      }
    } else {
      selectedVideos.value = selectedVideos.value.filter(({ id }) => id !== video.id)
    }
  }

  return { selectedVideos, setSelectedVideos, updateSelectedVideos };
}