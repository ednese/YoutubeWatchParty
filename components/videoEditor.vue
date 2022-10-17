<template>
  <div class="videoEditor" :style="style">
    <iframe
      ref="youtubeVideoRef"
      width="640"
      height="360"
      class="videoEditor__video"
      :src="`https://www.youtube.com/embed/${selectedVideo.id}?controls=0&start=${start}&end=${end}`"
    />
    <div class="videoEditor__option">
      <div ref="rangeRef" class="videoEditor__option__range"/>
    </div>

    <div class="inline-flex mt-3">
      <button v-if="videosIndex > 0" @click="videosIndex--" class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
        Vidéo précédente
      </button>
      <button @click="videosIndex++" v-if="videosIndex < selectedVideos.length - 1" class="ml-3 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
        Vidéo suivante
      </button>
    </div>
  </div>
</template>

<style lang="stylus">
.videoEditor
  width 1280px
  max-width 90%
  margin auto
  display flex
  flex-direction column
  align-items center

.videoEditor__video
  margin-top 20px
  width 100%
  height 40vw
  min-height 500px
  max-height 700px

.videoEditor__option
  background white
  border-radius 8px
  margin-top 8px
  width 100%
  height 72px
  position relative
  border 1px #ddddeb solid
  display flex
  align-items center
  justify-content center
  &:before
    content ''
    width 90%
    height 8px
    left 50%
    transform translateX(-50%)
    border-radius 8px
    position absolute
    background var(--range--background)
    display flex
    align-items center
    cursor pointer

.videoEditor__option__range
  width 90%
  height 100%
  border-radius 8px
  position relative
  display flex
  align-items center
  cursor pointer
  padding 10px
  &:before,
  &:after
    content ''
    left 0
    z-index 1
    width 4px
    height 18px
    border-radius 8px
    position absolute
    background #2563EB
    padding 0 2px
    border 2px white solid

  &:before
    transform translateX(var(--before--translateX))
  &:after
    transform translateX(var(--after--translateX))

</style>

<script setup lang="ts">
import { useEventListener, useMousePressed } from '@vueuse/core'

const { pressed } = useMousePressed()

const videosIndex = ref(0);
const { selectedVideos } = useYoutube()
const selectedVideo = computed(() => selectedVideos.value[videosIndex.value])
const duration = computed(() => convertTime(selectedVideo.value.duration))
const { start, end } = getVideoTimeDelimitations()

const rangeRef = ref()
const beforeTranslateX = ref(0)
const afterTranslateX = ref(100)

const rangeWidth = computed(() => rangeRef.value?.clientWidth);

watch(selectedVideo, () => {
  initTimeDelimitationsValues()
})

onMounted(async () => {
  initTimeDelimitationsValues()
})

function initTimeDelimitationsValues() {
  if (!selectedVideo.value?.start) {
    selectedVideos.value[videosIndex.value].start = 0
    beforeTranslateX.value = 0
  } else {
    beforeTranslateX.value = (selectedVideo.value.start / duration.value) * rangeWidth.value
  }
  if (!selectedVideo.value?.end) {
    selectedVideos.value[videosIndex.value].end = duration.value
    afterTranslateX.value = rangeWidth.value
  } else {
    afterTranslateX.value = (selectedVideo.value.end / duration.value) * rangeWidth.value
  }
}

function getVideoTimeDelimitations() {
  return {
    start: computed(() => selectedVideo.value.start),
    end: computed(() => selectedVideo.value.end)
  }
}

function abs(number: number) {
  if (number < 0) return number * -1;
  return number;
}

useEventListener(rangeRef, 'click',  (e: any) => handleRange(e, true) )
useEventListener(rangeRef, 'mousemove', handleRange)

function handleRange({ layerX }, isClick = false) {
  if (!pressed.value && !isClick) return
  const percenatge = layerX / rangeWidth.value;
  if (abs(layerX - beforeTranslateX.value) < abs(layerX - afterTranslateX.value)) {
    beforeTranslateX.value = layerX
    selectedVideos.value[videosIndex.value].start = Math.round(duration.value * percenatge)
  } else {
    afterTranslateX.value = layerX
    selectedVideos.value[videosIndex.value].end = Math.round(duration.value * percenatge)
  }
}

const style = computed(
  () => {
    const beforePercentage = beforeTranslateX.value / rangeWidth.value * 100;
    const afterPercentage = afterTranslateX.value / rangeWidth.value * 100;
    return {
      '--before--translateX' : beforeTranslateX.value + 'px',
      '--after--translateX' : afterTranslateX.value - 5 + 'px',
      '--range--background' : `linear-gradient(
        to right,
        grey 0%,
        grey ${beforePercentage}%,
        #5481e4 ${beforePercentage}%,
        #5481e4 ${afterPercentage}%,
        grey ${afterPercentage}%,
        grey 100%
      )`
    }
  }
);

function convertTime(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration
}
</script>
