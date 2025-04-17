import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { usepaperStore } from "./paperStore";

interface record {
  hasspendtime: number;
  laststarttime: number;
  recordId: string;
}

export const userecordStore = defineStore(
  "recordStore",
  () => {
    const paperstore = usepaperStore();

    const records = ref<Record<number, record>>({});

    const currentRecord = computed(() => {
      if (!paperstore.currentPaperId || !records.value[paperstore.currentPaperId as number]) return;
      return records.value[paperstore.currentPaperId as number];
    });

    const currentHasspendtime = computed(() => {
      if (!paperstore.currentPaperId || !records.value[paperstore.currentPaperId as number]) return;
      return records.value[paperstore.currentPaperId as number].hasspendtime;
    });

    const currentLaststarttime = computed(() => {
      if (!paperstore.currentPaperId || !records.value[paperstore.currentPaperId as number]) return;
      return records.value[paperstore.currentPaperId as number].laststarttime;
    });

    const currentRecordId = computed(() => {
      if (!paperstore.currentPaperId || !records.value[paperstore.currentPaperId as number]) return;
      return records.value[paperstore.currentPaperId as number].recordId;
    });

    const setRecordtime = (index: number, time: number) => {
      if (!records.value[index]) {
        records.value[index] = {
          hasspendtime: time,
          laststarttime: 0
        };
      } else {
        records.value[index].hasspendtime = time;
      }
    };

    const setRecordLasttime = (index: number, time: number) => {
      if (!records.value[index]) {
        records.value[index] = {
          hasspendtime: 0,
          laststarttime: time
        };
      } else {
        records.value[index].laststarttime = time;
      }
    };

    const setRecordId = (index: number, recordid: string) => {
      if (!records.value[index]) {
        records.value[index] = {
          hasspendtime: 0,
          laststarttime: 0,
          recordId: recordid
        };
      } else {
        records.value[index].recordId = recordid;
      }
    };

    const initRecord = (index: number) => {
      if (!records.value[index]) {
        records.value[index] = {
          hasspendtime: 0,
          laststarttime: Date.now(),
          recordId: "0"
        };
      } else {
        records.value[index].laststarttime = Date.now();
      }
    };

    const updateRecord = (index: number) => {
      records.value[index].hasspendtime += Date.now() - records.value[index].laststarttime;
      records.value[index].laststarttime = Date.now();
    };

    return {
      records,
      currentRecord,
      currentHasspendtime,
      currentLaststarttime,
      currentRecordId,
      setRecordId,
      setRecordtime,
      setRecordLasttime,
      initRecord,
      updateRecord
    };
  },
  {
    persist: {
      key: "recordStore"
    }
  }
);
