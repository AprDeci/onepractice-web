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
    <div class="card shadow-md px-4 py-4">
        <CardContent class="space-y-4">
            <div class="bg-base-300 px-4 py-6 rounded-md mb-2">
                <h3 class="font-medium mb-2">Writing Prompt:</h3>
                <p class="hyphens-auto text-base-content">{{ data.questions[0].content }}</p>
            </div>
        </CardContent>
        <textarea class="min-h-[300px] font-sans text-base leading-relaxed rounded-xl mb-4 p-3" v-model="textinput">

        </textarea>
        <div class="flex flex-col lg:flex-row lg:justify-between">
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