<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { XIcon } from 'lucide-vue-next'

interface QuestionData {
  content: string
  wordbank: string[]
}

interface TextItem {
  type: 'text'
  content: string
}

interface BlankItem {
  type: 'blank'
  number: number
}

type ParagraphItem = TextItem | BlankItem

// Sample question data
const question = ref<QuestionData>({
  content: "When Toni Morrison died in 2019, the world lost one of its most influential authors. But Morrison was not an early success. Her first novel was not published until she was 39, and her last appeared when she was 84. And Morrison was not __26__ in this regard. Numerous writers produce masterpieces well into their 70s and beyond. Such __27__ accomplishments highlight an important point. Our capacity to speak, write and learn new vocabulary does not seem to __28__ with age. Our eyesight may dim and our recall may weaken, but, by comparison, our ability to produce and to __29__ language is well preserved into older adulthood. Indeed, the latest research that has emerged on language and aging shows that language mastery is a __30__ that we begin as infants and continue on for the rest of our lives. Some aspects of our language abilities, such as our knowledge of word meanings, __31__ improve during middle and late adulthood. One study, for example, found that adults over sixty had an average vocabulary size of over 21,000 words. The researchers also studied a __32__ of college students and found that their average vocabulary contained __33__ 16,000 words. In another study, older adults, with an average age of 75, __34__ better than participants in their youth or middle years on tasks that required them to determine the meaning of words. Thus, language seems to be a skill that, contrary to what many might __35__, does not weaken with age.",
  wordbank: ["actually", "approximately", "assume", "component", "comprehend", "deteriorate", "equivalent", "journey", "literary", "performed", "rarely", "sample", "undermined", "unique", "unit"]
})

// State for selected words
const selectedWords = ref<Record<number, string>>({})

// State for word selector
const showWordSelector = ref(false)
const currentBlankNumber = ref<number | null>(null)
const wordSelectorPosition = ref({ top: '0px', left: '0px' })

// Parse content to identify blanks and text
const formattedParagraphs = computed(() => {
  const paragraphs: ParagraphItem[][] = []
  const paragraphTexts = question.value.content.split('\n')

  paragraphTexts.forEach(paragraphText => {
    const items: ParagraphItem[] = []
    const blankRegex = /__(\d+)__/g
    let lastIndex = 0
    let match

    while ((match = blankRegex.exec(paragraphText)) !== null) {
      // Add text before the blank
      if (match.index > lastIndex) {
        items.push({
          type: 'text',
          content: paragraphText.substring(lastIndex, match.index)
        })
      }

      // Add the blank
      items.push({
        type: 'blank',
        number: parseInt(match[1])
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < paragraphText.length) {
      items.push({
        type: 'text',
        content: paragraphText.substring(lastIndex)
      })
    }

    paragraphs.push(items)
  })

  return paragraphs
})

// Check if a word is already used
const isWordUsed = (word: string): boolean => {
  return Object.values(selectedWords.value).includes(word)
}

// Available words for selection (excluding already used words for other blanks)
const availableWords = computed(() => {
  if (currentBlankNumber.value === null) return []

  const currentWord = selectedWords.value[currentBlankNumber.value]
  return question.value.wordbank.filter(word =>
    !isWordUsed(word) || word === currentWord
  )
})

// Open word selector when clicking on a blank
const openWordSelector = (blankNumber: number) => {
  currentBlankNumber.value = blankNumber
  showWordSelector.value = true

  // Position the selector near the blank (will be adjusted in nextTick)
  setTimeout(() => {
    const blankElements = document.querySelectorAll(`span:contains("${blankNumber}")`)
    if (blankElements.length > 0) {
      const blankElement = blankElements[0].nextElementSibling
      if (blankElement) {
        const rect = blankElement.getBoundingClientRect()
        wordSelectorPosition.value = {
          top: `${rect.bottom + window.scrollY + 10}px`,
          left: `${rect.left + window.scrollX}px`
        }
      }
    }
  }, 0)
}

// Select a word for the current blank
const selectWord = (word: string) => {
  if (currentBlankNumber.value !== null) {
    selectedWords.value[currentBlankNumber.value] = word
    closeWordSelector()
  }
}

// Clear the selection for the current blank
const clearSelection = () => {
  if (currentBlankNumber.value !== null) {
    delete selectedWords.value[currentBlankNumber.value]
  }
}

// Close the word selector
const closeWordSelector = () => {
  showWordSelector.value = false
  currentBlankNumber.value = null
}

// Close selector when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (showWordSelector.value) {
    const selectorElement = document.querySelector('.fixed.z-50')
    if (selectorElement && !selectorElement.contains(event.target as Node)) {
      closeWordSelector()
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Part 3: Fill in the blanks</h2>
    <div class="mb-6 p-4 bg-blue-50 rounded-lg">
      <p class="text-sm text-blue-700 font-medium">Choose the correct word from the word bank to complete each blank.
      </p>
    </div>

    <!-- Reading passage with blanks -->
    <div class="prose prose-lg max-w-none mb-8 relative">
      <p v-for="(paragraph, pIndex) in formattedParagraphs" :key="`p-${pIndex}`" class="mb-4 leading-relaxed">
        <template v-for="(item, index) in paragraph" :key="`item-${pIndex}-${index}`">
          <template v-if="item.type === 'text'">{{ item.content }}</template>
          <span v-else-if="item.type === 'blank'" class="relative inline-block">
            <span
              class="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
              {{ item.number }}
            </span>
            <span @click="openWordSelector(item.number)"
              class="relative cursor-pointer min-w-20 inline-block border-b-2 border-gray-400 px-1 mx-1"
              :class="{ 'bg-blue-50': selectedWords[item.number] }">
              {{ selectedWords[item.number] || '________' }}
            </span>
          </span>
        </template>
      </p>
    </div>

    <!-- Word bank -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-700 mb-3">Word Bank:</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="word in question.wordbank" :key="word"
          class="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium" :class="{
            'bg-gray-300 line-through': isWordUsed(word),
          }">
          {{ word }}
        </span>
      </div>
    </div>

    <!-- Floating word selector -->
    <div v-if="showWordSelector" class="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-2 w-64"
      :style="wordSelectorPosition">
      <div class="flex justify-between items-center mb-2 pb-2 border-b">
        <h4 class="font-medium text-gray-700">Select a word for blank {{ currentBlankNumber }}</h4>
        <button @click="closeWordSelector" class="text-gray-500 hover:text-gray-700">
          <XIcon class="h-4 w-4" />
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        <button v-for="word in availableWords" :key="word" @click="selectWord(word)"
          class="px-3 py-2 text-left text-sm rounded hover:bg-blue-50 transition-colors" :class="{
            'bg-blue-100 font-medium': selectedWords[currentBlankNumber] === word
          }">
          {{ word }}
        </button>
        <button v-if="selectedWords[currentBlankNumber]" @click="clearSelection"
          class="px-3 py-2 text-left text-sm text-red-500 rounded hover:bg-red-50 transition-colors col-span-2">
          Clear selection
        </button>
      </div>
    </div>
  </div>
</template>



<style scoped>
/* Custom CSS for the component */
:deep(.prose) {
  color: #374151;
  line-height: 1.8;
}
</style>