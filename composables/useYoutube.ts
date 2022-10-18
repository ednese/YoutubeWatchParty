import { useStorage } from '@vueuse/core'

export const useYoutube = () => {
  const videos = useState('youtubeVideos', () => []);
  const selectedVideos = useStorage('videos', useState('selectedVideos', () => []));
  const videosWithFetchedTime = useState('videosWithFetchedTime', () => []);
  const config = useRuntimeConfig()
  const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/';
  const YOUTUBE_SEARCH_API = YOUTUBE_API + 'search';
  const YOUTUBE_VIDEOS_API = YOUTUBE_API + 'videos';

  const searchRequestParams = {
    part: 'snippet',
    type: 'video',
    maxResults: '20',
    key: config.public.youtubeApiKey,
  };

  function setSelectedVideos(videos) {
    selectedVideos.value = videos
  }

  function search(text: string) {
    useFetch(YOUTUBE_SEARCH_API,
      {
        pick: ['items' as never],
        params: { ...searchRequestParams, q: text }
      }
    ).then(async ({ data, refresh, error }) => {
        if (error.value) {
          alert(error.value)
        } else {
          if (videos.value.length) await refresh()
          videos.value = (data.value as any)
            .items.map(({ snippet }, i) => ({ ...snippet, id: (data.value as any).items[i].id.videoId }))
        }
      }
    )
  }

  function getVideoByUrl(url: string) {
    const urlParams = url.split('?').pop()
    const id = new URLSearchParams(urlParams).get('v')
    useFetch(YOUTUBE_VIDEOS_API,
      {
        pick: ['items' as never],
        params: {
          id,
          part: 'snippet',
          key: config.public.youtubeApiKey,
        }
      }
    ).then(async ({ data, refresh, error }) => {
        if (error.value) {
          alert(error.value)
        } else {
          await refresh()
          updateSelectedVideos({ ...(data.value as any).items[0].snippet, id })
        }
      }
    )
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
    if (!selectedVideos.value.some(({ title }) => title === video.title)) {
      if (!videosWithFetchedTime.value.some(({ id }) => id === video.id)) {
        const duration = await getVideoDurationById(video.id)
        videosWithFetchedTime.value.push({id: video.id, duration });
      }
      selectedVideos.value.push({...video, duration: videosWithFetchedTime.value.find(({ id }) => id === video.id).duration })
    } else {
      selectedVideos.value = selectedVideos.value.filter(({ title }) => title !== video.title)
    }
  }

  // https://www.youtube.com/watch?v=MqiljVyq_1o
  return { search, videos, getVideoByUrl, selectedVideos, setSelectedVideos, updateSelectedVideos };
}