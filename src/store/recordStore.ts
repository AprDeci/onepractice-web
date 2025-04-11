import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { usepaperStore } from "./paperStore";

interface record {
  hasspendtime: number;
  laststarttime: number;
}

export const userecordStore = defineStore(
  "recordStore",
  () => {
    const paperstore = usepaperStore();

    const records = ref<Record<number, record>>({});

    const currentRecord = computed(() => {
      if (!paperstore.currentPaperId) return;
      return records.value[paperstore.currentPaperId as number];
    });

    const currentHasspendtime = computed(() => {
      if (!paperstore.currentPaperId) return;
      return records.value[paperstore.currentPaperId as number].hasspendtime;
    });

    const currentLaststarttime = computed(() => {
      if (!paperstore.currentPaperId) return;
      return records.value[paperstore.currentPaperId as number].laststarttime;
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

    const initRecord = (index: number) => {
      if (!records.value[index]) {
        records.value[index] = {
          hasspendtime: 0,
          laststarttime: Date.now()
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
