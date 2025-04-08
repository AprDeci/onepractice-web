<script setup lang="ts">

</script>

<template>
    <div class="flex-col w-full flex gap-3 py-4 px-2 justify-center items-center">
        <!-- <div>Difficulty Rating</div> -->
        <div>
            <span class="text-xs text-gray-500">easy</span>
            <div class="rating rating-lg rating-half mr-1">
                <input type="radio" name="rating-11" class="rating-hidden" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-primary"
                    aria-label="0.5 star" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-primary"
                    aria-label="1 star" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-primary"
                    aria-label="1.5 star" checked="checked" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-primary"
                    aria-label="2 star" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-primary"
                    aria-label="2.5 star" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-primary"
                    aria-label="3 star" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-primary"
                    aria-label="3.5 star" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-primary"
                    aria-label="4 star" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-primary"
                    aria-label="4.5 star" />
                <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-primary"
                    aria-label="5 star" />
            </div>
            <span class="text-xs text-gray-500">no easy</span>
        </div>
        <div class="text-xs text-gray-500">评分只能打一次,请认真打出你认为的难度</div>
    </div>
</template>