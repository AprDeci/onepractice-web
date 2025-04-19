<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import WritingCard from '../components/exam/writingCard.vue'
import TranslationCard from '../components/exam/TranslationCard.vue'
import rlisteningCard from '../components/examreview/rlisteningCard.vue'
import rreadingCard from '../components/examreview/rreadingCard.vue'
import { getAllQuestionsBypaperIdSplitByPart, getAnswersByPaperId } from '../request/methods/question.ts'
import { useRequest } from 'alova/client'
import { usepaperStore } from '../store/paperStore.ts'
import { useElementSize, onClickOutside, useEventListener, useElementByPoint, useMouse } from '@vueuse/core'
import { useUtilStore } from '../store/utilStore.ts'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import dicpanel from '../components/exam/dicpanel.vue'
const paperStore = usepaperStore()
const utilStore = useUtilStore()
const { id, recordId = '0412' } = defineProps<{ id: string, recordId?: string }>()
const tab = ref()
const tabwidth = useElementSize(tab).width
const router = useRouter()
//计时器
const selectedtab = ref('writing')
const selectedindex = ref(0)
const { loading, data, send } = useRequest(getAllQuestionsBypaperIdSplitByPart(id))
const { loading: answerload, data: answerdata } = useRequest(getAnswersByPaperId(id)).onSuccess(e => {
    paperStore.setCurrentPaper(id, answerdata.value.answers)
})
const cards = {
    'writing': WritingCard,
    'listening': rlisteningCard,
    'reading': rreadingCard,
    'cloze': rreadingCard,
    'translation': TranslationCard

}

const changeTab = (card, index: number) => {
    selectedtab.value = card;
    selectedindex.value = index;
}
onBeforeUnmount(() => {
    // 清理paperstore数据
    delete paperStore.papersData[parseInt(id)]
})

// 鼠标查词功能
const { x, y } = useMouse({ type: 'client' });
const { element } = useElementByPoint({ x, y })
const worddom = ref()
const dicpanelref = ref() //查词弹窗
const word = ref('')
useEventListener(element, 'click', (e) => {
    getword(element.value)
}, { passive: true, capture: true })


const getword = (element) => {
    try {
        if (utilStore.dictionaryMode) {
            if (element.tagname !== 'SPAN') {
                worddom.value = element.closest('span.wordactive');
                word.value = worddom.value.textContent;
            }
            if (element.matches('span.wordactive')) {
                worddom.value = element;
                word.value = worddom.value.textContent;
            }
        }
    } catch (error) {
        // donothing
    }
}

const { floatingStyles } = useFloating(worddom, dicpanelref, {
    whileElementsMounted: autoUpdate,
    middleware: [flip(), shift({ padding: 10 }), offset(6)]
})

onClickOutside(dicpanelref, () => {
    word.value = ''
}
)

</script>

<template>
    <div class="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />


        <div class="drawer-content dark:bg-base-200">
            <div class=" navbar  border-1 border-base-300 shadow-sm flex justify-between">
                <div class="navbar-start hidden lg:flex">
                    <span class="text-xl mx-2 cursor-pointer" @click="router.push('/')">One Practice</span>
                </div>
                <div class="navbar-center">
                    <span class="font-bold">REVIEW</span>
                </div>
                <div class="navbar-end flex gap-3">
                    <div>
                        <span class="text-sm mr-2">查词</span>
                        <input type="checkbox" checked="checked" class="toggle toggle-accent"
                            v-model="utilStore.dictionaryMode" />
                    </div>
                    <label for="my-drawer-4" class="drawer-button btn btn-primary">Answers</label>
                </div>
            </div>

            <div class="middle px-6 ">
                <div class="mt-8 mb-4">
                    <div role="tablist" class="tabs tabs-box"
                        :style="`width: ${data?.questionParts.length * (tabwidth + 36)}px`">
                        <div ref="tab" :class="{ 'tab-active': selectedtab === Part.questions[0].questionType }"
                            role="tab" class="tab w-20 lg:w-25 h-12" v-for="(Part, index) in data?.questionParts"
                            :key="index" @click="changeTab(Part.questions[0].questionType, index)">{{
                                Part.questions[0].partName }}</div>
                    </div>
                </div>
                <div class="w-full  mb-4">
                    <KeepAlive>
                        <component :is="cards[selectedtab]" :data="data?.questionParts[selectedindex]">
                        </component>
                    </KeepAlive>
                </div>
            </div>
            <footer class="sticky bottom-0 w-full z-1">
                <footer
                    class="footer flex justify-between footer-horizontal bg-base-200 text-neutral-content items-center p-4 border dark:border-base-100">
                    <aside class="grid-flow-col items-center">
                        <div class="btn btn-sm lg:btn-md" v-show="selectedindex > 0"
                            @click="changeTab(data?.questionParts[selectedindex - 1].questions[0].questionType, selectedindex - 1)">
                            Previous Section</div>
                        <div class="btn btn-sm lg:btn-md" v-show="selectedindex < data?.questionParts.length - 1"
                            @click="changeTab(data?.questionParts[selectedindex + 1].questions[0].questionType, selectedindex + 1)">
                            Next Section</div>
                    </aside>
                    <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                        <div class="btn btn-primary btn-sm lg:btn-md" @click="router.push('/')">
                            Return Home
                        </div>
                    </nav>
                </footer>
            </footer>
        </div>
        <!-- 答案侧边栏 -->
        <div class="drawer-side z-2">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>

            <div class="bg-white dark:bg-base-100 text-gray-800 min-h-full w-64 lg:w-80 flex flex-col shadow-lg">
                <!-- 侧边栏标题 -->
                <div class="p-5 border-b border-gray-100">
                    <h2 class="text-lg font-medium text-base-content">Answer Sheet</h2>
                    <div class="flex justify-between">
                        <p class="text-xs text-gray-500 mt-1">Track your progress</p>
                    </div>
                </div>

                <!-- 答案网格 -->
                <div class="p-5 flex-1 overflow-y-auto">
                    <div class="grid grid-cols-4 lg:grid-cols-5 gap-3">
                        <div v-for="answer in answerdata?.answers" :key="answer.index" class="relative group">
                            <div class="flex flex-col items-center" :class="{
                                'opacity-40': !answer.answer,
                                'has-answer': answer.answer
                            }">
                                <!-- 答案卡片 -->
                                <div class="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm group-hover:shadow-md"
                                    :class="[
                                        answer.answer ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 border border-gray-200',
                                        answer.answer === paperStore.currentUserAnswers[answer.index] ? 'bg-green-50 text-green-600 border border-green-200' : '',
                                        answer.answer != paperStore.currentUserAnswers[answer.index] && paperStore.currentUserAnswers[answer.index] ? 'bg-red-50 text-red-600 border border-red-200' : ''
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
                <div class="p-5 border-t border-gray-100 bg-gray-50 dark:bg-base-200">
                    <div class="flex justify-between items-center">
                        <div class="text-sm">
                            <span class="font-medium text-base-content">{{
                                Object.keys(paperStore.currentUserAnswers).length }}/
                                {{ answerdata?.answers.length }}
                                answered
                            </span>
                        </div>
                    </div>

                    <!-- 进度条 -->
                    <div class="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full transition-all duration-500"
                            :style="{ width: `${(Object.keys(paperStore.currentUserAnswers).length / answerdata?.answers.length) * 100}%` }">
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <dicpanel v-show="word" :word="word" id="tooltip" class="" role="tooltip" ref="dicpanelref" :style="floatingStyles">
    </dicpanel>
</template>

<style scoped></style>