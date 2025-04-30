<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { onClickOutside, useWindowSize } from '@vueuse/core'
import { XIcon } from 'lucide-vue-next'
import type { QuestionsDO } from '../../interface/Question'
import { usepaperStore } from '../../store/paperStore.ts'
import { wrapWordsWithSpan } from '../../common/utils.ts'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
const paperStore = usepaperStore()
const { question } = defineProps<{
    question: QuestionsDO
}>()
const selectedBlankNumber = ref<number | null>(null); // Current blank number
const selectedWords = ref<Record<number, string>>({}); // User's answers

const blankRefs = ref<Record<number, HTMLElement | null>>({})
const { width, height } = useWindowSize();
const isCardVisible = ref(false);
const cardPosition = ref({ top: '0px', left: '0px' });

// Track if we should position the card above or below the blank
const positionAbove = ref(false);




// 生成html
const contentParsed = computed(() => {
    let content = wrapWordsWithSpan(question.content)
    content = content.replace(/_(\d+)_/g, (match, number) => {
        const blankNumber = parseInt(number);
        const word = selectedWords.value[blankNumber];

        return word
            ? `<span class="dark:text-gray-200 inline-block relative border-b-2 border-blue-400 px-1 mx-1 bg-blue-50 dark:bg-blue-300 dark:text-base-content cursor-pointer" data-blank="${blankNumber}">
          <span class=" blank-number relative  transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">${blankNumber}</span>
          ${word}
          <span class="absolute inset-0" data-blank="${blankNumber}"></span>
        </span>`
            : `<span class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer" data-blank="${blankNumber}">
          <span class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">${blankNumber}</span>
          ________
          <span class="absolute inset-0" data-blank="${blankNumber}"></span>
        </span>`;
    });
    return content;
})
// 选择答案面板弹出
const blank = ref(null)
const answerCard = ref(null)
const { floatingStyles } = useFloating(blank, answerCard, {
    middleware: [offset(0), flip(), shift()],
}
)
onClickOutside(answerCard, () => {
    if (isCardVisible.value) {
        isCardVisible.value = false;
    }
})


const handleContentClick = (e: MouseEvent) => {
    blank.value = e.target as HTMLElement;
    let blankNumber: number | null = null;

    while (blank.value && !blankNumber) {
        const attr = blank.value.getAttribute('data-blank');
        if (attr) {
            blankNumber = parseInt(attr);
            break;
        }
        blank.value = blank.value.parentElement as HTMLElement;
    }

    if (blankNumber) {
        selectedBlankNumber.value = blankNumber;
        isCardVisible.value = true;
    }


}


// Save the selected answer
const saveAnswer = (word: string, index: number) => {
    if (selectedBlankNumber.value !== null) {
        paperStore.updateUserAnswer(selectedBlankNumber.value, String.fromCharCode(65 + index));
        selectedWords.value[selectedBlankNumber.value] = word;
        isCardVisible.value = false;
    }
}

// Close the answer card
const closeAnswerCard = () => {
    isCardVisible.value = false;
}

// Check if a word is already used in another blank
const isWordUsed = (word: string): boolean => {
    return Object.values(selectedWords.value).includes(word);
}

// Get the current word for the selected blank
const getCurrentWord = computed(() => {
    if (selectedBlankNumber.value === null) return null;
    return selectedWords.value[selectedBlankNumber.value];
})

// After component mounts, collect references to all blanks
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
            <div class="text-base-content leading-relaxed text-gray-800 dark:text-base-content"
                @click="handleContentClick" v-html="contentParsed"></div>
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

        <!-- 答案卡片 -->
        <div v-if="isCardVisible" ref="answerCard" :style="floatingStyles"
            class="fixed z-50 bg-white dark:bg-base-200 rounded-lg shadow-xl border border-gray-200 w-80">
            <!-- Card header -->
            <div class=" flex justify-between items-center p-3 border-b bg-gray-50 dark:bg-base-300 rounded-t-lg">
                <h4 class="font-medium text-gray-700 dark:text-gray-400">
                    Select word for blank {{ selectedBlankNumber }}
                </h4>
                <button @click="closeAnswerCard" class="text-gray-500 hover:text-gray-700">
                    <XIcon class="h-4 w-4" />
                </button>
            </div>

            <!-- 答案卡片-->
            <div class="p-3">
                <div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    <button v-for="(word, index) in question.wordBank" :key="word" @click="saveAnswer(word, index)"
                        class="px-3 py-2 text-left text-sm rounded transition-colors flex items-center" :class="{
                            'bg-blue-100 font-medium': word === getCurrentWord,
                            'hover:bg-blue-50': !isWordUsed(word) || word === getCurrentWord,
                            'text-gray-400': isWordUsed(word) && word !== getCurrentWord,
                            'cursor-not-allowed': isWordUsed(word) && word !== getCurrentWord
                        }" :disabled="isWordUsed(word) && word !== getCurrentWord">
                        <span
                            class="inline-block text-center w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-900 text-xs flex items-center justify-center mr-2">
                            {{ String.fromCharCode(65 + index) }}
                        </span>
                        {{ word }}
                    </button>
                </div>

                <div v-if="getCurrentWord" class="mt-3 pt-3 border-t">
                    <button @click="saveAnswer('')"
                        class="w-full px-3 py-2 text-left text-sm text-red-500 rounded hover:bg-red-50 transition-colors">
                        Clear selection
                    </button>
                </div>
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