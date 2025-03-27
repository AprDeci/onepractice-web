<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Paper {
    id: number
    x: number
    y: number
    rotation: number
    size: number
    speed: number
    opacity: number
    color: string
}

const papers = ref<Paper[]>([])

// 使用浅色系且对比度更高的颜色（优化视觉可见性）
const paperColors = [
    "bg-gray-100/80",
    "bg-blue-50/80",
    "bg-yellow-50/80",
    "bg-green-50/80",
    "bg-red-50/80",
    "bg-purple-50/80",
    "bg-indigo-50/80"
]

// 创建初始纸片（减少数量并优化分布）
const createInitialPapers = (): Paper[] => {
    const initialPapers: Paper[] = []
    const paperCount = 15 // 从25减少到15

    for (let i = 0; i < paperCount; i++) {
        initialPapers.push({
            id: i,
            x: Math.random() * 90 + 5, // 避免边缘出现
            y: Math.random() * 100,
            rotation: Math.random() * 360,
            size: 40 + Math.random() * 40, // 40-80px
            speed: 0.2 + Math.random() * 0.8, // 降低速度范围
            opacity: 0.4 + Math.random() * 0.3, // 0.4-0.7
            color: paperColors[Math.floor(Math.random() * paperColors.length)],
        })
    }

    return initialPapers
}

// 使用requestAnimationFrame优化动画（关键优化点）
let animationFrameId: number
const animatePapers = () => {
    const updatePapers = (timestamp: number) => {
        papers.value = papers.value.map(paper => {
            // 对离开视口的纸片重置位置（优化内存）
            if (paper.y < -10) {
                return {
                    ...paper,
                    y: 110,
                    x: Math.random() * 90 + 5
                }
            }

            return {
                ...paper,
                y: paper.y - paper.speed * 0.08, // 更平滑的移动
                x: paper.x + Math.sin(timestamp / 3500 + paper.id) * 0.1, // 减缓水平摆动
                rotation: paper.rotation + paper.speed * 0.1
            }
        })
        animationFrameId = requestAnimationFrame(updatePapers)
    }
    animationFrameId = requestAnimationFrame(updatePapers)
}

onMounted(() => {
    papers.value = createInitialPapers()
    animatePapers()

    onUnmounted(() => {
        cancelAnimationFrame(animationFrameId) // 清理动画帧
    })
})
</script>

<template>
    <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <!-- 使用transform替代top/left（GPU加速） -->
        <div v-for="paper in papers" :key="paper.id"
            class="absolute shadow-sm border border-gray-200/50 will-change-transform" :class="paper.color" :style="{
                left: `${paper.x}%`,
                top: `${paper.y}%`,
                transform: `translate(${paper.x}%, ${paper.y}%) rotate(${paper.rotation}deg)`,
                width: `${paper.size}px`,
                height: `${paper.size * 1.4}px`,
                opacity: paper.opacity,
                zIndex: -1,
                transition: 'transform 0.1s linear' // 更短的过渡时间
            }">
            <!-- 简化线条数量（减少DOM节点） -->
            <div class="absolute top-1/3 left-1/4 w-1/2 h-px bg-gray-200/50"></div>
            <div class="absolute top-2/3 left-1/3 w-1/3 h-px bg-gray-200/50"></div>
        </div>
    </div>
</template>