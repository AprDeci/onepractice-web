<script setup lang="ts">
import json from "../assets/testjson.json"
const str = JSON.stringify(json)
import { userecordStore } from "../store/recordStore";
const recordstore = userecordStore()
</script>

<template>
    <div>
        <div class="btn-primary btn" @click="delete recordstore.records[1]">123213</div>
    </div>
</template>