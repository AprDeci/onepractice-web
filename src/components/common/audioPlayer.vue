<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from 'lucide-vue-next'

interface Props {
    audioSrc: string
    autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    audioSrc: '',
    autoplay: false
})

// Refs
const audioRef = ref<HTMLAudioElement | null>(null)
const progressBarRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(1)
const currentTime = ref(0)
const duration = ref(0)

// Computed
const progress = computed(() => {
    return duration.value ? (currentTime.value / duration.value) * 100 : 0
})

// Methods
const togglePlay = () => {
    if (!audioRef.value) return

    if (isPlaying.value) {
        audioRef.value.pause()
    } else {
        audioRef.value.play()
    }

    isPlaying.value = !isPlaying.value
}

const toggleMute = () => {
    if (!audioRef.value) return

    audioRef.value.muted = !audioRef.value.muted
    isMuted.value = audioRef.value.muted
}

const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00'

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const onTimeUpdate = () => {
    if (!audioRef.value) return
    currentTime.value = audioRef.value.currentTime
}

const onLoadedMetadata = () => {
    if (!audioRef.value) return
    duration.value = audioRef.value.duration

    // Apply autoplay if enabled
    if (props.autoplay) {
        audioRef.value.play()
        isPlaying.value = true
    }
}

const onEnded = () => {
    isPlaying.value = false
    currentTime.value = 0
}

const seek = (event: MouseEvent) => {
    if (!progressBarRef.value || !audioRef.value) return

    const rect = progressBarRef.value.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    const seekTime = percent * duration.value

    audioRef.value.currentTime = seekTime
    currentTime.value = seekTime
}

// Watch for volume changes
watch(volume, (newVolume) => {
    if (!audioRef.value) return
    audioRef.value.volume = newVolume

    // Update muted state based on volume
    if (newVolume === 0) {
        isMuted.value = true
        audioRef.value.muted = true
    } else if (isMuted.value) {
        isMuted.value = false
        audioRef.value.muted = false
    }
})

// Cleanup
onUnmounted(() => {
    if (audioRef.value && isPlaying.value) {
        audioRef.value.pause()
    }
})
</script>
<template>
    <div class="w-full max-w-full bg-base-100 rounded-xl shadow-md px-4 py-3 border border-gray-100 dark:border-0">
        <div class="flex flex-col gap-2">
            <!-- Progress and time indicators -->
            <div class="flex items-center gap-3">
                <span class="text-xs font-mono text-gray-600 dark:text-base-content min-w-[40px]">{{
                    formatTime(currentTime) }}</span>

                <div class="relative flex-1 h-1.5 bg-gray-100 rounded-full cursor-pointer group" ref="progressBarRef"
                    @click="seek">
                    <div class="absolute top-0 left-0 h-full bg-amber-200 rounded-full transition-all duration-100"
                        :style="{ width: `${progress}%` }"></div>
                    <div class="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white border-2 border-amber-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        :style="{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }"></div>
                </div>

                <span class="text-xs font-mono text-gray-600 min-w-[40px] dark:text-base-content text-right">{{
                    formatTime(duration) }}</span>
            </div>

            <!-- Controls -->
            <div class="flex items-center justify-between">
                <button
                    class="flex items-center justify-center w-10 h-10 rounded-full dark:bg-base-300 bg-gray-100 hover:bg-gray-200 transition-colors"
                    @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
                    <PauseIcon v-if="isPlaying" class="w-5 h-5 text-gray-800 dark:text-base-content" />
                    <PlayIcon v-else class="w-5 h-5 text-gray-800 dark:text-base-content" />
                </button>

                <div class="flex items-center gap-2">
                    <button
                        class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                        @click="toggleMute" :aria-label="isMuted ? 'Unmute' : 'Mute'">
                        <VolumeXIcon v-if="isMuted" class="w-4 h-4 text-gray-600" />
                        <Volume2Icon v-else class="w-4 h-4 text-gray-600" />
                    </button>

                    <input type="range" min="0" max="1" step="0.01" v-model="volume"
                        class="w-20 h-1.5 bg-rose-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500" />
                </div>
            </div>
        </div>

        <audio ref="audioRef" :src="audioSrc" preload="metadata" @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoadedMetadata" @ended="onEnded"></audio>
    </div>
</template>
