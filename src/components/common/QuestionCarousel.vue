<template>
    <div class="w-full relative">
        <!-- Carousel container -->
        <div ref="carouselRef" class="overflow-hidden touch-pan-x" @touchstart="handleTouchStart"
            @touchmove="handleTouchMove" @touchend="handleTouchEnd" @mousedown="handleMouseDown"
            @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
            <div class="flex transition-transform duration-300 ease-out"
                :style="{ transform: `translateX(${-currentIndex * 100}%)` }">
                <div v-for="(_, index) in totalSlides" :key="index" class="w-full flex-shrink-0">
                    <slot :name="`slide-${index}`" />
                </div>
            </div>
        </div>

        <!-- Navigation arrows -->
        <button v-if="showArrows && currentIndex > 0" @click="prev"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
            aria-label="Previous question">
            <ChevronLeftIcon class="w-6 h-6 text-gray-800" />
        </button>

        <button v-if="showArrows && currentIndex < totalSlides - 1" @click="next"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
            aria-label="Next question">
            <ChevronRightIcon class="w-6 h-6 text-gray-800" />
        </button>

        <!-- Indicators -->
        <div class="flex justify-center items-center mt-4 gap-2">
            <button v-for="index in totalSlides" :key="index" @click="goToSlide(index - 1)"
                class="w-2.5 h-2.5 rounded-full transition-all duration-200 focus:outline-none" :class="[
                    currentIndex === index - 1
                        ? 'bg-indigo-600 w-6'
                        : 'bg-gray-300 hover:bg-gray-400'
                ]" :aria-label="`Go to question ${index}`"
                :aria-current="currentIndex === index - 1 ? 'true' : 'false'"></button>
        </div>

        <!-- Question counter -->
        <div
            class="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
            {{ currentIndex + 1 }} / {{ totalSlides }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

interface Props {
    /** Total number of slides/questions */
    totalSlides: number
    /** Show navigation arrows */
    showArrows?: boolean
    /** Enable keyboard navigation */
    enableKeyboard?: boolean
    /** Initial slide index (0-based) */
    initialSlide?: number
}

const props = withDefaults(defineProps<Props>(), {
    showArrows: true,
    enableKeyboard: true,
    initialSlide: 0
})

const emit = defineEmits<{
    /** Emitted when the current slide changes */
    (e: 'change', index: number): void
}>()

// State
const currentIndex = ref(props.initialSlide)
const carouselRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const dragThreshold = 50 // Minimum drag distance to trigger slide change

// Methods
const goToSlide = (index: number) => {
    if (index < 0) {
        currentIndex.value = 0
    } else if (index >= props.totalSlides) {
        currentIndex.value = props.totalSlides - 1
    } else {
        currentIndex.value = index
    }
    emit('change', currentIndex.value)
}

const next = () => {
    goToSlide(currentIndex.value + 1)
}

const prev = () => {
    goToSlide(currentIndex.value - 1)
}

// Touch handlers
const handleTouchStart = (e: TouchEvent) => {
    startX.value = e.touches[0].clientX
    isDragging.value = true
    currentX.value = 0
}

const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return
    currentX.value = e.touches[0].clientX - startX.value
}

const handleTouchEnd = () => {
    if (!isDragging.value) return

    if (currentX.value > dragThreshold) {
        prev()
    } else if (currentX.value < -dragThreshold) {
        next()
    }

    isDragging.value = false
}

// Mouse handlers
const handleMouseDown = (e: MouseEvent) => {
    startX.value = e.clientX
    isDragging.value = true
    currentX.value = 0

    // Prevent text selection during drag
    e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return
    currentX.value = e.clientX - startX.value
}

const handleMouseUp = () => {
    if (!isDragging.value) return

    if (currentX.value > dragThreshold) {
        prev()
    } else if (currentX.value < -dragThreshold) {
        next()
    }

    isDragging.value = false
}

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
    if (!props.enableKeyboard) return

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prev()
    }
}

// Lifecycle hooks
onMounted(() => {
    if (props.enableKeyboard) {
        window.addEventListener('keydown', handleKeyDown)
    }
})

onBeforeUnmount(() => {
    if (props.enableKeyboard) {
        window.removeEventListener('keydown', handleKeyDown)
    }
})
</script>