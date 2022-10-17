<template>
  <div class="videos">
      <img
        v-for="video, index in selectedVideos"
        class="videos__img"
        :class="{ 'videos__img--selected': imageUnderCursorIndex === index }"
        :src="video.thumbnails.default.url"
        @click="updateSelectedVideos(video); imageUnderCursorIndex = null"
        @mouseenter="imageUnderCursorIndex = index"
        @mouseleave="imageUnderCursorIndex = null"
      />
  </div>
</template>

<style lang="stylus">
.videos
  display flex
  flex-wrap wrap

  &__img
    margin 8px 16px
    border-radius 16px
    padding 8px

    &:hover
      cursor pointer

    &--selected
      opacity .5

</style>

<script setup lang="ts">
const { selectedVideos, updateSelectedVideos } = useYoutube()
const imageUnderCursorIndex = ref()
</script>
