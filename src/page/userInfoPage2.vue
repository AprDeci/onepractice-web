<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <header class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <img :src="user.avatar" alt="User avatar"
                            class="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg" />
                        <div
                            class="absolute -bottom-1 -right-1 bg-green-400 w-5 h-5 rounded-full border-2 border-white">
                        </div>
                    </div>
                    <div>
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ user.name }}</h1>
                        <p class="text-gray-500">{{ user.email }}</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button
                        class="px-4 py-2 bg-white rounded-full shadow-md text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                    </button>
                    <button
                        class="px-4 py-2 bg-purple-600 text-white rounded-full shadow-md flex items-center gap-2 hover:bg-purple-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Exam
                    </button>
                </div>
            </header>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                    class="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 transform hover:scale-105 transition-transform">
                    <div class="bg-blue-100 p-4 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-gray-500 text-sm">Completed Exams</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.completedExams }}</p>
                    </div>
                </div>
                <div
                    class="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 transform hover:scale-105 transition-transform">
                    <div class="bg-green-100 p-4 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-gray-500 text-sm">Average Score</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.averageScore }}%</p>
                    </div>
                </div>
                <div
                    class="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 transform hover:scale-105 transition-transform">
                    <div class="bg-purple-100 p-4 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-gray-500 text-sm">Study Time</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.studyHours }}h</p>
                    </div>
                </div>
            </div>

            <!-- Performance Chart -->
            <div class="bg-white rounded-2xl shadow-md p-6 mb-8">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Performance Trend</h2>
                <div class="h-80">
                    <canvas ref="chartRef"></canvas>
                </div>
            </div>

            <!-- Recent Exams -->
            <div class="bg-white rounded-2xl shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-gray-800">Recent Exams</h2>
                    <button class="text-purple-600 hover:text-purple-800 transition-colors">View All</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-b border-gray-200">
                                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Exam Name</th>
                                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Score</th>
                                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(exam, index) in recentExams" :key="index"
                                class="border-b border-gray-200 hover:bg-gray-50">
                                <td class="py-4 px-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-800">{{ exam.name }}</p>
                                            <p class="text-sm text-gray-500">{{ exam.type }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4 px-4 text-gray-600">{{ exam.date }}</td>
                                <td class="py-4 px-4">
                                    <span class="font-medium" :class="getScoreColor(exam.score)">{{ exam.score
                                        }}%</span>
                                </td>
                                <td class="py-4 px-4">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                                        :class="exam.status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                        {{ exam.status }}
                                    </span>
                                </td>
                                <td class="py-4 px-4">
                                    <button class="text-purple-600 hover:text-purple-800 transition-colors">
                                        Review
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

// User data
const user = {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
};

// Stats data
const stats = {
    completedExams: 24,
    averageScore: 85,
    studyHours: 48
};

// Chart reference
const chartRef = ref<HTMLCanvasElement | null>(null);

// Recent exams data
const recentExams = [
    {
        name: 'IELTS Academic Test',
        type: 'Listening & Reading',
        date: 'Apr 2, 2024',
        score: 92,
        status: 'Passed'
    },
    {
        name: 'TOEFL Practice Exam',
        type: 'Speaking & Writing',
        date: 'Mar 28, 2024',
        score: 78,
        status: 'Passed'
    },
    {
        name: 'Cambridge C1 Advanced',
        type: 'Full Test',
        date: 'Mar 15, 2024',
        score: 65,
        status: 'Failed'
    },
    {
        name: 'Business English',
        type: 'Vocabulary & Grammar',
        date: 'Mar 5, 2024',
        score: 88,
        status: 'Passed'
    },
    {
        name: 'PTE Academic',
        type: 'Full Test',
        date: 'Feb 20, 2024',
        score: 82,
        status: 'Passed'
    }
];

// Helper function for score color
const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
};

// Initialize chart
onMounted(() => {
    if (chartRef.value) {
        const ctx = chartRef.value.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Exam Scores',
                            data: [65, 72, 78, 75, 82, 92],
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: '#8b5cf6',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 7
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            titleColor: '#1f2937',
                            bodyColor: '#4b5563',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 12,
                            boxPadding: 6,
                            usePointStyle: true,
                            callbacks: {
                                label: function (context) {
                                    return `Score: ${context.raw}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20
                            },
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }
});
</script>