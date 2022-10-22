import { useVideos } from './useVideos'

export const useYoutube = () => {
  const config = useRuntimeConfig()
  const searchVideos = useState('videos', () => []);
  const { updateSelectedVideos } = useVideos()
  const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/';
  const YOUTUBE_SEARCH_API = YOUTUBE_API + 'search';
  const YOUTUBE_VIDEOS_API = YOUTUBE_API + 'videos';

  function youtubeSearch(text: string) {
    useFetch(YOUTUBE_SEARCH_API,
      {
        pick: ['items' as never],
        params: {
          q: text,
          part: 'snippet',
          type: 'video',
          maxResults: '20',
          key: config.public.youtubeApiKey,
        }
      }
    ).then(async ({ data, refresh, error }) => {
        if (error.value) {
          alert(error.value)
        } else {
          if (searchVideos.value.length) await refresh()
          searchVideos.value = (data.value as any)
            .items.map(({ snippet }, i) => ({ ...snippet, id: (data.value as any).items[i].id.videoId, type: 'youtube' }))
        }
      }
    )
  }

  function setSelectedYoutubeVideoByUrl(url: string) {
    const id = ((url) => {
      switch(true){
        case url.includes('shorts'):
          return url.split('shorts/').pop()
        default:
          return new URLSearchParams(url.split('?').pop()).get('v');
      }
    })(url)

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
          updateSelectedVideos({ ...(data.value as any).items[0].snippet, id, type: 'youtube' })
        }
      }
    )
  }

  return { searchVideos, youtubeSearch, setSelectedYoutubeVideoByUrl };
}