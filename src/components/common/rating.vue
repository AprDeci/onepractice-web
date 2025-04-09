<script setup lang="ts">
const { hasvoted = false, maxRating = 5, name = 'rating', starColor = 'bg-primary' } = defineProps<{
    maxRating?: number, name?: string, starColor?: string, hasvoted?: boolean
}>()
const modelValue = defineModel('modelValue')
const emit = defineEmits(['update'])
</script>

<template>
    <div class="tooltip tooltip-top">
        <div class="tooltip-content " :class="{ 'hidden': !hasvoted }">
            <div class="animate-bounce text-orange-400 -rotate-0 text-xl font-black">has voted before!</div>
        </div>
        <div class="rating rating-lg rating-half hover:">
            <input type="hidden" v-model="modelValue" />

            <input type="radio" :name="name" class="rating-hidden" @click="emit('update', 0)" />

            <template v-for="n in maxRating * 2" :key="n">
                <input type="radio" :name="name" :disabled="hasvoted" :class="[
                    'mask',
                    n % 2 === 1 ? 'mask-star-2 mask-half-1' : 'mask-star-2 mask-half-2',
                    starColor
                ]" :checked="modelValue === (n / 2)" @click="emit('update', n / 2)" />
            </template>
        </div>
    </div>
</template>