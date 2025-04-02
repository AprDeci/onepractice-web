<script setup lang="ts">
import { ref, watch } from 'vue';
import { Info, CircleCheck } from 'lucide-vue-next';
import type { QuestionPart } from '../../interface/Question';
const { data } = defineProps<{ data: QuestionPart }>()
const textinput = ref("")
const wordcount = ref(0)
watch(textinput, (text) => {
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
</script>

<template>
    <div class="max-w-4xl mx-auto card shadow-md px-4 py-4">
        <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2  dark:text-base-content">Writing</h2>
            <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700 font-medium">
                    Translate the following text into English. Your translation should be accurate, fluent and
                    idiomatic.
                </p>
            </div>
        </div>
        <CardContent class="space-y-4">
            <h2 class="text-xl font-bold text-gray-800 mb-2  dark:text-base-content">Writing Prompt</h2>
            <div class="bg-base-200 px-4 py-6 rounded-md mb-2">
                <p class="hyphens-auto text-base-content">{{ data.questions[0].content }}</p>
            </div>
        </CardContent>
        <h2 class="mt-3 text-xl font-bold text-gray-800 mb-2  dark:text-base-content">Your Writing</h2>
        <textarea
            class=" w-full min-h-[300px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none resize-y"
            v-model="textinput">

            </textarea>
        <div class="flex flex-col lg:flex-row lg:justify-between mt-3">
            <div class="text-orange-400"><span>{{ wordcount }}</span>
                words
                <progress class="progress progress-warning w-56" :value="wordcount / (120 / 100)" max="100"></progress>
            </div>
            <div v-if="wordcount < 120">
                <Info class="inline-block mr-1" :size="16" :color="'orange'" />
                <span class="text-orange-400">remaning {{ 120 - wordcount }} words</span>
            </div>
            <div v-else>
                <CircleCheck class="inline-block mr-1" :size="16" :color="'#05df72'" />
                <span class="text-green-400">Meet minimum requirements</span>
            </div>
        </div>
    </div>
</template>