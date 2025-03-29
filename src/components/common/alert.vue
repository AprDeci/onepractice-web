<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';

const { type = 'success', show } = defineProps<{
    type?: 'success' | 'error' | 'warn';
    show: boolean;
}>();

</script>

<template>
    <AnimatePresence>
        <motion.div :initial="{ x: 300, opacity: 0 }"
            :animate="{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }"
            :exit="{ x: 300, opacity: 0 }" class="fixed top-4 right-4 z-50 text-center" v-if="show">
            <div role="alert" class="alert mb-0"
                :class="{ 'alert-success': type === 'success', 'alert-error': type === 'error', 'alert-warning': type === 'warn' }">
                <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-if="type === 'warn'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current"
                    fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <svg v-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current"
                    fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <slot></slot>
            </div>
        </motion.div>
    </AnimatePresence>
</template>
