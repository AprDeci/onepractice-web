<script setup lang="ts">
import { ref, onMounted, watch, beforeUnmount } from 'vue'
import { Timer } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import WritingCard from '../components/exam/writingCard.vue'
import ListeningCard from '../components/exam/listeningCard.vue'
import readingCard from '../components/exam/readingCard.vue'
import TranslationCard from '../components/exam/TranslationCard.vue'
import { getAllQuestionsBypaperIdSplitByPart, getAnswersByPaperId } from '../request/methods/question'
import { useRequest } from 'alova/client'
import { usepaperStore } from '../store/paperStore.ts'
import { saveRecord } from '../request/methods/record.ts'
import { motion, AnimatePresence } from 'motion-v'
import { Times } from '../common/examMode.ts'
const paperStore = usepaperStore()
const { id, mode } = defineProps<{
    id: string,
    mode: string
}>()

const showBlur = ref(true)
const router = useRouter()
const seconds = Times[paperStore.currentPaperType] * 60
const selectedtab = ref('writing')
const selectedindex = ref(0)
const { loading, data, send } = useRequest(getAllQuestionsBypaperIdSplitByPart(id))
const { loading: answerload, data: answerdata } = useRequest(getAnswersByPaperId(id)).onSuccess(e => {
    paperStore.setCurrentPaper(id, answerdata.value.answers)
})
const showAlert = ref(false)
onMounted(async () => {
    startcooldown()
})

const cards = {
    'writing': WritingCard,
    'listening': ListeningCard,
    'reading': readingCard,
    'cloze': readingCard,
    'translation': TranslationCard

}

const changeTab = (card, index: number) => {
    selectedtab.value = card;
    selectedindex.value = index;
}

const cleanAnswer = () => {
    paperStore.cleancurrentUserAnswer();
    location.reload();
}

const submit = async () => {
    await saveRecord(paperStore.currentPaperId, mode, paperStore.currentUserAnswersLength === paperStore.currentCorrectAnswersLength ? 1 : 0, JSON.stringify(paperStore.currentUserAnswers), paperStore.currentScore, Object.keys(paperStore.currentCorrectAnswers).length, 0)
    router.push({ name: 'examResult' });

}

const counterzero = () => {
    submit()
}
</script>

<template>
    <div class="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <div class=" navbar bg-base-100 shadow-sm flex justify-between">
                <div class="navbar-start hidden lg:flex">
                    <span class="text-xl mx-2 cursor-pointer" @click="router.push('/')">One Practice</span>
                </div>
                <div class="navbar-center">
                    <Timer />
                    <CounterReverse v-if="mode === 'simulation'" @todo="counterzero" :seconds="seconds">
                    </CounterReverse>
                    <Counter v-if="mode === 'free'"></Counter>
                </div>
                <div class="navbar-end">
                    <label for="my-drawer-4" class="drawer-button btn btn-primary">Open drawer</label>
                </div>
            </div>

            <div class="middle px-6">
                <div class="mt-8 mb-4">
                    <div role="tablist" class="tabs tabs-box w-82 lg:w-105">
                        <a :class="{ 'tab-active': selectedtab === Part.questions[0].questionType }" role="tab"
                            class="tab w-20 lg:w-25 h-12" v-for="(Part, index) in data.questionParts" :key="index"
                            @click="changeTab(Part.questions[0].questionType, index)">{{
                                Part.questions[0].partName }}</a>
                    </div>
                </div>
                <div class="w-full  mb-4">
                    <KeepAlive>
                        <component :is="cards[selectedtab]" :data="data.questionParts[selectedindex]">
                        </component>
                    </KeepAlive>
                </div>
            </div>
            <footer class="sticky bottom-0 w-full">
                <footer
                    class="footer flex justify-between footer-horizontal bg-base-200 text-neutral-content items-center p-4 border dark:border-base-100">
                    <aside class="grid-flow-col items-center">
                        <div class="btn btn-sm lg:btn-md" v-show="selectedindex > 0"
                            @click="changeTab(data.questionParts[selectedindex - 1].questions[0].questionType, selectedindex - 1)">
                            Previous Section</div>
                        <div class="btn btn-sm lg:btn-md" v-show="selectedindex < data.questionParts.length - 1"
                            @click="changeTab(data.questionParts[selectedindex + 1].questions[0].questionType, selectedindex + 1)">
                            Next Section</div>
                    </aside>
                    <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                        <div class="btn btn-primary btn-sm lg:btn-md" @click="showAlert = !showAlert">
                            submit
                        </div>
                    </nav>
                    <AnimatePresence>
                        <motion.div :initial="{ y: 20, opacity: 0 }" :animate="{ y: 0, opacity: 1 }"
                            :exit="{ opacity: 1, y: [0, 20, -1000], scaleY: [1, 0.4, 0], scaleX: [1, 0.7, 0], transition: { duration: 0.8, times: [0, 0.6, 0.8] } }"
                            :transition="{
                                duration: 0.4,
                            }" v-if="showAlert" role="alert"
                            class="absolute right-2  bottom-20 alert alert-vertical sm:alert-horizontal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                class="stroke-info h-6 w-6 shrink-0">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>确认提交吗? <span
                                    v-if="paperStore.currentUserAnswersLength != paperStore.currentCorrectAnswersLength">您还没有做完所有题目</span></span>
                            <div class="flex gap-2">
                                <button @click="showAlert = false" class="btn btn-sm">不交不交</button>
                                <button @click="submit" class="btn btn-sm btn-primary">交!</button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </footer>
            </footer>
        </div>
        <!-- 答案侧边栏 -->
        <div class="drawer-side">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>

            <div class="bg-white text-gray-800 min-h-full w-64 lg:w-80 flex flex-col shadow-lg">
                <!-- 侧边栏标题 -->
                <div class="p-5 border-b border-gray-100">
                    <h2 class="text-lg font-medium">Answer Sheet</h2>
                    <div class="flex justify-between">
                        <p class="text-xs text-gray-500 mt-1">Track your progress</p>
                        <p class="text-xs text-blue-200 hover:text-blue-400 cursor-pointer"
                            @click="showBlur = !showBlur">View All</p>
                    </div>
                </div>

                <!-- 答案网格 -->
                <div class="p-5 flex-1 overflow-y-auto">
                    <div class="grid grid-cols-4 lg:grid-cols-5 gap-3">
                        <div v-for="answer in answerdata.answers" :key="answer.index" class="relative group">
                            <div class="flex flex-col items-center" :class="{
                                'opacity-40': !answer.answer,
                                'has-answer': answer.answer
                            }">
                                <!-- 答案卡片 -->
                                <div class="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm group-hover:shadow-md"
                                    :class="[
                                        answer.answer ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-gray-200',
                                        answer.isCorrect === true ? 'bg-green-50 text-green-600 border border-green-200' : '',
                                        answer.isCorrect === false ? 'bg-red-50 text-red-600 border border-red-200' : ''
                                    ]">
                                    <span class="text-sm font-medium">{{ answer.answer || '?' }}</span>
                                    <!-- 遮罩层 -->
                                    <div v-if="mode === 'simulation' && showBlur"
                                        class="rounded-lg answerblur w-full h-full absolute backdrop-blur-sm hover:backdrop-blur-[0px]">
                                    </div>
                                </div>

                                <!-- 题号 -->
                                <span class="text-xs text-gray-500 mt-1.5">{{ answer.index }}</span>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- 底部统计 -->
                <div class="p-5 border-t border-gray-100 bg-gray-50">
                    <div class="flex justify-between items-center">
                        <div class="text-sm">
                            <span class="font-medium">{{ Object.keys(paperStore.currentUserAnswers).length }}</span> /
                            {{ answerdata.answers.length }}
                            answered
                        </div>
                        <button class="text-xs text-gray-500 hover:text-red-500 transition-colors" @click="cleanAnswer">
                            Clear all
                        </button>
                    </div>

                    <!-- 进度条 -->
                    <div class="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full transition-all duration-500"
                            :style="{ width: `${(Object.keys(paperStore.currentUserAnswers).length / answerdata.answers.length) * 100}%` }">
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>