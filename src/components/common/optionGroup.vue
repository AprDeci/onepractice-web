<script setup lang="ts">
const options = [{
    "label": "A",
    "content": "She is making a special effort to be recognized."
},
{
    "label": "B",
    "content": "She has been living in Fayetteville for 25 years."
},
{
    "label": "C",
    "content": "She has been driving a school bus ever since 2009."
},
{
    "label": "D",
    "content": "She is the longest-serving bus driver in Fayetteville."
},
]
</script>

<template>
    <div class="optionsgroup">
        <div class="rounded-lg h-12 my-2 w-full border flex items-center p-3 border-gray-200"
            :class="{ 'bg-gray-100': index === selectd }" v-for="(option, index) in options" :key="index">
            <input type="radio" name="radio-1" class="radio mr-4" />
            <span class="mr-2">{{ option.label }}.</span><span>{{ option.content }}</span>
        </div>

    </div>
</template>