<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { motion, useAnimate, useMotionValue } from 'motion-v'
import { pxValue, useElementSize } from '@vueuse/core'

const rightx = ref(0)
const score = ref(0)
// 开局让score从0递增到80
const timer = setInterval(() => {
    if (score.value < 80) {
        score.value++
    } else {
        clearInterval(timer)
    }
}, 20)
const leftcard = ref()
const rightcard = ref()
const { width: originlwidth, height } = useElementSize(leftcard)
const { width: rwidth } = useElementSize(rightcard)
const lwidth = ref(480)
const leftx = ref(0)
const changevalue = () => {
    if (rightx.value == rwidth.value - 80) {
        rightx.value = 0
    } else {
        rightx.value = rwidth.value - 80
    }
    leftx.value == 0 ? leftx.value = -80 : leftx.value = 0
    lwidth.value == 400 ? lwidth.value = 480 : lwidth.value = 400
}
</script>

<template>
    <div class="absolute main flex flex-col h-full w-full items-center justify-center" ref="scope">
        {{ originlwidth }}
        <motion.div :animate="{ x: rightx }" :transition="{ type: 'spring', bounce: 0.25, visualDuration: 0.5 }"
            class="absolute card bg-base-100 shadow-lg  py-8 px-6 w-full lg:w-120" :style="{ height: `${height}px` }"
            ref="rightcard">
            <div class="header mb-2">
                <span class="text-2xl font-bold">Detailed Answers</span>
            </div>
            <div class="body grid grid-cols-5 flex justify-center items-center overflow-y-scroll">
                <div v-for="i in 54" :key="i" class="w-12 flex-col justify-center place-self-center">
                    <div
                        class="shadow-sm w-12 h-12 rounded-lg flex bg-green-50 place-self-center self-center justify-center items-center text-green-400 text-[16px]">
                        <div>A</div>
                    </div>
                    <div class="flex w-12 justify-center text-gray-600 text-[12px]">{{ i }}</div>
                </div>
            </div>
        </motion.div>
        <motion.div :animate="{ x: leftx, width: lwidth }"
            class="card shadow-md m-auto w-80 lg:w-120  px-6 py-8 rounded-2xl bg-base-100" ref=leftcard>
            <div class="header flex justify-between">
                <span class="text-2xl font-bold ">Exam Result</span>
                <span class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">Multiple
                    Choice</span>
            </div>
            <div class="body">
                <!-- 分数动画 -->
                <div class="flex justify-center my-8">
                    <div class="relative w-48 h-48 ">
                        <div class="absolute radial-progress text-base-300" style="--value:100; --size:12rem;"
                            aria-valuenow="70" role="progressbar"></div>
                        <!-- 分数圆环 -->
                        <div class="radial-progress text-[#4f46e5] " :style="`--value:${score}; --size:12rem`"
                            :aria-valuenow="score" role="progressbar">
                            <div class="font-bold text-5xl text-center">
                                {{ score }}
                            </div>
                            <div class="text-2xl relative right-1">
                                / 100{{ }}
                            </div>
                        </div>

                        <!-- 飘动的星星动画 -->
                        <div v-for="i in 5" :key="i" class="absolute star" :class="`star-${i}`">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="flex-col">
                    <div class="flex justify-between mb-4">
                        <span class="text-base-content">Correct Answer</span>
                        <span class="text-base-content">17/20</span>
                    </div>
                    <div class="flex justify-between mb-4">
                        <span class="text-base-content">Accuracy</span>
                        <span class="text-base-content">86%</span>
                    </div>
                    <div class="flex justify-between mb-4">
                        <span class="text-base-content">Time Spent</span>
                        <span class="text-base-content">45.22</span>
                    </div>
                </div>
                <div class="mt-7">
                    <div class="btn btn-primary w-full" @click="changevalue"> Show Details
                        <ChevronRight :size="18" />
                    </div>

                </div>
            </div>
        </motion.div>
    </div>
</template>

<style scoped>
/* 星星动画 */
.star {
    opacity: 0;
    animation: starFloat 3s ease-out infinite;
}

.star-1 {
    top: 10%;
    right: 10%;
    animation-delay: 0.2s;
}

.star-2 {
    top: 20%;
    left: 15%;
    animation-delay: 0.7s;
}

.star-3 {
    bottom: 20%;
    right: 15%;
    animation-delay: 1.2s;
}

.star-4 {
    bottom: 10%;
    left: 10%;
    animation-delay: 1.7s;
}

.star-5 {
    top: 50%;
    right: 5%;
    animation-delay: 2.2s;
}

@keyframes starFloat {
    0% {
        opacity: 0;
        transform: translateY(10px) scale(0.8);
    }

    20% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    80% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        transform: translateY(-20px) scale(0.8);
    }
}
</style>