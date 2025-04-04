<script setup lang="ts">
import { ChartNoAxesColumnIncreasing, Clock4, FileText } from 'lucide-vue-next';
import { watch } from 'vue';
import { useRouter } from 'vue-router'
interface Paper {
    paperId: number
    paperName: string
    totalTime: number
    type: string,
    examYear: number,
    examMonth: number,
    level: string,
    questioncount: number,

}
const router = useRouter()
const { paper } = defineProps<{
    paper?: Paper
}>()

watch(() => paper, (newPaper) => {
    if (newPaper) {
        console.log(newPaper)
    }
})

const getLevelColor = (level: null | string) => {
    switch (level) {
        case "Beginner":
            return "bg-green-100 text-green-800"
        case "Intermediate":
            return "bg-yellow-100 text-yellow-800"
        case "Advanced":
            return "bg-red-100 text-red-800"
        default:
            return "bg-orange-100 text-orange-800"
    }
}
// Function to determine the background color based on category
const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Reading':
            return 'bg-blue-50 text-blue-700'
        case 'Writing':
            return 'bg-purple-50 text-purple-700'
        case 'Listening':
            return 'bg-green-50 text-green-700'
        case 'Speaking':
            return 'bg-yellow-50 text-yellow-700'
        case 'Grammar':
            return 'bg-red-50 text-red-700'
        case 'Vocabulary':
            return 'bg-indigo-50 text-indigo-700'
        default:
            return 'bg-gray-50 text-gray-700'
    }
}

const getTypeColor = (type: string) => {
    switch (type) {
        case 'CET-4':
            return 'bg-blue-50 text-blue-700'
        case 'CET-6':
            return 'bg-purple-50 text-purple-700'
    }
}
</script>


<template>
    <div>
        <div class="card  bg-base-90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            @click="router.push(`/exam/introduce/${paper?.paperId}`)">
            <div class="card-title">
                <div class="h-48 w-full rounded-box flex flex-col justify-center items-center relative px-5">
                    <div
                        class="absolute rounded-t-sm inset-0 bg-gradient-to-br from-gray-50 to-gray-200 opacity-50 -z-10">
                    </div>
                    <div class="absolute top-3 right-3 w-12 h-12 border-r border-t border-gray-300"></div>
                    <div class="absolute bottom-3 left-3 w-12 h-12 border-b border-l border-gray-300"></div>
                    <span
                        :class="`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(paper?.type)} mb-2`">
                        {{ paper?.type }}
                    </span>
                    <h3 class="font-bold text-lg text-gray-900 mb-1">{{ paper?.examYear }}年{{ paper?.examMonth }}月 {{
                        paper?.paperName }}</h3>
                    <div>
                        <span
                            :class="`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(paper?.level)}`">
                            {{ paper?.level ? paper?.level : "投票人数过少" }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="card-body p-4 pt-3 pb-3">
                <div class="flex items-center justify-between">
                    <div class="infodiv">
                        <FileText :size="16" :stroke-width="1.25" />
                        <span>40 questions</span>
                    </div>
                    <div class="infodiv">
                        <Clock4 :stroke-width="1.25" size="16" /><span>{{ paper?.totalTime }} min</span>
                    </div>
                </div>
                <div class="divider mb-0.5 mt-0.5"></div>
                <div class="flex items-center justify-between">
                    <div class="infodiv">
                        <ChartNoAxesColumnIncreasing size=18 /><span>完成率: 90% </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
svg {
    display: inline;
    vertical-align: middle;
}

.infodiv {
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>