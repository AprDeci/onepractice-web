<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { ClockIcon, CheckCircleIcon, LoaderIcon, ChevronDownIcon } from 'lucide-vue-next'
import type { QuestionsDO, QuestionPart } from '../../interface/Question'

const { data } = defineProps<{
    data: QuestionPart
}>()

const question = computed(() => {
    return data.questions[0]
})


// State
const translation = ref('')
const wordcount = ref(0)
const elapsedTime = ref(0)
const isSaving = ref(false)
const isSaved = ref(false)
const saveStatus = ref('Auto-saving')
const showTools = ref(false)
const lookupWord = ref('')
const timer = ref<number | null>(null)
const autoSaveTimer = ref<number | null>(null)

// Sample data for tools
const suggestions = ref<string[]>([])
const commonPhrases = ref([
    'environmental protection',
    'significant achievements',
    'clean energy',
    'public transportation',
    'waste classification',
    'international cooperation',
    'global environmental protection'
])

// Format time display (mm:ss)
const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Handle input changes
const handleInput = () => {
    // Reset auto-save status
    isSaved.value = false
    isSaving.value = true
    saveStatus.value = 'Auto-saving'

    // Generate suggestions based on last word
    generateSuggestions()

    // Schedule auto-save
    if (autoSaveTimer.value) {
        clearTimeout(autoSaveTimer.value)
    }

    autoSaveTimer.value = window.setTimeout(() => {
        saveTranslation(true)
    }, 2000)
}

// 生成推荐
const generateSuggestions = () => {
    // This is a simplified implementation
    // In a real app, this would use more sophisticated logic or an API
    const lastWord = translation.value.split(' ').pop()?.toLowerCase() || ''

    if (lastWord.length < 2) {
        suggestions.value = []
        return
    }

    // Sample suggestions based on environmental protection theme
    const allSuggestions = [
        'environment', 'protection', 'pollution', 'measures', 'clean',
        'energy', 'public', 'transportation', 'bicycle', 'sharing',
        'waste', 'classification', 'cities', 'rural', 'areas',
        'international', 'cooperation', 'contribution', 'government',
        'significant', 'achievements', 'improve', 'quality', 'life'
    ]

    suggestions.value = allSuggestions
        .filter(word => word.startsWith(lastWord))
        .slice(0, 5)
}

// Insert a suggestion into the translation
const insertSuggestion = (suggestion: string) => {
    const words = translation.value.split(' ')
    if (words.length > 0) {
        words.pop() // Remove the last word
        translation.value = [...words, suggestion].join(' ') + ' '
    } else {
        translation.value = suggestion + ' '
    }

    suggestions.value = []
}

// Save the translation
const saveTranslation = (isAuto = false) => {

}



// Clear the translation
const clearTranslation = () => {
    if (confirm('Are you sure you want to clear your translation?')) {
        translation.value = ''
        isSaved.value = false
        saveStatus.value = 'Auto-saving'
    }
}

// Dictionary lookup
const lookupDictionary = () => {
    if (!lookupWord.value) return

    // In a real app, this would call a dictionary API
    alert(`Looking up: ${lookupWord.value}`)
    lookupWord.value = ''
}

watch(translation, (text) => {
    text = text.replace(/\r\n/g, " ")
    text = text.replace(/\n/g, " ");

    var arr = text.split(" ");
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].length < 1) {
            arr.splice(i, 1);
            i = i - 1;
        }
    }
    wordcount.value = arr.length

})

// Load saved translation on mount
onMounted(() => {
    // Start the timer
    timer.value = window.setInterval(() => {
        elapsedTime.value++
    }, 1000)

})

// Clean up on unmount
onBeforeUnmount(() => {
    if (timer.value) {
        clearInterval(timer.value)
    }

    if (autoSaveTimer.value) {
        clearTimeout(autoSaveTimer.value)
    }
})
</script>

<template>
    <div class="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800 mb-2  dark:text-base-content">Translation</h2>

        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-700 font-medium">
                Translate the following text into English. Your translation should be accurate, fluent and idiomatic.
            </p>
        </div>

        <!-- Source text section -->
        <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-3 dark:text-base-content">Source Text:</h3>
            <div class="bg-base-200 p-5 rounded-lg border border-gray-200">
                <p class="text-lg leading-relaxed whitespace-pre-wrap">{{ question.content }}</p>
            </div>
        </div>

        <!-- Translation section -->
        <div>
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold text-gray-700 dark:text-base-content">Your Translation:</h3>
                <div class="flex items-center space-x-4">
                    <!-- Timer -->
                    <div class="text-sm text-gray-500 flex items-center">
                        <ClockIcon class="h-4 w-4 mr-1" />
                        <span>{{ formatTime(elapsedTime) }}</span>
                    </div>

                    <!-- Character count -->
                    <div class="text-sm text-gray-500">
                        <span :class="{ 'text-red-500': translation.length > 500 }">
                            {{ wordcount }}
                        </span> / 200 characters
                    </div>
                </div>
            </div>

            <!-- Text area for translation -->
            <div class="relative">
                <textarea v-model="translation"
                    class="w-full min-h-[300px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none resize-y"
                    :class="{ 'border-red-300': translation.length > 500 }" placeholder="Type your translation here..."
                    @input="handleInput"></textarea>

                <!-- Auto-save indicator -->
                <div class="absolute bottom-3 right-3 text-xs text-gray-500 flex items-center"
                    :class="{ 'text-green-500': isSaved }">
                    <CheckCircleIcon v-if="isSaved" class="h-4 w-4 mr-1" />
                    <LoaderIcon v-else-if="isSaving" class="h-4 w-4 mr-1 animate-spin" />
                    <span>{{ saveStatus }}</span>
                </div>
            </div>

            <!-- Word suggestions and tools -->
            <div class="mt-4 flex flex-wrap gap-2" v-if="suggestions.length > 0">
                <span v-for="suggestion in suggestions" :key="suggestion" @click="insertSuggestion(suggestion)"
                    class="px-2 py-1 bg-gray-100 text-sm rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
                    {{ suggestion }}
                </span>
            </div>

            <!-- Action buttons -->
            <div class="mt-6 flex justify-between">

                <div @click="clearTranslation" class="btn">
                    Clear
                </div>


                <div class="space-x-3">
                    <div @click="saveTranslation" class="btn">Save Draft</div>

                </div>
            </div>
        </div>

        <!-- Reference tools panel (collapsible) -->
        <div class="mt-8 border-t pt-4">
            <button @click="showTools = !showTools"
                class="flex items-center text-gray-600 hover:text-gray-800 cursor-not-allowed">
                <span class="font-medium dark:text-base-content">Translation Tools</span>
                <ChevronDownIcon class="h-5 w-5 ml-1 transition-transform"
                    :class="{ 'transform rotate-180': showTools }" />
            </button>

            <div v-if="showTools" class="mt-3 p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Dictionary lookup -->
                    <div>
                        <h4 class="font-medium text-gray-700 mb-2">Dictionary Lookup</h4>
                        <div class="flex">
                            <input v-model="lookupWord" type="text" placeholder="Enter a word..."
                                class="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-300" />
                            <button @click="lookupDictionary"
                                class="px-3 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300">
                                Search
                            </button>
                        </div>
                    </div>

                    <!-- Common phrases -->
                    <div>
                        <h4 class="font-medium text-gray-700 mb-2">Common Phrases</h4>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="phrase in commonPhrases" :key="phrase" @click="insertSuggestion(phrase)"
                                class="px-2 py-1 bg-white border rounded-md text-sm cursor-pointer hover:bg-gray-100">
                                {{ phrase }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>
/* Custom styling */
textarea {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
}

/* Custom scrollbar */
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
</style>