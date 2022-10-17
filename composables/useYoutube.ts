export const useYoutube = () => {
  const videos = useState('youtubeVideos', () => []);
  const selectedVideos = useState('youtubeSelectedVideos', () => []);
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

  const videosRequestParams = {
    part: 'contentDetails',
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

  function getVideoByUrl(text: string) {
    useFetch(YOUTUBE_SEARCH_API,
      {
        pick: ['items' as never],
        params: { ...searchRequestParams, maxResults: 1, q: text }
      }
    ).then(async ({ data, refresh, error }) => {
        if (error.value) {
          alert(error.value)
        } else {
          await refresh()
          updateSelectedVideos((data.value as any)
            .items.map(({ snippet }, i) => ({ ...snippet, id: (data.value as any).items[i].id.videoId }))[0])
        }
      }
    )
  }

  function getVideoDurationById(id: string) {
    return useFetch(YOUTUBE_VIDEOS_API,
      {
        pick: ['items' as never],
        params: { ...videosRequestParams, id }
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