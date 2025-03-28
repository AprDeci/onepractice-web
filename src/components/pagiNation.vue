<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    total: {
        type: Number,
        required: true
    },
    pageSize: {
        type: Number,
        required: true,
        default: 10
    },
    initialPage: {
        type: Number,
        default: 1
    },
    maxVisiblePages: {
        type: Number,
        default: 5
    }
});

const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

const emit = defineEmits(['page-change']);

const currentPage = ref(props.initialPage);

// Watch for changes to initialPage prop
watch(() => props.initialPage, (newValue) => {
    currentPage.value = newValue;
});

const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    emit('page-change', page);
};

// Calculate which page numbers to show
const visiblePageNumbers = computed(() => {
    if (totalPages.value <= props.maxVisiblePages) {
        // If we have fewer pages than the max visible, show all pages
        return Array.from({ length: totalPages.value }, (_, i) => i + 1);
    }

    // Calculate the range of pages to show
    const halfVisible = Math.floor(props.maxVisiblePages / 2);
    let start = currentPage.value - halfVisible;
    let end = currentPage.value + halfVisible;

    // Adjust if we're near the beginning or end
    if (start < 1) {
        end = Math.min(totalPages.value, end + (1 - start));
        start = 1;
    }

    if (end > totalPages.value) {
        start = Math.max(1, start - (end - totalPages.value));
        end = totalPages.value;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// Determine if we need to show ellipsis and first/last buttons
const showLeftEllipsis = computed(() => {
    return visiblePageNumbers.value[0] > 1;
});

const showRightEllipsis = computed(() => {
    return visiblePageNumbers.value[visiblePageNumbers.value.length - 1] < totalPages.value;
});

const showFirstButton = computed(() => {
    return visiblePageNumbers.value[0] > 1;
});

const showLastButton = computed(() => {
    return visiblePageNumbers.value[visiblePageNumbers.value.length - 1] < totalPages.value;
});
</script>
<template>
    <div class="flex justify-center my-4">
        <div class="join">
            <!-- Previous button -->
            <button class="join-item btn" :class="{ 'btn-disabled': currentPage === 1 }"
                @click="changePage(currentPage - 1)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="w-5 h-5">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>

            <!-- First page -->
            <button v-if="showFirstButton" class="join-item btn" :class="{ 'btn-active': currentPage === 1 }"
                @click="changePage(1)">
                1
            </button>

            <!-- Ellipsis after first page -->
            <button v-if="showLeftEllipsis" class="join-item btn btn-disabled">...</button>

            <!-- Page numbers -->
            <button v-for="page in visiblePageNumbers" :key="page" class="join-item btn hidden sm:flex"
                :class="{ 'btn-active': currentPage === page }" @click="changePage(page)">
                {{ page }}
            </button>

            <!-- Ellipsis before last page -->
            <button v-if="showRightEllipsis" class="join-item btn btn-disabled">...</button>

            <!-- Last page -->
            <button v-if="showLastButton && totalPages.value > 1" class="join-item btn"
                :class="{ 'btn-active': currentPage === totalPages.value }" @click="changePage(totalPages.value)">
                {{ totalPages.value }}
            </button>

            <!-- Next button -->
            <button class="join-item btn" :class="{ 'btn-disabled': currentPage === totalPages.value }"
                @click="changePage(currentPage + 1)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="w-5 h-5">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>
        </div>
    </div>
</template>
