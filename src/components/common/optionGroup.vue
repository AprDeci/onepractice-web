<script setup lang="ts">
import { ref } from 'vue'
const selected = defineModel();

const { options } = defineProps<{
    options: any[]

}>();
const selectoption = (label: string) => {
    selected.value = label
}
</script>

<template>
    <div class="optionsgroup">
        <div class="rounded-lg h-min-12 my-2 w-full border flex items-center p-3 border-gray-200 cursor-pointer"
            :class="{ 'bg-gray-100': option.label === selected }" v-for="(option, index) in options" :key="index"
            @click="selectoption(option.label)">
            <input type="radio" name="radio-1" class="radio mr-4 " :checked="option.label === selected" />
            <span class="mr-2">{{ option.label }}.</span><span>{{ option.content }}</span>
        </div>

    </div>
</template>