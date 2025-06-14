<script setup lang="ts">
import { ref } from "vue";
import { getwordmean } from "../../request/methods/dictionary";
import { useWatcher } from "alova/client";
import { collectword, hascollected } from "../../request/methods/word";
import nlp from "compromise";

const { word } = defineProps<{ word: string }>();
const pword = ref("");
const { loading, data: wordmean } = useWatcher(
  () => {
    let parseword = nlp(word);
    parseword.verbs().toInfinitive(); // 动词原形
    parseword.nouns().toSingular();
    pword.value = parseword.text();
    return getwordmean(pword.value);
  },
  [() => word],
  {
    initialData: {}
  }
).onError((e) => {
  return { wordmean: { word: word, mean: "查无此词" } };
});
//单词收藏
const islogin = localStorage.getItem("token") ? true : false;
const { data: iscollected } = useWatcher(() => {
  if (islogin) return hascollected(pword.value);
}, [() => word]);

const addword = async () => {
  if (!islogin) return "";
  try {
    if (iscollected.value) {
      console.log(pword.value);
      await collectword(pword.value);
    } else {
      // 取消收藏
      console.log(pword.value);
      await collectword(pword.value);
    }
  } catch (e) {
    iscollected.value = false;
  }
};
</script>

<template>
  <div
    class="flex max-w-[80%] flex-col rounded-xl bg-base-100 text-base-content shadow-sm lg:max-w-100"
  >
    <div class="flex justify-between rounded-t-xl bg-emerald-100 p-2 dark:bg-emerald-400">
      <div>{{ pword }}</div>
      <div class="flex items-center justify-center" v-if="islogin">
        <label class="container">
          <input type="checkbox" :checked="iscollected" @click="addword" v-model="iscollected" />
          <svg
            class="star-regular"
            xmlns="http://www.w3.org/2000/svg"
            height="0.5em"
            viewBox="0 0 576 512"
          >
            <path
              d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
            ></path>
          </svg>
          <svg
            class="star-solid"
            xmlns="http://www.w3.org/2000/svg"
            height="0.5em"
            viewBox="0 0 576 512"
          >
            <path
              fill="#FFD700"
              d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
            ></path>
          </svg>
        </label>
      </div>
    </div>
    <div v-if="!loading" class="flex flex-col gap-2 px-3 py-1">
      <h3 class="font-bold">mean:</h3>
      <div v-for="translation in wordmean?.translations" :key="translation.pos">
        <div class="flex items-center">{{ translation.pos }}.{{ translation.tran_cn }}</div>
        <div class="divider my-0"></div>
      </div>
    </div>
    <div class="flex gap-2 px-3 py-1" v-else>
      <span class="loading loading-xs loading-ring"></span>
      <span class="loading loading-sm loading-ring"></span>
      <span class="loading loading-md loading-ring"></span>
      <span class="loading loading-lg loading-ring"></span>
      <span class="loading loading-xl loading-ring"></span>
    </div>
  </div>
</template>

<style scoped>
/*------ Settings ------*/
.container {
  --color: #a5a5b0;
  --size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: var(--size);
  user-select: none;
  fill: var(--color);
}

.container .star-regular {
  animation: keyframes-star 0.5s;
}

.container .star-solid {
  animation: keyframes-star 0.5s;
  display: none;
}

/* ------ On check event ------ */
.container input:checked ~ .star-regular {
  display: none;
}

.container input:checked ~ .star-solid {
  display: block;
}

/* ------ Hide the default checkbox ------ */
.container input {
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* ------ Animations ------ */
@keyframes keyframes-star {
  0% {
    transform: rotate(0deg) scale(0);
    opacity: 0;
  }

  50% {
    transform: rotate(10deg) scale(1.3);
  }
}
</style>
