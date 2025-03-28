<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Timer } from 'lucide-vue-next'

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
    startcooldown();
})


</script>

<template>
    <div class="navbar bg-base-100 shadow-sm">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </div>
                <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li><a>Item 1</a></li>
                    <li>
                        <a>Parent</a>
                        <ul class="p-2">
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                        </ul>
                    </li>
                    <li><a>Item 3</a></li>
                </ul>
            </div>
            <span class="text-xl mx-2">Exam Paper Name</span>
        </div>
        <div class="navbar-center">
            <Timer />
            <div>
                <span class="countdown font-mono text-2xl">
                    <span id="cooldownh" style="--value:10;" aria-live="polite" aria-label="10">10</span>
                    :
                    <span id="cooldownm" style="--value:24;" aria-live="polite" aria-label="24">24</span>
                    :
                    <span id="cooldowns" style="--value:59;" aria-live="polite" aria-label="59">59</span>
                </span>
            </div>
        </div>
        <div class="navbar-end">
            <a class="btn">Answer</a>
        </div>
    </div>
</template>