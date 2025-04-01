<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Timer } from 'lucide-vue-next'
import WritingCard from '../components/exam/writingCard.vue'
import ListeningCard from '../components/exam/listeningCard.vue'
import readingCard from '../components/exam/readingCard.vue'
import { getAllQuestionsBypaperIdSplitByPart } from '../request/methods/question'
import { useRequest } from 'alova/client'

const openanswer = ref(false)
const { id } = defineProps<{
    id: string
}>()

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
onMounted(async () => {
    startcooldown()
})

const cards = {
    'writing': WritingCard,
    'listening': ListeningCard,
    'reading': readingCard,
    'cloze': readingCard,
    'translation': WritingCard,
}

const changeTab = (card, index) => {
    selectedtab.value = card;
    selectedindex.value = index;
}

</script>

<template>

    <div class="dark">
        <div class=" navbar bg-base-100 shadow-sm flex justify-between">
            <div class="navbar-start hidden lg:flex">
                <span class="text-xl mx-2">Exam Paper Name</span>
            </div>
            <div class="navbar-center">
                <Timer />
                <div>
                    <span class="countdown font-mono text-lg lg:text-2xl">
                        <span id="cooldownh" style="--value:2;" aria-live="polite" aria-label="2">2</span>
                        :
                        <span id="cooldownm" style="--value:0;" aria-live="polite" aria-label="0">0</span>
                        :
                        <span id="cooldowns" style="--value:59;" aria-live="polite" aria-label="59">59</span>
                    </span>
                </div>

            </div>
            <div class="navbar-end">
                <div class="btn w-26 btn-sm lg:w-34 btn-primary" @click="openanswer = !openanswer">View
                    Answer</div>
            </div>
        </div>
        <div :class="openanswer ? 'translate--x-0' : 'translate-x-full'"
            class="transform duration-300 ease-in-out answer fixed -right-0 w-80 h-screen">
            <div class="h-full px-4 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <div class="answerbarhead">
                    <span class="text-2xl font-bold">Answer</span>
                </div>
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
                    <component :is="cards[selectedtab]" :data="data.questionParts[selectedindex]"></component>
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
                    <div class="btn btn-primary btn-sm lg:btn-md">submit</div>
                </nav>
            </footer>
        </footer>
    </div>
</template>