<script setup lang="ts">
import { ChartNoAxesColumnIncreasing, Clock4, FileText } from 'lucide-vue-next';
import { watch } from 'vue';
import { useRouter } from 'vue-router'
import { useRequest } from 'alova/client';
import { getVoteBypaperId } from '../request/methods/vote';
import { getPaperdifficult } from '../common/paper';
interface Paper {
    paperId: number
    paperName: string
    totalTime: number
    type: string,
    examYear: number,
    examMonth: number,
    level: string,
    questionCount: number,
    number: number,
    rating: number

}
const router = useRouter()
const { paper } = defineProps<{
    paper?: Paper
}>()




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

const getrate = (num: number) => {
    //1-2.5 2.5-4 4-5 简单 中等 困难
    if (num <= 2.5) {
        return 'easy'
    } else if (num <= 4) {
        return 'medium'
    } else {
        return 'Advanced'
    }
}

const getLevelColor = (level: string) => {
    switch (level) {
        case 'Beginner':
            return 'bg-green-50 text-green-700'
        case 'Intermediate':
            return 'bg-yellow-50 text-yellow-700'
        case 'Advanced':
            return 'bg-red-50 text-red-700'
        default:

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
    <div v-if="paper.questionCount != 0">
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
                            :class="`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(getPaperdifficult(paper?.rating))}`">
                            {{ paper?.rating && paper?.number > 5 ? getrate(paper?.rating) : "评分人数过少" }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="card-body p-4 pt-3 pb-3">
                <div class="flex items-center justify-between">
                    <div class="infodiv">
                        <FileText :size="16" :stroke-width="1.25" />
                        <span>{{ paper?.questionCount }}题</span>
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