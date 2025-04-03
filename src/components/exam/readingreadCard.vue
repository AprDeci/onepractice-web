<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import type { QuestionsDO } from '../../interface/Question'
import { useElementSize } from '@vueuse/core';
import { usepaperStore } from '../../store/paperStore';


const paperStore = usepaperStore()

const { question } = defineProps<{
    question: QuestionsDO
}>()

const leftpart = ref()
const { width, height } = useElementSize(leftpart)


interface Option {
    label: string
    content: string
}

interface Question {
    content: string
    options: Option[]
    questionNumber: number
}


// Format passage into paragraphs
const formattedPassage = computed(() => {
    return question.content.split(/\r\n\r\n|\n\n/)
})


// Transform the flat options array into grouped questions
const questions = computed(() => {
    const result: Question[] = []
    const splitQuestions = question.readingSplitQuestion
    const allOptions = question.options

    // 起始编号
    const startingQuestionNumber = question.correctAnswer[0].index

    // Group options into sets of 4 for each question
    for (let i = 0; i < splitQuestions.length; i++) {
        const questionOptions = allOptions.slice(i * 4, (i + 1) * 4)

        result.push({
            content: splitQuestions[i],
            options: questionOptions,
            questionNumber: startingQuestionNumber + i
        })
    }

    return result
})

// State for selected answers
const selectedAnswers = ref<Record<number, string>>({})

// Current question being viewed
const currentQuestionIndex = ref<number>(0)


// Get the question number for display
const getQuestionNumber = (index: number) => {
    return questions.value[index].questionNumber
}

// Select an answer
const selectAnswer = (questionIndex: number, optionLabel: string, answerIndex: number) => {
    paperStore.updateCurrentUserAnswer(answerIndex, optionLabel)
    selectedAnswers.value[questionIndex] = optionLabel
}

// Scroll to a specific question
const scrollToQuestion = (questionIndex: number) => {
    currentQuestionIndex.value = questionIndex
    const element = document.getElementById(`question-${questionIndex}`)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}


// Scroll to first question on mount
onMounted(() => {
    // Initialize with the first question
    currentQuestionIndex.value = 0

    // 初始化答案
    const firstIndex = getQuestionNumber(0);

    for (let i = 0; i < questions.value.length; i++) {
        selectedAnswers.value[i] = paperStore.getUserAnswer(i + firstIndex)
    }

})
</script>


<template>
    <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ question.partName }}: {{ question.sectionName }}
        </h2>
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-700 font-medium">Read the passage carefully and answer the questions that
                follow.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Reading passage section (7 columns on large screens) -->
            <div class="lg:col-span-7 order-1">
                <div class="" ref="leftpart">
                    <div class="bg-gray-50 p-6 rounded-lg mb-4">
                        <div class="prose prose-sm max-w-none">
                            <div v-for="(paragraph, index) in formattedPassage" :key="`p-${index}`" class="mb-4">
                                <p class="leading-relaxed text-gray-800">{{ paragraph }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg hidden lg:block">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Your Progress</h4>
                        <div class="flex space-x-2">
                            <button v-for="(_, index) in questions" :key="`nav-${index}`"
                                @click="scrollToQuestion(index)"
                                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                                :class="{
                                    'bg-green-100 text-green-800': selectedAnswers[index] !== undefined,
                                    'bg-gray-200 text-gray-600 hover:bg-gray-300': selectedAnswers[index] === undefined,
                                    'ring-2 ring-blue-400': currentQuestionIndex === index
                                }">
                                {{ getQuestionNumber(index) }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Questions section (5 columns on large screens) -->
            <div class="lg:col-span-5 order-2 overflow-y-scroll" :style="{ height: `${height}px` }">
                <div class="space-y-8">
                    <div v-for="(question, index) in questions" :key="`q-${index}`" :id="`question-${index}`"
                        class="bg-white border rounded-lg shadow-sm p-6"
                        :class="{ 'border-blue-300': currentQuestionIndex === index }"
                        @mouseenter="currentQuestionIndex = index">
                        <div class="flex items-start mb-4">
                            <span
                                class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 font-bold text-sm mr-3 flex-shrink-0">
                                {{ getQuestionNumber(index) }}
                            </span>
                            <h4 class="text-lg font-medium text-gray-800">{{ question.content }}</h4>
                        </div>

                        <div class="space-y-3 pl-9">
                            <div v-for="option in question.options" :key="`${index}-${option.label}`"
                                @click="selectAnswer(index, option.label, getQuestionNumber(index))"
                                class="flex items-start p-3 rounded-md cursor-pointer transition-colors" :class="{
                                    'bg-blue-50 border border-blue-200': selectedAnswers[index] === option.label,
                                    'hover:bg-gray-50 border border-transparent': selectedAnswers[index] !== option.label
                                }">
                                <div class="flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 flex-shrink-0"
                                    :class="{
                                        'border-blue-500 bg-blue-500 text-white': selectedAnswers[index] === option.label,
                                        'border-gray-300': selectedAnswers[index] !== option.label
                                    }">
                                    <span class="text-sm font-bold">{{ option.label }}</span>
                                </div>
                                <p class="text-gray-700">{{ option.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>
</template>


<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f7fafc;
}

::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
}

/* Add padding at the bottom on mobile to account for the navigation bar */
@media (max-width: 1024px) {
    .space-y-8 {
        padding-bottom: 70px;
    }
}
</style>