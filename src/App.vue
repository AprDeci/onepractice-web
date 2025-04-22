<script setup lang="ts">
import { onMounted } from 'vue'
import { useAlert } from './common/alert';
const { alertRef } = useAlert()
import Alert from './components/common/alert.vue'

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
  <Alert ref="alertRef" />

</template>

<style scoped></style>
