<script setup lang="ts">
import listeningSingleCard from '../components/exam/listeningSingleCard.vue';
import optionGroup from '../components/common/optionGroup.vue';
import readingclozeCard from '../components/exam/readingClozeCard.vue';
import data from '../assets/example/questions.json'
import { wrapWordsWithSpan } from '../common/utils.ts'
import AudioPlayer from '../components/common/audioPlayer.vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { animate, motion } from 'motion-v'
const reading = data.questionParts[2].questions
const listen = data.questionParts[1].questions
const selectindex = ref(0)
const options = [{
    "label": "A",
    "content": "She is making a special effort to be recognized."
},
{
    "label": "B",
    "content": "She has been living in Fayetteville for 25 years."
},
{
    "label": "C",
    "content": "She has been driving a school bus ever since 2009."
},
{
    "label": "D",
    "content": "She is the longest-serving bus driver in Fayetteville."
}]
const contentParsed = computed(() => {
    let content = reading[0].content
    content = content.replace(/_(\d+)_/g, (match, number) => {
        const blankNumber = parseInt(number);
        // const word = selectedWords.value[blankNumber];
        const word = false
        return word
            ? `<span class="dark:text-gray-200 inline-block relative border-b-2 border-blue-400 px-1 mx-1 bg-blue-50 dark:bg-blue-300 dark:text-base-content cursor-pointer" data-blank="${blankNumber}">
          <span class=" blank-number relative  transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">${blankNumber}</span>
          ${word}
          <span class="absolute inset-0" data-blank="${blankNumber}"></span>
        </span>`
            : `          
            <motion.div class="inline-block" :custom="0.25" initial="hidden" :animate="isLoaded ? 'visible' : 'hidden'"
                                    :variants="fallVariants">
            <span class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer" data-blank="${blankNumber}">
          <span class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">${blankNumber}</span>
          ________
          <span class="absolute inset-0" data-blank="${blankNumber}"></span>
        </span></motion.div>
        `;
    });
    return content;
})

//动画
const isLoaded = ref(false)
const mousePosition = ref({ x: 0, y: 0 })
const setMousePosition = (position: { x: number, y: number }) => {
    mousePosition.value = position
}
const cardRef = ref<HTMLElement | null>(null)

onMounted(() => {
    const timer = setTimeout(() => {
        isLoaded.value = true
    }, 500)

    onUnmounted(() => {
        clearTimeout(timer)
    })

})

const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.value) return

    const rect = cardRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setMousePosition({ x, y })
}

const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
}


const fallVariants = {
    hidden: () => ({
        y: -1000,
        opacity: 0,
    }),
    visible: (delay: number) => ({
        y: 0,
        opacity: 1,
        transition: {
            delay: delay,
            type: "spring",
            damping: 15,
            stiffness: 80,
            duration: 1.2,
        },
    }),

}


</script>

<template>
    <main
        class="flex h-screen bg-gradient-to-b from-sky-50 to-purple-50  items-center justify-between  p-4 pr-0 overflow-hidden">
        <div ref="cardRef" class="hidden max-h-[100vh] lg:block perspective-1000 w-dvw lg:w-[800px] z-1"
            @mousemove="handleMouseMove" @mouseleave="handleMouseLeave"
            :style="{ transform: isLoaded ? `rotate3d(-1, 1, 0, 45deg) perspective(1000px) rotateX(${mousePosition.y * -0.01}deg) rotateY(${mousePosition.x * -0.01}deg)` : 'rotate3d(-1, 1, 0, 45deg)', transition: 'transform 0.3s ease-out' }">
            <motion.div :custom="0" initial="hidden" :animate="isLoaded ? 'visible' : 'hidden'"
                :variants="fallVariants">
                <div class="">
                    <div>
                        <div>
                            <div class="max-w-4xl m-auto listening-card card shadow-sm p-4 bg-base-100  flex gap-3 ">
                                <motion.div :custom="0.3" initial="hidden" :animate="isLoaded ? 'visible' : 'hidden'"
                                    :variants="fallVariants">
                                    <div class="player">
                                        <AudioPlayer></AudioPlayer>
                                    </div>
                                </motion.div>
                                <div class="optionsgroup">
                                    <div class="rounded-lg h-min-12 my-2 w-full border flex items-center p-3 border-base-300 cursor-pointer shadow-sm"
                                        :class="{ 'bg-gray-100 dark:bg-base-300': option.label === selectindex }"
                                        v-for="(option, index) in options" :key="index">
                                        <motion.div :custom="0.4 + index / 10" initial="hidden"
                                            :animate="isLoaded ? 'visible' : 'hidden'" :variants="fallVariants">
                                            <input type=" radio" class="radio mr-4 " :checked="index === selectindex" />
                                            <span class="mr-2">{{ option.label }}.</span>
                                            <span v-html="option.content"></span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
            <div class="">
                <motion.div :custom="0" initial="hidden" :animate="isLoaded ? 'visible' : 'hidden'"
                    :variants="fallVariants">
                    <div class="card bg-base-100 shadow-xl px-4 py-4">
                        <div class="prose prose-lg max-w-none mb-8 relative">
                            <div class="text-base-content leading-relaxed  dark:text-base-content" @click="null">
                                When Toni Morrison died in 2019, the world lost one of its most influential authors. But
                                Morrison was not an early success. Her first novel was not published until she was 39,
                                and her last appeared when she was 84. And Morrison was not _ <motion.div
                                    class="inline-block" :custom="0.25" initial="hidden"
                                    :animate="isLoaded ? 'visible' : 'hidden'" :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="26"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">26</span>
                                        ________ <span class="absolute inset-0" data-blank="26"></span> </span>
                                </motion.div> _ in this regard. Numerous writers produce masterpieces well into their
                                70s and beyond. Such _ <motion.div class="inline-block" :custom="0.25" initial="hidden"
                                    :animate="isLoaded ? 'visible' : 'hidden'" :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="27"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">27</span>
                                        ________ <span class="absolute inset-0" data-blank="27"></span> </span>
                                </motion.div> _ accomplishments highlight an important point. Our capacity to speak,
                                write and learn new vocabulary does not seem to _ <motion.div class="inline-block"
                                    :custom="0.25" initial="hidden" :animate="isLoaded ? 'visible' : 'hidden'"
                                    :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="28"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">28</span>
                                        ________ <span class="absolute inset-0" data-blank="28"></span> </span>
                                </motion.div> _ with age. Our eyesight may dim and our recall may weaken, but, by
                                comparison, our ability to produce and to _ <motion.div class="inline-block"
                                    :custom="0.25" initial="hidden" :animate="isLoaded ? 'visible' : 'hidden'"
                                    :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="29"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">29</span>
                                        ________ <span class="absolute inset-0" data-blank="29"></span> </span>
                                </motion.div> _ language is well preserved into older adulthood. Indeed, the latest
                                research that has emerged on language and aging shows that language mastery is a _
                                <motion.div class="inline-block" :custom="0.25" initial="hidden"
                                    :animate="isLoaded ? 'visible' : 'hidden'" :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="30"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">30</span>
                                        ________ <span class="absolute inset-0" data-blank="30"></span> </span>
                                </motion.div> _ that we begin as infants and continue on for the rest of our lives. Some
                                aspects of our language abilities, such as our knowledge of word meanings, _ <motion.div
                                    class="inline-block" :custom="0.25" initial="hidden"
                                    :animate="isLoaded ? 'visible' : 'hidden'" :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="31"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">31</span>
                                        ________ <span class="absolute inset-0" data-blank="31"></span> </span>
                                </motion.div> _ improve during middle and late adulthood. One study, for example, found
                                that adults over sixty had an average vocabulary size of over 21,000 words. The
                                researchers also studied a _ <motion.div class="inline-block" :custom="0.25"
                                    initial="hidden" :animate="isLoaded ? 'visible' : 'hidden'"
                                    :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="32"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">32</span>
                                        ________ <span class="absolute inset-0" data-blank="32"></span> </span>
                                </motion.div> _ of college students and found that their average vocabulary contained _
                                <motion.div class="inline-block" :custom="0.25" initial="hidden"
                                    :animate="isLoaded ? 'visible' : 'hidden'" :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="33"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">33</span>
                                        ________ <span class="absolute inset-0" data-blank="33"></span> </span>
                                </motion.div> _ 16,000 words. In another study, older adults, with an average age of 75,
                                _ <motion.div class="inline-block" :custom="0.25" initial="hidden"
                                    :animate="isLoaded ? 'visible' : 'hidden'" :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="34"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">34</span>
                                        ________ <span class="absolute inset-0" data-blank="34"></span> </span>
                                </motion.div> _ better than participants in their youth or middle years on tasks that
                                required them to determine the meaning of words. Thus, language seems to be a skill
                                that, contrary to what many might _ <motion.div class="inline-block" :custom="0.25"
                                    initial="hidden" :animate="isLoaded ? 'visible' : 'hidden'"
                                    :variants="fallVariants"> <span
                                        class="inline-block relative border-b-2 border-gray-400 px-1 mx-1 min-w-[80px] cursor-pointer"
                                        data-blank="35"> <span
                                            class="blank-number absolute -top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">35</span>
                                        ________ <span class="absolute inset-0" data-blank="35"></span> </span>
                                </motion.div> _, does not weaken with age.
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
        <div class="cut "></div>
        <div class="flex right">
            <div class="w-[50vw] h-screen flex items-center justify-center bg-[#e1f6f9] overflow-hidden">
                <slot></slot>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    height: 100vh;
}

.cut {
    background: #e1f6f9;
    border-left: 1px solid #bbdbf9;
    border-right: 1px solid #e1f6f9;
    height: 100vh;
    margin-right: -5px;
    position: absolute;
    left: 50%;
    width: 69px;
    z-index: 1;
}

.cut::after {
    background: linear-gradient(to bottom, #f0f9ff, #faf5ff);
    border-radius: 0;
    clip-path: polygon(0 0, 98% 0, 21% 50%, 69% 48%, 0 105%);
    content: "";
    height: 100%;
    margin-right: 2px;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateZ(0);
    width: 100%;
    z-index: 1;
}

@keyframes wave {
    from {
        transform: rotate(0deg);
    }

    from {
        transform: rotate(360deg);
    }
}
</style>