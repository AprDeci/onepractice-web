<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ChevronDownIcon } from 'lucide-vue-next'
import type { QuestionsDO } from '../../interface/Question'
import { usepaperStore } from '../../store/paperStore.ts';
import { wrapWordsWithSpan } from '../../common/utils';
const paperSotre = usepaperStore()
const { question } = defineProps<{
    question: QuestionsDO
}>()

// State for selections
const selections = ref<Record<number, string>>({})
const currentItem = ref<number | null>(null)
// 当前正在选择题号
const highlightedParagraph = ref<string | null>(null)
const searchText = ref('')
const questionJsoncontent = computed(() => {
    return JSON.parse(question.content)
})
// Toggle dropdown for an item
const toggleDropdown = (itemId: number) => {
    if (currentItem.value === itemId) {
        currentItem.value = null
        highlightedParagraph.value = null
    } else {
        currentItem.value = itemId
        highlightedParagraph.value = selections.value[itemId] || null
    }
}




// Check if a paragraph is selected for any item
const isParagraphSelected = (paragraphKey: string) => {
    return Object.values(selections.value).includes(paragraphKey)
}



// Get all items that selected a specific paragraph
const getParagraphSelections = (paragraphKey: string) => {
    return Object.entries(selections.value)
        .filter(([_, selectedParagraph]) => selectedParagraph === paragraphKey)
        .map(([itemId, _]) => Number(itemId))
}


// Highlight search text in paragraphs
const highlightSearchText = (text: string) => {
    if (!searchText.value) return text

    const regex = new RegExp(`(${searchText.value})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>')
}

// Watch for changes in currentItem to update highlighted paragraph
watch(currentItem, (newValue) => {
    if (newValue === null) {
        highlightedParagraph.value = null
    } else {
        highlightedParagraph.value = selections.value[newValue] || null
    }
})
onMounted(() => {
    const firstIndex = question.matchingData[0].id
    // 初始化已经选择的答案
    for (let i = 0; i < question.matchingData.length; i++) {
        selections.value[firstIndex + i] = paperSotre.getUserAnswer(firstIndex + i)
    }
})
</script>


<template>

    <div class="max-w-6xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-base-content mb-4">Paragraph Matching</h2>
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-700 font-medium">Match each statement with the correct paragraph from the
                article.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <!-- 左面板 -->
            <div class="lg:col-span-3 order-1 lg:order-1">
                <h3 class="text-xl font-bold mb-4">{{ questionJsoncontent.title }}</h3>
                <div class="sticky top-4">
                    <div class="colheightcontainer space-y-4  overflow-y-auto pr-2 article-container">
                        <div v-for="(paragraph, key) in questionJsoncontent.paragraphs" :key="key"
                            class="p-2 lg:p-4 rounded-lg transition-all duration-200 " :class="{
                                'bg-white dark:bg-gray-800  border shadow-sm': true,
                                'border-blue-300 bg-blue-50': highlightedParagraph === key,
                                'border-blue-300 bg-blue-50': isParagraphSelected(key)
                            }">
                            <div class="flex items-start">
                                <span
                                    class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 font-bold text-sm mr-2 lg:mr-3 mt-1 flex-shrink-0"
                                    :class="{
                                        'bg-blue-200': highlightedParagraph === key,
                                        'bg-blue-200': isParagraphSelected(key)
                                    }">
                                    {{ key }}
                                </span>
                                <p class="text-gray-700 dark:text-base-content leading-relaxed"
                                    v-html="wrapWordsWithSpan(paragraph)"></p>
                            </div>

                            <div v-if="isParagraphSelected(key)" class="mt-3 pl-9">
                                <div v-for="itemId in getParagraphSelections(key)" :key="itemId" :class="{
                                    'bg-red-50 text-red-400': !paperSotre.currentAnswerStatus[itemId],
                                    'bg-green-50 text-green-400': paperSotre.currentAnswerStatus[itemId]
                                }"
                                    class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded mr-2 lg:mr-3 mb-2">

                                    Question {{ itemId }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右面板-->
            <div class="lg:col-span-2 order-2 lg:order-2">
                <div class="sticky top-4">
                    <h3 class="text-lg font-bold mb-4">Statements</h3>
                    <div class="colheightcontainer space-y-4  overflow-y-auto">
                        <div v-for="item in question.matchingData" :key="item.id"
                            class="p-2 lg:p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-sm" :class="{
                                'border-green-300': currentItem === item.id,
                                'border-red-300 bg-blue-50 border-2': selections[item.id] && !paperSotre.currentAnswerStatus[item.id],
                                'border-green-300 bg-blue-50 border-2': selections[item.id] && paperSotre.currentAnswerStatus[item.id]
                            }">
                            <div class="flex items-start mb-3">
                                <span
                                    class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 font-bold text-sm mr-2 flex-shrink-0">
                                    {{ item.id }}
                                </span>
                                <p class="text-gray-700 dark:text-base-content"
                                    v-html="wrapWordsWithSpan(item.content)"></p>
                            </div>

                            <div class="pl-9">
                                <div class="flex items-center">
                                    <span class="text-sm text-gray-500 mr-2">Select paragraph:</span>
                                    <div class="relative">
                                        <button @click="toggleDropdown(item.id)"
                                            class="inline-flex items-center justify-between w-24 px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700"
                                            :class="{
                                                'border-blue-300 ring-2 ring-blue-100': currentItem === item.id,

                                                'border-blue-300 bg-blue-50': selections[item.id]
                                            }">
                                            <span>{{ selections[item.id] || 'Select' }}</span>
                                            <ChevronDownIcon class="h-4 w-4 ml-1" />
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.article-container {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

.article-container::-webkit-scrollbar {
    width: 6px;
}

.article-container::-webkit-scrollbar-track {
    background: #f7fafc;
}

.article-container::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
}



.colheightcontainer {
    max-height: 80vh;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

.colheightcontainer::-webkit-scrollbar {
    width: 6px;
}

.colheightcontainer::-webkit-scrollbar-track {
    background: #f7fafc;
}

.colheightcontainer::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
}
</style>
