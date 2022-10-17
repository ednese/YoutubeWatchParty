<template>
  <div v-if="selectedVideos.length">
    <iframe
      ref="youtubeVideoRef"
      width="640"
      height="360"
      class="videoEditor__video"
      :src="`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&mute=1&start=${start}&end=${end ? `&end=${end}` : ''}`"
    />
    <div class="mt-3 w-full flex">
      <NuxtLink to="/" class="m-auto inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
        Page d'acceuil
      </NuxtLink>
    </div>
    <div v-if="isRoomOwner && selectedVideos.length > 1" class="mt-3 flex justify-center">
      <button @click="handleIndexChanges('-')" class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
        Vidéo précédente
      </button>
      <button @click="handleIndexChanges('+')" class="ml-3 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
        Vidéo suivante
      </button>
    </div>
  </div>
  <div v-else>
    Pas de videos
  </div>
</template>

<script setup lang="ts">
const { $io } = useNuxtApp();
const { roomId, isRoomOwner } = useRoom()
const { selectedVideos } = useYoutube()
const { start, end } = getVideoTimeDelimitations()

const videosIndex = ref(0);
const selectedVideo = computed(() => selectedVideos.value[videosIndex.value])

onMounted(() => {
  $io.on("display video", (index) => {
    videosIndex.value = index
  })
})

function getVideoTimeDelimitations() {
  return {
    start: computed(() => selectedVideo.value.start || 0),
    end: computed(() => selectedVideo.value.end)
  }
}

function handleIndexChanges(sign: string) {
  const length = selectedVideos.value.length;
  const index = (videosIndex.value + length + (sign === '+' ? 1 : -1)) % length
  $io.emit('display video', { index, room: roomId.value })
}
</script>
