<template>
  <v-card dark color="primary">
    <header class="">
      <h1>{{ title }}</h1>
      <h3>{{ subtitle }}</h3>
    </header>
  </v-card>
</template>

<script setup lang="ts">
defineProps(["title", "subtitle"]); //Taking in the props defined in App.vue
</script>

<style scoped>
header {
  width: 100%;
  height: 7rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

header h1 {
  color: #ffffff;
  margin: 0;
}

header h3 {
  color: #d6d2de;
  margin: 0;
}
</style>
