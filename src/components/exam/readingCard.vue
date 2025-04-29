<script setup lang="ts">
import QuestionContainer from '../common/QuestionContainer.vue';
import ReadingcLozeCard from './readingcLozeCard.vue';
import ReadingmtachCard from './readingmtachCard.vue';
import ReadingreadCard from './readingreadCard.vue';
import { computed, ref } from 'vue';
import type { QuestionPart } from '../../interface/Question';
const { data } = defineProps<{ data: QuestionPart }>()
const activeindex = ref(0)
const reorderedData = computed(() => {
    return [
        data.questions.find(item => item.questionType === "cloze"),      // 完形填空
        data.questions.find(item => item.questionType === "matching"),   // 匹配题
        data.questions.find(item => item.questionType === "reading" && item.questionOrder === 3), // 阅读1
        data.questions.find(item => item.questionType === "reading" && item.questionOrder === 4)  // 阅读2
    ]
})
const readmap = {
    cloze: ReadingcLozeCard,
    matching: ReadingmtachCard,
    reading: ReadingreadCard,
}
const getprev = () => {
    if (activeindex.value > 0) {
        activeindex.value--
    }
}
const getnext = () => {
    if (activeindex.value < reorderedData.value.length - 1) {
        activeindex.value++
    }
}
const hasnext = computed(() => {
    return activeindex.value < reorderedData.value.length - 1
})
const hasprev = computed(() => {
    return activeindex.value > 0
})

</script>

<template>

    <QuestionContainer :has-next="hasnext" :has-prev="hasprev" @prev="getprev" @next="getnext">
        <div v-for="question in reorderedData" :key="question?.questionId">
            <component v-show="activeindex === question?.questionOrder - 1" :is="readmap[question.questionType]"
                :question="question"></component>
        </div>
    </QuestionContainer>
</template>