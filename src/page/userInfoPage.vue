<script setup lang="ts">
import HomeNav from "../components/home-nav.vue";
import HomeFooter from "../components/footer.vue";
import { useRequest, usePagination } from "alova/client";
import { getUserInfo } from "../request/methods/user";
import { getRecords } from "../request/methods/record";
import { BookA } from "lucide-vue-next";
import { usepaperStore } from "../store/paperStore";
import { useRouter } from "vue-router";
import { userecordStore } from "../store/recordStore";
import { getCollectedWords } from "../request/methods/word";
import { ref } from "vue";
const { data: userinfo } = useRequest(getUserInfo);
const { data: records } = useRequest(getRecords(30));
const paperStore = usepaperStore();
const recordStore = userecordStore();
const router = useRouter();
// 通过时间戳计算当时日期
const getDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${min}`;
};
const Continue = (index: number) => {
  // 跟随记录继续写
  const recorddata = records.value[index];
  // 跳转试卷页面 设置当前试卷id和当前用户答案
  paperStore.setCurrentPaperType(recorddata.paperType);
  paperStore.setUserAnswer(recorddata.paperId, JSON.parse(recorddata.answers));
  // 设置record时间
  recordStore.setRecordtime(recorddata.paperId, recorddata.hasspendtime);
  router.push({
    name: "examPageContinue",
    params: { id: recorddata.paperId, mode: recorddata.type, recordId: recorddata.recordId }
  });
};
const Review = (index: number) => {
  const recorddata = records.value[index];
  paperStore.setCurrentPaperType(recorddata.paperType);
  paperStore.setUserAnswer(recorddata.paperId, JSON.parse(recorddata.answers));
  router.push({
    name: "examReview",
    params: { id: recorddata.paperId, recordId: recorddata.recordId }
  });
};

//获取收藏单词

const { data: collectedWords,page:wordpage,pageSize:wordsize,pageCount,total } = usePagination((wordpage,wordsize)=>getCollectedWords(wordpage, wordsize),{
    initialData:{
        total:0,
        data:[]
    },
        initialPage: 1, // 初始页码，默认为1
      initialPageSize: 20
});
</script>

<template>
  <HomeNav class="relative z-1"></HomeNav>
  <div class="main flex flex-col gap-5 px-4 lg:flex-row lg:gap-10 lg:px-20">
    <div
      class="info card flex w-full flex-wrap gap-4 bg-base-100 p-5 shadow-sm lg:w-80 lg:flex-col"
    >
      <div class="avatar avatar-placeholder flex items-center justify-center">
        <div class="w-24 rounded-full bg-blue-100 text-neutral-content lg:w-60">
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
    <div class="right flex w-full flex-col gap-3 lg:w-3/4">
      <div class="records card flex gap-3 bg-base-100 px-4 py-6 shadow-md">
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold lg:text-2xl">Recent Exams (30Days)</span>
          <span class="cursor-pointer text-blue-400">View All</span>
        </div>
        <div>
          <div class="max-h-150 overflow-scroll overflow-x-auto">
            <table class="table-pin-rows table-pin-cols table">
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
                        class="flex aspect-square items-center justify-center rounded-md bg-blue-200 p-2"
                      >
                        <BookA :size="28" color="#6f98ce" />
                      </div>
                      <div class="flex flex-col gap-1">
                        <span>{{ record.paperName }}</span>
                        <div class="flex items-center gap-1">
                          <div
                            class="w-fit rounded-sm px-2"
                            :class="{
                              'bg-purple-200': record.paperType == 'CET-4',
                              'bg-pink-200': record.paperType == 'CET-6'
                            }"
                          >
                            <span class="text-[12px] text-gray-400">{{ record.paperType }}</span>
                          </div>
                          <div class="timeline-middle text-xs text-gray-400 lg:hidden">
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
                        <div class="status animate-ping status-success"></div>
                        <div class="status status-success"></div>
                      </div>
                      <span>Finished</span>
                    </div>
                    <div class="flex items-center gap-2" v-else>
                      <div class="inline-grid *:[grid-area:1/1]">
                        <div class="status animate-ping status-warning"></div>
                        <div class="status status-warning"></div>
                      </div>
                      <span>Unfinished</span>
                    </div>
                  </td>
                  <th
                    @click="Review(index)"
                    v-if="record.isfinished === 1"
                    class="cursor-pointer text-blue-500"
                  >
                    Review
                  </th>
                  <th @click="Continue(index)" v-else class="cursor-pointer text-blue-500">
                    Continue
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="words card flex flex-col gap-3 bg-base-100 px-4 py-6 shadow-md">
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold lg:text-2xl">Collected Words</span>
          <span class="cursor-pointer text-blue-400">View All</span>
        </div>
        <div class="card grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div
            class="card flex items-center justify-center rounded-xs bg-base-200 py-2 text-lg text-base-content shadow-sm transition-all duration-200 hover:-translate-y-1"
            v-for="wordDO in collectedWords"
            :key="wordDO.id"
          >
            {{ wordDO.word }}
          </div>
        </div>
      </div>
      <div class="charts card flex flex-col gap-4 bg-base-100 px-4 py-6 shadow-md">
        <div>
          <span class="text-xl font-bold lg:text-2xl">statistics</span>
        </div>
        <div>
          <span class="text-[16px] text-gray-400">待开发~</span>
        </div>
      </div>
    </div>
  </div>
  <homeFooter></homeFooter>
</template>
