<script setup lang="ts">
import floatingPaper from '../components/floating-paper.vue';
import homeNav from '../components/home-nav.vue';
import paperCard from '@/components/paper-card.vue';

const testPapers = [
    { id: 1, title: "IELTS Academic Reading", level: "Advanced", questions: 40, time: 60, category: "Reading" },
    { id: 2, title: "TOEFL Listening Test", level: "Intermediate", questions: 34, time: 45, category: "Listening" },
    { id: 3, title: "Cambridge English C1", level: "Advanced", questions: 50, time: 90, category: "Mixed" },
    { id: 4, title: "Business English Test", level: "Intermediate", questions: 30, time: 45, category: "Vocabulary" },
    { id: 5, title: "Grammar Proficiency", level: "Beginner", questions: 25, time: 30, category: "Grammar" },
    { id: 6, title: "Academic Writing", level: "Advanced", questions: 2, time: 60, category: "Writing" },
    { id: 7, title: "Everyday Conversation", level: "Beginner", questions: 20, time: 25, category: "Speaking" },
    { id: 8, title: "English Literature", level: "Advanced", questions: 35, time: 60, category: "Reading" },
    { id: 9, title: "Job Interview Prep", level: "Intermediate", questions: 15, time: 30, category: "Speaking" },
    { id: 10, title: "Travel English", level: "Beginner", questions: 20, time: 25, category: "Vocabulary" },
    { id: 11, title: "Academic Vocabulary", level: "Advanced", questions: 40, time: 45, category: "Vocabulary" },
    { id: 12, title: "Phrasal Verbs Master", level: "Intermediate", questions: 30, time: 35, category: "Grammar" },
]
</script>

<template>
    <main>
        <floatingPaper class="-z-1"></floatingPaper>
        <div class="pl-20 pr-20">
            <homeNav></homeNav>
            <div>
                <section className="container mx-auto px-4 py-10">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold">Available Papers</h1>
                        <div className="flex gap-4">
                            <select className="px-3 py-2 border border-gray-200 rounded-md text-sm">
                                <option>All Categories</option>
                                <option>Reading</option>
                                <option>Writing</option>
                                <option>Listening</option>
                                <option>Speaking</option>
                                <option>Grammar</option>
                                <option>Vocabulary</option>
                            </select>
                            <select className="px-3 py-2 border border-gray-200 rounded-md text-sm">
                                <option>All Levels</option>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>
                </section>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <paperCard v-for="apaper in testPapers" :paper=apaper></paperCard>
            </div>
            <div class="flex items-center justify-center mt-10 mb-10">
                <div class="join">
                    <button class="join-item btn">1</button>
                    <button class="join-item btn btn-active">2</button>
                    <button class="join-item btn">3</button>
                    <button class="join-item btn">4</button>
                </div>
            </div>
            <div>

            </div>
        </div>
    </main>

</template>