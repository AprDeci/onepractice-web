<script setup lang="ts">
import { onMounted } from 'vue'
import { themeChange } from 'theme-change'

onMounted(() => {
  if (localStorage.getItem('isdark') === 'true') {
    document.querySelector('html').setAttribute('data-theme', "dim");
  }
})
</script>

<template>
  <div class="app">
    <RouterView></RouterView>
  </div>

</template>

<style scoped></style>
