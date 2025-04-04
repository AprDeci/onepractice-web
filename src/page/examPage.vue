<script setup lang="ts">
import { ref, onMounted, watch, } from 'vue'
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
const paperStore = usepaperStore()
const { id } = defineProps<{
    id: string
}>()

const router = useRouter()

// 计时函数 - 待修改
const time = ref(120 * 60)
const startcooldown = () => {
    const cooldownh = document.getElementById('cooldownh')
    const cooldownm = document.getElementById('cooldownm')
    const cooldowns = document.getElementById('cooldowns')
    // 将time(单位为秒)转换为小时、分钟和秒
    let seconds = 59; // 初始化秒数为59
    const interval = setInterval(() => {
        let counter = time.value;
        let hours = Math.floor(time.value / 60 / 60);
        let minutes = Math.floor(time.value / 60) % 60;

        if (counter > 0) {
            time.value--;
            seconds--; // 秒数减1
            if (seconds < 0) {
                seconds = 59; // 当秒数减到0时重置为59
            }
        }

        if (cooldownh) {
            cooldownh.style.setProperty('--value', hours.toString())
        }
        if (cooldownm) {
            cooldownm.style.setProperty('--value', minutes.toString())
        }
        if (cooldowns) {
            cooldowns.style.setProperty('--value', seconds.toString())
        }
        if (counter === 0) {
            clearInterval(interval)
        }
    }, 1000)
}
const selectedtab = ref('writing')
const selectedindex = ref(0)
const { loading, data, send } = useRequest(getAllQuestionsBypaperIdSplitByPart(id))
const { loading: answerload, data: answerdata } = useRequest(getAnswersByPaperId(id)).onSuccess(e => {
    paperStore.setCurrentPaper(id, answerdata.value.answers)
})
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
    const data = await saveRecord(paperStore.currentPaperId, "test", 0, JSON.stringify(paperStore.currentUserAnswers), paperStore.currentScore, Object.keys(paperStore.currentCorrectAnswers).length, 0)
    console.log(data)
    router.push({ name: 'examResult' });
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
                    <div>
                        <span class="countdown font-mono text-lg lg:text-2xl">
                            <span id="cooldownh" style="--value:2;" aria-live="polite" aria-label="2">2</span>
                            :
                            <span id="cooldownm" style="--value:0;" aria-live="polite" aria-label="0">0</span>
                            :
                            <span id="cooldowns" style="--value:0;" aria-live="polite" aria-label="0">0</span>
                        </span>
                    </div>
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
            <footer>
                <footer
                    class="footer footer-horizontal bg-base-200 text-neutral-content items-center p-4 border dark:border-base-100">
                    <aside class="grid-flow-col items-center">
                        <div class="btn btn-sm lg:btn-md">Previous Section</div>
                        <div class="btn btn-sm lg:btn-md">Next Section</div>
                    </aside>
                    <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                        <div class="btn btn-primary btn-sm lg:btn-md" @click="submit">
                            submit
                        </div>
                    </nav>
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
                    <p class="text-xs text-gray-500 mt-1">Track your progress</p>
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
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm group-hover:shadow-md"
                                    :class="[
                                        answer.answer ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-gray-200',
                                        answer.isCorrect === true ? 'bg-green-50 text-green-600 border border-green-200' : '',
                                        answer.isCorrect === false ? 'bg-red-50 text-red-600 border border-red-200' : ''
                                    ]">
                                    <span class="text-sm font-medium">{{ answer.answer || '?' }}</span>
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