<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import questionData from "../../assets/example/read.json"
interface Option {
    label: string
    content: string
}

interface Question {
    content: string
    options: Option[]
    question_id: number
}

interface ReadingComprehensionData {
    content: string
    questions: Question[]
}


// Format passage into paragraphs
const formattedPassage = computed(() => {
    return questionData.content.split('/n')
})

// Get questions
const questions = computed(() => {
    return questionData.questions
})

// State for selected answers
const selectedAnswers = ref<Record<number, string>>({})

// Current question being viewed
const currentQuestion = ref<number>(questions.value[0].question_id)




// Select an answer
const selectAnswer = (questionId: number, optionLabel: string) => {
    selectedAnswers.value[questionId] = optionLabel
}

// Scroll to a specific question
const scrollToQuestion = (questionId: number) => {
    currentQuestion.value = questionId
    const element = document.getElementById(`question-${questionId}`)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}



// Scroll to first question on mount
onMounted(() => {
    // Initialize with the first question
    currentQuestion.value = questions.value[0].question_id
})
</script>
<template>
    <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Reading Comprehension</h2>
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-700 font-medium">Read the passage carefully and answer the questions that
                follow.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- 文章部分 -->
            <div class="lg:col-span-7 order-1">
                <div class="sticky top-4">
                    <div class="bg-gray-50 p-6 rounded-lg mb-4">
                        <h3 class="text-lg font-semibold mb-4">Passage</h3>
                        <div class="prose prose-sm max-w-none">
                            <div v-for="(paragraph, index) in formattedPassage" :key="`p-${index}`" class="mb-4">
                                <p class="leading-relaxed text-gray-800">{{ paragraph }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg hidden lg:block">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Your Progress</h4>
                        <div class="flex space-x-2">
                            <button v-for="question in questions" :key="`nav-${question.question_id}`"
                                @click="scrollToQuestion(question.question_id)"
                                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                                :class="{
                                    'bg-green-100 text-green-800': selectedAnswers[question.question_id],
                                    'bg-gray-200 text-gray-600 hover:bg-gray-300': !selectedAnswers[question.question_id],
                                    'ring-2 ring-blue-400': currentQuestion === question.question_id
                                }">
                                {{ question.question_id }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 选项部分 -->
            <div class="lg:col-span-5 order-2">
                <div class="space-y-8">
                    <div v-for="question in questions" :key="`q-${question.question_id}`"
                        :id="`question-${question.question_id}`"
                        class="bg-white border rounded-lg shadow-sm py-3 px-2 lg:p-6"
                        :class="{ 'border-blue-300': currentQuestion === question.question_id }"
                        @mouseenter="currentQuestion = question.question_id">
                        <div class="flex items-start mb-4">
                            <span
                                class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 font-bold text-sm mr-3 flex-shrink-0">
                                {{ question.question_id }}
                            </span>
                            <h4 class="text-lg font-medium text-gray-800">{{ question.content }}</h4>
                        </div>

                        <div class="space-y-3 lg:pl-9">
                            <div v-for="option in question.options" :key="`${question.question_id}-${option.label}`"
                                @click="selectAnswer(question.question_id, option.label)"
                                class="flex items-start p-3 rounded-md cursor-pointer transition-colors" :class="{
                                    'bg-blue-50 border border-blue-200': selectedAnswers[question.question_id] === option.label,
                                    'hover:bg-gray-50 border border-transparent': selectedAnswers[question.question_id] !== option.label
                                }">
                                <div class="flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 flex-shrink-0"
                                    :class="{
                                        'border-blue-500 bg-blue-500 text-white': selectedAnswers[question.question_id] === option.label,
                                        'border-gray-300': selectedAnswers[question.question_id] !== option.label
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