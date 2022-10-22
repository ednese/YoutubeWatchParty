<template>
  <form class="mt-8 space-y-6" action="#" method="POST" @submit.prevent="getVideos">
    <input v-model="searchText" class="ml-3 relative block appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
  </form>
  <div class="videos">
    <div class="videos__selected">
      <template v-for="video, index in selectedVideos">
        <div
          class="videos__selected__img"
          @click="updateSelectedVideos(video); imageUnderCursorIndex = null"
          @mouseenter="imageUnderCursorIndex = index"
          @mouseleave="imageUnderCursorIndex = null"
        >
          <img
            v-if="video.type === 'youtube'"
            :src="video.thumbnails.default.url"
          />
          <video
            v-else-if="video.type === 'googleDrive'"
          >
            <source :src="`https://drive.google.com/uc?export=download&id=${video.id}`">
          </video>
        </div>
      </template>
    </div>
    <div class="videos__search">
      <div
        class="video__search"
        v-for="video in searchVideos"
        :class="getVideoClass(video)"
        @click="updateSelectedVideos(video)"
      >
        <img
          class="video__search__img"
          :src="video.thumbnails.medium.url"
        />
        <p class="video__search__title" v-html="video.title"/>

      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.videos
  display flex
  flex-direction column

  &__selected
    display flex

    &__img
      width 136px
      margin 8px 16px
      display flex

      &:hover
        cursor pointer
        opacity .5

      & > video
        border-radius 8px
        background black

      & > img
        border-radius 8px

  .videos__search
    display flex
    flex-wrap wrap

    .video__search
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
const searchText = ref('');
const imageUnderCursorIndex = ref()
const { setSelectedGoogleDriveVideoByUrl } = useGoogleDrive()
const {
  searchVideos,
  youtubeSearch,
  setSelectedYoutubeVideoByUrl,
} = useYoutube()
const {
  updateSelectedVideos,
  selectedVideos
} = useVideos()

function getVideoClass({ title }) {
  if (selectedVideos.value.some(video => video.title === title)) {
    return 'video__search--selected'
  }
  return '';
}

function getVideos() {
  if (searchText.value.startsWith('https://www.youtube.com')) {
    setSelectedYoutubeVideoByUrl(searchText.value)
  } else if (searchText.value.startsWith('https://drive.google.com')) {
    setSelectedGoogleDriveVideoByUrl(searchText.value)
    searchText.value.match("d/(.*)/")?.[1]
  } else {
    youtubeSearch(searchText.value)
  }
}
</script>
