<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usepaperStore } from '../../store/paperStore.ts';
import { wrapWordsWithSpan } from '../../common/utils';
const selected = ref();
const paperSotre = usepaperStore();
const { options, questionindex } = defineProps<{
    options: any[]
    questionindex: number

}>();

onMounted(() => {
    selected.value = paperSotre.getUserAnswer(questionindex)
})
</script>

<template>
    <div class="optionsgroup">
        <div class="rounded-lg h-min-12 my-2 w-full border flex items-center p-3 border-base-300 " :class="{
            'border-green-400 bg-green-50 dark:bg-transparent': option.label === selected && paperSotre.currentAnswerStatus[questionindex],
            'border-red-400 bg-red-50 dark:bg-transparent': option.label === selected && !paperSotre.currentAnswerStatus[questionindex]
        }" v-for="(option, index) in options" :key="index">
            <input type="radio" class="radio mr-4 " :disabled=true :checked="selected === option.label" />
            <span class="mr-2">{{ option.label }}.</span><span v-html="wrapWordsWithSpan(option.content)"></span>
        </div>

    </div>
</template>