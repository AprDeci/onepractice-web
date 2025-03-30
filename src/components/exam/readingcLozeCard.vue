<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import data from '../../assets/example/cloze.json'
import { onClickOutside, useElementVisibility } from '@vueuse/core'

const selectedBlankNumber = ref<number | null>(null); // 记录当前点击的填空题编号
const selectedWords = ref<Record<number, string>>({}); // 存储用户选择的答案
const answerCard = ref(null)
// const answerCardVisible = useElementVisibility(answerCard)
const isCardVisible = ref(false);
const clickPos = ref({ x: 0, y: 0 });
onClickOutside(answerCard, (e) => {
    if (isCardVisible.value) {
        isCardVisible.value = false;
    }
})
const contentparsed = computed(() => {
    let content = data.content;
    content = content.replace(/_(\d+)_/g, (match, number) => {
        const word = selectedWords.value[parseInt(number)];
        return word
            ? `<span class="underline cursor-pointer bg-blue-50 relative" blank blank=${number}>${word}<span blank=${number} class="left-0 top-0 absolute h-full w-full"></span></span>`
            : `<span class="underline cursor-pointer" blank=${number}>${number}</span>`;
    });
    return content;
})
const test = (e) => {
    console.log(e.target.parentNode)
    if (e.target.nodeName == "SPAN" || e.target.parentNode.nodeName == "SPAN") {
        openAnswerwindow(e.pageX, e.pageY, e)
    }
}

const openAnswerwindow = (x: number, y: number, e) => {
    if (e.target instanceof HTMLElement && answerCard.value) {
        const blankNumber = parseInt(e.target.getAttribute("blank") || 0);
        console.log(blankNumber)
        selectedBlankNumber.value = blankNumber;
        clickPos.value = { x, y };
        isCardVisible.value = true;
    }
};

const saveanswer = (word) => {
    if (selectedBlankNumber.value !== null) {
        console.log(word);
        if (word) {
            selectedWords.value[selectedBlankNumber.value] = word; // 保存答案
            selectedBlankNumber.value = null; // 重置当前选中编号
            if (answerCard.value) {
                isCardVisible.value = false;
            }
        }
    }
};

</script>

<template>
    <div class="card p-4 shadow-md max-w-4xl mx-auto">
        <div class="title">
            <div class="text-2xl font-bold text-gray-800 mb-4">Fill in the blanks</div>
            <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700 font-medium">Choose the correct word from the word bank to complete each
                    blank.</p>
            </div>
            <div class="content">

                <div class="leading-loose text-lg tracking-wide hyphens-auto text-gray-800" @click="test"
                    v-html="contentparsed"></div>

            </div>
        </div>
    </div>
    <div ref="answerCard" class="answerCard card shadow-md grid grid-cols-2 gap-2 z-10"
        :class="{ 'hidden': !isCardVisible, 'absolute': isCardVisible }"
        :style="isCardVisible ? { top: `${clickPos.x}px`, left: `${clickPos.y}px` } : {}">
        <span class="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium" @click="saveanswer(item)"
            v-for="(item, index) in data.wordbank" :key="index">
            {{ String.fromCharCode(65 + index) }}.{{ item }}
        </span>
    </div>


</template>