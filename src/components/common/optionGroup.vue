<script setup lang="ts">
import { ref } from 'vue'
import { usepaperStore } from '../../store/paperStore';
const selected = defineModel();
const paperSotre = usepaperStore();
const { options, index } = defineProps<{
    options: any[]
    index: string

}>();
const selectoption = (label: string) => {
    selected.value = label
    paperSotre.updateCurrentUserAnswer(index, label)
}
</script>

<template>
    <div class="optionsgroup">
        <div class="rounded-lg h-min-12 my-2 w-full border flex items-center p-3 border-gray-200 cursor-pointer"
            :class="{ 'bg-gray-100': option.label === selected }" v-for="(option, index) in options" :key="index"
            @click="selectoption(option.label)">
            <input type="radio" class="radio mr-4 " :checked="selected === option.label" />
            <span class="mr-2">{{ option.label }}.</span><span>{{ option.content }}</span>
        </div>

    </div>
</template>