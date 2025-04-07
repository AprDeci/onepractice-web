<script setup lang="ts">
import json from "../assets/testjson.json"
const str = JSON.stringify(json)
</script>

<template>
    <div>
        {{ JSON.parse(str) }}
    </div>
</template>