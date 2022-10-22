<template>
  <div class="wrapper">
    <WatchPartyMenu />
    <SelectedVideos />
    <YoutubeSearch />
    <!-- <button @click="() => open()" class="inline-flex items-center justify-center rounded-md border text-indigo-500 color-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-50">
      Télécharger une vidéo
    </button> -->
  </div>
</template>

<script setup lang="ts">
import { useFileSystemAccess } from '@vueuse/core'

// const dataType = ref('Text') as any
// const { isSupported, data, file, fileName, fileMIME, fileSize, fileLastModified, create, open, save, saveAs, updateData } = useFileSystemAccess()
// const { open } = useFileSystemAccess({dataType})

const { $io } = useNuxtApp();
const { push } = useRouter()
const { setSelectedVideos } = useVideos()
const { updateRoomId } = useRoom()

onMounted(() => {
  $io.on("start party", ({ room, videos }) => {
    setSelectedVideos(videos)
    updateRoomId(room)
    push('/videos')
  })
})
</script>
