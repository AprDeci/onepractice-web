<script setup lang="ts">
import HomeNav from '../components/home-nav.vue';
import HomeFooter from '../components/footer.vue';
import { useRequest } from 'alova/client';
import { getUserInfo } from '../request/methods/user';
import { getRecords } from '../request/methods/record';
import { BookA } from 'lucide-vue-next';
import { usepaperStore } from '../store/paperStore';
import { useRouter } from 'vue-router';
import { timestamp } from '@vueuse/core';
import { userecordStore } from '../store/recordStore';
const { data: userinfo } = useRequest(getUserInfo)
const { data: records } = useRequest(getRecords(7))
const paperStore = usepaperStore();
const recordStore = userecordStore();
const router = useRouter();
// 通过时间戳计算当时日期
const getDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
}
const Continue = (index: number) => {
    // 跟随记录继续写
    const recorddata = records.value[index]
    // 跳转试卷页面 设置当前试卷id和当前用户答案
    paperStore.setCurrentPaperType(recorddata.paperType)
    paperStore.setUserAnswer(recorddata.paperId, JSON.parse(recorddata.answers))
    // 设置record时间
    recordStore.setRecordtime(recorddata.paperId, recorddata.hasspendtime)
    router.push({ name: 'examPageContinue', params: { id: recorddata.paperId, mode: recorddata.type, recordId: recorddata.recordId } })
}
</script>

<template>
    <HomeNav></HomeNav>
    <div class="main px-4 lg:px-20 flex flex-col lg:flex-row gap-5 lg:gap-10">
        <div class="info card bg-base-100 shadow-sm w-full lg:w-80 flex flex-wrap lg:flex-col  gap-4 p-5">
            <div class="avatar avatar-placeholder flex items-center justify-center ">
                <div class="bg-blue-100 text-neutral-content w-24 lg:w-60 rounded-full">
                    <span class="text-5xl text-base-content">{{ userinfo?.username[0].toUpperCase() }}</span>
                </div>
            </div>
            <div class="flex flex-col gap-3">
                <span class="font-bold">{{ userinfo?.username.toUpperCase() }}</span>
                <span class="text-gray-500">{{ userinfo?.email }}</span>
                <span class="btn rounded-md">Edit Profile</span>
            </div>
            <div class="divider my-2"></div>
            <div class="flex flex-col gap-2">
                <div>Achievements</div>
                <div class="achinevementsList">
                    <span class="text-gray-400">待开发~</span>
                </div>
            </div>
        </div>
        <div class="right w-full lg:w-3/4 flex-col flex gap-3">
            <div class="records card shadow-md bg-base-100 px-4 py-6 flex gap-3">
                <div class="flex justify-between items-center">
                    <span class="text-xl lg:text-2xl font-bold">Recent Exams (30Days)</span>
                    <span class="text-blue-400 cursor-pointer">View All</span>
                </div>
                <div>
                    <div class="overflow-x-auto">
                        <table class="table table-pin-rows table-pin-cols">
                            <thead>
                                <tr>
                                    <th class="min-w-60 lg:min-w-55">Paper Name</th>
                                    <td>Date</td>
                                    <td>Score</td>
                                    <td>status</td>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(record, index) in records" :key="index">
                                    <th>
                                        <div class="flex gap-1">
                                            <div
                                                class="bg-blue-200 rounded-md p-2 flex justify-center items-center aspect-square">
                                                <BookA :size="28" color="#6f98ce" />
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <span>{{ record.paperName }}</span>
                                                <div class="flex gap-1 items-center">
                                                    <div class="rounded-sm w-fit px-2" :class="{
                                                        'bg-purple-200': record.paperType == 'CET-4',
                                                        'bg-pink-200': record.paperType == 'CET-6',
                                                    }">
                                                        <span class="text-[12px] text-gray-400">{{
                                                            record.paperType }}</span>

                                                    </div>
                                                    <div class="lg:hidden text-gray-400 text-xs timeline-middle">
                                                        {{ getDate(record.timestamp) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </th>
                                    <td>{{ getDate(record.timestamp) }}</td>
                                    <td>{{ record.score }}/{{ record.totalscore }}</td>
                                    <td>
                                        <div class="flex items-center gap-2" v-if="record.isfinished === 1">
                                            <div class="inline-grid *:[grid-area:1/1]">
                                                <div class="status status-success animate-ping"></div>
                                                <div class="status status-success"></div>

                                            </div> <span>Finished</span>
                                        </div>
                                        <div class="flex items-center gap-2" v-else>
                                            <div class="inline-grid *:[grid-area:1/1]">
                                                <div class="status status-warning animate-ping"></div>
                                                <div class="status status-warning"></div>
                                            </div> <span>Unfinished</span>
                                        </div>
                                    </td>
                                    <th v-if="record.isfinished === 1" class="text-blue-500 cursor-pointer">Review</th>
                                    <th @click="Continue(index)" v-else class="text-blue-500 cursor-pointer">Continue
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="charts card shadow-md bg-base-100 px-4 py-6 flex flex-col gap-4">
                <div>
                    <span class="text-xl lg:text-2xl font-bold">statistics</span>
                </div>
                <div>
                    <span class="text-[16px] text-gray-400">待开发~</span>
                </div>
            </div>
        </div>

    </div>
    <homeFooter></homeFooter>
</template>