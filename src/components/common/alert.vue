<!-- AlertNotification.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

interface AlertMessage {
    id: number
    text: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
}

const messages = ref<AlertMessage[]>([])
let idCounter = 0

const addMessage = (text: string, type: AlertMessage['type'] = 'success', duration = 3000) => {
    const id = ++idCounter
    messages.value.push({ id, text, type, duration })

    // 自动移除消息
    if (duration > 0) {
        setTimeout(() => {
            removeMessage(id)
        }, duration)
    }
}

const removeMessage = (id: number) => {
    messages.value = messages.value.filter(msg => msg.id !== id)
}

// 暴露方法供外部调用
defineExpose({
    addMessage,
    removeMessage
})
</script>

<template>
    <Teleport to="body">
        <div class="fixed left-1/2 -translate-x-1/2  top-10 flex flex-col gap-3 items-center justify-center z-[999]">
            <AnimatePresence>
                <motion.div :initial="{ opacity: '0', y: -20 }" :animate="{ opacity: 1, y: 0 }"
                    :exit="{ opacity: 0, y: -20 }" v-for="message in messages" :key="message.id" role="alert"
                    :class="['alert', `alert-${message.type}`, 'alert-soft']" @click="removeMessage(message.id)">
                    <span>{{ message.text }}</span>
                </motion.div>
            </AnimatePresence>
        </div>
    </Teleport>
</template>

<style scoped></style>