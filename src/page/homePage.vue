<script setup lang="ts">
import floatingPaper from '../components/floating-paper.vue';
import homeNav from '../components/home-nav.vue';
import homeFooter from '../components/footer.vue';
import paperCard from '@/components/paper-card.vue';
import pagiNation from '../components/pagiNation.vue';
import { ref, onMounted } from 'vue';
import { getallpaper, getAllPaperTypes, getpaperBytype } from '../request/methods/paper';
import { getRecords } from '../request/methods/record';
import { useRequest } from 'alova/client';
const { data: papers } = useRequest(getallpaper)



</script>

<template>
    <main>
        <floatingPaper class="-z-1"></floatingPaper>
        <div class="">
            <homeNav :types="types"></homeNav>
            <div class="middle px-4 py-6">
                <div>
                    <section className="container mx-auto px-4 py-10">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold mr-5">Available Papers</h1>
                            <div className="flex gap-4 flex-col lg:flex-row">
                                <select className="px-3 py-2 border border-gray-200 rounded-md text-sm">
                                    <option>All Types</option>
                                    <option v-for="(type, index) in types" :key="index">{{ type }}</option>
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
                    <paperCard v-for="apaper in papers" :paper=apaper :key="apaper.id"></paperCard>
                </div>
            </div>
            <div class="flex items-center justify-center mt-10 mb-10">
                <pagiNation :total="120" :page-size="12" @page-change="changePage"></pagiNation>
            </div>
            <homeFooter></homeFooter>
        </div>
    </main>

</template>