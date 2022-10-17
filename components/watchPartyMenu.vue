<template>
  <div class="bg-gray-50">
    <div class="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        <span class="block">Watch Party</span>
        <span class="block text-indigo-600">Regardez une vidéo à plusieurs !</span>
      </h2>
      <div v-if="!createdRoomId && !joinRoomId" class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <NuxtLink to="/editing" class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
            Délimiter mes videos
          </NuxtLink>
        </div>
        <div v-if="selectedVideos.length" class="ml-3 inline-flex rounded-md shadow">
          <button @click="createRoom" class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
            Créer une partie
          </button>
        </div>
        <div class="ml-3 inline-flex rounded-md shadow">
          <button @click="JoinRoomById" class="inline-flex items-center justify-center rounded-md border text-indigo-500 color-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-50">
            Rejoindre une partie
          </button>
        </div>
        <input v-model="roomId" class="ml-3 relative block appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Id">
      </div>
      <div v-else-if="createdRoomId" class="mt-8 flex items-center">
        <p class="mr-4"> code: {{ createdRoomId }}</p>
        <button @click="copy()" :class="`mr-4 inline-flex items-center justify-center rounded-md border border-transparent bg-${ copied ? 'lime' : 'indigo' }-600 px-5 py-3 text-base font-medium text-white hover:bg-${ copied ? 'lime' : 'indigo' }-700`">
          {{ copied ? "Invitation copiée" : "Copier l'invitation" }}
        </button>
        <button v-if="playerNumber > 1" @click="startParty" class="inline-flex items-center justify-center rounded-md border text-indigo-500 color-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-50">
          Commencer la partie
        </button>
      </div>
      <div v-else class="mt-8 flex items-center">
        <p>En attente de l'administrateur de la partie</p>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { $io } = useNuxtApp();
const roomId = ref()
const createdRoomId = ref()
const joinRoomId = ref()
const playerNumber = ref(0)
const { query } = useRoute()
const { toggleRoomOwner } = useRoom()

const shareLink = computed(() => window.location?.href + '?' + createdRoomId.value || roomId.value)

const { selectedVideos } = useYoutube()
const { copy, copied } = useClipboard({ source: shareLink })
const emit = defineEmits<{
  (name: 'startParty'): void;
}>();

watchEffect(() => {
  const id = Object.keys(query)?.[0];
  if (id) {
    roomId.value = id
    JoinRoomById()
  }
  $io?.on("new player", pNumber => playerNumber.value = pNumber)
})

function startParty() {
  toggleRoomOwner()
  $io.emit('start party', { videos: selectedVideos.value, room: createdRoomId.value })
}

function createRoom() {
  createdRoomId.value = Math.floor(Math.random() * 100000)
  navigator.clipboard?.writeText(shareLink.value)
  $io.emit("join room", createdRoomId.value);
}

function JoinRoomById() {
  joinRoomId.value = Number(roomId.value);
  if (joinRoomId.value) $io?.emit("join room", joinRoomId.value);
}
</script>
