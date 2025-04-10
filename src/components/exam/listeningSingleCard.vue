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
    <div class="bg-base-100 rounded-xl p-0 min-h-[300px]">
        <!-- 主要问题内容 -->
        <div class="mb-6">
            <div class="flex items-center mb-3">
            </div>
            <div class="bg-gary-50 dark:bg-indigo-950 p-4 rounded-lg border border-base-300">
                <p class="text-base-content leading-relaxed">{{ question.content }}</p>
            </div>
        </div>

        <!-- 问题选项组 -->
        <div class="space-y-5">
            <div v-for="(option, index) in optiongroups" :key="index"
                class="bg-base-100 rounded-lg border border-base-300 overflow-hidden">
                <!-- 问题标题 -->
                <div class="bg-indigo-400 dark:bg-indigo-950 px-4 py-2 flex items-center">
                    <span class="text-white font-medium">Question {{ indexgroup[index] }}</span>
                </div>

                <!-- 选项组 -->
                <div class="p-4">
                    <OptionGroup :options="option" :index="indexgroup[index]"></OptionGroup>
                </div>
            </div>
        </div>
    </div>
</template>