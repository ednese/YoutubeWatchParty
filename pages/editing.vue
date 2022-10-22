<template>
  <div class="editing">
    <div class="w-full mt-3 inline-flex">
      <NuxtLink to="/" class="m-auto inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
        Page d'acceuil
      </NuxtLink>
    </div>
    <div v-if="selectedVideos.length">
      <videoEditor />
    </div>
    <div v-else class="mt-3 text-center">
      Aucune vidéo selectionnée
    </div>
  </div>
</template>

<script setup lang="ts">

const { selectedVideos } = useVideos()
</script>
