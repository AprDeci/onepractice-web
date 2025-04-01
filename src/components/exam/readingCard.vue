<script setup lang="ts">
import QuestionContainer from '../common/QuestionContainer.vue';
import ReadingcLozeCard from './readingcLozeCard.vue';
import ReadingmtachCard from './readingmtachCard.vue';
import ReadingreadCard from './readingreadCard.vue';
import { computed, ref } from 'vue';
import type { QuestionPart } from '../../interface/Question';
const { data } = defineProps<{ data: QuestionPart }>()
const types = ["cloze", "match", "read1", "read2"]
const activeindex = ref(0)
const activetype = computed(() => types[activeindex.value])
const getprev = () => {
    if (activeindex.value > 0) {
        activeindex.value--
    }
}
const getnext = () => {
    if (activeindex.value < types.length - 1) {
        activeindex.value++
    }
}
const hasnext = computed(() => {
    return activeindex.value < types.length - 1
})
const hasprev = computed(() => {
    return activeindex.value > 0
})

</script>

<template>
    <QuestionContainer :has-next="hasnext" :has-prev="hasprev" @prev="getprev" @next="getnext">
        <ReadingcLozeCard v-show="activetype === 'cloze'" :question="data.questions[0]"></ReadingcLozeCard>
        <ReadingmtachCard v-show="activetype === 'match'" :question="data.questions[3]"></ReadingmtachCard>
        <ReadingreadCard v-show="activetype === 'read1'" :question="data.questions[1]"></ReadingreadCard>
        <ReadingreadCard v-show="activetype === 'read2'" :question="data.questions[2]"></ReadingreadCard>
    </QuestionContainer>
</template>