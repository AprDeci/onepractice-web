<script setup lang="ts">
import floatingPaper from '../components/floating-paper.vue';
import homeNav from '../components/home-nav.vue';
import homeFooter from '../components/footer.vue';
import paperCard from '@/components/paper-card.vue';
import pagiNation from '../components/pagiNation.vue';
import { ref } from 'vue';
import { getPaperIntro, getPaperswithQueryBypage } from '../request/methods/paper';
import { useRequest, usePagination } from 'alova/client';
import { types } from '../common/paper';
import { usepaperStore } from '../store/paperStore';
import { userecordStore } from '../store/recordStore';
import { useRouter } from 'vue-router';


const router = useRouter();
const type = ref('');
const year = ref(0);
const years = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010
];
const paperStore = usepaperStore();
const recordStore = userecordStore();
const { loading, data: papers, isLastPage, page, pageSize, pageCount, total } = usePagination((page, pageSize) => getPaperswithQueryBypage(page, pageSize, type.value, year.value),
    {
        initialData: {
            total: 0,
            data: []
        },
        initialPage: 1,
        initialPageSize: 16,
        total: response => response.total,
        data: response => response.data,
        watchingStates: [type, year],
        debounce: 300
    })
const changePage = (newval: number) => {
    page.value = newval
}



</script>

<template>
    <main>
        <floatingPaper class="-z-1"></floatingPaper>
        <div class="">
            <homeNav :types="types"></homeNav>
            <div class="middle px-4 lg:px-10 py-6">
                <!-- Continue to do -->
                <div class="flex flex-col px-4 gap-2"
                    v-if="paperStore.currentPaperId && paperStore.papersData[paperStore.currentPaperId]">
                    <h2 class="font-bold text-2xl">Continue..</h2>
                    <div class="cursor-pointer card w-full shadow-lg justify-between lg:justify-baseline items-center gap-6 px-3 lg:px-6 h-20 flex-row"
                        @click="router.push({ 'name': 'examPage', params: { 'id': paperStore.currentPaperId, 'mode': paperStore.currentMode } })">
                        <!-- 只考虑本地缓存-->
                        <span class="font-bold">{{ continuedata?.examYear }}年{{ continuedata?.examMonth
                            }}月{{ continuedata?.paperType }}{{ continuedata?.paperName }}</span>
                        <div>
                            <span>已用时间:</span>
                            <span>{{ (recordStore.currentHasspendtime / 1000 / 60).toFixed(0) }}min</span>
                        </div>
                    </div>
                </div>
                <div>
                    <section className="py-10 ">
                        <div className="flex justify-between items-center mb-8 ">
                            <div class="flex-col items-center relative bottom-5 lg:bottom-0">
                                <h1 className="text-2xl md:text-3xl font-bold mr-5">Available Papers</h1>
                                <div class="absolute flex gap-2 items-center top-[130%]" v-if="type != '' || year != 0">
                                    <span class="hidden text-gray-400 lg:block">Conditions:</span>
                                    <div v-if="type != ''" @click="type = ''"
                                        class="group badge badge-outline badge-accent badge-sm cursor-pointer">{{ type
                                        }}
                                        <span class="group-hover:animate-bounce">X</span>
                                    </div>
                                    <div v-if="year != 0" @click="year = 0"
                                        class="group badge badge-outline badge-accent badge-sm cursor-pointer">{{ year
                                        }}
                                        <span class="group-hover:animate-bounce">X</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 flex-col lg:flex-row">
                                <select className="px-3 py-2 border border-gray-200 rounded-md text-sm" v-model="type">
                                    <option value="">All Types</option>
                                    <option v-for="(atype, index) in types" :key="index">{{ atype
                                    }}</option>
                                </select>
                                <select v-model="year" className="px-3 py-2 border border-gray-200 rounded-md text-sm">
                                    <option value="0">All Years</option>
                                    <!-- 从2024到2010 -->
                                    <option v-for="i in years" :key="i">{{ i }}</option>
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
                <pagiNation :total="total" :page-size="pageSize" @page-change="changePage"></pagiNation>
            </div>
            <homeFooter></homeFooter>
        </div>
    </main>

</template>