<script setup lang="ts">
import { useElementByPoint, useMouse, useEventListener, useElementBounding, useParentElement } from '@vueuse/core'
import { useRequest } from 'alova/client';
import { computed, reactive, ref, watch } from 'vue'
import { getwordmean } from '../request/methods/dictionary';
const str = 'She has been living in Fayetteville for 25 years.'
function wrapWordsWithSpan(inputString) {
    if (isdic.value) {
        return inputString.replace(/\b([a-zA-Z'-]+)\b/g, '<span>$1</span>');
    } else {
        return inputString.replace(/\b([a-zA-Z'-]+)\b/g, "<span class='test'>$1</span>");
    }
}
const text = computed(() => {
    return wrapWordsWithSpan(str)
})
const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })
const worddom = ref()
const bounding = reactive(useElementBounding(worddom))
const { data } = useRequest(() => getwordmean('question'))


useEventListener(element, 'click', (e) => {
    getword(element.value)
}, { passive: true, capture: true })
const isdic = ref(false)
const word = ref('abc')
const getword = (element) => {
    try {
        console.log(element.tagName)
        if (element.tagname !== 'SPAN') {
            worddom.value = element.closest('span')
            console.log(worddom.value)
            word.value = worddom.value.textContent
        } else {
            word.value = element.textContent
        }

    } catch (error) {

    }
}

const boxStyles = computed(() => {
    if (element.value) {
        return {
            display: 'block',
            width: `${bounding.width}px`,
            height: `${bounding.height}px`,
            left: `${bounding.left}px`,
            top: `${bounding.top}px`,
            border: '1px solid red',
            backgroundColor: '#3eaf7c44'
        }
    } else return {
        display: 'none',
    }
})
</script>

<template>
    <div class="h-[150vh]">
        <!-- <div :style="boxStyles" class="absolute pointer-events-none" z-10></div> -->
        <div v-html="text"></div>
        <div>{{ text }}</div>
        <div>word:{{ word }}</div>
        <div class="btn" @click="isdic = !isdic">change:{{ isdic }}</div>
    </div>

</template>

<style scoped>
:deep(span) {
    border-bottom: none
}

:deep(span:hover) {
    border-bottom: 1px solid orange;
    transition: border-bottom 0.5s ease-in-out;
}

:deep(span.test) {
    color: red;
}
</style>