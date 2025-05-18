<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed, onBeforeMount } from 'vue'
import { Timer } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import WritingCard from '../components/exam/writingCard.vue'
import ListeningCard from '../components/exam/listeningCard.vue'
import readingCard from '../components/exam/readingCard.vue'
import TranslationCard from '../components/exam/TranslationCard.vue'
import { getAllQuestionsBypaperIdSplitByPart, getAnswersByPaperId } from '../request/methods/question'
import { useRequest } from 'alova/client'
import { usepaperStore } from '../store/paperStore.ts'
import { saveRecord, updateRecord } from '../request/methods/record.ts'
import { motion, AnimatePresence } from 'motion-v'
import { Times } from '../common/examMode.ts'
import { useElementSize, useElementByPoint, useMouse, useEventListener, onClickOutside, useTextSelection } from '@vueuse/core'
import { userecordStore } from '../store/recordStore.ts'
import { useUtilStore } from '../store/utilStore.ts'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { useAlert } from '../common/alert';
import dicpanel from '../components/exam/dicpanel.vue'
import SelectPanel from '../components/exam/selectPanel.vue'
const utilStore = useUtilStore()
const paperStore = usepaperStore()
const recordStore = userecordStore()
const { showAlert: showerrormessage } = useAlert()
const { id, mode, recordId } = defineProps<{
    id: string,
    mode: string
    recordId?: string
}>()

const tab = ref()
const tabwidth = useElementSize(tab).width
const showBlur = ref(true)
const router = useRouter()
const initialRecord = ref(false)
//计时器
const seconds = ref(60)
const selectedtab = ref('writing')
const selectedindex = ref(0)
const { loading, data, send } = useRequest(getAllQuestionsBypaperIdSplitByPart(id))
const { loading: answerload, data: answerdata } = useRequest(getAnswersByPaperId(id)).onSuccess(e => {
    paperStore.setCurrentPaper(id, answerdata.value.answers)
})
// 初始化records
onBeforeMount(() => {
    // 如果非continue 初始化 
    if (!recordId) {
        // init:若record(id)有值 则修改时间 若无值 初始化
        recordStore.initRecord(parseInt(id))
    } else {
        // 如果continue 在历史界面设置record
        recordStore.setRecordLasttime(parseInt(id), Date.now())
    }
    initialRecord.value = true
    const hasspendtime = recordStore.records[parseInt(id)]?.hasspendtime
    // 如果有记录(有时间)
    if (hasspendtime != 0) {
        seconds.value = Times[paperStore.currentPaperType] * 60 - hasspendtime / 1000
    } else {
        seconds.value = Times[paperStore.currentPaperType] * 60 | 125
    }
})

onBeforeUnmount(() => {
    // 销毁前更新record数据 更新时间
    if (recordStore.records[parseInt(id)]) {
        recordStore.updateRecord(parseInt(id))
    }
})

const showAlert = ref(false)

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
    // 没做题不让提交
    if (paperStore.currentUserAnswersLength === 0) {
        router.push({ name: 'examResult' });
        return ''
    }
    // 更新时间记录
    recordStore.updateRecord(parseInt(id))
    if (recordId || recordStore.currentRecordId != 0) {
        if (recordId) { //优先recordId
            await updateRecord(recordId, paperStore.currentPaperId, mode, paperStore.currentUserAnswersLength === paperStore.currentCorrectAnswersLength ? 1 : 0, JSON.stringify(paperStore.currentUserAnswers), paperStore.currentScore, Object.keys(paperStore.currentCorrectAnswers).length, 0, recordStore.currentHasspendtime);
        } else {
            await updateRecord(recordStore.currentRecordId, paperStore.currentPaperId, mode, paperStore.currentUserAnswersLength === paperStore.currentCorrectAnswersLength ? 1 : 0, JSON.stringify(paperStore.currentUserAnswers), paperStore.currentScore, Object.keys(paperStore.currentCorrectAnswers).length, 0, recordStore.currentHasspendtime);
        }
        // 清理recordStore
    } else {
        const data = await saveRecord(paperStore.currentPaperId, mode, paperStore.currentUserAnswersLength === paperStore.currentCorrectAnswersLength ? 1 : 0, JSON.stringify(paperStore.currentUserAnswers), paperStore.currentScore, Object.keys(paperStore.currentCorrectAnswers).length, 0, recordStore.currentHasspendtime);
        // 将对应record的recordId保存到recordStore中
        recordStore.setRecordId(parseInt(id), data)
    }
    router.push({ name: 'examResult' });

}

const counterzero = () => {
    submit()
}


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


// 标记功能
import { mark } from '../common/utils.ts'
const selected = useTextSelection()

// /选择面板
const markpanel = ref(null)
const selectreference = ref(null)
const showselectpanel = ref(false)
const { floatingStyles: selectfloatingStyles } = useFloating(selectreference, markpanel, {
    placement: 'bottom',
    middleware: [offset(10), flip(), shift()],
}
)

useEventListener(document, 'selectionchange', (evt) => {
    const selection = selected.selection.value
    if (selection?.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = selected.rects.value[0]
        selectreference.value = {
            getBoundingClientRect: () => ({
                width: rect.width,
                height: rect.height,
                x: rect.x,
                y: rect.y,
                top: rect.top,
                left: rect.left,
                right: rect.right,
                bottom: rect.bottom
            }),
            contextElement: range.startContainer.parentElement
        };
        showselectpanel.value = true
    } else {
        showselectpanel.value = false
    }
})

onClickOutside(markpanel.value, () => {
    showselectpanel.value = false
})



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
                    <Timer />
                    <CounterReverse v-if="mode === 'simulation'" @todo="counterzero" :seconds="seconds">
                    </CounterReverse>
                    <Counter v-if="mode === 'free'"></Counter>
                </div>
                <div class="navbar-end flex gap-1">
                    <ul class="menu menu-horizontal px-1">
                        <li>
                            <details>
                                <summary class="btn btn-accent">Option</summary>
                                <ul class="bg-base-100 rounded-t-none p-2 flex flex-col gap-2 z-2 min-w-full">
                                    <div class="flex flex-col gap-1 justify-center items-center">
                                        <span class="text-xs mr-2">查词</span>
                                        <input type="checkbox" checked="checked" class="toggle toggle-accent"
                                            v-model="utilStore.dictionaryMode" />
                                    </div>
                                    <div class="divider m-0 p-0"></div>
                                    <div class="flex flex-col gap-1 justify-center items-center">
                                        <span class="text-xs mr-2">批注颜色</span>
                                        <el-select v-model="utilStore.markcolor" class="w-50" placeholder="Pick color">
                                            <el-option v-for="item in utilStore.colors" :key="item.value"
                                                :label="item.label" :value="item.value">
                                                <div class="flex items-center">
                                                    <el-tag class="aspect-square" :color="item.color"
                                                        style="margin-right: 8px" size="small" />
                                                    <span :style="{ color: item.color }">{{ item.label }}</span>
                                                </div>
                                            </el-option>

                                            <template #label="{ value, }">
                                                <el-tag class="aspect-square" :key="value"
                                                    :color="'rgb(' + value + ')'"></el-tag>
                                            </template>
                                        </el-select>
                                    </div>
                                </ul>
                            </details>
                        </li>
                    </ul>
                    <div>


                    </div>
                    <label for="my-drawer-4" class="drawer-button btn btn-primary">Answers</label>
                </div>
            </div>

            <div class="middle px-6 mb-20">
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
            <footer class="fixed bottom-0 w-full z-1">
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
                        <div v-if="mode != 'free'" class="btn btn-primary btn-sm lg:btn-md"
                            @click="showAlert = !showAlert">
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
        <div class="drawer-side z-2">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>

            <div class="bg-white dark:bg-base-100 text-gray-800 min-h-full w-64 lg:w-80 flex flex-col shadow-lg">
                <!-- 侧边栏标题 -->
                <div class="p-5 border-b border-gray-100">
                    <h2 class="text-lg font-medium text-base-content">Answer Sheet</h2>
                    <div class="flex justify-between">
                        <p class="text-xs text-gray-500 mt-1">Track your progress</p>
                        <p class="text-xs text-blue-200 hover:text-blue-400 cursor-pointer"
                            @click="showBlur = !showBlur">View
                            All</p>
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
                                        answer.answer === paperStore.currentUserAnswers[answer.index] && mode === 'free' ? 'bg-green-50 text-green-600 border border-green-200' : '',
                                        answer.answer != paperStore.currentUserAnswers[answer.index] && mode === 'free' && paperStore.currentUserAnswers[answer.index] ? 'bg-red-50 text-red-600 border border-red-200' : ''
                                    ]">
                                    <span class="text-sm font-medium">{{ answer.answer || '?' }}</span>
                                    <!-- 遮罩层 -->
                                    <div v-if="mode === 'simulation' && showBlur"
                                        class="rounded-lg answerblur w-full h-full absolute backdrop-blur-sm hover:backdrop-blur-[0px]">
                                    </div>
                                </div>

                                <!-- 题号 -->
                                <span class="text-xs text-gray-500 mt-1.5" :class="[
                                    paperStore.currentUserAnswers[answer.index] ? 'text-xs text-gray-500 mt-1.5' : 'text-xs text-rose-400 mt-1.5'
                                ]">{{ answer.index }}</span>
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
                        <button class="text-xs text-gray-500 dark:text-gray-200 hover:text-red-500 transition-colors"
                            @click="cleanAnswer">
                            Clear all
                        </button>
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

    <SelectPanel @mark="mark(selected)" ref="markpanel" v-show="showselectpanel" :style="selectfloatingStyles">
    </SelectPanel>
</template>
<style scoped></style>