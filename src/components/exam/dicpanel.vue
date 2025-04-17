<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { getwordmean } from '../../request/methods/dictionary';
import { useWatcher } from 'alova/client';

const { word } = defineProps<{ word: string }>();
const { loading, data: wordmean, } = useWatcher(() => getwordmean(word), [() => word], {
    initialData: {},
})

</script>

<template>
    <div class="bg-base-100 flex flex-col rounded-xl shadow-sm text-base-content max-w-[80%] lg:max-w-100">
        <div class="bg-yellow-100  p-2">{{ word }}</div>
        <div v-if="!loading" class="px-3 py-1 flex gap-2 flex-col">
            <h3 class="font-bold">mean:</h3>
            <div v-for="translation in wordmean?.translations" :key="translation.pos">
                <div class="flex items-center">
                    {{ translation.pos }}.{{
                        translation.tran_cn }}
                </div>
                <div class="divider my-0"></div>
            </div>
        </div>
        <div class="px-3 py-1 flex gap-2" v-else>
            <span class="loading loading-ring loading-xs"></span>
            <span class="loading loading-ring loading-sm"></span>
            <span class="loading loading-ring loading-md"></span>
            <span class="loading loading-ring loading-lg"></span>
            <span class="loading loading-ring loading-xl"></span>
        </div>

    </div>

</template>