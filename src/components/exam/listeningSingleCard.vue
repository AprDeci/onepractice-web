<script setup lang="ts">
import { computed } from 'vue';
import { splitAnswer } from '@/common/utils';
import OptionGroup from '../common/optionGroup.vue';
const { data } = defineProps<{ data: any }>();

const optiongroups = computed(() => {
    return splitAnswer(data.options)
}
)
</script>

<template>
    <div class="flex gap-1.5 flex-col min-h-[300px]"> <!-- Add min-height to ensure visibility -->
        <div>
            <span class="text-2xl">{{ data.content }}</span>
        </div>
        <div v-for="(option, index) in optiongroups" :key="index" class="">
            <span class="text-xl">question {{ index + 1 }}</span>
            <OptionGroup :options="option"></OptionGroup>
        </div>
    </div>
</template>