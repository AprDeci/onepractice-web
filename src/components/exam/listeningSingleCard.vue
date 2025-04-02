<script setup lang="ts">
import { computed } from 'vue';
import { splitAnswer } from '@/common/utils';
import OptionGroup from '../common/optionGroup.vue';
import type { QuestionsDO } from '../../interface/Question';
const { question } = defineProps<{ question: QuestionsDO }>();

const indexgroup = computed(() => {
    return question.correctAnswer.map((item) => item.index)
})

const optiongroups = computed(() => {
    return splitAnswer(question.options)
}
)
</script>

<template>
    <div class="flex gap-1.5 flex-col min-h-[300px]"> <!-- Add min-height to ensure visibility -->
        <div>
            <span class="text-2xl">{{ question.content }}</span>
        </div>
        <!-- 答案数据绑定在optiongroup -->
        <div v-for="(option, index) in optiongroups" :key="index" class="">
            <span class="text-xl">question {{ indexgroup[index] }}</span>
            <OptionGroup :options="option" :index="indexgroup[index]"></OptionGroup>
        </div>
    </div>
</template>