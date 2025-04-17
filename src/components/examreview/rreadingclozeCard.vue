<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import type { QuestionsDO } from '../../interface/Question'
import { usepaperStore } from '../../store/paperStore.ts'
import { wrapWordsWithSpan } from '../../common/utils';
const paperStore = usepaperStore()
const { question } = defineProps<{
    question: QuestionsDO
}>()
const selectedBlankNumber = ref<number | null>(null); // Current blank number
const selectedWords = ref<Record<number, string>>({}); // User's answers

const blankRefs = ref<Record<number, HTMLElement | null>>({})




// 生成html
const contentParsed = computed(() => {
    let content = wrapWordsWithSpan(question.content);
    content = content.replace(/_(\d+)_/g, (match, number) => {
        const blankNumber = parseInt(number);
        const word = selectedWords.value[blankNumber];
        if (word) {
            if (paperStore.currentAnswerStatus[blankNumber]) {
                return `<span class="dark:text-gray-200 inline-block relative border-b-2 border-green-400 px-1 mx-1 bg-green-50 dark:bg-green-400 dark:text-white cursor-pointer" data-blank="${blankNumber}">
          <span class=" blank-number relative  transform -translate-x-1/2 text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">${blankNumber}</span>
          ${word}
          <span class="absolute inset-0" data-blank="${blankNumber}"></span>
        </span>`
            } else {
                return `<span class="dark:text-gray-200 inline-block relative border-b-2 border-red-400 px-1 mx-1 bg-red-50 dark:bg-red-400 dark:text-white cursor-pointer" data-blank="${blankNumber}">
          <span class=" blank-number relative  transform -translate-x-1/2 text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">${blankNumber}</span>
          ${word}
          <span class="absolute inset-0" data-blank="${blankNumber}"></span>
        </span>`
            }
        } else {
            return `<span class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer" data-blank="${blankNumber}">
          <span class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">${blankNumber}</span>
          ________
          <span class="absolute inset-0" data-blank="${blankNumber}"></span>
        </span>`;
        }

    });
    return content;
})






const isWordUsed = (word: string): boolean => {
    return Object.values(selectedWords.value).includes(word);
}

const getCurrentWord = computed(() => {
    if (selectedBlankNumber.value === null) return null;
    return selectedWords.value[selectedBlankNumber.value];
})

onMounted(() => {
    // Find all blank elements and store references
    const blankElements = document.querySelectorAll('[data-blank]');
    blankElements.forEach((el) => {
        const blankNumber = parseInt(el.getAttribute('data-blank') || '0');
        if (blankNumber) {
            blankRefs.value[blankNumber] = el as HTMLElement;
        }
    });
    // 刷新后初始化答案 
    const firstindex: number = parseInt(Object.keys(blankRefs.value)[0]);
    for (let i = 0; i < Object.keys(blankRefs.value).length; i++) {
        const blanknum = firstindex + i;
        const label = paperStore.getUserAnswer(blanknum);
        if (label === undefined) continue
        const wordindex = label.charCodeAt() - 65;
        selectedWords.value[blanknum] = question.wordBank[wordindex];
    }
})
</script>

<template>
    <div class="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold bg-text-content mb-4">Fill in the blanks</h2>
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-700 font-medium">Choose the correct word from the word bank to complete each
                blank.</p>
        </div>

        <!-- Reading passage with blanks -->
        <div class="prose prose-lg max-w-none mb-8 relative">
            <div class="text-base-content leading-relaxed text-gray-800 dark:text-base-content" v-html="contentParsed">
            </div>
        </div>

        <!-- Word bank display -->
        <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-700 dark:text-base-content mb-3">Word Bank:</h3>
            <div class="flex flex-wrap gap-2">
                <span v-for="(word, index) in question.wordBank" :key="word"
                    class="px-3 py-1.5 rounded-full text-sm font-medium " :class="{
                        'bg-gray-100 dark:bg-blue-950': !isWordUsed(word),
                        'bg-gray-300 dark:bg-blue-950 line-through': isWordUsed(word) && word !== getCurrentWord
                    }">
                    {{ word }}
                </span>
            </div>
        </div>


    </div>
</template>

<style scoped>
:deep(.prose) {
    color: #374151;
    line-height: 1.8;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

[ref="answerCard"] {
    animation: fadeIn 0.2s ease-out;
}

.answer-card-above .absolute.w-4.h-4 {
    bottom: auto;
    top: 100%;
    margin-top: -2px;
    border-bottom: 1px solid #e5e7eb;
    border-right: 1px solid #e5e7eb;
    border-top: none;
    border-left: none;
}
</style>