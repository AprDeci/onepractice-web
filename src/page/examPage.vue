<script setup lang="ts">
import { ref, onMounted } from 'vue'
const openanswer = ref(false)
import { Timer } from 'lucide-vue-next'
import WritingCard from '../components/exam/writingCard.vue'
import Optiongroup from '../components/common/optiongroup.vue'
import ListeningCard from '../components/exam/listeningCard.vue'


const time = ref(120 * 60)
const startcooldown = () => {
    const cooldownh = document.getElementById('cooldownh')
    const cooldownm = document.getElementById('cooldownm')
    const cooldowns = document.getElementById('cooldowns')
    // 将time(单位为秒)转换为小时、分钟和秒
    let seconds = 59; // 初始化秒数为59
    const interval = setInterval(() => {
        let counter = time.value;
        let hours = Math.floor(time.value / 60 / 60);
        let minutes = Math.floor(time.value / 60) % 60;

        if (counter > 0) {
            time.value--;
            seconds--; // 秒数减1
            if (seconds < 0) {
                seconds = 59; // 当秒数减到0时重置为59
            }
        }

        if (cooldownh) {
            cooldownh.style.setProperty('--value', hours.toString())
        }
        if (cooldownm) {
            cooldownm.style.setProperty('--value', minutes.toString())
        }
        if (cooldowns) {
            cooldowns.style.setProperty('--value', seconds.toString())
        }
        if (counter === 0) {
            clearInterval(interval)
        }
    }, 1000)
}
onMounted(() => {
    startcooldown()
})
const showalert = ref(true)
const sections = ["A", "B", "C", "D",]
const selectedtab = ref(1)
</script>

<template>
    <div class="navbar bg-base-100 shadow-sm flex justify-between">
        <div class="navbar-start hidden lg:flex">
            <span class="text-xl mx-2">Exam Paper Name</span>
        </div>
        <div class="navbar-center">
            <Timer />
            <div>
                <span class="countdown font-mono text-lg lg:text-2xl">
                    <span id="cooldownh" style="--value:10;" aria-live="polite" aria-label="10">10</span>
                    :
                    <span id="cooldownm" style="--value:24;" aria-live="polite" aria-label="24">24</span>
                    :
                    <span id="cooldowns" style="--value:59;" aria-live="polite" aria-label="59">59</span>
                </span>
            </div>
        </div>
        <div class="navbar-end">
            <a class="btn w-30 lg:w-34" @click="openanswer = !openanswer">View Answer</a>
        </div>
    </div>
    <div :class="openanswer ? 'translate--x-0' : 'translate-x-full'"
        class="transform duration-300 ease-in-out answer fixed -right-0 w-80 h-screen">
        <div class="h-full px-4 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <div class="answerbarhead">
                <span class="text-2xl font-bold">Answer</span>
            </div>
        </div>
    </div>
    <div class="middle px-6">
        <div class="mt-8 mb-4">
            <div role="tablist" class="tabs tabs-box w-82 lg:w-105">
                <a :class="{ 'tab-active': selectedtab === index }" role="tab" class="tab w-20 lg:w-25 h-12"
                    v-for="(section, index) in sections" :key="index" @click="selectedtab = index">Section{{ section
                    }}</a>
            </div>
        </div>
        <div class="w-full  mb-4">
            <ListeningCard></ListeningCard>
            <!-- <WritingCard></WritingCard> -->
        </div>
    </div>
    <footer>
        <footer class="footer footer-horizontal bg-neutral-100 text-neutral-content items-center p-4 border">
            <aside class="grid-flow-col items-center">
                <div class="btn btn-sm lg:btn-md">Previous Section</div>
                <div class="btn btn-sm lg:btn-md">Next Section</div>
            </aside>
            <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                <div class="btn btn-primary btn-sm lg:btn-md">submit</div>
            </nav>
        </footer>
    </footer>

</template>