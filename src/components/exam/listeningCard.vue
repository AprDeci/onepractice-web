<script setup lang="ts">
import AudioPlayer from '../common/audioPlayer.vue';
import QuestionContainer from '../common/QuestionContainer.vue';
import ListeningSingleCard from './listeningSingleCard.vue';
import { computed, ref } from 'vue';
import type { QuestionPart } from '../../interface/Question';
const { data } = defineProps<{ data: QuestionPart }>()
const hasPrevSection = computed(() => {
    return activeId.value !== 0
})

const hasNextSection = computed(() => {
    return activeId.value >= 0 && activeId.value !== exampleData.length - 1
})

const activeId = ref(0)

const getprev = () => {
    if (activeId.value > 0) {
        activeId.value--
    }
}

const getnext = () => {
    if (activeId.value < exampleData.length - 1) {
        activeId.value++
    }
}

</script>

<template>
    <div class="max-w-4xl m-auto listening-card card shadow-sm p-4 bg-base-100  flex gap-3 ">
        <div class="player">
            <AudioPlayer :audioSrc="data.questions[0].listenurl" trackTitle=" "></AudioPlayer>

        </div>
        <div class="options">
            <QuestionContainer :hasNext="hasNextSection" :hasPrev="hasPrevSection" @prev="getprev" @next="getnext">
                <ListeningSingleCard v-for="(item, index) in data.questions" :key="index" :question="item"
                    v-show="activeId === index">
                </ListeningSingleCard>
            </QuestionContainer>
        </div>
    </div>
</template>