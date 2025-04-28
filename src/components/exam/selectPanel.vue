<script setup lang="ts">
import { Bookmark } from 'lucide-vue-next';
const emit = defineEmits(['mark'])
</script>

<template>
    <div class="markpanel">
        <div class="flex card bg-base-200">
            <div class="btn btn-sm btn-primary" @click="emit('mark')">
                <Bookmark />
            </div>
        </div>
    </div>
</template>