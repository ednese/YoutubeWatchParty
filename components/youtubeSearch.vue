<template>
  <form class="mt-8 space-y-6" action="#" method="POST" @submit.prevent="getVideos">
    <input v-model="youtubeTextSearch" class="ml-3 relative block appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
  </form>
  <div class="videos">
    <div
      class="video"
      v-for="video in videos"
      :class="getVideoClass(video)"
      @click="updateSelectedVideos(video)"
    >
      <img
        class="video__img"
        :src="video.thumbnails.medium.url"
      />
      <p class="video__title" v-html="video.title"/>

    </div>
  </div>
</template>

<style lang="stylus">
.videos
  display flex
  flex-wrap wrap

  .video
    margin 8px 16px
    border 4px #959595 solid
    border-radius 16px
    padding 8px

    &--selected
      border 4px #c3bef5 solid
      background #e8e6ff

    &:hover
      background #e6e6e6
      cursor pointer

    &__img
      border-top-left-radius 8px
      border-top-right-radius 8px

    &__title
      max-width 320px
</style>

<script setup lang="ts">
const { $io } = useNuxtApp();
const youtubeTextSearch = ref('');
const youtubeSelectedVideos = ref([]);
const {
  search,
  videos,
  getVideoByUrl,
  updateSelectedVideos,
  selectedVideos
} = useYoutube()

const emit = defineEmits<{
  (name: 'updateSelectedVideos', videos: any[]): void;
}>();

watch(youtubeSelectedVideos, value => emit('updateSelectedVideos', value))

function getVideoClass({ title }) {
  if (selectedVideos.value.some(video => video.title === title)) {
    return 'video--selected'
  }
  return '';
}

function getVideos() {
  if (youtubeTextSearch.value.startsWith('https://www.youtube.com/')) {
    getVideoByUrl(youtubeTextSearch.value)
  } else {
    search(youtubeTextSearch.value)
  }
}
</script>
