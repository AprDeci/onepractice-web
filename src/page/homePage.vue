<script setup lang="ts">
import floatingPaper from '../components/floating-paper.vue';
import homeNav from '../components/home-nav.vue';
import homeFooter from '../components/footer.vue';
import paperCard from '@/components/paper-card.vue';
import pagiNation from '../components/pagiNation.vue';
import { ref, onMounted } from 'vue';
import { getPaperswithQueryBypage } from '../request/methods/paper';
import { getRecords } from '../request/methods/record';
import { useRequest, usePagination } from 'alova/client';
import { types } from '../common/paper';
import type { PaperQueryDTO } from '../interface/Paper';
// const { data: papers } = useRequest(getallpaper)
const type = ref('');
const year = ref(0);

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
            <div class="middle px-4 py-6">
                <div>
                    <section className="container mx-auto px-4 py-10">
                        <div className="flex justify-between items-center mb-8 gap-2">
                            <div class="flex-col items-center">
                                <h1 className="text-2xl md:text-3xl font-bold mr-5">Available Papers</h1>
                                <div class="flex gap-2 items-center mt-2" v-if="type != '' || year != 0">
                                    <span class="text-gray-400 ml-10">Conditions:</span>
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
                                <select className="px-3 py-2 border border-gray-200 rounded-md text-sm">
                                    <option>All Years</option>
                                    <!-- 从2024到2010 -->


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