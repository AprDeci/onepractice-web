<script setup lang="ts">
import { onMounted } from 'vue'
import { useAlert } from './common/alert';
const { alertRef } = useAlert()
import Alert from './components/common/alert.vue'

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (localStorage.getItem('isdark') === 'true' || prefersDark.matches) {
    document.querySelector('html').setAttribute('data-theme', "dim");
  }
})
</script>

<template>
  <div class="app">
    <RouterView></RouterView>
  </div>
  <Alert ref="alertRef" />

</template>

<style scoped></style>
