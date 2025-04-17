<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { usepaperStore } from '../store/paperStore'
import { userecordStore } from '../store/recordStore'
import { useRouter } from 'vue-router'
import Rating from '../components/common/rating.vue'
import { submitRating, getVoteByUserIdandPaperId } from '../request/methods/vote'
import { useRequest } from 'alova/client'
const router = useRouter()
const paperStore = usepaperStore()
const recordStore = userecordStore()
const score = ref(0)
const timer = setInterval(() => {
    if (score.value < paperStore.currentScore) {
        score.value++
    } else {
        clearInterval(timer)
    }
}, 20)
const leftcard = ref()
const rightcard = ref()
const ratingvalue = ref<number>(0)
const destroy = ref(true)
const updaterating = async (n: number) => {
    ratingvalue.value = n;
    await submitRating(paperStore.currentPaperId as number, n.toString())
}
const { data: voterating } = useRequest(() => getVoteByUserIdandPaperId(paperStore.currentPaperId as number, 0)).onSuccess((res) => {
    if (res.data) ratingvalue.value = res.data.rating
})

onBeforeUnmount(() => {
    // 如果做完 清理paperstore
    if (paperStore.currentCorrectAnswersLength == paperStore.currentUserAnswersLength) {
        // 如果从非Review离开
        if (destroy.value) {
            delete paperStore.papersData[paperStore.currentPaperId as number]
        }
    }
    //反之不做变化

})
const review = () => {
    destroy.value = false
    router.push({ name: 'examReview', params: { id: paperStore.currentPaperId, recordId: '0412' } })
}
</script>

<template>
    <div class="lg:absolute main flex flex-col lg:flex-row h-full w-full items-center justify-center gap-5" ref="scope">
        <div class="card shadow-md w-80 lg:w-110  px-6 py-8 rounded-2xl bg-base-100" ref=leftcard>
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
                                / {{ Object.keys(paperStore.currentCorrectAnswers).length }}
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
                <div class="flex-col flex gap-4">
                    <div class="flex flex-col items-center w-full justify-center">
                        <div class="flex gap-1 items-center w-full justify-center">
                            <span class="text-xs text-gray-500">easy</span>
                            <Rating v-model="ratingvalue" @update="updaterating"
                                :hasvoted="ratingvalue == 0 ? false : true" class=""></Rating>
                            <span class="text-xs text-gray-500">not easy</span>
                        </div>
                        <div><span class="text-xs text-gray-500">每个用户只能投票一次,请认真评分</span></div>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-base-content">Correct Answer</span>
                        <span class="text-base-content">{{ paperStore.currentScore }}/{{
                            Object.keys(paperStore.currentCorrectAnswers).length }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-base-content">Accuracy</span>
                        <span class="text-base-content">{{ (paperStore.currentScore /
                            Object.keys(paperStore.currentUserAnswers).length).toFixed(4) * 100 }}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-base-content">Time Spend</span>
                        <span class="text-base-content">{{ ((recordStore.currentHasspendtime) / 1000 /
                            60).toFixed(1)
                        }}min</span>
                    </div>
                </div>
                <div class="mt-7 flex flex-col gap-3">
                    <div v-if="paperStore.currentCorrectAnswersLength == paperStore.currentUserAnswersLength"
                        class="btn btn-primary w-full" @click="review()"> Review
                        <ChevronRight :size="18" />
                    </div>
                    <div class="btn btn-secondary w-full" @click="router.push('/')"> Return Home
                        <ChevronRight :size="18" />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-4">
            <div v-if="paperStore.currentCorrectAnswersLength != paperStore.currentUserAnswersLength" role="alert"
                class="alert alert-info alert-soft">
                <span>您的答案将在本地保存两小时,点击试卷继续做题</span>
            </div>
            <div class="card bg-base-100 shadow-lg  py-8 px-6 w-80 lg:w-120 lg:h-120 rounded-2xl" ref="rightcard">
                <div class="header mb-2">
                    <span class="text-2xl font-bold">Detailed Answers</span>
                </div>
                <div
                    class="body grid grid-cols-4 lg:grid-cols-5 flex gap-y-3 justify-center items-center overflow-y-scroll">
                    <div v-for="(answerstatu, index) in paperStore.currentAnswerStatus" :key="index"
                        class="w-12 flex-col justify-center place-self-center">
                        <div class="shadow-sm w-12 h-12 rounded-lg flex  place-self-center self-center justify-center items-center  text-[16px]"
                            :class="{
                                'bg-green-50 text-green-400': answerstatu,
                                'bg-red-100 text-red-400': !answerstatu
                            }">

                            <div>{{ paperStore.getUserAnswer(index) }}</div>
                        </div>
                        <div class="mt-2 flex w-12 justify-center text-gray-600 text-[12px]">{{ index }}</div>
                    </div>
                </div>
            </div>
        </div>
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