<script setup lang="ts">
import { ref } from 'vue'
import { useSwipe } from '@vueuse/core'
defineProps({
    hasPrev: {
        type: Boolean,
        default: true
    },
    hasNext: {
        type: Boolean,
        default: true
    }
})
defineEmits(['prev', 'next'])
const container = ref(null)
const { isSwiping, direction } = useSwipe(container)
// 如果
</script>
<template>

    <div class="relative w-full">
        <!-- Previous button -->
        <Teleport to="body">
            <button
                class="prebtn cursor-pointer fixed  top-1/2 left-1/20 z-10 rounded-full opacity-80 hover:opacity-100 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 shadow-sm"
                @click="$emit('prev')" :disabled="!hasPrev"
                :class="{ ' hidden opacity-50 cursor-not-allowed': !hasPrev }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-chevron-left">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>
        </Teleport>

        <!-- Content container -->
        <div class=" lg:px-8" ref="container">
            <slot></slot>
        </div>

        <!-- Next button -->
        <Teleport to="body">
            <button
                class="cursor-pointer fixed right-1/20  top-1/2  z-10 rounded-full opacity-80 hover:opacity-100 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 shadow-sm"
                @click="$emit('next')" :disabled="!hasNext"
                :class="{ 'hidden opacity-50 cursor-not-allowed': !hasNext }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-chevron-right">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>
        </Teleport>
    </div>
</template>
