<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
    House,
    Clock as ClockIcon,
    PlayCircle as PlayCircleIcon,
    Shuffle as ShuffleIcon,
    BookOpen as BookOpenIcon,
    ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'
import { useRouter } from 'vue-router';
import { getPaperIntro } from '../request/methods/paper';

const { id } = defineProps<{
    id: string
}>()
interface PaperData {
    paperName: string;
    examYear: number;
    examMonth: number;
    paperType: string;
    paperTime: number;
    difficulty: null | number; // 或根据实际需要改为可选属性 difficulty?: number;
    sectionCount: number;
    sectionQuestionCount: number[];
}
const paperdata = ref<PaperData>({
    paperName: '',
    examYear: 0,
    examMonth: 0,
    paperType: '',
    paperTime: 0,
    difficulty: null,
    sectionCount: 0,
    sectionQuestionCount: []
})

const router = useRouter();
const examMode = ref<'timed' | 'simulation' | 'free'>('timed')

const handleStartExam = () => {
    // Handle exam start based on selected mode
    console.log(`Starting exam in ${examMode.value} mode`)
    // Navigate to exam page with the selected mode
    router.push({ name: 'examPage', query: { id: id } })
}

const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
        case 'easy': return 'bg-green-500'
        case 'medium': return 'bg-yellow-500'
        case 'hard': return 'bg-red-500'
        default: return 'bg-blue-500'
    }
}

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

onMounted(async () => {
    let data = await getPaperIntro(id);
    paperdata.value = data;
})

</script>

<template>
    <div class="container mx-auto py-8 px-4 max-w-4xl">
        <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2">{{ paperdata.examYear }}年{{ paperdata.examMonth
                }}月{{ paperdata.paperType }}{{ paperdata.paperName }}</h1>
            <div class="flex flex-wrap gap-3 mb-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                    <ClockIcon class="h-3 w-3 mr-1" />
                    {{ paperdata.paperTime }} minutes
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                    <BookOpenIcon class="h-3 w-3 mr-1" />
                    {{ paperdata.sectionCount }} sections
                </span>
                <span
                    :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getDifficultyColor(paperdata.difficulty)}`">
                    {{ paperdata.difficulty }}
                </span>
            </div>

        </div>

        <div class="grid gap-6 md:grid-cols-2">
            <div class="bg-base-100  shadow-lg card">
                <div class="p-6 border-b">
                    <h2 class="text-lg font-medium">Exam Mode</h2>
                    <p class="text-sm text-gray-500">Select how you want to take this exam</p>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <div class="flex items-center space-x-2 mb-4">
                            <input type="radio" id="timed" value="timed" v-model="examMode"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                            <label for="timed" class="flex items-center gap-2 cursor-pointer">
                                <ClockIcon class="h-4 w-4" />
                                <div>
                                    <p class="font-medium">Timed Mode</p>
                                    <p class="text-sm text-gray-500">Strict time limits for each section</p>
                                </div>
                            </label>
                        </div>
                        <div class="flex items-center space-x-2 mb-4">
                            <input type="radio" id="simulation" value="simulation" v-model="examMode"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                            <label for="simulation" class="flex items-center gap-2 cursor-pointer">
                                <PlayCircleIcon class="h-4 w-4" />
                                <div>
                                    <p class="font-medium">Simulation Mode</p>
                                    <p class="text-sm text-gray-500">Full exam experience with breaks</p>
                                </div>
                            </label>
                        </div>
                        <div class="flex items-center space-x-2">
                            <input type="radio" id="free" value="free" v-model="examMode"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                            <label for="free" class="flex items-center gap-2 cursor-pointer">
                                <ShuffleIcon class="h-4 w-4" />
                                <div>
                                    <p class="font-medium">Free Mode</p>
                                    <p class="text-sm text-gray-500">No time limits, review at your own pace</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="p-6 border-t flex-col flex gap-4">
                    <div class="btn btn-primary w-full" @click="handleStartExam">
                        Start Exam
                        <ChevronRightIcon class="ml-2 h-4 w-4" />
                    </div>
                    <div class="btn btn-secondary w-full" @click="router.push('/')">
                        Return home
                        <ChevronRightIcon class="ml-2 h-4 w-4" />
                    </div>
                </div>
            </div>

            <div class="bg-base-100 shadow-lg card">
                <div class="p-6 border-b">
                    <h2 class="text-lg font-medium">Exam Sections</h2>
                    <p class="text-sm text-gray-500">This exam contains {{ paperdata.sectionCount }} sections</p>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <div class="shadow-sm rounded-lg p-4 card">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="font-medium">Writing</h3>
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                                    {{ paperdata.sectionQuestionCount[0] }} questions
                                </span>
                            </div>
                            <p class="text-sm text-gray-500 mb-2">Focus on clear structure with introduction, body, and
                                conclusion; use varied vocabulary and correct grammar.</p>
                            <div class="text-xs text-gray-500 flex items-center">
                                <ClockIcon class="h-3 w-3 mr-1" />
                                Recommended time: 30 minutes
                            </div>
                        </div>
                        <div class="shadow-sm rounded-lg p-4 card">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="font-medium">Listening</h3>
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                                    {{ paperdata.sectionQuestionCount[1] }} questions
                                </span>
                            </div>
                            <p class="text-sm text-gray-500 mb-2">Practice predicting content from keywords; note
                                details like numbers and opinions; review mistakes afterward.</p>
                            <div class="text-xs text-gray-500 flex items-center">
                                <ClockIcon class="h-3 w-3 mr-1" />
                                Recommended time: 25 minutes
                            </div>
                        </div>
                        <div class="shadow-sm rounded-lg p-4 card">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="font-medium">Reading</h3>
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                                    {{ paperdata.sectionQuestionCount[2] }} questions
                                </span>
                            </div>
                            <p class="text-sm text-gray-500 mb-2">Skim for main ideas first; underline key info; manage
                                time by prioritizing easier questions.</p>
                            <div class="text-xs text-gray-500 flex items-center">
                                <ClockIcon class="h-3 w-3 mr-1" />
                                Recommended time: 40 minutes
                            </div>
                        </div>
                        <div class="shadow-sm rounded-lg p-4 card">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="font-medium">Translation</h3>
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                                    {{ paperdata.sectionQuestionCount[3] }} questions
                                </span>
                            </div>
                            <p class="text-sm text-gray-500 mb-2">Translate meaning, not word-for-word; adjust sentence
                                structure to fit English grammar rules naturally.</p>
                            <div class="text-xs text-gray-500 flex items-center">
                                <ClockIcon class="h-3 w-3 mr-1" />
                                Recommended time: 20 minutes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
p {
    hyphens: auto
}
</style>
