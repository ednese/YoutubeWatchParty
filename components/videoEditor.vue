<template>
  <div class="videoEditor" :style="style">
    <iframe
      v-if="selectedVideo.type === 'youtube'"
      width="640"
      height="360"
      class="videoEditor__video"
      :src="`https://www.youtube.com/embed/${selectedVideo.id}?controls=0&start=${start}&end=${end}`"
    />
    <video
      v-else-if="selectedVideo.type === 'googleDrive'"
      controls
      ref="videoRef"
      class="videoEditor__video"
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
import { useEventListener, useMousePressed, useMediaControls } from '@vueuse/core'

const videoRef = ref()
const rangeRef = ref()
const videosIndex = ref(0);
const beforeTranslateX = ref(0)
const afterTranslateX = ref(100)

const { pressed } = useMousePressed()
const { start, end } = getVideoTimeDelimitations()
const { selectedVideos } = useVideos()

const rangeWidth = computed(() => rangeRef.value?.clientWidth);
const selectedVideo = computed(() => selectedVideos.value[videosIndex.value])
const googleDriveVideoSrc = computed(() => `https://drive.google.com/uc?export=download&id=${selectedVideo.value.id}`)
const youtubeDuration = computed(() => convertTime(selectedVideo.value.duration))
const videoDuration = computed(() =>
  selectedVideo.value?.type === 'youtube'
    ? youtubeDuration.value
    : selectedVideo.value?.type === 'googleDrive'
    ? googleDriveDuration.value
    : 0
)

const {
  playing,
  currentTime,
  duration: googleDriveDuration,
} = useMediaControls(videoRef, {
  src: googleDriveVideoSrc.value,
})

watch(currentTime, (value) => {
  if (value > end.value) playing.value = false
})

watch(selectedVideo, () => {
  setVideosDelimitationsValues()
})

watch(videoDuration, () => {
  setVideosDelimitationsValues()
})

watch(beforeTranslateX, () => {
  if (selectedVideo.value?.type === 'googleDrive') {
    currentTime.value = start.value
  }
})

onMounted(async () => {
  setVideosDelimitationsValues()
})

useEventListener(rangeRef, 'click',  (e: any) => handleRange(e, true) )
useEventListener(rangeRef, 'mousemove', handleRange)

function setVideosDelimitationsValues() {
  if (start.value) {
    beforeTranslateX.value = (start.value / videoDuration.value) * rangeWidth.value
  } else {
    selectedVideo.value.start = 0
    beforeTranslateX.value = 0
  }
  if (end.value && videoDuration.value) {
    afterTranslateX.value = (end.value / videoDuration.value) * rangeWidth.value
  } else if (!end.value) {
    selectedVideo.value.end = videoDuration.value
    afterTranslateX.value = rangeWidth.value
  } else {
    afterTranslateX.value = rangeWidth.value
  }
}

function getVideoTimeDelimitations() {
  return {
    start: computed(() => selectedVideo.value.start),
    end: computed(() => selectedVideo.value.end)
  }
}

function handleRange({ layerX }, isClick = false) {
  if (!pressed.value && !isClick) return
  const percenatge = layerX / rangeWidth.value;
  const timeValue = Math.round(videoDuration.value * percenatge);

  if (Math.abs(layerX - beforeTranslateX.value) < Math.abs(layerX - afterTranslateX.value)) {
    beforeTranslateX.value = layerX
    selectedVideo.value.start = timeValue
  } else {
    afterTranslateX.value = layerX
    selectedVideo.value.end = timeValue
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
