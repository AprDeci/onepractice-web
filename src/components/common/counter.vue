<script setup lang="ts">
import { ref } from 'vue'
const time = ref(0);
const second = ref(0);
const minite = ref(0);
const hour = ref(0);
const timer = setInterval(() => {
    time.value++;
    second.value = time.value % 60;
    minite.value = Math.floor(time.value / 60) % 60;
    hour.value = Math.floor(time.value / 3600) % 24;
}, 1000)
</script>

<template>
    <span class="countdown font-mono text-2xl">
        <span :style="`--value: ${hour};`" aria-live="polite" aria-label="10">10</span>
        :
        <span :style="`--value: ${minite};`" aria-live="polite" aria-label="24">24</span>
        :
        <span :style="`--value: ${second};`" aria-live="polite" aria-label="59">59</span>
    </span>
</template>