<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import type { QuestionsDO } from '../../interface/Question'

const { question } = defineProps<{
    question: QuestionsDO
}>()

interface Option {
    label: string
    content: string
}

interface Question {
    content: string
    options: Option[]
    questionNumber: number
}

interface ReadingQuestionData {
    questionId: number
    paperId: number
    partName: string
    sectionName: string
    questionType: string
    questionOrder: number
    content: string
    correctAnswer: string
    readingSplitQuestion: string[]
    options: Option[]
    wordBank: null
    matchingData: null
}

// Sample question data - in a real app, this would be passed as a prop
const questionData = ref<ReadingQuestionData>({
    "questionId": 15,
    "paperId": 1,
    "partName": "Part III",
    "sectionName": "Section C",
    "questionType": "reading",
    "questionOrder": 3,
    "content": "Passage One: The weakening of the human connection to nature might be good for economic growth but is bad for people. A tipping point was reached in 2020 when human-made materials—such as steel, concrete and plastic—were found to weigh more than all life on Earth. Continuing to grow concrete forests rather than real ones is shortsighted. Simply being in the nearest wood has such health benefits that the Woodland Trust successfully lobbied for it to be prescribed by doctors.\r\n\r\nYet slipping from popular culture is the wonder and beauty of the natural world. For every three nature-related words in hit songs of the 1950s, researchers found, there was only slightly more than one 50 years later. It is not a moment too soon that teenagers will be able to take a natural history test, given that for decades children have been able to name more video game characters than wildlife species.\r\n\r\nPart of remedying this social disease would be for parliament to pass a \"right to grow\" law, allowing anyone to turn underused public spaces into vegetable and fruit gardens. The idea is for people to get back in touch with the soil—while producing food sustainably.\r\n\r\nVegetable planting has a respectable tradition. In April 1649, locals responded to high prices and food shortages by cultivating vegetables on common land in Southern England. The practice of throwing seed bombs to turn vacant plots of land green took off in 1970s New York, and has been revived (使复活) by green-thumbed (有园艺才能的) social media influencers who defy local US regulations in a war on ugly spots in cities.\r\n\r\nApart from the urgent task of providing more healthy nutrients to those who increasingly can't afford them, publicly accessible fruit and vegetable gardens connect what we eat to where it comes from—the means of production, if you will. They can make unlovely spaces lovely, and marry use and beauty as well as help promote a sense of community. Plants are also, of course, our first defence against species loss and climate change. Such planting is a small step for humanity—in the right direction.",
    "correctAnswer": "46.C 47.A 48.B 49.C 50.D",
    "readingSplitQuestion": [
        "What does the author want to emphasise in the first paragraph?",
        "What did researchers find about popular culture?",
        "What does the author propose people do?",
        "What do we learn from the passage about vegetable planting?",
        "What can publicly accessible fruit and vegetable gardens do apart from their practical functions?"
    ],
    "options": [
        {
            "label": "A",
            "content": "The year 2020 was a big turning point in human history."
        },
        {
            "label": "B",
            "content": "Economic growth benefits people little in the long run."
        },
        {
            "label": "C",
            "content": "It is unwise to weaken the human connection to nature."
        },
        {
            "label": "D",
            "content": "It is harmful to mankind to use human-made materials."
        },
        {
            "label": "A",
            "content": "It is increasingly detached from the natural world."
        },
        {
            "label": "B",
            "content": "It is filled with all kinds of video game characters."
        },
        {
            "label": "C",
            "content": "It is especially appealing to the taste of teenagers."
        },
        {
            "label": "D",
            "content": "It is still impacted by the hit songs of the 1950s."
        },
        {
            "label": "A",
            "content": "Take measures to ensure sustainable food development."
        },
        {
            "label": "B",
            "content": "Reconnect with nature through the right to grow."
        },
        {
            "label": "C",
            "content": "Stand by the parliament in fighting social diseases."
        },
        {
            "label": "D",
            "content": "Cover public spaces with fruit trees and vegetable plants."
        },
        {
            "label": "A",
            "content": "It all started in 1649 in Southern England."
        },
        {
            "label": "B",
            "content": "It is protected by US government regulations."
        },
        {
            "label": "C",
            "content": "It has long been used to increase food supply and improve urban landscape."
        },
        {
            "label": "D",
            "content": "It has been popularised worldwide with the increasing influence of social media."
        },
        {
            "label": "A",
            "content": "Raise people''s environmental awareness."
        },
        {
            "label": "B",
            "content": "Add to the great variety of plant species."
        },
        {
            "label": "C",
            "content": "Act as the first defence against natural disasters."
        },
        {
            "label": "D",
            "content": "Enhance people''s community spirit."
        }
    ],
    "wordBank": null,
    "matchingData": null
})

// Format passage into paragraphs
const formattedPassage = computed(() => {
    return question.content.split(/\r\n\r\n|\n\n/)
})


// Transform the flat options array into grouped questions
const questions = computed(() => {
    const result: Question[] = []
    const splitQuestions = question.readingSplitQuestion
    const allOptions = question.options

    // Extract the starting question number from the correctAnswer string
    const startingQuestionNumber = parseInt(question.correctAnswer.split('.')[0]) || 46

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
const selectAnswer = (questionIndex: number, optionLabel: string) => {
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

// Navigate between questions (for mobile)
const navigateQuestion = (direction: number) => {
    const newIndex = currentQuestionIndex.value + direction
    if (newIndex >= 0 && newIndex < questions.value.length) {
        scrollToQuestion(newIndex)
    }
}

// Scroll to first question on mount
onMounted(() => {
    // Initialize with the first question
    currentQuestionIndex.value = 0
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
                <div class="sticky top-4">
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
            <div class="lg:col-span-5 order-2">
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
                                @click="selectAnswer(index, option.label)"
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