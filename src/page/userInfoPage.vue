<script setup lang="ts">
import HomeNav from '../components/home-nav.vue';
import HomeFooter from '../components/footer.vue';
import { useRequest } from 'alova/client';
import { getUserInfo } from '../request/methods/user';
import { getRecords } from '../request/methods/record';
import { BookA } from 'lucide-vue-next';
const { data: userinfo } = useRequest(getUserInfo)
const { data: records } = useRequest(getRecords(7))

</script>

<template>
    <HomeNav></HomeNav>
    <div class="main px-4 lg:px-20 flex flex-col lg:flex-row gap-5 lg:gap-10">
        <div class="info card bg-base-100 shadow-sm w-full lg:w-80 flex flex-wrap lg:flex-col  gap-4 p-5">
            <div class="avatar avatar-placeholder flex items-center justify-center ">
                <div class="bg-blue-100 text-neutral-content w-24 lg:w-60 rounded-full">
                    <span class="text-5xl text-base-content">{{ userinfo.username[0].toUpperCase() }}</span>
                </div>
            </div>
            <div class="flex flex-col gap-3">
                <span class="font-bold">{{ userinfo.username.toUpperCase() }}</span>
                <span class="text-gray-500">{{ userinfo.email }}</span>
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
                                    <th class="">Paper Name</th>
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
                                                <span class="text-[12px] text-gray-400">{{ record.paperType }}</span>
                                            </div>
                                        </div>
                                    </th>
                                    <td>2025.3.21</td>
                                    <td>{{ record.score }}/{{ record.totalscore }}</td>
                                    <td>
                                        <div v-if="record.isfinished === 1">
                                            <div class="inline-grid *:[grid-area:1/1]">
                                                <div class="status status-success animate-ping"></div>
                                                <div class="status status-success"></div>
                                                <span>Finished</span>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="inline-grid *:[grid-area:1/1]">
                                                <div class="status status-success animate-ping"></div>
                                                <div class="status status-success"></div>
                                            </div> <span>Unfinished</span>
                                        </div>
                                    </td>
                                    <th class="text-blue-500 cursor-pointer">Review</th>
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