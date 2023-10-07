<template>
  <v-app>
    <v-main>
      <v-container>
        <TheHeader :title="appTitle" :subtitle="appSubtitle" />
        <v-divider class="my-4" />
        <UserList />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TheHeader from "./components/layouts/TheHeader.vue";
import UserList from "./components/UserList.vue";

const appTitle = ref("Users Galore");
const appSubtitle = ref("For when you crave making logins");
</script>

<!-- Remember, this is a global style! -->
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}
</style>
