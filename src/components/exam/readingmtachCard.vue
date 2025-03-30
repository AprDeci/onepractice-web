<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { XIcon, ChevronDownIcon } from 'lucide-vue-next'
import question from '../../assets/example/matching.json'

interface ParagraphMatchingQuestion {
    content: {
        title: string
        paragraphs: Record<string, string>
    }
    items: {
        id: number
        content: string
    }[]
}

// Sample question data
// const question = ref<ParagraphMatchingQuestion>({
//     content: {
//         title: "Why it's wrong to look at work-life balance as an achievement",
//         paragraphs: {
//             "A": "Few topics have been so endlessly analysed as work-life balance. The quest to attain this mysterious state has dominated discussion around careers for years—especially for working parents. The concept is often presented as something to achieve, or a goal to reach. And once you''ve reached it, congratulations: you''ve made it; you''re a successful human being of the 21st century.",
//             "B": "But the problem is that we often tell ourselves: \"I''m going to put in eight hours'' worth of work, and then I''m going to put in eight hours'' worth of ''me time'', which will include my family, my hobbies, my workout, my everything,\" says Anat Lechner, clinical associate professor of management at New York University. \"I don''t think it''s such a simple formula.\"",
//             "C": "And, according to new findings, it may not be. Some researchers are now encouraging us to stop thinking about work-life balance as an achievement that you either hit or don''t. Instead, they suggest it may be more of a lifelong process—a continuous, never-ending exercise that requires self-awareness and timely adjustments. Researchers Ioana Lupu and Mayra Ruiz-Castro argue that work-life balance is \"a cycle, not an achievement\".",
//             "D": "Although it sounds like the respondents had a lot in common, here''s what separated them: about 30% of the men and 50% of the women reported resisting working long hours. The other respondents, meanwhile, all worked long hours because they thought that''s what successful professionals should do.",
//             "E": "Lupu and Ruiz-Castro looked at those who rejected the long hours and they found that those workers actually had strikingly similar strategies for maintaining their work-life balance. They had a tendency to reflect and question assumptions in the name of self-awareness and regularly took steps to adjust the things standing in their way to work-life balance.",
//             "F": "Lupu and Ruiz-Castro identified five steps that the respondents in the study who had better work-life balance used in their jobs. First, they paused and reconsidered beliefs such as \"I''m a professional, so I should work, work, work\", and asked themselves questions like, \"What''s currently causing me stress?\" Second, after identifying the cause, they zeroed in on their resultant emotions. Did they feel angry, sad, energised? Third, they reprioritised, asking \"Is working long hours really worth cutting back on family time?\", for example. Fourth, they considered their alternatives: is there anything at work that could be changed to accommodate these new priorities? And finally, they implemented changes, like asking their supervisor for greater flexibility, or deciding not to take on every project that comes their way.",
//             "G": "This five-step process is something anyone can adopt. Going through the steps, and constantly checking in with yourself, can help you shift and adapt your professional life to something that will better harmonise with your personal one. \"Awareness of your emotional state is essential in order to determine the changes you want to make in your work and in your life,\" says Lupu.",
//             "H": "New York University''s Lechner agrees that finding that balance is an ongoing pursuit. It''s not simply about dividing up the hours in your day between work, the gym, kids and chores. If the underlying emotional sources of stress are still there, then the time you actually spend at home may not be enjoyable. \"We come home and even though physically we are there, mentally we still may be processing things that happened at work. We''re not present,\" she says. What we call \"work-life balance\" is actually just a substitute to having a sense of fulfillment and contentment.",
//             "I": "Of course, finding that balance probably shouldn''t be something you have to do by yourself. Research by Erin Kelly, professor of work and organisation studies at MIT, shows companies and managers can play a key role in creating a better environment for workers. For her book Overload: How Good Jobs Went Bad and What to Do about It, she and co-author Phyllis Moen split more than 1,000 employees at a Fortune 500 company into two groups, one that worked under a management redesign and one that continued working within the existing management structure.",
//             "J": "Under the management redesign, many steps were taken to ensure better work-life balance and prevent burnout (精疲力竭). Managers were regularly reminded to explicitly support their employees. Workers were allowed to make changes, like cancelling 9 am meetings. All of this was done in the name of increasing job satisfaction and giving workers greater flexibility, and to assure workers that it was something management was committed to. Unsurprisingly, Kelly and Moen found that employees in the redesign group reported less stress and less burnout. They were less likely to quit their jobs; indeed, over the next four years, they were 40% less likely to quit than those who kept working under the old policies.",
//             "K": "\"Work-life balance is understood to be an individual''s response, so people think ''it''s up to me to manage the craziness of my work life\", says Kelly. But organisations need to examine the demands they''re placing on employees. \"The root problem is not how the two pieces of work and life come together. It''s that we have unrealistic expectations of what we''re asked to do on the work side.\" If your workplace isn''t an environment where work-life balance is possible in the first place, any effort you attempt to make toward it on a personal level will be in vain.",
//             "L": "That''s a conversation that appears to be gathering pace. The new prevalence of remote and flexible working models will likely all play important roles in how we balance our professional and personal lives. And if it seems like finding that perfect balance remains difficult to achieve, the experts say that keeping some perspective can help. For millions of people, work is about being able to put food on the table. Talking about work-life balance \"is a very privileged conversation\", says Lechner. \"If we''re reflecting, maybe we should also reflect on that.\""
//         }
//     },
//     items: [
//         {
//             id: 36,
//             content: "According to a management expert, work-life balance is not as simple as giving equal amounts of time to work and personal life."
//         },
//         {
//             id: 37,
//             content: "Research found that those who are given greater flexibility at work are less stressed and more likely to stay in their jobs."
//         },
//         {
//             id: 38,
//             content: "Workers who rejected working long hours tended to make regular adjustments in order to achieve work-life balance."
//         },
//         {
//             id: 39,
//             content: "Talking about work-life balance is said to be a privilege reserved for the better-off, not for those who barely make a living."
//         },
//         {
//             id: 40,
//             content: "Knowing one''s emotional state is of utmost importance in deciding what changes to make for a better work-life balance."
//         },
//         {
//             id: 41,
//             content: "More female professionals reported being reluctant to work overtime than their male counterparts."
//         },
//         {
//             id: 42,
//             content: "Without organisational support, any personal effort to maintain work-life balance will be unsuccessful."
//         },
//         {
//             id: 43,
//             content: "The question of how to achieve work-life balance has long been the main subject of discussion among workers."
//         },
//         {
//             id: 44,
//             content: "You may not actually experience emotional wellbeing at home if you remain occupied with what happened at work."
//         },
//         {
//             id: 45,
//             content: "Some researchers suggest that work-life balance is not a goal to achieve, but a process for life to be adjusted promptly."
//         }
//     ]
// })

// State for selections
const selections = ref<Record<number, string>>({})
const currentItem = ref<number | null>(null)
const highlightedParagraph = ref<string | null>(null)
const searchText = ref('')

// Toggle dropdown for an item
const toggleDropdown = (itemId: number) => {
    if (currentItem.value === itemId) {
        currentItem.value = null
        highlightedParagraph.value = null
    } else {
        currentItem.value = itemId
        highlightedParagraph.value = selections.value[itemId] || null
    }
}

// Select a paragraph for an item
const selectParagraph = (itemId: number, paragraphKey: string) => {
    selections.value[itemId] = paragraphKey
    currentItem.value = null
    highlightedParagraph.value = null
}

// Clear a selection
const clearSelection = (itemId: number) => {
    delete selections.value[itemId]
    currentItem.value = null
    highlightedParagraph.value = null
}

// Check if a paragraph is selected for any item
const isParagraphSelected = (paragraphKey: string) => {
    return Object.values(selections.value).includes(paragraphKey)
}

// Check if a paragraph is used by another item
const isParagraphUsedElsewhere = (paragraphKey: string, currentItemId: number) => {
    for (const [itemId, selectedParagraph] of Object.entries(selections.value)) {
        if (Number(itemId) !== currentItemId && selectedParagraph === paragraphKey) {
            return true
        }
    }
    return false
}

// Get all items that selected a specific paragraph
const getParagraphSelections = (paragraphKey: string) => {
    return Object.entries(selections.value)
        .filter(([_, selectedParagraph]) => selectedParagraph === paragraphKey)
        .map(([itemId, _]) => Number(itemId))
}

// Truncate paragraph for dropdown display
const truncateParagraph = (text: string) => {
    return text.length > 30 ? text.substring(0, 30) + '...' : text
}

// Highlight search text in paragraphs
const highlightSearchText = (text: string) => {
    if (!searchText.value) return text

    const regex = new RegExp(`(${searchText.value})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>')
}

// Watch for changes in currentItem to update highlighted paragraph
watch(currentItem, (newValue) => {
    if (newValue === null) {
        highlightedParagraph.value = null
    } else {
        highlightedParagraph.value = selections.value[newValue] || null
    }
})
</script>


<template>
    <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Paragraph Matching</h2>
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-700 font-medium">Match each statement with the correct paragraph from the
                article.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <!-- Article section (3 columns on large screens) -->
            <div class="lg:col-span-3 order-1 lg:order-1">
                <h3 class="text-xl font-bold mb-4">{{ question.content.title }}</h3>
                <div class="sticky top-4">
                    <div class="colheightcontainer space-y-4  overflow-y-auto pr-2 article-container">
                        <div v-for="(paragraph, key) in question.content.paragraphs" :key="key"
                            class="p-2 lg:p-4 rounded-lg transition-all duration-200" :class="{
                                'bg-white border shadow-sm': true,
                                'border-blue-300 bg-blue-50': highlightedParagraph === key,
                                'border-green-300 bg-green-50': isParagraphSelected(key)
                            }">
                            <div class="flex items-start">
                                <span
                                    class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 font-bold text-sm mr-2 lg:mr-3 mt-1 flex-shrink-0"
                                    :class="{
                                        'bg-blue-200': highlightedParagraph === key,
                                        'bg-green-200': isParagraphSelected(key)
                                    }">
                                    {{ key }}
                                </span>
                                <p class="text-gray-700 leading-relaxed" v-html="highlightSearchText(paragraph)"></p>
                            </div>

                            <div v-if="isParagraphSelected(key)" class="mt-3 pl-9">
                                <div v-for="itemId in getParagraphSelections(key)" :key="itemId"
                                    class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded mr-2 lg:mr-3 mb-2">
                                    Question {{ itemId }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Questions section (2 columns on large screens) -->
            <div class="lg:col-span-2 order-2 lg:order-2">
                <div class="sticky top-4">
                    <h3 class="text-lg font-bold mb-4">Statements</h3>
                    <div class="colheightcontainer space-y-4  overflow-y-auto">
                        <div v-for="item in question.items" :key="item.id"
                            class="p-2 lg:p-4 bg-white border rounded-lg shadow-sm" :class="{
                                'border-blue-300': currentItem === item.id,
                                'border-green-300 bg-green-50': selections[item.id]
                            }">
                            <div class="flex items-start mb-3">
                                <span
                                    class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 font-bold text-sm mr-2 flex-shrink-0">
                                    {{ item.id }}
                                </span>
                                <p class="text-gray-700">{{ item.content }}</p>
                            </div>

                            <div class="pl-9">
                                <div class="flex items-center">
                                    <span class="text-sm text-gray-500 mr-2">Select paragraph:</span>
                                    <div class="relative">
                                        <button @click="toggleDropdown(item.id)"
                                            class="inline-flex items-center justify-between w-24 px-3 py-2 text-sm border rounded-md bg-white"
                                            :class="{
                                                'border-blue-300 ring-2 ring-blue-100': currentItem === item.id,
                                                'border-green-300 bg-green-50': selections[item.id]
                                            }">
                                            <span>{{ selections[item.id] || 'Select' }}</span>
                                            <ChevronDownIcon class="h-4 w-4 ml-1" />
                                        </button>

                                        <div v-if="currentItem === item.id"
                                            class="absolute z-10 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                                            <button v-if="selections[item.id]" @click="clearSelection(item.id)"
                                                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                Clear selection
                                            </button>

                                            <button v-for="(_, paragraphKey) in question.content.paragraphs"
                                                :key="paragraphKey" @click="selectParagraph(item.id, paragraphKey)"
                                                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                                :class="{
                                                    'font-medium': selections[item.id] === paragraphKey,
                                                    'text-gray-400': isParagraphUsedElsewhere(paragraphKey, item.id)
                                                }">
                                                <span
                                                    class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-gray-700 text-xs mr-2"
                                                    :class="{
                                                        'bg-green-200': selections[item.id] === paragraphKey
                                                    }">
                                                    {{ paragraphKey }}
                                                </span>
                                                <span class="truncate">
                                                    {{ truncateParagraph(question.content.paragraphs[paragraphKey]) }}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.article-container {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

.article-container::-webkit-scrollbar {
    width: 6px;
}

.article-container::-webkit-scrollbar-track {
    background: #f7fafc;
}

.article-container::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
}

.colheightcontainer {
    max-height: 80vh;
}
</style>
